'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

function labelsFor(isDa: boolean) {
  return {
    fields: ['AI', 'Banking', 'Management Consulting', 'Private Equity'],
    stages: isDa ? ['Afklarer muligheder', 'Ansøger nu', 'Interview på vej', 'Finalerunder'] : ['Exploring options', 'Applying now', 'Interview coming up', 'Final rounds'],
    focuses: ['CV / LinkedIn', 'Interview Prep', 'Case Prep', 'Banking Technicals', 'Consulting Cases', 'PE / Investment Case', 'AI Career Strategy', 'Career Direction'],
  };
}

export default function CandidateOnboardingPage() {
  const { lang } = useLanguage();
  const isDa = lang === 'da';
  const labels = labelsFor(isDa);
  const [field, setField] = useState('');
  const [stage, setStage] = useState('');
  const [focus, setFocus] = useState('');
  const [saved, setSaved] = useState(false);

  const readiness = useMemo(() => [field, stage, focus].filter(Boolean).length, [field, stage, focus]);
  const progress = (readiness / 3) * 100;

  function savePlan() {
    localStorage.setItem('naetwork_candidate_onboarding', JSON.stringify({ field, stage, focus, savedAt: new Date().toISOString() }));
    setSaved(true);
  }

  const groups = [
    { label: '01', title: isDa ? 'Målfelt' : 'Target field', value: field, setValue: setField, options: labels.fields },
    { label: '02', title: isDa ? 'Procesfase' : 'Process stage', value: stage, setValue: setStage, options: labels.stages },
    { label: '03', title: isDa ? 'Primært fokus' : 'Primary focus', value: focus, setValue: setFocus, options: labels.focuses },
  ];

  return (
    <main className="page-shell">
      <section className="border-b border-gray-200 bg-white px-5 py-14 sm:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <p className="kicker mb-5">Candidate operating brief</p>
              <h1 className="display-xl max-w-4xl">
                {isDa ? 'Gør din booking skarpere, før du vælger profil.' : 'Make your booking sharper before choosing a profile.'}
              </h1>
              <p className="body-lg mt-6 max-w-2xl">
                {isDa
                  ? 'Vælg felt, fase og fokus. Det bliver dit prep direction, så match og booking føles mere præcist fra starten.'
                  : 'Choose field, stage and focus. This becomes your prep direction, so matching and booking feel more precise from the start.'}
              </p>
            </div>
            <div className="premium-panel p-5">
              <p className="kicker">{isDa ? 'Readiness' : 'Readiness'}</p>
              <p className="mt-2 text-4xl font-black text-gray-950">{readiness}/3</p>
              <div className="mt-5 h-2 overflow-hidden bg-gray-200">
                <div className="h-full bg-gray-950 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-500">
                {isDa ? 'Et skarpere brief giver den professionelle bedre kontekst og gør de 60 minutter mere værdifulde.' : 'A sharper brief gives the professional better context and makes the 60 minutes more valuable.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 md:py-14">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-5">
            {groups.map((group) => (
              <section key={group.title} className="premium-card p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black text-gray-300">{group.label}</p>
                    <h2 className="mt-5 text-2xl font-black text-gray-950">{group.title}</h2>
                  </div>
                  {group.value && <span className="rounded-lg bg-gray-950 px-3 py-1.5 text-xs font-black text-white">Selected</span>}
                </div>
                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  {group.options.map((option) => {
                    const selected = group.value === option;
                    return (
                      <button
                        key={option}
                        onClick={() => { group.setValue(option); setSaved(false); }}
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
            <div className="premium-card p-6">
              <p className="kicker">{isDa ? 'Dit brief' : 'Your prep brief'}</p>
              <div className="mt-5 space-y-4">
                {[
                  [isDa ? 'Felt' : 'Field', field || (isDa ? 'Ikke valgt' : 'Not selected')],
                  [isDa ? 'Fase' : 'Stage', stage || (isDa ? 'Ikke valgt' : 'Not selected')],
                  ['Focus', focus || (isDa ? 'Ikke valgt' : 'Not selected')],
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
                className="mt-6 w-full rounded-lg bg-gray-950 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isDa ? 'Gem prep direction' : 'Save prep direction'}
              </button>
              {saved && <p className="mt-3 text-center text-xs font-bold text-emerald-700">{isDa ? 'Gemt lokalt på denne enhed.' : 'Saved locally on this device.'}</p>}
            </div>
            <Link href="/match" className="block dark-panel p-6 transition-colors hover:bg-gray-900">
              <p className="text-xs font-black uppercase text-white/40">{isDa ? 'Næste' : 'Next'}</p>
              <p className="mt-2 text-xl font-black">{isDa ? 'Find dit bedste match' : 'Find your best match'}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                {isDa ? 'Brug dit brief som signal og vælg et mere præcist session-fokus.' : 'Use your brief as signal and choose a sharper session focus.'}
              </p>
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
