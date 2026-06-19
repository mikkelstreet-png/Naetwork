import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Impact model - Naetwork',
  description: 'How every paid Naetwork career session contributes to Kræftens Bekæmpelse through the platform impact model.',
};

export default function ImpactPage() {
  const trustItems = [
    ['Clear price', 'Candidates see one 60-minute session price before booking.'],
    ['Minimum contribution', 'Every paid session contributes at least 40% of the session price.'],
    ['Professional range', 'Professionals can choose an impact level up to 90% of the session price.'],
  ];

  const examples = [
    ['DKK 600', 'DKK 240+', 'Minimum contribution'],
    ['DKK 900', 'DKK 360+', 'Minimum contribution'],
    ['DKK 1.200', 'DKK 480+', 'Minimum contribution'],
    ['DKK 1.800', 'DKK 720+', 'Minimum contribution'],
  ];

  const clarity = [
    ['When it applies', 'The impact contribution applies when a session is paid. Requested or cancelled sessions do not count as paid contributions.'],
    ['What the percentage means', 'The percentage is calculated from the displayed session price before booking. The minimum contribution is always visible in the booking flow.'],
    ['Who receives it', 'The stated contribution is intended for Kræftens Bekæmpelse. Naetwork is independent and is not officially affiliated unless explicitly stated.'],
    ['Documentation', 'Naetwork should be able to show a clear overview of paid sessions, contribution levels and total impact as the platform matures.'],
  ];

  return (
    <main className="page-shell">
      <section className="border-b border-gray-200 bg-white px-5 py-14 sm:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-end">
            <div>
              <p className="kicker mb-5">Impact model</p>
              <h1 className="display-xl max-w-4xl">
                Career guidance should create value beyond the session.
              </h1>
              <p className="body-lg mt-6 max-w-2xl">
                Naetwork is built around focused 60-minute career sessions with a clear impact model: every paid session contributes at least 40% and up to 90% of the session price to Kræftens Bekæmpelse.
              </p>
            </div>
            <div className="dark-panel p-6">
              <p className="text-xs font-black uppercase text-white/40">Core model</p>
              <p className="mt-4 text-5xl font-black">40-90%</p>
              <p className="mt-3 text-sm leading-relaxed text-white/55">Minimum 40% from each paid session, with professionals able to choose a higher contribution level.</p>
              <div className="mt-6 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-white/10 p-4">
                  <p className="text-2xl font-black">DKK 600+</p>
                  <p className="mt-1 text-xs font-bold uppercase text-white/35">Session price</p>
                </div>
                <div className="rounded-lg bg-white p-4 text-gray-950">
                  <p className="text-2xl font-black">60 min</p>
                  <p className="mt-1 text-xs font-bold uppercase text-gray-400">Format</p>
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
              <p className="kicker">Minimum Impact</p>
              <h2 className="mt-5 text-3xl font-black text-gray-950">At least 40% from every paid session</h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                A paid Naetwork session is not only a career conversation. It is also a concrete contribution. The minimum model keeps the product simple, transparent and meaningful for candidates.
              </p>
              <div className="mt-8 rounded-lg bg-[#f7f7f4] p-5 text-center">
                <p className="text-4xl font-black text-gray-950">40%</p>
                <p className="mt-1 text-xs font-bold uppercase text-gray-400">Minimum contribution</p>
              </div>
            </article>

            <article className="dark-panel p-6 md:p-8">
              <p className="text-xs font-black uppercase text-white/40">Higher Impact</p>
              <h2 className="mt-5 text-3xl font-black">Professionals can choose up to 90%</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/60">
                Professionals who want more of the session value to support the cause can choose a higher contribution level. The range makes impact part of the product, not an afterthought.
              </p>
              <div className="mt-8 rounded-lg bg-white p-5 text-center text-gray-950">
                <p className="text-4xl font-black">90%</p>
                <p className="mt-1 text-xs font-bold uppercase text-gray-400">Maximum contribution</p>
              </div>
            </article>
          </div>

          <div className="mt-5 grid gap-px overflow-hidden rounded-lg border border-gray-200 bg-gray-200 md:grid-cols-3">
            {trustItems.map(([title, body]) => (
              <div key={title} className="bg-white p-6">
                <p className="text-lg font-black text-gray-950">{title}</p>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <p className="kicker mb-5">Price examples</p>
            <div className="grid gap-px overflow-hidden rounded-lg border border-gray-200 bg-gray-200 md:grid-cols-4">
              {examples.map(([price, amount, label]) => (
                <div key={price} className="bg-white p-6">
                  <p className="text-xs font-black uppercase text-gray-400">{price}</p>
                  <p className="mt-5 text-3xl font-black text-gray-950">{amount}</p>
                  <p className="mt-2 text-sm font-semibold text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="kicker mb-5">Operational clarity</p>
              <h2 className="text-4xl font-black leading-tight tracking-tight text-gray-950 text-balance md:text-5xl">Simple enough to understand before booking.</h2>
            </div>
            <div className="border-t border-gray-200">
              {clarity.map(([title, body], index) => (
                <div key={title} className="grid gap-4 border-b border-gray-200 py-6 md:grid-cols-[70px_1fr]">
                  <p className="text-xs font-black text-gray-300">0{index + 1}</p>
                  <div>
                    <h3 className="text-xl font-black text-gray-950">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
                  </div>
                </div>
              ))}
            </div>
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
