import 'server-only';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export type BookingParticipantRole = 'candidate' | 'professional';

export type BookingParticipantOptions = Readonly<{
  /**
   * Use this for role-specific endpoints. A participant who does not have the
   * required relationship receives the same not-found result as a stranger.
   */
  requiredRole?: BookingParticipantRole;
}>;

export type ParticipantBooking = Readonly<{
  id: string;
  candidate_profile_id: string | null;
  professional_profile_id: string | null;
  slot_id: string | null;
  starts_at: string;
  ends_at: string;
  status: string;
  price_dkk: number | null;
  payment_status: string | null;
  session_type: string | null;
  focus_area: string | null;
  goal: string | null;
  material_url: string | null;
  message_to_professional: string | null;
  time_zone: string | null;
  meeting_mode: string | null;
  meeting_url: string | null;
  created_at: string;
  updated_at: string;
}>;

export type BookingParticipantActor = Readonly<{
  authUserId: string;
  profileId: string;
  name: string | null;
  /**
   * This is the actor's relationship to this booking. It is intentionally not
   * derived from profiles.role or authentication metadata.
   */
  role: BookingParticipantRole;
  participantRoles: readonly BookingParticipantRole[];
  professionalProfileId: string | null;
}>;

export type BookingParticipantContext = Readonly<{
  admin: ReturnType<typeof createAdminClient>;
  actor: BookingParticipantActor;
  booking: ParticipantBooking;
}>;

export type BookingParticipantFailure =
  | Readonly<{
      ok: false;
      code: 'unauthenticated';
      status: 401;
      message: 'Log ind for at fortsætte.';
    }>
  | Readonly<{
      ok: false;
      code: 'not_found';
      status: 404;
      message: 'Bookingen blev ikke fundet.';
    }>;

export type BookingParticipantResolution =
  | Readonly<{ ok: true; context: BookingParticipantContext }>
  | BookingParticipantFailure;

const BOOKING_SELECT = [
  'id',
  'candidate_profile_id',
  'professional_profile_id',
  'slot_id',
  'starts_at',
  'ends_at',
  'status',
  'price_dkk',
  'payment_status',
  'session_type',
  'focus_area',
  'goal',
  'material_url',
  'message_to_professional',
  'time_zone',
  'meeting_mode',
  'meeting_url',
  'created_at',
  'updated_at',
].join(', ');

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function unauthenticated(): BookingParticipantFailure {
  return {
    ok: false,
    code: 'unauthenticated',
    status: 401,
    message: 'Log ind for at fortsætte.',
  };
}

function notFound(): BookingParticipantFailure {
  return {
    ok: false,
    code: 'not_found',
    status: 404,
    message: 'Bookingen blev ikke fundet.',
  };
}

/**
 * Resolves an authenticated user to a participant relationship on one booking.
 *
 * This helper deliberately uses auth.getUser() for server-verified identity and
 * a service-role client only after that identity has been mapped to an active
 * profile. All authorization is based on booking foreign-key relationships.
 */
export async function resolveBookingParticipant(
  bookingId: string,
  options: BookingParticipantOptions = {},
): Promise<BookingParticipantResolution> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthenticated();

  const admin = createAdminClient();
  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .select('id, auth_user_id, name')
    .eq('auth_user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  if (profileError) throw profileError;
  if (!profile || !UUID_PATTERN.test(bookingId)) return notFound();

  const { data: bookingData, error: bookingError } = await admin
    .from('bookings')
    .select(BOOKING_SELECT)
    .eq('id', bookingId)
    .maybeSingle();

  if (bookingError) throw bookingError;
  const booking = bookingData as unknown as ParticipantBooking | null;
  if (!booking) return notFound();

  let bookedProfessional: { id: string; profile_id: string } | null = null;
  if (booking.professional_profile_id) {
    const { data, error } = await admin
      .from('professional_profiles')
      .select('id, profile_id')
      .eq('id', booking.professional_profile_id)
      .maybeSingle();

    if (error) throw error;
    bookedProfessional = data;
  }

  const isCandidate = booking.candidate_profile_id === profile.id;
  const isProfessional = bookedProfessional?.profile_id === profile.id;
  if (!isCandidate && !isProfessional) return notFound();

  const participantRoles: BookingParticipantRole[] = [];
  if (isCandidate) participantRoles.push('candidate');
  if (isProfessional) participantRoles.push('professional');

  if (options.requiredRole && !participantRoles.includes(options.requiredRole)) {
    return notFound();
  }

  const role = options.requiredRole ?? (isCandidate ? 'candidate' : 'professional');

  return {
    ok: true,
    context: {
      admin,
      actor: {
        authUserId: user.id,
        profileId: profile.id,
        name: profile.name,
        role,
        participantRoles,
        professionalProfileId: isProfessional ? bookedProfessional?.id ?? null : null,
      },
      booking,
    },
  };
}
