import { NextResponse } from 'next/server';
import { appUrl, sendTransactionalEmail } from '@/lib/server/email';
import { claimAuthEmailRequest, markAuthEmailSent } from '@/lib/server/authEmailRateLimit';
import { createAdminClient } from '@/lib/supabase/admin';

function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Ugyldig forespørgsel.' }, { status: 403 });
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, 254) : '';
    if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: 'Indtast en gyldig e-mailadresse.' }, { status: 400 });

    const requestId = await claimAuthEmailRequest(email, 'recovery');
    if (!requestId) return NextResponse.json({ ok: true });

    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: { redirectTo: appUrl('/auth/callback?next=/reset-password') },
    });
    if (error) {
      if (/not found|invalid/i.test(error.message)) return NextResponse.json({ ok: true });
      throw error;
    }

    const { data: profile } = await admin.from('profiles').select('id, name').eq('auth_user_id', data.user.id).maybeSingle();
    await sendTransactionalEmail({
      to: email,
      templateKey: 'password_reset',
      recipientProfileId: profile?.id,
      dedupeKey: `password-reset-${requestId}`,
      subject: 'Nulstil din adgangskode til Naetwork',
      previewText: 'Brug det sikre engangslink til at vælge en ny adgangskode.',
      title: 'Nulstil din adgangskode',
      intro: `Hej ${profile?.name || 'der'}. Vi har modtaget en anmodning om at nulstille adgangskoden til din Naetwork-konto.`,
      note: 'Linket kan kun bruges én gang. Hvis du ikke bad om det, kan du ignorere mailen og beholde din nuværende adgangskode.',
      cta: { label: 'Vælg ny adgangskode', href: data.properties.action_link },
    });
    await markAuthEmailSent(requestId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[auth:password-reset]', error);
    return NextResponse.json({ error: 'Nulstillingsmailen kunne ikke sendes lige nu.' }, { status: 500 });
  }
}
