import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mission - Naetwork',
  description: 'Why Naetwork exists and how the platform makes insider career guidance more accessible.',
};

export default function MissionPage() {
  const principles = [
    ['Access should be less random', 'Strong candidates should not need a warm introduction to understand how demanding career paths actually work.'],
    ['Guidance should be specific', 'The value is not generic inspiration. It is context from someone who knows the bar, the process and the tradeoffs.'],
    ['Preparation should be concrete', 'A good session should create a sharper story, a clearer plan or better practice for the next step.'],
    ['Experience should be useful', 'Professionals can make hard-earned context available in a focused, transparent and sustainable format.'],
  ];

  return (
    <main className="page-shell">
      <section className="border-b border-gray-200 bg-white px-5 py-14 sm:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-end">
            <div>
              <p className="kicker mb-5">Mission</p>
              <h1 className="display-xl max-w-5xl">
                Career access should not depend on who happens to be in your network.
              </h1>
              <p className="body-lg mt-7 max-w-2xl">
                Naetwork turns informal insider guidance into a focused product: one professional, one brief, one 60-minute session, one clearer next step.
              </p>
            </div>
            <div className="dark-panel p-6">
              <p className="text-xs font-black uppercase text-white/40">Core belief</p>
              <p className="mt-4 text-3xl font-black leading-tight">The hidden curriculum is real.</p>
              <p className="mt-4 text-sm leading-relaxed text-white/60">
                Many strong candidates do not lack ambition. They lack access to honest, specific context from people who have already been through the process.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="premium-card p-6 md:p-8 lg:sticky lg:top-24 lg:h-fit">
            <p className="kicker">Product stance</p>
            <h2 className="mt-4 text-3xl font-black leading-tight text-gray-950">Simple on the surface. Serious underneath.</h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              The platform is intentionally narrow: AI, Banking, Management Consulting and Private Equity. That focus keeps the product useful, comparable and easy to trust.
            </p>
            <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200">
              {['60 min format', 'Clear profile signal', 'Candidate brief', 'Optional impact'].map((item) => (
                <div key={item} className="bg-[#f7f7f4] p-4 text-sm font-black text-gray-950">{item}</div>
              ))}
            </div>
          </aside>

          <div className="space-y-5">
            {principles.map(([title, body], index) => (
              <article key={title} className="premium-card p-6 md:p-8">
                <p className="text-xs font-black text-gray-300">0{index + 1}</p>
                <h3 className="mt-8 text-2xl font-black text-gray-950">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-6xl flex-col gap-3 sm:flex-row">
          <Link href="/match" className="pill-dark">
            Try match quiz
          </Link>
          <Link href="/professionals" className="pill-light">
            Browse professionals
          </Link>
        </div>
      </section>
    </main>
  );
}
