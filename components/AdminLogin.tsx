'use client';

import Link from "next/link";
import { useState } from "react";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Admin-login fejlede.");
      window.location.href = "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Admin-login fejlede.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e8f4ef_0,#f7f8fb_38%,#f7f8fb_100%)] px-4 py-6 text-slate-950 sm:px-5">
      <header className="mx-auto flex max-w-5xl items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">N</span>
          <span className="text-lg font-black tracking-tight text-[#071527]">Naetwork</span>
        </Link>
        <Link href="/" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">Til forsiden</Link>
      </header>

      <section className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-[.9fr_1.1fr] lg:py-20">
        <div>
          <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Internt område</p>
          <h1 className="mt-4 text-5xl font-black leading-[.95] tracking-[-0.05em] text-[#071527] md:text-7xl">Admin Control Center.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Styr opgaver, specialistretninger, ansøgninger og invitationer. Kun interne brugere.</p>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <p className="text-sm font-black uppercase tracking-[.18em] text-[#3f8f83]">Admin-login</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#071527]">Log ind</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">Indtast admin-adgangskoden for at åbne kontrolcenteret.</p>
          <label className="mt-6 grid gap-2 text-sm font-bold text-slate-700">
            Adgangskode
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") submit(); }} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-[#3f8f83] focus:ring-4 focus:ring-[#3f8f83]/10" />
          </label>
          {error && <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-black text-rose-700">{error}</div>}
          <button onClick={submit} disabled={loading} className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#071527] px-6 py-3 text-sm font-black text-white transition hover:bg-[#0b203a] disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? "Logger ind" : "Åbn admin"}
          </button>
        </div>
      </section>
    </main>
  );
}
