'use client';

import { ArrowRight, CalendarDays, FileText, Star } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MemberNav } from '@/components/MemberNav';
import { StatusBadge } from '@/components/StatusBadge';
import { useLanguage } from '@/context/LanguageContext';
import { CONTRIBUTION_PERCENT, focusLabel } from '@/lib/platform';
import type { GoalAchievement } from '@/lib/sessionFeedback';
import { isSessionTypeId, sessionType } from '@/lib/sessionTypes';

interface SessionOutcome {
  id: string;
  booking_id: string;
  result_status: 'draft' | 'published';
  published_at: string | null;
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
  session_plan: {
    problem: string | null;
    desired_outcome: string | null;
    definition_of_done: string | null;
    preparation_status: 'draft' | 'ready';
    prepared_at: string | null;
    updated_at: string;
  } | null;
  outcome: SessionOutcome | null;
}

type View = 'upcoming' | 'past' | 'all';
type FeedbackScoreKey = 'professionalRelevance' | 'professionalPreparedness' | 'greaterClarity' | 'concreteNextSteps' | 'overallExperience';
type FeedbackScores = Record<FeedbackScoreKey, number>;

const ACTIVE_STATUSES = ['requested', 'pending', 'confirmed', 'rescheduled'];
const EMPTY_FEEDBACK_SCORES: FeedbackScores = {
  professionalRelevance: 0,
  professionalPreparedness: 0,
  greaterClarity: 0,
  concreteNextSteps: 0,
  overallExperience: 0,
};

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
  const [reviewSuccessBookingId, setReviewSuccessBookingId] = useState<string | null>(null);
  const [goalAchieved, setGoalAchieved] = useState<GoalAchievement | ''>('');
  const [feedbackScores, setFeedbackScores] = useState<FeedbackScores>(EMPTY_FEEDBACK_SCORES);
  const [feedbackComment, setFeedbackComment] = useState('');

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
  const hasCompletedCandidateSession = bookings.some((booking) => (
    booking.viewer_role === 'candidate' && booking.status === 'completed'
  ));
  const visibleBookings = bookings.filter((booking) => {
    const upcoming = ACTIVE_STATUSES.includes(booking.status) && new Date(booking.starts_at).getTime() > now;
    if (view === 'upcoming') return upcoming;
    if (view === 'past') return !upcoming;
    return true;
  }).sort((first, second) => {
    const firstUpcoming = ACTIVE_STATUSES.includes(first.status) && new Date(first.starts_at).getTime() > now;
    const secondUpcoming = ACTIVE_STATUSES.includes(second.status) && new Date(second.starts_at).getTime() > now;
    if (firstUpcoming !== secondUpcoming) return firstUpcoming ? -1 : 1;
    return firstUpcoming
      ? new Date(first.starts_at).getTime() - new Date(second.starts_at).getTime()
      : new Date(second.starts_at).getTime() - new Date(first.starts_at).getTime();
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
    if (!goalAchieved) {
      setActionError(isDa ? 'Vælg, om sessionens mål blev opnået.' : 'Choose whether the session goal was achieved.');
      return;
    }
    if (Object.values(feedbackScores).some((score) => score < 1 || score > 5)) {
      setActionError(isDa ? 'Besvar alle fem spørgsmål på skalaen fra 1 til 5.' : 'Answer all five questions on the scale from 1 to 5.');
      return;
    }
    setActionLoading(`${bookingId}:review`);
    setActionError('');
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          goalAchieved,
          ...feedbackScores,
          comment: feedbackComment || null,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error);
      setBookings((current) => current.map((booking) => booking.id === bookingId ? { ...booking, reviewed: true } : booking));
      setReviewBookingId(null);
      setReviewSuccessBookingId(bookingId);
      setGoalAchieved('');
      setFeedbackScores(EMPTY_FEEDBACK_SCORES);
      setFeedbackComment('');
    } catch (reviewError) {
      setActionError(reviewError instanceof Error ? reviewError.message : (isDa ? 'Vurderingen kunne ikke gemmes.' : 'The review could not be saved.'));
    } finally { setActionLoading(null); }
  }

  function toggleReview(bookingId: string) {
    setActionError('');
    setReviewSuccessBookingId(null);
    setGoalAchieved('');
    setFeedbackScores(EMPTY_FEEDBACK_SCORES);
    setFeedbackComment('');
    setReviewBookingId((current) => current === bookingId ? null : bookingId);
  }

  const feedbackQuestions: Array<{ key: FeedbackScoreKey; da: string; en: string }> = [
    { key: 'professionalRelevance', da: 'Hvor relevant var den professionelles erfaring?', en: 'How relevant was the professional’s experience?' },
    { key: 'professionalPreparedness', da: 'Hvor velforberedt var den professionelle?', en: 'How well prepared was the professional?' },
    { key: 'greaterClarity', da: 'Hvor meget større klarhed fik du?', en: 'How much greater clarity did you gain?' },
    { key: 'concreteNextSteps', da: 'Hvor konkrete blev dine næste skridt?', en: 'How concrete did your next steps become?' },
    { key: 'overallExperience', da: 'Hvordan var den samlede oplevelse?', en: 'How was the overall experience?' },
  ];

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
          {!loading && accountRole !== 'professional' && (
            <Link
              href={hasCompletedCandidateSession ? '/dashboard' : '/professionals'}
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-gray-950 px-5 py-3 text-sm font-black text-white hover:bg-gray-800"
            >
              {hasCompletedCandidateSession
                ? (isDa ? 'Fortsæt med dit næste træk' : 'Continue with your next move')
                : (isDa ? 'Find relevant erfaring' : 'Find relevant experience')}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}
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
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-500">
              {hasCompletedCandidateSession
                ? (isDa ? 'Brug først resultatet fra din seneste Session Plan og gennemfør dit vigtigste næste træk.' : 'Use the result from your latest Session Plan and complete your most important next move first.')
                : (isDa ? 'Find en professionel og book 60 minutter med fokus på dit næste karriereskridt.' : 'Find a professional and book 60 minutes focused on your next career move.')}
            </p>
            <Link
              href={hasCompletedCandidateSession ? '/dashboard' : '/professionals'}
              className="mt-6 inline-flex rounded-lg bg-gray-950 px-5 py-3 text-sm font-black text-white"
            >
              {hasCompletedCandidateSession
                ? (isDa ? 'Se dit næste træk' : 'View your next move')
                : (isDa ? 'Se profiler' : 'Browse profiles')}
            </Link>
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
                  {booking.viewer_role === 'candidate' && booking.status === 'completed' && !booking.reviewed && (
                    <button
                      type="button"
                      onClick={() => toggleReview(booking.id)}
                      aria-expanded={reviewBookingId === booking.id}
                      aria-controls={`session-feedback-${booking.id}`}
                      className="rounded-[4px] border border-gray-300 px-3 py-2 text-xs font-black text-gray-700"
                    >
                      {isDa ? 'Vurdér session' : 'Review session'}
                    </button>
                  )}
                  {booking.viewer_role === 'candidate' && ACTIVE_STATUSES.includes(booking.status) && (
                    <button onClick={() => updateBooking(booking.id, 'cancel')} onBlur={() => confirmCancelId === booking.id && setConfirmCancelId(null)} disabled={actionLoading !== null} className={`rounded-lg px-3 py-2 text-xs font-black disabled:opacity-50 ${confirmCancelId === booking.id ? 'bg-red-600 text-white' : 'border border-gray-300 text-gray-700'}`}>{actionLoading === `${booking.id}:cancel` ? '...' : confirmCancelId === booking.id ? (isDa ? 'Bekræft aflysning' : 'Confirm cancellation') : (isDa ? 'Aflys' : 'Cancel')}</button>
                  )}
                  <Link href={`/profil/bookings/${booking.id}`} className="rounded-[4px] border border-gray-300 px-3 py-2 text-xs font-black text-gray-700 transition-colors hover:border-gray-950 hover:text-gray-950">
                    {booking.viewer_role === 'candidate' && ACTIVE_STATUSES.includes(booking.status)
                      ? (isDa ? 'Forbered Session Plan' : 'Prepare Session Plan')
                      : (isDa ? 'Åbn Session Plan' : 'Open Session Plan')}
                  </Link>
                </div>
                </div>
                {booking.viewer_role === 'professional' && (
                  <section className="mt-5 border-t border-gray-200 pt-5" aria-label={isDa ? 'Kandidatens Session Plan-brief' : 'Candidate Session Plan brief'}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-400">{isDa ? 'Kandidatens brief' : 'Candidate brief'}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          {booking.session_plan?.preparation_status === 'ready'
                            ? (isDa ? 'Markeret klar til sessionen' : 'Marked ready for the session')
                            : (isDa ? 'Forberedelsen er stadig i gang' : 'Preparation is still in progress')}
                        </p>
                      </div>
                      <Link href={`/profil/bookings/${booking.id}`} className="inline-flex min-h-10 items-center text-xs font-black text-gray-950 underline decoration-gray-300 underline-offset-4">
                        {isDa ? 'Gennemgå hele planen' : 'Review full plan'} <ArrowRight size={13} className="ml-1" aria-hidden="true" />
                      </Link>
                    </div>
                    <div className="mt-4 grid gap-px overflow-hidden rounded-[4px] bg-gray-200 md:grid-cols-3">
                      {[
                        [
                          isDa ? 'Problem' : 'Problem',
                          booking.session_plan?.problem,
                          isDa ? 'Kandidaten har ikke beskrevet problemet endnu.' : 'The candidate has not described the problem yet.',
                        ],
                        [
                          isDa ? 'Ønsket resultat' : 'Desired outcome',
                          booking.session_plan?.desired_outcome || booking.goal,
                          isDa ? 'Det ønskede resultat er ikke beskrevet endnu.' : 'The desired outcome has not been described yet.',
                        ],
                        [
                          'Definition of Done',
                          booking.session_plan?.definition_of_done,
                          isDa ? 'Succeskriteriet er ikke defineret endnu.' : 'The success criterion has not been defined yet.',
                        ],
                      ].map(([label, value, fallback]) => (
                        <div key={label} className="bg-[#f7f7f4] px-4 py-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.08em] text-gray-400">{label}</p>
                          <p className={`mt-2 text-sm leading-relaxed ${value ? 'font-semibold text-gray-800' : 'text-gray-400'}`}>{value || fallback}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
                {((booking.viewer_role === 'candidate' && booking.goal) || booking.material_url || (booking.status === 'confirmed' && booking.meeting_url)) && (
                  <div className="mt-5 grid gap-4 border-t border-gray-200 pt-4 sm:grid-cols-[1fr_auto] sm:items-start">
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-400">{isDa ? 'Forberedelse' : 'Preparation'}</p>
                      {booking.viewer_role === 'candidate' && booking.goal && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">{booking.goal}</p>}
                      <div className="mt-3 flex flex-wrap gap-4 text-xs font-bold">
                        {booking.material_url && <a href={booking.material_url} target="_blank" rel="noreferrer" className="text-gray-950 underline decoration-gray-300 underline-offset-4">{isDa ? 'Åbn delt materiale' : 'Open shared material'}</a>}
                        {booking.status === 'confirmed' && booking.meeting_url && <a href={booking.meeting_url} target="_blank" rel="noreferrer" className="text-gray-950 underline decoration-gray-300 underline-offset-4">{isDa ? 'Åbn videolink' : 'Open video link'}</a>}
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-gray-400 sm:max-w-56 sm:text-right">{booking.payment_status === 'paid' ? (isDa ? 'Betalt' : 'Paid') : (isDa ? 'Betaling ikke gennemført' : 'Payment not completed')} · {isDa ? 'Aflys senest 24 timer før for fuld refundering, når betaling aktiveres.' : 'Cancel at least 24 hours before for a full refund when payments launch.'}</p>
                  </div>
                )}
                <section className="mt-5 flex flex-col gap-4 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between" aria-label={isDa ? 'Session Plan-status' : 'Session Plan status'}>
                  <div className="flex items-start gap-3">
                    <FileText size={18} className="mt-0.5 shrink-0 text-gray-400" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-black text-gray-950">Naetwork Session Plan</p>
                      <p className="mt-1 text-xs leading-relaxed text-gray-500">
                        {booking.outcome?.result_status === 'published'
                          ? (isDa ? 'Resultatet og dine næste træk er klar.' : 'The result and your next moves are ready.')
                          : booking.status === 'completed'
                            ? (booking.viewer_role === 'professional'
                                ? (isDa ? 'Færdiggør og publicér kandidatens resultat.' : 'Complete and publish the candidate result.')
                                : (isDa ? 'Den professionelle færdiggør resultatet.' : 'The professional is completing the result.'))
                            : booking.session_plan?.preparation_status === 'ready'
                              ? (isDa ? 'Forberedelsen er markeret som klar.' : 'The preparation is marked as ready.')
                              : (isDa ? 'Forbered problemet, succeskriteriet og dine vigtigste spørgsmål.' : 'Prepare the problem, success criteria and key questions.')}
                      </p>
                    </div>
                  </div>
                  <Link href={`/profil/bookings/${booking.id}`} className="button-secondary min-h-10 shrink-0 py-2">
                    {isDa ? 'Åbn planen' : 'Open the plan'} <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </section>
                {reviewSuccessBookingId === booking.id && (
                  <p role="status" className="mt-5 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
                    {isDa ? 'Tak. Din feedback er gemt og hjælper Naetwork med at følge den reelle sessionskvalitet.' : 'Thank you. Your feedback is saved and helps Naetwork monitor real session quality.'}
                  </p>
                )}
                {reviewBookingId === booking.id && (
                  <form
                    id={`session-feedback-${booking.id}`}
                    className="mt-5 border-t border-gray-200 pt-5"
                    onSubmit={(event) => {
                      event.preventDefault();
                      void submitReview(booking.id);
                    }}
                  >
                    <div className="max-w-2xl">
                      <p className="text-sm font-black text-gray-950">{isDa ? 'Hjalp sessionen dig videre?' : 'Did the session help you move forward?'}</p>
                      <p className="mt-1 text-xs leading-relaxed text-gray-500">
                        {isDa ? 'Seks korte svar giver et mere retvisende kvalitetsbillede end én samlet stjernebedømmelse.' : 'Six short answers give a more accurate quality picture than a single star rating.'}
                      </p>
                    </div>

                    <fieldset className="mt-5">
                      <legend className="text-xs font-black text-gray-800">{isDa ? 'Blev sessionens mål opnået?' : 'Was the session goal achieved?'}</legend>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {([
                          ['achieved', isDa ? 'Ja' : 'Yes'],
                          ['partially_achieved', isDa ? 'Delvist' : 'Partly'],
                          ['not_achieved', isDa ? 'Ikke endnu' : 'Not yet'],
                        ] as Array<[GoalAchievement, string]>).map(([value, label]) => (
                          <label key={value} className={`inline-flex min-h-11 cursor-pointer items-center rounded-[4px] border px-4 text-xs font-black transition-colors ${goalAchieved === value ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-300 bg-white text-gray-700 hover:border-gray-950'}`}>
                            <input
                              type="radio"
                              name={`goal-achieved-${booking.id}`}
                              value={value}
                              checked={goalAchieved === value}
                              onChange={() => setGoalAchieved(value)}
                              aria-label={`${isDa ? 'Blev sessionens mål opnået?' : 'Was the session goal achieved?'} ${label}`}
                              className="sr-only"
                            />
                            {label}
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <div className="mt-6 grid gap-5 md:grid-cols-2">
                      {feedbackQuestions.map((question) => (
                        <fieldset key={question.key}>
                          <legend className="min-h-10 text-xs font-black leading-relaxed text-gray-800">{isDa ? question.da : question.en}</legend>
                          <div className="mt-2 flex gap-1" role="radiogroup">
                            {[1, 2, 3, 4, 5].map((value) => (
                              <label
                                key={value}
                                className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-[4px] border transition-colors ${feedbackScores[question.key] === value ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-300 bg-white text-gray-500 hover:border-gray-950 hover:text-gray-950'}`}
                                aria-label={`${value} ${isDa ? 'ud af 5' : 'out of 5'}`}
                              >
                                <input
                                  type="radio"
                                  name={`${question.key}-${booking.id}`}
                                  value={value}
                                  checked={feedbackScores[question.key] === value}
                                  onChange={() => setFeedbackScores((current) => ({ ...current, [question.key]: value }))}
                                  aria-label={`${isDa ? question.da : question.en} ${value} ${isDa ? 'ud af 5' : 'out of 5'}`}
                                  className="sr-only"
                                />
                                {question.key === 'overallExperience'
                                  ? <Star size={15} fill={feedbackScores[question.key] >= value ? 'currentColor' : 'none'} aria-hidden="true" />
                                  : <span className="text-xs font-black">{value}</span>}
                              </label>
                            ))}
                          </div>
                          <p className="mt-1 text-[10px] text-gray-400">{isDa ? '1 = lav · 5 = høj' : '1 = low · 5 = high'}</p>
                        </fieldset>
                      ))}
                    </div>

                    <label className="mt-6 block text-xs font-black text-gray-800" htmlFor={`feedback-comment-${booking.id}`}>
                      {isDa ? 'Valgfri kommentar' : 'Optional comment'}
                    </label>
                    <textarea
                      id={`feedback-comment-${booking.id}`}
                      value={feedbackComment}
                      onChange={(event) => setFeedbackComment(event.target.value.slice(0, 1000))}
                      rows={3}
                      maxLength={1000}
                      className="field-control mt-2 resize-none text-sm"
                      placeholder={isDa ? 'Hvad fungerede godt, og hvad kunne være bedre?' : 'What worked well, and what could be better?'}
                    />
                    <p className="mt-1 text-right text-[10px] text-gray-400">{feedbackComment.length}/1000</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button type="submit" disabled={actionLoading !== null} className="button-primary min-h-11 py-2 disabled:opacity-50">
                        {actionLoading === `${booking.id}:review`
                          ? (isDa ? 'Gemmer…' : 'Saving…')
                          : (isDa ? 'Send vurdering' : 'Submit review')}
                      </button>
                      <button type="button" onClick={() => toggleReview(booking.id)} disabled={actionLoading !== null} className="button-secondary min-h-11 py-2 disabled:opacity-50">
                        {isDa ? 'Annuller' : 'Cancel'}
                      </button>
                    </div>
                  </form>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
