'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError('Email eller adgangskode er forkert.');
      setLoading(false);
      return;
    }
    window.location.href = '/dashboard';
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f9f9] px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="block mb-8 text-center font-semibold text-[15px] text-[#0a0a0a]">
          Naetwork
        </Link>
        <div className="bg-white border border-[#e5e5e5] rounded-xl p-8">
          <h1 className="text-[20px] font-semibold text-[#0a0a0a] mb-6">Log ind</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-[#e5e5e5] bg-white px-3 py-2.5 text-[14px] text-[#0a0a0a] outline-none focus:border-[#1a1a1a] transition-colors"
                placeholder="din@email.dk"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-1.5">Adgangskode</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-[#e5e5e5] bg-white px-3 py-2.5 text-[14px] text-[#0a0a0a] outline-none focus:border-[#1a1a1a] transition-colors"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-[#1a1a1a] py-2.5 text-[14px] font-medium text-white hover:bg-[#333] transition-colors disabled:opacity-50"
            >
              {loading ? 'Logger ind…' : 'Log ind'}
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-[13px] text-[#6b7280]">
          Ingen konto?{' '}
          <Link href="/signup" className="text-[#0a0a0a] font-medium hover:underline">
            Opret konto
          </Link>
        </p>
      </div>
    </div>
  );
}
