'use client'

import type { ReactNode } from 'react'
import { DS } from '../_lib/chat'

type Props = {
  left?: ReactNode
  right?: ReactNode
  header: ReactNode
  body: ReactNode
  composer: ReactNode
  showLeft: boolean
  showRight: boolean
  onCloseLeft: () => void
  onCloseRight: () => void
  desktopLeft: boolean
  desktopRight: boolean
}

export default function ChatShell({
  left,
  right,
  header,
  body,
  composer,
  showLeft,
  showRight,
  onCloseLeft,
  onCloseRight,
  desktopLeft,
  desktopRight,
}: Props) {
  return (
    <div style={{ minHeight: '100vh', overflow: 'hidden', position: 'relative', background: DS.bg0 }}>
      {!desktopLeft && showLeft && (
        <Drawer side="left" onClose={onCloseLeft}>
          {left}
        </Drawer>
      )}

      {!desktopRight && showRight && (
        <Drawer side="right" onClose={onCloseRight}>
          {right}
        </Drawer>
      )}

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'grid',
          gridTemplateColumns: `${desktopLeft ? '278px ' : ''}minmax(0,1fr)${desktopRight ? ' auto' : ''}`,
          minHeight: '100vh',
        }}
      >
        {desktopLeft && left}

        <main style={{ minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {header}

          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              padding: '24px 28px 22px',
            }}
          >
            {body}
          </div>

          <div
            style={{
              position: 'sticky',
              bottom: 0,
              zIndex: 19,
              padding: '10px 28px 22px',
              background:
                'linear-gradient(180deg, rgba(10,7,5,0.00), rgba(10,7,5,0.62) 24%, rgba(10,7,5,0.96) 100%)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
            }}
          >
            {composer}
          </div>
        </main>

        {desktopRight && right}
      </div>
    </div>
  )
}

function Drawer({
  children,
  side,
  onClose,
}: {
  children: ReactNode
  side: 'left' | 'right'
  onClose: () => void
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: side === 'left' ? 278 : 252,
          maxWidth: '88vw',
          marginLeft: side === 'right' ? 'auto' : 0,
        }}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
