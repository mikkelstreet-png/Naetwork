'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { LivingImpactLine } from '@/components/LivingImpactLine'
import { PublicPageHero } from '@/components/PublicPageHero'
import { useLanguage } from '@/context/LanguageContext'
import { CONTRIBUTION_PERCENT, PLATFORM_SHARE_PERCENT, PROFESSIONAL_SHARE_PERCENT } from '@/lib/platform'

export function ImpactContent() {
  const { lang } = useLanguage()
  const isDa = lang === 'da'

  const values = isDa
    ? [
        ['Kandidaten', 'Får konkret feedback fra branchen og et bedre grundlag for den konkrete beslutning.'],
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
        ['Grundlaget', `Momsen skilles først ud. Derefter går ${PLATFORM_SHARE_PERCENT}% af nettoprisen til Naetwork, mindst ${CONTRIBUTION_PERCENT}% til Kræftens Bekæmpelse og ${PROFESSIONAL_SHARE_PERCENT}% til den professionelle — medmindre den professionelle også donerer sin andel.`],
        ['Tidspunktet', 'Kun en gennemført og betalt session udløser et bidrag. Aflyste, refunderede eller ikke-betalte sessioner tæller ikke.'],
        ['Dokumentationen', 'Det konkrete beløb skal fremgå før booking og efter gennemførelse. Offentlige impacttal må kun bygge på dokumenterede betalinger.'],
        ['Relationen', 'Naetwork er et uafhængigt initiativ og ikke officielt tilknyttet Kræftens Bekæmpelse, medmindre andet fremgår eksplicit.'],
      ]
    : [
        ['The basis', `VAT is separated first. Then ${PLATFORM_SHARE_PERCENT}% of the net price goes to Naetwork, at least ${CONTRIBUTION_PERCENT}% to Kræftens Bekæmpelse and ${PROFESSIONAL_SHARE_PERCENT}% to the professional — unless the professional also donates their share.`],
        ['The timing', 'Only a completed and paid session triggers a contribution. Cancelled, refunded or unpaid sessions do not count.'],
        ['The documentation', 'The exact amount must be shown before booking and after completion. Public impact figures must rely on documented payments.'],
        ['The relationship', 'Naetwork is independent and not officially affiliated with Kræftens Bekæmpelse unless explicitly stated otherwise.'],
      ]

  return (
    <main className="page-shell">
      <PublicPageHero
        eyebrow={isDa ? 'Pris og bidrag' : 'Price and contribution'}
        title={isDa ? 'Dit næste skridt kan også gøre en forskel.' : 'Your next step can also make a difference.'}
        body={isDa
          ? `Hver nettopris følger samme grundmodel: ${PLATFORM_SHARE_PERCENT}% til Naetwork, mindst ${CONTRIBUTION_PERCENT}% til Kræftens Bekæmpelse og ${PROFESSIONAL_SHARE_PERCENT}% til den professionelle eller som ekstra bidrag.`
          : `Every net price follows the same base model: ${PLATFORM_SHARE_PERCENT}% to Naetwork, at least ${CONTRIBUTION_PERCENT}% to Kræftens Bekæmpelse and ${PROFESSIONAL_SHARE_PERCENT}% to the professional or as an additional contribution.`}
        action={{ href: '/start', label: isDa ? 'Start med din situation' : 'Start with your situation' }}
        sequence={isDa ? ['Indsigt', 'Erfaring', 'Bidrag'] : ['Insight', 'Experience', 'Contribution']}
      />

      <section className="home-section home-section--ink">
        <div className="home-shell">
          <div className="section-heading section-heading--light">
            <p className="section-eyebrow">{isDa ? 'Regnestykket' : 'The calculation'}</p>
            <h2>{isDa ? 'Det præcise beløb. Ikke en vag formulering.' : 'The exact amount, not a vague statement.'}</h2>
            <p>{isDa ? 'Vælg en sessionspris og se moms, nettopris og alle tre andele i kroner.' : 'Choose a session price and see VAT, net price and all three shares in kroner.'}</p>
          </div>
          <LivingImpactLine />
        </div>
      </section>

      <section className="public-section">
        <div className="home-shell">
          <div className="section-heading">
            <p className="section-eyebrow">{isDa ? 'Tre former for værdi' : 'Three forms of value'}</p>
            <h2>{isDa ? 'Produktet skal stå stærkt i sig selv.' : 'The product must stand on its own.'}</h2>
            <p>{isDa ? 'Bidraget giver sessionen ekstra mening. Den primære værdi er fortsat adgang til relevant professionel erfaring.' : 'The contribution adds meaning. The primary value remains access to relevant professional experience.'}</p>
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
            <p>{isDa ? 'Grundfordelingen og kandidatens totalpris er fast. Den professionelle kan vælge at donere sin egen andel.' : 'The base split and candidate total are fixed. The professional may choose to donate their own share.'}</p>
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
