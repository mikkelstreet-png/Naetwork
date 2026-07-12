'use client';

import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { INDUSTRIES } from '@/lib/platform';

type Need = 'direction' | 'materials' | 'interview' | 'case';

const FIELDS = INDUSTRIES.map((industry) => industry.id);
const FIELD_PATHS = Object.fromEntries(INDUSTRIES.map((industry) => [industry.id, `/fields/${industry.slug}`])) as Record<string, string>;
const FIELD_ACCENTS = Object.fromEntries(INDUSTRIES.map((industry) => [industry.id, industry.accent])) as Record<string, string>;

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
      <section className="border-b border-white/15 bg-[#09090b] px-5 py-12 text-white sm:px-8 md:py-20 lg:px-12">
        <div className="mx-auto max-w-[82rem]">
          <div className="signal-rail mb-7 max-w-24"><span /><span /><span /><span /></div>
          <p className="kicker mb-5 text-white/40">Match</p>
          <h1 className="max-w-4xl text-4xl font-medium leading-[0.96] text-white text-balance sm:text-6xl md:text-7xl">
            {isDa ? 'Find den rigtige erfaring på to valg.' : 'Find the right experience in two choices.'}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/55 md:text-lg">
            {isDa ? 'Vælg det felt, du vil tættere på, og den ene ting sessionen skal gøre skarpere.' : 'Choose the field you want to get closer to and the one thing the session should sharpen.'}
          </p>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 md:py-16 lg:px-12">
        <div className="mx-auto grid max-w-[82rem] gap-8 lg:grid-cols-[1fr_400px]">
          <div>
            <div className="mb-8 flex items-center gap-4" aria-label={isDa ? `${completed} af 2 valg foretaget` : `${completed} of 2 choices made`}>
              <div className="h-1 flex-1 overflow-hidden bg-gray-200"><div className="h-full bg-gray-950 transition-[width] duration-300" style={{ width: `${completed * 50}%` }} /></div>
              <span className="editorial-label shrink-0">{completed}/2</span>
            </div>
            <section className="border-t border-gray-300 py-7 md:py-9">
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
                    className="choice-control"
                  >
                    <span>{option}</span>
                    <span className="flex items-center gap-3"><span className={`h-2 w-8 rounded-full ${FIELD_ACCENTS[option]}`} aria-hidden="true" />{field === option && <Check size={16} aria-hidden="true" />}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="border-t border-gray-300 py-7 md:py-9">
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
                    className="choice-control min-h-24 flex-col items-start justify-center"
                  >
                    <span className="block text-sm font-black">{option.label}</span>
                    <span className={`mt-1 block text-xs ${need === option.id ? 'text-white/60' : 'text-gray-500'}`}>{option.body}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <aside aria-live="polite" className="h-fit overflow-hidden rounded-md bg-[#09090b] p-6 text-white shadow-[0_24px_70px_rgba(9,9,11,0.14)] lg:sticky lg:top-24 lg:p-7">
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
              <button type="button" disabled className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-[4px] border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white/40">
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
