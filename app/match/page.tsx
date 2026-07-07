'use client';

import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

type Need = 'direction' | 'materials' | 'interview' | 'case';

const FIELDS = ['AI', 'Banking', 'Management Consulting', 'Private Equity'] as const;

const FIELD_PATHS: Record<string, string> = {
  AI: '/fields/ai',
  Banking: '/fields/banking',
  'Management Consulting': '/fields/consulting',
  'Private Equity': '/fields/private-equity',
};

const FIELD_ACCENTS: Record<string, string> = {
  AI: 'bg-cyan-300',
  Banking: 'bg-emerald-300',
  'Management Consulting': 'bg-blue-300',
  'Private Equity': 'bg-lime-300',
};

function needOptions(isDa: boolean): Array<{ id: Need; label: string; body: string }> {
  return [
    { id: 'direction', label: isDa ? 'Retning' : 'Direction', body: isDa ? 'Felt, rolle og næste skridt' : 'Field, role and next step' },
    { id: 'materials', label: isDa ? 'Materiale' : 'Materials', body: isDa ? 'CV, LinkedIn eller ansøgning' : 'CV, LinkedIn or application' },
    { id: 'interview', label: 'Interview', body: isDa ? 'Svar, motivation og personlig fortælling' : 'Answers, fit and personal story' },
    { id: 'case', label: isDa ? 'Case og faglighed' : 'Cases and technicals', body: isDa ? 'Cases, tekniske spørgsmål eller portefølje' : 'Cases, technicals or portfolio' },
  ];
}

function recommendationFor(field: string, need: Need | '', isDa: boolean) {
  const needTitles: Record<Need, string> = {
    direction: isDa ? `Karriereretning i ${field}` : `Career direction in ${field}`,
    materials: isDa ? `CV og profil til ${field}` : `CV and profile for ${field}`,
    interview: isDa ? `Interviewforberedelse til ${field}` : `Interview preparation for ${field}`,
    case: field === 'Banking'
      ? 'Banking Technicals'
      : field === 'Management Consulting'
        ? 'Consulting Case Prep'
        : field === 'Private Equity'
          ? 'PE / Investment Case'
          : 'AI Portfolio & Case',
  };

  const fieldNotes: Record<string, string[]> = {
    AI: isDa ? ['Afkod relevante roller', 'Positionér din erfaring', 'Vælg de stærkeste resultater'] : ['Decode relevant roles', 'Position your experience', 'Choose strong proof points'],
    Banking: isDa ? ['Forstå interviewniveauet', 'Skærp din tekniske viden', 'Styrk din personlige fortælling'] : ['Understand the interview bar', 'Sharpen technicals', 'Strengthen your fit story'],
    'Management Consulting': isDa ? ['Strukturér cases', 'Kommunikér klart', 'Forbered personlige svar'] : ['Structure cases', 'Communicate clearly', 'Prepare fit answers'],
    'Private Equity': isDa ? ['Skærp din deal-forståelse', 'Træn investment cases', 'Forstå PE-forventninger'] : ['Sharpen deal thinking', 'Practice investment cases', 'Understand PE expectations'],
  };

  return {
    title: field && need ? needTitles[need] : isDa ? 'Dit anbefalede fokus' : 'Your recommended focus',
    body: field && need
      ? isDa ? `Find en profil med relevant erfaring og brug de 60 minutter på ${needOptions(true).find((option) => option.id === need)?.label.toLowerCase()}.` : `Find a profile with relevant experience and use the 60 minutes on ${needOptions(false).find((option) => option.id === need)?.label.toLowerCase()}.`
      : isDa ? 'Vælg felt og behov. Så viser vi den korteste vej til relevante profiler.' : 'Choose a field and need. We will show the shortest route to relevant profiles.',
    notes: fieldNotes[field] ?? [],
    accent: FIELD_ACCENTS[field] ?? 'bg-gray-300',
  };
}

export default function MatchPage() {
  const { lang } = useLanguage();
  const isDa = lang === 'da';
  const needs = needOptions(isDa);
  const [field, setField] = useState('');
  const [need, setNeed] = useState<Need | ''>('');
  const completed = Number(Boolean(field)) + Number(Boolean(need));
  const recommendation = recommendationFor(field, need, isDa);
  const profileHref = field && need
    ? `/professionals?field=${encodeURIComponent(field)}&need=${need}`
    : field
      ? `/professionals?field=${encodeURIComponent(field)}`
      : '/professionals';

  return (
    <main className="min-h-screen bg-[#f4f4f0]">
      <section className="border-b border-gray-200 bg-white px-5 py-10 sm:px-8 md:py-16 lg:px-10">
        <div className="mx-auto max-w-[78rem]">
          <div className="signal-rail mb-7 max-w-24"><span /><span /><span /><span /></div>
          <p className="kicker mb-5">Match</p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-[0.96] text-gray-950 text-balance sm:text-6xl md:text-7xl">
            {isDa ? 'Hvad skal de 60 minutter løse?' : 'What should the 60 minutes solve?'}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
            {isDa ? 'To valg er nok. Vælg dit felt og det vigtigste behov.' : 'Two choices are enough. Choose your field and your most important need.'}
          </p>
        </div>
      </section>

      <section className="px-5 py-8 sm:px-8 md:py-16 lg:px-10">
        <div className="mx-auto grid max-w-[78rem] gap-8 lg:grid-cols-[1fr_400px]">
          <div className="overflow-hidden rounded-md border border-gray-300 bg-white">
            <section className="border-b border-gray-300 p-5 md:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black text-gray-400">01</p>
                  <h2 className="mt-2 text-2xl font-semibold text-gray-950">{isDa ? 'Vælg felt' : 'Choose field'}</h2>
                </div>
                {field && <Check size={20} aria-label={isDa ? 'Valgt' : 'Selected'} />}
              </div>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {FIELDS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setField(option)}
                    aria-pressed={field === option}
                    className={`lift-hover flex min-h-16 items-center justify-between rounded-md border px-4 py-3 text-left text-sm font-bold transition-colors ${field === option ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 bg-[#f4f4f0] text-gray-700 hover:border-gray-950 hover:bg-white'}`}
                  >
                    {option}
                    <span className={`h-2 w-8 rounded-full ${FIELD_ACCENTS[option]}`} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </section>

            <section className="border-b border-gray-300 p-5 md:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black text-gray-400">02</p>
                  <h2 className="mt-2 text-2xl font-semibold text-gray-950">{isDa ? 'Vælg behov' : 'Choose need'}</h2>
                </div>
                {need && <Check size={20} aria-label={isDa ? 'Valgt' : 'Selected'} />}
              </div>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {needs.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setNeed(option.id)}
                    aria-pressed={need === option.id}
                    className={`lift-hover min-h-24 rounded-md border px-4 py-4 text-left transition-colors ${need === option.id ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 bg-[#f4f4f0] text-gray-700 hover:border-gray-950 hover:bg-white'}`}
                  >
                    <span className="block text-sm font-black">{option.label}</span>
                    <span className={`mt-1 block text-xs ${need === option.id ? 'text-white/60' : 'text-gray-500'}`}>{option.body}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <aside className="h-fit overflow-hidden rounded-md bg-[#09090b] p-6 text-white shadow-[0_24px_70px_rgba(9,9,11,0.14)] lg:sticky lg:top-24 lg:p-7">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-black uppercase text-white/40">{isDa ? 'Anbefaling' : 'Recommendation'}</p>
              <span className={`h-2 w-16 rounded-full ${recommendation.accent}`} aria-hidden="true" />
            </div>
            <p className="mt-5 text-xs font-black text-white/40">{completed}/2</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight">{recommendation.title}</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/60">{recommendation.body}</p>

            {recommendation.notes.length > 0 && (
              <ul className="mt-6 border-t border-white/15">
                {recommendation.notes.map((note) => (
                  <li key={note} className="flex items-center gap-3 border-b border-white/15 py-3 text-sm font-semibold text-white/80">
                    <Check size={15} aria-hidden="true" />
                    {note}
                  </li>
                ))}
              </ul>
            )}

            {completed === 2 ? (
              <Link href={profileHref} className="button-secondary mt-6 w-full border-white bg-white">
                {isDa ? 'Se relevante profiler' : 'View relevant profiles'}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            ) : (
              <button type="button" disabled className="mt-6 inline-flex w-full cursor-not-allowed items-center justify-center rounded-lg bg-white/10 px-5 py-3 text-sm font-black text-white/40">
                {isDa ? 'Vælg begge ovenfor' : 'Choose both above'}
              </button>
            )}

            {field && (
              <Link href={FIELD_PATHS[field]} className="mt-4 block text-center text-sm font-semibold text-white/60 hover:text-white">
                {isDa ? 'Læs om feltet' : 'Read about the field'}
              </Link>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
