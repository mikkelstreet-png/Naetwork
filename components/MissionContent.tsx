'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { PublicPageHero } from '@/components/PublicPageHero';
import { BRAND_COPY } from '@/lib/brand';
import { CONTRIBUTION_PERCENT } from '@/lib/platform';

export function MissionContent() {
  const { lang } = useLanguage();
  const isDa = lang === 'da';
  const brand = BRAND_COPY[lang];

  const principles = [
    [isDa ? 'Adgang bør være mindre tilfældig' : 'Access should be less random', isDa ? 'Stærke kandidater bør ikke være afhængige af en personlig introduktion for at forstå krævende karriereveje.' : 'Strong candidates should not need a warm introduction to understand demanding career paths.'],
    [isDa ? 'Relevans skal kunne forklares' : 'Relevance must be explainable', isDa ? 'Den rette erfaring afhænger af situationen, ikke af den højeste titel eller den mest kendte virksomhed.' : 'The right experience depends on the situation, not the highest title or best-known company.'],
    [isDa ? 'Resultatet skal være konkret' : 'The outcome must be concrete', isDa ? 'En session skal afklare noget, ændre noget eller gøre det næste skridt tydeligere.' : 'A session should clarify something, change something or make the next step clearer.'],
    [isDa ? 'Værdien skal række videre' : 'The value should travel further', isDa ? `${CONTRIBUTION_PERCENT}% af nettoprisen går til Kræftens Bekæmpelse efter en gennemført og betalt session. Fordelingen er fast og transparent.` : `${CONTRIBUTION_PERCENT}% of the net price goes to Kræftens Bekæmpelse after a completed and paid session. The split is fixed and transparent.`],
  ] as const;

  return (
    <main className="page-shell">
      <PublicPageHero
        eyebrow="Mission"
        title={isDa ? 'Adgang bør ikke afhænge af dit netværk.' : 'Access should not depend on your network.'}
        body={brand.oneSentence}
        action={{ href: '/start', label: isDa ? 'Start med din situation' : 'Start with your situation' }}
        sequence={isDa ? ['Adgang', 'Relevans', 'Handling'] : ['Access', 'Relevance', 'Action']}
      />

      <section className="public-section">
        <div className="home-shell">
          <div className="section-heading">
            <p className="section-eyebrow">{isDa ? 'Principper' : 'Principles'}</p>
            <h2>{isDa ? 'Relevant erfaring. Mindre gætværk.' : 'Relevant experience. Less guesswork.'}</h2>
            <p>{isDa ? 'Fire principper styrer produktet.' : 'Four principles guide the product.'}</p>
          </div>
          <ol className="editorial-journey">
            {principles.map(([title, body], index) => (
              <li key={title}>
                <span>0{index + 1}</span>
                <p>{isDa ? 'Princip' : 'Principle'}</p>
                <h3>{title}</h3>
                <div>{body}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="public-cta">
        <div className="home-shell">
          <h2>{isDa ? 'Start med spørgsmålet foran dig.' : 'Start with the question in front of you.'}</h2>
          <p>{isDa ? 'Vi viser, hvilken erfaring der er relevant.' : 'We will show which experience is relevant.'}</p>
          <Link href="/start" className="button-primary">
            {isDa ? 'Start med din situation' : 'Start with your situation'}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
