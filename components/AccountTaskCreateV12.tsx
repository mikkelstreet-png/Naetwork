'use client';

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const categories = ["Ikke sikker endnu", "Automatisering", "MVP / webapp", "Hjemmeside / landing page", "Booking / kunderejse", "Dashboard / data", "AI i virksomheden"];

const specialistByCategory: Record<string, string> = {
  "Automatisering": "Automationsspecialist med erfaring i workflows, integrationer og manuelle processer",
  "MVP / webapp": "Full-stack product builder med erfaring i hurtige, brugbare første versioner",
  "Hjemmeside / landing page": "Webdesigner eller frontend-specialist med kommerciel forståelse",
  "Booking / kunderejse": "UX- og product specialist med erfaring i flows, formularer og konvertering",
  "Dashboard / data": "Data- og dashboard-specialist med fokus på overblik og beslutningsgrundlag",
  "AI i virksomheden": "AI-implementeringsspecialist med stærk procesforståelse",
  "Ikke sikker endnu": "Naetwork generalist til afklaring og valg af specialistretning"
};

type Phase = "form" | "generating" | "analysis" | "approved";
type Analysis = {
  title: string;
  ownWords: string;
  understoodNeed: string;
  businessEffect: string;
  proposedTask: string;
  scope: string[];
  notNow: string[];
  openQuestions: string[];
  specialist: string;
  nextStep: string;
};

function makeAnalysis(input: { category: string; need: string; current: string; outcome: string; context: string }): Analysis {
  const specialist = specialistByCategory[input.category] || specialistByCategory["Ikke sikker endnu"];
  const baseNeed = input.need.trim();
  const current = input.current.trim() || "Der er endnu ikke beskrevet en tydelig nuværende situation, og det bør afklares før opgaven sendes videre.";
  const outcome = input.outcome.trim() || "Det ønskede resultat skal gøres mere konkret, så en specialist kan vurdere løsning, indsats og leverance.";
  const context = input.context.trim() || "Der mangler stadig kontekst om brugere, systemer, budget, timing og interne begrænsninger.";

  return {
    title: input.category === "Ikke sikker endnu" ? "Analyse af digitalt behov" : `Analyse af behov: ${input.category}`,
    ownWords: baseNeed,
    understoodNeed: `Naetwork forstår behovet som en opgave, hvor den nuværende situation skal oversættes fra en løs forklaring til en tydelig leverance. Det centrale er ikke kun at finde en teknisk løsning, men først at forstå hvad der faktisk skaber friktion, hvem der påvirkes, og hvilken type specialist der kan løse opgaven rigtigt fra start. Nuværende situation: ${current}`,
    businessEffect: `Det ønskede resultat er: ${outcome} Den vigtigste effekt er derfor at skabe et bedre beslutningsgrundlag, så kunden ikke hyrer en specialist på gæt, men kan gå videre med en konkret brief, tydelig retning og færre åbne spørgsmål.`,
    proposedTask: `Opgaven bør i første omgang formuleres som en afklarings- og løsningsopgave. Første leverance bør være en konkret opgavebrief, et anbefalet scope, en prioriteret første version og en specialistretning. Kontekst: ${context}`,
    scope: ["Afklare den nuværende proces og de vigtigste smertepunkter", "Omsætte behovet til en konkret leverance og første version", "Udpege åbne spørgsmål, risici og nødvendige afgrænsninger", "Vurdere hvilken specialistprofil der passer bedst til opgaven"],
    notNow: ["At vælge leverandør før opgaven er forstået", "At bygge en stor løsning uden en klar første version", "At lave en tung kravspecifikation før behov og effekt er afklaret"],
    openQuestions: ["Hvem skal bruge løsningen i praksis?", "Hvilke systemer, data eller arbejdsgange skal indgå?", "Hvad er vigtigst: hastighed, kvalitet, pris eller skalerbarhed?", "Hvornår skal første brugbare version være klar?"],
    specialist,
    nextStep: "Godkend analysen til Naetwork review. Herefter kan opgaven vurderes og matches med relevante specialistprofiler."
  };
}

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen bg-[#f7f8fb] px-4 py-6 text-slate-950 sm:px-5"><header className="mx-auto flex max-w-6xl items-center justify-between py-3"><Link href="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">N</span><span className="text-lg font-black tracking-tight text-[#071527]">Naetwork</span></Link><Link href="/min-side" className="rounded-full bg-[#071527] px-4 py-2 text-sm font-black text-white shadow-sm">Min profil</Link></header>{children}</main>;
}

function LoginGate() {
  return <Shell><section className="mx-auto grid max-w-6xl gap-8 py-12 lg:grid-cols-[.85fr_1.15fr] lg:items-start lg:py-20"><div><p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Opret opgave</p><h1 className="mt-4 text-5xl font-black leading-[.95] tracking-[-0.05em] text-[#071527] md:text-7xl">Log ind for at få din analysebrief.</h1><p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Du kan se formatet her, men selve analysen skal knyttes til din Naetwork-konto, så opgaven kan gemmes, gennemgås og matches korrekt.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/login" className="rounded-full bg-[#071527] px-6 py-3 text-center text-sm font-black text-white">Log ind</Link><Link href="/opret" className="rounded-full border border-slate-300 bg-white px-6 py-3 text-center text-sm font-black text-slate-800">Opret konto</Link></div></div><div className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Eksempel på A4-analyse</p><div className="mt-5 rounded-[24px] border border-slate-200 bg-[#fbfbfd] p-6"><p className="text-xs font-black uppercase tracking-[.18em] text-slate-400">Personens egne ord</p><p className="mt-3 text-sm leading-7 text-slate-700">“Vi bruger for meget tid på manuelle mails og Excel. Jeg tror processen kan automatiseres, men jeg ved ikke hvad vi skal bygge eller hvem vi skal bruge.”</p><hr className="my-5 border-slate-200" /><p className="text-xs font-black uppercase tracking-[.18em] text-[#3f8f83]">Naetwork analyserer frem til</p><p className="mt-3 text-sm leading-7 text-slate-700">Behovet peger på en afklarings- og automationsopgave, hvor første skridt er at kortlægge workflowet og matche med en automationsspecialist.</p></div></div></section></Shell>;
}

function A4Report({ analysis }: { analysis: Analysis }) {
  return <article className="mx-auto min-h-[980px] w-full max-w-[760px] rounded-[18px] border border-slate-200 bg-white p-8 shadow-sm print:shadow-none"><div className="flex items-start justify-between gap-6 border-b border-slate-200 pb-6"><div><p className="text-xs font-black uppercase tracking-[.22em] text-[#3f8f83]">Naetwork analysebrief</p><h2 className="mt-3 text-3xl font-black tracking-tight text-[#071527]">{analysis.title}</h2></div><div className="text-right text-xs font-bold text-slate-400">A4 preview<br />Klar til review</div></div><section className="mt-7"><h3 className="text-sm font-black uppercase tracking-[.18em] text-slate-400">1. Dine egne ord</h3><p className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">{analysis.ownWords}</p></section><section className="mt-7"><h3 className="text-sm font-black uppercase tracking-[.18em] text-slate-400">2. Det Naetwork forstår</h3><p className="mt-3 text-sm leading-7 text-slate-700">{analysis.understoodNeed}</p></section><section className="mt-7"><h3 className="text-sm font-black uppercase tracking-[.18em] text-slate-400">3. Behov og ønsket effekt</h3><p className="mt-3 text-sm leading-7 text-slate-700">{analysis.businessEffect}</p></section><section className="mt-7"><h3 className="text-sm font-black uppercase tracking-[.18em] text-slate-400">4. Anbefalet opgave</h3><p className="mt-3 text-sm leading-7 text-slate-700">{analysis.proposedTask}</p></section><div className="mt-7 grid gap-5 md:grid-cols-2"><section><h3 className="text-sm font-black uppercase tracking-[.18em] text-slate-400">Scope</h3><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">{analysis.scope.map((item) => <li key={item}>• {item}</li>)}</ul></section><section><h3 className="text-sm font-black uppercase tracking-[.18em] text-slate-400">Ikke nu</h3><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">{analysis.notNow.map((item) => <li key={item}>• {item}</li>)}</ul></section></div><section className="mt-7"><h3 className="text-sm font-black uppercase tracking-[.18em] text-slate-400">Åbne spørgsmål</h3><ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-700 md:grid-cols-2">{analysis.openQuestions.map((item) => <li key={item} className="rounded-2xl bg-slate-50 p-3">{item}</li>)}</ul></section><section className="mt-7 rounded-3xl bg-[#071527] p-5 text-white"><h3 className="text-xs font-black uppercase tracking-[.18em] text-emerald-200">Anbefalet specialistretning</h3><p className="mt-3 text-lg font-black">{analysis.specialist}</p><p className="mt-3 text-sm leading-7 text-white/75">{analysis.nextStep}</p></section></article>;
}

export function AccountTaskCreateV12() {
  const [checked, setChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [phase, setPhase] = useState<Phase>("form");
  const [category, setCategory] = useState(categories[0]);
  const [need, setNeed] = useState("");
  const [current, setCurrent] = useState("");
  const [outcome, setOutcome] = useState("");
  const [context, setContext] = useState("");
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const specialist = useMemo(() => specialistByCategory[category] || specialistByCategory["Ikke sikker endnu"], [category]);

  useEffect(() => { fetch("/api/account/dashboard").then((r) => setLoggedIn(r.ok)).catch(() => setLoggedIn(false)).finally(() => setChecked(true)); }, []);

  function generate() {
    if (need.trim().length < 20) { setError("Skriv lidt mere med dine egne ord, så analysen bliver brugbar."); return; }
    setError(""); setPhase("generating");
    window.setTimeout(() => { setAnalysis(makeAnalysis({ category, need, current, outcome, context })); setPhase("analysis"); }, 1200);
  }

  if (!checked) return <Shell><div className="mx-auto mt-12 max-w-3xl rounded-3xl bg-white p-6 text-sm font-black text-slate-600 shadow-sm">Tjekker konto…</div></Shell>;
  if (!loggedIn) return <LoginGate />;

  return <Shell><section className="mx-auto grid max-w-6xl gap-8 py-12 lg:grid-cols-[.82fr_1.18fr] lg:items-start lg:py-20"><div><p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Opret opgave</p><h1 className="mt-4 text-5xl font-black leading-[.95] tracking-[-0.05em] text-[#071527] md:text-7xl">Få en komplet analyse af dit behov.</h1><p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Skriv med dine egne ord. Naetwork samler det i en A4-lignende analysebrief, så du kan se hvad behovet er, hvad der bør laves, og hvilken specialistretning der passer.</p><div className="mt-6 rounded-3xl bg-[#071527] p-5 text-white"><p className="text-xs font-black uppercase tracking-[.18em] text-emerald-200">Anbefalet retning lige nu</p><p className="mt-2 text-sm leading-7 text-white/75">{specialist}</p></div></div>{phase === "form" && <div className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><label className="grid gap-2 text-sm font-bold text-slate-700">Opgavetype<select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none">{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Hvad vil du have hjælp til?<textarea value={need} onChange={(e) => setNeed(e.target.value)} rows={5} className="resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none" placeholder="Skriv præcis som du ville forklare det til en kollega." /></label><label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Hvad sker der i dag?<textarea value={current} onChange={(e) => setCurrent(e.target.value)} rows={3} className="resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none" /></label><label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Hvad skal være anderledes bagefter?<textarea value={outcome} onChange={(e) => setOutcome(e.target.value)} rows={3} className="resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none" /></label><label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Kontekst, systemer, timing eller begrænsninger<textarea value={context} onChange={(e) => setContext(e.target.value)} rows={3} className="resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none" /></label>{error && <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-black text-rose-700">{error}</div>}<button onClick={generate} className="mt-5 min-h-[50px] w-full rounded-full bg-[#071527] px-6 py-3 text-sm font-black text-white">Generér A4-analysebrief</button></div>}{phase === "generating" && <div className="rounded-[34px] border border-slate-200 bg-white p-8 text-center shadow-sm"><p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Naetwork analyserer</p><h2 className="mt-4 text-4xl font-black tracking-tight text-[#071527]">Omsætter dine ord til en klar opgave.</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600">Vi samler behov, effekt, scope, åbne spørgsmål og specialistretning i én samlet analyse.</p></div>}{phase === "analysis" && analysis && <div className="grid gap-5"><A4Report analysis={analysis} /><div className="flex flex-col gap-3 sm:flex-row"><button onClick={() => window.print()} className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-black text-slate-800">Print / gem som PDF</button><button onClick={() => setPhase("approved")} className="rounded-full bg-[#071527] px-6 py-3 text-sm font-black text-white">Godkend til Naetwork review</button><button onClick={() => setPhase("form")} className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-black text-slate-800">Ret input</button></div></div>}{phase === "approved" && <div className="rounded-[34px] border border-slate-200 bg-white p-8 text-center shadow-sm"><p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Godkendt</p><h2 className="mt-4 text-4xl font-black tracking-tight text-[#071527]">Analysen er klar til Naetwork review.</h2><p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-600">Næste skridt er, at opgaven vurderes og kan matches med relevante specialistprofiler.</p><Link href="/min-side" className="mt-7 inline-flex rounded-full bg-[#071527] px-6 py-3 text-sm font-black text-white">Gå til min profil</Link></div>}</section></Shell>;
}
