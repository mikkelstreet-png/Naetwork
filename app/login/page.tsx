'use client';

import Link from 'next/link';
import { AccountLogin } from '@/components/AccountLogin';

export default function LoginPage() {
  return (
    <main className="pt-16">
      <div className="max-w-md mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Log ind</h1>
        <p className="text-gray-500 mb-8">Velkommen tilbage til Naetwork.</p>

        <AccountLogin redirectTo="/dashboard" />

        <p className="text-center text-sm text-gray-500 mt-6">
          Har du ikke en konto?{' '}
          <Link href="/signup" className="text-green-800 hover:underline">Opret konto</Link>
        </p>

        <div className="mt-4 text-center">
          <Link href="/professional/signup" className="text-sm text-gray-400 hover:text-green-800">
            Bliv professionel →
          </Link>
        </div>
      </div>
    </main>
  );
}
