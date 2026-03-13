/**
 * NeuroKua Module — builds a neuro-energetic context synthesis.
 *
 * Based on: KS.NeuroKua.System.V1
 * Produces orientation axes (Sud/Nord/Est/Ouest) + color + behavior guidance
 * tailored to detected state. Never shows percentages or technical mechanics.
 *
 * This module is lightweight — it provides contextual instructions
 * to the AI, not a full analysis. The AI performs the actual NeuroKua
 * reading using the Vector Store resources.
 */

import type { MomentType } from './timingModule'
import type { DominantPotential } from './potentialModule'

type NeurokuaState = 'activation' | 'recuperation' | 'concentration' | 'equilibre_emotionnel'

export type NeurokuaResult = {
  state: NeurokuaState
  instructionBlock: string
}

// ── State derivation ──────────────────────────────────────────────────────────

function deriveNeurokuaState(
  moment: MomentType,
  potential: DominantPotential,
): NeurokuaState {
  // Tension élevée → always prioritize emotional balance
  if (moment === 'tension_elevee') return 'equilibre_emotionnel'

  // Bascule + creation/influence → activation (need energy to decide & act)
  if (moment === 'bascule') {
    if (potential === 'creation' || potential === 'influence') return 'activation'
    return 'concentration'
  }

  // Ajustement → usually need rest or balance
  if (moment === 'ajustement') {
    if (potential === 'exploration') return 'equilibre_emotionnel'
    return 'recuperation'
  }

  // Exploration + potential hints
  if (potential === 'creation' || potential === 'influence') return 'activation'
  if (potential === 'structuration') return 'concentration'
  if (potential === 'accompagnement') return 'equilibre_emotionnel'

  return 'concentration' // safe default
}

// ── Context instructions per state ────────────────────────────────────────────

const STATE_INSTRUCTIONS: Record<NeurokuaState, string> = {
  activation: `[NEUROKUA — ÉTAT : ACTIVATION]
Axe prioritaire : Sud (action, élan, passage à l'acte).
Couleur de soutien : Rouge ou Orange — pour activer l'élan.
Comportement conseillé : initier une action concrète, même petite.
Orienter vers : mouvement, décision, engagement.
Eviter dans la réponse : conseils de pause ou d'attente passive.
[FIN INSTRUCTION]`,

  recuperation: `[NEUROKUA — ÉTAT : RÉCUPÉRATION]
Axe prioritaire : Nord (repos, ralentissement, recharge).
Couleur de soutien : Blanc ou tons neutres — pour calmer.
Comportement conseillé : réduire les actions, prioriser le repos.
Orienter vers : simplification, réduction de charge, permission de souffler.
Eviter dans la réponse : liste longue d'actions, stratégies complexes.
[FIN INSTRUCTION]`,

  concentration: `[NEUROKUA — ÉTAT : CLARTÉ MENTALE]
Axe prioritaire : Est (concentration, apprentissage, focus).
Couleur de soutien : Bleu — pour clarifier et concentrer.
Comportement conseillé : focus sur une seule priorité, éliminer le bruit.
Orienter vers : clarification, décision posée, étapes ordonnées.
Eviter dans la réponse : dispersion ou trop d'options simultanées.
[FIN INSTRUCTION]`,

  equilibre_emotionnel: `[NEUROKUA — ÉTAT : ÉQUILIBRE ÉMOTIONNEL]
Axe prioritaire : Ouest (équilibre, détente, stabilisation).
Couleur de soutien : Doré ou ambiance chaleureuse — pour apaiser.
Comportement conseillé : ralentir, se recentrer, se connecter à soi.
Orienter vers : ancrage, confiance, permission de ressentir sans agir tout de suite.
Eviter dans la réponse : analyse froide ou trop stratégique, absence d'humanité.
[FIN INSTRUCTION]`,
}

// ── Builder ───────────────────────────────────────────────────────────────────

export function buildNeurokuaContext(
  moment: MomentType,
  potential: DominantPotential,
): NeurokuaResult {
  const state = deriveNeurokuaState(moment, potential)
  return {
    state,
    instructionBlock: STATE_INSTRUCTIONS[state],
  }
}
