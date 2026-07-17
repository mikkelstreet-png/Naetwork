'use client';

import { ArrowRight, CalendarDays, Check, ListChecks, Star } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MemberNav } from '@/components/MemberNav';
import { StatusBadge } from '@/components/StatusBadge';
import { useLanguage } from '@/context/LanguageContext';
import { CONTRIBUTION_PERCENT, focusLabel } from '@/lib/platform';
import { isSessionTypeId, sessionType } from '@/lib/sessionTypes';

interface SessionOutcome {
  id: string;
  booking_id: string;
  summary: string;
  priorities: string[];
  next_action: string;
  next_action_due_at: string | null;
  candidate_completed_at: string | null;
  updated_at: string;
}

interface Booking {
  id: string;
  starts_at: string;
  ends_at: string;
  status: string;
  price_dkk: number | null;
  contribution_dkk: number | null;
  minimum_contribution_dkk: number | null;
  professional_donation_dkk: number | null;
  payout_preference: 'receive' | 'donate';
  professional_payout_dkk: number | null;
  payment_status: string;
  refund_status: string;
  focus_area: string | null;
  session_type: string | null;
  goal: string | null;
  material_url: string | null;
  meeting_mode: string;
  meeting_url: string | null;
  viewer_role: 'candidate' | 'professional';
  counterpart_name: string;
  counterpart_title: string;
  reviewed: boolean;
  outcome: SessionOutcome | null;
}

interface OutcomeDraft {
  summary: string;
  priorities: [string, string, string];
  nextAction: string;
  nextActionDueAt: string;
}

const EMPTY_OUTCOME: OutcomeDraft = {
  summary: '',
  priorities: ['', '', ''],
  nextAction: '',
  nextActionDueAt: '',
};

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
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [outcomeBookingId, setOutcomeBookingId] = useState<string | null>(null);
  const [outcomeDraft, setOutcomeDraft] = useState<OutcomeDraft>(EMPTY_OUTCOME);

  useEffect(() => {
    const requestedView = new URLSearchParams(window.location.search).get('view');
    if (requestedView === 'upcoming' || requestedView === 'past' || requestedView === 'all') {
      setView(requestedView);
    }
  }, []);

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
  const outcomeCount = bookings.filter((booking) => booking.outcome).length;
  const visibleBookings = bookings.filter((booking) => {
    const upcoming = ACTIVE_STATUSES.includes(booking.status) && new Date(booking.starts_at).getTime() > now;
    if (view === 'upcoming') return upcoming;
    if (view === 'past') return !upcoming;
    return true;
  });

  async function updateBooking(bookingId: string, action: 'confirm' | 'cancel' | 'complete') {
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

  async function submitReview(bookingId: string) {
    if (rating < 1) { setActionError(isDa ? 'Vælg en rating.' : 'Choose a rating.'); return; }
    setActionLoading(`${bookingId}:review`);
    setActionError('');
    try {
      const response = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bookingId, rating, feedback }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error);
      setBookings((current) => current.map((booking) => booking.id === bookingId ? { ...booking, reviewed: true } : booking));
      setReviewBookingId(null); setRating(0); setFeedback('');
    } catch (reviewError) {
      setActionError(reviewError instanceof Error ? reviewError.message : (isDa ? 'Vurderingen kunne ikke gemmes.' : 'The review could not be saved.'));
    } finally { setActionLoading(null); }
  }

  function editOutcome(booking: Booking) {
    const priorities = booking.outcome?.priorities ?? [];
    setOutcomeDraft({
      summary: booking.outcome?.summary ?? '',
      priorities: [priorities[0] ?? '', priorities[1] ?? '', priorities[2] ?? ''],
      nextAction: booking.outcome?.next_action ?? '',
      nextActionDueAt: booking.outcome?.next_action_due_at ?? '',
    });
    setOutcomeBookingId(booking.id);
    setActionError('');
  }

  async function saveOutcome(bookingId: string) {
    setActionLoading(`${bookingId}:outcome`);
    setActionError('');
    try {
      const response = await fetch(`/api/bookings/${bookingId}/outcome`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: outcomeDraft.summary,
          priorities: outcomeDraft.priorities,
          nextAction: outcomeDraft.nextAction,
          nextActionDueAt: outcomeDraft.nextActionDueAt,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error);
      setBookings((current) => current.map((booking) => booking.id === bookingId ? { ...booking, outcome: result.outcome } : booking));
      setOutcomeBookingId(null);
      setOutcomeDraft(EMPTY_OUTCOME);
    } catch (outcomeError) {
      setActionError(outcomeError instanceof Error ? outcomeError.message : (isDa ? 'Sessionsresultatet kunne ikke gemmes.' : 'The session outcome could not be saved.'));
    } finally {
      setActionLoading(null);
    }
  }

  async function updateNextAction(booking: Booking) {
    if (!booking.outcome) return;
    const completed = !booking.outcome.candidate_completed_at;
    setActionLoading(`${booking.id}:next-action`);
    setActionError('');
    try {
      const response = await fetch(`/api/bookings/${booking.id}/outcome`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error);
      setBookings((current) => current.map((item) => item.id === booking.id && item.outcome
        ? { ...item, outcome: { ...item.outcome, candidate_completed_at: result.outcome.candidate_completed_at } }
        : item));
    } catch (outcomeError) {
      setActionError(outcomeError instanceof Error ? outcomeError.message : (isDa ? 'Næste skridt kunne ikke opdateres.' : 'The next step could not be updated.'));
    } finally {
      setActionLoading(null);
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
              [isDa ? 'Med handlingsplan' : 'With action plan', outcomeCount.toString()],
            ].map(([label, value]) => (
              <div key={label} className="border-b border-gray-200 px-5 py-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                <p className="text-xs font-black uppercase text-gray-400">{label}</p>
                <p className="mt-2 text-2xl font-black text-gray-950">{value}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-gray-400">{isDa ? 'Betaling er fortsat ikke aktiveret. En handlingsplan bliver synlig, når den professionelle har afsluttet sessionen og gemt resultatet.' : 'Payments are still not enabled. An action plan appears when the professional has completed the session and saved the outcome.'}</p>
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
              <article key={booking.id} className="border-b border-gray-300 px-4 py-5">
                <div className="grid gap-5 lg:grid-cols-[1fr_240px_140px_auto] lg:items-center">
                <div><h2 className="text-lg font-black text-gray-950">{booking.counterpart_name}</h2><p className="mt-1 text-xs text-gray-500">{booking.counterpart_title}</p>{(booking.session_type || booking.focus_area) && <p className="mt-2 text-xs font-bold text-gray-700">{booking.session_type && isSessionTypeId(booking.session_type) ? sessionType(booking.session_type).title[isDa ? 'da' : 'en'] : focusLabel(booking.focus_area || '', isDa ? 'da' : 'en')}</p>}</div>
                <div><p className="text-sm font-black text-gray-950">{formatDateTime(booking.starts_at)}</p><p className="mt-1 text-xs text-gray-400">60 min · Europe/Copenhagen</p></div>
                <div>
                  <p className="text-sm font-black text-gray-950">DKK {(booking.price_dkk ?? 0).toLocaleString('da-DK')}</p>
                  <p className="mt-1 text-xs text-gray-400">{isDa ? 'Inkl. moms · betaling ikke aktiv' : 'Incl. VAT · payment not active'}</p>
                  {booking.viewer_role === 'candidate' && booking.contribution_dkk != null && <p className="mt-1 text-xs font-semibold text-gray-600">{isDa ? `Kræftens Bekæmpelse: DKK ${booking.contribution_dkk.toLocaleString('da-DK')} (${booking.payout_preference === 'donate' ? 80 : CONTRIBUTION_PERCENT}% af nettoprisen)` : `Danish Cancer Society: DKK ${booking.contribution_dkk.toLocaleString('da-DK')} (${booking.payout_preference === 'donate' ? 80 : CONTRIBUTION_PERCENT}% of the net price)`}</p>}
                  {booking.viewer_role === 'professional' && booking.professional_payout_dkk != null && <p className="mt-1 text-xs font-semibold text-gray-600">{booking.payout_preference === 'donate' ? (isDa ? `Din 70%-andel doneres · samlet DKK ${(booking.contribution_dkk ?? 0).toLocaleString('da-DK')}` : `Your 70% share is donated · total DKK ${(booking.contribution_dkk ?? 0).toLocaleString('da-DK')}`) : (isDa ? `Forventet udbetaling: DKK ${booking.professional_payout_dkk.toLocaleString('da-DK')}` : `Expected payout: DKK ${booking.professional_payout_dkk.toLocaleString('da-DK')}`)}</p>}
                </div>
                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                  <StatusBadge status={booking.status} />
                  {booking.viewer_role === 'professional' && ['requested', 'pending'].includes(booking.status) && (
                    <>
                      <button onClick={() => updateBooking(booking.id, 'confirm')} disabled={actionLoading !== null} className="rounded-lg bg-gray-950 px-3 py-2 text-xs font-black text-white disabled:opacity-50">{actionLoading === `${booking.id}:confirm` ? '...' : (isDa ? 'Bekræft' : 'Confirm')}</button>
                      <button onClick={() => updateBooking(booking.id, 'cancel')} onBlur={() => confirmCancelId === booking.id && setConfirmCancelId(null)} disabled={actionLoading !== null} className={`rounded-lg px-3 py-2 text-xs font-black disabled:opacity-50 ${confirmCancelId === booking.id ? 'bg-red-600 text-white' : 'border border-gray-300 text-gray-700'}`}>{confirmCancelId === booking.id ? (isDa ? 'Bekræft afvisning' : 'Confirm decline') : (isDa ? 'Afvis' : 'Decline')}</button>
                    </>
                  )}
                  {booking.viewer_role === 'professional' && ['confirmed', 'rescheduled'].includes(booking.status) && new Date(booking.ends_at).getTime() <= now && <button onClick={() => updateBooking(booking.id, 'complete')} disabled={actionLoading !== null} className="rounded-[4px] bg-gray-950 px-3 py-2 text-xs font-black text-white disabled:opacity-50">{isDa ? 'Markér gennemført' : 'Mark completed'}</button>}
                  {booking.viewer_role === 'professional' && booking.status === 'completed' && <button onClick={() => editOutcome(booking)} disabled={actionLoading !== null} className="rounded-[4px] border border-gray-300 px-3 py-2 text-xs font-black text-gray-700 disabled:opacity-50">{booking.outcome ? (isDa ? 'Rediger handlingsplan' : 'Edit action plan') : (isDa ? 'Tilføj handlingsplan' : 'Add action plan')}</button>}
                  {booking.viewer_role === 'candidate' && booking.status === 'completed' && !booking.reviewed && <button onClick={() => setReviewBookingId(reviewBookingId === booking.id ? null : booking.id)} className="rounded-[4px] border border-gray-300 px-3 py-2 text-xs font-black text-gray-700">{isDa ? 'Vurdér session' : 'Review session'}</button>}
                  {booking.viewer_role === 'candidate' && ACTIVE_STATUSES.includes(booking.status) && (
                    <button onClick={() => updateBooking(booking.id, 'cancel')} onBlur={() => confirmCancelId === booking.id && setConfirmCancelId(null)} disabled={actionLoading !== null} className={`rounded-lg px-3 py-2 text-xs font-black disabled:opacity-50 ${confirmCancelId === booking.id ? 'bg-red-600 text-white' : 'border border-gray-300 text-gray-700'}`}>{actionLoading === `${booking.id}:cancel` ? '...' : confirmCancelId === booking.id ? (isDa ? 'Bekræft aflysning' : 'Confirm cancellation') : (isDa ? 'Aflys' : 'Cancel')}</button>
                  )}
                </div>
                </div>
                {(booking.goal || booking.material_url || (booking.status === 'confirmed' && booking.meeting_url)) && (
                  <div className="mt-5 grid gap-4 border-t border-gray-200 pt-4 sm:grid-cols-[1fr_auto] sm:items-start">
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-400">{isDa ? 'Forberedelse' : 'Preparation'}</p>
                      {booking.goal && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">{booking.goal}</p>}
                      <div className="mt-3 flex flex-wrap gap-4 text-xs font-bold">
                        {booking.material_url && <a href={booking.material_url} target="_blank" rel="noreferrer" className="text-gray-950 underline decoration-gray-300 underline-offset-4">{isDa ? 'Åbn delt materiale' : 'Open shared material'}</a>}
                        {booking.status === 'confirmed' && booking.meeting_url && <a href={booking.meeting_url} target="_blank" rel="noreferrer" className="text-gray-950 underline decoration-gray-300 underline-offset-4">{isDa ? 'Åbn videolink' : 'Open video link'}</a>}
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-gray-400 sm:max-w-56 sm:text-right">{booking.payment_status === 'paid' ? (isDa ? 'Betalt' : 'Paid') : (isDa ? 'Betaling ikke gennemført' : 'Payment not completed')} · {isDa ? 'Aflys senest 24 timer før for fuld refundering, når betaling aktiveres.' : 'Cancel at least 24 hours before for a full refund when payments launch.'}</p>
                  </div>
                )}
                {booking.outcome && outcomeBookingId !== booking.id && (
                  <section className="mt-5 border-t border-gray-200 pt-5" aria-labelledby={`outcome-${booking.id}`}>
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="max-w-3xl">
                        <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-gray-400"><ListChecks size={14} aria-hidden="true" /> {isDa ? 'Din handlingsplan' : 'Your action plan'}</p>
                        <h3 id={`outcome-${booking.id}`} className="mt-3 text-lg font-black text-gray-950">{isDa ? 'Det vigtigste fra sessionen' : 'The essentials from the session'}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-gray-600">{booking.outcome.summary}</p>
                        <ol className="mt-4 grid gap-2 sm:grid-cols-3">
                          {booking.outcome.priorities.map((priority, index) => (
                            <li key={`${booking.outcome?.id}-${index}`} className="border-l-2 border-gray-950 pl-3 text-sm leading-relaxed text-gray-700">
                              <span className="mb-1 block text-[10px] font-black uppercase text-gray-400">{isDa ? `Prioritet ${index + 1}` : `Priority ${index + 1}`}</span>
                              {priority}
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div className={`min-w-56 border px-4 py-4 ${booking.outcome.candidate_completed_at ? 'border-emerald-200 bg-emerald-50' : 'border-gray-300 bg-[#f7f7f4]'}`}>
                        <p className="text-[10px] font-black uppercase text-gray-400">{isDa ? 'Næste handling' : 'Next action'}</p>
                        <p className="mt-2 text-sm font-black leading-snug text-gray-950">{booking.outcome.next_action}</p>
                        {booking.outcome.next_action_due_at && <p className="mt-2 text-xs text-gray-500">{isDa ? 'Senest' : 'Due'} {new Date(`${booking.outcome.next_action_due_at}T12:00:00`).toLocaleDateString(isDa ? 'da-DK' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>}
                        {booking.viewer_role === 'candidate' && (
                          <button type="button" onClick={() => void updateNextAction(booking)} disabled={actionLoading !== null} className={`mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-[4px] px-3 py-2 text-xs font-black disabled:opacity-50 ${booking.outcome.candidate_completed_at ? 'border border-emerald-300 bg-white text-emerald-800' : 'bg-gray-950 text-white'}`}>
                            {booking.outcome.candidate_completed_at && <Check size={14} aria-hidden="true" />}
                            {actionLoading === `${booking.id}:next-action` ? '...' : booking.outcome.candidate_completed_at ? (isDa ? 'Markeret som udført' : 'Marked as done') : (isDa ? 'Markér som udført' : 'Mark as done')}
                          </button>
                        )}
                      </div>
                    </div>
                  </section>
                )}
                {outcomeBookingId === booking.id && (
                  <section className="mt-5 border-t border-gray-200 pt-5" aria-labelledby={`outcome-form-${booking.id}`}>
                    <div className="max-w-3xl">
                      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-gray-400">{isDa ? 'Struktureret sessionsresultat' : 'Structured session outcome'}</p>
                      <h3 id={`outcome-form-${booking.id}`} className="mt-2 text-lg font-black text-gray-950">{isDa ? 'Giv kandidaten en konkret plan' : 'Give the candidate a concrete plan'}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-500">{isDa ? 'Opsummér din vurdering, prioritér højst tre forbedringer og aftal én næste handling.' : 'Summarise your assessment, prioritise up to three improvements and agree on one next action.'}</p>
                      <label className="mt-5 block text-xs font-black text-gray-700">
                        {isDa ? 'Kort opsummering' : 'Short summary'}
                        <textarea value={outcomeDraft.summary} onChange={(event) => setOutcomeDraft((current) => ({ ...current, summary: event.target.value.slice(0, 1000) }))} rows={3} className="field-control mt-2 resize-none text-sm" placeholder={isDa ? 'Hvad blev tydeligere, og hvor står kandidaten nu?' : 'What became clearer, and where does the candidate stand now?'} />
                      </label>
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        {outcomeDraft.priorities.map((priority, index) => (
                          <label key={index} className="block text-xs font-black text-gray-700">
                            {isDa ? `Prioritet ${index + 1}${index > 0 ? ' (valgfri)' : ''}` : `Priority ${index + 1}${index > 0 ? ' (optional)' : ''}`}
                            <textarea value={priority} onChange={(event) => setOutcomeDraft((current) => {
                              const priorities: OutcomeDraft['priorities'] = [...current.priorities];
                              priorities[index] = event.target.value.slice(0, 240);
                              return { ...current, priorities };
                            })} rows={3} className="field-control mt-2 resize-none text-sm" />
                          </label>
                        ))}
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_180px]">
                        <label className="block text-xs font-black text-gray-700">
                          {isDa ? 'Næste handling' : 'Next action'}
                          <input value={outcomeDraft.nextAction} onChange={(event) => setOutcomeDraft((current) => ({ ...current, nextAction: event.target.value.slice(0, 300) }))} className="field-control mt-2 text-sm" placeholder={isDa ? 'Fx omskriv profilteksten og send den fredag' : 'E.g. rewrite the profile text and send it Friday'} />
                        </label>
                        <label className="block text-xs font-black text-gray-700">
                          {isDa ? 'Deadline (valgfri)' : 'Deadline (optional)'}
                          <input type="date" value={outcomeDraft.nextActionDueAt} onChange={(event) => setOutcomeDraft((current) => ({ ...current, nextActionDueAt: event.target.value }))} className="field-control mt-2 text-sm" />
                        </label>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button type="button" onClick={() => void saveOutcome(booking.id)} disabled={actionLoading !== null} className="button-primary min-h-10 py-2">{actionLoading === `${booking.id}:outcome` ? (isDa ? 'Gemmer...' : 'Saving...') : (isDa ? 'Gem handlingsplan' : 'Save action plan')}</button>
                        <button type="button" onClick={() => setOutcomeBookingId(null)} disabled={actionLoading !== null} className="button-secondary min-h-10 py-2">{isDa ? 'Annuller' : 'Cancel'}</button>
                      </div>
                    </div>
                  </section>
                )}
                {reviewBookingId === booking.id && (
                  <div className="mt-5 border-t border-gray-200 pt-5">
                    <p className="text-sm font-black text-gray-950">{isDa ? 'Hvordan var sessionen?' : 'How was the session?'}</p>
                    <div className="mt-3 flex gap-1" role="radiogroup" aria-label={isDa ? 'Rating' : 'Rating'}>{[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" role="radio" aria-checked={rating === value} onClick={() => setRating(value)} className={`flex h-10 w-10 items-center justify-center rounded-[4px] border ${rating >= value ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-300 bg-white text-gray-400'}`} aria-label={`${value} ${isDa ? 'ud af 5' : 'out of 5'}`}><Star size={16} fill={rating >= value ? 'currentColor' : 'none'} aria-hidden="true" /></button>)}</div>
                    <textarea value={feedback} onChange={(event) => setFeedback(event.target.value.slice(0, 1000))} rows={3} className="field-control mt-3 resize-none text-sm" placeholder={isDa ? 'Valgfrit: Hvad fungerede godt, og hvad kunne være bedre?' : 'Optional: What worked well, and what could be better?'} />
                    <div className="mt-3 flex gap-2"><button type="button" onClick={() => void submitReview(booking.id)} disabled={actionLoading !== null} className="button-primary min-h-10 py-2">{isDa ? 'Send vurdering' : 'Submit review'}</button><button type="button" onClick={() => setReviewBookingId(null)} className="button-secondary min-h-10 py-2">{isDa ? 'Annuller' : 'Cancel'}</button></div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
