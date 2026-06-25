'use client';

import Link from 'next/link';
import { ECONOMICS } from '@/lib/economics';

export function MissionContent() {
  const principles = [
    ['Adgang bør være mindre tilfældig', 'Stærke kandidater bør ikke være afhængige af en varm intro for at forstå krævende karriereveje.'],
    ['Sparring bør være specifik', 'Værdien er ikke generel inspiration. Det er kontekst fra en person, der kender barren.'],
    ['Forberedelse bør være konkret', 'En god session skal skabe skarpere materiale, bedre svar, mere ro eller et klarere næste skridt.'],
    ['Karrieresparring bør have mening', `Hver betalt session fordeles med ${ECONOMICS.charityPercent}% til ${ECONOMICS.charityName}, ${ECONOMICS.professionalPercent}% til eksperten og ${ECONOMICS.platformPercent}% til platformen.`],
  ] as const;

  const product = ['60 min', 'AI', 'Banking', 'Consulting', 'Private Equity', `${ECONOMICS.charityPercent}/${ECONOMICS.professionalPercent}/${ECONOMICS.platformPercent}`] as const;

  return (
    <main className="page-shell">
      <section className="border-b border-gray-200 bg-white px-5 py-14 sm:px-8 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_380px] lg:items-end">
          <div>
            <p className="kicker mb-5">Mission</p>
            <h1 className="display-xl max-w-5xl">Adgang til karrieresparring bør ikke afhænge af hvem du kender.</h1>
            <p className="body-lg mt-7 max-w-2xl">Naetwork gør uformel insider-sparring til et fokuseret produkt: én professional, ét brief, én 60-minutters session, ét klarere næste skridt og én transparent fordeling.</p>
          </div>
          <aside className="premium-panel p-5">
            <p className="kicker">Produktstandpunkt</p>
            <p className="mt-4 text-3xl font-black leading-tight text-gray-950">Simpelt på overfladen. Seriøst nedenunder.</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {product.map((item) => (
                <span key={item} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-black text-gray-600">{item}</span>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="kicker mb-5">Principper</p>
            <h2 className="display-lg">Det skal være nemt at forstå, svært at forveksle.</h2>
          </div>
          <div className="border-t border-gray-200">
            {principles.map(([title, body], index) => (
              <article key={title} className="grid gap-4 border-b border-gray-200 py-7 md:grid-cols-[72px_1fr]">
                <p className="text-xs font-black text-gray-300">0{index + 1}</p>
                <div>
                  <h3 className="text-2xl font-black text-gray-950">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-3 sm:flex-row">
          <Link href="/match" className="pill-dark">Prøv match</Link>
          <Link href="/professionals" className="pill-light">Se profiler</Link>
        </div>
      </section>
    </main>
  );
}
