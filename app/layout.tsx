import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HexAstra — Comprenez votre moment de vie',
  description: 'HexAstra analyse votre situation et vous donne des clés concrètes pour vos relations, vos décisions et votre évolution personnelle.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Serif+Display:ital@0;1&family=Geist+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
