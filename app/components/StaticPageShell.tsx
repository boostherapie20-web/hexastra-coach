import Link from 'next/link'
import HexastraLogo from './HexastraLogo'

interface StaticPageShellProps {
  children: React.ReactNode
  backLabel?: string
  backHref?: string
}

export default function StaticPageShell({
  children,
  backLabel = '← Retour',
  backHref = '/',
}: StaticPageShellProps) {
  return (
    <div className="hx-static-page">
      <div className="hx-static-bg" />

      <header className="hx-static-header">
        <Link href="/" className="hx-home-brand" aria-label="HexAstra Coach">
          <div className="hx-home-brand-badge">
            <HexastraLogo size={20} variant="navbar" priority />
          </div>
          <div className="hx-home-brand-text">
            <div className="hx-home-brand-title">HexAstra Coach</div>
          </div>
        </Link>

        <Link href={backHref} className="hx-static-back">
          {backLabel}
        </Link>
      </header>

      <main className="hx-static-main">
        {children}
      </main>

      <footer className="hx-static-footer">
        <div className="hx-static-footer-inner">
          <span>© 2025, Hexastra Coach</span>
          <div className="hx-static-footer-links">
            <Link href="/support">Support</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/politique-confidentialite">Confidentialité</Link>
            <Link href="/conditions-utilisation">CGU</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
