'use client'

import { useEffect, useRef, useState } from 'react'
import { DS, QUICK_PROMPTS } from '../_lib/chat'

type Props = {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onQuickPrompt: (value: string) => void
  showQuickPrompts: boolean
}

export default function Composer({ value, onChange, onSend, onQuickPrompt, showQuickPrompts }: Props) {
  const [focused, setFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (!textareaRef.current) return
    textareaRef.current.style.height = 'auto'
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
  }, [value])

  return (
    <div style={{ maxWidth: 980, margin: '0 auto' }}>
      {showQuickPrompts && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 12 }}>
          {QUICK_PROMPTS.map((prompt) => (
            <button key={prompt} type="button" onClick={() => onQuickPrompt(prompt)} className="hx-chip">
              {prompt}
            </button>
          ))}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 12,
          borderRadius: 28,
          padding: '14px 16px',
          background: '#ffffff',
          border: `1px solid ${focused ? 'rgba(25,195,125,0.34)' : DS.lineStrong}`,
          boxShadow: focused
            ? '0 0 0 4px rgba(25,195,125,0.08), 0 18px 40px rgba(16,24,20,0.08)'
            : '0 10px 30px rgba(16,24,20,0.08)',
          transition: 'border-color 0.24s ease, box-shadow 0.24s ease',
        }}
      >
        <IconGhost title="Ajouter des données plus tard">◎</IconGhost>
        <IconGhost title="Assistant">◈</IconGhost>

        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              onSend()
            }
          }}
          placeholder="Décris ta situation, ton dilemme ou la zone que tu veux éclaircir…"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            minHeight: 28,
            maxHeight: 120,
            overflowY: 'auto',
            padding: '8px 2px 6px',
            color: DS.text,
            fontFamily: DS.bodyFont,
            fontSize: 16,
            lineHeight: 1.8,
            letterSpacing: '0.01em',
          }}
        />

        <button
          type="button"
          onClick={onSend}
          disabled={!value.trim()}
          style={{
            minWidth: 58,
            padding: '11px 16px',
            borderRadius: 16,
            border: 'none',
            background: value.trim() ? DS.gradient : '#E7EFE9',
            color: value.trim() ? '#fff' : DS.textFaint,
            fontWeight: 700,
            cursor: value.trim() ? 'pointer' : 'not-allowed',
            boxShadow: value.trim() ? '0 10px 28px rgba(25,195,125,0.25)' : 'none',
          }}
        >
          →
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 12px',
            borderRadius: 999,
            border: `1px solid ${DS.line}`,
            background: 'rgba(255,255,255,0.74)',
            color: DS.textMute,
            fontSize: 11,
          }}
        >
          <span style={{ color: DS.emerald }}>↵</span>
          Entrée pour envoyer · Maj + Entrée pour revenir à la ligne
        </div>
      </div>
    </div>
  )
}

function IconGhost({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <button
      type="button"
      aria-label={title}
      title={title}
      style={{
        width: 38,
        height: 38,
        borderRadius: 12,
        display: 'grid',
        placeItems: 'center',
        border: `1px solid ${DS.line}`,
        background: '#F6FAF6',
        color: DS.textMute,
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  )
}
