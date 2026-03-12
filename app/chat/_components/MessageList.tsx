'use client'

import { useEffect, useRef } from 'react'
import type { Msg } from '../_lib/chat'
import MessageBubble from './MessageBubble'

type Props = {
  messages: Msg[]
  isTyping: boolean
}

export default function MessageList({ messages, isTyping }: Props) {
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: messages.length > 1 ? 'smooth' : 'auto',
      block: 'end',
    })
  }, [messages, isTyping])

  return (
    <div className="hx-message-list">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isTyping ? (
        <div className="hx-message-row is-assistant">
          <div className="hx-message-bubble is-assistant hx-message-typing">
            <span className="hx-typing-dot" />
            <span className="hx-typing-dot" />
            <span className="hx-typing-dot" />
          </div>
        </div>
      ) : null}

      <div ref={endRef} />
    </div>
  )
}