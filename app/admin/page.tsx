'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'Oversigt', href: '/admin' },
  { label: 'Brugere', href: '/admin/users' },
  { label: 'Professionelle', href: '/admin/professionals' },
  { label: 'Bookinger', href: '/admin/bookings' },
  { label: 'Kontaktbeskeder', href: '/admin/contact' },
  { label: 'Betalinger', href: '/admin/payments', badge: 'Gated' },
  { label: 'Donation / juridisk', href: '/admin/legal' },
  { label: 'System', href: '/admin/system' },
];

interface Stats {
  users: number | null;
  professionals: number | null;
  bookingsToday: number | null;
  legalBlockers: number | null;
  contactMessages: number | null;
}

interface AuditEntry {
  id: string;
  action: string;
  target_table: string | null;
  notes: string | null;
  created_at: string;
}

export default function AdminPage() {
  const pathname = usePathname();
  const [stats, setStats] = useState<Stats>({
    users: null,
    professionals: null,
    bookingsToday: null,
    legalBlockers: null,
    contactMessages: null,
  });
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) setUserEmail(user.email);
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const startOfTomorrow = new Date(startOfToday);
      startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

      const [
        { count: users },
        { count: professionals },
        { count: bookingsToday },
        { count: legalBlockers },
        { count: contactMessages },
        { data: audit },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('professional_profiles').select('*', { count: 'exact', head: true }).eq('review_status', 'approved').eq('visibility', 'published'),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).gte('starts_at', startOfToday.toISOString()).lt('starts_at', startOfTomorrow.toISOString()),
        supabase.from('legal_blockers').select('*', { count: 'exact', head: true }).eq('status', 'open'),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
        supabase.from('admin_audit_log').select('id, action, target_table, notes, created_at').order('created_at', { ascending: false }).limit(5),
      ]);

      setStats({ users, professionals, bookingsToday, legalBlockers, contactMessages });
      setAuditLog(audit || []);
    }

    load();
  }, []);

  const statCards = [
    { label: 'Totalt antal brugere', value: stats.users },
    { label: 'Aktive professionelle', value: stats.professionals },
    { label: 'Bookinger i dag', value: stats.bookingsToday },
    { label: '\u00c5bne juridiske blokkere', value: stats.legalBlockers },
    { label: 'Kontaktbeskeder', value: stats.contactMessages },
  ];

  return (
    <div className="flex h-[calc(100svh-6rem)] overflow-hidden bg-gray-50 md:h-screen">
      {/* Sidebar */}
      <aside className="hidden w-60 flex-shrink-0 flex-col bg-gray-900 md:flex">
        <div className="px-6 py-5 border-b border-gray-800">
          <span className="text-white font-bold text-lg tracking-tight">Admin</span>
          <Link href="/" className="block text-gray-400 text-xs mt-0.5 hover:text-white transition-colors">
            Naetwork
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-xs bg-yellow-500 text-black px-1.5 py-0.5 rounded font-medium">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t border-gray-800">
          <p className="text-gray-500 text-xs truncate">{userEmail}</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-gray-900 font-semibold text-base">Oversigt</h1>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-3">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4"
              >
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {card.label}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {card.value === null ? '\u2014' : card.value}
                </p>
              </div>
            ))}
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Seneste aktivitet</h2>
            </div>
            {auditLog.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-400 text-sm">
                Ingen aktivitet endnu
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {auditLog.map((entry) => (
                  <li key={entry.id} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-900 font-medium">{entry.action}</p>
                      {entry.notes && (
                        <p className="text-xs text-gray-500">{entry.notes}</p>
                      )}
                      {entry.target_table && (
                        <p className="text-xs text-gray-400">{entry.target_table}</p>
                      )}
                    </div>
                    <time className="text-xs text-gray-400">
                      {new Date(entry.created_at).toLocaleString('da-DK')}
                    </time>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
