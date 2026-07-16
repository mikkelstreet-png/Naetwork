import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { createSiteAccessCookieValue, SITE_ACCESS_COOKIE } from '@/lib/siteAccess';

const AUTHENTICATED_AREAS = ['/admin', '/dashboard', '/profil'];
const ACCESS_EXEMPT_PATHS = [
  '/adgang',
  '/api/site-access',
  '/api/health',
  '/api/webhooks/resend',
  '/api/cron/booking-reminders',
  '/auth/callback',
  '/robots.txt',
  '/.well-known/security.txt',
];

function matchesPath(pathname: string, paths: string[]) {
  return paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const accessCodeConfigured = Boolean(process.env.SITE_ACCESS_CODE);
  const accessToken = process.env.SITE_ACCESS_TOKEN;

  if (accessCodeConfigured !== Boolean(accessToken)) {
    return new NextResponse('Naetworks adgangslås er ikke konfigureret korrekt.', { status: 503 });
  }

  if (accessCodeConfigured && accessToken && !matchesPath(pathname, ACCESS_EXEMPT_PATHS)) {
    const expectedCookie = await createSiteAccessCookieValue(accessToken);
    const hasAccess = request.cookies.get(SITE_ACCESS_COOKIE)?.value === expectedCookie;

    if (!hasAccess) {
      const accessUrl = new URL('/adgang', request.url);
      accessUrl.searchParams.set('next', `${pathname}${search}`);
      return NextResponse.redirect(accessUrl);
    }
  }

  if (!matchesPath(pathname, AUTHENTICATED_AREAS)) {
    return NextResponse.next();
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.redirect(new URL('/login?error=service_unavailable', request.url));
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));

  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)',
  ],
};
