import 'server-only';

import { createHash } from 'node:crypto';
import { Resend } from 'resend';
import type { TransactionalEmailKey } from '@/lib/marketplace';
import { createAdminClient } from '@/lib/supabase/admin';

interface EmailRow {
  label: string;
  value: string;
}

interface TransactionalEmail {
  to: string;
  templateKey: TransactionalEmailKey;
  bookingId?: string;
  recipientProfileId?: string;
  dedupeKey?: string;
  scheduledAt?: string;
  replyTo?: string;
  previewText?: string;
  subject: string;
  title: string;
  intro: string;
  rows?: EmailRow[];
  note?: string;
  cta?: { label: string; href: string };
}

interface DeliveryClaim {
  eventId: string | null;
  duplicate: boolean;
}

let resendClient: Resend | undefined;

export function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured.');
  if (!resendClient) resendClient = new Resend(apiKey);
  return resendClient;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character] ?? character);
}

export function emailHash(email: string) {
  return createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
}

export function appUrl(path = '/') {
  const configured = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_BASE_URL ?? 'https://naetwork.dk';
  const base = configured.startsWith('http') ? configured : `https://${configured}`;
  return new URL(path, base.endsWith('/') ? base : `${base}/`).toString();
}

function plainText(email: TransactionalEmail) {
  return [
    'Naetwork',
    '',
    email.title,
    email.intro,
    email.rows?.map((row) => `${row.label}: ${row.value}`).join('\n'),
    email.note,
    email.cta ? `${email.cta.label}: ${email.cta.href}` : undefined,
    '',
    'Naetwork · 60-minutters karrieresessioner',
    `Spørgsmål: ${process.env.SUPPORT_EMAIL ?? 'kontakt@naetwork.dk'}`,
  ].filter(Boolean).join('\n\n');
}

async function claimDelivery(email: TransactionalEmail): Promise<DeliveryClaim> {
  const admin = createAdminClient();
  if (email.dedupeKey) {
    const { data: existing, error: existingError } = await admin
      .from('email_delivery_events')
      .select('id, status')
      .eq('dedupe_key', email.dedupeKey)
      .maybeSingle();
    if (existingError) throw existingError;
    if (existing && existing.status !== 'failed') return { eventId: existing.id, duplicate: true };
    if (existing) {
      const { error } = await admin.from('email_delivery_events').update({
        status: 'queued',
        error_message: null,
        scheduled_for: email.scheduledAt ?? null,
        updated_at: new Date().toISOString(),
      }).eq('id', existing.id);
      if (error) throw error;
      return { eventId: existing.id, duplicate: false };
    }
  }

  const { data, error } = await admin.from('email_delivery_events').insert({
    booking_id: email.bookingId ?? null,
    recipient_profile_id: email.recipientProfileId ?? null,
    recipient_email_hash: emailHash(email.to),
    template_key: email.templateKey,
    dedupe_key: email.dedupeKey ?? null,
    scheduled_for: email.scheduledAt ?? null,
    status: 'queued',
  }).select('id').single();

  if (error?.code === '23505' && email.dedupeKey) return { eventId: null, duplicate: true };
  if (error) throw error;
  return { eventId: data.id, duplicate: false };
}

export async function sendTransactionalEmail(email: TransactionalEmail) {
  if (!/^\S+@\S+\.\S+$/.test(email.to)) throw new Error('Recipient email is invalid.');
  const delivery = await claimDelivery(email);
  if (delivery.duplicate) return { duplicate: true, id: null };

  const from = process.env.EMAIL_FROM ?? 'Naetwork <noreply@naetwork.dk>';
  const supportEmail = process.env.SUPPORT_EMAIL ?? 'kontakt@naetwork.dk';
  const rows = email.rows?.map((row) => `
    <tr>
      <td style="padding:8px 0;color:#6b7280;font-size:14px;vertical-align:top;">${escapeHtml(row.label)}</td>
      <td style="padding:8px 0;color:#0a0a0a;font-size:14px;font-weight:700;text-align:right;vertical-align:top;">${escapeHtml(row.value)}</td>
    </tr>`).join('') ?? '';

  try {
    const { data, error } = await getResend().emails.send({
      from,
      to: email.to,
      replyTo: email.replyTo ?? supportEmail,
      subject: email.subject,
      text: plainText(email),
      scheduledAt: email.scheduledAt,
      tags: [{ name: 'template', value: email.templateKey }],
      html: `
        <!doctype html>
        <html lang="da">
          <body style="margin:0;background:#f7f7f4;color:#0a0a0a;font-family:Inter,Arial,sans-serif;">
            <div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(email.previewText ?? email.subject)}</div>
            <div style="max-width:580px;margin:0 auto;padding:40px 20px;">
              <div style="background:#ffffff;border:1px solid #e5e7eb;padding:32px;">
                <p style="margin:0 0 28px;font-size:15px;font-weight:800;">Naetwork</p>
                <h1 style="margin:0;font-size:28px;line-height:1.15;letter-spacing:0;">${escapeHtml(email.title)}</h1>
                <p style="margin:16px 0 0;color:#4b5563;font-size:15px;line-height:1.65;">${escapeHtml(email.intro)}</p>
                ${rows ? `<table role="presentation" style="width:100%;margin-top:24px;border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb;border-collapse:collapse;">${rows}</table>` : ''}
                ${email.note ? `<p style="margin:20px 0 0;padding:14px;background:#f7f7f4;color:#4b5563;font-size:13px;line-height:1.6;white-space:pre-line;">${escapeHtml(email.note)}</p>` : ''}
                ${email.cta ? `<a href="${escapeHtml(email.cta.href)}" style="display:inline-block;margin-top:24px;background:#0a0a0a;color:#ffffff;padding:12px 18px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;">${escapeHtml(email.cta.label)}</a>` : ''}
                <p style="margin:32px 0 0;color:#9ca3af;font-size:12px;line-height:1.5;">Naetwork · 60-minutters karrieresessioner. Svar på denne mail eller skriv til ${escapeHtml(supportEmail)}, hvis du har spørgsmål.</p>
              </div>
            </div>
          </body>
        </html>`,
    }, email.dedupeKey ? { idempotencyKey: email.dedupeKey.slice(0, 256) } : undefined);

    if (error) throw new Error(error.message);
    if (delivery.eventId) {
      await createAdminClient().from('email_delivery_events').update({
        provider_message_id: data?.id ?? null,
        status: email.scheduledAt ? 'queued' : 'sent',
        last_event_type: email.scheduledAt ? 'email.scheduled' : 'email.sent',
        updated_at: new Date().toISOString(),
      }).eq('id', delivery.eventId);
    }
    return { duplicate: false, id: data?.id ?? null };
  } catch (error) {
    if (delivery.eventId) {
      try {
        await createAdminClient().from('email_delivery_events').update({
          status: 'failed',
          error_message: error instanceof Error ? error.message.slice(0, 500) : 'Unknown Resend error',
          updated_at: new Date().toISOString(),
        }).eq('id', delivery.eventId);
      } catch {
        // Preserve the provider error even if delivery logging is temporarily unavailable.
      }
    }
    throw error;
  }
}

export async function cancelScheduledBookingEmails(bookingId: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('email_delivery_events')
    .select('id, provider_message_id')
    .eq('booking_id', bookingId)
    .in('template_key', ['booking_reminder_candidate', 'booking_reminder_professional'])
    .eq('status', 'queued');
  if (error) throw error;

  await Promise.allSettled((data ?? []).map(async (delivery) => {
    if (delivery.provider_message_id) await getResend().emails.cancel(delivery.provider_message_id);
    await admin.from('email_delivery_events').update({
      status: 'cancelled',
      last_event_type: 'email.cancelled',
      updated_at: new Date().toISOString(),
    }).eq('id', delivery.id);
  }));
}
