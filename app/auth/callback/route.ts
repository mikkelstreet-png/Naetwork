import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { EmailOtpType } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { appUrl, sendTransactionalEmail } from '@/lib/server/email';
import { normalizeCategoryAreas } from '@/lib/categories';
import { safeInternalPath } from '@/lib/navigation';
import {
  charityAmount,
  charitySharePercent,
  normalizePayoutPreference,
} from '@/lib/payoutPreference';
import {
  PLATFORM_SHARE_PERCENT,
  PROFESSIONAL_SHARE_PERCENT,
  normalizeLinkedInUrl,
  normalizePrice,
  sessionEconomics,
} from '@/lib/platform';

function text(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function price(value: unknown): number {
  return normalizePrice(value);
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const tokenType = searchParams.get('type');
  const hasEmailToken = Boolean(tokenHash && (tokenType === 'signup' || tokenType === 'recovery'));
  const next = safeInternalPath(searchParams.get('next'));

  if (code || hasEmailToken) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
            } catch {
              // Cookie writes can be unavailable in some server render contexts.
            }
          },
        },
      }
    );
    const { error } = code
      ? await supabase.auth.exchangeCodeForSession(code)
      : await supabase.auth.verifyOtp({
        token_hash: tokenHash!,
        type: tokenType as EmailOtpType,
      });
    if (!error) {
      if (next === '/reset-password') {
        return NextResponse.redirect(new URL(next, origin));
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        const metadata = user?.user_metadata ?? {};

        if (user && metadata.role === 'professional') {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('auth_user_id', user.id)
            .maybeSingle();

          if (profile?.id) {
            const submittedAreas = stringArray(metadata.areas);
            const legacyCategoryValue = text(metadata.industry);
            const payoutPreference = normalizePayoutPreference(metadata.payoutPreference);
            await supabase
              .from('profiles')
              .update({ name: text(metadata.name) ?? user.email })
              .eq('id', profile.id);

            await supabase.from('professional_profiles').upsert({
              profile_id: profile.id,
              title: text(metadata.title),
              company: text(metadata.company),
              bio: text(metadata.bio)?.slice(0, 500) ?? null,
              industries: normalizeCategoryAreas(submittedAreas.length > 0 ? submittedAreas : legacyCategoryValue ? [legacyCategoryValue] : []),
              focus_areas: stringArray(metadata.sessionTypes),
              price_dkk: price(metadata.priceDkk),
              linkedin_url: normalizeLinkedInUrl(metadata.linkedin),
              payout_preference: payoutPreference,
              review_status: 'pending',
              visibility: 'hidden',
            }, { onConflict: 'profile_id' });
          }
        }

        if (user?.email) {
          const isProfessional = metadata.role === 'professional';
          const sessionPrice = price(metadata.priceDkk);
          const economics = sessionEconomics(sessionPrice);
          const payoutPreference = normalizePayoutPreference(metadata.payoutPreference);
          const { data: deliveryProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('auth_user_id', user.id)
            .maybeSingle();
          await sendTransactionalEmail({
            to: user.email,
            templateKey: isProfessional ? 'professional_application_received' : 'welcome',
            recipientProfileId: deliveryProfile?.id,
            dedupeKey: `welcome-${user.id}`,
            subject: isProfessional ? 'Din Naetwork-profil er modtaget' : 'Velkommen til Naetwork',
            title: isProfessional ? 'Din profil er klar til gennemgang' : 'Velkommen til Naetwork',
            intro: isProfessional
              ? `Hej ${text(metadata.name) ?? 'der'}. Din konto er bekræftet. Færdiggør profilen, og send den til gennemgang, før den bliver synlig.`
              : `Hej ${text(metadata.name) ?? 'der'}. Din konto er bekræftet, og du kan nu finde en relevant professionel og sende en bookinganmodning.`,
            rows: isProfessional ? [
              { label: 'Session', value: '60 minutter' },
              { label: 'Pris inkl. moms', value: `DKK ${sessionPrice.toLocaleString('da-DK')}` },
              { label: 'Naetwork', value: `${PLATFORM_SHARE_PERCENT}% / DKK ${economics.platformShare.toLocaleString('da-DK')}` },
              {
                label: 'Kræftens Bekæmpelse',
                value: `${charitySharePercent(payoutPreference)}% / DKK ${charityAmount(sessionPrice, payoutPreference).toLocaleString('da-DK')}`,
              },
              {
                label: 'Din andel',
                value: payoutPreference === 'donate'
                  ? `${PROFESSIONAL_SHARE_PERCENT}% / DKK ${economics.professionalPayout.toLocaleString('da-DK')} doneres også`
                  : `${PROFESSIONAL_SHARE_PERCENT}% / DKK ${economics.professionalPayout.toLocaleString('da-DK')} før skat`,
              },
            ] : undefined,
            note: 'Betaling er ikke aktiveret endnu. Der trækkes ikke noget beløb ved bookinganmodninger.',
            cta: {
              label: isProfessional ? 'Færdiggør profil' : 'Find en professionel',
              href: appUrl(isProfessional ? '/profil/professionel' : '/professionals'),
            },
          }).catch(() => undefined);
        }
      } catch {
        // A profile sync failure should not block login after e-mail confirmation.
      }

      return NextResponse.redirect(new URL(next, origin));
    }
  }

  if (next === '/reset-password') {
    return NextResponse.redirect(`${origin}/forgot-password?error=invalid_link`);
  }
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
