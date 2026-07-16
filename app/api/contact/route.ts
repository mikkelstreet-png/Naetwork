import { NextResponse } from 'next/server';
import { sendTransactionalEmail } from '@/lib/server/email';
import { isSameSiteRequest } from '@/lib/server/requestSecurity';
import { createAdminClient } from '@/lib/supabase/admin';

const SUBJECTS: Record<string, string> = {
  booking: 'Booking og session',
  account: 'Konto og profil',
  professional: 'Professionel på Naetwork',
  privacy: 'Privatliv og data',
  other: 'Andet',
};

function cleanText(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().replace(/\r\n/g, '\n').slice(0, maxLength) : '';
}

export async function POST(request: Request) {
  if (!isSameSiteRequest(request)) {
    return NextResponse.json({ error: 'Ugyldig forespørgsel.' }, { status: 403 });
  }

  try {
    const body = await request.json();

    // Honeypot fields should remain empty for real users.
    if (cleanText(body.website, 120)) {
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    const name = cleanText(body.name, 100);
    const email = cleanText(body.email, 254).toLowerCase();
    const subjectKey = cleanText(body.subject, 32);
    const message = cleanText(body.message, 2_000);
    const subject = SUBJECTS[subjectKey];

    if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || !subject || message.length < 20) {
      return NextResponse.json({ error: 'Udfyld navn, gyldig e-mail, emne og mindst 20 tegn i beskeden.' }, { status: 400 });
    }

    const admin = createAdminClient();
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1_000).toISOString();
    const { count } = await admin
      .from('contact_messages')
      .select('id', { count: 'exact', head: true })
      .eq('email', email)
      .gte('created_at', tenMinutesAgo);

    if ((count ?? 0) >= 3) {
      return NextResponse.json({ error: 'Du har sendt flere beskeder på kort tid. Prøv igen senere.' }, { status: 429 });
    }

    const { data: contactMessage, error: insertError } = await admin.from('contact_messages').insert({
      name,
      email,
      subject,
      message,
      status: 'new',
    }).select('id').single();
    if (insertError || !contactMessage) throw insertError ?? new Error('Contact message insert failed.');

    const supportEmail = process.env.SUPPORT_EMAIL;
    const notifications = await Promise.allSettled([
      supportEmail ? sendTransactionalEmail({
          to: supportEmail,
          replyTo: email,
          templateKey: 'contact_notification',
          dedupeKey: `contact-support-${contactMessage.id}`,
          subject: `Ny henvendelse: ${subject}`,
          title: 'Ny kontaktbesked',
          intro: `${name} har sendt en besked via Naetwork. Besvar denne mail for at svare direkte.`,
          rows: [
            { label: 'Navn', value: name },
            { label: 'E-mail', value: email },
            { label: 'Emne', value: subject },
          ],
          note: message,
        }) : Promise.resolve(),
      sendTransactionalEmail({
        to: email,
        templateKey: 'contact_received',
        dedupeKey: `contact-received-${contactMessage.id}`,
        subject: 'Vi har modtaget din besked til Naetwork',
        previewText: 'Din besked er modtaget, og vi vender tilbage hurtigst muligt.',
        title: 'Tak for din besked',
        intro: `Hej ${name}. Din henvendelse er gemt, og Naetwork vender tilbage på denne e-mailadresse.`,
        rows: [{ label: 'Emne', value: subject }],
        note: 'Undlad at sende følsomme personoplysninger i et almindeligt mailsvar.',
      }),
    ]);
    const notificationSent = notifications.every((result) => result.status === 'fulfilled');
    if (!notificationSent) console.error('[contact:notification] One or more contact emails failed.');

    return NextResponse.json({ ok: true, notificationSent }, { status: 201 });
  } catch (error) {
    console.error('[contact:create]', error);
    return NextResponse.json({ error: 'Beskeden kunne ikke sendes. Prøv igen senere.' }, { status: 500 });
  }
}
