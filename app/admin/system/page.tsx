'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface AuditEntry {
  id: string;
  action: string;
  target_table: string | null;
  notes: string | null;
  created_at: string;
}

export default function SystemPage() {
  const [dbStatus, setDbStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [environment, setEnvironment] = useState<Record<string, boolean>>({});
  const [integrations, setIntegrations] = useState<Record<string, string>>({});

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      try {
        const response = await fetch('/api/admin/system');
        const health = await response.json();
        setDbStatus(response.ok && health.database === 'ok' ? 'ok' : 'error');
        setEnvironment(health.environment ?? {});
        setIntegrations(health.integrations ?? {});
      } catch {
        setDbStatus('error');
      }

      // Audit log
      const { data } = await supabase
        .from('admin_audit_log')
        .select('id, action, target_table, notes, created_at')
        .order('created_at', { ascending: false })
        .limit(10);
      setAuditLog((data as AuditEntry[]) || []);
      setLoading(false);
    }

    load();
  }, []);

  const envVars = Object.entries(environment).map(([name, set]) => ({ name, set }));

  return (
    <div className="flex h-[calc(100svh-6rem)] overflow-hidden bg-gray-50 md:h-screen">
      <aside className="hidden w-60 flex-shrink-0 flex-col bg-gray-900 md:flex">
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
            <Link key={item.href} href={item.href} className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${item.href === '/admin/system' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              <span>{item.label}</span>
              {item.badge && <span className="text-xs bg-yellow-500 text-black px-1.5 py-0.5 rounded font-medium">{item.badge}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-gray-900 font-semibold text-base">System</h1>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* DB Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Supabase forbindelse</h2>
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${dbStatus === 'ok' ? 'bg-indigo-500' : dbStatus === 'error' ? 'bg-red-500' : 'bg-gray-300 animate-pulse'}`} />
              <span className="text-sm text-gray-700">
                {dbStatus === 'checking' ? 'Tjekker...' : dbStatus === 'ok' ? 'Forbundet' : 'Fejl'}
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white px-5 py-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-gray-900">Integrationer</h2>
            <ul className="space-y-2">
              {Object.entries(integrations).map(([name, status]) => (
                <li key={name} className="flex items-center justify-between gap-4 text-sm">
                  <span className="font-mono text-xs text-gray-600">{name}</span>
                  <span className="font-semibold text-amber-700">{status}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Env vars */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Milj\u00f8variable</h2>
            <ul className="space-y-2">
              {envVars.map(v => (
                <li key={v.name} className="flex items-center justify-between text-sm">
                  <span className="font-mono text-gray-600 text-xs">{v.name}</span>
                  <span className={v.set ? 'text-indigo-600 font-semibold' : 'text-red-500 font-semibold'}>
                    {v.set ? 'Sat' : 'Mangler'}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Auth providers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Auth-udbydere</h2>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
              E-mail (standard)
            </div>
          </div>

          {/* Audit log */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Audit log (seneste 10)</h2>
            </div>
            {loading ? (
              <div className="px-5 py-6 text-center text-gray-400 text-sm">Indl\u00e6ser...</div>
            ) : auditLog.length === 0 ? (
              <div className="px-5 py-6 text-center text-gray-400 text-sm">Ingen log-poster endnu</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {auditLog.map(entry => (
                  <li key={entry.id} className="px-5 py-3 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-900 font-medium">{entry.action}</p>
                      {entry.notes && <p className="text-xs text-gray-500">{entry.notes}</p>}
                      {entry.target_table && <p className="text-xs text-gray-400">{entry.target_table}</p>}
                    </div>
                    <time className="text-xs text-gray-400 flex-shrink-0">
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
