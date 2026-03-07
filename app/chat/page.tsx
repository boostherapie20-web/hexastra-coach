import { Suspense } from 'react'
import ChatPageClient from './_components/ChatPageClient'

export default function ChatPage() {
  return (
    <Suspense fallback={null}>
      <ChatPageClient />
    </Suspense>
  )
}
