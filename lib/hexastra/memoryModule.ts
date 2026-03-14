/**
 * Memory Module — analyses conversation history to extract session context.
 *
 * Builds a memory context block that tells the AI:
 * - What theme/subject is currently active
 * - What's already been covered (avoid repeating)
 * - User's detected phase in the conversation
 * - Continuity instructions
 */

type ChatMsg = { role: 'user' | 'assistant'; content: string }

export type SessionPhase =
  | 'exploration'    // first questions, discovery
  | 'clarification'  // going deeper on a theme
  | 'decision'       // converging toward a choice
  | 'action'         // ready to move, concrete steps needed

type ActiveTheme =
  | 'amour_relations'
  | 'travail_argent'
  | 'bien_etre'
  | 'decision'
  | 'timing_cycle'
  | 'evolution_personnelle'
  | 'general'
  | null

export type MemoryContext = {
  theme: ActiveTheme
  phase: SessionPhase
  messageCount: number
  instructionBlock: string | null
}

// ── Theme detection ───────────────────────────────────────────────────────────

const THEME_PATTERNS: Array<{ theme: ActiveTheme; patterns: RegExp[] }> = [
  {
    theme: 'amour_relations',
    patterns: [
      /\b(relation|couple|amour|rupture|ex\b|famille|s[ée]paration|rencontre|ami[s]?)\b/i,
    ],
  },
  {
    theme: 'travail_argent',
    patterns: [
      /\b(travail|carri[eè]re|emploi|job\b|argent|finances?|projet\s+pro|entreprise)\b/i,
    ],
  },
  {
    theme: 'bien_etre',
    patterns: [
      /\b(fatigue|stress|[ée]puisement|confiance\s+en\s+moi|bien[- ]Ãªtre|anxi[ée]t[ée]|surcharge)\b/i,
    ],
  },
  {
    theme: 'decision',
    patterns: [
      /\b(d[ée]cision|choisir|h[ée]siter|quel\s+choix|que\s+faire|rester\s+ou\s+partir)\b/i,
    ],
  },
  {
    theme: 'timing_cycle',
    patterns: [
      /\b(timing|quand\s+agir|bon\s+moment|cycle|p[ée]riode\s+favorable|prochains\s+mois)\b/i,
    ],
  },
  {
    theme: 'evolution_personnelle',
    patterns: [
      /\b(blocage|[ée]voluer|grandir|potentiel|sens\s+de\s+ma\s+vie|qui\s+je\s+suis)\b/i,
    ],
  },
]

function detectTheme(messages: ChatMsg[]): ActiveTheme {
  const userText = messages
    .filter((m) => m.role === 'user')
    .map((m) => m.content)
    .join(' ')

  const scores = new Map<ActiveTheme, number>()

  for (const entry of THEME_PATTERNS) {
    let score = 0
    for (const pattern of entry.patterns) {
      if (pattern.test(userText)) score++
    }
    if (score > 0) scores.set(entry.theme, score)
  }

  if (scores.size === 0) return 'general'

  let best: ActiveTheme = 'general'
  let bestScore = 0
  for (const [k, v] of scores) {
    if (v > bestScore) { bestScore = v; best = k }
  }
  return best
}

function detectPhase(messages: ChatMsg[]): SessionPhase {
  const userMessages = messages.filter((m) => m.role === 'user')
  const n = userMessages.length

  if (n <= 1) return 'exploration'

  const recentText = userMessages.slice(-3).map((m) => m.content).join(' ')

  if (/\b(je\s+vais|je\s+d[ée]cide|j'?ai\s+d[ée]cid[ée]|je\s+passe\s+[àa]\s+l'?action)\b/i.test(recentText)) {
    return 'action'
  }
  if (/\b(que\s+faire|quel\s+choix|je\s+ne\s+sais?\s+pas\s+si|d[ée]cision)\b/i.test(recentText)) {
    return 'decision'
  }
  if (n >= 3) return 'clarification'
  return 'exploration'
}

const THEME_LABELS: Record<Exclude<ActiveTheme, null>, string> = {
  amour_relations:      'Amour / Relations',
  travail_argent:       'Travail / Argent',
  bien_etre:            'Bien-être / État intérieur',
  decision:             'Décision à prendre',
  timing_cycle:         'Timing / Cycle',
  evolution_personnelle: 'Évolution personnelle',
  general:              'Général',
}

// ── Memory builder ────────────────────────────────────────────────────────────

export function buildMemoryContext(messages: ChatMsg[]): MemoryContext {
  const userMessages = messages.filter((m) => m.role === 'user')

  if (userMessages.length === 0) {
    return { theme: null, phase: 'exploration', messageCount: 0, instructionBlock: null }
  }

  const theme = detectTheme(messages)
  const phase = detectPhase(messages)
  const messageCount = userMessages.length

  const lines: string[] = [
    `[MÉMOIRE DE SESSION — UTILISATION IMPLICITE UNIQUEMENT]`,
  ]

  if (theme && theme !== 'general') {
    lines.push(`Thème actif : ${THEME_LABELS[theme]}`)
  }

  if (phase === 'clarification') {
    lines.push(`Phase utilisateur : Approfondissement — rester dans le même sujet, augmenter la précision.`)
    lines.push(`Éviter : demander "quel domaine souhaitez-vous explorer" — le thème est déjà connu.`)
  } else if (phase === 'decision') {
    lines.push(`Phase utilisateur : Convergence vers une décision — structurer les options, donner un levier clair.`)
  } else if (phase === 'action') {
    lines.push(`Phase utilisateur : Prêt à agir — réponse orientée passage à l'action, étapes concrètes.`)
  } else {
    lines.push(`Phase utilisateur : Exploration initiale — ton ouvert, questions légères, orientation découverte.`)
  }

  if (messageCount >= 3 && theme !== 'general') {
    lines.push(`Continuité : ne pas redemander les informations déjà données dans cette session.`)
  }

  lines.push(`[FIN MÉMOIRE DE SESSION]`)

  return {
    theme,
    phase,
    messageCount,
    instructionBlock: lines.join('\n'),
  }
}
