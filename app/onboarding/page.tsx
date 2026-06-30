'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

function labelsFor(isDa: boolean) {
  return {
    fields: ['AI', 'Banking', 'Management Consulting', 'Private Equity'],
    stages: isDa ? ['Afklarer muligheder', 'Forbereder ansøgning', 'Interview på vej', 'Finalerunde'] : ['Exploring options', 'Preparing applications', 'Interview coming up', 'Final round'],
    focuses: isDa ? ['Karriereretning', 'CV / LinkedIn', 'Interview', 'Case / technicals'] : ['Career direction', 'CV / LinkedIn', 'Interview', 'Case / technicals'],
  };
}

export default function CandidateOnboardingPage() {
  const { lang } = useLanguage();
  const isDa = lang === 'da';
  const labels = labelsFor(isDa);
  const router = useRouter();
  const [field, setField] = useState('');
  const [stage, setStage] = useState('');
  const [focus, setFocus] = useState('');

  const readiness = useMemo(() => [field, stage, focus].filter(Boolean).length, [field, stage, focus]);
  const groups = [
    { label: '01', title: isDa ? 'Hvilket felt sigter du mod?' : 'Which field are you targeting?', value: field, setValue: setField, options: labels.fields },
    { label: '02', title: isDa ? 'Hvor er du i processen?' : 'Where are you in the process?', value: stage, setValue: setStage, options: labels.stages },
    { label: '03', title: isDa ? 'Hvad skal sessionen især hjælpe med?' : 'What should the session mainly help with?', value: focus, setValue: setFocus, options: labels.focuses },
  ];

  function continueToProfiles() {
    const onboarding = { field, stage, focus, savedAt: new Date().toISOString() };
    localStorage.setItem('naetwork_candidate_onboarding', JSON.stringify(onboarding));
    router.push(`/professionals?field=${encodeURIComponent(field)}`);
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4]">
      <section className="border-b border-gray-200 bg-white px-5 py-12 sm:px-8 md:py-16">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-xs font-black uppercase text-gray-400">{isDa ? 'Kort onboarding' : 'Quick onboarding'}</p>
          <h1 className="max-w-4xl text-4xl font-black leading-[0.96] text-gray-950 text-balance sm:text-5xl md:text-6xl">{isDa ? 'Hvad vil du have hjælp til?' : 'What would you like help with?'}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">{isDa ? 'Tre valg giver os nok kontekst til at vise dig de mest relevante profiler.' : 'Three choices give us enough context to show the most relevant profiles.'}</p>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 md:py-14">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_360px]">
          <div className="border-t border-gray-300 bg-white">
            {groups.map((group) => (
              <section key={group.label} className="border-b border-gray-300 p-5 md:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black text-gray-400">{group.label}</p>
                    <h2 className="mt-2 text-2xl font-black text-gray-950">{group.title}</h2>
                  </div>
                  {group.value && <Check size={20} aria-label={isDa ? 'Valgt' : 'Selected'} />}
                </div>
                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  {group.options.map((option) => {
                    const selected = group.value === option;
                    return (
                      <button key={option} type="button" onClick={() => group.setValue(option)} aria-pressed={selected} className={`min-h-14 rounded-lg border px-4 py-3 text-left text-sm font-bold transition-colors ${selected ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 bg-[#f7f7f4] text-gray-700 hover:border-gray-950 hover:bg-white'}`}>
                        {option}
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          <aside className="h-fit bg-gray-950 p-6 text-white lg:sticky lg:top-24">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-black uppercase text-white/40">{isDa ? 'Dine valg' : 'Your choices'}</p>
              <p className="text-sm font-black text-white/60">{readiness}/3</p>
            </div>
            <div className="mt-5 border-t border-white/15">
              {[
                [isDa ? 'Felt' : 'Field', field],
                [isDa ? 'Fase' : 'Stage', stage],
                [isDa ? 'Fokus' : 'Focus', focus],
              ].map(([label, value]) => (
                <div key={label} className="border-b border-white/15 py-4">
                  <p className="text-xs font-black uppercase text-white/40">{label}</p>
                  <p className="mt-1 text-sm font-bold text-white">{value || (isDa ? 'Ikke valgt' : 'Not selected')}</p>
                </div>
              ))}
            </div>
            <button type="button" onClick={continueToProfiles} disabled={readiness < 3} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-black text-gray-950 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40">
              {isDa ? 'Se relevante profiler' : 'View relevant profiles'}
              <ArrowRight size={16} aria-hidden="true" />
            </button>
            <p className="mt-4 text-xs leading-relaxed text-white/40">{isDa ? 'Valgene gemmes kun på denne enhed.' : 'Choices are only saved on this device.'}</p>
          </aside>
        </div>
      </section>
    </main>
  );
}
