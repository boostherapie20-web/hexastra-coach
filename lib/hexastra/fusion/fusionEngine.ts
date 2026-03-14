import type { KSSignal } from './signalEnvelope'

export function fusionEngine(signals: KSSignal[]) {
  const ordered = [...signals].sort((a, b) => (b.intensity * b.confidence) - (a.intensity * a.confidence))
  const dominant = ordered[0]

  return {
    dominantSignal: dominant?.signals?.[0] ?? 'signal_general',
    phase: dominant?.phase_hint ?? null,
    zone: dominant?.zone_hint ?? null,
    risk_flag: ordered.some((s) => s.risk_flag),
    opportunity_flag: ordered.some((s) => s.opportunity_flag),
    modules: ordered.map((s) => s.module),
  }
}
