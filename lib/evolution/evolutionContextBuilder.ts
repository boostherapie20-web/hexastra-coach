/**
 * Evolution Context Builder — prepares the compact context block
 * to inject into the OpenAI prompt before the conversation messages.
 *
 * Budget target: ~300–600 chars (≈ 80–150 tokens).
 * Only non-empty, non-trivial fields are included.
 */

import type { UserEvolutionProfile } from '@/types/evolution'

const ZONE_LABELS: Record<string, string> = {
  security: 'Sécurité / Stabilité',
  relationship: 'Relations / Couple',
  identity: 'Identité / Confiance',
  direction: 'Direction de vie',
  personal_expansion: 'Expansion personnelle',
  meaning: 'Sens / Purpose',
}

const PHASE_LABELS: Record<string, string> = {
  expansion: 'Expansion — dynamique active, élan',
  stabilisation: 'Stabilisation — consolidation, maintien du cap',
  transition: 'Transition — changement structurel en cours',
  contraction: 'Retrait / Récupération — besoin de pause',
}

const POTENTIAL_LABELS: Record<string, string> = {
  creation: 'Création — initier, lancer, exprimer',
  influence: 'Influence — fédérer, convaincre, impacter',
  structuration: 'Structuration — organiser, sécuriser, construire',
  accompagnement: 'Accompagnement — soutenir, guider, transmettre',
  exploration: 'Exploration — découvrir, diversifier, innover',
}

export type EvolutionContext = {
  block: string | null
  charCount: number
}

export function buildEvolutionContext(
  profile: UserEvolutionProfile | null,
): EvolutionContext {
  if (!profile) return { block: null, charCount: 0 }

  const lines: string[] = []

  if (profile.mainObjective) {
    lines.push(`Objectif principal : ${profile.mainObjective}`)
  }

  if (profile.dominantTheme) {
    lines.push(`Thème dominant : ${profile.dominantTheme}`)
  }

  if (profile.dominantZone && profile.dominantZone !== 'unknown') {
    lines.push(`Zone de vie prioritaire : ${ZONE_LABELS[profile.dominantZone] ?? profile.dominantZone}`)
  }

  if (profile.currentPhase && profile.currentPhase !== 'unknown') {
    lines.push(`Phase actuelle : ${PHASE_LABELS[profile.currentPhase] ?? profile.currentPhase}`)
  }

  if (profile.dominantPotential && profile.dominantPotential !== 'unknown') {
    lines.push(`Potentiel dominant : ${POTENTIAL_LABELS[profile.dominantPotential] ?? profile.dominantPotential}`)
  }

  if (profile.tensionLevel && profile.tensionLevel >= 3) {
    lines.push(`Niveau de tension : ${profile.tensionLevel}/5 — adapter profondeur et ton`)
  }

  if (profile.currentLevers && profile.currentLevers.length > 0) {
    lines.push(`Leviers récents : ${profile.currentLevers.slice(0, 2).join(' · ')}`)
  }

  if (profile.lastSessionSummary) {
    lines.push(`Session précédente : ${profile.lastSessionSummary}`)
  }

  if (lines.length === 0) return { block: null, charCount: 0 }

  const block = [
    '[PROFIL ÉVOLUTIF — UTILISATION IMPLICITE UNIQUEMENT]',
    ...lines,
    '[FIN PROFIL ÉVOLUTIF]',
  ].join('\n')

  return { block, charCount: block.length }
}
