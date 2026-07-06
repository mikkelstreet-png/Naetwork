// Legacy exports kept for database-facing modules. Product values live in platform.ts.
export { CHARITY_NAME, PLATFORM_NAME, PRICE_MAX, PRICE_MIN } from './platform';
export const PLATFORM_COMMISSION_DEFAULT = 0.15;
export const PLATFORM_COMMISSION_CHARITY = 0.075;

export const SESSION_TYPES = ['mock_interview','cv_review','informal_chat','career_advice'] as const;
export type SessionType = typeof SESSION_TYPES[number];

export const BOOKING_STATUSES = ['requested', 'pending', 'confirmed', 'rescheduled', 'completed', 'cancelled', 'no_show', 'refunded', 'disputed'] as const;
export type BookingStatus = typeof BOOKING_STATUSES[number];
