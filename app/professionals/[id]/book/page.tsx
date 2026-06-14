'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { BookingSummary } from '@/components/BookingSummary';
import { SessionTypeCard } from '@/components/SessionTypeCard';

const SESSION_TYPES = [
  { type: 'mock_interview', title: 'Mock Interview', description: 'Oev dig til det interview der betyder noget' },
  { type: 'cv_review', title: 'CV & LinkedIn', description: 'Faa professionel feedback paa dit CV og profil' },
  { type: 'informal_chat', title: 'Uformel 1:1', description: 'En aaben snak med en der er naaet dertil' },
  { type: 'career_advice', title: 'Karriereraadgivning', description: 'Strategisk sparring om din naeste karrierebeslutning' },
];

export default function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [professional, setProfessional] = useState<Record<string, unknown> | null>(null);
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [sessionType, setSessionType] = useState('');
  const [message, setMessage] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const supabase = createClient();
    supabase.from('professionals').select('*').eq('id', id).single().then(({ data }) => setProfessional(data));
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user as Record<string, unknown> | null));
  }, [id]);

  const handleSubmit = async () => {
    if (!sessionType) { setError('Vaelg venligst en session-type.'); return; }
    if (!user) { router.push('/login'); return; }
    if (!professional) return;

    setSubmitting(true);
    setError('');

    const supabase = createClient();
    const priceDkk = professional.price_dkk as number;
    const donates = professional.donates_to_charity as boolean;
    const commissionPct = donates ? 0.075 : 0.15;
    const platformFee = Math.round(priceDkk * commissionPct);
    const payout = priceDkk - platformFee;

    const { error: bookingError } = await supabase.from('bookings').insert({
      candidate_id: user.id,
      professional_id: id,
      session_type: sessionType,
      message: message || null,
      price_dkk: priceDkk,
      commission_pct: commissionPct,
      platform_fee_dkk: platformFee,
      professional_payout_dkk: payout,
      donates_to_charity: donates,
      status: 'pending',
      scheduled_at: preferredTime ? new Date(preferredTime).toISOString() : null,
    });

    if (bookingError) {
      setError('Noget gik galt. Proev igen.');
    } else {
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <main className="pt-16 max-w-lg mx-auto px-6 py-20 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-7 h-7 text-green-800" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Booking modtaget</h2>
        <p className="text-gray-500 mb-8">
          Din booking er modtaget. Vi vender tilbage med bekraeftelse inden for 24 timer.
          Betaling bekraeftes inden for 24 timer.
        </p>
        <Link href="/dashboard" className="bg-green-800 text-white font-medium px-6 py-3 rounded-xl hover:bg-green-900 transition-colors inline-block">
          Se mine bookinger
        </Link>
      </main>
    );
  }

  const availableTypes = professional
    ? SESSION_TYPES.filter(s => (professional.session_types as string[]).includes(s.type))
    : SESSION_TYPES;

  return (
    <main className="pt-16">
      <div className="max-w-4xl mx-auto px-6 py-12">

        <Link href={`/professionals/${id}`} className="text-sm text-gray-400 hover:text-gray-700 mb-8 inline-block">
          ← Tilbage til profil
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Book en session</h1>
        {professional && (
          <p className="text-gray-500 mb-8">med {professional.name as string}</p>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">

            {/* Session type */}
            <div>
              <h2 className="font-semibold text-gray-900 mb-4">Vaelg session-type</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {availableTypes.map(s => (
                  <SessionTypeCard
                    key={s.type}
                    type={s.type}
                    title={s.title}
                    description={s.description}
                    selected={sessionType === s.type}
                    onClick={() => setSessionType(s.type)}
                  />
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="font-semibold text-gray-900 block mb-2">
                Besked til den professionelle <span className="font-normal text-gray-400 text-sm">(valgfri)</span>
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Fortael kort om dit maal med sessionen og hvad du haaber at faa ud af den..."
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-800 resize-none"
              />
            </div>

            {/* Preferred time */}
            <div>
              <label className="font-semibold text-gray-900 block mb-2">
                Foretrukken tid
              </label>
              <input
                type="text"
                value={preferredTime}
                onChange={e => setPreferredTime(e.target.value)}
                placeholder='F.eks. "Mandag 16-18 eller tirsdag formiddag"'
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-800"
              />
              <p className="text-xs text-gray-400 mt-2">Den professionelle bekraefter den endelige tid med dig.</p>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            {!user && (
              <div className="border border-amber-200 bg-amber-50 rounded-xl p-4 text-sm text-amber-800">
                Du skal vaere logget ind for at booke.{' '}
                <Link href="/login" className="font-medium underline">Log ind her</Link>.
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting || !sessionType}
              className="w-full bg-green-800 text-white font-medium py-4 rounded-xl hover:bg-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Sender...' : 'Betal og book'}
            </button>
            <p className="text-xs text-gray-400 text-center">Betaling bekraeftes inden for 24 timer</p>

          </div>

          {/* Summary sidebar */}
          <div className="sticky top-20">
            {professional && (
              <BookingSummary
                priceDkk={professional.price_dkk as number}
                donatesToCharity={professional.donates_to_charity as boolean}
              />
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
