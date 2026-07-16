'use client'

import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { AccessHero } from '@/components/AccessHero'
import { RevenueSplit } from '@/components/RevenueSplit'
import { useLanguage } from '@/context/LanguageContext'
import { localized } from '@/lib/brand'
import { PRICE_OPTIONS, SESSION_MINUTES, formatDkk } from '@/lib/platform'
import { SESSION_TYPES } from '@/lib/sessionTypes'

export function HomeContent() {
  const { lang } = useLanguage()
  const isDa = lang === 'da'
  const proofPoints = isDa
    ? [
        ['Erfaring før titel', 'Se præcis hvilke roller, virksomheder og processer fagpersonen kender indefra.'],
        ['Et tydeligt resultat', 'Vælg sessionen efter det, du skal stå med bagefter—ikke efter en vag kategori.'],
        ['Forberedt på forhånd', 'Del mål og relevant materiale, så de 60 minutter bruges på det, der flytter dig.'],
      ]
    : [
        ['Experience before title', 'See exactly which roles, companies and processes the professional knows from the inside.'],
        ['A clear outcome', 'Choose the session by what you need afterwards—not a vague category.'],
        ['Prepared in advance', 'Share your goal and relevant material so the 60 minutes focus on what moves you forward.'],
      ]
  const journey = isDa
    ? [
        ['Vælg session', 'Start med det konkrete resultat: et skarpere CV, en bedre samtale eller et klarere valg.'],
        ['Vælg fagperson', 'Sammenlign relevant erfaring, sessionstyper, pris og næste ledige tid.'],
        ['Send dit brief', 'Vælg tidspunkt og fortæl, hvad du vil opnå. Fagpersonen bekræfter anmodningen.'],
      ]
    : [
        ['Choose a session', 'Start with the concrete outcome: a sharper CV, a better interview or a clearer decision.'],
        ['Choose a professional', 'Compare relevant experience, session types, price and next availability.'],
        ['Send your brief', 'Choose a time and describe your goal. The professional confirms the request.'],
      ]

  return (
    <main>
      <AccessHero />

      <section className="home-section home-section--white" id="session-types">
        <div className="home-shell">
          <div className="section-heading">
            <p className="section-eyebrow">{isDa ? 'Syv konkrete sessioner' : 'Seven concrete sessions'}</p>
            <h2>{isDa ? 'Vælg det, der skal være bedre om 60 minutter.' : 'Choose what should be better in 60 minutes.'}</h2>
            <p>{isDa ? 'Hver session har et klart formål, en enkel forberedelse og et konkret output.' : 'Every session has a clear purpose, simple preparation and a concrete output.'}</p>
          </div>

          <div className="product-session-grid">
            {SESSION_TYPES.map((session, index) => (
              <article key={session.id}>
                <div className="product-session-grid__topline">
                  <span>0{index + 1}</span>
                  <span>{SESSION_MINUTES} min</span>
                </div>
                <h3>{localized(session.title, lang)}</h3>
                <p>{localized(session.description, lang)}</p>
                <div className="product-session-grid__outcome">
                  <span>{isDa ? 'Du går derfra med' : 'You leave with'}</span>
                  <strong>{localized(session.outcome, lang)}</strong>
                </div>
                <Link href={`/start?session=${session.id}`}>
                  {isDa ? 'Vælg session' : 'Choose session'}
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-section--ink">
        <div className="home-shell">
          <div className="section-heading section-heading--light">
            <p className="section-eyebrow">{isDa ? 'Fagpersoner med relevant erfaring' : 'Professionals with relevant experience'}</p>
            <h2>{isDa ? 'Ikke bare nogen at tale med. Den rigtige at spørge.' : 'Not just someone to talk to. The right person to ask.'}</h2>
            <p>{isDa ? 'Profilerne gør relevansen synlig, før du booker.' : 'Profiles make relevance visible before you book.'}</p>
          </div>
          <div className="product-proof-grid">
            {proofPoints.map(([title, body], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
          <Link href="/professionals" className="button-inverse home-inline-action">
            {isDa ? 'Se fagpersoner' : 'Browse professionals'}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="home-section home-section--mist" id="how-it-works">
        <div className="home-shell">
          <div className="section-heading">
            <p className="section-eyebrow">{isDa ? 'Fra behov til booking' : 'From need to booking'}</p>
            <h2>{isDa ? 'Tre valg. Ingen unødig kompleksitet.' : 'Three choices. No unnecessary complexity.'}</h2>
            <p>{isDa ? 'Du opretter først en konto, når du vil sende en bookinganmodning.' : 'You only create an account when you want to send a booking request.'}</p>
          </div>
          <ol className="journey-steps">
            {journey.map(([title, body], index) => (
              <li key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
          <Link href="/start" className="button-primary home-inline-action">
            {isDa ? 'Start med en session' : 'Start with a session'}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="home-section home-section--paper" id="pricing">
        <div className="home-shell pricing-product-layout">
          <div>
            <p className="section-eyebrow">{isDa ? 'Transparent fra starten' : 'Transparent from the start'}</p>
            <h2>{isDa ? 'Én pris. Én fast fordeling.' : 'One price. One fixed split.'}</h2>
            <p>{isDa ? 'Du ser altid totalprisen inklusive moms og de præcise beløb, før du sender en booking.' : 'You always see the total price including VAT and the exact amounts before booking.'}</p>
            <div className="pricing-product-layout__prices" aria-label={isDa ? 'Faste sessionspriser' : 'Fixed session prices'}>
              {PRICE_OPTIONS.map((price) => <span key={price}>{formatDkk(price)}</span>)}
            </div>
            <ul>
              <li><Check size={15} aria-hidden="true" />{SESSION_MINUTES} {isDa ? 'minutter pr. session' : 'minutes per session'}</li>
              <li><Check size={15} aria-hidden="true" />{isDa ? 'Ingen skjulte platformstillæg' : 'No hidden platform surcharge'}</li>
              <li><Check size={15} aria-hidden="true" />{isDa ? 'Fordelingen gemmes med bookingen' : 'The split is saved with the booking'}</li>
            </ul>
          </div>
          <RevenueSplit price={PRICE_OPTIONS[0]} locale={lang} />
        </div>
      </section>

      <section className="home-section home-section--white">
        <div className="home-shell faq-layout">
          <div className="section-heading">
            <p className="section-eyebrow">{isDa ? 'Kort fortalt' : 'In short'}</p>
            <h2>{isDa ? 'Det vigtigste, før du vælger.' : 'What matters before you choose.'}</h2>
          </div>
          <div className="faq-list">
            {[
              [isDa ? 'Hvem er Naetwork til?' : 'Who is Naetwork for?', isDa ? 'Studerende og jobsøgende, der står med et konkret karrierespørgsmål og vil have perspektiv fra en fagperson med relevant erfaring.' : 'Students and jobseekers with a concrete career question who want perspective from a professional with relevant experience.'],
              [isDa ? 'Hvordan gennemgås fagpersonerne?' : 'How are professionals reviewed?', isDa ? 'Naetwork gennemgår indsendt rolle, virksomhedserfaring, LinkedIn og de sessionstyper, fagpersonen tilbyder, før en profil kan publiceres.' : 'Naetwork reviews submitted role, company experience, LinkedIn and offered session types before a profile can be published.'],
              [isDa ? 'Hvad får jeg efter sessionen?' : 'What do I get after the session?', isDa ? 'Det afhænger af sessionstypen, men målet og det ønskede output aftales i dit brief før mødet.' : 'It depends on the session type, but the goal and intended output are agreed in your brief before the meeting.'],
            ].map(([question, answer], index) => (
              <details key={question}>
                <summary><span>0{index + 1}</span><strong>{question}</strong><i aria-hidden="true" /></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="home-final">
        <div className="home-shell">
          <p className="section-eyebrow">{isDa ? 'Dit næste skridt' : 'Your next step'}</p>
          <h2>{isDa ? 'Hvad skal være klarere om 60 minutter?' : 'What should be clearer in 60 minutes?'}</h2>
          <p>{isDa ? 'Vælg en session. Find relevant erfaring. Send dit brief.' : 'Choose a session. Find relevant experience. Send your brief.'}</p>
          <Link href="/start" className="button-primary">
            {isDa ? 'Find din session' : 'Find your session'}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  )
}
