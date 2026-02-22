/**
 * MCP Server - Anthropic
 * Servidor MCP para curadoria e processamento de texto via Claude
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
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { secureFetch, secureLog, generateRequestId, cleanResponse, CurateInputV1, AnswerInputV1, GenerateInputV1, TextOutputV1, } from '../lib/guardrails.js';
// ===================================
// CONFIG
// ===================================
class AnthropicConfig {
    static apiKey;
    static initialized = false;
    static initialize() {
        if (this.initialized)
            return;
        this.apiKey = process.env.ANTHROPIC_API_KEY;
        this.initialized = true;
    }
    static hasApiKey() {
        return Boolean(this.apiKey);
    }
    static getHeaders() {
        if (!this.apiKey) {
            throw new Error('ANTHROPIC_API_KEY not configured');
        }
        return {
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01',
        };
    }
}
AnthropicConfig.initialize();
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
async function callClaude(systemPrompt, userMessage, maxTokens, requestId) {
    if (!AnthropicConfig.hasApiKey()) {
        throw new Error('ANTHROPIC_API_KEY not configured');
    }
    secureLog('info', 'Calling Anthropic API', requestId, {
        systemLength: systemPrompt.length,
        userLength: userMessage.length,
        maxTokens,
    });
    const response = await secureFetch('https://api.anthropic.com/v1/messages', requestId, {
        headers: AnthropicConfig.getHeaders(),
        body: {
            model: 'claude-3-5-haiku-20241022',
            max_tokens: maxTokens,
            system: systemPrompt,
            messages: [{ role: 'user', content: userMessage }],
        },
    });
    const data = await response.json();
    const content = data.content?.[0]?.text || '';
    const tokensUsed = data.usage
        ? data.usage.input_tokens + data.usage.output_tokens
        : undefined;
    secureLog('info', 'Anthropic response received', requestId, {
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
const server = new Server({
    name: 'anthropic-mcp',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
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
                description: 'Responde perguntas sobre a Arbache Consulting de forma natural',
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
                            description: 'Resultados de busca para usar como base (opcional, max 10000 chars)',
                            maxLength: 10000,
                        },
                    },
                    required: ['question'],
                    additionalProperties: false,
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
                            description: 'Máximo de tokens na resposta (1-4096)',
                            minimum: 1,
                            maximum: 4096,
                        },
                    },
                    required: ['prompt'],
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
                const result = await callClaude(systemPrompt, validated.content, 1024, requestId);
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
                const result = await callClaude(systemPrompt, userMessage, 1024, requestId);
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
                const result = await callClaude(system, validated.prompt, maxTokens, requestId);
                const output = TextOutputV1.parse(result);
                secureLog('info', 'Tool completed', requestId, { tool: name, success: true });
                return {
                    content: [{ type: 'text', text: output.text }],
                };
            }
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
    catch (error) {
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
    secureLog('info', 'Anthropic MCP Server started', startupId, {
        hasApiKey: AnthropicConfig.hasApiKey(),
    });
}
main().catch(console.error);
//# sourceMappingURL=index.js.map