'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { LivingImpactLine } from '@/components/LivingImpactLine'
import { PublicPageHero } from '@/components/PublicPageHero'
import { useLanguage } from '@/context/LanguageContext'
import { CONTRIBUTION_MAX, CONTRIBUTION_MIN, PLATFORM_FEE_DKK } from '@/lib/platform'

export function ImpactContent() {
  const { lang } = useLanguage()
  const isDa = lang === 'da'

  const values = isDa
    ? [
        ['Kandidaten', 'Får relevant erfaring og et bedre grundlag for den konkrete karrierebeslutning.'],
        ['Den professionelle', 'Gør sin erfaring tilgængelig i et afgrænset format med tydelige forventninger.'],
        ['Kræftens Bekæmpelse', 'Modtager det beløb, der er afsat fra gennemførte og betalte sessioner, når betalingsmodellen aktiveres.'],
      ]
    : [
        ['The candidate', 'Gets relevant experience and a better basis for the specific career decision.'],
        ['The professional', 'Makes experience accessible in a focused format with clear expectations.'],
        ['Kræftens Bekæmpelse', 'Receives the amount allocated from completed, paid sessions once the payment model is activated.'],
      ]

  const clarity = isDa
    ? [
        ['Grundlaget', 'Procenten beregnes af sessionsprisen eksklusive moms. Kandidatens samlede pris inklusive moms ændres ikke.'],
        ['Tidspunktet', 'Kun en gennemført og betalt session udløser et bidrag. Aflyste, refunderede eller ikke-betalte sessioner tæller ikke.'],
        ['Dokumentationen', 'Det konkrete beløb skal fremgå før booking og efter gennemførelse. Offentlige impacttal må kun bygge på dokumenterede betalinger.'],
        ['Relationen', 'Naetwork er et uafhængigt initiativ og ikke officielt tilknyttet Kræftens Bekæmpelse, medmindre andet fremgår eksplicit.'],
      ]
    : [
        ['The basis', 'The percentage is calculated from the session price excluding VAT. The candidate total including VAT does not change.'],
        ['The timing', 'Only a completed and paid session triggers a contribution. Cancelled, refunded or unpaid sessions do not count.'],
        ['The documentation', 'The exact amount must be shown before booking and after completion. Public impact figures must rely on documented payments.'],
        ['The relationship', 'Naetwork is independent and not officially affiliated with Kræftens Bekæmpelse unless explicitly stated otherwise.'],
      ]

  return (
    <main className="page-shell">
      <PublicPageHero
        eyebrow={isDa ? 'Pris og bidrag' : 'Price and contribution'}
        title={isDa ? 'Karrieresparring, der også skaber et konkret bidrag.' : 'Career insight that also creates a concrete contribution.'}
        body={isDa
          ? `Den professionelle vælger at afsætte ${CONTRIBUTION_MIN}%, 60%, 80% eller ${CONTRIBUTION_MAX}% af sessionsprisen eksklusive moms. Beløbet skal altid være synligt før booking.`
          : `The professional allocates ${CONTRIBUTION_MIN}%, 60%, 80% or ${CONTRIBUTION_MAX}% of the session price excluding VAT. The amount must always be visible before booking.`}
        action={{ href: '/start', label: isDa ? 'Start med din situation' : 'Start with your situation' }}
        sequence={isDa ? ['Indsigt', 'Erfaring', 'Bidrag'] : ['Insight', 'Experience', 'Contribution']}
      />

      <section className="home-section home-section--ink">
        <div className="home-shell">
          <div className="section-heading section-heading--light">
            <p className="section-eyebrow">{isDa ? 'Regnestykket' : 'The calculation'}</p>
            <h2>{isDa ? 'Det præcise beløb. Ikke en vag formulering.' : 'The exact amount, not a vague statement.'}</h2>
            <p>{isDa ? 'Vælg en sessionspris og se spændet mellem det laveste og højeste bidragsniveau.' : 'Choose a session price and see the range between the lowest and highest contribution level.'}</p>
          </div>
          <LivingImpactLine />
        </div>
      </section>

      <section className="public-section">
        <div className="home-shell">
          <div className="section-heading">
            <p className="section-eyebrow">{isDa ? 'Tre former for værdi' : 'Three forms of value'}</p>
            <h2>{isDa ? 'Produktet skal stå stærkt i sig selv.' : 'The product must stand on its own.'}</h2>
            <p>{isDa ? 'Bidraget giver sessionen ekstra mening. Den primære værdi er fortsat relevant karriereindsigt.' : 'The contribution adds meaning. The primary value remains relevant career insight.'}</p>
          </div>
          <div className="editorial-journey">
            {values.map(([title, body], index) => (
              <div key={title} className="impact-value-row">
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section public-section--mist">
        <div className="home-shell path-layout">
          <div className="section-heading">
            <p className="section-eyebrow">{isDa ? 'Transparens' : 'Transparency'}</p>
            <h2>{isDa ? 'Fire ting, der altid skal være tydelige.' : 'Four things that must always be clear.'}</h2>
            <p>{isDa ? `Naetworks platform- og betalingsgebyr er DKK ${PLATFORM_FEE_DKK} pr. gennemført session og ændrer ikke kandidatens viste totalpris.` : `Naetwork's platform and payment fee is DKK ${PLATFORM_FEE_DKK} per completed session and does not change the candidate total shown.`}</p>
          </div>
          <div className="situation-index">
            {clarity.map(([title, body], index) => (
              <div key={title} className="impact-clarity-row">
                <span>0{index + 1}</span>
                <div><h3>{title}</h3><p>{body}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="public-cta">
        <div className="home-shell">
          <h2>{isDa ? 'Start med karrierebeslutningen.' : 'Start with the career decision.'}</h2>
          <p>{isDa ? 'Pris og konkret bidrag vises, før du sender en bookinganmodning.' : 'The price and exact contribution are shown before you send a booking request.'}</p>
          <Link href="/start" className="button-primary">
            {isDa ? 'Start med din situation' : 'Start with your situation'}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  )
}
