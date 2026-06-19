import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { professionalEmail, professionalName, candidateName, sessionType, message, priceDkk, payout } = await req.json();
  const minimumContribution = Math.round(priceDkk * 0.4);

  const sessionLabels: Record<string, string> = {
    mock_interview: 'Mock Interview',
    cv_review: 'CV & LinkedIn',
    informal_chat: 'Uformel 1:1',
    career_advice: 'Karriererådgivning',
  };

  await resend.emails.send({
    from: 'Naetwork <noreply@naetwork.dk>',
    to: professionalEmail,
    subject: `Ny booking fra ${candidateName}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #0a0a0a;">
        <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">Du har en ny booking</h1>
        <p style="color: #6b7280; margin-bottom: 24px;">${candidateName} ønsker en session med dig.</p>
        <div style="border: 1px solid #f3f4f6; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
          <div style="margin-bottom: 8px;"><strong>Kandidat:</strong> ${candidateName}</div>
          <div style="margin-bottom: 8px;"><strong>Session:</strong> ${sessionLabels[sessionType] ?? sessionType}</div>
          <div style="margin-bottom: 8px;"><strong>Sessionpris:</strong> DKK ${priceDkk}</div>
          <div style="margin-bottom: 8px;"><strong>Minimum impact:</strong> DKK ${minimumContribution} til Kræftens Bekæmpelse</div>
          <div style="margin-bottom: 8px;"><strong>Din udbetaling:</strong> DKK ${payout}</div>
          ${message ? `<div style="margin-top: 12px; padding: 12px; background: #f9fafb; border-radius: 8px;"><strong>Besked:</strong><br/>${message}</div>` : ''}
        </div>
        <a href="https://naetwork.vercel.app/dashboard" style="display: inline-block; background: #0a0a0a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Se mine sessioner</a>
        <p style="margin-top: 32px; color: #9ca3af; font-size: 12px;">Naetwork &middot; Karrieresparring med mening.</p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
