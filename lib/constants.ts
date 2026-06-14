// Naetwork platform constants
export const PLATFORM_NAME = 'Naetwork';
export const PLATFORM_COMMISSION_DEFAULT = 0.15;
export const PLATFORM_COMMISSION_CHARITY = 0.075;
export const CHARITY_NAME = 'Kraeftens Bekaempelse';
export const PRICE_MIN = 300;
export const PRICE_MAX = 2000;

export const SESSION_TYPES = ['mock_interview','cv_review','informal_chat','career_advice'] as const;
export type SessionType = typeof SESSION_TYPES[number];

export const BOOKING_STATUSES = ['pending','confirmed','completed','cancelled'] as const;
export type BookingStatus = typeof BOOKING_STATUSES[number];
