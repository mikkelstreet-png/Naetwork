'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export function Footer() {
  const { tr, lang } = useLanguage();
  const isDa = lang === 'da';

  const columns = [
    {
      title: 'Platform',
      links: [
        { href: '/professionals', label: isDa ? 'Profiler' : 'Profiles' },
        { href: '/match', label: 'Match quiz' },
        { href: '/onboarding', label: 'Onboarding' },
      ],
    },
    {
      title: isDa ? 'Model' : 'Model',
      links: [
        { href: '/mission', label: 'Mission' },
        { href: '/#pricing', label: isDa ? 'Format' : 'Format' },
        { href: '/impact', label: 'Impact' },
      ],
    },
    {
      title: isDa ? 'Juridisk' : 'Legal',
      links: [
        { href: '/terms', label: tr('footer.terms') },
        { href: '/privacy', label: tr('footer.privacy_link') },
        { href: '/cookies', label: tr('footer.cookies') },
      ],
    },
  ];

  return (
    <footer className="border-t border-gray-200 bg-[#f7f7f4]">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 md:py-16">
        <div className="mb-12 rounded-[2rem] border border-gray-200 bg-gray-950 p-6 text-white md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase text-white/40">Naetwork</p>
              <h2 className="mt-4 max-w-2xl text-3xl font-black leading-tight tracking-tight text-white md:text-5xl">
                {isDa ? 'Én fokuseret time kan gøre næste skridt mere konkret.' : 'One focused hour can make the next step more concrete.'}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60">
                {isDa
                  ? '60-minutters karrieresessioner med professionals fra AI, Banking, Management Consulting og Private Equity.'
                  : '60-minute career sessions with professionals from AI, Banking, Management Consulting and Private Equity.'}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link href="/professionals" className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-black text-gray-950 transition-colors hover:bg-gray-100">
                {isDa ? 'Se profiler' : 'Browse profiles'}
              </Link>
              <Link href="/match" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-white/15">
                Match quiz
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <Link href="/" className="inline-flex items-center gap-3" aria-label="Naetwork home">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gray-950 text-[11px] font-black text-white">N</span>
              <span>
                <span className="block text-lg font-black tracking-tight text-gray-950">Naetwork</span>
                <span className="block text-[10px] font-bold uppercase text-gray-400">60 min career sessions</span>
              </span>
            </Link>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-gray-600">
              {isDa
                ? 'Naetwork gør insider-sparring mere tilgængelig, konkret og sammenlignelig for kandidater med høje ambitioner.'
                : 'Naetwork makes insider guidance more accessible, concrete and comparable for ambitious candidates.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3 lg:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title}>
                <p className="mb-4 text-xs font-bold uppercase text-gray-400">{column.title}</p>
                <div className="space-y-3">
                  {column.links.map((link) => (
                    <Link key={link.href} href={link.href} className="block font-semibold text-gray-600 transition-colors hover:text-gray-950">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-gray-200 pt-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-2xl text-xs leading-relaxed text-gray-400">{tr('footer.legal')}</p>
          <p className="text-xs text-gray-400">{tr('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
