'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

type Task = { id: string; created_at: string; category: string; need: string; brief?: { title?: string }; status: string; specialist_direction?: string | null; next_step?: string | null };
type Provider = { id: string; status: string; skills: string; links?: string | null; preferred_task_types?: string | null } | null;
type Invitation = { id: string; created_at: string; task_id: string; status: string; response_note?: string | null };
type Account = { id: string; email: string; name?: string | null; role: 'customer' | 'specialist'; status: string };

type Dashboard = { account: Account; tasks: Task[]; provider: Provider; invitations: Invitation[] };

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    new: 'Modtaget',
    reviewing: 'Under gennemgang',
    direction_ready: 'Specialistretning klar',
    specialist_invited: 'Specialist inviteret',
    awaiting_specialist: 'Afventer specialist',
    ready_for_customer: 'Klar til kunde',
    closed: 'Lukket'
  };
  return labels[status] || status;
}

export function AccountDashboard() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/account/dashboard');
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Konto kunne ikke hentes.');
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Konto kunne ikke hentes.');
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await fetch('/api/account/logout', { method: 'POST' });
    window.location.href = '/login';
  }

  useEffect(() => { load(); }, []);

  return (
    <main className="min-h-screen bg-[#f7f8fb] px-4 py-6 text-slate-950 sm:px-5">
      <header className="mx-auto flex max-w-6xl items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">N</span>
          <span className="text-lg font-black tracking-tight text-[#071527]">Naetwork</span>
        </Link>
        <button onClick={logout} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">Log ud</button>
      </header>

      <section className="mx-auto max-w-6xl py-10">
        {loading && <div className="rounded-3xl bg-white p-6 text-sm font-black text-slate-600 shadow-sm">Henter konto…</div>}
        {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm font-black text-rose-700 shadow-sm">{error}<div className="mt-4"><Link href="/login" className="rounded-full bg-[#071527] px-5 py-3 text-white">Log ind</Link></div></div>}

        {data && !loading && !error && (
          <>
            <div className="rounded-[34px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Min konto</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-[#071527] md:text-6xl">{data.account.name || data.account.email}</h1>
              <p className="mt-3 text-sm font-bold text-slate-500">{data.account.email} · {data.account.role === 'customer' ? 'Kunde' : 'Specialist'}</p>
            </div>

            {data.account.role === 'customer' && (
              <div className="mt-6 grid gap-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <h2 className="text-3xl font-black tracking-tight text-[#071527]">Mine opgaver</h2>
                  <Link href="/" className="rounded-full bg-[#071527] px-5 py-3 text-center text-sm font-black text-white">Opret ny opgave</Link>
                </div>
                {data.tasks.length ? data.tasks.map((task) => (
                  <div key={task.id} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xl font-black text-[#071527]">{task.brief?.title || task.category}</p>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{task.need}</p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-800">{statusLabel(task.status)}</span>
                    </div>
                    {task.next_step && <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700"><strong>Næste skridt:</strong> {task.next_step}</p>}
                  </div>
                )) : <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"><p className="font-black text-[#071527]">Du har ingen opgaver endnu.</p><p className="mt-2 text-sm leading-6 text-slate-600">Start med at oprette din første opgave.</p></div>}
              </div>
            )}

            {data.account.role === 'specialist' && (
              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-3xl font-black tracking-tight text-[#071527]">Specialistprofil</h2>
                  {data.provider ? <><p className="mt-3 text-sm font-black text-slate-700">Status: {data.provider.status}</p><p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{data.provider.skills}</p></> : <><p className="mt-3 text-sm leading-7 text-slate-600">Du har en konto, men mangler stadig at sende specialistprofil.</p><Link href="/specialister" className="mt-5 inline-flex rounded-full bg-[#071527] px-5 py-3 text-sm font-black text-white">Opret specialistprofil</Link></>}
                </div>
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-3xl font-black tracking-tight text-[#071527]">Invitationer</h2>
                  <div className="mt-4 grid gap-2">{data.invitations.length ? data.invitations.map((invite) => <div key={invite.id} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700"><p className="font-black">Status: {invite.status}</p>{invite.response_note && <p className="mt-1 text-slate-500">{invite.response_note}</p>}</div>) : <p className="text-sm text-slate-500">Ingen invitationer endnu.</p>}</div>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
