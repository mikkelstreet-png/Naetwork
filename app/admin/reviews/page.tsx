'use client'

import { useEffect, useState } from 'react'
import { AdminEmptyState, AdminPageHeader, AdminTableFrame } from '@/components/AdminShell'
import { createClient } from '@/lib/supabase/client'
import type { GoalAchievement } from '@/lib/sessionFeedback'

interface Review {
  id: string
  rating: number
  feedback: string | null
  feedback_schema_version: number
  goal_achieved: GoalAchievement | null
  professional_relevance: number | null
  professional_preparedness: number | null
  greater_clarity: number | null
  concrete_next_steps: number | null
  moderation_status: string
  created_at: string
}

interface QualitySummary {
  completedSessions: number
  incompletePreparation: number
  missingPublishedResult: number
  structuredFeedback: number
  lowOverallFeedback: number
  lowRelevanceFeedback: number
  professionalsWithRepeatedCancellations: number
  professionalsWithRepeatedLowFeedback: number
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

interface QualityResponse {
  generatedAt: string
  definitions: {
    repeated: string
    lowFeedback: string
    incompletePreparation: string
    missingPublishedResult: string
  }
  summary: QualitySummary
  professionals: ProfessionalQuality[]
}

const GOAL_LABELS: Record<GoalAchievement, string> = {
  achieved: 'Opnået',
  partially_achieved: 'Delvist opnået',
  not_achieved: 'Ikke opnået',
}

const EMPTY_SUMMARY: QualitySummary = {
  completedSessions: 0,
  incompletePreparation: 0,
  missingPublishedResult: 0,
  structuredFeedback: 0,
  lowOverallFeedback: 0,
  lowRelevanceFeedback: 0,
  professionalsWithRepeatedCancellations: 0,
  professionalsWithRepeatedLowFeedback: 0,
}

function FeedbackMetric({
  label,
  value,
}: {
  label: string
  value: number | string | null
}) {
  return (
    <div className="rounded-lg bg-gray-50 px-3 py-2.5">
      <p className="text-[10px] font-black uppercase text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-black tabular-nums text-gray-950">
        {value === null ? '—' : typeof value === 'number' ? `${value}/5` : value}
      </p>
    </div>
  )
}

export default function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [quality, setQuality] = useState<QualityResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    const supabase = createClient()

    async function load() {
      setLoading(true)
      setError('')

      try {
        const [reviewResult, qualityResult] = await Promise.all([
          supabase
            .from('reviews')
            .select('id, rating, feedback, feedback_schema_version, goal_achieved, professional_relevance, professional_preparedness, greater_clarity, concrete_next_steps, moderation_status, created_at')
            .order('created_at', { ascending: false }),
          fetch('/api/admin/quality', { cache: 'no-store' }),
        ])
        const qualityBody = await qualityResult.json().catch(() => ({}))

        if (!active) return
        if (reviewResult.error || !qualityResult.ok) {
          setError('Feedback- og kvalitetsdata kunne ikke indlæses fuldt ud.')
        }
        setReviews((reviewResult.data as Review[] | null) ?? [])
        setQuality(qualityResult.ok ? qualityBody as QualityResponse : null)
      } catch {
        if (active) setError('Feedback- og kvalitetsdata kunne ikke indlæses.')
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()
    return () => { active = false }
  }, [])

  async function updateStatus(id: string, status: string) {
    setSaving(id)
    setError('')
    const { error: updateError } = await createClient()
      .from('reviews')
      .update({ moderation_status: status, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (updateError) {
      setError('Status kunne ikke gemmes.')
    } else {
      setReviews((current) => current.map((review) => (
        review.id === id ? { ...review, moderation_status: status } : review
      )))
    }
    setSaving(null)
  }

  const summary = quality?.summary ?? EMPTY_SUMMARY
  const qualityCards = [
    {
      label: 'Strukturerede svar',
      value: summary.structuredFeedback,
      note: 'Indsendte version 2-feedbacksvar.',
    },
    {
      label: 'Forberedelse mangler',
      value: summary.incompletePreparation,
      note: 'Gennemførte sessioner uden klar Session Plan.',
    },
    {
      label: 'Resultat mangler',
      value: summary.missingPublishedResult,
      note: 'Gennemførte sessioner uden publiceret resultat.',
    },
    {
      label: 'Lav relevans',
      value: summary.lowRelevanceFeedback,
      note: 'Svar på 1–2 ud af 5 for relevans.',
    },
    {
      label: 'Gentagne aflysninger',
      value: summary.professionalsWithRepeatedCancellations,
      note: 'Professionelle med mindst to egne aflysninger.',
    },
    {
      label: 'Gentagne lave svar',
      value: summary.professionalsWithRepeatedLowFeedback,
      note: 'Professionelle med mindst to samlede svar på 1–2.',
    },
  ]

  return (
    <>
      <AdminPageHeader
        title="Feedback og kvalitet"
        description="Moderér verificeret feedback og se dokumenterbare driftssignaler. Tallene er rå observationer til manuel vurdering — ikke en score eller automatisk sanktion."
      />

      {error && <p role="alert" className="notice-error mb-5">{error}</p>}

      <section aria-labelledby="quality-overview">
        <div className="mb-3">
          <p className="text-[11px] font-black uppercase text-gray-400">Kvalitetskontrol</p>
          <h2 id="quality-overview" className="mt-1 text-xl font-black text-gray-950">
            Rå signaler fra gennemførte sessioner
          </h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {qualityCards.map((card) => (
            <div key={card.label} className="min-h-32 rounded-lg border border-gray-200 bg-white p-5">
              <p className="text-[11px] font-black uppercase text-gray-400">{card.label}</p>
              <p className="mt-4 text-3xl font-black tabular-nums text-gray-950">
                {loading ? '—' : card.value}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">{card.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-gray-500">
          Lav feedback betyder 1–2 ud af 5. “Gentaget” betyder mindst to registrerede
          hændelser for samme professionelle. Kandidatens manglende forberedelse og den
          professionelles manglende resultat vises separat.
        </p>
      </section>

      <section className="mt-8" aria-labelledby="quality-professionals">
        <div className="mb-3">
          <p className="text-[11px] font-black uppercase text-gray-400">Kræver gennemgang</p>
          <h2 id="quality-professionals" className="mt-1 text-xl font-black text-gray-950">
            Professionelle med registrerede signaler
          </h2>
        </div>
        <AdminTableFrame>
          {loading ? (
            <AdminEmptyState title="Indlæser kvalitetssignaler..." />
          ) : !quality || quality.professionals.length === 0 ? (
            <AdminEmptyState
              title="Ingen kvalitetssignaler kræver gennemgang"
              body="Rækker vises her, når rå sessionsdata matcher en af de beskrevne definitioner."
            />
          ) : (
            <table className="w-full min-w-[1040px] border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-[#f7f7f4] text-left text-[11px] font-black uppercase text-gray-400">
                  <th className="px-4 py-3">Professionel</th>
                  <th className="px-4 py-3 text-right">Gennemført</th>
                  <th className="px-4 py-3 text-right">Egne aflysninger</th>
                  <th className="px-4 py-3 text-right">No-show</th>
                  <th className="px-4 py-3 text-right">Plan ikke klar</th>
                  <th className="px-4 py-3 text-right">Resultat mangler</th>
                  <th className="px-4 py-3 text-right">Lav samlet</th>
                  <th className="px-4 py-3 text-right">Lav relevans</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {quality.professionals.map((professional) => (
                  <tr key={professional.professionalProfileId} className="hover:bg-gray-50/70">
                    <td className="px-4 py-4">
                      <p className="text-sm font-black text-gray-950">{professional.name}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {[professional.title, professional.company].filter(Boolean).join(' · ') || 'Profiloplysninger mangler'}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-right text-sm tabular-nums text-gray-600">{professional.completedSessions}</td>
                    <td className="px-4 py-4 text-right text-sm tabular-nums text-gray-600">
                      {professional.professionalCancellations}
                      <small className="ml-1 text-[10px] text-gray-400">/ {professional.cancelledSessions} total</small>
                    </td>
                    <td className="px-4 py-4 text-right text-sm tabular-nums text-gray-600">{professional.noShows}</td>
                    <td className="px-4 py-4 text-right text-sm tabular-nums text-gray-600">{professional.incompletePreparation}</td>
                    <td className="px-4 py-4 text-right text-sm tabular-nums text-gray-600">{professional.missingPublishedResult}</td>
                    <td className="px-4 py-4 text-right text-sm tabular-nums text-gray-600">{professional.lowOverallFeedback}</td>
                    <td className="px-4 py-4 text-right text-sm tabular-nums text-gray-600">{professional.lowRelevanceFeedback}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </AdminTableFrame>
      </section>

      <section className="mt-8" aria-labelledby="review-moderation">
        <div className="mb-3">
          <p className="text-[11px] font-black uppercase text-gray-400">Moderation</p>
          <h2 id="review-moderation" className="mt-1 text-xl font-black text-gray-950">
            Sessionsfeedback
          </h2>
        </div>
        <AdminTableFrame>
          {loading ? (
            <AdminEmptyState title="Indlæser feedback..." />
          ) : reviews.length === 0 ? (
            <AdminEmptyState
              title="Ingen feedback endnu"
              body="Feedback vises her efter gennemførte sessioner."
            />
          ) : (
            <div className="divide-y divide-gray-100">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="grid gap-5 px-5 py-5 lg:grid-cols-[120px_minmax(0,1fr)_180px] lg:items-start"
                >
                  <div>
                    <p className="text-xl font-black text-gray-950">{review.rating}/5</p>
                    <p className="mt-1 text-[10px] font-black uppercase text-gray-400">
                      Samlet oplevelse
                    </p>
                    <time className="mt-2 block text-xs text-gray-400">
                      {new Date(review.created_at).toLocaleDateString('da-DK')}
                    </time>
                  </div>

                  <div>
                    {review.feedback_schema_version === 2 ? (
                      <>
                        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
                          <FeedbackMetric
                            label="Målet"
                            value={review.goal_achieved ? GOAL_LABELS[review.goal_achieved] : null}
                          />
                          <FeedbackMetric label="Relevans" value={review.professional_relevance} />
                          <FeedbackMetric label="Forberedt" value={review.professional_preparedness} />
                          <FeedbackMetric label="Klarhed" value={review.greater_clarity} />
                          <FeedbackMetric label="Næste skridt" value={review.concrete_next_steps} />
                        </div>
                      </>
                    ) : (
                      <p className="text-xs font-bold text-gray-400">Legacy-rating uden strukturerede svar</p>
                    )}
                    <p className="mt-5 text-sm leading-relaxed text-gray-600">
                      {review.feedback || 'Ingen valgfri kommentar.'}
                    </p>
                  </div>

                  <label>
                    <span className="sr-only">Moderationsstatus</span>
                    <select
                      value={review.moderation_status}
                      disabled={saving === review.id}
                      onChange={(event) => void updateStatus(review.id, event.target.value)}
                      className="field-control min-h-10 py-2 text-sm"
                    >
                      <option value="pending">Afventer</option>
                      <option value="published">Publiceret</option>
                      <option value="hidden">Skjult</option>
                    </select>
                  </label>
                </article>
              ))}
            </div>
          )}
        </AdminTableFrame>
      </section>
    </>
  )
}
