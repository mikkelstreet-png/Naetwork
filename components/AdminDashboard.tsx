'use client';

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Task = {
  id: string;
  created_at: string;
  customer_email: string;
  category: string;
  need: string;
  audience?: string | null;
  budget?: string | null;
  deadline?: string | null;
  brief?: { title?: string; specialist?: string; tags?: string[]; scope?: string[]; questions?: string[] };
  status: string;
  specialist_direction?: string | null;
  next_step?: string | null;
  internal_note?: string | null;
};

type Provider = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  skills: string;
  links?: string | null;
  status: string;
  approved_at?: string | null;
  preferred_task_types?: string | null;
};

type Invitation = {
  id: string;
  created_at: string;
  task_id: string;
  specialist_email: string;
  status: string;
  response_note?: string | null;
  responded_at?: string | null;
};

type CustomerUpdate = {
  id: string;
  created_at: string;
  task_id: string;
  customer_email: string;
  message: string;
  source: string;
};

type DashboardData = {
  tasks: Task[];
  providers: Provider[];
  invitations: Invitation[];
  updates: CustomerUpdate[];
};

const taskStatuses = [
  ["new", "Modtaget"],
  ["reviewing", "Under gennemgang"],
  ["direction_ready", "Specialistretning klar"],
  ["specialist_invited", "Specialist inviteret"],
  ["awaiting_specialist", "Afventer specialist"],
  ["ready_for_customer", "Klar til kunde"],
  ["closed", "Lukket"]
];

const providerStatuses = [
  ["new", "Ny"],
  ["approved", "Godkendt"],
  ["active", "Aktiv"],
  ["paused", "Pauset"],
  ["rejected", "Afvist"]
];

function statusLabel(value: string, list: string[][]) {
  return list.find(([key]) => key === value)?.[1] || value;
}

function safeList(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => String(item)).filter(Boolean) : [];
}

function shortId(id: string) {
  return id.slice(0, 8);
}

export function AdminDashboard() {
  const [data, setData] = useState<DashboardData>({ tasks: [], providers: [], invitations: [], updates: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<'tasks' | 'providers'>('tasks');
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [draftTask, setDraftTask] = useState<Partial<Task>>({});
  const [providerDraft, setProviderDraft] = useState<Partial<Provider>>({});
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteNote, setInviteNote] = useState("");

  const selectedTask = useMemo(() => data.tasks.find((task) => task.id === selectedTaskId) || data.tasks[0], [data.tasks, selectedTaskId]);
  const selectedProvider = useMemo(() => data.providers.find((provider) => provider.id === selectedProviderId) || data.providers[0], [data.providers, selectedProviderId]);
  const approvedProviders = useMemo(() => data.providers.filter((provider) => ['approved', 'active', 'godkendt'].includes(String(provider.status).toLowerCase())), [data.providers]);
  const selectedTaskUpdates = useMemo(() => selectedTask ? data.updates.filter((update) => update.task_id === selectedTask.id) : [], [data.updates, selectedTask]);
  const selectedTaskInvitations = useMemo(() => selectedTask ? data.invitations.filter((invite) => invite.task_id === selectedTask.id) : [], [data.invitations, selectedTask]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch('/api/admin/dashboard');
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Admin-data kunne ikke hentes.');
      const nextData = {
        tasks: result.tasks || [],
        providers: result.providers || [],
        invitations: result.invitations || [],
        updates: result.updates || []
      };
      setData(nextData);
      setSelectedTaskId((current) => current || nextData.tasks[0]?.id || "");
      setSelectedProviderId((current) => current || nextData.providers[0]?.id || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Admin-data kunne ikke hentes.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (selectedTask) {
      setDraftTask({
        status: selectedTask.status,
        specialist_direction: selectedTask.specialist_direction || selectedTask.brief?.specialist || '',
        next_step: selectedTask.next_step || '',
        internal_note: selectedTask.internal_note || ''
      });
    }
  }, [selectedTask?.id]);

  useEffect(() => {
    if (selectedProvider) {
      setProviderDraft({
        status: selectedProvider.status,
        preferred_task_types: selectedProvider.preferred_task_types || ''
      });
    }
  }, [selectedProvider?.id]);

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  async function saveTask() {
    if (!selectedTask) return;
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/tasks/${selectedTask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draftTask)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Opgaven kunne ikke gemmes.');
      setMessage('Opgaven er gemt.');
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Opgaven kunne ikke gemmes.');
    } finally {
      setSaving(false);
    }
  }

  async function saveProvider() {
    if (!selectedProvider) return;
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/providers/${selectedProvider.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(providerDraft)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Specialisten kunne ikke gemmes.');
      setMessage('Specialisten er gemt.');
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Specialisten kunne ikke gemmes.');
    } finally {
      setSaving(false);
    }
  }

  async function inviteSpecialist() {
    if (!selectedTask) return;
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch('/api/admin/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: selectedTask.id, specialist_email: inviteEmail, note: inviteNote })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Invitation kunne ikke sendes.');
      setMessage('Specialisten er inviteret.');
      setInviteNote('');
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Invitation kunne ikke sendes.');
    } finally {
      setSaving(false);
    }
  }

  const newTasks = data.tasks.filter((task) => task.status === 'new').length;
  const openInvitations = data.invitations.filter((invite) => invite.status === 'invited').length;
  const newProviders = data.providers.filter((provider) => provider.status === 'new').length;
  const scope = safeList(selectedTask?.brief?.scope);
  const questions = safeList(selectedTask?.brief?.questions);

  if (loading) return <main className="min-h-screen bg-slate-50 p-6"><div className="rounded-3xl bg-white p-6 text-sm font-black text-slate-600 shadow-sm">Henter admin-dashboard…</div></main>;
  if (error) return <main className="min-h-screen bg-slate-50 p-6"><div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm font-black text-rose-700">{error}<div className="mt-4"><Link href="/admin/login" className="rounded-full bg-[#071527] px-5 py-3 text-white">Gå til admin-login</Link></div></div></main>;

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">N</span>
            <div className="min-w-0">
              <p className="truncate text-lg font-black tracking-tight text-[#071527]">Admin Control Center</p>
              <p className="truncate text-xs text-slate-500">Opgaver, specialister og invitationer</p>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <Link href="/" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-black text-slate-700">Forside</Link>
            <button onClick={logout} className="rounded-full bg-[#071527] px-4 py-2 text-sm font-black text-white">Log ud</button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-5">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Nye opgaver</p><p className="mt-3 text-4xl font-black text-[#071527]">{newTasks}</p></div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Alle opgaver</p><p className="mt-3 text-4xl font-black text-[#071527]">{data.tasks.length}</p></div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Nye specialister</p><p className="mt-3 text-4xl font-black text-[#071527]">{newProviders}</p></div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Åbne invitationer</p><p className="mt-3 text-4xl font-black text-[#071527]">{openInvitations}</p></div>
        </div>

        {message && <div className="mt-5 rounded-2xl bg-white p-4 text-sm font-black text-slate-700 shadow-sm">{message}</div>}

        <div className="mt-6 flex gap-2">
          <button onClick={() => setTab('tasks')} className={`rounded-full px-5 py-3 text-sm font-black ${tab === 'tasks' ? 'bg-[#071527] text-white' : 'border border-slate-200 bg-white text-slate-700'}`}>Opgaver</button>
          <button onClick={() => setTab('providers')} className={`rounded-full px-5 py-3 text-sm font-black ${tab === 'providers' ? 'bg-[#071527] text-white' : 'border border-slate-200 bg-white text-slate-700'}`}>Specialister</button>
        </div>

        {tab === 'tasks' && (
          <div className="mt-5 grid gap-5 lg:grid-cols-[.78fr_1.22fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="mb-3 px-2 text-sm font-black text-[#071527]">Opgaveliste</p>
              <div className="grid max-h-[70vh] gap-2 overflow-y-auto pr-1">
                {data.tasks.map((task) => (
                  <button key={task.id} onClick={() => setSelectedTaskId(task.id)} className={`rounded-2xl p-4 text-left transition ${selectedTask?.id === task.id ? 'bg-[#071527] text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black">{task.brief?.title || task.category}</p>
                        <p className={`mt-1 truncate text-xs ${selectedTask?.id === task.id ? 'text-white/65' : 'text-slate-500'}`}>{task.customer_email}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black ${selectedTask?.id === task.id ? 'bg-white/10 text-white' : 'bg-white text-slate-500'}`}>{statusLabel(task.status, taskStatuses)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedTask && (
              <div className="grid gap-5">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[.16em] text-[#3f8f83]">Opgave {shortId(selectedTask.id)}</p>
                      <h2 className="mt-2 text-3xl font-black tracking-tight text-[#071527]">{selectedTask.brief?.title || selectedTask.category}</h2>
                      <p className="mt-2 text-sm font-bold text-slate-500">{selectedTask.customer_email}</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-800">{statusLabel(selectedTask.status, taskStatuses)}</span>
                  </div>
                  <p className="mt-5 whitespace-pre-line rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">{selectedTask.need}</p>
                </div>

                <div className="grid gap-5 xl:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <p className="font-black text-[#071527]">Opdater opgave</p>
                    <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Status<select value={String(draftTask.status || '')} onChange={(event) => setDraftTask({ ...draftTask, status: event.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none">{taskStatuses.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
                    <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Specialistretning<input value={String(draftTask.specialist_direction || '')} onChange={(event) => setDraftTask({ ...draftTask, specialist_direction: event.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none" /></label>
                    <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Næste skridt<textarea value={String(draftTask.next_step || '')} onChange={(event) => setDraftTask({ ...draftTask, next_step: event.target.value })} rows={3} className="resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none" /></label>
                    <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Intern note<textarea value={String(draftTask.internal_note || '')} onChange={(event) => setDraftTask({ ...draftTask, internal_note: event.target.value })} rows={3} className="resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none" /></label>
                    <button disabled={saving} onClick={saveTask} className="mt-5 rounded-full bg-[#071527] px-5 py-3 text-sm font-black text-white disabled:opacity-50">Gem opgave</button>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <p className="font-black text-[#071527]">Inviter specialist</p>
                    <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Godkendt specialist<select value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"><option value="">Vælg specialist</option>{approvedProviders.map((provider) => <option key={provider.id} value={provider.email}>{provider.name} · {provider.email}</option>)}</select></label>
                    <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Note til specialist<textarea value={inviteNote} onChange={(event) => setInviteNote(event.target.value)} rows={3} className="resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none" placeholder="Kort kontekst eller hvad specialisten skal vurdere." /></label>
                    <button disabled={saving || !inviteEmail} onClick={inviteSpecialist} className="mt-5 rounded-full bg-[#071527] px-5 py-3 text-sm font-black text-white disabled:opacity-50">Send invitation</button>
                    <div className="mt-6"><p className="text-sm font-black text-[#071527]">Invitationer på opgaven</p><div className="mt-3 grid gap-2">{selectedTaskInvitations.length ? selectedTaskInvitations.map((invite) => <div key={invite.id} className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700"><p className="font-black">{invite.specialist_email}</p><p className="text-xs text-slate-500">{invite.status}{invite.response_note ? ` · ${invite.response_note}` : ''}</p></div>) : <p className="text-sm text-slate-500">Ingen invitationer endnu.</p>}</div></div>
                  </div>
                </div>

                <div className="grid gap-5 xl:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><p className="font-black text-[#071527]">Scope</p><div className="mt-3 grid gap-2">{scope.length ? scope.map((item) => <div key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</div>) : <p className="text-sm text-slate-500">Scope mangler.</p>}</div></div>
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><p className="font-black text-[#071527]">Kundeopdateringer</p><div className="mt-3 grid gap-2">{selectedTaskUpdates.length ? selectedTaskUpdates.map((update) => <div key={update.id} className="rounded-2xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-900"><p className="text-xs font-black uppercase tracking-[.12em] text-emerald-700">{new Date(update.created_at).toLocaleString('da-DK')}</p>{update.message}</div>) : <p className="text-sm text-slate-500">Ingen ekstra info fra kunde.</p>}</div></div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><p className="font-black text-[#071527]">Spørgsmål fra brief</p><div className="mt-3 grid gap-2">{questions.length ? questions.map((item) => <div key={item} className="rounded-2xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">{item}</div>) : <p className="text-sm text-slate-500">Ingen spørgsmål endnu.</p>}</div></div>
              </div>
            )}
          </div>
        )}

        {tab === 'providers' && (
          <div className="mt-5 grid gap-5 lg:grid-cols-[.78fr_1.22fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="mb-3 px-2 text-sm font-black text-[#071527]">Specialistansøgninger</p>
              <div className="grid max-h-[70vh] gap-2 overflow-y-auto pr-1">
                {data.providers.map((provider) => (
                  <button key={provider.id} onClick={() => setSelectedProviderId(provider.id)} className={`rounded-2xl p-4 text-left transition ${selectedProvider?.id === provider.id ? 'bg-[#071527] text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}>
                    <p className="truncate text-sm font-black">{provider.name}</p>
                    <p className={`mt-1 truncate text-xs ${selectedProvider?.id === provider.id ? 'text-white/65' : 'text-slate-500'}`}>{provider.email}</p>
                    <p className="mt-2 text-xs font-black">{statusLabel(provider.status, providerStatuses)}</p>
                  </button>
                ))}
              </div>
            </div>

            {selectedProvider && (
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <p className="text-xs font-black uppercase tracking-[.16em] text-[#3f8f83]">Specialist {shortId(selectedProvider.id)}</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-[#071527]">{selectedProvider.name}</h2>
                <p className="mt-2 text-sm font-bold text-slate-500">{selectedProvider.email}</p>
                <div className="mt-5 grid gap-4 xl:grid-cols-2">
                  <div><p className="font-black text-[#071527]">Kompetencer</p><p className="mt-2 whitespace-pre-line rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">{selectedProvider.skills}</p></div>
                  <div><p className="font-black text-[#071527]">Links</p><p className="mt-2 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">{selectedProvider.links || 'Ingen links angivet.'}</p></div>
                </div>
                <label className="mt-5 grid gap-2 text-sm font-bold text-slate-700">Status<select value={String(providerDraft.status || '')} onChange={(event) => setProviderDraft({ ...providerDraft, status: event.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none">{providerStatuses.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
                <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Foretrukne opgavetyper<textarea value={String(providerDraft.preferred_task_types || '')} onChange={(event) => setProviderDraft({ ...providerDraft, preferred_task_types: event.target.value })} rows={3} className="resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none" /></label>
                <button disabled={saving} onClick={saveProvider} className="mt-5 rounded-full bg-[#071527] px-5 py-3 text-sm font-black text-white disabled:opacity-50">Gem specialist</button>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
