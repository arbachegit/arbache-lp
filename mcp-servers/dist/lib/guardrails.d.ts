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
export declare const TIMEOUT_MS = 30000;
export declare const MAX_RETRIES = 3;
export declare const BACKOFF_BASE_MS = 1000;
export declare const ALLOWED_HOSTS: string[];
export declare const ALLOWED_PATHS: string[];
interface LogMeta {
    [key: string]: unknown;
}
export declare function secureLog(level: 'info' | 'warn' | 'error', message: string, requestId: string, meta?: LogMeta): void;
export declare function validateUrl(url: string): boolean;
interface SecureFetchOptions {
    method?: 'GET' | 'POST';
    headers?: Record<string, string>;
    body?: unknown;
    retries?: number;
}
export declare function secureFetch(url: string, requestId: string, options?: SecureFetchOptions): Promise<Response>;
export declare const SearchInputV1: z.ZodObject<{
    query: z.ZodString;
    context: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    query: string;
    context?: string | undefined;
}, {
    query: string;
    context?: string | undefined;
}>;
export declare const CurateInputV1: z.ZodObject<{
    content: z.ZodString;
    context: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    content: string;
    context?: string | undefined;
}, {
    content: string;
    context?: string | undefined;
}>;
export declare const AnswerInputV1: z.ZodObject<{
    question: z.ZodString;
    search_results: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    question: string;
    search_results?: string | undefined;
}, {
    question: string;
    search_results?: string | undefined;
}>;
export declare const GenerateInputV1: z.ZodObject<{
    prompt: z.ZodString;
    system: z.ZodOptional<z.ZodString>;
    max_tokens: z.ZodOptional<z.ZodNumber>;
    temperature: z.ZodOptional<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    prompt: string;
    system?: string | undefined;
    max_tokens?: number | undefined;
    temperature?: number | undefined;
}, {
    prompt: string;
    system?: string | undefined;
    max_tokens?: number | undefined;
    temperature?: number | undefined;
}>;
export declare const SummarizeInputV1: z.ZodObject<{
    text: z.ZodString;
    max_sentences: z.ZodOptional<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    text: string;
    max_sentences?: number | undefined;
}, {
    text: string;
    max_sentences?: number | undefined;
}>;
export declare const TextOutputV1: z.ZodObject<{
    text: z.ZodString;
    tokens_used: z.ZodOptional<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    text: string;
    tokens_used?: number | undefined;
}, {
    text: string;
    tokens_used?: number | undefined;
}>;
export declare function cleanResponse(text: string): string;
export declare function generateRequestId(): string;
export {};
//# sourceMappingURL=guardrails.d.ts.map