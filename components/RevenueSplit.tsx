import { formatDkk, sessionEconomics } from '@/lib/platform'

interface RevenueSplitProps {
  price: number
  locale?: 'da' | 'en'
  tone?: 'light' | 'dark'
  compact?: boolean
}

export function RevenueSplit({ price, locale = 'da', tone = 'light', compact = false }: RevenueSplitProps) {
  const economics = sessionEconomics(price)
  const isDa = locale === 'da'
  const items = [
    {
      label: 'Kræftens Bekæmpelse',
      percent: economics.contributionPercent,
      amount: economics.contribution,
      className: 'revenue-split__charity',
    },
    {
      label: 'Naetwork',
      percent: economics.platformSharePercent,
      amount: economics.platformShare,
      className: 'revenue-split__platform',
    },
    {
      label: isDa ? 'Den professionelle' : 'The professional',
      percent: economics.professionalSharePercent,
      amount: economics.professionalPayout,
      className: 'revenue-split__professional',
    },
  ]

  return (
    <div className={`revenue-split revenue-split--${tone}${compact ? ' revenue-split--compact' : ''}`}>
      <div className="revenue-split__header">
        <div>
          <p>{isDa ? 'Fast fordeling' : 'Fixed split'}</p>
          <h3>{isDa ? 'Hver nettopris fordeles automatisk.' : 'Every net price is split automatically.'}</h3>
        </div>
        <span>{formatDkk(economics.candidatePrice)} {isDa ? 'inkl. moms' : 'incl. VAT'}</span>
      </div>
      <div className="revenue-split__bar" aria-hidden="true">
        {items.map((item) => <span key={item.label} className={item.className} style={{ flexBasis: `${item.percent}%` }} />)}
      </div>
      <dl className="revenue-split__items">
        {items.map((item) => (
          <div key={item.label}>
            <dt><span className={item.className} />{item.label}</dt>
            <dd><strong>{item.percent}%</strong><span>{formatDkk(item.amount)}</span></dd>
          </div>
        ))}
      </dl>
      {!compact && (
        <p className="revenue-split__note">
          {isDa
            ? `Momsen på ${formatDkk(economics.vat)} skilles først ud. Fordelingsgrundlaget er derfor ${formatDkk(economics.netPrice)} ekskl. moms.`
            : `VAT of ${formatDkk(economics.vat)} is separated first. The split is therefore based on ${formatDkk(economics.netPrice)} excl. VAT.`}
        </p>
      )}
    </div>
  )
}
