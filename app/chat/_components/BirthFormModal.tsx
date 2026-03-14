'use client'

import { useTranslation } from '@/lib/i18n/useTranslation'
import { COUNTRIES_BY_CONTINENT } from '../_lib/countries'
import type { BirthData } from '../_lib/chat'
import CityAutocomplete from './CityAutocomplete'

type Props = {
  data: BirthData
  onChange: (d: BirthData) => void
  onClose: () => void
}

export default function BirthFormModal({ data, onChange, onClose }: Props) {
  const { t } = useTranslation()
  return (
    <div className="hx-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={t('chat.birthDataAriaLabel')}>
      <div className="hx-modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="hx-modal-header">
          <h2 className="hx-modal-title">
            <svg className="hx-modal-title-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2l2.939 6.326L22 9.274l-5 4.867 1.18 6.879L12 17.77l-6.18 3.25L7 14.141 2 9.274l7.061-.948z" />
            </svg>
            {t('chat.birthDataTitle')}
          </h2>
          <button type="button" className="hx-modal-close" onClick={onClose} aria-label={t('common.close')}>✕</button>
        </div>

        <p className="hx-modal-hint">{t('chat.birthDataModalHint')}</p>

        <div className="hx-modal-form">
          <div className="hx-modal-row">
            <label className="hx-modal-field">
              <span className="hx-modal-label">{t('chat.firstName')}</span>
              <input type="text" className="hx-modal-input" placeholder={t('chat.firstNamePlaceholder')} value={data.firstName} autoComplete="given-name" onChange={(e) => onChange({ ...data, firstName: e.target.value })} />
            </label>
            <label className="hx-modal-field">
              <span className="hx-modal-label">{t('chat.lastName')}</span>
              <input type="text" className="hx-modal-input" placeholder={t('chat.lastNamePlaceholder')} value={data.lastName} autoComplete="family-name" onChange={(e) => onChange({ ...data, lastName: e.target.value })} />
            </label>
          </div>

          <div className="hx-modal-row">
            <label className="hx-modal-field">
              <span className="hx-modal-label">{t('chat.birthDate')}</span>
              <input type="date" className="hx-modal-input" value={data.birthDate} onChange={(e) => onChange({ ...data, birthDate: e.target.value })} />
            </label>
            <label className="hx-modal-field">
              <span className="hx-modal-label">{t('chat.birthTime')}</span>
              <input type="time" className="hx-modal-input" value={data.birthTime} onChange={(e) => onChange({ ...data, birthTime: e.target.value })} />
            </label>
          </div>

          <label className="hx-modal-field">
            <span className="hx-modal-label">{t('chat.birthCountry')}</span>
            <select
              className="hx-modal-input hx-modal-select"
              value={data.birthCountryCode}
              onChange={(e) => {
                const opt = e.target.options[e.target.selectedIndex]
                onChange({ ...data, birthCountryCode: e.target.value, birthCountryName: opt.text, birthCity: '', birthLat: '', birthLng: '' })
              }}
            >
              <option value="">{t('chat.selectCountry')}</option>
              {COUNTRIES_BY_CONTINENT.map((group) => (
                <optgroup key={group.continent} label={group.continent}>
                  {group.countries.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>

          <div className="hx-modal-field">
            <span className="hx-modal-label">
              {t('chat.birthCityLabel')}
              {data.birthLat && data.birthLng && (
                <span className="hx-modal-gps-badge" title={`GPS : ${data.birthLat}, ${data.birthLng}`}>📍 {t('chat.gpsRecorded')}</span>
              )}
            </span>
            <CityAutocomplete
              value={data.birthCity}
              countryCode={data.birthCountryCode}
              onSelect={(city, lat, lng) => onChange({ ...data, birthCity: city, birthLat: lat, birthLng: lng })}
            />
          </div>

          <div className="hx-modal-field">
            <span className="hx-modal-label">{t('chat.genderLabel')}</span>
            <div className="hx-modal-gender">
              {(['masculin', 'feminin'] as const).map((g) => (
                <button key={g} type="button" className={`hx-modal-gender-btn${data.gender === g ? ' is-active' : ''}`} onClick={() => onChange({ ...data, gender: data.gender === g ? '' : g })}>
                  {g === 'masculin' ? t('chat.genderMale') : t('chat.genderFemale')}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="hx-modal-footer">
          <button type="button" className="hx-modal-save" onClick={onClose}>{t('common.save')}</button>
        </div>
      </div>
    </div>
  )
}
