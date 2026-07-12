'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { FIELD_GUIDES, profileHrefForField } from '@/lib/fieldGuides';
import type { FieldSlug } from '@/lib/fieldGuides';
import { CONTRIBUTION_MAX, CONTRIBUTION_MIN, INDUSTRIES, PRICE_MAX, PRICE_MIN, SESSION_MINUTES, formatDkk } from '@/lib/platform';

export function FieldGuideContent({ slug }: { slug: FieldSlug }) {
  const { lang } = useLanguage();
  const isDa = lang === 'da';
  const field = FIELD_GUIDES[slug];
  const locale = isDa ? 'da' : 'en';
  const surface = INDUSTRIES.find((industry) => industry.slug === slug)?.surface ?? 'bg-gray-100';

  return (
    <main className="bg-white">
      <section className={`border-b border-black/15 px-5 py-10 sm:px-8 md:py-20 lg:px-12 ${surface}`}>
        <div className="mx-auto grid max-w-[82rem] gap-10 lg:grid-cols-[1fr_370px] lg:items-end lg:gap-16">
          <div>
            <Link href="/" className="mb-8 inline-flex text-sm font-black text-gray-500 transition-colors hover:text-gray-950">&larr; Naetwork</Link>
            <div className="signal-rail mb-7 max-w-24"><span /><span /><span /><span /></div>
            <p className="kicker mb-5">{isDa ? 'Feltguide' : 'Field guide'}</p>
            <h1 className="max-w-5xl text-4xl font-medium leading-[0.96] text-gray-950 text-balance sm:text-6xl md:text-7xl">{field.title[locale]}</h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">{field.description[locale]}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={profileHrefForField(slug)} className="button-primary">
                {isDa ? 'Se relevante profiler' : 'Browse relevant profiles'}
              </Link>
              <Link href="/start" className="button-secondary">
                {isDa ? 'Start med din situation' : 'Start with your situation'}
              </Link>
            </div>
          </div>
          <aside className="flex min-h-[290px] flex-col justify-between border border-black bg-[#09090b] p-6 text-white">
            <p className="editorial-label text-white/40">{field.label}</p>
            <dl className="border-t border-white/15">
              {[
                [`${SESSION_MINUTES} min`, isDa ? 'Fleksibelt format' : 'Flexible format'],
                [`${formatDkk(PRICE_MIN)}-${formatDkk(PRICE_MAX).replace('DKK ', '')}`, isDa ? 'Pris inkl. moms' : 'Price incl. VAT'],
                [`${CONTRIBUTION_MIN}-${CONTRIBUTION_MAX}%`, isDa ? 'Af pris ekskl. moms' : 'Of price excl. VAT'],
              ].map(([value, label]) => <div key={label} className="flex items-center justify-between gap-4 border-b border-white/15 py-3"><dt className="text-xs font-semibold text-white/45">{label}</dt><dd className="text-sm font-bold text-white">{value}</dd></div>)}
            </dl>
          </aside>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 md:py-24 lg:px-12">
        <div className="mx-auto grid max-w-[82rem] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <p className="kicker mb-5">{isDa ? 'Sessionens fokus' : 'Session focus'}</p>
            <h2 className="text-3xl font-semibold leading-[1.04] text-gray-950 text-balance sm:text-4xl md:text-5xl">
              {isDa ? 'Én fokuseret time, bygget omkring din næste beslutning.' : 'One focused hour, built around your next decision.'}
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-gray-600">{field.sessionFocus[locale]}</p>
          </aside>

          <div className="space-y-10">
            <section>
              <p className="kicker mb-5">{isDa ? 'Bedst til' : 'Best for'}</p>
              <div className="grid gap-px border border-gray-200 bg-gray-200 sm:grid-cols-2">
                {field.bestFor[locale].map((item) => (
                  <div key={item} className="bg-white p-6">
                    <span className={`mb-8 block h-1.5 w-10 rounded-full ${field.accent}`} />
                    <p className="text-lg font-semibold text-gray-950">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="kicker mb-5">{isDa ? 'Mulige outputs' : 'Possible outputs'}</p>
              <div className="border-t border-gray-200">
                {field.outputs[locale].map((item, index) => (
                  <div key={item} className="grid gap-4 border-b border-gray-200 py-6 md:grid-cols-[70px_1fr]">
                    <p className="text-xs font-black text-gray-300">0{index + 1}</p>
                    <p className="text-xl font-semibold text-gray-950">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-y border-gray-200 py-8">
              <p className="mb-4 text-xs font-black uppercase text-gray-400">{isDa ? 'Bidrag' : 'Impact'}</p>
              <p className="max-w-2xl text-sm leading-relaxed text-gray-600">
                {isDa
                  ? '40%, 60%, 80% eller 90% af sessionsprisen eksklusive moms afsættes efter en gennemført, betalt session. Totalpris og det konkrete bidrag vises før anmodningen.'
                  : '40%, 60%, 80% or 90% of the session price excluding VAT is allocated after a completed, paid session. The total price and exact contribution are shown before the request.'}
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
