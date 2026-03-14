/**
 * Evolution Engine — public API for the Evolution System.
 *
 * Orchestrates: signal extraction → memory policy → profile update → session summary.
 * Pure synchronous computation, zero added latency, no extra API calls.
 *
 * Called by route.ts AFTER a chat response is obtained, for requestType === 'chat' only.
 */

import type { UserEvolutionProfile, EvolutionUpdateInput, EvolutionDecision } from '@/types/evolution'
import { buildProfileSnapshot } from './profileSnapshotBuilder'
import { shouldPersistSignal } from './memoryPolicy'

/** Minimum assistant response length to consider an exchange worth recording */
const MIN_RESPONSE_LENGTH = 80

/**
 * Returns true if this exchange contains signals worth persisting.
 * Filters out greetings, single-word replies, and purely transient states.
 */
function isExchangeWorthRecording(input: EvolutionUpdateInput): boolean {
  if (!shouldPersistSignal(input.userMessage)) return false
  if (input.assistantResponse.trim().length < MIN_RESPONSE_LENGTH) return false
  return true
}

/**
 * Main entry point.
 * Takes a completed exchange and returns an updated evolution profile.
 *
 * If the exchange is not worth recording (greeting, noise), the current
 * profile is returned unchanged with shouldUpdate: false.
 */
export function updateUserEvolutionProfile(
  input: EvolutionUpdateInput,
): EvolutionDecision {
  if (!isExchangeWorthRecording(input)) {
    return {
      shouldUpdate: false,
      fieldsToUpdate: [],
      nextProfile: input.currentProfile ?? {},
    }
  }

  const nextProfile = buildProfileSnapshot({
    userMessage: input.userMessage,
    assistantResponse: input.assistantResponse,
    currentProfile: input.currentProfile,
  })

  // Detect which fields actually changed
  const fieldsToUpdate = (Object.keys(nextProfile) as Array<keyof UserEvolutionProfile>).filter(
    (key) => {
      const next = nextProfile[key]
      const curr = input.currentProfile?.[key]
      if (Array.isArray(next) && Array.isArray(curr)) {
        return JSON.stringify(next) !== JSON.stringify(curr)
      }
      return next !== curr
    },
  )

  return {
    shouldUpdate: fieldsToUpdate.length > 0,
    fieldsToUpdate,
    nextProfile,
  }
}
