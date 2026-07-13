'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import {
  CONTRIBUTION_PERCENT,
  PLATFORM_SHARE_PERCENT,
  PRICE_OPTIONS,
  PROFESSIONAL_SHARE_PERCENT,
  formatDkk,
  sessionEconomics,
} from '@/lib/platform'

export function LivingImpactLine() {
  const { lang } = useLanguage()
  const [price, setPrice] = useState<number>(PRICE_OPTIONS[0])
  const [isVisible, setIsVisible] = useState(false)
  const lineRef = useRef<HTMLDivElement>(null)
  const isDa = lang === 'da'
  const economics = sessionEconomics(price)

  useEffect(() => {
    const node = lineRef.current
    if (!node) return

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setIsVisible(true)
      observer.disconnect()
    }, { threshold: 0.25 })

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={lineRef} className="impact-line" data-interactive="true">
      <div className="impact-line__header">
        <div>
          <p className="editorial-label text-white/58">{isDa ? 'Bidrag i praksis' : 'Contribution in practice'}</p>
          <h3>{isDa ? 'Se præcis, hvordan bidraget beregnes.' : 'See exactly how the contribution is calculated.'}</h3>
        </div>
        <div className="impact-line__prices" role="group" aria-label={isDa ? 'Vælg sessionspris' : 'Choose session price'}>
          {PRICE_OPTIONS.map((amount) => (
            <button key={amount} type="button" aria-pressed={price === amount} onClick={() => setPrice(amount)}>
              {formatDkk(amount)}
            </button>
          ))}
        </div>
      </div>

      <div className="impact-line__equation" aria-live="polite">
        <div>
          <span className="impact-line__index">01</span>
          <p key={`price-${price}`} className="impact-line__amount">{formatDkk(price)}</p>
          <small>{isDa ? 'Pris inkl. moms' : 'Price incl. VAT'}</small>
        </div>
        <div>
          <span className="impact-line__index">02</span>
          <p key={`net-${price}`} className="impact-line__amount">{formatDkk(economics.netPrice)}</p>
          <small>{isDa ? `Nettopris · moms ${formatDkk(economics.vat)}` : `Net price · VAT ${formatDkk(economics.vat)}`}</small>
        </div>
      </div>

      <div key={`split-${price}`} className="impact-line__split" data-visible={isVisible} aria-hidden="true" data-special-effect="impact-split">
        <span style={{ width: `${PLATFORM_SHARE_PERCENT}%` }} />
        <span style={{ width: `${CONTRIBUTION_PERCENT}%` }} />
        <span style={{ width: `${PROFESSIONAL_SHARE_PERCENT}%` }} />
      </div>

      <div className="impact-line__distribution" aria-live="polite">
        <div>
          <span>{PLATFORM_SHARE_PERCENT}%</span>
          <p key={`platform-${price}`} className="impact-line__amount">{formatDkk(economics.platformShare)}</p>
          <small>Naetwork</small>
        </div>
        <div className="impact-line__outcome">
          <span>{CONTRIBUTION_PERCENT}%</span>
          <p key={`contribution-${price}`} className="impact-line__amount">{formatDkk(economics.contribution)}</p>
          <small>Kræftens Bekæmpelse</small>
        </div>
        <div>
          <span>{PROFESSIONAL_SHARE_PERCENT}%</span>
          <p key={`professional-${price}`} className="impact-line__amount">{formatDkk(economics.professionalPayout)}</p>
          <small>{isDa ? 'Den professionelle · før skat' : 'The professional · before tax'}</small>
        </div>
      </div>

      <div className="impact-line__footer">
        <p>{isDa ? 'Fordelingen beregnes af nettoprisen og gælder efter en gennemført, betalt session.' : 'The split is calculated from the net price and applies after a completed, paid session.'}</p>
        <Link href="/impact">
          {isDa ? 'Se bidragsmodellen' : 'See the contribution model'}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
