'use client';

import { type ReactNode, useMemo, useState } from "react";

type View = "home" | "task" | "directions" | "submitted" | "provider";
type Category = "Ikke sikker" | "Hjemmeside" | "Webapp / MVP" | "Dashboard" | "Automation" | "Pitch deck";
type Intake = { category: Category; need: string; audience: string; budget: string; deadline: string };
type Brief = { title: string; specialist: string; budget: string; deadline: string; tags: string[]; scope: string[]; questions: string[]; acceptance: string[]; notIncluded: string[] };

type CategoryConfig = {
  title: string;
  specialist: string;
  budget: string;
  example: string;
  tags: string[];
  scope: string[];
  questions: string[];
};

const initialIntake: Intake = {
  category: "Ikke sikker",
  need: "Jeg har en digital opgave, som ikke kræver et stort konsulentbureau, men jeg har brug for en dygtig specialist til at få den løst rigtigt.",
  audience: "Små virksomheder, iværksættere og private med digitale opgaver.",
  budget: "Afklares",
  deadline: "Afklares"
};

const categories: Record<Category, CategoryConfig> = {
  "Ikke sikker": {
    title: "Digital opgave gjort klar før du vælger specialist",
    specialist: "Digital produkt specialist",
    budget: "Afklares efter opgaven",
    example: "Jeg har en digital opgave, men ved ikke om jeg skal bruge hjemmeside, automation, dashboard eller webapp.",
    tags: ["Behovsafklaring", "Opgavebeskrivelse", "Brief", "Specialist"],
    scope: ["Afklare hvad der faktisk skal laves", "Definere første version", "Skelne mellem det vigtigste og det der kan vente", "Anbefale specialisttype"],
    questions: ["Hvad skal opgaven hjælpe dig med at opnå?", "Hvad er vigtigst i første version?", "Hvad må gerne vente til senere?"]
  },
  Hjemmeside: {
    title: "Professionel hjemmeside med tydeligt kontaktflow",
    specialist: "Webdesigner eller frontend specialist",
    budget: "10.000 til 35.000 kr.",
    example: "Min hjemmeside findes, men skaber ikke nok henvendelser. Jeg vil have hjælp til struktur, tekst, design og kontaktflow.",
    tags: ["Webdesign", "Kontakt", "SEO", "Leads"],
    scope: ["Struktur og vigtigste sider", "Kontaktformular eller bookingflow", "Tydeligere tekst og knapper", "Responsivt design og basal SEO"],
    questions: ["Hvad skal besøgende gøre på siden?", "Hvor kommer trafikken fra i dag?", "Hvilke henvendelser er mest værdifulde?"]
  },
  "Webapp / MVP": {
    title: "Første version med klart kerneflow",
    specialist: "Produktbygger",
    budget: "25.000 til 75.000 kr.",
    example: "Jeg har en idé til en platform, app eller portal, men skal have første version afgrænset og bygget rigtigt.",
    tags: ["MVP", "Webapp", "Produktflow", "Launch"],
    scope: ["Kerneflow og første version", "Prioritering af de vigtigste funktioner", "Klar løsning til lancering", "Kort overlevering"],
    questions: ["Hvad er det vigtigste brugerflow?", "Hvad skal absolut med i første version?", "Hvad kan vente til senere?"]
  },
  Dashboard: {
    title: "Overskueligt dashboard med centrale nøgletal",
    specialist: "Data specialist",
    budget: "15.000 til 50.000 kr.",
    example: "Leads, kunder, opgaver eller tal ligger spredt i mails, Excel, CRM eller forskellige værktøjer. Jeg vil have ét klart overblik.",
    tags: ["Dashboard", "Excel", "CRM", "Rapportering"],
    scope: ["Kortlægge datakilder", "Definere vigtigste nøgletal", "Samlet overblik", "Logik for opdatering"],
    questions: ["Hvor ligger data i dag?", "Hvilke tal styrer du efter?", "Hvem skal bruge overblikket?"]
  },
  Automation: {
    title: "Automation der fjerner manuelt dobbeltarbejde",
    specialist: "Automation specialist",
    budget: "10.000 til 40.000 kr.",
    example: "Jeg bruger for meget tid på mails, Excel, opfølgning eller gentagne processer og vil have et simpelt workflow, der sparer tid.",
    tags: ["Automation", "Workflow", "Værktøjer", "Proces"],
    scope: ["Kortlægge manuelt flow", "Opsætte automation", "Fejlhåndtering", "Test og dokumentation"],
    questions: ["Hvad starter flowet?", "Hvor skal data ende?", "Hvad sker der, hvis noget fejler?"]
  },
  "Pitch deck": {
    title: "Pitch deck med klar fortælling og premium design",
    specialist: "Præsentationsdesigner",
    budget: "8.000 til 30.000 kr.",
    example: "Jeg skal præsentere min virksomhed, idé eller løsning professionelt for kunder, investorer eller partnere.",
    tags: ["Pitch deck", "Storyline", "Design", "Slides"],
    scope: ["Storyline", "Slide struktur", "Designretning", "Finpudsning af vigtigste slides"],
    questions: ["Hvem skal se materialet?", "Hvilken beslutning skal det drive?", "Har du tal og input klar?"]
  }
};

const specialistDirections = [
  { name: "Webapp specialist", type: "MVP og produktbyggeri", score: "Stærk", price: "Efter opgave", time: "Uger", note: "Relevant til en afgrænset første version med klart produktflow og hurtig lancering.", tags: ["MVP", "UX", "Frontend", "Backend"] },
  { name: "Automation specialist", type: "Workflows og digitale processer", score: "Stærk", price: "Efter flow", time: "Dage eller uger", note: "Relevant når opgaven handler om at spare tid og få værktøjer sat rigtigt sammen.", tags: ["Automation", "Workflow", "Sheets", "Proces"] },
  { name: "Design og launch specialist", type: "Landing page og materiale", score: "God", price: "Efter behov", time: "Uger", note: "God retning hvis første version skal fremstå skarp, troværdig og klar til markedet.", tags: ["Landing", "UI", "Brand", "Launch"] }
];

const problemCards = [
  { title: "Få flere henvendelser fra din hjemmeside", summary: "Siden findes, men skaber ikke nok leads.", detail: "Få hjælp til struktur, tekst, design og kontaktflow, så hjemmesiden faktisk arbejder for dig.", action: "Gør hjemmesideopgaven klar", category: "Hjemmeside" as Category },
  { title: "Slip for gentaget manuelt arbejde", summary: "Mails, Excel og opfølgning tager for meget tid.", detail: "Få sat et simpelt workflow op, der fjerner gentagelser og sparer tid hver uge.", action: "Afklar flowet", category: "Automation" as Category },
  { title: "Få første version af din idé bygget rigtigt", summary: "Du har idéen, men ikke rammen for første version.", detail: "Få prioriteret første version, så du bygger det rigtige uden at gøre projektet for stort.", action: "Afgræns første version", category: "Webapp / MVP" as Category },
  { title: "Få styr på kunder, salg og overblik", summary: "Leads og data ligger spredt i mails, CRM og Excel.", detail: "Få ét klart overblik over det, du skal følge op på og træffe beslutninger ud fra.", action: "Saml overblik i en brief", category: "Dashboard" as Category },
  { title: "Se professionel ud, når det gælder", summary: "Pitch, salgsdeck eller kundemateriale skal sidde skarpt.", detail: "Få materialet struktureret og designet, så din virksomhed føles klar og troværdig.", action: "Beskriv materialet", category: "Pitch deck" as Category }
];

const processSteps = [
  ["01", "Du beskriver opgaven", "Start med det du ved, også selvom opgaven ikke er færdigtænkt."],
  ["02", "Opgaven bliver gjort klarere", "Naetwork hjælper med at finde ud af, hvad der faktisk skal laves."],
  ["03", "Du får et bedre grundlag", "Opgaven samles i en klar brief, så den er nemmere at forstå og vurdere."],
  ["04", "Relevante specialister kan se opgaven", "Specialister får en tydeligere opgave at tage stilling til."],
  ["05", "Du får bedre overblik", "Det bliver lettere at forstå forskel på pris, tid, tilgang og løsning."],
  ["06", "Du vælger om du vil videre", "Når opgaven og mulighederne er tydelige, kan du vælge med mere ro."]
];

const whyCards = [
  ["Ikke tung proces", "Ingen stor proces når opgaven kan løses af en specialist."],
  ["Ikke profiljagt", "Du skal ikke selv gennemgå en masse profiler og gætte hvem der passer."],
  ["Ikke løse idéer", "Opgaven skal være tydelig nok til at kunne vurderes ordentligt."],
  ["Klar opgave først", "En klarere opgave, en mere relevant specialist og et mere overskueligt forløb."]
];

const nextSteps = [
  ["Briefen gennemgås", "Opgaven kan finpudses, så den er nem at forstå for både kunde og specialist."],
  ["Relevante specialister findes", "Næste skridt er ikke en åben profiljagt, men et mere målrettet match."],
  ["Du vælger om du vil videre", "Du får overblik, før arbejdet går i gang."]
];

function cx(...classes: Array<string | false | undefined>) { return classes.filter(Boolean).join(" "); }
function emailLooksValid(value: string) { return /^\S+@\S+\.\S+$/.test(value.trim()); }
function Panel({ children, dark = false, className = "" }: { children: ReactNode; dark?: boolean; className?: string }) { return <div className={cx("rounded-[30px] border p-6 shadow-sm", dark ? "border-slate-800 bg-[#071527] text-white" : "border-slate-200 bg-white text-slate-950", className)}>{children}</div>; }
function Button({ children, onClick, secondary = false, disabled = false }: { children: ReactNode; onClick?: () => void; secondary?: boolean; disabled?: boolean }) { return <button type="button" disabled={disabled} onClick={onClick} className={cx("rounded-full px-6 py-3 text-sm font-black transition focus:outline-none focus:ring-4 focus:ring-[#3f8f83]/20", disabled && "cursor-not-allowed opacity-60", secondary ? "border border-slate-300 bg-white text-slate-800 hover:border-slate-400" : "bg-[#071527] text-white shadow-lg shadow-slate-900/10 hover:bg-[#0b203a]")}>{children}</button>; }
function Eyebrow({ children }: { children: ReactNode }) { return <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">{children}</p>; }
function Badge({ children, dark = false }: { children: ReactNode; dark?: boolean }) { return <span className={cx("inline-flex h-9 w-fit shrink-0 items-center rounded-full px-4 text-xs font-black", dark ? "bg-white/10 text-white ring-1 ring-white/10" : "border border-slate-200 bg-white text-slate-700")}>{children}</span>; }
function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="grid gap-2 text-sm font-bold text-slate-700"><span>{label}</span>{children}</label>; }
function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) { return <input {...props} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-normal text-slate-950 outline-none focus:border-[#3f8f83] focus:ring-4 focus:ring-[#3f8f83]/10" />; }
function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea {...props} className="resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 font-normal leading-6 text-slate-950 outline-none focus:border-[#3f8f83] focus:ring-4 focus:ring-[#3f8f83]/10" />; }

export function NaetworkExperience() {
  const [view, setView] = useState<View>("home");
  const [intake, setIntake] = useState<Intake>(initialIntake);
  const [taskEmail, setTaskEmail] = useState("");
  const [taskError, setTaskError] = useState("");
  const [taskLoading, setTaskLoading] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [interestEmail, setInterestEmail] = useState("");
  const [interestSent, setInterestSent] = useState(false);
  const [expandedProblem, setExpandedProblem] = useState<string | null>(null);
  const [selectedDirection, setSelectedDirection] = useState(specialistDirections[0]);
  const [providerName, setProviderName] = useState("");
  const [providerEmail, setProviderEmail] = useState("");
  const [providerSkills, setProviderSkills] = useState("");
  const [providerLinks, setProviderLinks] = useState("");
  const [providerError, setProviderError] = useState("");
  const [providerLoading, setProviderLoading] = useState(false);
  const [providerSent, setProviderSent] = useState(false);

  const config = categories[intake.category];
  const brief: Brief = useMemo(() => ({
    title: config.title,
    specialist: config.specialist,
    budget: intake.budget === "Afklares" ? config.budget : intake.budget,
    deadline: intake.deadline,
    tags: config.tags,
    scope: config.scope,
    questions: config.questions,
    acceptance: ["Kerneflow virker på desktop og mobil", "Leverancen matcher godkendt brief", "Specialisten afleverer kort overlevering", "Feedback samles i én tydelig runde"],
    notIncluded: ["Ubegrænset scope", "Betaling eller login uden særskilt aftale", "Løbende drift uden aftale"]
  }), [config, intake.budget, intake.deadline]);

  const open = (target: View) => {
    setView(target);
    setTaskError("");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const chooseCategory = (category: Category, need?: string) => {
    setIntake({ ...intake, category, need: need || categories[category].example });
    open("task");
  };

  const submitTask = async () => {
    const need = intake.need.trim();
    if (need.length < 30) { setTaskError("Skriv lidt mere om opgaven, så briefen bliver brugbar."); return; }
    if (!emailLooksValid(taskEmail)) { setTaskError("Indtast en email, så vi kan vende tilbage om opgaven."); return; }

    setTaskLoading(true);
    setTaskError("");

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intake, email: taskEmail, brief })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Opgaven kunne ikke sendes lige nu.");
      setTaskId(result.id || "");
      open("submitted");
    } catch (error) {
      setTaskError(error instanceof Error ? error.message : "Opgaven kunne ikke sendes lige nu.");
    } finally {
      setTaskLoading(false);
    }
  };

  const submitProvider = async () => {
    if (providerName.trim().length < 2) { setProviderError("Skriv dit navn eller firmanavn."); return; }
    if (!emailLooksValid(providerEmail)) { setProviderError("Indtast en gyldig email."); return; }
    if (providerSkills.trim().length < 20) { setProviderError("Skriv lidt mere om dine kompetencer og opgavetyper."); return; }

    setProviderLoading(true);
    setProviderError("");

    try {
      const response = await fetch("/api/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: providerName, email: providerEmail, skills: providerSkills, links: providerLinks })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Ansøgningen kunne ikke sendes lige nu.");
      setProviderSent(true);
    } catch (error) {
      setProviderError(error instanceof Error ? error.message : "Ansøgningen kunne ikke sendes lige nu.");
    } finally {
      setProviderLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e8f4ef_0,#f7f8fb_34%,#f7f8fb_100%)] text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <button type="button" onClick={() => open("home")} className="flex items-center gap-3 text-left"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">N</span><span><span className="block text-lg font-black tracking-tight">Naetwork</span><span className="block text-xs text-slate-500">Få opgaven gjort klar</span></span></button>
          <nav className="hidden items-center gap-2 lg:flex">{[["home", "Forside"], ["task", "Opret opgave"], ["directions", "Processen"], ["provider", "For specialister"]].map(([target, label]) => <button key={target} type="button" onClick={() => open(target as View)} className={cx("rounded-full px-4 py-2 text-sm font-bold transition", view === target ? "bg-[#071527] text-white" : "text-slate-600 hover:bg-slate-100")}>{label}</button>)}</nav>
          <div className="hidden gap-2 md:flex"><Button secondary onClick={() => open("directions")}>Se processen</Button><Button onClick={() => open("task")}>Opret opgave</Button></div>
        </div>
      </header>

      {view === "home" && <>
        <section className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-10 lg:grid-cols-[1.04fr_.96fr] lg:py-20">
          <div><div className="mb-5 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm">Fra uklar opgave til klar retning</div><h1 className="max-w-5xl text-4xl font-black leading-[.96] tracking-[-0.05em] text-[#071527] md:text-7xl">Få styr på din digitale opgave og kom videre med den rigtige specialist.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Beskriv opgaven med dine egne ord. Naetwork hjælper dig med at finde ud af, hvad der egentlig skal laves, hvad der bør være med, og hvilken type specialist der passer til opgaven.</p><div className="mt-8 rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm md:p-5"><p className="mb-3 text-sm font-black text-[#071527]">Fortæl kort, hvad du gerne vil have hjælp til</p><TextArea value={intake.need} onChange={(event) => setIntake({ ...intake, need: event.target.value })} rows={4} placeholder="Fx: Jeg vil have flere henvendelser fra min hjemmeside, få styr på et manuelt workflow eller få første version af en idé bygget." /><div className="mt-4 flex flex-col gap-3 sm:flex-row"><Button onClick={() => open("task")}>Opret opgave</Button><Button secondary onClick={() => open("directions")}>Se processen</Button></div><p className="mt-3 text-xs font-bold text-slate-500">Start med egne ord · Ingen teknisk forklaring nødvendig · Ingen binding</p></div><div className="mt-6 flex flex-wrap gap-2"><Badge>Klar brief</Badge><Badge>Relevant specialist</Badge><Badge>Mere overskueligt forløb</Badge></div></div>
          <Panel dark className="relative overflow-hidden lg:p-8"><div className="relative flex items-start justify-between gap-6"><div><p className="text-sm font-black uppercase tracking-[.2em] text-emerald-200">Fra uklar opgave til klart næste skridt</p><h2 className="mt-3 text-3xl font-black tracking-tight">Sådan hjælper Naetwork dig videre</h2></div><Badge dark>Klar opgave først</Badge></div><div className="relative mt-7 grid gap-3">{processSteps.map(([step, title, text]) => <div key={step} className="grid gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10 sm:grid-cols-[42px_1fr]"><span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-xs font-black text-emerald-100">{step}</span><div><p className="text-sm font-black text-white">{title}</p><p className="mt-1 text-sm leading-6 text-white/65">{text}</p></div></div>)}</div><div className="relative mt-7 rounded-2xl bg-emerald-300/10 p-5 ring-1 ring-emerald-200/20"><p className="text-sm font-black text-emerald-100">Målet er at gøre opgaven klar nok til, at både du og specialisten forstår, hvad der skal ske, før arbejdet går i gang.</p></div></Panel>
        </section>
        <section className="mx-auto max-w-7xl px-5 py-8"><div className="grid gap-4 md:grid-cols-3">{[["1", "Fortæl hvad du har brug for", "Start med det du gerne vil opnå, ikke hvad løsningen hedder teknisk."], ["2", "Få opgaven gjort klar", "Naetwork samler behov, forventninger og næste skridt i en tydelig brief."], ["3", "Send opgaven videre", "Når briefen giver mening, kan du sende opgaven og få relevante næste skridt."]].map(([number, title, text]) => <Panel key={title} className="transition hover:-translate-y-1 hover:shadow-md"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">{number}</span><h3 className="mt-5 text-xl font-black text-[#071527]">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{text}</p></Panel>)}</div></section>
        <section className="mx-auto max-w-7xl px-5 py-12"><div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><Eyebrow>Eksempler</Eyebrow><h2 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">De ting du ved, burde fungere bedre</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">Mange opgaver bliver udskudt, fordi det er uklart, hvad der egentlig skal laves, og hvem der er bedst til at hjælpe.</p></div><Button secondary onClick={() => open("task")}>Start med dit behov</Button></div><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{problemCards.map((item) => { const expanded = expandedProblem === item.title; return <div key={item.title} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#3f8f83]/40 hover:shadow-md"><button type="button" onClick={() => setExpandedProblem(expanded ? null : item.title)} className="w-full text-left"><div className="flex items-start justify-between gap-4"><p className="font-black text-[#071527]">{item.title}</p><span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-black text-slate-500">{expanded ? "Luk" : "Læs"}</span></div><p className="mt-3 text-sm leading-6 text-slate-600">{item.summary}</p></button>{expanded && <div className="mt-4 border-t border-slate-100 pt-4"><p className="text-sm leading-6 text-slate-600">{item.detail}</p><button type="button" onClick={() => chooseCategory(item.category, `${item.title}: ${item.summary} ${item.detail}`)} className="mt-4 text-sm font-black text-[#071527] underline decoration-[#3f8f83]/40 underline-offset-4">{item.action}</button></div>}</div>; })}</div></section>
        <section className="mx-auto max-w-7xl px-5 py-12"><div className="mb-6"><Eyebrow>Hvorfor Naetwork?</Eyebrow><h2 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Fordi en god løsning starter med en klar opgave.</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">Når opgaven er tydelig, bliver det lettere for dig at vælge den rigtige hjælp, og lettere for specialisten at vurdere, hvordan arbejdet bedst løses.</p></div><div className="grid gap-4 md:grid-cols-4">{whyCards.map(([title, text]) => <Panel key={title} className={title === "Klar opgave først" ? "border-[#3f8f83]/40 bg-emerald-50/40" : ""}><p className="font-black text-[#071527]">{title}</p><p className="mt-3 text-sm leading-6 text-slate-600">{text}</p></Panel>)}</div></section>
        <section className="mx-auto max-w-7xl px-5 py-12"><Panel className="grid gap-6 lg:grid-cols-[.85fr_1.15fr]"><div><Eyebrow>Start her</Eyebrow><h2 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Har du en opgave, der burde være løst?</h2><p className="mt-4 leading-7 text-slate-600">Start med at forklare opgaven, som du ser den. Naetwork hjælper med at gøre den klarere, så du lettere kan komme videre med den rigtige specialist.</p></div><div><div className="grid gap-3 md:grid-cols-2">{["Klarere opgave", "Relevant specialist", "Mindre profiljagt", "Mere ro i valget"].map((item) => <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm font-black text-slate-700">{item}</div>)}</div><div className="mt-5 flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row"><input value={interestEmail} onChange={(event) => setInterestEmail(event.target.value)} placeholder="Din email" className="min-w-0 flex-1 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#3f8f83] focus:ring-4 focus:ring-[#3f8f83]/10" /><Button onClick={() => setInterestSent(true)}>{interestSent ? "Du er skrevet op" : "Skriv mig op"}</Button></div></div></Panel></section>
      </>}

      {view === "task" && <section className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[.82fr_1.18fr]"><Panel><Eyebrow>Opret opgave</Eyebrow><h1 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Start med opgaven, som du ser den.</h1><p className="mt-3 text-sm leading-6 text-slate-600">Udfyld det du ved. Briefen til højre samler opgaven, så den bliver lettere at sende videre og vurdere.</p><div className="mt-6 grid gap-4"><div><p className="mb-2 text-sm font-bold text-slate-700">Hvad minder opgaven mest om?</p><div className="flex flex-wrap gap-2">{(Object.keys(categories) as Category[]).map((item) => <button type="button" key={item} onClick={() => setIntake({ ...intake, category: item, need: item === "Ikke sikker" ? intake.need : categories[item].example })} className={cx("rounded-full border px-4 py-2 text-sm font-black transition", intake.category === item ? "border-[#071527] bg-[#071527] text-white" : "border-slate-200 bg-white text-slate-700 hover:border-[#3f8f83]/50")}>{item}</button>)}</div></div><Field label="Beskriv opgaven"><TextArea value={intake.need} onChange={(event) => setIntake({ ...intake, need: event.target.value })} rows={5} /></Field><Field label="Hvem skal bruge løsningen?"><TextArea value={intake.audience} onChange={(event) => setIntake({ ...intake, audience: event.target.value })} rows={3} /></Field><div className="grid gap-4 md:grid-cols-2"><Field label="Budget"><TextInput value={intake.budget} onChange={(event) => setIntake({ ...intake, budget: event.target.value })} /></Field><Field label="Deadline"><TextInput value={intake.deadline} onChange={(event) => setIntake({ ...intake, deadline: event.target.value })} /></Field></div><Field label="Email til svar"><TextInput value={taskEmail} onChange={(event) => setTaskEmail(event.target.value)} placeholder="din@email.dk" /></Field>{taskError && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-black text-rose-700">{taskError}</div>}<div className="grid gap-3 sm:grid-cols-2"><Button secondary onClick={() => open("directions")}>Se specialistretninger</Button><Button onClick={submitTask} disabled={taskLoading}>{taskLoading ? "Sender opgave" : "Send opgaven"}</Button></div><p className="text-xs font-bold leading-5 text-slate-500">Ingen betaling. Ingen binding. Du kan ændre opgaven senere.</p></div></Panel><Panel><div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5"><div><Eyebrow>Brief</Eyebrow><h2 className="mt-3 text-3xl font-black tracking-tight text-[#071527]">{brief.title}</h2></div><Badge>Klar brief</Badge></div><p className="mt-5 text-sm leading-6 text-slate-600">Briefen gør opgaven tydeligere med opgavebeskrivelse, fravalg, acceptkriterier og hvilken type specialist der passer.</p><div className="mt-5 flex flex-wrap gap-2">{brief.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div><div className="mt-6 grid gap-6 md:grid-cols-2"><div><h3 className="font-black">Opgaven</h3><ul className="mt-3 grid gap-2">{brief.scope.map((item) => <li key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</li>)}</ul><h3 className="mt-6 font-black">Spørgsmål</h3><ul className="mt-3 grid gap-2">{brief.questions.map((item) => <li key={item} className="rounded-2xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">{item}</li>)}</ul></div><div><h3 className="font-black">Acceptkriterier</h3><ul className="mt-3 grid gap-2">{brief.acceptance.map((item) => <li key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</li>)}</ul><h3 className="mt-6 font-black">Ikke inkluderet</h3><ul className="mt-3 grid gap-2">{brief.notIncluded.map((item) => <li key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</li>)}</ul></div></div><div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-4"><p className="text-sm font-black text-[#071527]">Klar til næste skridt?</p><p className="mt-2 text-sm leading-6 text-slate-600">Send opgaven, når briefen giver mening. Du får en kvittering på mail.</p><div className="mt-4"><Button onClick={submitTask} disabled={taskLoading}>{taskLoading ? "Sender opgave" : "Send opgaven"}</Button></div></div></Panel></section>}

      {view === "submitted" && <section className="mx-auto max-w-7xl px-5 py-10"><div className="mx-auto max-w-4xl"><Panel dark className="overflow-hidden p-8 md:p-10"><div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-300/15 text-2xl">✓</div><Eyebrow>Opgaven er sendt</Eyebrow><h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">Din opgave er gjort klar til næste skridt.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">Briefen er gemt, og du får en kvittering på mail. Der er ingen betaling og ingen binding på dette trin.</p><div className="mt-8 grid gap-3 md:grid-cols-3"><div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10"><p className="text-xs font-black uppercase tracking-[.16em] text-white/45">Opgave</p><p className="mt-2 font-black text-white">{intake.category}</p></div><div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10"><p className="text-xs font-black uppercase tracking-[.16em] text-white/45">Specialist</p><p className="mt-2 font-black text-white">{brief.specialist.split(" eller")[0]}</p></div><div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10"><p className="text-xs font-black uppercase tracking-[.16em] text-white/45">ID</p><p className="mt-2 truncate font-black text-white">{taskId || "Modtaget"}</p></div></div><div className="mt-8 grid gap-3">{nextSteps.map(([title, text], index) => <div key={title} className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10"><p className="font-black text-white">{index + 1}. {title}</p><p className="mt-1 text-sm leading-6 text-white/65">{text}</p></div>)}</div><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button secondary onClick={() => open("task")}>Tilpas brief</Button><Button secondary onClick={() => { setIntake(initialIntake); setTaskEmail(""); setTaskId(""); open("home"); }}>Opret ny opgave</Button></div></Panel></div></section>}

      {view === "directions" && <section className="mx-auto max-w-7xl px-5 py-10"><div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><Eyebrow>Specialistretninger</Eyebrow><h1 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Få relevante retninger, ikke en endeløs profil liste.</h1><p className="mt-3 max-w-3xl text-slate-600">Når opgaven er tydelig, kan retninger sammenlignes på fit, prisniveau og leveringstid.</p></div><Button secondary onClick={() => open("task")}>Tilbage til opgaven</Button></div><div className="grid gap-5 lg:grid-cols-3">{specialistDirections.map((direction) => <Panel key={direction.name} className="flex min-h-[410px] flex-col justify-between transition hover:-translate-y-1 hover:shadow-md"><div><div className="flex items-start justify-between gap-4"><div><p className="text-2xl font-black text-[#071527]">{direction.name}</p><p className="mt-1 text-sm font-bold text-slate-500">{direction.type}</p></div><span className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-800">{direction.score}</span></div><p className="mt-5 text-sm leading-6 text-slate-600">{direction.note}</p><div className="mt-5 flex flex-wrap gap-2">{direction.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div><div className="mt-6 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Prisniveau</p><p className="mt-2 text-xl font-black text-[#071527]">{direction.price}</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Tid</p><p className="mt-2 text-xl font-black text-[#071527]">{direction.time}</p></div></div></div><Button onClick={() => { setSelectedDirection(direction); setIntake({ ...intake, category: direction.name.includes("Automation") ? "Automation" : direction.name.includes("Webapp") ? "Webapp / MVP" : intake.category }); open("task"); }}>Brug som retning</Button></Panel>)}</div></section>}

      {view === "provider" && <section className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[.85fr_1.15fr]"><Panel><Eyebrow>For specialister</Eyebrow><h1 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Bedre opgaver starter med bedre briefs.</h1><p className="mt-4 text-slate-600">Naetwork er for specialister, der vil bruge mindre tid på uklare henvendelser og mere tid på opgaver, hvor behovet allerede er gjort tydeligere.</p><div className="mt-6 grid gap-3">{["Mindre tid på uklare leads", "Brief og forventninger før tilbud", "Færre irrelevante henvendelser", "Mere professionel overlevering"].map((item) => <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm font-black text-slate-700">{item}</div>)}</div></Panel><Panel dark><h2 className="text-3xl font-black tracking-tight">Bliv en del af specialistnetværket</h2><p className="mt-4 leading-7 text-white/70">Naetwork leder efter specialister inden for web, automation, dashboards, design og MVP byggeri.</p><div className="mt-6 grid gap-3"><input value={providerName} onChange={(event) => setProviderName(event.target.value)} placeholder="Navn eller firma" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none focus:ring-4 focus:ring-white/10" /><input value={providerEmail} onChange={(event) => setProviderEmail(event.target.value)} placeholder="Email" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none focus:ring-4 focus:ring-white/10" /><textarea value={providerSkills} onChange={(event) => setProviderSkills(event.target.value)} rows={4} placeholder="Kompetencer og opgavetyper" className="resize-none rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none focus:ring-4 focus:ring-white/10" /><input value={providerLinks} onChange={(event) => setProviderLinks(event.target.value)} placeholder="Link til cases eller LinkedIn" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none focus:ring-4 focus:ring-white/10" /></div>{providerError && <div className="mt-4 rounded-2xl bg-rose-400/15 p-4 text-sm font-black text-rose-100 ring-1 ring-rose-200/20">{providerError}</div>}{providerSent && <div className="mt-4 rounded-2xl bg-emerald-300/15 p-4 text-sm font-black text-emerald-100 ring-1 ring-emerald-200/20">Tak. Din interesse er modtaget.</div>}<div className="mt-6 flex flex-col gap-3 sm:flex-row"><Button secondary onClick={submitProvider} disabled={providerLoading}>{providerLoading ? "Sender" : "Ansøg som specialist"}</Button><Button secondary onClick={() => open("task")}>Se kunde flow</Button></div></Panel></section>}

      <footer className="mx-auto max-w-7xl px-5 py-10 text-sm text-slate-500"><div className="flex flex-col justify-between gap-4 border-t border-slate-200 pt-6 md:flex-row"><span>Naetwork · Få opgaven gjort klar.</span><button type="button" onClick={() => open("provider")} className="text-left font-black text-[#071527] md:text-right">For specialister</button></div></footer>
    </main>
  );
}
