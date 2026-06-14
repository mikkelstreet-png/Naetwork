'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { HeartIcon } from '@/components/icons/HeartIcon';
import { StarIcon } from '@/components/icons/StarIcon';
import { CalendarIcon } from '@/components/icons/CalendarIcon';
import { MicrophoneIcon } from '@/components/icons/MicrophoneIcon';
import { DocumentCheckIcon } from '@/components/icons/DocumentCheckIcon';
import { ChatBubbleIcon } from '@/components/icons/ChatBubbleIcon';
import { LightBulbIcon } from '@/components/icons/LightBulbIcon';
import type { ReactNode } from 'react';

const SESSION_INFO: Record<string, { label: string; desc: string; icon: ReactNode }> = {
  mock_interview: { label: 'Mock Interview', desc: 'Oev dig til det interview der betyder noget', icon: <MicrophoneIcon className="w-5 h-5" /> },
  cv_review: { label: 'CV & LinkedIn', desc: 'Faa professionel feedback paa dit CV og profil', icon: <DocumentCheckIcon className="w-5 h-5" /> },
  informal_chat: { label: 'Uformel 1:1', desc: 'En aaben snak med en der er naaet dertil', icon: <ChatBubbleIcon className="w-5 h-5" /> },
  career_advice: { label: 'Karriereraadgivning', desc: 'Strategisk sparring om din naeste karrierebeslutning', icon: <LightBulbIcon className="w-5 h-5" /> },
};

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(' ');
  const initials = parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : parts[0].slice(0, 2);
  return (
    <div className="w-20 h-20 rounded-full bg-green-800 text-white flex items-center justify-center font-bold text-2xl flex-shrink-0">
      {initials.toUpperCase()}
    </div>
  );
}

export default function ProfessionalProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [professional, setProfessional] = useState<Record<string, unknown> | null>(null);
  const [reviews, setReviews] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const supabase = createClient();
    Promise.all([
      supabase.from('professionals').select('*').eq('id', id).single(),
      supabase.from('reviews').select('*').eq('professional_id', id).order('created_at', { ascending: false }),
    ]).then(([{ data: pro }, { data: revs }]) => {
      setProfessional(pro);
      setReviews(revs ?? []);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <main className="pt-16 max-w-4xl mx-auto px-6 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-100 rounded w-1/3" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
        </div>
      </main>
    );
  }

  if (!professional) {
    return (
      <main className="pt-16 max-w-4xl mx-auto px-6 py-12 text-center">
        <p className="text-gray-500">Profil ikke fundet.</p>
        <Link href="/professionals" className="text-green-800 text-sm mt-4 inline-block">← Tilbage til oversigten</Link>
      </main>
    );
  }

  const sessionTypes = (professional.session_types as string[]) ?? [];
  const avgRating = reviews.length
    ? Math.round(reviews.reduce((s, r) => s + (r.rating as number), 0) / reviews.length * 10) / 10
    : null;

  return (
    <main className="pt-16">
      <div className="max-w-4xl mx-auto px-6 py-12">

        <Link href="/professionals" className="text-sm text-gray-400 hover:text-gray-700 mb-8 inline-block">
          ← Tilbage til oversigten
        </Link>

        {/* Profile header */}
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          <Initials name={professional.name as string} />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{professional.name as string}</h1>
            <p className="text-gray-500">
              {professional.title as string}
              {professional.company ? ` · ${professional.company}` : ''}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{professional.industry as string}</span>
              {avgRating && (
                <span className="text-xs flex items-center gap-1 text-gray-600">
                  <StarIcon className="w-3.5 h-3.5 text-yellow-500" filled /> {avgRating} ({reviews.length})
                </span>
              )}
            </div>

            {professional.donates_to_charity && (
              <div className="mt-3 inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg px-3 py-1.5 text-xs font-medium">
                <HeartIcon className="w-3.5 h-3.5" />
                Donerer til Kraeftens Bekaempelse
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">

            {/* Bio */}
            <div>
              <h2 className="font-semibold text-gray-900 mb-3">Om</h2>
              <p className="text-gray-600 leading-relaxed">{professional.bio as string}</p>
              {professional.linkedin_url && (
                <a href={professional.linkedin_url as string} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-green-800 hover:underline mt-3 inline-block">
                  Se LinkedIn-profil →
                </a>
              )}
            </div>

            {/* Session types */}
            <div>
              <h2 className="font-semibold text-gray-900 mb-3">Tilbudte sessioner</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {sessionTypes.map(st => {
                  const info = SESSION_INFO[st];
                  return (
                    <div key={st} className="border border-gray-100 rounded-xl p-4 flex gap-3">
                      <div className="text-green-800 flex-shrink-0">{info?.icon}</div>
                      <div>
                        <div className="font-medium text-sm text-gray-900">{info?.label ?? st}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{info?.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="font-semibold text-gray-900 mb-3">Anmeldelser</h2>
              {reviews.length === 0 ? (
                <p className="text-sm text-gray-400">Ingen anmeldelser endnu.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map(r => (
                    <div key={r.id as string} className="border border-gray-100 rounded-xl p-4">
                      <div className="flex gap-1 mb-2">
                        {[1,2,3,4,5].map(n => (
                          <StarIcon key={n} className="w-4 h-4 text-yellow-400" filled={n <= (r.rating as number)} />
                        ))}
                      </div>
                      {r.comment && <p className="text-sm text-gray-600">{r.comment as string}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="border border-gray-100 rounded-2xl p-5 sticky top-20">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                DKK {professional.price_dkk as number}
              </div>
              <div className="text-sm text-gray-400 mb-4">per session</div>

              {professional.donates_to_charity && (
                <div className="text-xs text-rose-600 mb-4 flex items-center gap-1.5">
                  <HeartIcon className="w-3.5 h-3.5" />
                  7,5% platformsbidrag — resten til Kraeftens Bekaempelse
                </div>
              )}

              <Link
                href={`/professionals/${id}/book`}
                className="w-full bg-green-800 text-white font-medium py-3 rounded-xl hover:bg-green-900 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <CalendarIcon className="w-4 h-4" />
                Book en session
              </Link>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
