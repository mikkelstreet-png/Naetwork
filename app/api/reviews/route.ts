import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

function sameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  return !origin || origin === new URL(request.url).origin
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Ugyldig forespørgsel.' }, { status: 403 })
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Log ind for at fortsætte.' }, { status: 401 })
    const body = await request.json()
    const bookingId = typeof body.bookingId === 'string' ? body.bookingId : ''
    const rating = Number(body.rating)
    const feedback = typeof body.feedback === 'string' ? body.feedback.trim().slice(0, 1000) : ''
    if (!bookingId || !Number.isInteger(rating) || rating < 1 || rating > 5) return NextResponse.json({ error: 'Vælg en rating fra 1 til 5.' }, { status: 400 })

    const admin = createAdminClient()
    const { data: candidate } = await admin.from('profiles').select('id').eq('auth_user_id', user.id).maybeSingle()
    if (!candidate) return NextResponse.json({ error: 'Kandidatprofilen blev ikke fundet.' }, { status: 403 })
    const { data: booking } = await admin
      .from('bookings')
      .select('id, candidate_profile_id, professional_profile_id, status')
      .eq('id', bookingId)
      .eq('candidate_profile_id', candidate.id)
      .eq('status', 'completed')
      .maybeSingle()
    if (!booking) return NextResponse.json({ error: 'Kun gennemførte egne sessioner kan vurderes.' }, { status: 409 })

    const { error } = await admin.from('reviews').insert({
      booking_id: booking.id,
      candidate_profile_id: candidate.id,
      professional_profile_id: booking.professional_profile_id,
      rating,
      feedback: feedback || null,
      moderation_status: 'pending',
    })
    if (error?.code === '23505') return NextResponse.json({ error: 'Sessionen er allerede vurderet.' }, { status: 409 })
    if (error) throw error
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    console.error('[reviews:create]', error)
    return NextResponse.json({ error: 'Vurderingen kunne ikke gemmes.' }, { status: 500 })
  }
}
