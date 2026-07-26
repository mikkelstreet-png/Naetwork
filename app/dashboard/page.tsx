'use client';

import type { User } from '@supabase/supabase-js';
import { ArrowRight, CalendarClock, Check, CheckCircle2, Clock3, FileCheck2, Inbox } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CareerWorkspace } from '@/components/CareerWorkspace';
import { MemberNav } from '@/components/MemberNav';
import { StatusBadge } from '@/components/StatusBadge';
import { professionalProfileMissing } from '@/lib/professionalProfile';
import { createClient } from '@/lib/supabase';

interface Profile {
  id: string;
  name: string | null;
  role: string;
}

interface ProfessionalProfile {
  id: string;
  title: string | null;
  company: string | null;
  bio: string | null;
  experience_summary: string | null;
  relevant_situations: string[] | null;
  expected_outcomes: string[] | null;
  focus_areas: string[] | null;
  industries: string[] | null;
  languages: string[] | null;
  years_experience: number | null;
  price_dkk: number | null;
  linkedin_url: string | null;
  visibility: string;
  review_status: string;
}

interface Booking {
  id: string;
  starts_at: string;
  status: string;
  price_dkk: number | null;
  counterpart_name: string;
  counterpart_title: string;
  outcome: { id: string } | null;
}

interface ProfessionalActionBooking {
  bookingId: string;
  candidateName: string;
  startsAt: string;
  endsAt: string;
}

interface ProfessionalWorkspace {
  professional: ProfessionalProfile | null;
  requests: ProfessionalActionBooking[];
  upcomingSessions: Array<ProfessionalActionBooking & {
    preparationStatus: 'ready' | 'incomplete';
  }>;
  missingResults: ProfessionalActionBooking[];
  availability: {
    openCount: number;
    nextAvailableAt: string | null;
  };
  quality: {
    completedSessionCount: number;
    publishedReviewCount: number;
    averageRating: number | null;
  };
}

const ACTIVE_STATUSES = ['requested', 'pending', 'confirmed', 'rescheduled'];

function formatActionDate(value: string) {
  return new Date(value).toLocaleString('da-DK', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Europe/Copenhagen',
  });
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [professional, setProfessional] = useState<ProfessionalProfile | null>(null);
  const [professionalWorkspace, setProfessionalWorkspace] = useState<ProfessionalWorkspace | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      const supabase = createClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        router.replace('/login?next=/dashboard');
        return;
      }

      setUser(currentUser);
      const { data: currentProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, role')
        .eq('auth_user_id', currentUser.id)
        .single();

      if (!active) return;
      if (profileError || !currentProfile) {
        setLoadError('Din profil kunne ikke indlæses. Prøv igen senere.');
        setLoading(false);
        return;
      }

      setProfile(currentProfile as Profile);

      const [bookingResponse, workspaceResponse] = await Promise.all([
        fetch('/api/bookings').then(async (response) => ({ response, body: await response.json().catch(() => ({})) })),
        currentProfile.role === 'professional'
          ? fetch('/api/workspace').then(async (response) => ({ response, body: await response.json().catch(() => ({})) }))
          : Promise.resolve(null),
      ]);

      if (!active) return;
      if (bookingResponse.response.ok) {
        setBookings((bookingResponse.body.bookings ?? []) as Booking[]);
      } else {
        setLoadError(bookingResponse.body.error || 'Bookingerne kunne ikke indlæses.');
      }
      if (workspaceResponse) {
        if (workspaceResponse.response.ok) {
          const workspace = (workspaceResponse.body.professionalWorkspace ?? null) as ProfessionalWorkspace | null;
          setProfessionalWorkspace(workspace);
          setProfessional(workspace?.professional ?? null);
        } else {
          setLoadError(workspaceResponse.body.error || 'Dine professionelle handlinger kunne ikke indlæses.');
        }
      }
      setLoading(false);
    }

    load().catch(() => {
      if (active) {
        setLoadError('Overblikket kunne ikke indlæses. Prøv igen senere.');
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, [router]);

  if (loading) {
    return <main className="min-h-[calc(100vh-4rem)] bg-[#f7f7f4] px-5 py-16 text-center text-sm text-gray-400">Indlæser dit overblik...</main>;
  }

  const isProfessional = profile?.role === 'professional';
  const displayName = (profile?.name || user?.email || 'der').split(' ')[0];
  const bookingUpcoming = bookings.filter((booking) => ACTIVE_STATUSES.includes(booking.status) && new Date(booking.starts_at).getTime() > Date.now()).length;
  const upcoming = isProfessional
    ? professionalWorkspace?.upcomingSessions.length ?? bookingUpcoming
    : bookingUpcoming;
  const pendingRequests = isProfessional
    ? professionalWorkspace?.requests.length ?? bookings.filter((booking) => ['requested', 'pending'].includes(booking.status)).length
    : bookings.filter((booking) => ['requested', 'pending'].includes(booking.status)).length;
  const outcomeCount = bookings.filter((booking) => booking.outcome).length;
  const missingResultCount = professionalWorkspace?.missingResults.length ?? 0;
  const profileMissing = new Set(professional ? professionalProfileMissing(professional) : [
    'titel',
    'virksomhed',
    'kort bio',
    'erfaringsgrundlag',
    'mindst én relevant situation',
    'mindst ét forventet udbytte',
    'fagområde',
    'gyldig sessionstype',
    'gyldigt sessionssprog',
    'år med erfaring',
    'gyldig pris',
    'gyldigt LinkedIn-link',
  ]);
  const proChecklist = [
    { label: 'Grundoplysninger', done: !['titel', 'virksomhed', 'kort bio'].some((field) => profileMissing.has(field)) },
    { label: 'Direkte erfaringsgrundlag', done: !profileMissing.has('erfaringsgrundlag') },
    { label: 'Situationer og realistisk udbytte', done: !profileMissing.has('mindst én relevant situation') && !profileMissing.has('mindst ét forventet udbytte') },
    { label: 'Fagområde, session og sprog', done: !['fagområde', 'gyldig sessionstype', 'gyldigt sessionssprog'].some((field) => profileMissing.has(field)) },
    { label: 'Erfaring, pris og LinkedIn', done: !['år med erfaring', 'gyldig pris', 'gyldigt LinkedIn-link'].some((field) => profileMissing.has(field)) },
    { label: 'Profil offentlig', done: professional?.visibility === 'published' && professional?.review_status === 'approved' },
  ];
  const proCompletion = proChecklist.filter((item) => item.done).length;

  return (
    <main className="min-h-screen bg-[#f7f7f4]">
      <section className="border-b border-gray-200 bg-white px-5 py-10 sm:px-8 md:py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase text-gray-400">Dit Naetwork</p>
            <h1 className="mt-3 text-4xl font-black leading-none text-gray-950 md:text-6xl">Hej, {displayName}.</h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-600 md:text-base">
              {isProfessional ? 'Administrer din profil og svar på sessionanmodninger.' : 'Start med situationen foran dig, og hold styr på dine sessioner.'}
            </p>
          </div>
          <Link href={isProfessional ? '/profil/professionel' : '/start'} className="inline-flex w-fit items-center gap-2 rounded-lg bg-gray-950 px-5 py-3 text-sm font-black text-white hover:bg-gray-800">
            {isProfessional ? 'Rediger profil' : 'Start med din situation'} <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <MemberNav isProfessional={isProfessional} />

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 md:py-14">
        {loadError && <p role="alert" className="mb-8 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{loadError}</p>}

        {!isProfessional && <CareerWorkspace />}

        {isProfessional && professionalWorkspace && (
          <section className="mb-12" aria-labelledby="professional-actions-title">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase text-gray-400">Prioriteret overblik</p>
                <h2 id="professional-actions-title" className="mt-2 text-2xl font-black text-gray-950">Det vigtigste at gøre nu.</h2>
              </div>
              <Link href="/profil/bookings?view=upcoming" className="text-sm font-black text-gray-950 underline decoration-gray-300 underline-offset-4">Se alle sessioner</Link>
            </div>

            <ol className="border-t border-gray-300 bg-white">
              <li className="grid gap-4 border-b border-gray-300 px-5 py-5 sm:grid-cols-[44px_1fr_auto] sm:items-center">
                <span className={`flex h-11 w-11 items-center justify-center rounded-full ${professionalWorkspace.requests.length > 0 ? 'bg-gray-950 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  <Inbox size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-black text-gray-950">
                    {professionalWorkspace.requests.length > 0
                      ? `${professionalWorkspace.requests.length} ${professionalWorkspace.requests.length === 1 ? 'bookinganmodning kræver' : 'bookinganmodninger kræver'} svar`
                      : 'Ingen bookinganmodninger afventer svar'}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    {professionalWorkspace.requests.length > 0
                      ? professionalWorkspace.requests.slice(0, 2).map((request) => `${request.candidateName} · ${formatActionDate(request.startsAt)}`).join('  ·  ')
                      : 'Nye anmodninger bliver placeret øverst, så kandidaten hurtigt får besked.'}
                  </p>
                </div>
                {professionalWorkspace.requests.length > 0 && (
                  <Link href="/profil/bookings?view=upcoming" className="inline-flex min-h-10 items-center gap-2 text-sm font-black text-gray-950">
                    Svar nu <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                )}
              </li>

              <li className="grid gap-4 border-b border-gray-300 px-5 py-5 sm:grid-cols-[44px_1fr_auto] sm:items-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                  <CalendarClock size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-black text-gray-950">
                    {professionalWorkspace.upcomingSessions.length > 0
                      ? `${professionalWorkspace.upcomingSessions.length} ${professionalWorkspace.upcomingSessions.length === 1 ? 'kommende session' : 'kommende sessioner'}`
                      : 'Ingen bekræftede sessioner i kalenderen'}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    {professionalWorkspace.upcomingSessions.length > 0
                      ? professionalWorkspace.upcomingSessions.slice(0, 2).map((session) => (
                          `${session.candidateName} · ${formatActionDate(session.startsAt)} · ${session.preparationStatus === 'ready' ? 'Session Plan klar' : 'Session Plan ikke klar endnu'}`
                        )).join('  ·  ')
                      : 'Når en session er bekræftet, kan du åbne kandidatens Session Plan direkte herfra.'}
                  </p>
                </div>
                {professionalWorkspace.upcomingSessions[0] && (
                  <Link href={`/profil/bookings/${professionalWorkspace.upcomingSessions[0].bookingId}`} className="inline-flex min-h-10 items-center gap-2 text-sm font-black text-gray-950">
                    Forbered session <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                )}
              </li>

              <li className="grid gap-4 border-b border-gray-300 px-5 py-5 sm:grid-cols-[44px_1fr_auto] sm:items-center">
                <span className={`flex h-11 w-11 items-center justify-center rounded-full ${professionalWorkspace.missingResults.length > 0 ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-400'}`}>
                  <FileCheck2 size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-black text-gray-950">
                    {professionalWorkspace.missingResults.length > 0
                      ? `${professionalWorkspace.missingResults.length} ${professionalWorkspace.missingResults.length === 1 ? 'resultat mangler' : 'resultater mangler'} at blive publiceret`
                      : 'Alle gennemførte sessioner har et publiceret resultat'}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    {professionalWorkspace.missingResults.length > 0
                      ? `Færdiggør indsigter, anbefaling og højst tre næste træk for ${professionalWorkspace.missingResults[0].candidateName}.`
                      : 'Kandidaten får leverancen, når du har færdiggjort og publiceret Session Plan.'}
                  </p>
                </div>
                {professionalWorkspace.missingResults[0] && (
                  <Link href={`/profil/bookings/${professionalWorkspace.missingResults[0].bookingId}`} className="inline-flex min-h-10 items-center gap-2 text-sm font-black text-gray-950">
                    Færdiggør resultat <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                )}
              </li>

              <li className="grid gap-4 border-b border-gray-300 px-5 py-5 sm:grid-cols-[44px_1fr_auto] sm:items-center">
                <span className={`flex h-11 w-11 items-center justify-center rounded-full ${professionalWorkspace.availability.openCount > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-950 text-white'}`}>
                  <Clock3 size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-black text-gray-950">
                    {professionalWorkspace.availability.nextAvailableAt
                      ? `Næste ledige tid er ${formatActionDate(professionalWorkspace.availability.nextAvailableAt)}`
                      : 'Du har ingen åbne tider'}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    {professionalWorkspace.availability.openCount > 0
                      ? `${professionalWorkspace.availability.openCount} ${professionalWorkspace.availability.openCount === 1 ? 'ledig tid kan' : 'ledige tider kan'} bookes.`
                      : 'Tilføj mindst én tid, så kandidater kan sende en bookinganmodning.'}
                  </p>
                </div>
                <Link href="/profil/professionel#availability-title" className="inline-flex min-h-10 items-center gap-2 text-sm font-black text-gray-950">
                  {professionalWorkspace.availability.openCount > 0 ? 'Administrer tider' : 'Tilføj en tid'} <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </li>
            </ol>
          </section>
        )}

        {isProfessional && (
          <section className="mb-12 bg-gray-950 px-5 py-7 text-white md:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase text-white/40">Profilklarhed</p>
                <h2 className="mt-3 text-3xl font-black">{proCompletion}/{proChecklist.length} dele er klar</h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55">Gør det let for kandidater at forstå din erfaring, dit fokus og deres konkrete udbytte.</p>
                <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-white/70" aria-label="Dokumenterede kvalitetssignaler">
                  {professional?.review_status === 'approved' && <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={14} aria-hidden="true" /> Profil gennemgået</span>}
                  {(professionalWorkspace?.quality.completedSessionCount ?? 0) > 0 && <span>{professionalWorkspace?.quality.completedSessionCount} gennemførte sessioner</span>}
                  {(professionalWorkspace?.quality.publishedReviewCount ?? 0) > 0 && professionalWorkspace?.quality.averageRating !== null && (
                    <span>{professionalWorkspace?.quality.averageRating.toLocaleString('da-DK', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} / 5 · {professionalWorkspace?.quality.publishedReviewCount} publicerede vurderinger</span>
                  )}
                </div>
              </div>
              <div className="grid border-t border-white/15 sm:grid-cols-2">
                {proChecklist.map((item) => (
                  <div key={item.label} className="flex items-center gap-3 border-b border-white/15 py-3 sm:px-4">
                    <Check size={15} className={item.done ? 'text-lime-300' : 'text-white/20'} aria-hidden="true" />
                    <p className={item.done ? 'text-sm font-bold text-white' : 'text-sm text-white/40'}>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="mb-12">
          <div className="grid border-y border-gray-300 bg-white sm:grid-cols-3">
            {[
              ['Sessioner', bookings.length.toString()],
              ['Kommende', upcoming.toString()],
              [isProfessional ? 'Kræver handling' : 'Handlingsplaner', (isProfessional ? pendingRequests + missingResultCount : outcomeCount).toString()],
            ].map(([label, value]) => (
              <div key={label} className="border-b border-gray-200 px-5 py-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                <p className="text-xs font-black uppercase text-gray-400">{label}</p>
                <p className="mt-2 text-2xl font-black text-gray-950">{value}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-gray-400">Betaling er ikke aktiveret. Overblikket viser kun sessionernes status og dine næste handlinger.</p>
        </section>

        <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
          <section>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div><p className="text-xs font-black uppercase text-gray-400">Sessioner</p><h2 className="mt-2 text-2xl font-black text-gray-950">Seneste bookinger</h2></div>
              <Link href="/profil/bookings" className="text-sm font-black text-gray-950 underline decoration-gray-300 underline-offset-4">Se alle</Link>
            </div>

            {bookings.length === 0 ? (
              <div className="border-y border-gray-300 bg-white px-5 py-10 text-center">
                <p className="text-lg font-black text-gray-950">Ingen bookinger endnu.</p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500">{isProfessional ? 'Når en kandidat sender en anmodning, vises den her.' : 'Find en profil, når du er klar til din første session.'}</p>
                {!isProfessional && <Link href="/professionals" className="mt-6 inline-flex rounded-lg bg-gray-950 px-5 py-3 text-sm font-black text-white">Se profiler</Link>}
              </div>
            ) : (
              <div className="border-t border-gray-300 bg-white">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="grid gap-3 border-b border-gray-300 px-4 py-5 sm:grid-cols-[1fr_180px_auto] sm:items-center">
                    <div><p className="font-black text-gray-950">{booking.counterpart_name}</p><p className="mt-1 text-xs text-gray-500">{booking.counterpart_title || '60-minutters karrieresession'}</p></div>
                    <div><p className="text-sm font-bold text-gray-950">{new Date(booking.starts_at).toLocaleString('da-DK', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Copenhagen' })}</p><p className="mt-1 text-xs text-gray-400">DKK {(booking.price_dkk ?? 0).toLocaleString('da-DK')}</p></div>
                    <StatusBadge status={booking.status} />
                  </div>
                ))}
              </div>
            )}
          </section>

          <aside>
            <p className="mb-3 text-xs font-black uppercase text-gray-400">Genveje</p>
            <div className="border-t border-gray-300">
              {[
                { href: isProfessional ? '/impact' : '/match', label: isProfessional ? 'Bidragsmodel' : 'Find retning' },
                { href: '/profil', label: 'Kontoindstillinger' },
                { href: '/contact', label: 'Få hjælp' },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center justify-between border-b border-gray-300 py-4 text-sm font-black text-gray-950 hover:text-gray-500">
                  {item.label}<ArrowRight size={15} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
