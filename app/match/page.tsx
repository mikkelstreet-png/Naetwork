'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

type Answers = {
  field: string;
  stage: string;
  pressure: string;
  output: string;
};

function optionsFor(isDa: boolean) {
  return {
    field: ['AI', 'Banking', 'Management Consulting', 'Private Equity'],
    stage: isDa ? ['Afklarer muligheder', 'Ansøger nu', 'Interview på vej', 'Finalerunder'] : ['Exploring options', 'Applying now', 'Interview coming up', 'Final rounds'],
    pressure: isDa ? ['Jeg mangler retning', 'Mit materiale skal være skarpere', 'Jeg skal træne interview', 'Jeg skal træne case/technicals'] : ['I need direction', 'I need better materials', 'I need interview practice', 'I need case/technical prep'],
    output: isDa ? ['Skarpere CV / LinkedIn', 'Bedre svar', 'Casestruktur', 'Karriereklarhed'] : ['Sharper CV / LinkedIn', 'Better answers', 'Case structure', 'Career clarity'],
  };
}

function recommendationFor(answers: Answers, isDa: boolean) {
  if (answers.field === 'AI') {
    return {
      title: 'AI Career Strategy',
      bestFor: isDa ? 'AI product, strategy roles og portfolio-retning' : 'AI product, strategy roles and portfolio direction',
      search: 'AI',
      fieldHref: '/fields/ai',
      notes: isDa ? ['Afkod AI-roller', 'Positionér din erfaring', 'Vælg de rigtige proof points'] : ['Decode AI roles', 'Position your experience', 'Choose the right proof points'],
      accent: 'bg-cyan-300',
    };
  }
  if (answers.field === 'Banking') {
    return {
      title: answers.pressure.toLowerCase().includes('technical') || answers.pressure.toLowerCase().includes('technicals') ? 'Banking Technicals' : 'Investment Banking Prep',
      bestFor: isDa ? 'M&A-proces, technicals, CV og fit interviews' : 'M&A process, technicals, CV and fit interviews',
      search: 'Banking',
      fieldHref: '/fields/banking',
      notes: isDa ? ['Skærp technical answers', 'Forstå interviewbaren', 'Forbedr fit story'] : ['Sharpen technical answers', 'Understand the interview bar', 'Improve fit story'],
      accent: 'bg-emerald-300',
    };
  }
  if (answers.field === 'Management Consulting') {
    return {
      title: 'Consulting Case Prep',
      bestFor: isDa ? 'Casestruktur, hypoteser, kommunikation og fit' : 'Case structure, hypotheses, communication and fit',
      search: 'Management Consulting',
      fieldHref: '/fields/consulting',
      notes: isDa ? ['Strukturer cases bedre', 'Kommunikér klarere', 'Forbered fit-svar'] : ['Structure cases better', 'Communicate clearly', 'Prepare fit answers'],
      accent: 'bg-blue-300',
    };
  }
  if (answers.field === 'Private Equity') {
    return {
      title: 'PE / Investment Case',
      bestFor: isDa ? 'Investment thinking, diligence og deal discussion' : 'Investment thinking, diligence and deal discussion',
      search: 'Private Equity',
      fieldHref: '/fields/private-equity',
      notes: isDa ? ['Skærp deal thinking', 'Forbered investment cases', 'Forstå PE-forventninger'] : ['Sharpen deal thinking', 'Prepare investment cases', 'Understand PE expectations'],
      accent: 'bg-lime-300',
    };
  }
  return {
    title: isDa ? 'Vælg første signal' : 'Choose first signal',
    bestFor: isDa ? 'Start med feltet, så bliver anbefalingen mere præcis.' : 'Start with the field and the recommendation becomes sharper.',
    search: '',
    fieldHref: '/professionals',
    notes: isDa ? ['Vælg felt', 'Vælg procesfase', 'Vælg output'] : ['Choose field', 'Choose process stage', 'Choose output'],
    accent: 'bg-gray-300',
  };
}

export default function MatchPage() {
  const { lang } = useLanguage();
  const isDa = lang === 'da';
  const options = optionsFor(isDa);
  const [answers, setAnswers] = useState<Answers>({ field: '', stage: '', pressure: '', output: '' });
  const completed = Object.values(answers).filter(Boolean).length;
  const progress = (completed / 4) * 100;
  const recommendation = useMemo(() => recommendationFor(answers, isDa), [answers, isDa]);
  const profileHref = recommendation.search ? `/professionals?field=${encodeURIComponent(recommendation.search)}` : '/professionals';

  function choose(key: keyof Answers, value: string) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  const questions = [
    { key: 'field' as const, label: '01', title: isDa ? 'Hvilket felt sigter du mod?' : 'Which field are you aiming for?', options: options.field },
    { key: 'stage' as const, label: '02', title: isDa ? 'Hvor er du i processen?' : 'Where are you in the process?', options: options.stage },
    { key: 'pressure' as const, label: '03', title: isDa ? 'Hvad haster mest?' : 'What feels most urgent?', options: options.pressure },
    { key: 'output' as const, label: '04', title: isDa ? 'Hvad skal du gå derfra med?' : 'What should you leave with?', options: options.output },
  ];

  return (
    <main className="page-shell">
      <section className="border-b border-gray-200 bg-white px-5 py-14 sm:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <p className="kicker mb-5">Match intelligence</p>
              <h1 className="display-xl max-w-4xl">
                {isDa ? 'Find den rigtige 60-minutters session før du booker.' : 'Find the right 60-minute session before you book.'}
              </h1>
              <p className="body-lg mt-6 max-w-2xl">
                {isDa
                  ? 'Svar på fire korte spørgsmål og få et mere præcist fokus, før du vælger professional. Det gør booking-flowet roligere, sessionen skarpere og impact mere konkret.'
                  : 'Answer four quick questions and get a sharper focus before choosing a professional. It makes booking calmer, the session sharper and impact more concrete.'}
              </p>
            </div>
            <div className="premium-panel p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="kicker">{isDa ? 'Fremskridt' : 'Progress'}</p>
                  <p className="mt-2 text-4xl font-black text-gray-950">{completed}/4</p>
                </div>
                <span className={`mt-1 block h-2 w-20 rounded-full ${recommendation.accent}`} />
              </div>
              <div className="mt-5 h-2 overflow-hidden bg-gray-200">
                <div className="h-full bg-gray-950 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-px border border-gray-200 bg-gray-200">
                {[
                  ['60', 'min'],
                  ['600+', 'DKK'],
                  ['40-90%', isDa ? 'bidrag' : 'impact'],
                ].map(([value, label]) => (
                  <div key={label} className="bg-white p-3">
                    <p className="text-sm font-black text-gray-950">{value}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase text-gray-400">{label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-500">
                {isDa ? 'Jo mere præcist signalet er, jo bedre bliver session briefet.' : 'The sharper the signal, the better the session brief becomes.'}
              </p>
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
                  {answers[question.key] && <span className="rounded-lg bg-gray-950 px-3 py-1.5 text-xs font-black text-white">{isDa ? 'Valgt' : 'Selected'}</span>}
                </div>
                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  {question.options.map((option) => {
                    const selected = answers[question.key] === option;
                    return (
                      <button
                        key={option}
                        onClick={() => choose(question.key, option)}
                        className={`rounded-lg border px-4 py-4 text-left text-sm font-bold transition-colors ${selected ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 bg-[#f7f7f4] text-gray-700 hover:border-gray-950 hover:bg-white'}`}
                      >
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
                  <p className="text-xs font-black uppercase text-white/40">{isDa ? 'Anbefalet fokus' : 'Recommended focus'}</p>
                  <h2 className="mt-4 text-3xl font-black leading-tight">{recommendation.title}</h2>
                </div>
                <span className={`mt-1 block h-2 w-16 rounded-full ${recommendation.accent}`} />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{recommendation.bestFor}</p>
              <div className="mt-6 space-y-2">
                {recommendation.notes.map((note) => (
                  <div key={note} className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white/80">
                    {note}
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-2">
                <Link href={profileHref} className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-black text-gray-950 transition-colors hover:bg-gray-100">
                  {isDa ? 'Profiler' : 'Profiles'}
                </Link>
                <Link href={recommendation.fieldHref} className="inline-flex items-center justify-center rounded-lg border border-white/15 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-white/10">
                  {isDa ? 'Felt' : 'Field'}
                </Link>
              </div>
            </div>
            <Link href="/onboarding" className="block premium-card p-6 transition-colors hover:border-gray-950">
              <p className="kicker">{isDa ? 'Før match' : 'Before matching'}</p>
              <p className="mt-2 text-xl font-black text-gray-950">{isDa ? 'Byg dit brief' : 'Build your prep direction'}</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {isDa ? 'Gør din booking mere præcis med et kort kandidat-brief.' : 'Make your booking sharper with a short candidate brief.'}
              </p>
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
