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
      setError('Forkert e-mail eller password. Proev igen.');
      setLoading(false);
    } else {
      router.push('/profil');
    }
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link href="/" className="font-bold text-xl tracking-tight text-gray-900">Naetwork</Link>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Log ind</h1>
        <p className="text-gray-500 mb-8">Velkommen tilbage.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="dit@eksempel.dk"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Logger ind...' : 'Log ind'}
          </button>
        </form>
        <div className="mt-6 space-y-2 text-sm text-center text-gray-500">
          <p>
            <Link href="/forgot-password" className="text-indigo-600 hover:underline">Glemt password?</Link>
          </p>
          <p>
            Har du ikke en konto?{' '}
            <Link href="/signup" className="text-indigo-600 hover:underline">Opret her</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
