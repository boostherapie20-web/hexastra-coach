import type { DomainRoute } from '@/lib/hexastra/types'

export function getModulesForDomain(domain: DomainRoute): string[] {
  switch (domain) {
    case 'gps_kua':
      return ['KS.HexAstra.GPS.V1', 'KS.NeuroKua.System.V1']
    case 'neurokua':
      return ['KS.NeuroKua.System.V1']
    case 'fusion':
      return ['KS.FUSION.V13', 'KS.ARBITER.V1']
    case 'relationship':
    case 'career':
    case 'decision':
    case 'timing':
    case 'wellbeing':
    case 'science':
      return ['KS.FUSION.V13']
    default:
      return ['KS.FUSION.V13']
  }
}
