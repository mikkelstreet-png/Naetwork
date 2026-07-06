'use client'

import { useCallback, useEffect, useState } from 'react'
import { LockKeyhole } from 'lucide-react'
import { AdminEmptyState, AdminPageHeader, AdminTableFrame } from '@/components/AdminShell'
import { createClient } from '@/lib/supabase/client'

type LegalStatus = 'open' | 'in_progress' | 'resolved'
type LegalPriority = 'low' | 'medium' | 'high' | 'critical'

interface LegalBlocker {
  id: string
  title: string
  description: string | null
  status: LegalStatus
  priority: LegalPriority
  created_at: string
}

const PRIORITY_LABELS: Record<LegalPriority, string> = { critical: 'Kritisk', high: 'Høj', medium: 'Mellem', low: 'Lav' }
const STATUS_LABELS: Record<LegalStatus, string> = { open: 'Åben', in_progress: 'I gang', resolved: 'Løst' }

function PriorityBadge({ priority }: { priority: LegalPriority }) {
  const tone = priority === 'critical' ? 'border-red-200 bg-red-50 text-red-700' : priority === 'high' ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-gray-200 bg-gray-50 text-gray-600'
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${tone}`}>{PRIORITY_LABELS[priority]}</span>
}

export default function LegalPage() {
  const [blockers, setBlockers] = useState<LegalBlocker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const loadBlockers = useCallback(async () => {
    setLoading(true)
    setError('')
    const { data, error: loadError } = await createClient().from('legal_blockers').select('id, title, description, status, priority, created_at').order('created_at', { ascending: false })
    if (loadError) setError('De juridiske blokkere kunne ikke indlæses.')
    const priority = { critical: 0, high: 1, medium: 2, low: 3 }
    setBlockers(((data as LegalBlocker[] | null) ?? []).sort((a, b) => priority[a.priority] - priority[b.priority]))
    setLoading(false)
  }, [])

  useEffect(() => { void loadBlockers() }, [loadBlockers])

  async function updateStatus(id: string, status: LegalStatus) {
    setActionLoading(id)
    setError('')
    const updates = { status, resolved_at: status === 'resolved' ? new Date().toISOString() : null }
    const { error: updateError } = await createClient().from('legal_blockers').update(updates).eq('id', id)
    if (updateError) setError('Status kunne ikke opdateres. Ingen ændringer er gemt.')
    else setBlockers((current) => current.map((blocker) => blocker.id === id ? { ...blocker, status } : blocker))
    setActionLoading(null)
  }

  const unresolved = blockers.filter((blocker) => blocker.status !== 'resolved')
  const critical = unresolved.filter((blocker) => blocker.priority === 'critical').length

  return (
    <>
      <AdminPageHeader title="Juridisk readiness" description="Hold økonomiske, forbrugerretlige og dokumentationsmæssige launch-krav synlige, indtil de er reelt afklaret." />
      <section className="mb-6 grid gap-4 rounded-lg border border-gray-950 bg-gray-950 p-5 text-white sm:grid-cols-[auto_1fr_auto] sm:items-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-950"><LockKeyhole size={18} aria-hidden="true" /></span>
        <div><p className="text-sm font-black">Betaling forbliver låst</p><p className="mt-1 text-xs leading-relaxed text-white/55">Aktivér først checkout, når kritiske blokkere, handelsoplysninger, afbestilling, regnskab og bidragsdokumentation er godkendt.</p></div>
        <div className="text-left sm:text-right"><p className="text-2xl font-black tabular-nums">{loading ? '—' : critical}</p><p className="text-[10px] font-black uppercase text-white/40">kritiske</p></div>
      </section>
      {error && <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <AdminTableFrame>
        {loading ? <AdminEmptyState title="Indlæser juridisk status..." /> : blockers.length === 0 ? <AdminEmptyState title="Ingen blokkere registreret" body="Det er ikke i sig selv en juridisk godkendelse. Foretag stadig manuel review før betaling aktiveres." /> : (
          <table className="min-w-[820px] w-full border-collapse">
            <thead><tr className="border-b border-gray-200 bg-[#f7f7f4] text-left text-[11px] font-black uppercase text-gray-400"><th className="px-4 py-3">Krav</th><th className="px-4 py-3">Prioritet</th><th className="px-4 py-3">Oprettet</th><th className="px-4 py-3 text-right">Status</th></tr></thead>
            <tbody className="divide-y divide-gray-100">{blockers.map((blocker) => <tr key={blocker.id} className="align-top hover:bg-gray-50/70"><td className="px-4 py-4"><p className="text-sm font-black text-gray-950">{blocker.title}</p><p className="mt-1 max-w-2xl text-xs leading-relaxed text-gray-500">{blocker.description || 'Ingen beskrivelse tilføjet.'}</p></td><td className="px-4 py-4"><PriorityBadge priority={blocker.priority} /></td><td className="px-4 py-4 text-xs tabular-nums text-gray-500">{new Date(blocker.created_at).toLocaleDateString('da-DK')}</td><td className="px-4 py-4 text-right"><label><span className="sr-only">Status for {blocker.title}</span><select value={blocker.status} onChange={(event) => void updateStatus(blocker.id, event.target.value as LegalStatus)} disabled={actionLoading === blocker.id} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-black text-gray-700 outline-none focus:border-gray-950 disabled:opacity-50">{Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></td></tr>)}</tbody>
          </table>
        )}
      </AdminTableFrame>
    </>
  )
}
