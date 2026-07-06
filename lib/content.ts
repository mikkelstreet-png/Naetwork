// Compatibility layer for older imports. Canonical product values live in platform.ts.
export { CHARITY_NAME, PLATFORM_NAME, PRICE_MAX, PRICE_MIN } from './platform';
export const PLATFORM_COMMISSION_DEFAULT = 0.15;
export const PLATFORM_COMMISSION_CHARITY = 0.075;

export const SESSION_TYPES = [
  'mock_interview',
  'cv_review',
  'informal_chat',
  'career_advice',
] as const;

export type SessionType = typeof SESSION_TYPES[number];

export const SESSION_TYPE_LABELS: Record<SessionType, { da: string; en: string }> = {
  mock_interview: { da: 'Mock Interview', en: 'Mock Interview' },
  cv_review: { da: 'CV & LinkedIn', en: 'CV & LinkedIn' },
  informal_chat: { da: 'Uformel 1:1', en: 'Informal 1:1' },
  career_advice: { da: 'Karriereraadgivning', en: 'Career advice' },
};

export const INDUSTRIES = ['AI', 'Banking', 'Management Consulting', 'Private Equity'] as const;

export type Industry = typeof INDUSTRIES[number];
