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

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">

        {/* Logo */}
        <Link href="/" className="font-extrabold text-[15px] tracking-tight text-gray-950 flex-shrink-0">
          Naetwork
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-6">
          <Link href="/professionals" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            {tr('nav.find')}
          </Link>
          <a href="#how" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            {tr('nav.how')}
          </a>
          <a href="#candidates" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            {tr('nav.candidates')}
          </a>
          <a href="#professionals-section" className="txt-sm text-gray-600 hover:text-gray-900 transition-colors">
            {tr('nav.professionals')}
          </a>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <LanguageToggle />

          {session === null ? null : session ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
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
            <>
              <Link
                href="/login"
                className="hidden sm:block text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
              >
                {tr('nav.login')}
              </Link>
              <Link
                href="/professionals"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-sm font-medium text-white transition-colors"
              >
                {tr('nav.find')}
              </Link>
            </>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-1 text-gray-500 hover:text-gray-900 transition-colors"
            aria-label="Menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          <Link href="/professionals" className="block py-2 text-sm text-gray-700 hover:text-gray-900" onClick={() => setMobileOpen(false)}>
            {tr('nav.find')}
          </Link>
          <a href="#how" className="block py-2 text-sm text-gray-700 hover:text-gray-900" onClick={() => setMobileOpen(false)}>
            {tr('nav.how')}
          </a>
          <a href="#candidates" className="block py-2 text-sm text-gray-700 hover:text-gray-900" onClick={() => setMobileOpen(false)}>
            {tr('nav.candidates')}
          </a>
          <a href="#professionals-section" className="block py-2 text-sm text-gray-700 hover:text-gray-900" onClick={() => setMobileOpen(false)}>
            {tr('nav.professionals')}
          </a>
          {!session && (
            <Link href="/login" className="block py-2 text-sm text-gray-700 hover:text-gray-900" onClick={() => setMobileOpen(false)}>
              {tr('nav.login')}
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
