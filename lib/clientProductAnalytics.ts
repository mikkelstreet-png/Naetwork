'use client'

export type PublicProductEventName =
  | 'session_plan_example_viewed'
  | 'session_plan_booking_clicked'
  | 'booking_started'

export type PublicProductEventSurface =
  | 'home'
  | 'sessions'
  | 'professional_profile'
  | 'booking_drawer'

interface PublicProductEvent {
  eventName: PublicProductEventName
  surface: PublicProductEventSurface
}

/**
 * Sends an aggregate, first-party product event without cookies or user data.
 * Analytics is deliberately fire-and-forget and must never block navigation,
 * validation or booking.
 */
export function recordClientProductEvent(event: PublicProductEvent) {
  if (typeof window === 'undefined') return

  void fetch('/api/product-events', {
    method: 'POST',
    mode: 'same-origin',
    credentials: 'omit',
    cache: 'no-store',
    keepalive: true,
    referrerPolicy: 'no-referrer',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  }).catch(() => undefined)
}
