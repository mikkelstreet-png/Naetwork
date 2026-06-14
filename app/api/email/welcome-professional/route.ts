import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email, name, priceDkk, donatesToCharity } = await req.json();

  await resend.emails.send({
    from: 'Naetwork <noreply@naetwork.dk>',
    to: email,
    subject: 'Din professionelle profil er oprettet',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #0a0a0a;">
        <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">Profil oprettet, ${name}!</h1>
        <p style="color: #6b7280; margin-bottom: 24px;">
          Din professionelle profil er nu aktiv paa Naetwork. Kandidater kan booke sessioner med dig til DKK ${priceDkk} per session.
        </p>
        ${donatesToCharity ? `
        <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 12px; padding: 16px; margin-bottom: 24px; color: #be123c;">
          Du har valgt at donere dit honorar til Kraeftens Bekaempelse. Dit platformsbidrag er 7,5%.
        </div>
        ` : ''}
        <a href="https://naetwork.vercel.app/dashboard" style="display: inline-block; background: #166534; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 500;">Gaa til dashboard</a>
        <p style="margin-top: 32px; color: #9ca3af; font-size: 12px;">Naetwork &middot; Karrieresessioner med mennesker der ved det.</p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
