import type { Metadata } from 'next'
import './globals.css'
import I18nProvider from '@/lib/i18n/I18nProvider'

export const metadata: Metadata = {
  title: 'HexAstra — Comprenez votre moment de vie',
  description: 'HexAstra analyse votre situation et vous donne des clés concrètes pour vos relations, vos décisions et votre évolution personnelle.',
  keywords: ['astrologie', 'human design', 'analyse personnelle', 'IA', 'lecture natale'],
  authors: [{ name: 'HexAstra' }],

  // ── Favicon & App Icons ──────────────────────────────
  icons: {
    icon: [
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon/favicon-64x64.png', sizes: '64x64', type: 'image/png' },
      { url: '/favicon/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/favicon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon/favicon-32x32.png',
  },

  // ── Open Graph (Facebook, LinkedIn, WhatsApp…) ───────
  openGraph: {
    title: 'HexAstra — Comprenez votre moment de vie',
    description: 'Analyse personnalisée par IA · Astrologie · Human Design · PDF + Audio',
    url: 'https://hexastra.app',
    siteName: 'HexAstra',
    images: [
      {
        url: '/social/hexastra-og-image.png',
        width: 1200,
        height: 1200,
        alt: 'HexAstra — Intelligence Personnelle',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },

  // ── Twitter / X Card ────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    title: 'HexAstra — Comprenez votre moment de vie',
    description: 'Analyse personnalisée par IA · Astrologie · Human Design · PDF + Audio',
    images: ['/social/hexastra-twitter.png'],
  },

  // ── PWA / Mobile ────────────────────────────────────
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'HexAstra',
  },

  // ── Robots ──────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* ── Typography: Sora (titres) + Inter (interface) ── */}
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* Couleur de la barre du navigateur sur mobile */}
        <meta name="theme-color" content="#2C1F1A" />
        <meta name="msapplication-TileColor" content="#2C1F1A" />
      </head>
      <body><I18nProvider>{children}</I18nProvider></body>
    </html>
  )
}
