'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
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
  const isDa = lang === 'da'
  const economics = sessionEconomics(price)

  return (
    <div className="impact-line" data-interactive="true">
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
          <p>{formatDkk(price)}</p>
          <small>{isDa ? 'Pris inkl. moms' : 'Price incl. VAT'}</small>
        </div>
        <div>
          <span className="impact-line__index">02</span>
          <p>{formatDkk(economics.netPrice)}</p>
          <small>{isDa ? `Nettopris · moms ${formatDkk(economics.vat)}` : `Net price · VAT ${formatDkk(economics.vat)}`}</small>
        </div>
      </div>

      <div className="impact-line__distribution" aria-live="polite">
        <div>
          <span>{PLATFORM_SHARE_PERCENT}%</span>
          <p>{formatDkk(economics.platformShare)}</p>
          <small>Naetwork</small>
        </div>
        <div className="impact-line__outcome">
          <span>{CONTRIBUTION_PERCENT}%</span>
          <p>{formatDkk(economics.contribution)}</p>
          <small>Kræftens Bekæmpelse</small>
        </div>
        <div>
          <span>{PROFESSIONAL_SHARE_PERCENT}%</span>
          <p>{formatDkk(economics.professionalPayout)}</p>
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
