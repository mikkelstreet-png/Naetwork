import 'server-only';

import { emailHash } from '@/lib/server/email';
import { createAdminClient } from '@/lib/supabase/admin';

type AuthEmailRequestType = 'signup' | 'recovery';

export async function claimAuthEmailRequest(email: string, requestType: AuthEmailRequestType) {
  const admin = createAdminClient();
  const hash = emailHash(email);
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const [{ count: recent }, { count: hourly }] = await Promise.all([
    admin.from('auth_email_requests').select('id', { count: 'exact', head: true })
      .eq('email_hash', hash).eq('request_type', requestType).gte('created_at', tenMinutesAgo),
    admin.from('auth_email_requests').select('id', { count: 'exact', head: true })
      .eq('email_hash', hash).eq('request_type', requestType).gte('created_at', oneHourAgo),
  ]);

  if ((recent ?? 0) >= 3 || (hourly ?? 0) >= 8) return null;
  const { data, error } = await admin.from('auth_email_requests').insert({
    email_hash: hash,
    request_type: requestType,
  }).select('id').single();
  if (error) throw error;
  return data.id as string;
}

export async function markAuthEmailSent(requestId: string) {
  const { error } = await createAdminClient().from('auth_email_requests')
    .update({ was_sent: true }).eq('id', requestId);
  if (error) throw error;
}
