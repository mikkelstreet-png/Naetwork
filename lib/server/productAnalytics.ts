import type { createAdminClient } from '@/lib/supabase/admin'

type AdminClient = ReturnType<typeof createAdminClient>

interface ProductEventInput {
  eventName: string
  profileId?: string | null
  professionalProfileId?: string | null
  bookingId?: string | null
  properties?: Record<string, string | number | boolean | null>
}

/**
 * Records only data-minimised, necessary marketplace events. Analytics must
 * never be allowed to block the user's primary action.
 */
export async function recordProductEvent(admin: AdminClient, input: ProductEventInput) {
  const { error } = await admin.from('analytics_events').insert({
    event_name: input.eventName,
    profile_id: input.profileId ?? null,
    professional_profile_id: input.professionalProfileId ?? null,
    booking_id: input.bookingId ?? null,
    properties: input.properties ?? {},
    consent_level: 'necessary',
  })

  if (error) console.error('[product-analytics]', input.eventName, error.code)
}
