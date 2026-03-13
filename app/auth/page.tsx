'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useTranslation } from '@/lib/i18n/useTranslation'
import LanguageSwitcher from '@/app/components/LanguageSwitcher'

type AuthMode = 'login' | 'signup'

export default function AuthPage() {
  const supabase = createClient()
  const { t } = useTranslation()

  const [mode, setMode] = useState<AuthMode>('login')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  function notify(msg: string, error = false) {
    setMessage(msg)
    setIsError(error)
  }

  async function handleGoogle() {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
    setLoading(false)
  }

  async function handleLogin() {
    if (!email || !password) return notify(t('auth.fillAllFields'), true)
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) notify(error.message, true)
    setLoading(false)
  }

  async function handleSignup() {
    if (!firstName || !lastName || !email || !password)
      return notify(t('auth.fillAllFields'), true)
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName },
      },
    })
    if (error) notify(error.message, true)
    else notify(t('auth.accountCreated'), false)
    setLoading(false)
  }

  function switchMode(next: AuthMode) {
    setMode(next)
    setMessage('')
    setIsError(false)
  }

  return (
    <div className="hx-auth-page">
      {/* ── Video background ── */}
      <video
        className="hx-auth-video"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      >
        <source src="/nebula/hexastra-nebula.mp4" type="video/mp4" />
      </video>
      <div className="hx-auth-overlay" aria-hidden="true" />

      {/* ── Back to home + Language switcher ── */}
      <Link href="/" className="hx-auth-back" aria-label={t('common.backHome')}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {t('common.backHome')}
      </Link>
      <div className="hx-auth-lang">
        <LanguageSwitcher />
      </div>

      {/* ── Card ── */}
      <div className="hx-auth-card">

        {/* Logo */}
        <div className="hx-auth-logo">
          <Image
            src="/logo/hexastra_logo_white_petals_triangles.svg"
            alt="HexAstra"
            width={48}
            height={48}
            priority
          />
        </div>

        <p className="hx-auth-brand">{t('auth.brand')}</p>

        {/* Mode tabs */}
        <div className="hx-auth-tabs">
          <button
            type="button"
            className={`hx-auth-tab${mode === 'login' ? ' is-active' : ''}`}
            onClick={() => switchMode('login')}
          >
            {t('auth.signIn')}
          </button>
          <button
            type="button"
            className={`hx-auth-tab${mode === 'signup' ? ' is-active' : ''}`}
            onClick={() => switchMode('signup')}
          >
            {t('auth.createAccount')}
          </button>
        </div>

        {/* Google */}
        <button
          type="button"
          className="hx-auth-google"
          onClick={handleGoogle}
          disabled={loading}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          {t('auth.continueWithGoogle')}
        </button>

        <div className="hx-auth-divider"><span>{t('common.or')}</span></div>

        {/* Signup extra fields */}
        {mode === 'signup' && (
          <div className="hx-auth-row">
            <input
              className="hx-auth-input"
              placeholder={t('auth.firstName')}
              value={firstName}
              autoComplete="given-name"
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              className="hx-auth-input"
              placeholder={t('auth.lastName')}
              value={lastName}
              autoComplete="family-name"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        )}

        <input
          className="hx-auth-input"
          placeholder={t('auth.email')}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="hx-auth-input"
          placeholder={t('auth.password')}
          type="password"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') mode === 'login' ? handleLogin() : handleSignup()
          }}
        />

        <button
          type="button"
          className="hx-auth-submit"
          onClick={mode === 'login' ? handleLogin : handleSignup}
          disabled={loading}
        >
          {loading ? '…' : mode === 'login' ? t('auth.submitSignIn') : t('auth.submitSignUp')}
        </button>

        {message && (
          <p className={`hx-auth-message${isError ? ' is-error' : ' is-success'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
