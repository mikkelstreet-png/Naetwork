import { NextResponse } from 'next/server';
import { sendProjectConfirmedEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email, name, projectTitle, projectCategory, projectId } = await req.json();
    await sendProjectConfirmedEmail(email, name, projectTitle, projectCategory, projectId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Project confirmed email error:', err);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
