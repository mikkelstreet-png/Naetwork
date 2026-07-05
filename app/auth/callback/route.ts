import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { appUrl, sendTransactionalEmail } from '@/lib/server/email';
import { safeInternalPath } from '@/lib/navigation';

function text(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function price(value: unknown): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) return 600;
  return Math.min(1800, Math.max(600, Math.round(parsed)));
}

function percentage(value: unknown): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) return 40;
  return Math.min(90, Math.max(40, Math.round(parsed)));
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = safeInternalPath(searchParams.get('next'));

  if (code) {
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
    const { error } = await supabase.auth.exchangeCodeForSession(code);
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
            await supabase
              .from('profiles')
              .update({ name: text(metadata.name) ?? user.email })
              .eq('id', profile.id);

            await supabase.from('professional_profiles').upsert({
              profile_id: profile.id,
              title: text(metadata.title),
              company: text(metadata.company),
              bio: text(metadata.bio)?.slice(0, 500) ?? null,
              industries: text(metadata.industry) ? [text(metadata.industry)] : [],
              focus_areas: stringArray(metadata.sessionTypes),
              price_dkk: price(metadata.priceDkk),
              linkedin_url: text(metadata.linkedin),
              contribution_percent: percentage(metadata.contributionPercent),
              review_status: 'pending',
              visibility: 'hidden',
            }, { onConflict: 'profile_id' });
          }
        }

        if (user?.email) {
          const isProfessional = metadata.role === 'professional';
          const contributionPercent = percentage(metadata.contributionPercent);
          const sessionPrice = price(metadata.priceDkk);
          await sendTransactionalEmail({
            to: user.email,
            subject: isProfessional ? 'Din Naetwork-profil er modtaget' : 'Velkommen til Naetwork',
            title: isProfessional ? 'Din profil er klar til gennemgang' : 'Velkommen til Naetwork',
            intro: isProfessional
              ? `Hej ${text(metadata.name) ?? 'der'}. Din konto er bekræftet. Færdiggør profilen, og send den til gennemgang, før den bliver synlig.`
              : `Hej ${text(metadata.name) ?? 'der'}. Din konto er bekræftet, og du kan nu finde en relevant professional og sende en bookinganmodning.`,
            rows: isProfessional ? [
              { label: 'Session', value: '60 minutter' },
              { label: 'Pris', value: `DKK ${sessionPrice.toLocaleString('da-DK')}` },
              { label: 'Bidrag ved betaling', value: `${contributionPercent}%` },
            ] : undefined,
            note: 'Betaling er ikke aktiveret endnu. Der trækkes ikke noget beløb ved bookinganmodninger.',
            cta: {
              label: isProfessional ? 'Færdiggør profil' : 'Find en professional',
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
