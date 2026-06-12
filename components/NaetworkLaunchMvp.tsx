'use client';

import { type ChangeEvent, type FormEvent, type ReactNode, useMemo, useState } from "react";

type View = "home" | "intake" | "provider" | "setup";
type Status = "idle" | "sending" | "success" | "error";

type Intake = {
  category: string;
  need: string;
  audience: string;
  mustHave: string;
  inspiration: string;
  budget: string;
  deadline: string;
  name: string;
  email: string;
};

type ProviderForm = {
  name: string;
  email: string;
  company: string;
  skills: string;
  priceLevel: string;
  capacity: string;
  portfolio: string;
};

const categories = [
  { name: "Hjemmeside", tags: ["Hjemmeside", "Kontaktformular", "SEO", "UX/UI"], scope: ["Forside", "Ydelsessektion", "Kontaktflow", "Mobilvisning", "Basal SEO"], title: "Simpel hjemmeside med tydeligt kontaktflow" },
  { name: "Dashboard", tags: ["Dashboard", "Rapportering", "Excel/Sheets", "KPI"], scope: ["Datagrundlag", "KPI-overblik", "Rapportvisning", "Opdateringsflow", "Kort handover"], title: "Let dashboard med tydelige KPI’er" },
  { name: "Automation", tags: ["Automation", "Make/Zapier", "Google Sheets", "Workflow"], scope: ["Trigger", "Dataudtræk", "Automatisk log", "Fejlhåndtering", "Dokumenteret flow"], title: "Automation der reducerer manuelt arbejde" },
  { name: "Webapp", tags: ["Webapp", "MVP", "Frontend", "Backend light"], scope: ["Kerneflow", "Brugerinput", "Admin light", "Statusvisning", "Deploy"], title: "Afgrænset webapp/MVP med klart første scope" },
  { name: "Pitch deck", tags: ["Pitch deck", "Storyline", "Design", "Investor material"], scope: ["Storyline", "Slide-struktur", "Designretning", "Final deck", "Kort feedbackrunde"], title: "Professionelt pitch deck med klar storyline" }
];

const examples: Intake[] = [
  { category: "Hjemmeside", need: "Jeg er selvstændig konsulent og skal bruge en professionel hjemmeside med ydelser, priser, kontaktformular og bookinglink.", audience: "Potentielle B2B-kunder, der skal forstå ydelsen hurtigt og nemt kunne tage kontakt.", mustHave: "Forside, ydelser/priser, kontaktformular, bookinglink, mobilvisning, basal SEO og kort handover.", inspiration: "Nordisk, roligt og professionelt. Ikke for techy.", budget: "10.000-25.000 kr.", deadline: "3-4 uger", name: "", email: "" },
  { category: "Dashboard", need: "Vi har salgstal i Excel og ønsker et simpelt dashboard med omsætning, pipeline og performance pr. måned.", audience: "Ledelsen og to team leads, der ikke er tekniske.", mustHave: "Oprydning af Excel-data, 5-6 KPI’er, enkel rapportvisning og dokumenteret opdateringsflow.", inspiration: "Rent dashboard med få grafer og tydelige nøgletal.", budget: "25.000-50.000 kr.", deadline: "2-3 uger", name: "", email: "" },
  { category: "Automation", need: "Vi modtager leads på mail og vil gerne samle dem automatisk i Google Sheets med kategori og kort resumé.", audience: "Founder og salgsteam, der skal følge op hurtigere.", mustHave: "Gmail-trigger, udtræk af navn/email/besked, kategori, Sheets-log og simpel fejlmarkering.", inspiration: "Let at forstå og ikke et stort CRM-system.", budget: "10.000-25.000 kr.", deadline: "1-2 uger", name: "", email: "" }
];

const initialIntake: Intake = examples[0];
const initialProvider: ProviderForm = { name: "", email: "", company: "", skills: "", priceLevel: "", capacity: "", portfolio: "" };
const quality = ["Ingen AI-drift i Sprint 1", "Data gemmes i Supabase Free", "Emails sendes via Resend Free", "Brief bygges med regler og skabeloner"];

function cx(...classes: Array<string | false | undefined>) { return classes.filter(Boolean).join(" "); }
function selectedCategory(name: string) { return categories.find((item) => item.name === name) || categories[0]; }
function splitList(value: string) { return value.split(/,|\n/).map((item) => item.trim()).filter(Boolean); }

function buildBrief(intake: Intake) {
  const config = selectedCategory(intake.category);
  const customScope = splitList(intake.mustHave);
  const extraTags = splitList(`${intake.need},${intake.mustHave}`).filter((item) => item.length < 28).slice(0, 3);
  return {
    title: config.title,
    category: config.name,
    tags: Array.from(new Set([...config.tags, ...extraTags])).slice(0, 8),
    scope: customScope.length ? customScope.slice(0, 7) : config.scope,
    notIncluded: ["Løbende drift/support uden særskilt aftale", "Større specialudvikling uden for scope", "Betalingsintegration uden særskilt aftale", "Ubegrænsede revisionsrunder"],
    acceptance: ["Løsningen matcher godkendt brief", "Kerneflowet virker på mobil og desktop", "Leverancen afleveres med kort handover", "Ændringer samles i én feedbackrunde"],
    budget: intake.budget || "Afklares",
    deadline: intake.deadline || "Afklares",
    matchRules: ["Kategori matcher providerens opgavetyper", "Budgetniveau ligger inden for providerens prisniveau", "Provider har relevant kapacitet", "Providerens kompetencer matcher tags"]
  };
}

function Panel({ children, dark = false, className = "" }: { children: ReactNode; dark?: boolean; className?: string }) {
  return <div className={cx("rounded-[28px] border p-6 shadow-sm", dark ? "border-slate-800 bg-[#071527] text-white" : "border-slate-200 bg-white text-slate-950", className)}>{children}</div>;
}
function Button({ children, onClick, type = "button", secondary = false, disabled = false }: { children: ReactNode; onClick?: () => void; type?: "button" | "submit"; secondary?: boolean; disabled?: boolean }) {
  return <button type={type} onClick={onClick} disabled={disabled} className={cx("rounded-full px-6 py-3 text-sm font-black transition", disabled && "cursor-not-allowed opacity-60", secondary ? "border border-slate-300 bg-white text-slate-800" : "bg-[#071527] text-white shadow-lg shadow-slate-900/10", !disabled && "hover:-translate-y-0.5")}>{children}</button>;
}
function Badge({ children }: { children: ReactNode }) { return <span className="inline-flex h-9 w-fit shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 text-xs font-bold leading-none text-slate-700">{children}</span>; }
function Eyebrow({ children }: { children: ReactNode }) { return <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">{children}</p>; }
function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="grid gap-2 text-sm font-bold text-slate-700">{label}{children}</label>; }
function Input({ name, value, onChange, type = "text", placeholder = "" }: { name: string; value: string; onChange: (event: ChangeEvent<HTMLInputElement>) => void; type?: string; placeholder?: string }) { return <input name={name} value={value} onChange={onChange} type={type} placeholder={placeholder} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[#3f8f83] focus:ring-4 focus:ring-[#3f8f83]/10" />; }
function Textarea({ name, value, onChange, rows = 4, placeholder = "" }: { name: string; value: string; onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void; rows?: number; placeholder?: string }) { return <textarea name={name} value={value} onChange={onChange} rows={rows} placeholder={placeholder} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[#3f8f83] focus:ring-4 focus:ring-[#3f8f83]/10" />; }

export function NaetworkLaunchMvp() {
  const [view, setView] = useState<View>("home");
  const [menu, setMenu] = useState(false);
  const [intake, setIntake] = useState<Intake>(initialIntake);
  const [provider, setProvider] = useState<ProviderForm>(initialProvider);
  const [leadStatus, setLeadStatus] = useState<Status>("idle");
  const [providerStatus, setProviderStatus] = useState<Status>("idle");
  const brief = useMemo(() => buildBrief(intake), [intake]);

  const open = (target: View) => { setView(target); setMenu(false); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); };
  const nav = (target: View, label: string) => <button onClick={() => open(target)} className={cx("rounded-full px-4 py-2 text-sm font-bold transition", view === target ? "bg-[#071527] text-white" : "text-slate-600 hover:bg-slate-100")}>{label}</button>;
  const updateIntake = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setIntake({ ...intake, [event.target.name]: event.target.value });
  const updateProvider = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setProvider({ ...provider, [event.target.name]: event.target.value });

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLeadStatus("sending");
    try {
      const response = await fetch("/api/consumer-intake", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ intake, brief }) });
      setLeadStatus(response.ok ? "success" : "error");
    } catch { setLeadStatus("error"); }
  }

  async function submitProvider(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProviderStatus("sending");
    try {
      const response = await fetch("/api/provider-signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(provider) });
      setProviderStatus(response.ok ? "success" : "error");
    } catch { setProviderStatus("error"); }
  }

  return <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
        <button onClick={() => open("home")} className="flex items-center gap-3 text-left"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">N</span><span><span className="block text-lg font-black tracking-tight">Naetwork</span><span className="block text-xs text-slate-500">Sprint 1 uden AI</span></span></button>
        <nav className="hidden items-center gap-2 lg:flex">{nav("home", "Forside")}{nav("intake", "Beskriv behov")}{nav("provider", "Bliv provider")}{nav("setup", "Setup")}</nav>
        <div className="hidden gap-2 md:flex"><Button secondary onClick={() => open("provider")}>Ansøg som provider</Button><Button onClick={() => open("intake")}>Beskriv dit behov</Button></div>
        <button onClick={() => setMenu(!menu)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-black lg:hidden">Menu</button>
      </div>
      {menu && <div className="border-t border-slate-200 bg-white px-5 py-4 lg:hidden"><div className="grid gap-2">{nav("home", "Forside")}{nav("intake", "Beskriv behov")}{nav("provider", "Bliv provider")}{nav("setup", "Setup")}</div></div>}
    </header>

    {view === "home" && <>
      <section className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 lg:grid-cols-[1.04fr_.96fr] lg:py-24">
        <div><div className="mb-5 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm">Gratis stack · ingen AI-drift · regelbaseret matching</div><h1 className="max-w-4xl text-4xl font-black leading-[.98] tracking-[-0.045em] text-[#071527] md:text-7xl">Fra uklart behov til konkret digital brief.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Naetwork starter som en selvkørende, guidet platform uden AI. Kunden beskriver sit behov, platformen bygger en standardiseret brief, og opgaven kan matches med relevante providers via regler.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button onClick={() => open("intake")}>Beskriv dit behov</Button><Button secondary onClick={() => open("provider")}>Ansøg som provider</Button></div></div>
        <Panel dark className="lg:p-8"><p className="text-sm font-black uppercase tracking-[.2em] text-emerald-200">Sprint 1 flow</p><h2 className="mt-3 text-3xl font-black tracking-tight">Guidet intake → brief → gemt lead → email</h2><div className="mt-6 grid gap-3">{["Ingen AI-kald og ingen AI-omkostning", "Brief bygges med kategori, skabeloner og regler", "Submissions gemmes i Supabase, når env vars er sat", "Du får email via Resend, når der kommer leads"].map((item) => <div key={item} className="rounded-2xl bg-white/10 p-4 text-sm font-semibold leading-6 text-white/85 ring-1 ring-white/10">{item}</div>)}</div></Panel>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-8"><div className="grid gap-4 md:grid-cols-4">{quality.map((item) => <Panel key={item} className="min-h-[104px]"><p className="text-sm font-bold leading-6 text-slate-700">{item}</p></Panel>)}</div></section>
      <section className="mx-auto max-w-7xl px-5 py-14"><div className="grid gap-8 lg:grid-cols-[.76fr_1.24fr]"><div><Eyebrow>Prøv et eksempel</Eyebrow><h2 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Se hvordan behov bliver til brief.</h2><p className="mt-4 text-slate-600">Eksemplerne bruger faste regler — ikke AI.</p></div><div className="grid gap-4 md:grid-cols-3">{examples.map((example, index) => <button key={example.need} onClick={() => { setIntake(example); open("intake"); }} className="flex min-h-[280px] flex-col justify-between rounded-[24px] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"><div><p className="text-xs font-black uppercase tracking-[.18em] text-[#3f8f83]">Eksempel {index + 1}</p><h3 className="mt-3 font-black text-[#071527]">{example.category}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{example.need}</p></div><span className="mt-5 inline-flex w-fit rounded-full bg-[#071527] px-4 py-2 text-xs font-black text-white">Se brief</span></button>)}</div></div></section>
    </>}

    {view === "intake" && <section className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[.9fr_1.1fr]">
      <Panel><Eyebrow>Guidet intake</Eyebrow><h1 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Beskriv behovet</h1><p className="mt-3 text-sm leading-6 text-slate-600">Platformen bygger briefen automatisk ud fra kategori, scope og faste regler.</p><form onSubmit={submitLead} className="mt-6 grid gap-4"><div className="grid gap-2"><p className="text-sm font-bold text-slate-700">Kategori</p><div className="flex flex-wrap gap-2">{categories.map((item) => <button key={item.name} type="button" onClick={() => setIntake({ ...intake, category: item.name })} className={cx("rounded-full border px-4 py-2 text-sm font-black", intake.category === item.name ? "border-[#071527] bg-[#071527] text-white" : "border-slate-200 bg-white text-slate-700")}>{item.name}</button>)}</div></div><Field label="Hvad har du brug for hjælp til?"><Textarea name="need" value={intake.need} onChange={updateIntake} rows={5} /></Field><Field label="Hvem skal bruge løsningen?"><Textarea name="audience" value={intake.audience} onChange={updateIntake} rows={3} /></Field><Field label="Hvad skal første version kunne?"><Textarea name="mustHave" value={intake.mustHave} onChange={updateIntake} rows={4} /></Field><Field label="Eksempler eller ønsket stil"><Textarea name="inspiration" value={intake.inspiration} onChange={updateIntake} rows={3} /></Field><div className="grid gap-4 md:grid-cols-2"><Field label="Budgetniveau"><Input name="budget" value={intake.budget} onChange={updateIntake} /></Field><Field label="Ønsket deadline"><Input name="deadline" value={intake.deadline} onChange={updateIntake} /></Field></div><div className="grid gap-4 md:grid-cols-2"><Field label="Navn"><Input name="name" value={intake.name} onChange={updateIntake} /></Field><Field label="Email"><Input name="email" value={intake.email} onChange={updateIntake} type="email" /></Field></div><Button type="submit" disabled={leadStatus === "sending"}>{leadStatus === "sending" ? "Sender..." : "Send behov"}</Button>{leadStatus === "success" && <p className="rounded-2xl bg-emerald-50 p-4 text-sm font-black text-emerald-800">Behov modtaget. Uden env vars kører det i demo-mode; med Supabase/Resend gemmes og sendes det live.</p>}{leadStatus === "error" && <p className="rounded-2xl bg-red-50 p-4 text-sm font-black text-red-800">Noget gik galt. Tjek at felterne er udfyldt.</p>}</form></Panel>
      <Panel><div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5"><div><Eyebrow>Automatisk brief</Eyebrow><h2 className="mt-3 text-3xl font-black tracking-tight text-[#071527]">{brief.title}</h2></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">Uden AI</span></div><div className="mt-6 grid gap-4 md:grid-cols-3">{[["Kategori", brief.category], ["Budget", brief.budget], ["Deadline", brief.deadline]].map(([label, value]) => <div key={label} className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-[.18em] text-slate-400">{label}</p><p className="mt-2 text-sm font-black text-slate-900">{value}</p></div>)}</div><div className="mt-5 flex flex-wrap items-start content-start gap-2">{brief.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div><div className="mt-6 grid gap-6 md:grid-cols-2"><div><h3 className="font-black">Scope</h3><ul className="mt-3 grid gap-2">{brief.scope.map((item) => <li key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</li>)}</ul><h3 className="mt-6 font-black">Ikke inkluderet</h3><ul className="mt-3 grid gap-2">{brief.notIncluded.map((item) => <li key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</li>)}</ul></div><div><h3 className="font-black">Acceptkriterier</h3><ul className="mt-3 grid gap-2">{brief.acceptance.map((item) => <li key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</li>)}</ul><h3 className="mt-6 font-black">Match-regler</h3><ul className="mt-3 grid gap-2">{brief.matchRules.map((item) => <li key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</li>)}</ul></div></div></Panel>
    </section>}

    {view === "provider" && <section className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[.9fr_1.1fr]">
      <Panel><Eyebrow>Provider signup</Eyebrow><h1 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Ansøg som provider</h1><p className="mt-3 text-sm leading-6 text-slate-600">Provider-data gemmes i Supabase, når env vars er sat.</p><form onSubmit={submitProvider} className="mt-6 grid gap-4"><Input name="name" value={provider.name} onChange={updateProvider} placeholder="Navn" /><Input name="email" value={provider.email} onChange={updateProvider} type="email" placeholder="Email" /><Input name="company" value={provider.company} onChange={updateProvider} placeholder="Firma" /><Textarea name="skills" value={provider.skills} onChange={updateProvider} rows={4} placeholder="Kompetencer" /><Input name="priceLevel" value={provider.priceLevel} onChange={updateProvider} placeholder="Prisniveau" /><Input name="capacity" value={provider.capacity} onChange={updateProvider} placeholder="Kapacitet pr. måned" /><Textarea name="portfolio" value={provider.portfolio} onChange={updateProvider} rows={3} placeholder="Cases/links" /><Button type="submit" disabled={providerStatus === "sending"}>{providerStatus === "sending" ? "Sender..." : "Send ansøgning"}</Button>{providerStatus === "success" && <p className="rounded-2xl bg-emerald-50 p-4 text-sm font-black text-emerald-800">Provider-ansøgning modtaget.</p>}{providerStatus === "error" && <p className="rounded-2xl bg-red-50 p-4 text-sm font-black text-red-800">Noget gik galt. Tjek navn, email og kompetencer.</p>}</form></Panel>
      <Panel><h2 className="text-2xl font-black text-[#071527]">Regelbaseret matching senere</h2><div className="mt-5 grid gap-3">{["Provider skills matcher brief-tags", "Prisniveau matcher kundens budget", "Kapacitet matcher deadline", "Kategori matcher providerens opgavetyper"].map((item) => <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">{item}</div>)}</div></Panel>
    </section>}

    {view === "setup" && <section className="mx-auto max-w-7xl px-5 py-10"><Eyebrow>Gratis Sprint 1 setup</Eyebrow><h1 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Hvad er klar nu?</h1><p className="mt-3 max-w-3xl text-slate-600">Koden er klar til at køre uden AI. For rigtig lagring og emails skal gratis Supabase/Resend keys sættes i Vercel.</p><div className="mt-8 grid gap-4 md:grid-cols-4">{quality.map((item) => <Panel key={item}><p className="text-sm font-bold leading-6 text-slate-700">{item}</p></Panel>)}</div><Panel className="mt-6"><h2 className="text-2xl font-black text-[#071527]">Næste manuelle opsætning én gang</h2><div className="mt-5 grid gap-3 md:grid-cols-2">{["Opret Supabase Free project", "Kør supabase/schema.sql", "Opret Resend Free API key", "Sæt env vars i Vercel", "Redeploy projektet", "Test consumer og provider forms"].map((item) => <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">{item}</div>)}</div></Panel></section>}
    <footer className="mx-auto max-w-7xl px-5 py-10 text-sm text-slate-500"><div className="border-t border-slate-200 pt-6">Naetwork · Sprint 1 uden AI · Gratis stack med Vercel, Supabase og Resend.</div></footer>
  </main>;
}
