import { NextResponse } from 'next/server';
import { formatSessionDate } from '@/lib/dateTime';
import { appUrl, cancelScheduledBookingEmails, sendTransactionalEmail } from '@/lib/server/email';
import { focusLabel } from '@/lib/platform';
import { isSessionTypeId, sessionType } from '@/lib/sessionTypes';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

type BookingAction = 'confirm' | 'cancel' | 'complete';

function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Ugyldig forespørgsel.' }, { status: 403 });

  try {
    const { id } = await context.params;
    const body = await request.json();
    const action = body.action as BookingAction;
    if (!['confirm', 'cancel', 'complete'].includes(action)) {
      return NextResponse.json({ error: 'Ukendt handling.' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Log ind for at fortsætte.' }, { status: 401 });

    const admin = createAdminClient();
    const { data: actor } = await admin
      .from('profiles')
      .select('id, name')
      .eq('auth_user_id', user.id)
      .single();
    if (!actor) return NextResponse.json({ error: 'Profilen blev ikke fundet.' }, { status: 403 });

    const { data: booking } = await admin
      .from('bookings')
      .select('id, candidate_profile_id, professional_profile_id, slot_id, starts_at, ends_at, status, price_dkk, payment_status, message_to_professional, meeting_url, session_type, focus_area')
      .eq('id', id)
      .single();
    if (!booking) return NextResponse.json({ error: 'Bookingen blev ikke fundet.' }, { status: 404 });

    const { data: professional } = await admin
      .from('professional_profiles')
      .select('id, profile_id, title')
      .eq('id', booking.professional_profile_id)
      .single();
    const isProfessional = professional?.profile_id === actor.id;
    const isCandidate = booking.candidate_profile_id === actor.id;

    if ((!isProfessional && !isCandidate) || (['confirm', 'complete'].includes(action) && !isProfessional)) {
      return NextResponse.json({ error: 'Du har ikke adgang til handlingen.' }, { status: 403 });
    }
    const canComplete = action === 'complete' && ['confirmed', 'rescheduled'].includes(booking.status) && new Date(booking.ends_at).getTime() <= Date.now();
    const canUpdateActive = action !== 'complete' && ['requested', 'pending', 'confirmed', 'rescheduled'].includes(booking.status);
    if (!canComplete && !canUpdateActive) {
      return NextResponse.json({ error: 'Bookingen kan ikke ændres i sin nuværende status.' }, { status: 409 });
    }

    const status = action === 'confirm' ? 'confirmed' : action === 'complete' ? 'completed' : 'cancelled';
    const cancellation = action === 'cancel' ? { cancelled_at: new Date().toISOString(), cancelled_by: actor.id } : {};
    const { error: updateError } = await admin.from('bookings').update({ status, ...cancellation }).eq('id', id);
    if (updateError) {
      if (updateError.code === '23P01') {
        return NextResponse.json({ error: 'Tidspunktet overlapper en anden bekræftet session.' }, { status: 409 });
      }
      throw updateError;
    }

    await admin.from('booking_events').insert({
      booking_id: id,
      event_type: status,
      triggered_by: actor.id,
      notes: isProfessional ? 'Updated by professional.' : 'Cancelled by candidate.',
    });

    if (action === 'cancel' && booking.slot_id && new Date(booking.starts_at).getTime() > Date.now()) {
      await admin.from('availability_slots').update({ is_available: true, updated_at: new Date().toISOString() }).eq('id', booking.slot_id);
    }

    const { data: candidate } = await admin
      .from('profiles')
      .select('id, name, auth_user_id, notification_booking_reminders')
      .eq('id', booking.candidate_profile_id)
      .single();
    const { data: owner } = professional ? await admin
      .from('profiles')
      .select('id, name, auth_user_id, notification_booking_reminders')
      .eq('id', professional.profile_id)
      .single() : { data: null };

    const candidateUser = candidate ? await admin.auth.admin.getUserById(candidate.auth_user_id) : null;
    const professionalUser = owner ? await admin.auth.admin.getUserById(owner.auth_user_id) : null;
    const actorName = actor.name || (isProfessional ? 'Den professionelle' : 'Kandidaten');
    const candidateEmail = candidateUser?.data.user?.email;
    const professionalEmail = professionalUser?.data.user?.email;
    const sessionDate = formatSessionDate(booking.starts_at);
    const sessionLabel = isSessionTypeId(booking.session_type)
      ? sessionType(booking.session_type).title.da
      : focusLabel(booking.focus_area || '', 'da');
    const rows = [
      { label: 'Tidspunkt', value: sessionDate },
      { label: 'Sessionstype', value: sessionLabel },
      { label: 'Status', value: status === 'confirmed' ? 'Bekræftet' : status === 'completed' ? 'Gennemført' : 'Aflyst' },
    ];
    const notifications: Array<Promise<unknown>> = [];

    if (status === 'confirmed') {
      if (candidateEmail) notifications.push(sendTransactionalEmail({
        to: candidateEmail,
        templateKey: 'booking_confirmed',
        bookingId: id,
        recipientProfileId: candidate?.id,
        dedupeKey: `booking-confirmed-candidate-${id}`,
        subject: 'Din Naetwork-session er bekræftet',
        title: 'Tidspunktet er bekræftet',
        intro: `Hej ${candidate?.name || 'der'}. ${actorName} har bekræftet jeres 60-minutters session.`,
        rows,
        note: 'Betaling er ikke aktiveret endnu. Ingen beløb er trukket.',
        cta: { label: 'Se sessionen', href: appUrl('/profil/bookings') },
      }));
      if (professionalEmail) notifications.push(sendTransactionalEmail({
        to: professionalEmail,
        templateKey: 'booking_confirmed',
        bookingId: id,
        recipientProfileId: owner?.id,
        dedupeKey: `booking-confirmed-professional-${id}`,
        subject: 'Du har bekræftet en Naetwork-session',
        title: 'Sessionen er bekræftet',
        intro: `Hej ${owner?.name || 'der'}. Bookingen med ${candidate?.name || 'kandidaten'} er nu bekræftet.`,
        rows,
        note: booking.message_to_professional || 'Kandidaten har ikke tilføjet et ekstra brief.',
        cta: { label: 'Se sessionen', href: appUrl('/profil/bookings') },
      }));

      const reminderAt = new Date(new Date(booking.starts_at).getTime() - 24 * 60 * 60 * 1000);
      const canScheduleNow = reminderAt.getTime() <= Date.now() + 29 * 24 * 60 * 60 * 1000;
      const scheduledAt = reminderAt.getTime() > Date.now() + 10 * 60 * 1000 ? reminderAt.toISOString() : undefined;
      if (canScheduleNow && candidateEmail && candidate?.notification_booking_reminders) notifications.push(sendTransactionalEmail({
        to: candidateEmail,
        templateKey: 'booking_reminder_candidate',
        bookingId: id,
        recipientProfileId: candidate.id,
        dedupeKey: `booking-reminder-candidate-${id}`,
        scheduledAt,
        subject: 'Påmindelse om din Naetwork-session',
        title: 'Din session nærmer sig',
        intro: `Hej ${candidate.name || 'der'}. Her er tidspunkt og fokus for din kommende 60-minutters session.`,
        rows: [{ label: 'Tidspunkt', value: sessionDate }, { label: 'Sessionstype', value: sessionLabel }],
        note: booking.meeting_url ? `Mødelink: ${booking.meeting_url}` : 'Mødelinket vises i din booking, når det er tilføjet.',
        cta: { label: 'Forbered sessionen', href: appUrl('/profil/bookings') },
      }));
      if (canScheduleNow && professionalEmail && owner?.notification_booking_reminders) notifications.push(sendTransactionalEmail({
        to: professionalEmail,
        templateKey: 'booking_reminder_professional',
        bookingId: id,
        recipientProfileId: owner.id,
        dedupeKey: `booking-reminder-professional-${id}`,
        scheduledAt,
        subject: 'Påmindelse om din kommende Naetwork-session',
        title: 'Sessionen nærmer sig',
        intro: `Hej ${owner.name || 'der'}. Du har en session med ${candidate?.name || 'en kandidat'} på det angivne tidspunkt.`,
        rows: [{ label: 'Tidspunkt', value: sessionDate }, { label: 'Sessionstype', value: sessionLabel }],
        note: booking.message_to_professional || 'Kandidaten har ikke tilføjet et ekstra brief.',
        cta: { label: 'Se kandidatens brief', href: appUrl('/profil/bookings') },
      }));
    } else if (status === 'completed' && candidateEmail) {
      notifications.push(sendTransactionalEmail({
        to: candidateEmail,
        templateKey: 'feedback_request',
        bookingId: id,
        recipientProfileId: candidate?.id,
        dedupeKey: `feedback-request-${id}`,
        subject: 'Hvordan var din Naetwork-session?',
        title: 'Sessionen er gennemført',
        intro: `Hej ${candidate?.name || 'der'}. Tak for din session. Din feedback hjælper Naetwork med at sikre kvaliteten.`,
        rows,
        cta: { label: 'Giv feedback', href: appUrl('/profil/bookings') },
      }));
    } else if (status === 'cancelled') {
      await cancelScheduledBookingEmails(id).catch(() => undefined);
      for (const participant of [
        { email: candidateEmail, profileId: candidate?.id, name: candidate?.name, role: 'candidate' },
        { email: professionalEmail, profileId: owner?.id, name: owner?.name, role: 'professional' },
      ]) {
        if (!participant.email) continue;
        notifications.push(sendTransactionalEmail({
          to: participant.email,
          templateKey: 'booking_cancelled',
          bookingId: id,
          recipientProfileId: participant.profileId,
          dedupeKey: `booking-cancelled-${participant.role}-${id}`,
          subject: 'Din Naetwork-session er aflyst',
          title: 'Sessionen er aflyst',
          intro: `Hej ${participant.name || 'der'}. ${actorName} har aflyst bookinganmodningen.`,
          rows,
          note: 'Betaling er ikke aktiveret endnu. Ingen beløb er trukket.',
          cta: { label: 'Se bookingen', href: appUrl('/profil/bookings') },
        }));
      }
    }

    const results = await Promise.allSettled(notifications);
    if (results.some((result) => result.status === 'rejected')) {
      await admin.from('booking_events').insert({
        booking_id: id,
        event_type: 'notification_failed',
        notes: `One or more status emails failed after ${status}.`,
      });
    }

    return NextResponse.json({ ok: true, status });
  } catch (error) {
    console.error('[bookings:update]', error);
    return NextResponse.json({ error: 'Bookingen kunne ikke opdateres.' }, { status: 500 });
  }
}
