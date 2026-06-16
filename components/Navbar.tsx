'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight text-gray-900">
          Naetwork
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/eksperter" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Find ekspert
          </Link>
          <Link href="/om" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Om Naetwork
          </Link>
          {user ? (
            <>
              <Link href="/profil" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Min profil
              </Link>
              <Link href="/profil/bookings" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Mine bookinger
              </Link>
              <Link href="/book" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                Book session
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Log ind
              </Link>
              <Link href="/book" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                Book session
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-gray-600 hover:text-gray-900" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-3">
          <Link href="/eksperter" className="block text-sm text-gray-600 hover:text-gray-900 py-2" onClick={() => setMenuOpen(false)}>Find ekspert</Link>
          <Link href="/om" className="block text-sm text-gray-600 hover:text-gray-900 py-2" onClick={() => setMenuOpen(false)}>Om Naetwork</Link>
          {user ? (
            <>
              <Link href="/profil" className="block text-sm text-gray-600 hover:text-gray-900 py-2" onClick={() => setMenuOpen(false)}>Min profil</Link>
              <Link href="/profil/bookings" className="block text-sm text-gray-600 hover:text-gray-900 py-2" onClick={() => setMenuOpen(false)}>Mine bookinger</Link>
              <button onClick={handleSignOut} className="block text-sm text-gray-400 hover:text-gray-700 py-2 w-full text-left">Log ud</button>
            </>
          ) : (
            <Link href="/login" className="block text-sm text-gray-600 hover:text-gray-900 py-2" onClick={() => setMenuOpen(false)}>Log ind</Link>
          )}
          <Link href="/book" className="block bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors text-center" onClick={() => setMenuOpen(false)}>Book session</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;