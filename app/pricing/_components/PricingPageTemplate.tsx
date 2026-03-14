'use client'

import Link from 'next/link'
import PremiumBackground from '@/app/components/PremiumBackground'
import HexastraLogo from '@/app/components/HexastraLogo'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { usePlansUI } from '@/lib/usePlansUI'
import type { PlanKey } from '@/types/subscription'

export default function PricingPageTemplate({ planKey }: { planKey: PlanKey }) {
  const { t } = useTranslation()
  const plans = usePlansUI()
  const plan = plans.find((p) => p.key === planKey)!

  return (
    <main className="hx-pricing-page">
      <PremiumBackground hero />
      <div className="hx-pricing-page-overlay" />

      <header className="hx-pricing-header">
        <Link href="/" className="hx-home-brand" aria-label="HexAstra Coach">
          <div className="hx-home-brand-badge">
            <HexastraLogo size={22} variant="navbar" priority />
          </div>
          <div className="hx-home-brand-text">
            <div className="hx-home-brand-title">HexAstra Coach</div>
            <div className="hx-home-brand-subtitle">{t('pricing.brandSub')}</div>
          </div>
        </Link>

        <Link href="/#offres" className="hx-pricing-back-link">
          {t('pricing.backLink')}
        </Link>
      </header>

      <div className="hx-pricing-content">
        <div className="hx-pricing-wrap">

          {plan.badge && (
            <div className="hx-pricing-badge">{plan.badge}</div>
          )}

          <div className="hx-home-kicker">{plan.label}</div>

          <div className="hx-pricing-price-row">
            <span className="hx-pricing-price-amount">{plan.price}</span>
            <span className="hx-pricing-price-period">{plan.period}</span>
          </div>

          <p className="hx-pricing-tagline">{plan.desc}</p>

          <div className="hx-pricing-divider" />

          <ul className="hx-pricing-feature-list">
            {plan.features.map((feature) => (
              <li key={feature} className="hx-pricing-feature-item">
                <span className="hx-pricing-feature-glyph">✦</span>
                {feature}
              </li>
            ))}
          </ul>

          <Link
            href={`/auth?plan=${planKey}`}
            className="hx-pricing-cta-btn"
          >
            {plan.cta}
          </Link>

          <p className="hx-pricing-legal">
            {t('pricing.legal')}
          </p>
        </div>

        <Link href="/#offres" className="hx-pricing-compare-link">
          {t('pricing.compareLink')}
        </Link>
      </div>
    </main>
  )
}
