import { NextResponse } from 'next/server'
import { resolveBookingParticipant } from '@/lib/server/bookingParticipant'
import { isSameSiteRequest } from '@/lib/server/requestSecurity'
import { SESSION_PLAN_LIMITS } from '@/lib/sessionPlan'

const EDITABLE_STATUSES = ['requested', 'pending', 'confirmed', 'rescheduled']

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
    if (
      !EDITABLE_STATUSES.includes(booking.status)
      || new Date(booking.ends_at).getTime() <= Date.now()
    ) {
      return NextResponse.json({
        error: 'Den private forberedelsesnote kan ikke længere redigeres.',
      }, { status: 409 })
    }

    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Forespørgslen indeholder ikke gyldige data.' }, { status: 400 })
    }
    const expectedUpdatedAt = body.expectedUpdatedAt === null
      ? null
      : typeof body.expectedUpdatedAt === 'string' && !Number.isNaN(Date.parse(body.expectedUpdatedAt))
        ? body.expectedUpdatedAt
        : undefined
    if (expectedUpdatedAt === undefined) {
      return NextResponse.json({
        error: 'Noteversionen mangler. Genindlæs siden og prøv igen.',
      }, { status: 400 })
    }
    const note = typeof body.note === 'string'
      ? body.note.trim().replace(/\r\n/g, '\n').slice(0, SESSION_PLAN_LIMITS.privateNote)
      : ''
    const query = expectedUpdatedAt === null
      ? admin.from('professional_session_notes').insert({
          booking_id: booking.id,
          note,
        })
      : admin.from('professional_session_notes').update({ note })
          .eq('booking_id', booking.id)
          .eq('updated_at', expectedUpdatedAt)
    const { data, error } = await query
      .select('note, updated_at')
      .maybeSingle()
    if (error?.code === '23505' || (!error && !data)) {
      return NextResponse.json({
        error: 'Noten er ændret i et andet vindue. Genindlæs siden, før du gemmer igen.',
      }, { status: 409 })
    }
    if (error || !data) throw error ?? new Error('Private note could not be saved.')

    return NextResponse.json({
      privateNote: data.note,
      privateNoteUpdatedAt: data.updated_at,
    })
  } catch (error) {
    console.error('[session-plan:private-note]', error)
    return NextResponse.json({ error: 'Den private note kunne ikke gemmes.' }, { status: 500 })
  }
}
