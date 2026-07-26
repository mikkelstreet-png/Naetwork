import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

type AdminClient = ReturnType<typeof createAdminClient>

interface BookingRow {
  id: string
  professional_profile_id: string | null
  status: string
  cancelled_by: string | null
}

interface SessionPlanRow {
  booking_id: string
  preparation_status: string
}

interface OutcomeRow {
  booking_id: string
  result_status: string
}

interface ReviewRow {
  professional_profile_id: string | null
  feedback_schema_version: number
  rating: number
  professional_relevance: number | null
}

interface ProfessionalRow {
  id: string
  profile_id: string
  title: string | null
  company: string | null
}

interface ProfileRow {
  id: string
  name: string | null
}

interface ProfessionalQuality {
  professionalProfileId: string
  name: string
  title: string | null
  company: string | null
  completedSessions: number
  cancelledSessions: number
  professionalCancellations: number
  noShows: number
  incompletePreparation: number
  missingPublishedResult: number
  structuredFeedback: number
  lowOverallFeedback: number
  lowRelevanceFeedback: number
}

const PAGE_SIZE = 1000

async function fetchAllRows<T>(
  admin: AdminClient,
  table: string,
  columns: string,
): Promise<T[]> {
  const rows: T[] = []

  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await admin
      .from(table)
      .select(columns)
      .order('id', { ascending: true })
      .range(from, from + PAGE_SIZE - 1)

    if (error) throw error
    const page = (data ?? []) as T[]
    rows.push(...page)
    if (page.length < PAGE_SIZE) return rows
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Ikke logget ind.' }, { status: 401 })

    const { data: actor, error: actorError } = await supabase
      .from('profiles')
      .select('role, is_admin')
      .eq('auth_user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()
    if (actorError) throw actorError
    if (!actor || (actor.role !== 'admin' && !actor.is_admin)) {
      return NextResponse.json({ error: 'Ingen adgang.' }, { status: 403 })
    }

    const admin = createAdminClient()
    const [
      bookings,
      plans,
      outcomes,
      reviews,
      professionals,
      profiles,
    ] = await Promise.all([
      fetchAllRows<BookingRow>(
        admin,
        'bookings',
        'id, professional_profile_id, status, cancelled_by',
      ),
      fetchAllRows<SessionPlanRow>(
        admin,
        'session_plans',
        'booking_id, preparation_status',
      ),
      fetchAllRows<OutcomeRow>(
        admin,
        'session_outcomes',
        'booking_id, result_status',
      ),
      fetchAllRows<ReviewRow>(
        admin,
        'reviews',
        'professional_profile_id, feedback_schema_version, rating, professional_relevance',
      ),
      fetchAllRows<ProfessionalRow>(
        admin,
        'professional_profiles',
        'id, profile_id, title, company',
      ),
      fetchAllRows<ProfileRow>(admin, 'profiles', 'id, name'),
    ])

    const profileNames = new Map(profiles.map((profile) => [
      profile.id,
      profile.name?.trim() || 'Navn mangler',
    ]))
    const planByBooking = new Map(plans.map((plan) => [plan.booking_id, plan]))
    const outcomeByBooking = new Map(outcomes.map((outcome) => [outcome.booking_id, outcome]))
    const qualityByProfessional = new Map<string, ProfessionalQuality>(
      professionals.map((professional) => [
        professional.id,
        {
          professionalProfileId: professional.id,
          name: profileNames.get(professional.profile_id) ?? 'Navn mangler',
          title: professional.title,
          company: professional.company,
          completedSessions: 0,
          cancelledSessions: 0,
          professionalCancellations: 0,
          noShows: 0,
          incompletePreparation: 0,
          missingPublishedResult: 0,
          structuredFeedback: 0,
          lowOverallFeedback: 0,
          lowRelevanceFeedback: 0,
        },
      ]),
    )
    const professionalOwners = new Map(
      professionals.map((professional) => [professional.id, professional.profile_id]),
    )

    for (const booking of bookings) {
      if (!booking.professional_profile_id) continue
      const quality = qualityByProfessional.get(booking.professional_profile_id)
      if (!quality) continue

      if (booking.status === 'completed') {
        quality.completedSessions += 1
        if (planByBooking.get(booking.id)?.preparation_status !== 'ready') {
          quality.incompletePreparation += 1
        }
        if (outcomeByBooking.get(booking.id)?.result_status !== 'published') {
          quality.missingPublishedResult += 1
        }
      }

      if (booking.status === 'cancelled') {
        quality.cancelledSessions += 1
        if (
          booking.cancelled_by
          && booking.cancelled_by === professionalOwners.get(booking.professional_profile_id)
        ) {
          quality.professionalCancellations += 1
        }
      }

      if (booking.status === 'no_show') quality.noShows += 1
    }

    for (const review of reviews) {
      if (!review.professional_profile_id || review.feedback_schema_version !== 2) continue
      const quality = qualityByProfessional.get(review.professional_profile_id)
      if (!quality) continue

      quality.structuredFeedback += 1
      if (review.rating <= 2) quality.lowOverallFeedback += 1
      if (
        review.professional_relevance !== null
        && review.professional_relevance <= 2
      ) {
        quality.lowRelevanceFeedback += 1
      }
    }

    const professionalsWithSignals = Array.from(qualityByProfessional.values())
      .filter((quality) => (
        quality.professionalCancellations >= 2
        || quality.noShows > 0
        || quality.incompletePreparation > 0
        || quality.missingPublishedResult > 0
        || quality.lowOverallFeedback > 0
        || quality.lowRelevanceFeedback > 0
      ))
      .sort((first, second) => first.name.localeCompare(second.name, 'da'))

    const allQuality = Array.from(qualityByProfessional.values())
    const response = NextResponse.json({
      generatedAt: new Date().toISOString(),
      definitions: {
        repeated: 'Mindst 2 registrerede hændelser for samme professionelle.',
        lowFeedback: 'En struktureret vurdering på 1 eller 2 ud af 5.',
        incompletePreparation: 'En gennemført booking uden en Session Plan markeret som klar.',
        missingPublishedResult: 'En gennemført booking uden et publiceret Session Plan-resultat.',
      },
      summary: {
        completedSessions: allQuality.reduce(
          (total, quality) => total + quality.completedSessions,
          0,
        ),
        incompletePreparation: allQuality.reduce(
          (total, quality) => total + quality.incompletePreparation,
          0,
        ),
        missingPublishedResult: allQuality.reduce(
          (total, quality) => total + quality.missingPublishedResult,
          0,
        ),
        structuredFeedback: allQuality.reduce(
          (total, quality) => total + quality.structuredFeedback,
          0,
        ),
        lowOverallFeedback: allQuality.reduce(
          (total, quality) => total + quality.lowOverallFeedback,
          0,
        ),
        lowRelevanceFeedback: allQuality.reduce(
          (total, quality) => total + quality.lowRelevanceFeedback,
          0,
        ),
        professionalsWithRepeatedCancellations: allQuality.filter(
          (quality) => quality.professionalCancellations >= 2,
        ).length,
        professionalsWithRepeatedLowFeedback: allQuality.filter(
          (quality) => quality.lowOverallFeedback >= 2,
        ).length,
      },
      professionals: professionalsWithSignals,
    })
    response.headers.set('Cache-Control', 'private, no-store')
    return response
  } catch (error) {
    console.error('[admin:quality]', error)
    return NextResponse.json({
      error: 'Kvalitetsdata kunne ikke indlæses.',
    }, { status: 500 })
  }
}
