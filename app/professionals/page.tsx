'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { ProfessionalCard, type ProfessionalData } from '@/components/ProfessionalCard';
import { HeartIcon } from '@/components/icons/HeartIcon';

const INDUSTRIES = [
  'Alle brancher',
  'Banking',
  'Private Equity',
  'AI',
  'Management Consulting',
];

const SESSION_TYPE_OPTIONS = [
  { value: '', label: 'Alle session-typer' },
  { value: 'mock_interview', label: 'Mock Interview' },
  { value: 'cv_review', label: 'CV & LinkedIn' },
  { value: 'informal_chat', label: 'Uformel 1:1' },
  { value: 'career_advice', label: 'Karriereraadgivning' },
];

export default function ProfessionalsPage() {
  const [professionals, setProfessionals] = useState<ProfessionalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [industry, setIndustry] = useState('Alle brancher');
  const [sessionType, setSessionType] = useState('');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [charityOnly, setCharityOnly] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('professionals')
      .select('*')
      .eq('available', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setProfessionals((data as ProfessionalData[]) ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = professionals.filter(p => {
    if (industry !== 'Alle brancher' && p.industry !== industry) return false;
    if (sessionType && !p.session_types.includes(sessionType)) return false;
    if (p.price_dkk > maxPrice) return false;
    if (charityOnly && !p.donates_to_charity) return false;
    return true;
  });

  return (
    <main className="pt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find en professionel</h1>
          <p className="text-gray-500">Book en session med en erfaren professionel inden for din branche.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="border border-gray-100 rounded-2xl p-5 space-y-5 sticky top-20">
              <div className="font-semibold text-sm text-gray-900">Filtrering</div>

              {/* Industry */}
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-2">Branche</label>
                <select
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-800"
                >
                  {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                </select>
              </div>

              {/* Session type */}
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-2">Session-type</label>
                <select
                  value={sessionType}
                  onChange={e => setSessionType(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-800"
                >
                  {SESSION_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              {/* Max price */}
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-2">
                  Max pris: DKK {maxPrice}
                </label>
                <input
                  type="range"
                  min={300}
                  max={2000}
                  step={100}
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-green-800"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>300</span><span>2.000</span>
                </div>
              </div>

              {/* Charity only */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={charityOnly}
                  onChange={e => setCharityOnly(e.target.checked)}
                  className="mt-0.5 accent-green-800"
                />
                <span className="text-sm text-gray-600 flex items-center gap-1.5">
                  <HeartIcon className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  Donerer til Kraeftens Bekaempelse
                </span>
              </label>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {loading ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="border border-gray-100 rounded-2xl p-6 animate-pulse">
                    <div className="flex gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-gray-100" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-100 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="h-3 bg-gray-100 rounded mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-lg font-medium mb-2">Ingen professionelle fundet</p>
                <p className="text-sm">Proev at justere dine filtre.</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-400 mb-4">{filtered.length} professionelle</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {filtered.map(p => <ProfessionalCard key={p.id} professional={p} />)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
