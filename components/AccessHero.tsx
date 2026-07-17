'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export function AccessHero() {
  const { lang } = useLanguage()
  const isDa = lang === 'da'

  return (
    <section id="home" className="insight-hero">
      <div className="insight-signature insight-signature--hero" aria-hidden="true">
        <span className="insight-signature__origin" />
        <span className="insight-signature__line" />
        <span className="insight-signature__marker" />
        <span className="insight-signature__endpoint" />
      </div>

      <div className="home-shell insight-hero__shell">
        <div className="insight-hero__copy">
          <p className="insight-hero__kicker enter-up">
            {isDa ? 'Professionel adgang. For alle.' : 'Professional access. For everyone.'}
          </p>
          <h1 className="enter-up enter-up-delay">
            {isDa ? 'Få adgang til det, andre får gennem deres netværk.' : 'Access what others get through their network.'}
          </h1>
          <p className="insight-hero__intro enter-up enter-up-delay">
            {isDa
              ? 'Naetwork gør relevant professionel erfaring tilgængelig for alle. Book 60 minutter med en person, der kender rollen, branchen eller processen indefra – og brug erfaringen til at træffe, forberede og gennemføre et stærkere næste karriereskridt.'
              : 'Naetwork makes relevant professional experience available to everyone. Book 60 minutes with someone who knows the role, industry or process from within, and use that experience to make, prepare and execute a stronger next career move.'}
          </p>

          <div className="insight-hero__actions enter-up enter-up-delay">
            <Link href="/professionals" className="button-inverse button-with-arrow">
              {isDa ? 'Find den erfaring, du mangler' : 'Find the experience you need'}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link href="/#how-it-works" className="insight-hero__secondary">
              {isDa ? 'Se, hvordan Naetwork virker' : 'See how Naetwork works'}
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <div className="insight-hero__proofline enter-up enter-up-delay">
            <p>{isDa ? 'Ingen introduktion nødvendig. Ét konkret mål. Erfaring, du kan handle på.' : 'No introduction needed. One concrete goal. Experience you can act on.'}</p>
            <p>{isDa ? '10 % af hver gennemført og betalt session går til Kræftens Bekæmpelse.' : '10% of every completed and paid session goes to Kræftens Bekæmpelse.'}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
