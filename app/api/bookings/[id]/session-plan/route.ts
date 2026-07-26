import { NextResponse } from 'next/server'
import { resolveBookingParticipant } from '@/lib/server/bookingParticipant'
import { recordProductEvent } from '@/lib/server/productAnalytics'
import { isSameSiteRequest } from '@/lib/server/requestSecurity'
import {
  SESSION_PLAN_LIMITS,
  preparationProgress,
  type SessionPlanPreparationDraft,
} from '@/lib/sessionPlan'

const PREPARATION_EDITABLE_STATUSES = ['requested', 'pending', 'confirmed', 'rescheduled']
const PROFESSIONAL_READABLE_STATUSES = [...PREPARATION_EDITABLE_STATUSES, 'completed', 'disputed']

function cleanText(value: unknown, maxLength: number) {
  return typeof value === 'string'
    ? value.trim().replace(/\r\n/g, '\n').slice(0, maxLength)
    : ''
}

function cleanList(value: unknown, maxItems: number, maxLength: number) {
  return Array.isArray(value)
    ? value
        .map((item) => cleanText(item, maxLength))
        .filter(Boolean)
        .slice(0, maxItems)
    : []
}

function notAvailable(error: unknown, fallback: string) {
  console.error('[session-plan]', error)
  return NextResponse.json({ error: fallback }, { status: 500 })
}

async function counterpart(
  context: Extract<Awaited<ReturnType<typeof resolveBookingParticipant>>, { ok: true }>['context'],
) {
  if (context.actor.role === 'candidate') {
    const { data: professional } = await context.admin
      .from('professional_profiles')
      .select('id, profile_id, title, company, visibility, review_status')
      .eq('id', context.booking.professional_profile_id)
      .maybeSingle()
    const { data: owner } = professional?.profile_id
      ? await context.admin.from('profiles').select('name, role, status').eq('id', professional.profile_id).maybeSingle()
      : { data: null }
    const canRebook = professional?.visibility === 'published'
      && professional.review_status === 'approved'
      && owner?.role === 'professional'
      && owner.status === 'active'
    return {
      name: owner?.name || 'Professionel',
      title: [professional?.title, professional?.company].filter(Boolean).join(' · ') || 'Erfaren professionel',
      rebookProfessionalProfileId: canRebook ? professional.id : null,
    }
  }

  const { data: candidate } = await context.admin
    .from('profiles')
    .select('name')
    .eq('id', context.booking.candidate_profile_id)
    .maybeSingle()
  return {
    name: candidate?.name || 'Kandidat',
    title: 'Kandidat',
    rebookProfessionalProfileId: null,
  }
}

export async function GET(
  _request: Request,
  routeContext: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await routeContext.params
    const resolution = await resolveBookingParticipant(id)
    if (!resolution.ok) {
      return NextResponse.json({ error: resolution.message }, { status: resolution.status })
    }
    const { admin, actor, booking } = resolution.context
    if (actor.role === 'professional' && !PROFESSIONAL_READABLE_STATUSES.includes(booking.status)) {
      return NextResponse.json({ error: 'Bookingen blev ikke fundet.' }, { status: 404 })
    }

    const { error: planCreateError } = await admin.from('session_plans').upsert({
      booking_id: booking.id,
      desired_outcome: booking.goal || null,
    }, {
      onConflict: 'booking_id',
      ignoreDuplicates: true,
    })
    if (planCreateError) throw planCreateError

    const [{ data: preparation, error: preparationError }, { data: outcome, error: outcomeError }, counterpartData] = await Promise.all([
      admin
        .from('session_plans')
        .select('booking_id, problem, context, desired_outcome, definition_of_done, key_questions, anything_else, preparation_status, prepared_at, updated_at')
        .eq('booking_id', booking.id)
        .single(),
      admin
        .from('session_outcomes')
        .select('id, summary, recommendation, decisions, definition_of_done_status, open_questions, result_status, result_schema_version, published_at, updated_at')
        .eq('booking_id', booking.id)
        .maybeSingle(),
      counterpart(resolution.context),
    ])
    if (preparationError || !preparation) throw preparationError ?? new Error('Session Plan row missing.')
    if (outcomeError) throw outcomeError

    const visibleOutcome = outcome && (actor.role === 'professional' || outcome.result_status === 'published')
      ? outcome
      : null
    const [movesResult, privateNoteResult] = await Promise.all([
      visibleOutcome
        ? admin
            .from('session_plan_next_moves')
            .select('id, position, action, responsible, due_at, status, completed_at')
            .eq('session_outcome_id', visibleOutcome.id)
            .order('position', { ascending: true })
        : Promise.resolve({ data: [], error: null }),
      actor.role === 'professional'
        ? admin
            .from('professional_session_notes')
            .select('note, updated_at')
            .eq('booking_id', booking.id)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),
    ])
    if (movesResult.error) throw movesResult.error
    if (privateNoteResult.error) throw privateNoteResult.error
    const moves = movesResult.data
    const privateNote = privateNoteResult.data

    const now = Date.now()
    const beforeStart = new Date(booking.starts_at).getTime() > now
    const activePreparation = PREPARATION_EDITABLE_STATUSES.includes(booking.status)
    const canEditPreparation = actor.role === 'candidate' && beforeStart && activePreparation
    const canEditPrivateNote = actor.role === 'professional'
      && activePreparation
      && new Date(booking.ends_at).getTime() > now
    const canEditOutcome = actor.role === 'professional'
      && booking.status === 'completed'
      && visibleOutcome?.result_status !== 'published'
    const canUpdateNextMoves = visibleOutcome?.result_status === 'published'

    if (actor.role === 'professional') {
      await recordProductEvent(admin, {
        eventName: 'session_plan_viewed_professional',
        profileId: booking.candidate_profile_id,
        professionalProfileId: booking.professional_profile_id,
        bookingId: booking.id,
        properties: { preparationStatus: preparation.preparation_status },
      })
    } else if (visibleOutcome?.result_status === 'published') {
      await recordProductEvent(admin, {
        eventName: 'session_plan_result_viewed_candidate',
        profileId: booking.candidate_profile_id,
        professionalProfileId: booking.professional_profile_id,
        bookingId: booking.id,
      })
    }

    return NextResponse.json({
      viewerRole: actor.role,
      booking: {
        id: booking.id,
        rebook_professional_profile_id: counterpartData.rebookProfessionalProfileId,
        starts_at: booking.starts_at,
        ends_at: booking.ends_at,
        status: booking.status,
        session_type: booking.session_type,
        goal: booking.goal,
        material_url: booking.material_url,
        time_zone: booking.time_zone || 'Europe/Copenhagen',
        meeting_mode: booking.meeting_mode || 'video',
        meeting_url: booking.meeting_url,
        counterpart_name: counterpartData.name,
        counterpart_title: counterpartData.title,
      },
      preparation,
      ...(actor.role === 'professional' ? {
        privateNote: privateNote?.note ?? '',
        privateNoteUpdatedAt: privateNote?.updated_at ?? null,
      } : {}),
      outcome: visibleOutcome ? { ...visibleOutcome, next_moves: moves ?? [] } : null,
      permissions: {
        canEditPreparation,
        canEditPrivateNote,
        canEditOutcome,
        canUpdateNextMoves,
      },
    }, {
      headers: { 'Cache-Control': 'private, no-store' },
    })
  } catch (error) {
    return notAvailable(error, 'Session Plan kunne ikke indlæses.')
  }
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

    if (
      !PREPARATION_EDITABLE_STATUSES.includes(booking.status)
      || new Date(booking.starts_at).getTime() <= Date.now()
    ) {
      return NextResponse.json({
        error: 'Forberedelsen kan ikke længere redigeres, fordi sessionen er startet eller bookingen er lukket.',
      }, { status: 409 })
    }

    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Forespørgslen indeholder ikke gyldige data.' }, { status: 400 })
    }
    const expectedUpdatedAt = typeof body.expectedUpdatedAt === 'string'
      ? body.expectedUpdatedAt
      : ''
    if (!expectedUpdatedAt || Number.isNaN(Date.parse(expectedUpdatedAt))) {
      return NextResponse.json({
        error: 'Session Plan-versionen mangler. Genindlæs siden og prøv igen.',
      }, { status: 400 })
    }
    const draft: SessionPlanPreparationDraft = {
      problem: cleanText(body.problem, SESSION_PLAN_LIMITS.problem),
      context: cleanText(body.context, SESSION_PLAN_LIMITS.context),
      desiredOutcome: cleanText(body.desiredOutcome, SESSION_PLAN_LIMITS.desiredOutcome),
      definitionOfDone: cleanText(body.definitionOfDone, SESSION_PLAN_LIMITS.definitionOfDone),
      keyQuestions: cleanList(body.keyQuestions, SESSION_PLAN_LIMITS.keyQuestions, SESSION_PLAN_LIMITS.keyQuestion),
      anythingElse: cleanText(body.anythingElse, SESSION_PLAN_LIMITS.anythingElse),
    }
    const requestedStatus = body.preparationStatus === 'ready' ? 'ready' : 'draft'
    const progress = preparationProgress(draft)
    if (requestedStatus === 'ready' && !progress.ready) {
      return NextResponse.json({
        error: 'Udfyld problem, ønsket resultat og dit konkrete succeskriterium, før planen markeres som klar.',
      }, { status: 400 })
    }

    const { data: existing } = await admin
      .from('session_plans')
      .select('problem, context, desired_outcome, definition_of_done, key_questions, anything_else, preparation_status, updated_at')
      .eq('booking_id', booking.id)
      .maybeSingle()
    if (!existing || existing.updated_at !== expectedUpdatedAt) {
      return NextResponse.json({
        error: 'Forberedelsen er ændret i et andet vindue. Genindlæs siden, før du gemmer igen.',
      }, { status: 409 })
    }
    const hadCandidateInput = Boolean(
      existing?.problem
      || existing?.context
      || existing?.definition_of_done
      || existing?.key_questions?.length
      || existing?.anything_else,
    )

    const preparedAt = requestedStatus === 'ready' ? new Date().toISOString() : null
    const { data: preparation, error } = await admin.from('session_plans').update({
      problem: draft.problem || null,
      context: draft.context || null,
      desired_outcome: draft.desiredOutcome || null,
      definition_of_done: draft.definitionOfDone || null,
      key_questions: draft.keyQuestions,
      anything_else: draft.anythingElse || null,
      preparation_status: requestedStatus,
      prepared_at: preparedAt,
    })
      .eq('booking_id', booking.id)
      .eq('updated_at', expectedUpdatedAt)
      .select('booking_id, problem, context, desired_outcome, definition_of_done, key_questions, anything_else, preparation_status, prepared_at, updated_at')
      .maybeSingle()
    if (error) throw error
    if (!preparation) {
      return NextResponse.json({
        error: 'Forberedelsen er ændret i et andet vindue. Genindlæs siden, før du gemmer igen.',
      }, { status: 409 })
    }

    if (!hadCandidateInput && progress.complete > 0) {
      await recordProductEvent(admin, {
        eventName: 'session_plan_preparation_started',
        profileId: booking.candidate_profile_id,
        professionalProfileId: booking.professional_profile_id,
        bookingId: booking.id,
        properties: { completedRequiredFields: progress.complete },
      })
    }
    if (requestedStatus === 'ready' && existing?.preparation_status !== 'ready') {
      await recordProductEvent(admin, {
        eventName: 'session_plan_preparation_completed',
        profileId: booking.candidate_profile_id,
        professionalProfileId: booking.professional_profile_id,
        bookingId: booking.id,
        properties: { questionCount: draft.keyQuestions.length },
      })
    }

    return NextResponse.json({ preparation })
  } catch (error) {
    return notAvailable(error, 'Forberedelsen kunne ikke gemmes.')
  }
}
