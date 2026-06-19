import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const fields = {
  ai: {
    label: 'AI',
    accent: 'bg-cyan-300',
    title: 'AI career sessions',
    description: 'For candidates targeting AI product, strategy, operations or commercial roles who need sharper positioning and a clearer path in.',
    bestFor: ['AI role positioning', 'Portfolio and proof points', 'Product or strategy interviews', 'Translating non-AI experience'],
    outputs: ['Sharper AI narrative', 'Role shortlist', 'Portfolio priorities', 'Interview angles'],
    sessionFocus: 'Use the hour to understand which AI roles fit your background, which proof points matter, and how to communicate your edge without sounding generic.',
  },
  banking: {
    label: 'Banking',
    accent: 'bg-emerald-300',
    title: 'Banking career sessions',
    description: 'For candidates preparing for investment banking, M&A, corporate finance or capital markets processes.',
    bestFor: ['Banking technicals', 'Fit story', 'CV and deal interest', 'Interview bar calibration'],
    outputs: ['Technical drill plan', 'Sharper fit answers', 'Better CV signal', 'Interview readiness'],
    sessionFocus: 'Use the hour to understand the interview bar, pressure-test technicals, improve your story and remove weak signals from your material.',
  },
  consulting: {
    label: 'Management Consulting',
    accent: 'bg-blue-300',
    title: 'Consulting career sessions',
    description: 'For candidates preparing for strategy consulting applications, cases, fit interviews and final-round pressure.',
    bestFor: ['Case structure', 'Hypothesis thinking', 'Fit communication', 'Final-round preparation'],
    outputs: ['Cleaner case structure', 'Better hypotheses', 'Fit answer map', 'Practice priorities'],
    sessionFocus: 'Use the hour to make your problem solving clearer, your communication tighter and your fit answers more credible.',
  },
  'private-equity': {
    label: 'Private Equity',
    accent: 'bg-lime-300',
    title: 'Private Equity career sessions',
    description: 'For candidates targeting investment roles, deal teams, investment cases or transitions from banking and consulting.',
    bestFor: ['Investment cases', 'Deal thinking', 'Diligence logic', 'PE interview preparation'],
    outputs: ['Investment case plan', 'Sharper deal discussion', 'Diligence questions', 'PE readiness'],
    sessionFocus: 'Use the hour to sharpen how you think about companies, deals, value creation and investment judgment.',
  },
} as const;

type FieldSlug = keyof typeof fields;

export function generateStaticParams() {
  return Object.keys(fields).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const field = fields[params.slug as FieldSlug];
  if (!field) return { title: 'Field - Naetwork' };
  return {
    title: `${field.label} career sessions - Naetwork`,
    description: field.description,
  };
}

export default function FieldPage({ params }: { params: { slug: string } }) {
  const field = fields[params.slug as FieldSlug];
  if (!field) notFound();

  return (
    <main className="bg-white pt-16">
      <section className="border-b border-gray-200 bg-white px-5 py-16 sm:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Link href="/" className="mb-10 inline-flex text-sm font-black text-gray-500 transition-colors hover:text-gray-950">&larr; Naetwork</Link>
          <span className={`mb-8 block h-2 w-24 rounded-full ${field.accent}`} />
          <p className="mb-5 text-xs font-black uppercase text-gray-400">Field guide</p>
          <h1 className="max-w-5xl text-6xl font-black leading-[0.9] tracking-tight text-gray-950 text-balance md:text-8xl">{field.title}</h1>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">{field.description}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/professionals" className="inline-flex rounded-lg bg-gray-950 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-gray-800">Browse profiles</Link>
            <Link href="/match" className="inline-flex rounded-lg border border-gray-200 px-5 py-3 text-sm font-black text-gray-950 transition-colors hover:border-gray-950">Find focus</Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <p className="mb-5 text-xs font-black uppercase text-gray-400">Session focus</p>
            <h2 className="text-4xl font-black leading-tight tracking-tight text-gray-950 text-balance md:text-5xl">One focused hour, built around your next decision.</h2>
            <p className="mt-5 text-sm leading-relaxed text-gray-600">{field.sessionFocus}</p>
            <div className="mt-8 grid gap-px border border-gray-200 bg-gray-200">
              {[
                ['60 min', 'Fixed format'],
                ['DKK 600+', 'Concrete price'],
                ['40-90%', 'Impact contribution'],
              ].map(([value, label]) => (
                <div key={label} className="bg-[#f7f7f4] p-5">
                  <p className="text-2xl font-black text-gray-950">{value}</p>
                  <p className="mt-1 text-xs font-black uppercase text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          </aside>

          <div className="space-y-10">
            <section>
              <p className="mb-5 text-xs font-black uppercase text-gray-400">Best for</p>
              <div className="grid gap-px border border-gray-200 bg-gray-200 sm:grid-cols-2">
                {field.bestFor.map((item) => (
                  <div key={item} className="bg-white p-6">
                    <span className={`mb-8 block h-1.5 w-10 rounded-full ${field.accent}`} />
                    <p className="text-lg font-black text-gray-950">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="mb-5 text-xs font-black uppercase text-gray-400">Possible outputs</p>
              <div className="border-t border-gray-200">
                {field.outputs.map((item, index) => (
                  <div key={item} className="grid gap-4 border-b border-gray-200 py-6 md:grid-cols-[70px_1fr]">
                    <p className="text-xs font-black text-gray-300">0{index + 1}</p>
                    <p className="text-xl font-black text-gray-950">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-y border-gray-200 py-8">
              <p className="mb-4 text-xs font-black uppercase text-gray-400">Impact</p>
              <p className="max-w-2xl text-sm leading-relaxed text-gray-600">
                Every paid Naetwork session contributes at least 40% and up to 90% of the session price to Kræftens Bekæmpelse. The concrete price and minimum contribution are visible before booking.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
