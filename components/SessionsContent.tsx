'use client'

import Link from 'next/link'
import { ArrowRight, Clock3 } from 'lucide-react'
import { PublicPageHero } from '@/components/PublicPageHero'
import { useLanguage } from '@/context/LanguageContext'
import { SESSION_CONCEPTS, accessPath, localized } from '@/lib/brand'
import { SESSION_MINUTES } from '@/lib/platform'

const USE_CASES = {
  'should-i-apply': { da: 'Du overvejer en konkret stilling og vil vide, om din profil er stærk nok.', en: 'You are considering a specific role and want to know whether your profile is strong enough.' },
  'inside-the-role': { da: 'Du vil forstå hverdagen, kravene og karrierevejen i en bestemt rolle.', en: 'You want to understand the day-to-day work, expectations and path in a specific role.' },
  'inside-the-company': { da: 'Du overvejer en virksomhed og mangler relevant kontekst før din beslutning.', en: 'You are considering a company and need relevant context before deciding.' },
  'cv-reality-check': { da: 'Du målretter dit CV mod en bestemt type rolle og ønsker direkte feedback.', en: 'You are targeting a specific type of role and want direct feedback on your CV.' },
  'interview-ready': { da: 'Du har en konkret jobsamtale og vil træne det sandsynlige format.', en: 'You have a specific interview and want to rehearse the likely format.' },
  'career-direction': { da: 'Du sammenligner flere realistiske retninger og har brug for at prioritere.', en: 'You are comparing realistic directions and need to prioritize.' },
  'career-pivot': { da: 'Du vil skifte branche eller funktion og har brug for en troværdig overgangsplan.', en: 'You want to change industry or function and need a credible transition plan.' },
  'offer-review': { da: 'Du har modtaget et tilbud og vil vurdere rolle, mandat, vilkår og risici.', en: 'You have received an offer and want to assess the role, mandate, terms and risks.' },
} as const

export function SessionsContent() {
  const { lang } = useLanguage()
  const isDa = lang === 'da'

  return (
    <main className="page-shell">
      <PublicPageHero
        eyebrow={isDa ? 'Sessioner' : 'Sessions'}
        title={isDa ? 'Vælg det, der skal være klarere bagefter.' : 'Choose what should be clearer afterwards.'}
        body={isDa
          ? `Alle sessioner varer ${SESSION_MINUTES} minutter. Situationen bestemmer forberedelsen, den relevante erfaring og det konkrete resultat.`
          : `Every session lasts ${SESSION_MINUTES} minutes. The situation defines the preparation, relevant experience and concrete outcome.`}
        action={{ href: '/start', label: isDa ? 'Find den relevante session' : 'Find the relevant session' }}
        sequence={isDa
          ? ['Konkret situation', 'Relevant professionel', 'Aftalt resultat']
          : ['Concrete situation', 'Relevant professional', 'Agreed outcome']}
      />

      <section className="public-section">
        <div className="home-shell">
          <div className="section-heading">
            <p className="section-eyebrow">{isDa ? 'Otte konkrete formål' : 'Eight concrete purposes'}</p>
            <h2>{isDa ? 'Ikke generel karrieresnak.' : 'Not a generic career conversation.'}</h2>
            <p>{isDa ? 'Hver session starter med en genkendelig situation og slutter med et defineret resultat.' : 'Every session starts with a recognizable situation and ends with a defined outcome.'}</p>
          </div>

          <div className="session-catalog">
            {SESSION_CONCEPTS.map((session, index) => {
              const path = accessPath(session.path)
              return (
                <article key={session.id} id={session.id}>
                  <div className="session-catalog__meta">
                    <span>0{index + 1}</span>
                    <p>{localized(path.label, lang)}</p>
                  </div>
                  <div className="session-catalog__main">
                    <h2>{localized(session.title, lang)}</h2>
                    <p>{USE_CASES[session.id][lang]}</p>
                  </div>
                  <div className="session-catalog__outcome">
                    <p>{isDa ? 'Du går derfra med' : 'You leave with'}</p>
                    <strong>{localized(session.outcome, lang)}</strong>
                  </div>
                  <div className="session-catalog__action">
                    <span><Clock3 size={14} aria-hidden="true" /> {SESSION_MINUTES} min</span>
                    <Link href={`/start?path=${session.path}`} aria-label={`${isDa ? 'Start' : 'Start'}: ${localized(session.title, lang)}`}>
                      {isDa ? 'Start' : 'Start'}
                      <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="public-cta">
        <div className="home-shell">
          <h2>{isDa ? 'Ikke sikker på, hvilken session der passer?' : 'Not sure which session fits?'}</h2>
          <p>{isDa ? 'Beskriv situationen med dine egne ord. Du behøver ikke vælge produktet på forhånd.' : 'Describe the situation in your own words. You do not need to choose the product in advance.'}</p>
          <Link href="/start" className="button-primary">
            {isDa ? 'Start med din situation' : 'Start with your situation'}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  )
}
