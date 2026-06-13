'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

const categories = ["Ikke sikker endnu", "Hjemmeside / landing page", "Booking / kunderejse", "Automatisering", "Dashboard / data", "AI i virksomheden", "MVP / webapp", "Salg / pitch"];

export function AccountTaskCreateV11() {
  const [checked, setChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [category, setCategory] = useState(categories[0]);
  const [need, setNeed] = useState("");
  const [situation, setSituation] = useState("");
  const [outcome, setOutcome] = useState("");
  const [audience, setAudience] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/account/dashboard")
      .then((response) => setLoggedIn(response.ok))
      .catch(() => setLoggedIn(false))
      .finally(() => setChecked(true));
  }, []);

  async function submit() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/account/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, need, situation, outcome, audience, budget, deadline })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Opgaven kunne ikke oprettes.");
      window.location.href = "/min-side";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Opgaven kunne ikke oprettes.");
    } finally {
      setLoading(false);
    }
  }

  if (!checked) return <main className="min-h-screen bg-[#f7f8fb] p-6"><div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 text-sm font-black text-slate-600 shadow-sm">Tjekker konto…</div></main>;

  if (!loggedIn) {
    return <main className="min-h-screen bg-[#f7f8fb] px-4 py-12 text-slate-950 sm:px-5"><section className="mx-auto max-w-3xl rounded-[34px] border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8"><p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Opret opgave</p><h1 className="mt-4 text-4xl font-black tracking-tight text-[#071527] md:text-6xl">Log ind før du opretter en opgave.</h1><p className="mt-5 text-lg leading-8 text-slate-600">Naetwork er konto-baseret, så dine opgaver ligger samlet på din profil.</p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/login" className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-black text-slate-800">Min Naetwork konto</Link><Link href="/opret" className="rounded-full bg-[#071527] px-6 py-3 text-sm font-black text-white">Opret dig</Link></div></section></main>;
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e8f4ef_0,#f7f8fb_38%,#f7f8fb_100%)] px-4 py-6 text-slate-950 sm:px-5">
      <header className="mx-auto flex max-w-6xl items-center justify-between py-3"><Link href="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">N</span><span className="text-lg font-black tracking-tight text-[#071527]">Naetwork</span></Link><Link href="/min-side" className="rounded-full bg-[#071527] px-4 py-2 text-sm font-black text-white shadow-sm">Min profil</Link></header>
      <section className="mx-auto grid max-w-6xl gap-8 py-12 lg:grid-cols-[.88fr_1.12fr] lg:items-start lg:py-20">
        <div><p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Opret opgave</p><h1 className="mt-4 text-5xl font-black leading-[.95] tracking-[-0.05em] text-[#071527] md:text-7xl">Beskriv problemet. Ikke løsningen.</h1><p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Opgaven gemmes på din profil. I næste sprint genererer AI et professionelt scope og specialistklar brief ud fra dine svar.</p></div>
        <div className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <label className="grid gap-2 text-sm font-bold text-slate-700">Opgavetype<select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none">{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Hvad vil du have hjælp til?<textarea value={need} onChange={(event) => setNeed(event.target.value)} rows={4} className="resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none" /></label>
          <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Hvad fungerer ikke i dag?<textarea value={situation} onChange={(event) => setSituation(event.target.value)} rows={3} className="resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none" /></label>
          <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Hvad skal være anderledes bagefter?<textarea value={outcome} onChange={(event) => setOutcome(event.target.value)} rows={3} className="resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none" /></label>
          <div className="mt-4 grid gap-3 sm:grid-cols-3"><input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Målgruppe" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none" /><input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Budget" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none" /><input value={deadline} onChange={(e) => setDeadline(e.target.value)} placeholder="Deadline" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none" /></div>
          {error && <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-black text-rose-700">{error}</div>}
          <button disabled={loading} onClick={submit} className="mt-5 min-h-[48px] w-full rounded-full bg-[#071527] px-6 py-3 text-sm font-black text-white disabled:opacity-50">{loading ? "Opretter opgave" : "Opret opgave"}</button>
        </div>
      </section>
    </main>
  );
}
