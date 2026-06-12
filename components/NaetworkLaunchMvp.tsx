'use client';

import { type ReactNode, useMemo, useState } from "react";

type View = "home" | "consumer" | "matches" | "project" | "provider" | "platform";
type Category = "Hjemmeside" | "Dashboard" | "Automation" | "Webapp" | "Pitch deck";

type Intake = {
  category: Category;
  need: string;
  audience: string;
  budget: string;
  deadline: string;
};

const initialIntake: Intake = {
  category: "Webapp",
  need: "Jeg vil have bygget en simpel platform, hvor brugere kan beskrive et behov, få en klar projektbrief og blive matchet med relevante digitale specialister.",
  audience: "Founders, små virksomheder og private, der har et digitalt behov, men ikke ved præcis hvem de skal hyre.",
  budget: "25.000-50.000 kr.",
  deadline: "4-6 uger"
};

const categoryConfig: Record<Category, { title: string; tags: string[]; scope: string[]; questions: string[] }> = {
  Hjemmeside: {
    title: "Professionel hjemmeside med tydeligt kontaktflow",
    tags: ["Webdesign", "Kontaktformular", "SEO", "CMS", "Mobil"],
    scope: ["Forside og 3-5 undersider", "Kontaktformular og bookinglink", "Responsivt design", "Basal SEO og performance", "Kort handover og redigeringsguide"],
    questions: ["Skal siden kunne redigeres af jer selv?", "Har I eksisterende brand, billeder og tekst?", "Hvad er vigtigste konvertering: opkald, booking eller formular?"]
  },
  Dashboard: {
    title: "Overskueligt dashboard med centrale KPI’er",
    tags: ["Dashboard", "Excel", "KPI", "Rapportering", "Data"],
    scope: ["Datakilder og oprydning", "5-7 centrale KPI’er", "Ledelsesvenlig visning", "Månedlig opdateringslogik", "Dokumenteret handover"],
    questions: ["Hvor ligger data i dag?", "Hvilke KPI’er træffes der beslutninger på?", "Skal dashboardet opdateres manuelt eller automatisk?"]
  },
  Automation: {
    title: "Automation der fjerner manuelt dobbeltarbejde",
    tags: ["Automation", "Make", "Zapier", "Sheets", "Workflow"],
    scope: ["Trigger og datakilde", "Automatisk logning", "Fejlhåndtering", "Notifikationer", "Test og dokumentation"],
    questions: ["Hvad starter flowet?", "Hvor skal data ende?", "Hvad sker der, hvis automationen fejler?"]
  },
  Webapp: {
    title: "Afgrænset webapp/MVP med klart kerneflow",
    tags: ["Webapp", "MVP", "Frontend", "Backend", "Vercel"],
    scope: ["Landing page og intake-flow", "AI-assisteret brief preview", "Provider match preview", "Projektstatus og tilbudsflow", "Deploy-klar demo"],
    questions: ["Hvad er det vigtigste kerneflow?", "Skal brugere kunne logge ind i første version?", "Hvilken handling skal brugeren kunne gennemføre uden hjælp?"]
  },
  "Pitch deck": {
    title: "Pitch deck med klar fortælling og premium design",
    tags: ["Pitch deck", "Storyline", "Design", "Investor", "Slides"],
    scope: ["Narrativ og storyline", "Slide-struktur", "Designretning", "Finpudsning af key slides", "Eksportklar præsentation"],
    questions: ["Hvem er modtageren?", "Hvilken beslutning skal decket drive?", "Har I tal og traction klar?"]
  }
};

const providers = [
  { name: "North Studio", type: "Webapp & MVP", score: 96, price: "38.000 kr.", time: "5 uger", tags: ["Next.js", "Vercel", "UX", "Dashboard"], note: "Stærk match på MVP, premium frontend og hurtigt demo-flow." },
  { name: "Flow Builders", type: "Automation & tools", score: 91, price: "29.000 kr.", time: "3 uger", tags: ["Make", "Sheets", "Admin", "Workflow"], note: "God til strukturerede interne værktøjer og simple workflows." },
  { name: "Copenhagen Digital", type: "Design & launch", score: 87, price: "45.000 kr.", time: "6 uger", tags: ["Brand", "Landing", "UI", "Launch"], note: "Stærk visuel eksekvering og launch-klar polish." }
];

const pipeline = [
  { title: "AI-assisteret brief", status: "Klar", owner: "Naetwork", value: "0 kr." },
  { title: "Provider shortlist", status: "3 matches", owner: "System", value: "Automatisk" },
  { title: "Tilbud modtaget", status: "2 aktive", owner: "Providers", value: "29-45k" },
  { title: "Projektstart", status: "Afventer valg", owner: "Kunde", value: "Denne uge" }
];

const providerProjects = [
  { title: "MVP til digital matching-platform", budget: "25-50k", score: "96%", deadline: "4-6 uger" },
  { title: "Automatisering af lead-flow", budget: "10-25k", score: "88%", deadline: "2-3 uger" },
  { title: "Dashboard til månedlig rapportering", budget: "25-50k", score: "83%", deadline: "3-4 uger" }
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
  const [briefMode, setBriefMode] = useState<"draft" | "enhanced">("enhanced");
  const [selectedProvider, setSelectedProvider] = useState(providers[0]);

  const brief = useMemo(() => {
    const config = categoryConfig[intake.category];
    return {
      title: briefMode === "enhanced" ? `AI-forbedret brief: ${config.title}` : config.title,
      category: intake.category,
      tags: config.tags,
      scope: config.scope,
      questions: config.questions,
      summary: briefMode === "enhanced"
        ? "Naetwork har omsat behovet til et mere afgrænset projekt med tydelige leverancer, fravalg og match-tags. Matching sker efterfølgende struktureret og regelbaseret."
        : "Regelbaseret brief baseret på kategori, budget, deadline og scope.",
      notIncluded: ["Ubegrænsede revisionsrunder", "Betalingsintegration uden særskilt scope", "Løbende drift og support uden særskilt aftale"],
      acceptance: ["Kerneflow virker på desktop og mobil", "Leverancen matcher godkendt brief", "Provider afleverer kort handover", "Kunde kan godkende eller bede om én samlet feedbackrunde"]
    };
  }, [briefMode, intake.category]);

  const open = (target: View) => { setView(target); setMenu(false); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); };
  const nav = (target: View, label: string) => <button onClick={() => open(target)} className={cx("rounded-full px-4 py-2 text-sm font-bold transition", view === target ? "bg-[#071527] text-white" : "text-slate-600 hover:bg-slate-100")}>{label}</button>;

  return <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
        <button onClick={() => open("home")} className="flex items-center gap-3 text-left"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">N</span><span><span className="block text-lg font-black tracking-tight">Naetwork</span><span className="block text-xs text-slate-500">AI brief · regelbaseret matching</span></span></button>
        <nav className="hidden items-center gap-2 lg:flex">{nav("home", "Forside")}{nav("consumer", "Kunde-flow")}{nav("matches", "Matches")}{nav("provider", "Provider")}{nav("platform", "Platform")}</nav>
        <div className="hidden gap-2 md:flex"><Button secondary onClick={() => open("provider")}>Provider demo</Button><Button onClick={() => open("consumer")}>Prøv kunde-flow</Button></div>
        <button onClick={() => setMenu(!menu)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-black lg:hidden">Menu</button>
      </div>
      {menu && <div className="border-t border-slate-200 bg-white px-5 py-4 lg:hidden"><div className="grid gap-2">{nav("home", "Forside")}{nav("consumer", "Kunde-flow")}{nav("matches", "Matches")}{nav("provider", "Provider")}{nav("platform", "Platform")}</div></div>}
    </header>

    {view === "home" && <>
      <section className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 lg:grid-cols-[1.02fr_.98fr] lg:py-24">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm">Fuld produktdemo · AI hvor det skaber værdi · struktureret platform</div>
          <h1 className="max-w-5xl text-4xl font-black leading-[.96] tracking-[-0.05em] text-[#071527] md:text-7xl">Fra uklart behov til konkret digital løsning.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Naetwork bruger AI dér, hvor det fjerner friktion: at omsætte et uklart behov til en klar projektbrief. Resten af platformen kører struktureret og regelbaseret.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button onClick={() => open("consumer")}>Prøv kunde-flow</Button><Button secondary onClick={() => open("platform")}>Se platform demo</Button></div>
          <div className="mt-8 flex flex-wrap gap-2"><Badge>AI-assisteret brief</Badge><Badge>Regelbaseret matching</Badge><Badge>Provider-tilbud</Badge><Badge>Projektstatus</Badge></div>
        </div>
        <Panel dark className="overflow-hidden lg:p-8">
          <div className="flex items-start justify-between gap-6"><div><p className="text-sm font-black uppercase tracking-[.2em] text-emerald-200">Naetwork platform</p><h2 className="mt-3 text-3xl font-black tracking-tight">Pipeline overview</h2></div><Badge dark>Demo-data</Badge></div>
          <div className="mt-8 grid gap-3">{pipeline.map((item) => <div key={item.title} className="grid gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10 sm:grid-cols-[1fr_auto]"><div><p className="font-black text-white">{item.title}</p><p className="mt-1 text-sm text-white/60">{item.owner}</p></div><div className="text-left sm:text-right"><p className="text-sm font-black text-emerald-200">{item.status}</p><p className="mt-1 text-sm text-white/60">{item.value}</p></div></div>)}</div>
          <div className="mt-8 grid grid-cols-3 gap-3"><div className="rounded-2xl bg-white/10 p-4"><p className="text-2xl font-black">18</p><p className="text-xs text-white/60">briefs</p></div><div className="rounded-2xl bg-white/10 p-4"><p className="text-2xl font-black">42</p><p className="text-xs text-white/60">providers</p></div><div className="rounded-2xl bg-white/10 p-4"><p className="text-2xl font-black">12%</p><p className="text-xs text-white/60">platform fee</p></div></div>
        </Panel>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-8"><div className="grid gap-4 md:grid-cols-4">{["1. Beskriv behov", "2. AI skærper brief", "3. System matcher", "4. Projekt styres"].map((item) => <Panel key={item}><p className="text-lg font-black text-[#071527]">{item}</p><p className="mt-3 text-sm leading-6 text-slate-600">Demoen viser det fulde flow fra første input til valg af provider og projektstatus.</p></Panel>)}</div></section>
      <section className="mx-auto max-w-7xl px-5 py-14"><Panel className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]"><div><Eyebrow>Hvad demoen beviser</Eyebrow><h2 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Ikke en freelancer-børs. En struktureret projektmotor.</h2><p className="mt-4 text-slate-600">Kunden skal ikke browse 200 profiler. Platformen hjælper først med at formulere et godt scope — og matcher derefter på data.</p></div><div className="grid gap-4 md:grid-cols-2">{["Brief før match", "Få relevante providers", "Tilbud kan sammenlignes", "Status og handover", "Provider pipeline", "Platform fee logic"].map((item) => <div key={item} className="rounded-2xl bg-slate-50 p-5"><p className="font-black text-[#071527]">{item}</p><p className="mt-2 text-sm leading-6 text-slate-600">Indbygget i demo-flowet, så produktet føles konkret og salgbart.</p></div>)}</div></Panel></section>
    </>}

    {view === "consumer" && <section className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[.82fr_1.18fr]">
      <Panel><Eyebrow>Kunde-flow</Eyebrow><h1 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Beskriv dit behov</h1><p className="mt-3 text-sm leading-6 text-slate-600">Dette er demoens startpunkt. AI bruges kun til at skærpe briefen — ikke til hele platformen.</p><div className="mt-6 grid gap-4"><div><p className="mb-2 text-sm font-bold text-slate-700">Kategori</p><div className="flex flex-wrap gap-2">{(Object.keys(categoryConfig) as Category[]).map((item) => <button key={item} onClick={() => setIntake({ ...intake, category: item })} className={cx("rounded-full border px-4 py-2 text-sm font-black", intake.category === item ? "border-[#071527] bg-[#071527] text-white" : "border-slate-200 bg-white text-slate-700")}>{item}</button>)}</div></div>{[["need", "Hvad skal bygges?"], ["audience", "Hvem skal bruge det?"], ["budget", "Budgetniveau"], ["deadline", "Deadline"]].map(([key, label]) => <label key={key} className="grid gap-2 text-sm font-bold text-slate-700">{label}{key === "need" || key === "audience" ? <textarea value={intake[key as keyof Intake]} onChange={(event) => setIntake({ ...intake, [key]: event.target.value })} rows={key === "need" ? 5 : 3} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-normal text-slate-950 outline-none focus:border-[#3f8f83] focus:ring-4 focus:ring-[#3f8f83]/10" /> : <input value={intake[key as keyof Intake]} onChange={(event) => setIntake({ ...intake, [key]: event.target.value })} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-normal text-slate-950 outline-none focus:border-[#3f8f83] focus:ring-4 focus:ring-[#3f8f83]/10" />}</label>)}<div className="flex flex-col gap-3 sm:flex-row"><Button onClick={() => setBriefMode("enhanced")}>Generér AI-brief</Button><Button secondary onClick={() => open("matches")}>Se matches</Button></div></div></Panel>
      <Panel><div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5"><div><Eyebrow>{briefMode === "enhanced" ? "AI-assisteret brief" : "Regelbaseret brief"}</Eyebrow><h2 className="mt-3 text-3xl font-black tracking-tight text-[#071527]">{brief.title}</h2></div><Badge>{briefMode === "enhanced" ? "AI preview" : "Rules"}</Badge></div><p className="mt-5 text-sm leading-6 text-slate-600">{brief.summary}</p><div className="mt-5 flex flex-wrap gap-2">{brief.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div><div className="mt-6 grid gap-6 md:grid-cols-2"><div><h3 className="font-black">Scope</h3><ul className="mt-3 grid gap-2">{brief.scope.map((item) => <li key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</li>)}</ul><h3 className="mt-6 font-black">AI-afklaringer</h3><ul className="mt-3 grid gap-2">{brief.questions.map((item) => <li key={item} className="rounded-2xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">{item}</li>)}</ul></div><div><h3 className="font-black">Acceptkriterier</h3><ul className="mt-3 grid gap-2">{brief.acceptance.map((item) => <li key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</li>)}</ul><h3 className="mt-6 font-black">Ikke inkluderet</h3><ul className="mt-3 grid gap-2">{brief.notIncluded.map((item) => <li key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</li>)}</ul></div></div><div className="mt-6"><Button onClick={() => open("matches")}>Godkend brief og find providers</Button></div></Panel>
    </section>}

    {view === "matches" && <section className="mx-auto max-w-7xl px-5 py-10"><div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><Eyebrow>Provider matches</Eyebrow><h1 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">3 relevante matches baseret på briefen</h1><p className="mt-3 max-w-2xl text-slate-600">Matching føles intelligent, men logikken er struktureret: kategori, tags, budget, kapacitet og relevant erfaring.</p></div><Button secondary onClick={() => open("consumer")}>Tilbage til brief</Button></div><div className="grid gap-5 lg:grid-cols-3">{providers.map((provider) => <Panel key={provider.name} className="flex min-h-[430px] flex-col justify-between"><div><div className="flex items-start justify-between gap-4"><div><p className="text-2xl font-black text-[#071527]">{provider.name}</p><p className="mt-1 text-sm font-bold text-slate-500">{provider.type}</p></div><span className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-800">{provider.score}%</span></div><p className="mt-5 text-sm leading-6 text-slate-600">{provider.note}</p><div className="mt-5 flex flex-wrap gap-2">{provider.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div><div className="mt-6 grid grid-cols-2 gap-3"><Stat label="Tilbud" value={provider.price} /><Stat label="Tid" value={provider.time} /></div></div><Button onClick={() => { setSelectedProvider(provider); open("project"); }}>Vælg provider</Button></Panel>)}</div></section>}

    {view === "project" && <section className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[.85fr_1.15fr]"><Panel dark><Eyebrow>Valgt provider</Eyebrow><h1 className="mt-3 text-4xl font-black tracking-tight">{selectedProvider.name}</h1><p className="mt-4 text-white/70">{selectedProvider.note}</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-white/10 p-4"><p className="text-sm text-white/60">Pris</p><p className="mt-1 text-2xl font-black">{selectedProvider.price}</p></div><div className="rounded-2xl bg-white/10 p-4"><p className="text-sm text-white/60">Levering</p><p className="mt-1 text-2xl font-black">{selectedProvider.time}</p></div></div><div className="mt-6"><Button secondary onClick={() => open("platform")}>Se platform status</Button></div></Panel><Panel><Eyebrow>Projektstatus</Eyebrow><h2 className="mt-3 text-3xl font-black tracking-tight text-[#071527]">MVP til digital matching-platform</h2><div className="mt-6 grid gap-3">{["Brief godkendt", "Provider valgt", "Tilbud accepteret", "Projekt kickoff", "Første leverance", "Feedbackrunde", "Afsluttet og handover"].map((step, index) => <div key={step} className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4"><span className={cx("grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-black", index < 3 ? "bg-[#071527] text-white" : "bg-white text-slate-400 ring-1 ring-slate-200")}>{index + 1}</span><div><p className="font-black text-[#071527]">{step}</p><p className="text-sm text-slate-500">{index < 3 ? "Fuldført i demo-flow" : "Næste trin i projektet"}</p></div></div>)}</div></Panel></section>}

    {view === "provider" && <section className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[.85fr_1.15fr]"><Panel><Eyebrow>Provider portal</Eyebrow><h1 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Relevante opgaver — ikke åbent kaos.</h1><p className="mt-4 text-slate-600">Providers ser kun opgaver, hvor deres profil matcher kategori, tags, budget og kapacitet. Det gør platformen mere premium end en traditionel freelancer-børs.</p><div className="mt-6 grid gap-3">{["Profil og kompetencer", "Match-score pr. opgave", "Send tilbud", "Aktive projekter", "Handover og rating"].map((item) => <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm font-black text-slate-700">{item}</div>)}</div></Panel><div className="grid gap-4">{providerProjects.map((project) => <Panel key={project.title}><div className="grid gap-4 md:grid-cols-[1fr_auto]"><div><p className="text-xl font-black text-[#071527]">{project.title}</p><p className="mt-2 text-sm text-slate-500">Budget {project.budget} · Deadline {project.deadline}</p></div><div className="text-left md:text-right"><p className="text-sm font-black text-emerald-700">Match {project.score}</p><button className="mt-2 rounded-full bg-[#071527] px-4 py-2 text-xs font-black text-white">Send tilbud</button></div></div></Panel>)}</div></section>}

    {view === "platform" && <section className="mx-auto max-w-7xl px-5 py-10"><div className="mb-8"><Eyebrow>Platform dashboard</Eyebrow><h1 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Naetwork som ægte produktoplevelse</h1><p className="mt-3 max-w-3xl text-slate-600">Denne demo viser, hvordan platformen kan føles live: pipeline, matches, tilbud, status og potentiel platformøkonomi — uden at bygge fuld backend først.</p></div><div className="grid gap-4 md:grid-cols-4"><Stat label="Aktive briefs" value="18" /><Stat label="Provider pool" value="42" /><Stat label="Pipeline value" value="842k" /><Stat label="Est. fee" value="101k" /></div><div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_.95fr]"><Panel><h2 className="text-2xl font-black text-[#071527]">Live pipeline preview</h2><div className="mt-5 grid gap-3">{pipeline.map((item) => <div key={item.title} className="grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-[1fr_auto_auto]"><p className="font-black text-[#071527]">{item.title}</p><p className="text-sm font-bold text-slate-500">{item.owner}</p><p className="text-sm font-black text-emerald-700">{item.status}</p></div>)}</div></Panel><Panel dark><h2 className="text-2xl font-black">Strategisk princip</h2><p className="mt-4 leading-7 text-white/70">Naetwork skal ikke ligne Fiverr. Produktet skal føles som en kurateret projektmotor: AI hjælper med briefen, mens resten styres af struktur, statusser, tilbud og klare leverancekrav.</p><div className="mt-6 grid gap-3">{["Brief før browse", "Få matches", "Scope låses", "Tilbud sammenlignes", "Projektstatus styres"].map((item) => <div key={item} className="rounded-2xl bg-white/10 p-4 text-sm font-black text-white/80 ring-1 ring-white/10">{item}</div>)}</div></Panel></div></section>}

    <footer className="mx-auto max-w-7xl px-5 py-10 text-sm text-slate-500"><div className="border-t border-slate-200 pt-6">Naetwork · Full Demo v1 · AI-assisteret brief og regelbaseret platform-flow.</div></footer>
  </main>;
}
