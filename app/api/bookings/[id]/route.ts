import { NextResponse } from 'next/server';
import { formatSessionDate } from '@/lib/dateTime';
import { appUrl, sendTransactionalEmail } from '@/lib/server/email';
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
      .select('id, candidate_profile_id, professional_profile_id, slot_id, starts_at, ends_at, status, price_dkk, payment_status, message_to_professional')
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
      .select('name, auth_user_id')
      .eq('id', booking.candidate_profile_id)
      .single();
    const { data: owner } = professional ? await admin
      .from('profiles')
      .select('name, auth_user_id')
      .eq('id', professional.profile_id)
      .single() : { data: null };

    const candidateUser = candidate ? await admin.auth.admin.getUserById(candidate.auth_user_id) : null;
    const professionalUser = owner ? await admin.auth.admin.getUserById(owner.auth_user_id) : null;
    const recipient = isProfessional ? candidateUser?.data.user?.email : professionalUser?.data.user?.email;
    const recipientName = isProfessional ? candidate?.name : owner?.name;
    const actorName = actor.name || (isProfessional ? 'Den professionelle' : 'Kandidaten');

    if (recipient) {
      const emailCopy = status === 'confirmed'
        ? { subject: 'Din Naetwork-session er bekræftet', title: 'Tidspunktet er bekræftet', intro: `Hej ${recipientName || 'der'}. ${actorName} har bekræftet jeres 60-minutters session.`, cta: 'Se sessionen' }
        : status === 'completed'
          ? { subject: 'Hvordan var din Naetwork-session?', title: 'Sessionen er gennemført', intro: `Hej ${recipientName || 'der'}. Tak for din session. Din feedback hjælper Naetwork med at sikre kvaliteten.`, cta: 'Giv feedback' }
          : { subject: 'Din Naetwork-session er aflyst', title: 'Sessionen er aflyst', intro: `Hej ${recipientName || 'der'}. ${actorName} har aflyst bookinganmodningen.`, cta: 'Se bookingen' };
      await sendTransactionalEmail({
        to: recipient,
        templateKey: status === 'confirmed' ? 'booking_confirmed' : status === 'completed' ? 'feedback_request' : 'booking_cancelled',
        subject: emailCopy.subject,
        title: emailCopy.title,
        intro: emailCopy.intro,
        rows: [
          { label: 'Tidspunkt', value: formatSessionDate(booking.starts_at) },
          { label: 'Status', value: status === 'confirmed' ? 'Bekræftet' : status === 'completed' ? 'Gennemført' : 'Aflyst' },
        ],
        note: 'Betaling er ikke aktiveret endnu. Ingen beløb er trukket.',
        cta: { label: emailCopy.cta, href: appUrl('/profil/bookings') },
      }).catch(async () => {
        await admin.from('booking_events').insert({
          booking_id: id,
          event_type: 'notification_failed',
          notes: `Status email failed after ${status}.`,
        });
      });
    }

    return NextResponse.json({ ok: true, status });
  } catch (error) {
    console.error('[bookings:update]', error);
    return NextResponse.json({ error: 'Bookingen kunne ikke opdateres.' }, { status: 500 });
  }
}
