import { NextResponse } from 'next/server'
import type {
  PublicProductEventName,
  PublicProductEventSurface,
} from '@/lib/clientProductAnalytics'
import { recordProductEvent } from '@/lib/server/productAnalytics'
import { isSameSiteRequest } from '@/lib/server/requestSecurity'
import { createAdminClient } from '@/lib/supabase/admin'

const MAX_BODY_BYTES = 256

const ALLOWED_SURFACES = {
  session_plan_example_viewed: [
    'home',
    'sessions',
    'professional_profile',
    'booking_drawer',
  ],
  session_plan_booking_clicked: [
    'home',
    'sessions',
    'professional_profile',
  ],
  booking_started: ['professional_profile'],
} as const satisfies Record<PublicProductEventName, readonly PublicProductEventSurface[]>

function isStrictSameSiteRequest(request: Request) {
  const fetchSite = request.headers.get('sec-fetch-site')?.toLowerCase()
  const origin = request.headers.get('origin')

  if (!origin || origin === 'null') return false
  if (fetchSite !== 'same-origin' && fetchSite !== 'same-site') return false

  return isSameSiteRequest(request)
}

function parseEvent(body: string) {
  let value: unknown
  try {
    value = JSON.parse(body)
  } catch {
    return null
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) return null

  const input = value as Record<string, unknown>
  const keys = Object.keys(input)
  if (keys.length !== 2 || !keys.includes('eventName') || !keys.includes('surface')) return null
  if (typeof input.eventName !== 'string' || typeof input.surface !== 'string') return null

  const eventName = input.eventName as PublicProductEventName
  const allowedSurfaces = ALLOWED_SURFACES[eventName]
  if (!allowedSurfaces || !allowedSurfaces.some((surface) => surface === input.surface)) return null

  return {
    eventName,
    surface: input.surface as PublicProductEventSurface,
  }
}

export async function POST(request: Request) {
  if (!isStrictSameSiteRequest(request)) {
    return NextResponse.json({ error: 'Ugyldig forespørgsel.' }, { status: 403 })
  }

  const contentType = request.headers.get('content-type')?.toLowerCase() ?? ''
  if (!contentType.startsWith('application/json')) {
    return NextResponse.json({ error: 'Ugyldigt format.' }, { status: 415 })
  }

  const declaredLength = Number(request.headers.get('content-length'))
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Forespørgslen er for stor.' }, { status: 413 })
  }

  const body = await request.text().catch(() => '')
  if (!body || new TextEncoder().encode(body).byteLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Ugyldig forespørgsel.' }, { status: 400 })
  }

  const event = parseEvent(body)
  if (!event) {
    return NextResponse.json({ error: 'Ugyldig hændelse.' }, { status: 400 })
  }

  try {
    const admin = createAdminClient()
    await recordProductEvent(admin, {
      eventName: event.eventName,
      properties: { surface: event.surface },
    })
  } catch {
    // Aggregate analytics is intentionally non-blocking. No request data is
    // logged, and a telemetry outage must never affect the product flow.
  }

  return new NextResponse(null, {
    status: 202,
    headers: { 'Cache-Control': 'no-store' },
  })
}
