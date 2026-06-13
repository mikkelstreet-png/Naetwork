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
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Login fejlede.");
      window.location.href = "/min-side";
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
        <Link href="/opret" className="rounded-full bg-[#071527] px-4 py-2 text-sm font-black text-white shadow-sm">
          Opret konto
        </Link>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 py-12 lg:grid-cols-[.9fr_1.1fr] lg:items-start lg:py-20">
        <div>
          <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Log ind</p>
          <h1 className="mt-4 text-5xl font-black leading-[.95] tracking-[-0.05em] text-[#071527] md:text-7xl">
            Log ind på Naetwork.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Fortsæt med dine opgaver, specialistprofil eller invitationer.
          </p>
          <div className="mt-8 rounded-[24px] border border-slate-200 bg-white p-5">
            <p className="text-sm font-black text-[#071527]">Ingen konto endnu?</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Opret dig gratis og beskriv dit behov. Naetwork analyserer det og hjælper dig videre.
            </p>
            <Link href="/opret" className="mt-3 inline-flex rounded-full bg-[#071527] px-5 py-2 text-sm font-black text-white">
              Opret konto
            </Link>
          </div>
        </div>

        <div className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          {/* Social logins — disabled */}
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="group relative">
              <button
                disabled
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-400 cursor-not-allowed"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Fortsæt med Google
              </button>
              <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-full bg-[#071527] px-3 py-1 text-xs font-black text-white opacity-0 transition group-hover:opacity-100 whitespace-nowrap">
                Kommer snart
              </span>
            </div>
            <div className="group relative">
              <button
                disabled
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-400 cursor-not-allowed"
              >
                <svg className="h-4 w-4 text-[#0077B5]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Fortsæt med LinkedIn
              </button>
              <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-full bg-[#071527] px-3 py-1 text-xs font-black text-white opacity-0 transition group-hover:opacity-100 whitespace-nowrap">
                Kommer snart
              </span>
            </div>
          </div>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-black text-slate-400">eller med email</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#3f8f83] focus:ring-2 focus:ring-[#3f8f83]/10"
              placeholder="din@email.dk"
            />
          </label>

          <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">
            Adgangskode
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#3f8f83] focus:ring-2 focus:ring-[#3f8f83]/10"
              placeholder="••••••••"
            />
          </label>

          <div className="mt-2 text-right">
            <Link href="/glemt-adgangskode" className="text-xs font-black text-slate-500 hover:text-[#071527]">
              Glemt adgangskode?
            </Link>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-black text-rose-700">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            onClick={submit}
            className="mt-5 min-h-[48px] w-full rounded-full bg-[#071527] px-6 py-3 text-sm font-black text-white disabled:opacity-50"
          >
            {loading ? "Logger ind…" : "Log ind"}
          </button>

          <p className="mt-5 text-center text-sm text-slate-500">
            Ingen konto?{" "}
            <Link href="/opret" className="font-black text-[#071527]">
              Opret dig gratis
            </Link>
          </p>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            Har du et gammelt opgavelink? Du kan stadig bruge{" "}
            <Link href="/access" className="font-black text-[#071527]">
              adgangssiden
            </Link>
            .
          </div>
        </div>
      </section>
    </main>
  );
}
