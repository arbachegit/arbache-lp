/**
 * MCP Server - Perplexity
 * Servidor MCP para busca de informações via Perplexity AI
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
import { secureFetch, secureLog, generateRequestId, SearchInputV1, TextOutputV1, } from '../lib/guardrails.js';
// ===================================
// CONFIG (não acessa process.env diretamente no runtime)
// ===================================
class PerplexityConfig {
    static apiKey;
    static initialized = false;
    static initialize() {
        if (this.initialized)
            return;
        this.apiKey = process.env.PERPLEXITY_API_KEY;
        this.initialized = true;
    }
    static hasApiKey() {
        return Boolean(this.apiKey);
    }
    static getHeaders() {
        if (!this.apiKey) {
            throw new Error('PERPLEXITY_API_KEY not configured');
        }
        return {
            Authorization: `Bearer ${this.apiKey}`,
        };
    }
}
// Initialize on load
PerplexityConfig.initialize();
async function searchPerplexity(query, context, requestId) {
    if (!PerplexityConfig.hasApiKey()) {
        throw new Error('PERPLEXITY_API_KEY not configured');
    }
    const systemPrompt = context
        ? `Você está pesquisando informações sobre: ${context}. Responda de forma objetiva e factual.`
        : 'Responda de forma objetiva e factual.';
    secureLog('info', 'Calling Perplexity API', requestId, { queryLength: query.length });
    const response = await secureFetch('https://api.perplexity.ai/chat/completions', requestId, {
        headers: PerplexityConfig.getHeaders(),
        body: {
            model: 'llama-3.1-sonar-small-128k-online',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: query },
            ],
            max_tokens: 1000,
            temperature: 0.2,
        },
    });
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    const tokensUsed = data.usage?.total_tokens;
    secureLog('info', 'Perplexity response received', requestId, {
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
    name: 'perplexity-mcp',
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
                name: 'search',
                description: 'Busca informações na web usando Perplexity AI',
                inputSchema: {
                    type: 'object',
                    properties: {
                        query: {
                            type: 'string',
                            description: 'A consulta de busca (1-2000 chars)',
                            minLength: 1,
                            maxLength: 2000,
                        },
                        context: {
                            type: 'string',
                            description: 'Contexto adicional para a busca (opcional, max 500 chars)',
                            maxLength: 500,
                        },
                    },
                    required: ['query'],
                    additionalProperties: false,
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
                            description: 'A consulta específica sobre Arbache Consulting (1-2000 chars)',
                            minLength: 1,
                            maxLength: 2000,
                        },
                    },
                    required: ['query'],
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
            case 'search': {
                // Validate input with Zod
                const validated = SearchInputV1.parse(args);
                const result = await searchPerplexity(validated.query, validated.context, requestId);
                // Validate output
                const output = TextOutputV1.parse(result);
                secureLog('info', 'Tool completed', requestId, { tool: name, success: true });
                return {
                    content: [{ type: 'text', text: output.text }],
                };
            }
            case 'search_arbache': {
                // Validate input
                const validated = SearchInputV1.pick({ query: true }).parse(args);
                const result = await searchPerplexity(validated.query, 'Arbache Consulting, Ana Paula Arbache, consultoria em educação corporativa, liderança e ESG', requestId);
                // Validate output
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
    secureLog('info', 'Perplexity MCP Server started', startupId, {
        hasApiKey: PerplexityConfig.hasApiKey(),
    });
}
main().catch(console.error);
//# sourceMappingURL=index.js.map