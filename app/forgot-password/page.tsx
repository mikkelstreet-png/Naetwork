'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Tjek din e-mail</h1>
          <p className="text-gray-500">Hvis kontoen findes, har vi sendt et nulstillingslink til <strong>{email}</strong>.</p>
          <Link href="/login" className="mt-8 inline-block text-indigo-600 hover:underline text-sm">Tilbage til log ind</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link href="/" className="font-bold text-xl tracking-tight text-gray-900">Naetwork</Link>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Glemt password?</h1>
        <p className="text-gray-500 mb-8">Skriv din e-mail, så sender vi dig et link til at nulstille dit password.</p>
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
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Sender...' : 'Send nulstillingslink'}
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-gray-500">
          <Link href="/login" className="text-indigo-600 hover:underline">Tilbage til log ind</Link>
        </p>
      </div>
    </main>
  );
}
