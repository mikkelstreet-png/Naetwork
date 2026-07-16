import { NextResponse } from 'next/server';
import { appUrl, sendTransactionalEmail } from '@/lib/server/email';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: 'Ugyldig forespørgsel.' }, { status: 403 });
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return NextResponse.json({ error: 'Ikke logget ind.' }, { status: 401 });
    const { data: profile } = await createAdminClient().from('profiles').select('id, name').eq('auth_user_id', user.id).maybeSingle();
    await sendTransactionalEmail({
      to: user.email,
      templateKey: 'password_changed',
      recipientProfileId: profile?.id,
      dedupeKey: `password-changed-${user.id}-${Math.floor(Date.now() / 60_000)}`,
      subject: 'Din adgangskode til Naetwork er ændret',
      title: 'Adgangskoden er ændret',
      intro: `Hej ${profile?.name || 'der'}. Adgangskoden til din Naetwork-konto er netop blevet ændret.`,
      note: 'Hvis det ikke var dig, skal du straks nulstille adgangskoden og kontakte Naetwork.',
      cta: { label: 'Kontakt Naetwork', href: appUrl('/contact') },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[auth:password-changed]', error);
    return NextResponse.json({ error: 'Bekræftelsesmailen kunne ikke sendes.' }, { status: 500 });
  }
}
