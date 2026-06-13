'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

type Task = { id: string; created_at: string; category: string; need: string; brief?: { title?: string }; status: string; specialist_direction?: string | null; next_step?: string | null };
type Provider = { id: string; status: string; skills: string; links?: string | null; preferred_task_types?: string | null } | null;
type Invitation = { id: string; created_at: string; task_id: string; status: string; response_note?: string | null };
type Account = { id: string; email: string; name?: string | null; role: 'customer' | 'specialist'; status: string };
type Dashboard = { account: Account; tasks: Task[]; provider: Provider; invitations: Invitation[] };

const statusLabels: Record<string, string> = {
  new: 'Behov modtaget',
  awaiting_ai_scope: 'Brief skal gøres klar',
  reviewing: 'Naetwork review',
  direction_ready: 'Specialistretning klar',
  specialist_invited: 'Specialistmatch i gang',
  awaiting_specialist: 'Afventer specialist',
  ready_for_customer: 'Klar til næste skridt',
  closed: 'Lukket'
};

const journey = ['Behov', 'Brief', 'Review', 'Specialistmatch'];

function statusLabel(status: string) {
  return statusLabels[status] || status;
}

export function AccountDashboardV12() {
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
        <Link href="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">N</span><span className="text-lg font-black tracking-tight text-[#071527]">Naetwork</span></Link>
        <button onClick={logout} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">Log ud</button>
      </header>

      <section className="mx-auto max-w-6xl py-10">
        {loading && <div className="rounded-3xl bg-white p-6 text-sm font-black text-slate-600 shadow-sm">Henter konto…</div>}
        {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm font-black text-rose-700 shadow-sm">{error}<div className="mt-4"><Link href="/login" className="rounded-full bg-[#071527] px-5 py-3 text-white">Log ind</Link></div></div>}

        {data && !loading && !error && (
          <>
            <div className="rounded-[34px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Min Naetwork konto</p>
              <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div><h1 className="text-4xl font-black tracking-tight text-[#071527] md:text-6xl">{data.account.name || data.account.email}</h1><p className="mt-3 text-sm font-bold text-slate-500">{data.account.email} · {data.account.role === 'customer' ? 'Kunde' : 'Specialist'}</p></div>
                {data.account.role === 'customer' && <Link href="/opret-opgave" className="rounded-full bg-[#071527] px-5 py-3 text-center text-sm font-black text-white">Opret ny opgave</Link>}
              </div>
            </div>

            {data.account.role === 'customer' && (
              <div className="mt-6 grid gap-5">
                <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <p className="text-sm font-black uppercase tracking-[.18em] text-[#3f8f83]">Opgaverejse</p>
                  <div className="mt-5 grid gap-3 md:grid-cols-4">{journey.map((item) => <div key={item} className="rounded-2xl border border-slate-200 bg-[#f7f8fb] p-4 text-sm font-black text-slate-700">{item}</div>)}</div>
                </div>

                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><h2 className="text-3xl font-black tracking-tight text-[#071527]">Mine opgaver</h2><p className="text-sm font-bold text-slate-500">Fra behov til specialistmatch</p></div>

                {data.tasks.length ? data.tasks.map((task) => (
                  <div key={task.id} className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div><p className="text-xl font-black text-[#071527]">{task.brief?.title || task.category}</p><p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{task.need}</p></div>
                      <span className="w-fit rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-800">{statusLabel(task.status)}</span>
                    </div>
                    <div className="mt-5 grid gap-3 md:grid-cols-3"><div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-[.14em] text-slate-400">Opgavetype</p><p className="mt-2 text-sm font-black text-[#071527]">{task.category}</p></div><div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-[.14em] text-slate-400">Specialistretning</p><p className="mt-2 text-sm font-black text-[#071527]">{task.specialist_direction || 'Afklares af Naetwork'}</p></div><div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-[.14em] text-slate-400">Næste skridt</p><p className="mt-2 text-sm font-black text-[#071527]">{task.next_step || 'Naetwork review'}</p></div></div>
                  </div>
                )) : <div className="rounded-[30px] border border-slate-200 bg-white p-7 text-center shadow-sm"><p className="text-2xl font-black text-[#071527]">Du har ingen opgaver endnu.</p><p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">Start med at beskrive dit behov. Naetwork gør opgaven klar og hjælper dig videre mod det rigtige specialistmatch.</p><Link href="/opret-opgave" className="mt-6 inline-flex rounded-full bg-[#071527] px-6 py-3 text-sm font-black text-white">Opret første opgave</Link></div>}
              </div>
            )}

            {data.account.role === 'specialist' && (
              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-3xl font-black tracking-tight text-[#071527]">Specialistprofil</h2>{data.provider ? <><p className="mt-3 text-sm font-black text-slate-700">Status: {data.provider.status}</p><p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{data.provider.skills}</p></> : <><p className="mt-3 text-sm leading-7 text-slate-600">Din konto er oprettet. Tilføj specialistprofil, så Naetwork kan vurdere relevante opgaver.</p><Link href="/specialister" className="mt-5 inline-flex rounded-full bg-[#071527] px-5 py-3 text-sm font-black text-white">Opret specialistprofil</Link></>}</div>
                <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-3xl font-black tracking-tight text-[#071527]">Invitationer</h2><div className="mt-4 grid gap-2">{data.invitations.length ? data.invitations.map((invite) => <div key={invite.id} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700"><p className="font-black">Status: {invite.status}</p>{invite.response_note && <p className="mt-1 text-slate-500">{invite.response_note}</p>}</div>) : <p className="text-sm text-slate-500">Ingen invitationer endnu.</p>}</div></div>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
