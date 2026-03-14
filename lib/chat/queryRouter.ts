import { classifyUserIntent, type UserIntent } from './intentClassifier'
import { evaluateDomainGuard, type GuardDecision } from './domainGuard'
import { getRedirectMessage, getBlockedMessage } from './guardMessages'

export type RouterResult =
  | { decision: 'allowed'; intent: UserIntent }
  | { decision: 'redirect'; message: string; intent: UserIntent }
  | { decision: 'blocked'; message: string; intent: UserIntent }

/**
 * Full pipeline:
 *   message → classify intent → evaluate guard → return routing decision
 *
 * Usage in handleSend:
 *   const result = routeUserQuery(userMessage)
 *   if (result.decision !== 'allowed') { showGuardMessage(result.message); return }
 *   // proceed to API call
 */
export function routeUserQuery(message: string): RouterResult {
  const intent = classifyUserIntent(message)
  const decision: GuardDecision = evaluateDomainGuard(intent)

  if (decision === 'allowed') {
    return { decision: 'allowed', intent }
  }

  if (decision === 'redirect') {
    return {
      decision: 'redirect',
      intent,
      message: getRedirectMessage(),
    }
  }

  // blocked
  return {
    decision: 'blocked',
    intent,
    message: getBlockedMessage(intent),
  }
}
