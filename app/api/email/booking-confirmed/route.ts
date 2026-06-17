import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { candidateEmail, candidateName, professionalName, sessionType, scheduledAt, priceDkk } = await req.json();

  const sessionLabels: Record<string, string> = {
    mock_interview: 'Mock Interview',
    cv_review: 'CV & LinkedIn',
    informal_chat: 'Uformel 1:1',
    career_advice: 'Career Strategy',
  };

  await resend.emails.send({
    from: 'Naetwork <noreply@naetwork.dk>',
    to: candidateEmail,
    subject: `Din booking med ${professionalName} er modtaget`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #0a0a0a;">
        <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">Booking modtaget</h1>
        <p style="color: #6b7280; margin-bottom: 24px;">
          Hej ${candidateName}. Din booking er modtaget. Den professionelle vender tilbage med endelig bekræftelse.
        </p>
        <div style="border: 1px solid #f3f4f6; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
          <div style="margin-bottom: 8px;"><strong>Session:</strong> ${sessionLabels[sessionType] ?? sessionType}</div>
          <div style="margin-bottom: 8px;"><strong>Professionel:</strong> ${professionalName}</div>
          <div style="margin-bottom: 8px;"><strong>Pris:</strong> DKK ${priceDkk}</div>
          ${scheduledAt ? `<div><strong>Ønsket tidspunkt:</strong> ${new Date(scheduledAt).toLocaleString('da-DK')}</div>` : ''}
        </div>
        <a href="https://naetwork.vercel.app/profil/bookings" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 500;">Se mine bookinger</a>
        <p style="margin-top: 32px; color: #9ca3af; font-size: 12px;">Naetwork &middot; 1:1 karrieresparring med branchefolk.</p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
