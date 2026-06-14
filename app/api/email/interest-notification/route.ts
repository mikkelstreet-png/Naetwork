import { NextResponse } from 'next/server';
import { sendInterestNotificationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { bizEmail, bizName, projectId, projectTitle, specialistName, specialistTitle, specialistBio } = await req.json();
    await sendInterestNotificationEmail(bizEmail, bizName, projectTitle, projectId, specialistName, specialistTitle, specialistBio);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Interest notification email error:', err);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
