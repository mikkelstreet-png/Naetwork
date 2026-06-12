'use client';

import { type ReactNode, useMemo, useState } from "react";

type View = "home" | "brief" | "matches" | "project" | "provider" | "how";
type Category = "Ikke sikker" | "Hjemmeside" | "Webapp / MVP" | "Dashboard" | "Automation" | "Pitch deck";
type Status = "idle" | "sent";
type Intake = { category: Category; need: string; audience: string; budget: string; deadline: string };
type ProblemCard = { title: string; summary: string; detail: string; action: string; category: Category };

const initialIntake: Intake = {
  category: "Ikke sikker",
  need: "Jeg har en digital opgave, som ikke kræver et stort konsulentbureau, men jeg har brug for en dygtig specialist til at få den løst rigtigt.",
  audience: "Små virksomheder, iværksættere og private med digitale opgaver.",
  budget: "Afklares",
  deadline: "Afklares"
};

const categories: Record<Category, { title: string; specialist: string; budget: string; example: string; tags: string[]; scope: string[]; questions: string[] }> = {
  "Ikke sikker": {
    title: "Digital opgave gjort klar før du vælger specialist",
    specialist: "Digital produkt specialist",
    budget: "Afklares efter opgaven",
    example: "Jeg har en digital opgave, men ved ikke om jeg skal bruge hjemmeside, automation, dashboard eller webapp.",
    tags: ["Behovsafklaring", "Opgavebeskrivelse", "Brief", "Specialist"],
    scope: ["Afklare hvad der faktisk skal laves", "Definere første version", "Skelne mellem det vigtigste og det, der kan vente", "Anbefale specialisttype"],
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

const matches = [
  { name: "Webapp specialist", type: "MVP og produktbyggeri", score: "Stærk", price: "Efter opgave", time: "Uger", note: "Relevant til en afgrænset første version med klart produktflow og hurtig lancering.", tags: ["MVP", "UX", "Frontend", "Backend"] },
  { name: "Automation specialist", type: "Workflows og digitale processer", score: "Stærk", price: "Efter flow", time: "Dage eller uger", note: "Relevant når opgaven handler om at spare tid og få værktøjer sat rigtigt sammen.", tags: ["Automation", "Workflow", "Sheets", "Proces"] },
  { name: "Design og launch specialist", type: "Landing page og materiale", score: "God", price: "Efter behov", time: "Uger", note: "God retning hvis første version skal fremstå skarp, troværdig og klar til markedet.", tags: ["Landing", "UI", "Brand", "Launch"] }
];

const problemCards: ProblemCard[] = [
  { title: "Få flere henvendelser fra din hjemmeside", summary: "Siden findes, men skaber ikke nok leads.", detail: "Få hjælp til struktur, tekst, design og kontaktflow, så hjemmesiden faktisk arbejder for dig.", action: "Gør hjemmesideopgaven klar", category: "Hjemmeside" },
  { title: "Slip for gentaget manuelt arbejde", summary: "Mails, Excel og opfølgning tager for meget tid.", detail: "Få sat et simpelt workflow op, der fjerner gentagelser og sparer tid hver uge.", action: "Afklar flowet", category: "Automation" },
  { title: "Gør digitale værktøjer praktiske i din virksomhed", summary: "Du bruger værktøjer, men mangler et konkret flow.", detail: "Få en specialist til at bygge et praktisk workflow, system eller proces, der passer til hverdagen.", action: "Find første use case", category: "Automation" },
  { title: "Få første version af din idé bygget rigtigt", summary: "Du har idéen, men ikke rammen for første version.", detail: "Få prioriteret første version, så du bygger det rigtige uden at gøre projektet for stort.", action: "Afgræns første version", category: "Webapp / MVP" },
  { title: "Få styr på kunder, salg og overblik", summary: "Leads og data ligger spredt i mails, CRM og Excel.", detail: "Få ét klart overblik over det, du skal følge op på og træffe beslutninger ud fra.", action: "Saml overblik i en brief", category: "Dashboard" },
  { title: "Se professionel ud, når det gælder", summary: "Pitch, salgsdeck eller kundemateriale skal sidde skarpt.", detail: "Få materialet struktureret og designet, så din virksomhed føles klar og troværdig.", action: "Beskriv materialet", category: "Pitch deck" }
];

const processSteps = [
  { step: "01", title: "Du beskriver opgaven", text: "Start med det, du ved, også selvom opgaven ikke er færdigtænkt." },
  { step: "02", title: "Opgaven bliver gjort klarere", text: "Naetwork hjælper med at finde ud af, hvad der faktisk skal laves, og hvad der kan vente." },
  { step: "03", title: "Du får et bedre grundlag", text: "Opgaven samles i en klar brief, så den er nemmere at forstå og vurdere." },
  { step: "04", title: "Relevante specialister kan se opgaven", text: "Specialister får en tydeligere opgave at tage stilling til." },
  { step: "05", title: "Du får bedre overblik", text: "Det bliver lettere at forstå forskel på pris, tid, tilgang og løsning." },
  { step: "06", title: "Du vælger, hvem du vil gå videre med", text: "Når opgaven og mulighederne er tydelige, kan du vælge specialist med mere ro." }
];

const fitCards = [["For vigtigt til at ligge", "Opgaver der skaber fremdrift, men ofte bliver udskudt fordi opgaven og ejeren er uklar."], ["Ikke et stort bureauprojekt", "Når du ikke har brug for et stort team, men for en dygtig specialist på den rigtige opgave."], ["Ikke kun smarte værktøjer", "Værktøjer kan hjælpe, men erfaring får arbejdet gjort rigtigt."], ["Specialist i dage eller uger", "Få målrettet hjælp til det konkrete, der skal løses, uden tungt setup."]];
const whyCards = [["Ikke tung proces", "Ingen stor proces, når opgaven kan løses af en specialist."], ["Ikke profiljagt", "Du skal ikke selv gennemgå en masse profiler og gætte, hvem der passer."], ["Ikke løse idéer", "Opgaven skal være tydelig nok til, at den kan vurderes ordentligt."], ["Klar opgave først", "En klarere opgave, en mere relevant specialist og et mere overskueligt forløb."]];

function cx(...classes: Array<string | false | undefined>) { return classes.filter(Boolean).join(" "); }
function Panel({ children, dark = false, className = "" }: { children: ReactNode; dark?: boolean; className?: string }) { return <div className={cx("rounded-[30px] border p-6 shadow-sm", dark ? "border-slate-800 bg-[#071527] text-white" : "border-slate-200 bg-white text-slate-950", className)}>{children}</div>; }
function Button({ children, onClick, secondary = false, className = "" }: { children: ReactNode; onClick?: () => void; secondary?: boolean; className?: string }) { return <button type="button" onClick={onClick} className={cx("rounded-full px-6 py-3 text-sm font-black transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#3f8f83]/20", secondary ? "border border-slate-300 bg-white text-slate-800 hover:border-slate-400" : "bg-[#071527] text-white shadow-lg shadow-slate-900/10 hover:bg-[#0b203a]", className)}>{children}</button>; }
function Eyebrow({ children }: { children: ReactNode }) { return <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">{children}</p>; }
function Badge({ children, dark = false }: { children: ReactNode; dark?: boolean }) { return <span className={cx("inline-flex h-9 w-fit shrink-0 items-center rounded-full px-4 text-xs font-black", dark ? "bg-white/10 text-white ring-1 ring-white/10" : "border border-slate-200 bg-white text-slate-700")}>{children}</span>; }
function Stat({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">{label}</p><p className="mt-2 text-xl font-black tracking-tight text-[#071527]">{value}</p></div>; }

export function NaetworkExperience() {
  const [view, setView] = useState<View>("home");
  const [menu, setMenu] = useState(false);
  const [intake, setIntake] = useState<Intake>(initialIntake);
  const [selectedMatch, setSelectedMatch] = useState(matches[0]);
  const [email, setEmail] = useState("");
  const [interestStatus, setInterestStatus] = useState<Status>("idle");
  const [providerStatus, setProviderStatus] = useState<Status>("idle");
  const [expandedProblem, setExpandedProblem] = useState<string | null>(problemCards[0].title);

  const config = categories[intake.category];
  const brief = useMemo(() => ({ title: config.title, specialist: config.specialist, budget: intake.budget === "Afklares" ? config.budget : intake.budget, deadline: intake.deadline, tags: config.tags, scope: config.scope, questions: config.questions, acceptance: ["Kerneflow virker på desktop og mobil", "Leverancen matcher godkendt brief", "Specialisten afleverer kort overlevering", "Feedback samles i én tydelig runde"], notIncluded: ["Ubegrænset scope", "Betaling eller login uden særskilt afklaring", "Løbende drift uden aftale"] }), [config, intake.budget, intake.deadline]);

  const open = (target: View) => { setView(target); setMenu(false); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); };
  const chooseCategory = (category: Category, need?: string) => { setIntake({ ...intake, category, need: need || categories[category].example }); open("brief"); };
  const nav = (target: View, label: string) => <button type="button" onClick={() => open(target)} className={cx("rounded-full px-4 py-2 text-sm font-bold transition", view === target ? "bg-[#071527] text-white" : "text-slate-600 hover:bg-slate-100")}>{label}</button>;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e8f4ef_0,#f7f8fb_34%,#f7f8fb_100%)] text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <button type="button" onClick={() => open("home")} className="flex items-center gap-3 text-left"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">N</span><span><span className="block text-lg font-black tracking-tight">Naetwork</span><span className="block text-xs text-slate-500">Få opgaven gjort klar</span></span></button>
          <nav className="hidden items-center gap-2 lg:flex">{nav("home", "Forside")}{nav("brief", "Få brief")}{nav("matches", "Sådan virker det")}{nav("provider", "For specialister")}</nav>
          <div className="hidden gap-2 md:flex"><Button secondary onClick={() => open("matches")}>Se processen</Button><Button onClick={() => open("brief")}>Afklar min opgave</Button></div>
          <button type="button" onClick={() => setMenu(!menu)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-black lg:hidden">Menu</button>
        </div>
        {menu && <div className="border-t border-slate-200 bg-white px-5 py-4 lg:hidden"><div className="grid gap-2">{nav("home", "Forside")}{nav("brief", "Få brief")}{nav("matches", "Sådan virker det")}{nav("provider", "For specialister")}</div></div>}
      </header>

      {view === "home" && <>
        <section className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-10 lg:grid-cols-[1.04fr_.96fr] lg:py-20">
          <div><div className="mb-5 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm">Fra uklar opgave til klar retning</div><h1 className="max-w-5xl text-4xl font-black leading-[.96] tracking-[-0.05em] text-[#071527] md:text-7xl">Få styr på din digitale opgave og kom videre med den rigtige specialist.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Beskriv opgaven med dine egne ord. Naetwork hjælper dig med at finde ud af, hvad der egentlig skal laves, hvad der bør være med, og hvilken type specialist der passer til opgaven.</p>
            <div className="mt-8 rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm md:p-5"><div className="mb-3 flex items-center justify-between gap-3"><p className="text-sm font-black text-[#071527]">Fortæl kort, hvad du gerne vil have hjælp til</p><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-800">Under 2 min.</span></div><textarea value={intake.need} onChange={(event) => setIntake({ ...intake, need: event.target.value })} rows={4} className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none focus:border-[#3f8f83] focus:ring-4 focus:ring-[#3f8f83]/10" placeholder="Fx: Jeg vil have flere henvendelser fra min hjemmeside, få styr på et manuelt workflow eller få første version af en idé bygget." /><div className="mt-4 flex flex-col gap-3 sm:flex-row"><Button onClick={() => open("brief")}>Afklar min opgave</Button><Button secondary onClick={() => open("matches")}>Se processen</Button></div><p className="mt-3 text-xs font-bold text-slate-500">Start med egne ord · Ingen teknisk forklaring nødvendig · Ingen binding</p></div>
            <div className="mt-6 flex flex-wrap gap-2"><Badge>Klar brief</Badge><Badge>Relevant specialist</Badge><Badge>Mere overskueligt forløb</Badge></div></div>
          <Panel dark className="relative overflow-hidden lg:p-8"><div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-emerald-300/10 blur-2xl" /><div className="relative flex items-start justify-between gap-6"><div><p className="text-sm font-black uppercase tracking-[.2em] text-emerald-200">Fra uklar opgave til klart næste skridt</p><h2 className="mt-3 text-3xl font-black tracking-tight">Sådan hjælper Naetwork dig videre</h2></div><Badge dark>Klar opgave først</Badge></div><div className="relative mt-7 grid gap-3">{processSteps.map((item) => <div key={item.step} className="grid gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10 sm:grid-cols-[42px_1fr]"><span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-xs font-black text-emerald-100">{item.step}</span><div><p className="text-sm font-black text-white">{item.title}</p><p className="mt-1 text-sm leading-6 text-white/65">{item.text}</p></div></div>)}</div><div className="relative mt-7 rounded-2xl bg-emerald-300/10 p-5 ring-1 ring-emerald-200/20"><p className="text-sm font-black text-emerald-100">Målet er ikke bare at lave en brief. Målet er at gøre opgaven klar nok til, at både du og specialisten forstår, hvad der skal ske, før arbejdet går i gang.</p></div></Panel>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-8"><div className="grid gap-4 md:grid-cols-3">{[["1", "Fortæl hvad du har brug for", "Start med det du gerne vil opnå, ikke hvad løsningen hedder teknisk."], ["2", "Få opgaven gjort klar", "Naetwork samler behov, forventninger og næste skridt i en tydelig brief."], ["3", "Find den rette specialist", "Når opgaven er tydeligere, bliver det lettere at vælge den rigtige hjælp."]].map(([number, title, text]) => <Panel key={title} className="transition hover:-translate-y-1 hover:shadow-md"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">{number}</span><h3 className="mt-5 text-xl font-black text-[#071527]">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{text}</p></Panel>)}</div></section>

        <section className="mx-auto max-w-7xl px-5 py-12"><Panel className="grid gap-6 lg:grid-cols-[.85fr_1.15fr]"><div><Eyebrow>Hvor Naetwork passer ind</Eyebrow><h2 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Når du ved, noget skal løses, men ikke helt ved, hvor du skal starte.</h2><p className="mt-4 leading-7 text-slate-600">Mange digitale opgaver går i stå, fordi det er uklart, hvad der faktisk skal laves. Naetwork hjælper med at gøre opgaven tydeligere, så den rigtige specialist lettere kan hjælpe.</p></div><div className="grid gap-3 md:grid-cols-2">{fitCards.map(([title, text]) => <div key={title} className="rounded-2xl bg-slate-50 p-4"><p className="font-black text-[#071527]">{title}</p><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>)}</div></Panel></section>

        <section className="mx-auto max-w-7xl px-5 py-12"><div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><Eyebrow>Eksempler</Eyebrow><h2 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">De ting du ved, burde fungere bedre</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">Mange opgaver bliver udskudt, fordi det er uklart, hvad der egentlig skal laves, og hvem der er bedst til at hjælpe.</p></div><Button secondary onClick={() => open("brief")}>Start med dit behov</Button></div><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{problemCards.map((item) => { const expanded = expandedProblem === item.title; return <div key={item.title} className="rounded-[24px] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#3f8f83]/40 hover:shadow-md"><button type="button" onClick={() => setExpandedProblem(expanded ? null : item.title)} className="w-full text-left"><div className="flex items-start justify-between gap-4"><p className="font-black text-[#071527]">{item.title}</p><span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-black text-slate-500">{expanded ? "Luk" : "Læs"}</span></div><p className="mt-3 text-sm leading-6 text-slate-600">{item.summary}</p></button>{expanded && <div className="mt-4 border-t border-slate-100 pt-4"><p className="text-sm leading-6 text-slate-600">{item.detail}</p><button type="button" onClick={() => chooseCategory(item.category, `${item.title}: ${item.summary} ${item.detail}`)} className="mt-4 text-sm font-black text-[#071527] underline decoration-[#3f8f83]/40 underline-offset-4">{item.action}</button></div>}</div>; })}</div><div className="mt-5 rounded-[24px] border border-slate-200 bg-white px-5 py-4 text-sm font-black leading-6 text-[#071527] shadow-sm">En klarere opgave. En mere relevant specialist. Et mere overskueligt forløb.</div></section>

        <section className="mx-auto max-w-7xl px-5 py-12"><div className="mb-6"><Eyebrow>Hvorfor Naetwork?</Eyebrow><h2 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Fordi en god løsning starter med en klar opgave.</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">Når opgaven er tydelig, bliver det lettere for dig at vælge den rigtige hjælp, og lettere for specialisten at vurdere, hvordan arbejdet bedst løses.</p></div><div className="grid gap-4 md:grid-cols-4">{whyCards.map(([title, text]) => <Panel key={title} className={title === "Klar opgave først" ? "border-[#3f8f83]/40 bg-emerald-50/40" : ""}><p className="font-black text-[#071527]">{title}</p><p className="mt-3 text-sm leading-6 text-slate-600">{text}</p></Panel>)}</div></section>

        <section className="mx-auto max-w-7xl px-5 py-12"><Panel className="grid gap-6 lg:grid-cols-[.85fr_1.15fr]"><div><Eyebrow>Start her</Eyebrow><h2 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Har du en opgave, der burde være løst?</h2><p className="mt-4 leading-7 text-slate-600">Start med at forklare opgaven, som du ser den. Naetwork hjælper med at gøre den klarere, så du lettere kan komme videre med den rigtige specialist.</p></div><div><div className="grid gap-3 md:grid-cols-2">{["Klarere opgave", "Relevant specialist", "Mindre profiljagt", "Mere ro i valget"].map((item) => <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm font-black text-slate-700">{item}</div>)}</div><div className="mt-5 flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row"><input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Din email" className="min-w-0 flex-1 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#3f8f83] focus:ring-4 focus:ring-[#3f8f83]/10" /><Button onClick={() => setInterestStatus("sent")}>{interestStatus === "sent" ? "Du er skrevet op" : "Skriv mig op"}</Button></div></div></Panel></section>
      </>}

      {view === "brief" && <section className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[.82fr_1.18fr]"><Panel><Eyebrow>Projektbrief</Eyebrow><h1 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Start med behovet, ikke kravspecifikationen.</h1><p className="mt-3 text-sm leading-6 text-slate-600">Få gjort opgaven klarere, før du skal vælge specialist eller sammenligne tilbud.</p><div className="mt-6 grid gap-4"><div><p className="mb-2 text-sm font-bold text-slate-700">Hvad minder opgaven mest om?</p><div className="flex flex-wrap gap-2">{(Object.keys(categories) as Category[]).map((item) => <button type="button" key={item} onClick={() => setIntake({ ...intake, category: item, need: item === "Ikke sikker" ? intake.need : categories[item].example })} className={cx("rounded-full border px-4 py-2 text-sm font-black transition", intake.category === item ? "border-[#071527] bg-[#071527] text-white" : "border-slate-200 bg-white text-slate-700 hover:border-[#3f8f83]/50")}>{item}</button>)}</div></div><label className="grid gap-2 text-sm font-bold text-slate-700">Beskriv med egne ord<textarea value={intake.need} onChange={(event) => setIntake({ ...intake, need: event.target.value })} rows={5} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-normal text-slate-950 outline-none focus:border-[#3f8f83] focus:ring-4 focus:ring-[#3f8f83]/10" /></label><label className="grid gap-2 text-sm font-bold text-slate-700">Hvem skal bruge løsningen?<textarea value={intake.audience} onChange={(event) => setIntake({ ...intake, audience: event.target.value })} rows={3} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-normal text-slate-950 outline-none focus:border-[#3f8f83] focus:ring-4 focus:ring-[#3f8f83]/10" /></label><div className="grid gap-4 md:grid-cols-2"><label className="grid gap-2 text-sm font-bold text-slate-700">Budget<input value={intake.budget} onChange={(event) => setIntake({ ...intake, budget: event.target.value })} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-normal text-slate-950 outline-none focus:border-[#3f8f83] focus:ring-4 focus:ring-[#3f8f83]/10" /></label><label className="grid gap-2 text-sm font-bold text-slate-700">Deadline<input value={intake.deadline} onChange={(event) => setIntake({ ...intake, deadline: event.target.value })} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-normal text-slate-950 outline-none focus:border-[#3f8f83] focus:ring-4 focus:ring-[#3f8f83]/10" /></label></div><Button onClick={() => open("matches")}>Se relevante specialisttyper</Button></div></Panel><Panel><div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5"><div><Eyebrow>Brief</Eyebrow><h2 className="mt-3 text-3xl font-black tracking-tight text-[#071527]">{brief.title}</h2></div><Badge>Klar brief</Badge></div><p className="mt-5 text-sm leading-6 text-slate-600">Briefen gør opgaven tydeligere med opgavebeskrivelse, fravalg, acceptkriterier og hvilken type specialist der passer.</p><div className="mt-5 grid gap-3 md:grid-cols-3"><Stat label="Specialist" value={brief.specialist.split(" eller")[0]} /><Stat label="Budget" value={brief.budget} /><Stat label="Deadline" value={brief.deadline} /></div><div className="mt-5 flex flex-wrap gap-2">{brief.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div><div className="mt-6 grid gap-6 md:grid-cols-2"><div><h3 className="font-black">Opgaven</h3><ul className="mt-3 grid gap-2">{brief.scope.map((item) => <li key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</li>)}</ul><h3 className="mt-6 font-black">Spørgsmål</h3><ul className="mt-3 grid gap-2">{brief.questions.map((item) => <li key={item} className="rounded-2xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">{item}</li>)}</ul></div><div><h3 className="font-black">Acceptkriterier</h3><ul className="mt-3 grid gap-2">{brief.acceptance.map((item) => <li key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</li>)}</ul><h3 className="mt-6 font-black">Ikke inkluderet</h3><ul className="mt-3 grid gap-2">{brief.notIncluded.map((item) => <li key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</li>)}</ul></div></div></Panel></section>}

      {view === "matches" && <section className="mx-auto max-w-7xl px-5 py-10"><div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><Eyebrow>Sådan virker matching</Eyebrow><h1 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Få relevante specialisttyper, ikke en endeløs profil liste.</h1><p className="mt-3 max-w-3xl text-slate-600">Når opgaven er tydelig, kan retninger sammenlignes på fit, prisniveau og leveringstid. Det gør valget mere roligt og budgettet mere overskueligt.</p></div><Button secondary onClick={() => open("brief")}>Tilbage til brief</Button></div><div className="grid gap-5 lg:grid-cols-3">{matches.map((match) => <Panel key={match.name} className="flex min-h-[410px] flex-col justify-between transition hover:-translate-y-1 hover:shadow-md"><div><div className="flex items-start justify-between gap-4"><div><p className="text-2xl font-black text-[#071527]">{match.name}</p><p className="mt-1 text-sm font-bold text-slate-500">{match.type}</p></div><span className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-800">{match.score}</span></div><p className="mt-5 text-sm leading-6 text-slate-600">{match.note}</p><div className="mt-5 flex flex-wrap gap-2">{match.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div><div className="mt-6 grid grid-cols-2 gap-3"><Stat label="Prisniveau" value={match.price} /><Stat label="Tid" value={match.time} /></div></div><Button onClick={() => { setSelectedMatch(match); open("project"); }}>Vælg retning</Button></Panel>)}</div></section>}

      {view === "project" && <section className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[.85fr_1.15fr]"><Panel dark><Eyebrow>Valgt retning</Eyebrow><h1 className="mt-3 text-4xl font-black tracking-tight">{selectedMatch.name}</h1><p className="mt-4 text-white/70">{selectedMatch.note}</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-white/10 p-4"><p className="text-sm text-white/60">Prisniveau</p><p className="mt-1 text-2xl font-black">{selectedMatch.price}</p></div><div className="rounded-2xl bg-white/10 p-4"><p className="text-sm text-white/60">Forventet tid</p><p className="mt-1 text-2xl font-black">{selectedMatch.time}</p></div></div><div className="mt-6 flex flex-col gap-3 sm:flex-row"><Button secondary onClick={() => open("how")}>Se næste trin</Button><Button secondary onClick={() => open("brief")}>Tilpas brief</Button></div></Panel><Panel><Eyebrow>Næste trin</Eyebrow><h2 className="mt-3 text-3xl font-black tracking-tight text-[#071527]">{brief.title}</h2><div className="mt-6 grid gap-3">{["Brief færdiggøres", "Relevante specialister udvælges", "Tilbud kan sammenlignes", "Specialist vælges", "Projekt startes", "Leverance og overlevering"].map((step, index) => <div key={step} className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4"><span className={cx("grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-black", index < 3 ? "bg-[#071527] text-white" : "bg-white text-slate-400 ring-1 ring-slate-200")}>{index + 1}</span><div><p className="font-black text-[#071527]">{step}</p><p className="text-sm text-slate-500">{index < 3 ? "Afklaret gennem Naetwork" : "Næste fase"}</p></div></div>)}</div></Panel></section>}

      {view === "provider" && <section className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[.85fr_1.15fr]"><Panel><Eyebrow>For specialister</Eyebrow><h1 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Bedre opgaver starter med bedre briefs.</h1><p className="mt-4 text-slate-600">Naetwork er for specialister, der vil bruge mindre tid på uklare henvendelser og mere tid på opgaver, hvor behovet allerede er gjort tydeligere.</p><div className="mt-6 grid gap-3">{["Mindre tid på uklare leads", "Brief og forventninger før tilbud", "Færre irrelevante henvendelser", "Mere professionel overlevering"].map((item) => <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm font-black text-slate-700">{item}</div>)}</div></Panel><Panel dark><h2 className="text-3xl font-black tracking-tight">Bliv en del af specialistnetværket</h2><p className="mt-4 leading-7 text-white/70">Naetwork samler opgaver, hvor kunden allerede er hjulpet videre fra løs idé til tydeligere brief.</p><div className="mt-6 grid gap-3">{["Kompetencer", "Opgavetyper", "Prisniveau", "Kapacitet", "Cases og links"].map((item) => <div key={item} className="rounded-2xl bg-white/10 p-4 text-sm font-black text-white/80 ring-1 ring-white/10">{item}</div>)}</div><div className="mt-6 flex flex-col gap-3 sm:flex-row"><Button secondary onClick={() => setProviderStatus("sent")}>{providerStatus === "sent" ? "Interesse registreret" : "Ansøg som specialist"}</Button><Button secondary onClick={() => open("brief")}>Se kunde flow</Button></div></Panel></section>}

      {view === "how" && <section className="mx-auto max-w-7xl px-5 py-10"><div className="mb-8"><Eyebrow>Sådan virker det</Eyebrow><h1 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Fra uklar opgave til roligere valg.</h1><p className="mt-3 max-w-3xl text-slate-600">Naetwork er bygget omkring én idé. Opgaven skal give mening, før arbejdet går i gang.</p></div><div className="grid gap-4 md:grid-cols-3">{["1. Behov", "2. Brief", "3. Specialist", "4. Tilbud", "5. Valg", "6. Arbejde"].map((item) => <Panel key={item} className="transition hover:-translate-y-1 hover:shadow-md"><p className="text-xl font-black text-[#071527]">{item}</p><p className="mt-3 text-sm leading-6 text-slate-600">Et struktureret flow, der gør opgaven tydeligere for både kunde og specialist.</p></Panel>)}</div><div className="mt-8"><Button onClick={() => open("brief")}>Start med din opgave</Button></div></section>}

      <footer className="mx-auto max-w-7xl px-5 py-10 text-sm text-slate-500"><div className="flex flex-col justify-between gap-4 border-t border-slate-200 pt-6 md:flex-row"><span>Naetwork · Få opgaven gjort klar.</span><button type="button" onClick={() => open("provider")} className="text-left font-black text-[#071527] md:text-right">For specialister</button></div></footer>
    </main>
  );
}
