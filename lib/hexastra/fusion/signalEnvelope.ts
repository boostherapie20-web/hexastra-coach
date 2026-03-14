import type { DomainRoute } from '@/lib/hexastra/types'

export interface KSSignal {
  module: string
  signals: string[]
  intensity: number
  confidence: number
  phase_hint?: string
  zone_hint?: string
  risk_flag?: boolean
  opportunity_flag?: boolean
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string')
  if (typeof value === 'string' && value.trim()) return [value.trim()]
  return []
}

function inferDefaultSignal(module: string, domainRoute: DomainRoute): string {
  if (module.includes('GPS') || domainRoute === 'gps_kua') return 'orientation'
  if (module.includes('NeuroKua') || domainRoute === 'neurokua') return 'equilibre'
  if (domainRoute === 'career') return 'positionnement'
  if (domainRoute === 'relationship') return 'dynamique_relationnelle'
  if (domainRoute === 'decision') return 'levier_decision'
  if (domainRoute === 'timing') return 'timing'
  return 'signal_general'
}

export function buildSignalEnvelope(input: {
  module: string
  result: Record<string, unknown> | null | undefined
  domainRoute: DomainRoute
}): KSSignal {
  const result = input.result ?? {}
  const signals = toStringArray(result.signals ?? result.signal ?? result.publicSummary).slice(0, 5)
  const intensity = typeof result.intensity === 'number' ? result.intensity : 0.72
  const confidence = typeof result.confidence === 'number' ? result.confidence : 0.68

  return {
    module: input.module,
    signals: signals.length ? signals : [inferDefaultSignal(input.module, input.domainRoute)],
    intensity,
    confidence,
    phase_hint: typeof result.phase_hint === 'string' ? result.phase_hint : typeof result.phase === 'string' ? result.phase : undefined,
    zone_hint: typeof result.zone_hint === 'string' ? result.zone_hint : typeof result.zone === 'string' ? result.zone : undefined,
    risk_flag: Boolean(result.risk_flag),
    opportunity_flag: Boolean(result.opportunity_flag),
  }
}
