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

export async function GET() {
  try {
    const context = await actorContext()
    if (!context) return NextResponse.json({ error: 'Log ind for at se dit arbejdsrum.' }, { status: 401 })

    const [{ data: situation }, { data: savedRows }, { data: alertRows }, { data: outcomes }] = await Promise.all([
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
        .select('id, booking_id, professional_profile_id, summary, priorities, next_action, next_action_due_at, candidate_completed_at, updated_at')
        .eq('candidate_profile_id', context.profile.id)
        .order('updated_at', { ascending: false })
        .limit(8),
    ])

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
