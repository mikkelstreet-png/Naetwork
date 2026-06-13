'use client';

import Link from "next/link";
import { useState } from "react";

export function AccountLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Login fejlede.");
      window.location.href = "/konto";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login fejlede.");
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
        <Link href="/opret" className="rounded-full bg-[#071527] px-4 py-2 text-sm font-black text-white shadow-sm">Opret bruger</Link>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 py-12 lg:grid-cols-[.9fr_1.1fr] lg:items-start lg:py-20">
        <div>
          <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Log ind</p>
          <h1 className="mt-4 text-5xl font-black leading-[.95] tracking-[-0.05em] text-[#071527] md:text-7xl">Fortsæt med din Naetwork-konto.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Brug din email som brugernavn og fortsæt med dine opgaver, specialistprofil eller invitationer.</p>
        </div>

        <div className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <label className="grid gap-2 text-sm font-bold text-slate-700">Email / brugernavn<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") submit(); }} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#3f8f83]" /></label>
          <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Adgangskode<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") submit(); }} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#3f8f83]" /></label>

          {error && <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-black text-rose-700">{error}</div>}

          <button disabled={loading} onClick={submit} className="mt-5 min-h-[48px] w-full rounded-full bg-[#071527] px-6 py-3 text-sm font-black text-white disabled:opacity-50">{loading ? "Logger ind" : "Log ind"}</button>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            Har du et gammelt opgavelink? Du kan stadig bruge <Link href="/access" className="font-black text-[#071527]">adgangssiden</Link>.
          </div>
        </div>
      </section>
    </main>
  );
}
