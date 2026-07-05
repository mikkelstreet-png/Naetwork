import 'server-only';

import { Resend } from 'resend';

interface EmailRow {
  label: string;
  value: string;
}

interface TransactionalEmail {
  to: string;
  replyTo?: string;
  subject: string;
  title: string;
  intro: string;
  rows?: EmailRow[];
  note?: string;
  cta?: { label: string; href: string };
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

export function appUrl(path = '/') {
  const configured = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_BASE_URL ?? 'https://naetwork.dk';
  const base = configured.startsWith('http') ? configured : `https://${configured}`;
  return new URL(path, base.endsWith('/') ? base : `${base}/`).toString();
}

export async function sendTransactionalEmail(email: TransactionalEmail) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? 'Naetwork <no-reply@naetwork.dk>';
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured.');
  if (!/^\S+@\S+\.\S+$/.test(email.to)) throw new Error('Recipient email is invalid.');

  const resend = new Resend(apiKey);
  const rows = email.rows?.map((row) => `
    <tr>
      <td style="padding:8px 0;color:#6b7280;font-size:14px;vertical-align:top;">${escapeHtml(row.label)}</td>
      <td style="padding:8px 0;color:#0a0a0a;font-size:14px;font-weight:700;text-align:right;vertical-align:top;">${escapeHtml(row.value)}</td>
    </tr>`).join('') ?? '';

  const { error } = await resend.emails.send({
    from,
    to: email.to,
    replyTo: email.replyTo,
    subject: email.subject,
    html: `
      <!doctype html>
      <html lang="da">
        <body style="margin:0;background:#f7f7f4;color:#0a0a0a;font-family:Inter,Arial,sans-serif;">
          <div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(email.subject)}</div>
          <div style="max-width:580px;margin:0 auto;padding:40px 20px;">
            <div style="background:#ffffff;border:1px solid #e5e7eb;padding:32px;">
              <p style="margin:0 0 28px;font-size:15px;font-weight:800;">Naetwork</p>
              <h1 style="margin:0;font-size:28px;line-height:1.15;letter-spacing:0;">${escapeHtml(email.title)}</h1>
              <p style="margin:16px 0 0;color:#4b5563;font-size:15px;line-height:1.65;">${escapeHtml(email.intro)}</p>
              ${rows ? `<table role="presentation" style="width:100%;margin-top:24px;border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb;border-collapse:collapse;">${rows}</table>` : ''}
              ${email.note ? `<p style="margin:20px 0 0;padding:14px;background:#f7f7f4;color:#4b5563;font-size:13px;line-height:1.6;">${escapeHtml(email.note)}</p>` : ''}
              ${email.cta ? `<a href="${escapeHtml(email.cta.href)}" style="display:inline-block;margin-top:24px;background:#0a0a0a;color:#ffffff;padding:12px 18px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;">${escapeHtml(email.cta.label)}</a>` : ''}
              <p style="margin:32px 0 0;color:#9ca3af;font-size:12px;line-height:1.5;">Karrieresparring med mening. Svar på denne mail eller skriv til kontakt@naetwork.dk, hvis du har spørgsmål.</p>
            </div>
          </div>
        </body>
      </html>`,
  });

  if (error) throw new Error(error.message);
}
