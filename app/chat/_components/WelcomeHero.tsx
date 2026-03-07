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
    text: 'Tu poses ton ressenti, ton dilemme ou ta question. HexAstra commence par l’essentiel, sans jargon inutile.',
  },
  {
    title: 'Lecture guidée',
    text: 'Le système approfondit seulement quand c’est pertinent, avec une progression plus propre et plus lisible.',
  },
  {
    title: 'Expérience premium',
    text: 'Une interface calme, un vrai espace de réflexion, et une sensation produit plus haut de gamme.',
  },
]

export default function WelcomeHero({ onPrompt }: WelcomeHeroProps) {
  return (
    <section
      className="hx-welcome-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.15fr) minmax(380px, 0.85fr)',
        gap: 16,
        alignItems: 'stretch',
      }}
    >
      <div
        style={cardStyle({
          padding: '32px 30px 26px',
          borderRadius: 32,
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
              color: DS.textMuted,
              marginBottom: 18,
              fontFamily: DS.monoFont,
            }}
          >
            Interface de clarté assistée par IA
          </div>

          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              background:
                'linear-gradient(135deg, rgba(228,182,124,0.96), rgba(171,116,54,0.96))',
              clipPath: 'polygon(25% 6%, 75% 6%, 94% 50%, 75% 94%, 25% 94%, 6% 50%)',
              marginBottom: 18,
              boxShadow: '0 12px 28px rgba(228,182,124,0.22)',
            }}
          />

          <h1
            style={{
              margin: 0,
              color: DS.text,
              fontSize: 'clamp(3.2rem, 7vw, 5.5rem)',
              lineHeight: 0.92,
              letterSpacing: '-0.06em',
              maxWidth: 700,
              fontWeight: 700,
            }}
          >
            Un espace plus fin
            <br />
            pour lire ton moment
            <br />
            avec précision.
          </h1>

          <p
            style={{
              margin: '24px 0 0',
              color: DS.textSoft,
              fontSize: 18,
              lineHeight: 1.85,
              maxWidth: 700,
            }}
          >
            HexAstra commence par écouter la question, clarifie le vrai nœud,
            puis approfondit seulement si nécessaire. Le résultat : une
            expérience premium, simple côté usage, propre côté produit.
          </p>

          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              marginTop: 24,
            }}
          >
            <button
              onClick={() => onPrompt('Je veux une lecture claire de ma situation actuelle.')}
              style={{
                border: 'none',
                cursor: 'pointer',
                padding: '14px 22px',
                borderRadius: 18,
                background:
                  'linear-gradient(135deg, rgba(228,182,124,0.96), rgba(171,116,54,0.96))',
                color: '#1b120c',
                fontWeight: 700,
                fontSize: 14,
                boxShadow: '0 12px 30px rgba(228,182,124,0.18)',
              }}
            >
              Commencer maintenant
            </button>

            <button
              onClick={() => onPrompt('Explique-moi comment fonctionne HexAstra Coach.')}
              style={{
                border: '1px solid rgba(255,255,255,0.10)',
                cursor: 'pointer',
                padding: '14px 22px',
                borderRadius: 18,
                background: 'rgba(255,255,255,0.03)',
                color: DS.text,
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Comprendre le fonctionnement
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              marginTop: 18,
            }}
          >
            {quickPrompts.map((item) => (
              <button
                key={item}
                onClick={() => onPrompt(item)}
                style={{
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.02)',
                  color: DS.textMuted,
                  fontSize: 13,
                  padding: '10px 14px',
                  cursor: 'pointer',
                }}
              >
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
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 22,
                padding: '18px 16px',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              <div style={{ color: DS.text, fontWeight: 600, fontSize: 15 }}>{item.title}</div>
              <div
                style={{
                  color: DS.textMuted,
                  fontSize: 13,
                  lineHeight: 1.7,
                  marginTop: 8,
                }}
              >
                {item.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={cardStyle({
          padding: 0,
          borderRadius: 32,
          minHeight: 560,
          overflow: 'hidden',
        })}
      >
        <div
          style={{
            padding: '16px 18px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
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
                color: DS.textMuted,
                fontFamily: DS.monoFont,
              }}
            >
              Aperçu du chat
            </div>
            <div style={{ color: DS.text, fontSize: 16, fontWeight: 600, marginTop: 4 }}>
              Conversation en direct
            </div>
          </div>

          <div style={{ color: '#8dd39d', fontSize: 13 }}>En ligne</div>
        </div>

        <div
          style={{
            padding: 18,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            minHeight: 470,
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              alignSelf: 'flex-start',
              maxWidth: '78%',
              borderRadius: 20,
              padding: '14px 16px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              color: DS.text,
              lineHeight: 1.7,
              fontSize: 14,
            }}
          >
            Bienvenue. Dis-moi ce que tu veux comprendre, trancher ou mieux sentir aujourd’hui.
          </div>

          <div
            style={{
              alignSelf: 'flex-end',
              maxWidth: '72%',
              borderRadius: 20,
              padding: '14px 16px',
              background: 'rgba(212,165,116,0.10)',
              border: '1px solid rgba(212,165,116,0.12)',
              color: DS.text,
              lineHeight: 1.7,
              fontSize: 14,
            }}
          >
            J’hésite entre continuer mon activité actuelle ou lancer autre chose.
          </div>

          <div
            style={{
              alignSelf: 'flex-start',
              maxWidth: '78%',
              borderRadius: 20,
              padding: '14px 16px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              color: DS.text,
              lineHeight: 1.7,
              fontSize: 14,
            }}
          >
            On peut clarifier cela en 3 temps : ton état actuel, le vrai nœud de décision, puis le bon timing d’action.
          </div>
        </div>
      </div>
    </section>
  )
}
