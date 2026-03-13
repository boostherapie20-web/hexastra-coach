import type { CSSProperties } from 'react'

export type Msg = {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
  cached?: boolean
}

export type Mode = 'essentiel' | 'premium' | 'praticien'

export type Project = {
  id: string
  name: string
  collapsed: boolean
}

export type Reading = {
  id: string
  title: string
  science: string
  date: string
  preview: string
  projectId?: string
}

export type BirthData = {
  firstName: string
  lastName: string
  birthDate: string
  birthTime: string
  birthCity: string
  birthCountryCode: string   // ISO 3166-1 alpha-2
  birthCountryName: string
  birthLat: string
  birthLng: string
  gender: 'masculin' | 'feminin' | ''
}

export const EMPTY_BIRTH_DATA: BirthData = {
  firstName: '',
  lastName: '',
  birthDate: '',
  birthTime: '',
  birthCity: '',
  birthCountryCode: '',
  birthCountryName: '',
  birthLat: '',
  birthLng: '',
  gender: '',
}

export const STORAGE_KEYS = {
  readings: 'hexastra.readings.v2',
  projects: 'hexastra.projects.v2',
  birthData: 'hexastra.birthdata.v1',
} as const

export function hasBirthData(bd: BirthData): boolean {
  return !!(bd.firstName || bd.lastName || bd.birthDate || bd.birthCity || bd.birthCountryName || bd.birthTime || bd.gender)
}

export function formatBirthContextForApi(bd: BirthData): string {
  const lines: string[] = []
  if (bd.firstName || bd.lastName) lines.push(`Prénom et nom : ${[bd.firstName, bd.lastName].filter(Boolean).join(' ')}`)
  if (bd.birthDate) lines.push(`Date de naissance : ${bd.birthDate}`)
  if (bd.birthTime) lines.push(`Heure de naissance : ${bd.birthTime}`)
  if (bd.birthCity) lines.push(`Ville de naissance : ${bd.birthCity}`)
  if (bd.birthCountryName) lines.push(`Pays de naissance : ${bd.birthCountryName}`)
  if (bd.birthLat && bd.birthLng) lines.push(`Coordonnées GPS : ${bd.birthLat}, ${bd.birthLng}`)
  if (bd.gender) lines.push(`Genre : ${bd.gender}`)
  return lines.join('\n')
}

export const QUICK_PROMPTS = [
  'Je veux une lecture claire de ma situation actuelle.',
  'Quel est le bon timing pour agir maintenant ?',
  'Aide-moi à comprendre ce qui se rejoue dans cette relation.',
  'Quelle direction devient plus naturelle pour moi ?',
] as const

export const DS = {
  bg0: '#FBFDFB',
  bg1: '#FFFFFF',
  bg2: '#F1F6F1',

  panel: 'rgba(255,255,255,0.82)',
  panelStrong: 'rgba(255,255,255,0.92)',
  glass: 'rgba(255,255,255,0.72)',

  text: '#14211A',
  textSoft: '#526157',
  textMuted: 'rgba(82, 97, 87, 0.82)',
  textFaint: 'rgba(20, 33, 26, 0.46)',
  textMute: 'rgba(20, 33, 26, 0.54)',

  line: 'rgba(20, 33, 26, 0.08)',
  lineStrong: 'rgba(20, 33, 26, 0.12)',

  emerald: '#19C37D',
  emeraldDeep: '#0E8F5B',
  emeraldSoft: 'rgba(25, 195, 125, 0.10)',
  emeraldGlow: 'rgba(25, 195, 125, 0.16)',

  gold: '#E5B93C',
  amber: '#F59E0B',

  gradient: 'linear-gradient(135deg, #19C37D 0%, #0E8F5B 100%)',
  surfaceGradient:
    'linear-gradient(180deg, rgba(255,255,255,0.90), rgba(255,255,255,0.78))',

  bodyFont: "'Inter', system-ui, sans-serif",
  titleFont: "'Sora', system-ui, sans-serif",
  monoFont: "'SF Mono', 'Fira Code', ui-monospace, monospace",

  shadowSoft: '0 8px 24px rgba(16, 24, 20, 0.05)',
  shadowCard: '0 18px 48px rgba(16, 24, 20, 0.06)',
  shadowLarge: '0 24px 80px rgba(16, 24, 20, 0.10)',
} as const

export function cardStyle(overrides?: CSSProperties): CSSProperties {
  return {
    background: DS.panel,
    border: 'none',
    borderRadius: 28,
    boxShadow: DS.shadowCard,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    ...overrides,
  }
}

export function softCardStyle(overrides?: CSSProperties): CSSProperties {
  return {
    background: DS.glass,
    border: 'none',
    borderRadius: 24,
    boxShadow: DS.shadowSoft,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    ...overrides,
  }
}

export function elevatedCardStyle(overrides?: CSSProperties): CSSProperties {
  return {
    background: DS.panelStrong,
    border: 'none',
    borderRadius: 28,
    boxShadow: DS.shadowLarge,
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    ...overrides,
  }
}

export function makeReadingTitle(input: string): string {
  const clean = input.replace(/\s+/g, ' ').trim()

  if (!clean) return 'Lecture HexAstra'

  return clean.length > 48 ? `${clean.slice(0, 48).trim()}…` : clean
}