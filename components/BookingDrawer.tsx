'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { sendBookingConfirmed } from '@/lib/email'
import { ECONOMICS, economicsSummary, formatDkk, splitPayment } from '@/lib/economics'

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
const STEP_LABELS = ['Profil', 'Brief', 'Tid', 'Anmodning']

const PRESSURE_OPTIONS = [
  'Materiale',
  'Interview',
  'Case / technicals',
  'Retning',
]

const FOCUS_OPTIONS = [
  { id: 'cv_linkedin', label: 'CV / LinkedIn' },
  { id: 'interview_prep', label: 'Interviewtræning' },
  { id: 'case_prep', label: 'Case prep' },
  { id: 'career_direction', label: 'Karriereretning' },
  { id: 'banking_technicals', label: 'Banking technicals' },
  { id: 'consulting_cases', label: 'Consulting cases' },
  { id: 'pe_investment_case', label: 'PE / investment case' },
  { id: 'ai_career_strategy', label: 'AI career strategy' },
]

const STAGE_OPTIONS = [
  { id: 'exploring', label: 'Udforsker muligheder' },
  { id: 'applying', label: 'Sender ansøgninger' },
  { id: 'interviewing', label: 'Interview snart' },
  { id: 'final_rounds', label: 'Sidste runder' },
]

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

function formatDate(d: Date): string {
  return d.toLocaleDateString('da-DK', {
    weekday: 'short', day: 'numeric', month: 'short',
    timeZone: 'Europe/Copenhagen'
  })
}

export default function BookingDrawer({ professional, open, onClose }: BookingDrawerProps) {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [reminder, setReminder] = useState(true)
  const [pressure, setPressure] = useState('')
  const [sessionFocus, setSessionFocus] = useState('')
  const [candidateStage, setCandidateStage] = useState('')
  const [sessionGoal, setSessionGoal] = useState('')
  const [materialLink, setMaterialLink] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()
  const days = getNextTwoWeekdays()
  const focusLabel = FOCUS_OPTIONS.find((option) => option.id === sessionFocus)?.label ?? ''
  const stageLabel = STAGE_OPTIONS.find((option) => option.id === candidateStage)?.label ?? ''
  const split = splitPayment(professional.price)

  function validateStep(nextStep = step) {
    if (nextStep === 2 && (!pressure || !sessionFocus)) {
      setError('Vælg både pres og fokus for sessionen.')
      return false
    }
    if (nextStep === 3 && (!selectedDate || !selectedTime)) {
      setError('Vælg dato og tidspunkt.')
      return false
    }
    setError(null)
    return true
  }

  async function handleConfirm() {
    if (!selectedDate || !selectedTime || !sessionFocus) return

    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Log ind for at sende en bookinganmodning.')

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, name')
        .eq('auth_user_id', user.id)
        .single()

      if (profileError || !profile) throw new Error('Din profil blev ikke fundet. Prøv at logge ind igen.')

      const startsAt = new Date(selectedDate)
      const [h, m] = selectedTime.split(':').map(Number)
      startsAt.setHours(h, m, 0, 0)
      const endsAt = new Date(startsAt.getTime() + ECONOMICS.sessionMinutes * 60 * 1000)
      const brief = [
        `Pres: ${pressure}`,
        `Fokus: ${focusLabel}`,
        stageLabel ? `Procesfase: ${stageLabel}` : null,
        sessionGoal.trim() ? `Mål: ${sessionGoal.trim()}` : null,
        materialLink.trim() ? `Materiale/link: ${materialLink.trim()}` : null,
        message.trim() ? `Note: ${message.trim()}` : null,
        `Økonomi: ${economicsSummary(professional.price)}`,
        'Betaling håndteres separat efter bekræftelse. Ingen checkout i dette flow.',
      ].filter(Boolean).join('\n')

      const { error: bookingError } = await supabase.from('bookings').insert({
        candidate_profile_id: profile.id,
        professional_profile_id: professional.id.startsWith('demo-') ? null : professional.id,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        price_dkk: professional.price,
        message_to_professional: brief,
        reminder_requested: reminder,
        status: 'requested',
        payment_status: 'pending',
      })

      if (bookingError) throw new Error('Bookingen kunne ikke oprettes. Prøv igen.')

      if (user.email) {
        await sendBookingConfirmed({
          candidateEmail: user.email,
          candidateName: (profile.name as string | null) ?? user.email,
          professionalName: professional.name,
          sessionType: `${ECONOMICS.sessionMinutes} min karrieresession - ${focusLabel}`,
          scheduledAt: startsAt.toISOString(),
          priceDkk: professional.price,
        }).catch(() => false)
      }

      setSubmitted(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Bookingen kunne ikke oprettes. Prøv igen.')
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    setStep(1)
    setSubmitted(false)
    setSelectedDate(null)
    setSelectedTime(null)
    setPressure('')
    setSessionFocus('')
    setCandidateStage('')
    setSessionGoal('')
    setMaterialLink('')
    setMessage('')
    setReminder(true)
    setError(null)
    onClose()
  }

  function goNext() {
    if (step === 2 && !validateStep(2)) return
    if (step === 3 && !validateStep(3)) return
    setStep((current) => Math.min(current + 1, 4))
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-gray-950/45 backdrop-blur-sm" onClick={handleClose} aria-hidden="true" />
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl shadow-gray-950/20">
        <div className="border-b border-gray-200 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase text-gray-400">Book 60 min</p>
              <h2 className="mt-1 text-xl font-black text-gray-950">{professional.name}</h2>
              <p className="mt-1 text-sm text-gray-500">{professional.title} · {professional.company}</p>
            </div>
            <button onClick={handleClose} className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-950" aria-label="Luk">
              x
            </button>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-gray-500">Vælg profil, beskriv dit pres, vælg tid og send en anmodning. Betaling håndteres separat efter bekræftelse.</p>
          <div className="mt-5 grid grid-cols-4 gap-2">
            {STEP_LABELS.map((label, index) => {
              const n = index + 1
              return (
                <div key={label} className="min-w-0">
                  <div className={`h-1.5 ${n <= step ? 'bg-gray-950' : 'bg-gray-200'}`} />
                  <p className={`mt-1 truncate text-[10px] font-black uppercase ${n <= step ? 'text-gray-950' : 'text-gray-300'}`}>{label}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-lg bg-gray-950 text-white">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mb-2 text-2xl font-black text-gray-950">Anmodning sendt</h3>
              <p className="max-w-xs text-sm leading-relaxed text-gray-500">Din bookinganmodning og dit session brief er modtaget. Du får en e-mail, og den professionelle vender tilbage med bekræftelse. Betaling håndteres separat.</p>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <p className="text-xs font-black uppercase text-gray-400">01 · Vælg profil</p>
                    <h3 className="mt-2 text-2xl font-black text-gray-950">Profil valgt.</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">Tjek pris, format og fordeling før du fortsætter.</p>
                  </div>
                  <div className="border border-gray-200 bg-[#f7f7f4] p-4">
                    {[
                      ['Professional', professional.name],
                      ['Rolle', `${professional.title} · ${professional.company}`],
                      ['Format', `${ECONOMICS.sessionMinutes} min videosession`],
                      ['Pris', formatDkk(professional.price)],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-4 border-t border-gray-200 py-3 text-sm first:border-t-0 first:pt-0">
                        <span className="text-gray-500">{label}</span>
                        <span className="text-right font-bold text-gray-950">{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid gap-px border border-gray-200 bg-gray-200">
                    <div className="bg-white p-4">
                      <p className="text-xs font-black uppercase text-gray-400">Sådan fordeles din betaling</p>
                      <p className="mt-3 text-sm font-black text-gray-950">{formatDkk(split.charity)} til {ECONOMICS.charityName}</p>
                      <p className="mt-1 text-sm font-semibold text-gray-500">{formatDkk(split.professional)} til eksperten · {formatDkk(split.platform)} til platformen</p>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <p className="text-xs font-black uppercase text-gray-400">02 · Beskriv dit pres</p>
                  <h3 className="mt-2 text-2xl font-black text-gray-950">Hvad skal timen løse?</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">Jo mere præcist briefet er, jo bedre kan sessionen bruges.</p>

                  <div className="mt-5">
                    <label className="mb-3 block text-sm font-black text-gray-950">Start med presset</label>
                    <div className="grid grid-cols-2 gap-2">
                      {PRESSURE_OPTIONS.map((option) => (
                        <button key={option} onClick={() => { setPressure(option); setError(null) }} className={`rounded-lg border px-3 py-2.5 text-left text-xs font-black transition-colors ${pressure === option ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 bg-[#f7f7f4] text-gray-700 hover:border-gray-950 hover:bg-white hover:text-gray-950'}`}>
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="mb-3 block text-sm font-black text-gray-950">Vælg fokus</label>
                    <div className="grid grid-cols-2 gap-2">
                      {FOCUS_OPTIONS.map((option) => (
                        <button key={option.id} onClick={() => { setSessionFocus(option.id); setError(null) }} className={`rounded-lg border px-3 py-2.5 text-left text-xs font-black transition-colors ${sessionFocus === option.id ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 bg-[#f7f7f4] text-gray-700 hover:border-gray-950 hover:bg-white hover:text-gray-950'}`}>
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="mb-3 block text-sm font-black text-gray-950">Hvor er du i processen?</label>
                    <div className="grid grid-cols-2 gap-2">
                      {STAGE_OPTIONS.map((option) => (
                        <button key={option.id} onClick={() => setCandidateStage(candidateStage === option.id ? '' : option.id)} className={`rounded-lg border px-3 py-2.5 text-left text-xs font-black transition-colors ${candidateStage === option.id ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 bg-[#f7f7f4] text-gray-700 hover:border-gray-950 hover:bg-white hover:text-gray-950'}`}>
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="mb-2 mt-5 block text-sm font-black text-gray-950">Hvad vil du gerne opnå?</label>
                  <textarea value={sessionGoal} onChange={(e) => setSessionGoal(e.target.value.slice(0, 260))} placeholder="F.eks. skarpere CV, træne case, forberede banking technicals eller afklare næste karriereskridt." rows={4} className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-colors focus:border-gray-950" />
                  <p className="mt-1 text-right text-xs text-gray-400">{sessionGoal.length}/260</p>

                  <label className="mb-2 mt-4 block text-sm font-black text-gray-950">Materiale eller link</label>
                  <input value={materialLink} onChange={(e) => setMaterialLink(e.target.value.slice(0, 140))} placeholder="Valgfrit: LinkedIn, CV-link, jobopslag eller case-materiale" inputMode="url" className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-colors focus:border-gray-950" />

                  <label className="mb-2 mt-4 block text-sm font-black text-gray-950">Ekstra note</label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value.slice(0, 160))} placeholder="Valgfrit: andet den professionelle bør vide." rows={3} className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-colors focus:border-gray-950" />
                  <p className="mt-1 text-right text-xs text-gray-400">{message.length}/160</p>
                </div>
              )}

              {step === 3 && (
                <div>
                  <p className="text-xs font-black uppercase text-gray-400">03 · Vælg tid</p>
                  <h3 className="mt-2 text-2xl font-black text-gray-950">60 min videosession</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">Tiden er en anmodning. Den professionelle bekræfter, før betaling håndteres separat.</p>
                  <div className="mt-5 space-y-4">
                    {days.map((day, i) => (
                      <div key={i} className="border border-gray-200 bg-[#f7f7f4] p-3">
                        <p className="mb-2 text-xs font-black uppercase text-gray-500 capitalize">{formatDate(day)}</p>
                        <div className="grid grid-cols-4 gap-2">
                          {DEMO_SLOTS.map((slot) => {
                            const isSelected = selectedDate?.toDateString() === day.toDateString() && selectedTime === slot
                            return (
                              <button key={slot} onClick={() => { setSelectedDate(day); setSelectedTime(slot); setError(null) }} className={`rounded-lg border px-2 py-2 text-sm font-bold transition-colors ${isSelected ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-950 hover:text-gray-950'}`}>
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

              {step === 4 && selectedDate && selectedTime && (
                <div>
                  <p className="text-xs font-black uppercase text-gray-400">04 · Bekræft anmodning</p>
                  <h3 className="mt-2 text-2xl font-black text-gray-950">Send anmodning</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">Dette er ikke betaling. Du sender en bookinganmodning, og betaling håndteres separat efter bekræftelse.</p>
                  <div className="mt-5 border border-gray-200 bg-[#f7f7f4] p-4">
                    {[
                      ['Profil', professional.name],
                      ['Pres', pressure],
                      ['Fokus', focusLabel],
                      ['Procesfase', stageLabel || 'Ikke tilføjet'],
                      ['Dato', formatDate(selectedDate)],
                      ['Tid', `${selectedTime} (Europe/Copenhagen)`],
                      ['Pris', formatDkk(professional.price)],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-4 border-t border-gray-200 py-2 text-sm first:border-t-0 first:pt-0">
                        <span className="text-gray-500">{label}</span>
                        <span className="max-w-[13rem] text-right font-bold text-gray-950">{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 border border-gray-200 bg-white p-4">
                    <p className="text-xs font-black uppercase text-gray-400">Sådan fordeles betalingen</p>
                    <p className="mt-3 text-sm font-black text-gray-950">{formatDkk(split.charity)} til {ECONOMICS.charityName}</p>
                    <p className="mt-1 text-sm font-semibold text-gray-500">{formatDkk(split.professional)} til eksperten · {formatDkk(split.platform)} til platformen</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between border border-gray-200 bg-white px-4 py-3">
                    <span className="text-sm font-medium text-gray-700">Tilføj påmindelse</span>
                    <button onClick={() => setReminder(!reminder)} className={`relative h-6 w-11 rounded-full transition-colors ${reminder ? 'bg-gray-950' : 'bg-gray-200'}`} aria-pressed={reminder}>
                      <span className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${reminder ? 'translate-x-5' : ''}`} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        </div>

        <div className="border-t border-gray-200 px-6 py-4">
          {submitted ? (
            <button onClick={handleClose} className="w-full rounded-lg bg-gray-950 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800">Luk</button>
          ) : (
            <div className="flex gap-3">
              {step > 1 && (
                <button onClick={() => { setError(null); setStep((current) => current - 1) }} className="flex-1 rounded-lg border border-gray-200 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50">Tilbage</button>
              )}
              {step < 4 ? (
                <button onClick={goNext} className="flex-1 rounded-lg bg-gray-950 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800">Næste</button>
              ) : (
                <button onClick={handleConfirm} disabled={loading} className="flex-1 rounded-lg bg-gray-950 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800 disabled:opacity-60">
                  {loading ? 'Sender...' : 'Send anmodning'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
