'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { BRAND_COPY } from '@/lib/brand'

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
            <li>{isDa ? '40-90% af prisen ekskl. moms afsættes til støtte for Kræftens Bekæmpelse' : '40-90% of the price excl. VAT is allocated in support of Kræftens Bekæmpelse'}</li>
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
