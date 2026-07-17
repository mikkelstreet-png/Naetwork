'use client'

import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { AccessHero } from '@/components/AccessHero'
import { Reveal } from '@/components/Reveal'
import { useLanguage } from '@/context/LanguageContext'
import { CATEGORIES } from '@/lib/categories'
import { CONTRIBUTION_PERCENT, PRICE_OPTIONS, SESSION_MINUTES, formatDkk } from '@/lib/platform'
import { sessionImpactAmount } from '@/lib/publicExperience'

const NEEDS = [
  {
    session: 'cv-review',
    title: { da: 'Styrk din profil på papir', en: 'Strengthen your profile on paper' },
    label: { da: 'CV, LinkedIn og ansøgning', en: 'CV, LinkedIn and application' },
    description: {
      da: 'Find det, der styrker eller svækker din positionering, og prioritér de ændringer, der kan gøre din profil mere relevant.',
      en: 'Identify what strengthens or weakens your positioning and prioritize the changes that can make your profile more relevant.',
    },
  },
  {
    session: 'interview-training',
    title: { da: 'Mød bedre forberedt', en: 'Show up better prepared' },
    label: { da: 'Interview', en: 'Interview' },
    description: {
      da: 'Test dine svar, din motivation og dine eksempler med en fagperson, der kender branchens forventninger.',
      en: 'Test your answers, motivation and examples with a professional who knows the industry’s expectations.',
    },
  },
  {
    session: 'case-interview-preparation',
    title: { da: 'Test dit faglige niveau', en: 'Test your professional level' },
    label: { da: 'Cases og technicals', en: 'Cases and technicals' },
    description: {
      da: 'Få modspil på din struktur, analyse og kommunikation, før det bliver vurderet i en rigtig proces.',
      en: 'Pressure-test your structure, analysis and communication before they are assessed in a real process.',
    },
  },
  {
    session: 'career-clarity',
    title: { da: 'Træf et bedre karrierevalg', en: 'Make a better career decision' },
    label: { da: 'Karrierevalg og positionering', en: 'Career decisions and positioning' },
    description: {
      da: 'Få et ærligt perspektiv på dit match, dine muligheder og den mest troværdige vej videre.',
      en: 'Get an honest perspective on your fit, options and the most credible way forward.',
    },
  },
] as const

export function HomeContent() {
  const { lang } = useLanguage()
  const isDa = lang === 'da'

  const values = isDa
    ? [
        ['Indsigt fra den rette erfaring', 'Vælg en fagperson med erfaring fra den rolle, branche eller proces, du står overfor.'],
        ['Feedback på din situation', 'Sessionen tager udgangspunkt i dit materiale, dit mål og din konkrete udfordring — ikke generelle karriereråd.'],
        ['Klarhed over næste skridt', 'Gå derfra med de vigtigste forbedringer i den rækkefølge, de bør løses.'],
      ]
    : [
        ['Insight from the right experience', 'Choose a professional with experience from the role, industry or process you are facing.'],
        ['Feedback on your situation', 'The session starts with your material, goal and concrete challenge — not generic career advice.'],
        ['Clarity on what comes next', 'Leave with the most important improvements in the order they should be addressed.'],
      ]

  const steps = isDa
    ? [
        ['Vælg det, du vil stå stærkere i', 'CV, interview, case, positionering eller karrierevalg.'],
        ['Find den rette fagperson', 'Vælg ud fra relevant rolle-, branche- og proceserfaring.'],
        ['Få feedback, du kan handle på', 'Brug 60 minutter på blinde vinkler, forbedringer og en konkret plan.'],
      ]
    : [
        ['Choose what you want to strengthen', 'CV, interview, case, positioning or career decision.'],
        ['Find the right professional', 'Choose based on relevant role, industry and process experience.'],
        ['Get feedback you can act on', 'Use 60 minutes on blind spots, improvements and a concrete plan.'],
      ]

  return (
    <main>
      <AccessHero />

      <section className="home-section home-section--white" id="needs">
        <div className="home-shell">
          <Reveal>
            <div className="section-heading section-heading--focused">
              <p className="section-eyebrow">{isDa ? 'Start med dit behov' : 'Start with your need'}</p>
              <h2>{isDa ? 'Hvad vil du stå stærkere i?' : 'What do you want to strengthen?'}</h2>
              <p>{isDa ? 'Vælg den situation, du vil teste. Derefter finder du den erfaring, der passer til den.' : 'Choose the situation you want to test. Then find the experience that fits it.'}</p>
            </div>
          </Reveal>

          <div className="need-grid">
            {NEEDS.map((need, index) => (
              <Reveal key={need.session} delay={index * 70}>
                <Link href={`/professionals?session=${need.session}`} className="need-card">
                  <span className="need-card__line" aria-hidden="true"><i /></span>
                  <span className="need-card__index">0{index + 1}</span>
                  <div>
                    <p>{need.title[lang]}</p>
                    <h3>{need.label[lang]}</h3>
                    <span>{need.description[lang]}</span>
                  </div>
                  <span className="need-card__action">
                    {isDa ? 'Find en fagperson med indsigt indefra' : 'Find a professional with inside insight'}
                    <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-section--ink">
        <div className="home-shell">
          <Reveal>
            <div className="section-heading section-heading--light section-heading--focused">
              <p className="section-eyebrow">{isDa ? 'Hvorfor Naetwork' : 'Why Naetwork'}</p>
              <h2>{isDa ? 'Forstå branchen, før branchen vurderer dig.' : 'Understand the industry before it evaluates you.'}</h2>
              <p>{isDa ? 'De fleste får først reel feedback, når processen allerede er slut. Naetwork giver dig mulighed for at teste din forberedelse med nogen, der kender forventningerne indefra.' : 'Most people only get real feedback once the process is over. Naetwork lets you test your preparation with someone who knows the expectations from within.'}</p>
            </div>
          </Reveal>

          <div className="value-grid">
            {values.map(([title, body], index) => (
              <Reveal key={title} delay={index * 80}>
                <article>
                  <span>0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-section--paper" id="how-it-works">
        <div className="home-shell">
          <Reveal>
            <div className="section-heading section-heading--focused">
              <p className="section-eyebrow">{isDa ? 'Sådan fungerer det' : 'How it works'}</p>
              <h2>{isDa ? 'Fra usikkerhed til en plan, du kan handle på.' : 'From uncertainty to a plan you can act on.'}</h2>
              <p>{isDa ? 'Tre enkle valg. Du opretter først en konto, når du vil sende en bookinganmodning.' : 'Three simple choices. You only create an account when you are ready to send a booking request.'}</p>
            </div>
          </Reveal>
          <ol className="journey-steps journey-steps--connected">
            {steps.map(([title, body], index) => (
              <li key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
          <p className="booking-disclosure">
            <Check size={15} aria-hidden="true" />
            {isDa ? 'Bookinganmodningen er først bekræftet, når fagpersonen har accepteret tidspunktet.' : 'The booking request is only confirmed when the professional has accepted the time.'}
          </p>
        </div>
      </section>

      <section className="home-section home-section--white" id="fields">
        <div className="home-shell">
          <Reveal>
            <div className="section-heading section-heading--focused">
              <p className="section-eyebrow">{isDa ? 'Fagområder' : 'Professional areas'}</p>
              <h2>{isDa ? 'Find erfaring fra den verden, du skal navigere i.' : 'Find experience from the world you need to navigate.'}</h2>
              <p>{isDa ? 'Fagområdet hjælper dig med at vælge den rette baggrund. Dit konkrete behov kommer først.' : 'The professional area helps you choose the right background. Your specific need comes first.'}</p>
            </div>
          </Reveal>
          <div className="category-ledger">
            {CATEGORIES.map((category) => (
              <Link key={category.id} href={`/professionals?field=${category.id}`}>
                <span className={`category-ledger__accent ${category.accent}`} aria-hidden="true" />
                <h3>{category.id}</h3>
                <p>{category.description[lang]}</p>
                <small>{category.areas.join(' · ')}</small>
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-section--ink" id="pricing">
        <div className="home-shell impact-section">
          <Reveal>
            <div className="section-heading section-heading--light section-heading--focused">
              <p className="section-eyebrow">{isDa ? 'Pris og bidrag' : 'Price and contribution'}</p>
              <h2>{isDa ? 'Én time. En tydelig pris. Et konkret bidrag.' : 'One hour. A clear price. A concrete contribution.'}</h2>
              <p>{isDa ? 'Alle sessioner varer 60 minutter. Prisen står på den enkelte profil, og 10% af hver gennemført og betalt session går til Kræftens Bekæmpelse.' : 'Every session lasts 60 minutes. The price is shown on each profile, and 10% of every completed and paid session goes to Kræftens Bekæmpelse.'}</p>
            </div>
          </Reveal>

          <div className="impact-examples" aria-label={isDa ? 'Eksempler på sessionsbidrag' : 'Session contribution examples'}>
            {PRICE_OPTIONS.map((price, index) => (
              <div key={price}>
                <span>0{index + 1}</span>
                <strong>{formatDkk(price)}</strong>
                <i aria-hidden="true" />
                <p>{formatDkk(sessionImpactAmount(price))}</p>
              </div>
            ))}
          </div>
          <p className="impact-examples__caption">
            {isDa ? `${CONTRIBUTION_PERCENT}% til Kræftens Bekæmpelse ved en gennemført og betalt session.` : `${CONTRIBUTION_PERCENT}% to Kræftens Bekæmpelse when a session is completed and paid.`}
          </p>
          <ul className="price-facts">
            <li><Check size={15} aria-hidden="true" />{SESSION_MINUTES} {isDa ? 'minutter pr. session' : 'minutes per session'}</li>
            <li><Check size={15} aria-hidden="true" />{isDa ? 'Prisen fremgår på profilen' : 'Price shown on each profile'}</li>
            <li><Check size={15} aria-hidden="true" />{isDa ? 'Betaling er fortsat deaktiveret' : 'Payments remain disabled'}</li>
          </ul>
        </div>
      </section>

      <section className="home-final home-final--premium">
        <div className="home-shell">
          <p className="section-eyebrow">{isDa ? 'Næste skridt' : 'Next step'}</p>
          <h2>{isDa ? 'Få indsigt fra nogen, der kender vejen indefra.' : 'Get insight from someone who knows the path from within.'}</h2>
          <div>
            <p>{isDa ? 'Find en fagperson med erfaring fra den rolle, branche eller proces, du står overfor.' : 'Find a professional with experience from the role, industry or process you are facing.'}</p>
            <div className="home-final__actions">
              <Link href="/professionals" className="button-primary button-with-arrow">
                {isDa ? 'Find den rette fagperson' : 'Find the right professional'}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href="/professional/signup" className="button-secondary">
                {isDa ? 'Del din erfaring på Naetwork' : 'Share your experience on Naetwork'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
