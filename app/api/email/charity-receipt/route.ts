import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email, name, totalDonated, sessionCount } = await req.json();

  await resend.emails.send({
    from: 'Naetwork <noreply@naetwork.dk>',
    to: email,
    subject: 'Din donationsoversigt fra Naetwork',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #0a0a0a;">
        <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">Tak for din donation, ${name}!</h1>
        <p style="color: #6b7280; margin-bottom: 24px;">
          Gennem dine sessioner paa Naetwork har du bidraget til Kraeftens Bekaempelse.
        </p>
        <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 16px; padding: 24px; margin-bottom: 24px; text-align: center;">
          <div style="font-size: 36px; font-weight: 700; color: #be123c; margin-bottom: 4px;">DKK ${totalDonated}</div>
          <div style="color: #e11d48; font-size: 14px;">doneret til Kraeftens Bekaempelse</div>
          <div style="color: #9ca3af; font-size: 12px; margin-top: 8px;">paa tvaers af ${sessionCount} sessioner</div>
        </div>
        <a href="https://naetwork.vercel.app/dashboard" style="display: inline-block; background: #166534; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 500;">Se dit dashboard</a>
        <p style="margin-top: 32px; color: #9ca3af; font-size: 12px;">Naetwork &middot; Karrieresessioner med mennesker der ved det.</p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
