import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mission - Naetwork',
  description: 'Why Naetwork exists and how the platform makes insider career guidance more accessible.',
};

export default function MissionPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f4] pt-16">
      <section className="border-b border-gray-200 bg-white px-5 py-14 sm:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-5 text-xs font-black uppercase text-gray-400">Mission</p>
          <h1 className="max-w-5xl text-5xl font-black leading-[0.96] tracking-tight text-gray-950 text-balance md:text-7xl">
            Career access should not depend on who happens to be in your network.
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
            Naetwork exists to make high-quality career guidance easier to access for candidates aiming at demanding fields. A single focused conversation can make the path feel less opaque.
          </p>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="rounded-3xl border border-gray-200 bg-gray-950 p-6 text-white md:p-8 lg:sticky lg:top-24 lg:h-fit">
            <p className="text-xs font-black uppercase text-white/40">Why this matters</p>
            <h2 className="mt-4 text-3xl font-black leading-tight">The hidden curriculum is real.</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Many strong candidates do not lack ambition. They lack access to honest, specific context from people who have already been through the process.
            </p>
          </aside>

          <div className="space-y-5">
            {[
              ['Make access less random', 'Naetwork turns informal insider conversations into a structured product candidates can actually find and book.'],
              ['Keep the product simple', 'One 60-minute format keeps the marketplace easy to understand. The candidate chooses the focus before booking.'],
              ['Reward useful experience', 'Professionals can make their experience bookable, set their own price and choose whether to activate impact.'],
              ['Create better decisions', 'The best session should help a candidate leave with more clarity, sharper materials or a better preparation plan.'],
            ].map(([title, body], index) => (
              <article key={title} className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8">
                <p className="text-xs font-black text-gray-300">0{index + 1}</p>
                <h3 className="mt-8 text-2xl font-black text-gray-950">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-6xl flex-col gap-3 sm:flex-row">
          <Link href="/match" className="inline-flex items-center justify-center rounded-full bg-gray-950 px-6 py-3 text-sm font-black text-white hover:bg-gray-800">
            Try match quiz
          </Link>
          <Link href="/professionals" className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-black text-gray-950 hover:border-gray-950">
            Browse professionals
          </Link>
        </div>
      </section>
    </main>
  );
}
