import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email, name, role } = await req.json();
    await sendWelcomeEmail(email, name, role);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Welcome email error:', err);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
