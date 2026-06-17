'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { sendBookingConfirmed } from '@/lib/email'

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

const DEMO_SLOTS = ['09:00', '11:00', '14:00', '16:00']

function getNextTwoWeekdays(): Date[] {
  const days: Date[] = []
  const d = new Date()
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

export default function BookingDrawer({ professional, open, onClose, locale = 'da' }: BookingDrawerProps) {
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [reminder, setReminder] = useState(true)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()
  const days = getNextTwoWeekdays()

  const t = {
    title: locale === 'da' ? 'Book 60 min' : 'Book 60 min',
    subtitle: locale === 'da' ? 'Vælg tid, skriv dit fokus, og send bookinganmodningen.' : 'Choose a time, add your focus and send the booking request.',
    step1Title: locale === 'da' ? 'Vælg et tidspunkt' : 'Choose a time',
    step2Title: locale === 'da' ? 'Bekræft din session' : 'Confirm your session',
    duration: '60 min',
    price: `DKK ${professional.price} / 60 min`,
    reminder: locale === 'da' ? 'Tilføj påmindelse' : 'Add reminder',
    messageLabel: locale === 'da' ? 'Sessionens fokus' : 'Session focus',
    messagePlaceholder: locale === 'da'
      ? 'Hvad vil du bruge sessionen på? F.eks. CV, interview, case, banking technicals eller career direction.'
      : 'What would you like to use the session for? E.g. CV, interview, case, banking technicals or career direction.',
    confirm: locale === 'da' ? 'Send bookinganmodning' : 'Send booking request',
    successTitle: locale === 'da' ? 'Booking anmodet' : 'Booking requested',
    successMsg: locale === 'da'
      ? 'Din booking er modtaget. Du får en e-mail, og den professionelle vender tilbage med bekræftelse.'
      : 'Your booking has been received. You will get an email, and the professional will confirm the session.',
    close: locale === 'da' ? 'Luk' : 'Close',
    back: locale === 'da' ? 'Tilbage' : 'Back',
    authError: locale === 'da' ? 'Log ind for at booke en session.' : 'Log in to book a session.',
    profileError: locale === 'da' ? 'Din profil blev ikke fundet. Prøv at logge ind igen.' : 'Your profile was not found. Please log in again.',
    bookingError: locale === 'da' ? 'Bookingen kunne ikke oprettes. Prøv igen.' : 'The booking could not be created. Please try again.',
  }

  async function handleConfirm() {
    if (!selectedDate || !selectedTime) return
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error(t.authError)

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, name')
        .eq('auth_user_id', user.id)
        .single()

      if (profileError || !profile) throw new Error(t.profileError)

      const startsAt = new Date(selectedDate)
      const [h, m] = selectedTime.split(':').map(Number)
      startsAt.setHours(h, m, 0, 0)
      const endsAt = new Date(startsAt.getTime() + 60 * 60 * 1000)

      const { error: bookingError } = await supabase.from('bookings').insert({
        candidate_profile_id: profile.id,
        professional_profile_id: professional.id.startsWith('demo-') ? null : professional.id,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        price_dkk: professional.price,
        message_to_professional: message || null,
        reminder_requested: reminder,
        status: 'requested',
        payment_status: 'pending',
      })

      if (bookingError) throw new Error(t.bookingError)

      if (user.email) {
        await sendBookingConfirmed({
          candidateEmail: user.email,
          candidateName: (profile.name as string | null) ?? user.email,
          professionalName: professional.name,
          sessionType: '60 min career session',
          scheduledAt: startsAt.toISOString(),
          priceDkk: professional.price,
        }).catch(() => false)
      }

      setStep(3)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t.bookingError)
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
      <div className="fixed inset-0 z-40 bg-gray-950/45 backdrop-blur-sm" onClick={handleClose} aria-hidden="true" />
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl shadow-gray-950/20">
        <div className="border-b border-gray-100 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{t.title}</p>
              <h2 className="mt-1 text-xl font-black text-gray-950">{professional.name}</h2>
              <p className="mt-1 text-sm text-gray-500">{professional.title} · {professional.company}</p>
            </div>
            <button onClick={handleClose} className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-950" aria-label={t.close}>
              x
            </button>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-gray-500">{t.subtitle}</p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className={`h-1.5 rounded-full ${n <= step ? 'bg-gray-950' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 1 && (
            <div>
              <h3 className="mb-5 text-base font-bold text-gray-950">{t.step1Title}</h3>
              <div className="space-y-4">
                {days.map((day, i) => (
                  <div key={i} className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
                    <p className="mb-2 text-xs font-bold uppercase text-gray-500 capitalize">{formatDate(day, locale)}</p>
                    <div className="grid grid-cols-4 gap-2">
                      {DEMO_SLOTS.map((slot) => {
                        const isSelected = selectedDate?.toDateString() === day.toDateString() && selectedTime === slot
                        return (
                          <button
                            key={slot}
                            onClick={() => { setSelectedDate(day); setSelectedTime(slot); setTimeout(() => setStep(2), 150) }}
                            className={`rounded-xl border px-2 py-2 text-sm font-semibold transition-colors ${isSelected ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-950 hover:text-gray-950'}`}
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

          {step === 2 && selectedDate && selectedTime && (
            <div>
              <h3 className="mb-5 text-base font-bold text-gray-950">{t.step2Title}</h3>
              <div className="mb-5 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                {[
                  ['Professionel', professional.name],
                  ['Dato', formatDate(selectedDate, locale)],
                  ['Tid', `${selectedTime} (Europe/Copenhagen)`],
                  ['Varighed', t.duration],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 py-2 text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="text-right font-semibold text-gray-950">{value}</span>
                  </div>
                ))}
                <div className="mt-2 flex justify-between gap-4 border-t border-gray-200 pt-4 text-sm">
                  <span className="text-gray-500">Pris</span>
                  <span className="text-right font-black text-gray-950">{t.price}</span>
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3">
                <span className="text-sm font-medium text-gray-700">{t.reminder}</span>
                <button onClick={() => setReminder(!reminder)} className={`relative h-6 w-11 rounded-full transition-colors ${reminder ? 'bg-gray-950' : 'bg-gray-200'}`} aria-pressed={reminder}>
                  <span className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${reminder ? 'translate-x-5' : ''}`} />
                </button>
              </div>

              <label className="mb-2 block text-sm font-bold text-gray-950">{t.messageLabel}</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 200))}
                placeholder={t.messagePlaceholder}
                rows={4}
                className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-colors focus:border-gray-950"
              />
              <p className="mt-1 text-right text-xs text-gray-400">{message.length}/200</p>
              {error && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gray-950 text-white">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mb-2 text-2xl font-black text-gray-950">{t.successTitle}</h3>
              <p className="max-w-xs text-sm leading-relaxed text-gray-500">{t.successMsg}</p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 px-6 py-4">
          {step === 2 && (
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
                {t.back}
              </button>
              <button onClick={handleConfirm} disabled={loading} className="flex-1 rounded-xl bg-gray-950 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-60">
                {loading ? '...' : t.confirm}
              </button>
            </div>
          )}
          {step === 3 && (
            <button onClick={handleClose} className="w-full rounded-xl bg-gray-950 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800">
              {t.close}
            </button>
          )}
        </div>
      </div>
    </>
  )
}
