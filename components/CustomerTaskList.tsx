'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

type Task = {
  id: string;
  created_at: string;
  category: string;
  need: string;
  status: string;
  brief?: { title?: string; specialist?: string };
  specialist_direction?: string | null;
  next_step?: string | null;
};

type ApiState = {
  loading: boolean;
  error: string;
  tasks: Task[];
  customerEmail: string;
};

const statusLabels: Record<string, string> = {
  new: "Modtaget",
  received: "Modtaget",
  reviewing: "Under gennemgang",
  direction_ready: "Specialistretning klar",
  follow_up_ready: "Klar til opfølgning",
  closed: "Lukket"
};

function statusLabel(status: string) {
  return statusLabels[status] || status || "Modtaget";
}

export function CustomerTaskList({ token }: { token?: string }) {
  const [state, setState] = useState<ApiState>({ loading: true, error: "", tasks: [], customerEmail: "" });

  useEffect(() => {
    async function load() {
      if (!token) {
        setState({ loading: false, error: "Linket mangler adgangstoken. Bed om et nyt login-link.", tasks: [], customerEmail: "" });
        return;
      }

      try {
        const response = await fetch(`/api/customer/tasks?token=${encodeURIComponent(token)}`);
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Opgaver kunne ikke hentes.");
        setState({ loading: false, error: "", tasks: result.tasks || [], customerEmail: result.customerEmail || "" });
      } catch (error) {
        setState({ loading: false, error: error instanceof Error ? error.message : "Opgaver kunne ikke hentes.", tasks: [], customerEmail: "" });
      }
    }

    load();
  }, [token]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e8f4ef_0,#f7f8fb_38%,#f7f8fb_100%)] px-4 py-6 text-slate-950 sm:px-5">
      <header className="mx-auto flex max-w-6xl items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">N</span>
          <span className="text-lg font-black tracking-tight text-[#071527]">Naetwork</span>
        </Link>
        <Link href="/login" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">Nyt login-link</Link>
      </header>

      <section className="mx-auto max-w-6xl py-10 lg:py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Min opgave</p>
          <h1 className="mt-4 text-5xl font-black leading-[.95] tracking-[-0.05em] text-[#071527] md:text-7xl">Følg dine opgaver.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">Se status, foreløbig brief og næste skridt. Det her er stedet, hvor din opgave lever videre.</p>
        </div>

        {state.loading && <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 text-sm font-black text-slate-600 shadow-sm">Henter dine opgaver…</div>}
        {state.error && <div className="mt-8 rounded-[28px] border border-rose-200 bg-rose-50 p-6 text-sm font-black text-rose-700 shadow-sm">{state.error}</div>}

        {!state.loading && !state.error && (
          <div className="mt-8 grid gap-4">
            {state.tasks.length === 0 ? (
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-black text-[#071527]">Ingen opgaver fundet</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">Der blev ikke fundet opgaver på dette link. Bed om et nyt login-link eller opret en ny opgave.</p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link href="/login" className="rounded-full border border-slate-200 px-5 py-3 text-center text-sm font-black text-slate-700">Send nyt login-link</Link>
                  <Link href="/" className="rounded-full bg-[#071527] px-5 py-3 text-center text-sm font-black text-white">Opret opgave</Link>
                </div>
              </div>
            ) : (
              state.tasks.map((task) => {
                const title = task.brief?.title || task.category || "Digital opgave";
                const specialist = task.specialist_direction || task.brief?.specialist || "Specialistretning afklares";
                return (
                  <Link key={task.id} href={`/opgave/${task.id}?token=${encodeURIComponent(token || "")}`} className="group rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#3f8f83]/50 hover:shadow-md sm:p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-800">{statusLabel(task.status)}</span>
                          <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-black text-slate-600">{task.category}</span>
                        </div>
                        <h2 className="mt-4 text-2xl font-black tracking-tight text-[#071527]">{title}</h2>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{task.need}</p>
                        <p className="mt-4 text-sm font-black text-slate-700">{specialist}</p>
                      </div>
                      <div className="shrink-0 rounded-full bg-[#071527] px-4 py-2 text-sm font-black text-white transition group-hover:bg-[#0b203a]">Åbn opgave</div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        )}
      </section>
    </main>
  );
}
