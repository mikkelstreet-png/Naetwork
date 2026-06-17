'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

type BookingStatus = 'requested' | 'pending' | 'confirmed' | 'rescheduled' | 'cancelled' | 'completed' | 'no_show' | 'refunded' | 'disputed';

interface Booking {
  id: string;
  starts_at: string;
  status: BookingStatus;
  price_dkk: number | null;
  candidate_profile_id: string | null;
  professional_profile_id: string | null;
}

interface BookingRow extends Booking {
  candidateName: string;
  professionalName: string;
}

const STATUS_OPTIONS: { label: string; value: BookingStatus | 'all' }[] = [
  { label: 'Alle', value: 'all' },
  { label: 'Anmodet', value: 'requested' },
  { label: 'Afventer', value: 'pending' },
  { label: 'Bekræftet', value: 'confirmed' },
  { label: 'Aflyst', value: 'cancelled' },
  { label: 'Gennemført', value: 'completed' },
];

const statusBadge = (status: BookingStatus) => {
  const map: Record<BookingStatus, string> = {
    requested: 'bg-gray-100 text-gray-700',
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-indigo-100 text-indigo-800',
    rescheduled: 'bg-indigo-50 text-indigo-700',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-green-100 text-green-800',
    no_show: 'bg-red-50 text-red-700',
    refunded: 'bg-gray-100 text-gray-600',
    disputed: 'bg-red-100 text-red-800',
  };
  const labels: Record<BookingStatus, string> = {
    requested: 'Anmodet',
    pending: 'Afventer',
    confirmed: 'Bekræftet',
    rescheduled: 'Omplanlagt',
    cancelled: 'Aflyst',
    completed: 'Gennemført',
    no_show: 'Udeblevet',
    refunded: 'Refunderet',
    disputed: 'Tvist',
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[status]}`}>{labels[status]}</span>;
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from('bookings')
        .select('id, starts_at, status, price_dkk, candidate_profile_id, professional_profile_id')
        .order('starts_at', { ascending: false });

      const rows = (data as Booking[]) || [];
      const candidateIds = Array.from(new Set(rows.map(b => b.candidate_profile_id).filter(Boolean))) as string[];
      const professionalIds = Array.from(new Set(rows.map(b => b.professional_profile_id).filter(Boolean))) as string[];

      const [{ data: candidateProfiles }, { data: professionalProfiles }] = await Promise.all([
        candidateIds.length
          ? supabase.from('profiles').select('id, name').in('id', candidateIds)
          : Promise.resolve({ data: [] }),
        professionalIds.length
          ? supabase.from('professional_profiles').select('id, profile_id').in('id', professionalIds)
          : Promise.resolve({ data: [] }),
      ]);

      const proProfileRows = (professionalProfiles as Array<{ id: string; profile_id: string | null }> | null) || [];
      const proOwnerProfileIds = Array.from(new Set(proProfileRows.map(p => p.profile_id).filter(Boolean))) as string[];
      const { data: proOwnerProfiles } = proOwnerProfileIds.length
        ? await supabase.from('profiles').select('id, name').in('id', proOwnerProfileIds)
        : { data: [] };

      const candidateNames = new Map(((candidateProfiles as Array<{ id: string; name: string | null }> | null) || []).map(p => [p.id, p.name || '—']));
      const ownerNames = new Map(((proOwnerProfiles as Array<{ id: string; name: string | null }> | null) || []).map(p => [p.id, p.name || '—']));
      const proToOwner = new Map(proProfileRows.map(p => [p.id, p.profile_id]));

      setBookings(rows.map((booking) => {
        const ownerProfileId = booking.professional_profile_id ? proToOwner.get(booking.professional_profile_id) : null;
        return {
          ...booking,
          candidateName: booking.candidate_profile_id ? candidateNames.get(booking.candidate_profile_id) ?? '—' : '—',
          professionalName: ownerProfileId ? ownerNames.get(ownerProfileId) ?? '—' : '—',
        };
      }));
      setLoading(false);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="w-60 bg-gray-900 flex-shrink-0 flex flex-col">
        <div className="px-6 py-5 border-b border-gray-800">
          <Link href="/admin" className="text-white font-bold text-lg tracking-tight">Admin</Link>
          <Link href="/" className="block text-gray-400 text-xs mt-0.5 hover:text-white transition-colors">Naetwork</Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {[
            { label: 'Oversigt', href: '/admin' },
            { label: 'Brugere', href: '/admin/users' },
            { label: 'Professionelle', href: '/admin/professionals' },
            { label: 'Bookinger', href: '/admin/bookings' },
            { label: 'Kontaktbeskeder', href: '/admin/contact' },
            { label: 'Betalinger', href: '/admin/payments', badge: 'Gated' },
            { label: 'Donation / juridisk', href: '/admin/legal' },
            { label: 'System', href: '/admin/system' },
          ].map((item) => (
            <Link key={item.href} href={item.href} className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${item.href === '/admin/bookings' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              <span>{item.label}</span>
              {item.badge && <span className="text-xs bg-yellow-500 text-black px-1.5 py-0.5 rounded font-medium">{item.badge}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-gray-900 font-semibold text-base">Bookinger</h1>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mb-4">
            <select
              value={filter}
              onChange={e => setFilter(e.target.value as BookingStatus | 'all')}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="px-5 py-8 text-center text-gray-400 text-sm">Indlæser...</div>
            ) : filtered.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-400 text-sm">Ingen bookinger fundet</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Kandidat</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Professionel</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Tidspunkt</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Pris</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{b.candidateName}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{b.professionalName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <div>{new Date(b.starts_at).toLocaleDateString('da-DK')}</div>
                        <div className="text-xs text-gray-400">{new Date(b.starts_at).toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>
                      <td className="px-4 py-3">{statusBadge(b.status)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{b.price_dkk != null ? `${b.price_dkk} kr.` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
