import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'no-reply@naetwork.dk';

export async function sendWelcomeEmail(to: string, name: string, role: 'business' | 'specialist') {
  const isBiz = role === 'business';
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Velkommen til Naetwork',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #0A0A0A;">
        <div style="font-size: 20px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 32px;">Naetwork</div>
        <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px;">Velkommen, ${name}!</h1>
        <p style="font-size: 15px; color: #6B7280; line-height: 1.6; margin: 0 0 24px;">
          ${isBiz
            ? 'Din virksomhedskonto er oprettet. Du kan nu poste AI-projekter og modtage interesse fra kvalificerede specialister — gratis og uden forpligtelser.'
            : 'Din specialistkonto er oprettet. Du er nu klar til at browse projekter og vise interesse direkte. Ingen godkendelse nødvendig.'}
        </p>
        <a href="https://naetwork.vercel.app/${isBiz ? 'dashboard' : 'projekter'}"
           style="display: inline-block; background: #4F46E5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 600;">
          ${isBiz ? 'Gå til dashboard' : 'Se projekter'}
        </a>
        <p style="font-size: 13px; color: #9CA3AF; margin-top: 40px; line-height: 1.5;">
          Naetwork er et gratis, ikke-kommercielt initiativ. Vi tager ingen provision og indgår ingen aftaler på dine vegne.
        </p>
      </div>
    `,
  });
}

export async function sendInterestNotificationEmail(
  to: string,
  bizName: string,
  projectTitle: string,
  projectId: string,
  specialistName: string,
  specialistTitle: string,
  specialistBio: string,
) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'En specialist har vist interesse i dit projekt',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #0A0A0A;">
        <div style="font-size: 20px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 32px;">Naetwork</div>
        <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 8px;">Ny interesse i dit projekt</h1>
        <p style="font-size: 14px; color: #6B7280; margin: 0 0 24px;">"${projectTitle}"</p>
        <div style="border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <div style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">${specialistName}</div>
          <div style="font-size: 14px; color: #6B7280; margin-bottom: 12px;">${specialistTitle}</div>
          <p style="font-size: 14px; color: #374151; line-height: 1.6; margin: 0;">${specialistBio}</p>
        </div>
        <a href="https://naetwork.vercel.app/projekt/${projectId}/interesserede"
           style="display: inline-block; background: #4F46E5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 600;">
          Se alle interesserede specialister
        </a>
        <p style="font-size: 13px; color: #9CA3AF; margin-top: 40px;">Naetwork — gratis AI-projektboard.</p>
      </div>
    `,
  });
}

export async function sendProjectConfirmedEmail(
  to: string,
  name: string,
  projectTitle: string,
  projectCategory: string,
  projectId: string,
) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Dit projekt er nu live på Naetwork',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #0A0A0A;">
        <div style="font-size: 20px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 32px;">Naetwork</div>
        <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px;">Dit projekt er live!</h1>
        <div style="border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <div style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">${projectTitle}</div>
          <div style="font-size: 13px; color: #6B7280;">${projectCategory}</div>
        </div>
        <p style="font-size: 15px; color: #6B7280; line-height: 1.6; margin: 0 0 24px;">
          Dit projekt er nu synligt for AI-specialister. Du får besked, når nogen viser interesse.
        </p>
        <a href="https://naetwork.vercel.app/projekt/${projectId}/interesserede"
           style="display: inline-block; background: #4F46E5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 600;">
          Se interesserede specialister
        </a>
        <p style="font-size: 13px; color: #9CA3AF; margin-top: 40px;">Naetwork — gratis AI-projektboard.</p>
      </div>
    `,
  });
}

export async function sendSpecialistConfirmedEmail(to: string, name: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Din specialistprofil er oprettet',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #0A0A0A;">
        <div style="font-size: 20px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 32px;">Naetwork</div>
        <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px;">Profil oprettet, ${name}!</h1>
        <p style="font-size: 15px; color: #6B7280; line-height: 1.6; margin: 0 0 24px;">
          Du er nu synlig for virksomheder der poster projekter inden for dine kategorier. Browse projekter og vis interesse — det er gratis og uforpligtende.
        </p>
        <a href="https://naetwork.vercel.app/projekter"
           style="display: inline-block; background: #4F46E5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 600;">
          Browse projekter
        </a>
        <p style="font-size: 13px; color: #9CA3AF; margin-top: 40px;">Naetwork — gratis AI-projektboard.</p>
      </div>
    `,
  });
}
