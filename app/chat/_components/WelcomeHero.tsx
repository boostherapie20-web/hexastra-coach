'use client'

import { DS, cardStyle } from '../_lib/chat'

type WelcomeHeroProps = {
  onPrompt: (value: string) => void
}

const quickPrompts = [
  'Je me sens bloqué en ce moment',
  'Est-ce le bon timing pour agir ?',
  'Pourquoi cette relation me travaille autant ?',
  'Quelle direction devient plus naturelle ?',
]

const entryCards = [
  {
    title: 'Clarté immédiate',
    text: 'Tu poses ton ressenti, ton dilemme ou ta question. HexAstra commence simple, sans te noyer dans la matière.',
  },
  {
    title: 'Lecture guidée',
    text: 'Le système approfondit seulement quand c’est utile. L’expérience reste légère, même si le moteur est dense.',
  },
  {
    title: 'Confort durable',
    text: 'L’interface est pensée pour rester longtemps sans fatigue visuelle, mentale ou émotionnelle.',
  },
]

export default function WelcomeHero({ onPrompt }: WelcomeHeroProps) {
  return (
    <section
      className="hx-welcome-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.14fr) minmax(340px, 0.86fr)',
        gap: 18,
        alignItems: 'stretch',
      }}
    >
      <div
        style={cardStyle({
          padding: '34px 32px 28px',
          borderRadius: 34,
          minHeight: 560,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        })}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: DS.textFaint,
              marginBottom: 18,
              fontFamily: DS.monoFont,
            }}
          >
            Interface de clarté assistée par IA
          </div>

          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 16,
              background: 'linear-gradient(135deg,#19C37D,#0E8F5B)',
              marginBottom: 18,
              boxShadow: '0 12px 30px rgba(25,195,125,0.24)',
            }}
          />

          <h1
            style={{
              margin: 0,
              color: DS.text,
              fontSize: 'clamp(3rem, 6.2vw, 5.25rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.065em',
              maxWidth: 760,
              fontWeight: 700,
              fontFamily: DS.titleFont,
            }}
          >
            Un espace clair
            <br />
            pour retrouver
            <br />
            de l’air intérieur.
          </h1>

          <p
            style={{
              margin: '24px 0 0',
              color: DS.textSoft,
              fontSize: 18,
              lineHeight: 1.85,
              maxWidth: 720,
            }}
          >
            HexAstra t’aide à lire ton moment sans te noyer dans la complexité. Tu commences par parler. Le système écoute, clarifie, puis approfondit seulement si c’est nécessaire.
          </p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 24 }}>
            <button onClick={() => onPrompt('Je veux une lecture claire de ma situation actuelle.')} style={primaryButton}>
              Commencer maintenant
            </button>

            <button onClick={() => onPrompt('Explique-moi comment fonctionne HexAstra Coach.')} style={secondaryButton}>
              Comprendre le fonctionnement
            </button>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
            {quickPrompts.map((item) => (
              <button key={item} onClick={() => onPrompt(item)} className="hx-chip">
                {item}
              </button>
            ))}
          </div>
        </div>

        <div
          className="hx-welcome-points"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 12,
            marginTop: 28,
          }}
        >
          {entryCards.map((item) => (
            <div
              key={item.title}
              style={{
                border: `1px solid ${DS.line}`,
                borderRadius: 22,
                padding: '18px 16px',
                background: 'rgba(255,255,255,0.66)',
              }}
            >
              <div style={{ color: DS.text, fontWeight: 700, fontSize: 15 }}>{item.title}</div>
              <div style={{ color: DS.textMuted, fontSize: 13, lineHeight: 1.7, marginTop: 8 }}>{item.text}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={cardStyle({ padding: 0, borderRadius: 34, minHeight: 560, overflow: 'hidden' })}>
        <div
          style={{
            padding: '16px 18px',
            borderBottom: `1px solid ${DS.line}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: DS.textFaint,
                fontFamily: DS.monoFont,
              }}
            >
              Aperçu du chat
            </div>
            <div style={{ color: DS.text, fontSize: 16, fontWeight: 700, marginTop: 4 }}>Conversation en direct</div>
          </div>

          <div style={{ color: DS.emerald, fontSize: 13, fontWeight: 700 }}>En ligne</div>
        </div>

        <div
          style={{
            padding: 18,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            minHeight: 470,
            justifyContent: 'center',
            background: 'linear-gradient(180deg, rgba(241,246,241,0.20), rgba(255,255,255,0.45))',
          }}
        >
          <PreviewBubble>
            Bienvenue. Dis-moi ce que tu veux comprendre, trancher ou mieux sentir aujourd’hui.
          </PreviewBubble>

          <PreviewBubble user>
            J’hésite entre continuer mon activité actuelle ou lancer autre chose.
          </PreviewBubble>

          <PreviewBubble>
            On peut clarifier cela en 3 temps : ton état actuel, le vrai nœud de décision, puis le bon timing d’action.
          </PreviewBubble>
        </div>
      </div>
    </section>
  )
}

function PreviewBubble({ children, user = false }: { children: React.ReactNode; user?: boolean }) {
  return (
    <div
      style={{
        alignSelf: user ? 'flex-end' : 'flex-start',
        maxWidth: user ? '72%' : '78%',
        borderRadius: 20,
        padding: '14px 16px',
        background: user ? 'rgba(25,195,125,0.12)' : 'rgba(255,255,255,0.84)',
        border: `1px solid ${user ? 'rgba(25,195,125,0.18)' : DS.line}`,
        color: DS.text,
        lineHeight: 1.75,
        fontSize: 14,
        boxShadow: user ? '0 10px 24px rgba(25,195,125,0.08)' : DS.shadowSoft,
      }}
    >
      {children}
    </div>
  )
}

const primaryButton: React.CSSProperties = {
  border: 'none',
  cursor: 'pointer',
  padding: '14px 22px',
  borderRadius: 18,
  background: 'linear-gradient(135deg,#19C37D,#0E8F5B)',
  color: '#ffffff',
  fontWeight: 700,
  fontSize: 14,
  boxShadow: '0 12px 30px rgba(25,195,125,0.18)',
}

const secondaryButton: React.CSSProperties = {
  border: `1px solid ${DS.line}`,
  cursor: 'pointer',
  padding: '14px 22px',
  borderRadius: 18,
  background: 'rgba(255,255,255,0.72)',
  color: DS.text,
  fontWeight: 600,
  fontSize: 14,
}
