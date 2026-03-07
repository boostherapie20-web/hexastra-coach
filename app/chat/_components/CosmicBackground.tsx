'use client'

import Image from 'next/image'

export default function CosmicBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
        background:
          'radial-gradient(circle at 50% 0%, rgba(212,165,116,0.08), transparent 32%), linear-gradient(180deg, #0a0706 0%, #0f0a07 38%, #120b08 100%)',
      }}
    >
      <div className="hx-stars" style={{ opacity: 0.9 }} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 18% 20%, rgba(212,165,116,0.08), transparent 42%), radial-gradient(ellipse at 82% 16%, rgba(212,165,116,0.05), transparent 34%), radial-gradient(ellipse at 52% 78%, rgba(140,98,57,0.06), transparent 36%)',
        }}
      />

      <div className="hx-sacred-halo" style={{ opacity: 0.36 }} />

      <div
        className="hx-sacred-geometry"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.07,
        }}
      >
        <Image
          src="/hexastra-sacred-geometry.png"
          alt=""
          width={1120}
          height={1120}
          priority
          style={{
            width: 'min(1120px, 86vw)',
            height: 'auto',
            filter: 'drop-shadow(0 0 80px rgba(212,165,116,0.08)) blur(0.4px) saturate(0.92)',
          }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at center, transparent 0%, rgba(6,4,3,0.1) 60%, rgba(6,4,3,0.38) 100%)',
        }}
      />
    </div>
  )
}
