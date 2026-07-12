import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { hasMeaningfulValue, hasValidLegalIdentity, isValidEmail } from '@/lib/server/readiness';
import { paymentConfiguration } from '@/lib/server/payments';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('role').eq('auth_user_id', user.id).maybeSingle();
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { error: databaseError } = await supabase.from('profiles').select('id').limit(1);
  const payments = paymentConfiguration();
  return NextResponse.json({
    database: databaseError ? 'error' : 'ok',
    environment: {
      NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      SUPPORT_EMAIL: isValidEmail(process.env.SUPPORT_EMAIL),
      NEXT_PUBLIC_APP_URL: Boolean(process.env.NEXT_PUBLIC_APP_URL || process.env.APP_BASE_URL),
      NEXT_PUBLIC_LEGAL_NAME: hasMeaningfulValue(process.env.NEXT_PUBLIC_LEGAL_NAME),
      NEXT_PUBLIC_LEGAL_ADDRESS: hasValidLegalIdentity(),
      NEXT_PUBLIC_LEGAL_REGISTRATION: hasValidLegalIdentity(),
    },
    integrations: {
      transactionalEmail: process.env.RESEND_API_KEY && process.env.EMAIL_FROM ? 'configured' : 'pending',
      payment: payments.enabled ? 'configured' : payments.configured ? 'disabled' : 'pending',
    },
  });
}
