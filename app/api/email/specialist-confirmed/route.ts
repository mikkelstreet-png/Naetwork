import { NextResponse } from 'next/server';
import { sendSpecialistConfirmedEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();
    await sendSpecialistConfirmedEmail(email, name);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Specialist confirmed email error:', err);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
