'use client'

import { useCallback, useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { AdminEmptyState, AdminPageHeader, AdminTableFrame } from '@/components/AdminShell'
import { createClient } from '@/lib/supabase/client'

type UserRole = 'candidate' | 'professional' | 'admin'
type UserStatus = 'active' | 'deletion_requested' | 'deleted'

interface UserProfile {
  id: string
  name: string | null
  role: UserRole
  status: UserStatus
  created_at: string
}

const ROLE_LABELS: Record<UserRole, string> = { candidate: 'Kandidat', professional: 'Professionel', admin: 'Admin' }
const STATUS_LABELS: Record<UserStatus, string> = { active: 'Aktiv', deletion_requested: 'Sletning anmodet', deleted: 'Slettet' }

function Badge({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'dark' | 'warning' | 'danger' }) {
  const tones = { neutral: 'border-gray-200 bg-gray-50 text-gray-600', dark: 'border-gray-950 bg-gray-950 text-white', warning: 'border-amber-200 bg-amber-50 text-amber-800', danger: 'border-red-200 bg-red-50 text-red-700' }
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${tones[tone]}`}>{children}</span>
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const loadUsers = useCallback(async () => {
    setLoading(true)
    setError('')
    const { data, error: loadError } = await createClient().from('profiles').select('id, name, role, status, created_at').order('created_at', { ascending: false })
    if (loadError) setError('Brugerne kunne ikke indlæses. Kontrollér forbindelsen og prøv igen.')
    setUsers((data as UserProfile[] | null) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { void loadUsers() }, [loadUsers])

  async function requestDeletion(id: string) {
    if (confirmId !== id) {
      setConfirmId(id)
      return
    }
    setActionLoading(id)
    setError('')
    const { error: updateError } = await createClient().from('profiles').update({ status: 'deletion_requested' }).eq('id', id)
    if (updateError) setError('Status kunne ikke opdateres. Ingen ændringer er gemt.')
    else await loadUsers()
    setActionLoading(null)
    setConfirmId(null)
  }

  const query = search.trim().toLowerCase()
  const filtered = users.filter((user) => !query || user.name?.toLowerCase().includes(query) || ROLE_LABELS[user.role].toLowerCase().includes(query))

  return (
    <>
      <AdminPageHeader title="Brugere" description="Find konti, kontrollér roller og håndtér anmodninger om kontosletning med et tydeligt auditspor." />

      <div className="mb-4 grid gap-3 sm:grid-cols-[minmax(0,360px)_auto] sm:items-center sm:justify-between">
        <label className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5">
          <Search size={16} className="text-gray-400" aria-hidden="true" />
          <span className="sr-only">Søg brugere</span>
          <input type="search" placeholder="Søg navn eller rolle" value={search} onChange={(event) => setSearch(event.target.value)} className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400" />
        </label>
        <p className="text-xs font-bold text-gray-400">{loading ? 'Indlæser' : `${filtered.length} af ${users.length} brugere`}</p>
      </div>

      {error && <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <AdminTableFrame>
        {loading ? <AdminEmptyState title="Indlæser brugere..." /> : filtered.length === 0 ? <AdminEmptyState title="Ingen brugere fundet" body={search ? 'Prøv en anden søgning.' : 'Nye konti vises her, når de oprettes.'} /> : (
          <table className="min-w-[760px] w-full border-collapse">
            <thead><tr className="border-b border-gray-200 bg-[#f7f7f4] text-left text-[11px] font-black uppercase text-gray-400"><th className="px-4 py-3">Navn</th><th className="px-4 py-3">Rolle</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Oprettet</th><th className="px-4 py-3 text-right">Handling</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/70">
                  <td className="px-4 py-4 text-sm font-black text-gray-950">{user.name || 'Navn mangler'}</td>
                  <td className="px-4 py-4"><Badge tone={user.role === 'admin' ? 'dark' : 'neutral'}>{ROLE_LABELS[user.role]}</Badge></td>
                  <td className="px-4 py-4"><Badge tone={user.status === 'active' ? 'neutral' : user.status === 'deleted' ? 'danger' : 'warning'}>{STATUS_LABELS[user.status]}</Badge></td>
                  <td className="px-4 py-4 text-xs tabular-nums text-gray-500">{new Date(user.created_at).toLocaleDateString('da-DK')}</td>
                  <td className="px-4 py-4 text-right">
                    {user.status === 'active' && user.role !== 'admin' && (
                      <button onClick={() => void requestDeletion(user.id)} onBlur={() => confirmId === user.id && setConfirmId(null)} disabled={actionLoading === user.id} className={`rounded-lg px-3 py-2 text-xs font-black transition-colors disabled:opacity-50 ${confirmId === user.id ? 'bg-red-600 text-white hover:bg-red-700' : 'border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-700'}`}>
                        {actionLoading === user.id ? 'Gemmer...' : confirmId === user.id ? 'Bekræft markering' : 'Marker til sletning'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminTableFrame>
    </>
  )
}
