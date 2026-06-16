'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteDone, setDeleteDone] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser(user);
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();
      setProfile(data);
      setLoading(false);
    }
    load();
  }, []);

  async function saveNotifications() {
    setSaving(true);
    await supabase.from('profiles').update({
      notification_booking_reminders: profile.notification_booking_reminders,
      notification_marketing: profile.notification_marketing,
    }).eq('auth_user_id', user.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  async function handleDelete() {
    if (deleteInput !== 'SLET') {
      setDeleteError('Skriv SLET for at bekrÃ¦fte.');
      return;
    }
    setDeleteLoading(true);
    await supabase.from('profiles').update({ status: 'deletion_requested' }).eq('auth_user_id', user.id);
    await supabase.auth.signOut();
    setDeleteDone(true);
    setDeleteLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-400">IndlÃ¦ser...</div>
      </main>
    );
  }

  if (deleteDone) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Anmodning modtaget</h1>
          <p className="text-gray-500">Din konto er markeret til sletning. Vi behandler din anmodning inden for 30 dage.</p>
          <Link href="/" className="mt-8 inline-block text-indigo-600 hover:underline text-sm">Tilbage til forsiden</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="font-bold text-xl tracking-tight text-gray-900">Naetwork</Link>
          <button onClick={handleSignOut} className="text-sm text-gray-400 hover:text-gray-700">Log ud</button>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Min profil</h1>
        <p className="text-gray-500 mb-10">{user?.email}</p>

        <section className="mb-10">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Dine oplysninger</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Navn</span>
              <span className="text-gray-900 font-medium">{profile?.name || 'â'}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">E-mail</span>
              <span className="text-gray-900 font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Rolle</span>
              <span className="text-gray-900 font-medium capitalize">{profile?.role || 'â'}</span>
            </div>
          </div>
          {profile?.role === 'professional' && (
            <div className="mt-4">
              <Link href="/profil/professionel" className="text-sm text-indigo-600 hover:underline">
                Rediger din professionelle profil â
              </Link>
            </div>
          )}
        </section>

        {profile && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">E-mailindstillinger</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-gray-900 font-medium">Servicemeddelelser</p>
                  <p className="text-xs text-gray-400">KontobekrÃ¦ftelse, sikkerheds- og bookingbeskeder â kan ikke frameldes</p>
                </div>
                <div className="text-xs text-gray-400 font-medium">PÃ¥krÃ¦vet</div>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-gray-900 font-medium">Booking-pÃ¥mindelser</p>
                  <p className="text-xs text-gray-400">PÃ¥mindelser om kommende sessioner</p>
                </div>
                <button
                  onClick={() => setProfile((p: any) => ({ ...p, notification_booking_reminders: !p.notification_booking_reminders }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${profile.notification_booking_reminders ? 'bg-indigo-600' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${profile.notification_booking_reminders ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-gray-900 font-medium">Nyhedsbrev og marketing</p>
                  <p className="text-xs text-gray-400">Nyheder, tips og opdateringer fra Naetwork</p>
                </div>
                <button
                  onClick={() => setProfile((p: any) => ({ ...p, notification_marketing: !p.notification_marketing }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${profile.notification_marketing ? 'bg-indigo-600' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${profile.notification_marketing ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
            <button
              onClick={saveNotifications}
              disabled={saving}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {saved ? 'Gemt!' : saving ? 'Gemmer...' : 'Gem indstillinger'}
            </button>
          </section>
        )}

        <section className="mb-10">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Dine bookinger</h2>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">Kommende og tidligere sessioner</span>
            <Link href="/profil/bookings" className="text-sm text-indigo-600 hover:underline font-medium">
              Se alle bookinger →
            </Link>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Dine data</h2>
          <p className="text-sm text-gray-500 mb-3">Du kan til enhver tid anmode om at fÃ¥ udleveret dine data i henhold til GDPR.</p>
          <button className="text-sm text-indigo-600 hover:underline">Anmod om dataeksport</button>
        </section>

        <section className="border border-red-100 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-2">Slet konto</h2>
          {!showDelete ? (
            <>
              <p className="text-sm text-gray-500 mb-4">
                NÃ¥r du sletter din bruger, fjerner eller anonymiserer vi din profil, hvor det er muligt. Nogle oplysninger kan skulle opbevares i en begrÃ¦nset periode af juridiske eller regnskabsmÃ¦ssige Ã¥rsager.
              </p>
              <button
                onClick={() => setShowDelete(true)}
                className="text-sm border border-red-300 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
              >
                Slet min konto
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">
                Er du sikker? Denne handling kan ikke fortrydes. For at bekrÃ¦fte, skriv <strong>SLET</strong> i feltet nedenfor.
              </p>
              <input
                type="text"
                value={deleteInput}
                onChange={e => setDeleteInput(e.target.value)}
                placeholder="Skriv SLET"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400 mb-3"
              />
              {deleteError && <p className="text-red-600 text-sm mb-3">{deleteError}</p>}
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deleteLoading ? 'Behandler...' : 'BekrÃ¦ft sletning'}
                </button>
                <button
                  onClick={() => { setShowDelete(false); setDeleteInput(''); setDeleteError(''); }}
                  className="text-sm text-gray-400 hover:text-gray-700 px-4 py-2"
                >
                  Annuller
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
