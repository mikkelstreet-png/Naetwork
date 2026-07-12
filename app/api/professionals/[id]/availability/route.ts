import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const admin = createAdminClient()
    const { data: professional } = await admin
      .from('professional_profiles')
      .select('id, visibility, review_status')
      .eq('id', id)
      .eq('visibility', 'published')
      .eq('review_status', 'approved')
      .maybeSingle()

    if (!professional) {
      return NextResponse.json({ error: 'Profilen er ikke tilgængelig for booking.' }, { status: 404 })
    }

    const now = new Date()
    const horizon = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)
    const { data, error } = await admin
      .from('availability_slots')
      .select('id, starts_at, ends_at, time_zone, meeting_mode')
      .eq('professional_profile_id', id)
      .eq('is_available', true)
      .gte('starts_at', now.toISOString())
      .lte('starts_at', horizon.toISOString())
      .order('starts_at', { ascending: true })
      .limit(80)

    if (error) throw error
    return NextResponse.json({ slots: data ?? [] }, {
      headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120' },
    })
  } catch (error) {
    console.error('[availability:public]', error)
    return NextResponse.json({ error: 'Ledige tider kunne ikke indlæses.' }, { status: 500 })
  }
}
