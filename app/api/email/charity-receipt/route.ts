import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email, name, totalDonated, sessionCount } = await req.json();

  await resend.emails.send({
    from: 'Naetwork <noreply@naetwork.dk>',
    to: email,
    subject: 'Din impact-oversigt fra Naetwork',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #0a0a0a;">
        <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">Tak, ${name}</h1>
        <p style="color: #6b7280; margin-bottom: 24px;">
          Gennem dine betalte sessioner på Naetwork har du bidraget til Kræftens Bekæmpelse.
        </p>
        <div style="background: #f7f7f4; border: 1px solid #e5e7eb; border-radius: 16px; padding: 24px; margin-bottom: 24px; text-align: center;">
          <div style="font-size: 36px; font-weight: 800; color: #0a0a0a; margin-bottom: 4px;">DKK ${totalDonated}</div>
          <div style="color: #4b5563; font-size: 14px;">bidraget til Kræftens Bekæmpelse</div>
          <div style="color: #9ca3af; font-size: 12px; margin-top: 8px;">på tværs af ${sessionCount} sessioner</div>
        </div>
        <a href="https://naetwork.vercel.app/dashboard" style="display: inline-block; background: #0a0a0a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Se dit dashboard</a>
        <p style="margin-top: 32px; color: #9ca3af; font-size: 12px;">Naetwork &middot; Karrieresparring med mening.</p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
