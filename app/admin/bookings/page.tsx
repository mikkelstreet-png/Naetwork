'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

interface Booking {
  id: string;
  date: string;
  time: string | null;
  status: BookingStatus;
  price: number | null;
  candidate: { full_name: string | null } | null;
  professional: { full_name: string | null } | null;
}

const STATUS_OPTIONS: { label: string; value: BookingStatus | 'all' }[] = [
  { label: 'Alle', value: 'all' },
  { label: 'Afventer', value: 'pending' },
  { label: 'Bekr\u00e6ftet', value: 'confirmed' },
  { label: 'Annulleret', value: 'cancelled' },
  { label: 'Gennemf\u00f8rt', value: 'completed' },
];

const statusBadge = (status: BookingStatus) => {
  const map: Record<BookingStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-indigo-100 text-indigo-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-gray-100 text-gray-700',
  };
  const labels: Record<BookingStatus, string> = {
    pending: 'Afventer',
    confirmed: 'Bekr\u00e6ftet',
    cancelled: 'Annulleret',
    completed: 'Gennemf\u00f8rt',
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[status]}`}>{labels[status]}</span>;
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from('bookings')
        .select('id, date, time, status, price, candidate:candidate_id(full_name), professional:professional_id(full_name)')
        .order('date', { ascending: false });
      setBookings((data as unknown as Booking[]) || []);
      setLoading(false);
    }
    load();
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
              <div className="px-5 py-8 text-center text-gray-400 text-sm">Indl\u00e6ser...</div>
            ) : filtered.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-400 text-sm">Ingen bookinger fundet</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Kandidat</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Professionel</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Dato / Tid</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Pris</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{b.candidate?.full_name || '\u2014'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{b.professional?.full_name || '\u2014'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <div>{new Date(b.date).toLocaleDateString('da-DK')}</div>
                        {b.time && <div className="text-xs text-gray-400">{b.time}</div>}
                      </td>
                      <td className="px-4 py-3">{statusBadge(b.status)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{b.price != null ? `${b.price} kr.` : '\u2014'}</td>
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
