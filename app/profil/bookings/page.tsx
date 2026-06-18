'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import Link from 'next/link'
import { StatusBadge } from '@/components/StatusBadge'

interface Booking {
  id: string
  starts_at: string
  ends_at: string
  status: string
  price_dkk: number | null
  professional_profile_id: string | null
  candidate_profile_id: string | null
}

export default function BookingsPage() {
  const { lang } = useLanguage()
  const locale = lang
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('auth_user_id', user.id)
        .single()

      if (!profile) { setLoading(false); return }

      const { data: candidateBookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('candidate_profile_id', profile.id)
        .order('starts_at', { ascending: false })

      const { data: proProfile } = await supabase
        .from('professional_profiles')
        .select('id')
        .eq('profile_id', profile.id)
        .maybeSingle()

      let professionalBookings: Booking[] = []
      if (proProfile) {
        const { data: pb } = await supabase
          .from('bookings')
          .select('*')
          .eq('professional_profile_id', proProfile.id)
          .order('starts_at', { ascending: false })
        professionalBookings = (pb as Booking[]) ?? []
      }

      const all = [...((candidateBookings as Booking[]) ?? []), ...professionalBookings]
      const unique = all.filter((b, i, arr) => arr.findIndex(x => x.id === b.id) === i)
      unique.sort((a, b) => new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime())
      setBookings(unique)
      setLoading(false)
    }
    init()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function formatDateTime(iso: string): string {
    return new Date(iso).toLocaleString(locale === 'da' ? 'da-DK' : 'en-GB', {
      weekday: 'short', day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Copenhagen'
    })
  }

  const isDa = locale === 'da'
  const totalValue = bookings.reduce((sum, booking) => sum + (booking.price_dkk ?? 0), 0)

  return (
    <main className="min-h-screen bg-[#f7f7f4] pt-16">
      <div className="mx-auto max-w-5xl px-6 py-10 md:py-14">
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <Link href="/profil" className="mb-8 inline-flex rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 shadow-sm hover:text-gray-950">&larr; {isDa ? 'Min profil' : 'My profile'}</Link>
          <p className="text-xs font-semibold uppercase text-gray-400">Sessions</p>
          <h1 className="mt-2 text-4xl font-black leading-none tracking-tight text-gray-950">{isDa ? 'Mine bookinger' : 'My bookings'}</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-500">{isDa ? 'Overblik over kommende og tidligere 60-minutters sessioner.' : 'Overview of upcoming and past 60-minute sessions.'}</p>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><p className="text-xs font-semibold uppercase text-gray-400">Total</p><p className="mt-2 text-2xl font-black text-gray-950">{bookings.length}</p></div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><p className="text-xs font-semibold uppercase text-gray-400">Format</p><p className="mt-2 text-2xl font-black text-gray-950">60 min</p></div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><p className="text-xs font-semibold uppercase text-gray-400">Værdi</p><p className="mt-2 text-2xl font-black text-gray-950">DKK {totalValue.toLocaleString('da-DK')}</p></div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-400 shadow-sm">{isDa ? 'Indlæser...' : 'Loading...'}</div>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-black text-gray-950">{isDa ? 'Ingen bookinger endnu' : 'No bookings yet'}</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-500">{isDa ? 'Find en professionel og book 60 minutter med fokus på dit næste karriereskridt.' : 'Find a professional and book 60 minutes focused on your next career move.'}</p>
            <Link href="/professionals" className="mt-6 inline-flex rounded-full bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800">
              {isDa ? 'Find en professionel' : 'Find a professional'}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div key={booking.id} className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black text-gray-950">{formatDateTime(booking.starts_at)}</p>
                  <p className="mt-1 text-xs font-medium text-gray-400">60 min · Europe/Copenhagen</p>
                  {booking.price_dkk && <p className="mt-2 text-sm font-semibold text-gray-700">DKK {booking.price_dkk.toLocaleString('da-DK')}</p>}
                </div>
                <StatusBadge status={booking.status} />
              </div>
            ))}
          </div>
        )}

        {bookings.length > 0 && (
          <div className="mt-8 text-center">
            <Link href="/professionals" className="inline-flex rounded-full bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800">
              {isDa ? 'Book ny session' : 'Book new session'}
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
