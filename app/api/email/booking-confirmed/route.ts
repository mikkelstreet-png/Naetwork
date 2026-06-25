import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { ECONOMICS, formatDkk, splitPayment } from '@/lib/economics';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { candidateEmail, candidateName, professionalName, sessionType, scheduledAt, priceDkk } = await req.json();
  const split = splitPayment(priceDkk);

  await resend.emails.send({
    from: 'Naetwork <noreply@naetwork.dk>',
    to: candidateEmail,
    subject: `Din booking med ${professionalName} er modtaget`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #0a0a0a;">
        <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">Bookinganmodning modtaget</h1>
        <p style="color: #6b7280; margin-bottom: 24px;">
          Hej ${candidateName}. Din bookinganmodning er modtaget. Den professionelle vender tilbage med endelig bekræftelse. Betaling håndteres separat efter bekræftelse.
        </p>
        <div style="border: 1px solid #f3f4f6; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
          <div style="margin-bottom: 8px;"><strong>Session:</strong> ${sessionType}</div>
          <div style="margin-bottom: 8px;"><strong>Professional:</strong> ${professionalName}</div>
          <div style="margin-bottom: 8px;"><strong>Pris:</strong> ${formatDkk(priceDkk)}</div>
          <div style="margin-bottom: 8px;"><strong>${ECONOMICS.charityName}:</strong> ${formatDkk(split.charity)}</div>
          <div style="margin-bottom: 8px;"><strong>Ekspert:</strong> ${formatDkk(split.professional)}</div>
          <div style="margin-bottom: 8px;"><strong>Platform:</strong> ${formatDkk(split.platform)}</div>
          ${scheduledAt ? `<div><strong>Ønsket tidspunkt:</strong> ${new Date(scheduledAt).toLocaleString('da-DK')}</div>` : ''}
        </div>
        <a href="https://naetwork.vercel.app/profil/bookings" style="display: inline-block; background: #0a0a0a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Se mine bookinger</a>
        <p style="margin-top: 32px; color: #9ca3af; font-size: 12px;">Naetwork &middot; 1:1 karrieresparring med mening.</p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
