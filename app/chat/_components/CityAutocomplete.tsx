'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from '@/lib/i18n/useTranslation'

type NominatimResult = {
  place_id: string
  display_name: string
  lat: string
  lon: string
  address: {
    city?: string
    town?: string
    village?: string
    municipality?: string
    county?: string
    state?: string
    country?: string
  }
}

type Props = {
  value: string
  countryCode: string
  onSelect: (city: string, lat: string, lng: string) => void
}

export default function CityAutocomplete({ value, countryCode, onSelect }: Props) {
  const { t } = useTranslation()
  const [query, setQuery] = useState(value)
  const [results, setResults] = useState<NominatimResult[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => { setQuery(value) }, [value])

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  function handleInput(v: string) {
    setQuery(v)
    if (timerRef.current) clearTimeout(timerRef.current)
    if (v.trim().length < 2) { setResults([]); setOpen(false); return }
    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const cc = countryCode ? `&countrycodes=${countryCode.toLowerCase()}` : ''
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(v)}${cc}&format=json&limit=8&addressdetails=1&featuretype=city`,
          { headers: { 'Accept-Language': 'fr', 'User-Agent': 'HexAstraCoach/1.0' } }
        )
        const json: NominatimResult[] = await res.json()
        const filtered = json.filter((r) =>
          r.address.city || r.address.town || r.address.village || r.address.municipality
        ).slice(0, 7)
        setResults(filtered)
        setOpen(filtered.length > 0)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 420)
  }

  function handleSelect(r: NominatimResult) {
    const city = r.address.city ?? r.address.town ?? r.address.village ?? r.address.municipality ?? r.address.county ?? r.display_name.split(',')[0]
    setQuery(city)
    setOpen(false)
    onSelect(city, r.lat, r.lon)
  }

  return (
    <div className="hx-city-wrap" ref={wrapRef}>
      <div className="hx-city-input-row">
        <input
          type="text"
          className="hx-modal-input"
          placeholder={countryCode ? t('chat.citySearch') : t('chat.citySelectCountryFirst')}
          value={query}
          disabled={!countryCode}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => { if (results.length > 0) setOpen(true) }}
          autoComplete="off"
        />
        {loading && <span className="hx-city-spinner" aria-hidden="true" />}
      </div>
      {open && results.length > 0 && (
        <ul className="hx-city-dropdown" role="listbox">
          {results.map((r) => {
            const city = r.address.city ?? r.address.town ?? r.address.village ?? r.address.municipality ?? r.display_name.split(',')[0]
            const region = r.address.state ?? r.address.county ?? ''
            return (
              <li key={r.place_id} role="option" aria-selected={false}>
                <button type="button" className="hx-city-option" onMouseDown={() => handleSelect(r)}>
                  <span className="hx-city-option-name">{city}</span>
                  {region && <span className="hx-city-option-region">{region}</span>}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
