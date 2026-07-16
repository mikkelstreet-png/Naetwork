import { NextResponse } from 'next/server';
import { hasValidLegalIdentity, isValidEmail } from '@/lib/server/readiness';

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const emailConfigured = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_WEBHOOK_SECRET && process.env.CRON_SECRET && process.env.EMAIL_FROM);
  const siteAccessConfigured = Boolean(process.env.SITE_ACCESS_CODE && process.env.SITE_ACCESS_TOKEN);
  const supportConfigured = isValidEmail(process.env.SUPPORT_EMAIL);
  const legalIdentityConfigured = hasValidLegalIdentity();
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

  const ready = database && supportConfigured && legalIdentityConfigured && emailConfigured && siteAccessConfigured;
  return NextResponse.json({
    status: ready ? 'ready' : 'degraded',
    checks: { database, supportInbox: supportConfigured, legalIdentity: legalIdentityConfigured, transactionalEmail: emailConfigured, siteAccess: siteAccessConfigured },
    integrations: {
      transactionalEmail: emailConfigured ? 'configured' : 'pending',
      payment: 'disabled',
    },
    checkedAt: new Date().toISOString(),
  }, { status: ready ? 200 : 503 });
}
