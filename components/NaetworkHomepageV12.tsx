'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

type Account = { email: string; name?: string | null; role: "customer" | "specialist" } | null;

const navItems = [
  { label: "Forside", href: "#forside" },
  { label: "Sådan virker det", href: "#saadan-virker-det" },
  { label: "Hvorfor Naetwork", href: "#hvorfor" },
  { label: "Opret opgave", href: "/opret-opgave" }
];

const steps = [
  ["01", "Beskriv dit behov", "Skriv problemet og ønsket resultat. Du behøver ikke kende løsningen eller specialisttypen."],
  ["02", "Naetwork gør opgaven klar", "Vi omsætter input til en tydelig brief med scope, leverancer, åbne spørgsmål og specialistretning."],
  ["03", "Bliv matchet rigtigt", "Når opgaven er klar nok, kan den vurderes og matches med specialister, der passer til behov og niveau."],
];

export function NaetworkHomepageV12() {
  const [account, setAccount] = useState<Account>(null);
  const [checked, setChecked] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch('/api/account/dashboard')
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (mounted) setAccount(data?.account || null); })
      .catch(() => null)
      .finally(() => mounted && setChecked(true));
    return () => { mounted = false; };
  }, []);

  return (
    <main id="forside" className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-5">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">N</span>
            <span className="min-w-0">
              <span className="block truncate text-lg font-black tracking-tight text-[#071527]">Naetwork</span>
              <span className="block truncate text-xs text-slate-500">Klar opgave. Rigtig specialist.</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => <Link key={item.label} href={item.href} className="rounded-full px-4 py-2 text-sm font-black text-slate-600 transition hover:bg-slate-100 hover:text-[#071527]">{item.label}</Link>)}
          </nav>

          <div className="hidden items-center gap-2 sm:flex">
            {checked && account ? <Link href="/min-side" className="rounded-full bg-[#071527] px-5 py-3 text-sm font-black text-white shadow-sm">Min profil</Link> : <><Link href="/login" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm">Min Naetwork konto</Link><Link href="/opret" className="rounded-full bg-[#071527] px-5 py-3 text-sm font-black text-white shadow-sm">Opret dig</Link></>}
          </div>

          <button type="button" onClick={() => setMobileOpen((value) => !value)} className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 lg:hidden">Menu</button>
        </div>
        {mobileOpen && <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden"><div className="mx-auto grid max-w-7xl gap-2">{navItems.map((item) => <Link key={item.label} onClick={() => setMobileOpen(false)} href={item.href} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-black text-slate-700">{item.label}</Link>)}</div></div>}
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-5 lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:py-24">
        <div>
          <div className="mb-6 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 shadow-sm">For digitale opgaver hvor specialistvalget betyder noget</div>
          <h1 className="max-w-5xl text-5xl font-black leading-[.93] tracking-[-0.06em] text-[#071527] md:text-7xl">Beskriv behovet. Få den rigtige specialist.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Naetwork gør et uklart behov til en konkret opgavebrief og hjælper dig videre mod de specialister, der faktisk passer til opgaven.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/opret-opgave" className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-[#071527] px-6 py-3 text-sm font-black text-white shadow-sm">Opret opgave</Link><Link href="#saadan-virker-det" className="inline-flex min-h-[50px] items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-black text-slate-800 shadow-sm">Se hvordan det virker</Link></div>
          <div className="mt-6 flex flex-wrap gap-2">{["AI-klar brief", "Specialistretning", "Naetwork review", "Mindre gætteri"].map((item) => <span key={item} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700">{item}</span>)}</div>
        </div>

        <div className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <p className="text-sm font-black uppercase tracking-[.2em] text-[#3f8f83]">Eksempel</p>
          <div className="mt-4 rounded-3xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">“Vi har for mange manuelle mails, Excel-ark og opfølgninger. Jeg tror noget kan automatiseres, men jeg ved ikke hvad vi skal bestille eller hvem vi skal bruge.”</div>
          <div className="mt-5 grid gap-3"><div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4"><p className="text-xs font-black uppercase tracking-[.14em] text-[#3f8f83]">Naetwork gør det klart</p><p className="mt-2 text-sm leading-6 text-slate-700">Opgaven bliver til et brief med scope, leverancer, åbne spørgsmål og næste skridt.</p></div><div className="rounded-2xl bg-[#071527] p-4 text-white"><p className="text-xs font-black uppercase tracking-[.14em] text-emerald-200">Specialistmatch</p><p className="mt-2 text-sm leading-6 text-white/75">Opgaven peger mod en automationsspecialist med erfaring i interne workflows — ikke bare en generisk udvikler.</p></div></div>
        </div>
      </section>

      <section id="saadan-virker-det" className="bg-white px-4 py-16 sm:px-5 lg:py-24">
        <div className="mx-auto max-w-7xl"><div className="max-w-3xl"><p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Sådan virker det</p><h2 className="mt-4 text-4xl font-black leading-[.95] tracking-[-0.05em] text-[#071527] md:text-6xl">Én enkel vej fra problem til match.</h2><p className="mt-5 text-lg leading-8 text-slate-600">Naetwork er bygget til dig, der ved at noget skal løses, men endnu ikke ved præcis hvad opgaven er eller hvem der bør løse den.</p></div><div className="mt-10 grid gap-4 lg:grid-cols-3">{steps.map(([number, title, text]) => <div key={number} className="rounded-[30px] border border-slate-200 bg-[#f7f8fb] p-6"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-xs font-black text-[#071527] ring-1 ring-slate-200">{number}</span><h3 className="mt-5 text-2xl font-black tracking-tight text-[#071527]">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{text}</p></div>)}</div></div>
      </section>

      <section id="hvorfor" className="border-t border-slate-200 bg-white px-4 py-16 sm:px-5 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-start"><div><p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Hvorfor Naetwork</p><h2 className="mt-4 text-4xl font-black leading-[.95] tracking-[-0.05em] text-[#071527] md:text-6xl">Før du vælger specialist, skal opgaven være forstået.</h2><p className="mt-5 text-lg leading-8 text-slate-600">Naetwork skaber klarhed først, så matchingen bagefter bliver mere præcis.</p></div><div className="grid gap-3 sm:grid-cols-2">{["Mindre forklaring frem og tilbage.", "Bedre brief til specialister.", "Tydeligere specialistretning.", "Mere kvalificeret næste skridt."].map((item) => <div key={item} className="rounded-2xl border border-slate-200 bg-[#f7f8fb] p-5 text-sm font-black leading-7 text-slate-700">{item}</div>)}</div></div>
      </section>
    </main>
  );
}
