'use client'

import { DS, HERO_PROMPTS, cardStyle } from '../_lib/chat'

type Props = {
  onPrompt: (value: string) => void
}

export default function WelcomeHero({ onPrompt }: Props) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.06fr) minmax(360px, 0.9fr)',
        gap: 20,
        alignItems: 'stretch',
      }}
      className="hx-welcome-grid"
    >
      <div
        style={cardStyle({
          padding: '42px 44px',
          minHeight: 560,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        })}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(212,165,116,0.06), transparent 45%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'rgba(212,165,116,0.50)',
              fontFamily: DS.monoFont,
            }}
          >
            Interface de clarté assistée par IA
          </div>

          <div
            style={{
              width: 60,
              height: 60,
              marginTop: 18,
              marginBottom: 22,
              background: DS.gradient,
              clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
              boxShadow: '0 0 46px rgba(212,165,116,0.20)',
            }}
          />

          <h1
            style={{
              margin: 0,
              maxWidth: 760,
              fontSize: 'clamp(40px, 5vw, 78px)',
              lineHeight: 0.96,
              letterSpacing: '-0.05em',
              fontFamily: DS.titleFont,
              fontWeight: 600,
              background: DS.titleGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 18px rgba(212,165,116,0.18))',
            }}
          >
            Un chat plus fin pour lire ton moment avec précision.
          </h1>

          <p
            style={{
              margin: '20px 0 0',
              maxWidth: 640,
              fontSize: 18,
              color: DS.textSoft,
              lineHeight: 1.82,
            }}
          >
            HexAstra commence par écouter la question, clarifie le vrai nœud, puis approfondit seulement si nécessaire.
            Le résultat : une expérience premium, simple côté usage, propre côté produit.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
            {['Français', 'English'].map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => onPrompt(label)}
                style={{
                  minWidth: 154,
                  minHeight: 44,
                  padding: '12px 20px',
                  borderRadius: 14,
                  border: 'none',
                  background: DS.gradient,
                  color: '#fff',
                  fontWeight: 700,
                  boxShadow: '0 14px 34px rgba(212,165,116,0.22)',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 18 }}>
            {HERO_PROMPTS.map((prompt) => (
              <button key={prompt} type="button" className="hx-chip" onClick={() => onPrompt(prompt)}>
                {prompt}
              </button>
            ))}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 10,
              marginTop: 28,
            }}
            className="hx-welcome-points"
          >
            {[
              ['Conversation d’abord', 'Tu poses la question avant toute donnée technique.'],
              ['Profondeur progressive', 'Le système va plus loin seulement quand c’est utile.'],
              ['Rendu premium', 'Hiérarchie claire, souffle visuel, vraie sensation produit.'],
            ].map(([title, body]) => (
              <div
                key={title}
                style={{
                  padding: '14px 14px',
                  borderRadius: 18,
                  background: 'rgba(255,255,255,0.02)',
                  border: `1px solid ${DS.line}`,
                }}
              >
                <div style={{ fontSize: 12, color: DS.text, fontWeight: 600 }}>{title}</div>
                <div style={{ fontSize: 12, color: DS.textMute, lineHeight: 1.65, marginTop: 5 }}>{body}</div>
              </div>
            ))}
          </div>

          <p
            style={{
              margin: '18px 0 0',
              fontSize: 11,
              color: 'rgba(255,255,255,0.24)',
              lineHeight: 1.75,
              fontStyle: 'italic',
              maxWidth: 620,
            }}
          >
            HexAstra Coach est un outil d’exploration et de réflexion personnelle. Il ne remplace pas un avis médical, juridique ou financier.
          </p>
        </div>
      </div>

      <div style={cardStyle({ padding: 0, overflow: 'hidden', minHeight: 480, display: 'flex', flexDirection: 'column' })}>
        <div
          style={{
            padding: '18px 20px',
            borderBottom: `1px solid ${DS.line}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(212,165,116,0.48)', fontFamily: DS.monoFont }}>
              Aperçu du chat
            </div>
            <div style={{ fontSize: 14, color: DS.text, fontFamily: DS.titleFont, fontWeight: 600, marginTop: 4 }}>
              Conversation en direct
            </div>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: DS.textSoft }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#57d27c',
                boxShadow: '0 0 0 5px rgba(87,210,124,0.10)',
              }}
            />
            En ligne
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, padding: 22, justifyContent: 'center' }}>
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
    </div>
  )
}

function PreviewBubble({ children, user = false }: { children: React.ReactNode; user?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: user ? 'flex-end' : 'flex-start' }}>
      <div
        style={{
          maxWidth: user ? '78%' : '84%',
          padding: '15px 16px',
          borderRadius: user ? '20px 20px 10px 20px' : '20px 20px 20px 12px',
          background: user ? 'rgba(212,165,116,0.12)' : 'rgba(255,255,255,0.04)',
          border: user ? '1px solid rgba(212,165,116,0.18)' : '1px solid rgba(255,255,255,0.05)',
          color: DS.text,
          fontSize: 14,
          lineHeight: 1.72,
        }}
      >
        {children}
      </div>
    </div>
  )
}
