import { CONTRIBUTION_PERCENT, formatDkk } from '@/lib/platform'
import { sessionImpactAmount } from '@/lib/publicExperience'

interface ImpactMarkerProps {
  price: number
  locale?: 'da' | 'en'
  tone?: 'light' | 'dark'
  compact?: boolean
}

export function ImpactMarker({ price, locale = 'da', tone = 'light', compact = false }: ImpactMarkerProps) {
  const isDa = locale === 'da'
  const amount = sessionImpactAmount(price)

  return (
    <div className={`impact-marker impact-marker--${tone}${compact ? ' impact-marker--compact' : ''}`}>
      <div className="impact-marker__topline">
        <span>{isDa ? 'Sessionens bidrag' : 'Session contribution'}</span>
        <strong>{formatDkk(amount)}</strong>
      </div>
      <div className="impact-marker__track" aria-hidden="true">
        <span style={{ width: `${CONTRIBUTION_PERCENT}%` }} />
        <i style={{ left: `${CONTRIBUTION_PERCENT}%` }} />
      </div>
      <p>
        {isDa
          ? `${CONTRIBUTION_PERCENT}% af nettoprisen for en gennemført og betalt session på ${formatDkk(price)} inkl. moms går til Kræftens Bekæmpelse.`
          : `${CONTRIBUTION_PERCENT}% of the net price for a completed and paid ${formatDkk(price)} session incl. VAT goes to Kræftens Bekæmpelse.`}
      </p>
    </div>
  )
}
