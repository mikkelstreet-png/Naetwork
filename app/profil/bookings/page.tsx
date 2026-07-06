'use client';

import { ArrowRight, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MemberNav } from '@/components/MemberNav';
import { StatusBadge } from '@/components/StatusBadge';
import { useLanguage } from '@/context/LanguageContext';

interface Booking {
  id: string;
  starts_at: string;
  ends_at: string;
  status: string;
  price_dkk: number | null;
  viewer_role: 'candidate' | 'professional';
  counterpart_name: string;
  counterpart_title: string;
}

type View = 'upcoming' | 'past' | 'all';
const ACTIVE_STATUSES = ['requested', 'pending', 'confirmed', 'rescheduled'];

export default function BookingsPage() {
  const { lang } = useLanguage();
  const isDa = lang === 'da';
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [accountRole, setAccountRole] = useState('candidate');
  const [view, setView] = useState<View>('upcoming');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function init() {
      try {
        const response = await fetch('/api/bookings');
        const result = await response.json().catch(() => ({}));
        if (!active) return;
        if (!response.ok) setActionError(result.error || (isDa ? 'Bookingerne kunne ikke indlæses.' : 'Bookings could not be loaded.'));
        setBookings(result.bookings ?? []);
        setAccountRole(result.accountRole ?? 'candidate');
      } catch {
        if (active) setActionError(isDa ? 'Bookingerne kunne ikke indlæses.' : 'Bookings could not be loaded.');
      } finally {
        if (active) setLoading(false);
      }
    }
    init();
    return () => { active = false; };
  }, [isDa]);

  function formatDateTime(iso: string) {
    return new Date(iso).toLocaleString(isDa ? 'da-DK' : 'en-GB', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Copenhagen',
    });
  }

  const now = Date.now();
  const upcomingCount = bookings.filter((booking) => ACTIVE_STATUSES.includes(booking.status) && new Date(booking.starts_at).getTime() > now).length;
  const pastCount = bookings.filter((booking) => !ACTIVE_STATUSES.includes(booking.status) || new Date(booking.starts_at).getTime() <= now).length;
  const totalValue = bookings.filter((booking) => !['cancelled', 'no_show', 'refunded'].includes(booking.status)).reduce((sum, booking) => sum + (booking.price_dkk ?? 0), 0);
  const visibleBookings = bookings.filter((booking) => {
    const upcoming = ACTIVE_STATUSES.includes(booking.status) && new Date(booking.starts_at).getTime() > now;
    if (view === 'upcoming') return upcoming;
    if (view === 'past') return !upcoming;
    return true;
  });

  async function updateBooking(bookingId: string, action: 'confirm' | 'cancel') {
    if (action === 'cancel' && confirmCancelId !== bookingId) {
      setConfirmCancelId(bookingId);
      return;
    }
    setActionLoading(`${bookingId}:${action}`);
    setActionError('');
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setActionError(result.error || (isDa ? 'Bookingen kunne ikke opdateres.' : 'The booking could not be updated.'));
      } else {
        setBookings((current) => current.map((booking) => booking.id === bookingId ? { ...booking, status: result.status } : booking));
      }
    } catch {
      setActionError(isDa ? 'Bookingen kunne ikke opdateres.' : 'The booking could not be updated.');
    } finally {
      setActionLoading(null);
      setConfirmCancelId(null);
    }
  }

  const views: Array<{ id: View; label: string; count: number }> = [
    { id: 'upcoming', label: isDa ? 'Kommende' : 'Upcoming', count: upcomingCount },
    { id: 'past', label: isDa ? 'Tidligere' : 'Past', count: pastCount },
    { id: 'all', label: isDa ? 'Alle' : 'All', count: bookings.length },
  ];

  return (
    <main className="min-h-screen bg-[#f7f7f4]">
      <section className="border-b border-gray-200 bg-white px-5 py-10 sm:px-8 md:py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase text-gray-400">{isDa ? 'Sessioner' : 'Sessions'}</p>
            <h1 className="mt-3 text-4xl font-black leading-none text-gray-950 md:text-6xl">{isDa ? 'Dine bookinger.' : 'Your bookings.'}</h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-600 md:text-base">{isDa ? 'Anmodninger, bekræftede tider og tidligere 60-minutters sessioner.' : 'Requests, confirmed times and previous 60-minute sessions.'}</p>
          </div>
          <Link href="/professionals" className="inline-flex w-fit items-center gap-2 rounded-lg bg-gray-950 px-5 py-3 text-sm font-black text-white hover:bg-gray-800">
            {isDa ? 'Book ny session' : 'Book new session'} <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <MemberNav isProfessional={accountRole === 'professional'} />

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 md:py-14">
        <section className="mb-10">
          <div className="grid border-y border-gray-300 bg-white sm:grid-cols-3">
            {[
              [isDa ? 'Kommende' : 'Upcoming', upcomingCount.toString()],
              [isDa ? 'Tidligere' : 'Past', pastCount.toString()],
              [isDa ? 'Listet værdi' : 'Listed value', `DKK ${totalValue.toLocaleString('da-DK')}`],
            ].map(([label, value]) => (
              <div key={label} className="border-b border-gray-200 px-5 py-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                <p className="text-xs font-black uppercase text-gray-400">{label}</p>
                <p className="mt-2 text-2xl font-black text-gray-950">{value}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-gray-400">{isDa ? 'Betaling er ikke aktiveret. Listet værdi er de viste sessionpriser, ikke gennemførte betalinger.' : 'Payments are not enabled. Listed value is the displayed session price, not completed payments.'}</p>
        </section>

        <div className="mb-6 flex gap-1 overflow-x-auto border-b border-gray-300" role="group" aria-label={isDa ? 'Filtrer bookinger' : 'Filter bookings'}>
          {views.map((item) => (
            <button key={item.id} type="button" onClick={() => setView(item.id)} aria-pressed={view === item.id} className={`relative shrink-0 px-4 py-3 text-sm font-black transition-colors ${view === item.id ? 'text-gray-950' : 'text-gray-400 hover:text-gray-950'}`}>
              {item.label} <span className="ml-1 text-xs">{item.count}</span>
              {view === item.id && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-gray-950" aria-hidden="true" />}
            </button>
          ))}
        </div>

        {actionError && <p role="alert" className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{actionError}</p>}

        {loading ? (
          <div className="border-y border-gray-300 bg-white px-5 py-12 text-center text-sm text-gray-400">{isDa ? 'Indlæser bookinger...' : 'Loading bookings...'}</div>
        ) : visibleBookings.length === 0 ? (
          <div className="border-y border-gray-300 bg-white px-5 py-12 text-center">
            <CalendarDays size={22} className="mx-auto text-gray-300" aria-hidden="true" />
            <h2 className="mt-5 text-xl font-black text-gray-950">{view === 'upcoming' ? (isDa ? 'Ingen kommende bookinger' : 'No upcoming bookings') : (isDa ? 'Ingen bookinger i denne visning' : 'No bookings in this view')}</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-500">{isDa ? 'Find en professionel og book 60 minutter med fokus på dit næste karriereskridt.' : 'Find a professional and book 60 minutes focused on your next career move.'}</p>
            <Link href="/professionals" className="mt-6 inline-flex rounded-lg bg-gray-950 px-5 py-3 text-sm font-black text-white">{isDa ? 'Se profiler' : 'Browse profiles'}</Link>
          </div>
        ) : (
          <div className="border-t border-gray-300 bg-white">
            {visibleBookings.map((booking) => (
              <article key={booking.id} className="grid gap-5 border-b border-gray-300 px-4 py-5 lg:grid-cols-[1fr_240px_140px_auto] lg:items-center">
                <div><h2 className="text-lg font-black text-gray-950">{booking.counterpart_name}</h2><p className="mt-1 text-xs text-gray-500">{booking.counterpart_title}</p></div>
                <div><p className="text-sm font-black text-gray-950">{formatDateTime(booking.starts_at)}</p><p className="mt-1 text-xs text-gray-400">60 min · Europe/Copenhagen</p></div>
                <div><p className="text-sm font-black text-gray-950">DKK {(booking.price_dkk ?? 0).toLocaleString('da-DK')}</p><p className="mt-1 text-xs text-gray-400">{isDa ? 'Betaling ikke aktiv' : 'Payment not active'}</p></div>
                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                  <StatusBadge status={booking.status} />
                  {booking.viewer_role === 'professional' && ['requested', 'pending'].includes(booking.status) && (
                    <>
                      <button onClick={() => updateBooking(booking.id, 'confirm')} disabled={actionLoading !== null} className="rounded-lg bg-gray-950 px-3 py-2 text-xs font-black text-white disabled:opacity-50">{actionLoading === `${booking.id}:confirm` ? '...' : (isDa ? 'Bekræft' : 'Confirm')}</button>
                      <button onClick={() => updateBooking(booking.id, 'cancel')} onBlur={() => confirmCancelId === booking.id && setConfirmCancelId(null)} disabled={actionLoading !== null} className={`rounded-lg px-3 py-2 text-xs font-black disabled:opacity-50 ${confirmCancelId === booking.id ? 'bg-red-600 text-white' : 'border border-gray-300 text-gray-700'}`}>{confirmCancelId === booking.id ? (isDa ? 'Bekræft afvisning' : 'Confirm decline') : (isDa ? 'Afvis' : 'Decline')}</button>
                    </>
                  )}
                  {booking.viewer_role === 'candidate' && ACTIVE_STATUSES.includes(booking.status) && (
                    <button onClick={() => updateBooking(booking.id, 'cancel')} onBlur={() => confirmCancelId === booking.id && setConfirmCancelId(null)} disabled={actionLoading !== null} className={`rounded-lg px-3 py-2 text-xs font-black disabled:opacity-50 ${confirmCancelId === booking.id ? 'bg-red-600 text-white' : 'border border-gray-300 text-gray-700'}`}>{actionLoading === `${booking.id}:cancel` ? '...' : confirmCancelId === booking.id ? (isDa ? 'Bekræft aflysning' : 'Confirm cancellation') : (isDa ? 'Aflys' : 'Cancel')}</button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
