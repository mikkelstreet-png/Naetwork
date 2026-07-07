'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { isBilingualPublicRoute } from '@/lib/navigation';

export function Navbar() {
  const { lang } = useLanguage();
  const [session, setSession] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const isDa = lang === 'da';
  const pathname = usePathname();
  const bilingual = isBilingualPublicRoute(pathname);
  const displayDa = isDa || !bilingual;

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
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.requestAnimationFrame(() => mobilePanelRef.current?.querySelector<HTMLElement>('a[href]')?.focus());
    return () => { document.body.style.overflow = previousOverflow; };
  }, [mobileOpen]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        setMobileOpen(false);
        mobileButtonRef.current?.focus();
      }
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  const navLinks = [
    { href: '/#how-it-works', label: displayDa ? 'Sådan fungerer det' : 'How it works' },
    { href: '/#pricing', label: displayDa ? 'Priser' : 'Pricing' },
    { href: '/impact', label: displayDa ? 'Bidrag' : 'Impact' },
    { href: '/professional/signup', label: displayDa ? 'For professionelle' : 'For professionals' },
  ];

  if (pathname.startsWith('/admin')) return null;

  return (
    <nav aria-label={displayDa ? 'Primær navigation' : 'Primary navigation'} className="sticky top-0 z-50 border-b border-black/[0.09] bg-white/[0.92] backdrop-blur-2xl">
      <div className="mx-auto flex h-[4.75rem] max-w-[82rem] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label={displayDa ? 'Naetwork forside' : 'Naetwork home'}>
          <span className="brand-mark transition-transform duration-200 group-hover:-translate-y-0.5">N</span>
          <span>
            <span className="block font-['Space_Grotesk'] text-[16px] font-semibold leading-none text-gray-950">Naetwork</span>
            <span className="mt-1 hidden font-['JetBrains_Mono'] text-[8px] uppercase text-gray-400 sm:block">Career access</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={link.href.startsWith('/#') ? undefined : pathname === link.href ? 'page' : undefined}
              className={`group/link relative flex items-center gap-1.5 py-2 text-[13px] font-semibold transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-gray-950 after:transition-transform hover:text-gray-950 hover:after:scale-x-100 ${pathname === link.href ? 'text-gray-950 after:scale-x-100' : 'text-gray-500'}`}
            >
              <span className="font-['JetBrains_Mono'] text-[8px] font-medium text-gray-300 transition-colors group-hover/link:text-gray-500">0{index + 1}</span>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className={bilingual ? 'hidden sm:block' : 'hidden'}>
            <LanguageToggle />
          </div>

          <Link
            href="/professionals"
            className="button-primary hidden min-h-10 px-4 py-2.5 lg:inline-flex"
          >
            {displayDa ? 'Book 60 min' : 'Book 60 min'}
          </Link>

          {session === null ? <span aria-hidden="true" className="hidden h-9 w-16 lg:block" /> : session ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-950 text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
                aria-label={dropdownOpen
                  ? (displayDa ? 'Luk kontomenu' : 'Close account menu')
                  : (displayDa ? 'Åbn kontomenu' : 'Open account menu')}
                aria-expanded={dropdownOpen}
                aria-controls="account-menu"
              >
                {userEmail.charAt(0).toUpperCase()}
              </button>
              {dropdownOpen && (
                <div id="account-menu" className="absolute right-0 mt-3 w-64 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl shadow-gray-950/12">
                  <div className="border-b border-gray-100 bg-[#f7f7f4] px-4 py-4">
                    <p className="text-xs font-black uppercase text-gray-400">{displayDa ? 'Konto' : 'Account'}</p>
                    <p className="mt-1 truncate text-sm font-bold text-gray-950">{userEmail}</p>
                  </div>
                  <Link href="/dashboard" className="block px-4 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>{displayDa ? 'Overblik' : 'Overview'}</Link>
                  <Link href="/match" className="block px-4 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>Match</Link>
                  <button type="button" onClick={handleLogout} className="block w-full border-t border-gray-100 px-4 py-3 text-left text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50">{displayDa ? 'Log ud' : 'Log out'}</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hidden px-2 py-2 text-[13px] font-semibold text-gray-500 transition-colors hover:text-gray-950 lg:block">
              {displayDa ? 'Log ind' : 'Log in'}
            </Link>
          )}

          <button
            ref={mobileButtonRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-950 transition-colors hover:border-gray-400 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen
              ? (displayDa ? 'Luk menu' : 'Close menu')
              : (displayDa ? 'Åbn menu' : 'Open menu')}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div ref={mobilePanelRef} id="mobile-navigation" className="mobile-safe-bottom max-h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-gray-100 bg-white px-5 pb-6 pt-2 lg:hidden">
          <div className="signal-rail mb-6"><span /><span /><span /><span /></div>
          <div className="border-t border-gray-200">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="flex items-center justify-between border-b border-gray-200 py-4 font-['Space_Grotesk'] text-lg font-semibold text-gray-950" onClick={() => setMobileOpen(false)}>
                <span>{link.label}</span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
          <div className="mt-4 grid gap-2">
            <Link href="/professionals" className="button-primary" onClick={() => setMobileOpen(false)}>
              {displayDa ? 'Book 60 min' : 'Book 60 min'}
            </Link>
            {session ? (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/dashboard" className="rounded-lg border border-gray-200 px-4 py-3 text-center text-sm font-bold text-gray-950" onClick={() => setMobileOpen(false)}>
                  {displayDa ? 'Overblik' : 'Overview'}
                </Link>
                <Link href="/profil/bookings" className="rounded-lg border border-gray-200 px-4 py-3 text-center text-sm font-bold text-gray-950" onClick={() => setMobileOpen(false)}>
                  {displayDa ? 'Bookinger' : 'Bookings'}
                </Link>
              </div>
            ) : (
              <Link href="/login" className="py-2 text-center text-sm font-medium text-gray-500" onClick={() => setMobileOpen(false)}>
                {displayDa ? 'Log ind' : 'Log in'}
              </Link>
            )}
            {bilingual && <div className="mx-auto pt-1"><LanguageToggle /></div>}
          </div>
        </div>
      )}
    </nav>
  );
}
