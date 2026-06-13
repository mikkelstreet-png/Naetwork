'use client';

import Link from "next/link";
import { useMemo, useState } from "react";

const categories = [
  "Ikke sikker endnu",
  "Hjemmeside / landing page",
  "Booking / kunderejse",
  "Automatisering",
  "Dashboard / data",
  "AI i virksomheden",
  "MVP / webapp",
  "Salg / pitch"
];

const generationSteps = [
  ["Analyserer behov", "Vi finder problemet, ønsket resultat og de vigtigste uklarheder."],
  ["Finder opgavetype", "Naetwork vurderer om opgaven peger mod web, automation, AI, data eller produkt."],
  ["Udarbejder scope", "Vi omsætter input til leverancer, afgrænsning og første version af briefen."],
  ["Foreslår specialistretning", "Vi beskriver hvilken type specialist der sandsynligvis passer bedst."],
  ["Finder åbne spørgsmål", "Vi fremhæver de ting, der skal afklares før en specialist kan give et godt tilbud."],
  ["Gør opgaven klar", "Briefen samles, så den kan vurderes og matches med relevante specialister."],
];

const specialistByCategory: Record<string, string> = {
  "Hjemmeside / landing page": "Webdesigner / frontend-specialist med kommerciel sans",
  "Booking / kunderejse": "UX- og product specialist med erfaring i bookingflows",
  "Automatisering": "Automationsspecialist med erfaring i workflows, integrationer og no-code",
  "Dashboard / data": "Data- og dashboard-specialist med fokus på beslutningsgrundlag",
  "AI i virksomheden": "AI-implementeringsspecialist med stærk procesforståelse",
  "MVP / webapp": "Full-stack product builder med erfaring i hurtige MVP'er",
  "Salg / pitch": "Commercial designer / pitch-specialist",
  "Ikke sikker endnu": "Naetwork generalist til første afklaring og specialistretning"
};

type Phase = "form" | "generating" | "brief" | "approved";

function createBrief(input: {
  category: string;
  need: string;
  situation: string;
  outcome: string;
  audience: string;
  budget: string;
  deadline: string;
}) {
  const specialist = specialistByCategory[input.category] || specialistByCategory["Ikke sikker endnu"];
  return `Opgavebrief\n\nFormål\n${input.need || "Kunden har et behov, der skal gøres konkret, før den rette specialist kan vælges."}\n\nNuværende situation\n${input.situation || "Der mangler en klar beskrivelse af nuværende proces, smertepunkter og begrænsninger."}\n\nØnsket resultat\n${input.outcome || "Et tydeligt resultat, der kan vurderes af relevante specialister og omsættes til en konkret løsning."}\n\nAnbefalet opgavetype\n${input.category}\n\nAnbefalet specialistretning\n${specialist}\n\nMuligt scope\n- Afklare behov, brugere og ønsket forretningsværdi\n- Udarbejde løsningsforslag eller MVP-retning\n- Definere konkret leverance, tidslinje og næste skridt\n- Matche opgaven med relevante specialister gennem Naetwork\n\nIkke-scope i første omgang\n- Større teknisk implementering uden afklaring\n- Lange kravspecifikationer uden prioritering\n- Specialistvalg uden tydeligt beslutningsgrundlag\n\nÅbne spørgsmål\n- Hvad er den vigtigste effekt af løsningen?\n- Hvem skal bruge løsningen i praksis?\n- Hvilke systemer, data eller arbejdsgange skal indgå?\n- Hvad er vigtigst: hastighed, kvalitet, pris eller skalerbarhed?\n\nRamme\nMålgruppe: ${input.audience || "Ikke angivet endnu"}\nBudget: ${input.budget || "Ikke angivet endnu"}\nDeadline: ${input.deadline || "Ikke angivet endnu"}\n\nNæste skridt\nNaetwork bør gennemgå briefen og vurdere 2-3 relevante specialistprofiler, før opgaven deles videre.`;
}

export function AccountTaskCreateV11() {
  const [phase, setPhase] = useState<Phase>("form");
  const [category, setCategory] = useState(categories[0]);
  const [need, setNeed] = useState("");
  const [situation, setSituation] = useState("");
  const [outcome, setOutcome] = useState("");
  const [audience, setAudience] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [brief, setBrief] = useState("");

  const recommendedSpecialist = useMemo(() => specialistByCategory[category] || specialistByCategory["Ikke sikker endnu"], [category]);

  function generate() {
    if (need.trim().length < 15) {
      setError("Skriv lidt mere om, hvad du vil have hjælp til. Det gør specialistmatchet bedre.");
      return;
    }

    setError("");
    setPhase("generating");
    setCurrentStep(0);

    let step = 0;
    const timer = window.setInterval(() => {
      step += 1;
      if (step >= generationSteps.length) {
        window.clearInterval(timer);
        setBrief(createBrief({ category, need, situation, outcome, audience, budget, deadline }));
        setPhase("brief");
        return;
      }
      setCurrentStep(step);
    }, 650);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e8f4ef_0,#f7f8fb_38%,#f7f8fb_100%)] px-4 py-6 text-slate-950 sm:px-5">
      <header className="mx-auto flex max-w-6xl items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">N</span><span className="text-lg font-black tracking-tight text-[#071527]">Naetwork</span></Link>
        <Link href="/min-side" className="rounded-full bg-[#071527] px-4 py-2 text-sm font-black text-white shadow-sm">Min profil</Link>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 py-12 lg:grid-cols-[.86fr_1.14fr] lg:items-start lg:py-20">
        <div>
          <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Opret opgave</p>
          <h1 className="mt-4 text-5xl font-black leading-[.95] tracking-[-0.05em] text-[#071527] md:text-7xl">Beskriv behovet. Få opgaven klar til den rigtige specialist.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Sprint 12A bruger et mock AI-flow uden Supabase og Resend. Oplevelsen viser, hvordan Naetwork gør en uklar opgave til en specialistklar brief og anbefaler den rette specialistretning.</p>
          <div className="mt-6 grid gap-3">
            {["AI-genereret brief", "Specialistretning", "Naetwork review", "Klar til senere backend"].map((item) => <div key={item} className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-black text-slate-700 shadow-sm">{item}</div>)}
          </div>
        </div>

        {phase === "form" && (
          <div className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5 rounded-3xl bg-[#071527] p-5 text-white">
              <p className="text-xs font-black uppercase tracking-[.18em] text-emerald-200">Naetwork AI scope engine</p>
              <p className="mt-2 text-sm leading-6 text-white/75">Udfyld kort. Naetwork laver derefter en første brief og foreslår hvilken specialisttype, opgaven bør matches med.</p>
            </div>
            <label className="grid gap-2 text-sm font-bold text-slate-700">Opgavetype<select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none">{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Hvad vil du have hjælp til?<textarea value={need} onChange={(event) => setNeed(event.target.value)} rows={4} placeholder="Eksempel: Vi bruger for meget tid på manuelle mails og Excel. Jeg tror processen kan automatiseres, men ved ikke hvad vi skal bygge eller hvem vi skal bruge." className="resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none" /></label>
            <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Hvad fungerer ikke i dag?<textarea value={situation} onChange={(event) => setSituation(event.target.value)} rows={3} className="resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none" /></label>
            <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Hvad skal være anderledes bagefter?<textarea value={outcome} onChange={(event) => setOutcome(event.target.value)} rows={3} className="resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none" /></label>
            <div className="mt-4 grid gap-3 sm:grid-cols-3"><input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Målgruppe" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none" /><input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Budget" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none" /><input value={deadline} onChange={(e) => setDeadline(e.target.value)} placeholder="Deadline" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none" /></div>
            {error && <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-black text-rose-700">{error}</div>}
            <button onClick={generate} className="mt-5 min-h-[50px] w-full rounded-full bg-[#071527] px-6 py-3 text-sm font-black text-white">Generér brief og specialistmatch</button>
          </div>
        )}

        {phase === "generating" && (
          <div className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">AI arbejder</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#071527]">Gør opgaven klar til specialistmatch</h2>
            <div className="mt-7 grid gap-3">
              {generationSteps.map(([title, text], index) => {
                const done = index < currentStep;
                const active = index === currentStep;
                return <div key={title} className={`rounded-2xl border p-4 ${active ? "border-[#3f8f83] bg-emerald-50" : done ? "border-slate-200 bg-slate-50" : "border-slate-200 bg-white"}`}><div className="flex items-start gap-3"><span className={`mt-1 h-3 w-3 rounded-full ${done || active ? "bg-[#3f8f83]" : "bg-slate-200"}`} /><div><p className="text-sm font-black text-[#071527]">{title}</p><p className="mt-1 text-sm leading-6 text-slate-600">{text}</p></div></div></div>;
              })}
            </div>
          </div>
        )}

        {phase === "brief" && (
          <div className="grid gap-5">
            <div className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Første brief</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#071527]">Opgaven er klarere — og kan matches bedre.</h2>
              <textarea value={brief} onChange={(event) => setBrief(event.target.value)} rows={18} className="mt-5 w-full resize-none rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-7 outline-none" />
              <div className="mt-5 flex flex-col gap-3 sm:flex-row"><button onClick={() => setPhase("approved")} className="min-h-[48px] rounded-full bg-[#071527] px-6 py-3 text-sm font-black text-white">Godkend til Naetwork review</button><button onClick={() => setPhase("form")} className="min-h-[48px] rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-black text-slate-800">Ret input</button></div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {[recommendedSpecialist, "Naetwork review før deling", "2-3 relevante specialistprofiler"].map((item) => <div key={item} className="rounded-3xl border border-slate-200 bg-white p-5 text-sm font-black leading-7 text-[#071527] shadow-sm">{item}</div>)}
            </div>
          </div>
        )}

        {phase === "approved" && (
          <div className="rounded-[34px] border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Godkendt</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-[#071527]">Briefen er klar til Naetwork review.</h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-600">I den rigtige version gemmes briefen på din profil, sendes til admin og kan matches med relevante specialister. I Sprint 12A er flowet mock uden Supabase og Resend.</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><button onClick={() => setPhase("brief")} className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-black text-slate-800">Tilbage til brief</button><Link href="/" className="rounded-full bg-[#071527] px-6 py-3 text-sm font-black text-white">Til forsiden</Link></div>
          </div>
        )}
      </section>
    </main>
  );
}
