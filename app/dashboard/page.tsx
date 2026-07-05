'use client';

import type { User } from '@supabase/supabase-js';
import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MemberNav } from '@/components/MemberNav';
import { StatusBadge } from '@/components/StatusBadge';
import { createClient } from '@/lib/supabase';

interface Profile {
  id: string;
  name: string | null;
  role: string;
}

interface ProfessionalProfile {
  id: string;
  bio: string | null;
  focus_areas: string[] | null;
  industries: string[] | null;
  price_dkk: number | null;
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
}

const ACTIVE_STATUSES = ['requested', 'pending', 'confirmed', 'rescheduled'];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [professional, setProfessional] = useState<ProfessionalProfile | null>(null);
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

      const [bookingResponse, professionalResult] = await Promise.all([
        fetch('/api/bookings').then(async (response) => ({ response, body: await response.json().catch(() => ({})) })),
        currentProfile.role === 'professional'
          ? supabase.from('professional_profiles').select('id, bio, focus_areas, industries, price_dkk, visibility, review_status').eq('profile_id', currentProfile.id).maybeSingle()
          : Promise.resolve({ data: null, error: null }),
      ]);

      if (!active) return;
      if (bookingResponse.response.ok) {
        setBookings((bookingResponse.body.bookings ?? []) as Booking[]);
      } else {
        setLoadError(bookingResponse.body.error || 'Bookingerne kunne ikke indlæses.');
      }
      setProfessional((professionalResult.data as ProfessionalProfile | null) ?? null);
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
  const relevantBookings = bookings.filter((booking) => !['cancelled', 'no_show', 'refunded'].includes(booking.status));
  const upcoming = bookings.filter((booking) => ACTIVE_STATUSES.includes(booking.status) && new Date(booking.starts_at).getTime() > Date.now()).length;
  const totalValue = relevantBookings.reduce((sum, booking) => sum + (booking.price_dkk ?? 0), 0);
  const proChecklist = [
    { label: 'Profiltekst', done: Boolean(professional?.bio?.trim()) },
    { label: 'Fokusområder', done: Boolean(professional?.focus_areas?.length) },
    { label: 'Industri', done: Boolean(professional?.industries?.length) },
    { label: 'Pris', done: Boolean(professional?.price_dkk) },
    { label: 'Sendt til gennemgang', done: professional?.visibility === 'published' },
  ];
  const proCompletion = proChecklist.filter((item) => item.done).length;

  const candidateActions = [
    { number: '01', title: 'Find fokus', body: 'To valg prioriterer de mest relevante profiler.', href: '/match', cta: 'Start match', accent: 'bg-cyan-300' },
    { number: '02', title: 'Sammenlign profiler', body: 'Se erfaring, fokus, pris og minimumsbidrag.', href: '/professionals', cta: 'Se profiler', accent: 'bg-blue-300' },
    { number: '03', title: 'Følg dine bookinger', body: 'Se anmodninger, bekræftelser og kommende sessioner.', href: '/profil/bookings', cta: 'Se status', accent: 'bg-lime-300' },
  ];

  return (
    <main className="min-h-screen bg-[#f7f7f4]">
      <section className="border-b border-gray-200 bg-white px-5 py-10 sm:px-8 md:py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase text-gray-400">Dit Naetwork</p>
            <h1 className="mt-3 text-4xl font-black leading-none text-gray-950 md:text-6xl">Hej, {displayName}.</h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-600 md:text-base">
              {isProfessional ? 'Administrer din profil og svar på sessionanmodninger.' : 'Find det rette match og hold styr på dine 60-minutters sessioner.'}
            </p>
          </div>
          <Link href={isProfessional ? '/profil/professionel' : '/professionals'} className="inline-flex w-fit items-center gap-2 rounded-lg bg-gray-950 px-5 py-3 text-sm font-black text-white hover:bg-gray-800">
            {isProfessional ? 'Rediger profil' : 'Book 60 min'} <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <MemberNav isProfessional={isProfessional} />

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 md:py-14">
        {loadError && <p role="alert" className="mb-8 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{loadError}</p>}

        {!isProfessional && (
          <section className="mb-12">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase text-gray-400">Næste skridt</p>
                <h2 className="mt-2 text-2xl font-black text-gray-950">Fra spørgsmål til session.</h2>
              </div>
            </div>
            <div className="border-t border-gray-300 bg-white">
              {candidateActions.map((item) => (
                <Link key={item.title} href={item.href} className="group grid gap-4 border-b border-gray-300 px-4 py-5 transition-colors hover:bg-gray-50 sm:grid-cols-[48px_1fr_1fr_auto] sm:items-center">
                  <div className="flex items-center gap-3"><span className={`h-2 w-8 rounded-full ${item.accent}`} /><span className="text-xs font-black text-gray-300 sm:hidden">{item.number}</span></div>
                  <div><p className="text-lg font-black text-gray-950">{item.title}</p><p className="mt-1 text-sm leading-relaxed text-gray-500 sm:hidden">{item.body}</p></div>
                  <p className="hidden text-sm leading-relaxed text-gray-500 sm:block">{item.body}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-black text-gray-950">{item.cta} <ArrowRight size={15} aria-hidden="true" /></span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {isProfessional && (
          <section className="mb-12 bg-gray-950 px-5 py-7 text-white md:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase text-white/40">Profilklarhed</p>
                <h2 className="mt-3 text-3xl font-black">{proCompletion}/5 dele er klar</h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55">Gør det let for kandidater at forstå din erfaring, dit fokus og deres konkrete udbytte.</p>
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
              ['Listet værdi', `DKK ${totalValue.toLocaleString('da-DK')}`],
            ].map(([label, value]) => (
              <div key={label} className="border-b border-gray-200 px-5 py-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                <p className="text-xs font-black uppercase text-gray-400">{label}</p>
                <p className="mt-2 text-2xl font-black text-gray-950">{value}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-gray-400">Betaling er ikke aktiveret. Listet værdi er sessionernes viste pris, ikke gennemførte betalinger.</p>
        </section>

        <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
          <section>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div><p className="text-xs font-black uppercase text-gray-400">Sessions</p><h2 className="mt-2 text-2xl font-black text-gray-950">Seneste bookinger</h2></div>
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
                    <div><p className="font-black text-gray-950">{booking.counterpart_name}</p><p className="mt-1 text-xs text-gray-500">{booking.counterpart_title || '60 min karrieresparring'}</p></div>
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
