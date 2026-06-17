import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function text(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function price(value: unknown): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) return 500;
  return Math.min(2000, Math.max(300, Math.round(parsed)));
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) { return cookieStore.get(name)?.value; },
          set(name, value, options) {
            try { cookieStore.set({ name, value, ...options }); } catch {}
          },
          remove(name, options) {
            try { cookieStore.set({ name, value: '', ...options }); } catch {}
          },
        },
      }
    );
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
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
              .update({ name: text(metadata.name) ?? user.email, role: 'professional' })
              .eq('id', profile.id);

            await supabase.from('professional_profiles').upsert({
              profile_id: profile.id,
              title: text(metadata.title),
              company: text(metadata.company),
              bio: text(metadata.bio)?.slice(0, 500) ?? null,
              industries: text(metadata.industry) ? [text(metadata.industry)] : [],
              focus_areas: stringArray(metadata.sessionTypes),
              price_dkk: price(metadata.priceDkk),
              visibility: 'hidden',
            }, { onConflict: 'profile_id' });
          }
        }
      } catch {
        // A profile sync failure should not block login after e-mail confirmation.
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
