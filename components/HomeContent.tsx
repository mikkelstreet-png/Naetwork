'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export function HomeContent() {
  const { lang } = useLanguage();
  const isDa = lang === 'da';

  const heroStats = [
    ['60 min', isDa ? 'Fokuseret session' : 'Focused session'],
    ['DKK 600+', isDa ? 'Konkrete priser' : 'Concrete prices'],
    ['40-90%', isDa ? 'Til Kræftens Bekæmpelse' : 'To Kræftens Bekæmpelse'],
  ] as const;

  const fields = [
    ['AI', '/fields/ai', 'bg-cyan-300', isDa ? 'AI product, strategy, portfolio og rollevalg.' : 'AI product, strategy, portfolio and role choice.'],
    ['Banking', '/fields/banking', 'bg-emerald-300', isDa ? 'Technicals, fit, CV og investment banking-processen.' : 'Technicals, fit, CV and the investment banking process.'],
    ['Management Consulting', '/fields/consulting', 'bg-blue-300', isDa ? 'Cases, hypoteser, kommunikation og fit.' : 'Cases, hypotheses, communication and fit.'],
    ['Private Equity', '/fields/private-equity', 'bg-lime-300', isDa ? 'Investment cases, deal thinking og PE-interviews.' : 'Investment cases, deal thinking and PE interviews.'],
  ] as const;

  const moments = [
    [isDa ? 'Materiale' : 'Materials', isDa ? 'CV, LinkedIn, ansøgning og personlig fortælling.' : 'CV, LinkedIn, application and personal story.'],
    [isDa ? 'Interview' : 'Interview', isDa ? 'Svar, struktur, fit og spørgsmål med mere præcision.' : 'Answers, structure, fit and questions with more precision.'],
    [isDa ? 'Case / technicals' : 'Case / technicals', isDa ? 'Træn den type pres, der faktisk møder dig.' : 'Practice the kind of pressure you will actually face.'],
    [isDa ? 'Retning' : 'Direction', isDa ? 'Vælg felt, rolle og næste skridt med mere ro.' : 'Choose field, role and next step with more calm.'],
  ] as const;

  const profileRows = [
    ['AI', 'AI Product Lead', isDa ? 'Portfolio, rollevalg og AI-positionering' : 'Portfolio, role choice and AI positioning', 'DKK 900', 'min. DKK 360', 'bg-cyan-300'],
    ['Banking', 'Associate Director', isDa ? 'Technicals, fit og interviewbar' : 'Technicals, fit and interview bar', 'DKK 1.200', 'min. DKK 480', 'bg-emerald-300'],
    ['Consulting', 'Senior Consultant', isDa ? 'Casestruktur, hypoteser og fit' : 'Case structure, hypotheses and fit', 'DKK 1.100', 'min. DKK 440', 'bg-blue-300'],
    ['Private Equity', 'Investment Professional', isDa ? 'Investment case og deal thinking' : 'Investment case and deal thinking', 'DKK 1.500', 'min. DKK 600', 'bg-lime-300'],
  ] as const;

  const priceAnchors = [
    ['DKK 600', isDa ? 'Entry' : 'Entry', 'min. DKK 240'],
    ['DKK 900', isDa ? 'Core' : 'Core', 'min. DKK 360'],
    ['DKK 1.200', isDa ? 'Senior' : 'Senior', 'min. DKK 480'],
    ['DKK 1.800', isDa ? 'Expert' : 'Expert', 'min. DKK 720'],
  ] as const;

  const proof = [
    [isDa ? 'Ingen jobgarantier' : 'No job guarantees', isDa ? 'Produktet lover sparring, forberedelse og klarhed. Ikke et bestemt udfald.' : 'The product promises guidance, preparation and clarity. Not a specific outcome.'],
    [isDa ? 'Pris før booking' : 'Price before booking', isDa ? 'Kandidaten ser pris, format og minimumsbidrag før anmodningen sendes.' : 'Candidates see price, format and minimum contribution before sending the request.'],
    [isDa ? 'Smal kategori' : 'Narrow category', isDa ? 'AI, Banking, Management Consulting og Private Equity gør universet lettere at sammenligne.' : 'AI, Banking, Management Consulting and Private Equity make the universe easier to compare.'],
  ] as const;

  return (
    <>
      <section id="home" className="bg-white px-5 pt-28 sm:px-8 md:pt-36">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_390px] lg:items-end">
            <div>
              <p className="mb-7 text-xs font-black uppercase text-gray-400">Naetwork</p>
              <h1 className="max-w-5xl text-6xl font-black leading-[0.9] text-gray-950 text-balance md:text-8xl">
                {isDa ? 'Karrieresparring med mening.' : 'Career guidance with meaning.'}
              </h1>
              <p className="mt-8 max-w-2xl text-base leading-relaxed text-gray-600 md:text-xl">
                {isDa
                  ? 'Book en fokuseret 60-minutters session med en professional fra AI, Banking, Management Consulting eller Private Equity. Få konkret sparring, mens hver betalt session bidrager med minimum 40% og op til 90% til Kræftens Bekæmpelse.'
                  : 'Book a focused 60-minute session with a professional from AI, Banking, Management Consulting or Private Equity. Get concrete guidance while every paid session contributes at least 40% and up to 90% to Kræftens Bekæmpelse.'}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/professionals" className="inline-flex items-center justify-center rounded-lg bg-gray-950 px-6 py-3 text-sm font-black text-white transition-colors hover:bg-gray-800">
                  {isDa ? 'Se profiler' : 'Browse profiles'}
                </Link>
                <Link href="/match" className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-6 py-3 text-sm font-black text-gray-950 transition-colors hover:border-gray-950 hover:bg-[#fafaf8]">
                  {isDa ? 'Find fokus' : 'Find focus'}
                </Link>
              </div>
            </div>

            <aside className="border border-gray-200 bg-[#f7f7f4] p-4">
              <div className="grid h-2 grid-cols-4 overflow-hidden rounded-full bg-gray-200">
                {fields.map(([field, , accent]) => <span key={field} className={accent} />)}
              </div>
              <div className="mt-6 border-y border-gray-200 py-5">
                <p className="text-xs font-black uppercase text-gray-400">{isDa ? 'Session brief' : 'Session brief'}</p>
                <p className="mt-3 text-2xl font-black leading-tight text-gray-950">
                  {isDa ? 'Én time. Ét klart problem. Én bedre næste handling.' : 'One hour. One clear problem. One better next action.'}
                </p>
              </div>
              <div className="mt-5 grid gap-px border border-gray-200 bg-gray-200">
                {heroStats.map(([value, label]) => (
                  <div key={label} className="grid grid-cols-[110px_1fr] bg-white p-4">
                    <p className="text-lg font-black text-gray-950">{value}</p>
                    <p className="text-sm font-semibold text-gray-500">{label}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>

          <div className="mt-20 grid border-y border-gray-200 md:grid-cols-4">
            {fields.map(([field, href, accent, body]) => (
              <Link key={field} href={href} className="group border-b border-gray-200 py-6 transition-colors hover:bg-[#fafaf8] md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
                <span className={`mb-8 block h-1.5 w-10 rounded-full ${accent}`} />
                <p className="text-xl font-black text-gray-950">{field}</p>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
            <div>
              <p className="mb-5 text-xs font-black uppercase text-gray-400">{isDa ? 'Hvor starter man?' : 'Where to start?'}</p>
              <h2 className="text-5xl font-black leading-none text-gray-950 text-balance md:text-7xl">
                {isDa ? 'Start ikke med profilen. Start med presset.' : 'Do not start with the profile. Start with the pressure.'}
              </h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-gray-600 md:text-base">
                {isDa
                  ? 'Naetwork skal føles let: vælg hvad timen skal løse, og lad felt, profil og brief blive mere præcist derfra.'
                  : 'Naetwork should feel simple: choose what the hour should solve, then let field, profile and brief become sharper from there.'}
              </p>
            </div>
            <div className="border-t border-gray-200">
              {moments.map(([title, body], index) => (
                <Link key={title} href="/match" className="grid gap-4 border-b border-gray-200 py-6 transition-colors hover:bg-[#fafaf8] md:grid-cols-[72px_1fr]">
                  <p className="text-xs font-black text-gray-300">0{index + 1}</p>
                  <div>
                    <h3 className="text-2xl font-black text-gray-950">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="profile-universe" className="border-y border-gray-200 bg-[#f7f7f4] px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-end">
            <h2 className="text-5xl font-black leading-none text-gray-950 text-balance md:text-7xl">
              {isDa ? 'Et profilunivers der kan scannes.' : 'A profile universe built to scan.'}
            </h2>
            <p className="max-w-lg text-sm leading-relaxed text-gray-600 md:ml-auto md:text-base">
              {isDa
                ? 'Rolle, felt, output, pris og impact skal være tydeligt på få sekunder. Det er sådan platformen føles premium uden at blive tung.'
                : 'Role, field, output, price and impact should be clear in seconds. That is how the platform feels premium without becoming heavy.'}
            </p>
          </div>

          <div className="border-t border-gray-200 bg-white">
            {profileRows.map(([field, role, output, price, impact, accent]) => (
              <Link key={`${field}-${role}`} href={`/professionals?field=${encodeURIComponent(field === 'Consulting' ? 'Management Consulting' : field)}`} className="relative grid gap-4 border-b border-gray-200 py-6 transition-colors hover:bg-[#fafaf8] md:grid-cols-[180px_1fr_1fr_150px] md:items-center md:px-4">
                <span className={`absolute left-0 top-6 hidden h-10 w-1 rounded-full md:block ${accent}`} />
                <p className="text-xs font-black uppercase text-gray-400">{field}</p>
                <div>
                  <p className="text-xl font-black text-gray-950">{role}</p>
                  <p className="mt-1 text-sm font-semibold text-gray-500">60 min</p>
                </div>
                <p className="text-sm leading-relaxed text-gray-600">{output}</p>
                <div className="md:text-right">
                  <p className="text-sm font-black text-gray-950">{price}</p>
                  <p className="mt-1 text-[11px] font-black uppercase text-gray-400">{impact} impact</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-gray-950 px-5 py-20 text-white sm:px-8 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="mb-5 text-xs font-black uppercase text-white/35">{isDa ? 'Pris og mening' : 'Price and meaning'}</p>
              <h2 className="max-w-3xl text-5xl font-black leading-none text-white text-balance md:text-7xl">
                {isDa ? 'Prisen starter konkret. Bidraget gør det større.' : 'The price starts concrete. The contribution makes it larger.'}
              </h2>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
                {isDa
                  ? 'Professionals kan typisk ligge mellem DKK 600 og DKK 1.800 for 60 minutter. Minimum 40% af hver betalt session går til Kræftens Bekæmpelse, og bidraget kan være helt op til 90%.'
                  : 'Professionals can typically sit between DKK 600 and DKK 1,800 for 60 minutes. At least 40% from every paid session goes to Kræftens Bekæmpelse, and the contribution can be as high as 90%.'}
              </p>
            </div>
            <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-3">
              {heroStats.map(([value, label]) => (
                <div key={label} className="bg-gray-950 p-5">
                  <p className="text-2xl font-black text-white">{value}</p>
                  <p className="mt-2 text-xs font-semibold text-white/45">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-px border border-white/10 bg-white/10 md:grid-cols-4">
            {priceAnchors.map(([price, label, impact]) => (
              <div key={price} className="bg-gray-950 p-5">
                <p className="text-xs font-black uppercase text-white/35">{label}</p>
                <p className="mt-5 text-3xl font-black text-white">{price}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{impact} {isDa ? 'som minimumsbidrag' : 'minimum contribution'}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-end">
            <h2 className="text-5xl font-black leading-none text-gray-950 text-balance md:text-7xl">
              {isDa ? 'Seriøst uden at larme.' : 'Serious without the noise.'}
            </h2>
            <p className="max-w-lg text-sm leading-relaxed text-gray-600 md:ml-auto md:text-base">
              {isDa
                ? 'Det bedste design her er ikke mere pynt. Det er mere klarhed: hvad du får, hvad det koster, hvad det bidrager til, og hvad platformen ikke lover.'
                : 'The best design here is not more decoration. It is more clarity: what you get, what it costs, what it contributes to, and what the platform does not promise.'}
            </p>
          </div>
          <div className="grid gap-px border border-gray-200 bg-gray-200 md:grid-cols-3">
            {proof.map(([title, body]) => (
              <div key={title} className="bg-white p-6">
                <p className="text-xl font-black text-gray-950">{title}</p>
                <p className="mt-4 text-sm leading-relaxed text-gray-600">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 border-t border-gray-200 pt-10">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
              <h2 className="max-w-4xl text-5xl font-black leading-none text-gray-950 text-balance md:text-7xl">
                {isDa ? 'Find profilen. Book timen. Gør karrieresparring meningsfuld.' : 'Find the profile. Book the hour. Make career guidance meaningful.'}
              </h2>
              <Link href="/professionals" className="inline-flex w-fit items-center justify-center rounded-lg bg-gray-950 px-6 py-3 text-sm font-black text-white transition-colors hover:bg-gray-800">
                {isDa ? 'Se profiler' : 'Browse profiles'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
