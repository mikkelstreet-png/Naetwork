import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email, name } = await req.json();

  await resend.emails.send({
    from: 'Naetwork <noreply@naetwork.dk>',
    to: email,
    subject: 'Velkommen til Naetwork',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #0a0a0a;">
        <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">Velkommen, ${name ?? 'der'}!</h1>
        <p style="color: #6b7280; margin-bottom: 24px;">
          Din konto er oprettet. Du kan nu finde og booke sessioner med erfarne professionelle.
        </p>
        <a href="https://naetwork.vercel.app/professionals" style="display: inline-block; background: #166534; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 500;">Find en professionel</a>
        <p style="margin-top: 32px; color: #9ca3af; font-size: 12px;">Naetwork &middot; Karrieresessioner med mennesker der ved det.</p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
