import { NextRequest, NextResponse } from 'next/server'

// ===================================
// CONTEXT - Informações sobre a Arbache Consulting
// ===================================

const ARBACHE_CONTEXT = `
## Sobre a Arbache Consulting

A Arbache Consulting é uma consultoria especializada em soluções integradas para organizações que buscam excelência em educação corporativa, liderança e sustentabilidade.

### Fundadora - Ana Paula Arbache

Ana Paula Arbache é a fundadora e CEO da Arbache Consulting. Especialista em:
- Educação Corporativa
- Liderança e Desenvolvimento de Pessoas
- Sustentabilidade e ESG
- Transformação Digital e IA aplicada a RH

### Serviços Oferecidos

1. **Trilhas e Programas Educacionais**
   - Trilhas e programas educacionais personalizados
   - Master classes

2. **Curadoria de Produtos e Certificações**
   - Criação e curadoria de produtos e infoprodutos
   - Certificações educacionais

3. **Formação de Lideranças**
   - Formação em ESG
   - Liderança feminina
   - Gestão de equipes

4. **Assessment Soft Skills + IA**
   - Mapeamento de Competências (Soft Skills)
   - Assessment inovador com uso de IA

5. **Senior Advisor Sustentabilidade e ESG**
   - Consultoria estratégica em Sustentabilidade
   - Gestão de ESG

6. **Mentoria de Alto Impacto**
   - Programa personalizado de mentoria
   - Foco em Carreira, ESG, IA, Tecnologia e RH

7. **Auditorias e Relatórios Técnicos**
   - Auditorias em ESG, Sustentabilidade, Educação
   - Pareceres e relatórios técnicos em IA e Tecnologia

8. **Missões e Imersões Técnicas**
   - Missões nacionais e internacionais
   - Imersões técnicas especializadas

9. **Redes e Networking**
   - Gestão de redes conectivas
   - Eventos para networking

10. **Processos de RH e Gestão**
    - Criação e gestão de processos de RH
    - Gestão de Pessoas

11. **Palestras e Painéis**
    - Palestras corporativas
    - Painéis, mesas redondas
    - Focus groups e roundtables

### Ecossistema

A Arbache Consulting faz parte de um ecossistema integrado que inclui:
- **ICONS.AI** - Soluções em Inteligência Artificial
- **Co.Labs** - Laboratório de inovação e colaboração
- **Arbache e-Learning** - Plataforma de educação digital

### Valores e Propósito

- Excelência em educação corporativa
- Desenvolvimento sustentável
- Inovação com responsabilidade
- Transformação digital humanizada
- Liderança consciente e ESG
`

// ===================================
// BOUNDARIES - Tópicos permitidos
// ===================================

const ALLOWED_TOPICS = [
  'ana paula arbache',
  'arbache consulting',
  'arbache',
  'consultoria',
  'educação corporativa',
  'liderança',
  'sustentabilidade',
  'esg',
  'trilhas',
  'programas educacionais',
  'curadoria',
  'certificações',
  'formação',
  'assessment',
  'soft skills',
  'senior advisor',
  'mentoria',
  'auditoria',
  'relatórios técnicos',
  'missões',
  'imersões',
  'networking',
  'redes',
  'processos rh',
  'gestão de pessoas',
  'palestras',
  'painéis',
  'ecossistema',
  'icons.ai',
  'icons ai',
  'colabs',
  'co.labs',
  'e-learning',
  'parceiros',
  'serviços',
  'treinamento',
  'desenvolvimento',
  'coaching',
  'capacitação',
]

// ===================================
// SYSTEM PROMPTS
// ===================================

const CURATOR_SYSTEM_PROMPT = `Você é um assistente da Arbache Consulting, uma consultoria especializada em educação corporativa, liderança e sustentabilidade.

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
${ARBACHE_CONTEXT}

IMPORTANTE: Sua resposta deve parecer vir diretamente da Arbache Consulting, sem nenhuma indicação de pesquisa externa.`

const BOUNDARY_CHECK_PROMPT = `Analise se a pergunta do usuário está relacionada a QUALQUER um destes tópicos:
- Ana Paula Arbache (fundadora)
- Arbache Consulting (empresa)
- Serviços de consultoria em educação, liderança, ESG, sustentabilidade
- Treinamentos, assessments, mentoria, palestras
- Parceiros do ecossistema (ICONS.AI, Co.Labs)

Responda APENAS com "SIM" se a pergunta estiver relacionada a esses tópicos, ou "NÃO" se não estiver.
Seja generoso na interpretação - se houver qualquer conexão possível com os tópicos, responda "SIM".`

// ===================================
// API FUNCTIONS
// ===================================

async function checkBoundary(question: string): Promise<boolean> {
  // Quick keyword check first
  const lowerQuestion = question.toLowerCase()
  const hasAllowedTopic = ALLOWED_TOPICS.some(topic => lowerQuestion.includes(topic))

  if (hasAllowedTopic) return true

  // Generic greetings are allowed
  const greetings = ['olá', 'oi', 'bom dia', 'boa tarde', 'boa noite', 'hello', 'hi', 'ajuda', 'help']
  if (greetings.some(g => lowerQuestion.includes(g))) return true

  // Questions about services are allowed
  const serviceWords = ['serviço', 'oferecem', 'fazem', 'podem', 'ajudar', 'contratar', 'preço', 'valor', 'custo']
  if (serviceWords.some(w => lowerQuestion.includes(w))) return true

  return false
}

async function queryPerplexity(question: string): Promise<string | null> {
  const apiKey = process.env.PERPLEXITY_API_KEY
  if (!apiKey) {
    console.log('Perplexity API key not configured')
    return null
  }

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: `Você está pesquisando informações sobre a Arbache Consulting e Ana Paula Arbache.
Foque em informações sobre a empresa, serviços, a fundadora e o ecossistema de parceiros.
Responda de forma objetiva e factual.`
          },
          {
            role: 'user',
            content: `Pesquise sobre: ${question}\n\nContexto: Arbache Consulting, Ana Paula Arbache, consultoria em educação corporativa, liderança e ESG.`
          }
        ],
        max_tokens: 1000,
        temperature: 0.2,
      }),
    })

    if (!response.ok) {
      console.error('Perplexity API error:', response.status)
      return null
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || null
  } catch (error) {
    console.error('Perplexity error:', error)
    return null
  }
}

async function curateWithAnthropic(question: string, perplexityResponse: string | null): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.log('Anthropic API key not configured, skipping to fallback')
    return null
  }

  const userMessage = perplexityResponse
    ? `Pergunta do usuário: "${question}"\n\nInformações pesquisadas (REMOVA todas as referências e citações):\n${perplexityResponse}\n\nResponda de forma natural, sem mencionar fontes ou pesquisas.`
    : `Pergunta do usuário: "${question}"\n\nResponda baseado no seu conhecimento sobre a Arbache Consulting.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1024,
        system: CURATOR_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ],
      }),
    })

    if (!response.ok) {
      console.error('Anthropic API error:', response.status)
      return null
    }

    const data = await response.json()
    return data.content?.[0]?.text || null
  } catch (error) {
    console.error('Anthropic error:', error)
    return null
  }
}

async function curateWithOpenAI(question: string, perplexityResponse: string | null): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    console.log('OpenAI API key not configured')
    return null
  }

  const userMessage = perplexityResponse
    ? `Pergunta do usuário: "${question}"\n\nInformações pesquisadas (REMOVA todas as referências e citações):\n${perplexityResponse}\n\nResponda de forma natural, sem mencionar fontes ou pesquisas.`
    : `Pergunta do usuário: "${question}"\n\nResponda baseado no seu conhecimento sobre a Arbache Consulting.`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: CURATOR_SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      console.error('OpenAI API error:', response.status)
      return null
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || null
  } catch (error) {
    console.error('OpenAI error:', error)
    return null
  }
}

function cleanResponse(text: string): string {
  // Remove reference markers like [1], [2], etc.
  let cleaned = text.replace(/\[\d+\]/g, '')

  // Remove URLs
  cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, '')

  // Remove "Source:", "Fonte:", "Reference:", etc.
  cleaned = cleaned.replace(/(?:Source|Fonte|Reference|Referência|According to|De acordo com|Segundo)[:\s].*/gi, '')

  // Remove citations
  cleaned = cleaned.replace(/\(.*?(?:2024|2025|2026).*?\)/g, '')

  // Remove excessive whitespace
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim()

  return cleaned
}

// ===================================
// ROUTE HANDLER
// ===================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      )
    }

    // Check if question is within boundaries
    const isAllowed = await checkBoundary(message)

    if (!isAllowed) {
      return NextResponse.json({
        response: `Obrigado pelo seu interesse! Sou o assistente virtual da Arbache Consulting e posso ajudá-lo com informações sobre nossos serviços de educação corporativa, liderança, ESG e sustentabilidade.

Como posso ajudá-lo com os serviços da Arbache Consulting?`
      })
    }

    // Query Perplexity for information (optional)
    const perplexityResponse = await queryPerplexity(message)

    // Curate with Anthropic Claude (primary)
    let response = await curateWithAnthropic(message, perplexityResponse)

    // Fallback to OpenAI if Anthropic fails
    if (!response) {
      response = await curateWithOpenAI(message, perplexityResponse)
    }

    // Final fallback - static response
    if (!response) {
      response = `Obrigado pela sua pergunta! A Arbache Consulting oferece soluções integradas em educação corporativa, liderança e sustentabilidade.

Nossos principais serviços incluem:
• Trilhas e Programas Educacionais
• Formação de Lideranças
• Assessment de Soft Skills com IA
• Mentoria de Alto Impacto
• Consultoria em ESG e Sustentabilidade

Para mais informações ou para agendar uma conversa com nossa equipe, entre em contato através do formulário no site.

Como posso ajudá-lo especificamente?`
    }

    // Clean the response
    const cleanedResponse = cleanResponse(response)

    return NextResponse.json({ response: cleanedResponse })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
