'use client'

import { DS, type Msg } from '../_lib/chat'
import MessageBubble from './MessageBubble'

type Props = {
  messages: Msg[]
  isTyping: boolean
}

export default function MessageList({ messages, isTyping }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        maxWidth: 980,
        margin: '0 auto',
        paddingBottom: 18,
      }}
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isTyping && (
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '14px 16px',
              borderRadius: 22,
              background: 'rgba(255,255,255,0.84)',
              border: `1px solid ${DS.line}`,
              boxShadow: DS.shadowSoft,
            }}
          >
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 999,
                  background: DS.emerald,
                  opacity: 0.35 + dot * 0.18,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
