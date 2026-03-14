/**
 * User Evolution Store — localStorage persistence for UserEvolutionProfile.
 *
 * No external dependency (no Zustand). Follows the same localStorage pattern
 * as the rest of the project (micro-readings, birth data, etc.).
 * Safe to call on the server (returns null / no-ops when window is undefined).
 */

import type { UserEvolutionProfile } from '@/types/evolution'

const STORAGE_KEY = 'hexastra.evolution.v1'

export function loadEvolutionProfile(): UserEvolutionProfile | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? (parsed as UserEvolutionProfile) : null
  } catch {
    return null
  }
}

export function saveEvolutionProfile(profile: UserEvolutionProfile): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  } catch {
    // localStorage full or blocked — fail silently
  }
}

export function clearEvolutionProfile(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // fail silently
  }
}

/**
 * Shallow-merge a partial update into the current profile and persist it.
 * Returns the merged profile.
 */
export function mergeAndSaveEvolutionProfile(
  current: UserEvolutionProfile | null,
  updates: Partial<UserEvolutionProfile>,
): UserEvolutionProfile {
  const merged: UserEvolutionProfile = {
    ...(current ?? {}),
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  saveEvolutionProfile(merged)
  return merged
}
