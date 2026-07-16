'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { AdminEmptyState, AdminPageHeader, AdminTableFrame } from '@/components/AdminShell'
import { createClient } from '@/lib/supabase/client'

type Visibility = 'hidden' | 'published'
type ReviewStatus = 'pending' | 'approved' | 'rejected'

interface Professional {
  id: string
  profile_id: string | null
  name: string
  title: string | null
  company: string | null
  bio: string | null
  industries: string[] | null
  focus_areas: string[] | null
  price_dkk: number
  linkedin_url: string | null
  visibility: Visibility
  review_status: ReviewStatus
  created_at: string
}

const STATUS_TABS: Array<{ label: string; value: ReviewStatus | 'all' }> = [
  { label: 'Alle', value: 'all' }, { label: 'Afventer', value: 'pending' }, { label: 'Godkendte', value: 'approved' }, { label: 'Afviste', value: 'rejected' },
]

function ReviewBadge({ status, visibility }: { status: ReviewStatus; visibility: Visibility }) {
  const label = status === 'pending' ? 'Afventer' : status === 'rejected' ? 'Afvist' : visibility === 'published' ? 'Godkendt · synlig' : 'Godkendt · skjult'
  const tone = status === 'pending' ? 'border-amber-200 bg-amber-50 text-amber-800' : status === 'rejected' ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-800'
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${tone}`}>{label}</span>
}

function verifiedLinkedInUrl(value: string | null) {
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && /(^|\.)linkedin\.com$/i.test(url.hostname) ? url.toString() : null
  } catch {
    return null
  }
}

export default function ProfessionalsPage() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [filter, setFilter] = useState<ReviewStatus | 'all'>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [confirmRejectId, setConfirmRejectId] = useState<string | null>(null)

  const loadProfessionals = useCallback(async () => {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data, error: loadError } = await supabase.from('professional_profiles').select('id, profile_id, title, company, bio, industries, focus_areas, price_dkk, linkedin_url, visibility, review_status, created_at').order('created_at', { ascending: false })
    if (loadError) {
      setError('Profilerne kunne ikke indlæses. Kontrollér systemstatus og prøv igen.')
      setProfessionals([])
      setLoading(false)
      return
    }
    const rows = (data as Array<Omit<Professional, 'name'>> | null) ?? []
    const profileIds = Array.from(new Set(rows.map((row) => row.profile_id).filter(Boolean))) as string[]
    const { data: profiles, error: profileError } = profileIds.length ? await supabase.from('profiles').select('id, name').in('id', profileIds) : { data: [], error: null }
    if (profileError) setError('Profilnavne kunne ikke indlæses fuldt ud.')
    const names = new Map(((profiles as Array<{ id: string; name: string | null }> | null) ?? []).map((profile) => [profile.id, profile.name || 'Navn mangler']))
    setProfessionals(rows.map((row) => ({ ...row, name: row.profile_id ? names.get(row.profile_id) ?? 'Navn mangler' : 'Navn mangler' })))
    setLoading(false)
  }, [])

  useEffect(() => { void loadProfessionals() }, [loadProfessionals])

  async function updateReview(id: string, reviewStatus: ReviewStatus, visibility: Visibility) {
    if (reviewStatus === 'rejected' && confirmRejectId !== id) {
      setConfirmRejectId(id)
      return
    }
    setActionLoading(`${id}:${reviewStatus}:${visibility}`)
    setError('')
    const response = await fetch(`/api/admin/professionals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewStatus, visibility }),
    })
    if (!response.ok) {
      const result = await response.json().catch(() => ({}))
      setError(result.error || 'Profilstatus kunne ikke opdateres. Ingen ændringer er gemt.')
    } else {
      await loadProfessionals()
    }
    setConfirmRejectId(null)
    setActionLoading(null)
  }

  const filtered = filter === 'all' ? professionals : professionals.filter((profile) => profile.review_status === filter)

  return (
    <>
      <AdminPageHeader title="Professionelle" description="Gennemgå erfaring, publiceringsstatus og profilkvalitet, før en profil bliver synlig for kandidater." />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1" role="group" aria-label="Filtrér profiler">
          {STATUS_TABS.map((tab) => <button key={tab.value} type="button" onClick={() => setFilter(tab.value)} aria-pressed={filter === tab.value} className={`rounded-md px-3 py-2 text-xs font-black transition-colors ${filter === tab.value ? 'bg-gray-950 text-white' : 'text-gray-500 hover:text-gray-950'}`}>{tab.label}</button>)}
        </div>
        <p className="text-xs font-bold text-gray-400">{loading ? 'Indlæser' : `${filtered.length} profiler`}</p>
      </div>

      {error && <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <AdminTableFrame>
        {loading ? <AdminEmptyState title="Indlæser profiler..." /> : filtered.length === 0 ? <AdminEmptyState title="Ingen profiler i denne visning" body="Skift filter for at se andre profilstatusser." /> : (
          <table className="min-w-[1180px] w-full border-collapse">
            <thead><tr className="border-b border-gray-200 bg-[#f7f7f4] text-left text-[11px] font-black uppercase text-gray-400"><th className="px-4 py-3">Profil</th><th className="px-4 py-3">Felt og fokus</th><th className="px-4 py-3">Pris og bidrag</th><th className="px-4 py-3">Verifikation</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Oprettet</th><th className="px-4 py-3 text-right">Handlinger</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-50/70">
                  <td className="max-w-[260px] px-4 py-4"><p className="text-sm font-black text-gray-950">{profile.name}</p><p className="mt-1 text-xs text-gray-500">{[profile.title, profile.company].filter(Boolean).join(' · ') || 'Titel og virksomhed mangler'}</p><p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-400">{profile.bio || 'Bio mangler'}</p></td>
                  <td className="max-w-[210px] px-4 py-4 text-xs text-gray-600"><p className="font-bold text-gray-950">{profile.industries?.join(', ') || 'Ikke valgt'}</p><p className="mt-2 line-clamp-2 leading-relaxed text-gray-500">{profile.focus_areas?.join(', ') || 'Fokus mangler'}</p></td>
                  <td className="px-4 py-4"><p className="text-sm font-black text-gray-950">DKK {profile.price_dkk.toLocaleString('da-DK')}</p><p className="mt-1 text-xs text-gray-500">10 / 20 / 70% af nettopris</p>{profile.price_dkk === 1800 && <span className="mt-2 inline-flex rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-black text-amber-800">Verificér højeste pris</span>}</td>
                  <td className="px-4 py-4">{verifiedLinkedInUrl(profile.linkedin_url) ? <a href={verifiedLinkedInUrl(profile.linkedin_url)!} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-black text-gray-700 underline decoration-gray-300 underline-offset-4">LinkedIn <ExternalLink size={11} aria-hidden="true" /></a> : <span className="text-xs font-bold text-red-700">Gyldigt LinkedIn mangler</span>}</td>
                  <td className="px-4 py-4"><ReviewBadge status={profile.review_status} visibility={profile.visibility} /></td>
                  <td className="px-4 py-4 text-xs tabular-nums text-gray-500">{new Date(profile.created_at).toLocaleDateString('da-DK')}</td>
                  <td className="px-4 py-4"><div className="flex justify-end gap-2">
                    {profile.review_status !== 'approved' && <button onClick={() => void updateReview(profile.id, 'approved', 'published')} disabled={actionLoading !== null} className="rounded-lg bg-gray-950 px-3 py-2 text-xs font-black text-white disabled:opacity-50">Godkend</button>}
                    {profile.review_status !== 'rejected' && <button onClick={() => void updateReview(profile.id, 'rejected', 'hidden')} onBlur={() => confirmRejectId === profile.id && setConfirmRejectId(null)} disabled={actionLoading !== null} className={`rounded-lg px-3 py-2 text-xs font-black disabled:opacity-50 ${confirmRejectId === profile.id ? 'bg-red-600 text-white' : 'border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-700'}`}>{confirmRejectId === profile.id ? 'Bekræft afvisning' : 'Afvis'}</button>}
                    {profile.review_status === 'approved' && <button onClick={() => void updateReview(profile.id, 'approved', profile.visibility === 'published' ? 'hidden' : 'published')} disabled={actionLoading !== null} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-black text-gray-600 disabled:opacity-50">{profile.visibility === 'published' ? 'Skjul' : 'Publicér'}</button>}
                    <Link href={`/professionals/${profile.id}`} target="_blank" className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-black text-gray-600">Profil <ExternalLink size={12} aria-hidden="true" /></Link>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminTableFrame>
    </>
  )
}
