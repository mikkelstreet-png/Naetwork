'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import {
  CONTRIBUTION_MAX,
  CONTRIBUTION_MIN,
  PRICE_OPTIONS,
  contributionAmount,
  formatDkk,
} from '@/lib/platform'

export function LivingImpactLine() {
  const { lang } = useLanguage()
  const [price, setPrice] = useState<number>(PRICE_OPTIONS[0])
  const isDa = lang === 'da'
  const net = Math.round(price / 1.25)
  const minimum = contributionAmount(price, CONTRIBUTION_MIN)
  const maximum = contributionAmount(price, CONTRIBUTION_MAX)
  const contributionRange = `DKK ${minimum.toLocaleString('da-DK')}-${maximum.toLocaleString('da-DK')}`

  return (
    <div className="impact-line" data-interactive="true">
      <div className="impact-line__header">
        <div>
          <p className="editorial-label text-white/58">{isDa ? 'Bidrag i praksis' : 'Contribution in practice'}</p>
          <h3>{isDa ? 'Se præcis, hvordan bidraget hænger sammen.' : 'See exactly how the contribution connects.'}</h3>
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
        <span className="impact-line__connector" aria-hidden="true" />
        <div>
          <span className="impact-line__index">02</span>
          <p>{formatDkk(net)}</p>
          <small>{isDa ? 'Pris ekskl. moms' : 'Price excl. VAT'}</small>
        </div>
        <span className="impact-line__connector" aria-hidden="true" />
        <div className="impact-line__outcome">
          <span className="impact-line__index">03</span>
          <p>{contributionRange}</p>
          <small>{isDa ? `${CONTRIBUTION_MIN}-${CONTRIBUTION_MAX}% afsættes` : `${CONTRIBUTION_MIN}-${CONTRIBUTION_MAX}% allocated`}</small>
        </div>
      </div>

      <div className="impact-line__footer">
        <p>{isDa ? 'Gælder efter en gennemført, betalt session. Naetwork er et uafhængigt initiativ.' : 'Applies after a completed, paid session. Naetwork is an independent initiative.'}</p>
        <Link href="/impact">
          {isDa ? 'Se bidragsmodellen' : 'See the contribution model'}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
