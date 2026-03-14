export function arbiter(result: {
  risk_flag?: boolean
  opportunity_flag?: boolean
  dominantSignal?: string | null
}) {
  if (result.risk_flag && result.opportunity_flag) return 'balanced_priority'
  if (result.risk_flag) return 'risk'
  if (result.opportunity_flag) return 'opportunity'
  if (result.dominantSignal) return 'dominant_signal'
  return 'neutral'
}
