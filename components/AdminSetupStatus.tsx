'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

type EnvItem = { name: string; ok: boolean; valuePreview: string };
type TableItem = { table: string; ok: boolean; error: string };
type SetupStatus = {
  summary: {
    envOk: boolean;
    databaseOk: boolean;
    emailConfigured: boolean;
    readyForEndToEndTest: boolean;
  };
  env: EnvItem[];
  tables: TableItem[];
  nextActions: string[];
};

function Badge({ ok }: { ok: boolean }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-black ${ok ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"}`}>{ok ? "OK" : "Mangler"}</span>;
}

export function AdminSetupStatus() {
  const [data, setData] = useState<SetupStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/setup/status");
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Setup-status kunne ikke hentes.");
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Setup-status kunne ikke hentes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <main className="min-h-screen bg-[#f7f8fb] px-4 py-6 text-slate-950 sm:px-5">
      <header className="mx-auto flex max-w-6xl items-center justify-between py-3">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">N</span>
          <span className="text-lg font-black tracking-tight text-[#071527]">Admin setup</span>
        </Link>
        <div className="flex gap-2">
          <button onClick={load} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">Opdater</button>
          <Link href="/admin" className="rounded-full bg-[#071527] px-4 py-2 text-sm font-black text-white shadow-sm">Til admin</Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl py-10">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Go-live validation</p>
          <h1 className="mt-4 text-5xl font-black leading-[.95] tracking-[-0.05em] text-[#071527] md:text-7xl">Er Naetwork klar?</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">Denne side viser, om miljøvariabler, database og email-konfiguration er klar til end-to-end test.</p>
        </div>

        {loading && <div className="mt-8 rounded-3xl bg-white p-6 text-sm font-black text-slate-600 shadow-sm">Tjekker setup…</div>}
        {error && <div className="mt-8 rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm font-black text-rose-700 shadow-sm">{error}</div>}

        {data && !loading && !error && (
          <>
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              <div className="rounded-3xl bg-white p-5 shadow-sm"><p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Miljø</p><p className="mt-3 text-3xl font-black text-[#071527]">{data.summary.envOk ? "OK" : "Mangler"}</p></div>
              <div className="rounded-3xl bg-white p-5 shadow-sm"><p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Database</p><p className="mt-3 text-3xl font-black text-[#071527]">{data.summary.databaseOk ? "OK" : "Mangler"}</p></div>
              <div className="rounded-3xl bg-white p-5 shadow-sm"><p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Email</p><p className="mt-3 text-3xl font-black text-[#071527]">{data.summary.emailConfigured ? "OK" : "Mangler"}</p></div>
              <div className="rounded-3xl bg-white p-5 shadow-sm"><p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">E2E-test</p><p className="mt-3 text-3xl font-black text-[#071527]">{data.summary.readyForEndToEndTest ? "Klar" : "Ikke klar"}</p></div>
            </div>

            {data.nextActions.length > 0 && (
              <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
                <p className="font-black text-amber-950">Næste handlinger</p>
                <div className="mt-3 grid gap-2">{data.nextActions.map((item) => <p key={item} className="text-sm leading-6 text-amber-900">• {item}</p>)}</div>
              </div>
            )}

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
                <p className="font-black text-[#071527]">Miljøvariabler</p>
                <div className="mt-4 grid gap-2">{data.env.map((item) => <div key={item.name} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3"><span className="text-sm font-bold text-slate-700">{item.name}</span><Badge ok={item.ok} /></div>)}</div>
              </div>
              <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
                <p className="font-black text-[#071527]">Supabase-tabeller</p>
                <div className="mt-4 grid gap-2">{data.tables.map((item) => <div key={item.table} className="rounded-2xl bg-slate-50 p-3"><div className="flex items-center justify-between gap-3"><span className="text-sm font-bold text-slate-700">{item.table}</span><Badge ok={item.ok} /></div>{!item.ok && item.error && <p className="mt-2 text-xs leading-5 text-rose-700">{item.error}</p>}</div>)}</div>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
