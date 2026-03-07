'use client'

import { useState, useEffect, useRef, useCallback, type CSSProperties } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

/* ═══════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════ */
type Msg = {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
  cached?: boolean
}
type Mode = 'essentiel' | 'premium' | 'praticien'
type View = 'chat' | 'profile' | 'abonnements' | 'projets'
type Step = 1 | 2 | 3 | 4
type Project = { id: string; name: string; readingIds: string[]; collapsed: boolean }
type Reading = { id: string; title: string; science: string; date: string; preview: string; projectId?: string }

/* ═══════════════════════════════════════════════════════════════
   DS TOKENS — single source of truth, mirrors globals.css
═══════════════════════════════════════════════════════════════ */
const DS = {
  bg0: '#0f0a07',
  bg1: '#1b1410',
  bgCard: 'rgba(20,14,10,0.75)',
  bgInput: 'rgba(255,255,255,0.03)',
  amber: '#d4a574',
  bronze: '#8c6239',
  tx1: '#f5f1ea',
  tx2: '#cbb9a4',
  tx3: 'rgba(203,185,164,0.45)',
  border: 'rgba(255,255,255,0.06)',
  borderW: 'rgba(212,165,116,0.16)',
  glow: 'rgba(212,165,116,0.15)',
  fontTitle: "'Sora', system-ui, sans-serif",
  fontBody: "'Inter', system-ui, sans-serif",
  fontMono: "'SF Mono', 'Fira Code', ui-monospace, monospace",
  gradBtn: 'linear-gradient(135deg,#d4a574,#8c6239)',
  shadowCard: '0 30px 120px rgba(0,0,0,0.5)',
  shadowBtn: '0 10px 30px rgba(212,165,116,0.25)',
  gradTitle: {
    fontFamily: "'Sora', system-ui, sans-serif",
    fontWeight: 600,
    letterSpacing: '0.04em',
    lineHeight: 1.15,
    background: 'linear-gradient(90deg, #f5f1ea 0%, #e9dcc7 38%, #d4a574 68%, #f5f1ea 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    filter: 'drop-shadow(0 0 18px rgba(212,165,116,0.18))',
  } as CSSProperties,
}

/* ═══════════════════════════════════════════════════════════════
   DATA — Countries / Timezones / Menus
═══════════════════════════════════════════════════════════════ */
const COUNTRIES_BY_CONTINENT: Record<string, string[]> = {
  Europe: ['Albanie', 'Allemagne', 'Andorre', 'Autriche', 'Belgique', 'Biélorussie', 'Bosnie-Herzégovine', 'Bulgarie', 'Chypre', 'Croatie', 'Danemark', 'Espagne', 'Estonie', 'Finlande', 'France', 'Grèce', 'Hongrie', 'Irlande', 'Islande', 'Italie', 'Kosovo', 'Lettonie', 'Liechtenstein', 'Lituanie', 'Luxembourg', 'Macédoine du Nord', 'Malte', 'Moldavie', 'Monaco', 'Monténégro', 'Norvège', 'Pays-Bas', 'Pologne', 'Portugal', 'République Tchèque', 'Roumanie', 'Royaume-Uni', 'Russie', 'Saint-Marin', 'Serbie', 'Slovaquie', 'Slovénie', 'Suède', 'Suisse', 'Ukraine', 'Vatican'],
  Afrique: ['Afrique du Sud', 'Algérie', 'Angola', 'Bénin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cameroun', 'Centrafrique', 'Comores', 'Congo', "Côte d'Ivoire", 'Djibouti', 'Égypte', 'Érythrée', 'Éthiopie', 'Gabon', 'Gambie', 'Ghana', 'Guinée', 'Guinée-Bissau', 'Guinée équatoriale', 'Kenya', 'Lesotho', 'Liberia', 'Libye', 'Madagascar', 'Malawi', 'Mali', 'Maroc', 'Maurice', 'Mauritanie', 'Mozambique', 'Namibie', 'Niger', 'Nigeria', 'Ouganda', 'Rwanda', 'São Tomé-et-Príncipe', 'Sénégal', 'Seychelles', 'Sierra Leone', 'Somalie', 'Soudan', 'Soudan du Sud', 'Swaziland', 'Tanzanie', 'Tchad', 'Togo', 'Tunisie', 'Zambie', 'Zimbabwe'],
  'Amériques — Nord': ['Belize', 'Canada', 'Costa Rica', 'Cuba', 'États-Unis', 'Guatemala', 'Honduras', 'Mexique', 'Nicaragua', 'Panama', 'Salvador'],
  Caraïbes: ['Anguilla', 'Antigua-et-Barbuda', 'Aruba', 'Bahamas', 'Barbade', 'Bonaire', 'Curaçao', 'Dominique', 'Grenade', 'Guadeloupe', 'Haïti', 'Îles Caïmans', 'Îles Turques-et-Caïques', 'Îles Vierges américaines', 'Îles Vierges britanniques', 'Jamaïque', 'Martinique', 'Montserrat', 'Porto Rico', 'République dominicaine', 'Saba', 'Saint-Barthélemy', 'Saint-Kitts-et-Nevis', 'Saint-Martin', 'Saint-Vincent-et-les-Grenadines', 'Sainte-Lucie', 'Sint Maarten', 'Trinité-et-Tobago'],
  'Amériques — Sud': ['Argentine', 'Bolivie', 'Brésil', 'Chili', 'Colombie', 'Équateur', 'Guyane', 'Guyane française', 'Paraguay', 'Pérou', 'Suriname', 'Uruguay', 'Venezuela'],
  'Asie — Moyen-Orient': ['Arabie Saoudite', 'Bahreïn', 'Émirats Arabes Unis', 'Irak', 'Iran', 'Israël', 'Jordanie', 'Koweït', 'Liban', 'Oman', 'Palestine', 'Qatar', 'Syrie', 'Turquie', 'Yémen'],
  'Asie — Sud': ['Afghanistan', 'Bangladesh', 'Bhoutan', 'Inde', 'Kazakhstan', 'Kirghizistan', 'Maldives', 'Népal', 'Ouzbékistan', 'Pakistan', 'Sri Lanka', 'Tadjikistan', 'Turkménistan'],
  'Asie — Est': ['Birmanie', 'Brunei', 'Cambodge', 'Chine', 'Corée du Nord', 'Corée du Sud', 'Indonésie', 'Japon', 'Laos', 'Malaisie', 'Mongolie', 'Philippines', 'Singapour', 'Taïwan', 'Thaïlande', 'Timor-Leste', 'Viêt Nam'],
  Océanie: ['Australie', 'Fidji', 'Îles Cook', 'Îles Marshall', 'Îles Salomon', 'Kiribati', 'Micronésie', 'Nauru', 'Nouvelle-Calédonie', 'Nouvelle-Zélande', 'Palaos', 'Papouasie-Nouvelle-Guinée', 'Polynésie française', 'Samoa', 'Tonga', 'Tuvalu', 'Vanuatu'],
}

const TIMEZONES = [
  { v: 'auto', l: 'Fuseau horaire automatique' }, { v: 'UTC', l: 'UTC+00 — GMT' }, { v: 'Europe/London', l: 'UTC+01 — Londres' },
  { v: 'Europe/Paris', l: 'UTC+01 — Paris / Madrid' }, { v: 'Europe/Helsinki', l: 'UTC+02 — Helsinki' },
  { v: 'Europe/Moscow', l: 'UTC+03 — Moscou' }, { v: 'Asia/Dubai', l: 'UTC+04 — Dubaï' },
  { v: 'Asia/Karachi', l: 'UTC+05 — Karachi' }, { v: 'Asia/Kolkata', l: 'UTC+05:30 — Mumbai' },
  { v: 'Asia/Dhaka', l: 'UTC+06 — Dhaka' }, { v: 'Asia/Bangkok', l: 'UTC+07 — Bangkok' },
  { v: 'Asia/Shanghai', l: 'UTC+08 — Pékin / HK' }, { v: 'Asia/Tokyo', l: 'UTC+09 — Tokyo' },
  { v: 'Australia/Sydney', l: 'UTC+10 — Sydney' }, { v: 'Pacific/Auckland', l: 'UTC+12 — Auckland' },
  { v: 'Atlantic/Azores', l: 'UTC-01 — Açores' }, { v: 'America/Noronha', l: 'UTC-02 — Mid-Atlantique' },
  { v: 'America/Sao_Paulo', l: 'UTC-03 — Brasília' }, { v: 'America/New_York', l: 'UTC-04 — New York' },
  { v: 'America/Chicago', l: 'UTC-05 — Chicago' }, { v: 'America/Denver', l: 'UTC-06 — Denver' },
  { v: 'America/Los_Angeles', l: 'UTC-07 — Los Angeles' }, { v: 'America/Anchorage', l: 'UTC-08 — Alaska' },
  { v: 'Pacific/Honolulu', l: 'UTC-10 — Honolulu' },
]

const MENU_ESSENTIEL = [
  { id: '1', sym: '✦', label: 'NeuroKua™', sub: 'État intérieur & énergie' },
  { id: '2', sym: '◈', label: 'Énergie du moment', sub: 'Tendance du jour' },
  { id: '3', sym: '♡', label: 'Amour / Relations', sub: 'Dynamiques affectives' },
  { id: '4', sym: '◆', label: 'Travail / Argent', sub: 'Choix pro & stabilité' },
  { id: '5', sym: '◉', label: 'Bien-être', sub: 'Apaise & recentre' },
  { id: '6', sym: '⊕', label: 'Décision', sub: 'Clarté & choix' },
  { id: '7', sym: '◎', label: 'Vision mois', sub: 'Anticipe & timing' },
  { id: '8', sym: '✧', label: 'Lecture générale', sub: 'Synthèse complète' },
  { id: '9', sym: '⬡', label: 'Par science', sub: 'Angle spécifique' },
]
const MENU_PREMIUM = [...MENU_ESSENTIEL,
  { id: 'P1', sym: '❋', label: 'Fusion KS™', sub: 'Synthèse totale' },
  { id: 'P2', sym: '⬢', label: 'Astrolex™', sub: 'Astrologie précise' },
]
const MENU_PRATICIEN = [
  { id: 'A1', sym: '✦', label: 'NeuroKua™', sub: 'Diagnostic état interne' },
  { id: 'A2', sym: '◈', label: 'Relationnel™', sub: 'Dynamiques & leviers' },
  { id: 'A3', sym: '◆', label: 'Professionnel™', sub: 'Positionnement & risques' },
  { id: 'A4', sym: '◎', label: 'Cycle à venir™', sub: 'Phase & timing' },
  { id: 'A5', sym: '⊕', label: 'Décision précise™', sub: 'Comparatif A/B' },
  { id: 'A6', sym: '✧', label: 'Lecture générale™', sub: 'Synthèse multidim.' },
  { id: 'B1', sym: '⬡', label: 'Astrolex™', sub: 'Astrologie' },
  { id: 'B2', sym: '◉', label: 'Porteum™', sub: 'Numérologie' },
  { id: 'B3', sym: '⊗', label: 'TriangleNumeris™', sub: 'Triangle' },
  { id: 'B4', sym: '⊛', label: 'Ennéagramme™', sub: 'Types' },
  { id: 'B5', sym: '⬢', label: 'Kua™', sub: 'Feng Shui' },
  { id: 'B6', sym: '❋', label: 'Fusion KS™', sub: 'Synthèse totale' },
]

/* ═══════════════════════════════════════════════════════════════
   COSMIC BACKGROUND
═══════════════════════════════════════════════════════════════ */
function CosmicBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background:
          'radial-gradient(circle at 50% 0%, rgba(212,165,116,0.09), transparent 34%), linear-gradient(180deg, #0b0807 0%, #0f0a07 42%, #120b08 100%)',
      }}
      aria-hidden="true"
    >
      <div className="hx-stars" style={{ position: 'absolute', inset: 0, opacity: 0.92 }} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 18% 22%, rgba(212,165,116,0.08) 0%, transparent 45%), radial-gradient(ellipse at 82% 18%, rgba(212,165,116,0.05) 0%, transparent 36%), radial-gradient(ellipse at 55% 72%, rgba(140,98,57,0.06) 0%, transparent 34%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(7,5,4,0.15) 0%, rgba(7,5,4,0.28) 100%)',
          mixBlendMode: 'multiply',
        }}
      />
      <div
        className="hx-sacred-halo"
        style={{
          position: 'absolute',
          left: '50%',
          top: '47%',
          transform: 'translate(-50%,-50%)',
          width: 'min(1240px, 96vw)',
          height: 'min(1240px, 96vw)',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(212,165,116,0.12) 0%, rgba(212,165,116,0.05) 28%, rgba(212,165,116,0.02) 46%, transparent 66%)',
          filter: 'blur(120px)',
          opacity: 0.34,
        }}
      />
      <div
        className="hx-sacred-geometry"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.055,
        }}
      >
        <img
          src="/hexastra-sacred-geometry.png"
          alt=""
          aria-hidden="true"
          draggable={false}
          style={{
            width: 'min(1120px, 88vw)',
            height: 'auto',
            display: 'block',
            filter: 'drop-shadow(0 0 90px rgba(212,165,116,0.08)) blur(0.6px) saturate(0.94)',
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at center, transparent 0%, rgba(6,4,3,0.08) 58%, rgba(6,4,3,0.34) 100%)',
        }}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PRIMITIVES
═══════════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════
   PRIMITIVES
═══════════════════════════════════════════════════════════════ */
function Card({
  children,
  style,
  hover = true,
}: {
  children: React.ReactNode
  style?: CSSProperties
  hover?: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.025))'
          : 'linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.018))',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderRadius: 26,
        border: `1px solid ${hovered ? 'rgba(212,165,116,0.16)' : DS.border}`,
        boxShadow: hovered
          ? '0 30px 120px rgba(0,0,0,0.56), 0 0 80px rgba(212,165,116,0.08)'
          : '0 26px 100px rgba(0,0,0,0.46)',
        transition:
          'border-color 0.28s ease, box-shadow 0.28s ease, transform 0.28s ease, background 0.28s ease',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function BtnPrimary({
  children,
  onClick,
  disabled,
  style,
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  style?: CSSProperties
}) {
  const [hov, setHov] = useState(false)

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        minHeight: 44,
        padding: '12px 20px',
        borderRadius: 14,
        background: disabled
          ? 'rgba(255,255,255,0.06)'
          : 'linear-gradient(135deg,#e3bc8e 0%, #c7925f 38%, #8c6239 100%)',
        color: disabled ? DS.tx3 : '#fff',
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: '0.01em',
        border: '1px solid rgba(255,255,255,0.06)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.24s ease',
        transform: hov && !disabled ? 'translateY(-1px)' : 'none',
        boxShadow: hov && !disabled ? '0 14px 34px rgba(212,165,116,0.28)' : '0 8px 20px rgba(0,0,0,0.18)',
        fontFamily: DS.fontBody,
        ...style,
      }}
    >
      {children}
    </button>
  )
}

function BtnGhost({
  children,
  onClick,
  active,
  style,
}: {
  children: React.ReactNode
  onClick?: () => void
  active?: boolean
  style?: CSSProperties
}) {
  const [hov, setHov] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        minHeight: 40,
        padding: '10px 16px',
        borderRadius: 12,
        background: active
          ? 'rgba(212,165,116,0.12)'
          : hov
            ? 'rgba(255,255,255,0.05)'
            : 'rgba(255,255,255,0.03)',
        color: active ? DS.tx1 : hov ? DS.tx2 : DS.tx3,
        border: `1px solid ${active ? 'rgba(212,165,116,0.20)' : hov ? 'rgba(255,255,255,0.08)' : DS.border}`,
        fontSize: 13,
        fontWeight: active ? 500 : 400,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: DS.fontBody,
        ...style,
      }}
    >
      {children}
    </button>
  )
}

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string
  label: string
  active: boolean
  onClick: () => void
}) {
  const [hov, setHov] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        width: '100%',
        textAlign: 'left',
        borderRadius: 12,
        fontSize: 13,
        fontWeight: active ? 500 : 400,
        color: active ? DS.tx1 : hov ? DS.tx2 : DS.tx3,
        background: active
          ? 'linear-gradient(180deg, rgba(212,165,116,0.13), rgba(212,165,116,0.07))'
          : hov
            ? 'rgba(255,255,255,0.04)'
            : 'transparent',
        border: `1px solid ${active ? 'rgba(212,165,116,0.20)' : 'transparent'}`,
        cursor: 'pointer',
        transition: 'all 0.18s ease',
        fontFamily: DS.fontBody,
      }}
    >
      <span
        style={{
          width: 18,
          textAlign: 'center',
          fontSize: 13,
          flexShrink: 0,
          opacity: active ? 1 : 0.72,
          color: active ? DS.amber : undefined,
        }}
      >
        {icon}
      </span>
      {label}
    </button>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'rgba(203,185,164,0.42)',
        fontFamily: DS.fontMono,
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  )
}

function Divider({ style }: { style?: CSSProperties }) {
  return (
    <div
      style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
        ...style,
      }}
    />
  )
}

function IconBtn({
  children,
  onClick,
  tooltip,
  active,
}: {
  children: React.ReactNode
  onClick?: () => void
  tooltip?: string
  active?: boolean
}) {
  const [hov, setHov] = useState(false)

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <button
        onClick={onClick}
        style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${active || hov ? 'rgba(212,165,116,0.20)' : DS.border}`,
          background: active
            ? 'rgba(212,165,116,0.14)'
            : hov
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(255,255,255,0.025)',
          color: active || hov ? DS.amber : DS.tx3,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: active ? '0 0 0 4px rgba(212,165,116,0.08)' : 'none',
          animation: active ? 'recPulse 1s ease-in-out infinite' : 'none',
        }}
      >
        {children}
      </button>

      {hov && tooltip && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 7px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(20,14,10,0.97)',
            border: `1px solid ${DS.borderW}`,
            borderRadius: 8,
            padding: '5px 10px',
            fontSize: 11,
            color: DS.tx2,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 200,
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            fontFamily: DS.fontMono,
            letterSpacing: '0.04em',
          }}
        >
          {tooltip}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   CITY AUTOCOMPLETE
═══════════════════════════════════════════════════════════════ */
function CityInput({ value, onChange, placeholder }: { value: string; onChange: (v: string, lat?: number, lon?: number) => void; placeholder?: string }) {
  const [sugg, setSugg] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const tmr = useRef<any>(null)

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSugg([])
      setOpen(false)
      return
    }
    setLoading(true)
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=7&addressdetails=1&accept-language=fr`)
      const d = await r.json()
      setSugg(d)
      setOpen(d.length > 0)
    } catch {}
    setLoading(false)
  }, [])

  const pick = (item: any) => {
    const name = item.display_name.split(',').slice(0, 2).join(', ').trim()
    onChange(name, parseFloat(item.lat), parseFloat(item.lon))
    setSugg([])
    setOpen(false)
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <input
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            clearTimeout(tmr.current)
            tmr.current = setTimeout(() => search(e.target.value), 320)
          }}
          placeholder={placeholder || 'Rechercher une ville...'}
          style={fmInp}
          onFocus={() => sugg.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
        />
        {loading && <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 10, height: 10, border: `1.5px solid ${DS.amber}`, borderTop: '1.5px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />}
      </div>

      {open && sugg.length > 0 && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 500, background: 'rgba(20,14,10,0.98)', border: `1px solid ${DS.borderW}`, borderRadius: 12, boxShadow: '0 16px 48px rgba(0,0,0,0.8)', maxHeight: 220, overflowY: 'auto' }}>
          {sugg.map((s, i) => (
            <button
              key={i}
              onMouseDown={() => pick(s)}
              style={{ display: 'block', width: '100%', padding: '9px 14px', textAlign: 'left', background: 'transparent', border: 'none', borderBottom: `1px solid ${DS.border}`, cursor: 'pointer' }}
            >
              <div style={{ fontSize: 13, color: DS.tx1, fontFamily: DS.fontBody }}>{s.display_name.split(',').slice(0, 2).join(', ')}</div>
              <div style={{ fontSize: 10, color: DS.tx3, marginTop: 2, fontFamily: DS.fontMono }}>{parseFloat(s.lat).toFixed(3)}, {parseFloat(s.lon).toFixed(3)}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   FORM HELPERS
═══════════════════════════════════════════════════════════════ */
const fmInp: CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: `1px solid ${DS.border}`,
  borderRadius: 10,
  padding: '10px 14px',
  color: DS.tx1,
  fontSize: 14,
  fontFamily: DS.fontBody,
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

function FormInput({ label, req, children }: { label: string; req?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fo
