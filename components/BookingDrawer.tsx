'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CalendarX2, Check, LockKeyhole, RefreshCw, X } from 'lucide-react'
import { formatDkk } from '@/lib/platform'
import { SESSION_TIME_ZONE } from '@/lib/dateTime'
import { ImpactMarker } from '@/components/ImpactMarker'
import { charityAmount, type PayoutPreference } from '@/lib/payoutPreference'
import { isSessionTypeId, sessionType, sessionTypesForFocusAreas, type SessionTypeId } from '@/lib/sessionTypes'

interface Professional {
  id: string
  name: string
  title: string
  company: string
  price: number
  focus_areas: string[]
  payoutPreference?: PayoutPreference
}

interface BookingDrawerProps {
  professional: Professional
  open: boolean
  onClose: () => void
  locale?: 'da' | 'en'
  initialSessionType?: SessionTypeId
}

interface AvailabilitySlot {
  id: string
  starts_at: string
  ends_at: string
  time_zone: string
  meeting_mode: string
}

export default function BookingDrawer({ professional, open, onClose, locale = 'da', initialSessionType }: BookingDrawerProps) {
  const [step, setStep] = useState(1)
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null)
  const [availabilityState, setAvailabilityState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [sessionTypeId, setSessionTypeId] = useState<SessionTypeId | ''>(initialSessionType ?? '')
  const [sessionGoal, setSessionGoal] = useState('')
  const [materialLink, setMaterialLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authState, setAuthState] = useState<'checking' | 'signed_in' | 'signed_out' | 'error'>('checking')
  const [notificationSent, setNotificationSent] = useState(true)
  const dialogRef = useRef<HTMLDivElement>(null)

  const availableSessionTypes = sessionTypesForFocusAreas(professional.focus_areas ?? [])
  const selectedSession = sessionTypeId ? sessionType(sessionTypeId) : null
  const dateLocale = locale === 'da' ? 'da-DK' : 'en-GB'
  const slotsByDay = slots.reduce<Record<string, AvailabilitySlot[]>>((groups, slot) => {
    const key = new Intl.DateTimeFormat('sv-SE', { timeZone: SESSION_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(slot.starts_at))
    groups[key] = [...(groups[key] ?? []), slot]
    return groups
  }, {})

  useEffect(() => {
    if (open) return
    setStep(1)
    setSelectedSlot(null)
    setSlots([])
    setAvailabilityState('loading')
    setSessionTypeId(initialSessionType ?? '')
    setSessionGoal('')
    setMaterialLink('')
    setError(null)
    setAuthState('checking')
    setNotificationSent(true)
  }, [initialSessionType, open])

  useEffect(() => {
    if (open && initialSessionType && isSessionTypeId(initialSessionType)) setSessionTypeId(initialSessionType)
  }, [initialSessionType, open])

  useEffect(() => {
    if (!open) return
    let active = true
    const previousOverflow = document.body.style.overflow
    const previouslyFocused = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    setAuthState('checking')
    setAvailabilityState('loading')
    createClient().auth.getUser().then(({ data, error: authError }) => {
      if (active) setAuthState(authError ? 'error' : data.user ? 'signed_in' : 'signed_out')
    }).catch(() => {
      if (active) setAuthState('error')
    })
    fetch(`/api/professionals/${professional.id}/availability`, { cache: 'no-store' })
      .then(async (response) => {
        const result = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(result.error)
        if (active) {
          setSlots(result.slots ?? [])
          setAvailabilityState('ready')
        }
      })
      .catch(() => { if (active) setAvailabilityState('error') })
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
  }, [onClose, open, professional.id])

  const t = {
    title: locale === 'da' ? 'Bookinganmodning' : 'Booking request',
    subtitle: locale === 'da'
      ? 'Vælg et tidspunkt og definér ét konkret mål for de 60 minutter. Anmodningen er først bekræftet, når den professionelle har accepteret.'
      : 'Choose a time and define one concrete goal for the 60 minutes. The request is only confirmed when the professional accepts.',
    step1Title: locale === 'da' ? 'Vælg en ledig tid' : 'Choose an available time',
    step2Title: locale === 'da' ? 'Brief til sessionen' : 'Session brief',
    duration: '60 min',
    price: `${formatDkk(professional.price)} ${locale === 'da' ? 'inkl. moms' : 'incl. VAT'} / 60 min`,
    focusLabel: locale === 'da' ? 'Hvad vil du bruge erfaringen til?' : 'What will you use the experience for?',
    goalLabel: locale === 'da' ? 'Hvad skal være anderledes efter de 60 minutter?' : 'What should be different after the 60 minutes?',
    goalPlaceholder: locale === 'da'
      ? 'Beskriv kort situationen, dit udgangspunkt og det konkrete resultat, du vil gå videre med.'
      : 'Briefly describe the situation, your starting point and the concrete outcome you want to move forward with.',
    goalError: locale === 'da' ? 'Beskriv dit ønskede resultat med mindst 20 tegn.' : 'Describe your desired outcome in at least 20 characters.',
    materialLabel: locale === 'da' ? 'Materiale eller link' : 'Material or link',
    materialPlaceholder: locale === 'da' ? 'Valgfrit: LinkedIn, CV-link, jobopslag eller case-materiale' : 'Optional: LinkedIn, CV link, job post or case material',
    focusError: locale === 'da' ? 'Vælg en sessionstype.' : 'Choose a session type.',
    confirm: locale === 'da' ? 'Send bookinganmodning' : 'Send booking request',
    successTitle: locale === 'da' ? 'Anmodning sendt' : 'Request sent',
    successMsg: locale === 'da'
      ? 'Din anmodning og dit konkrete mål er modtaget. Tidspunktet er først bekræftet, når den professionelle accepterer. Der trækkes ingen betaling nu.'
      : 'Your request and concrete goal have been received. The time is only confirmed when the professional accepts. No payment is collected now.',
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
    if (!selectedSlot) return
    if (!sessionTypeId) {
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
          slotId: selectedSlot.id,
          sessionType: sessionTypeId,
          focus: selectedSession?.focusArea,
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
    setSelectedSlot(null)
    setSessionTypeId(initialSessionType ?? '')
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
      <div className="booking-overlay" onClick={handleClose} aria-hidden="true" />
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="booking-title" aria-describedby="booking-description" className="booking-drawer">
        <div className="booking-drawer__signature" aria-hidden="true"><span /><i /></div>
        <div className="border-b border-gray-200 bg-[#f4f4f0] px-5 py-5 sm:px-7 sm:py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="editorial-label">{t.title}</p>
              <h2 id="booking-title" className="mt-2 text-2xl font-semibold text-gray-950">{professional.name}</h2>
              <p className="mt-1 text-sm text-gray-500">{professional.title}{professional.company ? ` · ${professional.company}` : ''}</p>
            </div>
            <button onClick={handleClose} className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 transition-colors hover:border-gray-950 hover:text-gray-950" aria-label={t.close}>
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
              <h3 className="mb-5 text-lg font-semibold text-gray-950">{t.step1Title}</h3>
              {availabilityState === 'loading' ? (
                <div className="space-y-3" aria-label={locale === 'da' ? 'Indlæser ledige tider' : 'Loading available times'}><div className="h-20 animate-pulse bg-[#f4f4f0]" /><div className="h-20 animate-pulse bg-[#f4f4f0]" /></div>
              ) : availabilityState === 'error' ? (
                <div className="border-y border-gray-200 py-10 text-center">
                  <CalendarX2 size={22} className="mx-auto text-gray-300" aria-hidden="true" />
                  <p className="mt-4 text-sm font-semibold text-gray-950">{locale === 'da' ? 'Tiderne kunne ikke indlæses' : 'Times could not be loaded'}</p>
                  <button type="button" onClick={() => { setAvailabilityState('loading'); fetch(`/api/professionals/${professional.id}/availability`, { cache: 'no-store' }).then(async (response) => { const result = await response.json(); if (!response.ok) throw new Error(); setSlots(result.slots ?? []); setAvailabilityState('ready') }).catch(() => setAvailabilityState('error')) }} className="button-secondary mt-5"><RefreshCw size={15} aria-hidden="true" />{locale === 'da' ? 'Prøv igen' : 'Try again'}</button>
                </div>
              ) : slots.length === 0 ? (
                <div className="border-y border-gray-200 bg-[#f7f7f4] px-5 py-10 text-center">
                  <CalendarX2 size={22} className="mx-auto text-gray-300" aria-hidden="true" />
                  <p className="mt-4 text-sm font-semibold text-gray-950">{locale === 'da' ? 'Ingen ledige tider lige nu' : 'No available times right now'}</p>
                  <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-gray-500">{locale === 'da' ? 'Den professionelle har ikke åbnet nye tider. Se en anden profil eller prøv igen senere.' : 'The professional has not opened new times. Browse another profile or try again later.'}</p>
                  <Link href="/professionals" className="button-secondary mt-5">{locale === 'da' ? 'Se andre profiler' : 'Browse other profiles'}</Link>
                </div>
              ) : (
                <div className="space-y-4">
                {Object.entries(slotsByDay).map(([day, daySlots]) => (
                  <div key={day} className="rounded-md border border-gray-200 bg-[#f4f4f0] p-3">
                    <p className="editorial-label mb-2 capitalize text-gray-600">{new Date(daySlots[0].starts_at).toLocaleDateString(dateLocale, { weekday: 'long', day: 'numeric', month: 'long', timeZone: SESSION_TIME_ZONE })}</p>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {daySlots.map((slot) => {
                        const isSelected = selectedSlot?.id === slot.id
                        return (
                          <button
                            key={slot.id}
                            aria-pressed={isSelected}
                            type="button"
                            onClick={() => { setSelectedSlot(slot); setError(null) }}
                            className={`rounded-md border px-1 py-2.5 text-[13px] font-bold transition-all sm:px-2 sm:text-sm ${isSelected ? 'border-gray-950 bg-gray-950 text-white shadow-sm' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-950 hover:-translate-y-0.5 hover:text-gray-950'}`}
                          >
                            {new Date(slot.starts_at).toLocaleTimeString(dateLocale, { hour: '2-digit', minute: '2-digit', timeZone: SESSION_TIME_ZONE })}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>
          )}

          {authState === 'signed_in' && step === 2 && selectedSlot && (
            <div>
              <h3 className="mb-5 text-lg font-semibold text-gray-950">{t.step2Title}</h3>
              <div className="mb-5 rounded-md border border-gray-200 bg-[#f4f4f0] p-4">
                {[
                  [t.professional, professional.name],
                  [t.date, new Date(selectedSlot.starts_at).toLocaleDateString(dateLocale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: SESSION_TIME_ZONE })],
                  [locale === 'da' ? 'Tid' : 'Time', `${new Date(selectedSlot.starts_at).toLocaleTimeString(dateLocale, { hour: '2-digit', minute: '2-digit', timeZone: SESSION_TIME_ZONE })} (${SESSION_TIME_ZONE})`],
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
                <p className="mt-4 border-t border-gray-200 pt-4 text-xs leading-relaxed text-gray-500">{locale === 'da' ? 'Betaling er ikke aktiveret endnu. Der trækkes ikke noget beløb ved bookinganmodningen.' : 'Payments are not enabled yet. No amount is charged when you send the request.'}</p>
              </div>

              <div className="mb-5">
                <ImpactMarker price={professional.price} locale={locale} compact />
                {professional.payoutPreference === 'donate' && (
                  <p className="mt-2 border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold leading-relaxed text-emerald-900">
                    {locale === 'da'
                      ? `Den professionelle donerer også sin 70%-andel. Samlet går 80% af nettoprisen (${formatDkk(charityAmount(professional.price, 'donate'))}) til Kræftens Bekæmpelse.`
                      : `The professional also donates their 70% share. In total, 80% of the net price (${formatDkk(charityAmount(professional.price, 'donate'))}) goes to Kræftens Bekæmpelse.`}
                  </p>
                )}
              </div>

              <fieldset className="mb-5">
                <legend className="mb-3 block text-sm font-black text-gray-950">{t.focusLabel}</legend>
                <div className="grid gap-2">
                  {availableSessionTypes.map((option) => {
                    const label = option.title[locale]
                    const selected = sessionTypeId === option.id
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => { setSessionTypeId(option.id); setError(null) }}
                        className={`rounded-md border px-3 py-3 text-left transition-colors ${selected ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 bg-[#f4f4f0] text-gray-700 hover:border-gray-950 hover:bg-white hover:text-gray-950'}`}
                      >
                        <span className="block text-xs font-bold">{label}</span>
                        <span className={`mt-1 block text-[11px] font-medium leading-relaxed ${selected ? 'text-white/60' : 'text-gray-500'}`}>{option.outcome[locale]}</span>
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
                className="field-control resize-none text-sm text-gray-700"
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
                className="field-control text-sm text-gray-700"
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
          {authState === 'signed_in' && step === 1 && selectedSlot && (
            <button type="button" onClick={() => setStep(2)} className="button-primary w-full">
              {t.continue}
            </button>
          )}
          {authState === 'signed_in' && step === 2 && (
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="button-secondary flex-1">
                {t.back}
              </button>
              <button type="button" onClick={handleConfirm} disabled={loading} className="button-primary flex-1 disabled:opacity-60">
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
