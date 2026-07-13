'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { BRAND_COPY } from '@/lib/brand'
import { CONTRIBUTION_PERCENT } from '@/lib/platform'

export function AccessHero() {
  const { lang } = useLanguage()
  const copy = BRAND_COPY[lang]
  const isDa = lang === 'da'
  const heroRef = useRef<HTMLElement>(null)

  const updatePerspective = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch') return
    const hero = heroRef.current
    if (!hero) return

    const bounds = hero.getBoundingClientRect()
    const x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2))
    const y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2))

    hero.style.setProperty('--access-tilt-x', `${(-y * 3.2).toFixed(2)}deg`)
    hero.style.setProperty('--access-tilt-y', `${(x * 4.8).toFixed(2)}deg`)
    hero.style.setProperty('--access-shift-x', `${(-x * 10).toFixed(2)}px`)
    hero.style.setProperty('--access-shift-y', `${(-y * 7).toFixed(2)}px`)
  }

  const resetPerspective = () => {
    const hero = heroRef.current
    if (!hero) return
    hero.style.setProperty('--access-tilt-x', '0deg')
    hero.style.setProperty('--access-tilt-y', '0deg')
    hero.style.setProperty('--access-shift-x', '0px')
    hero.style.setProperty('--access-shift-y', '0px')
  }

  return (
    <section
      ref={heroRef}
      id="home"
      className="access-hero"
      onPointerMove={updatePerspective}
      onPointerLeave={resetPerspective}
    >
      <Image
        src="/naetwork-spectrum.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="access-hero__spectrum"
      />
      <div className="access-hero__veil" aria-hidden="true" />
      <div
        className="access-hero__aperture"
        role="img"
        aria-label={isDa ? 'Visuel åbning til relevant erfaring' : 'Visual opening to relevant experience'}
        data-special-effect="access-aperture"
      >
        <span />
        <span />
        <span />
        <span />
        <div className="access-hero__aperture-caption" aria-hidden="true">
          <small>Access / 01</small>
          <strong>{isDa ? 'Relevant erfaring' : 'Relevant experience'}</strong>
        </div>
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
