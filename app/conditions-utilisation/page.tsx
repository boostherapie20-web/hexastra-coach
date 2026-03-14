'use client'

import StaticPageShell from '@/app/components/StaticPageShell'
import { useTranslation } from '@/lib/i18n/useTranslation'

export default function ConditionsUtilisationPage() {
  const { t } = useTranslation()

  const sections = [
    { title: t('cgu.s1Title'), body: t('cgu.s1Body') },
    { title: t('cgu.s2Title'), body: t('cgu.s2Body') },
    { title: t('cgu.s3Title'), body: t('cgu.s3Body') },
    { title: t('cgu.s4Title'), body: t('cgu.s4Body') },
    { title: t('cgu.s5Title'), body: t('cgu.s5Body') },
    { title: t('cgu.s6Title'), body: t('cgu.s6Body') },
    { title: t('cgu.s7Title'), body: t('cgu.s7Body') },
    { title: t('cgu.s8Title'), body: t('cgu.s8Body') },
    { title: t('cgu.s9Title'), body: t('cgu.s9Body') },
    { title: t('cgu.s10Title'), body: t('cgu.s10Body') },
  ]

  return (
    <StaticPageShell backLabel={t('cgu.backLabel')} backHref="/">
      <div className="hx-prose-page">
        <div className="hx-prose-header">
          <div className="hx-prose-kicker">{t('cgu.kicker')}</div>
          <h1 className="hx-prose-title">{t('cgu.title')}</h1>
          <p className="hx-prose-meta">{t('cgu.updated')}</p>
        </div>

        <div className="hx-prose-body">
          {sections.map((section) => (
            <section key={section.title} className="hx-prose-section">
              <h2 className="hx-prose-h2">{section.title}</h2>
              <p className="hx-prose-p">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </StaticPageShell>
  )
}
