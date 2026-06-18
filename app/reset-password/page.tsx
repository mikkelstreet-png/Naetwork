'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError('Password stemmer ikke overens.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setDone(true);
      setTimeout(() => router.push('/profil'), 2000);
    }
  }

  if (done) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f4] px-6 pt-16">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="mb-3 text-2xl font-black text-gray-950">Password opdateret</h1>
          <p className="text-gray-500">Du bliver sendt videre til din profil...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f4] px-6 pt-16">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <Link href="/" className="mb-8 inline-flex items-center gap-2" aria-label="Naetwork home">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-950 text-[11px] font-black text-white">N</span>
          <span className="font-black tracking-tight text-gray-950">Naetwork</span>
        </Link>
        <h1 className="text-3xl font-black text-gray-950">Nyt password</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">Vælg et nyt password til din konto.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Nyt password</label>
            <input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-colors focus:border-gray-950" placeholder="Mindst 8 tegn" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Bekræft password</label>
            <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-colors focus:border-gray-950" placeholder="Gentag password" />
          </div>
          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-gray-950 py-3 font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-50">
            {loading ? 'Gemmer...' : 'Gem nyt password'}
          </button>
        </form>
      </div>
    </main>
  );
}
