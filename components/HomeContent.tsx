'use client'

import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { AccessHero } from '@/components/AccessHero'
import { LivingImpactLine } from '@/components/LivingImpactLine'
import { useLanguage } from '@/context/LanguageContext'
import { ACCESS_PATHS, BRAND_COPY, SESSION_CONCEPTS, localized } from '@/lib/brand'
import { CONTRIBUTION_MAX, CONTRIBUTION_MIN, SESSION_MINUTES } from '@/lib/platform'

export function HomeContent() {
  const { lang } = useLanguage()
  const isDa = lang === 'da'
  const brand = BRAND_COPY[lang]
  const pathColors = ['access-path-card--1', 'access-path-card--2', 'access-path-card--3', 'access-path-card--4'] as const
  const featuredSessionIds = ['inside-the-role', 'cv-reality-check', 'interview-ready', 'offer-review']
  const featuredSessions = SESSION_CONCEPTS.filter((session) => featuredSessionIds.includes(session.id))

  const accessExamples = isDa
    ? [
        ['Rollen', 'Har selv udført arbejdet', 'Kan forklare hverdagen, kravene og de kompromiser, jobopslaget ikke viser.'],
        ['Rekrutteringen', 'Har vurderet lignende kandidater', 'Kan se, hvad der styrker dit match, og hvad der reelt vil skabe tvivl.'],
        ['Karriereskiftet', 'Har gennemført en relevant overgang', 'Kan udfordre din plan med erfaring fra de barrierer og mellemtrin, skiftet kræver.'],
        ['Det afgørende øjeblik', 'Kender interviewet, casen eller forhandlingen', 'Kan træne den konkrete situation og give direkte feedback, mens den stadig kan bruges.'],
      ]
    : [
        ['The role', 'Has done the work', 'Can explain the day-to-day reality, expectations and trade-offs the job description leaves out.'],
        ['The hiring process', 'Has assessed similar candidates', 'Can see what strengthens your fit and what will genuinely create doubt.'],
        ['The career change', 'Has made a relevant transition', 'Can challenge your plan with experience of the barriers and intermediate moves involved.'],
        ['The decisive moment', 'Knows the interview, case or negotiation', 'Can rehearse the specific situation and give direct feedback while it still matters.'],
      ]

  const steps = isDa
    ? [
        ['Beskriv beslutningen', 'Fortæl kort, hvad du overvejer, og hvad du har brug for at få afklaret.'],
        ['Se hvorfor erfaringen er relevant', 'Vælg blandt professionelle, hvis erfaring matcher situationen - ikke blot branchen eller titlen.'],
        ['Brug timen på det væsentlige', 'Del relevant kontekst på forhånd, og afslut med en vurdering og prioriterede næste skridt.'],
      ]
    : [
        ['Describe the decision', 'Tell us what you are considering and what you need to clarify.'],
        ['See why the experience is relevant', 'Choose professionals whose experience fits the situation, not just the industry or title.'],
        ['Use the hour on what matters', 'Share relevant context beforehand and finish with an assessment and prioritized next steps.'],
      ]

  const faqs = isDa
    ? [
        ['Hvad kan en session bruges til?', 'Til ét konkret karrierespørgsmål: eksempelvis om du bør søge en rolle, hvordan dit CV bør målrettes, hvad du skal forvente i et interview, eller hvordan et jobtilbud bør vurderes.'],
        ['Hvem møder jeg?', 'En professionel med erfaring, der er relevant for din konkrete situation. Naetwork gennemgår rolle, virksomhedserfaring og LinkedIn før publicering. Det er kvalitetskontrol - ikke en garanti for et bestemt resultat.'],
        ['Hvad får jeg efter 60 minutter?', 'Målet aftales i briefet. Du skal som minimum stå med et klarere svar, de vigtigste risici eller huller og prioriterede næste skridt.'],
        ['Hvad koster det?', 'Den professionelle vælger én af fire faste priser: DKK 600, 900, 1.200 eller 1.800 inklusive moms. Den fulde pris vises før booking.'],
        ['Hvordan fungerer bidraget?', `Den professionelle vælger at afsætte ${CONTRIBUTION_MIN}%, 60%, 80% eller ${CONTRIBUTION_MAX}% af sessionsprisen eksklusive moms. Det præcise beløb vises før booking. Naetwork er et uafhængigt initiativ og ikke officielt tilknyttet Kræftens Bekæmpelse.`],
      ]
    : [
        ['What can a session be used for?', 'One concrete career question: whether to apply, how to target your CV, what to expect in an interview or how to assess an offer.'],
        ['Who will I meet?', 'A professional with experience relevant to your situation. Naetwork reviews role, company experience and LinkedIn before publication. This is quality control, not a guarantee of a particular result.'],
        ['What should I have after 60 minutes?', 'The intended outcome is set in the brief. At minimum, you should leave with a clearer answer, the main risks or gaps and prioritized next steps.'],
        ['What does it cost?', 'The professional selects one of four fixed prices: DKK 600, 900, 1,200 or 1,800 including VAT. The full price is shown before booking.'],
        ['How does the contribution work?', `The professional allocates ${CONTRIBUTION_MIN}%, 60%, 80% or ${CONTRIBUTION_MAX}% of the session price excluding VAT. The exact amount is shown before booking. Naetwork is independent and not officially affiliated with Kræftens Bekæmpelse.`],
      ]

  return (
    <main>
      <AccessHero />

      <section className="home-thesis">
        <div className="home-shell home-thesis__grid">
          <div>
            <p className="section-eyebrow">{isDa ? 'Hvorfor Career Access' : 'Why Career Access'}</p>
            <h2>{brand.problem}</h2>
          </div>
          <div className="home-thesis__answer">
            <p className="home-thesis__lead">
              {isDa
                ? 'Naetwork gør den viden tilgængelig i et klart format: én relevant person, ét konkret spørgsmål og 60 minutter med et aftalt resultat.'
                : 'Naetwork makes that knowledge accessible in a clear format: one relevant person, one concrete question and 60 minutes with an agreed outcome.'}
            </p>
            <div className="home-thesis__principles">
              <span>{isDa ? 'Situation før profil' : 'Situation before profile'}</span>
              <span>{isDa ? 'Relevans før senioritet' : 'Relevance before seniority'}</span>
              <span>{isDa ? 'Resultat før samtaletid' : 'Outcome before conversation time'}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-section--paper">
        <div className="home-shell">
          <div className="section-heading">
            <p className="section-eyebrow">{isDa ? 'Fire måder at begynde' : 'Four ways to begin'}</p>
            <h2>{isDa ? 'Start med det, du skal have afklaret.' : 'Start with what you need to clarify.'}</h2>
            <p>{isDa ? 'Du behøver ikke kende den rigtige session eller person på forhånd.' : 'You do not need to know the right session or person in advance.'}</p>
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
            <p className="section-eyebrow">{isDa ? 'Sådan vurderes relevans' : 'How relevance is assessed'}</p>
            <h2>{isDa ? 'Ikke den mest kendte profil. Den mest relevante erfaring.' : 'Not the most prominent profile. The most relevant experience.'}</h2>
            <p>{isDa ? 'Hvert match skal kunne forklares med erfaring, der er konkret nyttig i din situation.' : 'Every match should be explainable through experience that is concretely useful in your situation.'}</p>
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
          <Link href="/start" className="button-inverse home-inline-action">
            {isDa ? 'Beskriv din situation' : 'Describe your situation'}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="home-section home-section--white">
        <div className="home-shell">
          <div className="section-heading">
            <p className="section-eyebrow">{isDa ? 'Sessioner med et formål' : 'Sessions with a purpose'}</p>
            <h2>{isDa ? 'En time med et tydeligt resultat.' : 'One hour with a clear outcome.'}</h2>
            <p>{isDa ? 'Sessionstypen bestemmer forberedelsen og det, du skal stå tilbage med - ikke længden.' : 'The session type defines the preparation and outcome, not the duration.'}</p>
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

      <section id="how-it-works" className="home-section home-section--mist">
        <div className="home-shell">
          <div className="section-heading">
            <p className="section-eyebrow">{isDa ? 'Fra tvivl til næste skridt' : 'From uncertainty to a next step'}</p>
            <h2>{isDa ? 'Forberedt før. Fokuseret under. Konkret efter.' : 'Prepared before. Focused during. Concrete after.'}</h2>
          </div>
          <ol className="journey-steps">
            {steps.map(([title, body], index) => (
              <li key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
          <div className="trust-note">
            <ShieldCheck size={20} aria-hidden="true" />
            <p>{isDa ? 'Du opretter først en konto, når du vil sende en bookinganmodning. Du vælger selv, hvilken kontekst og hvilke dokumenter du deler.' : 'You only create an account when sending a booking request. You choose what context and documents to share.'}</p>
          </div>
        </div>
      </section>

      <section id="pricing" className="home-section home-section--ink">
        <div className="home-shell">
          <div className="section-heading section-heading--light">
            <p className="section-eyebrow">{isDa ? 'Pris og bidrag' : 'Price and contribution'}</p>
            <h2>{isDa ? 'Fire faste priser. Ét transparent regnestykke.' : 'Four fixed prices. One transparent calculation.'}</h2>
            <p>{isDa ? 'DKK 600, 900, 1.200 eller 1.800 inklusive moms. Den professionelle vælger også, om 40%, 60%, 80% eller 90% af prisen eksklusive moms afsættes.' : 'DKK 600, 900, 1,200 or 1,800 including VAT. The professional also chooses whether 40%, 60%, 80% or 90% of the price excluding VAT is allocated.'}</p>
          </div>
          <LivingImpactLine />
          <p className="pricing-disclosure">
            {isDa ? 'Bidrag gælder først efter en gennemført, betalt session. Betaling er endnu ikke aktiveret.' : 'Contributions apply only after a completed, paid session. Payments are not yet enabled.'}
          </p>
        </div>
      </section>

      <section className="home-section home-section--paper">
        <div className="home-shell faq-layout">
          <div className="section-heading">
            <p className="section-eyebrow">{isDa ? 'Før du booker' : 'Before you book'}</p>
            <h2>{isDa ? 'Det vigtigste, før du beslutter dig.' : 'What matters before you decide.'}</h2>
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
          <p className="section-eyebrow">{isDa ? 'Dit næste træk' : 'Your next move'}</p>
          <h2>{isDa ? 'Start med beslutningen foran dig.' : 'Start with the decision in front of you.'}</h2>
          <p>{isDa ? 'Beskriv situationen. Så viser Naetwork, hvilken erfaring der er relevant.' : 'Describe the situation. Naetwork will show which experience is relevant.'}</p>
          <Link href="/start" className="button-primary">
            {isDa ? 'Beskriv din situation' : 'Describe your situation'}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  )
}
