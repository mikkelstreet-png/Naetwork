import { NextResponse } from 'next/server'
import { resolveBookingParticipant } from '@/lib/server/bookingParticipant'
import { recordProductEvent } from '@/lib/server/productAnalytics'
import { isSameSiteRequest } from '@/lib/server/requestSecurity'
import type { NextMoveResponsible } from '@/lib/sessionPlan'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function canUpdateMove(
  participantRoles: readonly ('candidate' | 'professional')[],
  responsible: NextMoveResponsible,
) {
  return (
    participantRoles.includes('candidate')
    && (responsible === 'candidate' || responsible === 'shared')
  ) || (
    participantRoles.includes('professional')
    && (responsible === 'professional' || responsible === 'shared')
  )
}

export async function PATCH(
  request: Request,
  routeContext: { params: Promise<{ id: string; moveId: string }> },
) {
  if (!isSameSiteRequest(request)) {
    return NextResponse.json({ error: 'Ugyldig forespørgsel.' }, { status: 403 })
  }

  try {
    const { id, moveId } = await routeContext.params
    const resolution = await resolveBookingParticipant(id)
    if (!resolution.ok) {
      return NextResponse.json({ error: resolution.message }, { status: resolution.status })
    }
    const { admin, actor, booking } = resolution.context
    if (
      !UUID_PATTERN.test(moveId)
      || !booking.candidate_profile_id
      || !booking.professional_profile_id
    ) {
      return NextResponse.json({ error: 'Handlingen blev ikke fundet.' }, { status: 404 })
    }

    const { data: outcome, error: outcomeError } = await admin
      .from('session_outcomes')
      .select('id')
      .eq('booking_id', booking.id)
      .eq('candidate_profile_id', booking.candidate_profile_id)
      .eq('professional_profile_id', booking.professional_profile_id)
      .eq('result_status', 'published')
      .maybeSingle()
    if (outcomeError) throw outcomeError
    if (!outcome) {
      return NextResponse.json({ error: 'Sessionsresultatet er ikke klar endnu.' }, { status: 404 })
    }

    const { data: existing, error: moveError } = await admin
      .from('session_plan_next_moves')
      .select('id, position, responsible')
      .eq('id', moveId)
      .eq('session_outcome_id', outcome.id)
      .maybeSingle()
    if (moveError) throw moveError
    if (!existing) {
      return NextResponse.json({ error: 'Handlingen blev ikke fundet.' }, { status: 404 })
    }
    const responsible = existing.responsible as NextMoveResponsible
    if (!canUpdateMove(actor.participantRoles, responsible)) {
      return NextResponse.json({
        error: 'Du har ikke adgang til at opdatere denne handling.',
      }, { status: 403 })
    }

    const body = await request.json().catch(() => null)
    if (
      !body
      || typeof body !== 'object'
      || Array.isArray(body)
      || typeof body.completed !== 'boolean'
    ) {
      return NextResponse.json({ error: 'Forespørgslen indeholder ikke gyldige data.' }, { status: 400 })
    }
    const completed = body.completed
    const { data: nextMove, error } = await admin
      .from('session_plan_next_moves')
      .update({
        status: completed ? 'completed' : 'pending',
        completed_at: completed ? new Date().toISOString() : null,
      })
      .eq('id', existing.id)
      .eq('session_outcome_id', outcome.id)
      .eq('responsible', responsible)
      .select('id, position, action, responsible, due_at, status, completed_at')
      .maybeSingle()
    if (error) throw error
    if (!nextMove) {
      return NextResponse.json({
        error: 'Handlingen blev ændret i et andet vindue. Genindlæs Session Plan.',
      }, { status: 409 })
    }

    await recordProductEvent(admin, {
      eventName: completed ? 'session_plan_next_move_completed' : 'session_plan_next_move_reopened',
      profileId: actor.profileId,
      professionalProfileId: booking.professional_profile_id,
      bookingId: booking.id,
      properties: {
        position: existing.position,
        responsible,
        actorRole: responsible === 'shared' ? actor.role : responsible,
      },
    })

    return NextResponse.json({ nextMove })
  } catch (error) {
    console.error('[session-plan:next-move]', error)
    return NextResponse.json({ error: 'Handlingen kunne ikke opdateres.' }, { status: 500 })
  }
}
