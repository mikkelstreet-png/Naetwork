'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { BRAND_COPY } from '@/lib/brand'
import { CONTRIBUTION_PERCENT } from '@/lib/platform'

export function AccessHero() {
  const { lang } = useLanguage()
  const copy = BRAND_COPY[lang]
  const isDa = lang === 'da'

  return (
    <section id="home" className="access-hero">
      <Image
        src="/naetwork-spectrum.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="access-hero__spectrum"
      />
      <div className="access-hero__veil" aria-hidden="true" />
      <div className="access-hero__aperture" aria-hidden="true" data-special-effect="access-aperture">
        <span />
        <span />
        <span />
      </div>

      <div className="access-hero__shell">
        <div className="access-hero__copy">
          <p className="access-hero__category">{copy.category}</p>
          <h1>{copy.primaryLine}</h1>
          <p className="access-hero__intro">{copy.oneSentence}</p>

          <div className="access-hero__actions">
            <Link href="/start" className="button-inverse">
              {isDa ? 'Start med din situation' : 'Start with your situation'}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link href="/how-it-works" className="access-hero__text-link">
              {isDa ? 'Sådan fungerer det' : 'How it works'}
            </Link>
          </div>

          <ul className="access-hero__facts" aria-label={isDa ? 'Praktisk information' : 'Practical information'}>
            <li>{isDa ? '60 minutter' : '60 minutes'}</li>
            <li>{isDa ? 'Fra DKK 600 inkl. moms' : 'From DKK 600 incl. VAT'}</li>
            <li>{isDa ? `${CONTRIBUTION_PERCENT}% af nettoprisen går til Kræftens Bekæmpelse` : `${CONTRIBUTION_PERCENT}% of the net price goes to Kræftens Bekæmpelse`}</li>
          </ul>
        </div>
      </div>

      <div className="access-hero__colorline" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
    </section>
  )
}
