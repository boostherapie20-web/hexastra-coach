'use client'

import { useState } from 'react'
import type { BirthData } from '../_lib/chat'
import { EMPTY_BIRTH_DATA } from '../_lib/chat'

type Props = {
  data: BirthData
  onSave: (data: BirthData) => void
}

export default function BirthDataInlineForm({ data, onSave }: Props) {
  const [form, setForm] = useState<BirthData>({ ...EMPTY_BIRTH_DATA, ...data })

  function set(field: keyof BirthData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed: BirthData = {
      ...form,
      firstName: form.firstName.trim(),
      birthDate: form.birthDate.trim(),
      birthCity: form.birthCity.trim(),
    }
    onSave(trimmed)
  }

  const isValid =
    form.firstName.trim().length > 0 &&
    form.birthDate.trim().length > 0 &&
    form.birthCity.trim().length > 0

  return (
    <form
      className="hx-birth-inline-form"
      onSubmit={handleSubmit}
      aria-label="Données de naissance"
    >
      <p className="hx-birth-inline-hint">
        Pour personnaliser ta lecture, j'ai besoin de quelques informations.
      </p>

      <div className="hx-birth-inline-grid">
        <label className="hx-birth-inline-field">
          <span className="hx-birth-inline-label">Prénom <span aria-hidden="true">*</span></span>
          <input
            className="hx-birth-inline-input"
            type="text"
            placeholder="Prénom"
            value={form.firstName}
            onChange={(e) => set('firstName', e.target.value)}
            required
            autoComplete="given-name"
          />
        </label>

        <label className="hx-birth-inline-field">
          <span className="hx-birth-inline-label">Date de naissance <span aria-hidden="true">*</span></span>
          <input
            className="hx-birth-inline-input"
            type="date"
            value={form.birthDate}
            onChange={(e) => set('birthDate', e.target.value)}
            required
          />
        </label>

        <label className="hx-birth-inline-field">
          <span className="hx-birth-inline-label">Heure de naissance</span>
          <input
            className="hx-birth-inline-input"
            type="time"
            placeholder="HH:MM (facultatif)"
            value={form.birthTime}
            onChange={(e) => set('birthTime', e.target.value)}
          />
        </label>

        <label className="hx-birth-inline-field">
          <span className="hx-birth-inline-label">Ville de naissance <span aria-hidden="true">*</span></span>
          <input
            className="hx-birth-inline-input"
            type="text"
            placeholder="Ville"
            value={form.birthCity}
            onChange={(e) => set('birthCity', e.target.value)}
            required
            autoComplete="address-level2"
          />
        </label>

        <label className="hx-birth-inline-field">
          <span className="hx-birth-inline-label">Pays</span>
          <input
            className="hx-birth-inline-input"
            type="text"
            placeholder="Pays (facultatif)"
            value={form.birthCountryName}
            onChange={(e) => set('birthCountryName', e.target.value)}
            autoComplete="country-name"
          />
        </label>
      </div>

      <button
        type="submit"
        className="hx-birth-inline-submit"
        disabled={!isValid}
      >
        Commencer ma lecture →
      </button>
    </form>
  )
}
