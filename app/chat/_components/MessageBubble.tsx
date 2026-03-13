'use client'

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

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user'
  const isWelcome = message.content === '__welcome__'
  const time = isWelcome ? '' : formatTime(message.created_at)

  if (isWelcome) return null

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
        <div className="hx-message-content">{message.content}</div>
        {time && (
          <div className={`hx-message-time${isUser ? ' is-user' : ''}`}>
            {time}
          </div>
        )}
      </div>
    </div>
  )
}
