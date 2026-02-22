"""
Arbache LP - Backend API
FastAPI backend para chat com Perplexity + Claude/OpenAI
"""

import os
import re
import uuid
from typing import Optional
from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from dotenv import load_dotenv

load_dotenv()

# ===================================
# CONFIGURAÇÃO
# ===================================

PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

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
# SCHEMAS (Pydantic)
# ===================================

class ChatRequest(BaseModel):
    """Request para endpoint de chat."""
    message: str = Field(..., min_length=1, max_length=2000)

    @field_validator('message')
    @classmethod
    def normalize_message(cls, v: str) -> str:
        return v.strip()


class ChatResponse(BaseModel):
    """Response do endpoint de chat."""
    response: str
    request_id: str = Field(default_factory=lambda: str(uuid.uuid4()))


class HealthResponse(BaseModel):
    """Response do health check."""
    status: str
    version: str
    services: dict


# ===================================
# FUNÇÕES AUXILIARES
# ===================================

def check_boundary(question: str) -> bool:
    """Verifica se a pergunta está dentro do escopo permitido."""
    lower_question = question.lower()

    # Verifica tópicos permitidos
    if any(topic in lower_question for topic in ALLOWED_TOPICS):
        return True

    # Saudações são permitidas
    greetings = ["olá", "oi", "bom dia", "boa tarde", "boa noite", "hello", "hi", "ajuda", "help"]
    if any(g in lower_question for g in greetings):
        return True

    # Perguntas sobre serviços são permitidas
    service_words = ["serviço", "oferecem", "fazem", "podem", "ajudar", "contratar", "preço", "valor", "custo"]
    if any(w in lower_question for w in service_words):
        return True

    return False


def clean_response(text: str) -> str:
    """Remove referências, citações e links da resposta."""
    # Remove marcadores de referência [1], [2], etc.
    cleaned = re.sub(r'\[\d+\]', '', text)

    # Remove URLs
    cleaned = re.sub(r'https?://[^\s]+', '', cleaned)

    # Remove "Source:", "Fonte:", etc.
    cleaned = re.sub(
        r'(?:Source|Fonte|Reference|Referência|According to|De acordo com|Segundo)[:\s].*',
        '',
        cleaned,
        flags=re.IGNORECASE
    )

    # Remove citações com anos
    cleaned = re.sub(r'\(.*?(?:2024|2025|2026).*?\)', '', cleaned)

    # Remove espaços em branco excessivos
    cleaned = re.sub(r'\n{3,}', '\n\n', cleaned).strip()

    return cleaned


# ===================================
# CHAMADAS DE API
# ===================================

async def query_perplexity(question: str) -> Optional[str]:
    """Busca informações via Perplexity AI."""
    if not PERPLEXITY_API_KEY:
        return None

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://api.perplexity.ai/chat/completions",
                headers={
                    "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
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

            if response.status_code != 200:
                return None

            data = response.json()
            return data.get("choices", [{}])[0].get("message", {}).get("content")

    except Exception:
        return None


async def curate_with_anthropic(question: str, perplexity_response: Optional[str]) -> Optional[str]:
    """Curadoria via Claude."""
    if not ANTHROPIC_API_KEY:
        return None

    user_message = (
        f'Pergunta do usuário: "{question}"\n\nInformações pesquisadas (REMOVA todas as referências e citações):\n{perplexity_response}\n\nResponda de forma natural, sem mencionar fontes ou pesquisas.'
        if perplexity_response
        else f'Pergunta do usuário: "{question}"\n\nResponda baseado no seu conhecimento sobre a Arbache Consulting.'
    )

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": ANTHROPIC_API_KEY,
                    "anthropic-version": "2023-06-01",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "claude-3-5-haiku-20241022",
                    "max_tokens": 1024,
                    "system": CURATOR_SYSTEM_PROMPT,
                    "messages": [{"role": "user", "content": user_message}],
                }
            )

            if response.status_code != 200:
                return None

            data = response.json()
            return data.get("content", [{}])[0].get("text")

    except Exception:
        return None


async def curate_with_openai(question: str, perplexity_response: Optional[str]) -> Optional[str]:
    """Curadoria via OpenAI (fallback)."""
    if not OPENAI_API_KEY:
        return None

    user_message = (
        f'Pergunta do usuário: "{question}"\n\nInformações pesquisadas (REMOVA todas as referências e citações):\n{perplexity_response}\n\nResponda de forma natural, sem mencionar fontes ou pesquisas.'
        if perplexity_response
        else f'Pergunta do usuário: "{question}"\n\nResponda baseado no seu conhecimento sobre a Arbache Consulting.'
    )

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENAI_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "gpt-4o-mini",
                    "messages": [
                        {"role": "system", "content": CURATOR_SYSTEM_PROMPT},
                        {"role": "user", "content": user_message},
                    ],
                    "max_tokens": 1024,
                    "temperature": 0.7,
                }
            )

            if response.status_code != 200:
                return None

            data = response.json()
            return data.get("choices", [{}])[0].get("message", {}).get("content")

    except Exception:
        return None


# ===================================
# LIFESPAN
# ===================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup/shutdown events."""
    # Startup
    print("🚀 Arbache LP Backend starting...")
    print(f"   Perplexity: {'✅' if PERPLEXITY_API_KEY else '❌'}")
    print(f"   Anthropic:  {'✅' if ANTHROPIC_API_KEY else '❌'}")
    print(f"   OpenAI:     {'✅' if OPENAI_API_KEY else '❌'}")
    yield
    # Shutdown
    print("👋 Arbache LP Backend shutting down...")


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

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        services={
            "perplexity": bool(PERPLEXITY_API_KEY),
            "anthropic": bool(ANTHROPIC_API_KEY),
            "openai": bool(OPENAI_API_KEY),
        }
    )


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Endpoint principal de chat.

    Fluxo:
    1. Boundary check
    2. Query Perplexity (busca)
    3. Curate with Anthropic (Claude)
    4. Fallback to OpenAI
    5. Fallback estático
    """
    message = request.message
    request_id = str(uuid.uuid4())

    # 1. Boundary check
    if not check_boundary(message):
        return ChatResponse(
            response=(
                "Obrigado pelo seu interesse! Sou o assistente virtual da Arbache Consulting "
                "e posso ajudá-lo com informações sobre nossos serviços de educação corporativa, "
                "liderança, ESG e sustentabilidade.\n\n"
                "Como posso ajudá-lo com os serviços da Arbache Consulting?"
            ),
            request_id=request_id,
        )

    # 2. Query Perplexity
    perplexity_response = await query_perplexity(message)

    # 3. Curate with Anthropic
    response = await curate_with_anthropic(message, perplexity_response)

    # 4. Fallback to OpenAI
    if not response:
        response = await curate_with_openai(message, perplexity_response)

    # 5. Fallback estático
    if not response:
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

    return ChatResponse(
        response=cleaned_response,
        request_id=request_id,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
