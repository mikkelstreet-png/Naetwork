'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { BRAND_COPY } from '@/lib/brand'
import { PRICE_MIN, SESSION_MINUTES } from '@/lib/platform'

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

      <div className="access-hero__shell">
        <div className="access-hero__copy">
          <p className="access-hero__category">{copy.category}</p>
          <h1>{copy.primaryLine}</h1>
          <p className="access-hero__intro">{copy.oneSentence}</p>

          <div className="access-hero__actions">
            <Link href="/start" className="button-inverse">
              {isDa ? 'Find din session' : 'Find your session'}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link href="/professionals" className="access-hero__text-link">
              {isDa ? 'Mød fagpersonerne' : 'Meet the professionals'}
            </Link>
          </div>

          <ul className="access-hero__facts" aria-label={isDa ? 'Praktisk information' : 'Practical information'}>
            <li>{isDa ? '7 konkrete sessionstyper' : '7 concrete session types'}</li>
            <li>{SESSION_MINUTES} {isDa ? 'minutter online' : 'minutes online'}</li>
            <li>{isDa ? `Fra DKK ${PRICE_MIN} inkl. moms` : `From DKK ${PRICE_MIN} incl. VAT`}</li>
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
