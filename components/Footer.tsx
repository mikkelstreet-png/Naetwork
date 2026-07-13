'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { usePathname } from 'next/navigation';
import { isBilingualPublicRoute, isFocusedAppRoute } from '@/lib/navigation';
import { LEGAL_OPERATOR, PUBLIC_SUPPORT_EMAIL } from '@/lib/legal';
import { BRAND_COPY } from '@/lib/brand';
import { CONTRIBUTION_PERCENT, PLATFORM_SHARE_PERCENT, PROFESSIONAL_SHARE_PERCENT } from '@/lib/platform';

export function Footer() {
  const { lang } = useLanguage();
  const pathname = usePathname();
  const isDa = lang === 'da' || !isBilingualPublicRoute(pathname);
  const currentYear = new Date().getUTCFullYear();

  const columns = [
    {
      title: 'Platform',
      links: [
        { href: '/start', label: isDa ? 'Start med din situation' : 'Start with your situation' },
        { href: '/how-it-works', label: isDa ? 'Sådan fungerer det' : 'How it works' },
        { href: '/sessions', label: isDa ? 'Sessioner' : 'Sessions' },
        { href: '/contact', label: isDa ? 'Kontakt' : 'Contact' },
      ],
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
      <div className="mx-auto max-w-[82rem] px-5 py-12 sm:px-8 md:py-16 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-20">
          <div>
            <Link href="/" className="inline-flex items-center gap-3" aria-label="Naetwork home">
              <span className="brand-mark border border-white/15 bg-white text-gray-950">N</span>
              <span className="block font-['Space_Grotesk'] text-xl font-bold text-white">Naetwork</span>
            </Link>
            <p className="mt-7 max-w-md font-['Space_Grotesk'] text-2xl font-medium leading-tight text-white sm:text-3xl">
              {brand.positioning}
            </p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/55">
              {brand.oneSentence}
            </p>
            <p className="mt-4 max-w-md text-xs font-semibold leading-relaxed text-white/60">
              {isDa ? `Fast fordeling af nettoprisen: ${PLATFORM_SHARE_PERCENT}% Naetwork · ${CONTRIBUTION_PERCENT}% Kræftens Bekæmpelse · ${PROFESSIONAL_SHARE_PERCENT}% den professionelle.` : `Fixed split of the net price: ${PLATFORM_SHARE_PERCENT}% Naetwork · ${CONTRIBUTION_PERCENT}% Kræftens Bekæmpelse · ${PROFESSIONAL_SHARE_PERCENT}% the professional.`}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 border-t border-white/15 pt-7 text-sm sm:grid-cols-3">
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

        <div className="mt-12 grid gap-5 border-t border-white/15 pt-6 md:grid-cols-[1fr_auto] md:items-end">
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
