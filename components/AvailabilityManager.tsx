'use client'

import { CalendarPlus, Clock3, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

interface AvailabilitySlot {
  id: string
  starts_at: string
  ends_at: string
  time_zone: string
  meeting_mode: string
  is_available: boolean
}

function localInputMinimum() {
  const date = new Date(Date.now() + 2 * 60 * 60 * 1000)
  date.setMinutes(Math.ceil(date.getMinutes() / 15) * 15, 0, 0)
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

export function AvailabilityManager() {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [startsAt, setStartsAt] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const minimum = useMemo(localInputMinimum, [])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/availability', { cache: 'no-store' })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'Tilgængeligheden kunne ikke indlæses.')
      setSlots(result.slots ?? [])
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Tilgængeligheden kunne ikke indlæses.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  async function addSlot() {
    if (!startsAt) {
      setError('Vælg dato og starttid.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startsAt: new Date(startsAt).toISOString() }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'Tiden kunne ikke gemmes.')
      setSlots((current) => [...current, result.slot].sort((a, b) => a.starts_at.localeCompare(b.starts_at)))
      setStartsAt('')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Tiden kunne ikke gemmes.')
    } finally {
      setSaving(false)
    }
  }

  async function removeSlot(id: string) {
    setError('')
    try {
      const response = await fetch(`/api/availability?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'Tiden kunne ikke fjernes.')
      setSlots((current) => current.filter((slot) => slot.id !== id))
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : 'Tiden kunne ikke fjernes.')
    }
  }

  return (
    <section className="mt-12 border-t border-gray-200 pt-9" aria-labelledby="availability-title">
      <div className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="editorial-label">Bookingkalender</p>
          <h2 id="availability-title" className="mt-3 text-2xl font-semibold text-gray-950 sm:text-3xl">Dine ledige tider</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-500">Kandidater kan kun anmode om tider, du har åbnet. Hver tid er 60 minutter og vises i Europe/Copenhagen.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto] lg:grid-cols-1 xl:grid-cols-[1fr_auto]">
            <label>
              <span className="form-label">Dato og starttid</span>
              <input type="datetime-local" value={startsAt} min={minimum} step={900} onChange={(event) => setStartsAt(event.target.value)} className="field-control" />
            </label>
            <button type="button" onClick={() => void addSlot()} disabled={saving} className="button-primary self-end disabled:opacity-50">
              <CalendarPlus size={16} aria-hidden="true" />{saving ? 'Gemmer...' : 'Tilføj tid'}
            </button>
          </div>
          {error && <p role="alert" className="notice-error mt-4">{error}</p>}
        </div>

        <div className="border-t border-gray-200" aria-busy={loading}>
          {loading ? (
            <div className="space-y-px bg-gray-200"><div className="h-16 animate-pulse bg-[#f7f7f4]" /><div className="h-16 animate-pulse bg-[#f7f7f4]" /></div>
          ) : slots.length === 0 ? (
            <div className="flex min-h-40 items-center justify-center border-b border-gray-200 bg-[#f7f7f4] px-5 text-center">
              <div><Clock3 size={20} className="mx-auto text-gray-300" aria-hidden="true" /><p className="mt-3 text-sm font-semibold text-gray-950">Ingen ledige tider endnu</p><p className="mt-1 text-xs text-gray-500">Tilføj din første tid for at gøre profilen bookbar.</p></div>
            </div>
          ) : slots.map((slot) => (
            <div key={slot.id} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-gray-200 py-4">
              <div>
                <p className="text-sm font-semibold capitalize text-gray-950">{new Date(slot.starts_at).toLocaleString('da-DK', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Copenhagen' })}</p>
                <p className="mt-1 text-xs text-gray-400">60 min · Video · {slot.is_available ? 'Ledig' : 'Reserveret'}</p>
              </div>
              <button type="button" onClick={() => void removeSlot(slot.id)} disabled={!slot.is_available} className="icon-button disabled:opacity-30" aria-label="Fjern ledig tid" title="Fjern ledig tid"><Trash2 size={16} aria-hidden="true" /></button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
