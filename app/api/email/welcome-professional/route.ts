import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email, name, priceDkk, contributionPercent = 40 } = await req.json();
  const estimatedContribution = Math.round(priceDkk * (contributionPercent / 100));

  await resend.emails.send({
    from: 'Naetwork <noreply@naetwork.dk>',
    to: email,
    subject: 'Velkommen som professionel på Naetwork',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #0a0a0a;">
        <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">Velkommen, ${name}!</h1>
        <p style="color: #6b7280; margin-bottom: 24px;">
          Din professionelle konto er oprettet. Når du har bekræftet din e-mail, kan du færdiggøre profilen, justere dine sessioner og sætte din pris. Din foreløbige pris er DKK ${priceDkk} per 60-minutters session.
        </p>
        <div style="background: #f7f7f4; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin-bottom: 24px; color: #111827;">
          <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #9ca3af; margin-bottom: 8px;">Impact model</div>
          <div style="font-size: 24px; font-weight: 800; margin-bottom: 4px;">${contributionPercent}% / ca. DKK ${estimatedContribution}</div>
          <div style="color: #6b7280; font-size: 14px; line-height: 1.5;">Din valgte impact-andel går til Kræftens Bekæmpelse, når en session bliver betalt. Alle betalte sessioner bidrager minimum 40% og op til 90%.</div>
        </div>
        <a href="https://naetwork.vercel.app/login" style="display: inline-block; background: #0a0a0a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Gå til Naetwork</a>
        <p style="margin-top: 32px; color: #9ca3af; font-size: 12px;">Naetwork &middot; 1:1 karrieresparring med mening.</p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
