export const PLATFORM_NAME = 'Naetwork'
export const CHARITY_NAME = 'Kræftens Bekæmpelse'

export const SESSION_MINUTES = 60
export const PRICE_MIN = 600
export const PRICE_MAX = 1800
export const CONTRIBUTION_MIN = 40
export const CONTRIBUTION_MAX = 90

export const INDUSTRIES = [
  { id: 'AI', slug: 'ai', accent: 'bg-cyan-300', surface: 'bg-[#d8f7fb]' },
  { id: 'Banking', slug: 'banking', accent: 'bg-emerald-300', surface: 'bg-[#dff4e7]' },
  { id: 'Management Consulting', slug: 'consulting', accent: 'bg-blue-300', surface: 'bg-[#dfeafb]' },
  { id: 'Private Equity', slug: 'private-equity', accent: 'bg-lime-300', surface: 'bg-[#edf4cf]' },
] as const

export type Industry = typeof INDUSTRIES[number]['id']

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

export function contributionAmount(price: number, percentage: number) {
  const safePercentage = Math.min(CONTRIBUTION_MAX, Math.max(CONTRIBUTION_MIN, percentage))
  return Math.round(price * safePercentage / 100)
}

export function formatDkk(amount: number) {
  return `DKK ${amount.toLocaleString('da-DK')}`
}
