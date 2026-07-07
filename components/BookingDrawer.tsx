'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Check, LockKeyhole, X } from 'lucide-react'
import { BOOKING_FOCUS_AREAS, contributionAmount, focusLabel, formatDkk } from '@/lib/platform'
import { SESSION_TIME_ZONE } from '@/lib/dateTime'

interface Professional {
  id: string
  name: string
  title: string
  company: string
  price: number
  contributionPercent: number
}

interface BookingDrawerProps {
  professional: Professional
  open: boolean
  onClose: () => void
  locale?: 'da' | 'en'
}

const PREFERRED_TIMES = ['09:00', '11:00', '14:00', '16:00']

const FOCUS_OPTIONS = BOOKING_FOCUS_AREAS.map((id) => ({
  id,
  da: focusLabel(id, 'da'),
  en: focusLabel(id, 'en'),
}))

interface PreferredDay {
  label: string
  value: string
}

function getNextWeekdays(locale: 'da' | 'en'): PreferredDay[] {
  const days: PreferredDay[] = []
  const dateFormatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: SESSION_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit'
  })
  const labelFormatter = new Intl.DateTimeFormat(locale === 'da' ? 'da-DK' : 'en-GB', {
    timeZone: SESSION_TIME_ZONE, weekday: 'short', day: 'numeric', month: 'short'
  })
  const weekdayFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: SESSION_TIME_ZONE, weekday: 'short'
  })

  for (let offset = 1; days.length < 5 && offset < 14; offset += 1) {
    const candidate = new Date(Date.now() + offset * 24 * 60 * 60 * 1000)
    const weekday = weekdayFormatter.format(candidate)
    if (weekday !== 'Sat' && weekday !== 'Sun') {
      days.push({ value: dateFormatter.format(candidate), label: labelFormatter.format(candidate) })
    }
  }
  return days
}

export default function BookingDrawer({ professional, open, onClose, locale = 'da' }: BookingDrawerProps) {
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<PreferredDay | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [sessionFocus, setSessionFocus] = useState('')
  const [sessionGoal, setSessionGoal] = useState('')
  const [materialLink, setMaterialLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authState, setAuthState] = useState<'checking' | 'signed_in' | 'signed_out' | 'error'>('checking')
  const [notificationSent, setNotificationSent] = useState(true)
  const dialogRef = useRef<HTMLDivElement>(null)

  const days = getNextWeekdays(locale)
  const minimumContribution = contributionAmount(professional.price, professional.contributionPercent)

  useEffect(() => {
    if (open) return
    setStep(1)
    setSelectedDate(null)
    setSelectedTime(null)
    setSessionFocus('')
    setSessionGoal('')
    setMaterialLink('')
    setError(null)
    setAuthState('checking')
    setNotificationSent(true)
  }, [open])

  useEffect(() => {
    if (!open) return
    let active = true
    const previousOverflow = document.body.style.overflow
    const previouslyFocused = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    setAuthState('checking')
    createClient().auth.getUser().then(({ data, error: authError }) => {
      if (active) setAuthState(authError ? 'error' : data.user ? 'signed_in' : 'signed_out')
    }).catch(() => {
      if (active) setAuthState('error')
    })
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'))
          .filter((element) => element.offsetParent !== null)
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (!first || !last) return
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    window.requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLElement>('button')?.focus())
    return () => {
      active = false
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [onClose, open])

  const t = {
    title: locale === 'da' ? 'Bookinganmodning' : 'Booking request',
    subtitle: locale === 'da'
      ? 'Vælg et ønsket tidspunkt og fortæl kort, hvad sessionen skal handle om. Tiden bekræftes af den professionelle.'
      : 'Choose a preferred time and briefly describe the session. The professional confirms the time.',
    step1Title: locale === 'da' ? 'Vælg et ønsket tidspunkt' : 'Choose a preferred time',
    step2Title: locale === 'da' ? 'Brief til sessionen' : 'Session brief',
    duration: '60 min',
    price: `${formatDkk(professional.price)} / 60 min`,
    impactLabel: locale === 'da' ? 'Minimumsbidrag' : 'Minimum contribution',
    impactValue: locale === 'da'
      ? `${professional.contributionPercent}% / ${formatDkk(minimumContribution)} afsættes til støtte for Kræftens Bekæmpelse`
      : `${professional.contributionPercent}% / ${formatDkk(minimumContribution)} is allocated in support of Kræftens Bekæmpelse`,
    focusLabel: locale === 'da' ? 'Hvad skal sessionen handle om?' : 'What should the session focus on?',
    goalLabel: locale === 'da' ? 'Hvad vil du gerne opnå?' : 'What would you like to achieve?',
    goalPlaceholder: locale === 'da'
      ? 'F.eks. skarpere CV, træne case, forberede banking technicals eller afklare næste karriereskridt.'
      : 'E.g. sharpen my CV, practice cases, prepare banking technicals or clarify my next career move.',
    goalError: locale === 'da' ? 'Beskriv dit ønskede resultat med mindst 20 tegn.' : 'Describe your desired outcome in at least 20 characters.',
    materialLabel: locale === 'da' ? 'Materiale eller link' : 'Material or link',
    materialPlaceholder: locale === 'da' ? 'Valgfrit: LinkedIn, CV-link, jobopslag eller case-materiale' : 'Optional: LinkedIn, CV link, job post or case material',
    focusError: locale === 'da' ? 'Vælg fokus for sessionen.' : 'Choose a session focus.',
    confirm: locale === 'da' ? 'Send bookinganmodning' : 'Send booking request',
    successTitle: locale === 'da' ? 'Anmodning sendt' : 'Request sent',
    successMsg: locale === 'da'
      ? 'Din anmodning og dit sessionbrief er modtaget. Den professionelle vender tilbage med bekræftelse. Der trækkes ingen betaling nu.'
      : 'Your request and session brief have been received. The professional will confirm the time. No payment is collected now.',
    close: locale === 'da' ? 'Luk' : 'Close',
    back: locale === 'da' ? 'Tilbage' : 'Back',
    continue: locale === 'da' ? 'Fortsæt med tidspunktet' : 'Continue with this time',
    bookingError: locale === 'da' ? 'Bookingen kunne ikke oprettes. Prøv igen.' : 'The booking could not be created. Please try again.',
    professional: locale === 'da' ? 'Professionel' : 'Professional',
    date: locale === 'da' ? 'Dato' : 'Date',
    time: locale === 'da' ? 'Tid' : 'Time',
    priceLabel: locale === 'da' ? 'Pris' : 'Price',
    loginTitle: locale === 'da' ? 'Log ind for at fortsætte' : 'Log in to continue',
    loginBody: locale === 'da' ? 'Du kan se hele profilen uden konto. Login kræves først, når du vil sende en bookinganmodning.' : 'You can view the full profile without an account. Login is only required to send a booking request.',
    authErrorTitle: locale === 'da' ? 'Loginstatus kunne ikke kontrolleres' : 'We could not check your login status',
    authErrorBody: locale === 'da' ? 'Forbindelsen til kontosystemet svarer ikke. Luk vinduet og prøv igen om et øjeblik.' : 'The account service is not responding. Close this window and try again in a moment.',
  }

  async function handleConfirm() {
    if (!selectedDate || !selectedTime) return
    if (!sessionFocus) {
      setError(t.focusError)
      return
    }
    if (sessionGoal.trim().length < 20) {
      setError(t.goalError)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professionalId: professional.id,
          preferredDate: selectedDate.value,
          preferredTime: selectedTime,
          focus: sessionFocus,
          goal: sessionGoal,
          material: materialLink,
        }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || t.bookingError)

      setNotificationSent(result.notificationSent !== false)
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
    setAuthState('checking')
    setNotificationSent(true)
    onClose()
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-gray-950/45 backdrop-blur-sm" onClick={handleClose} aria-hidden="true" />
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="booking-title" aria-describedby="booking-description" className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl shadow-gray-950/20">
        <div className="border-b border-gray-200 px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase text-gray-400">{t.title}</p>
              <h2 id="booking-title" className="mt-1 text-xl font-black text-gray-950">{professional.name}</h2>
              <p className="mt-1 text-sm text-gray-500">{professional.title}{professional.company ? ` · ${professional.company}` : ''}</p>
            </div>
            <button onClick={handleClose} className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-950" aria-label={t.close}>
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <p id="booking-description" className="mt-3 text-xs leading-relaxed text-gray-500 sm:mt-4 sm:text-sm">{t.subtitle}</p>
          {authState === 'signed_in' && (
            <div className="mt-5 grid grid-cols-3 gap-2" aria-label={locale === 'da' ? `Trin ${step} af 3` : `Step ${step} of 3`}>
              {[1, 2, 3].map((n) => (
                <div key={n} className={`h-1.5 ${n <= step ? 'bg-gray-950' : 'bg-gray-200'}`} />
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
          {authState === 'checking' && (
            <div className="space-y-3 py-8" aria-label={locale === 'da' ? 'Kontrollerer login' : 'Checking login'}>
              <div className="h-5 w-40 animate-pulse bg-gray-200" />
              <div className="h-12 animate-pulse bg-[#f7f7f4]" />
              <div className="h-12 animate-pulse bg-[#f7f7f4]" />
            </div>
          )}

          {authState === 'signed_out' && (
            <div className="flex min-h-[22rem] flex-col items-center justify-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-950 text-white"><LockKeyhole size={20} aria-hidden="true" /></div>
              <h3 className="mt-5 text-2xl font-black text-gray-950">{t.loginTitle}</h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-500">{t.loginBody}</p>
              <Link href={`/login?next=${encodeURIComponent(`/professionals/${professional.id}`)}`} className="mt-6 inline-flex items-center justify-center rounded-lg bg-gray-950 px-5 py-3 text-sm font-black text-white hover:bg-gray-800">
                {locale === 'da' ? 'Log ind' : 'Log in'}
              </Link>
              <Link href="/signup" className="mt-4 text-sm font-semibold text-gray-600 underline decoration-gray-300 underline-offset-4 hover:text-gray-950">
                {locale === 'da' ? 'Opret konto' : 'Create account'}
              </Link>
            </div>
          )}

          {authState === 'error' && (
            <div className="flex min-h-[22rem] flex-col items-center justify-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-[#f7f7f4] text-gray-950"><LockKeyhole size={20} aria-hidden="true" /></div>
              <h3 className="mt-5 text-2xl font-black text-gray-950">{t.authErrorTitle}</h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-500">{t.authErrorBody}</p>
              <button type="button" onClick={handleClose} className="mt-6 rounded-lg bg-gray-950 px-5 py-3 text-sm font-black text-white">{t.close}</button>
            </div>
          )}

          {authState === 'signed_in' && step === 1 && (
            <div>
              <h3 className="mb-5 text-base font-black text-gray-950">{t.step1Title}</h3>
              <div className="space-y-4">
                {days.map((day) => (
                  <div key={day.value} className="border border-gray-200 bg-[#f7f7f4] p-3">
                    <p className="mb-2 text-xs font-black uppercase text-gray-500 capitalize">{day.label}</p>
                    <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                      {PREFERRED_TIMES.map((slot) => {
                        const isSelected = selectedDate?.value === day.value && selectedTime === slot
                        return (
                          <button
                            key={slot}
                            aria-pressed={isSelected}
                            type="button"
                            onClick={() => { setSelectedDate(day); setSelectedTime(slot); setError(null) }}
                            className={`rounded-lg border px-1 py-2 text-[13px] font-bold transition-colors sm:px-2 sm:text-sm ${isSelected ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-950 hover:text-gray-950'}`}
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

          {authState === 'signed_in' && step === 2 && selectedDate && selectedTime && (
            <div>
              <h3 className="mb-5 text-base font-black text-gray-950">{t.step2Title}</h3>
              <div className="mb-5 border border-gray-200 bg-[#f7f7f4] p-4">
                {[
                  [t.professional, professional.name],
                  [t.date, selectedDate.label],
                  [locale === 'da' ? 'Ønsket tid' : 'Preferred time', `${selectedTime} (${SESSION_TIME_ZONE})`],
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
                <p className="mt-4 border-t border-gray-200 pt-4 text-xs leading-relaxed text-gray-500">{locale === 'da' ? 'Betaling er ikke aktiveret endnu. Der trækkes ikke noget beløb ved bookinganmodningen.' : 'Payments are not enabled yet. No amount is charged when you send the request.'}</p>
              </div>

              <fieldset className="mb-5">
                <legend className="mb-3 block text-sm font-black text-gray-950">{t.focusLabel}</legend>
                <div className="grid grid-cols-2 gap-2">
                  {FOCUS_OPTIONS.map((option) => {
                    const label = option[locale]
                    const selected = sessionFocus === option.id
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => { setSessionFocus(option.id); setError(null) }}
                        className={`rounded-lg border px-3 py-2.5 text-left text-xs font-black transition-colors ${selected ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 bg-[#f7f7f4] text-gray-700 hover:border-gray-950 hover:bg-white hover:text-gray-950'}`}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </fieldset>

              <label htmlFor="booking-goal" className="mb-2 block text-sm font-black text-gray-950">{t.goalLabel}</label>
              <textarea
                id="booking-goal"
                value={sessionGoal}
                onChange={(e) => setSessionGoal(e.target.value.slice(0, 260))}
                placeholder={t.goalPlaceholder}
                rows={4}
                required
                minLength={20}
                maxLength={260}
                aria-describedby="booking-goal-count"
                className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-colors focus:border-gray-950"
              />
              <p id="booking-goal-count" className="mt-1 flex justify-between gap-4 text-xs text-gray-400"><span>{locale === 'da' ? 'Mindst 20 tegn' : 'At least 20 characters'}</span><span>{sessionGoal.length}/260</span></p>

              <label htmlFor="booking-material" className="mb-2 mt-4 block text-sm font-black text-gray-950">{t.materialLabel}</label>
              <input
                id="booking-material"
                type="url"
                value={materialLink}
                onChange={(e) => setMaterialLink(e.target.value.slice(0, 140))}
                placeholder={t.materialPlaceholder}
                inputMode="url"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-colors focus:border-gray-950"
              />
              <p className="mt-2 text-xs leading-relaxed text-gray-400">{locale === 'da' ? 'Del kun materiale, du har ret til at dele. Undlad følsomme personoplysninger og fortrolige arbejdsdokumenter.' : 'Only share material you are allowed to share. Do not include sensitive personal data or confidential work documents.'}</p>

              {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            </div>
          )}

          {authState === 'signed_in' && step === 3 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-lg bg-gray-950 text-white">
                <Check size={28} aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-2xl font-black text-gray-950">{t.successTitle}</h3>
              <p className="max-w-xs text-sm leading-relaxed text-gray-500">{t.successMsg}</p>
              {!notificationSent && <p className="mt-3 max-w-xs text-xs leading-relaxed text-amber-700">{locale === 'da' ? 'Bookingen er gemt, men e-mailen kunne ikke sendes. Du kan altid se status under Mine bookinger.' : 'The booking is saved, but the email could not be sent. You can always view the status under My bookings.'}</p>}
              <Link href="/profil/bookings" className="mt-6 inline-flex rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-black text-gray-700 hover:border-gray-950">{locale === 'da' ? 'Se mine bookinger' : 'View my bookings'}</Link>
            </div>
          )}
        </div>

        <div className="mobile-safe-bottom border-t border-gray-200 px-5 py-3 sm:px-6 sm:py-4">
          {authState === 'signed_in' && step === 1 && selectedDate && selectedTime && (
            <button type="button" onClick={() => setStep(2)} className="w-full rounded-lg bg-gray-950 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800">
              {t.continue}
            </button>
          )}
          {authState === 'signed_in' && step === 2 && (
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="flex-1 rounded-lg border border-gray-200 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50">
                {t.back}
              </button>
              <button type="button" onClick={handleConfirm} disabled={loading} className="flex-1 rounded-lg bg-gray-950 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800 disabled:opacity-60">
                {loading ? '...' : t.confirm}
              </button>
            </div>
          )}
          {authState === 'signed_in' && step === 3 && (
            <button type="button" onClick={handleClose} className="w-full rounded-lg bg-gray-950 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800">
              {t.close}
            </button>
          )}
        </div>
      </div>
    </>
  )
}
