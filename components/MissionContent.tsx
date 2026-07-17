'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { BRAND_COPY } from '@/lib/brand';
import { CONTRIBUTION_PERCENT, PLATFORM_SHARE_PERCENT, PROFESSIONAL_SHARE_PERCENT } from '@/lib/platform';

export function MissionContent() {
  const { lang } = useLanguage();
  const isDa = lang === 'da';
  const brand = BRAND_COPY[lang];

  const principles = [
    [isDa ? 'Adgang bør være mindre tilfældig' : 'Access should be less random', isDa ? 'Professionelle valg bør ikke afhænge af, om du tilfældigvis kan få en personlig introduktion.' : 'Professional choices should not depend on whether you happen to get a personal introduction.'],
    [isDa ? 'Relevans skal kunne forklares' : 'Relevance must be explainable', isDa ? 'Den rette erfaring afhænger af situationen, ikke af den højeste titel eller den mest kendte virksomhed.' : 'The right experience depends on the situation, not the highest title or best-known company.'],
    [isDa ? 'Resultatet skal være konkret' : 'The outcome must be concrete', isDa ? 'En session skal afklare noget, ændre noget eller gøre det næste skridt tydeligere.' : 'A session should clarify something, change something or make the next step clearer.'],
    [isDa ? 'Værdien skal række videre' : 'The value should travel further', isDa ? `${CONTRIBUTION_PERCENT}% af nettoprisen går til Kræftens Bekæmpelse efter en gennemført og betalt session. Fordelingen er fast og transparent.` : `${CONTRIBUTION_PERCENT}% of the net price goes to Kræftens Bekæmpelse after a completed and paid session. The split is fixed and transparent.`],
  ] as const;

  const product = [isDa ? 'Professionel adgang' : 'Professional access', isDa ? 'Ét konkret mål' : 'One concrete goal', isDa ? 'Direkte relevant erfaring' : 'Directly relevant experience', '60 min', `${CONTRIBUTION_PERCENT} · ${PLATFORM_SHARE_PERCENT} · ${PROFESSIONAL_SHARE_PERCENT}%`] as const;

  return (
    <main className="page-shell">
      <section className="border-b border-white/15 bg-[#09090b] px-5 py-12 text-white sm:px-8 md:py-24 lg:px-12">
        <div className="mx-auto grid max-w-[82rem] gap-10 lg:grid-cols-[1fr_400px] lg:items-end">
          <div>
            <p className="kicker mb-5 text-white/40">Mission</p>
            <h1 className="display-xl max-w-5xl text-white">
              {isDa ? 'Potentiale er overalt. Adgang er det ikke.' : 'Potential is everywhere. Access is not.'}
            </h1>
            <p className="body-lg mt-7 max-w-2xl text-white/55">
              {brand.oneSentence}
            </p>
          </div>
          <aside className="border border-white/20 bg-white/[0.035] p-6">
            <p className="kicker text-white/40">{isDa ? 'Produktstandpunkt' : 'Product stance'}</p>
            <p className="mt-4 text-3xl font-medium leading-tight text-white">
              {brand.positioning}
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {product.map((item) => (
                <span key={item} className="border border-white/20 px-3 py-2 text-xs font-bold text-white/65">{item}</span>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 md:py-24 lg:px-12">
        <div className="mx-auto grid max-w-[82rem] gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="kicker mb-5">{isDa ? 'Principper' : 'Principles'}</p>
            <h2 className="display-lg">
              {isDa ? 'Åbn den erfaring, der tidligere lå i private netværk.' : 'Open the experience that used to remain inside private networks.'}
            </h2>
          </div>
          <div className="border-t border-gray-200">
            {principles.map(([title, body], index) => (
              <article key={title} className="grid gap-4 border-b border-gray-200 py-7 md:grid-cols-[72px_1fr]">
                <p className="text-xs font-black text-gray-300">0{index + 1}</p>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-950">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-12 flex max-w-[82rem] flex-col gap-3 sm:flex-row">
          <Link href="/start" className="button-primary">{isDa ? 'Start med din situation' : 'Start with your situation'}</Link>
          <Link href="/how-it-works" className="button-secondary">{isDa ? 'Sådan fungerer det' : 'How it works'}</Link>
        </div>
      </section>
    </main>
  );
}
