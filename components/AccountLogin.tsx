'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

interface AccountLoginProps {
  redirectTo?: string;
}

export function AccountLogin({ redirectTo = '/dashboard' }: AccountLoginProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError('Forkert email eller adgangskode.');
      setSubmitting(false);
      return;
    }
    router.push(redirectTo);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="din@email.dk"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-800"
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">Adgangskode</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Din adgangskode"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-800"
          required
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-green-800 text-white font-medium py-3 rounded-xl hover:bg-green-900 transition-colors disabled:opacity-50"
      >
        {submitting ? 'Logger ind...' : 'Log ind'}
      </button>
    </form>
  );
}
