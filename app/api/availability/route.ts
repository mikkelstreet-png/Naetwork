import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

function sameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  return !origin || origin === new URL(request.url).origin
}

async function professionalForRequest() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('id, role').eq('auth_user_id', user.id).maybeSingle()
  if (!profile || profile.role !== 'professional') return null
  const { data: professional } = await admin.from('professional_profiles').select('id').eq('profile_id', profile.id).maybeSingle()
  return professional ? { admin, profile, professional } : null
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
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Ugyldig forespørgsel.' }, { status: 403 })
  try {
    const context = await professionalForRequest()
    if (!context) return NextResponse.json({ error: 'Ingen professionel profil fundet.' }, { status: 403 })
    const body = await request.json()
    const startsAt = new Date(body.startsAt)
    if (!Number.isFinite(startsAt.getTime())) return NextResponse.json({ error: 'Vælg en gyldig dato og tid.' }, { status: 400 })
    if (startsAt.getTime() < Date.now() + 2 * 60 * 60 * 1000) return NextResponse.json({ error: 'Tiden skal være mindst to timer fremme.' }, { status: 400 })
    if (startsAt.getTime() > Date.now() + 180 * 24 * 60 * 60 * 1000) return NextResponse.json({ error: 'Tiden må højst være 180 dage fremme.' }, { status: 400 })
    startsAt.setSeconds(0, 0)
    const endsAt = new Date(startsAt.getTime() + 60 * 60 * 1000)

    const { data: overlap } = await context.admin
      .from('availability_slots')
      .select('id')
      .eq('professional_profile_id', context.professional.id)
      .lt('starts_at', endsAt.toISOString())
      .gt('ends_at', startsAt.toISOString())
      .limit(1)
    if (overlap?.length) return NextResponse.json({ error: 'Tiden overlapper en eksisterende ledig tid.' }, { status: 409 })

    const { data, error } = await context.admin.from('availability_slots').insert({
      professional_profile_id: context.professional.id,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      time_zone: 'Europe/Copenhagen',
      meeting_mode: 'video',
      is_available: true,
    }).select('id, starts_at, ends_at, time_zone, meeting_mode, is_available').single()
    if (error) throw error
    return NextResponse.json({ slot: data }, { status: 201 })
  } catch (error) {
    console.error('[availability:create]', error)
    return NextResponse.json({ error: 'Tiden kunne ikke gemmes.' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Ugyldig forespørgsel.' }, { status: 403 })
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
