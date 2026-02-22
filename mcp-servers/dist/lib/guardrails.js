/**
 * MCP Guardrails - Shared utilities
 *
 * Provides:
 * - Secure logging with request_id
 * - Network allowlist validation
 * - Fetch with timeout + retry + backoff
 * - Input/Output validation helpers
 */
import { z } from 'zod';
// ===================================
// CONFIGURATION
// ===================================
export const TIMEOUT_MS = 30000;
export const MAX_RETRIES = 3;
export const BACKOFF_BASE_MS = 1000;
// Network allowlist
export const ALLOWED_HOSTS = [
    'api.perplexity.ai',
    'api.anthropic.com',
    'api.openai.com',
];
export const ALLOWED_PATHS = [
    '/chat/completions',
    '/v1/messages',
    '/v1/chat/completions',
];
const SENSITIVE_KEYS = [
    'authorization',
    'api_key',
    'apiKey',
    'token',
    'password',
    'secret',
    'key',
];
function sanitizeMeta(meta) {
    const sanitized = {};
    for (const [key, value] of Object.entries(meta)) {
        const lowerKey = key.toLowerCase();
        if (SENSITIVE_KEYS.some(s => lowerKey.includes(s))) {
            continue; // Skip sensitive keys
        }
        sanitized[key] = value;
    }
    return sanitized;
}
export function secureLog(level, message, requestId, meta = {}) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        request_id: requestId,
        ...sanitizeMeta(meta),
    };
    // Use stderr for MCP servers (stdout is for protocol)
    console.error(JSON.stringify(logEntry));
}
// ===================================
// URL VALIDATION
// ===================================
export function validateUrl(url) {
    try {
        const parsed = new URL(url);
        const hostAllowed = ALLOWED_HOSTS.includes(parsed.host);
        const pathAllowed = ALLOWED_PATHS.some(p => parsed.pathname.startsWith(p) || parsed.pathname === p);
        return hostAllowed && pathAllowed;
    }
    catch {
        return false;
    }
}
export async function secureFetch(url, requestId, options = {}) {
    const { method = 'POST', headers = {}, body, retries = MAX_RETRIES } = options;
    // Validate URL against allowlist
    if (!validateUrl(url)) {
        secureLog('error', 'URL not in allowlist', requestId, { url });
        throw new Error(`URL not in allowlist: ${url}`);
    }
    for (let attempt = 0; attempt < retries; attempt++) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
        try {
            secureLog('info', 'HTTP request starting', requestId, {
                url,
                attempt: attempt + 1,
                maxRetries: retries,
            });
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                body: body ? JSON.stringify(body) : undefined,
                signal: controller.signal,
            });
            clearTimeout(timeout);
            if (response.ok) {
                secureLog('info', 'HTTP request successful', requestId, {
                    status: response.status,
                });
                return response;
            }
            secureLog('warn', 'HTTP request failed', requestId, {
                status: response.status,
                attempt: attempt + 1,
            });
            // Don't retry on 4xx (except 429)
            if (response.status >= 400 && response.status < 500 && response.status !== 429) {
                throw new Error(`HTTP ${response.status}`);
            }
        }
        catch (error) {
            clearTimeout(timeout);
            const isAbort = error instanceof Error && error.name === 'AbortError';
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            secureLog(isAbort ? 'warn' : 'error', isAbort ? 'Request timeout' : 'Request error', requestId, {
                error: errorMsg,
                attempt: attempt + 1,
            });
            // Don't retry on non-retryable errors
            if (!isAbort && attempt === retries - 1) {
                throw error;
            }
        }
        // Exponential backoff
        if (attempt < retries - 1) {
            const backoff = BACKOFF_BASE_MS * Math.pow(2, attempt);
            secureLog('info', 'Retrying with backoff', requestId, {
                backoffMs: backoff,
                nextAttempt: attempt + 2,
            });
            await new Promise(r => setTimeout(r, backoff));
        }
    }
    secureLog('error', 'All retries exhausted', requestId, { totalAttempts: retries });
    throw new Error('All retries exhausted');
}
// ===================================
// INPUT SCHEMAS (Versioned)
// ===================================
// Search tool input - v1
export const SearchInputV1 = z.object({
    query: z.string().min(1).max(2000),
    context: z.string().max(500).optional(),
}).strict();
// Curate tool input - v1
export const CurateInputV1 = z.object({
    content: z.string().min(1).max(10000),
    context: z.string().max(500).optional(),
}).strict();
// Answer tool input - v1
export const AnswerInputV1 = z.object({
    question: z.string().min(1).max(2000),
    search_results: z.string().max(10000).optional(),
}).strict();
// Generate tool input - v1
export const GenerateInputV1 = z.object({
    prompt: z.string().min(1).max(5000),
    system: z.string().max(2000).optional(),
    max_tokens: z.number().int().min(1).max(4096).optional(),
    temperature: z.number().min(0).max(2).optional(),
}).strict();
// Summarize tool input - v1
export const SummarizeInputV1 = z.object({
    text: z.string().min(1).max(20000),
    max_sentences: z.number().int().min(1).max(20).optional(),
}).strict();
// ===================================
// OUTPUT SCHEMAS (Versioned)
// ===================================
export const TextOutputV1 = z.object({
    text: z.string(),
    tokens_used: z.number().optional(),
}).strict();
// ===================================
// RESPONSE CLEANING
// ===================================
export function cleanResponse(text) {
    let cleaned = text;
    // Remove reference markers [1], [2], etc.
    cleaned = cleaned.replace(/\[\d+\]/g, '');
    // Remove URLs
    cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, '');
    // Remove source citations
    cleaned = cleaned.replace(/(?:Source|Fonte|Reference|Referência|According to|De acordo com|Segundo)[:\s].*/gi, '');
    // Remove year citations
    cleaned = cleaned.replace(/\(.*?(?:2024|2025|2026).*?\)/g, '');
    // Clean up whitespace
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();
    return cleaned;
}
// ===================================
// UUID GENERATOR
// ===================================
export function generateRequestId() {
    return crypto.randomUUID();
}
//# sourceMappingURL=guardrails.js.map