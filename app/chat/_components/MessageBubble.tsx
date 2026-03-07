'use client'

import { DS, type Msg } from '../_lib/chat'

type Props = {
  message: Msg
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user'

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
      }}
    >
      <div
        style={{
          maxWidth: 'min(760px, 86%)',
          padding: '16px 18px',
          borderRadius: 24,
          background: isUser ? 'rgba(25,195,125,0.12)' : 'rgba(255,255,255,0.86)',
          border: `1px solid ${isUser ? 'rgba(25,195,125,0.20)' : DS.line}`,
          boxShadow: isUser ? '0 10px 28px rgba(25,195,125,0.10)' : DS.shadowSoft,
          color: DS.text,
          lineHeight: 1.8,
          fontSize: 15,
          whiteSpace: 'pre-wrap',
        }}
      >
        {message.content}
      </div>
    </div>
  )
}
