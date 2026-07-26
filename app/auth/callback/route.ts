import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { EmailOtpType } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';
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
import {
  EXPERIENCE_SUMMARY_MAX_LENGTH,
  cleanProfileList,
  cleanProfileText,
} from '@/lib/professionalProfile';
import { createAdminClient } from '@/lib/supabase/admin';

function text(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function price(value: unknown): number {
  return normalizePrice(value);
}

async function syncVerifiedProfile(user: User) {
  const metadata = user.user_metadata ?? {};
  const requestedRole = metadata.role === 'professional' ? 'professional' : 'candidate';
  const admin = createAdminClient();
  const { data: existingProfile, error: existingProfileError } = await admin
    .from('profiles')
    .select('id, role')
    .eq('auth_user_id', user.id)
    .maybeSingle();
  if (existingProfileError) throw existingProfileError;

  let profile = existingProfile;
  if (profile) {
    const { error: nameError } = await admin
      .from('profiles')
      .update({ name: text(metadata.name) ?? user.email ?? 'Naetwork-bruger' })
      .eq('id', profile.id);
    if (nameError) throw nameError;
  } else {
    const { data: insertedProfile, error: insertProfileError } = await admin
      .from('profiles')
      .insert({
        auth_user_id: user.id,
        name: text(metadata.name) ?? user.email ?? 'Naetwork-bruger',
        email: user.email ?? null,
        role: requestedRole,
      })
      .select('id, role')
      .single();
    if (insertProfileError || !insertedProfile) {
      throw insertProfileError ?? new Error('The verified profile could not be created.');
    }
    profile = insertedProfile;
  }

  const { data: persistedProfile, error: persistedProfileError } = await admin
    .from('profiles')
    .select('id, role')
    .eq('id', profile.id)
    .single();
  if (persistedProfileError || !persistedProfile) throw persistedProfileError ?? new Error('The verified profile could not be loaded.');

  if (persistedProfile.role !== 'professional') return { profileId: persistedProfile.id, isProfessional: false };

  const { data: existingProfessional, error: existingError } = await admin
    .from('professional_profiles')
    .select('id')
    .eq('profile_id', persistedProfile.id)
    .maybeSingle();
  if (existingError) throw existingError;

  if (!existingProfessional) {
    const submittedAreas = stringArray(metadata.areas);
    const legacyCategoryValue = text(metadata.industry);
    const experienceSummary = cleanProfileText(metadata.experienceSummary, EXPERIENCE_SUMMARY_MAX_LENGTH);
    const { error: insertError } = await admin.from('professional_profiles').insert({
      profile_id: persistedProfile.id,
      title: text(metadata.title),
      company: text(metadata.company),
      bio: text(metadata.bio)?.slice(0, 500) ?? null,
      industries: normalizeCategoryAreas(submittedAreas.length > 0 ? submittedAreas : legacyCategoryValue ? [legacyCategoryValue] : []),
      focus_areas: stringArray(metadata.sessionTypes),
      price_dkk: price(metadata.priceDkk),
      linkedin_url: normalizeLinkedInUrl(metadata.linkedin),
      payout_preference: normalizePayoutPreference(metadata.payoutPreference),
      experience_summary: experienceSummary || null,
      relevant_situations: cleanProfileList(metadata.relevantSituations),
      expected_outcomes: cleanProfileList(metadata.expectedOutcomes),
      review_status: 'pending',
      visibility: 'hidden',
    });
    if (insertError) throw insertError;
  }

  return { profileId: persistedProfile.id, isProfessional: true };
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

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('[auth:callback-profile-user]', userError);
        return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
      }

      let syncedProfile: Awaited<ReturnType<typeof syncVerifiedProfile>>;
      try {
        syncedProfile = await syncVerifiedProfile(user);
      } catch (syncError) {
        console.error('[auth:callback-profile-sync]', syncError);
        const recoveryPath = user.user_metadata?.role === 'professional' ? '/profil/professionel' : '/profil';
        const recoveryUrl = new URL(recoveryPath, origin);
        recoveryUrl.searchParams.set('sync', 'failed');
        return NextResponse.redirect(recoveryUrl);
      }

      const metadata = user.user_metadata ?? {};
      if (user.email) {
          const isProfessional = syncedProfile.isProfessional;
          const sessionPrice = price(metadata.priceDkk);
          const economics = sessionEconomics(sessionPrice);
          const payoutPreference = normalizePayoutPreference(metadata.payoutPreference);
          await sendTransactionalEmail({
            to: user.email,
            templateKey: isProfessional ? 'professional_application_received' : 'welcome',
            recipientProfileId: syncedProfile.profileId,
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
          }).catch((emailError) => {
            console.error('[auth:callback-welcome-email]', emailError);
          });
      }

      return NextResponse.redirect(new URL(next, origin));
    }
  }

  if (next === '/reset-password') {
    return NextResponse.redirect(`${origin}/forgot-password?error=invalid_link`);
  }
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
