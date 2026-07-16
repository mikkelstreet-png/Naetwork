'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, RefreshCw } from 'lucide-react'
import BookingDrawer from '@/components/BookingDrawer'
import { RevenueSplit } from '@/components/RevenueSplit'
import { useLanguage } from '@/context/LanguageContext'
import { createClient } from '@/lib/supabase/client'
import { formatDkk, industryAccent, SESSION_MINUTES } from '@/lib/platform'
import { mapPublicProfessionals, type ProfessionalCard } from '@/lib/professionals'
import { professionalInitials, professionalSessionTypes } from '@/lib/professionalPresentation'
import type { SessionTypeId } from '@/lib/sessionTypes'

function accentFor(professional: ProfessionalCard) {
  return industryAccent(professional.industries[0])
}

interface ProfessionalDetailProps {
  id: string
  initialProfessional: ProfessionalCard | null
  initialLoadError?: boolean
}

export default function ProfessionalDetail({ id, initialProfessional, initialLoadError = false }: ProfessionalDetailProps) {
  const { lang } = useLanguage()
  const isDa = lang === 'da'
  const [professional, setProfessional] = useState<ProfessionalCard | null>(initialProfessional)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState(initialLoadError)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedSessionType, setSelectedSessionType] = useState<SessionTypeId | undefined>()

  const fetchProfessional = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setLoadError(false)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.rpc('get_public_professionals', { requested_id: id }).maybeSingle()
      if (error) {
        setLoadError(true)
        return
      }
      setProfessional(mapPublicProfessionals(data ? [data] : [])[0] ?? null)
    } catch {
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }, [id])

  function openBooking(sessionId?: SessionTypeId) {
    setSelectedSessionType(sessionId)
    setDrawerOpen(true)
  }

  if (loading) return (
    <main aria-busy="true" className="flex min-h-[calc(100vh-4.75rem)] items-center justify-center bg-[#09090b] px-5 text-white">
      <div className="w-full max-w-sm"><div className="signal-rail mb-6"><span /><span /><span /><span /></div><p className="editorial-label text-white/35">Profile record</p><p className="mt-3 text-2xl font-medium">{isDa ? 'Henter profil…' : 'Loading profile…'}</p></div>
    </main>
  )

  if (loadError) return (
    <main className="grid min-h-[calc(100vh-4.75rem)] bg-white lg:grid-cols-[1fr_0.72fr]">
      <div className="flex items-center bg-[#09090b] px-5 py-14 text-white sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-2xl"><div className="signal-rail mb-7 max-w-24"><span /><span /><span /><span /></div><p className="kicker text-white/35">Profile service / status</p><h1 className="mt-5 max-w-xl text-4xl font-medium leading-tight text-white sm:text-5xl">{isDa ? 'Profilen kunne ikke indlæses' : 'The profile could not be loaded'}</h1><p className="mt-5 max-w-lg text-sm leading-relaxed text-white/55">{isDa ? 'Profilservicen svarer ikke lige nu. Prøv igen om et øjeblik.' : 'The profile service is not responding right now. Please try again shortly.'}</p></div>
      </div>
      <div className="flex items-center bg-[#f1f1ec] px-5 py-12 sm:px-8 lg:px-12">
        <div className="w-full max-w-md"><p className="editorial-label">{isDa ? 'Næste handling' : 'Next action'}</p><h2 className="mt-4 text-2xl font-medium leading-tight text-gray-950">{isDa ? 'Prøv igen, eller gå tilbage til fagpersonerne.' : 'Retry or return to the professionals.'}</h2><div className="mt-7 flex flex-wrap gap-3"><button type="button" onClick={() => void fetchProfessional()} className="button-primary"><RefreshCw size={16} aria-hidden="true" />{isDa ? 'Prøv igen' : 'Try again'}</button><Link href="/professionals" className="button-secondary">{isDa ? 'Alle fagpersoner' : 'All professionals'}</Link></div></div>
      </div>
    </main>
  )

  if (!professional) return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6"><div className="text-center"><h1 className="mb-4 text-2xl font-black text-gray-950">{isDa ? 'Profilen findes ikke' : 'Profile not found'}</h1><Link href="/professionals" className="text-sm font-semibold underline underline-offset-4">{isDa ? 'Tilbage til fagpersoner' : 'Back to professionals'}</Link></div></main>
  )

  const supportedSessions = professionalSessionTypes(professional)
  const nextAvailable = professional.nextAvailableAt
    ? new Date(professional.nextAvailableAt).toLocaleString(isDa ? 'da-DK' : 'en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Copenhagen' })
    : isDa ? 'Ingen åbne tider' : 'No open times'

  return (
    <main className="min-h-screen bg-white pb-24 md:pb-0">
      <section className="border-b border-white/15 bg-[#09090b] px-5 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[82rem] py-9 md:py-20">
          <Link href="/professionals" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-white/45 hover:text-white md:mb-12"><span aria-hidden="true">←</span>{isDa ? 'Alle fagpersoner' : 'All professionals'}</Link>
          <div className="grid gap-12 lg:grid-cols-[1fr_350px] lg:items-end">
            <div>
              <div className="signal-rail mb-7 max-w-24"><span /><span /><span /><span /></div>
              <div className="mb-5 flex flex-wrap items-center gap-4"><p className="kicker text-white/40">{professional.industries.join(' / ')}</p><span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase text-emerald-200"><CheckCircle2 size={13} aria-hidden="true" />{isDa ? 'Profil gennemgået' : 'Profile reviewed'}</span></div>
              <h1 className="max-w-4xl text-5xl font-medium leading-[0.94] text-white text-balance sm:text-6xl md:text-8xl">{professional.name}</h1>
              <p className="mt-6 text-base font-semibold text-white/72 md:text-xl">{professional.title}{professional.company ? ` · ${professional.company}` : ''}</p>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/55 md:text-lg">{professional.bio}</p>
            </div>
            <aside className="border border-white/20 bg-white/[0.035] p-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-md text-sm font-bold text-gray-950 ${accentFor(professional)}`}>{professionalInitials(professional.name)}</div>
              <p className="mt-7 editorial-label text-white/40">{SESSION_MINUTES} min 1:1</p>
              <p className="mt-2 text-3xl font-semibold">{formatDkk(professional.price)}</p>
              <p className="mt-1 text-xs font-semibold text-white/40">{isDa ? 'Inkl. moms' : 'Incl. VAT'}</p>
              <dl className="mt-5 border-t border-white/15 text-sm"><div className="flex justify-between gap-4 border-b border-white/15 py-3"><dt className="text-white/45">{isDa ? 'Sessionstyper' : 'Session types'}</dt><dd className="font-bold">{supportedSessions.length}</dd></div><div className="flex justify-between gap-4 border-b border-white/15 py-3"><dt className="text-white/45">{isDa ? 'Næste tid' : 'Next time'}</dt><dd className="text-right font-bold">{nextAvailable}</dd></div></dl>
              <button type="button" onClick={() => openBooking()} className="button-inverse mt-5 w-full">{isDa ? 'Book session' : 'Book session'}</button>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[82rem] px-5 py-12 sm:px-8 md:py-24 lg:px-12">
        <div className="section-heading">
          <p className="section-eyebrow">{isDa ? 'Sessioner med denne fagperson' : 'Sessions with this professional'}</p>
          <h2>{isDa ? 'Vælg den konkrete opgave.' : 'Choose the concrete task.'}</h2>
          <p>{isDa ? 'Fagpersonens gennemgåede fokusområder afgør, hvilke sessioner profilen matcher.' : 'The professional’s reviewed focus areas determine which sessions the profile matches.'}</p>
        </div>
        <div className="product-session-grid">
          {supportedSessions.map((session, index) => (
            <article key={session.id}>
              <div className="product-session-grid__topline"><span>0{index + 1}</span><span>{SESSION_MINUTES} min</span></div>
              <h3>{session.title[lang]}</h3>
              <p>{session.description[lang]}</p>
              <div className="product-session-grid__outcome"><span>{isDa ? 'Muligt output' : 'Possible output'}</span><strong>{session.outcome[lang]}</strong></div>
              <button type="button" onClick={() => openBooking(session.id)} className="mt-6 inline-flex w-fit items-center gap-2 border-b border-gray-400 pb-1 text-sm font-bold text-gray-950">{isDa ? 'Vælg session' : 'Choose session'}<span aria-hidden="true">→</span></button>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section home-section--paper">
        <div className="home-shell pricing-product-layout">
          <div>
            <p className="section-eyebrow">{isDa ? 'Pris før booking' : 'Price before booking'}</p>
            <h2>{isDa ? 'Du ser hele fordelingen.' : 'You see the full split.'}</h2>
            <p>{isDa ? 'Totalprisen og de tre andele vises igen i bookingflowet og gemmes med anmodningen.' : 'The total price and all three shares are shown again during booking and saved with the request.'}</p>
          </div>
          <RevenueSplit price={professional.price} locale={lang} />
        </div>
      </section>

      {!drawerOpen && <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-[0_-12px_40px_rgba(9,9,11,0.10)] backdrop-blur-xl md:hidden"><div className="mx-auto flex max-w-6xl items-center justify-between gap-3"><div><p className="text-sm font-black text-gray-950">{formatDkk(professional.price)} · {SESSION_MINUTES} min</p><p className="text-[11px] font-semibold text-gray-500">{supportedSessions.length} {isDa ? 'sessionstyper' : 'session types'}</p></div><button type="button" onClick={() => openBooking()} className="button-primary min-h-11 shrink-0 px-5 py-2.5">{isDa ? 'Book session' : 'Book session'}</button></div></div>}

      <BookingDrawer professional={professional} open={drawerOpen} onClose={() => setDrawerOpen(false)} locale={lang} initialSessionType={selectedSessionType} />
    </main>
  )
}
