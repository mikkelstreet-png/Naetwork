'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AccessHero } from '@/components/AccessHero'
import { useLanguage } from '@/context/LanguageContext'
import { ACCESS_PATHS, SESSION_CONCEPTS, localized } from '@/lib/brand'
import { CONTRIBUTION_PERCENT, PLATFORM_SHARE_PERCENT, PRICE_OPTIONS, PROFESSIONAL_SHARE_PERCENT, SESSION_MINUTES, formatDkk } from '@/lib/platform'

export function HomeContent() {
  const { lang } = useLanguage()
  const isDa = lang === 'da'
  const pathColors = ['access-path-card--1', 'access-path-card--2', 'access-path-card--3', 'access-path-card--4'] as const
  const featuredSessionIds = ['inside-the-role', 'cv-reality-check', 'interview-ready', 'offer-review']
  const featuredSessions = SESSION_CONCEPTS.filter((session) => featuredSessionIds.includes(session.id))

  const accessExamples = isDa
    ? [
        ['Rollen', 'Har selv udført arbejdet', 'Kender hverdagen, kravene og kompromiserne.'],
        ['Rekruttering', 'Har vurderet lignende kandidater', 'Ved, hvad der styrker dit match, og hvad der skaber tvivl.'],
        ['Karriereskift', 'Har taget samme skridt', 'Kender barriererne, mellemtrinnene og det realistiske tempo.'],
      ]
    : [
        ['The role', 'Has done the work', 'Knows the work, expectations and trade-offs.'],
        ['Hiring', 'Has assessed similar candidates', 'Knows what strengthens your fit and what creates doubt.'],
        ['Career change', 'Has made the same move', 'Knows the barriers, intermediate steps and realistic pace.'],
      ]

  const faqs = isDa
    ? [
        ['Hvad kan en session bruges til?', 'Til ét konkret karrierespørgsmål: eksempelvis om du bør søge en rolle, hvordan dit CV bør målrettes, hvad du skal forvente i et interview, eller hvordan et jobtilbud bør vurderes.'],
        ['Hvem møder jeg?', 'En professionel med erfaring, der er relevant for din konkrete situation. Naetwork gennemgår rolle, virksomhedserfaring og LinkedIn før publicering. Det er kvalitetskontrol - ikke en garanti for et bestemt resultat.'],
        ['Hvad får jeg efter 60 minutter?', 'Målet aftales i briefet. Du skal som minimum stå med et klarere svar, de vigtigste risici eller huller og prioriterede næste skridt.'],
        ['Hvad koster det, og hvordan fordeles prisen?', `Prisen er DKK 600, 900, 1.200 eller 1.800 inklusive moms. Efter moms fordeles nettoprisen fast: ${PLATFORM_SHARE_PERCENT}% til Naetwork, ${CONTRIBUTION_PERCENT}% til Kræftens Bekæmpelse og ${PROFESSIONAL_SHARE_PERCENT}% til den professionelle. De præcise beløb vises før booking.`],
      ]
    : [
        ['What can a session be used for?', 'One concrete career question: whether to apply, how to target your CV, what to expect in an interview or how to assess an offer.'],
        ['Who will I meet?', 'A professional with experience relevant to your situation. Naetwork reviews role, company experience and LinkedIn before publication. This is quality control, not a guarantee of a particular result.'],
        ['What should I have after 60 minutes?', 'The intended outcome is set in the brief. At minimum, you should leave with a clearer answer, the main risks or gaps and prioritized next steps.'],
        ['What does it cost, and how is the price split?', `The price is DKK 600, 900, 1,200 or 1,800 including VAT. After VAT, the net price has a fixed split: ${PLATFORM_SHARE_PERCENT}% to Naetwork, ${CONTRIBUTION_PERCENT}% to Kræftens Bekæmpelse and ${PROFESSIONAL_SHARE_PERCENT}% to the professional. Exact amounts are shown before booking.`],
      ]

  return (
    <main>
      <AccessHero />

      <section className="home-section home-section--paper">
        <div className="home-shell">
          <div className="section-heading">
            <p className="section-eyebrow">{isDa ? 'Hvor står du?' : 'Where are you now?'}</p>
            <h2>{isDa ? 'Start med situationen. Ikke profilen.' : 'Start with the situation. Not the profile.'}</h2>
            <p>{isDa ? 'Vælg det, du skal forstå, forbedre eller beslutte.' : 'Choose what you need to understand, improve or decide.'}</p>
          </div>
          <div className="access-path-grid">
            {ACCESS_PATHS.map((path, index) => (
              <Link key={path.id} href={path.href} className={`access-path-card ${pathColors[index]}`}>
                <span className="access-path-card__index">0{index + 1}</span>
                <div>
                  <p>{localized(path.label, lang)}</p>
                  <h3>{localized(path.title, lang)}</h3>
                  <span>{localized(path.description, lang)}</span>
                </div>
                <ArrowRight size={19} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-section--ink">
        <div className="home-shell">
          <div className="section-heading section-heading--light">
            <p className="section-eyebrow">{isDa ? 'Sådan matcher vi' : 'How matching works'}</p>
            <h2>{isDa ? 'Den mest relevante erfaring. Ikke den højeste titel.' : 'The most relevant experience. Not the highest title.'}</h2>
            <p>{isDa ? 'Du kan se præcis, hvorfor hver professionel passer til din situation.' : 'You can see exactly why each professional fits your situation.'}</p>
          </div>
          <div className="experience-ledger">
            {accessExamples.map(([context, evidence, value], index) => (
              <article key={context}>
                <span>0{index + 1}</span>
                <p>{context}</p>
                <h3>{evidence}</h3>
                <div>{value}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-section--white">
        <div className="home-shell">
          <div className="section-heading">
            <p className="section-eyebrow">{SESSION_MINUTES} {isDa ? 'minutter' : 'minutes'}</p>
            <h2>{isDa ? 'Én session. Ét konkret resultat.' : 'One session. One concrete outcome.'}</h2>
            <p>{isDa ? 'Fokus aftales før mødet, så tiden bruges på vurdering, feedback eller træning.' : 'Set the focus before the meeting, then use the time for assessment, feedback or practice.'}</p>
          </div>
          <div className="session-index">
            {featuredSessions.map((session, index) => (
              <Link key={session.id} href={`/sessions#${session.id}`}>
                <span className="session-index__number">0{index + 1}</span>
                <div>
                  <h3>{localized(session.title, lang)}</h3>
                  <p>{localized(session.outcome, lang)}</p>
                </div>
                <span className="session-index__duration">{SESSION_MINUTES} min</span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            ))}
          </div>
          <Link href="/sessions" className="button-secondary home-inline-action">
            {isDa ? 'Se alle sessioner' : 'See all sessions'}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section id="pricing" className="home-section home-section--ink">
        <div className="home-shell">
          <div className="section-heading section-heading--light">
            <p className="section-eyebrow">{isDa ? 'Pris' : 'Price'}</p>
            <h2>{isDa ? 'Vælg pris. Fordelingen er fast.' : 'Choose the price. The split is fixed.'}</h2>
            <p>{isDa ? 'Fire prisniveauer. Samme 20/30/50-model.' : 'Four price points. The same 20/30/50 split.'}</p>
          </div>
          <div className="home-price-summary">
            <div>
              <span>{isDa ? 'Session' : 'Session'}</span>
              <strong>{SESSION_MINUTES} min.</strong>
            </div>
            <div>
              <span>{isDa ? 'Pris inkl. moms' : 'Price incl. VAT'}</span>
              <div className="home-price-options" aria-label={isDa ? 'Faste sessionspriser' : 'Fixed session prices'}>
                {PRICE_OPTIONS.map((price) => <strong key={price}>{formatDkk(price)}</strong>)}
              </div>
            </div>
            <div className="home-price-summary__impact">
              <span>{isDa ? 'Fast fordeling af nettopris' : 'Fixed split of net price'}</span>
              <strong>{PLATFORM_SHARE_PERCENT} · {CONTRIBUTION_PERCENT} · {PROFESSIONAL_SHARE_PERCENT}%</strong>
            </div>
          </div>
          <p className="pricing-disclosure">
            {isDa ? 'Ved DKK 600 inkl. moms er fordelingsgrundlaget DKK 480 ekskl. moms: DKK 96 til Naetwork, DKK 144 til Kræftens Bekæmpelse og DKK 240 til den professionelle. Betaling er endnu ikke aktiveret.' : 'At DKK 600 incl. VAT, the distribution basis is DKK 480 excl. VAT: DKK 96 to Naetwork, DKK 144 to Kræftens Bekæmpelse and DKK 240 to the professional. Payments are not yet enabled.'}
          </p>
          <Link href="/impact" className="access-hero__text-link home-price-link">
            {isDa ? 'Se hele regnestykket' : 'See the full calculation'}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="home-section home-section--paper">
        <div className="home-shell faq-layout">
          <div className="section-heading">
            <p className="section-eyebrow">{isDa ? 'Spørgsmål' : 'Questions'}</p>
            <h2>{isDa ? 'Før du booker.' : 'Before you book.'}</h2>
          </div>
          <div className="faq-list">
            {faqs.map(([question, answer], index) => (
              <details key={question}>
                <summary>
                  <span>0{index + 1}</span>
                  <strong>{question}</strong>
                  <i aria-hidden="true" />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="home-final">
        <div className="home-shell">
          <p className="section-eyebrow">{isDa ? 'Næste skridt' : 'Next step'}</p>
          <h2>{isDa ? 'Hvad skal være klarere?' : 'What needs to be clearer?'}</h2>
          <p>{isDa ? 'Beskriv situationen. Vi viser den mest relevante erfaring.' : 'Describe the situation. We will show the most relevant experience.'}</p>
          <Link href="/start" className="button-primary">
            {isDa ? 'Start med din situation' : 'Start with your situation'}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  )
}
