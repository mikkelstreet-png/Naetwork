'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

type UserRole = 'candidate' | 'professional' | 'admin';
type UserStatus = 'active' | 'suspended' | 'deleted';

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: UserRole;
  status: UserStatus;
  created_at: string;
}

const roleBadge = (role: UserRole) => {
  const map: Record<UserRole, string> = {
    candidate: 'bg-gray-100 text-gray-700',
    professional: 'bg-indigo-100 text-indigo-800',
    admin: 'bg-gray-900 text-white',
  };
  const labels: Record<UserRole, string> = {
    candidate: 'Kandidat',
    professional: 'Professionel',
    admin: 'Admin',
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[role]}`}>{labels[role]}</span>;
};

const statusBadge = (status: UserStatus) => {
  const map: Record<UserStatus, string> = {
    active: 'bg-indigo-100 text-indigo-800',
    suspended: 'bg-yellow-100 text-yellow-800',
    deleted: 'bg-red-100 text-red-800',
  };
  const labels: Record<UserStatus, string> = {
    active: 'Aktiv',
    suspended: 'Suspenderet',
    deleted: 'Slettet',
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[status]}`}>{labels[status]}</span>;
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, email, role, status, created_at')
      .order('created_at', { ascending: false });
    setUsers((data as UserProfile[]) || []);
    setLoading(false);
  }

  async function suspendUser(id: string) {
    setActionLoading(id);
    await supabase.from('profiles').update({ status: 'suspended' }).eq('id', id);
    await loadUsers();
    setActionLoading(null);
  }

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return !q || (u.full_name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
  });

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
            <Link key={item.href} href={item.href} className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${item.href === '/admin/users' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              <span>{item.label}</span>
              {item.badge && <span className="text-xs bg-yellow-500 text-black px-1.5 py-0.5 rounded font-medium">{item.badge}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-gray-900 font-semibold text-base">Brugere</h1>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="S\u00f8g p\u00e5 navn eller e-mail..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full max-w-sm px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="px-5 py-8 text-center text-gray-400 text-sm">Indl\u00e6ser...</div>
            ) : filtered.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-400 text-sm">Ingen brugere fundet</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Navn</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">E-mail</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Rolle</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Oprettet</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Handlinger</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{u.full_name || '\u2014'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{u.email || '\u2014'}</td>
                      <td className="px-4 py-3">{roleBadge(u.role)}</td>
                      <td className="px-4 py-3">{statusBadge(u.status)}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{new Date(u.created_at).toLocaleDateString('da-DK')}</td>
                      <td className="px-4 py-3">
                        {u.status !== 'suspended' && u.role !== 'admin' && (
                          <button
                            onClick={() => suspendUser(u.id)}
                            disabled={actionLoading === u.id}
                            className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200 disabled:opacity-50"
                          >
                            Suspender
                          </button>
                        )}
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
