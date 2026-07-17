'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { usePathname } from 'next/navigation';
import { isBilingualPublicRoute, isFocusedAppRoute } from '@/lib/navigation';
import { LEGAL_OPERATOR, PUBLIC_SUPPORT_EMAIL } from '@/lib/legal';
import { ACCESS_PATHS, BRAND_COPY, localized } from '@/lib/brand';
import { CONTRIBUTION_PERCENT } from '@/lib/platform';

export function Footer() {
  const { lang } = useLanguage();
  const pathname = usePathname();
  const isDa = lang === 'da' || !isBilingualPublicRoute(pathname);
  const currentYear = new Date().getUTCFullYear();

  const columns = [
    {
      title: 'Platform',
      links: [
        { href: '/professionals', label: isDa ? 'Find en fagperson' : 'Find a professional' },
        { href: '/how-it-works', label: isDa ? 'Sådan fungerer det' : 'How it works' },
        { href: '/sessions', label: isDa ? 'Sessioner' : 'Sessions' },
        { href: '/contact', label: isDa ? 'Kontakt' : 'Contact' },
      ],
    },
    {
      title: isDa ? 'Indgange' : 'Starting points',
      links: ACCESS_PATHS.map((path) => ({ href: path.href, label: localized(path.label, isDa ? 'da' : 'en') })),
    },
    {
      title: isDa ? 'Om Naetwork' : 'About Naetwork',
      links: [
        { href: '/mission', label: 'Mission' },
        { href: '/impact', label: isDa ? 'Bidrag' : 'Impact' },
        { href: '/professional/signup', label: isDa ? 'Bliv professionel' : 'Become a professional' },
      ],
    },
    {
      title: isDa ? 'Juridisk' : 'Legal',
      links: [
        { href: '/terms', label: isDa ? 'Vilkår' : 'Terms' },
        { href: '/privacy', label: isDa ? 'Privatlivspolitik' : 'Privacy policy' },
        { href: '/cookies', label: 'Cookies' },
        { href: '/afbestilling', label: isDa ? 'Afbestilling' : 'Cancellation' },
      ],
    },
  ];

  if (isFocusedAppRoute(pathname)) return null;

  const brand = BRAND_COPY[isDa ? 'da' : 'en'];

  return (
    <footer className="bg-[#09090b] text-white">
      <div className="signal-rail"><span /><span /><span /><span /></div>
      <div className="mx-auto max-w-[82rem] px-5 py-14 sm:px-8 md:py-20 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-20">
          <div>
            <Link href="/" className="inline-flex items-center gap-3" aria-label="Naetwork home">
              <span className="brand-mark border border-white/15 bg-white text-gray-950">N</span>
              <span className="block font-['Space_Grotesk'] text-xl font-bold text-white">Naetwork</span>
            </Link>
            <p className="mt-7 max-w-md font-['Space_Grotesk'] text-2xl font-medium leading-tight text-white sm:text-4xl">
              {brand.productLine}
            </p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/55">
              {brand.oneSentence}
            </p>
            <p className="mt-4 max-w-md text-xs font-semibold leading-relaxed text-white/60">
              {isDa ? `${CONTRIBUTION_PERCENT}% af hver gennemført og betalt session går til Kræftens Bekæmpelse.` : `${CONTRIBUTION_PERCENT}% of every completed and paid session goes to Kræftens Bekæmpelse.`}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/professionals" className="inline-flex items-center gap-2 text-sm font-bold text-white transition-colors hover:text-white/65">
                {isDa ? 'Find en fagperson' : 'Find a professional'} <span aria-hidden="true">→</span>
              </Link>
              <a href={`mailto:${PUBLIC_SUPPORT_EMAIL}`} className="inline-flex text-sm font-medium text-white/55 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white hover:decoration-white">{PUBLIC_SUPPORT_EMAIL}</a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 border-t border-white/15 pt-7 text-sm sm:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title}>
                <p className="editorial-label mb-5 text-white/55">{column.title}</p>
                <div className="space-y-3">
                  {column.links.map((link) => (
                    <Link key={link.href} href={link.href} className="block font-medium text-white/60 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-5 border-t border-white/15 pt-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="max-w-2xl text-xs leading-relaxed text-white/58">{isDa ? 'Naetwork er et uafhængigt initiativ og er ikke officielt tilknyttet Kræftens Bekæmpelse. Bidrag gælder kun for gennemførte, betalte sessioner. Betaling er endnu ikke aktiveret.' : 'Naetwork is an independent initiative and is not officially affiliated with Kræftens Bekæmpelse. Contributions apply only to completed, paid sessions. Payments are not enabled yet.'}</p>
            <address className="mt-3 text-xs not-italic leading-relaxed text-white/58">{LEGAL_OPERATOR} · <a href={`mailto:${PUBLIC_SUPPORT_EMAIL}`} className="underline decoration-white/30 underline-offset-3 hover:text-white">{PUBLIC_SUPPORT_EMAIL}</a></address>
          </div>
          <p className="shrink-0 text-xs text-white/58">{isDa ? `© ${currentYear} Naetwork. Alle rettigheder forbeholdes.` : `© ${currentYear} Naetwork. All rights reserved.`}</p>
        </div>
      </div>
    </footer>
  );
}
