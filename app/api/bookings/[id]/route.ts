import { NextResponse } from 'next/server';
import { formatSessionDate } from '@/lib/dateTime';
import { appUrl, sendTransactionalEmail } from '@/lib/server/email';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

type BookingAction = 'confirm' | 'cancel';

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
    if (!['confirm', 'cancel'].includes(action)) {
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
      .select('id, candidate_profile_id, professional_profile_id, starts_at, ends_at, status, price_dkk, message_to_professional')
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

    if ((!isProfessional && !isCandidate) || (action === 'confirm' && !isProfessional)) {
      return NextResponse.json({ error: 'Du har ikke adgang til handlingen.' }, { status: 403 });
    }
    if (!['requested', 'pending', 'confirmed', 'rescheduled'].includes(booking.status)) {
      return NextResponse.json({ error: 'Bookingen kan ikke ændres i sin nuværende status.' }, { status: 409 });
    }

    const status = action === 'confirm' ? 'confirmed' : 'cancelled';
    const { error: updateError } = await admin.from('bookings').update({ status }).eq('id', id);
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
      await sendTransactionalEmail({
        to: recipient,
        subject: status === 'confirmed' ? 'Din Naetwork-session er bekræftet' : 'Din Naetwork-session er aflyst',
        title: status === 'confirmed' ? 'Tidspunktet er bekræftet' : 'Sessionen er aflyst',
        intro: status === 'confirmed'
          ? `Hej ${recipientName || 'der'}. ${actorName} har bekræftet jeres 60-minutters session.`
          : `Hej ${recipientName || 'der'}. ${actorName} har aflyst bookinganmodningen.`,
        rows: [
          { label: 'Tidspunkt', value: formatSessionDate(booking.starts_at) },
          { label: 'Status', value: status === 'confirmed' ? 'Bekræftet' : 'Aflyst' },
        ],
        note: 'Betaling er ikke aktiveret endnu. Ingen beløb er trukket.',
        cta: { label: 'Se mine bookinger', href: appUrl('/profil/bookings') },
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
