'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useTranslation } from '@/context/LanguageContext';

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const ConnectIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
  </svg>
);

const FreeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
  </svg>
);

export default function LoginPage() {
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
    <div className="min-h-screen bg-white flex">
      {/* Left: Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 max-w-xl w-full">
        <div className="mb-10">
          <Link href="/" className="font-bold text-base tracking-tight text-gray-900">
            Naetwork
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">{tr('login.title')}</h2>
          <p className="text-base text-gray-500">{tr('login.sub')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
              {tr('login.email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-900 transition-colors"
              placeholder="du@eksempel.dk"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest">
                {tr('login.password')}
              </label>
              <Link href="/forgot-password" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
                {tr('login.forgot')}
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-900 transition-colors"
              placeholder="Min. 6 tegn"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-800 text-white hover:bg-green-900 rounded-lg px-5 py-3 text-sm font-semibold transition-colors disabled:opacity-60 mt-2"
          >
            {loading ? '...' : tr('login.btn')}
          </button>
        </form>

        <p className="mt-8 text-sm text-gray-500">
          {tr('login.noAccount')}{' '}
          <Link href="/signup" className="font-semibold text-gray-900 hover:text-green-800 transition-colors">
            {tr('login.signup')}
          </Link>
        </p>
      </div>

      {/* Right: Brand panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-between bg-gray-900 px-16 py-16">
        <div>
          <p className="font-bold text-base tracking-tight text-white">Naetwork</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-white leading-tight mb-10 tracking-tight">
            {tr('login.brand.tagline')}
          </p>
          <div className="space-y-4">
            {[
              { icon: <FreeIcon />, key: 'login.brand.t1' },
              { icon: <ConnectIcon />, key: 'login.brand.t2' },
              { icon: <ShieldIcon />, key: 'login.brand.t3' },
            ].map(({ icon, key }) => (
              <div key={key} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                  {icon}
                </div>
                <p className="text-sm text-gray-400">{tr(key)}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-600">Et gratis, uafhængigt AI-initiativ.</p>
      </div>
    </div>
  );
}
