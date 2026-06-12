'use client';

import { type ReactNode, useMemo, useState } from "react";

type View = "home" | "brief" | "matches" | "project" | "provider" | "platform";
type Category = "Jeg er ikke sikker" | "Hjemmeside" | "Webapp / MVP" | "Dashboard" | "Automation" | "Pitch deck";

type Intake = {
  category: Category;
  need: string;
  audience: string;
  budget: string;
  deadline: string;
};

const initialNeed = "Jeg skal bruge en simpel hjemmeside eller platform til min virksomhed, men jeg er usikker på scope, pris og hvilken specialist jeg skal vælge.";

const initialIntake: Intake = {
  category: "Jeg er ikke sikker",
  need: initialNeed,
  audience: "Små virksomheder, founders og private med digitale opgaver.",
  budget: "Afklares",
  deadline: "Afklares"
};

const categoryConfig: Record<Category, { title: string; specialist: string; budget: string; tags: string[]; scope: string[]; questions: string[] }> = {
  "Jeg er ikke sikker": {
    title: "Digital opgave gjort konkret før du hyrer nogen",
    specialist: "Digital product specialist / full-stack generalist",
    budget: "Afklares efter scope",
    tags: ["Behovsafklaring", "Projektbrief", "Scope", "Specialist-match", "MVP"],
    scope: ["Afklaring af opgavetype og ønsket resultat", "Klar projektbrief med første version", "Fravalg og grænser for scope", "Anbefalet specialisttype", "Match-tags til relevante providers"],
    questions: ["Hvad skal brugeren kunne gøre, når opgaven er løst?", "Er det vigtigst at spare tid, få flere leads eller skabe overblik?", "Hvad skal være med i første version — og hvad kan vente?"]
  },
  Hjemmeside: {
    title: "Professionel hjemmeside med tydeligt kontaktflow",
    specialist: "Webdesigner / no-code eller frontend specialist",
    budget: "10.000-35.000 kr.",
    tags: ["Webdesign", "Kontaktformular", "SEO", "CMS", "Mobil"],
    scope: ["Forside og 3-5 undersider", "Kontaktformular og bookinglink", "Responsivt design", "Basal SEO og performance", "Kort handover og redigeringsguide"],
    questions: ["Skal siden kunne redigeres af jer selv?", "Har I eksisterende brand, billeder og tekst?", "Hvad er vigtigste konvertering: opkald, booking eller formular?"]
  },
  "Webapp / MVP": {
    title: "Afgrænset webapp/MVP med klart kerneflow",
    specialist: "Full-stack developer / product builder",
    budget: "25.000-75.000 kr.",
    tags: ["Webapp", "MVP", "Frontend", "Backend", "Vercel"],
    scope: ["Landing page og intake-flow", "Brief preview", "Provider match preview", "Projektstatus og tilbudsflow", "Deploy-klar første version"],
    questions: ["Hvad er det vigtigste kerneflow?", "Skal brugere kunne logge ind i første version?", "Hvilken handling skal brugeren kunne gennemføre uden hjælp?"]
  },
  Dashboard: {
    title: "Overskueligt dashboard med centrale KPI’er",
    specialist: "Data / BI specialist",
    budget: "15.000-50.000 kr.",
    tags: ["Dashboard", "Excel", "KPI", "Rapportering", "Data"],
    scope: ["Datakilder og oprydning", "5-7 centrale KPI’er", "Ledelsesvenlig visning", "Månedlig opdateringslogik", "Dokumenteret handover"],
    questions: ["Hvor ligger data i dag?", "Hvilke KPI’er træffes der beslutninger på?", "Skal dashboardet opdateres manuelt eller automatisk?"]
  },
  Automation: {
    title: "Automation der fjerner manuelt dobbeltarbejde",
    specialist: "Automation specialist / Make eller Zapier builder",
    budget: "10.000-40.000 kr.",
    tags: ["Automation", "Make", "Zapier", "Sheets", "Workflow"],
    scope: ["Trigger og datakilde", "Automatisk logning", "Fejlhåndtering", "Notifikationer", "Test og dokumentation"],
    questions: ["Hvad starter flowet?", "Hvor skal data ende?", "Hvad sker der, hvis automationen fejler?"]
  },
  "Pitch deck": {
    title: "Pitch deck med klar fortælling og premium design",
    specialist: "Presentation designer / strategy consultant",
    budget: "8.000-30.000 kr.",
    tags: ["Pitch deck", "Storyline", "Design", "Investor", "Slides"],
    scope: ["Narrativ og storyline", "Slide-struktur", "Designretning", "Finpudsning af key slides", "Eksportklar præsentation"],
    questions: ["Hvem er modtageren?", "Hvilken beslutning skal decket drive?", "Har I tal og traction klar?"]
  }
};

const providers = [
  { name: "North Studio", type: "Webapp & MVP", score: 96, price: "38.000 kr.", time: "5 uger", tags: ["Next.js", "Vercel", "UX", "MVP"], note: "Stærk match på MVP, premium frontend og hurtigt demo-flow." },
  { name: "Flow Builders", type: "Automation & tools", score: 91, price: "29.000 kr.", time: "3 uger", tags: ["Make", "Sheets", "Admin", "Workflow"], note: "God til strukturerede interne værktøjer og simple workflows." },
  { name: "Copenhagen Digital", type: "Design & launch", score: 87, price: "45.000 kr.", time: "6 uger", tags: ["Brand", "Landing", "UI", "Launch"], note: "Stærk visuel eksekvering og launch-klar polish." }
];

const beforeAfter = [
  ["Før Naetwork", "Jeg ved ikke, hvad jeg skal bede om", "Tilbud bliver svære at sammenligne", "Jeg risikerer at vælge forkert specialist"],
  ["Med Naetwork", "Mit behov bliver gjort konkret", "Jeg får et klart scope og acceptkriterier", "Jeg kan vælge mellem få relevante matches"]
];

const useCases: Category[] = ["Hjemmeside", "Webapp / MVP", "Dashboard", "Automation", "Pitch deck"];

const platformStats = [
  { label: "Aktive briefs", value: "18" },
  { label: "Provider pool", value: "42" },
  { label: "Pipeline value", value: "842k" },
  { label: "Est. fee", value: "101k" }
];

function cx(...classes: Array<string | false | undefined>) { return classes.filter(Boolean).join(" "); }

function Panel({ children, dark = false, className = "" }: { children: ReactNode; dark?: boolean; className?: string }) {
  return <div className={cx("rounded-[30px] border p-6 shadow-sm", dark ? "border-slate-800 bg-[#071527] text-white" : "border-slate-200 bg-white text-slate-950", className)}>{children}</div>;
}

function Button({ children, onClick, secondary = false, className = "" }: { children: ReactNode; onClick?: () => void; secondary?: boolean; className?: string }) {
  return <button onClick={onClick} className={cx("rounded-full px-6 py-3 text-sm font-black transition hover:-translate-y-0.5", secondary ? "border border-slate-300 bg-white text-slate-800" : "bg-[#071527] text-white shadow-lg shadow-slate-900/10", className)}>{children}</button>;
}

function Eyebrow({ children }: { children: ReactNode }) { return <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">{children}</p>; }
function Badge({ children, dark = false }: { children: ReactNode; dark?: boolean }) { return <span className={cx("inline-flex h-9 w-fit shrink-0 items-center rounded-full px-4 text-xs font-black", dark ? "bg-white/10 text-white ring-1 ring-white/10" : "border border-slate-200 bg-white text-slate-700")}>{children}</span>; }
function Stat({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">{label}</p><p className="mt-2 text-2xl font-black tracking-tight text-[#071527]">{value}</p></div>; }

export function NaetworkLaunchMvp() {
  const [view, setView] = useState<View>("home");
  const [menu, setMenu] = useState(false);
  const [intake, setIntake] = useState<Intake>(initialIntake);
  const [selectedProvider, setSelectedProvider] = useState(providers[0]);

  const config = categoryConfig[intake.category];
  const brief = useMemo(() => ({
    title: config.title,
    category: intake.category,
    specialist: config.specialist,
    budget: intake.budget === "Afklares" ? config.budget : intake.budget,
    deadline: intake.deadline,
    tags: config.tags,
    scope: config.scope,
    questions: config.questions,
    summary: "Naetwork bruger AI til at gøre behovet konkret: scope, fravalg, acceptkriterier og hvilken type specialist der passer. Derefter kan matches og tilbud sammenlignes struktureret.",
    notIncluded: ["Ubegrænsede revisionsrunder", "Betalingsintegration uden særskilt scope", "Løbende drift og support uden særskilt aftale"],
    acceptance: ["Kerneflow virker på desktop og mobil", "Leverancen matcher godkendt brief", "Provider afleverer kort handover", "Kunde kan godkende eller samle én feedbackrunde"]
  }), [config, intake.category, intake.budget, intake.deadline]);

  const open = (target: View) => { setView(target); setMenu(false); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); };
  const nav = (target: View, label: string) => <button onClick={() => open(target)} className={cx("rounded-full px-4 py-2 text-sm font-bold transition", view === target ? "bg-[#071527] text-white" : "text-slate-600 hover:bg-slate-100")}>{label}</button>;

  return <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
        <button onClick={() => open("home")} className="flex items-center gap-3 text-left"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">N</span><span><span className="block text-lg font-black tracking-tight">Naetwork</span><span className="block text-xs text-slate-500">Få klarhed før du hyrer</span></span></button>
        <nav className="hidden items-center gap-2 lg:flex">{nav("home", "Forside")}{nav("brief", "Brief")}{nav("matches", "Matches")}{nav("provider", "For specialister")}{nav("platform", "Platform")}</nav>
        <div className="hidden gap-2 md:flex"><Button secondary onClick={() => open("matches")}>Se eksempel</Button><Button onClick={() => open("brief")}>Få gratis projektbrief</Button></div>
        <button onClick={() => setMenu(!menu)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-black lg:hidden">Menu</button>
      </div>
      {menu && <div className="border-t border-slate-200 bg-white px-5 py-4 lg:hidden"><div className="grid gap-2">{nav("home", "Forside")}{nav("brief", "Brief")}{nav("matches", "Matches")}{nav("provider", "For specialister")}{nav("platform", "Platform")}</div></div>}
    </header>

    {view === "home" && <>
      <section className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-10 lg:grid-cols-[1.04fr_.96fr] lg:py-20">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm">Gratis projektbrief · uden binding · få relevante matches</div>
          <h1 className="max-w-5xl text-4xl font-black leading-[.96] tracking-[-0.05em] text-[#071527] md:text-7xl">Få styr på din digitale opgave — før du hyrer nogen.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Beskriv kort hvad du vil have lavet. Naetwork hjælper dig med at omsætte det til en konkret projektbrief, så du kan få relevante tilbud uden at skulle gætte på scope, pris eller hvem du skal vælge.</p>
          <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <p className="mb-3 text-sm font-black text-[#071527]">Hvad skal du have hjælp til?</p>
            <textarea value={intake.need} onChange={(event) => setIntake({ ...intake, need: event.target.value })} rows={4} className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none focus:border-[#3f8f83] focus:ring-4 focus:ring-[#3f8f83]/10" placeholder="Fx: Jeg skal bruge en ny hjemmeside til min konsulentforretning..." />
            <div className="mt-4 flex flex-col gap-3 sm:flex-row"><Button onClick={() => open("brief")}>Lav min gratis brief</Button><Button secondary onClick={() => open("matches")}>Se eksempel på resultat</Button></div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2"><Badge>Klar projektbrief</Badge><Badge>Få relevante specialister</Badge><Badge>Sammenlignelige tilbud</Badge></div>
        </div>
        <Panel dark className="lg:p-8">
          <div className="flex items-start justify-between gap-6"><div><p className="text-sm font-black uppercase tracking-[.2em] text-emerald-200">Det du får</p><h2 className="mt-3 text-3xl font-black tracking-tight">En klar brief — ikke bare en kontaktformular</h2></div><Badge dark>Preview</Badge></div>
          <div className="mt-7 grid gap-3">{["Scope: hvad skal bygges i første version", "Fravalg: hvad er ikke med endnu", "Acceptkriterier: hvornår er opgaven løst", "Match-tags: hvilken specialist passer til opgaven"].map((item) => <div key={item} className="rounded-2xl bg-white/10 p-4 text-sm font-semibold leading-6 text-white/85 ring-1 ring-white/10">{item}</div>)}</div>
          <div className="mt-7 rounded-2xl bg-emerald-300/10 p-5 ring-1 ring-emerald-200/20"><p className="text-sm font-black text-emerald-100">Naetwork bruger AI til at stille de rigtige spørgsmål. Matching, status og tilbud kører struktureret bagefter.</p></div>
        </Panel>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid gap-4 md:grid-cols-3">{[["1", "Beskriv med egne ord", "Du behøver ikke kende tekniske termer eller skrive en kravspecifikation."], ["2", "Få en skarp brief", "Naetwork gør behovet konkret med scope, fravalg og acceptkriterier."], ["3", "Vælg med mere tryghed", "Du får få relevante matches og tilbud, der kan sammenlignes." ]].map(([number, title, text]) => <Panel key={title}><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">{number}</span><h3 className="mt-5 text-xl font-black text-[#071527]">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{text}</p></Panel>)}</div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-5 lg:grid-cols-2">{beforeAfter.map((column, index) => <Panel key={column[0]} dark={index === 1}><h2 className="text-2xl font-black">{column[0]}</h2><div className="mt-5 grid gap-3">{column.slice(1).map((item) => <div key={item} className={cx("rounded-2xl p-4 text-sm font-bold leading-6", index === 1 ? "bg-white/10 text-white/85 ring-1 ring-white/10" : "bg-slate-50 text-slate-700")}>{item}</div>)}</div></Panel>)}</div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><Eyebrow>Eksempler</Eyebrow><h2 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Hvad kan du få hjælp til?</h2></div><Button secondary onClick={() => open("brief")}>Start med dit behov</Button></div>
        <div className="grid gap-4 md:grid-cols-5">{useCases.map((item) => <button key={item} onClick={() => { setIntake({ ...intake, category: item }); open("brief"); }} className="rounded-[24px] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"><p className="font-black text-[#071527]">{item}</p><p className="mt-3 text-sm leading-6 text-slate-600">Få scope, specialisttype og relevant match-grundlag.</p></button>)}</div>
      </section>
    </>}

    {view === "brief" && <section className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[.82fr_1.18fr]">
      <Panel>
        <Eyebrow>Gratis projektbrief</Eyebrow><h1 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Start med behovet — ikke kravspecifikationen.</h1><p className="mt-3 text-sm leading-6 text-slate-600">Demoen viser præcis, hvordan en consumer får værdi med det samme: klarhed før valg af specialist.</p>
        <div className="mt-6 grid gap-4">
          <div><p className="mb-2 text-sm font-bold text-slate-700">Hvad minder opgaven mest om?</p><div className="flex flex-wrap gap-2">{(Object.keys(categoryConfig) as Category[]).map((item) => <button key={item} onClick={() => setIntake({ ...intake, category: item })} className={cx("rounded-full border px-4 py-2 text-sm font-black", intake.category === item ? "border-[#071527] bg-[#071527] text-white" : "border-slate-200 bg-white text-slate-700")}>{item}</button>)}</div></div>
          <label className="grid gap-2 text-sm font-bold text-slate-700">Beskriv med egne ord<textarea value={intake.need} onChange={(event) => setIntake({ ...intake, need: event.target.value })} rows={5} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-normal text-slate-950 outline-none focus:border-[#3f8f83] focus:ring-4 focus:ring-[#3f8f83]/10" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">Hvem skal bruge løsningen?<textarea value={intake.audience} onChange={(event) => setIntake({ ...intake, audience: event.target.value })} rows={3} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-normal text-slate-950 outline-none focus:border-[#3f8f83] focus:ring-4 focus:ring-[#3f8f83]/10" /></label>
          <div className="grid gap-4 md:grid-cols-2"><label className="grid gap-2 text-sm font-bold text-slate-700">Budget<input value={intake.budget} onChange={(event) => setIntake({ ...intake, budget: event.target.value })} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-normal text-slate-950 outline-none focus:border-[#3f8f83] focus:ring-4 focus:ring-[#3f8f83]/10" /></label><label className="grid gap-2 text-sm font-bold text-slate-700">Deadline<input value={intake.deadline} onChange={(event) => setIntake({ ...intake, deadline: event.target.value })} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-normal text-slate-950 outline-none focus:border-[#3f8f83] focus:ring-4 focus:ring-[#3f8f83]/10" /></label></div>
          <Button onClick={() => open("matches")}>Godkend brief og se matches</Button>
        </div>
      </Panel>
      <Panel>
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5"><div><Eyebrow>AI-assisteret brief</Eyebrow><h2 className="mt-3 text-3xl font-black tracking-tight text-[#071527]">{brief.title}</h2></div><Badge>Preview</Badge></div>
        <p className="mt-5 text-sm leading-6 text-slate-600">{brief.summary}</p>
        <div className="mt-5 grid gap-3 md:grid-cols-3"><Stat label="Specialist" value={brief.specialist.split(" /")[0]} /><Stat label="Budget" value={brief.budget} /><Stat label="Deadline" value={brief.deadline} /></div>
        <div className="mt-5 flex flex-wrap gap-2">{brief.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>
        <div className="mt-6 grid gap-6 md:grid-cols-2"><div><h3 className="font-black">Scope</h3><ul className="mt-3 grid gap-2">{brief.scope.map((item) => <li key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</li>)}</ul><h3 className="mt-6 font-black">Spørgsmål Naetwork ville afklare</h3><ul className="mt-3 grid gap-2">{brief.questions.map((item) => <li key={item} className="rounded-2xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">{item}</li>)}</ul></div><div><h3 className="font-black">Acceptkriterier</h3><ul className="mt-3 grid gap-2">{brief.acceptance.map((item) => <li key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</li>)}</ul><h3 className="mt-6 font-black">Ikke inkluderet</h3><ul className="mt-3 grid gap-2">{brief.notIncluded.map((item) => <li key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</li>)}</ul></div></div>
      </Panel>
    </section>}

    {view === "matches" && <section className="mx-auto max-w-7xl px-5 py-10"><div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><Eyebrow>Relevante matches</Eyebrow><h1 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Få matches, der passer til briefen — ikke en endeløs profil-liste.</h1><p className="mt-3 max-w-3xl text-slate-600">Consumeren ser pris, leveringstid og match-score på samme måde. Det gør valget tryggere og mere sammenligneligt.</p></div><Button secondary onClick={() => open("brief")}>Tilbage til brief</Button></div><div className="grid gap-5 lg:grid-cols-3">{providers.map((provider) => <Panel key={provider.name} className="flex min-h-[430px] flex-col justify-between"><div><div className="flex items-start justify-between gap-4"><div><p className="text-2xl font-black text-[#071527]">{provider.name}</p><p className="mt-1 text-sm font-bold text-slate-500">{provider.type}</p></div><span className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-800">{provider.score}%</span></div><p className="mt-5 text-sm leading-6 text-slate-600">{provider.note}</p><div className="mt-5 flex flex-wrap gap-2">{provider.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div><div className="mt-6 grid grid-cols-2 gap-3"><Stat label="Tilbud" value={provider.price} /><Stat label="Tid" value={provider.time} /></div></div><Button onClick={() => { setSelectedProvider(provider); open("project"); }}>Vælg specialist</Button></Panel>)}</div></section>}

    {view === "project" && <section className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[.85fr_1.15fr]"><Panel dark><Eyebrow>Valgt specialist</Eyebrow><h1 className="mt-3 text-4xl font-black tracking-tight">{selectedProvider.name}</h1><p className="mt-4 text-white/70">{selectedProvider.note}</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-white/10 p-4"><p className="text-sm text-white/60">Pris</p><p className="mt-1 text-2xl font-black">{selectedProvider.price}</p></div><div className="rounded-2xl bg-white/10 p-4"><p className="text-sm text-white/60">Levering</p><p className="mt-1 text-2xl font-black">{selectedProvider.time}</p></div></div><div className="mt-6"><Button secondary onClick={() => open("platform")}>Se platform status</Button></div></Panel><Panel><Eyebrow>Projektstatus</Eyebrow><h2 className="mt-3 text-3xl font-black tracking-tight text-[#071527]">{brief.title}</h2><div className="mt-6 grid gap-3">{["Brief godkendt", "Specialist valgt", "Tilbud accepteret", "Projekt kickoff", "Første leverance", "Feedbackrunde", "Afsluttet og handover"].map((step, index) => <div key={step} className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4"><span className={cx("grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-black", index < 3 ? "bg-[#071527] text-white" : "bg-white text-slate-400 ring-1 ring-slate-200")}>{index + 1}</span><div><p className="font-black text-[#071527]">{step}</p><p className="text-sm text-slate-500">{index < 3 ? "Fuldført i demo-flow" : "Næste trin i projektet"}</p></div></div>)}</div></Panel></section>}

    {view === "provider" && <section className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[.85fr_1.15fr]"><Panel><Eyebrow>For specialister</Eyebrow><h1 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Bedre opgaver med klarere scope.</h1><p className="mt-4 text-slate-600">Providers er vigtige, men de er sekundære i produktoplevelsen. De får værdi, fordi Naetwork sender opgaver med bedre brief, budget, forventninger og acceptkriterier.</p><div className="mt-6 grid gap-3">{["Mindre spildtid på uklare leads", "Brief og scope før tilbud", "Match-score pr. opgave", "Færre irrelevante henvendelser", "Mere professionel handover"].map((item) => <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm font-black text-slate-700">{item}</div>)}</div></Panel><div className="grid gap-4">{providers.map((provider) => <Panel key={provider.name}><div className="grid gap-4 md:grid-cols-[1fr_auto]"><div><p className="text-xl font-black text-[#071527]">Relevant opgave til {provider.type}</p><p className="mt-2 text-sm text-slate-500">Budget {provider.price} · Deadline {provider.time}</p></div><div className="text-left md:text-right"><p className="text-sm font-black text-emerald-700">Match {provider.score}%</p><button className="mt-2 rounded-full bg-[#071527] px-4 py-2 text-xs font-black text-white">Send tilbud</button></div></div></Panel>)}</div></section>}

    {view === "platform" && <section className="mx-auto max-w-7xl px-5 py-10"><div className="mb-8"><Eyebrow>Platform demo</Eyebrow><h1 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Consumer først. Platform bagefter.</h1><p className="mt-3 max-w-3xl text-slate-600">Dashboardet viser den større platformvision, men forsiden skal først sælge consumer-værdien: klarhed, tryghed og bedre valg.</p></div><div className="grid gap-4 md:grid-cols-4">{platformStats.map((item) => <Stat key={item.label} label={item.label} value={item.value} />)}</div><div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_.95fr]"><Panel><h2 className="text-2xl font-black text-[#071527]">Platform-flow</h2><div className="mt-5 grid gap-3">{["Brief oprettet", "AI-spørgsmål afklaret", "3 matches fundet", "Tilbud sammenlignet", "Specialist valgt", "Projektstatus aktiv"].map((item) => <div key={item} className="grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-[1fr_auto]"><p className="font-black text-[#071527]">{item}</p><p className="text-sm font-black text-emerald-700">Demo</p></div>)}</div></Panel><Panel dark><h2 className="text-2xl font-black">Strategisk princip</h2><p className="mt-4 leading-7 text-white/70">Naetwork skal ikke ligne Fiverr. Produktet skal føles som en kurateret projektmotor: AI hjælper med briefen, mens resten styres af struktur, statusser, tilbud og klare leverancekrav.</p><div className="mt-6 grid gap-3">{["Brief før browse", "Få matches", "Scope låses", "Tilbud sammenlignes", "Projektstatus styres"].map((item) => <div key={item} className="rounded-2xl bg-white/10 p-4 text-sm font-black text-white/80 ring-1 ring-white/10">{item}</div>)}</div></Panel></div></section>}

    <footer className="mx-auto max-w-7xl px-5 py-10 text-sm text-slate-500"><div className="border-t border-slate-200 pt-6">Naetwork · Consumer-first demo · Få klarhed før du hyrer.</div></footer>
  </main>;
}
