'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

export function Navbar() {
  const [session, setSession] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setSession(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(!!data.session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(!!s);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#e5e5e5]">
      <div className="wrap flex items-center justify-between h-14">
        <Link href="/" className="font-semibold text-[15px] tracking-tight text-[#0a0a0a]">
          Naetwork
        </Link>
        <div className="flex items-center gap-3">
          {session === null ? null : session ? (
            <>
              <Link href="/dashboard" className="text-[14px] text-[#6b7280] hover:text-[#0a0a0a] transition-colors">
                Dashboard
              </Link>
              <Link href="/projekter" className="text-[14px] text-[#6b7280] hover:text-[#0a0a0a] transition-colors">
                Projekter
              </Link>
              <button
                onClick={handleLogout}
                className="text-[14px] text-[#6b7280] hover:text-[#0a0a0a] transition-colors"
              >
                Log ud
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-[14px] text-[#6b7280] hover:text-[#0a0a0a] transition-colors">
                Log ind
              </Link>
              <Link
                href="/projekt/opret"
                className="inline-flex items-center justify-center rounded-md bg-[#1a1a1a] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#333] transition-colors"
              >
                Opret projekt
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
