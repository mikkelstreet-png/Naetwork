'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

type Answers = {
  field: string;
  stage: string;
  pressure: string;
  output: string;
};

const OPTIONS = {
  field: ['AI', 'Banking', 'Management Consulting', 'Private Equity'],
  stage: ['Exploring options', 'Applying now', 'Interview coming up', 'Final rounds'],
  pressure: ['I need direction', 'I need better materials', 'I need interview practice', 'I need case/technical prep'],
  output: ['Sharper CV / LinkedIn', 'Better answers', 'Case structure', 'Career clarity'],
};

function recommendationFor(answers: Answers) {
  if (answers.field === 'AI') {
    return {
      title: 'AI Career Strategy',
      bestFor: 'AI product, strategy roles and portfolio direction',
      search: 'AI',
      notes: ['Decode AI roles', 'Position your experience', 'Choose the right proof points'],
    };
  }
  if (answers.field === 'Banking') {
    return {
      title: answers.pressure.includes('technical') ? 'Banking Technicals' : 'Investment Banking Prep',
      bestFor: 'M&A process, technicals, CV and fit interviews',
      search: 'Banking',
      notes: ['Sharpen technical answers', 'Understand the interview bar', 'Improve fit story'],
    };
  }
  if (answers.field === 'Management Consulting') {
    return {
      title: 'Consulting Case Prep',
      bestFor: 'Case structure, hypotheses, communication and fit',
      search: 'Management Consulting',
      notes: ['Structure cases better', 'Communicate clearly', 'Prepare fit answers'],
    };
  }
  if (answers.field === 'Private Equity') {
    return {
      title: 'PE / Investment Case',
      bestFor: 'Investment thinking, diligence and deal discussion',
      search: 'Private Equity',
      notes: ['Sharpen deal thinking', 'Prepare investment cases', 'Understand PE expectations'],
    };
  }
  return {
    title: 'Career Direction',
    bestFor: 'Choosing the right next move',
    search: '',
    notes: ['Clarify options', 'Understand tradeoffs', 'Pick next step'],
  };
}

export default function MatchPage() {
  const [answers, setAnswers] = useState<Answers>({ field: '', stage: '', pressure: '', output: '' });
  const completed = Object.values(answers).filter(Boolean).length;
  const recommendation = useMemo(() => recommendationFor(answers), [answers]);

  function choose(key: keyof Answers, value: string) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] pt-16">
      <section className="border-b border-gray-200 bg-white px-5 py-14 sm:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-5 text-xs font-black uppercase text-gray-400">Match quiz</p>
          <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-5xl font-black leading-[0.96] tracking-tight text-gray-950 text-balance md:text-7xl">
                Find the right 60-minute session.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
                Answer four quick questions and get a recommended focus before you choose a professional.
              </p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-[#f7f7f4] p-5">
              <p className="text-xs font-black uppercase text-gray-400">Progress</p>
              <p className="mt-2 text-4xl font-black text-gray-950">{completed}/4</p>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">The more specific the match, the more useful the session brief becomes.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 md:py-14">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-5">
            {[
              { key: 'field' as const, label: '01', title: 'Which field are you aiming for?', options: OPTIONS.field },
              { key: 'stage' as const, label: '02', title: 'Where are you in the process?', options: OPTIONS.stage },
              { key: 'pressure' as const, label: '03', title: 'What feels most urgent?', options: OPTIONS.pressure },
              { key: 'output' as const, label: '04', title: 'What should you leave with?', options: OPTIONS.output },
            ].map((question) => (
              <section key={question.key} className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8">
                <p className="text-xs font-black text-gray-300">{question.label}</p>
                <h2 className="mt-5 text-2xl font-black text-gray-950">{question.title}</h2>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {question.options.map((option) => {
                    const selected = answers[question.key] === option;
                    return (
                      <button
                        key={option}
                        onClick={() => choose(question.key, option)}
                        className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold transition-colors ${selected ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 bg-[#f7f7f4] text-gray-700 hover:border-gray-950 hover:bg-white'}`}
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
            <div className="rounded-3xl border border-gray-200 bg-gray-950 p-6 text-white">
              <p className="text-xs font-black uppercase text-white/40">Recommended focus</p>
              <h2 className="mt-4 text-3xl font-black leading-tight">{recommendation.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{recommendation.bestFor}</p>
              <div className="mt-6 space-y-2">
                {recommendation.notes.map((note) => (
                  <div key={note} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white/80">
                    {note}
                  </div>
                ))}
              </div>
              <Link href="/professionals" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-black text-gray-950 transition-colors hover:bg-gray-100">
                See matching professionals
              </Link>
            </div>
            <Link href="/onboarding" className="block rounded-3xl border border-gray-200 bg-white p-6 transition-colors hover:border-gray-950">
              <p className="text-xs font-black uppercase text-gray-400">Before matching</p>
              <p className="mt-2 text-xl font-black text-gray-950">Build your prep direction</p>
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
