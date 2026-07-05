import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const emailConfigured = Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
  const supportConfigured = Boolean(process.env.SUPPORT_EMAIL);
  const legalIdentityConfigured = Boolean(
    process.env.NEXT_PUBLIC_LEGAL_NAME &&
    process.env.NEXT_PUBLIC_LEGAL_ADDRESS &&
    process.env.NEXT_PUBLIC_LEGAL_REGISTRATION
  );
  let database = false;

  if (url && key) {
    try {
      const response = await fetch(`${url}/rest/v1/profiles?select=id&limit=1`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        cache: 'no-store',
        signal: AbortSignal.timeout(5_000),
      });
      database = response.ok;
    } catch {
      database = false;
    }
  }

  const ready = database && supportConfigured && legalIdentityConfigured;
  return NextResponse.json({
    status: ready ? 'ready' : 'degraded',
    checks: { database, supportInbox: supportConfigured, legalIdentity: legalIdentityConfigured },
    integrations: {
      transactionalEmail: emailConfigured ? 'configured' : 'pending',
      payment: 'disabled',
    },
    checkedAt: new Date().toISOString(),
  }, { status: ready ? 200 : 503 });
}
