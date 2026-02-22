/**
 * MCP Server - OpenAI
 * Servidor MCP para processamento de texto via GPT (fallback)
 *
 * MCP Guardrails Applied:
 * - Zod input validation (versioned schemas)
 * - Network allowlist
 * - Timeout + Retry + Backoff
 * - Structured logging with request_id
 * - Output validation
 * - No direct process.env access
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import {
  secureFetch,
  secureLog,
  generateRequestId,
  cleanResponse,
  CurateInputV1,
  AnswerInputV1,
  GenerateInputV1,
  SummarizeInputV1,
  TextOutputV1,
} from '../lib/guardrails.js';

// ===================================
// CONFIG
// ===================================

class OpenAIConfig {
  private static apiKey: string | undefined;
  private static initialized = false;

  static initialize(): void {
    if (this.initialized) return;
    this.apiKey = process.env.OPENAI_API_KEY;
    this.initialized = true;
  }

  static hasApiKey(): boolean {
    return Boolean(this.apiKey);
  }

  static getHeaders(): Record<string, string> {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }
    return {
      Authorization: `Bearer ${this.apiKey}`,
    };
  }
}

OpenAIConfig.initialize();

// ===================================
// ARBACHE CONTEXT
// ===================================

const ARBACHE_CONTEXT = `
A Arbache Consulting é uma consultoria especializada em educação corporativa, liderança e sustentabilidade.
Fundada por Ana Paula Arbache, especialista em Educação Corporativa, Liderança, ESG e Transformação Digital.

Serviços: Trilhas Educacionais, Formação de Lideranças, Assessment Soft Skills + IA,
Mentoria de Alto Impacto, Consultoria ESG, Auditorias, Palestras.

Ecossistema: ICONS.AI (IA), Co.Labs (inovação), Arbache e-Learning (educação digital).
`;

// ===================================
// OPENAI API
// ===================================

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    total_tokens: number;
  };
}

async function callGPT(
  systemPrompt: string,
  userMessage: string,
  maxTokens: number,
  temperature: number,
  requestId: string
): Promise<{ text: string; tokens_used?: number }> {
  if (!OpenAIConfig.hasApiKey()) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  secureLog('info', 'Calling OpenAI API', requestId, {
    systemLength: systemPrompt.length,
    userLength: userMessage.length,
    maxTokens,
    temperature,
  });

  const response = await secureFetch(
    'https://api.openai.com/v1/chat/completions',
    requestId,
    {
      headers: OpenAIConfig.getHeaders(),
      body: {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        max_tokens: maxTokens,
        temperature,
      },
    }
  );

  const data = await response.json() as OpenAIResponse;
  const content = data.choices?.[0]?.message?.content || '';
  const tokensUsed = data.usage?.total_tokens;

  secureLog('info', 'OpenAI response received', requestId, {
    contentLength: content.length,
    tokensUsed,
  });

  return {
    text: content,
    tokens_used: tokensUsed,
  };
}

// ===================================
// MCP SERVER
// ===================================

const server = new Server(
  {
    name: 'openai-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'curate_response',
        description: 'Processa e limpa resposta de busca usando GPT (fallback)',
        inputSchema: {
          type: 'object',
          properties: {
            content: {
              type: 'string',
              description: 'Conteúdo a ser curado (1-10000 chars)',
              minLength: 1,
              maxLength: 10000,
            },
            context: {
              type: 'string',
              description: 'Contexto da curadoria (opcional, max 500 chars)',
              maxLength: 500,
            },
          },
          required: ['content'],
          additionalProperties: false,
        },
      },
      {
        name: 'answer_arbache',
        description: 'Responde perguntas sobre a Arbache Consulting (fallback)',
        inputSchema: {
          type: 'object',
          properties: {
            question: {
              type: 'string',
              description: 'Pergunta do usuário (1-2000 chars)',
              minLength: 1,
              maxLength: 2000,
            },
            search_results: {
              type: 'string',
              description: 'Resultados de busca (opcional, max 10000 chars)',
              maxLength: 10000,
            },
          },
          required: ['question'],
          additionalProperties: false,
        },
      },
      {
        name: 'generate',
        description: 'Gera texto usando GPT',
        inputSchema: {
          type: 'object',
          properties: {
            prompt: {
              type: 'string',
              description: 'Prompt para geração (1-5000 chars)',
              minLength: 1,
              maxLength: 5000,
            },
            system: {
              type: 'string',
              description: 'System prompt (opcional, max 2000 chars)',
              maxLength: 2000,
            },
            max_tokens: {
              type: 'number',
              description: 'Máximo de tokens (1-4096)',
              minimum: 1,
              maximum: 4096,
            },
            temperature: {
              type: 'number',
              description: 'Temperatura (0-2)',
              minimum: 0,
              maximum: 2,
            },
          },
          required: ['prompt'],
          additionalProperties: false,
        },
      },
      {
        name: 'summarize',
        description: 'Resume um texto longo',
        inputSchema: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'Texto a ser resumido (1-20000 chars)',
              minLength: 1,
              maxLength: 20000,
            },
            max_sentences: {
              type: 'number',
              description: 'Número máximo de sentenças (1-20)',
              minimum: 1,
              maximum: 20,
            },
          },
          required: ['text'],
          additionalProperties: false,
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const requestId = generateRequestId();

  secureLog('info', 'Tool called', requestId, { tool: name });

  try {
    switch (name) {
      case 'curate_response': {
        const validated = CurateInputV1.parse(args);
        const context = validated.context || 'geral';

        const systemPrompt = `Você é um curador de conteúdo. Reescreva o texto de forma natural, removendo todas as referências, citações, links e indicações de fonte. Contexto: ${context}`;

        const result = await callGPT(
          systemPrompt,
          validated.content,
          1024,
          0.7,
          requestId
        );

        const cleanedText = cleanResponse(result.text);
        const output = TextOutputV1.parse({ text: cleanedText, tokens_used: result.tokens_used });

        secureLog('info', 'Tool completed', requestId, { tool: name, success: true });

        return {
          content: [{ type: 'text', text: output.text }],
        };
      }

      case 'answer_arbache': {
        const validated = AnswerInputV1.parse(args);

        const systemPrompt = `Você é o assistente virtual da Arbache Consulting.

REGRAS:
1. Responda APENAS sobre a Arbache Consulting, Ana Paula Arbache, seus serviços e parceiros
2. NUNCA mencione fontes, links ou referências
3. Responda de forma natural, como assistente oficial da empresa
4. Máximo 3-4 parágrafos
5. Use português brasileiro

CONTEXTO:
${ARBACHE_CONTEXT}`;

        const userMessage = validated.search_results
          ? `Pergunta: "${validated.question}"\n\nInformações (remova referências):\n${validated.search_results}`
          : `Pergunta: "${validated.question}"`;

        const result = await callGPT(
          systemPrompt,
          userMessage,
          1024,
          0.7,
          requestId
        );

        const cleanedText = cleanResponse(result.text);
        const output = TextOutputV1.parse({ text: cleanedText, tokens_used: result.tokens_used });

        secureLog('info', 'Tool completed', requestId, { tool: name, success: true });

        return {
          content: [{ type: 'text', text: output.text }],
        };
      }

      case 'generate': {
        const validated = GenerateInputV1.parse(args);
        const system = validated.system || 'Você é um assistente útil.';
        const maxTokens = validated.max_tokens || 1024;
        const temperature = validated.temperature || 0.7;

        const result = await callGPT(
          system,
          validated.prompt,
          maxTokens,
          temperature,
          requestId
        );

        const output = TextOutputV1.parse(result);

        secureLog('info', 'Tool completed', requestId, { tool: name, success: true });

        return {
          content: [{ type: 'text', text: output.text }],
        };
      }

      case 'summarize': {
        const validated = SummarizeInputV1.parse(args);
        const maxSentences = validated.max_sentences || 3;

        const systemPrompt = `Resuma o texto em no máximo ${maxSentences} sentenças. Seja conciso e objetivo.`;

        const result = await callGPT(
          systemPrompt,
          validated.text,
          500,
          0.3,
          requestId
        );

        const output = TextOutputV1.parse(result);

        secureLog('info', 'Tool completed', requestId, { tool: name, success: true });

        return {
          content: [{ type: 'text', text: output.text }],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    secureLog('error', 'Tool failed', requestId, {
      tool: name,
      error: errorMessage,
    });

    return {
      content: [{ type: 'text', text: `Error: ${errorMessage}` }],
      isError: true,
    };
  }
});

// Run server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  const startupId = generateRequestId();
  secureLog('info', 'OpenAI MCP Server started', startupId, {
    hasApiKey: OpenAIConfig.hasApiKey(),
  });
}

main().catch(console.error);
