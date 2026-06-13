'use client';

import Link from "next/link";
import { useState } from "react";

export function AccountRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "specialist">("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/account/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Brugeren kunne ikke oprettes.");
      window.location.href = role === "specialist" ? "/konto" : "/konto";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Brugeren kunne ikke oprettes.");
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
        <Link href="/login" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">Log ind</Link>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 py-12 lg:grid-cols-[.9fr_1.1fr] lg:items-start lg:py-20">
        <div>
          <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Opret bruger</p>
          <h1 className="mt-4 text-5xl font-black leading-[.95] tracking-[-0.05em] text-[#071527] md:text-7xl">Email er dit brugernavn.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Opret en konto, så du kan logge ind, se dine opgaver og fortsætte dialogen. Du kan oprette dig som kunde eller specialist.</p>
          <div className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="font-black text-[#071527]">Sådan fungerer det</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">Kunder opretter opgaver og følger status. Specialister kan ansøge og få adgang til relevante opgaveinvitationer.</p>
          </div>
        </div>

        <div className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-1">
            <button type="button" onClick={() => setRole("customer")} className={`rounded-xl px-4 py-3 text-sm font-black ${role === "customer" ? "bg-[#071527] text-white" : "text-slate-600"}`}>Kunde</button>
            <button type="button" onClick={() => setRole("specialist")} className={`rounded-xl px-4 py-3 text-sm font-black ${role === "specialist" ? "bg-[#071527] text-white" : "text-slate-600"}`}>Specialist</button>
          </div>

          <label className="mt-5 grid gap-2 text-sm font-bold text-slate-700">Navn eller firmanavn<input value={name} onChange={(event) => setName(event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#3f8f83]" /></label>
          <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Email / brugernavn<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#3f8f83]" /></label>
          <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Adgangskode<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#3f8f83]" /><span className="text-xs font-medium text-slate-500">Mindst 8 tegn.</span></label>

          {error && <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-black text-rose-700">{error}</div>}

          <button disabled={loading} onClick={submit} className="mt-5 min-h-[48px] w-full rounded-full bg-[#071527] px-6 py-3 text-sm font-black text-white disabled:opacity-50">{loading ? "Opretter" : "Opret bruger"}</button>

          <p className="mt-4 text-center text-sm text-slate-500">Har du allerede en bruger? <Link href="/login" className="font-black text-[#071527]">Log ind</Link></p>
        </div>
      </section>
    </main>
  );
}
