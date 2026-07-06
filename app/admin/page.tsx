'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, AlertTriangle } from 'lucide-react'
import { AdminEmptyState, AdminPageHeader, AdminTableFrame } from '@/components/AdminShell'
import { createClient } from '@/lib/supabase/client'

interface Stats {
  users: number | null
  professionals: number | null
  bookingsToday: number | null
  legalBlockers: number | null
  contactMessages: number | null
}

interface AuditEntry {
  id: string
  action: string
  target_table: string | null
  notes: string | null
  created_at: string
}

const EMPTY_STATS: Stats = { users: null, professionals: null, bookingsToday: null, legalBlockers: null, contactMessages: null }

export default function AdminPage() {
  const [stats, setStats] = useState<Stats>(EMPTY_STATS)
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const supabase = createClient()

    async function load() {
      setLoading(true)
      setError('')
      const startOfToday = new Date()
      startOfToday.setHours(0, 0, 0, 0)
      const startOfTomorrow = new Date(startOfToday)
      startOfTomorrow.setDate(startOfTomorrow.getDate() + 1)

      const results = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('professional_profiles').select('*', { count: 'exact', head: true }).eq('review_status', 'approved').eq('visibility', 'published'),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).gte('starts_at', startOfToday.toISOString()).lt('starts_at', startOfTomorrow.toISOString()),
        supabase.from('legal_blockers').select('*', { count: 'exact', head: true }).eq('status', 'open'),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
        supabase.from('admin_audit_log').select('id, action, target_table, notes, created_at').order('created_at', { ascending: false }).limit(6),
      ])

      if (!active) return
      const firstError = results.find((result) => result.error)?.error
      if (firstError) setError('Driftsdata kunne ikke indlæses fuldt ud. Kontrollér systemstatus og prøv igen.')
      setStats({
        users: results[0].count,
        professionals: results[1].count,
        bookingsToday: results[2].count,
        legalBlockers: results[3].count,
        contactMessages: results[4].count,
      })
      setAuditLog((results[5].data as AuditEntry[] | null) ?? [])
      setLoading(false)
    }

    void load()
    return () => { active = false }
  }, [])

  const statCards = [
    { label: 'Brugere', value: stats.users, note: 'Aktive konti i platformen' },
    { label: 'Publicerede profiler', value: stats.professionals, note: 'Godkendte og synlige' },
    { label: 'Sessioner i dag', value: stats.bookingsToday, note: 'Alle aktuelle statusser' },
    { label: 'Juridiske blokkere', value: stats.legalBlockers, note: 'Skal være 0 før betaling' },
    { label: 'Kontaktbeskeder', value: stats.contactMessages, note: 'Samlet i indbakken' },
  ]

  return (
    <>
      <AdminPageHeader title="Driftsoverblik" description="Et samlet billede af platformens brugere, profiler, sessioner og launch-blokkere." actions={<Link href="/admin/system" className="inline-flex items-center gap-2 rounded-lg bg-gray-950 px-4 py-2.5 text-sm font-black text-white">Systemstatus <ArrowRight size={15} aria-hidden="true" /></Link>} />

      {error && <div role="alert" className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"><AlertTriangle className="mt-0.5 shrink-0" size={17} aria-hidden="true" /><p>{error}</p></div>}

      <section aria-label="Nøgletal" className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map((card) => (
          <div key={card.label} className="min-h-32 rounded-lg border border-gray-200 bg-white p-5">
            <p className="text-[11px] font-black uppercase text-gray-400">{card.label}</p>
            <p className="mt-4 text-3xl font-black tabular-nums text-gray-950">{loading || card.value === null ? '—' : card.value}</p>
            <p className="mt-2 text-xs leading-relaxed text-gray-500">{card.note}</p>
          </div>
        ))}
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div><p className="text-[11px] font-black uppercase text-gray-400">Audit</p><h2 className="mt-1 text-xl font-black text-gray-950">Seneste aktivitet</h2></div>
        </div>
        <AdminTableFrame>
          {loading ? <AdminEmptyState title="Indlæser aktivitet..." /> : auditLog.length === 0 ? <AdminEmptyState title="Ingen aktivitet endnu" body="Administrative ændringer vises her, når de registreres." /> : (
            <ul className="divide-y divide-gray-100">
              {auditLog.map((entry) => (
                <li key={entry.id} className="grid gap-2 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div><p className="text-sm font-black text-gray-950">{entry.action}</p>{entry.notes && <p className="mt-1 text-xs leading-relaxed text-gray-500">{entry.notes}</p>}{entry.target_table && <p className="mt-1 font-mono text-[11px] text-gray-400">{entry.target_table}</p>}</div>
                  <time className="text-xs tabular-nums text-gray-400">{new Date(entry.created_at).toLocaleString('da-DK')}</time>
                </li>
              ))}
            </ul>
          )}
        </AdminTableFrame>
      </section>
    </>
  )
}
