'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError('Forkert e-mail eller password. Prøv igen.');
      setLoading(false);
    } else {
      router.push('/profil');
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] px-6 pt-16">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <section className="hidden rounded-2xl border border-gray-900 bg-gray-950 p-8 text-white shadow-2xl shadow-gray-950/10 lg:block">
          <p className="mb-6 text-xs font-semibold uppercase tracking-wide text-cyan-200">Naetwork</p>
          <h1 className="max-w-lg text-5xl font-black leading-none tracking-tight text-white">Velkommen tilbage til dit career layer.</h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-gray-400">Se bookinger, administrer profil og fortsæt samtalerne med de professionals, der kender vejen indefra.</p>
          <div className="mt-10 grid grid-cols-3 gap-3">
            {['60 min', 'AI', 'Banking'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm font-bold text-white">{item}</div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <Link href="/" className="mb-8 inline-flex items-center gap-2" aria-label="Naetwork home">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-950 text-[11px] font-black text-white">N</span>
            <span className="font-black tracking-tight text-gray-950">Naetwork</span>
          </Link>
          <h1 className="text-3xl font-black text-gray-950">Log ind</h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">Fortsæt til din profil, dine bookinger og dine 60-minutters sessions.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-colors focus:border-gray-950"
                placeholder="dit@eksempel.dk"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-colors focus:border-gray-950"
                placeholder="Mindst 8 tegn"
              />
            </div>
            {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gray-950 py-3 font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? 'Logger ind...' : 'Log ind'}
            </button>
          </form>
          <div className="mt-6 space-y-3 text-center text-sm text-gray-500">
            <p><Link href="/forgot-password" className="font-semibold text-gray-950 underline decoration-gray-300 underline-offset-4 hover:decoration-gray-950">Glemt password?</Link></p>
            <p>Har du ikke en konto? <Link href="/signup" className="font-semibold text-gray-950 underline decoration-gray-300 underline-offset-4 hover:decoration-gray-950">Opret her</Link></p>
          </div>
        </section>
      </div>
    </main>
  );
}
