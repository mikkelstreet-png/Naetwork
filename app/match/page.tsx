'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ECONOMICS, formatDkk } from '@/lib/economics';

type Answers = {
  field: string;
  stage: string;
  pressure: string;
  output: string;
};

function optionsFor() {
  return {
    field: ['AI', 'Banking', 'Management Consulting', 'Private Equity'],
    stage: ['Afklarer muligheder', 'Ansøger nu', 'Interview på vej', 'Finalerunder'],
    pressure: ['Jeg mangler retning', 'Mit materiale skal være skarpere', 'Jeg skal træne interview', 'Jeg skal træne case/technicals'],
    output: ['Skarpere CV / LinkedIn', 'Bedre svar', 'Casestruktur', 'Karriereklarhed'],
  };
}

function recommendationFor(answers: Answers) {
  if (answers.field === 'AI') {
    return {
      title: 'AI Career Strategy',
      bestFor: 'AI product, strategy roles og portfolio-retning',
      search: 'AI',
      fieldHref: '/fields/ai',
      notes: ['Afkod AI-roller', 'Positionér din erfaring', 'Vælg de rigtige proof points'],
      accent: 'bg-cyan-300',
    };
  }
  if (answers.field === 'Banking') {
    return {
      title: answers.pressure.toLowerCase().includes('technical') || answers.pressure.toLowerCase().includes('technicals') ? 'Banking Technicals' : 'Investment Banking Prep',
      bestFor: 'M&A-proces, technicals, CV og fit interviews',
      search: 'Banking',
      fieldHref: '/fields/banking',
      notes: ['Skærp technical answers', 'Forstå interviewbaren', 'Forbedr fit story'],
      accent: 'bg-emerald-300',
    };
  }
  if (answers.field === 'Management Consulting') {
    return {
      title: 'Consulting Case Prep',
      bestFor: 'Casestruktur, hypoteser, kommunikation og fit',
      search: 'Management Consulting',
      fieldHref: '/fields/consulting',
      notes: ['Strukturer cases bedre', 'Kommunikér klarere', 'Forbered fit-svar'],
      accent: 'bg-blue-300',
    };
  }
  if (answers.field === 'Private Equity') {
    return {
      title: 'PE / Investment Case',
      bestFor: 'Investment thinking, diligence og deal discussion',
      search: 'Private Equity',
      fieldHref: '/fields/private-equity',
      notes: ['Skærp deal thinking', 'Forbered investment cases', 'Forstå PE-forventninger'],
      accent: 'bg-lime-300',
    };
  }
  return {
    title: 'Vælg første signal',
    bestFor: 'Start med feltet, så bliver anbefalingen mere præcis.',
    search: '',
    fieldHref: '/professionals',
    notes: ['Vælg felt', 'Vælg procesfase', 'Vælg output'],
    accent: 'bg-gray-300',
  };
}

export default function MatchPage() {
  const options = optionsFor();
  const [answers, setAnswers] = useState<Answers>({ field: '', stage: '', pressure: '', output: '' });
  const completed = Object.values(answers).filter(Boolean).length;
  const progress = (completed / 4) * 100;
  const recommendation = useMemo(() => recommendationFor(answers), [answers]);
  const profileHref = recommendation.search ? `/professionals?field=${encodeURIComponent(recommendation.search)}` : '/professionals';

  function choose(key: keyof Answers, value: string) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  const questions = [
    { key: 'field' as const, label: '01', title: 'Hvilket felt sigter du mod?', options: options.field },
    { key: 'stage' as const, label: '02', title: 'Hvor er du i processen?', options: options.stage },
    { key: 'pressure' as const, label: '03', title: 'Hvad haster mest?', options: options.pressure },
    { key: 'output' as const, label: '04', title: 'Hvad skal du gå derfra med?', options: options.output },
  ];

  return (
    <main className="page-shell">
      <section className="border-b border-gray-200 bg-white px-5 py-14 sm:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <p className="kicker mb-5">Match intelligence</p>
              <h1 className="display-xl max-w-4xl">Find den rigtige 60-minutters session før du booker.</h1>
              <p className="body-lg mt-6 max-w-2xl">Svar på fire korte spørgsmål og få et mere præcist fokus, før du vælger professional. Det gør booking-flowet roligere og sessionen skarpere.</p>
            </div>
            <div className="premium-panel p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="kicker">Fremskridt</p>
                  <p className="mt-2 text-4xl font-black text-gray-950">{completed}/4</p>
                </div>
                <span className={`mt-1 block h-2 w-20 ${recommendation.accent}`} />
              </div>
              <div className="mt-5 h-2 overflow-hidden bg-gray-200">
                <div className="h-full bg-gray-950 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-px border border-gray-200 bg-gray-200">
                {[
                  ['60', 'min'],
                  [formatDkk(ECONOMICS.minPriceDkk).replace('DKK ', ''), 'DKK+'],
                  [`${ECONOMICS.charityPercent}/${ECONOMICS.professionalPercent}/${ECONOMICS.platformPercent}`, 'fordeling'],
                ].map(([value, label]) => (
                  <div key={label} className="bg-white p-3">
                    <p className="text-sm font-black text-gray-950">{value}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase text-gray-400">{label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-500">Jo mere præcist signalet er, jo bedre bliver session briefet.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 md:py-14">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_400px]">
          <div className="space-y-5">
            {questions.map((question) => (
              <section key={question.key} className="premium-card p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black text-gray-300">{question.label}</p>
                    <h2 className="mt-5 text-2xl font-black text-gray-950">{question.title}</h2>
                  </div>
                  {answers[question.key] && <span className="rounded-lg bg-gray-950 px-3 py-1.5 text-xs font-black text-white">Valgt</span>}
                </div>
                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  {question.options.map((option) => {
                    const selected = answers[question.key] === option;
                    return (
                      <button key={option} onClick={() => choose(question.key, option)} className={`rounded-lg border px-4 py-4 text-left text-sm font-bold transition-colors ${selected ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 bg-[#f7f7f4] text-gray-700 hover:border-gray-950 hover:bg-white'}`}>
                        {option}
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
            <div className="dark-panel p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase text-white/40">Anbefalet fokus</p>
                  <h2 className="mt-4 text-3xl font-black leading-tight">{recommendation.title}</h2>
                </div>
                <span className={`mt-1 block h-2 w-16 ${recommendation.accent}`} />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{recommendation.bestFor}</p>
              <div className="mt-6 space-y-2">
                {recommendation.notes.map((note) => (
                  <div key={note} className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white/80">{note}</div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-2">
                <Link href={profileHref} className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-black text-gray-950 transition-colors hover:bg-gray-100">Profiler</Link>
                <Link href={recommendation.fieldHref} className="inline-flex items-center justify-center rounded-lg border border-white/15 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-white/10">Felt</Link>
              </div>
            </div>
            <Link href="/onboarding" className="block premium-card p-6 transition-colors hover:border-gray-950">
              <p className="kicker">Før match</p>
              <p className="mt-2 text-xl font-black text-gray-950">Byg dit brief</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">Gør din booking mere præcis med et kort kandidat-brief.</p>
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
