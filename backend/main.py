"""
Arbache LP - Backend API
FastAPI backend para chat com Perplexity + Claude/OpenAI

MCP Guardrails Applied:
- Network allowlist
- Timeout + Retry + Backoff
- Structured logging with request_id
- Input/Output validation with Pydantic
- No PII in logs
"""

import os
import re
import uuid
import json
import asyncio
import time
from typing import Optional, Any
from datetime import datetime
from contextlib import asynccontextmanager
from functools import wraps
from collections import defaultdict

import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator, ConfigDict
from dotenv import load_dotenv

load_dotenv()

# ===================================
# CONFIGURAÇÃO
# ===================================

class Config:
    """Configuração centralizada - não expõe secrets diretamente."""

    # API Keys (carregadas uma vez)
    _perplexity_key: Optional[str] = None
    _anthropic_key: Optional[str] = None
    _openai_key: Optional[str] = None
    _initialized: bool = False

    @classmethod
    def initialize(cls) -> None:
        """Carrega secrets uma vez no startup."""
        if cls._initialized:
            return
        cls._perplexity_key = os.getenv("PERPLEXITY_API_KEY")
        cls._anthropic_key = os.getenv("ANTHROPIC_API_KEY")
        cls._openai_key = os.getenv("OPENAI_API_KEY")
        cls._initialized = True

    @classmethod
    def has_perplexity(cls) -> bool:
        return bool(cls._perplexity_key)

    @classmethod
    def has_anthropic(cls) -> bool:
        return bool(cls._anthropic_key)

    @classmethod
    def has_openai(cls) -> bool:
        return bool(cls._openai_key)

    @classmethod
    def get_perplexity_headers(cls) -> dict:
        if not cls._perplexity_key:
            raise ValueError("Perplexity not configured")
        return {
            "Authorization": f"Bearer {cls._perplexity_key}",
            "Content-Type": "application/json",
        }

    @classmethod
    def get_anthropic_headers(cls) -> dict:
        if not cls._anthropic_key:
            raise ValueError("Anthropic not configured")
        return {
            "x-api-key": cls._anthropic_key,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
        }

    @classmethod
    def get_openai_headers(cls) -> dict:
        if not cls._openai_key:
            raise ValueError("OpenAI not configured")
        return {
            "Authorization": f"Bearer {cls._openai_key}",
            "Content-Type": "application/json",
        }


# ===================================
# NETWORK ALLOWLIST
# ===================================

ALLOWED_HOSTS = [
    "api.perplexity.ai",
    "api.anthropic.com",
    "api.openai.com",
]

ALLOWED_PATHS = [
    "/chat/completions",
    "/v1/messages",
    "/v1/chat/completions",
]


def validate_url(url: str) -> bool:
    """Valida URL contra allowlist."""
    try:
        from urllib.parse import urlparse
        parsed = urlparse(url)
        host_allowed = parsed.netloc in ALLOWED_HOSTS
        path_allowed = any(parsed.path.startswith(p) or parsed.path == p for p in ALLOWED_PATHS)
        return host_allowed and path_allowed
    except Exception:
        return False


# ===================================
# RESILIÊNCIA
# ===================================

TIMEOUT_MS = 30000  # 30 segundos
MAX_RETRIES = 3
BACKOFF_BASE_MS = 1000


# ===================================
# STRUCTURED LOGGING
# ===================================

def secure_log(
    level: str,
    message: str,
    request_id: str,
    **meta: Any
) -> None:
    """
    Log estruturado sem PII/secrets.

    Args:
        level: info, warn, error
        message: Mensagem do log
        request_id: ID único da requisição
        **meta: Metadados adicionais
    """
    # Sanitiza metadados - remove possíveis secrets
    sanitized = {k: v for k, v in meta.items() if k not in [
        "authorization", "api_key", "apiKey", "token", "password", "secret"
    ]}

    log_entry = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "level": level,
        "message": message,
        "request_id": request_id,
        **sanitized
    }

    print(json.dumps(log_entry))


# ===================================
# SECURE HTTP CLIENT
# ===================================

async def secure_fetch(
    url: str,
    request_id: str,
    method: str = "POST",
    headers: Optional[dict] = None,
    json_data: Optional[dict] = None,
    retries: int = MAX_RETRIES
) -> Optional[dict]:
    """
    Fetch seguro com:
    - Validação de URL contra allowlist
    - Timeout
    - Retry com backoff exponencial
    - Logging estruturado
    """
    # Validar URL contra allowlist
    if not validate_url(url):
        secure_log("error", "URL not in allowlist", request_id, url=url)
        raise ValueError(f"URL not in allowlist: {url}")

    timeout = httpx.Timeout(TIMEOUT_MS / 1000)

    for attempt in range(retries):
        try:
            secure_log("info", "HTTP request starting", request_id,
                      url=url, attempt=attempt + 1, max_retries=retries)

            async with httpx.AsyncClient(timeout=timeout) as client:
                if method == "POST":
                    response = await client.post(url, headers=headers, json=json_data)
                else:
                    response = await client.get(url, headers=headers)

                if response.status_code == 200:
                    secure_log("info", "HTTP request successful", request_id,
                              status_code=response.status_code)
                    return response.json()

                secure_log("warn", "HTTP request failed", request_id,
                          status_code=response.status_code, attempt=attempt + 1)

                # Não fazer retry em erros 4xx (exceto 429)
                if 400 <= response.status_code < 500 and response.status_code != 429:
                    return None

        except httpx.TimeoutException:
            secure_log("warn", "HTTP request timeout", request_id, attempt=attempt + 1)
        except Exception as e:
            secure_log("error", "HTTP request error", request_id,
                      error=str(e), attempt=attempt + 1)

        # Backoff exponencial
        if attempt < retries - 1:
            backoff = (BACKOFF_BASE_MS * (2 ** attempt)) / 1000
            secure_log("info", "Retrying with backoff", request_id,
                      backoff_seconds=backoff, next_attempt=attempt + 2)
            await asyncio.sleep(backoff)

    secure_log("error", "All retries exhausted", request_id, total_attempts=retries)
    return None


# ===================================
# CONTEXTO ARBACHE
# ===================================

ARBACHE_CONTEXT = """
## Sobre a Arbache Consulting

A Arbache Consulting é uma consultoria especializada em soluções integradas para organizações que buscam excelência em educação corporativa, liderança e sustentabilidade.

### Fundadora - Ana Paula Arbache

Ana Paula Arbache é a fundadora e CEO da Arbache Consulting. Especialista em:
- Educação Corporativa
- Liderança e Desenvolvimento de Pessoas
- Sustentabilidade e ESG
- Transformação Digital e IA aplicada a RH

### Serviços Oferecidos

1. **Trilhas e Programas Educacionais** - Programas personalizados e master classes
2. **Curadoria de Produtos e Certificações** - Infoprodutos e certificações
3. **Formação de Lideranças** - ESG, liderança feminina, gestão de equipes
4. **Assessment Soft Skills + IA** - Mapeamento de competências com IA
5. **Senior Advisor Sustentabilidade e ESG** - Consultoria estratégica
6. **Mentoria de Alto Impacto** - Carreira, ESG, IA, Tecnologia e RH
7. **Auditorias e Relatórios Técnicos** - ESG, Sustentabilidade, Educação
8. **Missões e Imersões Técnicas** - Nacionais e internacionais
9. **Redes e Networking** - Gestão de redes e eventos
10. **Processos de RH e Gestão** - Gestão de Pessoas
11. **Palestras e Painéis** - Corporativas, mesas redondas, roundtables

### Ecossistema

- **ICONS.AI** - Soluções em Inteligência Artificial
- **Co.Labs** - Laboratório de inovação e colaboração
- **Arbache e-Learning** - Plataforma de educação digital
"""

ALLOWED_TOPICS = [
    "ana paula arbache", "arbache consulting", "arbache", "consultoria",
    "educação corporativa", "liderança", "sustentabilidade", "esg",
    "trilhas", "programas educacionais", "curadoria", "certificações",
    "formação", "assessment", "soft skills", "senior advisor",
    "mentoria", "auditoria", "relatórios técnicos", "missões",
    "imersões", "networking", "redes", "processos rh", "gestão de pessoas",
    "palestras", "painéis", "ecossistema", "icons.ai", "icons ai",
    "colabs", "co.labs", "e-learning", "parceiros", "serviços",
    "treinamento", "desenvolvimento", "coaching", "capacitação",
]

CURATOR_SYSTEM_PROMPT = f"""Você é um assistente da Arbache Consulting, uma consultoria especializada em educação corporativa, liderança e sustentabilidade.

REGRAS OBRIGATÓRIAS:
1. Responda APENAS sobre a Arbache Consulting, Ana Paula Arbache, seus serviços e parceiros
2. NUNCA mencione fontes externas, links, referências ou citações
3. NUNCA use frases como "De acordo com...", "Segundo...", "Fonte:", "[1]", "[2]", etc.
4. NUNCA mencione Perplexity, Google, Wikipedia ou qualquer outra fonte
5. Responda de forma natural, como se você fosse o assistente oficial da empresa
6. Se a pergunta estiver fora do escopo, educadamente redirecione para os serviços da Arbache
7. Mantenha um tom profissional, amigável e prestativo
8. Respostas devem ser concisas (máximo 3-4 parágrafos)
9. Use português brasileiro

CONTEXTO DA EMPRESA:
{ARBACHE_CONTEXT}

IMPORTANTE: Sua resposta deve parecer vir diretamente da Arbache Consulting, sem nenhuma indicação de pesquisa externa."""


# ===================================
# SCHEMAS (Pydantic) - STRICT MODE
# ===================================

class ChatRequestV1(BaseModel):
    """Request para endpoint de chat - v1."""
    model_config = ConfigDict(strict=True, extra='forbid')

    message: str = Field(..., min_length=1, max_length=2000)
    section: Optional[str] = Field(None, max_length=50)
    sectionContext: Optional[str] = Field(None, max_length=200)

    @field_validator('message')
    @classmethod
    def normalize_message(cls, v: str) -> str:
        return v.strip()


class ChatResponseV1(BaseModel):
    """Response do endpoint de chat - v1."""
    model_config = ConfigDict(strict=True)

    response: str
    request_id: str


class HealthResponseV1(BaseModel):
    """Response do health check - v1."""
    model_config = ConfigDict(strict=True)

    status: str
    version: str
    services: dict[str, bool]


class VersionResponseV1(BaseModel):
    """Response do endpoint /version - v1."""
    model_config = ConfigDict(strict=True)

    sha: str
    version: str
    service: str
    timestamp: str


# --- V2 Schemas ---

class ConversationMessage(BaseModel):
    role: str = Field(..., pattern=r'^(user|assistant)$')
    content: str = Field(..., max_length=2000)


class ChatRequestV2(BaseModel):
    """Request para endpoint de chat - v2."""
    model_config = ConfigDict(strict=True, extra='forbid')

    message: str = Field(..., min_length=1, max_length=2000)
    section: Optional[str] = Field(None, max_length=50)
    sectionContext: Optional[str] = Field(None, max_length=500)
    conversationHistory: Optional[list[ConversationMessage]] = Field(None)

    @field_validator('message')
    @classmethod
    def normalize_message(cls, v: str) -> str:
        return v.strip()

    @field_validator('conversationHistory')
    @classmethod
    def limit_history(cls, v: Optional[list[ConversationMessage]]) -> Optional[list[ConversationMessage]]:
        if v and len(v) > 6:
            return v[-6:]
        return v


class ChatResponseV2(BaseModel):
    """Response do endpoint de chat - v2."""
    model_config = ConfigDict(strict=True)

    response: str
    badges: list[str]
    suggestions: list[str]
    request_id: str


# ===================================
# V2 SECTION CONTENT (server-side mirror)
# ===================================

SECTION_CONTENT_V2: dict[str, dict] = {
    'hero': {
        'summary': 'A Arbache Consulting transforma organizações por meio da educação de liderança, inovação e sustentabilidade.',
        'badges': ['Educação Corporativa', 'Liderança', 'ESG', 'Inovação'],
        'suggestions': [
            'O que a Arbache Consulting faz?',
            'Quem é Ana Paula Arbache?',
            'Quais serviços vocês oferecem?',
        ],
    },
    'proposito': {
        'summary': 'Nosso propósito é transformar o mundo por meio da educação, com excelência, ética e valores.',
        'badges': ['Missão', 'Visão', 'Valores', 'Excelência'],
        'suggestions': [
            'Qual a missão da Arbache?',
            'Quais são os valores da empresa?',
            'O que diferencia a Arbache?',
        ],
    },
    'quem-somos': {
        'summary': 'Equipe de especialistas em educação corporativa, tecnologia e sustentabilidade.',
        'badges': ['Ana Paula Arbache', 'Fernando Arbache', 'Alexandre Vieira', 'Fernando Bastos'],
        'suggestions': [
            'Qual a formação da Ana Paula?',
            'Quem são os especialistas?',
            'Quais áreas de expertise?',
        ],
    },
    'nosso-ecossistema': {
        'summary': 'Seis pilares integrados: Educação, Liderança, Carreira, RH, IA e ESG.',
        'badges': ['Educação Corporativa', 'Liderança', 'Gestão de Carreira', 'RH', 'Inovação e IA', 'ESG'],
        'suggestions': [
            'Quais são os pilares do ecossistema?',
            'Qual pilar é ideal para minha empresa?',
            'Como a IA se integra?',
        ],
    },
    'solucoes-org': {
        'summary': '11 soluções integradas em educação, liderança, assessment, mentoria e consultoria.',
        'badges': ['Trilhas Educacionais', 'Assessment IA', 'Mentoria', 'Formação de Lideranças', 'Palestras'],
        'suggestions': [
            'Como funcionam as trilhas?',
            'O que é o Assessment com IA?',
            'Quais tipos de mentoria?',
        ],
    },
    'colabs': {
        'summary': 'Laboratório de inovação com parceiros como MIT, Senac e Resorts Brasil.',
        'badges': ['Resorts Brasil', 'MIT', 'Senac', 'Escola de Etiqueta', 'Hotelier News'],
        'suggestions': [
            'Quem são os parceiros?',
            'Como funciona o Co.Labs?',
            'Como se tornar parceiro?',
        ],
    },
    'esg': {
        'summary': 'Referência em ESG com HubMulher, Knowledge Hub e reconhecimento SDG Pioneer da ONU.',
        'badges': ['HubMulher', 'Knowledge Hub', 'SDG Pioneer', 'Sustentabilidade'],
        'suggestions': [
            'O que é o HubMulher?',
            'Qual o papel nos ODS da ONU?',
            'Como atuam em sustentabilidade?',
        ],
    },
    'contato': {
        'summary': 'Entre em contato para saber mais sobre nossas soluções.',
        'badges': ['Fale Conosco', 'Agende uma Conversa'],
        'suggestions': [
            'Como agendar uma reunião?',
            'Quais soluções para minha empresa?',
            'Vocês atendem qual porte?',
        ],
    },
}


# ===================================
# V2 FAQ (instant responses)
# ===================================

FAQ_V2: dict[str, str] = {
    'o que a arbache faz':
        'A Arbache Consulting oferece soluções integradas em educação corporativa, liderança, ESG e sustentabilidade. Ajudamos organizações a desenvolver pessoas e gerar impacto positivo. Quer saber mais sobre alguma solução específica?',
    'quem é ana paula arbache':
        'Ana Paula Arbache é a fundadora e CEO da Arbache Consulting. PhD, SDG Pioneer reconhecida pela ONU, e especialista em educação corporativa, liderança e sustentabilidade com mais de duas décadas de experiência.',
    'como entrar em contato':
        'Você pode entrar em contato pelo formulário na seção Contato do nosso site. Nossa equipe retorna em até 24h úteis.',
    'quais serviços vocês oferecem':
        'Oferecemos 11 soluções integradas: Trilhas Educacionais, Curadoria, Formação de Lideranças, Assessment com IA, Consultoria ESG, Mentoria, Auditorias, Imersões, Networking, Gestão de RH e Palestras.',
    'o que é o hubmulher':
        'O HubMulher é uma iniciativa voltada para o empoderamento feminino e liderança da mulher no mercado de trabalho. Promovemos eventos, mentorias e conteúdos para fortalecer a presença feminina em posições de liderança.',
    'o que é o colabs':
        'O Co.Labs é o laboratório de inovação e colaboração da Arbache. Reunimos parceiros como MIT, Senac e Resorts Brasil para criar soluções de alto impacto em educação e liderança.',
    'qual a missão da arbache':
        'Nossa missão é transformar organizações e pessoas por meio da educação de excelência. Combinamos liderança, sustentabilidade e inovação para resultados extraordinários.',
    'como funciona o assessment com ia':
        'O Assessment de Soft Skills com IA mapeia competências comportamentais usando inteligência artificial. Oferece diagnósticos precisos e planos de desenvolvimento personalizados para equipes e líderes.',
    'como funcionam as trilhas educacionais':
        'As Trilhas Educacionais são programas personalizados de aprendizagem contínua com master classes, workshops práticos e acompanhamento para desenvolver competências alinhadas aos objetivos da sua organização.',
    'como agendar uma reunião':
        'Para agendar, preencha o formulário na seção Contato indicando a solução de interesse. Nossa equipe retorna em até 24h úteis para alinhar a melhor data.',
}


# ===================================
# V2 RATE LIMITING (in-memory)
# ===================================

RATE_LIMIT_WINDOW = 60  # seconds
RATE_LIMIT_MAX = 20  # requests per window
_rate_limit_store: dict[str, list[float]] = defaultdict(list)


def check_rate_limit(client_ip: str) -> bool:
    """Returns True if request is allowed, False if rate-limited."""
    now = time.time()
    window_start = now - RATE_LIMIT_WINDOW
    # Clean old entries
    _rate_limit_store[client_ip] = [
        t for t in _rate_limit_store[client_ip] if t > window_start
    ]
    if len(_rate_limit_store[client_ip]) >= RATE_LIMIT_MAX:
        return False
    _rate_limit_store[client_ip].append(now)
    return True


# ===================================
# V2 HELPERS
# ===================================

ELABORATE_KEYWORDS = [
    "como funciona", "explique", "compare", "mercado", "dados",
    "detalhe", "aprofunde", "pesquise", "tendência", "estratégia",
    "diferença entre", "por que", "exemplos de", "casos de",
]


def is_elaborate_question(message: str) -> bool:
    """Detecta se a pergunta requer pesquisa mais aprofundada."""
    lower = message.lower()
    if len(lower.split()) >= 10:
        return True
    return any(kw in lower for kw in ELABORATE_KEYWORDS)


def check_faq_v2(message: str) -> Optional[str]:
    """Tenta encontrar uma resposta FAQ."""
    lower = message.lower().strip()
    for key, answer in FAQ_V2.items():
        if key in lower or lower in key:
            return answer
    return None


def get_section_data_v2(section: Optional[str]) -> dict:
    """Retorna dados da seção ou fallback para hero."""
    return SECTION_CONTENT_V2.get(section or 'hero', SECTION_CONTENT_V2['hero'])


def truncate_response(text: str, max_lines: int = 5) -> str:
    """Trunca resposta para máximo de linhas."""
    lines = [l for l in text.split('\n') if l.strip()]
    if len(lines) <= max_lines:
        return text
    return '\n'.join(lines[:max_lines])


def generate_follow_up_suggestions(message: str, section: Optional[str]) -> list[str]:
    """Gera sugestões de follow-up baseadas na mensagem e seção."""
    section_data = get_section_data_v2(section)
    lower = message.lower()

    suggestions: list[str] = []

    # Se perguntou sobre serviços, sugere detalhes
    if any(w in lower for w in ['serviço', 'solução', 'oferecem', 'fazem']):
        suggestions = [
            'Como funcionam as trilhas educacionais?',
            'O que é o Assessment com IA?',
            'Como contratar uma mentoria?',
        ]
    # Se perguntou sobre a fundadora, sugere mais sobre a empresa
    elif any(w in lower for w in ['ana paula', 'fundadora', 'ceo']):
        suggestions = [
            'Quais são os serviços da Arbache?',
            'O que é o ecossistema Arbache?',
            'Como entrar em contato?',
        ]
    # Se perguntou sobre ESG
    elif any(w in lower for w in ['esg', 'sustentabilidade', 'ods', 'onu']):
        suggestions = [
            'O que é o HubMulher?',
            'Qual o papel nos ODS da ONU?',
            'Como a Arbache atua em ESG?',
        ]
    else:
        # Fallback: sugestões da seção atual
        suggestions = section_data.get('suggestions', SECTION_CONTENT_V2['hero']['suggestions'])

    return suggestions[:3]


# V2 system prompt — conversacional, humanizado, curto
CURATOR_SYSTEM_PROMPT_V2 = f"""Você é o assistente virtual da Arbache Consulting — um consultor real em conversa com um visitante do site.

REGRAS DE CONVERSAÇÃO:
1. Respostas CURTAS: máximo 2-3 frases. NUNCA despeje listas ou blocos de texto.
2. SEMPRE termine com uma PERGUNTA para manter o diálogo. Exemplos: "Qual área te interessa mais?", "Quer saber mais sobre isso?"
3. Para saudações (olá, oi, bom dia): responda com 1 frase calorosa + 1 pergunta. Exemplo: "Olá! Que bom ter você aqui. O que gostaria de saber sobre a Arbache?"
4. NUNCA liste todos os serviços de uma vez. Mencione 1-2 mais relevantes ao contexto e pergunte se quer saber mais.
5. Tom: humanizado, acolhedor, como um consultor real. Não robótico. Use linguagem natural.
6. Guie naturalmente o visitante para agendar uma conversa com a equipe quando fizer sentido.
7. NUNCA mencione fontes, referências, citações, URLs ou provedores de IA.
8. NUNCA use "[1]", "Segundo...", "De acordo com...", "Fonte:"
9. Use português brasileiro.
10. Se fora do escopo da Arbache, redirecione gentilmente em 1 frase.

CONTEXTO:
{ARBACHE_CONTEXT}"""


# Greeting detection
GREETINGS_V2 = ["olá", "oi", "bom dia", "boa tarde", "boa noite", "hello", "hi", "e aí", "eai", "hey", "opa"]


def is_greeting(message: str) -> bool:
    """Detecta se a mensagem é uma saudação simples."""
    lower = message.lower().strip().rstrip("!?.,:;")
    if lower in GREETINGS_V2:
        return True
    words = lower.split()
    return len(words) <= 3 and any(g in lower for g in GREETINGS_V2)


async def query_openai_v2(
    question: str,
    section_context: str,
    conversation_history: Optional[list[ConversationMessage]],
    request_id: str,
) -> Optional[str]:
    """OpenAI como LLM primária no v2."""
    if not Config.has_openai():
        secure_log("warn", "OpenAI not configured", request_id)
        return None

    secure_log("info", "V2: Querying OpenAI (primary)", request_id)

    messages: list[dict] = [
        {"role": "system", "content": CURATOR_SYSTEM_PROMPT_V2 + f"\n\nContexto da seção atual: {section_context}"},
    ]

    # Adicionar histórico de conversa
    if conversation_history:
        for msg in conversation_history[-6:]:
            messages.append({"role": msg.role, "content": msg.content})

    messages.append({"role": "user", "content": question})

    data = await secure_fetch(
        url="https://api.openai.com/v1/chat/completions",
        request_id=request_id,
        headers=Config.get_openai_headers(),
        json_data={
            "model": "gpt-4o-mini",
            "messages": messages,
            "max_tokens": 512,
            "temperature": 0.7,
        },
    )

    if data:
        result = data.get("choices", [{}])[0].get("message", {}).get("content")
        secure_log("info", "V2: OpenAI response received", request_id, has_content=bool(result))
        return result

    return None


async def query_perplexity_v2(question: str, section_context: str, request_id: str) -> Optional[str]:
    """Perplexity para perguntas elaboradas no v2, com curadoria via OpenAI."""
    perplexity_raw = await query_perplexity(question, request_id)
    if not perplexity_raw:
        return None

    # Curadoria via OpenAI
    if not Config.has_openai():
        return perplexity_raw

    secure_log("info", "V2: Curating Perplexity response via OpenAI", request_id)

    data = await secure_fetch(
        url="https://api.openai.com/v1/chat/completions",
        request_id=request_id,
        headers=Config.get_openai_headers(),
        json_data={
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": CURATOR_SYSTEM_PROMPT_V2},
                {
                    "role": "user",
                    "content": (
                        f'Pergunta: "{question}"\n\n'
                        f'Informações pesquisadas (REMOVA todas as referências):\n{perplexity_raw}\n\n'
                        'Reescreva em no máximo 5 linhas, tom de vendas, sem mencionar fontes.'
                    ),
                },
            ],
            "max_tokens": 512,
            "temperature": 0.5,
        },
    )

    if data:
        result = data.get("choices", [{}])[0].get("message", {}).get("content")
        if result:
            return result

    return perplexity_raw


# ===================================
# FUNÇÕES AUXILIARES
# ===================================

def check_boundary(question: str) -> bool:
    """Verifica se a pergunta está dentro do escopo permitido."""
    lower_question = question.lower()

    if any(topic in lower_question for topic in ALLOWED_TOPICS):
        return True

    greetings = ["olá", "oi", "bom dia", "boa tarde", "boa noite", "hello", "hi", "ajuda", "help"]
    if any(g in lower_question for g in greetings):
        return True

    service_words = ["serviço", "oferecem", "fazem", "podem", "ajudar", "contratar", "preço", "valor", "custo"]
    if any(w in lower_question for w in service_words):
        return True

    return False


def clean_response(text: str) -> str:
    """Remove referências, citações e links da resposta."""
    cleaned = re.sub(r'\[\d+\]', '', text)
    cleaned = re.sub(r'https?://[^\s]+', '', cleaned)
    cleaned = re.sub(
        r'(?:Source|Fonte|Reference|Referência|According to|De acordo com|Segundo)[:\s].*',
        '',
        cleaned,
        flags=re.IGNORECASE
    )
    cleaned = re.sub(r'\(.*?(?:2024|2025|2026).*?\)', '', cleaned)
    cleaned = re.sub(r'\n{3,}', '\n\n', cleaned).strip()
    return cleaned


# ===================================
# CHAMADAS DE API (COM GUARDRAILS)
# ===================================

async def query_perplexity(question: str, request_id: str) -> Optional[str]:
    """Busca informações via Perplexity AI com guardrails."""
    if not Config.has_perplexity():
        secure_log("warn", "Perplexity not configured", request_id)
        return None

    secure_log("info", "Querying Perplexity", request_id)

    data = await secure_fetch(
        url="https://api.perplexity.ai/chat/completions",
        request_id=request_id,
        headers=Config.get_perplexity_headers(),
        json_data={
            "model": "llama-3.1-sonar-small-128k-online",
            "messages": [
                {
                    "role": "system",
                    "content": "Você está pesquisando informações sobre a Arbache Consulting e Ana Paula Arbache. Foque em informações sobre a empresa, serviços, a fundadora e o ecossistema de parceiros. Responda de forma objetiva e factual."
                },
                {
                    "role": "user",
                    "content": f"Pesquise sobre: {question}\n\nContexto: Arbache Consulting, Ana Paula Arbache, consultoria em educação corporativa, liderança e ESG."
                }
            ],
            "max_tokens": 1000,
            "temperature": 0.2,
        }
    )

    if data:
        result = data.get("choices", [{}])[0].get("message", {}).get("content")
        secure_log("info", "Perplexity response received", request_id, has_content=bool(result))
        return result

    return None


async def curate_with_anthropic(question: str, perplexity_response: Optional[str], request_id: str) -> Optional[str]:
    """Curadoria via Claude com guardrails."""
    if not Config.has_anthropic():
        secure_log("warn", "Anthropic not configured", request_id)
        return None

    secure_log("info", "Curating with Anthropic", request_id)

    user_message = (
        f'Pergunta do usuário: "{question}"\n\nInformações pesquisadas (REMOVA todas as referências e citações):\n{perplexity_response}\n\nResponda de forma natural, sem mencionar fontes ou pesquisas.'
        if perplexity_response
        else f'Pergunta do usuário: "{question}"\n\nResponda baseado no seu conhecimento sobre a Arbache Consulting.'
    )

    data = await secure_fetch(
        url="https://api.anthropic.com/v1/messages",
        request_id=request_id,
        headers=Config.get_anthropic_headers(),
        json_data={
            "model": "claude-haiku-4-5-20251001",
            "max_tokens": 1024,
            "system": CURATOR_SYSTEM_PROMPT,
            "messages": [{"role": "user", "content": user_message}],
        }
    )

    if data:
        result = data.get("content", [{}])[0].get("text")
        secure_log("info", "Anthropic response received", request_id, has_content=bool(result))
        return result

    return None


async def curate_with_openai(question: str, perplexity_response: Optional[str], request_id: str) -> Optional[str]:
    """Curadoria via OpenAI (fallback) com guardrails."""
    if not Config.has_openai():
        secure_log("warn", "OpenAI not configured", request_id)
        return None

    secure_log("info", "Curating with OpenAI (fallback)", request_id)

    user_message = (
        f'Pergunta do usuário: "{question}"\n\nInformações pesquisadas (REMOVA todas as referências e citações):\n{perplexity_response}\n\nResponda de forma natural, sem mencionar fontes ou pesquisas.'
        if perplexity_response
        else f'Pergunta do usuário: "{question}"\n\nResponda baseado no seu conhecimento sobre a Arbache Consulting.'
    )

    data = await secure_fetch(
        url="https://api.openai.com/v1/chat/completions",
        request_id=request_id,
        headers=Config.get_openai_headers(),
        json_data={
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": CURATOR_SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            "max_tokens": 1024,
            "temperature": 0.7,
        }
    )

    if data:
        result = data.get("choices", [{}])[0].get("message", {}).get("content")
        secure_log("info", "OpenAI response received", request_id, has_content=bool(result))
        return result

    return None


# ===================================
# LIFESPAN
# ===================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup/shutdown events."""
    # Startup - inicializa config
    Config.initialize()

    startup_id = str(uuid.uuid4())
    secure_log("info", "Backend starting", startup_id,
               perplexity=Config.has_perplexity(),
               anthropic=Config.has_anthropic(),
               openai=Config.has_openai())

    yield

    # Shutdown
    secure_log("info", "Backend shutting down", startup_id)


# ===================================
# APP
# ===================================

app = FastAPI(
    title="Arbache LP API",
    description="Backend para chat da Landing Page Arbache Consulting",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://arbache.com",
        "https://www.arbache.com",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# ===================================
# ENDPOINTS
# ===================================

@app.get("/health", response_model=HealthResponseV1)
async def health_check():
    """Health check endpoint."""
    app_version = os.getenv("APP_VERSION", "dev")
    return HealthResponseV1(
        status="healthy",
        version=app_version,
        services={
            "perplexity": Config.has_perplexity(),
            "anthropic": Config.has_anthropic(),
            "openai": Config.has_openai(),
        }
    )


@app.get("/version", response_model=VersionResponseV1)
async def version():
    """Endpoint de versao para validacao de deploy."""
    app_version = os.getenv("APP_VERSION", "dev")
    clean_sha = app_version.replace("sha-", "")
    return VersionResponseV1(
        sha=clean_sha,
        version=app_version,
        service="arbache-api",
        timestamp=datetime.utcnow().isoformat() + "Z",
    )


@app.post("/chat", response_model=ChatResponseV1)
async def chat(request: ChatRequestV1):
    """
    Endpoint principal de chat com MCP Guardrails.

    Fluxo:
    1. Gera request_id
    2. Boundary check
    3. Query Perplexity (busca)
    4. Curate with Anthropic (Claude)
    5. Fallback to OpenAI
    6. Fallback estático
    7. Clean e valida output
    """
    request_id = str(uuid.uuid4())
    message = request.message

    secure_log("info", "Chat request received", request_id,
               message_length=len(message),
               section=request.section,
               section_context=request.sectionContext)

    # 1. Boundary check
    if not check_boundary(message):
        secure_log("info", "Message outside boundary", request_id)
        return ChatResponseV1(
            response=(
                "Obrigado pelo seu interesse! Sou o assistente virtual da Arbache Consulting "
                "e posso ajudá-lo com informações sobre nossos serviços de educação corporativa, "
                "liderança, ESG e sustentabilidade.\n\n"
                "Como posso ajudá-lo com os serviços da Arbache Consulting?"
            ),
            request_id=request_id,
        )

    # 2. Query Perplexity
    perplexity_response = await query_perplexity(message, request_id)

    # 3. Curate with Anthropic
    response = await curate_with_anthropic(message, perplexity_response, request_id)

    # 4. Fallback to OpenAI
    if not response:
        response = await curate_with_openai(message, perplexity_response, request_id)

    # 5. Fallback estático
    if not response:
        secure_log("warn", "Using static fallback", request_id)
        response = (
            "Obrigado pela sua pergunta! A Arbache Consulting oferece soluções integradas "
            "em educação corporativa, liderança e sustentabilidade.\n\n"
            "Nossos principais serviços incluem:\n"
            "• Trilhas e Programas Educacionais\n"
            "• Formação de Lideranças\n"
            "• Assessment de Soft Skills com IA\n"
            "• Mentoria de Alto Impacto\n"
            "• Consultoria em ESG e Sustentabilidade\n\n"
            "Para mais informações ou para agendar uma conversa com nossa equipe, "
            "entre em contato através do formulário no site.\n\n"
            "Como posso ajudá-lo especificamente?"
        )

    # 6. Clean response
    cleaned_response = clean_response(response)

    # 7. Validar output (Pydantic faz automaticamente)
    result = ChatResponseV1(
        response=cleaned_response,
        request_id=request_id,
    )

    secure_log("info", "Chat response sent", request_id, response_length=len(cleaned_response))

    return result


# ===================================
# V2 ENDPOINT
# ===================================

@app.post("/v2/chat", response_model=ChatResponseV2)
async def chat_v2(request: ChatRequestV2, raw_request: Request):
    """
    Chat v2 — OpenAI primário, Perplexity para elaboradas, Claude fallback.

    Fluxo:
    1. Rate limit check
    2. FAQ check → resposta instantânea
    3. Pergunta simples → OpenAI com contexto da seção
    4. Pergunta elaborada → Perplexity + curadoria OpenAI
    5. Fallback → Claude
    6. Fallback estático
    7. Limpa + trunca (5 linhas)
    8. Gera sugestões de follow-up
    """
    request_id = str(uuid.uuid4())
    message = request.message
    section = request.section
    section_data = get_section_data_v2(section)
    section_context = request.sectionContext or section_data.get('summary', '')

    client_ip = raw_request.client.host if raw_request.client else "unknown"

    secure_log("info", "V2 chat request received", request_id,
               message_length=len(message), section=section)

    # 1. Rate limit
    if not check_rate_limit(client_ip):
        secure_log("warn", "V2 rate limit exceeded", request_id, client_ip=client_ip)
        raise HTTPException(status_code=429, detail="Muitas requisições. Aguarde um momento.")

    # 2. FAQ check
    faq_answer = check_faq_v2(message)
    if faq_answer:
        secure_log("info", "V2 FAQ hit", request_id)
        return ChatResponseV2(
            response=faq_answer,
            badges=section_data.get('badges', []),
            suggestions=generate_follow_up_suggestions(message, section),
            request_id=request_id,
        )

    # 2.5 Greeting check — resposta rápida sem LLM
    if is_greeting(message) and not request.conversationHistory:
        secure_log("info", "V2 greeting detected", request_id)
        return ChatResponseV2(
            response="Olá! Que bom ter você aqui. O que gostaria de saber sobre a Arbache Consulting?",
            badges=section_data.get('badges', []),
            suggestions=section_data.get('suggestions', []),
            request_id=request_id,
        )

    # 3. Boundary check
    if not check_boundary(message):
        secure_log("info", "V2 message outside boundary", request_id)
        return ChatResponseV2(
            response=(
                "Sou o assistente da Arbache Consulting e posso ajudá-lo com "
                "educação corporativa, liderança, ESG e sustentabilidade. "
                "Como posso ajudar?"
            ),
            badges=section_data.get('badges', []),
            suggestions=section_data.get('suggestions', []),
            request_id=request_id,
        )

    response: Optional[str] = None

    # 4. Pergunta elaborada → Perplexity + curadoria
    if is_elaborate_question(message):
        secure_log("info", "V2 elaborate question detected", request_id)
        response = await query_perplexity_v2(message, section_context, request_id)

    # 5. OpenAI (primário ou fallback de Perplexity)
    if not response:
        response = await query_openai_v2(
            message, section_context, request.conversationHistory, request_id
        )

    # 6. Fallback → Claude
    if not response:
        response = await curate_with_anthropic(message, None, request_id)

    # 7. Fallback estático (conversacional, sem lista)
    if not response:
        secure_log("warn", "V2 using static fallback", request_id)
        response = (
            "Trabalhamos com educação corporativa, liderança e sustentabilidade. "
            "Posso te contar mais sobre qualquer uma dessas áreas — qual te interessa?"
        )

    # 8. Clean + truncate
    cleaned = clean_response(response)
    cleaned = truncate_response(cleaned, max_lines=5)

    # 9. Gera sugestões
    suggestions = generate_follow_up_suggestions(message, section)

    result = ChatResponseV2(
        response=cleaned,
        badges=section_data.get('badges', []),
        suggestions=suggestions,
        request_id=request_id,
    )

    secure_log("info", "V2 chat response sent", request_id,
               response_length=len(cleaned))

    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
