'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import { useTranslation } from '@/context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

export function Navbar() {
  const { tr } = useTranslation();
  const [session, setSession] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    { href: '/professionals', labelKey: 'nav.find' },
    { href: '/#how-it-works', labelKey: 'nav.how' },
    { href: '/#candidates', labelKey: 'nav.candidates' },
    { href: '/#professionals', labelKey: 'nav.professionals' },
    { href: '/#about', labelKey: 'nav.about' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" className="font-extrabold text-[15px] tracking-tight text-[#0A0A0A] shrink-0">
          Naetwork
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-500 hover:text-gray-950 transition-colors font-medium"
            >
              {tr(link.labelKey)}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <LanguageToggle />

          {/* Primary CTA — always visible on desktop */}
          <Link
            href="/professionals"
            className="hidden md:inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            {tr('nav.find')}
          </Link>

          {session === null ? null : session ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#0A0A0A] transition-colors font-medium"
              >
                <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold">
                  {userEmail.charAt(0).toUpperCase()}
                </div>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-sm py-1 z-50">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    {tr('nav.dashboard')}
                  </Link>
                  <Link
                    href="/projekter"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    {tr('nav.projects')}
                  </Link>
                  <Link
                    href="/indstillinger"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    {tr('nav.settings')}
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {tr('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login" className="text-sm text-gray-500 hover:text-[#0A0A0A] transition-colors font-medium">
                {tr('nav.login')}
              </Link>
              <Link
                href="/professional/signup"
                className="inline-flex items-center justify-center rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {tr('nav.signup')}
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-500 hover:text-gray-950"
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
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm text-gray-700 font-medium py-2"
              onClick={() => setMobileOpen(false)}
            >
              {tr(link.labelKey)}
            </Link>
          ))}
          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            <Link
              href="/professionals"
              className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {tr('nav.find')}
            </Link>
            {!session && (
              <>
                <Link href="/login" className="text-sm text-gray-500 text-center py-2" onClick={() => setMobileOpen(false)}>
                  {tr('nav.login')}
                </Link>
                <Link
                  href="/professional/signup"
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {tr('nav.signup')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
