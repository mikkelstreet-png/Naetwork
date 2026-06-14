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
    <nav className="sticky top-0 z-50 backdrop-blur-sm bg-white/90 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="font-bold text-base tracking-tight text-gray-900">
          Naetwork
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/projekter" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
            {tr('nav.projects')}
          </Link>
          <Link href="/signup?role=specialist" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
            {tr('nav.specialist')}
          </Link>
          <Link href="#om" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
            {tr('nav.about')}
          </Link>
        </div>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageToggle />

          {session === null ? null : session ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold">
                  {userEmail.charAt(0).toUpperCase()}
                </div>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
                  <Link href="/dashboard" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setDropdownOpen(false)}>
                    {tr('nav.dashboard')}
                  </Link>
                  <Link href="/projekter" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setDropdownOpen(false)}>
                    {tr('nav.projects')}
                  </Link>
                  <Link href="/indstillinger" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setDropdownOpen(false)}>
                    {tr('nav.settings')}
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    {tr('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-semibold px-4 py-2">
                {tr('nav.login')}
              </Link>
              <Link
                href="/signup"
                className="bg-green-800 text-white hover:bg-green-900 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                {tr('nav.signup')}
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-gray-500 hover:text-gray-900 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-1">
          <Link href="/projekter" className="block py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors" onClick={() => setMobileOpen(false)}>
            {tr('nav.projects')}
          </Link>
          <Link href="/signup?role=specialist" className="block py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors" onClick={() => setMobileOpen(false)}>
            {tr('nav.specialist')}
          </Link>
          <Link href="#om" className="block py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors" onClick={() => setMobileOpen(false)}>
            {tr('nav.about')}
          </Link>
          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            {session ? (
              <>
                <Link href="/dashboard" className="block py-2.5 text-sm font-medium text-gray-700" onClick={() => setMobileOpen(false)}>{tr('nav.dashboard')}</Link>
                <button onClick={handleLogout} className="text-left py-2.5 text-sm font-medium text-gray-700">{tr('nav.logout')}</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block py-2.5 text-sm font-medium text-gray-700" onClick={() => setMobileOpen(false)}>{tr('nav.login')}</Link>
                <Link href="/signup" className="bg-green-800 text-white text-center rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors" onClick={() => setMobileOpen(false)}>{tr('nav.signup')}</Link>
              </>
            )}
            <div className="pt-1">
              <LanguageToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
