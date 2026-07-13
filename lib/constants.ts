// Database-facing status values. Canonical product values live in platform.ts.
export { CHARITY_NAME, PLATFORM_NAME, PRICE_MAX, PRICE_MIN } from './platform';

export const BOOKING_STATUSES = ['requested', 'pending', 'confirmed', 'rescheduled', 'completed', 'cancelled', 'no_show', 'refunded', 'disputed'] as const;
export type BookingStatus = typeof BOOKING_STATUSES[number];
