'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

type MessageStatus = 'new' | 'read';

interface ContactMessage {
  id: string;
  name: string | null;
  email: string | null;
  subject: string | null;
  message: string | null;
  status: MessageStatus;
  created_at: string;
}

export default function ContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    setLoading(true);
    const { data } = await supabase
      .from('contact_messages')
      .select('id, name, email, subject, message, status, created_at')
      .order('created_at', { ascending: false });
    setMessages((data as ContactMessage[]) || []);
    setLoading(false);
  }

  async function markAsRead(id: string) {
    setActionLoading(id);
    await supabase.from('contact_messages').update({ status: 'read' }).eq('id', id);
    await loadMessages();
    setActionLoading(null);
  }

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
            <Link key={item.href} href={item.href} className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${item.href === '/admin/contact' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              <span>{item.label}</span>
              {item.badge && <span className="text-xs bg-yellow-500 text-black px-1.5 py-0.5 rounded font-medium">{item.badge}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-gray-900 font-semibold text-base">Kontaktbeskeder</h1>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="px-5 py-8 text-center text-gray-400 text-sm">Indl\u00e6ser...</div>
            ) : messages.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-400 text-sm">Ingen beskeder endnu</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Navn</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">E-mail</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Emne</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Besked</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Modtaget</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Handling</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {messages.map((m) => (
                    <tr key={m.id} className={`hover:bg-gray-50 ${m.status === 'new' ? 'bg-indigo-50/30' : ''}`}>
                      <td className={`px-4 py-3 text-sm text-gray-900 ${m.status === 'new' ? 'font-semibold' : 'font-normal'}`}>{m.name || '\u2014'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{m.email || '\u2014'}</td>
                      <td className={`px-4 py-3 text-sm text-gray-900 ${m.status === 'new' ? 'font-semibold' : 'font-normal'}`}>{m.subject || '\u2014'}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 max-w-xs">
                        <p className="truncate">{m.message || '\u2014'}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{new Date(m.created_at).toLocaleString('da-DK')}</td>
                      <td className="px-4 py-3">
                        {m.status === 'new' && (
                          <button
                            onClick={() => markAsRead(m.id)}
                            disabled={actionLoading === m.id}
                            className="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200 disabled:opacity-50"
                          >
                            Mark\u00e9r l\u00e6st
                          </button>
                        )}
                        {m.status === 'read' && (
                          <span className="text-xs text-gray-400">L\u00e6st</span>
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
