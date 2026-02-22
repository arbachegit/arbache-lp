/**
 * MCP Server - Anthropic
 * Servidor MCP para curadoria e processamento de texto via Claude
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

interface AnthropicResponse {
  content: Array<{
    type: string
    text: string
  }>
}

async function callClaude(
  systemPrompt: string,
  userMessage: string,
  maxTokens: number = 1024
): Promise<string> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not configured')
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`)
  }

  const data: AnthropicResponse = await response.json()
  return data.content?.[0]?.text || ''
}

// Clean response from citations and references
function cleanResponse(text: string): string {
  let cleaned = text.replace(/\[\d+\]/g, '')
  cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, '')
  cleaned = cleaned.replace(/(?:Source|Fonte|Reference|Referência|According to|De acordo com|Segundo)[:\s].*/gi, '')
  cleaned = cleaned.replace(/\(.*?(?:2024|2025|2026).*?\)/g, '')
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim()
  return cleaned
}

// Create server
const server = new Server(
  {
    name: 'anthropic-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
)

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'curate_response',
        description: 'Processa e limpa resposta de busca, removendo referências e citações',
        inputSchema: {
          type: 'object',
          properties: {
            content: {
              type: 'string',
              description: 'Conteúdo a ser curado',
            },
            context: {
              type: 'string',
              description: 'Contexto da curadoria (empresa, tópico)',
            },
          },
          required: ['content'],
        },
      },
      {
        name: 'answer_arbache',
        description: 'Responde perguntas sobre a Arbache Consulting de forma natural',
        inputSchema: {
          type: 'object',
          properties: {
            question: {
              type: 'string',
              description: 'Pergunta do usuário',
            },
            search_results: {
              type: 'string',
              description: 'Resultados de busca para usar como base (opcional)',
            },
          },
          required: ['question'],
        },
      },
      {
        name: 'generate',
        description: 'Gera texto usando Claude',
        inputSchema: {
          type: 'object',
          properties: {
            prompt: {
              type: 'string',
              description: 'Prompt para geração',
            },
            system: {
              type: 'string',
              description: 'System prompt (opcional)',
            },
            max_tokens: {
              type: 'number',
              description: 'Máximo de tokens na resposta',
            },
          },
          required: ['prompt'],
        },
      },
    ],
  }
})

// Arbache context
const ARBACHE_CONTEXT = `
A Arbache Consulting é uma consultoria especializada em educação corporativa, liderança e sustentabilidade.
Fundada por Ana Paula Arbache, especialista em Educação Corporativa, Liderança, ESG e Transformação Digital.

Serviços: Trilhas Educacionais, Formação de Lideranças, Assessment Soft Skills + IA,
Mentoria de Alto Impacto, Consultoria ESG, Auditorias, Palestras.

Ecossistema: ICONS.AI (IA), Co.Labs (inovação), Arbache e-Learning (educação digital).
`

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  try {
    switch (name) {
      case 'curate_response': {
        const content = args?.content as string
        const context = args?.context as string || 'geral'

        const systemPrompt = `Você é um curador de conteúdo. Reescreva o texto de forma natural, removendo todas as referências, citações, links e indicações de fonte. Contexto: ${context}`

        const result = await callClaude(systemPrompt, content)
        return {
          content: [{ type: 'text', text: cleanResponse(result) }],
        }
      }

      case 'answer_arbache': {
        const question = args?.question as string
        const searchResults = args?.search_results as string | undefined

        const systemPrompt = `Você é o assistente virtual da Arbache Consulting.

REGRAS:
1. Responda APENAS sobre a Arbache Consulting, Ana Paula Arbache, seus serviços e parceiros
2. NUNCA mencione fontes, links ou referências
3. Responda de forma natural, como assistente oficial da empresa
4. Máximo 3-4 parágrafos
5. Use português brasileiro

CONTEXTO:
${ARBACHE_CONTEXT}`

        const userMessage = searchResults
          ? `Pergunta: "${question}"\n\nInformações (remova referências):\n${searchResults}`
          : `Pergunta: "${question}"`

        const result = await callClaude(systemPrompt, userMessage)
        return {
          content: [{ type: 'text', text: cleanResponse(result) }],
        }
      }

      case 'generate': {
        const prompt = args?.prompt as string
        const system = args?.system as string || 'Você é um assistente útil.'
        const maxTokens = args?.max_tokens as number || 1024

        const result = await callClaude(system, prompt, maxTokens)
        return {
          content: [{ type: 'text', text: result }],
        }
      }

      default:
        throw new Error(`Unknown tool: ${name}`)
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      content: [{ type: 'text', text: `Error: ${errorMessage}` }],
      isError: true,
    }
  }
})

// Run server
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('Anthropic MCP Server running on stdio')
}

main().catch(console.error)
