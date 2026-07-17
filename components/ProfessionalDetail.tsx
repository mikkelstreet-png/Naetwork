'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, CheckCircle2, RefreshCw } from 'lucide-react'
import BookingDrawer from '@/components/BookingDrawer'
import { ImpactMarker } from '@/components/ImpactMarker'
import { useLanguage } from '@/context/LanguageContext'
import { createClient } from '@/lib/supabase/client'
import { categoryAccent, categoryForAreas } from '@/lib/categories'
import { formatDkk, SESSION_MINUTES } from '@/lib/platform'
import { mapPublicProfessionals, type ProfessionalCard } from '@/lib/professionals'
import { professionalInitials, professionalSessionTypes } from '@/lib/professionalPresentation'
import { sessionImpactAmount } from '@/lib/publicExperience'
import type { SessionTypeId } from '@/lib/sessionTypes'

function accentFor(professional: ProfessionalCard) {
  return categoryAccent(categoryForAreas(professional.industries)?.id)
}

const RELEVANCE_COPY: Record<SessionTypeId, { da: string; en: string }> = {
  'cv-review': { da: 'Se din profil, som branchen ser den', en: 'See your profile as the industry sees it' },
  'application-feedback': { da: 'Målrette en ansøgning til en bestemt rolle', en: 'Target an application to a specific role' },
  'interview-training': { da: 'Forberede et vigtigt interview', en: 'Prepare for an important interview' },
  'case-interview-preparation': { da: 'Teste en case eller technicals', en: 'Test a case or technicals' },
  'career-clarity': { da: 'Vurdere et konkret karriereskift', en: 'Assess a specific career move' },
  'graduate-internship': { da: 'Søge graduate-program eller internship', en: 'Target a graduate program or internship' },
  'industry-company-insight': { da: 'Forstå en rolle, virksomhed eller branche indefra', en: 'Understand a role, company or industry from within' },
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
    <main aria-busy="true" className="profile-loading-state">
      <div><span /><p>{isDa ? 'Henter den professionelle erfaring…' : 'Loading the professional experience…'}</p></div>
    </main>
  )

  if (loadError) return (
    <main className="directory-state profile-error-state">
      <div>
        <p className="section-eyebrow">{isDa ? 'Profilservice' : 'Profile service'}</p>
        <h1>{isDa ? 'Profilen kunne ikke indlæses' : 'The profile could not be loaded'}</h1>
        <p>{isDa ? 'Profilservicen svarer ikke lige nu. Prøv igen om et øjeblik.' : 'The profile service is not responding right now. Please try again shortly.'}</p>
        <div className="directory-state__actions">
          <button type="button" onClick={() => void fetchProfessional()} className="button-primary"><RefreshCw size={16} aria-hidden="true" />{isDa ? 'Prøv igen' : 'Try again'}</button>
          <Link href="/professionals" className="button-secondary">{isDa ? 'Find anden erfaring' : 'Find other experience'}</Link>
        </div>
      </div>
    </main>
  )

  if (!professional) return (
    <main className="directory-state profile-error-state">
      <div><h1>{isDa ? 'Erfaringen findes ikke' : 'Experience not found'}</h1><Link href="/professionals" className="button-primary">{isDa ? 'Find anden erfaring' : 'Find other experience'}</Link></div>
    </main>
  )

  const supportedSessions = professionalSessionTypes(professional)
  const nextAvailable = professional.nextAvailableAt
    ? new Date(professional.nextAvailableAt).toLocaleString(isDa ? 'da-DK' : 'en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Copenhagen' })
    : isDa ? 'Ingen åbne tider' : 'No open times'
  const relevance = supportedSessions.slice(0, 5).map((session) => RELEVANCE_COPY[session.id][lang])
  const outcomes = Array.from(new Set(supportedSessions.flatMap((session) => session.deliverables[lang]))).slice(0, 5)
  const category = categoryForAreas(professional.industries)?.id

  return (
    <main className="professional-page">
      <section className="professional-hero">
        <div className="home-shell">
          <Link href="/professionals" className="professional-back"><span aria-hidden="true">←</span>{isDa ? 'Find anden erfaring' : 'Find other experience'}</Link>
          <div className="professional-hero__grid">
            <div className="professional-hero__identity">
              <div className="professional-hero__meta">
                <span className={`professional-hero__category-dot ${accentFor(professional)}`} aria-hidden="true" />
                <span>{category ?? (isDa ? 'Professionel' : 'Professional')}</span>
                <span><CheckCircle2 size={13} aria-hidden="true" />{isDa ? 'Profil gennemgået' : 'Profile reviewed'}</span>
              </div>
              <div className={`professional-hero__initials ${accentFor(professional)}`}>{professionalInitials(professional.name)}</div>
              <h1>{professional.name}</h1>
              <p className="professional-hero__role">{professional.title}{professional.company ? ` · ${professional.company}` : ''}</p>
              <p className="professional-hero__areas">{professional.industries.join(' · ')}</p>
              <p className="professional-hero__promise">
                {isDa ? 'Få adgang til direkte relevant erfaring fra en person, der kender denne del af branchen indefra.' : 'Access directly relevant experience from someone who knows this part of the industry from within.'}
              </p>
            </div>

            <aside className="professional-booking-card">
              <p className="section-eyebrow">{isDa ? 'Session med' : 'Session with'} {professional.name.split(' ')[0]}</p>
              <div className="professional-booking-card__price">
                <strong>{formatDkk(professional.price)}</strong>
                <span>{SESSION_MINUTES} {isDa ? 'minutter · inkl. moms' : 'minutes · incl. VAT'}</span>
              </div>
              <ImpactMarker price={professional.price} locale={lang} tone="dark" compact />
              <dl>
                <div><dt>{isDa ? 'Næste ledige tid' : 'Next available time'}</dt><dd>{nextAvailable}</dd></div>
                <div><dt>{isDa ? 'Bekræftelse' : 'Confirmation'}</dt><dd>{isDa ? 'Når fagpersonen accepterer' : 'When the professional accepts'}</dd></div>
              </dl>
              <button type="button" onClick={() => openBooking()} className="button-inverse button-with-arrow">
                {isDa ? 'Book sessionen' : 'Book the session'}<ArrowRight size={16} aria-hidden="true" />
              </button>
              <p>{isDa ? 'Betaling er ikke aktiveret. Der trækkes ikke noget ved bookinganmodningen.' : 'Payments are not enabled. Nothing is charged when you send the booking request.'}</p>
            </aside>
          </div>
        </div>
      </section>

      <section className="home-section home-section--white">
        <div className="home-shell profile-relevance-grid">
          <div>
            <p className="section-eyebrow">{isDa ? 'Relevant når du skal' : 'Relevant when you need to'}</p>
            <h2>{isDa ? 'Brug erfaringen, når den matcher situationen.' : 'Use the experience when it matches the situation.'}</h2>
            <ul>
              {relevance.map((item) => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}
            </ul>
          </div>
          <div>
            <p className="section-eyebrow">{isDa ? 'Du kan gå derfra med' : 'You can leave with'}</p>
            <h2>{isDa ? 'Omsæt adgangen til et konkret næste skridt.' : 'Turn access into a concrete next step.'}</h2>
            <ul>
              {outcomes.map((item) => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="home-section home-section--paper">
        <div className="home-shell profile-experience">
          <div>
            <p className="section-eyebrow">{isDa ? 'Erfaringen bag feedbacken' : 'The experience behind the feedback'}</p>
            <h2>{isDa ? 'Erfaring fra den verden, du forsøger at komme ind i eller videre i.' : 'Experience from the world you are trying to enter or progress in.'}</h2>
          </div>
          <div>
            <p className="profile-experience__role">{professional.title}{professional.company ? ` · ${professional.company}` : ''}</p>
            <p className="profile-experience__bio">{professional.bio}</p>
            <div className="profile-experience__areas">
              {professional.industries.map((area) => <span key={area}>{area}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-section--white">
        <div className="home-shell">
          <div className="section-heading section-heading--focused">
            <p className="section-eyebrow">{isDa ? 'Det kan du få hjælp til' : 'What you can get help with'}</p>
            <h2>{isDa ? 'Vælg, hvad erfaringen skal bruges til.' : 'Choose what the experience should be used for.'}</h2>
            <p>{isDa ? 'Hver session tager udgangspunkt i din konkrete situation, dit materiale og dit ønskede resultat.' : 'Every session starts with your situation, material and intended outcome.'}</p>
          </div>
          <div className="profile-session-grid">
            {supportedSessions.map((session, index) => (
              <article key={session.id}>
                <div className="profile-session-grid__top"><span>0{index + 1}</span><span>{SESSION_MINUTES} min</span></div>
                <h3>{session.title[lang]}</h3>
                <p>{session.description[lang]}</p>
                <div><span>{isDa ? 'Forventet resultat' : 'Expected result'}</span><strong>{session.outcome[lang]}</strong></div>
                <button type="button" onClick={() => openBooking(session.id)}>
                  {isDa ? 'Vælg denne session' : 'Choose this session'}<ArrowRight size={15} aria-hidden="true" />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {!drawerOpen && (
        <div className="professional-mobile-booking">
          <div>
            <strong>{formatDkk(professional.price)} · {SESSION_MINUTES} min</strong>
            <span>{formatDkk(sessionImpactAmount(professional.price))} {isDa ? 'til Kræftens Bekæmpelse' : 'to Kræftens Bekæmpelse'}</span>
          </div>
          <button type="button" onClick={() => openBooking()} className="button-primary">{isDa ? 'Book sessionen' : 'Book session'}</button>
        </div>
      )}

      <BookingDrawer professional={professional} open={drawerOpen} onClose={() => setDrawerOpen(false)} locale={lang} initialSessionType={selectedSessionType} />
    </main>
  )
}
