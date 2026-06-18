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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function saveNotifications() {
    setSaving(true);
    await supabase.from('profiles').update({
      notification_booking_reminders: Boolean(profile.notification_booking_reminders),
      notification_marketing: Boolean(profile.notification_marketing),
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
      setDeleteError('Skriv SLET for at bekræfte.');
      return;
    }
    setDeleteLoading(true);
    await supabase.from('profiles').update({ status: 'deletion_requested' }).eq('auth_user_id', user.id);
    await supabase.auth.signOut();
    setDeleteDone(true);
    setDeleteLoading(false);
  }

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-[#f7f7f4] pt-16"><div className="text-gray-400">Indlæser...</div></main>;
  }

  if (deleteDone) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f4] px-6 pt-16">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="mb-3 text-2xl font-black text-gray-950">Anmodning modtaget</h1>
          <p className="leading-relaxed text-gray-500">Din konto er markeret til sletning. Vi behandler din anmodning inden for 30 dage.</p>
          <Link href="/" className="mt-8 inline-flex rounded-full bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800">Tilbage til forsiden</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] pt-16">
      <div className="mx-auto max-w-5xl px-6 py-10 md:py-14">
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-end md:justify-between md:p-8">
          <div>
            <Link href="/" className="mb-8 inline-flex items-center gap-2" aria-label="Naetwork home">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-950 text-[11px] font-black text-white">N</span>
              <span className="font-black tracking-tight text-gray-950">Naetwork</span>
            </Link>
            <p className="text-xs font-semibold uppercase text-gray-400">Account</p>
            <h1 className="mt-2 text-4xl font-black leading-none tracking-tight text-gray-950">Min profil</h1>
            <p className="mt-3 text-sm text-gray-500">{user?.email}</p>
          </div>
          <button onClick={handleSignOut} className="w-fit rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-gray-950 hover:text-gray-950">Log ud</button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
              <h2 className="mb-5 text-sm font-black uppercase tracking-wide text-gray-400">Dine oplysninger</h2>
              <div className="divide-y divide-gray-100">
                {[
                  ['Navn', profile?.name || 'Ikke angivet'],
                  ['E-mail', user?.email],
                  ['Rolle', profile?.role || 'Ikke angivet'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-5 py-4 text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="text-right font-semibold capitalize text-gray-950">{value}</span>
                  </div>
                ))}
              </div>
              {profile?.role === 'professional' && (
                <Link href="/profil/professionel" className="mt-5 inline-flex rounded-full bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800">
                  Rediger professionel profil
                </Link>
              )}
            </section>

            {profile && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
                <h2 className="mb-5 text-sm font-black uppercase tracking-wide text-gray-400">E-mailindstillinger</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-5 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <div>
                      <p className="font-semibold text-gray-950">Servicemeddelelser</p>
                      <p className="mt-1 text-xs text-gray-500">Kontobekræftelse, sikkerheds- og bookingbeskeder kan ikke frameldes.</p>
                    </div>
                    <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-600">Påkrævet</span>
                  </div>
                  {[
                    ['notification_booking_reminders', 'Booking-påmindelser', 'Påmindelser om kommende 60-minutters sessioner'],
                    ['notification_marketing', 'Nyhedsbrev og marketing', 'Nyheder, tips og opdateringer fra Naetwork'],
                  ].map(([key, title, body]) => (
                    <div key={key} className="flex items-center justify-between gap-5 rounded-2xl border border-gray-200 bg-white p-4">
                      <div>
                        <p className="font-semibold text-gray-950">{title}</p>
                        <p className="mt-1 text-xs text-gray-500">{body}</p>
                      </div>
                      <button
                        onClick={() => setProfile((p: any) => ({ ...p, [key]: !p[key] }))}
                        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${profile[key] ? 'bg-gray-950' : 'bg-gray-200'}`}
                        aria-pressed={Boolean(profile[key])}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${profile[key] ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={saveNotifications} disabled={saving} className="mt-5 rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50">
                  {saved ? 'Gemt' : saving ? 'Gemmer...' : 'Gem indstillinger'}
                </button>
              </section>
            )}

            <section className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm md:p-8">
              <h2 className="mb-2 text-sm font-black uppercase tracking-wide text-red-600">Slet konto</h2>
              {!showDelete ? (
                <>
                  <p className="mb-5 text-sm leading-relaxed text-gray-500">Når du sletter din bruger, fjerner eller anonymiserer vi din profil, hvor det er muligt. Nogle oplysninger kan skulle opbevares i en begrænset periode af juridiske eller regnskabsmæssige årsager.</p>
                  <button onClick={() => setShowDelete(true)} className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">Slet min konto</button>
                </>
              ) : (
                <>
                  <p className="mb-4 text-sm leading-relaxed text-gray-500">Er du sikker? Denne handling kan ikke fortrydes. Skriv <strong>SLET</strong> for at bekræfte.</p>
                  <input type="text" value={deleteInput} onChange={e => setDeleteInput(e.target.value)} placeholder="Skriv SLET" className="mb-3 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-colors focus:border-red-500" />
                  {deleteError && <p className="mb-3 text-sm text-red-600">{deleteError}</p>}
                  <div className="flex flex-wrap gap-3">
                    <button onClick={handleDelete} disabled={deleteLoading} className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">{deleteLoading ? 'Behandler...' : 'Bekræft sletning'}</button>
                    <button onClick={() => { setShowDelete(false); setDeleteInput(''); setDeleteError(''); }} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Annuller</button>
                  </div>
                </>
              )}
            </section>
          </div>

          <aside className="space-y-4">
            <Link href="/profil/bookings" className="block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-gray-950">
              <p className="text-xs font-semibold uppercase text-gray-400">Bookinger</p>
              <p className="mt-2 text-lg font-black text-gray-950">Se alle sessioner</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">Kommende og tidligere 60-minutters sessioner.</p>
            </Link>
            <button onClick={() => { window.location.href = 'mailto:kontakt@naetwork.dk?subject=Dataeksport' }} className="w-full rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm hover:border-gray-950">
              <p className="text-xs font-semibold uppercase text-gray-400">Dine data</p>
              <p className="mt-2 text-lg font-black text-gray-950">Anmod om dataeksport</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">Vi hjælper med indsigt og eksport efter GDPR.</p>
            </button>
            <Link href="/privacy" className="block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-gray-950">
              <p className="text-xs font-semibold uppercase text-gray-400">Legal</p>
              <p className="mt-2 text-lg font-black text-gray-950">Privatlivspolitik</p>
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
