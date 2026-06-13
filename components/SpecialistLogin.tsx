'use client';

import Link from "next/link";
import { useState } from "react";

function validEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value.trim());
}

export function SpecialistLogin() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    if (!validEmail(email)) return setError("Indtast en gyldig email.");
    setLoading(true);

    try {
      const response = await fetch("/api/specialist/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Login-link kunne ikke sendes.");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login-link kunne ikke sendes.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e8f4ef_0,#f7f8fb_38%,#f7f8fb_100%)] px-4 py-6 text-slate-950 sm:px-5">
      <header className="mx-auto flex max-w-6xl items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">N</span>
          <span className="text-lg font-black tracking-tight text-[#071527]">Naetwork</span>
        </Link>
        <Link href="/" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">Til forsiden</Link>
      </header>

      <section className="mx-auto grid max-w-6xl gap-6 py-10 lg:grid-cols-[.95fr_1.05fr] lg:py-20">
        <div>
          <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Specialist-adgang</p>
          <h1 className="mt-4 text-5xl font-black leading-[.95] tracking-[-0.05em] text-[#071527] md:text-7xl">Se relevante opgaver.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Log ind for at se din profil, godkendelsesstatus og de opgaver, du er inviteret til at vurdere. Ingen kodeord, kun sikkert email-link.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[["1", "Skriv email"], ["2", "Få sikkert link"], ["3", "Svar på opgaver"]].map(([no, text]) => (
              <div key={no} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[#071527] text-xs font-black text-white">{no}</span>
                <p className="mt-3 text-sm font-black text-slate-800">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          {!sent ? (
            <>
              <p className="text-sm font-black uppercase tracking-[.18em] text-[#3f8f83]">Kun godkendte specialister</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#071527]">Send specialist-link</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">Brug den email, du ansøgte med. Hvis du er godkendt, sender vi adgangslinket.</p>
              <label className="mt-6 grid gap-2 text-sm font-bold text-slate-700">
                Email
                <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="dig@email.dk" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-[#3f8f83] focus:ring-4 focus:ring-[#3f8f83]/10" />
              </label>
              {error && <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-black text-rose-700">{error}</div>}
              <button onClick={submit} disabled={loading} className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#071527] px-6 py-3 text-sm font-black text-white transition hover:bg-[#0b203a] disabled:cursor-not-allowed disabled:opacity-50">
                {loading ? "Sender link" : "Send login-link"}
              </button>
              <p className="mt-4 text-xs leading-5 text-slate-500">Har du ikke ansøgt endnu, så gå til forsiden og vælg “For specialister”.</p>
            </>
          ) : (
            <div className="rounded-[26px] bg-emerald-50 p-6">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-xl">✓</div>
              <h2 className="mt-5 text-3xl font-black tracking-tight text-emerald-950">Tjek din email</h2>
              <p className="mt-3 text-sm leading-7 text-emerald-900">Hvis emailen er godkendt som specialist, har vi sendt et sikkert link til specialistområdet.</p>
              <button onClick={() => { setSent(false); setEmail(""); }} className="mt-5 rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm font-black text-emerald-950">Send til en anden email</button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
