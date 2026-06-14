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
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', u.id).single();
      setProfile(prof as DbRow | null);
      if (prof?.role === 'professional') {
        const { data: pro } = await supabase.from('professionals').select('*').eq('profile_id', u.id).single();
        setProfessional(pro as DbRow | null);
        const { data: ses } = await supabase.from('bookings').select('*').eq('professional_id', pro?.id).order('created_at', { ascending: false });
        setSessions((ses as DbRow[]) || []);
      } else {
        const { data: bks } = await supabase.from('bookings').select('*').eq('candidate_id', u.id).order('created_at', { ascending: false });
        setBookings((bks as DbRow[]) || []);
      }
      setLoading(false);
    });
  }, [router]);

  if (loading) return <div className="pt-32 text-center text-gray-400">Indlaeser...</div>;

  const isProfessional = profile?.role === 'professional';
  const totalEarnings = sessions.reduce((s, b) => s + ((b.professional_payout_dkk as number) || 0), 0);
  const totalCharity = sessions.filter(b => b.donates_to_charity).reduce((s, b) => s + ((b.platform_fee_dkk as number) || 0) * 0.5, 0);

  return (
    <main className="pt-16">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Hej, {(profile?.full_name as string)?.split(' ')[0] || 'der'}</h1>
          <p className="text-gray-400 mt-1">{isProfessional ? 'Din professionelle profil' : 'Dine karrieresessioner'}</p>
        </div>

        {isProfessional ? (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="border border-gray-100 rounded-2xl p-5">
                <div className="text-2xl font-bold text-gray-900">{sessions.length}</div>
                <div className="text-sm text-gray-400 mt-1">Sessioner</div>
              </div>
              <div className="border border-gray-100 rounded-2xl p-5">
                <div className="text-2xl font-bold text-gray-900">DKK {totalEarnings.toLocaleString('da-DK')}</div>
                <div className="text-sm text-gray-400 mt-1">Tjent i alt</div>
              </div>
              {totalCharity > 0 && (
                <div className="border border-rose-100 bg-rose-50 rounded-2xl p-5">
                  <div className="text-2xl font-bold text-rose-700">DKK {totalCharity.toLocaleString('da-DK')}</div>
                  <div className="text-sm text-rose-400 mt-1">Doneret til KB</div>
                </div>
              )}
            </div>

            {/* Sessions list */}
            <div>
              <h2 className="font-semibold text-gray-900 mb-4">Bookinger</h2>
              {sessions.length === 0 ? (
                <div className="border border-gray-100 rounded-2xl p-8 text-center text-gray-400">
                  Ingen bookinger endnu. <Link href={professional?.id ? `/professionals/${professional.id as string}` : '/professionals'} className="text-green-800 hover:underline">Se din profil</Link>.
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map((b, i) => (
                    <div key={i} className="border border-gray-100 rounded-2xl p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{b.session_type as string}</div>
                        <div className="text-xs text-gray-400 mt-0.5">DKK {(b.professional_payout_dkk as number)?.toLocaleString('da-DK')}</div>
                      </div>
                      <StatusBadge status={b.status as string} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link href="/indstillinger" className="inline-block text-sm text-gray-400 hover:text-gray-700">Rediger profil og indstillinger</Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Mine bookinger</h2>
              <Link href="/professionals" className="text-sm bg-green-800 text-white font-medium px-4 py-2 rounded-xl hover:bg-green-900 transition-colors">Book ny session</Link>
            </div>
            {bookings.length === 0 ? (
              <div className="border border-gray-100 rounded-2xl p-8 text-center text-gray-400">
                Du har ingen bookinger endnu.{' '}
                <Link href="/professionals" className="text-green-800 hover:underline">Find en professionel</Link>.
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((b, i) => (
                  <div key={i} className="border border-gray-100 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{b.session_type as string}</div>
                      <div className="text-xs text-gray-400 mt-0.5">DKK {(b.price_dkk as number)?.toLocaleString('da-DK')}</div>
                    </div>
                    <StatusBadge status={b.status as string} />
                  </div>
                ))}
              </div>
            )}
            <Link href="/indstillinger" className="inline-block text-sm text-gray-400 hover:text-gray-700">Kontoindstillinger</Link>
          </div>
        )}
      </div>
    </main>
  );
}
