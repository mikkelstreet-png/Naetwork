import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email, name, priceDkk, donatesToCharity } = await req.json();

  await resend.emails.send({
    from: 'Naetwork <noreply@naetwork.dk>',
    to: email,
    subject: 'Velkommen som professionel på Naetwork',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #0a0a0a;">
        <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">Velkommen, ${name}!</h1>
        <p style="color: #6b7280; margin-bottom: 24px;">
          Din professionelle konto er oprettet. Når du har bekræftet din e-mail, kan du færdiggøre profilen, justere dine sessioner og sætte din pris. Din foreløbige pris er DKK ${priceDkk} per session.
        </p>
        ${donatesToCharity ? `
        <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 12px; padding: 16px; margin-bottom: 24px; color: #be123c;">
          Du har markeret, at du er interesseret i at lade en del af sessionens værdi gå til Kræftens Bekæmpelse. Du kan justere impact-modellen senere.
        </div>
        ` : ''}
        <a href="https://naetwork.vercel.app/login" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 500;">Gå til Naetwork</a>
        <p style="margin-top: 32px; color: #9ca3af; font-size: 12px;">Naetwork &middot; 1:1 karrieresparring med branchefolk.</p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
