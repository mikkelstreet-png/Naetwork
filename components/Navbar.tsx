'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import { useTranslation } from '@/context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

export function Navbar() {
  const { tr, lang } = useTranslation();
  const [session, setSession] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isDa = lang === 'da';

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setSession(!!data.session);
      setUserEmail(data.session?.user?.email ?? '');
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(!!s);
      setUserEmail(s?.user?.email ?? '');
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  const navLinks = [
    { href: '/professionals', label: isDa ? 'Profiler' : 'Profiles', description: isDa ? 'Find den rette professional' : 'Find the right professional' },
    { href: '/match', label: 'Match', description: isDa ? 'Vælg fokus hurtigere' : 'Choose focus faster' },
    { href: '/#pricing', label: isDa ? 'Priser' : 'Pricing', description: isDa ? '600-1.800 DKK' : 'DKK 600-1,800' },
    { href: '/impact', label: 'Impact', description: isDa ? '40-90% bidrag' : '40-90% contribution' },
    { href: '/mission', label: 'Mission', description: isDa ? 'Hvorfor Naetwork findes' : 'Why Naetwork exists' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-black/[0.08] bg-white/94 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label="Naetwork home">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-950 text-[11px] font-black text-white transition-transform group-hover:scale-105">
            N
          </span>
          <span className="text-[15px] font-black text-gray-950">Naetwork</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-bold text-gray-500 transition-colors hover:text-gray-950"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageToggle />
          </div>

          <Link
            href="/professionals"
            className="hidden items-center justify-center rounded-lg bg-gray-950 px-4 py-2.5 text-sm font-black text-white transition-colors hover:bg-gray-800 md:inline-flex"
          >
            {isDa ? 'Book 60 min' : 'Book 60 min'}
          </Link>

          {session === null ? null : session ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-950 text-xs font-bold text-white transition-transform hover:scale-105"
                aria-label="Open account menu"
              >
                {userEmail.charAt(0).toUpperCase()}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl shadow-gray-950/12">
                  <div className="border-b border-gray-100 bg-[#f7f7f4] px-4 py-4">
                    <p className="text-xs font-black uppercase text-gray-400">Account</p>
                    <p className="mt-1 truncate text-sm font-bold text-gray-950">{userEmail}</p>
                  </div>
                  <Link href="/dashboard" className="block px-4 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>{tr('nav.dashboard')}</Link>
                  <Link href="/onboarding" className="block px-4 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>Onboarding</Link>
                  <Link href="/match" className="block px-4 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>Match</Link>
                  <button onClick={handleLogout} className="block w-full border-t border-gray-100 px-4 py-3 text-left text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50">{tr('nav.logout')}</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hidden px-3 py-2 text-sm font-bold text-gray-500 transition-colors hover:text-gray-950 md:block">
              {tr('nav.login')}
            </Link>
          )}

          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-5 py-4 md:hidden">
          <div className="grid gap-px border border-gray-200 bg-gray-200">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="bg-white px-4 py-4" onClick={() => setMobileOpen(false)}>
                <span className="block text-sm font-black text-gray-950">{link.label}</span>
                <span className="mt-1 block text-xs font-medium text-gray-500">{link.description}</span>
              </Link>
            ))}
          </div>
          <div className="mt-4 grid gap-2">
            <Link href="/professionals" className="inline-flex items-center justify-center rounded-lg bg-gray-950 px-4 py-3 text-sm font-bold text-white" onClick={() => setMobileOpen(false)}>
              {isDa ? 'Book 60 min' : 'Book 60 min'}
            </Link>
            {!session && (
              <Link href="/login" className="py-2 text-center text-sm font-medium text-gray-500" onClick={() => setMobileOpen(false)}>
                {tr('nav.login')}
              </Link>
            )}
            <div className="mx-auto pt-1"><LanguageToggle /></div>
          </div>
        </div>
      )}
    </nav>
  );
}
