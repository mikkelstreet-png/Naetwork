import { createHash, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createSiteAccessCookieValue, normaliseNextPath, SITE_ACCESS_COOKIE } from '@/lib/siteAccess';

export const runtime = 'nodejs';

const MAX_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 10 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

function matchesSecret(received: string, expected: string) {
  const receivedHash = createHash('sha256').update(received).digest();
  const expectedHash = createHash('sha256').update(expected).digest();
  return timingSafeEqual(receivedHash, expectedHash);
}

function clientKey(request: NextRequest) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown';
}

function canAttempt(key: string) {
  const now = Date.now();
  const current = attempts.get(key);

  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + ATTEMPT_WINDOW_MS });
    return true;
  }

  if (current.count >= MAX_ATTEMPTS) return false;
  current.count += 1;
  return true;
}

function redirectToAccess(request: NextRequest, nextPath: string, error: string) {
  const url = new URL('/adgang', request.url);
  url.searchParams.set('next', nextPath);
  url.searchParams.set('error', error);
  return NextResponse.redirect(url, 303);
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return new NextResponse('Ugyldig forespørgsel.', { status: 403 });
  }

  const expectedCode = process.env.SITE_ACCESS_CODE;
  const accessToken = process.env.SITE_ACCESS_TOKEN;
  if (!expectedCode || !accessToken) {
    return new NextResponse('Naetworks adgangslås er ikke konfigureret korrekt.', { status: 503 });
  }

  const formData = await request.formData();
  const nextPath = normaliseNextPath(formData.get('next'));
  const key = clientKey(request);

  if (!canAttempt(key)) return redirectToAccess(request, nextPath, 'rate_limited');

  const code = formData.get('code');
  if (typeof code !== 'string' || !matchesSecret(code, expectedCode)) {
    return redirectToAccess(request, nextPath, 'invalid');
  }

  attempts.delete(key);
  const response = NextResponse.redirect(new URL(nextPath, request.url), 303);
  response.cookies.set(SITE_ACCESS_COOKIE, await createSiteAccessCookieValue(accessToken), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  return response;
}
