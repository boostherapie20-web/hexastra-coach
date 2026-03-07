'use client'

import { useEffect, useRef } from 'react'
import type { Msg } from '../_lib/chat'
import { DS } from '../_lib/chat'
import MessageBubble from './MessageBubble'

type Props = {
  messages: Msg[]
  isTyping: boolean
}

export default function MessageList({ messages, isTyping }: Props) {
  const endRef = useRef<HTMLDivElement | null>(null)
  const visibleMessages = messages.filter((message) => message.content !== '__welcome__')

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            padding: '8px 14px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${DS.line}`,
            fontSize: 10,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(212,165,116,0.42)',
            fontFamily: DS.monoFont,
          }}
        >
          Conversation privée · analyse personnelle
        </div>
      </div>

      {visibleMessages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isTyping && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              background: 'rgba(212,165,116,0.08)',
              border: `1px solid ${DS.lineWarm}`,
            }}
          >
            <div
              style={{
                width: 13,
                height: 13,
                background: DS.gradient,
                clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, padding: '8px 0', alignItems: 'center' }}>
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: 'rgba(212,165,116,0.50)',
                  display: 'inline-block',
                  animation: 'blink 1.4s ease-in-out infinite',
                  animationDelay: `${index * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div ref={endRef} />
    </div>
  )
}
