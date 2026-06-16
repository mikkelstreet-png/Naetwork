'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Professional {
  id: string
  name: string
  title: string
  company: string
  price: number
}

interface BookingDrawerProps {
  professional: Professional
  open: boolean
  onClose: () => void
  locale?: 'da' | 'en'
}

const DEMO_SLOTS = [
  '09:00', '11:00', '14:00', '16:00'
]

function getNextTwoWeekdays(): Date[] {
  const days: Date[] = []
  const now = new Date()
  let d = new Date(now)
  d.setDate(d.getDate() + 1)
  while (days.length < 10) {
    const dow = d.getDay()
    if (dow !== 0 && dow !== 6) days.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return days
}

function formatDate(d: Date, locale: string): string {
  return d.toLocaleDateString(locale === 'da' ? 'da-DK' : 'en-GB', {
    weekday: 'short', day: 'numeric', month: 'short',
    timeZone: 'Europe/Copenhagen'
  })
}

function formatTime(d: Date, time: string): string {
  return time
}

export default function BookingDrawer({ professional, open, onClose, locale = 'da' }: BookingDrawerProps) {
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [reminder, setReminder] = useState(true)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClientComponentClient()
  const days = getNextTwoWeekdays()

  const t = {
    title: locale === 'da' ? 'Book session' : 'Book session',
    step1Title: locale === 'da' ? 'Vaelg tid' : 'Choose time',
    step2Title: locale === 'da' ? 'Bekraeft detaljer' : 'Confirm details',
    step3Title: locale === 'da' ? 'Bekraeftelse' : 'Confirmation',
    duration: '60 min',
    price: `DKK ${professional.price} / session`,
    reminder: locale === 'da' ? 'Tilfoj paamindelse' : 'Add reminder',
    messagePlaceholder: locale === 'da' ? 'Besked til den professionelle (valgfri, maks 200 tegn)...' : 'Message to professional (optional, max 200 chars)...',
    confirm: locale === 'da' ? 'Bekraeft booking' : 'Confirm booking',
    successTitle: locale === 'da' ? 'Booking anmodet!' : 'Booking requested!',
    successMsg: locale === 'da'
      ? 'Den professionelle bekraefter inden for 24 timer. Du modtager en e-mail.'
      : 'The professional will confirm within 24 hours. You will receive an email.',
    close: locale === 'da' ? 'Luk' : 'Close',
    back: locale === 'da' ? 'Tilbage' : 'Back',
  }

  async function handleConfirm() {
    if (!selectedDate || !selectedTime) return
    setLoading(true)
    setError(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('auth_user_id', user.id)
        .single()

      const startsAt = new Date(selectedDate)
      const [h, m] = selectedTime.split(':').map(Number)
      startsAt.setHours(h, m, 0, 0)
      const endsAt = new Date(startsAt.getTime() + 60 * 60 * 1000)

      await supabase.from('bookings').insert({
        candidate_profile_id: profile?.id ?? null,
        professional_profile_id: professional.id.startsWith('demo-') ? null : professional.id,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        price_dkk: professional.price,
        message_to_professional: message || null,
        reminder_requested: reminder,
        status: 'requested',
        payment_status: 'pending',
      })

      setStep(3)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Noget gik galt')
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    setStep(1)
    setSelectedDate(null)
    setSelectedTime(null)
    setMessage('')
    setReminder(true)
    setError(null)
    onClose()
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{t.title}</p>
            <h2 className="text-lg font-semibold text-gray-900">{professional.name}</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">{step} / 3</span>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              aria-label="Luk"
            >
              x
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* Step 1: Choose time */}
          {step === 1 && (
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">{t.step1Title}</h3>
              <div className="space-y-3">
                {days.map((day, i) => (
                  <div key={i}>
                    <p className="text-xs font-medium text-gray-500 mb-1.5 capitalize">
                      {formatDate(day, locale)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {DEMO_SLOTS.map((slot) => {
                        const isSelected = selectedDate?.toDateString() === day.toDateString() && selectedTime === slot
                        return (
                          <button
                            key={slot}
                            onClick={() => {
                              setSelectedDate(day)
                              setSelectedTime(slot)
                              setTimeout(() => setStep(2), 150)
                            }}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-400 hover:text-indigo-600'
                            }`}
                          >
                            {slot}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Confirm details */}
          {step === 2 && selectedDate && selectedTime && (
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">{t.step2Title}</h3>

              <div className="bg-gray-50 rounded-xl p-4 space-y-2 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Professionel</span>
                  <span className="font-medium text-gray-900">{professional.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Dato</span>
                  <span className="font-medium text-gray-900">{formatDate(selectedDate, locale)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tid</span>
                  <span className="font-medium text-gray-900">{selectedTime} (Europe/Copenhagen)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Varighed</span>
                  <span className="font-medium text-gray-900">{t.duration}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-gray-200 pt-2 mt-2">
                  <span className="text-gray-500">Pris</span>
                  <span className="font-semibold text-gray-900">{t.price}</span>
                </div>
              </div>

              {/* Reminder toggle */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100 mb-4">
                <span className="text-sm text-gray-700">{t.reminder}</span>
                <button
                  onClick={() => setReminder(!reminder)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${reminder ? 'bg-indigo-600' : 'bg-gray-200'}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${reminder ? 'translate-x-5' : ''}`}
                  />
                </button>
              </div>

              {/* Message */}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 200))}
                placeholder={t.messagePlaceholder}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 text-right mt-1">{message.length}/200</p>

              {error && (
                <p className="text-sm text-red-600 mt-3">{error}</p>
              )}
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t.successTitle}</h3>
              <p className="text-sm text-gray-500 max-w-xs">{t.successMsg}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100">
          {step === 2 && (
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t.back}
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 transition-colors"
              >
                {loading ? '...' : t.confirm}
              </button>
            </div>
          )}
          {step === 3 && (
            <button
              onClick={handleClose}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              {t.close}
            </button>
          )}
        </div>
      </div>
    </>
  )
}
