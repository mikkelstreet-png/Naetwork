'use client';

import { type ChangeEvent, type FormEvent, useMemo, useState } from "react";

type View = "home" | "intake" | "provider" | "consumer" | "providerDash" | "admin";

type FormState = {
  name: string;
  email: string;
  type: string;
  company: string;
  need: string;
  audience: string;
  functionality: string;
  inspiration: string;
  deadline: string;
  budget: string;
};

type Provider = {
  name: string;
  role: string;
  skills: string[];
  price: string;
};

const providers: Provider[] = [
  { name: "Nordic Web Studio", role: "Hjemmesider, landing pages og bookingflows", skills: ["Hjemmeside", "Landing page", "Kontaktformular", "Booking", "SEO", "UX/UI"], price: "Fastpris fra 8.000 kr." },
  { name: "FlowOps Pro", role: "Automations, AI-workflows og interne tools", skills: ["Automation", "Make", "Zapier", "AI-workflow", "Google Sheets", "Internt tool"], price: "750-950 kr./time" },
  { name: "DataLight Consulting", role: "Dashboards, rapporter og dataklargøring", skills: ["Dashboard", "Power BI", "Rapport", "Data cleanup", "Excel", "KPI"], price: "Fastpris fra 12.000 kr." },
  { name: "Product Sprint DK", role: "Små webapps, MVP’er og digitale produkter", skills: ["Webapp", "Frontend", "Backend light", "Produkt", "UX/UI", "Handover"], price: "Fastpris fra 20.000 kr." }
];

const initialForm: FormState = {
  name: "",
  email: "",
  type: "Virksomhed",
  company: "",
  need: "Jeg har en lille virksomhed og skal bruge en hjemmeside med priser, kontaktformular og booking.",
  audience: "Potentielle kunder, der skal forstå ydelser og booke en tid.",
  functionality: "Forside, ydelser, priser, bookingformular, kontaktformular og mulighed for selv at rette tekst.",
  inspiration: "Nordisk, simpel og professionel stil.",
  deadline: "Inden for 3-4 uger",
  budget: "10.000-25.000 kr."
};

const helpItems = ["Simple hjemmesider", "Landing pages", "Webapps", "Interne tools", "Dashboards", "Rapporter", "Excel/Google Sheets automation", "Power BI/light dashboards", "AI-workflows", "Make/Zapier automations", "Pitch decks", "Data cleanup", "Små digitale produkter", "Idéafklaring"];

const statuses = ["Kladde", "Klar til matching", "Matcher med pro’s", "Tilbud modtaget", "Provider valgt", "I gang", "Leveret", "Ændringer ønsket", "Godkendt", "Afsluttet"];

const faq = [
  ["Hvad kan jeg få hjælp til?", "Små digitale løsninger som hjemmesider, automations, dashboards, rapporter, pitch decks, AI-workflows og simple webapps."],
  ["Hvordan fungerer matching?", "Naetwork omsætter dit behov til en brief og matcher den mod provideres kompetencer. I MVP’en kan admin også kvalitetssikre og matche manuelt."],
  ["Hvem leverer løsningen?", "Godkendte digitale pro’s: freelancere, konsulenter, små bureauer eller specialister med relevante cases."],
  ["Hvad koster det?", "Prisen afhænger af scope. MVP’en viser budgetniveauer, men endeligt tilbud kommer fra provider."],
  ["Kan jeg afvise tilbud?", "Ja. Du kan vælge, afvise eller bede om justeringer. Du skal ikke selv browse hundredvis af profiler."],
  ["Hvordan sikres kvalitet?", "Briefen har acceptkriterier, handover og mulighed for ændringer. Admin kan senere tilbyde kvalitetssikring."],
  ["Kan jeg blive provider?", "Ja. Du kan oprette en profil med kompetencer, cases, prisniveau og ønskede opgavetyper. Nye providers står som pending approval."],
  ["Er platformen live?", "Dette er en realistisk early access-MVP uden falske brugertal, testimonials eller overdrevne claims."]
];

function has(text: string, words: string[]) {
  const value = text.toLowerCase();
  return words.some((word) => value.includes(word));
}

function tagsFrom(form: FormState) {
  const text = `${form.need} ${form.functionality} ${form.inspiration}`;
  const tags: string[] = [];
  if (has(text, ["hjemmeside", "website", "kontakt", "booking", "side"])) tags.push("Hjemmeside", "Kontaktformular", "Booking", "SEO", "UX/UI");
  if (has(text, ["landing", "kampagne", "lead"])) tags.push("Landing page", "Kontaktformular", "UX/UI");
  if (has(text, ["webapp", "app", "portal", "login", "produkt"])) tags.push("Webapp", "Frontend", "Backend light", "Produkt");
  if (has(text, ["dashboard", "power bi", "rapport", "kpi", "data"])) tags.push("Dashboard", "Power BI", "Rapport", "Data cleanup");
  if (has(text, ["excel", "sheets", "ark", "regneark"])) tags.push("Excel", "Google Sheets", "Data cleanup");
  if (has(text, ["zapier", "make", "automation", "automatisere", "workflow"])) tags.push("Automation", "Make", "Zapier", "AI-workflow");
  if (has(text, ["ai", "prompt", "chatgpt", "claude"])) tags.push("AI-workflow", "Prompt setup", "Handover");
  if (has(text, ["pitch", "deck", "slides", "præsentation"])) tags.push("Pitch deck", "Rapport", "UX/UI");
  return Array.from(new Set(tags.length ? tags : ["Idéafklaring", "UX/UI", "Handover"]));
}

function categoryFrom(tags: string[]) {
  if (tags.includes("Hjemmeside")) return "Hjemmeside";
  if (tags.includes("Webapp")) return "Webapp";
  if (tags.includes("Dashboard")) return "Dashboard";
  if (tags.includes("Automation")) return "Automation";
  if (tags.includes("Pitch deck")) return "Pitch deck";
  return "Idéafklaring";
}

function matchScore(provider: Provider, tags: string[]) {
  const hits = provider.skills.filter((skill) => tags.some((tag) => tag.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(tag.toLowerCase())));
  return { hits, score: Math.min(96, 55 + hits.length * 11) };
}

function briefFrom(form: FormState) {
  const tags = tagsFrom(form);
  const category = categoryFrom(tags);
  const title = category === "Hjemmeside" ? "Simpel hjemmeside med booking og kontaktformular" : category === "Dashboard" ? "Let dashboard og rapporteringsflow" : category === "Automation" ? "Automatiseret workflow med klar handover" : category === "Webapp" ? "Simpel webapp/MVP med tydeligt scope" : "Digital løsning gjort konkret fra idé til brief";
  const scope = category === "Hjemmeside" ? ["Forside", "Om/ydelser og priser", "Booking- eller kontaktflow", "Mobiloptimering", "Basal SEO", "Kort handover"] : category === "Dashboard" ? ["Dataklargøring", "Dashboardstruktur", "3-6 centrale KPI’er", "Let rapportvisning", "Dokumenteret opdateringsflow", "Kort handover"] : category === "Automation" ? ["Kortlægning af workflow", "Opsætning af automation", "Test af trigger/action-flow", "Fejlhåndtering på basisniveau", "Dokumentation", "Kort handover"] : ["Afklaring af behov", "Professionel projektbrief", "Anbefalet scope", "Acceptkriterier", "Provider-match", "Næste skridt"];
  const matches = providers.map((provider) => ({ provider, ...matchScore(provider, tags) })).sort((a, b) => b.score - a.score).slice(0, 3);
  return {
    title,
    category,
    tags,
    scope,
    matches,
    complexity: tags.length > 5 ? "Medium" : "Lav til medium",
    delivery: form.deadline || "Typisk 1-4 uger",
    budget: form.budget || "Afklares via tilbud",
    summary: form.need,
    questions: ["Hvad er det vigtigste resultat, løsningen skal skabe?", "Har du tekst, data, billeder eller materiale klar?", "Hvem skal kunne redigere eller bruge løsningen efter levering?", "Er der noget, der eksplicit ikke skal være med i første version?", "Hvilke eksempler rammer den ønskede stil?"],
    notIncluded: ["Avanceret custom backend", "Betalingsløsning med fuld integration", "Custom CRM", "Løbende drift og support", "Større brandstrategi"],
    acceptance: ["Løsningen fungerer på mobil og desktop", "Kerneflowet er tydeligt", "Leverancen matcher den godkendte brief", "Kunden får kort dokumentation/handover", "Eventuelle ændringer samles struktureret"]
  };
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">{children}</span>;
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm ${className}`}>{children}</div>;
}

function Input({ label, name, value, onChange, type = "text" }: { label: string; name: string; value?: string; onChange?: (event: ChangeEvent<HTMLInputElement>) => void; type?: string }) {
  return <label className="grid gap-2 text-sm font-semibold text-slate-700">{label}<input type={type} name={name} value={value} onChange={onChange} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-[#3f8f83]" /></label>;
}

function Textarea({ label, name, value, onChange, placeholder }: { label: string; name: string; value?: string; onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string }) {
  return <label className="grid gap-2 text-sm font-semibold text-slate-700">{label}<textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows={4} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-[#3f8f83]" /></label>;
}

function Select({ label, name, value, onChange, options }: { label: string; name: string; value?: string; onChange?: (event: ChangeEvent<HTMLSelectElement>) => void; options: string[] }) {
  return <label className="grid gap-2 text-sm font-semibold text-slate-700">{label}<select name={name} value={value} onChange={onChange} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-[#3f8f83]">{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

function SectionList({ title, items }: { title: string; items: string[] }) {
  return <div className="mt-6"><h3 className="font-black text-slate-950">{title}</h3><ul className="mt-3 grid gap-2">{items.map((item) => <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{item}</li>)}</ul></div>;
}

function DashboardHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return <div className="mb-6"><p className="text-sm font-bold uppercase tracking-[.2em] text-[#3f8f83]">Naetwork MVP</p><h1 className="mt-2 text-4xl font-black tracking-tight text-[#071527]">{title}</h1><p className="mt-2 text-slate-600">{subtitle}</p></div>;
}

export function NaetworkMvp() {
  const [view, setView] = useState<View>("home");
  const [form, setForm] = useState<FormState>(initialForm);
  const [brief, setBrief] = useState(() => briefFrom(initialForm));
  const [approved, setApproved] = useState(false);
  const [providerSubmitted, setProviderSubmitted] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("Nordic Web Studio");
  const [projectStatus, setProjectStatus] = useState("Tilbud modtaget");
  const [adminMatch, setAdminMatch] = useState("Product Sprint DK");

  const commission = useMemo(() => (form.budget.includes("25") ? 4500 : 2700).toLocaleString("da-DK"), [form.budget]);
  const update = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setBrief(briefFrom(form)); setApproved(false); };
  const nav = (target: View, label: string) => <button onClick={() => setView(target)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${view === target ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"}`}>{label}</button>;

  return <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
        <button onClick={() => setView("home")} className="flex items-center gap-3 text-left"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">N</span><span><span className="block text-lg font-black tracking-tight">Naetwork</span><span className="block text-xs text-slate-500">AI-intake · kurateret matching</span></span></button>
        <nav className="hidden items-center gap-1 lg:flex">{nav("home", "Forside")}{nav("intake", "Beskriv behov")}{nav("provider", "Bliv provider")}{nav("consumer", "Consumer")}{nav("providerDash", "Provider")}{nav("admin", "Admin")}</nav>
        <button onClick={() => setView("intake")} className="rounded-full bg-[#3f8f83] px-5 py-3 text-sm font-black text-white shadow-sm">Beskriv dit behov</button>
      </div>
    </header>

    {view === "home" && <>
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
        <div><div className="mb-5 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm">Early access · ingen falske brugertal · semi-manuel kvalitetssikring</div><h1 className="max-w-4xl text-5xl font-black leading-[.96] tracking-[-0.05em] text-[#071527] md:text-7xl">Beskriv dit behov. Bliv matchet med den rette specialist.</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">Naetwork hjælper private og virksomheder med at få bygget simple digitale løsninger. Du beskriver, hvad du har brug for — så hjælper AI med at gøre det konkret og matcher dig med relevante pro’s.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><button onClick={() => setView("intake")} className="rounded-full bg-[#071527] px-7 py-4 font-black text-white shadow-lg shadow-slate-900/10">Beskriv dit behov</button><button onClick={() => setView("provider")} className="rounded-full border border-slate-300 bg-white px-7 py-4 font-black text-slate-800">Bliv provider</button></div><p className="mt-6 max-w-xl text-sm text-slate-500">Bygget til små virksomheder, selvstændige og teams, der har brug for hurtig digital eksekvering — uden at starte et stort bureauprojekt.</p></div>
        <Panel className="bg-[#071527] text-white"><div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/10"><p className="text-sm font-bold text-emerald-200">Eksempel på AI-intake</p><p className="mt-3 rounded-2xl bg-white p-4 text-slate-800">“Jeg har en lille virksomhed og skal bruge en hjemmeside med priser, kontaktformular og booking.”</p></div><div className="mt-5 grid gap-3">{["AI stiller 3-5 korte spørgsmål", "Brief med scope og acceptkriterier", "1-3 relevante pro’s matches", "Admin kan kvalitetssikre manuelt"].map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 text-sm text-white/85 ring-1 ring-white/10"><span className="h-2 w-2 rounded-full bg-[#7fd3c7]" />{item}</div>)}</div></Panel>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-10"><div className="grid gap-4 md:grid-cols-5">{["Beskriv dit behov", "AI gør det konkret", "Bliv matchet med pro’s", "Vælg tilbud", "Få løsningen leveret"].map((step, index) => <Panel key={step}><div className="text-sm font-black text-[#3f8f83]">0{index + 1}</div><div className="mt-4 font-black text-slate-900">{step}</div></Panel>)}</div></section>
      <section className="mx-auto max-w-7xl px-5 py-10"><div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-sm font-black uppercase tracking-[.2em] text-[#3f8f83]">Hvad du kan få hjælp til</p><h2 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Små digitale løsninger, gjort konkrete.</h2><p className="mt-4 text-slate-600">Ikke en klassisk freelance marketplace. Kunden skal ikke browse profiler, forstå timepriser eller skrive tekniske krav.</p></div><div className="flex flex-wrap gap-2">{helpItems.map((item) => <Badge key={item}>{item}</Badge>)}</div></div></section>
      <section className="mx-auto max-w-7xl px-5 py-10"><div className="grid gap-6 md:grid-cols-3"><Panel><h3 className="text-xl font-black">For consumers</h3><p className="mt-3 text-slate-600">Skriv frit, få AI-brief, godkend scope, modtag 1-3 tilbud og følg leverancen ét sted.</p></Panel><Panel><h3 className="text-xl font-black">For providers</h3><p className="mt-3 text-slate-600">Få relevante opgaver matchet til dine kompetencer i stedet for at drukne i irrelevante leads.</p></Panel><Panel><h3 className="text-xl font-black">For admin</h3><p className="mt-3 text-slate-600">Styr provider-approval, manuel matching, projektstatus, pipeline og potentiel kommission.</p></Panel></div></section>
      <section className="mx-auto max-w-7xl px-5 py-10"><Panel className="bg-slate-950 text-white"><div className="grid gap-8 lg:grid-cols-[1fr_.8fr]"><div><p className="text-sm font-black uppercase tracking-[.2em] text-emerald-200">Hvorfor Naetwork</p><h2 className="mt-3 text-4xl font-black tracking-tight">Få bygget simple digitale løsninger uden bureau, lange møder eller uklart scope.</h2><p className="mt-4 text-white/65">Start klart med AI-intake + manuel matching. Det gør platformen hurtig at bygge, men stadig stærk at vise frem.</p></div><div className="grid gap-3">{["Premium og kurateret", "Dansk og nordisk design", "Konkret scope før tilbud", "Semi-manuel kvalitet i MVP", "Bygget uden falske claims"].map((item) => <div key={item} className="rounded-2xl bg-white/10 p-4 text-sm ring-1 ring-white/10">{item}</div>)}</div></div></Panel></section>
      <section className="mx-auto max-w-7xl px-5 py-10"><h2 className="text-3xl font-black tracking-tight text-[#071527]">FAQ</h2><div className="mt-5 grid gap-4 md:grid-cols-2">{faq.map(([q, a]) => <Panel key={q}><h3 className="font-black">{q}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{a}</p></Panel>)}</div></section>
    </>}

    {view === "intake" && <section className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[.9fr_1.1fr]"><Panel><p className="text-sm font-black uppercase tracking-[.2em] text-[#3f8f83]">Consumer onboarding</p><h1 className="mt-3 text-4xl font-black tracking-tight">Beskriv dit behov</h1><form onSubmit={submit} className="mt-6 grid gap-4"><div className="grid gap-3 md:grid-cols-2"><Input label="Navn" name="name" value={form.name} onChange={update} /><Input label="Email" name="email" value={form.email} onChange={update} type="email" /></div><div className="grid gap-3 md:grid-cols-2"><Select label="Privatperson eller virksomhed" name="type" value={form.type} onChange={update} options={["Privatperson", "Virksomhed", "Startup", "Selvstændig"]} /><Input label="Virksomhedsnavn" name="company" value={form.company} onChange={update} /></div><Textarea label="Hvad har du brug for hjælp til?" name="need" value={form.need} onChange={update} /><Textarea label="Hvem skal bruge løsningen?" name="audience" value={form.audience} onChange={update} /><Textarea label="Hvad skal løsningen kunne?" name="functionality" value={form.functionality} onChange={update} /><Textarea label="Har du eksempler eller inspiration?" name="inspiration" value={form.inspiration} onChange={update} /><div className="grid gap-3 md:grid-cols-2"><Input label="Ønsket deadline" name="deadline" value={form.deadline} onChange={update} /><Select label="Budgetniveau" name="budget" value={form.budget} onChange={update} options={["Under 10.000 kr.", "10.000-25.000 kr.", "25.000-50.000 kr.", "50.000+ kr.", "Afklares"]} /></div><div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">Må AI stille opklarende spørgsmål? <strong className="text-slate-900">Ja — 3-5 korte spørgsmål</strong></div><button className="rounded-full bg-[#071527] px-6 py-4 font-black text-white">Generér AI-brief</button></form></Panel><Panel><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-black uppercase tracking-[.2em] text-[#3f8f83]">AI-genereret brief</p><h2 className="mt-3 text-3xl font-black tracking-tight">{brief.title}</h2></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-800">{approved ? "Godkendt" : "Klar til review"}</span></div><p className="mt-4 text-slate-600">{brief.summary}</p><div className="mt-5 flex flex-wrap gap-2">{brief.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div><div className="mt-6 grid gap-4 md:grid-cols-3">{[["Kategori", brief.category], ["Kompleksitet", brief.complexity], ["Leveringstid", brief.delivery]].map(([label, value]) => <div key={label} className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-[.18em] text-slate-400">{label}</p><p className="mt-2 font-black text-slate-900">{value}</p></div>)}</div><SectionList title="Opklarende spørgsmål" items={brief.questions} /><SectionList title="Scope" items={brief.scope} /><SectionList title="Ikke inkluderet" items={brief.notIncluded} /><SectionList title="Acceptkriterier" items={brief.acceptance} /><div className="mt-6 flex flex-col gap-3 sm:flex-row"><button onClick={() => setApproved(true)} className="rounded-full border border-slate-300 px-5 py-3 font-black">Godkend brief</button><button className="rounded-full border border-slate-300 px-5 py-3 font-black">Rediger brief</button><button className="rounded-full border border-slate-300 px-5 py-3 font-black">Gem som kladde</button><button onClick={() => { setApproved(true); setProjectStatus("Matcher med pro’s"); setView("consumer"); }} className="rounded-full bg-[#071527] px-5 py-3 font-black text-white">Send til matching</button></div></Panel></section>}

    {view === "provider" && <section className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[.9fr_1.1fr]"><Panel><p className="text-sm font-black uppercase tracking-[.2em] text-[#3f8f83]">Provider onboarding</p><h1 className="mt-3 text-4xl font-black tracking-tight">Bliv provider</h1><form onSubmit={(e) => { e.preventDefault(); setProviderSubmitted(true); }} className="mt-6 grid gap-4"><div className="grid gap-3 md:grid-cols-2"><Input label="Navn" name="proName" /><Input label="Email" name="proEmail" type="email" /></div><Select label="Person/firma" name="proType" options={["Person", "Freelancer", "Konsulent", "Lille virksomhed"]} /><Textarea label="Kompetencer" name="skills" placeholder="Fx hjemmesider, automations, dashboards, AI-workflows" /><Textarea label="Erfaring" name="experience" /><Textarea label="Cases/portfolio" name="cases" /><div className="grid gap-3 md:grid-cols-2"><Input label="LinkedIn" name="linkedin" /><Input label="GitHub/website" name="github" /></div><div className="grid gap-3 md:grid-cols-2"><Select label="Prisniveau" name="price" options={["Fastpris", "500-750 kr./time", "750-1.000 kr./time", "1.000+ kr./time"]} /><Select label="Maks aktive opgaver" name="capacity" options={["1", "2", "3", "4+"]} /></div><Textarea label="Hvad er du særligt god til?" name="bio" /><button className="rounded-full bg-[#071527] px-6 py-4 font-black text-white">Send provider-ansøgning</button></form></Panel><div className="grid gap-4"><Panel><h2 className="text-2xl font-black">Provider-status</h2><div className="mt-4 grid gap-3">{["Pending approval", "Approved", "Rejected", "Verified later"].map((s, i) => <div key={s} className={`rounded-2xl p-4 text-sm font-black ${i === 0 || providerSubmitted ? "bg-emerald-50 text-emerald-800" : "bg-slate-50 text-slate-600"}`}>{s}</div>)}</div></Panel><Panel><h3 className="font-black">Hvad providers får</h3><p className="mt-2 text-sm leading-6 text-slate-600">Relevante briefs, match-score, forklaring på match, mulighed for at acceptere/afvise, sende tilbud, kommunikere med kunden og aflevere løsning.</p></Panel></div></section>}

    {view === "consumer" && <section className="mx-auto max-w-7xl px-5 py-10"><DashboardHeader title="Consumer dashboard" subtitle="Mine opgaver, brief, matches, tilbud, beskeder, leverance og rating." /><div className="grid gap-6 lg:grid-cols-[.75fr_1.25fr]"><Panel><h3 className="font-black">Mine opgaver</h3><div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-black text-emerald-800">Status: {projectStatus}</div><div className="mt-4 rounded-2xl bg-slate-50 p-4"><p className="font-black">{brief.title}</p><p className="mt-1 text-sm text-slate-600">{brief.category} · {brief.budget} · {brief.delivery}</p></div><button onClick={() => setProjectStatus("Leveret")} className="mt-4 w-full rounded-full bg-[#071527] px-5 py-3 font-black text-white">Marker som leveret</button></Panel><Panel><h3 className="text-2xl font-black">Tilbud og matches</h3><div className="mt-4 grid gap-4">{brief.matches.map((match) => <div key={match.provider.name} className={`rounded-3xl border p-5 ${selectedProvider === match.provider.name ? "border-[#3f8f83] bg-emerald-50" : "border-slate-200 bg-white"}`}><div className="flex items-start justify-between gap-4"><div><h4 className="font-black">{match.provider.name}</h4><p className="mt-1 text-sm text-slate-600">{match.provider.role}</p></div><span className="rounded-full bg-white px-3 py-1 text-sm font-black text-[#3f8f83]">{match.score}%</span></div><p className="mt-3 text-sm text-slate-600">Matcher fordi provider har erfaring med {match.hits.slice(0, 3).join(", ").toLowerCase() || "relevante digitale løsninger"}.</p><div className="mt-3 flex flex-wrap gap-2">{match.provider.skills.slice(0, 5).map((skill) => <Badge key={skill}>{skill}</Badge>)}</div><div className="mt-4 flex items-center justify-between gap-4"><p className="text-sm font-black text-slate-900">{match.provider.price}</p><button onClick={() => { setSelectedProvider(match.provider.name); setProjectStatus("Provider valgt"); }} className="rounded-full bg-[#071527] px-4 py-2 text-sm font-black text-white">Vælg provider</button></div></div>)}</div></Panel></div><div className="mt-6 grid gap-6 lg:grid-cols-2"><Panel><h3 className="font-black">Beskeder</h3><p className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">Provider: “Tak for briefen — jeg kan levere første version inden for 3 uger og inkluderer kort handover.”</p></Panel><Panel><h3 className="font-black">Leverance</h3><p className="mt-3 text-sm text-slate-600">Status: {projectStatus === "Leveret" ? "Leverance modtaget — klar til godkendelse." : "Afventer provider-leverance."}</p><div className="mt-4 flex gap-3"><button onClick={() => setProjectStatus("Godkendt")} className="rounded-full bg-[#3f8f83] px-5 py-3 text-sm font-black text-white">Godkend</button><button onClick={() => setProjectStatus("Ændringer ønsket")} className="rounded-full border border-slate-300 px-5 py-3 text-sm font-black">Bed om ændringer</button></div></Panel></div></section>}

    {view === "providerDash" && <section className="mx-auto max-w-7xl px-5 py-10"><DashboardHeader title="Provider dashboard" subtitle="Nye relevante opgaver, briefs, match-score, tilbud, deadlines og ratings." /><div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]"><Panel><h3 className="text-2xl font-black">Nye relevante opgaver</h3><div className="mt-4 grid gap-4">{brief.matches.map((match) => <div key={match.provider.name} className="rounded-3xl border border-slate-200 p-5"><div className="flex items-start justify-between gap-4"><div><p className="font-black">{brief.title}</p><p className="mt-1 text-sm text-slate-600">Matcher fordi provider har erfaring med {match.hits.slice(0, 3).join(", ").toLowerCase() || "relevante digitale løsninger"}.</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-800">{match.score}%</span></div><div className="mt-4 flex gap-2"><button className="rounded-full bg-[#071527] px-4 py-2 text-sm font-black text-white">Send tilbud</button><button className="rounded-full border border-slate-300 px-4 py-2 text-sm font-black">Afvis</button></div></div>)}</div></Panel><Panel><h3 className="text-2xl font-black">Aktive projekter</h3><div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-black text-emerald-800">Status: I gang</div><p className="mt-4 text-sm leading-6 text-slate-600">Deadline: {brief.delivery}. Fokus: leverance mod acceptkriterier og kort handover-tekst til kunden.</p><div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">AI-handover: “Løsningen er afleveret med kort guide til redigering, test af kerneflow og oversigt over næste mulige forbedringer.”</div></Panel></div></section>}

    {view === "admin" && <section className="mx-auto max-w-7xl px-5 py-10"><DashboardHeader title="Admin dashboard" subtitle="Styr matching, kvalitet, provider approval, pipeline og potentiel platformskommission." /><div className="grid gap-4 md:grid-cols-4">{[["Alle opgaver", "1"], ["Providers", "4"], ["Pending approvals", providerSubmitted ? "1" : "0"], ["Potentiel kommission", `${commission} kr.`]].map(([label, value]) => <Panel key={label}><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-black">{value}</p></Panel>)}</div><div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]"><Panel><h3 className="text-2xl font-black">Manuel match-funktion</h3><p className="mt-2 text-sm text-slate-600">AI foreslår matches, men admin kan kvalitetssikre og tilføje providers manuelt.</p><div className="mt-4 grid gap-3"><Select label="Vælg provider" name="adminMatch" value={adminMatch} onChange={(e) => setAdminMatch(e.target.value)} options={providers.map((provider) => provider.name)} /><button onClick={() => setProjectStatus("Matcher med pro’s")} className="rounded-full bg-[#071527] px-5 py-3 font-black text-white">Match opgave med provider</button></div></Panel><Panel><h3 className="text-2xl font-black">Pipeline</h3><div className="mt-4 grid gap-3">{statuses.map((status) => <div key={status} className={`rounded-2xl px-4 py-3 text-sm font-black ${projectStatus === status ? "bg-emerald-50 text-emerald-800" : "bg-slate-50 text-slate-600"}`}>{status}</div>)}</div></Panel></div></section>}
  </main>;
}
