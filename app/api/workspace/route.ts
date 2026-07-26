import { NextResponse } from 'next/server'
import { isCategoryId } from '@/lib/categories'
import { mapPublicProfessionals } from '@/lib/professionals'
import { recordProductEvent } from '@/lib/server/productAnalytics'
import { isSameSiteRequest } from '@/lib/server/requestSecurity'
import { isSessionTypeId } from '@/lib/sessionTypes'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

const SITUATION_STAGES = ['exploring', 'preparing', 'applying', 'interviewing', 'deciding'] as const
type SituationStage = typeof SITUATION_STAGES[number]

function cleanText(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, maxLength) : ''
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

function isSituationStage(value: unknown): value is SituationStage {
  return typeof value === 'string' && SITUATION_STAGES.includes(value as SituationStage)
}

async function actorContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const admin = createAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('id, role')
    .eq('auth_user_id', user.id)
    .eq('status', 'active')
    .maybeSingle()
  return profile ? { admin, profile } : null
}

async function professionalWorkspace(
  context: NonNullable<Awaited<ReturnType<typeof actorContext>>>,
) {
  const { data: professional, error: professionalError } = await context.admin
    .from('professional_profiles')
    .select('id, title, company, bio, experience_summary, relevant_situations, expected_outcomes, focus_areas, industries, languages, years_experience, price_dkk, linkedin_url, visibility, review_status')
    .eq('profile_id', context.profile.id)
    .maybeSingle()
  if (professionalError) throw professionalError

  if (!professional) {
    return {
      professional: null,
      requests: [],
      upcomingSessions: [],
      missingResults: [],
      availability: { openCount: 0, nextAvailableAt: null },
      quality: { completedSessionCount: 0, publishedReviewCount: 0, averageRating: null },
    }
  }

  const now = new Date().toISOString()
  const [
    { data: bookings, error: bookingsError },
    { data: slots, error: slotsError, count: openSlotCount },
    { data: reviews, error: reviewsError },
  ] = await Promise.all([
    context.admin
      .from('bookings')
      .select('id, candidate_profile_id, starts_at, ends_at, status, created_at')
      .eq('professional_profile_id', professional.id)
      .order('starts_at', { ascending: true }),
    context.admin
      .from('availability_slots')
      .select('id, starts_at', { count: 'exact' })
      .eq('professional_profile_id', professional.id)
      .eq('is_available', true)
      .gte('starts_at', now)
      .order('starts_at', { ascending: true })
      .limit(1),
    context.admin
      .from('reviews')
      .select('rating')
      .eq('professional_profile_id', professional.id)
      .eq('moderation_status', 'published'),
  ])
  if (bookingsError || slotsError || reviewsError) {
    throw bookingsError ?? slotsError ?? reviewsError
  }

  const bookingRows = bookings ?? []
  const bookingIds = bookingRows.map((booking) => booking.id)
  const candidateIds = Array.from(new Set(
    bookingRows
      .map((booking) => booking.candidate_profile_id)
      .filter((candidateId): candidateId is string => Boolean(candidateId)),
  ))
  const [
    { data: plans, error: plansError },
    { data: outcomes, error: outcomesError },
    { data: candidates, error: candidatesError },
  ] = bookingIds.length
    ? await Promise.all([
        context.admin
          .from('session_plans')
          .select('booking_id, preparation_status')
          .in('booking_id', bookingIds),
        context.admin
          .from('session_outcomes')
          .select('booking_id, result_status')
          .in('booking_id', bookingIds),
        candidateIds.length
          ? context.admin.from('profiles').select('id, name').in('id', candidateIds)
          : Promise.resolve({ data: [], error: null }),
      ])
    : [
        { data: [], error: null },
        { data: [], error: null },
        { data: [], error: null },
      ]
  if (plansError || outcomesError || candidatesError) {
    throw plansError ?? outcomesError ?? candidatesError
  }

  const candidateNames = new Map((candidates ?? []).map((candidate) => [
    candidate.id,
    candidate.name?.trim() || 'Kandidat',
  ]))
  const planStatus = new Map((plans ?? []).map((plan) => [
    plan.booking_id,
    plan.preparation_status === 'ready' ? 'ready' as const : 'incomplete' as const,
  ]))
  const publishedOutcomeIds = new Set(
    (outcomes ?? [])
      .filter((outcome) => outcome.result_status === 'published')
      .map((outcome) => outcome.booking_id),
  )
  const actionBooking = (booking: typeof bookingRows[number]) => ({
    bookingId: booking.id,
    candidateName: candidateNames.get(booking.candidate_profile_id) ?? 'Kandidat',
    startsAt: booking.starts_at,
    endsAt: booking.ends_at,
  })
  const requests = bookingRows
    .filter((booking) => ['requested', 'pending'].includes(booking.status))
    .map(actionBooking)
  const upcomingSessions = bookingRows
    .filter((booking) => (
      ['confirmed', 'rescheduled'].includes(booking.status)
      && booking.starts_at > now
    ))
    .map((booking) => ({
      ...actionBooking(booking),
      preparationStatus: planStatus.get(booking.id) ?? 'incomplete',
    }))
  const missingResults = bookingRows
    .filter((booking) => booking.status === 'completed' && !publishedOutcomeIds.has(booking.id))
    .map(actionBooking)
    .reverse()
  const publishedRatings = (reviews ?? [])
    .map((review) => Number(review.rating))
    .filter((rating) => Number.isFinite(rating))
  const averageRating = publishedRatings.length > 0
    ? publishedRatings.reduce((sum, rating) => sum + rating, 0) / publishedRatings.length
    : null

  return {
    professional,
    requests,
    upcomingSessions,
    missingResults,
    availability: {
      openCount: openSlotCount ?? 0,
      nextAvailableAt: slots?.[0]?.starts_at ?? null,
    },
    quality: {
      completedSessionCount: bookingRows.filter((booking) => booking.status === 'completed').length,
      publishedReviewCount: publishedRatings.length,
      averageRating,
    },
  }
}

export async function GET() {
  try {
    const context = await actorContext()
    if (!context) return NextResponse.json({ error: 'Log ind for at se dit arbejdsrum.' }, { status: 401 })

    if (context.profile.role === 'professional') {
      const workspace = await professionalWorkspace(context)
      return NextResponse.json({
        accountRole: context.profile.role,
        professionalWorkspace: workspace,
        situation: null,
        savedProfessionals: [],
        savedProfessionalIds: [],
        availabilityAlertIds: [],
        outcomes: [],
      })
    }

    const [
      { data: situation, error: situationError },
      { data: savedRows, error: savedRowsError },
      { data: alertRows, error: alertRowsError },
      { data: outcomes, error: outcomesError },
    ] = await Promise.all([
      context.admin
        .from('career_situations')
        .select('id, title, category, session_type, stage, deadline, next_action, is_active, updated_at')
        .eq('profile_id', context.profile.id)
        .eq('is_active', true)
        .maybeSingle(),
      context.admin
        .from('saved_professionals')
        .select('professional_profile_id, career_situation_id, created_at')
        .eq('profile_id', context.profile.id)
        .order('created_at', { ascending: false })
        .limit(25),
      context.admin
        .from('availability_alerts')
        .select('professional_profile_id')
        .eq('profile_id', context.profile.id)
        .eq('is_active', true),
      context.admin
        .from('session_outcomes')
        .select('id, booking_id, professional_profile_id, summary, priorities, next_action, next_action_due_at, candidate_completed_at, definition_of_done_status, open_questions, result_schema_version, updated_at')
        .eq('candidate_profile_id', context.profile.id)
        .eq('result_status', 'published')
        .order('updated_at', { ascending: false })
        .limit(8),
    ])
    if (situationError || savedRowsError || alertRowsError || outcomesError) {
      throw situationError ?? savedRowsError ?? alertRowsError ?? outcomesError
    }

    const outcomeIds = (outcomes ?? []).map((outcome) => outcome.id)
    const { data: nextMoves, error: nextMovesError } = outcomeIds.length > 0
      ? await context.admin
          .from('session_plan_next_moves')
          .select('id, session_outcome_id, position, action, responsible, due_at, status, completed_at')
          .in('session_outcome_id', outcomeIds)
          .order('position', { ascending: true })
      : { data: [], error: null }
    if (nextMovesError) throw nextMovesError
    const nextMovesByOutcome = new Map<string, typeof nextMoves>()
    for (const move of nextMoves ?? []) {
      const current = nextMovesByOutcome.get(move.session_outcome_id) ?? []
      current.push(move)
      nextMovesByOutcome.set(move.session_outcome_id, current)
    }

    const savedIds = new Set((savedRows ?? []).map((row) => row.professional_profile_id))
    const outcomeProfessionalIds = new Set((outcomes ?? []).map((row) => row.professional_profile_id))
    const relevantIds = new Set([...savedIds, ...outcomeProfessionalIds])
    const { data: publicRows } = relevantIds.size > 0
      ? await context.admin.rpc('get_public_professionals')
      : { data: [] }
    const publicProfessionals = mapPublicProfessionals(publicRows ?? []).filter((professional) => relevantIds.has(professional.id))
    const professionalMap = new Map(publicProfessionals.map((professional) => [professional.id, professional]))
    const visibleSavedRows = (savedRows ?? [])
      .filter((row) => professionalMap.has(row.professional_profile_id))
      .slice(0, 3)
    const visibleSavedIds = visibleSavedRows.map((row) => row.professional_profile_id)

    return NextResponse.json({
      accountRole: context.profile.role,
      situation: situation ?? null,
      savedProfessionals: visibleSavedRows.map((row) => ({
        ...row,
        professional: professionalMap.get(row.professional_profile_id) ?? null,
      })),
      savedProfessionalIds: visibleSavedIds,
      availabilityAlertIds: (alertRows ?? []).map((row) => row.professional_profile_id),
      outcomes: (outcomes ?? []).map((outcome) => ({
        ...outcome,
        next_moves: nextMovesByOutcome.get(outcome.id) ?? [],
        professional: professionalMap.get(outcome.professional_profile_id) ?? null,
      })),
    })
  } catch (error) {
    console.error('[workspace:list]', error)
    return NextResponse.json({ error: 'Dit arbejdsrum kunne ikke indlæses.' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!isSameSiteRequest(request)) return NextResponse.json({ error: 'Ugyldig forespørgsel.' }, { status: 403 })
  try {
    const context = await actorContext()
    if (!context) return NextResponse.json({ error: 'Log ind for at gemme din situation.' }, { status: 401 })
    const body = await request.json()
    const title = cleanText(body.title, 160)
    const category = cleanText(body.category, 40)
    const sessionType = cleanText(body.sessionType, 64)
    const stage = isSituationStage(body.stage) ? body.stage : 'preparing'
    const nextAction = cleanText(body.nextAction, 300)
    const deadline = cleanText(body.deadline, 10)

    if (title.length < 3 || !isCategoryId(category) || !isSessionTypeId(sessionType)) {
      return NextResponse.json({ error: 'Vælg et gyldigt mål, en kategori og en sessionstype.' }, { status: 400 })
    }
    if (deadline && !/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
      return NextResponse.json({ error: 'Deadline skal være en gyldig dato.' }, { status: 400 })
    }

    const { data: existing } = await context.admin
      .from('career_situations')
      .select('id')
      .eq('profile_id', context.profile.id)
      .eq('is_active', true)
      .maybeSingle()
    const payload = {
      title,
      category,
      session_type: sessionType,
      stage,
      deadline: deadline || null,
      next_action: nextAction || null,
      is_active: true,
    }
    const query = existing
      ? context.admin.from('career_situations').update(payload).eq('id', existing.id).eq('profile_id', context.profile.id)
      : context.admin.from('career_situations').insert({ ...payload, profile_id: context.profile.id })
    const { data: situation, error } = await query
      .select('id, title, category, session_type, stage, deadline, next_action, is_active, updated_at')
      .single()
    if (error) throw error

    await recordProductEvent(context.admin, {
      eventName: existing ? 'career_situation_updated' : 'career_situation_created',
      profileId: context.profile.id,
      properties: { category, sessionType, stage },
    })
    return NextResponse.json({ situation })
  } catch (error) {
    console.error('[workspace:situation]', error)
    return NextResponse.json({ error: 'Situationen kunne ikke gemmes.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!isSameSiteRequest(request)) return NextResponse.json({ error: 'Ugyldig forespørgsel.' }, { status: 403 })
  try {
    const context = await actorContext()
    if (!context) return NextResponse.json({ error: 'Log ind for at gemme profilen.' }, { status: 401 })
    const body = await request.json()
    const action = body.action === 'availability_alert' ? 'availability_alert' : body.action === 'save_professional' ? 'save_professional' : null
    const professionalId = cleanText(body.professionalId, 64)
    if (!action || !isUuid(professionalId)) return NextResponse.json({ error: 'Profil eller handling er ugyldig.' }, { status: 400 })

    const { data: professional } = await context.admin
      .from('professional_profiles')
      .select('id')
      .eq('id', professionalId)
      .eq('visibility', 'published')
      .eq('review_status', 'approved')
      .maybeSingle()
    if (!professional) return NextResponse.json({ error: 'Profilen er ikke længere offentlig.' }, { status: 404 })

    if (action === 'save_professional') {
      const { data: existing } = await context.admin
        .from('saved_professionals')
        .select('id')
        .eq('profile_id', context.profile.id)
        .eq('professional_profile_id', professionalId)
        .maybeSingle()
      if (!existing) {
        const [{ data: currentSaved }, { data: publicRows }] = await Promise.all([
          context.admin
            .from('saved_professionals')
            .select('professional_profile_id')
            .eq('profile_id', context.profile.id)
            .limit(100),
          context.admin.rpc('get_public_professionals'),
        ])
        const publicIds = new Set((publicRows ?? []).map((row: { id: string }) => row.id))
        const staleIds = (currentSaved ?? [])
          .map((row) => row.professional_profile_id)
          .filter((id) => !publicIds.has(id))
        if (staleIds.length > 0) {
          const { error: cleanupError } = await context.admin
            .from('saved_professionals')
            .delete()
            .eq('profile_id', context.profile.id)
            .in('professional_profile_id', staleIds)
          if (cleanupError) throw cleanupError
        }
        const visibleCount = (currentSaved ?? []).filter((row) => publicIds.has(row.professional_profile_id)).length
        if (visibleCount >= 3) return NextResponse.json({ error: 'Din shortlist kan højst indeholde tre profiler.' }, { status: 409 })
        const { count: duplicateCount } = await context.admin
          .from('saved_professionals')
          .select('id', { count: 'exact', head: true })
          .eq('profile_id', context.profile.id)
          .eq('professional_profile_id', professionalId)
        if ((duplicateCount ?? 0) > 0) return NextResponse.json({ saved: true })
      }
      const { data: activeSituation } = await context.admin
        .from('career_situations')
        .select('id')
        .eq('profile_id', context.profile.id)
        .eq('is_active', true)
        .maybeSingle()
      const { error } = await context.admin.from('saved_professionals').upsert({
        profile_id: context.profile.id,
        professional_profile_id: professionalId,
        career_situation_id: activeSituation?.id ?? null,
      }, { onConflict: 'profile_id,professional_profile_id' })
      if (error) throw error
      await recordProductEvent(context.admin, {
        eventName: 'professional_saved',
        profileId: context.profile.id,
        professionalProfileId: professionalId,
      })
      return NextResponse.json({ saved: true })
    }

    const { error } = await context.admin.from('availability_alerts').upsert({
      profile_id: context.profile.id,
      professional_profile_id: professionalId,
      is_active: true,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'profile_id,professional_profile_id' })
    if (error) throw error
    await recordProductEvent(context.admin, {
      eventName: 'availability_alert_created',
      profileId: context.profile.id,
      professionalProfileId: professionalId,
    })
    return NextResponse.json({ alerted: true })
  } catch (error) {
    console.error('[workspace:action]', error)
    return NextResponse.json({ error: 'Dit valg kunne ikke gemmes.' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!isSameSiteRequest(request)) return NextResponse.json({ error: 'Ugyldig forespørgsel.' }, { status: 403 })
  try {
    const context = await actorContext()
    if (!context) return NextResponse.json({ error: 'Log ind for at ændre dit arbejdsrum.' }, { status: 401 })
    const params = new URL(request.url).searchParams
    const action = params.get('action')
    const professionalId = cleanText(params.get('professionalId'), 64)
    if (!isUuid(professionalId)) return NextResponse.json({ error: 'Profilen er ugyldig.' }, { status: 400 })

    if (action === 'save_professional') {
      const { error } = await context.admin
        .from('saved_professionals')
        .delete()
        .eq('profile_id', context.profile.id)
        .eq('professional_profile_id', professionalId)
      if (error) throw error
      return NextResponse.json({ saved: false })
    }
    if (action === 'availability_alert') {
      const { error } = await context.admin
        .from('availability_alerts')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('profile_id', context.profile.id)
        .eq('professional_profile_id', professionalId)
      if (error) throw error
      return NextResponse.json({ alerted: false })
    }
    return NextResponse.json({ error: 'Handlingen er ugyldig.' }, { status: 400 })
  } catch (error) {
    console.error('[workspace:remove]', error)
    return NextResponse.json({ error: 'Dit valg kunne ikke fjernes.' }, { status: 500 })
  }
}
