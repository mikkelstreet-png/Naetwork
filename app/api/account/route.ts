import { NextResponse } from 'next/server';
import { sendTransactionalEmail } from '@/lib/server/email';
import { isSameSiteRequest } from '@/lib/server/requestSecurity';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Ikke logget ind.' }, { status: 401 });

    const admin = createAdminClient();
    const { data: profile } = await admin
      .from('profiles')
      .select('id, name, email, role, status, notification_booking_reminders, notification_marketing, terms_accepted_at, terms_version, privacy_noticed_at, privacy_version, created_at, updated_at')
      .eq('auth_user_id', user.id)
      .single();
    if (!profile) return NextResponse.json({ error: 'Profilen blev ikke fundet.' }, { status: 404 });

    const { data: professional } = await admin
      .from('professional_profiles')
      .select('id, title, company, bio, industries, focus_areas, languages, seniority, years_experience, price_dkk, payout_preference, visibility, review_status, created_at, updated_at')
      .eq('profile_id', profile.id)
      .maybeSingle();
    const { data: bookings } = await admin
      .from('bookings')
      .select('id, candidate_profile_id, professional_profile_id, starts_at, ends_at, status, payment_status, price_dkk, price_ex_vat_dkk, vat_dkk, contribution_percent, minimum_contribution_dkk, professional_donation_dkk, contribution_dkk, payout_preference, platform_fee_dkk, professional_payout_dkk, focus_area, goal, material_url, time_zone, meeting_mode, created_at, updated_at')
      .or(`candidate_profile_id.eq.${profile.id}${professional ? `,professional_profile_id.eq.${professional.id}` : ''}`)
      .order('created_at', { ascending: false });
    const bookingRows = bookings ?? [];
    const bookingIds = bookingRows.map((booking) => booking.id);
    const [{ data: sessionPlans }, { data: outcomeRows }] = bookingIds.length
      ? await Promise.all([
          admin
            .from('session_plans')
            .select('booking_id, problem, context, desired_outcome, definition_of_done, key_questions, anything_else, preparation_status, prepared_at, created_at, updated_at')
            .in('booking_id', bookingIds),
          admin
            .from('session_outcomes')
            .select('id, booking_id, candidate_profile_id, professional_profile_id, summary, recommendation, decisions, definition_of_done_status, open_questions, result_status, result_schema_version, published_at, created_at, updated_at')
            .in('booking_id', bookingIds),
        ])
      : [{ data: [] }, { data: [] }];
    const visibleOutcomes = (outcomeRows ?? []).filter((outcome) => (
      (outcome.candidate_profile_id === profile.id && outcome.result_status === 'published')
      || (professional?.id && outcome.professional_profile_id === professional.id)
    ));
    const outcomeIds = visibleOutcomes.map((outcome) => outcome.id);
    const { data: nextMoves } = outcomeIds.length
      ? await admin
          .from('session_plan_next_moves')
          .select('session_outcome_id, position, action, responsible, due_at, status, completed_at, created_at, updated_at')
          .in('session_outcome_id', outcomeIds)
          .order('position', { ascending: true })
      : { data: [] };
    const { data: consentEvents } = await admin
      .from('marketing_consent_events')
      .select('granted, occurred_at')
      .eq('profile_id', profile.id)
      .order('occurred_at', { ascending: false });

    const exportData = {
      exportedAt: new Date().toISOString(),
      service: 'Naetwork',
      account: profile,
      professionalProfile: professional,
      bookings: bookingRows,
      sessionPlans: sessionPlans ?? [],
      sessionOutcomes: visibleOutcomes,
      sessionNextMoves: nextMoves ?? [],
      marketingConsentHistory: consentEvents ?? [],
    };
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="naetwork-data-${new Date().toISOString().slice(0, 10)}.json"`,
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error) {
    console.error('[account:export]', error);
    return NextResponse.json({ error: 'Dataeksporten kunne ikke oprettes.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isSameSiteRequest(request)) {
    return NextResponse.json({ error: 'Ugyldig forespørgsel.' }, { status: 403 });
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Ikke logget ind.' }, { status: 401 });

    const admin = createAdminClient();
    const { data: profile } = await admin.from('profiles').select('name').eq('auth_user_id', user.id).maybeSingle();
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) throw error;

    let notificationSent = false;
    if (user.email) {
      await sendTransactionalEmail({
        to: user.email,
        templateKey: 'account_deleted',
        dedupeKey: `account-deleted-${user.id}`,
        subject: 'Din Naetwork-konto er slettet',
        title: 'Kontoen er slettet',
        intro: `Hej ${profile?.name || 'der'}. Vi bekræfter, at din Naetwork-konto er blevet slettet.`,
        note: 'Lovpligtige eller nødvendige registreringer kan fortsat opbevares i det omfang, det fremgår af privatlivspolitikken.',
      }).then(() => { notificationSent = true; }).catch((mailError) => console.error('[account:delete-email]', mailError));
    }

    return NextResponse.json({ ok: true, notificationSent });
  } catch (error) {
    console.error('[account:delete]', error);
    return NextResponse.json({ error: 'Kontoen kunne ikke slettes. Kontakt kontakt@naetwork.dk.' }, { status: 500 });
  }
}
