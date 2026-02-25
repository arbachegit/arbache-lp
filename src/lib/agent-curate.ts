// ===================================
// AGENT CURATE — client-side response cleaning
// Second layer of protection after backend curation
// ===================================

/** Remove referências numéricas [1], [2], etc. */
function removeReferences(text: string): string {
  return text.replace(/\[\d+\]/g, '')
}

/** Remove frases atributivas (segundo o, de acordo com, conforme, fonte:). */
function removeAttributions(text: string): string {
  return text.replace(
    /(?:segundo\s+[oa]|de\s+acordo\s+com|conforme|fonte\s*:|referência\s*:)[^.]*\./gi,
    '',
  )
}

/** Remove menções a LLMs e provedores de IA. */
function removeLLMMentions(text: string): string {
  return text.replace(
    /\b(OpenAI|ChatGPT|Claude|Anthropic|Google|Gemini|Perplexity|GPT-?\d*|Llama|Meta\s+AI)\b/gi,
    '',
  )
}

/** Remove URLs. */
function removeURLs(text: string): string {
  return text.replace(/https?:\/\/[^\s)]+/g, '')
}

/** Remove referências a anos entre parênteses. */
function removeYearRefs(text: string): string {
  return text.replace(/\(.*?(?:202[4-9]).*?\)/g, '')
}

/** Colapsa múltiplas quebras de linha. */
function collapseNewlines(text: string): string {
  return text.replace(/\n{3,}/g, '\n\n')
}

/** Remove espaços duplos. */
function collapseSpaces(text: string): string {
  return text.replace(/ {2,}/g, ' ')
}

/**
 * Pipeline completo de curadoria de resposta.
 * Executa todas as limpezas em sequência.
 */
export function curateResponse(text: string): string {
  let cleaned = text
  cleaned = removeReferences(cleaned)
  cleaned = removeAttributions(cleaned)
  cleaned = removeLLMMentions(cleaned)
  cleaned = removeURLs(cleaned)
  cleaned = removeYearRefs(cleaned)
  cleaned = collapseNewlines(cleaned)
  cleaned = collapseSpaces(cleaned)
  return cleaned.trim()
}

/**
 * Trunca texto para um número máximo de linhas.
 * Linhas vazias não contam.
 */
export function truncateToLines(text: string, maxLines: number = 5): string {
  const lines = text.split('\n').filter((l) => l.trim())
  if (lines.length <= maxLines) return text
  return lines.slice(0, maxLines).join('\n')
}
