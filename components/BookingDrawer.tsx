'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { sendBookingConfirmed } from '@/lib/email'
import { Check, X } from 'lucide-react'

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

const FOCUS_OPTIONS = [
  { id: 'cv_linkedin', da: 'CV / LinkedIn', en: 'CV / LinkedIn' },
  { id: 'interview_prep', da: 'Interview', en: 'Interview' },
  { id: 'case_prep', da: 'Case / technicals', en: 'Case / technicals' },
  { id: 'career_direction', da: 'Karriereretning', en: 'Career direction' },
]

function getNextWeekdays(): Date[] {
  const days: Date[] = []
  const d = new Date()
  d.setDate(d.getDate() + 1)
  while (days.length < 5) {
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
  const [sessionFocus, setSessionFocus] = useState('')
  const [sessionGoal, setSessionGoal] = useState('')
  const [materialLink, setMaterialLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()
  const days = getNextWeekdays()
  const focusLabel = FOCUS_OPTIONS.find((option) => option.id === sessionFocus)?.[locale] ?? ''
  const minimumContribution = Math.round(professional.price * 0.4)

  const t = {
    title: locale === 'da' ? 'Book 60 min' : 'Book 60 min',
    subtitle: locale === 'da'
      ? 'Vælg tid og fortæl kort, hvad sessionen skal handle om.'
      : 'Choose a time and briefly describe what the session should cover.',
    step1Title: locale === 'da' ? 'Vælg et tidspunkt' : 'Choose a time',
    step2Title: locale === 'da' ? 'Session brief' : 'Session brief',
    duration: '60 min',
    price: `DKK ${professional.price} / 60 min`,
    impactLabel: locale === 'da' ? 'Impact' : 'Impact',
    impactValue: locale === 'da'
      ? `Min. DKK ${minimumContribution} til Kræftens Bekæmpelse`
      : `Min. DKK ${minimumContribution} to Kræftens Bekæmpelse`,
    focusLabel: locale === 'da' ? 'Hvad skal sessionen handle om?' : 'What should the session focus on?',
    goalLabel: locale === 'da' ? 'Hvad vil du gerne opnå?' : 'What would you like to achieve?',
    goalPlaceholder: locale === 'da'
      ? 'F.eks. skarpere CV, træne case, forberede banking technicals eller afklare næste karriereskridt.'
      : 'E.g. sharpen my CV, practice cases, prepare banking technicals or clarify my next career move.',
    materialLabel: locale === 'da' ? 'Materiale eller link' : 'Material or link',
    materialPlaceholder: locale === 'da' ? 'Valgfrit: LinkedIn, CV-link, jobopslag eller case-materiale' : 'Optional: LinkedIn, CV link, job post or case material',
    focusError: locale === 'da' ? 'Vælg fokus for sessionen.' : 'Choose a session focus.',
    confirm: locale === 'da' ? 'Send bookinganmodning' : 'Send booking request',
    successTitle: locale === 'da' ? 'Booking anmodet' : 'Booking requested',
    successMsg: locale === 'da'
      ? 'Din booking og dit session brief er modtaget. Du får en e-mail, og den professionelle vender tilbage med bekræftelse. Når sessionen betales, bidrager den til Kræftens Bekæmpelse.'
      : 'Your booking and session brief have been received. You will get an email, and the professional will confirm the session. Once the session is paid, it contributes to Kræftens Bekæmpelse.',
    close: locale === 'da' ? 'Luk' : 'Close',
    back: locale === 'da' ? 'Tilbage' : 'Back',
    authError: locale === 'da' ? 'Log ind for at booke en session.' : 'Log in to book a session.',
    profileError: locale === 'da' ? 'Din profil blev ikke fundet. Prøv at logge ind igen.' : 'Your profile was not found. Please log in again.',
    bookingError: locale === 'da' ? 'Bookingen kunne ikke oprettes. Prøv igen.' : 'The booking could not be created. Please try again.',
    professional: locale === 'da' ? 'Professionel' : 'Professional',
    date: locale === 'da' ? 'Dato' : 'Date',
    time: locale === 'da' ? 'Tid' : 'Time',
    priceLabel: locale === 'da' ? 'Pris' : 'Price',
  }

  async function handleConfirm() {
    if (!selectedDate || !selectedTime) return
    if (!sessionFocus) {
      setError(t.focusError)
      return
    }

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
      const briefLabels = locale === 'da'
        ? { focus: 'Fokus', goal: 'Mål', material: 'Materiale/link' }
        : { focus: 'Focus', goal: 'Goal', material: 'Material/link' }
      const brief = [
        `${briefLabels.focus}: ${focusLabel}`,
        sessionGoal.trim() ? `${briefLabels.goal}: ${sessionGoal.trim()}` : null,
        materialLink.trim() ? `${briefLabels.material}: ${materialLink.trim()}` : null,
      ].filter(Boolean).join('\n')

      const { error: bookingError } = await supabase.from('bookings').insert({
        candidate_profile_id: profile.id,
        professional_profile_id: professional.id.startsWith('demo-') ? null : professional.id,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        price_dkk: professional.price,
        message_to_professional: brief,
        reminder_requested: true,
        status: 'requested',
        payment_status: 'pending',
      })

      if (bookingError) throw new Error(t.bookingError)

      if (user.email) {
        await sendBookingConfirmed({
          candidateEmail: user.email,
          candidateName: (profile.name as string | null) ?? user.email,
          professionalName: professional.name,
          sessionType: `60 min career session - ${focusLabel}`,
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
    setSessionFocus('')
    setSessionGoal('')
    setMaterialLink('')
    setError(null)
    onClose()
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-gray-950/45 backdrop-blur-sm" onClick={handleClose} aria-hidden="true" />
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl shadow-gray-950/20">
        <div className="border-b border-gray-200 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase text-gray-400">{t.title}</p>
              <h2 className="mt-1 text-xl font-black text-gray-950">{professional.name}</h2>
              <p className="mt-1 text-sm text-gray-500">{professional.title} · {professional.company}</p>
            </div>
            <button onClick={handleClose} className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-950" aria-label={t.close}>
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-gray-500">{t.subtitle}</p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className={`h-1.5 ${n <= step ? 'bg-gray-950' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 1 && (
            <div>
              <h3 className="mb-5 text-base font-black text-gray-950">{t.step1Title}</h3>
              <div className="space-y-4">
                {days.map((day, i) => (
                  <div key={i} className="border border-gray-200 bg-[#f7f7f4] p-3">
                    <p className="mb-2 text-xs font-black uppercase text-gray-500 capitalize">{formatDate(day, locale)}</p>
                    <div className="grid grid-cols-4 gap-2">
                      {DEMO_SLOTS.map((slot) => {
                        const isSelected = selectedDate?.toDateString() === day.toDateString() && selectedTime === slot
                        return (
                          <button
                            key={slot}
                            onClick={() => { setSelectedDate(day); setSelectedTime(slot); setTimeout(() => setStep(2), 150) }}
                            className={`rounded-lg border px-2 py-2 text-sm font-bold transition-colors ${isSelected ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-950 hover:text-gray-950'}`}
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
              <h3 className="mb-5 text-base font-black text-gray-950">{t.step2Title}</h3>
              <div className="mb-5 border border-gray-200 bg-[#f7f7f4] p-4">
                {[
                  [t.professional, professional.name],
                  [t.date, formatDate(selectedDate, locale)],
                  [t.time, `${selectedTime} (Europe/Copenhagen)`],
                  [locale === 'da' ? 'Varighed' : 'Duration', t.duration],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 py-2 text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="text-right font-bold text-gray-950">{value}</span>
                  </div>
                ))}
                <div className="mt-2 flex justify-between gap-4 border-t border-gray-200 pt-4 text-sm">
                  <span className="text-gray-500">{t.priceLabel}</span>
                  <span className="text-right font-black text-gray-950">{t.price}</span>
                </div>
                <div className="mt-2 flex justify-between gap-4 border-t border-gray-200 pt-4 text-sm">
                  <span className="text-gray-500">{t.impactLabel}</span>
                  <span className="max-w-[13rem] text-right font-black text-gray-950">{t.impactValue}</span>
                </div>
              </div>

              <div className="mb-5">
                <label className="mb-3 block text-sm font-black text-gray-950">{t.focusLabel}</label>
                <div className="grid grid-cols-2 gap-2">
                  {FOCUS_OPTIONS.map((option) => {
                    const label = option[locale]
                    const selected = sessionFocus === option.id
                    return (
                      <button
                        key={option.id}
                        onClick={() => { setSessionFocus(option.id); setError(null) }}
                        className={`rounded-lg border px-3 py-2.5 text-left text-xs font-black transition-colors ${selected ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 bg-[#f7f7f4] text-gray-700 hover:border-gray-950 hover:bg-white hover:text-gray-950'}`}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <label className="mb-2 block text-sm font-black text-gray-950">{t.goalLabel}</label>
              <textarea
                value={sessionGoal}
                onChange={(e) => setSessionGoal(e.target.value.slice(0, 260))}
                placeholder={t.goalPlaceholder}
                rows={4}
                className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-colors focus:border-gray-950"
              />
              <p className="mt-1 text-right text-xs text-gray-400">{sessionGoal.length}/260</p>

              <label className="mb-2 mt-4 block text-sm font-black text-gray-950">{t.materialLabel}</label>
              <input
                value={materialLink}
                onChange={(e) => setMaterialLink(e.target.value.slice(0, 140))}
                placeholder={t.materialPlaceholder}
                inputMode="url"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-colors focus:border-gray-950"
              />

              {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-lg bg-gray-950 text-white">
                <Check size={28} aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-2xl font-black text-gray-950">{t.successTitle}</h3>
              <p className="max-w-xs text-sm leading-relaxed text-gray-500">{t.successMsg}</p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-6 py-4">
          {step === 2 && (
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 rounded-lg border border-gray-200 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50">
                {t.back}
              </button>
              <button onClick={handleConfirm} disabled={loading} className="flex-1 rounded-lg bg-gray-950 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800 disabled:opacity-60">
                {loading ? '...' : t.confirm}
              </button>
            </div>
          )}
          {step === 3 && (
            <button onClick={handleClose} className="w-full rounded-lg bg-gray-950 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800">
              {t.close}
            </button>
          )}
        </div>
      </div>
    </>
  )
}
