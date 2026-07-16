import 'server-only'

import type { TransactionalEmailKey } from '@/lib/marketplace'

interface EmailDefinition {
  recipient: 'candidate' | 'professional' | 'account_owner'
  trigger: string
  timing: string
  subjectDa: string
  previewDa: string
  ctaDa?: string
}

export const EMAIL_CATALOG: Record<TransactionalEmailKey, EmailDefinition> = {
  welcome: { recipient: 'account_owner', trigger: 'account.created', timing: 'Straks', subjectDa: 'Velkommen til Naetwork', previewDa: 'Din konto er oprettet.', ctaDa: 'Gå til Naetwork' },
  verify_email: { recipient: 'account_owner', trigger: 'auth.verification.requested', timing: 'Straks', subjectDa: 'Bekræft din e-mail', previewDa: 'Bekræft adressen for at aktivere din konto.', ctaDa: 'Bekræft e-mail' },
  professional_application_received: { recipient: 'professional', trigger: 'professional.account_confirmed', timing: 'Straks', subjectDa: 'Din Naetwork-profil er modtaget', previewDa: 'Færdiggør profilen, så den kan gennemgås.', ctaDa: 'Færdiggør profil' },
  booking_requested_candidate: { recipient: 'candidate', trigger: 'booking.requested', timing: 'Straks', subjectDa: 'Din bookinganmodning er modtaget', previewDa: 'Se tidspunkt, fokus, pris og næste skridt.', ctaDa: 'Se booking' },
  booking_requested_professional: { recipient: 'professional', trigger: 'booking.requested', timing: 'Straks', subjectDa: 'Ny bookinganmodning', previewDa: 'En kandidat ønsker en session med dig.', ctaDa: 'Behandl anmodning' },
  booking_confirmed: { recipient: 'account_owner', trigger: 'booking.confirmed', timing: 'Straks', subjectDa: 'Sessionen er bekræftet', previewDa: 'Tidspunkt og forberedelse til din session.', ctaDa: 'Se session' },
  booking_rescheduled: { recipient: 'account_owner', trigger: 'booking.rescheduled', timing: 'Straks', subjectDa: 'Sessionen har fået et nyt tidspunkt', previewDa: 'Se det opdaterede tidspunkt.', ctaDa: 'Se ændring' },
  booking_cancelled: { recipient: 'account_owner', trigger: 'booking.cancelled', timing: 'Straks', subjectDa: 'Sessionen er aflyst', previewDa: 'Se status og eventuel refundering.', ctaDa: 'Se booking' },
  booking_reminder_candidate: { recipient: 'candidate', trigger: 'booking.reminder', timing: '24 timer før', subjectDa: 'Din session er i morgen', previewDa: 'Tidspunkt, link og dit brief samlet ét sted.', ctaDa: 'Forbered session' },
  booking_reminder_professional: { recipient: 'professional', trigger: 'booking.reminder', timing: '24 timer før', subjectDa: 'Session i morgen', previewDa: 'Se kandidatens fokus og brief.', ctaDa: 'Se brief' },
  payment_receipt: { recipient: 'candidate', trigger: 'payment.succeeded', timing: 'Straks', subjectDa: 'Kvittering for din Naetwork-session', previewDa: 'Pris, moms og betalingsreference.', ctaDa: 'Se kvittering' },
  payment_failed: { recipient: 'candidate', trigger: 'payment.failed', timing: 'Straks', subjectDa: 'Betalingen gik ikke igennem', previewDa: 'Din session er ikke betalt. Prøv igen.', ctaDa: 'Prøv betaling igen' },
  refund_confirmed: { recipient: 'candidate', trigger: 'refund.succeeded', timing: 'Straks', subjectDa: 'Din refundering er gennemført', previewDa: 'Beløbet er sendt retur til betalingsmidlet.', ctaDa: 'Se booking' },
  feedback_request: { recipient: 'candidate', trigger: 'booking.completed', timing: '2 timer efter', subjectDa: 'Hvordan var din session?', previewDa: 'Din feedback hjælper os med at sikre kvaliteten.', ctaDa: 'Giv feedback' },
  professional_approved: { recipient: 'professional', trigger: 'professional.approved', timing: 'Straks', subjectDa: 'Din profil er godkendt', previewDa: 'Åbn tider for at gøre profilen bookbar.', ctaDa: 'Åbn tider' },
  professional_rejected: { recipient: 'professional', trigger: 'professional.rejected', timing: 'Straks', subjectDa: 'Din profil kræver ændringer', previewDa: 'Se hvad der skal tilpasses.', ctaDa: 'Rediger profil' },
  password_reset: { recipient: 'account_owner', trigger: 'auth.password_reset', timing: 'Straks', subjectDa: 'Nulstil din adgangskode', previewDa: 'Linket udløber af sikkerhedshensyn.', ctaDa: 'Nulstil adgangskode' },
  password_changed: { recipient: 'account_owner', trigger: 'auth.password_changed', timing: 'Straks', subjectDa: 'Din adgangskode er ændret', previewDa: 'Kontakt os straks, hvis det ikke var dig.' },
  email_changed: { recipient: 'account_owner', trigger: 'auth.email_changed', timing: 'Straks', subjectDa: 'Din e-mail er ændret', previewDa: 'Kontakt os straks, hvis du ikke foretog ændringen.' },
  account_deleted: { recipient: 'account_owner', trigger: 'account.deleted', timing: 'Straks', subjectDa: 'Din Naetwork-konto er slettet', previewDa: 'Vi bekræfter, at kontoen er lukket.' },
  contact_received: { recipient: 'account_owner', trigger: 'contact.received', timing: 'Straks', subjectDa: 'Vi har modtaget din besked', previewDa: 'Naetwork vender tilbage på den e-mail, du har angivet.' },
  contact_notification: { recipient: 'account_owner', trigger: 'contact.created', timing: 'Straks', subjectDa: 'Ny henvendelse via Naetwork', previewDa: 'En ny besked ligger i admin-indbakken.' },
  payout_confirmed: { recipient: 'professional', trigger: 'payout.paid', timing: 'Straks', subjectDa: 'Din udbetaling er sendt', previewDa: 'Se beløb og tilhørende sessioner.', ctaDa: 'Se udbetalinger' },
  payout_failed: { recipient: 'professional', trigger: 'payout.failed', timing: 'Straks', subjectDa: 'Din udbetaling kræver handling', previewDa: 'Opdater dine udbetalingsoplysninger.', ctaDa: 'Løs problemet' },
}
