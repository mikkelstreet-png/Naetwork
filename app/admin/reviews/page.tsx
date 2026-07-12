'use client'

import { useEffect, useState } from 'react'
import { AdminEmptyState, AdminPageHeader, AdminTableFrame } from '@/components/AdminShell'
import { createClient } from '@/lib/supabase/client'

interface Review { id: string; rating: number; feedback: string | null; moderation_status: string; created_at: string }

export default function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    createClient().from('reviews').select('id, rating, feedback, moderation_status, created_at').order('created_at', { ascending: false }).then(({ data, error: loadError }) => {
      if (!active) return
      if (loadError) setError('Anmeldelserne kunne ikke indlæses.')
      setReviews((data as Review[] | null) ?? [])
      setLoading(false)
    })
    return () => { active = false }
  }, [])

  async function updateStatus(id: string, status: string) {
    setSaving(id); setError('')
    const { error: updateError } = await createClient().from('reviews').update({ moderation_status: status, updated_at: new Date().toISOString() }).eq('id', id)
    if (updateError) setError('Status kunne ikke gemmes.')
    else setReviews((current) => current.map((review) => review.id === id ? { ...review, moderation_status: status } : review))
    setSaving(null)
  }

  return <>
    <AdminPageHeader title="Anmeldelser" description="Moderér verificeret feedback fra gennemførte sessioner. Ratings kan ikke oprettes uden en tilhørende booking." />
    {error && <p role="alert" className="notice-error mb-5">{error}</p>}
    <AdminTableFrame>
      {loading ? <AdminEmptyState title="Indlæser anmeldelser..." /> : reviews.length === 0 ? <AdminEmptyState title="Ingen anmeldelser endnu" body="Feedback vises her efter gennemførte sessioner." /> : <div className="divide-y divide-gray-100">{reviews.map((review) => <article key={review.id} className="grid gap-4 px-5 py-5 md:grid-cols-[100px_1fr_180px] md:items-start"><div><p className="text-xl font-black text-gray-950">{review.rating}/5</p><time className="mt-1 block text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString('da-DK')}</time></div><p className="text-sm leading-relaxed text-gray-600">{review.feedback || 'Kun rating, ingen tekst.'}</p><label><span className="sr-only">Moderationsstatus</span><select value={review.moderation_status} disabled={saving === review.id} onChange={(event) => void updateStatus(review.id, event.target.value)} className="field-control min-h-10 py-2 text-sm"><option value="pending">Afventer</option><option value="published">Publiceret</option><option value="hidden">Skjult</option></select></label></article>)}</div>}
    </AdminTableFrame>
  </>
}
