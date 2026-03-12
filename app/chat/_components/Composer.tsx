'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from '@/lib/i18n/useTranslation'

type Props = {
  value: string
  onChange: (v: string) => void
  onSend: () => void
  onQuickPrompt?: (v: string) => void
  showQuickPrompts?: boolean
  onAttach?: (file: File) => void
  attachedFileName?: string
  onRemoveAttach?: () => void
  onBirthFormOpen?: () => void
  highlightBirth?: boolean
}

function IconSend({ active }: { active: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className={active ? 'hx-send-icon is-active' : 'hx-send-icon'}
    >
      <path
        d="M3 9h12M10.5 4.5 15 9l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconWaveform({ animated }: { animated: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className={animated ? 'hx-waveform-animated' : ''}
    >
      <rect x="1" y="7.5" width="2" height="3" rx="1" fill="currentColor" className="hx-wf-bar hx-wf-b1" />
      <rect x="4" y="5" width="2" height="8" rx="1" fill="currentColor" className="hx-wf-bar hx-wf-b2" />
      <rect x="7" y="2.5" width="2" height="13" rx="1" fill="currentColor" className="hx-wf-bar hx-wf-b3" />
      <rect x="10" y="5" width="2" height="8" rx="1" fill="currentColor" className="hx-wf-bar hx-wf-b4" />
      <rect x="13" y="7.5" width="2" height="3" rx="1" fill="currentColor" className="hx-wf-bar hx-wf-b5" />
    </svg>
  )
}

function IconAvatar() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M2 14.5c0-3.038 2.91-5 6.5-5s6.5 1.962 6.5 5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconPaperclip() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13.5 7.5l-6 6a4 4 0 01-5.657-5.657l6.364-6.364a2.5 2.5 0 013.536 3.536L5.379 11.38a1 1 0 01-1.415-1.415L9.5 4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Composer({
  value,
  onChange,
  onSend,
  onQuickPrompt,
  showQuickPrompts = true,
  onAttach,
  attachedFileName,
  onRemoveAttach,
  onBirthFormOpen,
  highlightBirth = false,
}: Props) {
  const { t } = useTranslation()
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)
  const [focused, setFocused] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  const SUGGESTIONS = [
    t('chat.suggestion1'),
    t('chat.suggestion2'),
    t('chat.suggestion3'),
    t('chat.suggestion4'),
  ]

  useEffect(() => {
    if (!textareaRef.current) return
    textareaRef.current.style.height = 'auto'
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`
  }, [value])

  const canSend = value.trim().length > 0 || !!attachedFileName

  function handleAttachClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file && onAttach) {
      onAttach(file)
    }
    e.target.value = ''
  }

  function toggleRecording() {
    if (isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any
    const SpeechRec = win.SpeechRecognition ?? win.webkitSpeechRecognition

    if (!SpeechRec) {
      alert(t('chat.voiceNotSupported'))
      return
    }

    const rec = new SpeechRec()
    rec.lang = 'fr-FR'
    rec.interimResults = false
    rec.maxAlternatives = 1

    rec.onresult = (event: { results: Array<{ 0: { transcript: string } }> }) => {
      const transcript = event.results[0]?.[0]?.transcript ?? ''
      if (transcript) {
        onChange(value ? `${value} ${transcript}` : transcript)
      }
    }

    rec.onend = () => { setIsRecording(false) }
    rec.onerror = () => { setIsRecording(false) }

    recognitionRef.current = rec
    rec.start()
    setIsRecording(true)
  }

  return (
    <div className="hx-composer-wrap">
      {showQuickPrompts && !value ? (
        <div className="hx-composer-suggestions">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              className="hx-chip"
              onClick={() => (onQuickPrompt ? onQuickPrompt(s) : onChange(s))}
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}

      <input
        ref={fileInputRef}
        type="file"
        className="hx-sr-only"
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
        aria-hidden="true"
        tabIndex={-1}
      />

      {attachedFileName && (
        <div className="hx-composer-attach-row">
          <span className="hx-composer-attach-pill">
            <IconPaperclip />
            {attachedFileName}
            <button
              type="button"
              className="hx-composer-attach-remove"
              onClick={onRemoveAttach}
              aria-label={t('chat.removeAttachment')}
            >
              ✕
            </button>
          </span>
        </div>
      )}

      <div className={`hx-composer-box${focused ? ' is-focused' : ''}${canSend ? ' has-content' : ''}`}>
        <div className="hx-composer-actions-left">
          <button
            type="button"
            className="hx-composer-action-btn"
            onClick={handleAttachClick}
            aria-label={t('chat.attachFile')}
            title={t('chat.attachFile')}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M7 1v12M1 7h12"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <button
            type="button"
            className={`hx-composer-action-btn${isRecording ? ' is-recording' : ''}`}
            onClick={toggleRecording}
            aria-label={isRecording ? t('chat.stopRecording') : t('chat.voiceRecord')}
            title={isRecording ? t('chat.stopRecording') : t('chat.voiceRecord')}
          >
            <IconWaveform animated={isRecording} />
          </button>

          <button
            type="button"
            className={`hx-composer-action-btn${highlightBirth ? ' is-highlight' : ''}`}
            onClick={onBirthFormOpen}
            aria-label={t('chat.birthDataAriaLabel')}
            title={t('chat.birthDataHint')}
          >
            <IconAvatar />
          </button>
        </div>

        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              if (canSend) onSend()
            }
          }}
          className="hx-composer-textarea"
          placeholder={t('chat.placeholder')}
        />

        <button
          type="button"
          className={`hx-send-button${canSend ? ' is-active' : ''}`}
          onClick={() => { if (canSend) onSend() }}
          disabled={!canSend}
          aria-label={t('chat.sendMessage')}
        >
          <IconSend active={canSend} />
        </button>
      </div>
    </div>
  )
}
