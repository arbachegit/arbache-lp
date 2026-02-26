# Fluxo Conversacional — Agente Arbache

## 1. Visão Geral

O agente conversacional da Arbache Consulting é um assistente virtual integrado à landing page que responde dúvidas sobre a empresa, seus serviços e especialistas. Ele funciona como um **widget flutuante** no canto inferior direito da página, com tom profissional e orientado a vendas.

| Camada | Tecnologia | Hospedagem |
|--------|-----------|------------|
| **Frontend** | Next.js (React 18 + TypeScript), exportação estática | DigitalOcean Droplet (nginx) |
| **Backend** | FastAPI (Python 3.11) em container Docker, porta 8001 | DigitalOcean Droplet |
| **LLMs** | OpenAI (primário) · Perplexity (pesquisa) · Claude (fallback) | APIs externas |

---

## 2. Arquitetura

```
NAVEGADOR DO USUÁRIO
    │
    ▼
Next.js Frontend (HTML/JS estático)
    ├─ AgentButton.tsx  — widget flutuante de chat
    ├─ Detecção de seção (scroll)
    ├─ FAQ local (client-side)
    └─ Curadoria client-side
    │
    │  POST /v2/chat  { message, section, sectionContext, conversationHistory }
    ▼
FastAPI Backend (:8001)
    ├─ 1. Rate limiter (20 req / 60s por IP)
    ├─ 2. FAQ check (12 Q&A hardcoded)
    ├─ 3. Boundary check (temas permitidos)
    ├─ 4. Roteador de LLMs:
    │      ├─ Simples?  → OpenAI (gpt-4o-mini)
    │      ├─ Elaborada? → Perplexity + curadoria OpenAI
    │      ├─ Falhou?   → Claude (haiku) fallback
    │      └─ Ainda falhou? → Resposta estática segura
    ├─ 5. Limpeza (refs, URLs, citações)
    ├─ 6. Truncagem (máx 5 linhas)
    └─ 7. Geração de sugestões follow-up
    │
    │  { response, badges, suggestions, request_id }
    ▼
Cliente exibe mensagem + badges + sugestões clicáveis
```

---

## 3. Fluxo do Endpoint `/v2/chat`

### Request / Response

```python
# Request
class ChatRequestV2(BaseModel):
    message: str                          # 1–2000 caracteres
    section: Optional[str]                # ID da seção atual (8 seções)
    sectionContext: Optional[str]         # Máx 500 caracteres
    conversationHistory: Optional[list]   # Últimas 6 mensagens

# Response
class ChatResponseV2(BaseModel):
    response: str          # Texto limpo, máx 5 linhas
    badges: list[str]      # 3–6 badges da seção
    suggestions: list[str] # 3 sugestões de follow-up
    request_id: str        # UUID para rastreamento
```

### Pipeline passo a passo

| # | Etapa | Comportamento |
|---|-------|--------------|
| 1 | **Rate Limit** | 20 requisições por IP em janela de 60s. Retorna `429` se excedido. |
| 2 | **FAQ Instant** | Compara mensagem com 12 pares Q&A hardcoded. Se match, retorna imediatamente sem chamar LLM. |
| 3 | **Boundary Check** | Verifica se a mensagem trata de temas permitidos (Arbache, educação corporativa, ESG, mentoria, etc.) ou contém palavras de serviço ("preço", "contratar"). Se fora de escopo, redireciona gentilmente. |
| 4 | **Detecção de pergunta elaborada** | Se mensagem tem 10+ palavras ou contém keywords como "como funciona", "explique", "compare", "tendência" → encaminha para Perplexity. |
| 5 | **Perplexity + Curadoria** | Perplexity (`llama-3.1-sonar-small-128k-online`, 1000 tokens) pesquisa na web. Resultado é curado via OpenAI para remover referências e reescrever em tom de vendas. |
| 6 | **OpenAI Primário** | Para perguntas simples ou quando Perplexity não foi acionada. `gpt-4o-mini`, 512 tokens, temperatura 0.7. Inclui histórico de conversa (últimas 6 mensagens). |
| 7 | **Claude Fallback** | Se OpenAI falha: `claude-3-5-haiku-20241022`, 1024 tokens. |
| 8 | **Fallback Estático** | Se todos os LLMs falharem: resposta genérica hardcoded sobre serviços da Arbache. |
| 9 | **Limpeza + Sugestões** | Remove referências `[1]`, URLs, datas. Trunca para 5 linhas. Gera 3 sugestões de follow-up baseadas na seção. |

---

## 4. Frontend

### Componentes principais

| Arquivo | Responsabilidade |
|---------|-----------------|
| `src/components/sections/AgentButton.tsx` | Widget de chat flutuante (660 linhas) |
| `src/lib/agent-content.ts` | Dados das 8 seções (badges, sugestões, contexto) |
| `src/lib/agent-curate.ts` | Pipeline de curadoria client-side |

### Widget de Chat

```
┌─────────────────────────────────────────────┐
│ Assistente Arbache      [Seção atual]    ✕  │  ← Header
├─────────────────────────────────────────────┤
│ [Badge1] [Badge2] [Badge3] [Badge4]        │  ← Badges da seção
├─────────────────────────────────────────────┤
│                                             │
│  Mensagens com timestamps                   │  ← Área de mensagens
│                                             │
├─────────────────────────────────────────────┤
│ [Sugestão 1] [Sugestão 2] [Sugestão 3]    │  ← Sugestões clicáveis
├─────────────────────────────────────────────┤
│ [Campo de texto...............]    [Enviar] │  ← Input + botão
├─────────────────────────────────────────────┤
│           powered by IconsAI                │  ← Footer
└─────────────────────────────────────────────┘
```

### Funcionalidades

- **Detecção de seção por scroll** — `getBoundingClientRect()` detecta quando a seção cruza 50% da viewport. Atualiza badges e sugestões automaticamente. Dispara animação de "callout" (4s) a cada troca de seção.
- **Badges dinâmicos** — 3 a 6 badges por seção, exibidos no topo do chat. Mudam conforme o scroll.
- **Sugestões clicáveis** — 3 sugestões por seção. Ao clicar, o texto é preenchido e enviado automaticamente. Atualizam com a resposta da API ou caem para os defaults da seção.
- **Placeholder dinâmico** — Muda conforme a seção atual: "Digite sua mensagem...".
- **Histórico de conversa** — Últimas 6 mensagens (3 pares user/assistant) são enviadas ao backend para manter contexto multi-turno.

### Curadoria Client-Side (`agent-curate.ts`)

Pipeline de limpeza executado **após** receber a resposta da API:

1. Remove referências numéricas `[1]`, `[2]`
2. Remove atribuições ("Segundo", "De acordo com", "Fonte:")
3. Remove menções a LLMs (OpenAI, Claude, Perplexity)
4. Remove URLs
5. Remove referências de ano entre parênteses
6. Colapsa 3+ quebras de linha para 2
7. Remove espaços duplos

---

## 5. Regras Conversacionais

As regras são aplicadas via system prompt (`CURATOR_SYSTEM_PROMPT_V2`) e reforçadas por truncagem + curadoria:

| Regra | Detalhe |
|-------|---------|
| **Brevidade** | Máximo 5 linhas por resposta (truncagem forçada no backend) |
| **Tom** | Profissional, acolhedor, orientado a vendas |
| **Idioma** | Português brasileiro |
| **Finalização** | Terminar com pergunta ou call-to-action quando fizer sentido |
| **Escopo** | Falar APENAS sobre Arbache, Ana Paula, serviços, parceiros |
| **Referências** | NUNCA mencionar fontes, URLs, provedores de IA |
| **Redirecionamento** | Perguntas fora de escopo → redirecionar para serviços da Arbache |
| **Serviços** | Nunca listar todos os serviços de uma vez; focar no que é relevante à pergunta |

---

## 6. Mapa de Seções

8 seções com badges e sugestões contextuais:

| Seção | ID | Badges | Sugestões |
|-------|----|--------|-----------|
| **Hero** | `hero` | Educação Corporativa · Liderança · ESG · Inovação | O que a Arbache faz? · Quem é Ana Paula? · Quais serviços? |
| **Propósito** | `proposito` | Missão · Visão · Valores · Excelência | Qual a missão? · Quais valores? · O que diferencia? |
| **Quem Somos** | `quem-somos` | Ana Paula Arbache · Fernando Arbache · Alexandre Vieira · Fernando Bastos | Qual formação da Ana Paula? · Quem são especialistas? · Quais expertise? |
| **Ecossistema** | `nosso-ecossistema` | Educação Corporativa · Liderança · Gestão Carreira · RH · Inovação IA · ESG | Quais pilares? · Qual pilar ideal? · Como IA se integra? |
| **Soluções** | `solucoes-org` | Trilhas Educacionais · Assessment IA · Mentoria · Formação Lideranças · Palestras | Como funcionam trilhas? · O que é Assessment? · Quais mentorias? |
| **Co.Labs** | `colabs` | Resorts Brasil · MIT · Senac · Escola Etiqueta · Hotelier News | Quem são parceiros? · Como funciona Co.Labs? · Como ser parceiro? |
| **ESG** | `esg` | HubMulher · Knowledge Hub · SDG Pioneer · Sustentabilidade | O que é HubMulher? · Qual papel nos ODS? · Como atuam em sustentabilidade? |
| **Contato** | `contato` | Fale Conosco · Agende Conversa | Como agendar? · Quais soluções para minha empresa? · Vocês atendem qual porte? |

---

## 7. Configuração

### Variáveis de Ambiente — Backend

```bash
OPENAI_API_KEY=sk-...          # LLM primário (gpt-4o-mini)
PERPLEXITY_API_KEY=pplx-...    # Pesquisa web para perguntas elaboradas
ANTHROPIC_API_KEY=sk-ant-...   # Fallback (claude-3-5-haiku)
```

### Variáveis de Ambiente — Frontend

```bash
NEXT_PUBLIC_API_URL=https://api.arbache.com   # Produção
NEXT_PUBLIC_API_URL=http://localhost:8001      # Desenvolvimento
```

### Endpoints Externos Permitidos (allowlist)

| Provedor | URL | Modelo | Tokens |
|----------|-----|--------|--------|
| OpenAI | `api.openai.com/v1/chat/completions` | gpt-4o-mini | 512 |
| Perplexity | `api.perplexity.ai/chat/completions` | llama-3.1-sonar-small-128k-online | 1000 |
| Anthropic | `api.anthropic.com/v1/messages` | claude-3-5-haiku-20241022 | 1024 |

### Parâmetros de Resiliência

| Parâmetro | Valor |
|-----------|-------|
| Timeout HTTP | 30s |
| Max retries | 3 (backoff exponencial: 1s, 2s, 4s) |
| Rate limit | 20 req/IP por janela de 60s |
| Max input | 2000 caracteres |
| Max output | 5 linhas |
| Histórico de conversa | 6 mensagens (3 pares) |

### Health Check

```bash
# Verificar se o backend está no ar
curl https://api.arbache.com/health

# Verificar versão
curl https://api.arbache.com/version
```
