'use client';

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Profile = {
  id: string;
  name: string;
  email: string;
  skills: string;
  links?: string | null;
  status: string;
  preferred_task_types?: string | null;
};

type Invitation = {
  id: string;
  created_at: string;
  task_id: string;
  status: string;
  response_note?: string | null;
  responded_at?: string | null;
};

type Task = {
  id: string;
  created_at: string;
  category: string;
  need: string;
  status: string;
  brief?: { title?: string; specialist?: string; tags?: string[]; scope?: string[]; questions?: string[] };
  specialist_direction?: string | null;
  next_step?: string | null;
};

type DashboardState = {
  loading: boolean;
  error: string;
  email: string;
  profile?: Profile;
  invitations: Invitation[];
  tasks: Task[];
};

const responseLabels: Record<string, string> = {
  invited: "Ny invitation",
  interested: "Interesseret",
  not_relevant: "Ikke relevant",
  needs_more_info: "Ønsker mere info"
};

function safeList(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => String(item)).filter(Boolean) : [];
}

export function SpecialistDashboard({ token }: { token?: string }) {
  const [state, setState] = useState<DashboardState>({ loading: true, error: "", email: "", invitations: [], tasks: [] });
  const [activeInvitation, setActiveInvitation] = useState<string>("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    if (!token) {
      setState({ loading: false, error: "Linket mangler adgangstoken. Bed om et nyt specialist-link.", email: "", invitations: [], tasks: [] });
      return;
    }

    try {
      const response = await fetch(`/api/specialist/dashboard?token=${encodeURIComponent(token)}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Specialistområdet kunne ikke hentes.");
      setState({ loading: false, error: "", email: result.email || "", profile: result.profile, invitations: result.invitations || [], tasks: result.tasks || [] });
    } catch (error) {
      setState({ loading: false, error: error instanceof Error ? error.message : "Specialistområdet kunne ikke hentes.", email: "", invitations: [], tasks: [] });
    }
  }

  useEffect(() => {
    load();
  }, [token]);

  const taskById = useMemo(() => {
    const map = new Map<string, Task>();
    state.tasks.forEach((task) => map.set(task.id, task));
    return map;
  }, [state.tasks]);

  async function respond(invitationId: string, status: string) {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(`/api/specialist/invitations/${invitationId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, status, note: activeInvitation === invitationId ? note : "" })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Svaret kunne ikke gemmes.");
      setMessage("Dit svar er gemt.");
      setNote("");
      setActiveInvitation("");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Svaret kunne ikke gemmes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e8f4ef_0,#f7f8fb_38%,#f7f8fb_100%)] px-4 py-6 text-slate-950 sm:px-5">
      <header className="mx-auto flex max-w-7xl items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">N</span>
          <span className="text-lg font-black tracking-tight text-[#071527]">Naetwork</span>
        </Link>
        <Link href="/specialist/login" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">Nyt login-link</Link>
      </header>

      <section className="mx-auto max-w-7xl py-10 lg:py-14">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Specialistområde</p>
          <h1 className="mt-4 text-5xl font-black leading-[.95] tracking-[-0.05em] text-[#071527] md:text-7xl">Relevante opgaver. Bedre briefs.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">Her ser du din profil, godkendelsesstatus og de opgaver, du er inviteret til at vurdere.</p>
        </div>

        {state.loading && <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 text-sm font-black text-slate-600 shadow-sm">Henter specialistområdet…</div>}
        {state.error && <div className="mt-8 rounded-[28px] border border-rose-200 bg-rose-50 p-6 text-sm font-black text-rose-700 shadow-sm">{state.error}</div>}

        {!state.loading && !state.error && (
          <div className="mt-8 grid gap-6 lg:grid-cols-[.75fr_1.25fr]">
            <aside className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-24 lg:self-start">
              <p className="text-sm font-black uppercase tracking-[.18em] text-[#3f8f83]">Profil</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#071527]">{state.profile?.name || "Specialist"}</h2>
              <p className="mt-2 text-sm font-bold text-slate-500">{state.email}</p>
              <div className="mt-5 rounded-2xl bg-emerald-50 p-4">
                <p className="text-xs font-black uppercase tracking-[.14em] text-emerald-700">Status</p>
                <p className="mt-2 text-sm font-black text-emerald-950">{state.profile?.status || "Afventer"}</p>
              </div>
              <div className="mt-5">
                <p className="font-black text-[#071527]">Kompetencer</p>
                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600">{state.profile?.skills || "Ikke angivet"}</p>
              </div>
              {state.profile?.links && <div className="mt-5"><p className="font-black text-[#071527]">Links</p><p className="mt-2 text-sm leading-7 text-slate-600">{state.profile.links}</p></div>}
            </aside>

            <div className="grid gap-5">
              <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[.18em] text-[#3f8f83]">Opgaveinvitationer</p>
                    <h2 className="mt-3 text-3xl font-black tracking-tight text-[#071527]">Vurder relevante opgaver</h2>
                  </div>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-700">{state.invitations.length} invitationer</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">Du bør kun sige ja til opgaver, hvor du reelt kan skabe kvalitet. Det er sådan Naetwork bevarer tillid.</p>
              </div>

              {message && <div className="rounded-2xl bg-slate-100 p-4 text-sm font-black text-slate-700">{message}</div>}

              {state.invitations.length === 0 ? (
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-2xl font-black text-[#071527]">Ingen opgaver endnu</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">Når en opgave matcher din profil og er gjort klar nok, kan admin invitere dig her.</p>
                </div>
              ) : (
                state.invitations.map((invitation) => {
                  const task = taskById.get(invitation.task_id);
                  const title = task?.brief?.title || task?.category || "Digital opgave";
                  const scope = safeList(task?.brief?.scope);
                  const questions = safeList(task?.brief?.questions);
                  return (
                    <article key={invitation.id} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-800">{responseLabels[invitation.status] || invitation.status}</span>
                            {task?.category && <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-black text-slate-600">{task.category}</span>}
                          </div>
                          <h3 className="mt-4 text-2xl font-black tracking-tight text-[#071527]">{title}</h3>
                          <p className="mt-2 text-sm leading-7 text-slate-600">{task?.need || "Opgavedetaljer hentes."}</p>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-sm font-black text-[#071527]">Scope</p>
                          <div className="mt-2 grid gap-2">{scope.length ? scope.map((item) => <p key={item} className="text-sm leading-6 text-slate-600">• {item}</p>) : <p className="text-sm text-slate-500">Scope afklares.</p>}</div>
                        </div>
                        <div className="rounded-2xl bg-emerald-50 p-4">
                          <p className="text-sm font-black text-emerald-950">Spørgsmål</p>
                          <div className="mt-2 grid gap-2">{questions.length ? questions.map((item) => <p key={item} className="text-sm leading-6 text-emerald-900">• {item}</p>) : <p className="text-sm text-emerald-900">Næste spørgsmål afklares.</p>}</div>
                        </div>
                      </div>

                      <div className="mt-5 rounded-2xl border border-slate-200 p-4">
                        <button type="button" onClick={() => setActiveInvitation(activeInvitation === invitation.id ? "" : invitation.id)} className="text-sm font-black text-[#071527]">Tilføj kort note til dit svar</button>
                        {activeInvitation === invitation.id && <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} className="mt-3 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#3f8f83] focus:ring-4 focus:ring-[#3f8f83]/10" placeholder="Fx relevant erfaring, forbehold eller spørgsmål." />}
                      </div>

                      <div className="mt-5 grid gap-3 md:grid-cols-3">
                        <button disabled={saving} onClick={() => respond(invitation.id, "interested")} className="rounded-full bg-[#071527] px-5 py-3 text-sm font-black text-white disabled:opacity-50">Interesseret</button>
                        <button disabled={saving} onClick={() => respond(invitation.id, "needs_more_info")} className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-700 disabled:opacity-50">Ønsker mere info</button>
                        <button disabled={saving} onClick={() => respond(invitation.id, "not_relevant")} className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-700 disabled:opacity-50">Ikke relevant</button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
