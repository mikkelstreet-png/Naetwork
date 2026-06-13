'use client';

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Briefcase, Users } from "lucide-react";

type Role = "customer" | "specialist";
type Phase = "form" | "done";

export function AccountRegister() {
  const [phase, setPhase] = useState<Phase>("form");
  const [role, setRole] = useState<Role>("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!terms) { setError("Du skal acceptere vilkårene for at fortsætte."); return; }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/account/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Brugeren kunne ikke oprettes.");
      setPhase("done");
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
        <Link href="/login" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">
          Log ind
        </Link>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 py-12 lg:grid-cols-[.9fr_1.1fr] lg:items-start lg:py-20">
        <div>
          <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Opret konto</p>
          <h1 className="mt-4 text-5xl font-black leading-[.95] tracking-[-0.05em] text-[#071527] md:text-7xl">
            Kom i gang på under to minutter.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Opret en gratis konto og få adgang til Naetwork — som kunde med et behov eller som specialist med en profil.
          </p>
          <div className="mt-7 grid gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-black text-[#071527]">Som kunde</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Opret opgaver, modtag analysebrief og følg matchingprocessen.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-black text-[#071527]">Som specialist</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Opret din profil og bliv inviteret til relevante opgaver.
              </p>
            </div>
          </div>
        </div>

        {phase === "form" ? (
          <div className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            {/* Role toggle */}
            <p className="text-sm font-black text-slate-700">Hvad beskriver dig bedst?</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-sm font-black transition ${
                  role === "customer"
                    ? "border-[#071527] bg-[#071527] text-white"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                }`}
              >
                <Users className="h-5 w-5" />
                Jeg har en opgave
              </button>
              <button
                type="button"
                onClick={() => setRole("specialist")}
                className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-sm font-black transition ${
                  role === "specialist"
                    ? "border-[#071527] bg-[#071527] text-white"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                }`}
              >
                <Briefcase className="h-5 w-5" />
                Jeg er specialist
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                {role === "specialist" ? "Navn" : "Navn eller firmanavn"}
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#3f8f83] focus:ring-2 focus:ring-[#3f8f83]/10"
                  placeholder={role === "specialist" ? "Dit fulde navn" : "Dit navn eller firmanavn"}
                />
              </label>

              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#3f8f83] focus:ring-2 focus:ring-[#3f8f83]/10"
                  placeholder="din@email.dk"
                />
              </label>

              {role === "customer" && (
                <label className="grid gap-2 text-sm font-bold text-slate-700">
                  Virksomhed <span className="font-medium text-slate-400">(valgfrit)</span>
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#3f8f83] focus:ring-2 focus:ring-[#3f8f83]/10"
                    placeholder="Dit firmanavn"
                  />
                </label>
              )}

              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Adgangskode
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#3f8f83] focus:ring-2 focus:ring-[#3f8f83]/10"
                  placeholder="••••••••"
                />
                <span className="text-xs font-medium text-slate-500">Mindst 8 tegn.</span>
              </label>
            </div>

            <label className="mt-5 flex items-start gap-3 cursor-pointer">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 accent-[#071527]"
                />
              </div>
              <span className="text-sm leading-6 text-slate-600">
                Jeg accepterer Naetworks{" "}
                <Link href="/privatliv" className="font-black text-[#071527] underline underline-offset-2">
                  vilkår og privatlivspolitik
                </Link>
              </span>
            </label>

            {error && (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-black text-rose-700">
                {error}
              </div>
            )}

            <button
              disabled={loading || !name || !email || !password}
              onClick={submit}
              className="mt-5 min-h-[48px] w-full rounded-full bg-[#071527] px-6 py-3 text-sm font-black text-white disabled:opacity-50"
            >
              {loading ? "Opretter konto…" : "Opret konto"}
            </button>

            <p className="mt-4 text-center text-sm text-slate-500">
              Har du allerede en bruger?{" "}
              <Link href="/login" className="font-black text-[#071527]">
                Log ind
              </Link>
            </p>
          </div>
        ) : (
          /* Confirmation */
          <div className="rounded-[34px] border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white shadow-sm ring-1 ring-emerald-200">
              <CheckCircle2 className="h-8 w-8 text-[#3f8f83]" />
            </div>
            <h2 className="mt-6 text-3xl font-black text-[#071527]">Tjek din email</h2>
            <p className="mx-auto mt-4 max-w-sm text-base leading-7 text-slate-600">
              Vi har sendt en bekræftelseslink til <strong>{email}</strong>. Klik på linket for at aktivere din konto.
            </p>
            <div className="mt-7 grid gap-3">
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center rounded-full bg-[#071527] px-6 py-3 text-sm font-black text-white"
              >
                Gå til login
              </Link>
              <Link
                href="/"
                className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-black text-slate-700"
              >
                Tilbage til forsiden
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
