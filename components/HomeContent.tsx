'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export function HomeContent() {
  const { lang } = useLanguage();
  const isDa = lang === 'da';

  const copy = {
    eyebrow: 'Naetwork',
    title: isDa ? 'Karrieresparring med mening.' : 'Career guidance with meaning.',
    body: isDa
      ? 'Book en fokuseret 60-minutters session med en professional fra AI, Banking, Management Consulting eller Private Equity. Du får konkret sparring, og hver betalt session bidrager med minimum 40% og op til 90% til Kræftens Bekæmpelse.'
      : 'Book a focused 60-minute session with a professional from AI, Banking, Management Consulting or Private Equity. You get concrete guidance, and every paid session contributes at least 40% and up to 90% to Kræftens Bekæmpelse.',
    primary: isDa ? 'Se profiler' : 'Browse profiles',
    secondary: isDa ? 'Forstå impact' : 'Understand impact',
  };

  const fields = [
    ['AI', 'bg-cyan-300', '/fields/ai'],
    ['Banking', 'bg-emerald-300', '/fields/banking'],
    ['Consulting', 'bg-blue-300', '/fields/consulting'],
    ['Private Equity', 'bg-lime-300', '/fields/private-equity'],
  ] as const;

  const signals = [
    ['60 min', isDa ? 'Fast format' : 'Fixed format', 'bg-cyan-300'],
    ['DKK 600-1.800', isDa ? 'Konkrete priser' : 'Concrete prices', 'bg-emerald-300'],
    ['40-90%', isDa ? 'Til Kræftens Bekæmpelse' : 'To Kræftens Bekæmpelse', 'bg-lime-300'],
  ] as const;

  const pathways = [
    [isDa ? 'Jeg skal skærpe mit materiale' : 'I need sharper materials', isDa ? 'CV, LinkedIn, ansøgning og fortælling.' : 'CV, LinkedIn, application and story.', 'CV / LinkedIn', 'bg-cyan-300'],
    [isDa ? 'Jeg har interview på vej' : 'I have interviews coming up', isDa ? 'Fit, kommunikation, spørgsmål og struktur.' : 'Fit, communication, questions and structure.', 'Interview prep', 'bg-emerald-300'],
    [isDa ? 'Jeg skal træne case eller technicals' : 'I need case or technical prep', isDa ? 'Cases, banking technicals og investment thinking.' : 'Cases, banking technicals and investment thinking.', 'Case / technicals', 'bg-blue-300'],
    [isDa ? 'Jeg mangler retning' : 'I need direction', isDa ? 'Rollevalg, felt, strategi og næste skridt.' : 'Role choice, field, strategy and next step.', 'Career direction', 'bg-lime-300'],
  ] as const;

  const profiles = [
    ['AI', 'AI Product Lead', isDa ? 'Førende AI-miljø' : 'Leading AI environment', isDa ? 'Positionering, portfolio, rollevalg' : 'Positioning, portfolio, role choice', 'DKK 900', 'min. DKK 360', 'bg-cyan-300'],
    ['Banking', 'Associate Director', isDa ? 'Global investment bank' : 'Global investment bank', isDa ? 'Technicals, fit, interviewbar' : 'Technicals, fit, interview bar', 'DKK 1.200', 'min. DKK 480', 'bg-emerald-300'],
    ['Management Consulting', 'Senior Consultant', isDa ? 'Tier-one strategy firm' : 'Tier-one strategy firm', isDa ? 'Casestruktur, hypoteser, fit' : 'Case structure, hypotheses, fit', 'DKK 1.100', 'min. DKK 440', 'bg-blue-300'],
    ['Private Equity', 'Investment Professional', isDa ? 'Nordisk PE-fond' : 'Nordic PE fund', isDa ? 'Investment case, deal thinking' : 'Investment case, deal thinking', 'DKK 1.500', 'min. DKK 600', 'bg-lime-300'],
  ] as const;

  const outputs = [
    [isDa ? 'Skarpere signal' : 'Sharper signal', isDa ? 'En tydeligere fortælling om hvorfor netop din profil passer til rollen.' : 'A clearer story for why your profile fits the role.'],
    [isDa ? 'Bedre forberedelse' : 'Better preparation', isDa ? 'Konkrete svar, cases, technicals eller interviewpunkter at træne videre på.' : 'Concrete answers, cases, technicals or interview points to keep practicing.'],
    [isDa ? 'Klarere næste skridt' : 'Clearer next step', isDa ? 'Et prioriteret valg af hvad du skal gøre efter sessionen.' : 'A prioritised view of what to do after the session.'],
  ] as const;

  const steps = [
    [isDa ? 'Vælg problem eller felt' : 'Choose problem or field', isDa ? 'Start med det du faktisk har brug for: materiale, interview, case, technicals eller retning.' : 'Start with what you actually need: materials, interview, case, technicals or direction.'],
    [isDa ? 'Vælg profil' : 'Choose profile', isDa ? 'Rolle, felt, output, pris og minimumsbidrag er tydeligt før booking.' : 'Role, field, output, price and minimum contribution are clear before booking.'],
    [isDa ? 'Send brief' : 'Send brief', isDa ? 'Fokus, fase, mål og materiale giver den professionelle bedre kontekst.' : 'Focus, stage, goal and material give the professional better context.'],
    [isDa ? 'Book 60 min' : 'Book 60 min', isDa ? 'Brug timen på det vigtigste, mens betalingen også bidrager.' : 'Use the hour on what matters most while the payment also contributes.'],
  ];

  const priceAnchors = [
    ['DKK 600', isDa ? 'Entry' : 'Entry', 'min. DKK 240'],
    ['DKK 900', isDa ? 'Core' : 'Core', 'min. DKK 360'],
    ['DKK 1.200', isDa ? 'Senior' : 'Senior', 'min. DKK 480'],
    ['DKK 1.800', isDa ? 'Expert' : 'Expert', 'min. DKK 720'],
  ] as const;

  const trust = [
    [isDa ? 'Ingen løfter om job' : 'No job promises', isDa ? 'Sessionen giver sparring, ikke garantier. Det holder produktet ærligt.' : 'The session gives guidance, not guarantees. That keeps the product honest.'],
    [isDa ? 'Tydelig pris før booking' : 'Clear price before booking', isDa ? 'Du ser pris, format og minimumsbidrag før du sender anmodningen.' : 'You see price, format and minimum contribution before sending the request.'],
    [isDa ? 'Uafhængig impact-model' : 'Independent impact model', isDa ? 'Naetwork beskriver bidraget transparent og er ikke officielt tilknyttet Kræftens Bekæmpelse, medmindre det fremgår eksplicit.' : 'Naetwork describes the contribution transparently and is not officially affiliated with Kræftens Bekæmpelse unless explicitly stated.'],
  ] as const;

  return (
    <>
      <section id="home" className="bg-white px-5 pt-28 sm:px-8 md:pt-40">
        <div className="mx-auto max-w-6xl">
          <p className="mb-8 text-xs font-black uppercase text-gray-400">{copy.eyebrow}</p>
          <h1 className="max-w-5xl text-7xl font-black leading-[0.88] tracking-tight text-gray-950 text-balance md:text-9xl">
            {copy.title}
          </h1>
          <div className="mt-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <p className="max-w-2xl text-base leading-relaxed text-gray-600 md:text-xl">{copy.body}</p>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link href="/professionals" className="inline-flex w-fit items-center justify-center rounded-lg bg-gray-950 px-6 py-3 text-sm font-black text-white transition-colors hover:bg-gray-800">
                {copy.primary}
              </Link>
              <Link href="/impact" className="inline-flex w-fit items-center justify-center rounded-lg border border-gray-200 px-6 py-3 text-sm font-black text-gray-950 transition-colors hover:border-gray-950">
                {copy.secondary}
              </Link>
            </div>
          </div>

          <div className="mt-16 max-w-2xl">
            <div className="grid h-2 grid-cols-4 overflow-hidden rounded-full bg-gray-100">
              {fields.map(([field, accent]) => (
                <span key={field} className={accent} />
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {fields.map(([field, accent, href]) => (
                <Link key={field} href={href} className="flex items-center gap-2 transition-opacity hover:opacity-70">
                  <span className={`h-2 w-2 rounded-full ${accent}`} />
                  <span className="text-xs font-black uppercase text-gray-500">{field}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-24 grid border-y border-gray-200 md:grid-cols-3">
            {signals.map(([value, label, accent]) => (
              <div key={label} className="border-b border-gray-200 py-5 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
                <span className={`mb-5 block h-1.5 w-10 rounded-full ${accent}`} />
                <p className="text-2xl font-black text-gray-950">{value}</p>
                <p className="mt-1 text-xs font-semibold text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-24 sm:px-8 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 grid gap-6 md:grid-cols-[0.85fr_1.15fr] md:items-end">
            <h2 className="text-5xl font-black leading-none tracking-tight text-gray-950 text-balance md:text-7xl">
              {isDa ? 'Start med problemet.' : 'Start with the problem.'}
            </h2>
            <p className="max-w-lg text-sm leading-relaxed text-gray-600 md:ml-auto md:text-base">
              {isDa
                ? 'Du behøver ikke vide præcis hvilken profil du skal vælge. Start med den situation, du står i.'
                : 'You do not need to know exactly which profile to choose. Start with the situation you are in.'}
            </p>
          </div>
          <div className="grid gap-px border border-gray-200 bg-gray-200 md:grid-cols-4">
            {pathways.map(([title, body, label, accent]) => (
              <Link key={title} href="/match" className="group bg-white p-6 transition-colors hover:bg-[#fafaf8]">
                <span className={`mb-10 block h-1.5 w-10 rounded-full ${accent}`} />
                <p className="text-xs font-black uppercase text-gray-400">{label}</p>
                <h3 className="mt-4 text-2xl font-black leading-tight tracking-tight text-gray-950">{title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-gray-600">{body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="market" className="border-y border-gray-200 bg-[#f7f7f4] px-5 py-24 sm:px-8 md:py-32">
        <div id="profile-universe" className="mx-auto max-w-6xl">
          <div className="mb-12 grid gap-6 md:grid-cols-[0.85fr_1.15fr] md:items-end">
            <h2 className="text-5xl font-black leading-none tracking-tight text-gray-950 text-balance md:text-7xl">
              {isDa ? 'Profiler som signal.' : 'Profiles as signal.'}
            </h2>
            <p className="max-w-lg text-sm leading-relaxed text-gray-600 md:ml-auto md:text-base">
              {isDa
                ? 'Et roligt indeks over hvem personen er, hvad sessionen kan bruges til, hvad timen koster, og hvordan den bidrager.'
                : 'A calm index of who the person is, what the session can be used for, what the hour costs, and how it contributes.'}
            </p>
          </div>

          <div className="border-t border-gray-200 bg-white">
            {profiles.map(([field, role, company, use, price, impact, accent]) => (
              <Link key={`${field}-${role}`} href="/professionals" className="group relative grid gap-4 border-b border-gray-200 py-6 transition-colors hover:bg-[#fafaf8] md:grid-cols-[190px_1fr_1fr_150px] md:items-center md:px-4">
                <span className={`absolute left-0 top-6 hidden h-10 w-1 rounded-full md:block ${accent}`} />
                <div className="flex items-center gap-3">
                  <span className={`h-2 w-8 rounded-full md:hidden ${accent}`} />
                  <p className="text-xs font-black uppercase text-gray-400">{field}</p>
                </div>
                <div>
                  <p className="text-xl font-black tracking-tight text-gray-950">{role}</p>
                  <p className="mt-1 text-sm font-semibold text-gray-500">{company}</p>
                </div>
                <p className="text-sm leading-relaxed text-gray-600">{use}</p>
                <div className="md:text-right">
                  <p className="text-sm font-black text-gray-950">{price}</p>
                  <p className="mt-1 text-[11px] font-black uppercase text-gray-400">{impact} impact</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-24 sm:px-8 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="mb-5 text-xs font-black uppercase text-gray-400">{isDa ? 'Output' : 'Output'}</p>
            <h2 className="text-5xl font-black leading-none tracking-tight text-gray-950 text-balance md:text-7xl">
              {isDa ? 'En god session bør gøre noget tydeligere.' : 'A good session should make something clearer.'}
            </h2>
          </div>
          <div className="border-t border-gray-200">
            {outputs.map(([title, body], index) => (
              <div key={title} className="grid gap-4 border-b border-gray-200 py-7 md:grid-cols-[80px_1fr]">
                <p className="text-xs font-black text-gray-300">0{index + 1}</p>
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-gray-950">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-gray-200 bg-[#f7f7f4] px-5 py-24 sm:px-8 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <h2 className="text-5xl font-black leading-none tracking-tight text-gray-950 text-balance md:text-7xl">
            {isDa ? 'Simpelt nok til at bruge. Seriøst nok til at virke.' : 'Simple enough to use. Serious enough to work.'}
          </h2>
          <div className="border-t border-gray-200">
            {steps.map(([title, body], index) => (
              <div key={title} className="grid gap-4 border-b border-gray-200 py-7 md:grid-cols-[80px_1fr]">
                <p className="text-xs font-black text-gray-300">0{index + 1}</p>
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-gray-950">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-gray-950 px-5 py-20 text-white sm:px-8 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="mb-5 text-xs font-black uppercase text-white/35">{isDa ? 'Pris og impact' : 'Price and impact'}</p>
              <h2 className="max-w-3xl text-5xl font-black leading-none tracking-tight text-white text-balance md:text-7xl">
                {isDa ? 'Konkret pris. Konkret bidrag.' : 'Concrete price. Concrete contribution.'}
              </h2>
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/55 md:text-base">
                {isDa
                  ? 'Professionals vælger en pris for 60 minutter. Af hver betalt session går minimum 40% og op til 90% til Kræftens Bekæmpelse.'
                  : 'Professionals choose a price for 60 minutes. From every paid session, at least 40% and up to 90% goes to Kræftens Bekæmpelse.'}
              </p>
              <div className="mt-8 grid h-2 max-w-xs grid-cols-4 overflow-hidden rounded-full bg-white/10">
                {fields.map(([field, accent]) => (
                  <span key={field} className={accent} />
                ))}
              </div>
            </div>
            <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-3 md:min-w-[520px]">
              {[
                ['60 min', isDa ? 'Session' : 'Session', 'bg-cyan-300'],
                ['DKK 600+', isDa ? 'Fra' : 'From', 'bg-emerald-300'],
                ['40-90%', isDa ? 'Impact' : 'Impact', 'bg-lime-300'],
              ].map(([value, label, accent]) => (
                <div key={label} className="bg-gray-950 p-5">
                  <span className={`mb-5 block h-1.5 w-8 rounded-full ${accent}`} />
                  <p className="text-2xl font-black text-white">{value}</p>
                  <p className="mt-1 text-xs font-semibold text-white/45">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-px border border-white/10 bg-white/10 md:grid-cols-4">
            {priceAnchors.map(([price, label, impact]) => (
              <div key={price} className="bg-gray-950 p-5">
                <p className="text-xs font-black uppercase text-white/35">{label}</p>
                <p className="mt-5 text-3xl font-black text-white">{price}</p>
                <p className="mt-2 text-sm text-white/50">{impact} {isDa ? 'til Kræftens Bekæmpelse som minimum' : 'to Kræftens Bekæmpelse as minimum'}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-24 sm:px-8 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 grid gap-6 md:grid-cols-[0.85fr_1.15fr] md:items-end">
            <h2 className="text-5xl font-black leading-none tracking-tight text-gray-950 text-balance md:text-7xl">
              {isDa ? 'Tillid før transaktion.' : 'Trust before transaction.'}
            </h2>
            <p className="max-w-lg text-sm leading-relaxed text-gray-600 md:ml-auto md:text-base">
              {isDa
                ? 'Naetwork skal være nemt at forstå før du booker. Ingen skjulte løfter, ingen uklar impact, ingen unødvendig friktion.'
                : 'Naetwork should be easy to understand before you book. No hidden promises, no unclear impact, no unnecessary friction.'}
            </p>
          </div>
          <div className="grid gap-px border border-gray-200 bg-gray-200 md:grid-cols-3">
            {trust.map(([title, body]) => (
              <div key={title} className="bg-white p-6">
                <p className="text-xl font-black tracking-tight text-gray-950">{title}</p>
                <p className="mt-4 text-sm leading-relaxed text-gray-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 pb-24 sm:px-8 md:pb-32">
        <div className="mx-auto max-w-6xl border-t border-gray-200 pt-10">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <h2 className="max-w-4xl text-5xl font-black leading-none tracking-tight text-gray-950 text-balance md:text-7xl">
              {isDa ? 'Find profilen. Book timen. Bidrag med mening.' : 'Find the profile. Book the hour. Contribute with meaning.'}
            </h2>
            <Link href="/professionals" className="inline-flex w-fit items-center justify-center rounded-lg bg-gray-950 px-6 py-3 text-sm font-black text-white transition-colors hover:bg-gray-800">
              {copy.primary}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
