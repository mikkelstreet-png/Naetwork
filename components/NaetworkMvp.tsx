'use client';

import { type ChangeEvent, type FormEvent, type ReactNode, useMemo, useState } from "react";

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
  title: string;
  skills: string[];
  price: string;
  availability: "Ledig" | "Begrænset" | "Ikke ledig";
  response: string;
  rating: string;
  cases: string[];
};

type Match = {
  provider: Provider;
  score: number;
  hits: string[];
  explanation: string;
};

const providers: Provider[] = [
  {
    name: "Nordic Web Studio",
    title: "Hjemmesider, landing pages og bookingflows",
    skills: ["Hjemmeside", "Landing page", "Kontaktformular", "Booking", "SEO", "UX/UI", "Handover"],
    price: "Fastpris fra 8.000 kr.",
    availability: "Ledig",
    response: "Svar typisk samme dag",
    rating: "4,8/5",
    cases: ["Konsulenthjemmeside", "Bookingflow til klinik", "Landing page til B2B-service"]
  },
  {
    name: "FlowOps Pro",
    title: "Automations, AI-workflows og interne tools",
    skills: ["Automation", "Make", "Zapier", "AI-workflow", "Google Sheets", "Internt tool", "Prompt setup"],
    price: "750-950 kr./time",
    availability: "Ledig",
    response: "Svar inden for 24 timer",
    rating: "4,7/5",
    cases: ["Gmail til Sheets-flow", "AI-klargøring af leads", "Internt statusværktøj"]
  },
  {
    name: "DataLight Consulting",
    title: "Dashboards, rapporter og dataklargøring",
    skills: ["Dashboard", "Power BI", "Rapport", "Data cleanup", "Excel", "KPI", "Google Sheets"],
    price: "Fastpris fra 12.000 kr.",
    availability: "Begrænset",
    response: "Svar inden for 2 dage",
    rating: "4,9/5",
    cases: ["KPI-dashboard", "Excel cleanup", "Ledelsesrapport light"]
  },
  {
    name: "Product Sprint DK",
    title: "Små webapps, MVP’er og digitale produkter",
    skills: ["Webapp", "Frontend", "Backend light", "Produkt", "UX/UI", "Handover", "Dashboard"],
    price: "Fastpris fra 20.000 kr.",
    availability: "Begrænset",
    response: "Svar inden for 48 timer",
    rating: "4,6/5",
    cases: ["MVP til founder", "Internt adminpanel", "Prototype til salgsmøde"]
  }
];

const demoCases: { label: string; description: string; form: FormState }[] = [
  {
    label: "Hjemmeside til konsulent",
    description: "Priser, kontaktformular, booking og basal SEO.",
    form: {
      name: "",
      email: "",
      type: "Virksomhed",
      company: "",
      need: "Jeg er selvstændig konsulent og skal bruge en professionel hjemmeside med ydelser, priser, kontaktformular og mulighed for at booke en intro-samtale.",
      audience: "Potentielle B2B-kunder, der skal forstå hvad jeg tilbyder og hurtigt kunne kontakte mig.",
      functionality: "Forside, om mig, ydelser/priser, kontaktformular, bookinglink, mobiloptimering, basal SEO og mulighed for at rette tekst selv.",
      inspiration: "Nordisk, roligt og professionelt. Gerne lidt som Stripe/Linear, men mindre techy.",
      deadline: "Inden for 3-4 uger",
      budget: "10.000-25.000 kr."
    }
  },
  {
    label: "Dashboard til mindre virksomhed",
    description: "Excel-data, KPI’er og let månedsrapportering.",
    form: {
      name: "",
      email: "",
      type: "Virksomhed",
      company: "",
      need: "Vi har salgstal i Excel og vil gerne have et simpelt dashboard, så ledelsen kan følge omsætning, pipeline og performance pr. måned.",
      audience: "Ledelsen og 2 team leads, der ikke er tekniske.",
      functionality: "Import eller oprydning af Excel-data, 5-6 KPI’er, simpel visning, mulighed for månedlig opdatering og kort dokumentation.",
      inspiration: "Rent dashboard med tydelige nøgletal og få grafer.",
      deadline: "Inden for 2-3 uger",
      budget: "25.000-50.000 kr."
    }
  },
  {
    label: "Automation mellem Gmail og Sheets",
    description: "Lead-mails struktureres automatisk.",
    form: {
      name: "",
      email: "",
      type: "Startup",
      company: "",
      need: "Vi modtager leads på mail og vil gerne automatisk samle dem i Google Sheets, kategorisere dem og få et kort AI-resumé af hver henvendelse.",
      audience: "Founder og salgsteam, der skal følge op hurtigere.",
      functionality: "Gmail-trigger, udtræk af navn/email/besked, AI-resumé, kategori, Google Sheets-log og simpel fejlmarkering.",
      inspiration: "Det skal være robust og let at forstå, ikke et stort CRM-system.",
      deadline: "Inden for 1-2 uger",
      budget: "10.000-25.000 kr."
    }
  }
];

const initialForm: FormState = demoCases[0].form;

const helpItems = [
  "Simple hjemmesider",
  "Landing pages",
  "Webapps",
  "Interne tools",
  "Dashboards",
  "Rapporter",
  "Excel/Google Sheets automation",
  "Power BI/light dashboards",
  "AI-workflows",
  "Make/Zapier automations",
  "Pitch decks",
  "Data cleanup",
  "Små digitale produkter",
  "Idéafklaring"
];

const statuses = ["Kladde", "Klar til matching", "Matcher med pro’s", "Tilbud modtaget", "Provider valgt", "I gang", "Leveret", "Ændringer ønsket", "Godkendt", "Afsluttet"];
const wizardSteps = ["Behov", "Bruger", "Funktioner", "Ramme", "Brief"];

function includesAny(text: string, words: string[]) {
  const value = text.toLowerCase();
  return words.some((word) => value.includes(word));
}

function unique(items: string[]) {
  return Array.from(new Set(items.filter(Boolean)));
}

function tagsFrom(form: FormState) {
  const text = `${form.need} ${form.audience} ${form.functionality} ${form.inspiration}`;
  const tags: string[] = [];

  if (includesAny(text, ["hjemmeside", "website", "kontakt", "booking", "side", "seo"])) tags.push("Hjemmeside", "Kontaktformular", "Booking", "SEO", "UX/UI", "Handover");
  if (includesAny(text, ["landing", "kampagne", "lead", "konvertering"])) tags.push("Landing page", "Kontaktformular", "UX/UI");
  if (includesAny(text, ["webapp", "app", "portal", "login", "mvp", "produkt", "adminpanel"])) tags.push("Webapp", "Frontend", "Backend light", "Produkt", "UX/UI");
  if (includesAny(text, ["dashboard", "power bi", "rapport", "kpi", "ledelse", "performance", "salgstal"])) tags.push("Dashboard", "Power BI", "Rapport", "KPI", "Data cleanup");
  if (includesAny(text, ["excel", "sheets", "ark", "regneark", "data"])) tags.push("Excel", "Google Sheets", "Data cleanup");
  if (includesAny(text, ["zapier", "make", "automation", "automatisere", "workflow", "trigger"])) tags.push("Automation", "Make", "Zapier", "Google Sheets");
  if (includesAny(text, ["ai", "prompt", "chatgpt", "claude", "resumé", "kategori"])) tags.push("AI-workflow", "Prompt setup", "Handover");
  if (includesAny(text, ["pitch", "deck", "slides", "præsentation"])) tags.push("Pitch deck", "Rapport", "UX/UI");

  return unique(tags.length ? tags : ["Idéafklaring", "UX/UI", "Handover"]);
}

function categoryFrom(tags: string[]) {
  if (tags.includes("Automation")) return "Automation";
  if (tags.includes("Dashboard")) return "Dashboard";
  if (tags.includes("Webapp")) return "Webapp";
  if (tags.includes("Hjemmeside")) return "Hjemmeside";
  if (tags.includes("Pitch deck")) return "Pitch deck";
  return "Idéafklaring";
}

function titleFrom(category: string) {
  if (category === "Hjemmeside") return "Simpel hjemmeside med booking og kontaktflow";
  if (category === "Dashboard") return "Let dashboard med KPI’er og månedsrapportering";
  if (category === "Automation") return "Automation der strukturerer leads og sparer manuelt arbejde";
  if (category === "Webapp") return "Simpel webapp/MVP med tydeligt første scope";
  if (category === "Pitch deck") return "Professionelt pitch deck med klar struktur og visuel retning";
  return "Digital idé omsat til konkret projektbrief";
}

function scopeFrom(category: string) {
  if (category === "Hjemmeside") return ["Forside med tydeligt budskab", "Om/ydelser og priser", "Kontaktformular eller bookinglink", "Mobiloptimeret layout", "Basal SEO og teknisk opsætning", "Kort handover så kunden kan rette tekst"];
  if (category === "Dashboard") return ["Gennemgang og oprydning af datakilde", "Dashboardstruktur med 5-6 centrale KPI’er", "Let visuel rapportering", "Filter eller simpel segmentering", "Kort dokumentation af opdateringsflow", "Handover til månedlig brug"];
  if (category === "Automation") return ["Kortlægning af workflow", "Opsætning af trigger og actions", "Strukturering af data i Google Sheets eller tilsvarende", "AI-resumé eller kategorisering hvor relevant", "Basal fejlhåndtering", "Kort handover med drift og begrænsninger"];
  if (category === "Webapp") return ["Klikbar eller funktionel MVP", "Kerneflow for bruger", "Simpelt dashboard/adminområde", "Responsivt frontend-design", "Let backend eller mock-data", "Handover og næste udviklingsfase"];
  if (category === "Pitch deck") return ["Storyline", "Slide-struktur", "Visuel retning", "Kernebudskaber", "Design af 8-12 slides", "Handover i redigerbart format"];
  return ["Behovsafklaring", "Professionel brief", "Anbefalet MVP-scope", "Acceptkriterier", "Provider-match", "Næste skridt"];
}

function buildMatches(tags: string[]): Match[] {
  return providers
    .map((provider) => {
      const hits = provider.skills.filter((skill) => tags.some((tag) => tag.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(tag.toLowerCase())));
      const availabilityBonus = provider.availability === "Ledig" ? 8 : provider.availability === "Begrænset" ? 3 : -12;
      const score = Math.max(48, Math.min(96, 52 + hits.length * 9 + availabilityBonus));
      const explanation = hits.length
        ? `Matcher især på ${hits.slice(0, 3).join(", ").toLowerCase()} og har relevant erfaring med små digitale leverancer.`
        : "Matcher bredt på digital eksekvering, UX og handover til kunden.";
      return { provider, hits, score, explanation };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function buildBrief(form: FormState) {
  const tags = tagsFrom(form);
  const category = categoryFrom(tags);
  const scope = scopeFrom(category);
  const title = titleFrom(category);
  const firstVersion = scope.slice(0, 4);
  const matches = buildMatches(tags);

  return {
    title,
    category,
    tags,
    scope,
    matches,
    complexity: tags.length > 7 ? "Medium" : "Lav til medium",
    delivery: form.deadline || "Typisk 1-4 uger",
    budget: form.budget || "Afklares via tilbud",
    background: form.need,
    user: form.audience,
    firstVersion,
    questions: [
      "Hvad er det vigtigste resultat, løsningen skal skabe?",
      "Har du tekst, data, billeder, login eller andet materiale klar?",
      "Hvem skal kunne redigere eller bruge løsningen efter levering?",
      "Er der noget, der eksplicit ikke skal være med i første version?",
      "Hvilke eksempler rammer den ønskede stil eller funktionalitet?"
    ],
    notIncluded: ["Avanceret custom backend", "Betalingsløsning med fuld integration", "Custom CRM", "Løbende drift og support", "Større brandstrategi eller fuld enterprise-arkitektur"],
    acceptance: ["Løsningen fungerer på mobil og desktop", "Kerneflowet er tydeligt og testet", "Leverancen matcher den godkendte brief", "Kunden får kort dokumentation/handover", "Eventuelle ændringer samles struktureret før afslutning"],
    providerSummary: `Kunden søger ${category.toLowerCase()} med fokus på ${tags.slice(0, 4).join(", ").toLowerCase()}. Opgaven bør leveres som en afgrænset MVP med tydelig handover og konkrete acceptkriterier.`,
    handover: "Leverancen bør afleveres med kort guide, adgangsoversigt, test af kerneflow og anbefalede næste forbedringer."
  };
}

function Badge({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${dark ? "border-white/15 bg-white/10 text-white/80" : "border-slate-200 bg-white text-slate-700"}`}>{children}</span>;
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm ${className}`}>{children}</div>;
}

function Input({ label, name, value, onChange, type = "text" }: { label: string; name: string; value?: string; onChange?: (event: ChangeEvent<HTMLInputElement>) => void; type?: string }) {
  return <label className="grid gap-2 text-sm font-semibold text-slate-700">{label}<input type={type} name={name} value={value} onChange={onChange} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[#3f8f83] focus:ring-4 focus:ring-[#3f8f83]/10" /></label>;
}

function Textarea({ label, name, value, onChange, placeholder, rows = 4 }: { label: string; name: string; value?: string; onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string; rows?: number }) {
  return <label className="grid gap-2 text-sm font-semibold text-slate-700">{label}<textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows={rows} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[#3f8f83] focus:ring-4 focus:ring-[#3f8f83]/10" /></label>;
}

function Select({ label, name, value, onChange, options }: { label: string; name: string; value?: string; onChange?: (event: ChangeEvent<HTMLSelectElement>) => void; options: string[] }) {
  return <label className="grid gap-2 text-sm font-semibold text-slate-700">{label}<select name={name} value={value} onChange={onChange} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[#3f8f83] focus:ring-4 focus:ring-[#3f8f83]/10">{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

function SectionList({ title, items }: { title: string; items: string[] }) {
  return <div className="mt-6"><h3 className="font-black text-slate-950">{title}</h3><ul className="mt-3 grid gap-2">{items.map((item) => <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">{item}</li>)}</ul></div>;
}

function DashboardHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return <div className="mb-6"><p className="text-sm font-bold uppercase tracking-[.2em] text-[#3f8f83]">Naetwork MVP</p><h1 className="mt-2 text-4xl font-black tracking-tight text-[#071527] md:text-5xl">{title}</h1><p className="mt-2 max-w-3xl text-slate-600">{subtitle}</p></div>;
}

function PrimaryButton({ children, onClick, type = "button" }: { children: ReactNode; onClick?: () => void; type?: "button" | "submit" }) {
  return <button type={type} onClick={onClick} className="rounded-full bg-[#071527] px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-[#10233d]">{children}</button>;
}

function SecondaryButton({ children, onClick, type = "button" }: { children: ReactNode; onClick?: () => void; type?: "button" | "submit" }) {
  return <button type={type} onClick={onClick} className="rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-black text-slate-800 transition hover:-translate-y-0.5 hover:border-slate-400">{children}</button>;
}

function BriefCard({ brief, approved, onApprove, onSend }: { brief: ReturnType<typeof buildBrief>; approved: boolean; onApprove: () => void; onSend: () => void }) {
  return <Panel className="overflow-hidden">
    <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-start md:justify-between">
      <div>
        <p className="text-sm font-black uppercase tracking-[.2em] text-[#3f8f83]">AI-genereret projektbrief</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-[#071527]">{brief.title}</h2>
        <p className="mt-3 max-w-2xl text-slate-600">{brief.background}</p>
      </div>
      <span className={`w-fit rounded-full px-4 py-2 text-sm font-black ${approved ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>{approved ? "Godkendt" : "Klar til review"}</span>
    </div>

    <div className="mt-6 grid gap-4 md:grid-cols-4">
      {[["Kategori", brief.category], ["Kompleksitet", brief.complexity], ["Budgetniveau", brief.budget], ["Leveringstid", brief.delivery]].map(([label, value]) => <div key={label} className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-[.18em] text-slate-400">{label}</p><p className="mt-2 text-sm font-black text-slate-900">{value}</p></div>)}
    </div>

    <div className="mt-6 flex flex-wrap gap-2">{brief.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>

    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <div>
        <SectionList title="Første version bør indeholde" items={brief.firstVersion} />
        <SectionList title="Scope" items={brief.scope} />
        <SectionList title="Ikke inkluderet" items={brief.notIncluded} />
      </div>
      <div>
        <SectionList title="Opklarende spørgsmål før matching" items={brief.questions} />
        <SectionList title="Acceptkriterier" items={brief.acceptance} />
        <div className="mt-6 rounded-3xl bg-[#071527] p-5 text-white">
          <p className="text-sm font-black text-emerald-200">Opsummering til provider</p>
          <p className="mt-3 text-sm leading-6 text-white/75">{brief.providerSummary}</p>
        </div>
      </div>
    </div>

    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
      <SecondaryButton onClick={onApprove}>Godkend brief</SecondaryButton>
      <SecondaryButton>Rediger brief</SecondaryButton>
      <SecondaryButton>Gem som kladde</SecondaryButton>
      <PrimaryButton onClick={onSend}>Send til matching</PrimaryButton>
    </div>
  </Panel>;
}

export function NaetworkMvp() {
  const [view, setView] = useState<View>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [brief, setBrief] = useState(() => buildBrief(initialForm));
  const [approved, setApproved] = useState(false);
  const [providerSubmitted, setProviderSubmitted] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("Nordic Web Studio");
  const [projectStatus, setProjectStatus] = useState("Tilbud modtaget");
  const [adminMatch, setAdminMatch] = useState("Product Sprint DK");
  const [paymentStatus, setPaymentStatus] = useState("Depositum modtaget");

  const commission = useMemo(() => {
    if (form.budget.includes("50.000+")) return "10.000 kr.";
    if (form.budget.includes("25.000-50.000")) return "7.500 kr.";
    if (form.budget.includes("10.000-25.000")) return "4.500 kr.";
    return "1.500 kr.";
  }, [form.budget]);

  const update = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [event.target.name]: event.target.value });
  const regenerateBrief = () => { setBrief(buildBrief(form)); setApproved(false); setStep(4); };
  const submitWizard = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); regenerateBrief(); };
  const openView = (target: View) => { setView(target); setMobileOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const applyDemo = (demo: FormState) => { setForm(demo); setBrief(buildBrief(demo)); setApproved(false); setStep(4); openView("intake"); };
  const nav = (target: View, label: string) => <button onClick={() => openView(target)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${view === target ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"}`}>{label}</button>;

  return <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
        <button onClick={() => openView("home")} className="flex items-center gap-3 text-left">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">N</span>
          <span><span className="block text-lg font-black tracking-tight">Naetwork</span><span className="block text-xs text-slate-500">AI-intake · kurateret matching</span></span>
        </button>
        <nav className="hidden items-center gap-1 lg:flex">{nav("home", "Forside")}{nav("intake", "Beskriv behov")}{nav("provider", "Bliv provider")}{nav("consumer", "Consumer")}{nav("providerDash", "Provider")}{nav("admin", "Admin")}</nav>
        <div className="hidden items-center gap-2 md:flex"><SecondaryButton onClick={() => openView("provider")}>Bliv provider</SecondaryButton><PrimaryButton onClick={() => openView("intake")}>Beskriv dit behov</PrimaryButton></div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-black lg:hidden">Menu</button>
      </div>
      {mobileOpen && <div className="border-t border-slate-200 bg-white px-5 py-4 lg:hidden"><div className="grid gap-2">{nav("home", "Forside")}{nav("intake", "Beskriv behov")}{nav("provider", "Bliv provider")}{nav("consumer", "Consumer dashboard")}{nav("providerDash", "Provider dashboard")}{nav("admin", "Admin dashboard")}</div></div>}
    </header>

    {view === "home" && <>
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm">Early access · AI-intake · manuel kvalitetssikring</div>
          <h1 className="max-w-4xl text-5xl font-black leading-[.96] tracking-[-0.05em] text-[#071527] md:text-7xl">Få bygget simple digitale løsninger uden bureau, lange møder eller uklart scope.</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">Beskriv hvad du har brug for. Naetwork gør behovet konkret, skriver en professionel brief og matcher dig med relevante digitale pro’s.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><PrimaryButton onClick={() => openView("intake")}>Beskriv dit behov</PrimaryButton><SecondaryButton onClick={() => openView("provider")}>Bliv provider</SecondaryButton></div>
          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
            {["Jeg ved ikke hvem jeg skal hyre", "Jeg kan ikke skrive en teknisk brief", "Jeg vil ikke browse 100 profiler", "Jeg vil bare have løsningen lavet"].map((item) => <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-700 shadow-sm">{item}</div>)}
          </div>
        </div>

        <Panel className="bg-[#071527] text-white">
          <p className="text-sm font-black uppercase tracking-[.2em] text-emerald-200">Live demo-flow</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">Fra idé til brief på få trin</h2>
          <div className="mt-6 grid gap-3">{wizardSteps.map((label, index) => <div key={label} className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10"><span className="grid h-9 w-9 place-items-center rounded-full bg-white text-sm font-black text-[#071527]">{index + 1}</span><span className="font-bold text-white/85">{label}</span></div>)}</div>
          <div className="mt-6 rounded-3xl bg-white p-5 text-slate-900"><p className="text-sm font-black text-[#3f8f83]">Eksempel på output</p><p className="mt-2 text-sm leading-6">Projektbrief med scope, ikke inkluderet, acceptkriterier, budgetniveau, leveringstid og 1-3 relevante matches.</p></div>
        </Panel>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8"><div className="grid gap-4 md:grid-cols-5">{["Beskriv dit behov", "AI gør det konkret", "Bliv matchet med pro’s", "Vælg tilbud", "Få løsningen leveret"].map((stepLabel, index) => <Panel key={stepLabel}><div className="text-sm font-black text-[#3f8f83]">0{index + 1}</div><div className="mt-4 font-black text-slate-900">{stepLabel}</div></Panel>)}</div></section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-6 lg:grid-cols-[.75fr_1.25fr]"><div><p className="text-sm font-black uppercase tracking-[.2em] text-[#3f8f83]">Prøv med realistiske cases</p><h2 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Vis værdien uden at skrive alt selv.</h2><p className="mt-4 text-slate-600">Demo-cases gør det nemt at vise Naetwork fysisk til consumers, providers og samarbejdspartnere.</p></div><div className="grid gap-4 md:grid-cols-3">{demoCases.map((demo) => <button key={demo.label} onClick={() => applyDemo(demo.form)} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"><h3 className="font-black text-[#071527]">{demo.label}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{demo.description}</p><span className="mt-4 inline-flex rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white">Se AI-brief</span></button>)}</div></div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12"><div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-sm font-black uppercase tracking-[.2em] text-[#3f8f83]">Hvad du kan få hjælp til</p><h2 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Små digitale løsninger, gjort konkrete.</h2><p className="mt-4 text-slate-600">Ikke en klassisk freelance marketplace. Kunden skal ikke forstå teknik, scoping, freelancere, timepriser eller projektstyring.</p></div><div className="flex flex-wrap gap-2">{helpItems.map((item) => <Badge key={item}>{item}</Badge>)}</div></div></section>

      <section className="mx-auto max-w-7xl px-5 py-12"><div className="grid gap-6 md:grid-cols-3"><Panel><h3 className="text-xl font-black">For consumers</h3><p className="mt-3 text-slate-600">Skriv frit, få AI-brief, godkend scope, modtag 1-3 tilbud og følg leverancen ét sted.</p></Panel><Panel><h3 className="text-xl font-black">For providers</h3><p className="mt-3 text-slate-600">Få relevante opgaver matchet til dine kompetencer i stedet for at drukne i irrelevante leads.</p></Panel><Panel><h3 className="text-xl font-black">For admin</h3><p className="mt-3 text-slate-600">Styr provider-approval, manuel matching, projektstatus, pipeline og potentiel kommission.</p></Panel></div></section>
    </>}

    {view === "intake" && <section className="mx-auto max-w-7xl px-5 py-10">
      <DashboardHeader title="AI-intake" subtitle="En guidet proces hvor kunden ikke skal forstå teknik. Naetwork omsætter behovet til en professionel brief." />
      <div className="mb-6 grid gap-2 rounded-[1.5rem] border border-slate-200 bg-white p-3 md:grid-cols-5">{wizardSteps.map((label, index) => <button key={label} onClick={() => setStep(index)} className={`rounded-2xl px-4 py-3 text-left text-sm font-black transition ${step === index ? "bg-[#071527] text-white" : "text-slate-600 hover:bg-slate-50"}`}><span className="mr-2 text-xs opacity-60">0{index + 1}</span>{label}</button>)}</div>
      <form onSubmit={submitWizard} className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <Panel>
          {step === 0 && <div className="grid gap-5"><p className="text-sm font-black uppercase tracking-[.2em] text-[#3f8f83]">Trin 1</p><h2 className="text-3xl font-black tracking-tight">Hvad skal du have hjælp til?</h2><Textarea label="Beskriv behovet frit" name="need" value={form.need} onChange={update} rows={7} /><div className="grid gap-3 md:grid-cols-2"><Input label="Navn" name="name" value={form.name} onChange={update} /><Input label="Email" name="email" value={form.email} onChange={update} type="email" /></div><PrimaryButton onClick={() => setStep(1)}>Næste</PrimaryButton></div>}
          {step === 1 && <div className="grid gap-5"><p className="text-sm font-black uppercase tracking-[.2em] text-[#3f8f83]">Trin 2</p><h2 className="text-3xl font-black tracking-tight">Hvem skal bruge løsningen?</h2><div className="grid gap-3 md:grid-cols-2"><Select label="Privatperson eller virksomhed" name="type" value={form.type} onChange={update} options={["Privatperson", "Virksomhed", "Startup", "Selvstændig"]} /><Input label="Virksomhedsnavn" name="company" value={form.company} onChange={update} /></div><Textarea label="Hvem skal bruge løsningen?" name="audience" value={form.audience} onChange={update} rows={6} /><div className="flex gap-3"><SecondaryButton onClick={() => setStep(0)}>Tilbage</SecondaryButton><PrimaryButton onClick={() => setStep(2)}>Næste</PrimaryButton></div></div>}
          {step === 2 && <div className="grid gap-5"><p className="text-sm font-black uppercase tracking-[.2em] text-[#3f8f83]">Trin 3</p><h2 className="text-3xl font-black tracking-tight">Hvad skal løsningen kunne?</h2><Textarea label="Funktioner og krav" name="functionality" value={form.functionality} onChange={update} rows={7} /><Textarea label="Eksempler eller inspiration" name="inspiration" value={form.inspiration} onChange={update} rows={4} /><div className="flex gap-3"><SecondaryButton onClick={() => setStep(1)}>Tilbage</SecondaryButton><PrimaryButton onClick={() => setStep(3)}>Næste</PrimaryButton></div></div>}
          {step === 3 && <div className="grid gap-5"><p className="text-sm font-black uppercase tracking-[.2em] text-[#3f8f83]">Trin 4</p><h2 className="text-3xl font-black tracking-tight">Budget, deadline og AI-spørgsmål</h2><div className="grid gap-3 md:grid-cols-2"><Input label="Ønsket deadline" name="deadline" value={form.deadline} onChange={update} /><Select label="Budgetniveau" name="budget" value={form.budget} onChange={update} options={["Under 10.000 kr.", "10.000-25.000 kr.", "25.000-50.000 kr.", "50.000+ kr.", "Afklares"]} /></div><div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">AI må stille <strong className="text-slate-900">3-5 korte opklarende spørgsmål</strong> og derefter generere en brief, som kunden kan godkende eller redigere.</div><div className="flex gap-3"><SecondaryButton onClick={() => setStep(2)}>Tilbage</SecondaryButton><PrimaryButton type="submit">Generér AI-brief</PrimaryButton></div></div>}
          {step === 4 && <div className="grid gap-5"><p className="text-sm font-black uppercase tracking-[.2em] text-[#3f8f83]">Trin 5</p><h2 className="text-3xl font-black tracking-tight">Briefen er klar</h2><p className="text-slate-600">AI har omsat behovet til scope, acceptkriterier, budgetniveau, leveringstid og provider-tags.</p><div className="rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-800">{brief.matches.length} relevante providers fundet · bedste match {brief.matches[0]?.score}%</div><div className="flex gap-3"><SecondaryButton onClick={() => setStep(3)}>Tilbage</SecondaryButton><PrimaryButton onClick={() => { setProjectStatus("Matcher med pro’s"); openView("consumer"); }}>Gå til matching</PrimaryButton></div></div>}
        </Panel>
        <BriefCard brief={brief} approved={approved} onApprove={() => setApproved(true)} onSend={() => { setApproved(true); setProjectStatus("Matcher med pro’s"); openView("consumer"); }} />
      </form>
    </section>}

    {view === "provider" && <section className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[.9fr_1.1fr]">
      <Panel><p className="text-sm font-black uppercase tracking-[.2em] text-[#3f8f83]">Provider onboarding</p><h1 className="mt-3 text-4xl font-black tracking-tight">Bliv provider</h1><p className="mt-3 text-slate-600">Er du god til at bygge hjemmesider, automations, dashboards, rapporter eller simple apps? Opret dig og få relevante opgaver matchet til dine kompetencer.</p><form onSubmit={(e) => { e.preventDefault(); setProviderSubmitted(true); }} className="mt-6 grid gap-4"><div className="grid gap-3 md:grid-cols-2"><Input label="Navn" name="proName" /><Input label="Email" name="proEmail" type="email" /></div><Select label="Person/firma" name="proType" options={["Person", "Freelancer", "Konsulent", "Lille virksomhed"]} /><Textarea label="Kompetencer" name="skills" placeholder="Fx hjemmesider, automations, dashboards, AI-workflows" /><Textarea label="Erfaring" name="experience" /><Textarea label="Cases/portfolio" name="cases" /><div className="grid gap-3 md:grid-cols-2"><Input label="LinkedIn" name="linkedin" /><Input label="GitHub/website" name="github" /></div><div className="grid gap-3 md:grid-cols-2"><Select label="Prisniveau" name="price" options={["Fastpris", "500-750 kr./time", "750-1.000 kr./time", "1.000+ kr./time"]} /><Select label="Maks aktive opgaver" name="capacity" options={["1", "2", "3", "4+"]} /></div><Textarea label="Hvad er du særligt god til?" name="bio" /><PrimaryButton type="submit">Send provider-ansøgning</PrimaryButton></form></Panel>
      <div className="grid gap-4"><Panel><h2 className="text-2xl font-black">Provider-status</h2><div className="mt-4 grid gap-3">{["Pending approval", "Approved", "Rejected", "Verified later"].map((status, index) => <div key={status} className={`rounded-2xl p-4 text-sm font-black ${index === 0 || (providerSubmitted && index === 1) ? "bg-emerald-50 text-emerald-800" : "bg-slate-50 text-slate-600"}`}>{status}</div>)}</div></Panel><Panel><h3 className="font-black">Provider-værdi</h3><p className="mt-2 text-sm leading-6 text-slate-600">Naetwork viser kun relevante briefs med match-score, forklaring på match, prisniveau, kapacitet og forventet svartid. Provider kan acceptere, afvise eller sende tilbud.</p></Panel></div>
    </section>}

    {view === "consumer" && <section className="mx-auto max-w-7xl px-5 py-10"><DashboardHeader title="Consumer dashboard" subtitle="Mine opgaver, brief, matches, tilbud, beskeder, leverance og rating." /><div className="grid gap-6 lg:grid-cols-[.75fr_1.25fr]"><Panel><h3 className="font-black">Mine opgaver</h3><div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-black text-emerald-800">Status: {projectStatus}</div><div className="mt-4 rounded-2xl bg-slate-50 p-4"><p className="font-black">{brief.title}</p><p className="mt-1 text-sm text-slate-600">{brief.category} · {brief.budget} · {brief.delivery}</p></div><SectionList title="Projektstatus" items={statuses.slice(0, 6)} /><PrimaryButton onClick={() => setProjectStatus("Leveret")}>Marker som leveret</PrimaryButton></Panel><Panel><h3 className="text-2xl font-black">Tilbud og matches</h3><div className="mt-4 grid gap-4">{brief.matches.map((match) => <div key={match.provider.name} className={`rounded-3xl border p-5 ${selectedProvider === match.provider.name ? "border-[#3f8f83] bg-emerald-50" : "border-slate-200 bg-white"}`}><div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div><h4 className="font-black">{match.provider.name}</h4><p className="mt-1 text-sm text-slate-600">{match.provider.title}</p></div><span className="w-fit rounded-full bg-white px-3 py-1 text-sm font-black text-[#3f8f83]">{match.score}% match</span></div><p className="mt-3 text-sm leading-6 text-slate-600">{match.explanation}</p><div className="mt-3 flex flex-wrap gap-2">{match.provider.skills.slice(0, 6).map((skill) => <Badge key={skill}>{skill}</Badge>)}</div><div className="mt-4 grid gap-3 rounded-2xl bg-white/70 p-4 text-sm md:grid-cols-4"><strong>{match.provider.price}</strong><span>{match.provider.availability}</span><span>{match.provider.response}</span><span>{match.provider.rating}</span></div><div className="mt-4 flex flex-wrap gap-2"><PrimaryButton onClick={() => { setSelectedProvider(match.provider.name); setProjectStatus("Provider valgt"); }}>Vælg provider</PrimaryButton><SecondaryButton>Afvis tilbud</SecondaryButton></div></div>)}</div></Panel></div><div className="mt-6 grid gap-6 lg:grid-cols-2"><Panel><h3 className="font-black">Beskeder</h3><p className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">Provider: “Tak for briefen — jeg kan levere første version inden for 3 uger og inkluderer kort handover.”</p></Panel><Panel><h3 className="font-black">Leverance</h3><p className="mt-3 text-sm text-slate-600">{brief.handover}</p><div className="mt-4 flex gap-3"><PrimaryButton onClick={() => setProjectStatus("Godkendt")}>Godkend</PrimaryButton><SecondaryButton onClick={() => setProjectStatus("Ændringer ønsket")}>Bed om ændringer</SecondaryButton></div></Panel></div></section>}

    {view === "providerDash" && <section className="mx-auto max-w-7xl px-5 py-10"><DashboardHeader title="Provider dashboard" subtitle="Nye relevante opgaver, briefs, match-score, tilbud, deadlines og ratings." /><div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]"><Panel><h3 className="text-2xl font-black">Nye relevante opgaver</h3><div className="mt-4 grid gap-4">{brief.matches.map((match) => <div key={match.provider.name} className="rounded-3xl border border-slate-200 p-5"><div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div><p className="font-black">{brief.title}</p><p className="mt-1 text-sm leading-6 text-slate-600">{match.explanation}</p></div><span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-800">{match.score}%</span></div><p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">{brief.providerSummary}</p><div className="mt-4 flex gap-2"><PrimaryButton>Send tilbud</PrimaryButton><SecondaryButton>Afvis</SecondaryButton></div></div>)}</div></Panel><Panel><h3 className="text-2xl font-black">Aktive projekter</h3><div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-black text-emerald-800">Status: I gang</div><p className="mt-4 text-sm leading-6 text-slate-600">Deadline: {brief.delivery}. Fokus: leverance mod acceptkriterier og kort handover-tekst til kunden.</p><SectionList title="Acceptkriterier" items={brief.acceptance} /></Panel></div></section>}

    {view === "admin" && <section className="mx-auto max-w-7xl px-5 py-10"><DashboardHeader title="Admin dashboard" subtitle="Styr matching, kvalitet, provider approval, pipeline og potentiel platformskommission." /><div className="grid gap-4 md:grid-cols-4">{[["Alle opgaver", "1"], ["Providers", "4"], ["Pending approvals", providerSubmitted ? "1" : "0"], ["Potentiel kommission", commission]].map(([label, value]) => <Panel key={label}><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-black">{value}</p></Panel>)}</div><div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]"><Panel><h3 className="text-2xl font-black">Manuel match-funktion</h3><p className="mt-2 text-sm text-slate-600">AI foreslår matches, men admin kan kvalitetssikre og tilføje providers manuelt.</p><div className="mt-4 grid gap-3"><Select label="Vælg provider" name="adminMatch" value={adminMatch} onChange={(e) => setAdminMatch(e.target.value)} options={providers.map((provider) => provider.name)} /><Select label="Betalingsstatus" name="paymentStatus" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} options={["Ikke betalt", "Depositum modtaget", "Betalt", "Afsluttet"]} /><PrimaryButton onClick={() => setProjectStatus("Matcher med pro’s")}>Match opgave med provider</PrimaryButton></div></Panel><Panel><h3 className="text-2xl font-black">Pipeline</h3><div className="mt-4 grid gap-3">{statuses.map((status) => <div key={status} className={`rounded-2xl px-4 py-3 text-sm font-black ${projectStatus === status ? "bg-emerald-50 text-emerald-800" : "bg-slate-50 text-slate-600"}`}>{status}</div>)}</div></Panel></div><div className="mt-6 grid gap-6 lg:grid-cols-3"><Panel><h3 className="font-black">Opgaver uden match</h3><p className="mt-2 text-sm text-slate-600">0 lige nu. Admin kan manuelt sende en brief til 1-3 providers.</p></Panel><Panel><h3 className="font-black">Provider approval</h3><p className="mt-2 text-sm text-slate-600">Nye providers står som pending, indtil de er gennemgået og evt. markeret verified.</p></Panel><Panel><h3 className="font-black">Quality assurance</h3><p className="mt-2 text-sm text-slate-600">MVP’en kan drives semi-manuelt, så kvaliteten føles høj fra dag ét.</p></Panel></div></section>}
  </main>;
}
