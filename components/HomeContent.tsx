'use client';

import Link from 'next/link';
import { ECONOMICS, formatDkk, splitPayment } from '@/lib/economics';

export function HomeContent() {
  const heroStats = [
    [`${ECONOMICS.sessionMinutes} min`, 'Fokuseret session'],
    [`${formatDkk(ECONOMICS.minPriceDkk)}+`, 'Konkrete priser'],
    [`${ECONOMICS.charityPercent}/${ECONOMICS.professionalPercent}/${ECONOMICS.platformPercent}`, 'Fast fordeling'],
  ] as const;

  const fields = [
    ['AI', '/fields/ai', 'bg-cyan-300', 'AI product, strategy, portfolio og rollevalg.'],
    ['Banking', '/fields/banking', 'bg-emerald-300', 'Technicals, fit, CV og investment banking-processen.'],
    ['Management Consulting', '/fields/consulting', 'bg-blue-300', 'Cases, hypoteser, kommunikation og fit.'],
    ['Private Equity', '/fields/private-equity', 'bg-lime-300', 'Investment cases, deal thinking og PE-interviews.'],
  ] as const;

  const moments = [
    ['Materiale', 'CV, LinkedIn, ansøgning og personlig fortælling.'],
    ['Interview', 'Svar, struktur, fit og spørgsmål med mere præcision.'],
    ['Case / technicals', 'Træn den type pres, der faktisk møder dig.'],
    ['Retning', 'Vælg felt, rolle og næste skridt med mere ro.'],
  ] as const;

  const profileRows = [
    ['AI', 'AI Product Lead', '1-sides action-plan med rolle-shortlist og proof points.', 900, 'bg-cyan-300'],
    ['Banking', 'Associate Director', '1-sides action-plan med technicals, fit-story og interviewbar.', 1200, 'bg-emerald-300'],
    ['Consulting', 'Senior Consultant', '1-sides action-plan med casestruktur, hypoteser og fit-svar.', 1100, 'bg-blue-300'],
    ['Private Equity', 'Investment Professional', '1-sides action-plan med investment case og deal thinking.', 1500, 'bg-lime-300'],
  ] as const;

  const priceAnchors = [600, 900, 1200, 1800] as const;

  const outputPromise = [
    ['Næste skridt', 'Hvad du konkret bør gøre efter sessionen.'],
    ['3 prioriteter', 'Hvad der betyder mest for dit CV, interview, case eller rollevalg.'],
    ['Ressourcer', 'Konkrete materialer, spørgsmål eller øvelser at arbejde videre med.'],
  ] as const;

  const testimonials = [
    ['Placeholder: kandidat', 'Banking', '“Sessionen gjorde det tydeligt, hvad jeg skulle skærpe før næste interview.”'],
    ['Placeholder: kandidat', 'Consulting', '“Jeg gik derfra med en mere konkret casestruktur og tre klare træningspunkter.”'],
    ['Placeholder: kandidat', 'AI', '“Det blev meget lettere at forklare min profil til AI-roller uden at lyde generisk.”'],
  ] as const;

  const proof = [
    ['Ingen jobgarantier', 'Produktet lover sparring, forberedelse og klarhed. Ikke et bestemt udfald.'],
    ['Pris før booking', 'Kandidaten ser pris, format og fordeling før anmodningen sendes.'],
    ['Smal kategori', 'AI, Banking, Management Consulting og Private Equity gør universet lettere at sammenligne.'],
  ] as const;

  return (
    <>
      <section id="home" className="bg-white px-5 pt-28 sm:px-8 md:pt-36">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_390px] lg:items-end">
            <div>
              <p className="mb-7 text-xs font-black uppercase text-gray-400">Naetwork</p>
              <h1 className="max-w-5xl text-5xl font-black leading-[0.9] text-gray-950 text-balance md:text-8xl">
                Karrieresparring med mening.
              </h1>
              <p className="mt-8 max-w-2xl text-base leading-relaxed text-gray-600 md:text-xl">
                Book en fokuseret 60-minutters session med en professional fra AI, Banking, Management Consulting eller Private Equity. Hver betalt session fordeles transparent mellem {ECONOMICS.charityName}, eksperten og platformen.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/professionals" className="inline-flex items-center justify-center rounded-lg bg-gray-950 px-6 py-3 text-sm font-black text-white transition-colors hover:bg-gray-800">
                  Se profiler
                </Link>
                <Link href="/match" className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-6 py-3 text-sm font-black text-gray-950 transition-colors hover:border-gray-950 hover:bg-[#fafaf8]">
                  Find fokus
                </Link>
              </div>
            </div>

            <aside className="border border-gray-200 bg-[#f7f7f4] p-4">
              <div className="grid h-2 grid-cols-4 overflow-hidden rounded-full bg-gray-200">
                {fields.map(([field, , accent]) => <span key={field} className={accent} />)}
              </div>
              <div className="mt-6 border-y border-gray-200 py-5">
                <p className="text-xs font-black uppercase text-gray-400">Session brief</p>
                <p className="mt-3 text-2xl font-black leading-tight text-gray-950">Én time. Ét klart problem. Én 1-sides action-plan.</p>
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
              <p className="mb-5 text-xs font-black uppercase text-gray-400">Hvor starter man?</p>
              <h2 className="text-5xl font-black leading-none text-gray-950 text-balance md:text-7xl">Start ikke med profilen. Start med presset.</h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-gray-600 md:text-base">Vælg hvad timen skal løse, og lad felt, profil og brief blive mere præcist derfra.</p>
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
            <h2 className="text-5xl font-black leading-none text-gray-950 text-balance md:text-7xl">Et profilunivers der kan scannes.</h2>
            <p className="max-w-lg text-sm leading-relaxed text-gray-600 md:ml-auto md:text-base">Rolle, felt, output, pris og fordeling skal være tydeligt på få sekunder.</p>
          </div>

          <div className="border-t border-gray-200 bg-white">
            {profileRows.map(([field, role, output, price, accent]) => {
              const split = splitPayment(price)
              return (
                <Link key={`${field}-${role}`} href={`/professionals?field=${encodeURIComponent(field === 'Consulting' ? 'Management Consulting' : field)}`} className="relative grid gap-4 border-b border-gray-200 py-6 transition-colors hover:bg-[#fafaf8] md:grid-cols-[180px_1fr_1fr_190px] md:items-center md:px-4">
                  <span className={`absolute left-0 top-6 hidden h-10 w-1 rounded-full md:block ${accent}`} />
                  <p className="text-xs font-black uppercase text-gray-400">{field}</p>
                  <div>
                    <p className="text-xl font-black text-gray-950">{role}</p>
                    <p className="mt-1 text-sm font-semibold text-gray-500">60 min</p>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600">{output}</p>
                  <div className="md:text-right">
                    <p className="text-sm font-black text-gray-950">{formatDkk(price)}</p>
                    <p className="mt-1 text-[11px] font-black uppercase text-gray-400">{formatDkk(split.charity)} til formål</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <div>
            <p className="mb-5 text-xs font-black uppercase text-gray-400">Hvad du sidder med bagefter</p>
            <h2 className="text-5xl font-black leading-none text-gray-950 text-balance md:text-7xl">En session skal ende i konkret handling.</h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-gray-600 md:text-base">Standard-outputtet er en 1-sides action-plan. Det gør værdien mere konkret end “gode råd”.</p>
          </div>
          <div className="grid gap-px border border-gray-200 bg-gray-200 md:grid-cols-3 lg:grid-cols-1">
            {outputPromise.map(([title, body]) => (
              <div key={title} className="bg-[#f7f7f4] p-6">
                <p className="text-xl font-black text-gray-950">{title}</p>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-gray-950 px-5 py-20 text-white sm:px-8 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="mb-5 text-xs font-black uppercase text-white/35">Pris og fordeling</p>
              <h2 className="max-w-3xl text-5xl font-black leading-none text-white text-balance md:text-7xl">Én regel. Vist alle steder.</h2>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/55 md:text-base">Mikkel kan ændre fordelingsreglen ét sted. Alle priser på platformen følger samme konfiguration.</p>
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
            {priceAnchors.map((price) => {
              const split = splitPayment(price)
              return (
                <div key={price} className="bg-gray-950 p-5">
                  <p className="text-xs font-black uppercase text-white/35">{formatDkk(price)}</p>
                  <p className="mt-5 text-2xl font-black text-white">{formatDkk(split.charity)}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">til {ECONOMICS.charityName}</p>
                  <p className="mt-4 text-xs leading-relaxed text-white/40">{formatDkk(split.professional)} til eksperten · {formatDkk(split.platform)} til platformen</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-end">
            <h2 className="text-5xl font-black leading-none text-gray-950 text-balance md:text-7xl">Tidlig proof uden at fake traction.</h2>
            <p className="max-w-lg text-sm leading-relaxed text-gray-600 md:ml-auto md:text-base">Testimonials er markeret som placeholders, og sessions-tallet kommer fra config, så det kan blive real-data-ready uden falsk signal.</p>
          </div>
          <div className="mb-8 grid gap-px border border-gray-200 bg-gray-200 md:grid-cols-4">
            <div className="bg-[#f7f7f4] p-6 md:col-span-1">
              <p className="text-xs font-black uppercase text-gray-400">Sessioner</p>
              <p className="mt-4 text-4xl font-black text-gray-950">{ECONOMICS.sessionsCompletedLabel}</p>
              <p className="mt-2 text-sm text-gray-500">Config-drevet placeholder</p>
            </div>
            {testimonials.map(([name, field, quote]) => (
              <div key={`${name}-${field}`} className="bg-white p-6">
                <p className="text-xs font-black uppercase text-gray-400">{field}</p>
                <p className="mt-4 text-sm leading-relaxed text-gray-700">{quote}</p>
                <p className="mt-5 text-sm font-black text-gray-950">{name}</p>
              </div>
            ))}
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
              <h2 className="max-w-4xl text-5xl font-black leading-none text-gray-950 text-balance md:text-7xl">Find profilen. Book timen. Gør karrieresparring meningsfuld.</h2>
              <Link href="/professionals" className="inline-flex w-fit items-center justify-center rounded-lg bg-gray-950 px-6 py-3 text-sm font-black text-white transition-colors hover:bg-gray-800">
                Se profiler
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
