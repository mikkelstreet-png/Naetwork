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
    <nav aria-label={displayDa ? 'Primær navigation' : 'Primary navigation'} className="sticky top-0 z-50 border-b border-black/[0.08] bg-white/[0.94] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label={displayDa ? 'Naetwork forside' : 'Naetwork home'}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-950 text-[11px] font-black text-white transition-transform group-hover:scale-105">
            N
          </span>
          <span className="text-[15px] font-black text-gray-950">Naetwork</span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={link.href.startsWith('/#') ? undefined : pathname === link.href ? 'page' : undefined}
              className={`text-sm font-bold transition-colors hover:text-gray-950 ${pathname === link.href ? 'text-gray-950' : 'text-gray-500'}`}
            >
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
            className="hidden items-center justify-center rounded-lg bg-gray-950 px-4 py-2.5 text-sm font-black text-white transition-colors hover:bg-gray-800 lg:inline-flex"
          >
            {displayDa ? 'Find en professionel' : 'Find a professional'}
          </Link>

          {session === null ? <span aria-hidden="true" className="hidden h-9 w-16 lg:block" /> : session ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-950 text-xs font-bold text-white transition-transform hover:scale-105"
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
            <Link href="/login" className="hidden px-3 py-2 text-sm font-bold text-gray-500 transition-colors hover:text-gray-950 lg:block">
              {displayDa ? 'Log ind' : 'Log in'}
            </Link>
          )}

          <button
            ref={mobileButtonRef}
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 lg:hidden"
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
        <div ref={mobilePanelRef} id="mobile-navigation" className="mobile-safe-bottom max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-gray-100 bg-white px-5 py-5 lg:hidden">
          <div className="border-t border-gray-200">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="flex items-center justify-between border-b border-gray-200 py-4 text-sm font-black text-gray-950" onClick={() => setMobileOpen(false)}>
                <span>{link.label}</span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
          <div className="mt-4 grid gap-2">
            <Link href="/professionals" className="inline-flex items-center justify-center rounded-lg bg-gray-950 px-4 py-3 text-sm font-bold text-white" onClick={() => setMobileOpen(false)}>
              {displayDa ? 'Find en professionel' : 'Find a professional'}
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
