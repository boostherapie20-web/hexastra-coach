'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { BirthData } from '../_lib/chat'
import { EMPTY_BIRTH_DATA } from '../_lib/chat'

type CityResult = {
  displayName: string
  city: string
  country: string
  countryCode: string
  lat: string
  lng: string
}

type Props = {
  data: BirthData
  onSave: (data: BirthData) => void
}

async function searchCities(query: string): Promise<CityResult[]> {
  if (query.trim().length < 2) return []
  const url =
    `https://nominatim.openstreetmap.org/search` +
    `?q=${encodeURIComponent(query)}` +
    `&format=json&limit=8&addressdetails=1` +
    `&featuretype=city&accept-language=fr`
  try {
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'fr', 'User-Agent': 'HexAstra-Coach/1.0' },
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data as any[])
      .filter((r: any) => r.address)
      .map((r: any): CityResult => {
        const addr = r.address
        const city =
          addr.city || addr.town || addr.village || addr.municipality || addr.county || query
        return {
          displayName: r.display_name,
          city,
          country: addr.country ?? '',
          countryCode: (addr.country_code ?? '').toUpperCase(),
          lat: parseFloat(r.lat).toFixed(4),
          lng: parseFloat(r.lon).toFixed(4),
        }
      })
      .filter((r, i, arr) =>
        arr.findIndex((x) => x.city === r.city && x.countryCode === r.countryCode) === i
      )
  } catch {
    return []
  }
}

function formatCoord(lat: string, lng: string): string {
  const latN = parseFloat(lat)
  const lngN = parseFloat(lng)
  const latStr = `${Math.abs(latN).toFixed(1)}°${latN >= 0 ? 'N' : 'S'}`
  const lngStr = `${Math.abs(lngN).toFixed(1)}°${lngN >= 0 ? 'E' : 'W'}`
  return `${latStr}  ${lngStr}`
}

export default function BirthDataInlineForm({ data, onSave }: Props) {
  const [form, setForm] = useState<BirthData>({ ...EMPTY_BIRTH_DATA, ...data })
  const [timeUnknown, setTimeUnknown] = useState(false)

  // City autocomplete state
  const [cityQuery, setCityQuery] = useState(data.birthCity ?? '')
  const [suggestions, setSuggestions] = useState<CityResult[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [citySelected, setCitySelected] = useState(!!data.birthCity)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const triggerSearch = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (q.trim().length < 2) {
      setSuggestions([])
      setShowDropdown(false)
      return
    }
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true)
      const results = await searchCities(q)
      setSuggestions(results)
      setShowDropdown(results.length > 0)
      setIsSearching(false)
    }, 320)
  }, [])

  function handleCityInput(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    setCityQuery(q)
    setCitySelected(false)
    setForm((prev) => ({
      ...prev,
      birthCity: q,
      birthLat: '',
      birthLng: '',
      birthCountryCode: '',
      birthCountryName: '',
    }))
    triggerSearch(q)
  }

  function handleSelectCity(r: CityResult) {
    setCityQuery(r.city)
    setCitySelected(true)
    setShowDropdown(false)
    setSuggestions([])
    setForm((prev) => ({
      ...prev,
      birthCity: r.city,
      birthCountryName: r.country,
      birthCountryCode: r.countryCode,
      birthLat: r.lat,
      birthLng: r.lng,
    }))
  }

  function handleTimeUnknown(checked: boolean) {
    setTimeUnknown(checked)
    if (checked) setForm((prev) => ({ ...prev, birthTime: '' }))
  }

  function set(field: keyof BirthData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed: BirthData = {
      ...form,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      birthDate: form.birthDate.trim(),
      birthCity: form.birthCity.trim(),
      birthTime: timeUnknown ? '' : form.birthTime.trim(),
    }
    onSave(trimmed)
  }

  const isValid =
    form.firstName.trim().length > 0 &&
    form.lastName.trim().length > 0 &&
    form.birthDate.trim().length > 0 &&
    form.birthCity.trim().length > 0 &&
    (timeUnknown || form.birthTime.trim().length > 0)

  return (
    <form
      className="hx-birth-inline-form"
      onSubmit={handleSubmit}
      aria-label="Données de naissance"
    >
      <p className="hx-birth-inline-hint">
        Pour personnaliser ta lecture, j&apos;ai besoin de quelques informations.
        Les champs marqués <span aria-hidden="true">*</span> sont obligatoires.
      </p>

      <div className="hx-birth-inline-grid">

        {/* Prénom */}
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

        {/* Nom */}
        <label className="hx-birth-inline-field">
          <span className="hx-birth-inline-label">Nom <span aria-hidden="true">*</span></span>
          <input
            className="hx-birth-inline-input"
            type="text"
            placeholder="Nom de famille"
            value={form.lastName}
            onChange={(e) => set('lastName', e.target.value)}
            required
            autoComplete="family-name"
          />
        </label>

        {/* Date */}
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

        {/* Heure */}
        <div className="hx-birth-inline-field">
          <span className="hx-birth-inline-label">
            Heure de naissance <span aria-hidden="true">*</span>
          </span>
          <input
            className="hx-birth-inline-input"
            type="time"
            placeholder="HH:MM"
            value={form.birthTime}
            onChange={(e) => set('birthTime', e.target.value)}
            disabled={timeUnknown}
            required={!timeUnknown}
          />
          <label className="hx-birth-inline-unknown">
            <input
              type="checkbox"
              checked={timeUnknown}
              onChange={(e) => handleTimeUnknown(e.target.checked)}
            />
            <span>Heure inconnue</span>
          </label>
        </div>

        {/* Ville avec autocomplete — occupe toute la largeur */}
        <div className="hx-birth-inline-field hx-birth-city-wrapper" ref={wrapperRef}>
          <span className="hx-birth-inline-label">
            Ville de naissance <span aria-hidden="true">*</span>
          </span>
          <div className="hx-birth-city-input-row">
            <input
              className={`hx-birth-inline-input${citySelected && form.birthLat ? ' hx-birth-city-confirmed' : ''}`}
              type="text"
              placeholder="Rechercher une ville dans le monde…"
              value={cityQuery}
              onChange={handleCityInput}
              onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
              autoComplete="off"
              spellCheck={false}
              required
            />
            {isSearching && <span className="hx-birth-city-spinner" aria-hidden="true" />}
          </div>

          {citySelected && form.birthLat && (
            <span className="hx-birth-city-coords">
              {form.birthCountryName} · {formatCoord(form.birthLat, form.birthLng)}
            </span>
          )}

          {showDropdown && (
            <ul className="hx-birth-city-dropdown" role="listbox" aria-label="Suggestions de villes">
              {suggestions.map((r, i) => (
                <li
                  key={i}
                  role="option"
                  className="hx-birth-city-option"
                  onMouseDown={(e) => { e.preventDefault(); handleSelectCity(r) }}
                >
                  <span className="hx-birth-city-name">{r.city}</span>
                  <span className="hx-birth-city-meta">
                    {r.country}
                    {r.lat && r.lng && <> · {formatCoord(r.lat, r.lng)}</>}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

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
