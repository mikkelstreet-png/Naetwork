export const LEGAL_UPDATED_ISO = '2026-07-12'
export const LEGAL_UPDATED_DA = '12. juli 2026'
export const TERMS_VERSION = LEGAL_UPDATED_ISO
export const PRIVACY_VERSION = LEGAL_UPDATED_ISO

export const LEGAL_NAME = process.env.NEXT_PUBLIC_LEGAL_NAME ?? 'Naetwork'
export const LEGAL_ADDRESS = process.env.NEXT_PUBLIC_LEGAL_ADDRESS ?? ''
export const LEGAL_REGISTRATION = process.env.NEXT_PUBLIC_LEGAL_REGISTRATION ?? ''
export const PUBLIC_SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'kontakt@naetwork.dk'

export const LEGAL_OPERATOR = [LEGAL_NAME, LEGAL_REGISTRATION, LEGAL_ADDRESS]
  .filter(Boolean)
  .join(', ')

export const HAS_COMPLETE_LEGAL_IDENTITY = Boolean(LEGAL_NAME && LEGAL_ADDRESS && LEGAL_REGISTRATION)
