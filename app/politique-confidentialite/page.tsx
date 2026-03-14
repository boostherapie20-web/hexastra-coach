'use client'

import StaticPageShell from '@/app/components/StaticPageShell'
import { useTranslation } from '@/lib/i18n/useTranslation'
import Link from 'next/link'

export default function PolitiqueConfidentialitePage() {
  const { t } = useTranslation()

  return (
    <StaticPageShell backHref="/" backLabel={t('privacy.backLabel')}>
      <div className="hx-static-hero">
        <div className="hx-home-kicker">{t('privacy.kicker')}</div>
        <h1 className="hx-static-title">{t('privacy.title')}</h1>
        <p className="hx-static-lead">{t('privacy.updated')}</p>
      </div>

      <div className="hx-prose-wrap">

        <section className="hx-prose-section">
          <h2>{t('privacy.s1Title')}</h2>
          <p>{t('privacy.s1Body')}</p>
        </section>

        <section className="hx-prose-section">
          <h2>{t('privacy.s2Title')}</h2>
          <p>{t('privacy.s2Intro')}</p>
          <ul>
            <li>{t('privacy.s2I1')}</li>
            <li>{t('privacy.s2I2')}</li>
            <li>{t('privacy.s2I3')}</li>
            <li>{t('privacy.s2I4')}</li>
          </ul>
        </section>

        <section className="hx-prose-section">
          <h2>{t('privacy.s3Title')}</h2>
          <p>{t('privacy.s3Intro')}</p>
          <ul>
            <li>{t('privacy.s3I1')}</li>
            <li>{t('privacy.s3I2')}</li>
            <li>{t('privacy.s3I3')}</li>
            <li>{t('privacy.s3I4')}</li>
          </ul>
          <p>{t('privacy.s3Note')}</p>
        </section>

        <section className="hx-prose-section">
          <h2>{t('privacy.s4Title')}</h2>
          <p>{t('privacy.s4Intro')}</p>
          <ul>
            <li>{t('privacy.s4I1')}</li>
            <li>{t('privacy.s4I2')}</li>
            <li>{t('privacy.s4I3')}</li>
            <li>{t('privacy.s4I4')}</li>
          </ul>
          <p>{t('privacy.s4Note')}</p>
        </section>

        <section className="hx-prose-section">
          <h2>{t('privacy.s5Title')}</h2>
          <p>{t('privacy.s5Body')}</p>
        </section>

        <section className="hx-prose-section">
          <h2>{t('privacy.s6Title')}</h2>
          <p>{t('privacy.s6Intro')}</p>
          <ul>
            <li>{t('privacy.s6I1')}</li>
            <li>{t('privacy.s6I2')}</li>
            <li>{t('privacy.s6I3')}</li>
            <li>{t('privacy.s6I4')}</li>
            <li>{t('privacy.s6I5')}</li>
          </ul>
          <p>
            {t('privacy.s6Note')}{' '}
            <Link href="/contact">{t('privacy.s6ContactLink')}</Link>.
          </p>
        </section>

        <section className="hx-prose-section">
          <h2>{t('privacy.s7Title')}</h2>
          <p>{t('privacy.s7Body')}</p>
        </section>

        <section className="hx-prose-section">
          <h2>{t('privacy.s8Title')}</h2>
          <p>{t('privacy.s8Body')}</p>
        </section>

        <section className="hx-prose-section">
          <h2>{t('privacy.s9Title')}</h2>
          <p>{t('privacy.s9Body')}</p>
        </section>

        <section className="hx-prose-section">
          <h2>{t('privacy.s10Title')}</h2>
          <p>
            {t('privacy.s10Body')}{' '}
            <Link href="/contact">{t('privacy.s10ContactLink')}</Link>.
          </p>
        </section>

      </div>
    </StaticPageShell>
  )
}
