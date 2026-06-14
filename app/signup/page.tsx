'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useTranslation } from '@/context/LanguageContext';
import { Suspense } from 'react';

function SignupForm() {
  const { tr } = useTranslation();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<'business' | 'specialist'>('business');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const r = searchParams.get('role');
    if (r === 'specialist') setRole('specialist');
    else setRole('business');
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role } },
    });
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    if (data.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, name, role, email });
      fetch('/api/email/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, role }),
      }).catch(() => {});
    }
    if (role === 'specialist') {
      window.location.href = '/specialist/profil';
    } else {
      window.location.href = '/dashboard';
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">{tr('signup.title')}</h1>
        </div>

        {/* Role toggle */}
        <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
          <button
            type="button"
            onClick={() => setRole('business')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              role === 'business'
                ? 'bg-white text-[#0A0A0A] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tr('signup.role.biz')}
          </button>
          <button
            type="button"
            onClick={() => setRole('specialist')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              role === 'specialist'
                ? 'bg-white text-[#0A0A0A] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tr('signup.role.spec')}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-1.5">{tr('signup.name')}</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none focus:border-gray-900 transition-colors"
              placeholder="Dit navn eller virksomhedsnavn"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-1.5">{tr('signup.email')}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none focus:border-gray-900 transition-colors"
              placeholder="du@eksempel.dk"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-1.5">{tr('signup.password')}</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none focus:border-gray-900 transition-colors"
              placeholder="Min. 6 tegn"
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
            {loading ? '...' : tr('signup.btn')}
          </button>

          <p className="text-xs text-gray-400 text-center leading-relaxed">
            {tr('signup.terms')}{' '}
            <Link href="/vilkaar" className="underline hover:text-gray-600">{tr('signup.termsLink')}</Link>{' '}
            {tr('signup.privacy')}{' '}
            <Link href="/privatlivspolitik" className="underline hover:text-gray-600">{tr('signup.privacyLink')}</Link>.
          </p>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {tr('signup.hasAccount')}{' '}
          <Link href="/login" className="font-semibold text-gray-900 hover:text-black transition-colors">
            {tr('signup.login')}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
