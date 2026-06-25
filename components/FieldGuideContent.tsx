'use client';

import Link from 'next/link';
import { FIELD_GUIDES, profileHrefForField } from '@/lib/fieldGuides';
import { ECONOMICS, formatDkk } from '@/lib/economics';
import type { FieldSlug } from '@/lib/fieldGuides';

export function FieldGuideContent({ slug }: { slug: FieldSlug }) {
  const field = FIELD_GUIDES[slug];

  const stats = [
    [`${ECONOMICS.sessionMinutes} min`, 'Fast format'],
    [`${formatDkk(ECONOMICS.minPriceDkk)}+`, 'Konkrete priser'],
    [`${ECONOMICS.charityPercent}/${ECONOMICS.professionalPercent}/${ECONOMICS.platformPercent}`, 'Fast fordeling'],
  ] as const;

  return (
    <main className="bg-white pt-16">
      <section className="border-b border-gray-200 bg-white px-5 py-16 sm:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Link href="/" className="mb-10 inline-flex text-sm font-black text-gray-500 transition-colors hover:text-gray-950">&larr; Naetwork</Link>
          <span className={`mb-8 block h-2 w-24 ${field.accent}`} />
          <p className="mb-5 text-xs font-black uppercase text-gray-400">Feltguide</p>
          <h1 className="max-w-5xl text-5xl font-black leading-[0.9] text-gray-950 text-balance md:text-8xl">{field.title.da}</h1>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">{field.description.da}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={profileHrefForField(slug)} className="inline-flex rounded-lg bg-gray-950 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-gray-800">
              Se relevante profiler
            </Link>
            <Link href="/match" className="inline-flex rounded-lg border border-gray-200 px-5 py-3 text-sm font-black text-gray-950 transition-colors hover:border-gray-950">
              Find fokus
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <p className="mb-5 text-xs font-black uppercase text-gray-400">Sessionens fokus</p>
            <h2 className="text-4xl font-black leading-tight text-gray-950 text-balance md:text-5xl">Én fokuseret time, bygget omkring din næste beslutning.</h2>
            <p className="mt-5 text-sm leading-relaxed text-gray-600">{field.sessionFocus.da}</p>
            <div className="mt-8 grid gap-px border border-gray-200 bg-gray-200">
              {stats.map(([value, label]) => (
                <div key={label} className="bg-[#f7f7f4] p-5">
                  <p className="text-2xl font-black text-gray-950">{value}</p>
                  <p className="mt-1 text-xs font-black uppercase text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          </aside>

          <div className="space-y-10">
            <section>
              <p className="mb-5 text-xs font-black uppercase text-gray-400">Bedst til</p>
              <div className="grid gap-px border border-gray-200 bg-gray-200 sm:grid-cols-2">
                {field.bestFor.da.map((item) => (
                  <div key={item} className="bg-white p-6">
                    <span className={`mb-8 block h-1.5 w-10 ${field.accent}`} />
                    <p className="text-lg font-black text-gray-950">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="mb-5 text-xs font-black uppercase text-gray-400">Mulige outputs</p>
              <div className="border-t border-gray-200">
                {field.outputs.da.map((item, index) => (
                  <div key={item} className="grid gap-4 border-b border-gray-200 py-6 md:grid-cols-[70px_1fr]">
                    <p className="text-xs font-black text-gray-300">0{index + 1}</p>
                    <p className="text-xl font-black text-gray-950">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-y border-gray-200 py-8">
              <p className="mb-4 text-xs font-black uppercase text-gray-400">Sådan fordeles betalingen</p>
              <p className="max-w-2xl text-sm leading-relaxed text-gray-600">
                Hver betalt Naetwork-session fordeles med {ECONOMICS.charityPercent}% til {ECONOMICS.charityName}, {ECONOMICS.professionalPercent}% til eksperten og {ECONOMICS.platformPercent}% til platformen. Reglen styres fra én fælles konfiguration.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
