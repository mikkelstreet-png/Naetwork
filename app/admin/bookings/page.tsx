'use client'

import { useEffect, useState } from 'react'
import { AdminEmptyState, AdminPageHeader, AdminTableFrame } from '@/components/AdminShell'
import { StatusBadge } from '@/components/StatusBadge'
import { formatSessionDate } from '@/lib/dateTime'
import { formatDkk } from '@/lib/platform'
import { createClient } from '@/lib/supabase/client'

type BookingStatus = 'requested' | 'pending' | 'confirmed' | 'rescheduled' | 'cancelled' | 'completed' | 'no_show' | 'refunded' | 'disputed'

interface Booking {
  id: string
  starts_at: string
  status: BookingStatus
  price_dkk: number | null
  contribution_dkk: number | null
  platform_fee_dkk: number | null
  professional_payout_dkk: number | null
  candidate_profile_id: string | null
  professional_profile_id: string | null
}

interface BookingRow extends Booking { candidateName: string; professionalName: string }

const STATUS_OPTIONS: Array<{ label: string; value: BookingStatus | 'all' }> = [
  { label: 'Alle', value: 'all' }, { label: 'Anmodet', value: 'requested' }, { label: 'Bekræftet', value: 'confirmed' }, { label: 'Aflyst', value: 'cancelled' }, { label: 'Gennemført', value: 'completed' },
]

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const supabase = createClient()
    async function load() {
      setLoading(true)
      const { data, error: bookingError } = await supabase.from('bookings').select('id, starts_at, status, price_dkk, contribution_dkk, platform_fee_dkk, professional_payout_dkk, candidate_profile_id, professional_profile_id').order('starts_at', { ascending: false })
      if (!active) return
      if (bookingError) {
        setError('Bookingerne kunne ikke indlæses. Kontrollér systemstatus og prøv igen.')
        setLoading(false)
        return
      }
      const rows = (data as Booking[] | null) ?? []
      const candidateIds = Array.from(new Set(rows.map((booking) => booking.candidate_profile_id).filter(Boolean))) as string[]
      const professionalIds = Array.from(new Set(rows.map((booking) => booking.professional_profile_id).filter(Boolean))) as string[]
      const [{ data: candidateProfiles }, { data: professionalProfiles }] = await Promise.all([
        candidateIds.length ? supabase.from('profiles').select('id, name').in('id', candidateIds) : Promise.resolve({ data: [] }),
        professionalIds.length ? supabase.from('professional_profiles').select('id, profile_id').in('id', professionalIds) : Promise.resolve({ data: [] }),
      ])
      const professionalRows = (professionalProfiles as Array<{ id: string; profile_id: string | null }> | null) ?? []
      const ownerIds = Array.from(new Set(professionalRows.map((profile) => profile.profile_id).filter(Boolean))) as string[]
      const { data: owners } = ownerIds.length ? await supabase.from('profiles').select('id, name').in('id', ownerIds) : { data: [] }
      if (!active) return
      const candidateNames = new Map(((candidateProfiles as Array<{ id: string; name: string | null }> | null) ?? []).map((profile) => [profile.id, profile.name || 'Navn mangler']))
      const ownerNames = new Map(((owners as Array<{ id: string; name: string | null }> | null) ?? []).map((profile) => [profile.id, profile.name || 'Navn mangler']))
      const professionalOwners = new Map(professionalRows.map((profile) => [profile.id, profile.profile_id]))
      setBookings(rows.map((booking) => {
        const ownerId = booking.professional_profile_id ? professionalOwners.get(booking.professional_profile_id) : null
        return { ...booking, candidateName: booking.candidate_profile_id ? candidateNames.get(booking.candidate_profile_id) ?? 'Navn mangler' : 'Slettet konto', professionalName: ownerId ? ownerNames.get(ownerId) ?? 'Navn mangler' : 'Slettet profil' }
      }))
      setLoading(false)
    }
    void load()
    return () => { active = false }
  }, [])

  const filtered = filter === 'all' ? bookings : bookings.filter((booking) => booking.status === filter)

  return (
    <>
      <AdminPageHeader title="Bookinger" description="Se bookinganmodninger, deltagere, tidspunkter og status. Viste priser er ikke registrerede betalinger." />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-3"><span className="text-xs font-black uppercase text-gray-400">Status</span><select value={filter} onChange={(event) => setFilter(event.target.value as BookingStatus | 'all')} className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-bold outline-none focus:border-gray-950">{STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
        <p className="text-xs font-bold text-gray-400">{loading ? 'Indlæser' : `${filtered.length} bookinger`}</p>
      </div>
      {error && <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <AdminTableFrame>
        {loading ? <AdminEmptyState title="Indlæser bookinger..." /> : filtered.length === 0 ? <AdminEmptyState title="Ingen bookinger i denne visning" body="Bookinger vises her, når kandidater sender anmodninger." /> : (
          <table className="min-w-[1140px] w-full border-collapse">
            <thead><tr className="border-b border-gray-200 bg-[#f7f7f4] text-left text-[11px] font-black uppercase text-gray-400"><th className="px-4 py-3">Kandidat</th><th className="px-4 py-3">Professionel</th><th className="px-4 py-3">Tidspunkt</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Pris inkl. moms</th><th className="px-4 py-3 text-right">Naetwork · 20%</th><th className="px-4 py-3 text-right">Kræftsagen · 30%</th><th className="px-4 py-3 text-right">Professionel · 50%</th></tr></thead>
            <tbody className="divide-y divide-gray-100">{filtered.map((booking) => <tr key={booking.id} className="hover:bg-gray-50/70"><td className="px-4 py-4 text-sm font-black text-gray-950">{booking.candidateName}</td><td className="px-4 py-4 text-sm font-semibold text-gray-700">{booking.professionalName}</td><td className="px-4 py-4 text-sm tabular-nums text-gray-600">{formatSessionDate(booking.starts_at)}</td><td className="px-4 py-4"><StatusBadge status={booking.status} /></td><td className="px-4 py-4 text-right text-sm font-black tabular-nums text-gray-950">{booking.price_dkk == null ? '—' : formatDkk(booking.price_dkk)}</td><td className="px-4 py-4 text-right text-sm tabular-nums text-gray-600">{booking.platform_fee_dkk == null ? '—' : formatDkk(booking.platform_fee_dkk)}</td><td className="px-4 py-4 text-right text-sm tabular-nums text-gray-600">{booking.contribution_dkk == null ? '—' : formatDkk(booking.contribution_dkk)}</td><td className="px-4 py-4 text-right text-sm tabular-nums text-gray-600">{booking.professional_payout_dkk == null ? '—' : formatDkk(booking.professional_payout_dkk)}</td></tr>)}</tbody>
          </table>
        )}
      </AdminTableFrame>
    </>
  )
}
