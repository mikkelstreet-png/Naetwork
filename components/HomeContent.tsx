'use client'

import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { AccessHero } from '@/components/AccessHero'
import { Reveal } from '@/components/Reveal'
import { SessionPlanPreview } from '@/components/SessionPlanPreview'
import { useLanguage } from '@/context/LanguageContext'
import { recordClientProductEvent } from '@/lib/clientProductAnalytics'
import { CATEGORIES, categoryAccent, categoryForAreas } from '@/lib/categories'
import { CONTRIBUTION_PERCENT, PRICE_OPTIONS, SESSION_MINUTES, formatDkk } from '@/lib/platform'
import { professionalBestFor, professionalInitials, professionalSessionTypes } from '@/lib/professionalPresentation'
import type { ProfessionalCard } from '@/lib/professionals'
import { sessionImpactAmount } from '@/lib/publicExperience'

const NEEDS = [
  {
    session: 'industry-company-insight',
    title: { da: 'Jeg vil forstå en branche eller rolle', en: 'I want to understand an industry or role' },
    description: { da: 'Se arbejdet, forventningerne og hverdagen fra den anden side af jobopslaget.', en: 'See the work, expectations and reality from the other side of the job post.' },
  },
  {
    session: 'career-clarity',
    title: { da: 'Jeg overvejer et karriereskifte', en: 'I am considering a career change' },
    description: { da: 'Test dit match og din plan med erfaring fra den retning, du overvejer.', en: 'Test your fit and plan against experience from the direction you are considering.' },
  },
  {
    session: 'cv-review',
    title: { da: 'Jeg vil styrke mit CV eller min ansøgning', en: 'I want to strengthen my CV or application' },
    description: { da: 'Forstå, hvad der bliver lagt mærke til, og hvilke ændringer der bør komme først.', en: 'Understand what gets noticed and which changes should come first.' },
  },
  {
    session: 'interview-training',
    title: { da: 'Jeg skal forberede en jobsamtale', en: 'I need to prepare for an interview' },
    description: { da: 'Træn svar, motivation og eksempler med en person, der kender processen.', en: 'Practice answers, motivation and examples with someone who knows the process.' },
  },
  {
    session: 'case-interview-preparation',
    title: { da: 'Jeg skal træne en case', en: 'I need to practice a case' },
    description: { da: 'Få direkte modspil på struktur, analyse, technicals og kommunikation.', en: 'Get direct challenge on structure, analysis, technicals and communication.' },
  },
  {
    session: 'graduate-internship',
    title: { da: 'Jeg vil forstå, hvad der faktisk kræves for at komme ind', en: 'I want to understand what it actually takes to get in' },
    description: { da: 'Få kontekst om timing, positionering og en realistisk vej ind.', en: 'Get context on timing, positioning and a realistic way in.' },
  },
  {
    session: 'career-clarity',
    title: { da: 'Jeg har brug for et kvalificeret perspektiv på mit næste skridt', en: 'I need an informed perspective on my next move' },
    description: { da: 'Prøv dine antagelser af, før du binder tid og energi til beslutningen.', en: 'Test your assumptions before committing time and energy to the decision.' },
  },
] as const

const SESSION_FLOW = [
  {
    label: { da: 'Før sessionen', en: 'Before the session' },
    title: { da: 'Definér resultatet', en: 'Define the outcome' },
    body: { da: 'Beskriv, hvad du vil opnå, og del den nødvendige kontekst eller relevante materialer.', en: 'Describe what you want to achieve and share the necessary context or relevant material.' },
  },
  {
    label: { da: 'Under sessionen', en: 'During the session' },
    title: { da: 'Arbejd på det konkrete', en: 'Work on the concrete issue' },
    body: { da: 'Brug tiden målrettet med en professionel, der har direkte erfaring fra situationen, du står overfor.', en: 'Use the time with a professional who has direct experience from the situation you are facing.' },
  },
  {
    label: { da: 'Efter sessionen', en: 'After the session' },
    title: { da: 'Gå videre med retning', en: 'Move forward with direction' },
    body: { da: 'Stå med skarpere svar, konkrete forbedringer og et tydeligt næste skridt.', en: 'Leave with sharper answers, concrete improvements and a clear next step.' },
  },
] as const

interface HomeContentProps {
  featuredProfessionals?: ProfessionalCard[]
}

function professionalAccent(professional: ProfessionalCard) {
  return categoryAccent(categoryForAreas(professional.industries)?.id)
}

export function HomeContent({ featuredProfessionals = [] }: HomeContentProps) {
  const { lang } = useLanguage()
  const isDa = lang === 'da'

  const trustQuestions = isDa
    ? [
        ['Er Naetwork coaching eller mentoring?', 'Nej. Naetwork giver adgang til direkte relevant professionel erfaring omkring ét konkret mål. Den professionelle skal ikke være din coach eller langsigtede mentor.'],
        ['Hvordan vælger jeg den rette erfaring?', 'Start med den situation, du står overfor. Vælg derefter en professionel ud fra rolle-, branche- og proceserfaring – ikke prestige alene.'],
        ['Hvad skal jeg forvente efter 60 minutter?', 'Et skarpere beslutningsgrundlag, konkrete forbedringer og tydelige næste handlinger. Naetwork lover ikke et job eller et bestemt resultat.'],
        ['Hvornår er bookingen bekræftet?', 'Din bookinganmodning er først bekræftet, når den professionelle har accepteret tidspunktet. Betaling er fortsat deaktiveret.'],
      ]
    : [
        ['Is Naetwork coaching or mentoring?', 'No. Naetwork gives access to directly relevant professional experience around one concrete goal. The professional is not positioned as your coach or long-term mentor.'],
        ['How do I choose the right experience?', 'Start with the situation you are facing. Then choose a professional based on role, industry and process experience, not prestige alone.'],
        ['What should I expect after 60 minutes?', 'A sharper basis for decisions, concrete improvements and clear next actions. Naetwork does not promise a job or a specific result.'],
        ['When is the booking confirmed?', 'Your booking request is only confirmed when the professional accepts the time. Payments remain disabled.'],
      ]

  return (
    <main>
      <AccessHero />

      <section className="home-section home-section--white" id="why-access">
        <div className="home-shell access-problem-grid">
          <Reveal>
            <div>
              <p className="section-eyebrow">{isDa ? 'Det skjulte adgangsgab' : 'The hidden access gap'}</p>
              <h2>{isDa ? 'De vigtigste karrieresvar står ikke i jobopslaget.' : 'The most important career answers are not in the job post.'}</h2>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="access-problem__body">
              <p>{isDa ? 'Et jobopslag fortæller dig, hvad virksomheden søger. Det fortæller dig sjældent, hvordan arbejdet reelt er, hvad der faktisk bliver lagt mærke til, hvilke fejl du skal undgå, eller hvad det kræver at lykkes.' : 'A job post tells you what a company is looking for. It rarely tells you what the work is really like, what gets noticed, which mistakes to avoid or what it takes to succeed.'}</p>
              <p>{isDa ? 'De svar findes hos mennesker, der allerede har stået der. Naetwork gør det muligt at spørge dem.' : 'Those answers live with people who have already been there. Naetwork makes it possible to ask them.'}</p>
            </div>
          </Reveal>
          <Reveal delay={140} className="access-contrast">
            <p>{isDa ? 'Information er overalt.' : 'Information is everywhere.'}</p>
            <strong>{isDa ? 'Relevant erfaring er stadig svær at få adgang til.' : 'Relevant experience is still hard to access.'}</strong>
          </Reveal>
        </div>
      </section>

      <section className="home-section home-section--ink access-category">
        <div className="home-shell">
          <Reveal>
            <div className="access-category__intro">
              <p className="section-eyebrow">{isDa ? 'Den professionelle adgangsplatform' : 'The professional access platform'}</p>
              <h2>{isDa ? 'Relevant professionel erfaring. Gjort tilgængelig.' : 'Relevant professional experience. Made accessible.'}</h2>
              <p>{isDa ? 'Naetwork demokratiserer ikke mere information. Platformen åbner den dømmekraft, kontekst og levede erfaring, som normalt kræver en personlig introduktion.' : 'Naetwork does not democratize more information. It opens the judgment, context and lived experience that normally requires a personal introduction.'}</p>
            </div>
          </Reveal>

          <Reveal delay={100} className="access-manifest">
            <span aria-hidden="true" />
            <p>{isDa ? 'Potentiale er overalt. Adgang er det ikke.' : 'Potential is everywhere. Access is not.'}</p>
            <div>{isDa ? 'Karrieremuligheder bør ikke afhænge af, om du tilfældigvis kender den rigtige person. Naetwork åbner den professionelle erfaring, der tidligere lå gemt i private netværk.' : 'Career opportunity should not depend on whether you happen to know the right person. Naetwork opens professional experience that used to remain inside private networks.'}</div>
          </Reveal>
        </div>
      </section>

      <section className="home-section home-section--white" id="needs">
        <div className="home-shell">
          <Reveal>
            <div className="section-heading section-heading--focused">
              <p className="section-eyebrow">{isDa ? 'Start med situationen' : 'Start with the situation'}</p>
              <h2>{isDa ? 'Hvad står du overfor?' : 'What are you facing?'}</h2>
              <p>{isDa ? 'Vælg det problem, du vil løse. Derefter finder du den professionelle erfaring, der matcher situationen.' : 'Choose the problem you want to solve. Then find the professional experience that matches the situation.'}</p>
            </div>
          </Reveal>

          <div className="access-need-list">
            {NEEDS.map((need, index) => (
              <Reveal key={`${need.session}-${index}`} delay={(index % 4) * 55}>
                <Link href={`/professionals?session=${need.session}`}>
                  <span>0{index + 1}</span>
                  <div><h3>{need.title[lang]}</h3><p>{need.description[lang]}</p></div>
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal className="access-fields">
            <div><p className="section-eyebrow">{isDa ? 'Find den rette kontekst' : 'Find the right context'}</p><strong>{isDa ? 'Fagområdet hjælper dig med at finde erfaring fra den verden, du skal navigere i.' : 'The professional area helps you find experience from the world you need to navigate.'}</strong></div>
            <nav aria-label={isDa ? 'Fagområder' : 'Professional areas'}>
              {CATEGORIES.map((category) => (
                <Link key={category.id} href={`/professionals?field=${category.id}`}>
                  <i className={category.accent} aria-hidden="true" />{category.id}<ArrowRight size={14} aria-hidden="true" />
                </Link>
              ))}
            </nav>
          </Reveal>
        </div>
      </section>

      <section className="home-section home-section--ink" id="how-it-works">
        <div className="home-shell">
          <Reveal>
            <div className="section-heading section-heading--light section-heading--focused">
              <p className="section-eyebrow">{isDa ? 'Et struktureret produkt' : 'A structured product'}</p>
              <h2>{isDa ? '60 minutter. Ét konkret mål. Et stærkere næste skridt.' : '60 minutes. One concrete goal. A stronger next step.'}</h2>
              <p>{isDa ? 'Sessionen er ikke en løs samtale eller et kaffemøde. Den er et fokuseret forløb før, under og efter de 60 minutter.' : 'The session is not an open-ended conversation or coffee chat. It is a focused journey before, during and after the 60 minutes.'}</p>
            </div>
          </Reveal>
          <div className="session-product" role="list">
            {SESSION_FLOW.map((step, index) => (
              <Reveal key={step.label.da} delay={index * 80}>
                <article role="listitem">
                  <div><span>0{index + 1}</span><small>{step.label[lang]}</small></div>
                  <h3>{step.title[lang]}</h3>
                  <p>{step.body[lang]}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="booking-disclosure booking-disclosure--dark"><Check size={15} aria-hidden="true" />{isDa ? 'Bookinganmodningen er først bekræftet, når den professionelle har accepteret tidspunktet.' : 'The booking request is only confirmed when the professional has accepted the time.'}</p>
          <Reveal delay={120} className="mt-12">
            <SessionPlanPreview locale={lang} tone="dark" headingLevel="h3" trackingSurface="home" />
          </Reveal>
        </div>
      </section>

      <section className="home-section home-section--white access-professionals">
        <div className="home-shell">
          <Reveal>
            <div className="section-heading section-heading--focused">
              <p className="section-eyebrow">{isDa ? 'De professionelle' : 'The professionals'}</p>
              <h2>{isDa ? 'Ikke generiske råd. Erfaring fra nogen, der har stået der selv.' : 'Not generic advice. Experience from someone who has been there.'}</h2>
              <p>{isDa ? 'Den rette professionelle er ikke nødvendigvis den mest kendte. Det er den person, hvis erfaring matcher din rolle, branche eller proces mest præcist.' : 'The right professional is not necessarily the most famous. It is the person whose experience most precisely matches your role, industry or process.'}</p>
            </div>
          </Reveal>

          <div className="professional-proof-points">
            {[isDa ? 'Direkte relevant erfaring' : 'Directly relevant experience', isDa ? 'Indsigt i virkeligheden bag rollen' : 'Insight into the reality behind the role', isDa ? 'Konkrete og ærlige perspektiver' : 'Concrete and honest perspectives'].map((item) => <p key={item}><Check size={15} aria-hidden="true" />{item}</p>)}
          </div>

          {featuredProfessionals.length >= 3 && (
            <div className="featured-professionals">
              {featuredProfessionals.slice(0, 3).map((professional) => {
                const sessions = professionalSessionTypes(professional).slice(0, 2)
                return (
                  <article key={professional.id} className="access-professional-card">
                    <span className={`access-professional-card__accent ${professionalAccent(professional)}`} aria-hidden="true" />
                    <div className="access-professional-card__identity">
                      <span className={`profile-card__initials ${professionalAccent(professional)}`}>{professionalInitials(professional.name)}</span>
                      <div><h3>{professional.name}</h3><p>{professional.title}{professional.company ? ` · ${professional.company}` : ''}</p></div>
                    </div>
                    <div className="access-professional-card__fit"><span>{isDa ? 'Relevant erfaring til' : 'Relevant experience for'}</span><strong>{professionalBestFor(professional, isDa)}</strong></div>
                    <div className="access-professional-card__tags">{sessions.map((session) => <span key={session.id}>{session.title[lang]}</span>)}</div>
                    <div className="access-professional-card__footer">
                      <p><strong>{formatDkk(professional.price)}</strong> · {SESSION_MINUTES} min<br /><span>{formatDkk(sessionImpactAmount(professional.price))} {isDa ? 'til Kræftens Bekæmpelse' : 'to Kræftens Bekæmpelse'}</span></p>
                      <Link href={`/professionals/${professional.id}`}>{isDa ? 'Se erfaring' : 'View experience'}<ArrowRight size={15} aria-hidden="true" /></Link>
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          <Link
            href="/professionals"
            className="button-secondary button-with-arrow access-professionals__cta"
            onClick={() => recordClientProductEvent({
              eventName: 'session_plan_booking_clicked',
              surface: 'home',
            })}
          >
            {isDa ? 'Find den erfaring, du mangler' : 'Find the experience you need'}<ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="home-section home-section--paper">
        <div className="home-shell access-impact">
          <Reveal>
            <div>
              <p className="section-eyebrow">{isDa ? 'Fremskridt, der rækker videre' : 'Progress that reaches further'}</p>
              <h2>{isDa ? 'Dit næste skridt kan også gøre en forskel.' : 'Your next step can also make a difference.'}</h2>
              <p>{isDa ? `${CONTRIBUTION_PERCENT} % af nettoprisen for hver gennemført og betalt session går til Kræftens Bekæmpelse. Den sociale dimension er en del af modellen – uden at overskygge den professionelle værdi.` : `${CONTRIBUTION_PERCENT}% of the net price for every completed and paid session goes to Kræftens Bekæmpelse. The social dimension is part of the model without overshadowing the professional value.`}</p>
            </div>
          </Reveal>
          <Reveal delay={90} className="access-impact__examples">
            {PRICE_OPTIONS.map((price) => <p key={price}><span>{formatDkk(price)}</span><i aria-hidden="true" /><strong>{formatDkk(sessionImpactAmount(price))}</strong></p>)}
            <small>{isDa ? 'Sessionspris inkl. moms → bidrag (10 % af nettoprisen)' : 'Session price incl. VAT → contribution (10% of net price)'}</small>
          </Reveal>
        </div>
      </section>

      <section className="home-section home-section--white access-trust">
        <div className="home-shell trust-layout">
          <Reveal>
            <div>
              <p className="section-eyebrow">{isDa ? 'Tillid før booking' : 'Trust before booking'}</p>
              <h2>{isDa ? 'Relevant erfaring. Klare forventninger.' : 'Relevant experience. Clear expectations.'}</h2>
              <p>{isDa ? 'Du kan se hele profilen, prisen, sessionstyperne og det konkrete bidrag, før du sender en bookinganmodning.' : 'You can see the full profile, price, session types and exact contribution before sending a booking request.'}</p>
            </div>
          </Reveal>
          <div className="access-faq">
            {trustQuestions.map(([question, answer], index) => (
              <Reveal key={question} delay={index * 45}>
                <details>
                  <summary><span>0{index + 1}</span>{question}<i aria-hidden="true">+</i></summary>
                  <p>{answer}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="home-final home-final--premium access-final">
        <div className="home-shell">
          <p className="section-eyebrow">{isDa ? 'Næste skridt' : 'Next step'}</p>
          <h2>{isDa ? 'Dit næste skridt behøver ikke begynde med et gæt.' : 'Your next move does not have to start with a guess.'}</h2>
          <div>
            <p>{isDa ? 'Find en professionel med den erfaring, du mangler, og brug 60 minutter på at stå stærkere bagefter.' : 'Find a professional with the experience you need and use 60 minutes to move forward stronger.'}</p>
            <div className="home-final__actions">
              <Link href="/professionals" className="button-primary button-with-arrow">{isDa ? 'Find den erfaring, du mangler' : 'Find the experience you need'}<ArrowRight size={16} aria-hidden="true" /></Link>
              <Link href="/professional/signup" className="button-secondary">{isDa ? 'Gør din erfaring tilgængelig' : 'Make your experience available'}</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
