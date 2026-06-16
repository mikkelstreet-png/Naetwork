'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

const NAV_LINKS = [
  { key: 'nav.home', href: '#home' },
  { key: 'nav.how_it_works', href: '#how-it-works' },
  { key: 'nav.about', href: '#about' },
  { key: 'nav.candidates', href: '#candidates' },
  { key: 'nav.professionals', href: '#professionals' },
  { key: 'nav.pricing', href: '#pricing' },
  { key: 'nav.faq', href: '#faq' },
  { key: 'nav.contact', href: '#contact' },
];

export function Navbar() {
  const { tr } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

        {/* Brand - text only */}
        <Link href="/" className="flex-shrink-0 font-bold text-lg tracking-tight text-gray-950">
          Naetwork
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-5 flex-1">
          {NAV_LINKS.map(link => (
            <a
              key={link.key}
              href={link.href}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors whitespace-nowrap"
            >
              {tr(link.key)}
            </a>
          ))}
        </div>

        {/* Right: lang toggle + login + CTA + hamburger */}
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Link
            href="/login"
            className="hidden sm:block text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            {tr('nav.login')}
          </Link>
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
          >
            {tr('nav.book')}
          </a>
          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {menuOpen
                ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                : <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-1">
          {NAV_LINKS.map(link => (
            <a
              key={link.key}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {tr(link.key)}
            </a>
          ))}
          <div className="pt-3 border-t border-gray-100 mt-3">
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
            >
              {tr('nav.book')}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
