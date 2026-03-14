/**
 * Session Summarizer — generates a compact 3–5 line summary of an exchange.
 *
 * Purpose: give the next session just enough context to continue
 * without re-reading the full conversation history.
 * No LLM call — pure heuristic extraction.
 */

type SummaryInput = {
  userMessage: string
  assistantResponse: string
  dominantTheme?: string
  currentPhase?: string
}

/** Extract the key lever or recommendation from the assistant response */
function extractKeyDirection(response: string): string | null {
  // Look for the lever/recommendation block patterns used by HexAstra
  const patterns = [
    /Le levier prioritaire[^:]*:\s*→?\s*([^\n]{15,120})/i,
    /Levier principal\s*:\s*([^\n]{15,120})/i,
    /Recommandation\s*:\s*([^\n]{15,120})/i,
    /Direction\s*:\s*([^\n]{15,100})/i,
    /→\s*([A-ZÀÂÄÉÈÊËÏÎÔÙÛÜ][^\n]{15,100})/,
  ]
  for (const p of patterns) {
    const m = response.match(p)
    if (m?.[1]) return m[1].replace(/[*_]/g, '').trim().slice(0, 100)
  }
  return null
}

/** Extract a concise subject from the user message */
function extractSubject(message: string): string {
  return message
    .replace(/\[.*?\]/g, '')   // strip injection labels
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 100)
}

export function buildSessionSummary(input: SummaryInput): string {
  const parts: string[] = []

  if (input.dominantTheme) {
    parts.push(`Thème : ${input.dominantTheme}`)
  }

  if (input.currentPhase && input.currentPhase !== 'unknown') {
    const phaseLabels: Record<string, string> = {
      expansion: 'expansion',
      stabilisation: 'stabilisation',
      transition: 'transition',
      contraction: 'retrait/récupération',
    }
    parts.push(`Phase : ${phaseLabels[input.currentPhase] ?? input.currentPhase}`)
  }

  const subject = extractSubject(input.userMessage)
  if (subject) {
    const suffix = input.userMessage.length > 100 ? '…' : ''
    parts.push(`Sujet : ${subject}${suffix}`)
  }

  const direction = extractKeyDirection(input.assistantResponse)
  if (direction) {
    parts.push(`Orientation donnée : ${direction}`)
  }

  return parts.slice(0, 4).join(' · ')
}
