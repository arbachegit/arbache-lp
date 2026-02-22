/**
 * MCP Server - Perplexity
 * Servidor MCP para busca de informações via Perplexity AI
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY

interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

async function searchPerplexity(query: string, context?: string): Promise<string> {
  if (!PERPLEXITY_API_KEY) {
    throw new Error('PERPLEXITY_API_KEY not configured')
  }

  const systemPrompt = context
    ? `Você está pesquisando informações sobre: ${context}. Responda de forma objetiva e factual.`
    : 'Responda de forma objetiva e factual.'

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-small-128k-online',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query }
      ],
      max_tokens: 1000,
      temperature: 0.2,
    }),
  })

  if (!response.ok) {
    throw new Error(`Perplexity API error: ${response.status}`)
  }

  const data: PerplexityResponse = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

// Create server
const server = new Server(
  {
    name: 'perplexity-mcp',
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
        name: 'search',
        description: 'Busca informações na web usando Perplexity AI',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'A consulta de busca',
            },
            context: {
              type: 'string',
              description: 'Contexto adicional para a busca (opcional)',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'search_arbache',
        description: 'Busca informações sobre a Arbache Consulting e Ana Paula Arbache',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'A consulta específica sobre Arbache Consulting',
            },
          },
          required: ['query'],
        },
      },
    ],
  }
})

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  try {
    switch (name) {
      case 'search': {
        const query = args?.query as string
        const context = args?.context as string | undefined
        const result = await searchPerplexity(query, context)
        return {
          content: [{ type: 'text', text: result }],
        }
      }

      case 'search_arbache': {
        const query = args?.query as string
        const result = await searchPerplexity(
          query,
          'Arbache Consulting, Ana Paula Arbache, consultoria em educação corporativa, liderança e ESG'
        )
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
  console.error('Perplexity MCP Server running on stdio')
}

main().catch(console.error)
