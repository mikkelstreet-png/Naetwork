'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useTranslation } from '@/context/LanguageContext';

const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-green-800">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const FreeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
  </svg>
);

const ConnectIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
  </svg>
);

const SpeedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

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
    <div className="min-h-screen bg-white flex">
      {/* Left: Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 max-w-xl w-full">
        <div className="mb-10">
          <Link href="/" className="font-bold text-base tracking-tight text-gray-900">
            Naetwork
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">{tr('signup.title')}</h2>
          <p className="text-base text-gray-500">{tr('signup.sub')}</p>
        </div>

        {/* Role selection cards */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button
            type="button"
            onClick={() => setRole('business')}
            className={`relative flex flex-col items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
              role === 'business'
                ? 'border-green-800 bg-green-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            {role === 'business' && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-green-800 flex items-center justify-center">
                <CheckIcon />
              </div>
            )}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${role === 'business' ? 'bg-green-800 text-white' : 'bg-gray-100 text-gray-500'}`}>
              <BriefcaseIcon />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{tr('signup.role.biz')}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-snug">{tr('signup.role.biz.sub')}</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setRole('specialist')}
            className={`relative flex flex-col items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
              role === 'specialist'
                ? 'border-green-800 bg-green-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            {role === 'specialist' && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-green-800 flex items-center justify-center">
                <CheckIcon />
              </div>
            )}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${role === 'specialist' ? 'bg-green-800 text-white' : 'bg-gray-100 text-gray-500'}`}>
              <UserIcon />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{tr('signup.role.spec')}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-snug">{tr('signup.role.spec.sub')}</p>
            </div>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
              {tr('signup.name')}
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-900 transition-colors"
              placeholder="Dit navn eller virksomhedsnavn"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
              {tr('signup.email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-900 transition-colors"
              placeholder="du@eksempel.dk"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
              {tr('signup.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
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
            {loading ? '...' : tr('signup.btn')}
          </button>

          <p className="text-xs text-gray-400 text-center leading-relaxed">
            {tr('signup.terms')}{' '}
            <Link href="/vilkaar" className="underline hover:text-gray-600">{tr('signup.termsLink')}</Link>{' '}
            {tr('signup.privacy')}{' '}
            <Link href="/privatlivspolitik" className="underline hover:text-gray-600">{tr('signup.privacyLink')}</Link>.
          </p>
        </form>

        <p className="mt-8 text-sm text-gray-500 text-center">
          {tr('signup.hasAccount')}{' '}
          <Link href="/login" className="font-semibold text-gray-900 hover:text-green-800 transition-colors">
            {tr('signup.login')}
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
            {tr('signup.brand.tagline')}
          </p>
          <div className="space-y-4">
            {[
              { icon: <FreeIcon />, key: 'signup.brand.t1' },
              { icon: <ConnectIcon />, key: 'signup.brand.t2' },
              { icon: <SpeedIcon />, key: 'signup.brand.t3' },
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

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
