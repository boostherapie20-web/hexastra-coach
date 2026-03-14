/**
 * Theme Tracker — detects the dominant life theme from a message.
 *
 * Themes are broad life areas. The tracker scores pattern matches
 * and returns the highest-scoring theme along with its match count.
 */

type ThemeSignal = {
  theme: string
  patterns: RegExp[]
}

const THEME_SIGNALS: ThemeSignal[] = [
  {
    theme: 'travail',
    patterns: [
      /travail|boulot|emploi|poste|carrière|professionnel|entreprise/i,
      /collègue|patron|boss|manager|job|recrutement/i,
      /reconversion|promotion|licenciement|démission|burn.?out professionnel/i,
      /télétravail|freelance|indépendant|salarié/i,
    ],
  },
  {
    theme: 'relation',
    patterns: [
      /couple|amour|relation amoureuse|partenaire|conjoint/i,
      /mariage|séparation|divorce|rupture (amoureuse|de couple)/i,
      /ami(s|e(s)?)|famille|enfant(s)?|parent(s)?|frère|sœur/i,
      /conflit (relationnel|avec)/i,
    ],
  },
  {
    theme: 'décision',
    patterns: [
      /je dois décider|décision|faire un choix|hésit/i,
      /option(s)?|alternative(s)?|dilemme/i,
      /que faire|comment choisir|je ne sais pas quoi/i,
      /partir ou rester|changer ou non/i,
    ],
  },
  {
    theme: 'équilibre',
    patterns: [
      /fatigue|stress|surcharge|épuisement|burn.?out/i,
      /équilibre|bien.?être|énergie|repos|récupération/i,
      /anxiété|angoisse|nerveux|débordé/i,
      /mental(ement)?|émotionnel(lement)?/i,
    ],
  },
  {
    theme: 'sens',
    patterns: [
      /sens (de ma vie|profond|de tout)/i,
      /purpose|mission|pourquoi|raison d'être/i,
      /je (ne sais plus|cherche) qui je suis/i,
      /direction de vie|fil conducteur|vocation/i,
    ],
  },
  {
    theme: 'projet',
    patterns: [
      /projet|lancer|créer|startup|idée de business/i,
      /entreprendre|entrepreneuriat|création d'entreprise/i,
      /plan d'action|stratégie|objectif (à atteindre|important)/i,
    ],
  },
  {
    theme: 'finances',
    patterns: [
      /argent|finances|revenus|dépenses|dette|économies/i,
      /salaire|budget|investissement|patrimoine/i,
      /difficultés financières|manque d'argent/i,
    ],
  },
  {
    theme: 'transition',
    patterns: [
      /transition|tournant|nouveau chapitre/i,
      /tout change|grand changement|période charnière/i,
      /après (le divorce|la rupture|le licenciement|le deuil)/i,
    ],
  },
]

export type ThemeDetectionResult = {
  theme: string | null
  score: number
}

export function detectDominantTheme(text: string): ThemeDetectionResult {
  if (!text.trim()) return { theme: null, score: 0 }

  const scores: Record<string, number> = {}

  for (const signal of THEME_SIGNALS) {
    const matchCount = signal.patterns.reduce(
      (acc, p) => acc + (p.test(text) ? 1 : 0),
      0,
    )
    if (matchCount > 0) {
      scores[signal.theme] = (scores[signal.theme] ?? 0) + matchCount
    }
  }

  const entries = Object.entries(scores).sort(([, a], [, b]) => b - a)
  if (entries.length === 0) return { theme: null, score: 0 }

  return { theme: entries[0][0], score: entries[0][1] }
}
