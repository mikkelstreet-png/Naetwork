import { NextResponse } from 'next/server';
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
      .select('id, title, company, bio, industries, focus_areas, languages, seniority, years_experience, price_dkk, visibility, review_status, created_at, updated_at')
      .eq('profile_id', profile.id)
      .maybeSingle();
    const { data: bookings } = await admin
      .from('bookings')
      .select('id, starts_at, ends_at, status, payment_status, price_dkk, price_ex_vat_dkk, vat_dkk, contribution_percent, contribution_dkk, platform_fee_dkk, professional_payout_dkk, focus_area, goal, material_url, time_zone, meeting_mode, created_at, updated_at')
      .or(`candidate_profile_id.eq.${profile.id}${professional ? `,professional_profile_id.eq.${professional.id}` : ''}`)
      .order('created_at', { ascending: false });
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
      bookings: bookings ?? [],
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
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Ugyldig forespørgsel.' }, { status: 403 });
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Ikke logget ind.' }, { status: 401 });

    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[account:delete]', error);
    return NextResponse.json({ error: 'Kontoen kunne ikke slettes. Kontakt kontakt@naetwork.dk.' }, { status: 500 });
  }
}
