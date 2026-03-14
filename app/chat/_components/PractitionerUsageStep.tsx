'use client'

import type { PractitionerUsage } from '@/lib/chat/bootstrapTypes'

type Props = {
  onSelect: (usage: PractitionerUsage) => void
}

export default function PractitionerUsageStep({ onSelect }: Props) {
  return (
    <div className="hx-practitioner-step">
      <p className="hx-practitioner-step-question">
        Cette session est-elle pour vous ou pour un(e) client(e) ?
      </p>

      <div className="hx-practitioner-step-choices">
        <button
          type="button"
          className="hx-practitioner-btn"
          onClick={() => onSelect('personal')}
        >
          <span className="hx-practitioner-btn-icon" aria-hidden="true">✦</span>
          <span>
            <strong>Usage personnel</strong>
            <span className="hx-practitioner-btn-sub">Lecture pour moi-même</span>
          </span>
        </button>

        <button
          type="button"
          className="hx-practitioner-btn"
          onClick={() => onSelect('client')}
        >
          <span className="hx-practitioner-btn-icon" aria-hidden="true">◈</span>
          <span>
            <strong>Usage client</strong>
            <span className="hx-practitioner-btn-sub">Lecture pour un(e) client(e)</span>
          </span>
        </button>
      </div>
    </div>
  )
}
