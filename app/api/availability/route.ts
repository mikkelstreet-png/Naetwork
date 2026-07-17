import { NextResponse } from 'next/server'
import { appUrl, sendTransactionalEmail } from '@/lib/server/email'
import { isSameSiteRequest } from '@/lib/server/requestSecurity'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

async function professionalForRequest() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('id, role, name').eq('auth_user_id', user.id).maybeSingle()
  if (!profile || profile.role !== 'professional') return null
  const { data: professional } = await admin
    .from('professional_profiles')
    .select('id, review_status, visibility')
    .eq('profile_id', profile.id)
    .maybeSingle()
  return professional ? { admin, profile, professional } : null
}

async function notifyAvailabilityAlerts(
  context: NonNullable<Awaited<ReturnType<typeof professionalForRequest>>>,
  firstStart: string,
) {
  if (context.professional.review_status !== 'approved' || context.professional.visibility !== 'published') return

  const { data: alerts } = await context.admin
    .from('availability_alerts')
    .select('id, profile_id, last_notified_at')
    .eq('professional_profile_id', context.professional.id)
    .eq('is_active', true)
  const cooldownStart = Date.now() - 24 * 60 * 60 * 1000
  const eligibleAlerts = (alerts ?? []).filter((alert) => (
    !alert.last_notified_at || new Date(alert.last_notified_at).getTime() < cooldownStart
  ))
  if (!eligibleAlerts.length) return

  const { data: profiles } = await context.admin
    .from('profiles')
    .select('id, auth_user_id, name')
    .in('id', eligibleAlerts.map((alert) => alert.profile_id))
    .eq('status', 'active')
  const profilesById = new Map((profiles ?? []).map((profile) => [profile.id, profile]))
  const formatted = new Date(firstStart).toLocaleString('da-DK', {
    weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Copenhagen',
  })

  await Promise.allSettled(eligibleAlerts.map(async (alert) => {
    const recipient = profilesById.get(alert.profile_id)
    if (!recipient) return
    const { data: authResult } = await context.admin.auth.admin.getUserById(recipient.auth_user_id)
    if (!authResult.user?.email) return
    await sendTransactionalEmail({
      to: authResult.user.email,
      templateKey: 'availability_opened',
      recipientProfileId: recipient.id,
      dedupeKey: `availability-opened-${alert.id}-${firstStart}`,
      subject: `Ny tid hos ${context.profile.name || 'en professionel på Naetwork'}`,
      title: 'En profil på din shortlist har åbnet en ny tid',
      intro: `Hej ${recipient.name || 'der'}. ${context.profile.name || 'Den professionelle'} har netop åbnet en ny 60-minutters sessionstid.`,
      rows: [{ label: 'Første nye tid', value: formatted }],
      note: 'Tiden er ikke reserveret, før du har sendt en bookinganmodning, og den professionelle har accepteret den. Du kan slå beskeden fra igen på profilen. Betaling er ikke aktiveret.',
      cta: { label: 'Se profil og tider', href: appUrl(`/professionals/${context.professional.id}`) },
    })
    await context.admin.from('availability_alerts').update({ last_notified_at: new Date().toISOString() }).eq('id', alert.id)
  }))
}

export async function GET() {
  try {
    const context = await professionalForRequest()
    if (!context) return NextResponse.json({ error: 'Ingen professionel profil fundet.' }, { status: 403 })
    const { data, error } = await context.admin
      .from('availability_slots')
      .select('id, starts_at, ends_at, time_zone, meeting_mode, is_available')
      .eq('professional_profile_id', context.professional.id)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .limit(120)
    if (error) throw error
    return NextResponse.json({ slots: data ?? [] })
  } catch (error) {
    console.error('[availability:list]', error)
    return NextResponse.json({ error: 'Tilgængeligheden kunne ikke indlæses.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!isSameSiteRequest(request)) return NextResponse.json({ error: 'Ugyldig forespørgsel.' }, { status: 403 })
  try {
    const context = await professionalForRequest()
    if (!context) return NextResponse.json({ error: 'Ingen professionel profil fundet.' }, { status: 403 })
    const body = await request.json()
    const startsAt = new Date(body.startsAt)
    const repeatWeeks = body.repeatWeeks === 4 ? 4 : 1
    if (!Number.isFinite(startsAt.getTime())) return NextResponse.json({ error: 'Vælg en gyldig dato og tid.' }, { status: 400 })
    if (startsAt.getTime() < Date.now() + 2 * 60 * 60 * 1000) return NextResponse.json({ error: 'Tiden skal være mindst to timer fremme.' }, { status: 400 })
    if (startsAt.getTime() > Date.now() + 180 * 24 * 60 * 60 * 1000) return NextResponse.json({ error: 'Tiden må højst være 180 dage fremme.' }, { status: 400 })
    startsAt.setSeconds(0, 0)
    const requestedStarts = Array.from({ length: repeatWeeks }, (_, index) => new Date(startsAt.getTime() + index * 7 * 24 * 60 * 60 * 1000))
    const lastStart = requestedStarts.at(-1)!
    if (lastStart.getTime() > Date.now() + 180 * 24 * 60 * 60 * 1000) {
      return NextResponse.json({ error: 'Den sidste gentagelse må højst være 180 dage fremme.' }, { status: 400 })
    }
    const requestedRanges = requestedStarts.map((start) => ({
      startsAt: start,
      endsAt: new Date(start.getTime() + 60 * 60 * 1000),
    }))
    const firstRange = requestedRanges[0]
    const lastRange = requestedRanges.at(-1)!

    const { data: possibleOverlaps } = await context.admin
      .from('availability_slots')
      .select('id, starts_at, ends_at')
      .eq('professional_profile_id', context.professional.id)
      .lt('starts_at', lastRange.endsAt.toISOString())
      .gt('ends_at', firstRange.startsAt.toISOString())
    const hasOverlap = requestedRanges.some((range) => (possibleOverlaps ?? []).some((slot) => (
      new Date(slot.starts_at).getTime() < range.endsAt.getTime()
      && new Date(slot.ends_at).getTime() > range.startsAt.getTime()
    )))
    if (hasOverlap) return NextResponse.json({ error: 'Mindst én af tiderne overlapper en eksisterende tid.' }, { status: 409 })

    const { count: existingOpenCount, error: openCountError } = await context.admin
      .from('availability_slots')
      .select('id', { count: 'exact', head: true })
      .eq('professional_profile_id', context.professional.id)
      .eq('is_available', true)
      .gte('ends_at', new Date().toISOString())
    if (openCountError) throw openCountError

    const { data, error } = await context.admin.from('availability_slots').insert(requestedRanges.map((range) => ({
      professional_profile_id: context.professional.id,
      starts_at: range.startsAt.toISOString(),
      ends_at: range.endsAt.toISOString(),
      time_zone: 'Europe/Copenhagen',
      meeting_mode: 'video',
      is_available: true,
    }))).select('id, starts_at, ends_at, time_zone, meeting_mode, is_available')
    if (error) throw error
    if ((existingOpenCount ?? 0) === 0 && data?.[0]?.starts_at) {
      await notifyAvailabilityAlerts(context, data[0].starts_at)
    }
    return NextResponse.json({ slots: data ?? [] }, { status: 201 })
  } catch (error) {
    console.error('[availability:create]', error)
    return NextResponse.json({ error: 'Tiden kunne ikke gemmes.' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!isSameSiteRequest(request)) return NextResponse.json({ error: 'Ugyldig forespørgsel.' }, { status: 403 })
  try {
    const context = await professionalForRequest()
    if (!context) return NextResponse.json({ error: 'Ingen professionel profil fundet.' }, { status: 403 })
    const id = new URL(request.url).searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Tid mangler.' }, { status: 400 })
    const { count } = await context.admin.from('bookings').select('id', { count: 'exact', head: true }).eq('slot_id', id).in('status', ['requested', 'pending', 'confirmed', 'rescheduled'])
    if ((count ?? 0) > 0) return NextResponse.json({ error: 'Tiden har en aktiv booking og kan ikke fjernes.' }, { status: 409 })
    const { error } = await context.admin.from('availability_slots').delete().eq('id', id).eq('professional_profile_id', context.professional.id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[availability:delete]', error)
    return NextResponse.json({ error: 'Tiden kunne ikke fjernes.' }, { status: 500 })
  }
}
