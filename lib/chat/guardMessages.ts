import type { UserIntent } from './intentClassifier'

/**
 * Standardized guard messages — on-brand, calm, non-aggressive.
 * Multiple variants per decision to avoid repetition.
 */

// ── Redirect messages (general_assistant) ─────────────────────────────────

const REDIRECT_MESSAGES = [
  `HexAstra est conçu pour t'aider à comprendre une situation et clarifier tes choix — pas comme assistant universel.

Si tu veux, parle-moi d'une situation que tu vis actuellement. Je suis là pour ça.`,

  `Je ne suis pas le bon outil pour ce type de demande. Mon domaine, c'est la compréhension des situations de vie et l'aide à la décision.

Y a-t-il quelque chose dans ta vie en ce moment que tu aimerais clarifier ou explorer ?`,

  `Ce n'est pas dans mon champ d'action. HexAstra est dédié aux situations personnelles, relationnelles et professionnelles.

Dis-moi ce qui se passe vraiment pour toi — je peux t'aider à y voir plus clair.`,
]

// ── Blocked messages by category ──────────────────────────────────────────

const BLOCKED_BY_INTENT: Partial<Record<UserIntent, string[]>> = {
  technical_question: [
    `Je ne peux pas répondre aux questions techniques ou informatiques.

HexAstra est dédié à la compréhension des situations de vie, des relations et des décisions personnelles. Si une situation professionnelle ou personnelle t'amène à te poser des questions, je suis là pour t'aider à la clarifier.`,
  ],

  academic_question: [
    `Les devoirs et exercices scolaires ne font pas partie de mon domaine.

HexAstra accompagne les personnes sur leurs situations de vie, leurs choix et leur évolution personnelle. Si tu traverses une période difficile ou une décision importante, je suis là.`,
  ],

  practical_task: [
    `Ce type de demande pratique dépasse mon périmètre.

Mon rôle est d'aider à comprendre une situation, clarifier un choix ou identifier un levier d'action dans ta vie. Si tu as quelque chose à démêler de ce côté-là, je suis disponible.`,
  ],

  medical_question: [
    `Je ne peux pas répondre à des questions médicales. Pour tout sujet de santé, consulte un professionnel de santé.

Si cette situation crée une charge émotionnelle ou un questionnement dans ta vie, je peux t'aider à y voir plus clair sur ce plan-là.`,
  ],

  legal_question: [
    `Les questions juridiques ou fiscales sont hors de mon champ d'action. Pour ces sujets, un avocat ou un conseiller juridique est plus adapté.

Si la situation derrière cette question crée de l'incertitude ou une décision à prendre, je peux t'aider à clarifier ce qui se joue pour toi.`,
  ],
}

// ── Generic blocked fallback ───────────────────────────────────────────────

const BLOCKED_DEFAULT = [
  `Je ne peux pas répondre à ce type de demande.

HexAstra est dédié à la compréhension des situations de vie et à l'orientation personnelle. Si tu as une situation à démêler ou une décision à prendre, parle-moi de ce que tu vis.`,

  `Cette demande sort de mon domaine d'action.

Mon rôle est d'éclairer, clarifier et orienter — sur ta vie, tes choix, tes dynamiques. Si c'est ça que tu cherches, je suis là.`,
]

// ── Pickers ───────────────────────────────────────────────────────────────

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function getRedirectMessage(): string {
  return pickRandom(REDIRECT_MESSAGES)
}

export function getBlockedMessage(intent: UserIntent): string {
  const specific = BLOCKED_BY_INTENT[intent]
  if (specific && specific.length > 0) return pickRandom(specific)
  return pickRandom(BLOCKED_DEFAULT)
}
