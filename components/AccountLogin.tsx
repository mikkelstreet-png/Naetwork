'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useTranslation } from '@/context/LanguageContext';

export function AccountLogin() {
  const { tr } = useTranslation();
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
      setError(err.message);
      setLoading(false);
      return;
    }
    window.location.href = '/dashboard';
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">{tr('login.title')}</h1>
          <p className="text-sm text-gray-500">{tr('login.sub')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-1.5">{tr('login.email')}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none focus:border-gray-900 transition-colors"
              placeholder="du@eksempel.dk"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-1.5">{tr('login.password')}</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none focus:border-gray-900 transition-colors"
              placeholder="Din adgangskode"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black transition-colors disabled:opacity-50"
          >
            {loading ? '...' : tr('login.btn')}
          </button>

          <div className="flex items-center justify-end text-sm">
            <Link href="/forgot-password" className="text-gray-500 hover:text-gray-900 transition-colors">
              {tr('login.forgot')}
            </Link>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {tr('login.noAccount')}{' '}
          <Link href="/signup" className="font-semibold text-gray-900 hover:text-black transition-colors">
            {tr('login.signup')}
          </Link>
        </p>
      </div>
    </div>
  );
}
