'use client'

import { useState } from 'react'
import StaticPageShell from '@/app/components/StaticPageShell'
import { useTranslation } from '@/lib/i18n/useTranslation'

export default function ContactPage() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.message) return
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('send_failed')
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <StaticPageShell backHref="/" backLabel={t('contact.backLabel')}>
      <div className="hx-static-hero">
        <div className="hx-home-kicker">{t('contact.kicker')}</div>
        <h1 className="hx-static-title">{t('contact.title')}</h1>
        <p className="hx-static-lead">{t('contact.lead')}</p>
      </div>

      <div className="hx-contact-wrap">
        {status === 'sent' ? (
          <div className="hx-contact-success">
            <div className="hx-contact-success-glyph">✦</div>
            <h2>{t('contact.successTitle')}</h2>
            <p>{t('contact.successText')}</p>
          </div>
        ) : (
          <form className="hx-contact-form" onSubmit={handleSubmit} noValidate>
            <div className="hx-contact-row hx-contact-row-2">
              <div className="hx-contact-field">
                <label className="hx-contact-label">{t('contact.fieldName')}</label>
                <input
                  className="hx-contact-input"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={t('contact.namePlaceholder')}
                  autoComplete="name"
                />
              </div>
              <div className="hx-contact-field">
                <label className="hx-contact-label">
                  {t('contact.fieldEmail')} <span className="hx-contact-required">*</span>
                </label>
                <input
                  className="hx-contact-input"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t('contact.emailPlaceholder')}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="hx-contact-field">
              <label className="hx-contact-label">{t('contact.fieldSubject')}</label>
              <select
                className="hx-contact-input hx-contact-select"
                name="subject"
                value={form.subject}
                onChange={handleChange}
              >
                <option value="">{t('contact.subjectDefault')}</option>
                <option value="question">{t('contact.subjectGeneral')}</option>
                <option value="abonnement">{t('contact.subjectBilling')}</option>
                <option value="bug">{t('contact.subjectBug')}</option>
                <option value="feedback">{t('contact.subjectFeedback')}</option>
                <option value="autre">{t('contact.subjectOther')}</option>
              </select>
            </div>

            <div className="hx-contact-field">
              <label className="hx-contact-label">
                {t('contact.fieldMessage')} <span className="hx-contact-required">*</span>
              </label>
              <textarea
                className="hx-contact-input hx-contact-textarea"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder={t('contact.messagePlaceholder')}
                required
                rows={6}
              />
            </div>

            <button
              type="submit"
              className="hx-contact-submit"
              disabled={status === 'sending' || !form.email || !form.message}
            >
              {status === 'sending' ? t('contact.sending') : t('contact.submit')}
            </button>

            {status === 'error' && (
              <p className="hx-contact-error">{t('contact.error')}</p>
            )}
          </form>
        )}

        <aside className="hx-contact-aside">
          <div className="hx-contact-aside-block">
            <div className="hx-home-kicker">{t('contact.asideResponseKicker')}</div>
            <p>{t('contact.asideResponseText')}</p>
          </div>
          <div className="hx-contact-aside-block">
            <div className="hx-home-kicker">{t('contact.asideSupportKicker')}</div>
            <p>
              {t('contact.asideSupportText').replace(t('contact.asideSupportLink'), '')}
              <a href="/support">{t('contact.asideSupportLink')}</a>
            </p>
          </div>
          <div className="hx-contact-aside-block">
            <div className="hx-home-kicker">{t('contact.asideBillingKicker')}</div>
            <p>{t('contact.asideBillingText')}</p>
          </div>
        </aside>
      </div>
    </StaticPageShell>
  )
}
