import { NextResponse } from 'next/server';
import { formatSessionDate } from '@/lib/dateTime';
import { focusLabel } from '@/lib/platform';
import { isSessionTypeId, sessionType } from '@/lib/sessionTypes';
import { appUrl, sendTransactionalEmail } from '@/lib/server/email';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = Date.now();
    const from = new Date(now + 20 * 60 * 60 * 1000).toISOString();
    const to = new Date(now + 44 * 60 * 60 * 1000).toISOString();
    const admin = createAdminClient();
    const { data: bookings, error } = await admin.from('bookings')
      .select('id, candidate_profile_id, professional_profile_id, starts_at, session_type, focus_area, message_to_professional, meeting_url')
      .in('status', ['confirmed', 'rescheduled'])
      .eq('reminder_requested', true)
      .gte('starts_at', from)
      .lt('starts_at', to);
    if (error) throw error;

    let sent = 0;
    let skipped = 0;
    let failed = 0;
    for (const booking of bookings ?? []) {
      const [{ data: candidate }, { data: professional }] = await Promise.all([
        admin.from('profiles').select('id, name, auth_user_id, notification_booking_reminders').eq('id', booking.candidate_profile_id).maybeSingle(),
        admin.from('professional_profiles').select('id, profile_id').eq('id', booking.professional_profile_id).maybeSingle(),
      ]);
      const { data: owner } = professional
        ? await admin.from('profiles').select('id, name, auth_user_id, notification_booking_reminders').eq('id', professional.profile_id).maybeSingle()
        : { data: null };
      const [candidateUser, professionalUser] = await Promise.all([
        candidate ? admin.auth.admin.getUserById(candidate.auth_user_id) : Promise.resolve(null),
        owner ? admin.auth.admin.getUserById(owner.auth_user_id) : Promise.resolve(null),
      ]);
      const sessionDate = formatSessionDate(booking.starts_at);
      const focus = isSessionTypeId(booking.session_type)
        ? sessionType(booking.session_type).title.da
        : focusLabel(booking.focus_area || '', 'da');
      const deliveries: Array<Promise<{ duplicate: boolean }>> = [];

      const candidateEmail = candidateUser?.data.user?.email;
      if (candidateEmail && candidate?.notification_booking_reminders) deliveries.push(sendTransactionalEmail({
        to: candidateEmail,
        templateKey: 'booking_reminder_candidate',
        bookingId: booking.id,
        recipientProfileId: candidate.id,
        dedupeKey: `booking-reminder-candidate-${booking.id}`,
        subject: 'Påmindelse om din Naetwork-session',
        title: 'Din session nærmer sig',
        intro: `Hej ${candidate.name || 'der'}. Her er tidspunkt og fokus for din kommende 60-minutters session.`,
        rows: [{ label: 'Tidspunkt', value: sessionDate }, { label: 'Sessionstype', value: focus }],
        note: booking.meeting_url ? `Mødelink: ${booking.meeting_url}` : 'Mødelinket vises i din booking, når det er tilføjet.',
        cta: { label: 'Forbered Session Plan', href: appUrl(`/profil/bookings/${booking.id}`) },
      }));

      const professionalEmail = professionalUser?.data.user?.email;
      if (professionalEmail && owner?.notification_booking_reminders) deliveries.push(sendTransactionalEmail({
        to: professionalEmail,
        templateKey: 'booking_reminder_professional',
        bookingId: booking.id,
        recipientProfileId: owner.id,
        dedupeKey: `booking-reminder-professional-${booking.id}`,
        subject: 'Påmindelse om din kommende Naetwork-session',
        title: 'Sessionen nærmer sig',
        intro: `Hej ${owner.name || 'der'}. Du har en session med ${candidate?.name || 'en kandidat'} på det angivne tidspunkt.`,
        rows: [{ label: 'Tidspunkt', value: sessionDate }, { label: 'Sessionstype', value: focus }],
        note: booking.message_to_professional || 'Kandidaten har ikke tilføjet et ekstra brief.',
        cta: { label: 'Se kandidatens Session Plan', href: appUrl(`/profil/bookings/${booking.id}`) },
      }));

      const results = await Promise.allSettled(deliveries);
      for (const result of results) {
        if (result.status === 'rejected') failed += 1;
        else if (result.value.duplicate) skipped += 1;
        else sent += 1;
      }
    }

    return NextResponse.json({ ok: true, bookings: bookings?.length ?? 0, sent, skipped, failed });
  } catch (error) {
    console.error('[cron:booking-reminders]', error);
    return NextResponse.json({ error: 'Reminder job failed.' }, { status: 500 });
  }
}
