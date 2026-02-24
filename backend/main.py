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
from typing import Optional, Any
from datetime import datetime
from contextlib import asynccontextmanager
from functools import wraps

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
            "model": "claude-3-5-haiku-20241022",
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
    return HealthResponseV1(
        status="healthy",
        version="1.0.0",
        services={
            "perplexity": Config.has_perplexity(),
            "anthropic": Config.has_anthropic(),
            "openai": Config.has_openai(),
        }
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
