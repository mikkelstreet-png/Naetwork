'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { StarIcon } from '@/components/icons/StarIcon';

type DbRow = Record<string, unknown>;

const SESSION_TYPE_LABELS: Record<string, string> = {
  mock_interview: 'Mock Interview',
  cv_review: 'CV & LinkedIn',
  informal_chat: 'Uformel 1:1',
  career_advice: 'Karriereraadgivning',
};

export default function ProfessionalProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [professional, setProfessional] = useState<DbRow | null>(null);
  const [reviews, setReviews] = useState<DbRow[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const supabase = createClient();
    Promise.all([
      supabase.from('professionals').select('*').eq('id', id).single(),
      supabase.from('reviews').select('*').eq('professional_id', id).order('created_at', { ascending: false }).limit(5),
      supabase.auth.getUser(),
    ]).then(([{ data: prof }, { data: revs }, { data: { user: u } }]) => {
      setProfessional(prof as DbRow | null);
      setReviews((revs as DbRow[]) || []);
      setUser(u);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="pt-32 text-center text-gray-400">Indlaeser...</div>;
  if (!professional) return <div className="pt-32 text-center text-gray-500">Profil ikke fundet.</div>;

  const initials = (professional.name as string).split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  const sessionTypes = professional.session_types as string[];
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + (r.rating as number), 0) / reviews.length).toFixed(1) : null;

  return (
    <main className="pt-16">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/professionals" className="text-sm text-gray-400 hover:text-gray-700 mb-8 inline-block">tilbageknap Alle professionelle</Link>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-green-800 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-gray-900">{professional.name as string}</h1>
                  {professional.donates_to_charity && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">Donerer til Kraeftens Bekaempelse</span>
                  )}
                </div>
                <p className="text-gray-500 mt-1">{professional.title as string}{professional.company ? ` hoskoven ${professional.company as string}` : ''}</p>
                {avgRating && (
                  <div className="flex items-center gap-1 mt-2">
                    <StarIcon className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium text-gray-700">{avgRating}</span>
                    <span className="text-sm text-gray-400">({reviews.length} anmeldelser)</span>
                  </div>
                )}
              </div>
            </div>

            {professional.bio && (
              <div>
                <h2 className="font-semibold text-gray-900 mb-3">Om mig</h2>
                <p className="text-gray-600 leading-relaxed">{professional.bio as string}</p>
              </div>
            )}

            <div>
              <h2 className="font-semibold text-gray-900 mb-3">Tilbyder</h2>
              <div className="flex flex-wrap gap-2">
                {sessionTypes.map(t => (
                  <span key={t} className="text-sm font-medium px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700">{SESSION_TYPE_LABELS[t] || t}</span>
                ))}
              </div>
            </div>

            {reviews.length > 0 && (
              <div>
                <h2 className="font-semibold text-gray-900 mb-4">Anmeldelser</h2>
                <div className="space-y-4">
                  {reviews.map((r, i) => (
                    <div key={i} className="border border-gray-100 rounded-2xl p-4">
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: r.rating as number }).map((_, j) => (
                          <StarIcon key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      {r.comment && <p className="text-sm text-gray-600">{r.comment as string}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="sticky top-20">
            <div className="border border-gray-100 rounded-2xl p-6 space-y-4">
              <div className="text-2xl font-bold text-gray-900">DKK {(professional.price_dkk as number).toLocaleString('da-DK')}</div>
              <p className="text-sm text-gray-400">pr. session</p>
              {professional.donates_to_charity && (
                <p className="text-xs text-rose-700 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">Platformsgebyr reduceret til 7,5 % naar professionel donerer</p>
              )}
              <Link href={user ? `/professionals/${id}/book` : '/login'} className="block w-full text-center bg-green-800 text-white font-medium py-3 rounded-xl hover:bg-green-900 transition-colors">
                Book session
              </Link>
              <p className="text-xs text-gray-400 text-center">Ingen betaling nu</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
