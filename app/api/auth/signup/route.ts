import { NextResponse } from 'next/server';
import { PRIVACY_VERSION, TERMS_VERSION } from '@/lib/legal';
import { appUrl, sendTransactionalEmail } from '@/lib/server/email';
import { claimAuthEmailRequest, markAuthEmailSent } from '@/lib/server/authEmailRateLimit';
import { isSameSiteRequest } from '@/lib/server/requestSecurity';
import { areasBelongToCategory, isCategoryArea, isCategoryId } from '@/lib/categories';
import { FOCUS_AREAS, PRICE_OPTIONS, normalizeLinkedInUrl } from '@/lib/platform';
import { normalizePayoutPreference } from '@/lib/payoutPreference';
import { createAdminClient } from '@/lib/supabase/admin';

const FOCUS_IDS = new Set<string>(FOCUS_AREAS.map((focus) => focus.id));
const PRICES = new Set<number>(PRICE_OPTIONS);

function clean(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function POST(request: Request) {
  if (!isSameSiteRequest(request)) return NextResponse.json({ error: 'Ugyldig forespørgsel.' }, { status: 403 });

  let createdUserId: string | null = null;
  try {
    const body = await request.json();
    const name = clean(body.name, 100);
    const email = clean(body.email, 254).toLowerCase();
    const password = typeof body.password === 'string' ? body.password : '';
    const role = body.role === 'professional' ? 'professional' : 'candidate';

    if (!body.accepted || name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8 || password.length > 128) {
      return NextResponse.json({ error: 'Kontrollér navn, e-mail, adgangskode og accept af vilkår.' }, { status: 400 });
    }

    const metadata: Record<string, unknown> = {
      name,
      role,
      termsAcceptedAt: new Date().toISOString(),
      termsVersion: TERMS_VERSION,
      privacyNoticedAt: new Date().toISOString(),
      privacyVersion: PRIVACY_VERSION,
    };

    if (role === 'professional') {
      const title = clean(body.title, 100);
      const company = clean(body.company, 100);
      const category = clean(body.category, 40);
      const areas = Array.isArray(body.areas)
        ? Array.from(new Set<string>(body.areas.filter((item: unknown) => isCategoryArea(item)) as string[]))
        : [];
      const bio = clean(body.bio, 500);
      const linkedin = normalizeLinkedInUrl(body.linkedin);
      const priceDkk = Number(body.priceDkk);
      const payoutPreference = normalizePayoutPreference(body.payoutPreference);
      const sessionTypes = Array.isArray(body.sessionTypes)
        ? Array.from(new Set(body.sessionTypes.filter((item: unknown): item is string => typeof item === 'string' && FOCUS_IDS.has(item))))
        : [];
      if (!title || !company || !isCategoryId(category) || !areasBelongToCategory(category, areas) || !linkedin || !PRICES.has(priceDkk) || sessionTypes.length === 0) {
        return NextResponse.json({ error: 'Den professionelle profil mangler obligatoriske eller gyldige oplysninger.' }, { status: 400 });
      }
      Object.assign(metadata, { title, company, category, areas, bio, linkedin, sessionTypes, priceDkk, payoutPreference });
    }

    const requestId = await claimAuthEmailRequest(email, 'signup');
    if (!requestId) return NextResponse.json({ error: 'Der er sendt flere anmodninger på kort tid. Vent et øjeblik, og prøv igen.' }, { status: 429 });

    const admin = createAdminClient();
    const nextPath = role === 'professional' ? '/profil/professionel' : '/match';
    const { data, error } = await admin.auth.admin.generateLink({
      type: 'signup',
      email,
      password,
      options: { data: metadata },
    });
    if (error) {
      if (/already|registered|exists/i.test(error.message)) {
        return NextResponse.json({ error: 'Der findes allerede en konto med denne e-mail. Prøv at logge ind.' }, { status: 409 });
      }
      throw error;
    }

    createdUserId = data.user.id;
    const verificationLink = appUrl(
      `/auth/callback?token_hash=${encodeURIComponent(data.properties.hashed_token)}&type=signup&next=${encodeURIComponent(nextPath)}`
    );
    const { data: profile } = await admin.from('profiles').select('id').eq('auth_user_id', data.user.id).maybeSingle();
    await sendTransactionalEmail({
      to: email,
      templateKey: 'verify_email',
      recipientProfileId: profile?.id,
      dedupeKey: `verify-email-${data.user.id}`,
      subject: 'Bekræft din e-mail til Naetwork',
      previewText: 'Bekræft din e-mail for at aktivere din Naetwork-konto.',
      title: 'Bekræft din e-mail',
      intro: `Hej ${name}. Bekræft din e-mailadresse for at aktivere din ${role === 'professional' ? 'professionelle profil' : 'konto'} på Naetwork.`,
      note: 'Linket kan kun bruges én gang. Hvis du ikke har oprettet kontoen, kan du ignorere denne mail.',
      cta: { label: 'Bekræft e-mail', href: verificationLink },
    });
    await markAuthEmailSent(requestId);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (createdUserId) await createAdminClient().auth.admin.deleteUser(createdUserId).catch(() => undefined);
    console.error('[auth:signup]', error);
    return NextResponse.json({ error: 'Kontoen kunne ikke oprettes lige nu. Prøv igen.' }, { status: 500 });
  }
}
