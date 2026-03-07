'use client'

import type { Mode } from '../_lib/chat'
import { DS } from '../_lib/chat'

type Props = {
  mode: Mode
  onModeChange: (mode: Mode) => void
  onOpenLeft: () => void
  onOpenRight: () => void
  desktopLeft: boolean
  desktopRight: boolean
}

export default function ChatHeader({
  mode,
  onModeChange,
  onOpenLeft,
  onOpenRight,
  desktopLeft,
  desktopRight,
}: Props) {
  const modes: Mode[] = ['essentiel', 'premium', 'praticien']

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        padding: '20px 28px 14px',
        background:
          'linear-gradient(180deg, rgba(9,7,5,0.86), rgba(9,7,5,0.48))',
        backdropFilter: 'blur(26px)',
        WebkitBackdropFilter: 'blur(26px)',
        borderBottom: `1px solid ${DS.line}`,
      }}
    >
      <div
        style={{
          maxWidth: 1220,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          {!desktopLeft && <HeaderIconButton label="Navigation" onClick={onOpenLeft}>☰</HeaderIconButton>}

          <div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(212,165,116,0.52)',
                fontFamily: DS.monoFont,
                marginBottom: 4,
              }}
            >
              Conversation privée · interface premium
            </div>
            <div
              style={{
                fontFamily: DS.titleFont,
                fontWeight: 600,
                fontSize: 'clamp(20px, 2.2vw, 26px)',
                color: DS.text,
                letterSpacing: '-0.03em',
              }}
            >
              HexAstra <span style={{ color: DS.amber }}>Coach</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div
            style={{
              display: 'flex',
              padding: 4,
              borderRadius: 16,
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${DS.line}`,
            }}
          >
            {modes.map((item) => {
              const active = item === mode
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => onModeChange(item)}
                  style={{
                    padding: '9px 14px',
                    borderRadius: 12,
                    border: 'none',
                    background: active
                      ? 'linear-gradient(180deg, rgba(212,165,116,0.16), rgba(212,165,116,0.08))'
                      : 'transparent',
                    color: active ? DS.text : DS.textMute,
                    fontSize: 12,
                    textTransform: 'capitalize',
                    fontFamily: DS.bodyFont,
                    fontWeight: active ? 600 : 500,
                  }}
                >
                  {item}
                </button>
              )
            })}
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '0 12px',
              height: 38,
              borderRadius: 999,
              border: `1px solid ${DS.line}`,
              background: 'rgba(255,255,255,0.03)',
              color: DS.textSoft,
              fontSize: 12,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: DS.success,
                boxShadow: '0 0 0 4px rgba(87,210,124,0.10)',
              }}
            />
            Réponse en quelques secondes
          </div>

          {!desktopRight && <HeaderIconButton label="Outils" onClick={onOpenRight}>⋮</HeaderIconButton>}
        </div>
      </div>
    </header>
  )
}

function HeaderIconButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      style={{
        width: 38,
        height: 38,
        borderRadius: 12,
        display: 'grid',
        placeItems: 'center',
        border: `1px solid ${DS.line}`,
        background: 'rgba(255,255,255,0.03)',
        color: DS.textSoft,
      }}
    >
      {children}
    </button>
  )
}
