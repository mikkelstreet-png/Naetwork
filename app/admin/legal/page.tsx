'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

type LegalStatus = 'open' | 'in_progress' | 'resolved';
type LegalPriority = 'low' | 'medium' | 'high' | 'critical';

interface LegalBlocker {
  id: string;
  title: string;
  description: string | null;
  status: LegalStatus;
  priority: LegalPriority;
  created_at: string;
  resolved_at: string | null;
}

const priorityBadge = (priority: LegalPriority) => {
  const map: Record<LegalPriority, string> = {
    critical: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-gray-100 text-gray-600',
  };
  const labels: Record<LegalPriority, string> = {
    critical: 'Kritisk',
    high: 'H\u00f8j',
    medium: 'Medium',
    low: 'Lav',
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[priority]}`}>{labels[priority]}</span>;
};

const statusBadge = (status: LegalStatus) => {
  const map: Record<LegalStatus, string> = {
    open: 'bg-red-100 text-red-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-gray-100 text-gray-600',
  };
  const labels: Record<LegalStatus, string> = {
    open: '\u00c5ben',
    in_progress: 'I gang',
    resolved: 'L\u00f8st',
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[status]}`}>{labels[status]}</span>;
};

export default function LegalPage() {
  const [blockers, setBlockers] = useState<LegalBlocker[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadBlockers();
  }, []);

  async function loadBlockers() {
    setLoading(true);
    const { data } = await supabase
      .from('legal_blockers')
      .select('id, title, description, status, priority, created_at, resolved_at')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });
    setBlockers((data as LegalBlocker[]) || []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: LegalStatus) {
    setActionLoading(id);
    const updates: Record<string, unknown> = { status };
    if (status === 'resolved') updates.resolved_at = new Date().toISOString();
    await supabase.from('legal_blockers').update(updates).eq('id', id);
    await loadBlockers();
    setActionLoading(null);
  }

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
            <Link key={item.href} href={item.href} className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${item.href === '/admin/legal' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              <span>{item.label}</span>
              {item.badge && <span className="text-xs bg-yellow-500 text-black px-1.5 py-0.5 rounded font-medium">{item.badge}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-gray-900 font-semibold text-base">Donation / Juridisk</h1>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-4 mb-6">
            <p className="text-sm font-semibold text-yellow-900 mb-1">Betalingsintegration</p>
            <p className="text-sm text-yellow-800">
              Betalingsintegration afventer l\u00f8sning af aktive juridiske blokkere nedenfor.
              Ingen betalinger kan aktiveres f\u00f8r alle kritiske blokkere er l\u00f8st.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="px-5 py-8 text-center text-gray-400 text-sm">Indl\u00e6ser...</div>
            ) : blockers.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-400 text-sm">Ingen juridiske blokkere registreret</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Titel</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Beskrivelse</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Prioritet</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Opdater status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {blockers.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium max-w-xs">{b.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 max-w-sm">
                        <p className="line-clamp-2">{b.description || '\u2014'}</p>
                      </td>
                      <td className="px-4 py-3">{priorityBadge(b.priority)}</td>
                      <td className="px-4 py-3">{statusBadge(b.status)}</td>
                      <td className="px-4 py-3">
                        <select
                          value={b.status}
                          onChange={e => updateStatus(b.id, e.target.value as LegalStatus)}
                          disabled={actionLoading === b.id}
                          className="text-xs px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                        >
                          <option value="open">\u00c5ben</option>
                          <option value="in_progress">I gang</option>
                          <option value="resolved">L\u00f8st</option>
                        </select>
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
