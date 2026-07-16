import { NextResponse } from 'next/server';
import { getResend } from '@/lib/server/email';
import { createAdminClient } from '@/lib/supabase/admin';

const STATUS_BY_EVENT = {
  'email.sent': 'sent',
  'email.scheduled': 'queued',
  'email.delivered': 'delivered',
  'email.delivery_delayed': 'delivery_delayed',
  'email.bounced': 'bounced',
  'email.complained': 'complained',
  'email.failed': 'failed',
  'email.suppressed': 'suppressed',
} as const;

export async function POST(request: Request) {
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  if (!webhookSecret) return NextResponse.json({ error: 'Webhook is not configured.' }, { status: 503 });

  try {
    const payload = await request.text();
    const event = getResend().webhooks.verify({
      payload,
      headers: {
        id: request.headers.get('svix-id') ?? request.headers.get('webhook-id') ?? '',
        timestamp: request.headers.get('svix-timestamp') ?? request.headers.get('webhook-timestamp') ?? '',
        signature: request.headers.get('svix-signature') ?? request.headers.get('webhook-signature') ?? '',
      },
      webhookSecret,
    });
    const status = STATUS_BY_EVENT[event.type as keyof typeof STATUS_BY_EVENT];
    if (!status || !('email_id' in event.data)) return NextResponse.json({ received: true });

    let errorMessage: string | null = null;
    if ('failed' in event.data) errorMessage = event.data.failed.reason;
    if ('suppressed' in event.data) errorMessage = event.data.suppressed.message;
    if ('bounce' in event.data) errorMessage = event.data.bounce.message;

    const { error } = await createAdminClient().from('email_delivery_events').update({
      status,
      last_event_type: event.type,
      error_message: errorMessage?.slice(0, 500) ?? null,
      updated_at: new Date().toISOString(),
    }).eq('provider_message_id', event.data.email_id);
    if (error) throw error;
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[webhook:resend]', error);
    return NextResponse.json({ error: 'Invalid webhook.' }, { status: 400 });
  }
}
