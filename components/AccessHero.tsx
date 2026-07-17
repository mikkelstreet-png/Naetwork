'use client'

import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export function AccessHero() {
  const { lang } = useLanguage()
  const isDa = lang === 'da'
  const proofPoints = isDa
    ? ['Feedback på din konkrete situation', 'Indsigt fra branchen indefra', 'Prioriterede forbedringer', '10% til Kræftens Bekæmpelse']
    : ['Feedback on your situation', 'Inside industry perspective', 'Prioritized improvements', '10% to Kræftens Bekæmpelse']

  return (
    <section id="home" className="insight-hero">
      <div className="insight-signature insight-signature--hero" aria-hidden="true">
        <span className="insight-signature__line" />
        <span className="insight-signature__marker" />
        <span className="insight-signature__endpoint" />
      </div>

      <div className="home-shell insight-hero__shell">
        <div className="insight-hero__copy">
          <p className="insight-hero__kicker enter-up">
            {isDa ? 'Indsigt indefra. Mening udadtil.' : 'Insight from within. Impact beyond.'}
          </p>
          <h1 className="enter-up enter-up-delay">
            {isDa ? 'Forstå, hvad der kræves — før det gælder.' : 'Understand what it takes — before it counts.'}
          </h1>
          <p className="insight-hero__intro enter-up enter-up-delay">
            {isDa
              ? 'Få konkret feedback fra en fagperson, der kender branchen indefra. Test dit CV, interview, din case eller din positionering, og brug tiden på de ændringer, der reelt kan styrke dit næste skridt.'
              : 'Get concrete feedback from a professional who knows the industry from within. Test your CV, interview, case or positioning, and focus on the changes that can genuinely strengthen your next move.'}
          </p>

          <div className="insight-hero__actions enter-up enter-up-delay">
            <Link href="/professionals" className="button-inverse button-with-arrow">
              {isDa ? 'Find den rette fagperson' : 'Find the right professional'}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link href="/#needs" className="insight-hero__secondary">
              {isDa ? 'Se, hvad du kan få hjælp til' : 'See what you can get help with'}
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <p className="insight-hero__impact">
            {isDa
              ? '10% af hver gennemført og betalt session går til Kræftens Bekæmpelse.'
              : '10% of every completed and paid session goes to Kræftens Bekæmpelse.'}
          </p>
        </div>

        <div className="insight-hero__proof">
          <p>
            {isDa
              ? 'Generelle råd fortæller dig, hvad man typisk bør gøre. Naetwork hjælper dig med at forstå, hvad der konkret bør ændres i din situation.'
              : 'General advice tells you what people typically do. Naetwork helps you understand what should change in your specific situation.'}
          </p>
          <ul aria-label={isDa ? 'Det får du med Naetwork' : 'What Naetwork gives you'}>
            {proofPoints.map((point) => (
              <li key={point}><Check size={14} aria-hidden="true" />{point}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
