'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const INDUSTRIES = ['Banking', 'Private Equity', 'AI', 'Management Consulting'];
const SESSION_TYPES = ['Mock Interview', 'CV & LinkedIn Review', 'Uformel 1:1', 'Karriererådgivning'];

export default function ProfessionalProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState({
    title: '',
    company: '',
    bio: '',
    industries: [] as string[],
    focus_areas: [] as string[],
    price_dkk: 300,
    visibility: 'hidden',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser(user);
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('auth_user_id', user.id)
        .single();
      if (!profile || profile.role !== 'professional') {
        router.push('/profil');
        return;
      }
      const { data: prof } = await supabase
        .from('professional_profiles')
        .select('*')
        .eq('profile_id', profile.id)
        .single();
      if (prof) {
        setData({
          title: prof.title || '',
          company: prof.company || '',
          bio: prof.bio || '',
          industries: prof.industries || [],
          focus_areas: prof.focus_areas || [],
          price_dkk: prof.price_dkk || 300,
          visibility: prof.visibility || 'hidden',
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  function toggleArr(arr: string[], val: string): string[] {
    return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { data: { user: u } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('auth_user_id', u?.id)
      .single();
    await supabase.from('professional_profiles').upsert({
      profile_id: profile?.id,
      ...data,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'profile_id' });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-400">Indlæser...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="font-bold text-xl tracking-tight text-gray-900">Naetwork</Link>
          <Link href="/profil" className="text-sm text-gray-400 hover:text-gray-700">← Min profil</Link>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Professionel profil</h1>
        <p className="text-gray-500 mb-10">Denne profil er synlig for kandidater, når du publicerer den.</p>
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stillingsbetegnelse</label>
            <input
              type="text"
              value={data.title}
              onChange={e => setData(d => ({ ...d, title: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="f.eks. Associate Director, Goldman Sachs"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Virksomhed / erfaring</label>
            <input
              type="text"
              value={data.company}
              onChange={e => setData(d => ({ ...d, company: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="f.eks. Goldman Sachs, McKinsey, OpenAI"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio <span className="text-gray-400 font-normal">({data.bio.length}/500)</span></label>
            <textarea
              value={data.bio}
              onChange={e => setData(d => ({ ...d, bio: e.target.value.slice(0, 500) }))}
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Beskriv din baggrund og hvad du kan hjælpe kandidater med..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brancher</label>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map(ind => (
                <button
                  key={ind}
                  type="button"
                  onClick={() => setData(d => ({ ...d, industries: toggleArr(d.industries, ind) }))}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${data.industries.includes(ind) ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sessiontyper</label>
            <div className="flex flex-wrap gap-2">
              {SESSION_TYPES.map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setData(d => ({ ...d, focus_areas: toggleArr(d.focus_areas, st) }))}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${data.focus_areas.includes(st) ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pris per session (DKK)</label>
            <input
              type="number"
              min={300}
              max={2000}
              value={data.price_dkk}
              onChange={e => setData(d => ({ ...d, price_dkk: parseInt(e.target.value) || 300 }))}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-400 mt-1">Minimum 300 DKK — maksimum 2.000 DKK</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Synlighed</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setData(d => ({ ...d, visibility: 'hidden' }))}
                className={`py-3 rounded-lg border text-sm font-medium transition-colors ${data.visibility === 'hidden' ? 'border-gray-900 bg-gray-50 text-gray-900' : 'border-gray-200 text-gray-500'}`}
              >
                Skjult
              </button>
              <button
                type="button"
                onClick={() => setData(d => ({ ...d, visibility: 'published' }))}
                className={`py-3 rounded-lg border text-sm font-medium transition-colors ${data.visibility === 'published' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-500'}`}
              >
                Offentliggjort
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Din profil skal godkendes af Naetwork, før den er synlig for kandidater.</p>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {saved ? 'Gemt!' : saving ? 'Gemmer...' : 'Gem profil'}
          </button>
        </form>
      </div>
    </main>
  );
}
