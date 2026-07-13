export const PLATFORM_NAME = 'Naetwork'
export const CHARITY_NAME = 'Kræftens Bekæmpelse'

export const SESSION_MINUTES = 60
export const PRICE_MIN = 600
export const PRICE_MAX = 1800
export const PRICE_OPTIONS = [600, 900, 1200, 1800] as const
export const VAT_RATE_PERCENT = 25
export const PLATFORM_SHARE_PERCENT = 20
export const CONTRIBUTION_PERCENT = 30
export const PROFESSIONAL_SHARE_PERCENT = 50

export const INDUSTRIES = [
  { id: 'AI', slug: 'ai', accent: 'bg-cyan-300', surface: 'bg-[#d8f7fb]' },
  { id: 'Banking', slug: 'banking', accent: 'bg-emerald-300', surface: 'bg-[#dff4e7]' },
  { id: 'Management Consulting', slug: 'consulting', accent: 'bg-blue-300', surface: 'bg-[#dfeafb]' },
  { id: 'Private Equity', slug: 'private-equity', accent: 'bg-lime-300', surface: 'bg-[#edf4cf]' },
] as const

export type Industry = typeof INDUSTRIES[number]['id']
export type PriceOption = typeof PRICE_OPTIONS[number]

export function normalizePrice(value: unknown): PriceOption {
  const parsed = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(parsed)) return PRICE_OPTIONS[0]
  return PRICE_OPTIONS.reduce((closest, option) =>
    Math.abs(option - parsed) < Math.abs(closest - parsed) ? option : closest
  )
}

export function normalizeLinkedInUrl(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) return null
  try {
    const url = new URL(value.trim())
    if (url.protocol !== 'https:' || !/(^|\.)linkedin\.com$/i.test(url.hostname)) return null
    url.hash = ''
    return url.toString()
  } catch {
    return null
  }
}

export const FOCUS_AREAS = [
  { id: 'cv_linkedin', da: 'CV og LinkedIn', en: 'CV and LinkedIn' },
  { id: 'application_review', da: 'Ansøgning', en: 'Application review' },
  { id: 'interview_prep', da: 'Interviewforberedelse', en: 'Interview preparation' },
  { id: 'case_prep', da: 'Caseforberedelse', en: 'Case preparation' },
  { id: 'banking_technicals', da: 'Banking technicals', en: 'Banking technicals' },
  { id: 'consulting_cases', da: 'Consulting-cases', en: 'Consulting cases' },
  { id: 'pe_investment_case', da: 'PE-investment case', en: 'PE investment case' },
  { id: 'career_direction', da: 'Karriereretning', en: 'Career direction' },
  { id: 'ai_career_strategy', da: 'AI-karrierestrategi', en: 'AI career strategy' },
  { id: 'industry_insight', da: 'Brancheindsigt', en: 'Industry insight' },
] as const

export type FocusArea = typeof FOCUS_AREAS[number]['id']

export const BOOKING_FOCUS_AREAS = [
  'cv_linkedin',
  'interview_prep',
  'case_prep',
  'career_direction',
] as const satisfies readonly FocusArea[]

const LEGACY_FOCUS_LABELS: Record<string, { da: string; en: string }> = {
  mock_interview: { da: 'Prøveinterview', en: 'Mock interview' },
  cv_review: { da: 'CV og LinkedIn', en: 'CV and LinkedIn' },
  career_strategy: { da: 'Karriereretning', en: 'Career direction' },
  career_advice: { da: 'Karriereretning', en: 'Career direction' },
  informal_chat: { da: 'Brancheindsigt', en: 'Industry insight' },
}

export const FOCUS_LABELS: Record<string, { da: string; en: string }> = Object.fromEntries([
  ...FOCUS_AREAS.map((focus) => [focus.id, { da: focus.da, en: focus.en }]),
  ...Object.entries(LEGACY_FOCUS_LABELS),
])

export function focusLabel(id: string, locale: 'da' | 'en' = 'da') {
  return FOCUS_LABELS[id]?.[locale] ?? id
}

export function industryAccent(industry?: string) {
  return INDUSTRIES.find((item) => item.id === industry)?.accent ?? 'bg-gray-300'
}

export function priceBeforeVat(grossPrice: number) {
  return Math.round(grossPrice / (1 + VAT_RATE_PERCENT / 100))
}

export function vatAmount(grossPrice: number) {
  return grossPrice - priceBeforeVat(grossPrice)
}

export function contributionAmount(grossPrice: number) {
  return Math.round(priceBeforeVat(normalizePrice(grossPrice)) * CONTRIBUTION_PERCENT / 100)
}

export function sessionEconomics(grossPrice: number) {
  const candidatePrice = normalizePrice(grossPrice)
  const netPrice = priceBeforeVat(candidatePrice)
  const vat = candidatePrice - netPrice
  const platformShare = Math.round(netPrice * PLATFORM_SHARE_PERCENT / 100)
  const contribution = Math.round(netPrice * CONTRIBUTION_PERCENT / 100)
  const professionalPayout = netPrice - platformShare - contribution

  return {
    candidatePrice,
    netPrice,
    vat,
    platformSharePercent: PLATFORM_SHARE_PERCENT,
    contributionPercent: CONTRIBUTION_PERCENT,
    professionalSharePercent: PROFESSIONAL_SHARE_PERCENT,
    contribution,
    platformShare,
    professionalPayout,
  }
}

export function formatDkk(amount: number) {
  return `DKK ${amount.toLocaleString('da-DK')}`
}
