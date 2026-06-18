'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

const FIELDS = ['AI', 'Banking', 'Management Consulting', 'Private Equity'];
const STAGES = ['Exploring options', 'Applying now', 'Interview coming up', 'Final rounds'];
const FOCUSES = ['CV / LinkedIn', 'Interview Prep', 'Case Prep', 'Banking Technicals', 'Consulting Cases', 'PE / Investment Case', 'AI Career Strategy', 'Career Direction'];

export default function CandidateOnboardingPage() {
  const [field, setField] = useState('');
  const [stage, setStage] = useState('');
  const [focus, setFocus] = useState('');
  const [saved, setSaved] = useState(false);

  const readiness = useMemo(() => [field, stage, focus].filter(Boolean).length, [field, stage, focus]);

  function savePlan() {
    localStorage.setItem('naetwork_candidate_onboarding', JSON.stringify({ field, stage, focus, savedAt: new Date().toISOString() }));
    setSaved(true);
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] pt-16">
      <section className="border-b border-gray-200 bg-white px-5 py-14 sm:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-5 text-xs font-black uppercase text-gray-400">Candidate onboarding</p>
          <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-5xl font-black leading-[0.96] tracking-tight text-gray-950 text-balance md:text-7xl">
                Build your prep direction before you book.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
                Choose your target field, where you are in the process and what you want to improve. Then use the match flow to find the right professional.
              </p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-[#f7f7f4] p-5">
              <p className="text-xs font-black uppercase text-gray-400">Readiness</p>
              <p className="mt-2 text-4xl font-black text-gray-950">{readiness}/3</p>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">A sharper brief gives the professional better context and makes your 60 minutes more useful.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 md:py-14">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            {[
              { label: '01', title: 'Target field', value: field, setValue: setField, options: FIELDS },
              { label: '02', title: 'Process stage', value: stage, setValue: setStage, options: STAGES },
              { label: '03', title: 'Primary focus', value: focus, setValue: setFocus, options: FOCUSES },
            ].map((group) => (
              <section key={group.title} className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8">
                <p className="text-xs font-black text-gray-300">{group.label}</p>
                <h2 className="mt-5 text-2xl font-black text-gray-950">{group.title}</h2>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {group.options.map((option) => {
                    const selected = group.value === option;
                    return (
                      <button
                        key={option}
                        onClick={() => { group.setValue(option); setSaved(false); }}
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
            <div className="rounded-3xl border border-gray-200 bg-white p-6">
              <p className="text-xs font-black uppercase text-gray-400">Your prep plan</p>
              <div className="mt-5 space-y-4">
                {[
                  ['Field', field || 'Not selected'],
                  ['Stage', stage || 'Not selected'],
                  ['Focus', focus || 'Not selected'],
                ].map(([label, value]) => (
                  <div key={label} className="border-t border-gray-100 pt-4 first:border-t-0 first:pt-0">
                    <p className="text-xs font-bold uppercase text-gray-400">{label}</p>
                    <p className="mt-1 text-sm font-black text-gray-950">{value}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={savePlan}
                disabled={readiness < 3}
                className="mt-6 w-full rounded-full bg-gray-950 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Save prep direction
              </button>
              {saved && <p className="mt-3 text-center text-xs font-bold text-emerald-700">Saved locally on this device.</p>}
            </div>
            <Link href="/match" className="block rounded-3xl border border-gray-200 bg-gray-950 p-6 text-white transition-colors hover:bg-gray-900">
              <p className="text-xs font-black uppercase text-white/40">Next</p>
              <p className="mt-2 text-xl font-black">Find your best match</p>
              <p className="mt-2 text-sm leading-relaxed text-white/55">Answer four quick questions and get a recommended path.</p>
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
