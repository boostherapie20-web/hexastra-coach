/**
 * Potential Module — detects the user's dominant potential axis.
 *
 * 5 axes (from spec Prompt_DÉTECTION_DU_POTENTIEL_DOMINANT):
 *   creation        — produce, invent, launch, express
 *   influence       — convince, lead, communicate, impact
 *   structuration   — organize, secure, plan, build
 *   accompagnement  — help, support, transmit, guide
 *   exploration     — discover, change, innovate, move
 *
 * Used to tailor action levers to the person's natural way of operating.
 */

export type DominantPotential =
  | 'creation'
  | 'influence'
  | 'structuration'
  | 'accompagnement'
  | 'exploration'
  | null  // not enough signal

type PotentialResult = {
  potential: DominantPotential
  instructionBlock: string | null
}

// ── Signal patterns ───────────────────────────────────────────────────────────

const POTENTIAL_PATTERNS: Array<{ potential: DominantPotential; patterns: RegExp[] }> = [
  {
    potential: 'creation',
    patterns: [
      /\b(j'?ai\s+(des\s+)?id[ée]es?\b|je\s+veux\s+(cr[ée]er?|inventer?|lancer?))\b/i,
      /\b(cr[ée]ativit[ée]|cr[ée]ateur?|projet\s+(cr[ée]atif|artistique|original))\b/i,
      /\b(j'?ai\s+besoin\s+de\s+libert[ée]|trop\s+de\s+contraintes\s+m[e']?[ée]touffe)\b/i,
      /\b(exprimer?\s+(ma\s+)?vision|r[ée]aliser?\s+quelque\s+chose\s+de\s+concret)\b/i,
      /\b(contenu\b|[ée]criture\b|art\b|design\b|musique\b|podcast\b)\b/i,
    ],
  },
  {
    potential: 'influence',
    patterns: [
      /\b(convaincre?|fÃ©d[ée]rer?|rassembler?|inspirer?\s+(les\s+autres|mon\s+[ée]quipe))\b/i,
      /\b(communiquer?|visibilit[ée]|impact\s+(sur\s+les\s+autres|sur\s+mon\s+entourage))\b/i,
      /\b(leadership\b|leader\b|manager|influencer?|porter?\s+(la\s+)?voix)\b/i,
      /\b(reconnaissance\b|besoin\s+d'Ãªtre\s+(reconnu[e]?|valoris[ée]?))\b/i,
      /\b(r[ée]seau\s+professionnel|se\s+faire\s+(conna[iî]tre|remarquer?))\b/i,
    ],
  },
  {
    potential: 'structuration',
    patterns: [
      /\b(organiser?|planifier?|s[ée]curiser?|construire?\s+dans\s+la\s+dur[ée]e)\b/i,
      /\b(besoin\s+de\s+(cadre|structure|clart[ée]|r[ée]gles?|m[ée]thode))\b/i,
      /\b(Ã©tapes?\s+progressives?|proc[ée]dure\b|processus\b|optimiser?)\b/i,
      /\b(stabilit[ée]\s+(financi[eè]re|professionnelle|personnelle)|s[ée]curit[ée]\s+d'abord)\b/i,
      /\b(sens\s+des\s+responsabilit[ée]s?|fiable\b|rigoureux\b|m[ée]thodique\b)\b/i,
    ],
  },
  {
    potential: 'accompagnement',
    patterns: [
      /\b(aider?\s+(les\s+autres|les?\s+gens|mon\s+entourage)|soutenir?|accompagner?)\b/i,
      /\b(transmettre?|enseigner?|coacher?|mentor\b|th[ée]rapeute\b|conseiller\b)\b/i,
      /\b(empathie\b|empathique\b|je\s+(ressens?|perçois?)\s+(les\s+)?[ée]motions?\s+des\s+autres)\b/i,
      /\b(posture\s+de\s+soutien|Orient[ée]\s+vers\s+l'humain|service\s+aux\s+autres)\b/i,
      /\b(rÃ´le\s+de\s+(guide|facilitateur|m[ée]diateur)|cr[ée]er?\s+du\s+lien)\b/i,
    ],
  },
  {
    potential: 'exploration',
    patterns: [
      /\b(besoin\s+de\s+nouveaut[ée]|curiosit[ée]\s+naturelle|j'?aime\s+(changer?|explorer?))\b/i,
      /\b(difficult[ée]\s+avec\s+la\s+routine|me\s+lasse\s+(vite|rapidement)|besoin\s+de\s+stimulation)\b/i,
      /\b(voyage[r]?\b|mobilit[ée]\b|d[ée]couverte\b|exp[ée]riences?\s+nouvelles?)\b/i,
      /\b(polyvalent[e]?\b|touche[- ][àa][- ]tout\b|int[ée]r[eê]ts\s+multiples)\b/i,
      /\b(changer?\s+souvent\s+de\s+(cap|direction|projet)|je\s+me\s+lasse\s+vite)\b/i,
    ],
  },
]

// ── Instruction blocks per potential ─────────────────────────────────────────

const POTENTIAL_INSTRUCTIONS: Record<Exclude<DominantPotential, null>, string> = {
  creation: `[POTENTIEL DOMINANT DÉTECTÉ : CRÉATION]
Orienter les leviers vers l'action, l'initiative, l'expression.
Favoriser : proposer de lancer, de concrétiser, de s'exprimer.
Éviter : conseils trop rigides ou environnements contraignants.
Formulation : "Ton fonctionnement naturel semble plus efficace lorsque tu peux créer et initier."
[FIN INSTRUCTION]`,

  influence: `[POTENTIEL DOMINANT DÉTECTÉ : INFLUENCE]
Orienter les leviers vers la visibilité, la communication, le positionnement.
Favoriser : conseils sur l'impact relationnel, la prise de parole, le rayonnement.
Éviter : conseils d'isolation ou de repli.
Formulation : "Ton fonctionnement naturel semble orienté vers l'impact sur les autres."
[FIN INSTRUCTION]`,

  structuration: `[POTENTIEL DOMINANT DÉTECTÉ : STRUCTURATION]
Orienter les leviers vers la planification, la sécurisation, les étapes progressives.
Favoriser : conseils concrets avec des étapes claires, validation avant action.
Éviter : conseils impulsifs ou sans cadre.
Formulation : "Ton fonctionnement naturel semble plus efficace dans un cadre clair et sécurisé."
[FIN INSTRUCTION]`,

  accompagnement: `[POTENTIEL DOMINANT DÉTECTÉ : ACCOMPAGNEMENT]
Orienter les leviers vers la relation, la transmission, le rôle de guide.
Favoriser : conseils sur la qualité du lien, la posture d'écoute, la transmission.
Éviter : conseils purement individualistes ou compétitifs.
Formulation : "Ton fonctionnement naturel semble orienté vers le soutien et la relation."
[FIN INSTRUCTION]`,

  exploration: `[POTENTIEL DOMINANT DÉTECTÉ : EXPLORATION]
Orienter les leviers vers la diversité, la flexibilité, les expériences nouvelles.
Favoriser : conseils sur l'adaptation, l'ouverture, les projets évolutifs.
Éviter : conseils de sur-stabilisation ou de rigidité.
Formulation : "Ton fonctionnement naturel semble plus efficace dans la variété et le mouvement."
[FIN INSTRUCTION]`,
}

// ── Detector ──────────────────────────────────────────────────────────────────

export function detectPotential(message: string, history: string[] = []): PotentialResult {
  const fullText = [message, ...history.slice(-4)].join(' ')

  const scores = new Map<Exclude<DominantPotential, null>, number>()

  for (const entry of POTENTIAL_PATTERNS) {
    if (!entry.potential) continue
    let score = 0
    for (const pattern of entry.patterns) {
      if (pattern.test(fullText)) score++
    }
    if (score > 0) scores.set(entry.potential as Exclude<DominantPotential, null>, score)
  }

  if (scores.size === 0) {
    return { potential: null, instructionBlock: null }
  }

  // Pick highest score
  let best: Exclude<DominantPotential, null> = 'creation'
  let bestScore = 0
  for (const [k, v] of scores) {
    if (v > bestScore) { bestScore = v; best = k }
  }

  return {
    potential: best,
    instructionBlock: POTENTIAL_INSTRUCTIONS[best],
  }
}
