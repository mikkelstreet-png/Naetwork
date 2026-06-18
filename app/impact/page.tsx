import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Impact model - Naetwork',
  description: 'How Naetwork professionals can use career sessions to support donation through the platform impact model.',
};

export default function ImpactPage() {
  const trustItems = [
    ['Clear price', 'Candidates see one session price before booking.'],
    ['Professional choice', 'Professionals choose whether to activate impact.'],
    ['Simple logic', 'The donation model should be understandable before a session is booked.'],
  ];

  return (
    <main className="page-shell">
      <section className="border-b border-gray-200 bg-white px-5 py-14 sm:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-end">
            <div>
              <p className="kicker mb-5">Impact model</p>
              <h1 className="display-xl max-w-4xl">
                Professional guidance can create value beyond the session.
              </h1>
              <p className="body-lg mt-6 max-w-2xl">
                Naetwork lets professionals choose whether part of their session earnings should support donation to Kræftens Bekæmpelse. The product stays simple: one clear price, one focused hour, one optional impact layer.
              </p>
            </div>
            <div className="dark-panel p-6">
              <p className="text-xs font-black uppercase text-white/40">Core format</p>
              <p className="mt-4 text-4xl font-black">60 min</p>
              <p className="mt-3 text-sm leading-relaxed text-white/55">One session format, clear price, optional impact model for professionals.</p>
              <div className="mt-6 grid grid-cols-2 gap-2">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-2xl font-black">50%</p>
                  <p className="mt-1 text-xs font-bold uppercase text-white/35">Shared</p>
                </div>
                <div className="rounded-2xl bg-white p-4 text-gray-950">
                  <p className="text-2xl font-black">100%</p>
                  <p className="mt-1 text-xs font-bold uppercase text-gray-400">All-in</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 md:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-5 md:grid-cols-2">
            <article className="premium-card p-6 md:p-8">
              <p className="kicker">Shared Impact</p>
              <h2 className="mt-5 text-3xl font-black text-gray-950">50% donation option</h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                A professional can keep part of the session value and donate part through the platform model. This keeps the incentive sustainable while still creating meaningful contribution.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#f7f7f4] p-5 text-center">
                  <p className="text-3xl font-black text-gray-950">50%</p>
                  <p className="mt-1 text-xs font-bold uppercase text-gray-400">Donation</p>
                </div>
                <div className="rounded-2xl bg-[#f7f7f4] p-5 text-center">
                  <p className="text-3xl font-black text-gray-950">50%</p>
                  <p className="mt-1 text-xs font-bold uppercase text-gray-400">Professional</p>
                </div>
              </div>
            </article>

            <article className="dark-panel p-6 md:p-8">
              <p className="text-xs font-black uppercase text-white/40">All-in Impact</p>
              <h2 className="mt-5 text-3xl font-black">100% donation option</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/60">
                Professionals who want the full session value to support the cause can choose an all-in donation model. The platform can use a lower fee for this path.
              </p>
              <div className="mt-8 rounded-2xl bg-white p-5 text-center text-gray-950">
                <p className="text-4xl font-black">100%</p>
                <p className="mt-1 text-xs font-bold uppercase text-gray-400">Donation</p>
              </div>
            </article>
          </div>

          <div className="mt-5 grid gap-px overflow-hidden rounded-3xl border border-gray-200 bg-gray-200 md:grid-cols-3">
            {trustItems.map(([title, body]) => (
              <div key={title} className="bg-white p-6">
                <p className="text-lg font-black text-gray-950">{title}</p>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/professionals" className="pill-dark">
              Book 60 min
            </Link>
            <Link href="/professional/signup" className="pill-light">
              Become a professional
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
