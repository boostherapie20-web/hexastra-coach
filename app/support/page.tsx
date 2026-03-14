'use client'

import Link from 'next/link'
import StaticPageShell from '@/app/components/StaticPageShell'
import { useTranslation } from '@/lib/i18n/useTranslation'

export default function SupportPage() {
  const { t } = useTranslation()

  const faqs = [
    { question: t('support.faq1Q'), answer: t('support.faq1A') },
    { question: t('support.faq2Q'), answer: t('support.faq2A') },
    { question: t('support.faq3Q'), answer: t('support.faq3A') },
    { question: t('support.faq4Q'), answer: t('support.faq4A') },
    { question: t('support.faq5Q'), answer: t('support.faq5A') },
    { question: t('support.faq6Q'), answer: t('support.faq6A') },
  ]

  return (
    <StaticPageShell backHref="/" backLabel={t('support.backLabel')}>
      <div className="hx-static-hero">
        <div className="hx-home-kicker">{t('support.kicker')}</div>
        <h1 className="hx-static-title">{t('support.title')}</h1>
        <p className="hx-static-lead">{t('support.lead')}</p>
        <Link href="/contact" className="hx-static-cta">
          {t('support.contactCta')}
        </Link>
      </div>

      <div className="hx-support-faq">
        <h2 className="hx-static-section-title">{t('support.faqTitle')}</h2>
        <div className="hx-support-faq-list">
          {faqs.map((item) => (
            <div key={item.question} className="hx-support-faq-item">
              <h3 className="hx-support-faq-q">{item.question}</h3>
              <p className="hx-support-faq-a">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="hx-static-contact-band">
        <div className="hx-home-kicker">{t('support.bandKicker')}</div>
        <p className="hx-static-contact-text">{t('support.bandText')}</p>
        <Link href="/contact" className="hx-static-cta">
          {t('support.bandCta')}
        </Link>
      </div>
    </StaticPageShell>
  )
}
