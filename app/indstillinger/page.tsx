'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase';
import { HeartIcon } from '@/components/icons/HeartIcon';

type DbRow = Record<string, unknown>;

export default function IndstillingerPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [professional, setProfessional] = useState<DbRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [priceDkk, setPriceDkk] = useState(700);
  const [available, setAvailable] = useState(true);
  const [donatesToCharity, setDonatesToCharity] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) { router.push('/login'); return; }
      setUser(u);
      const { data: pro } = await supabase.from('professionals').select('*').eq('user_id', u.id).single();
      if (pro) {
        setProfessional(pro as DbRow);
        setPriceDkk(pro.price_dkk as number);
        setAvailable(pro.available as boolean);
        setDonatesToCharity(pro.donates_to_charity as boolean);
      }
      setLoading(false);
    })();
  }, [router]);

  const handleSave = async () => {
    if (!professional) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from('professionals').update({ price_dkk: priceDkk, available, donates_to_charity: donatesToCharity }).eq('id', professional.id as string);
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000);
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Er du sikker? Denne handling kan ikke fortrydes.')) return;
    setDeleting(true);
    const res = await fetch('/api/auth/delete-user', { method: 'DELETE' });
    if (res.ok) { router.push('/'); } else { alert('Kunne ikke slette konto.'); setDeleting(false); }
  };

  if (loading) return (
    <main className="pt-16 max-w-xl mx-auto px-6 py-12">
      <div className="animate-pulse space-y-4">{[...Array(4)].map((_,i) => <div key={i} className="h-12 bg-gray-100 rounded-xl" />)}</div>
    </main>
  );

  void user;

  return (
    <main className="pt-16">
      <div className="max-w-xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Indstillinger</h1>
        {professional ? (
          <div className="space-y-8">
            <div className="border border-gray-100 rounded-2xl p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Pris per session</h2>
              <div className="mb-2 text-sm font-medium text-gray-700">DKK {priceDkk}</div>
              <input type="range" min={300} max={2000} step={50} value={priceDkk} onChange={e => setPriceDkk(Number(e.target.value))} className="w-full accent-green-800" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>DKK 300</span><span>DKK 2.000</span></div>
            </div>
            <div className="border border-gray-100 rounded-2xl p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Tilgaengelighed</h2>
              <div onClick={() => setAvailable(v => !v)} className={`w-10 h-6 rounded-full transition-colors cursor-pointer flex items-center px-1 ${available ? 'bg-green-800' : 'bg-gray-200'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${available ? 'translate-x-4' : ''}`} />
              </div>
              <p className="text-sm text-gray-500 mt-2">{available ? 'Tilgaengelig for bookinger' : 'Ikke tilgaengelig'}</p>
            </div>
            <div className="border border-gray-100 rounded-2xl p-6">
              <h2 className="font-semibold text-gray-900 mb-2">Donationsindstillinger</h2>
              <p className="text-sm text-gray-500 mb-4">Platformsbidrag reduceres fra 15% til 7,5% ved donation.</p>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={donatesToCharity} onChange={e => setDonatesToCharity(e.target.checked)} className="mt-0.5 accent-rose-600 w-4 h-4" />
                <span className="text-sm text-gray-700 flex items-center gap-1.5"><HeartIcon className="w-4 h-4 text-rose-500 flex-shrink-0" />Donerer mit honorar til Kraeftens Bekaempelse</span>
              </label>
            </div>
            <button onClick={handleSave} disabled={saving} className="w-full bg-green-800 text-white font-medium py-3 rounded-xl hover:bg-green-900 transition-colors disabled:opacity-50">
              {saving ? 'Gemmer...' : saved ? 'Gemt!' : 'Gem aendringer'}
            </button>
          </div>
        ) : (
          <div className="border border-gray-100 rounded-2xl p-6 text-center text-gray-400 text-sm">Ingen professionel profil tilknyttet denne konto.</div>
        )}
        <div className="mt-16 border border-red-100 rounded-2xl p-6">
          <h2 className="font-semibold text-red-700 mb-2">Slet konto</h2>
          <p className="text-sm text-gray-500 mb-4">Denne handling er permanent og kan ikke fortrydes.</p>
          <button onClick={handleDeleteAccount} disabled={deleting} className="text-sm text-red-600 border border-red-200 px-4 py-2 rounded-xl hover:border-red-400 transition-colors disabled:opacity-50">
            {deleting ? 'Sletter...' : 'Slet konto'}
          </button>
        </div>
      </div>
    </main>
  );
}
