'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase';
import { HeartIcon } from '@/components/icons/HeartIcon';
import { CalendarIcon } from '@/components/icons/CalendarIcon';
import Link from 'next/link';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Afventer', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  confirmed: { label: 'Bekraeftet', color: 'bg-green-50 text-green-700 border-green-200' },
  completed: { label: 'Gennemfoert', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  cancelled: { label: 'Annulleret', color: 'bg-gray-50 text-gray-500 border-gray-200' },
};

const SESSION_LABELS: Record<string, string> = {
  mock_interview: 'Mock Interview',
  cv_review: 'CV & LinkedIn',
  informal_chat: 'Uformel 1:1',
  career_advice: 'Karriereraadgivning',
};

type DbRow = Record<string, unknown>;

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<DbRow | null>(null);
  const [bookings, setBookings] = useState<DbRow[]>([]);
  const [professional, setProfessional] = useState<DbRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) { setLoading(false); return; }
      setUser(u);

      const [{ data: prof }, { data: pro }] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', u.id).single(),
        supabase.from('professionals').select('*').eq('user_id', u.id).single(),
      ]);
      setProfile(prof as DbRow | null);
      setProfessional(pro as DbRow | null);

      if (prof?.user_type === 'professional' && pro) {
        const { data: bks } = await supabase
          .from('bookings').select('*, professionals(name, title)')
          .eq('professional_id', pro.id).order('created_at', { ascending: false });
        setBookings((bks ?? []) as DbRow[]);
      } else {
        const { data: bks } = await supabase
          .from('bookings').select('*, professionals(name, title)')
          .eq('candidate_id', u.id).order('created_at', { ascending: false });
        setBookings((bks ?? []) as DbRow[]);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return (
    <main className="pt-16 max-w-4xl mx-auto px-6 py-12">
      <div className="animate-pulse space-y-4">{[...Array(3)].map((_,i) => <div key={i} className="h-16 bg-gray-100 rounded-xl" />)}</div>
    </main>
  );

  if (!user) return (
    <main className="pt-16 max-w-4xl mx-auto px-6 py-20 text-center">
      <p className="text-gray-500 mb-4">Du skal vaere logget ind for at se dit dashboard.</p>
      <Link href="/login" className="bg-green-800 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-green-900">Log ind</Link>
    </main>
  );

  const isProfessional = profile?.user_type === 'professional';
  const totalEarnings = bookings.filter(b => b.status === 'completed').reduce((s, b) => s + (b.professional_payout_dkk as number), 0);
  const totalDonated = bookings.filter(b => b.status === 'completed' && b.donates_to_charity).reduce((s, b) => s + (b.platform_fee_dkk as number), 0);

  return (
    <main className="pt-16">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{isProfessional ? 'Mine sessioner' : 'Mine bookinger'}</h1>
            <p className="text-gray-500 mt-1">Hej, {(profile?.name as string) ?? user.email}</p>
          </div>
          {isProfessional && professional && (
            <Link href={`/professionals/${professional.id as string}`} className="text-sm text-green-800 border border-green-200 px-4 py-2 rounded-xl hover:border-green-800 transition-colors">Se min profil →</Link>
          )}
        </div>

        {isProfessional && (
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            <div className="border border-gray-100 rounded-2xl p-5">
              <div className="text-xs text-gray-400 mb-1">Samlet indtjening</div>
              <div className="text-2xl font-bold text-gray-900">DKK {totalEarnings}</div>
            </div>
            <div className="border border-gray-100 rounded-2xl p-5">
              <div className="text-xs text-gray-400 mb-1">Sessioner gennemfoert</div>
              <div className="text-2xl font-bold text-gray-900">{bookings.filter(b => b.status === 'completed').length}</div>
            </div>
            {professional?.donates_to_charity && (
              <div className="border border-rose-200 bg-rose-50 rounded-2xl p-5">
                <div className="flex items-center gap-1.5 text-xs text-rose-600 mb-1"><HeartIcon className="w-3.5 h-3.5" />Doneret til Kraeftens Bekaempelse</div>
                <div className="text-2xl font-bold text-rose-800">DKK {totalDonated}</div>
              </div>
            )}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="text-center py-16 border border-gray-100 rounded-2xl">
            <CalendarIcon className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">Ingen bookinger endnu</p>
            {!isProfessional && <Link href="/professionals" className="text-sm text-green-800 mt-3 inline-block hover:underline">Find en professionel →</Link>}
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map(b => {
              const status = STATUS_LABELS[b.status as string] ?? STATUS_LABELS.pending;
              const pro = b.professionals as DbRow | null;
              return (
                <div key={b.id as string} className="border border-gray-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      {SESSION_LABELS[b.session_type as string] ?? (b.session_type as string)}
                      {pro && <span className="font-normal text-gray-500"> · {pro.name as string}</span>}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">DKK {b.price_dkk as number}
                      {b.donates_to_charity && <span className="ml-2 inline-flex items-center gap-1 text-rose-500"><HeartIcon className="w-3 h-3" />doneret</span>}
                    </div>
                    {b.created_at && <div className="text-xs text-gray-400 mt-0.5">{new Date(b.created_at as string).toLocaleDateString('da-DK')}</div>}
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${status.color}`}>{status.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
