'use client';

import type { User } from '@supabase/supabase-js';
import { ArrowRight, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MemberNav } from '@/components/MemberNav';
import { createClient } from '@/lib/supabase/client';

interface AccountProfile {
  name: string | null;
  role: string;
  notification_booking_reminders: boolean;
  notification_marketing: boolean;
}

type NotificationKey = 'notification_booking_reminders' | 'notification_marketing';

export default function ProfilPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteDone, setDeleteDone] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    async function load() {
      const supabase = createClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) { router.replace('/login?next=/profil'); return; }
      const { data, error } = await supabase
        .from('profiles')
        .select('name, role, notification_booking_reminders, notification_marketing')
        .eq('auth_user_id', currentUser.id)
        .single();
      if (!active) return;
      setUser(currentUser);
      if (error || !data) {
        setLoadError('Din kontoprofil kunne ikke indlæses. Prøv igen eller kontakt os.');
        setProfile(null);
      } else {
        setProfile(data as AccountProfile);
      }
      setLoading(false);
    }
    load();
    return () => { active = false; };
  }, [router]);

  async function saveNotifications() {
    if (!profile || !user) return;
    setSaving(true);
    setSaveError('');
    const { error } = await createClient().from('profiles').update({
      notification_booking_reminders: profile.notification_booking_reminders,
      notification_marketing: profile.notification_marketing,
    }).eq('auth_user_id', user.id);
    setSaving(false);
    if (error) {
      setSaveError('Indstillingerne kunne ikke gemmes. Prøv igen.');
      return;
    }
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2_000);
  }

  async function handleSignOut() {
    await createClient().auth.signOut();
    router.push('/');
  }

  async function handleDelete() {
    if (deleteInput !== 'SLET') {
      setDeleteError('Skriv SLET for at bekræfte.');
      return;
    }
    setDeleteLoading(true);
    setDeleteError('');
    const response = await fetch('/api/account', { method: 'DELETE' });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setDeleteError(result.error || 'Kontoen kunne ikke slettes.');
      setDeleteLoading(false);
      return;
    }
    await createClient().auth.signOut();
    setDeleteDone(true);
    setDeleteLoading(false);
  }

  function toggleNotification(key: NotificationKey) {
    setProfile((current) => current ? { ...current, [key]: !current[key] } : current);
    setSaved(false);
  }

  if (loading) {
    return <main className="min-h-[calc(100vh-4rem)] bg-[#f7f7f4] px-5 py-16 text-center text-sm text-gray-400">Indlæser din konto...</main>;
  }

  if (deleteDone) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center bg-white px-5 py-16">
        <div className="mx-auto w-full max-w-xl border-y border-gray-200 py-12 text-center">
          <h1 className="text-3xl font-black text-gray-950">Konto slettet</h1>
          <p className="mt-4 leading-relaxed text-gray-500">Din konto og profil er slettet. Oplysninger, som vi juridisk skal opbevare, anonymiseres eller begrænses.</p>
          <Link href="/" className="mt-8 inline-flex rounded-lg bg-gray-950 px-5 py-3 text-sm font-black text-white">Til forsiden</Link>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center bg-white px-5 py-16">
        <div className="mx-auto w-full max-w-xl border-y border-gray-200 py-12 text-center">
          <h1 className="text-3xl font-black text-gray-950">Kontoen kunne ikke indlæses</h1>
          <p role="alert" className="mt-4 text-sm leading-relaxed text-gray-500">{loadError || 'Prøv igen senere.'}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => window.location.reload()} className="rounded-lg bg-gray-950 px-5 py-3 text-sm font-black text-white">Prøv igen</button>
            <Link href="/contact" className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-black text-gray-950">Kontakt os</Link>
          </div>
        </div>
      </main>
    );
  }

  const isProfessional = profile.role === 'professional';

  return (
    <main className="min-h-screen bg-[#f7f7f4]">
      <section className="border-b border-gray-200 bg-white px-5 py-10 sm:px-8 md:py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase text-gray-400">Konto</p>
            <h1 className="mt-3 text-4xl font-black leading-none text-gray-950 md:text-6xl">Dine indstillinger.</h1>
            <p className="mt-4 text-sm text-gray-500">{user?.email}</p>
          </div>
          <button onClick={handleSignOut} className="inline-flex w-fit items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-black text-gray-950 hover:border-gray-950">
            <LogOut size={16} aria-hidden="true" /> Log ud
          </button>
        </div>
      </section>

      <MemberNav isProfessional={isProfessional} />

      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-10 sm:px-8 md:py-14 lg:grid-cols-[1fr_280px]">
        <div className="space-y-12">
          <section>
            <p className="text-xs font-black uppercase text-gray-400">Profiloplysninger</p>
            <h2 className="mt-2 text-2xl font-black text-gray-950">Din konto</h2>
            <dl className="mt-5 border-t border-gray-300 bg-white">
              {[
                ['Navn', profile.name || 'Ikke angivet'],
                ['E-mail', user?.email || 'Ikke angivet'],
                ['Rolle', isProfessional ? 'Professional' : 'Kandidat'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-5 border-b border-gray-300 px-4 py-4 text-sm">
                  <dt className="text-gray-500">{label}</dt>
                  <dd className="text-right font-black text-gray-950">{value}</dd>
                </div>
              ))}
            </dl>
            {isProfessional && <Link href="/profil/professionel" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-gray-950 underline decoration-gray-300 underline-offset-4">Rediger professionel profil <ArrowRight size={15} aria-hidden="true" /></Link>}
          </section>

          {profile && (
            <section>
              <p className="text-xs font-black uppercase text-gray-400">Kommunikation</p>
              <h2 className="mt-2 text-2xl font-black text-gray-950">E-mailindstillinger</h2>
              <div className="mt-5 border-t border-gray-300 bg-white">
                <div className="flex items-center justify-between gap-5 border-b border-gray-300 px-4 py-5">
                  <div><p className="font-black text-gray-950">Servicemeddelelser</p><p className="mt-1 text-xs leading-relaxed text-gray-500">Konto-, sikkerheds- og bookingmails kan ikke frameldes.</p></div>
                  <span className="text-xs font-black uppercase text-gray-400">Påkrævet</span>
                </div>
                {([
                  ['notification_booking_reminders', 'Bookingpåmindelser', 'Påmindelser om kommende 60-minutters sessioner'],
                  ['notification_marketing', 'Nyheder fra Naetwork', 'Relevante nyheder, tips og produktopdateringer'],
                ] as Array<[NotificationKey, string, string]>).map(([key, title, body]) => (
                  <div key={key} className="flex items-center justify-between gap-5 border-b border-gray-300 px-4 py-5">
                    <div><p className="font-black text-gray-950">{title}</p><p className="mt-1 text-xs leading-relaxed text-gray-500">{body}</p></div>
                    <button onClick={() => toggleNotification(key)} className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${profile[key] ? 'bg-gray-950' : 'bg-gray-200'}`} role="switch" aria-checked={profile[key]} aria-label={title}>
                      <span className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${profile[key] ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
              {saveError && <p role="alert" className="mt-4 text-sm text-red-700">{saveError}</p>}
              <button onClick={saveNotifications} disabled={saving} className="mt-5 rounded-lg bg-gray-950 px-5 py-3 text-sm font-black text-white hover:bg-gray-800 disabled:opacity-50">
                {saved ? 'Gemt' : saving ? 'Gemmer...' : 'Gem indstillinger'}
              </button>
            </section>
          )}

          <section className="border-t border-red-200 pt-7">
            <p className="text-xs font-black uppercase text-red-600">Slet konto</p>
            <h2 className="mt-2 text-2xl font-black text-gray-950">Permanent sletning</h2>
            {!showDelete ? (
              <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <p className="max-w-2xl text-sm leading-relaxed text-gray-500">Din profil fjernes eller anonymiseres, hvor det er muligt. Oplysninger med lovpligtig opbevaring begrænses.</p>
                <button onClick={() => setShowDelete(true)} className="w-fit shrink-0 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-black text-red-700 hover:bg-red-50">Slet min konto</button>
              </div>
            ) : (
              <div className="mt-5 border border-red-200 bg-white p-5">
                <p className="text-sm leading-relaxed text-gray-600">Handlingen kan ikke fortrydes. Skriv <strong>SLET</strong> for at bekræfte.</p>
                <input aria-label="Bekræft sletning" value={deleteInput} onChange={(event) => setDeleteInput(event.target.value)} placeholder="Skriv SLET" className="mt-4 w-full max-w-sm rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500" />
                {deleteError && <p role="alert" className="mt-3 text-sm text-red-700">{deleteError}</p>}
                <div className="mt-4 flex flex-wrap gap-3">
                  <button onClick={handleDelete} disabled={deleteLoading} className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-black text-white hover:bg-red-700 disabled:opacity-50">{deleteLoading ? 'Behandler...' : 'Bekræft sletning'}</button>
                  <button onClick={() => { setShowDelete(false); setDeleteInput(''); setDeleteError(''); }} className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-black text-gray-700">Annuller</button>
                </div>
              </div>
            )}
          </section>
        </div>

        <aside>
          <p className="mb-3 text-xs font-black uppercase text-gray-400">Hjælp og data</p>
          <div className="border-t border-gray-300">
            {[
              { href: '/profil/bookings', label: 'Se alle sessioner' },
              { href: '/contact', label: 'Anmod om dataeksport' },
              { href: '/privacy', label: 'Privatlivspolitik' },
            ].map((item) => (
              <Link key={item.href + item.label} href={item.href} className="flex items-center justify-between gap-3 border-b border-gray-300 py-4 text-sm font-black text-gray-950 hover:text-gray-500">
                {item.label}<ArrowRight size={15} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
