/**
 * Timing Module — detects the "moment clé" from the user's message.
 *
 * 4 moment types (from spec Prompt_DÉTECTION_DU_MOMENT_CLÉ):
 *   exploration     — light curiosity, no urgency
 *   ajustement      — doubt, discomfort, small difficulty
 *   bascule         — major decision, transition, launch
 *   tension_elevee  — high stress, loss of bearings, emotional intensity
 *
 * Adapts: depth, tone, complexity.
 */

export type MomentType =
  | 'exploration'
  | 'ajustement'
  | 'bascule'
  | 'tension_elevee'

type TimingResult = {
  moment: MomentType
  instructionBlock: string
}

// ── Signal patterns ───────────────────────────────────────────────────────────

const TENSION_PATTERNS = [
  /\b(je\s+(suis|me\s+sens?)\s+(perdu[e]?|d[ée]pass[ée]?|[ée]puis[ée]?|d[ée]vast[ée]?))\b/i,
  /\b(je\s+ne\s+sais?\s+plus\s+quoi\s+(faire|penser|d[ée]cider|dire))\b/i,
  /\b(c'est\s+urgent\b|situation\s+(critique|d[ée]sastreuse)|tout\s+s'effondre)\b/i,
  /\b(je\s+(craque|n'en\s+peux\s+plus|suis\s+[àa]\s+bout))\b/i,
  /\b(panique|anxi[ée]t[ée]\s+(intense|forte|envahissante)|d[ée]tresse)\b/i,
  /\b(je\s+ne\s+comprends\s+plus\s+rien|tout\s+va\s+mal|plus\s+aucun\s+rep[eè]re)\b/i,
  /\b(je\s+veux\s+(tout\s+quitter|tout\s+laisser\s+tomber|disparaître))\b/i,
]

const BASCULE_PATTERNS = [
  /\b(je\s+(dois|vais|envisage\s+de?)\s+(d[ée]missionner?|quitter\s+(mon|le)\s+(travail|poste|emploi)))\b/i,
  /\b(rupture\b|s[ée]paration\b|divorc[ée]r?\b|mettre\s+fin\s+[àa])\b/i,
  /\b(d[ée]m[ée]nager?|changer\s+de\s+(ville|pays|vie|direction)\b)\b/i,
  /\b(lancer?\s+(mon|une?)\s+(entreprise|business|activit[ée]|projet\s+majeur))\b/i,
  /\b(je\s+(dois|vais)\s+prendre\s+une\s+d[ée]cision\s+(importante|majeure|d[ée]finitive))\b/i,
  /\b(tournant|bascule|point\s+de\s+non[- ]retour|moment\s+(d[ée]cisif|cl[ée]))\b/i,
  /\b(reconversion\s+(professionnelle)?|changer\s+de\s+m[ée]tier\s+radicalement)\b/i,
]

const AJUSTEMENT_PATTERNS = [
  /\b(j'?h[ée]sit[ee]?\b|je\s+(doute?|ne\s+suis\s+pas\s+s[ûu]r[e]?))\b/i,
  /\b(un\s+peu\s+(fatigué[e]?|perdu[e]?|confus[e]?|incertain[e]?))\b/i,
  /\b(petite?\s+(difficult[ée]|question|probl[eè]me)|l[ée]gèrement?\s+(bloqu[ée]?|limit[ée]?))\b/i,
  /\b(je\s+n'avance\s+pas\s+(trop|bien\s+vite)|un\s+peu\s+en\s+pause)\b/i,
  /\b(inconf[oo]rt\b|mauvaise\s+(ambiance|vibe)|tension\s+(l[ée]g[eè]re|mod[ée]r[ée]))\b/i,
]

const EXPLORATION_PATTERNS = [
  /\b(est[- ]ce\s+que\s+c'est\s+(une?\s+)?bonne\s+p[ée]riode|quelles?\s+sont\s+les?\s+tendances?)\b/i,
  /\b(que\s+m'indique|qu'est[- ]ce\s+que\s+([çc]a\s+dit|ma\s+phase\s+actuelle))\b/i,
  /\b(juste\s+(curieux|curiosit[ée])\b|par\s+curiosit[ée]\b|simplement\s+pour\s+savoir)\b/i,
  /\b(comment\s+([çc]a\s+marche|fonctionne\s+ma\s+phas[e]?)\b)\b/i,
]

// ── Instruction blocks per moment type ────────────────────────────────────────

const MOMENT_INSTRUCTIONS: Record<MomentType, string> = {
  tension_elevee: `[MOMENT CLÉ DÉTECTÉ : TENSION ÉLEVÉE]
Priorité absolue : Stabiliser · Simplifier · Sécuriser.
Adapter la réponse :
- Réponse courte, calme, rassurante
- Éviter toute analyse complexe ou projection long terme
- Donner 1 ancrage concret immédiat
- Éviter toute surcharge d'information
- Ton : chaleureux, posé, sécurisant
- Si souffrance intense → encourager à parler à un proche ou un professionnel
[FIN INSTRUCTION]`,

  bascule: `[MOMENT CLÉ DÉTECTÉ : MOMENT DE BASCULE]
Situation à fort enjeu — décision ou transition majeure.
Adapter la réponse :
- Structure recommandée : situation → phase → risques → opportunités → levier prioritaire → recommandation claire
- Profondeur : élevée
- Ton : structuré, orienté décision
- Identifier le timing optimal (agir / consolider / attendre)
- Donner 1 levier prioritaire clair + max 2 actions secondaires
[FIN INSTRUCTION]`,

  ajustement: `[MOMENT CLÉ DÉTECTÉ : AJUSTEMENT]
Inconfort modéré — doute ou petite difficulté.
Adapter la réponse :
- Clarifier la dynamique en cours
- Ton : stabilisant, rassurant
- Profondeur : moyenne
- Donner 1 à 2 leviers concrets
- Éviter la sur-analyse
[FIN INSTRUCTION]`,

  exploration: `[MOMENT CLÉ DÉTECTÉ : EXPLORATION]
Curiosité légère — aucun enjeu urgent.
Adapter la réponse :
- Légère, inspirante, synthétique
- 1 clé d'action maximum
- Ton : fluide, accessible
- Profondeur : faible à moyenne
[FIN INSTRUCTION]`,
}

// ── Detector ──────────────────────────────────────────────────────────────────

export function detectMoment(message: string): TimingResult {
  const text = message.trim()

  // Order matters — tension overrides everything
  if (TENSION_PATTERNS.some((p) => p.test(text))) {
    return { moment: 'tension_elevee', instructionBlock: MOMENT_INSTRUCTIONS.tension_elevee }
  }
  if (BASCULE_PATTERNS.some((p) => p.test(text))) {
    return { moment: 'bascule', instructionBlock: MOMENT_INSTRUCTIONS.bascule }
  }
  if (AJUSTEMENT_PATTERNS.some((p) => p.test(text))) {
    return { moment: 'ajustement', instructionBlock: MOMENT_INSTRUCTIONS.ajustement }
  }
  if (EXPLORATION_PATTERNS.some((p) => p.test(text))) {
    return { moment: 'exploration', instructionBlock: MOMENT_INSTRUCTIONS.exploration }
  }

  // Default: exploration (safe, non-urgent)
  return { moment: 'exploration', instructionBlock: MOMENT_INSTRUCTIONS.exploration }
}
