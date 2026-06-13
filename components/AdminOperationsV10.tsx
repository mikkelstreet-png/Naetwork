'use client';

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";

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

type Provider = { id: string; created_at: string; name: string; email: string; skills: string; links?: string | null; status: string; preferred_task_types?: string | null };
type Invitation = { id: string; created_at: string; task_id: string; specialist_email: string; status: string; response_note?: string | null; responded_at?: string | null };
type CustomerUpdate = { id: string; created_at: string; task_id: string; customer_email: string; message: string; source: string };
type Audit = { id: string; created_at: string; action: string; entity_type: string; entity_id?: string | null; metadata?: Record<string, unknown> | null };

type DashboardData = { tasks: Task[]; providers: Provider[]; invitations: Invitation[]; updates: CustomerUpdate[]; audit: Audit[]; auditWarning?: string };

const taskStatuses = [
  ["all", "Alle statusser"],
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

const actionFilters = [
  ["all", "Alle handlinger"],
  ["review", "Gennemgå"],
  ["direction", "Sæt retning"],
  ["invite", "Inviter specialist"],
  ["waiting", "Afventer svar"],
  ["customer", "Send kundeopdatering"]
];

function short(id: string) { return id.slice(0, 8); }
function list(value: unknown): string[] { return Array.isArray(value) ? value.map(String).filter(Boolean) : []; }
function label(value: string, values: string[][]) { return values.find(([key]) => key === value)?.[1] || value; }
function date(value: string) { return new Date(value).toLocaleString('da-DK'); }

function taskTitle(task: Task) { return task.brief?.title || task.category || `Opgave ${short(task.id)}`; }

function getNextAction(task: Task, invitations: Invitation[], updates: CustomerUpdate[]) {
  const hasInvitation = invitations.some((invite) => invite.task_id === task.id);
  const hasOpenInvitation = invitations.some((invite) => invite.task_id === task.id && invite.status === 'invited');
  const hasCustomerUpdate = updates.some((update) => update.task_id === task.id);
  const hasDirection = Boolean(task.specialist_direction || task.brief?.specialist);

  if (task.status === 'new') return { key: 'review', label: 'Gennemgå opgave', tone: 'amber' };
  if (!hasDirection) return { key: 'direction', label: 'Sæt specialistretning', tone: 'rose' };
  if (task.status === 'direction_ready' && !hasInvitation) return { key: 'invite', label: 'Inviter specialist', tone: 'emerald' };
  if (hasOpenInvitation || task.status === 'specialist_invited' || task.status === 'awaiting_specialist') return { key: 'waiting', label: 'Afventer specialistsvar', tone: 'blue' };
  if (task.status === 'ready_for_customer' || hasCustomerUpdate) return { key: 'customer', label: 'Send kundeopdatering', tone: 'slate' };
  return { key: 'monitor', label: 'Overvåg', tone: 'slate' };
}

function actionClass(tone: string) {
  if (tone === 'rose') return 'bg-rose-50 text-rose-700';
  if (tone === 'amber') return 'bg-amber-50 text-amber-800';
  if (tone === 'emerald') return 'bg-emerald-50 text-emerald-800';
  if (tone === 'blue') return 'bg-blue-50 text-blue-800';
  return 'bg-slate-100 text-slate-700';
}

export function AdminOperationsV10() {
  const [data, setData] = useState<DashboardData>({ tasks: [], providers: [], invitations: [], updates: [], audit: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<'tasks' | 'providers' | 'audit'>('tasks');
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [taskDraft, setTaskDraft] = useState<Partial<Task>>({});
  const [providerDraft, setProviderDraft] = useState<Partial<Provider>>({});
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteNote, setInviteNote] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/dashboard');
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Admin-data kunne ikke hentes.');
      const next: DashboardData = {
        tasks: result.tasks || [],
        providers: result.providers || [],
        invitations: result.invitations || [],
        updates: result.updates || [],
        audit: result.audit || [],
        auditWarning: result.auditWarning || ''
      };
      setData(next);
      setSelectedTaskId((current) => current || next.tasks[0]?.id || '');
      setSelectedProviderId((current) => current || next.providers[0]?.id || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Admin-data kunne ikke hentes.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const selectedTask = useMemo(() => data.tasks.find((task) => task.id === selectedTaskId) || data.tasks[0], [data.tasks, selectedTaskId]);
  const selectedProvider = useMemo(() => data.providers.find((provider) => provider.id === selectedProviderId) || data.providers[0], [data.providers, selectedProviderId]);
  const categories = useMemo(() => Array.from(new Set(data.tasks.map((task) => task.category).filter(Boolean))), [data.tasks]);
  const approvedProviders = useMemo(() => data.providers.filter((provider) => ['approved', 'active', 'godkendt'].includes(String(provider.status).toLowerCase())), [data.providers]);

  const filteredTasks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.tasks.filter((task) => {
      const nextAction = getNextAction(task, data.invitations, data.updates);
      const text = `${taskTitle(task)} ${task.customer_email} ${task.category} ${task.need} ${task.specialist_direction || ''}`.toLowerCase();
      if (q && !text.includes(q)) return false;
      if (statusFilter !== 'all' && task.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;
      if (actionFilter !== 'all' && nextAction.key !== actionFilter) return false;
      return true;
    });
  }, [data.tasks, data.invitations, data.updates, query, statusFilter, categoryFilter, actionFilter]);

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
    setProviderDraft({ status: selectedProvider.status, preferred_task_types: selectedProvider.preferred_task_types || '' });
  }, [selectedProvider?.id]);

  async function requestAction(url: string, method: 'POST' | 'PATCH', body?: unknown, success = 'Gemt.') {
    setSaving(true);
    setNotice('');
    try {
      const response = await fetch(url, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Handlingen kunne ikke gennemføres.');
      setNotice(success);
      await load();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Handlingen kunne ikke gennemføres.');
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  const taskUpdates = selectedTask ? data.updates.filter((update) => update.task_id === selectedTask.id) : [];
  const taskInvites = selectedTask ? data.invitations.filter((invite) => invite.task_id === selectedTask.id) : [];
  const scope = list(selectedTask?.brief?.scope);
  const questions = list(selectedTask?.brief?.questions);
  const nextAction = selectedTask ? getNextAction(selectedTask, data.invitations, data.updates) : null;

  const tasksNeedingAction = data.tasks.filter((task) => !['closed'].includes(task.status)).length;
  const readyToInvite = data.tasks.filter((task) => getNextAction(task, data.invitations, data.updates).key === 'invite').length;
  const customerUpdates = data.updates.length;
  const openInvites = data.invitations.filter((invite) => invite.status === 'invited').length;

  if (loading) return <main className="min-h-screen bg-slate-50 p-6"><Panel title="Henter admin-dashboard">Vent et øjeblik…</Panel></main>;
  if (error) return <main className="min-h-screen bg-slate-50 p-6"><Panel title="Admin-fejl"><p className="text-sm font-black text-rose-700">{error}</p><Link href="/admin/login" className="mt-4 inline-flex rounded-full bg-[#071527] px-5 py-3 text-sm font-black text-white">Gå til login</Link></Panel></main>;

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-lg font-black tracking-tight text-[#071527]">Admin Operations Center</p>
            <p className="text-xs text-slate-500">Søg, prioriter og styr næste handling på tværs af opgaver.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/setup" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-black text-slate-700">Setup-status</Link>
            <button onClick={() => requestAction('/api/admin/maintenance/cleanup', 'POST', undefined, 'Udløbne links er ryddet.')} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-black text-slate-700">Ryd links</button>
            <button onClick={logout} className="rounded-full bg-[#071527] px-4 py-2 text-sm font-black text-white">Log ud</button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-5">
        <div className="grid gap-4 md:grid-cols-4">
          <Metric title="Åbne opgaver" value={tasksNeedingAction} />
          <Metric title="Klar til invitation" value={readyToInvite} />
          <Metric title="Kundeinfo" value={customerUpdates} />
          <Metric title="Åbne invitationer" value={openInvites} />
        </div>

        {notice && <div className="mt-5 rounded-2xl bg-white p-4 text-sm font-black text-slate-700 shadow-sm">{notice}</div>}
        {data.auditWarning && <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-black text-amber-900">Audit log mangler muligvis databaseopsætning: {data.auditWarning}</div>}

        <div className="mt-6 flex flex-wrap gap-2">
          <Tab active={tab === 'tasks'} onClick={() => setTab('tasks')}>Opgaver</Tab>
          <Tab active={tab === 'providers'} onClick={() => setTab('providers')}>Specialister</Tab>
          <Tab active={tab === 'audit'} onClick={() => setTab('audit')}>Audit log</Tab>
        </div>

        {tab === 'tasks' && (
          <div className="mt-5 grid gap-5 lg:grid-cols-[.82fr_1.18fr]">
            <Panel title="Prioriter opgaver">
              <div className="grid gap-3">
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Søg på kunde, opgave, kategori eller indhold" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none" />
                <div className="grid gap-2 sm:grid-cols-3">
                  <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-2xl border border-slate-200 px-3 py-3 text-sm outline-none">{taskStatuses.map(([key, value]) => <option key={key} value={key}>{value}</option>)}</select>
                  <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="rounded-2xl border border-slate-200 px-3 py-3 text-sm outline-none"><option value="all">Alle kategorier</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select>
                  <select value={actionFilter} onChange={(event) => setActionFilter(event.target.value)} className="rounded-2xl border border-slate-200 px-3 py-3 text-sm outline-none">{actionFilters.map(([key, value]) => <option key={key} value={key}>{value}</option>)}</select>
                </div>
              </div>
              <div className="mt-4 grid max-h-[72vh] gap-2 overflow-y-auto pr-1">
                {filteredTasks.length ? filteredTasks.map((task) => {
                  const action = getNextAction(task, data.invitations, data.updates);
                  return (
                    <button key={task.id} onClick={() => setSelectedTaskId(task.id)} className={`rounded-2xl p-4 text-left transition ${selectedTask?.id === task.id ? 'bg-[#071527] text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black">{taskTitle(task)}</p>
                          <p className={`mt-1 truncate text-xs ${selectedTask?.id === task.id ? 'text-white/65' : 'text-slate-500'}`}>{task.customer_email}</p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black ${selectedTask?.id === task.id ? 'bg-white/10 text-white' : actionClass(action.tone)}`}>{action.label}</span>
                      </div>
                    </button>
                  );
                }) : <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">Ingen opgaver matcher filtrene.</p>}
              </div>
            </Panel>

            {selectedTask && (
              <div className="grid gap-5">
                <Panel title={`Opgave ${short(selectedTask.id)}`}>
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div>
                      <h2 className="text-3xl font-black tracking-tight text-[#071527]">{taskTitle(selectedTask)}</h2>
                      <p className="mt-2 text-sm font-bold text-slate-500">{selectedTask.customer_email}</p>
                    </div>
                    {nextAction && <span className={`rounded-full px-4 py-2 text-sm font-black ${actionClass(nextAction.tone)}`}>{nextAction.label}</span>}
                  </div>
                  <p className="mt-5 whitespace-pre-line rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">{selectedTask.need}</p>
                </Panel>

                <div className="grid gap-5 xl:grid-cols-2">
                  <Panel title="Styr opgaven">
                    <label className="grid gap-2 text-sm font-bold text-slate-700">Status<select value={String(taskDraft.status || '')} onChange={(event) => setTaskDraft({ ...taskDraft, status: event.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none">{taskStatuses.filter(([key]) => key !== 'all').map(([key, value]) => <option key={key} value={key}>{value}</option>)}</select></label>
                    <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Specialistretning<input value={String(taskDraft.specialist_direction || '')} onChange={(event) => setTaskDraft({ ...taskDraft, specialist_direction: event.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none" /></label>
                    <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Næste skridt<textarea value={String(taskDraft.next_step || '')} onChange={(event) => setTaskDraft({ ...taskDraft, next_step: event.target.value })} rows={3} className="resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none" /></label>
                    <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Intern note<textarea value={String(taskDraft.internal_note || '')} onChange={(event) => setTaskDraft({ ...taskDraft, internal_note: event.target.value })} rows={3} className="resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none" /></label>
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <button disabled={saving} onClick={() => requestAction(`/api/admin/tasks/${selectedTask.id}`, 'PATCH', taskDraft, 'Opgaven er gemt.')} className="rounded-full bg-[#071527] px-5 py-3 text-sm font-black text-white disabled:opacity-50">Gem</button>
                      <button disabled={saving} onClick={() => requestAction(`/api/admin/tasks/${selectedTask.id}/notify`, 'POST', undefined, 'Kunden er notificeret.')} className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-700 disabled:opacity-50">Send kundeopdatering</button>
                    </div>
                  </Panel>

                  <Panel title="Match specialist">
                    <label className="grid gap-2 text-sm font-bold text-slate-700">Godkendt specialist<select value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"><option value="">Vælg specialist</option>{approvedProviders.map((provider) => <option key={provider.id} value={provider.email}>{provider.name} · {provider.email}</option>)}</select></label>
                    <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Note til specialist<textarea value={inviteNote} onChange={(event) => setInviteNote(event.target.value)} rows={3} className="resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none" /></label>
                    <button disabled={saving || !inviteEmail} onClick={() => requestAction('/api/admin/invitations', 'POST', { task_id: selectedTask.id, specialist_email: inviteEmail, note: inviteNote }, 'Specialisten er inviteret.')} className="mt-5 rounded-full bg-[#071527] px-5 py-3 text-sm font-black text-white disabled:opacity-50">Send invitation</button>
                    <div className="mt-5 grid gap-2">{taskInvites.length ? taskInvites.map((invite) => <div key={invite.id} className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700"><p className="font-black">{invite.specialist_email}</p><p className="text-xs text-slate-500">{invite.status}{invite.response_note ? ` · ${invite.response_note}` : ''}</p></div>) : <p className="text-sm text-slate-500">Ingen invitationer endnu.</p>}</div>
                  </Panel>
                </div>

                <div className="grid gap-5 xl:grid-cols-3">
                  <Panel title="Scope"><Stack items={scope} empty="Scope mangler." /></Panel>
                  <Panel title="Åbne spørgsmål"><Stack items={questions} empty="Ingen spørgsmål endnu." /></Panel>
                  <Panel title="Kundeinfo"><div className="grid gap-2">{taskUpdates.length ? taskUpdates.map((update) => <div key={update.id} className="rounded-2xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-900"><p className="text-xs font-black uppercase tracking-[.12em] text-emerald-700">{date(update.created_at)}</p>{update.message}</div>) : <p className="text-sm text-slate-500">Ingen ekstra info.</p>}</div></Panel>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'providers' && (
          <div className="mt-5 grid gap-5 lg:grid-cols-[.82fr_1.18fr]">
            <Panel title="Specialister">
              <div className="grid max-h-[72vh] gap-2 overflow-y-auto pr-1">{data.providers.map((provider) => <button key={provider.id} onClick={() => setSelectedProviderId(provider.id)} className={`rounded-2xl p-4 text-left ${selectedProvider?.id === provider.id ? 'bg-[#071527] text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}><p className="truncate text-sm font-black">{provider.name}</p><p className={`mt-1 truncate text-xs ${selectedProvider?.id === provider.id ? 'text-white/65' : 'text-slate-500'}`}>{provider.email}</p><p className="mt-2 text-xs font-black">{label(provider.status, providerStatuses)}</p></button>)}</div>
            </Panel>
            {selectedProvider && <Panel title={`Specialist ${short(selectedProvider.id)}`}><h2 className="text-3xl font-black text-[#071527]">{selectedProvider.name}</h2><p className="mt-2 text-sm font-bold text-slate-500">{selectedProvider.email}</p><div className="mt-5 grid gap-4 xl:grid-cols-2"><Info title="Kompetencer" text={selectedProvider.skills} /><Info title="Links" text={selectedProvider.links || 'Ingen links angivet.'} /></div><label className="mt-5 grid gap-2 text-sm font-bold text-slate-700">Status<select value={String(providerDraft.status || '')} onChange={(event) => setProviderDraft({ ...providerDraft, status: event.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none">{providerStatuses.map(([key, value]) => <option key={key} value={key}>{value}</option>)}</select></label><label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Foretrukne opgavetyper<textarea value={String(providerDraft.preferred_task_types || '')} onChange={(event) => setProviderDraft({ ...providerDraft, preferred_task_types: event.target.value })} rows={3} className="resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none" /></label><button disabled={saving} onClick={() => requestAction(`/api/admin/providers/${selectedProvider.id}`, 'PATCH', providerDraft, 'Specialisten er gemt.')} className="mt-5 rounded-full bg-[#071527] px-5 py-3 text-sm font-black text-white disabled:opacity-50">Gem specialist</button></Panel>}
          </div>
        )}

        {tab === 'audit' && (
          <Panel title="Seneste adminhandlinger">
            <div className="grid gap-2">{data.audit.length ? data.audit.map((item) => <div key={item.id} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700"><div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><p className="font-black text-[#071527]">{item.action}</p><p className="text-xs text-slate-500">{date(item.created_at)}</p></div><p className="mt-1 text-xs text-slate-500">{item.entity_type}{item.entity_id ? ` · ${item.entity_id}` : ''}</p></div>) : <p className="text-sm text-slate-500">Ingen audit log endnu.</p>}</div>
          </Panel>
        )}
      </section>
    </main>
  );
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return <button onClick={onClick} className={`rounded-full px-5 py-3 text-sm font-black ${active ? 'bg-[#071527] text-white' : 'border border-slate-200 bg-white text-slate-700'}`}>{children}</button>;
}
function Metric({ title, value }: { title: string; value: number }) { return <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">{title}</p><p className="mt-3 text-4xl font-black text-[#071527]">{value}</p></div>; }
function Panel({ title, children }: { title: string; children: ReactNode }) { return <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><p className="mb-4 text-sm font-black text-[#071527]">{title}</p>{children}</div>; }
function Stack({ items, empty }: { items: string[]; empty: string }) { return <div className="grid gap-2">{items.length ? items.map((item) => <div key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</div>) : <p className="text-sm text-slate-500">{empty}</p>}</div>; }
function Info({ title, text }: { title: string; text: string }) { return <div><p className="font-black text-[#071527]">{title}</p><p className="mt-2 whitespace-pre-line rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">{text}</p></div>; }
