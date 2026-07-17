import { NextResponse } from 'next/server'
import { recordProductEvent } from '@/lib/server/productAnalytics'
import { isSameSiteRequest } from '@/lib/server/requestSecurity'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

function cleanText(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().replace(/\r\n/g, '\n').slice(0, maxLength) : ''
}

async function outcomeContext(bookingId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const admin = createAdminClient()
  const { data: actor } = await admin.from('profiles').select('id').eq('auth_user_id', user.id).maybeSingle()
  if (!actor) return null
  const { data: booking } = await admin
    .from('bookings')
    .select('id, status, candidate_profile_id, professional_profile_id')
    .eq('id', bookingId)
    .maybeSingle()
  if (!booking) return { admin, actor, booking: null, professional: null }
  const { data: professional } = await admin
    .from('professional_profiles')
    .select('id, profile_id')
    .eq('id', booking.professional_profile_id)
    .maybeSingle()
  return { admin, actor, booking, professional }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isSameSiteRequest(request)) return NextResponse.json({ error: 'Ugyldig forespørgsel.' }, { status: 403 })
  try {
    const { id } = await context.params
    const resolved = await outcomeContext(id)
    if (!resolved) return NextResponse.json({ error: 'Log ind for at fortsætte.' }, { status: 401 })
    if (!resolved.booking || !resolved.professional) return NextResponse.json({ error: 'Bookingen blev ikke fundet.' }, { status: 404 })
    if (resolved.professional.profile_id !== resolved.actor.id) return NextResponse.json({ error: 'Kun den professionelle kan gemme sessionsresultatet.' }, { status: 403 })
    if (resolved.booking.status !== 'completed') return NextResponse.json({ error: 'Sessionen skal være markeret som gennemført først.' }, { status: 409 })

    const body = await request.json()
    const summary = cleanText(body.summary, 1000)
    const priorities = Array.isArray(body.priorities)
      ? body.priorities.map((item: unknown) => cleanText(item, 240)).filter((item: string) => item.length >= 2).slice(0, 3)
      : []
    const nextAction = cleanText(body.nextAction, 300)
    const dueAt = cleanText(body.nextActionDueAt, 10)
    if (summary.length < 10 || priorities.length === 0 || nextAction.length < 3) {
      return NextResponse.json({ error: 'Tilføj en kort opsummering, mindst én prioritet og næste handling.' }, { status: 400 })
    }
    if (dueAt && !/^\d{4}-\d{2}-\d{2}$/.test(dueAt)) return NextResponse.json({ error: 'Deadline er ugyldig.' }, { status: 400 })

    const { data: outcome, error } = await resolved.admin.from('session_outcomes').upsert({
      booking_id: resolved.booking.id,
      candidate_profile_id: resolved.booking.candidate_profile_id,
      professional_profile_id: resolved.booking.professional_profile_id,
      summary,
      priorities,
      next_action: nextAction,
      next_action_due_at: dueAt || null,
    }, { onConflict: 'booking_id' })
      .select('id, booking_id, summary, priorities, next_action, next_action_due_at, candidate_completed_at, updated_at')
      .single()
    if (error) throw error
    await recordProductEvent(resolved.admin, {
      eventName: 'session_outcome_saved',
      profileId: resolved.booking.candidate_profile_id,
      professionalProfileId: resolved.booking.professional_profile_id,
      bookingId: resolved.booking.id,
    })
    return NextResponse.json({ outcome })
  } catch (error) {
    console.error('[booking-outcome:save]', error)
    return NextResponse.json({ error: 'Sessionsresultatet kunne ikke gemmes.' }, { status: 500 })
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isSameSiteRequest(request)) return NextResponse.json({ error: 'Ugyldig forespørgsel.' }, { status: 403 })
  try {
    const { id } = await context.params
    const resolved = await outcomeContext(id)
    if (!resolved) return NextResponse.json({ error: 'Log ind for at fortsætte.' }, { status: 401 })
    if (!resolved.booking) return NextResponse.json({ error: 'Bookingen blev ikke fundet.' }, { status: 404 })
    if (resolved.booking.candidate_profile_id !== resolved.actor.id) return NextResponse.json({ error: 'Kun kandidaten kan opdatere sit næste skridt.' }, { status: 403 })
    const body = await request.json()
    const completed = body.completed === true
    const { data: outcome, error } = await resolved.admin
      .from('session_outcomes')
      .update({ candidate_completed_at: completed ? new Date().toISOString() : null })
      .eq('booking_id', id)
      .eq('candidate_profile_id', resolved.actor.id)
      .select('id, candidate_completed_at')
      .maybeSingle()
    if (error) throw error
    if (!outcome) return NextResponse.json({ error: 'Sessionsresultatet er ikke klar endnu.' }, { status: 404 })
    await recordProductEvent(resolved.admin, {
      eventName: completed ? 'session_next_action_completed' : 'session_next_action_reopened',
      profileId: resolved.actor.id,
      professionalProfileId: resolved.booking.professional_profile_id,
      bookingId: id,
    })
    return NextResponse.json({ outcome })
  } catch (error) {
    console.error('[booking-outcome:complete]', error)
    return NextResponse.json({ error: 'Næste skridt kunne ikke opdateres.' }, { status: 500 })
  }
}
