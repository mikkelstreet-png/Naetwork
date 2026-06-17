'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

type Visibility = 'hidden' | 'published';

interface Professional {
  id: string;
  profile_id: string | null;
  name: string;
  title: string | null;
  company: string | null;
  industries: string[] | null;
  visibility: Visibility;
  created_at: string;
}

const STATUS_TABS: { label: string; value: Visibility | 'all' }[] = [
  { label: 'Alle', value: 'all' },
  { label: 'Skjult', value: 'hidden' },
  { label: 'Publiceret', value: 'published' },
];

const statusBadge = (visibility: Visibility) => {
  const map: Record<Visibility, string> = {
    hidden: 'bg-yellow-100 text-yellow-800',
    published: 'bg-indigo-100 text-indigo-800',
  };
  const labels: Record<Visibility, string> = {
    hidden: 'Skjult',
    published: 'Publiceret',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[visibility]}`}>
      {labels[visibility]}
    </span>
  );
};

export default function ProfessionalsPage() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [filter, setFilter] = useState<Visibility | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadProfessionals();
  }, []);

  async function loadProfessionals() {
    setLoading(true);
    const { data } = await supabase
      .from('professional_profiles')
      .select('id, profile_id, title, company, industries, visibility, created_at')
      .order('created_at', { ascending: false });

    const rows = (data as Array<Omit<Professional, 'name'>> | null) || [];
    const profileIds = Array.from(new Set(rows.map(row => row.profile_id).filter(Boolean))) as string[];
    const { data: profiles } = profileIds.length
      ? await supabase.from('profiles').select('id, name').in('id', profileIds)
      : { data: [] };
    const names = new Map(((profiles as Array<{ id: string; name: string | null }> | null) || []).map(profile => [profile.id, profile.name || '—']));

    setProfessionals(rows.map(row => ({ ...row, name: row.profile_id ? names.get(row.profile_id) ?? '—' : '—' })));
    setLoading(false);
  }

  async function updateVisibility(id: string, visibility: Visibility) {
    setActionLoading(id + visibility);
    await supabase
      .from('professional_profiles')
      .update({ visibility })
      .eq('id', id);
    await loadProfessionals();
    setActionLoading(null);
  }

  const filtered = filter === 'all' ? professionals : professionals.filter(p => p.visibility === filter);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="w-60 bg-gray-900 flex-shrink-0 flex flex-col">
        <div className="px-6 py-5 border-b border-gray-800">
          <Link href="/admin" className="text-white font-bold text-lg tracking-tight">Admin</Link>
          <Link href="/" className="block text-gray-400 text-xs mt-0.5 hover:text-white transition-colors">Naetwork</Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {[
            { label: 'Oversigt', href: '/admin' },
            { label: 'Brugere', href: '/admin/users' },
            { label: 'Professionelle', href: '/admin/professionals' },
            { label: 'Bookinger', href: '/admin/bookings' },
            { label: 'Kontaktbeskeder', href: '/admin/contact' },
            { label: 'Betalinger', href: '/admin/payments', badge: 'Gated' },
            { label: 'Donation / juridisk', href: '/admin/legal' },
            { label: 'System', href: '/admin/system' },
          ].map((item) => (
            <Link key={item.href} href={item.href} className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${item.href === '/admin/professionals' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              <span>{item.label}</span>
              {item.badge && <span className="text-xs bg-yellow-500 text-black px-1.5 py-0.5 rounded font-medium">{item.badge}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-gray-900 font-semibold text-base">Professionelle</h1>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex gap-2 mb-4">
            {STATUS_TABS.map(tab => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === tab.value ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="px-5 py-8 text-center text-gray-400 text-sm">Indlæser...</div>
            ) : filtered.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-400 text-sm">Ingen professionelle fundet</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Navn</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Titel / Virksomhed</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Brancher</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Oprettet</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Handlinger</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{p.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <div>{p.title || '—'}</div>
                        <div className="text-gray-400 text-xs">{p.company || ''}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {p.industries?.slice(0, 2).join(', ') || '—'}
                        {(p.industries?.length ?? 0) > 2 && <span className="text-gray-400"> +{(p.industries?.length ?? 0) - 2}</span>}
                      </td>
                      <td className="px-4 py-3">{statusBadge(p.visibility)}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString('da-DK')}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          {p.visibility !== 'published' && (
                            <button
                              onClick={() => updateVisibility(p.id, 'published')}
                              disabled={actionLoading === p.id + 'published'}
                              className="text-xs px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                              Publicer
                            </button>
                          )}
                          {p.visibility !== 'hidden' && (
                            <button
                              onClick={() => updateVisibility(p.id, 'hidden')}
                              disabled={actionLoading === p.id + 'hidden'}
                              className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                            >
                              Skjul
                            </button>
                          )}
                          <Link href={`/professionals/${p.id}`} className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200">
                            Se profil
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
