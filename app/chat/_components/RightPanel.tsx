'use client'

import { DS, cardStyle, type Mode, type Reading } from '../_lib/chat'

type RightPanelProps = {
  mode: Mode
  readings: Reading[]
  collapsed?: boolean
  onToggleCollapse?: () => void
  onPrompt: (value: string) => void
  onOpenReading: (reading: Reading) => void
}

const personalDataItems = [
  {
    title: 'Date de naissance',
    value: 'À compléter',
  },
  {
    title: 'Heure de naissance',
    value: 'À compléter',
  },
  {
    title: 'Lieu de naissance',
    value: 'À compléter',
  },
  {
    title: 'Profil actuel',
    value: 'Mode Essentiel',
  },
]

const categories = [
  {
    title: 'NeuroKua™',
    subtitle: 'État intérieur du moment',
    prompt: 'Analyse mon état intérieur du moment avec HexAstra.',
  },
  {
    title: 'Énergie du moment',
    subtitle: 'Tendance de fond',
    prompt: 'Quelle est mon énergie dominante en ce moment ?',
  },
  {
    title: 'Amour / Relations',
    subtitle: 'Lecture affective',
    prompt: 'Aide-moi à comprendre ma dynamique relationnelle actuelle.',
  },
  {
    title: 'Travail / Argent',
    subtitle: 'Stabilité et mouvement',
    prompt: 'Analyse ma zone travail et argent en ce moment.',
  },
  {
    title: 'Lecture générale',
    subtitle: 'Vue synthétique',
    prompt: 'Fais-moi une lecture générale claire de ma situation actuelle.',
  },
]

export default function RightPanel({
  mode,
  readings,
  collapsed,
  onToggleCollapse,
  onPrompt,
  onOpenReading,
}: RightPanelProps) {
  if (collapsed) {
    return (
      <aside
        style={{
          width: 72,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <button
          onClick={onToggleCollapse}
          style={{
            width: 44,
            height: 44,
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.09)',
            background: 'rgba(255,255,255,0.03)',
            color: DS.text,
            cursor: 'pointer',
            marginTop: 4,
          }}
        >
          ›
        </button>
      </aside>
    )
  }

  return (
    <aside
      style={{
        width: '100%',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: DS.textMuted,
            fontFamily: DS.monoFont,
          }}
        >
          Outils
        </div>

        <button
          onClick={onToggleCollapse}
          style={{
            width: 38,
            height: 38,
            borderRadius: 14,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)',
            color: DS.text,
            cursor: 'pointer',
          }}
        >
          ‹
        </button>
      </div>

      <section
        style={cardStyle({
          padding: 18,
          borderRadius: 28,
        })}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: DS.textMuted,
            marginBottom: 14,
            fontFamily: DS.monoFont,
          }}
        >
          Données personnelles
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {personalDataItems.map((item) => (
            <div
              key={item.title}
              style={{
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 18,
                padding: '12px 14px',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              <div style={{ color: DS.textSoft, fontSize: 14, fontWeight: 600 }}>{item.title}</div>
              <div style={{ color: DS.textFaint, fontSize: 13, marginTop: 4 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section
        style={cardStyle({
          padding: 18,
          borderRadius: 28,
          flex: 1,
        })}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: DS.textMuted,
            marginBottom: 14,
            fontFamily: DS.monoFont,
          }}
        >
          Catégories
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {categories.map((item) => (
            <button
              key={item.title}
              onClick={() => onPrompt(item.prompt)}
              style={{
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 18,
                padding: '14px 14px',
                background: 'rgba(255,255,255,0.025)',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <div style={{ color: DS.text, fontSize: 15, fontWeight: 600 }}>{item.title}</div>
              <div style={{ color: DS.textMuted, fontSize: 13, marginTop: 4 }}>{item.subtitle}</div>
            </button>
          ))}
        </div>

        {readings.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                fontSize: 10,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: DS.textMuted,
                marginBottom: 10,
                fontFamily: DS.monoFont,
              }}
            >
              Dernières lectures
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {readings.slice(0, 3).map((reading) => (
                <button
                  key={reading.id}
                  onClick={() => onOpenReading(reading)}
                  style={{
                    border: '1px solid rgba(212,165,116,0.10)',
                    borderRadius: 16,
                    padding: '12px 14px',
                    background: 'rgba(212,165,116,0.04)',
                    color: DS.textSoft,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{reading.title}</div>
                  <div style={{ fontSize: 12, color: DS.textFaint, marginTop: 4 }}>
                    {mode} · {new Date(reading.date).toLocaleDateString('fr-FR')}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </aside>
  )
}
