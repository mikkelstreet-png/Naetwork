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
      <section className="border-b border-gray-200 bg-white px-5 py-10 sm:px-8 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_340px] lg:items-end lg:gap-14">
          <div>
            <Link href="/" className="mb-8 inline-flex text-sm font-black text-gray-500 transition-colors hover:text-gray-950">&larr; Naetwork</Link>
            <p className="mb-4 text-xs font-black uppercase text-gray-400">{isDa ? 'Feltguide' : 'Field guide'}</p>
            <h1 className="max-w-5xl text-4xl font-black leading-none text-gray-950 text-balance sm:text-5xl md:text-7xl">{field.title[locale]}</h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">{field.description[locale]}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={profileHrefForField(slug)} className="inline-flex rounded-lg bg-gray-950 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-gray-800">
                {isDa ? 'Se relevante profiler' : 'Browse relevant profiles'}
              </Link>
              <Link href="/match" className="inline-flex rounded-lg border border-gray-200 px-5 py-3 text-sm font-black text-gray-950 transition-colors hover:border-gray-950">
                {isDa ? 'Find dit fokus' : 'Find your focus'}
              </Link>
            </div>
          </div>
          <aside className={`flex min-h-[250px] flex-col justify-between rounded-lg p-6 text-gray-950 ${surface}`}>
            <p className="text-xs font-black uppercase text-gray-600">{field.label}</p>
            <dl className="border-t border-gray-950/15">
              {[
                [`${SESSION_MINUTES} min`, isDa ? 'Fleksibelt format' : 'Flexible format'],
                [`${formatDkk(PRICE_MIN)}-${formatDkk(PRICE_MAX).replace('DKK ', '')}`, isDa ? 'Pris før booking' : 'Price before booking'],
                [`${CONTRIBUTION_MIN}-${CONTRIBUTION_MAX}%`, isDa ? 'Til kræftsagen' : 'To the cancer cause'],
              ].map(([value, label]) => <div key={label} className="flex items-center justify-between gap-4 border-b border-gray-950/15 py-3"><dt className="text-xs font-semibold text-gray-700">{label}</dt><dd className="text-sm font-black">{value}</dd></div>)}
            </dl>
          </aside>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <p className="mb-5 text-xs font-black uppercase text-gray-400">{isDa ? 'Sessionens fokus' : 'Session focus'}</p>
            <h2 className="text-3xl font-black leading-tight text-gray-950 text-balance sm:text-4xl md:text-5xl">
              {isDa ? 'Én fokuseret time, bygget omkring din næste beslutning.' : 'One focused hour, built around your next decision.'}
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-gray-600">{field.sessionFocus[locale]}</p>
          </aside>

          <div className="space-y-10">
            <section>
              <p className="mb-5 text-xs font-black uppercase text-gray-400">{isDa ? 'Bedst til' : 'Best for'}</p>
              <div className="grid gap-px border border-gray-200 bg-gray-200 sm:grid-cols-2">
                {field.bestFor[locale].map((item) => (
                  <div key={item} className="bg-white p-6">
                    <span className={`mb-8 block h-1.5 w-10 rounded-full ${field.accent}`} />
                    <p className="text-lg font-black text-gray-950">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="mb-5 text-xs font-black uppercase text-gray-400">{isDa ? 'Mulige outputs' : 'Possible outputs'}</p>
              <div className="border-t border-gray-200">
                {field.outputs[locale].map((item, index) => (
                  <div key={item} className="grid gap-4 border-b border-gray-200 py-6 md:grid-cols-[70px_1fr]">
                    <p className="text-xs font-black text-gray-300">0{index + 1}</p>
                    <p className="text-xl font-black text-gray-950">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-y border-gray-200 py-8">
              <p className="mb-4 text-xs font-black uppercase text-gray-400">{isDa ? 'Bidrag' : 'Impact'}</p>
              <p className="max-w-2xl text-sm leading-relaxed text-gray-600">
                {isDa
                  ? 'Hver betalt Naetwork-session bidrager med minimum 40% og op til 90% af sessionens pris til Kræftens Bekæmpelse. Den konkrete pris og minimumsbidraget vises før booking.'
                  : 'Every paid Naetwork session contributes at least 40% and up to 90% of the session price to Kræftens Bekæmpelse. The concrete price and minimum contribution are visible before booking.'}
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
