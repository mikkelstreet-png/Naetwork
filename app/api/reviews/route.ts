import { NextResponse } from 'next/server'
import { parseSessionFeedback } from '@/lib/sessionFeedback'
import { recordProductEvent } from '@/lib/server/productAnalytics'
import { isSameSiteRequest } from '@/lib/server/requestSecurity'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  if (!isSameSiteRequest(request)) return NextResponse.json({ error: 'Ugyldig forespørgsel.' }, { status: 403 })
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Log ind for at fortsætte.' }, { status: 401 })

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Feedbacken er ugyldig.' }, { status: 400 })
    }
    const parsed = parseSessionFeedback(body)
    if ('error' in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }
    const feedback = parsed.data

    const admin = createAdminClient()
    const { data: candidate, error: candidateError } = await admin
      .from('profiles')
      .select('id, role')
      .eq('auth_user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()
    if (candidateError) throw candidateError
    if (!candidate || candidate.role !== 'candidate') {
      return NextResponse.json({ error: 'Kandidatprofilen blev ikke fundet.' }, { status: 403 })
    }

    const { data: booking, error: bookingError } = await admin
      .from('bookings')
      .select('id, candidate_profile_id, professional_profile_id, status, ends_at')
      .eq('id', feedback.bookingId)
      .eq('candidate_profile_id', candidate.id)
      .eq('status', 'completed')
      .maybeSingle()
    if (bookingError) throw bookingError
    if (
      !booking
      || !booking.professional_profile_id
      || !booking.ends_at
      || new Date(booking.ends_at).getTime() > Date.now()
    ) {
      return NextResponse.json({
        error: 'Feedback kan først gives efter en gennemført egen session.',
      }, { status: 409 })
    }

    const { data: review, error } = await admin.from('reviews').insert({
      booking_id: booking.id,
      candidate_profile_id: candidate.id,
      professional_profile_id: booking.professional_profile_id,
      rating: feedback.overallExperience,
      feedback: feedback.comment,
      feedback_schema_version: 2,
      goal_achieved: feedback.goalAchieved,
      professional_relevance: feedback.professionalRelevance,
      professional_preparedness: feedback.professionalPreparedness,
      greater_clarity: feedback.greaterClarity,
      concrete_next_steps: feedback.concreteNextSteps,
      moderation_status: 'pending',
    }).select('id, booking_id, created_at').single()
    if (error?.code === '23505') return NextResponse.json({ error: 'Sessionen er allerede vurderet.' }, { status: 409 })
    if (error?.code === '23503' || error?.code === '23514') {
      return NextResponse.json({
        error: 'Sessionen kan ikke vurderes i dens nuværende status.',
      }, { status: 409 })
    }
    if (error) throw error

    await recordProductEvent(admin, {
      eventName: 'session_feedback_completed',
      profileId: candidate.id,
      professionalProfileId: booking.professional_profile_id,
      bookingId: booking.id,
    })

    return NextResponse.json({ ok: true, review }, { status: 201 })
  } catch (error) {
    console.error('[reviews:create]', error)
    return NextResponse.json({ error: 'Vurderingen kunne ikke gemmes.' }, { status: 500 })
  }
}
