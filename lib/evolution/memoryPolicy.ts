/**
 * Memory Policy — decides what to keep, ignore, replace, or skip.
 *
 * Rules are conservative by design: it is better to miss a signal
 * than to pollute the profile with noise.
 */

import type { LifePhase, DominantZone, DominantPotential } from '@/types/evolution'

/** Messages shorter than this are likely noise */
const MIN_SIGNAL_LENGTH = 25

/** Patterns for transient states that should never be persisted */
const TRANSIENT_PATTERNS = [
  /je suis (juste )?(fatigué|stressé|énervé|triste) (aujourd'hui|ce soir|là)/i,
  /ça va (mieux|moins bien) (maintenant|là|aujourd'hui)/i,
  /juste pour (voir|tester|essayer)/i,
  /par (pure )?curiosité/i,
  /^(bonjour|salut|hello|hi|hey|ok|merci|thanks?|oui|non|yes|no|d'accord|parfait|super|génial)\.?$/i,
]

/** Returns false if the message is too short or purely transient */
export function shouldPersistSignal(text: string): boolean {
  const trimmed = text.trim()
  if (trimmed.length < MIN_SIGNAL_LENGTH) return false
  return !TRANSIENT_PATTERNS.some((p) => p.test(trimmed))
}

/**
 * Replace the stored objective only if the candidate is clearly
 * more specific (longer) or there is no current objective.
 */
export function shouldReplaceObjective(
  current: string | undefined,
  candidate: string,
): boolean {
  if (!current) return true
  // Replace if candidate is meaningfully more specific
  return candidate.length > current.length + 15
}

/**
 * Update the life phase only when we have a confident new signal
 * that differs from the current one.
 */
export function shouldUpdatePhase(
  current: LifePhase | undefined,
  candidate: LifePhase,
  confidence: number,
): boolean {
  if (candidate === 'unknown') return false
  if (!current || current === 'unknown') return confidence >= 0.4
  return current !== candidate && confidence >= 0.6
}

/**
 * Update the dominant theme when a new theme scores 2+ matches
 * and differs from the current one.
 */
export function shouldUpdateDominantTheme(
  current: string | undefined,
  candidate: string,
  matchScore: number,
): boolean {
  if (!candidate) return false
  if (!current) return matchScore >= 1
  return current !== candidate && matchScore >= 2
}

/**
 * Potentials are stable personality axes — only set when unknown,
 * never automatically overwritten.
 */
export function shouldUpdatePotential(
  current: DominantPotential | undefined,
  candidate: DominantPotential,
): boolean {
  if (candidate === 'unknown') return false
  return !current || current === 'unknown'
}

/**
 * Update the dominant zone when a clear new zone signal is detected
 * and differs from the current one.
 */
export function shouldUpdateZone(
  current: DominantZone | undefined,
  candidate: DominantZone,
): boolean {
  if (candidate === 'unknown') return false
  if (!current || current === 'unknown') return true
  return current !== candidate
}

/**
 * Update tension level when the signal is strong (≥ 3/5).
 * Lower tension levels are not overwritten by weak signals.
 */
export function shouldUpdateTension(
  current: number | undefined,
  candidate: number,
): boolean {
  if (!candidate) return false
  if (!current) return true
  // Only escalate; let tension decay naturally via time / low signals
  return candidate > current
}
