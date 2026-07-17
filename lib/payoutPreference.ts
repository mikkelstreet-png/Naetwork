import {
  CONTRIBUTION_PERCENT,
  PROFESSIONAL_SHARE_PERCENT,
  sessionEconomics,
} from './platform'

export const PAYOUT_PREFERENCES = ['receive', 'donate'] as const

export type PayoutPreference = typeof PAYOUT_PREFERENCES[number]

export const DEFAULT_PAYOUT_PREFERENCE: PayoutPreference = 'receive'

export function normalizePayoutPreference(value: unknown): PayoutPreference {
  return value === 'donate' ? 'donate' : DEFAULT_PAYOUT_PREFERENCE
}

export function charitySharePercent(preference: PayoutPreference) {
  return preference === 'donate'
    ? CONTRIBUTION_PERCENT + PROFESSIONAL_SHARE_PERCENT
    : CONTRIBUTION_PERCENT
}

export function charityAmount(grossPrice: number, preference: PayoutPreference) {
  const economics = sessionEconomics(grossPrice)
  return preference === 'donate'
    ? economics.contribution + economics.professionalPayout
    : economics.contribution
}
