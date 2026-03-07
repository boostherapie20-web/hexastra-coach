'use client'

import { DS, formatClock, type Msg } from '../_lib/chat'

type Props = {
  message: Msg
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user'

  if (message.content === '__welcome__') return null

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        justifyContent: isUser ? 'flex-end' : 'flex-start',
      }}
    >
      {!isUser && (
        <div
          style={{
            width: 30,
            height: 30,
            minWidth: 30,
            marginTop: 6,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            background: 'rgba(212,165,116,0.08)',
            border: `1px solid ${DS.lineWarm}`,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              background: DS.gradient,
              clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
            }}
          />
        </div>
      )}

      <div
        style={{
          maxWidth: isUser ? 'min(760px, 86%)' : 'min(860px, 92%)',
          borderRadius: isUser ? '26px 26px 10px 26px' : '30px 30px 30px 14px',
          padding: isUser ? '16px 18px' : '18px 22px',
          color: DS.text,
          background: isUser
            ? 'linear-gradient(180deg, rgba(212,165,116,0.16), rgba(212,165,116,0.08))'
            : 'linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.022))',
          border: isUser ? `1px solid ${DS.lineWarm}` : `1px solid ${DS.line}`,
          boxShadow: isUser ? '0 12px 34px rgba(0,0,0,0.18)' : '0 18px 48px rgba(0,0,0,0.18)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
        }}
      >
        <p
          style={{
            margin: 0,
            whiteSpace: 'pre-wrap',
            fontFamily: DS.bodyFont,
            fontSize: 16,
            lineHeight: 1.85,
            letterSpacing: '0.005em',
          }}
        >
          {message.content}
        </p>

        <div
          style={{
            marginTop: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: isUser ? 'flex-end' : 'space-between',
            gap: 8,
          }}
        >
          {message.cached && !isUser && (
            <span style={{ fontSize: 9, color: DS.textFaint, fontFamily: DS.monoFont }}>cache</span>
          )}
          <span style={{ fontSize: 9, color: DS.textFaint, fontFamily: DS.monoFont, letterSpacing: '0.08em' }}>
            {formatClock(message.created_at)}
          </span>
        </div>
      </div>
    </div>
  )
}
