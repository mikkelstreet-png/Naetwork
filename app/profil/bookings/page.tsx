'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Booking {
  id: string
  starts_at: string
  ends_at: string
  status: string
  price_dkk: number | null
  professional_profile_id: string | null
  candidate_profile_id: string | null
}

const STATUS_STYLES: Record<string, string> = {
  requested: 'bg-gray-100 text-gray-600',
  pending: 'bg-gray-100 text-gray-600',
  confirmed: 'bg-indigo-100 text-indigo-700',
  rescheduled: 'bg-indigo-50 text-indigo-600',
  cancelled: 'bg-red-100 text-red-600',
  completed: 'bg-green-100 text-green-700',
  no_show: 'bg-red-50 text-red-500',
  refunded: 'bg-gray-100 text-gray-500',
  disputed: 'bg-red-100 text-red-700',
}

const STATUS_DA: Record<string, string> = {
  requested: 'Anmodet', pending: 'Afventer', confirmed: 'Bekraeftet',
  rescheduled: 'Omplanlage', cancelled: 'Aflyst', completed: 'Gennemfoert',
  no_show: 'Udeblivelse', refunded: 'Refunderet', disputed: 'Tvist',
}

const STATUS_EN: Record<string, string> = {
  requested: 'Requested', pending: 'Pending', confirmed: 'Confirmed',
  rescheduled: 'Rescheduled', cancelled: 'Cancelled', completed: 'Completed',
  no_show: 'No show', refunded: 'Refunded', disputed: 'Disputed',
}

export default function BookingsPage() {
  const [locale, setLocale] = useState<'da' | 'en'>('da')
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
        .single()

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

  const statusLabels = locale === 'da' ? STATUS_DA : STATUS_EN
  const t = {
    heading: locale === 'da' ? 'Mine bookinger' : 'My bookings',
    empty: locale === 'da' ? 'Du har ingen bookinger endnu' : 'You have no bookings yet',
    findPro: locale === 'da' ? 'Find en professionel' : 'Find a professional',
    loading: locale === 'da' ? 'Indlaaser...' : 'Loading...',
    back: locale === 'da' ? 'Min profil' : 'My profile',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <Link href="/profil" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
            <span>&larr;</span><span>{t.back}</span>
          </Link>
          <div className="flex gap-2">
            <button onClick={() => setLocale('da')} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${locale === 'da' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}>DA</button>
            <button onClick={() => setLocale('en')} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${locale === 'en' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}>EN</button>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">{t.heading}</h1>

        {loading ? (
          <p className="text-gray-400 text-center py-12">{t.loading}</p>
        ) : bookings.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center">
            <p className="text-gray-500 mb-4">{t.empty}</p>
            <Link href="/professionals" className="inline-block px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
              {t.findPro}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{formatDateTime(booking.starts_at)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">60 min</p>
                  {booking.price_dkk && <p className="text-xs text-gray-500 mt-1">DKK {booking.price_dkk}</p>}
                </div>
                <span className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[booking.status] ?? 'bg-gray-100 text-gray-600'}`}>
                  {statusLabels[booking.status] ?? booking.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {bookings.length > 0 && (
          <div className="mt-6 text-center">
            <Link href="/professionals" className="text-sm text-indigo-600 hover:underline">
              {locale === 'da' ? '+ Book ny session' : '+ Book new session'}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
