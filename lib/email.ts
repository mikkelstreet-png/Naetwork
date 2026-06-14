// Email helper — sends via internal API routes (Resend)

async function sendEmail(route: string, payload: Record<string, unknown>) {
  const res = await fetch(`/api/email/${route}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.ok;
}

export async function sendBookingConfirmed(params: {
  candidateEmail: string;
  candidateName: string;
  professionalName: string;
  sessionType: string;
  scheduledAt?: string;
  priceDkk: number;
}) {
  return sendEmail('booking-confirmed', params);
}

export async function sendBookingReceived(params: {
  professionalEmail: string;
  professionalName: string;
  candidateName: string;
  sessionType: string;
  message?: string;
  priceDkk: number;
  payout: number;
}) {
  return sendEmail('booking-received', params);
}

export async function sendWelcomeCandidate(params: { email: string; name?: string }) {
  return sendEmail('welcome-candidate', params);
}

export async function sendWelcomeProfessional(params: {
  email: string;
  name: string;
  priceDkk: number;
  donatesToCharity: boolean;
}) {
  return sendEmail('welcome-professional', params);
}

export async function sendCharityReceipt(params: {
  email: string;
  name: string;
  totalDonated: number;
  sessionCount: number;
}) {
  return sendEmail('charity-receipt', params);
}
