'use client'

import { Fragment, useState } from 'react'
import Image from 'next/image'
import type { Msg } from '../_lib/chat'

type Props = {
  message: Msg
}

function formatTime(iso: string): string {
  try {
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

// ── Inline markdown (bold, italic, code) ─────────────────────────────────
function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*\n]+\*\*|\*[^*\n]+\*|`[^`\n]+`)/)
  return parts.map((seg, i) => {
    if (seg.startsWith('**') && seg.endsWith('**')) return <strong key={i}>{seg.slice(2, -2)}</strong>
    if (seg.startsWith('*') && seg.endsWith('*')) return <em key={i}>{seg.slice(1, -1)}</em>
    if (seg.startsWith('`') && seg.endsWith('`')) return <code key={i} className="hx-md-code">{seg.slice(1, -1)}</code>
    return seg
  })
}

// ── Block markdown (paragraphs, headings, lists) ─────────────────────────
function renderMarkdown(text: string): React.ReactNode {
  const blocks = text.split(/\n\n+/)
  return blocks.map((block, bi) => {
    const lines = block.split('\n').filter((l) => l.trim())
    if (!lines.length) return null

    // Heading (single line)
    if (lines.length === 1) {
      const line = lines[0]
      if (line.startsWith('### ')) return <h4 key={bi} className="hx-md-h4">{renderInline(line.slice(4))}</h4>
      if (line.startsWith('## '))  return <h3 key={bi} className="hx-md-h3">{renderInline(line.slice(3))}</h3>
      if (line.startsWith('# '))   return <h2 key={bi} className="hx-md-h2">{renderInline(line.slice(2))}</h2>
    }

    // Unordered list — all lines start with - • or *
    if (lines.every((l) => /^[-•*]\s/.test(l))) {
      return (
        <ul key={bi} className="hx-md-list">
          {lines.map((l, li) => (
            <li key={li} className="hx-md-item">{renderInline(l.replace(/^[-•*]\s+/, ''))}</li>
          ))}
        </ul>
      )
    }

    // Ordered list — all lines start with "1. " etc.
    if (lines.every((l) => /^\d+\.\s/.test(l))) {
      return (
        <ol key={bi} className="hx-md-list hx-md-ol">
          {lines.map((l, li) => (
            <li key={li} className="hx-md-item">{renderInline(l.replace(/^\d+\.\s+/, ''))}</li>
          ))}
        </ol>
      )
    }

    // Paragraph
    return (
      <p key={bi} className="hx-md-p">
        {lines.map((line, li) => (
          <Fragment key={li}>
            {li > 0 && <br />}
            {renderInline(line)}
          </Fragment>
        ))}
      </p>
    )
  })
}

function IconCopy() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <rect x="4.5" y="1" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1 4.5v7A1.5 1.5 0 002.5 13h7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M2 7l3.5 3.5 5.5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function MessageBubble({ message }: Props) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'
  const isWelcome = message.content === '__welcome__'
  const time = isWelcome ? '' : formatTime(message.created_at)

  if (isWelcome) return null

  function handleCopy() {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }

  return (
    <div className={`hx-message-row${isUser ? ' is-user' : ' is-assistant'}`}>
      {!isUser && (
        <div className="hx-message-avatar" aria-hidden="true">
          <Image
            src="/logo/hexastra_logo_white_petals_triangles.svg"
            alt=""
            width={34}
            height={34}
            className="hx-message-avatar-logo"
          />
        </div>
      )}
      <div className={`hx-message-bubble${isUser ? ' is-user' : ' is-assistant'}`}>
        <div className="hx-message-content">
          {isUser ? message.content : renderMarkdown(message.content)}
        </div>
        {!isUser && (
          <div className="hx-message-actions">
            <button
              type="button"
              className={`hx-message-copy-btn${copied ? ' is-copied' : ''}`}
              onClick={handleCopy}
              aria-label="Copier le message"
            >
              {copied ? <IconCheck /> : <IconCopy />}
              <span>{copied ? 'Copié !' : 'Copier'}</span>
            </button>
          </div>
        )}
        {time && (
          <div className={`hx-message-time${isUser ? ' is-user' : ''}`}>{time}</div>
        )}
      </div>
    </div>
  )
}
