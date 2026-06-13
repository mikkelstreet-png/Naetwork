'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

type Task = {
  id: string;
  created_at: string;
  category: string;
  need: string;
  audience?: string | null;
  budget?: string | null;
  deadline?: string | null;
  status: string;
  brief?: { title?: string; specialist?: string; tags?: string[]; scope?: string[]; questions?: string[] };
  specialist_direction?: string | null;
  next_step?: string | null;
};

type Update = { id: string; created_at: string; message: string; source: string };

type State = { loading: boolean; error: string; task?: Task; updates: Update[] };

const statusLabels: Record<string, string> = {
  new: "Modtaget",
  received: "Modtaget",
  reviewing: "Under gennemgang",
  direction_ready: "Specialistretning klar",
  follow_up_ready: "Klar til opfølgning",
  closed: "Lukket"
};

const statusSteps = ["Modtaget", "Under gennemgang", "Specialistretning klar", "Klar til opfølgning"];

function statusLabel(status: string) {
  return statusLabels[status] || status || "Modtaget";
}

function safeList(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => String(item)).filter(Boolean) : [];
}

export function CustomerTaskDetail({ taskId, token }: { taskId: string; token?: string }) {
  const [state, setState] = useState<State>({ loading: true, error: "", updates: [] });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  async function load() {
    if (!token) {
      setState({ loading: false, error: "Linket mangler adgangstoken. Bed om et nyt login-link.", updates: [] });
      return;
    }

    try {
      const response = await fetch(`/api/customer/tasks/${taskId}?token=${encodeURIComponent(token)}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Opgaven kunne ikke hentes.");
      setState({ loading: false, error: "", task: result.task, updates: result.updates || [] });
    } catch (error) {
      setState({ loading: false, error: error instanceof Error ? error.message : "Opgaven kunne ikke hentes.", updates: [] });
    }
  }

  useEffect(() => {
    load();
  }, [taskId, token]);

  async function submitUpdate() {
    setSaveMessage("");
    if (message.trim().length < 10) return setSaveMessage("Skriv lidt mere, så opdateringen bliver brugbar.");
    setSaving(true);

    try {
      const response = await fetch(`/api/customer/tasks/${taskId}/updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, message })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Opdateringen kunne ikke sendes.");
      setMessage("");
      setSaveMessage("Tak. Din ekstra information er gemt på opgaven.");
      await load();
    } catch (error) {
      setSaveMessage(error instanceof Error ? error.message : "Opdateringen kunne ikke sendes.");
    } finally {
      setSaving(false);
    }
  }

  const task = state.task;
  const title = task?.brief?.title || task?.category || "Din opgave";
  const specialist = task?.specialist_direction || task?.brief?.specialist || "Specialistretning afklares";
  const scope = safeList(task?.brief?.scope);
  const questions = safeList(task?.brief?.questions);
  const tags = safeList(task?.brief?.tags);
  const currentStatus = statusLabel(task?.status || "new");

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e8f4ef_0,#f7f8fb_38%,#f7f8fb_100%)] px-4 py-6 text-slate-950 sm:px-5">
      <header className="mx-auto flex max-w-7xl items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">N</span>
          <span className="text-lg font-black tracking-tight text-[#071527]">Naetwork</span>
        </Link>
        <Link href={`/opgave?token=${encodeURIComponent(token || "")}`} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">Alle opgaver</Link>
      </header>

      {state.loading && <section className="mx-auto max-w-7xl py-12"><div className="rounded-[28px] border border-slate-200 bg-white p-6 text-sm font-black text-slate-600 shadow-sm">Henter opgaven…</div></section>}
      {state.error && <section className="mx-auto max-w-7xl py-12"><div className="rounded-[28px] border border-rose-200 bg-rose-50 p-6 text-sm font-black text-rose-700 shadow-sm">{state.error}</div></section>}

      {!state.loading && !state.error && task && (
        <section className="mx-auto grid max-w-7xl gap-6 py-10 lg:grid-cols-[.78fr_1.22fr] lg:py-14">
          <aside className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-24 lg:self-start">
            <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Min opgave</p>
            <h1 className="mt-4 text-4xl font-black leading-tight tracking-[-0.04em] text-[#071527]">{title}</h1>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-800">{currentStatus}</span>
              <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-black text-slate-600">{task.category}</span>
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-600">{task.need}</p>
            <div className="mt-6 grid gap-3">
              {statusSteps.map((step, index) => {
                const active = step === currentStatus;
                const done = statusSteps.indexOf(currentStatus) > index;
                return (
                  <div key={step} className="flex items-center gap-3">
                    <span className={`grid h-8 w-8 place-items-center rounded-full text-xs font-black ${active || done ? "bg-[#071527] text-white" : "bg-slate-100 text-slate-400"}`}>{index + 1}</span>
                    <span className={`text-sm font-black ${active ? "text-[#071527]" : done ? "text-slate-700" : "text-slate-400"}`}>{step}</span>
                  </div>
                );
              })}
            </div>
          </aside>

          <div className="grid gap-5">
            <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-sm font-black uppercase tracking-[.18em] text-[#3f8f83]">Foreløbig brief</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#071527]">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">Briefen er et arbejdsgrundlag. Den kan justeres, når du eller Naetwork tilføjer mere information.</p>
              <div className="mt-5 flex flex-wrap gap-2">{tags.length ? tags.map((tag) => <span key={tag} className="rounded-full border border-slate-200 px-3 py-2 text-xs font-black text-slate-700">{tag}</span>) : <span className="rounded-full border border-slate-200 px-3 py-2 text-xs font-black text-slate-500">Afklaring</span>}</div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <p className="font-black text-[#071527]">Scope</p>
                <div className="mt-3 grid gap-2">{scope.length ? scope.map((item) => <div key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</div>) : <div className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-500">Scope afklares.</div>}</div>
              </div>
              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <p className="font-black text-[#071527]">Spørgsmål</p>
                <div className="mt-3 grid gap-2">{questions.length ? questions.map((item) => <div key={item} className="rounded-2xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">{item}</div>) : <div className="rounded-2xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">Naetwork afklarer næste spørgsmål.</div>}</div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="font-black text-[#071527]">Specialistretning</p>
              <p className="mt-3 rounded-2xl bg-[#071527] p-4 text-sm font-black leading-6 text-white">{specialist}</p>
              <p className="mt-4 font-black text-[#071527]">Næste skridt</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{task.next_step || "Naetwork gennemgår opgaven og vurderer, hvad der skal afklares før en specialist kan vælges."}</p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="font-black text-[#071527]">Tilføj mere information</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Har du glemt noget, eller er der noget, der skal justeres? Skriv det her, så ligger det på opgaven.</p>
              <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={5} className="mt-4 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-[#3f8f83] focus:ring-4 focus:ring-[#3f8f83]/10" placeholder="Tilføj fx mere kontekst, ønsker, links eller prioriteringer." />
              {saveMessage && <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm font-black text-slate-700">{saveMessage}</div>}
              <button onClick={submitUpdate} disabled={saving} className="mt-4 rounded-full bg-[#071527] px-5 py-3 text-sm font-black text-white disabled:opacity-50">{saving ? "Gemmer" : "Tilføj til opgaven"}</button>
            </div>

            {state.updates.length > 0 && (
              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <p className="font-black text-[#071527]">Dine tilføjelser</p>
                <div className="mt-4 grid gap-3">{state.updates.map((update) => <div key={update.id} className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-[.14em] text-slate-400">{new Date(update.created_at).toLocaleString("da-DK")}</p><p className="mt-2 text-sm leading-6 text-slate-700">{update.message}</p></div>)}</div>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
