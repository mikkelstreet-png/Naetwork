'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { StatusBadge } from '@/components/StatusBadge';

type DbRow = Record<string, unknown>;

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<DbRow | null>(null);
  const [bookings, setBookings] = useState<DbRow[]>([]);
  const [professional, setProfessional] = useState<DbRow | null>(null);
  const [sessions, setSessions] = useState<DbRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user: u } }) => {
      if (!u) { router.push('/login'); return; }
      setUser(u);
      const { data: prof } = await supabase.from('profiles').select('*').eq('auth_user_id', u.id).single();
      setProfile(prof as DbRow | null);
      if (prof?.role === 'professional') {
        const { data: pro } = await supabase.from('professional_profiles').select('*').eq('profile_id', prof.id).maybeSingle();
        setProfessional(pro as DbRow | null);
        if (pro?.id) {
          const { data: ses } = await supabase.from('bookings').select('*').eq('professional_profile_id', pro.id).order('starts_at', { ascending: false });
          setSessions((ses as DbRow[]) || []);
        }
      } else if (prof?.id) {
        const { data: bks } = await supabase.from('bookings').select('*').eq('candidate_profile_id', prof.id).order('starts_at', { ascending: false });
        setBookings((bks as DbRow[]) || []);
      }
      setLoading(false);
    });
  }, [router]);

  if (loading) return <main className="min-h-screen bg-[#f7f7f4] pt-32 text-center text-gray-400">Indlæser...</main>;

  const isProfessional = profile?.role === 'professional';
  const displayName = ((profile?.name || profile?.full_name || user?.email || 'der') as string).split(' ')[0];
  const activeRows = isProfessional ? sessions : bookings;
  const totalValue = activeRows.reduce((s, b) => s + ((b.price_dkk as number) || (b.professional_payout_dkk as number) || 0), 0);
  const upcoming = activeRows.filter((b) => b.starts_at && new Date(b.starts_at as string).getTime() > Date.now()).length;

  return (
    <main className="min-h-screen bg-[#f7f7f4] pt-16">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Dashboard</p>
              <h1 className="mt-2 text-4xl font-black leading-none tracking-tight text-gray-950">Hej, {displayName}</h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-500">{isProfessional ? 'Administrer din professionelle profil, sessions og synlighed.' : 'Hold styr på dine 60-minutters karrieresessioner.'}</p>
            </div>
            <Link href={isProfessional ? '/profil/professionel' : '/professionals'} className="w-fit rounded-full bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800">
              {isProfessional ? 'Rediger profil' : 'Book 60 min'}
            </Link>
          </div>
        </section>

        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><p className="text-xs font-semibold uppercase text-gray-400">Total</p><p className="mt-2 text-2xl font-black text-gray-950">{activeRows.length}</p></div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><p className="text-xs font-semibold uppercase text-gray-400">Kommende</p><p className="mt-2 text-2xl font-black text-gray-950">{upcoming}</p></div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><p className="text-xs font-semibold uppercase text-gray-400">Værdi</p><p className="mt-2 text-2xl font-black text-gray-950">DKK {totalValue.toLocaleString('da-DK')}</p></div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-gray-400">Sessions</p>
                <h2 className="mt-1 text-xl font-black text-gray-950">{isProfessional ? 'Bookinger' : 'Mine bookinger'}</h2>
              </div>
              <Link href="/profil/bookings" className="text-sm font-semibold text-gray-950 underline decoration-gray-300 underline-offset-4 hover:decoration-gray-950">Se alle</Link>
            </div>

            {activeRows.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
                <p className="text-sm text-gray-500">{isProfessional ? 'Ingen bookinger endnu.' : 'Du har ingen bookinger endnu.'}</p>
                <Link href={isProfessional && professional?.id ? `/professionals/${professional.id as string}` : '/professionals'} className="mt-5 inline-flex rounded-full bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800">
                  {isProfessional ? 'Se profil' : 'Find en professionel'}
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {activeRows.slice(0, 5).map((b, i) => (
                  <div key={(b.id as string) || i} className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 p-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-950">60 min career session</p>
                      <p className="mt-1 text-xs text-gray-400">DKK {(((b.price_dkk as number) || (b.professional_payout_dkk as number) || 0)).toLocaleString('da-DK')}</p>
                    </div>
                    <StatusBadge status={(b.status as string) || 'pending'} />
                  </div>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-4">
            {isProfessional && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase text-gray-400">Profilstatus</p>
                <p className="mt-2 text-lg font-black text-gray-950">{(professional?.visibility as string) === 'published' ? 'Publiceret' : 'Skjult'}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">Din profil skal være publiceret og godkendt for at være synlig.</p>
              </div>
            )}
            <Link href="/profil" className="block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-gray-950">
              <p className="text-xs font-semibold uppercase text-gray-400">Konto</p>
              <p className="mt-2 text-lg font-black text-gray-950">Indstillinger</p>
            </Link>
            <Link href="/privacy" className="block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-gray-950">
              <p className="text-xs font-semibold uppercase text-gray-400">Legal</p>
              <p className="mt-2 text-lg font-black text-gray-950">Privatliv og data</p>
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
