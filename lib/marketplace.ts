import { CONTRIBUTION_PERCENT, PLATFORM_SHARE_PERCENT, PROFESSIONAL_SHARE_PERCENT, focusLabel, type FocusArea } from './platform'

export const MARKETPLACE_MODEL = {
  format: 'single_60_minute_session',
  currency: 'DKK',
  timeZone: 'Europe/Copenhagen',
  paymentProvider: 'stripe_connect',
  chargeModel: 'destination_charge',
  paymentActivation: 'disabled_until_legal_and_operational_approval',
  revenueSplit: {
    contributionPercent: CONTRIBUTION_PERCENT,
    platformPercent: PLATFORM_SHARE_PERCENT,
    professionalPercent: PROFESSIONAL_SHARE_PERCENT,
  },
} as const

export const SESSION_NEEDS = [
  {
    id: 'direction',
    da: 'Retning og jobskifte',
    en: 'Direction and career change',
    descriptionDa: 'Afklar roller, brancheskifte, positionering eller næste karrieretræk.',
    descriptionEn: 'Clarify roles, career changes, positioning or your next move.',
    focusAreas: ['career_direction', 'ai_career_strategy', 'industry_insight'],
  },
  {
    id: 'materials',
    da: 'CV og ansøgning',
    en: 'CV and applications',
    descriptionDa: 'Prioritér konkrete forbedringer i CV, LinkedIn og ansøgning.',
    descriptionEn: 'Prioritize concrete improvements to your CV, LinkedIn and application.',
    focusAreas: ['cv_linkedin', 'application_review'],
  },
  {
    id: 'interview',
    da: 'Interview',
    en: 'Interview',
    descriptionDa: 'Træn motivation, svar, technicals og personlige eksempler.',
    descriptionEn: 'Practice motivation, answers, technicals and personal examples.',
    focusAreas: ['interview_prep', 'banking_technicals'],
  },
  {
    id: 'case',
    da: 'Case og faglig test',
    en: 'Case and technical assessment',
    descriptionDa: 'Få modspil på struktur, antagelser, analyse og kommunikation.',
    descriptionEn: 'Pressure-test structure, assumptions, analysis and communication.',
    focusAreas: ['case_prep', 'consulting_cases', 'pe_investment_case'],
  },
] as const

export type SessionNeed = typeof SESSION_NEEDS[number]['id']

export const BOOKING_STATUSES = [
  'requested',
  'pending',
  'confirmed',
  'rescheduled',
  'cancelled',
  'completed',
  'no_show',
  'refunded',
  'disputed',
] as const

export type BookingStatus = typeof BOOKING_STATUSES[number]

export const PAYMENT_STATUSES = [
  'pending',
  'requires_payment',
  'processing',
  'paid',
  'failed',
  'refunded',
  'partially_refunded',
  'waived',
] as const

export type PaymentStatus = typeof PAYMENT_STATUSES[number]

export const TRANSACTIONAL_EMAIL_KEYS = [
  'welcome',
  'verify_email',
  'professional_application_received',
  'booking_requested_candidate',
  'booking_requested_professional',
  'booking_confirmed',
  'booking_rescheduled',
  'booking_cancelled',
  'booking_reminder_candidate',
  'booking_reminder_professional',
  'payment_receipt',
  'payment_failed',
  'refund_confirmed',
  'feedback_request',
  'professional_approved',
  'professional_rejected',
  'password_reset',
  'password_changed',
  'email_changed',
  'account_deleted',
  'contact_received',
  'contact_notification',
  'payout_confirmed',
  'payout_failed',
] as const

export type TransactionalEmailKey = typeof TRANSACTIONAL_EMAIL_KEYS[number]

export function sessionNeedForFocus(focus: string): SessionNeed | null {
  return SESSION_NEEDS.find((need) => (need.focusAreas as readonly string[]).includes(focus))?.id ?? null
}

export function bookingFocusOptions(locale: 'da' | 'en') {
  return SESSION_NEEDS.flatMap((need) => need.focusAreas.map((id) => ({
    id: id as FocusArea,
    label: focusLabel(id, locale),
    group: locale === 'da' ? need.da : need.en,
  })))
}

export function canCancelBooking(status: string) {
  return ['requested', 'pending', 'confirmed', 'rescheduled'].includes(status)
}

export function cancellationPolicy(startsAt: string | Date, now = new Date()) {
  const start = new Date(startsAt).getTime()
  const hours = (start - now.getTime()) / 3_600_000
  if (hours >= 24) return { refundPercent: 100, code: 'full_refund' as const }
  if (hours >= 0) return { refundPercent: 0, code: 'late_cancellation' as const }
  return { refundPercent: 0, code: 'session_started' as const }
}
