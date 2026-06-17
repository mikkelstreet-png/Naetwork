'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function LegacyBookingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    if (id) router.replace(`/professionals/${id}`);
  }, [id, router]);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <p className="text-sm text-gray-500">Sender dig til bookingsiden...</p>
    </main>
  );
}
