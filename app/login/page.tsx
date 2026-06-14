'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useTranslation } from '@/context/LanguageContext';

export default function LoginPage() {
  const { tr } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      window.location.href = '/dashboard';
    }
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
              className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5] transition-colors"
              placeholder="du@eksempel.dk"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-[#0A0A0A]">{tr('login.password')}</label>
              <Link href="/forgot-password" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                {tr('login.forgot')}
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5] transition-colors"
              placeholder="••••••••"
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
            className="w-full rounded-md bg-[#4F46E5] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4338CA] transition-colors disabled:opacity-50"
          >
            {loading ? '...' : tr('login.btn')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {tr('login.noAccount')}{' '}
          <Link href="/signup" className="font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors">
            {tr('login.signup')}
          </Link>
        </p>
      </div>
    </div>
  );
}
