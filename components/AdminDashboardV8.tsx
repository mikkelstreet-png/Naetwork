'use client';

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Task = {
  id: string;
  created_at: string;
  customer_email: string;
  category: string;
  need: string;
  brief?: { title?: string; specialist?: string; scope?: string[]; questions?: string[] };
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
  preferred_task_types?: string | null;
};

type Invitation = {
  id: string;
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
  message: string;
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

function label(value: string, list: string[][]) {
  return list.find(([key]) => key === value)?.[1] || value;
}

function list(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String).filter(Boolean) : [];
}

function short(id: string) {
  return id.slice(0, 8);
}

export function AdminDashboardV8() {
  const [data, setData] = useState<DashboardData>({ tasks: [], providers: [], invitations: [], updates: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<'tasks' | 'providers'>('tasks');
  const [taskId, setTaskId] = useState("");
  const [providerId, setProviderId] = useState("");
  const [taskDraft, setTaskDraft] = useState<Partial<Task>>({});
  const [providerDraft, setProviderDraft] = useState<Partial<Provider>>({});
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteNote, setInviteNote] = useState("");

  const selectedTask = useMemo(() => data.tasks.find((item) => item.id === taskId) || data.tasks[0], [data.tasks, taskId]);
  const selectedProvider = useMemo(() => data.providers.find((item) => item.id === providerId) || data.providers[0], [data.providers, providerId]);
  const approvedProviders = useMemo(() => data.providers.filter((item) => ["approved", "active", "godkendt"].includes(String(item.status).toLowerCase())), [data.providers]);
  const selectedTaskUpdates = useMemo(() => selectedTask ? data.updates.filter((item) => item.task_id === selectedTask.id) : [], [data.updates, selectedTask]);
  const selectedTaskInvitations = useMemo(() => selectedTask ? data.invitations.filter((item) => item.task_id === selectedTask.id) : [], [data.invitations, selectedTask]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch('/api/admin/dashboard');
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Admin-data kunne ikke hentes.');
      const next = {
        tasks: result.tasks || [],
        providers: result.providers || [],
        invitations: result.invitations || [],
        updates: result.updates || []
      };
      setData(next);
      setTaskId((current) => current || next.tasks[0]?.id || "");
      setProviderId((current) => current || next.providers[0]?.id || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Admin-data kunne ikke hentes.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!selectedTask) return;
    setTaskDraft({
      status: selectedTask.status,
      specialist_direction: selectedTask.specialist_direction || selectedTask.brief?.specialist || '',
      next_step: selectedTask.next_step || '',
      internal_note: selectedTask.internal_note || ''
    });
  }, [selectedTask?.id]);

  useEffect(() => {
    if (!selectedProvider) return;
    setProviderDraft({
      status: selectedProvider.status,
      preferred_task_types: selectedProvider.preferred_task_types || ''
    });
  }, [selectedProvider?.id]);

  async function post(url: string, body?: unknown, success = 'Gemt.') {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch(url, {
        method: body ? 'PATCH' : 'POST',
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Handlingen kunne ikke gennemføres.');
      setMessage(success);
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Handlingen kunne ikke gennemføres.');
    } finally {
      setSaving(false);
    }
  }

  async function saveTask() {
    if (!selectedTask) return;
    await post(`/api/admin/tasks/${selectedTask.id}`, taskDraft, 'Opgaven er gemt.');
  }

  async function notifyCustomer() {
    if (!selectedTask) return;
    await post(`/api/admin/tasks/${selectedTask.id}/notify`, undefined, 'Kunden har fået en opdatering.');
  }

  async function saveProvider() {
    if (!selectedProvider) return;
    await post(`/api/admin/providers/${selectedProvider.id}`, providerDraft, 'Specialisten er gemt.');
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

  async function cleanup() {
    await post('/api/admin/maintenance/cleanup', undefined, 'Udløbne login-links er ryddet op.');
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  const scope = list(selectedTask?.brief?.scope);
  const questions = list(selectedTask?.brief?.questions);
  const newTasks = data.tasks.filter((item) => item.status === 'new').length;
  const openInvitations = data.invitations.filter((item) => item.status === 'invited').length;
  const newProviders = data.providers.filter((item) => item.status === 'new').length;

  if (loading) return <main className="min-h-screen bg-slate-50 p-6"><div className="rounded-3xl bg-white p-6 text-sm font-black text-slate-600 shadow-sm">Henter admin-dashboard…</div></main>;
  if (error) return <main className="min-h-screen bg-slate-50 p-6"><div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm font-black text-rose-700">{error}<div className="mt-4"><Link href="/admin/login" className="rounded-full bg-[#071527] px-5 py-3 text-white">Gå til admin-login</Link></div></div></main>;

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <p className="truncate text-lg font-black tracking-tight text-[#071527]">Admin Control Center</p>
            <p className="truncate text-xs text-slate-500">Opgaver, specialister, invitationer og drift</p>
          </div>
          <div className="flex shrink-0 flex-wrap justify-end gap-2">
            <button onClick={cleanup} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-black text-slate-700">Ryd links</button>
            <Link href="/" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-black text-slate-700">Forside</Link>
            <button onClick={logout} className="rounded-full bg-[#071527] px-4 py-2 text-sm font-black text-white">Log ud</button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-5">
        <div className="grid gap-4 md:grid-cols-4">
          <Metric title="Nye opgaver" value={newTasks} />
          <Metric title="Alle opgaver" value={data.tasks.length} />
          <Metric title="Nye specialister" value={newProviders} />
          <Metric title="Åbne invitationer" value={openInvitations} />
        </div>

        {message && <div className="mt-5 rounded-2xl bg-white p-4 text-sm font-black text-slate-700 shadow-sm">{message}</div>}

        <div className="mt-6 flex flex-wrap gap-2">
          <button onClick={() => setTab('tasks')} className={`rounded-full px-5 py-3 text-sm font-black ${tab === 'tasks' ? 'bg-[#071527] text-white' : 'border border-slate-200 bg-white text-slate-700'}`}>Opgaver</button>
          <button onClick={() => setTab('providers')} className={`rounded-full px-5 py-3 text-sm font-black ${tab === 'providers' ? 'bg-[#071527] text-white' : 'border border-slate-200 bg-white text-slate-700'}`}>Specialister</button>
        </div>

        {tab === 'tasks' && (
          <div className="mt-5 grid gap-5 lg:grid-cols-[.78fr_1.22fr]">
            <Panel title="Opgaveliste">
              <div className="grid max-h-[70vh] gap-2 overflow-y-auto pr-1">
                {data.tasks.map((task) => (
                  <button key={task.id} onClick={() => setTaskId(task.id)} className={`rounded-2xl p-4 text-left transition ${selectedTask?.id === task.id ? 'bg-[#071527] text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}>
                    <p className="truncate text-sm font-black">{task.brief?.title || task.category}</p>
                    <p className={`mt-1 truncate text-xs ${selectedTask?.id === task.id ? 'text-white/65' : 'text-slate-500'}`}>{task.customer_email}</p>
                    <p className="mt-2 text-xs font-black">{label(task.status, taskStatuses)}</p>
                  </button>
                ))}
              </div>
            </Panel>

            {selectedTask && (
              <div className="grid gap-5">
                <Panel title={`Opgave ${short(selectedTask.id)}`}>
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-3xl font-black tracking-tight text-[#071527]">{selectedTask.brief?.title || selectedTask.category}</h2>
                      <p className="mt-2 text-sm font-bold text-slate-500">{selectedTask.customer_email}</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-800">{label(selectedTask.status, taskStatuses)}</span>
                  </div>
                  <p className="mt-5 whitespace-pre-line rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">{selectedTask.need}</p>
                </Panel>

                <div className="grid gap-5 xl:grid-cols-2">
                  <Panel title="Opdater opgave">
                    <label className="grid gap-2 text-sm font-bold text-slate-700">Status<select value={String(taskDraft.status || '')} onChange={(event) => setTaskDraft({ ...taskDraft, status: event.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none">{taskStatuses.map(([key, value]) => <option key={key} value={key}>{value}</option>)}</select></label>
                    <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Specialistretning<input value={String(taskDraft.specialist_direction || '')} onChange={(event) => setTaskDraft({ ...taskDraft, specialist_direction: event.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none" /></label>
                    <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Næste skridt<textarea value={String(taskDraft.next_step || '')} onChange={(event) => setTaskDraft({ ...taskDraft, next_step: event.target.value })} rows={3} className="resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none" /></label>
                    <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Intern note<textarea value={String(taskDraft.internal_note || '')} onChange={(event) => setTaskDraft({ ...taskDraft, internal_note: event.target.value })} rows={3} className="resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none" /></label>
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <button disabled={saving} onClick={saveTask} className="rounded-full bg-[#071527] px-5 py-3 text-sm font-black text-white disabled:opacity-50">Gem opgave</button>
                      <button disabled={saving} onClick={notifyCustomer} className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-700 disabled:opacity-50">Send kundeopdatering</button>
                    </div>
                  </Panel>

                  <Panel title="Inviter specialist">
                    <label className="grid gap-2 text-sm font-bold text-slate-700">Godkendt specialist<select value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"><option value="">Vælg specialist</option>{approvedProviders.map((provider) => <option key={provider.id} value={provider.email}>{provider.name} · {provider.email}</option>)}</select></label>
                    <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Note til specialist<textarea value={inviteNote} onChange={(event) => setInviteNote(event.target.value)} rows={3} className="resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none" /></label>
                    <button disabled={saving || !inviteEmail} onClick={inviteSpecialist} className="mt-5 rounded-full bg-[#071527] px-5 py-3 text-sm font-black text-white disabled:opacity-50">Send invitation</button>
                    <div className="mt-6 grid gap-2">{selectedTaskInvitations.length ? selectedTaskInvitations.map((invite) => <div key={invite.id} className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700"><p className="font-black">{invite.specialist_email}</p><p className="text-xs text-slate-500">{invite.status}{invite.response_note ? ` · ${invite.response_note}` : ''}</p></div>) : <p className="text-sm text-slate-500">Ingen invitationer endnu.</p>}</div>
                  </Panel>
                </div>

                <div className="grid gap-5 xl:grid-cols-2">
                  <Panel title="Scope"><div className="grid gap-2">{scope.length ? scope.map((item) => <div key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</div>) : <p className="text-sm text-slate-500">Scope mangler.</p>}</div></Panel>
                  <Panel title="Kundeopdateringer"><div className="grid gap-2">{selectedTaskUpdates.length ? selectedTaskUpdates.map((update) => <div key={update.id} className="rounded-2xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-900"><p className="text-xs font-black uppercase tracking-[.12em] text-emerald-700">{new Date(update.created_at).toLocaleString('da-DK')}</p>{update.message}</div>) : <p className="text-sm text-slate-500">Ingen ekstra info fra kunde.</p>}</div></Panel>
                </div>

                <Panel title="Spørgsmål fra brief"><div className="grid gap-2">{questions.length ? questions.map((item) => <div key={item} className="rounded-2xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">{item}</div>) : <p className="text-sm text-slate-500">Ingen spørgsmål endnu.</p>}</div></Panel>
              </div>
            )}
          </div>
        )}

        {tab === 'providers' && (
          <div className="mt-5 grid gap-5 lg:grid-cols-[.78fr_1.22fr]">
            <Panel title="Specialistansøgninger">
              <div className="grid max-h-[70vh] gap-2 overflow-y-auto pr-1">
                {data.providers.map((provider) => (
                  <button key={provider.id} onClick={() => setProviderId(provider.id)} className={`rounded-2xl p-4 text-left transition ${selectedProvider?.id === provider.id ? 'bg-[#071527] text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}>
                    <p className="truncate text-sm font-black">{provider.name}</p>
                    <p className={`mt-1 truncate text-xs ${selectedProvider?.id === provider.id ? 'text-white/65' : 'text-slate-500'}`}>{provider.email}</p>
                    <p className="mt-2 text-xs font-black">{label(provider.status, providerStatuses)}</p>
                  </button>
                ))}
              </div>
            </Panel>

            {selectedProvider && (
              <Panel title={`Specialist ${short(selectedProvider.id)}`}>
                <h2 className="text-3xl font-black tracking-tight text-[#071527]">{selectedProvider.name}</h2>
                <p className="mt-2 text-sm font-bold text-slate-500">{selectedProvider.email}</p>
                <div className="mt-5 grid gap-4 xl:grid-cols-2">
                  <div><p className="font-black text-[#071527]">Kompetencer</p><p className="mt-2 whitespace-pre-line rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">{selectedProvider.skills}</p></div>
                  <div><p className="font-black text-[#071527]">Links</p><p className="mt-2 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">{selectedProvider.links || 'Ingen links angivet.'}</p></div>
                </div>
                <label className="mt-5 grid gap-2 text-sm font-bold text-slate-700">Status<select value={String(providerDraft.status || '')} onChange={(event) => setProviderDraft({ ...providerDraft, status: event.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none">{providerStatuses.map(([key, value]) => <option key={key} value={key}>{value}</option>)}</select></label>
                <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Foretrukne opgavetyper<textarea value={String(providerDraft.preferred_task_types || '')} onChange={(event) => setProviderDraft({ ...providerDraft, preferred_task_types: event.target.value })} rows={3} className="resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none" /></label>
                <button disabled={saving} onClick={saveProvider} className="mt-5 rounded-full bg-[#071527] px-5 py-3 text-sm font-black text-white disabled:opacity-50">Gem specialist</button>
              </Panel>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

function Metric({ title, value }: { title: string; value: number }) {
  return <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">{title}</p><p className="mt-3 text-4xl font-black text-[#071527]">{value}</p></div>;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><p className="mb-4 text-sm font-black text-[#071527]">{title}</p>{children}</div>;
}
