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

export const DS = {
  bg0: '#0f0a07',
  bg1: '#17110d',
  card: 'rgba(20,14,10,0.72)',
  cardStrong: 'rgba(20,14,10,0.84)',
  line: 'rgba(255,255,255,0.06)',
  lineWarm: 'rgba(212,165,116,0.16)',
  amber: '#d4a574',
  amberDeep: '#8c6239',
  text: '#f5f1ea',
  textSoft: '#cbb9a4',
  textMute: 'rgba(203,185,164,0.56)',
  textFaint: 'rgba(203,185,164,0.34)',
  success: '#57d27c',
  shadow: '0 28px 120px rgba(0,0,0,0.46)',
  shadowSoft: '0 18px 56px rgba(0,0,0,0.28)',
  gradient: 'linear-gradient(135deg, #e3bc8e 0%, #c7925f 38%, #8c6239 100%)',
  titleGradient:
    'linear-gradient(90deg, #f5f1ea 0%, #e9dcc7 36%, #d4a574 68%, #f5f1ea 100%)',
  radiusLg: 28,
  radiusMd: 20,
  radiusSm: 14,
  titleFont: "var(--font-title)",
  bodyFont: "var(--font-body)",
  monoFont: "var(--font-mono)",
} as const

export const MENU_BY_MODE: Record<Mode, Array<{ id: string; label: string; sub: string; icon: string }>> = {
  essentiel: [
    { id: '1', label: 'NeuroKua™', sub: 'État intérieur du moment', icon: '✦' },
    { id: '2', label: 'Énergie du moment', sub: 'Tendance de fond', icon: '◈' },
    { id: '3', label: 'Amour / Relations', sub: 'Lecture affective', icon: '♡' },
    { id: '4', label: 'Travail / Argent', sub: 'Stabilité et mouvement', icon: '◆' },
    { id: '5', label: 'Lecture générale', sub: 'Vue synthétique', icon: '◎' },
  ],
  premium: [
    { id: '1', label: 'NeuroKua™', sub: 'État intérieur du moment', icon: '✦' },
    { id: '2', label: 'Énergie du moment', sub: 'Tendance de fond', icon: '◈' },
    { id: '3', label: 'Amour / Relations', sub: 'Lecture affective', icon: '♡' },
    { id: '4', label: 'Travail / Argent', sub: 'Stabilité et mouvement', icon: '◆' },
    { id: '5', label: 'Lecture générale', sub: 'Vue synthétique', icon: '◎' },
    { id: '6', label: 'Fusion KS™', sub: 'Synthèse globale', icon: '⬢' },
    { id: '7', label: 'Astrolex™', sub: 'Approfondissement', icon: '❋' },
  ],
  praticien: [
    { id: '1', label: 'Diagnostic rapide', sub: 'Lecture cabinet', icon: '✦' },
    { id: '2', label: 'Relationnel™', sub: 'Dynamiques et leviers', icon: '◈' },
    { id: '3', label: 'Professionnel™', sub: 'Positionnement', icon: '◆' },
    { id: '4', label: 'Cycle à venir™', sub: 'Phase et timing', icon: '◎' },
    { id: '5', label: 'Décision précise™', sub: 'Comparer A / B', icon: '⊕' },
    { id: '6', label: 'Fusion KS™', sub: 'Synthèse complète', icon: '⬢' },
  ],
}

export const QUICK_PROMPTS = [
  'Comprendre une situation que je traverse',
  'Clarifier une décision importante',
  'Explorer une période de ma vie',
  'Lire mon énergie du moment',
]

export const HERO_PROMPTS = [
  'Je me sens bloqué en ce moment',
  'Est-ce le bon timing pour agir ?',
  'Pourquoi cette relation me travaille autant ?',
  'Quelle direction devient plus naturelle ?',
]

export const STORAGE_KEYS = {
  readings: 'hx_readings_v2',
  projects: 'hx_projects_v2',
} as const

export function makeReadingTitle(input: string) {
  return input.length > 54 ? `${input.slice(0, 54)}…` : input
}

export function cardStyle(extra?: CSSProperties): CSSProperties {
  return {
    background:
      'linear-gradient(180deg, rgba(255,255,255,0.038), rgba(255,255,255,0.018))',
    border: `1px solid ${DS.line}`,
    borderRadius: DS.radiusLg,
    boxShadow: DS.shadow,
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    ...extra,
  }
}

export function formatClock(date: string) {
  return new Date(date).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
