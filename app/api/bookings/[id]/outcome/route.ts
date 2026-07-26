import { NextResponse } from 'next/server'
import { resolveBookingParticipant } from '@/lib/server/bookingParticipant'
import { recordProductEvent } from '@/lib/server/productAnalytics'
import { isSameSiteRequest } from '@/lib/server/requestSecurity'
import {
  SESSION_PLAN_LIMITS,
  isDefinitionOfDoneStatus,
  isNextMoveResponsible,
  type SessionPlanOutcome,
} from '@/lib/sessionPlan'

function cleanText(value: unknown, maxLength: number) {
  return typeof value === 'string'
    ? value.trim().replace(/\r\n/g, '\n').slice(0, maxLength)
    : ''
}

function cleanList(value: unknown, maxItems: number, maxLength: number) {
  return Array.isArray(value)
    ? value.map((item) => cleanText(item, maxLength)).filter(Boolean).slice(0, maxItems)
    : []
}

function cleanDate(value: unknown) {
  const date = cleanText(value, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return ''
  const [year, month, day] = date.split('-').map(Number)
  const parsed = new Date(Date.UTC(year, month - 1, day))
  return (
    parsed.getUTCFullYear() === year
    && parsed.getUTCMonth() === month - 1
    && parsed.getUTCDate() === day
  ) ? date : ''
}

function parseExpectedUpdatedAt(value: unknown) {
  if (value === null) return null
  if (
    typeof value !== 'string'
    || value.length > 64
    || Number.isNaN(Date.parse(value))
  ) {
    return undefined
  }
  return value
}

async function outcomeWithMoves(
  admin: Extract<Awaited<ReturnType<typeof resolveBookingParticipant>>, { ok: true }>['context']['admin'],
  outcome: Omit<SessionPlanOutcome, 'next_moves'> & { booking_id?: string },
) {
  const { data: moves, error } = await admin
    .from('session_plan_next_moves')
    .select('id, position, action, responsible, due_at, status, completed_at')
    .eq('session_outcome_id', outcome.id)
    .order('position', { ascending: true })
  if (error) throw error
  return { ...outcome, next_moves: moves ?? [] }
}

export async function PUT(
  request: Request,
  routeContext: { params: Promise<{ id: string }> },
) {
  if (!isSameSiteRequest(request)) {
    return NextResponse.json({ error: 'Ugyldig forespørgsel.' }, { status: 403 })
  }

  try {
    const { id } = await routeContext.params
    const resolution = await resolveBookingParticipant(id, { requiredRole: 'professional' })
    if (!resolution.ok) {
      return NextResponse.json({ error: resolution.message }, { status: resolution.status })
    }
    const { admin, booking } = resolution.context
    if (booking.status !== 'completed') {
      return NextResponse.json({ error: 'Sessionen skal være markeret som gennemført først.' }, { status: 409 })
    }

    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Forespørgslen indeholder ikke gyldige data.' }, { status: 400 })
    }
    const usesStructuredPlan = 'keyInsights' in body
      || 'definitionOfDoneStatus' in body
      || 'nextMoves' in body
      || 'publish' in body
      || 'expectedUpdatedAt' in body

    if (!usesStructuredPlan) {
      return saveLegacyOutcome(admin, booking, body)
    }

    const expectedUpdatedAt = parseExpectedUpdatedAt(body.expectedUpdatedAt)
    if (expectedUpdatedAt === undefined) {
      return NextResponse.json({
        error: 'Resultatets revisions-id mangler eller er ugyldigt. Genindlæs Session Plan.',
      }, { status: 400 })
    }

    const { data: existing, error: existingError } = await admin
      .from('session_outcomes')
      .select('id, result_status')
      .eq('booking_id', booking.id)
      .maybeSingle()
    if (existingError) throw existingError
    if (existing?.result_status === 'published') {
      return NextResponse.json({
        error: 'Resultatet er allerede publiceret og kan ikke overskrives fra dette flow.',
      }, { status: 409 })
    }

    const keyInsights = cleanText(body.keyInsights, SESSION_PLAN_LIMITS.keyInsights)
    const recommendation = cleanText(body.recommendation, SESSION_PLAN_LIMITS.recommendation)
    const decisions = cleanList(body.decisions, SESSION_PLAN_LIMITS.decisions, SESSION_PLAN_LIMITS.decision)
    const openQuestions = cleanList(body.openQuestions, SESSION_PLAN_LIMITS.openQuestions, SESSION_PLAN_LIMITS.openQuestion)
    const definitionOfDoneStatus = isDefinitionOfDoneStatus(body.definitionOfDoneStatus)
      ? body.definitionOfDoneStatus
      : null
    const nextMoves = Array.isArray(body.nextMoves)
      ? body.nextMoves
          .map((move: unknown) => {
            const item = move && typeof move === 'object' ? move as Record<string, unknown> : {}
            const action = cleanText(item.action, SESSION_PLAN_LIMITS.nextMove)
            return {
              action,
              responsible: isNextMoveResponsible(item.responsible) ? item.responsible : 'candidate',
              due_at: cleanDate(item.dueAt) || null,
            }
          })
          .filter((move: { action: string }) => move.action.length >= 3)
          .slice(0, SESSION_PLAN_LIMITS.nextMoves)
      : []
    const publish = body.publish === true

    if (publish && (
      keyInsights.length < 10
      || recommendation.length < 10
      || !definitionOfDoneStatus
      || nextMoves.length === 0
    )) {
      return NextResponse.json({
        error: 'Tilføj de vigtigste indsigter, en klar anbefaling, Definition of Done-status og mindst ét næste træk.',
      }, { status: 400 })
    }

    const { data: outcomeId, error: saveError } = await admin.rpc('save_session_outcome_v2', {
      p_booking_id: booking.id,
      p_key_insights: keyInsights || null,
      p_recommendation: recommendation || null,
      p_decisions: decisions,
      p_definition_of_done_status: definitionOfDoneStatus,
      p_open_questions: openQuestions,
      p_next_moves: nextMoves,
      p_publish: publish,
      p_expected_updated_at: expectedUpdatedAt,
    })
    if (saveError) {
      if (saveError.code === '55000') {
        return NextResponse.json({
          error: 'Resultatet eller bookingen blev ændret i et andet vindue. Genindlæs Session Plan.',
        }, { status: 409 })
      }
      if (saveError.code === '22023') {
        return NextResponse.json({ error: saveError.message }, { status: 400 })
      }
      throw saveError
    }
    if (!outcomeId) throw new Error('Outcome RPC did not return an id.')

    const { data: storedOutcome, error: storedOutcomeError } = await admin
      .from('session_outcomes')
      .select('id, booking_id, summary, recommendation, decisions, definition_of_done_status, open_questions, result_status, result_schema_version, published_at, updated_at')
      .eq('id', outcomeId)
      .single()
    if (storedOutcomeError || !storedOutcome) {
      throw storedOutcomeError ?? new Error('Outcome could not be read after save.')
    }

    if (publish) {
      await recordProductEvent(admin, {
        eventName: 'session_plan_result_completed',
        profileId: booking.candidate_profile_id,
        professionalProfileId: booking.professional_profile_id,
        bookingId: booking.id,
        properties: {
          definitionOfDoneStatus,
          nextMoveCount: nextMoves.length,
        },
      })
    }

    return NextResponse.json({
      outcome: await outcomeWithMoves(admin, storedOutcome as Omit<SessionPlanOutcome, 'next_moves'>),
    })
  } catch (error) {
    console.error('[booking-outcome:save]', error)
    return NextResponse.json({ error: 'Sessionsresultatet kunne ikke gemmes.' }, { status: 500 })
  }
}

async function saveLegacyOutcome(
  admin: Extract<Awaited<ReturnType<typeof resolveBookingParticipant>>, { ok: true }>['context']['admin'],
  booking: Extract<Awaited<ReturnType<typeof resolveBookingParticipant>>, { ok: true }>['context']['booking'],
  body: Record<string, unknown>,
) {
  const summary = cleanText(body.summary, 1_000)
  const priorities = cleanList(body.priorities, 3, 240).filter((item) => item.length >= 2)
  const nextAction = cleanText(body.nextAction, 300)
  const dueAt = cleanDate(body.nextActionDueAt)
  if (summary.length < 10 || priorities.length === 0 || nextAction.length < 3) {
    return NextResponse.json({
      error: 'Tilføj en kort opsummering, mindst én prioritet og næste handling.',
    }, { status: 400 })
  }

  const { data: outcomeId, error: saveError } = await admin.rpc('save_session_outcome_v1', {
    p_booking_id: booking.id,
    p_summary: summary,
    p_priorities: priorities,
    p_next_action: nextAction,
    p_next_action_due_at: dueAt || null,
  })
  if (saveError) {
    if (saveError.code === '55000') {
      return NextResponse.json({
        error: 'Det gamle flow kan kun redigere eksisterende legacy-resultater. Åbn Session Plan i stedet.',
      }, { status: 409 })
    }
    if (saveError.code === '22023') {
      return NextResponse.json({ error: saveError.message }, { status: 400 })
    }
    throw saveError
  }
  if (!outcomeId) throw new Error('Legacy outcome RPC did not return an id.')

  const { data: outcome, error } = await admin
    .from('session_outcomes')
    .select('id, booking_id, summary, priorities, next_action, next_action_due_at, candidate_completed_at, recommendation, decisions, definition_of_done_status, open_questions, result_status, result_schema_version, published_at, updated_at')
    .eq('id', outcomeId)
    .single()
  if (error || !outcome) throw error ?? new Error('Legacy outcome could not be saved.')

  await recordProductEvent(admin, {
    eventName: 'session_outcome_saved',
    profileId: booking.candidate_profile_id,
    professionalProfileId: booking.professional_profile_id,
    bookingId: booking.id,
  })
  return NextResponse.json({ outcome })
}

export async function PATCH(
  request: Request,
  routeContext: { params: Promise<{ id: string }> },
) {
  if (!isSameSiteRequest(request)) {
    return NextResponse.json({ error: 'Ugyldig forespørgsel.' }, { status: 403 })
  }

  try {
    const { id } = await routeContext.params
    const resolution = await resolveBookingParticipant(id, { requiredRole: 'candidate' })
    if (!resolution.ok) {
      return NextResponse.json({ error: resolution.message }, { status: resolution.status })
    }
    const { admin, booking } = resolution.context
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Forespørgslen indeholder ikke gyldige data.' }, { status: 400 })
    }
    const completed = body.completed === true
    const { data: existingOutcome, error: existingOutcomeError } = await admin
      .from('session_outcomes')
      .select('id, result_status, result_schema_version')
      .eq('booking_id', booking.id)
      .eq('candidate_profile_id', resolution.context.actor.profileId)
      .maybeSingle()
    if (existingOutcomeError) throw existingOutcomeError
    if (!existingOutcome || existingOutcome.result_status !== 'published') {
      return NextResponse.json({ error: 'Sessionsresultatet er ikke klar endnu.' }, { status: 404 })
    }
    if (existingOutcome.result_schema_version !== 1) {
      return NextResponse.json({
        error: 'Opdatér næste træk direkte i Session Plan.',
      }, { status: 409 })
    }

    const { data: outcome, error } = await admin
      .from('session_outcomes')
      .update({ candidate_completed_at: completed ? new Date().toISOString() : null })
      .eq('id', existingOutcome.id)
      .eq('result_schema_version', 1)
      .eq('result_status', 'published')
      .select('id, candidate_completed_at')
      .maybeSingle()
    if (error) throw error
    if (!outcome) {
      return NextResponse.json({
        error: 'Sessionsresultatet blev ændret i et andet vindue. Genindlæs siden.',
      }, { status: 409 })
    }
    await recordProductEvent(admin, {
      eventName: completed ? 'session_next_action_completed' : 'session_next_action_reopened',
      profileId: resolution.context.actor.profileId,
      professionalProfileId: booking.professional_profile_id,
      bookingId: booking.id,
    })
    return NextResponse.json({ outcome })
  } catch (error) {
    console.error('[booking-outcome:complete]', error)
    return NextResponse.json({ error: 'Næste skridt kunne ikke opdateres.' }, { status: 500 })
  }
}
