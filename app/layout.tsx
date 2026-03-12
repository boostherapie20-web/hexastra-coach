import type { Metadata } from 'next'
import './globals.css'
import I18nProvider from '@/lib/i18n/I18nProvider'

export const metadata: Metadata = {
  title: 'HexAstra — Comprenez votre moment de vie',
  description:
    'HexAstra analyse votre situation et vous donne des clés concrètes pour vos relations, vos décisions et votre évolution personnelle.',
  icons: {
    icon: [
      { url: '/favicon/favicon_16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon_32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon_64.png', sizes: '64x64', type: 'image/png' },
    ],
    apple: [{ url: '/favicon/favicon_180.png', sizes: '180x180', type: 'image/png' }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&family=Sora:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#07131d" />
      </head>

      <body className="hexastra-body">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  )
}