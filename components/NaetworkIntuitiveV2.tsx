'use client';

import Link from "next/link";
import {
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
  useEffect,
  useMemo,
  useState
} from "react";

type View = "home" | "task" | "how" | "provider" | "submitted";
type Category =
  | "Hjemmeside / landing page"
  | "Webshop / betaling"
  | "Booking / kunderejse"
  | "Automatisering"
  | "Dashboard / data"
  | "AI i virksomheden"
  | "MVP / webapp"
  | "Salg / pitch";

type Intake = {
  category: Category;
  need: string;
  situation: string;
  outcome: string;
  audience: string;
  budget: string;
  deadline: string;
};

type Meta = {
  title: string;
  specialist: string;
  tags: string[];
  scope: string[];
  questions: string[];
};

const categoryCards: Array<{ category: Category; label: string; text: string }> = [
  { category: "Hjemmeside / landing page", label: "Hjemmeside / landing page", text: "Når siden skal se bedre ud, skabe flere henvendelser eller være nemmere at forstå." },
  { category: "Webshop / betaling", label: "Webshop / betaling", text: "Når du vil sælge produkter, tage imod betaling eller forbedre købsflowet." },
  { category: "Booking / kunderejse", label: "Booking / kunderejse", text: "Når kunder skal kunne booke, kontakte dig eller komme lettere gennem et flow." },
  { category: "Automatisering", label: "Automatisering", text: "Når mails, Excel, manuelle processer eller gentagelser skal gøres lettere." },
  { category: "Dashboard / data", label: "Dashboard / data", text: "Når du har data, men mangler overblik, rapportering eller beslutningsgrundlag." },
  { category: "AI i virksomheden", label: "AI i virksomheden", text: "Når du vil bruge AI praktisk til bedre output, hurtigere processer eller bedre workflows." },
  { category: "MVP / webapp", label: "MVP / webapp", text: "Når du har en digital idé og skal have første brugbare version gjort klar." },
  { category: "Salg / pitch", label: "Salg / pitch", text: "Når dit pitch, deck, tilbudsmateriale eller salgsflow skal være skarpere." }
];

const initialIntake: Intake = {
  category: "Hjemmeside / landing page",
  need: "Min hjemmeside får besøg, men for få henvendelser. Jeg vil gerne forstå, hvad der skal ændres, og hvilken type specialist der kan hjælpe.",
  situation: "Siden føles ikke helt professionel, og jeg er i tvivl om struktur, tekst og design hjælper brugeren videre.",
  outcome: "Jeg vil have en hjemmeside, der virker mere troværdig, er lettere at forstå og får flere relevante henvendelser.",
  audience: "Potentielle kunder eller samarbejdspartnere.",
  budget: "Afklares",
  deadline: "Afklares"
};

const metaByCategory: Record<Category, Meta> = {
  "Hjemmeside / landing page": {
    title: "Hjemmeside der bliver mere klar, troværdig og konverterende",
    specialist: "Hjemmeside-specialist med fokus på UX, tekst og konvertering",
    tags: ["Hjemmeside", "UX", "Kontaktflow"],
    scope: ["Forbedre forsidestruktur", "Gøre siden mere overskuelig", "Stramme teksthierarki og kontaktflow op"],
    questions: ["Hvilke henvendelser er mest værdifulde?", "Hvad skal besøgende gøre som næste handling?", "Hvilke sider er vigtigst først?"]
  },
  "Webshop / betaling": {
    title: "Webshop eller betalingsflow med tydelig købsrejse",
    specialist: "Webshop-specialist",
    tags: ["Webshop", "Betaling", "Købsflow"],
    scope: ["Afklare produkter og købsflow", "Vælge relevant betalings- og checkout-løsning", "Gøre første salgbare version enkel"],
    questions: ["Hvad skal sælges først?", "Hvordan håndteres betaling og levering?", "Hvilket system bruger du allerede?"]
  },
  "Booking / kunderejse": {
    title: "Booking- eller kontaktflow der gør det nemt at blive kunde",
    specialist: "Booking- og kunderejse-specialist",
    tags: ["Booking", "Kundeflow", "Kontakt"],
    scope: ["Kortlægge brugerens vej til kontakt eller booking", "Fjerne friktion i flowet", "Opsætte tydeligere næste handling"],
    questions: ["Hvad skal brugeren booke eller anmode om?", "Hvem skal modtage henvendelsen?", "Hvad sker der efter booking?"]
  },
  "Automatisering": {
    title: "Automatisering der fjerner manuelt dobbeltarbejde",
    specialist: "Automation-specialist",
    tags: ["Automation", "Workflow", "Proces"],
    scope: ["Kortlægge manuelt flow", "Afgrænse første automation", "Teste og dokumentere brugen"],
    questions: ["Hvad starter flowet?", "Hvor skal data ende?", "Hvad sker der, hvis noget fejler?"]
  },
  "Dashboard / data": {
    title: "Dashboard med overblik over centrale nøgletal",
    specialist: "Data- og dashboard-specialist",
    tags: ["Dashboard", "Data", "Rapportering"],
    scope: ["Kortlægge datakilder", "Definere nøgletal", "Samle overblik i én visning"],
    questions: ["Hvor ligger data i dag?", "Hvilke tal styrer du efter?", "Hvem skal bruge dashboardet?"]
  },
  "AI i virksomheden": {
    title: "Praktisk AI-workflow der forbedrer output eller sparer tid",
    specialist: "AI workflow-specialist",
    tags: ["AI", "Workflow", "Output"],
    scope: ["Finde relevante AI-brugsscenarier", "Afgrænse første praktiske workflow", "Gøre løsningen enkel at bruge"],
    questions: ["Hvor bruger du mest tid i dag?", "Hvilket output skal forbedres?", "Hvem skal bruge flowet?"]
  },
  "MVP / webapp": {
    title: "Første version af digital idé med klart kerneflow",
    specialist: "MVP- og webapp-specialist",
    tags: ["MVP", "Webapp", "Launch"],
    scope: ["Definere kerneflow", "Prioritere første version", "Gøre løsningen klar til test"],
    questions: ["Hvad er vigtigste brugerflow?", "Hvad skal med i første version?", "Hvad kan vente?"]
  },
  "Salg / pitch": {
    title: "Salgsmateriale eller pitch med klar fortælling",
    specialist: "Præsentations- og salgsflow-specialist",
    tags: ["Pitch", "Salg", "Storyline"],
    scope: ["Stramme budskab og storyline op", "Bygge tydelig struktur", "Gøre materialet mere beslutningsklart"],
    questions: ["Hvem skal materialet overbevise?", "Hvilken beslutning skal det drive?", "Hvad er vigtigste bevis eller case?"]
  }
};

const useCases = [
  { pain: "Mere trafik end leads", title: "Jeg får trafik, men ikke nok henvendelser", category: "Hjemmeside / landing page" as Category },
  { pain: "Kunder falder fra", title: "Mit booking- eller kontaktflow er for tungt", category: "Booking / kunderejse" as Category },
  { pain: "Manuelt arbejde", title: "Jeg bruger for meget tid på mails og Excel", category: "Automatisering" as Category },
  { pain: "AI er uklart", title: "Jeg vil bruge AI, men ved ikke hvor", category: "AI i virksomheden" as Category },
  { pain: "Første version", title: "Jeg har en idé, men ikke et klart MVP-scope", category: "MVP / webapp" as Category },
  { pain: "Salgsmateriale", title: "Mit pitch eller tilbudsmateriale er ikke skarpt", category: "Salg / pitch" as Category }
];

const processSteps = [
  ["01", "Fortæl opgaven", "Skriv problemet med dine egne ord. Du behøver ikke kende løsningen."],
  ["02", "Naetwork analyserer", "Vi gør opgaven klarere med diagnose, scope, spørgsmål og specialistretning."],
  ["03", "Find rette specialist", "Find den rette specialist for dig eller din virksomhed. Du vælger selv, om du vil gå videre."],
  ["04", "Arbejdet udføres", "Når kunde og specialist er enige om pris, levering og rammer, udfører specialisten arbejdet direkte med kunden."]
];

const taskSteps = [
  { title: "Opgavetype", short: "Type", text: "Vælg det, din opgave minder mest om.", helper: "Du behøver ikke vælge perfekt. Det hjælper bare med første retning." },
  { title: "Behov", short: "Behov", text: "Skriv hvad du gerne vil have hjælp til.", helper: "Skriv uperfekt. Det er præcis det Naetwork skal gøre klarere." },
  { title: "Situation", short: "Situation", text: "Fortæl hvad der ikke fungerer i dag.", helper: "Det gør briefen mere præcis." },
  { title: "Resultat", short: "Resultat", text: "Beskriv hvad der skal være anderledes.", helper: "Nu kan vi bedre forstå effekten, du ønsker." },
  { title: "Detaljer", short: "Detaljer", text: "Tilføj målgruppe, budget, deadline og email.", helper: "Du er næsten færdig." },
  { title: "Send", short: "Send", text: "Gennemgå briefen og send opgaven.", helper: "Du sender en foreløbig brief, ikke en bindende bestilling." }
];

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function validEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value.trim());
}

function Button({ children, secondary, full, disabled, onClick }: { children: ReactNode; secondary?: boolean; full?: boolean; disabled?: boolean; onClick?: () => void }) {
  return <button type="button" disabled={disabled} onClick={onClick} className={cx("inline-flex min-h-[46px] items-center justify-center rounded-full px-5 py-3 text-sm font-black transition focus:outline-none focus:ring-4 focus:ring-emerald-900/10 sm:px-6", full && "w-full", disabled && "cursor-not-allowed opacity-50", secondary ? "border border-slate-300 bg-white text-slate-800 hover:border-slate-400" : "bg-[#071527] text-white hover:bg-[#0b203a]")}>{children}</button>;
}

function Card({ children, dark, className = "" }: { children: ReactNode; dark?: boolean; className?: string }) {
  return <div className={cx("rounded-[26px] border p-5 shadow-sm sm:rounded-[30px] sm:p-6", dark ? "border-slate-800 bg-[#071527] text-white" : "border-slate-200 bg-white text-slate-950", className)}>{children}</div>;
}

function Eyebrow({ children, light }: { children: ReactNode; light?: boolean }) {
  return <p className={cx("text-xs font-black uppercase tracking-[.2em] sm:text-sm", light ? "text-emerald-200" : "text-[#3f8f83]")}>{children}</p>;
}

function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition focus:border-[#3f8f83] focus:ring-4 focus:ring-[#3f8f83]/10" />;
}

function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-[#3f8f83] focus:ring-4 focus:ring-[#3f8f83]/10" />;
}

export function NaetworkIntuitiveV2() {
  const [view, setView] = useState<View>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cookieVisible, setCookieVisible] = useState(false);
  const [taskStep, setTaskStep] = useState(0);
  const [intake, setIntake] = useState<Intake>(initialIntake);
  const [email, setEmail] = useState("");
  const [taskError, setTaskError] = useState("");
  const [taskLoading, setTaskLoading] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [providerName, setProviderName] = useState("");
  const [providerEmail, setProviderEmail] = useState("");
  const [providerSkills, setProviderSkills] = useState("");
  const [providerLinks, setProviderLinks] = useState("");
  const [providerError, setProviderError] = useState("");
  const [providerLoading, setProviderLoading] = useState(false);
  const [providerSent, setProviderSent] = useState(false);

  useEffect(() => {
    try { setCookieVisible(window.localStorage.getItem("naetwork_cookie_notice_accepted") !== "true"); } catch { setCookieVisible(true); }
  }, []);

  const meta = metaByCategory[intake.category];
  const brief = useMemo(() => ({ title: meta.title, specialist: meta.specialist, tags: meta.tags, scope: meta.scope, questions: meta.questions }), [meta]);
  const progress = `${Math.round(((taskStep + 1) / taskSteps.length) * 100)}%`;
  const categories = categoryCards.map((item) => item.category);

  function open(next: View) {
    setView(next);
    setMobileOpen(false);
    setTaskError("");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function chooseUseCase(category: Category) {
    setIntake({ ...initialIntake, category, need: metaByCategory[category].title });
    setTaskStep(1);
    open("task");
  }

  function nextTaskStep() {
    setTaskError("");
    if (taskStep === 1 && intake.need.trim().length < 25) return setTaskError("Skriv lidt mere om, hvad du gerne vil have hjælp til.");
    if (taskStep === 2 && intake.situation.trim().length < 15) return setTaskError("Skriv kort hvad der ikke fungerer i dag.");
    if (taskStep === 3 && intake.outcome.trim().length < 15) return setTaskError("Skriv kort hvad der skal være anderledes.");
    if (taskStep === 4 && !validEmail(email)) return setTaskError("Indtast en gyldig email, så vi kan sende kvittering og vende tilbage.");
    setTaskStep((current) => Math.min(current + 1, taskSteps.length - 1));
  }

  async function submitTask() {
    if (intake.need.trim().length < 25) return setTaskError("Skriv lidt mere om opgaven, så briefen bliver brugbar.");
    if (!validEmail(email)) return setTaskError("Indtast en gyldig email.");
    setTaskLoading(true);
    setTaskError("");

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intake, email, brief })
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
  }

  async function submitProvider() {
    if (providerName.trim().length < 2) return setProviderError("Skriv dit navn eller firmanavn.");
    if (!validEmail(providerEmail)) return setProviderError("Indtast en gyldig email.");
    if (providerSkills.trim().length < 20) return setProviderError("Skriv lidt mere om dine kompetencer og opgavetyper.");
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
  }

  function acceptCookies() {
    try { window.localStorage.setItem("naetwork_cookie_notice_accepted", "true"); } catch {}
    setCookieVisible(false);
  }

  const navItems: Array<[View, string]> = [["home", "Forside"], ["task", "Opret opgave"], ["how", "Sådan virker det"], ["provider", "For specialister"]];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e8f4ef_0,#f7f8fb_35%,#f7f8fb_100%)] text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-5">
          <button type="button" onClick={() => open("home")} className="flex min-w-0 items-center gap-3 text-left">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">N</span>
            <span className="min-w-0"><span className="block truncate text-lg font-black tracking-tight">Naetwork</span><span className="block truncate text-xs text-slate-500">Få opgaven gjort klar</span></span>
          </button>
          <nav className="hidden items-center gap-2 lg:flex">{navItems.map(([target, label]) => <button key={target} type="button" onClick={() => open(target)} className={cx("rounded-full px-4 py-2 text-sm font-bold transition", view === target ? "bg-[#071527] text-white" : "text-slate-600 hover:bg-slate-100")}>{label}</button>)}</nav>
          <div className="flex shrink-0 items-center gap-2"><Button onClick={() => { setTaskStep(0); open("task"); }}>Start kort</Button><button type="button" onClick={() => setMobileOpen((value) => !value)} className="min-h-[46px] rounded-full border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 lg:hidden">Menu</button></div>
        </div>
        {mobileOpen && <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden"><div className="mx-auto grid max-w-7xl gap-2">{navItems.map(([target, label]) => <button key={target} type="button" onClick={() => open(target)} className="rounded-2xl bg-slate-50 px-4 py-3 text-left text-sm font-black text-slate-700">{label}</button>)}<div className="mt-2 grid grid-cols-3 gap-2 text-xs font-black"><Link className="rounded-2xl border border-slate-200 px-3 py-2 text-center" href="/vilkaar">Vilkår</Link><Link className="rounded-2xl border border-slate-200 px-3 py-2 text-center" href="/privatliv">Privatliv</Link><Link className="rounded-2xl border border-slate-200 px-3 py-2 text-center" href="/cookies">Cookies</Link></div></div></div>}
      </header>

      {view === "home" && <>
        <section className="mx-auto grid max-w-7xl items-start gap-8 px-4 py-12 sm:px-5 lg:grid-cols-[1.02fr_.98fr] lg:py-20"><div><div className="mb-5 inline-flex max-w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm">For selvstændige, startups og små virksomheder</div><h1 className="max-w-5xl text-4xl font-black leading-[.96] tracking-[-0.05em] text-[#071527] md:text-7xl">Beskriv opgaven. Få den gjort klar. Kom videre med den rigtige specialist.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Naetwork hjælper dig, når noget digitalt bør fungere bedre, men du ikke ved præcis hvad du skal bestille, eller hvem der skal løse det.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button onClick={() => { setTaskStep(0); open("task"); }}>Start med en kort beskrivelse</Button><Button secondary onClick={() => open("how")}>Se hvordan det virker</Button></div><div className="mt-6 flex flex-wrap gap-2">{["Ingen betaling på første trin", "Ingen teknisk kravspecifikation", "Du vælger selv næste skridt"].map((item) => <span key={item} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700">{item}</span>)}</div></div><Card><div className="mb-4 flex items-start justify-between gap-4"><div><p className="text-lg font-black text-[#071527]">Hvor starter de fleste?</p><p className="mt-1 text-sm leading-6 text-slate-500">Med et problem, der ikke er formuleret som en opgave endnu.</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-800">Eksempel</span></div><div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">“Min hjemmeside føles ikke særlig flot, den er lidt uoverskuelig, og jeg får ikke nok henvendelser.”</div><div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-[#071527] p-4 text-white"><p className="text-xs font-black text-emerald-200">Du starter med</p><p className="mt-2 text-sm leading-6 text-white/75">Et uklart problem</p></div><div className="rounded-2xl bg-[#071527] p-4 text-white"><p className="text-xs font-black text-emerald-200">Naetwork gør klart</p><p className="mt-2 text-sm leading-6 text-white/75">Design, struktur og kontaktflow</p></div><div className="rounded-2xl bg-[#071527] p-4 text-white"><p className="text-xs font-black text-emerald-200">Du får videre</p><p className="mt-2 text-sm leading-6 text-white/75">Scope + specialistretning</p></div></div></Card></section>

        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-5"><div className="grid gap-4 md:grid-cols-3"><Card><p className="font-black text-[#071527]">Jeg ved, hvad problemet er</p><p className="mt-2 text-sm leading-6 text-slate-600">Skriv det kort, så gør vi det mere konkret.</p><div className="mt-4"><Button full onClick={() => open("task")}>Start kort</Button></div></Card><Card><p className="font-black text-[#071527]">Jeg vil forstå processen</p><p className="mt-2 text-sm leading-6 text-slate-600">Se hvordan en uklar idé bliver til en brugbar brief.</p><div className="mt-4"><Button secondary full onClick={() => open("how")}>Se processen</Button></div></Card><Card><p className="font-black text-[#071527]">Jeg er specialist</p><p className="mt-2 text-sm leading-6 text-slate-600">Modtag bedre briefs og mere relevante opgaver.</p><div className="mt-4"><Button secondary full onClick={() => open("provider")}>For specialister</Button></div></Card></div></section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-5"><div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><Eyebrow>Find dig selv her</Eyebrow><h2 className="mt-3 text-3xl font-black tracking-tight text-[#071527] sm:text-4xl">Det folk typisk mangler hjælp til</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">Klik på det problem, der minder mest om dit. Du kan altid uddybe bagefter.</p></div><Button secondary onClick={() => { setTaskStep(0); open("task"); }}>Start med egen opgave</Button></div><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{useCases.map((item) => <button key={item.title} type="button" onClick={() => chooseUseCase(item.category)} className="group rounded-[24px] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#3f8f83]/50 hover:shadow-md"><div className="mb-5 flex items-start justify-between gap-4"><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-800">{item.pain}</span><span className="text-lg font-black text-slate-300 transition group-hover:text-[#3f8f83]">→</span></div><p className="font-black text-[#071527]">{item.title}</p></button>)}</div></section>
      </>}

      {view === "how" && <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5 lg:py-16"><div className="mx-auto max-w-3xl text-center"><Eyebrow>Sådan virker det</Eyebrow><h1 className="mt-4 text-4xl font-black tracking-tight text-[#071527] md:text-6xl">Fire trin. Fra uklar opgave til konkret næste skridt.</h1><p className="mt-5 text-lg leading-8 text-slate-600">Du beskriver problemet. Naetwork analyserer det og gør det til scope, specialistretning og næste spørgsmål. Du vælger selv, om du vil gå videre.</p></div><div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{processSteps.map(([number, title, text]) => <Card key={number} className="min-h-[220px] text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">{number}</span><h2 className="mt-5 text-xl font-black leading-tight text-[#071527] sm:text-2xl">{title}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{text}</p></Card>)}</div><div className="mt-8 grid gap-4 lg:grid-cols-[.86fr_1.14fr]"><Card><p className="text-xs font-black uppercase tracking-[.18em] text-slate-400">Før</p><p className="mt-3 text-2xl font-black text-[#071527]">“Jeg skal bruge hjælp til min hjemmeside. Den føles ikke særlig flot, den er lidt uoverskuelig, og jeg får ikke nok henvendelser.”</p><p className="mt-3 text-sm leading-6 text-slate-600">En helt normal start, men stadig for upræcis til at vælge den rigtige specialist eller scope opgaven korrekt.</p></Card><Card dark><Eyebrow light>Efter Naetwork-analysen</Eyebrow><p className="mt-3 text-2xl font-black">Udsnit af den foreløbige brief</p><div className="mt-5 grid gap-3 text-left"><div className="rounded-2xl bg-white/10 p-4"><p className="text-xs font-black uppercase tracking-[.14em] text-emerald-100">Kort diagnose</p><p className="mt-2 text-sm leading-6 text-white/75">Opgaven handler ikke kun om design. Den handler især om at gøre hjemmesiden mere overskuelig, mere troværdig og bedre til at få besøgende til at tage kontakt.</p></div><div className="rounded-2xl bg-white/10 p-4"><p className="text-xs font-black uppercase tracking-[.14em] text-emerald-100">Scope</p><p className="mt-2 text-sm leading-6 text-white/75">Forbedre forsidestruktur, visuel prioritering, teksthierarki og kontaktflow.</p></div><div className="grid gap-3 md:grid-cols-2"><div className="rounded-2xl bg-white/10 p-4"><p className="text-xs font-black uppercase tracking-[.14em] text-emerald-100">Specialistretning</p><p className="mt-2 text-sm leading-6 text-white/75">Hjemmeside-specialist med fokus på UX, tekst og konvertering.</p></div><div className="rounded-2xl bg-white/10 p-4"><p className="text-xs font-black uppercase tracking-[.14em] text-emerald-100">Næste spørgsmål</p><p className="mt-2 text-sm leading-6 text-white/75">Hvilke henvendelser er mest værdifulde, og hvad skal besøgende gøre som næste handling?</p></div></div></div></Card></div><div className="mt-8 flex justify-center"><Button onClick={() => { setTaskStep(0); open("task"); }}>Start med kort beskrivelse</Button></div></section>}

      {view === "task" && <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-5 lg:grid-cols-[.9fr_1.1fr]"><Card><div className="mb-6"><Eyebrow>Opret opgave</Eyebrow><h1 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Fortæl én ting ad gangen.</h1><p className="mt-3 text-sm leading-6 text-slate-600">Du skal ikke kende løsningen. Flowet hjælper dig med at gøre opgaven klar nok til næste skridt.</p></div><div className="mb-6 sm:hidden"><div className="flex justify-between gap-4 text-xs font-black text-slate-500"><span>Trin {taskStep + 1} af {taskSteps.length}</span><span className="text-right">{taskSteps[taskStep].title}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#071527] transition-all" style={{ width: progress }} /></div></div><div className="mb-6 hidden grid-cols-3 gap-2 sm:grid xl:grid-cols-6">{taskSteps.map((step, index) => <button key={step.title} type="button" onClick={() => { setTaskStep(index); setTaskError(""); }} className={cx("min-h-[68px] rounded-2xl border p-3 text-left transition", taskStep === index ? "border-[#071527] bg-[#071527] text-white" : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300")}><span className="block text-[11px] font-black leading-none opacity-70">{index + 1}</span><span className="mt-2 block whitespace-nowrap text-[11px] font-black leading-tight sm:text-xs">{step.short}</span></button>)}</div><div className="rounded-[24px] border border-slate-200 bg-white p-5"><p className="text-xs font-black uppercase tracking-[.18em] text-[#3f8f83]">{taskSteps[taskStep].title}</p><h2 className="mt-2 text-2xl font-black text-[#071527]">{taskSteps[taskStep].text}</h2><p className="mt-2 rounded-2xl bg-emerald-50 p-3 text-sm font-bold leading-6 text-emerald-900">{taskSteps[taskStep].helper}</p><div className="mt-5">{taskStep === 0 && <div className="grid gap-3">{categoryCards.map((item) => <button key={item.category} type="button" onClick={() => setIntake({ ...intake, category: item.category })} className={cx("rounded-2xl border p-4 text-left transition", intake.category === item.category ? "border-[#071527] bg-[#071527] text-white" : "border-slate-200 bg-slate-50 text-slate-700 hover:border-[#3f8f83]/50")}><span className="block text-sm font-black">{item.label}</span><span className={cx("mt-1 block text-sm leading-6", intake.category === item.category ? "text-white/70" : "text-slate-500")}>{item.text}</span></button>)}</div>}{taskStep === 1 && <TextArea rows={6} value={intake.need} onChange={(event) => setIntake({ ...intake, need: event.target.value })} />}{taskStep === 2 && <TextArea rows={5} value={intake.situation} onChange={(event) => setIntake({ ...intake, situation: event.target.value })} />}{taskStep === 3 && <TextArea rows={5} value={intake.outcome} onChange={(event) => setIntake({ ...intake, outcome: event.target.value })} />}{taskStep === 4 && <div className="grid gap-4"><label className="grid gap-2 text-sm font-bold text-slate-700">Hvem skal bruge løsningen?<Input value={intake.audience} onChange={(event) => setIntake({ ...intake, audience: event.target.value })} /></label><div className="grid gap-4 md:grid-cols-2"><label className="grid gap-2 text-sm font-bold text-slate-700">Budget<Input value={intake.budget} onChange={(event) => setIntake({ ...intake, budget: event.target.value })} /></label><label className="grid gap-2 text-sm font-bold text-slate-700">Deadline<Input value={intake.deadline} onChange={(event) => setIntake({ ...intake, deadline: event.target.value })} /></label></div><label className="grid gap-2 text-sm font-bold text-slate-700">Email til svar<Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="din@email.dk" /></label></div>}{taskStep === 5 && <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm font-black text-[#071527]">{brief.title}</p><p className="mt-2 text-sm leading-6 text-slate-600">Specialistretning: {brief.specialist}</p></div>}</div></div>{taskError && <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-black text-rose-700">{taskError}</div>}<div className="mt-5 grid gap-3 sm:grid-cols-2"><Button secondary full disabled={taskStep === 0} onClick={() => setTaskStep((current) => Math.max(0, current - 1))}>Tilbage</Button>{taskStep < taskSteps.length - 1 ? <Button full onClick={nextTaskStep}>Næste</Button> : <Button full onClick={submitTask} disabled={taskLoading}>{taskLoading ? "Sender opgave" : "Send opgaven"}</Button>}</div></Card><Card><Eyebrow>Foreløbig brief</Eyebrow><h2 className="mt-3 text-3xl font-black tracking-tight text-[#071527]">{brief.title}</h2><p className="mt-3 text-sm leading-6 text-slate-600">Briefen opdateres baseret på dine svar. Den er ikke endelig, men gør opgaven lettere at forstå.</p><div className="mt-5 flex flex-wrap gap-2">{brief.tags.map((tag) => <span key={tag} className="rounded-full border border-slate-200 px-3 py-2 text-xs font-black text-slate-700">{tag}</span>)}</div><div className="mt-6 grid gap-5 md:grid-cols-2"><div><p className="font-black text-[#071527]">Scope</p><ul className="mt-3 grid gap-2">{brief.scope.map((item) => <li key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</li>)}</ul></div><div><p className="font-black text-[#071527]">Spørgsmål</p><ul className="mt-3 grid gap-2">{brief.questions.map((item) => <li key={item} className="rounded-2xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">{item}</li>)}</ul></div></div></Card></section>}

      {view === "provider" && <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5"><div className="grid gap-6 lg:grid-cols-[.85fr_1.15fr]"><Card><Eyebrow>For specialister</Eyebrow><h1 className="mt-3 text-4xl font-black tracking-tight text-[#071527] md:text-5xl">Få bedre briefs og mindre spildtid.</h1><p className="mt-4 leading-7 text-slate-600">Naetwork er ikke en åben freelanceliste. Vi arbejder med specialister, der kan udføre konkrete digitale opgaver baseret på bedre briefs.</p><div className="mt-6 grid gap-3">{["Hjemmeside og UX", "Webshop og betaling", "Booking og kundeflow", "Automation", "Dashboard og data", "Praktisk AI", "MVP og webapp", "Salg og pitch"].map((item) => <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm font-black text-slate-700">{item}</div>)}</div></Card><Card dark><h2 className="text-3xl font-black tracking-tight">Ansøg som specialist</h2><p className="mt-3 text-sm leading-6 text-white/65">Skriv kort hvad du er stærk til, og hvilke opgavetyper du helst vil modtage.</p><div className="mt-6 grid gap-3"><input value={providerName} onChange={(event) => setProviderName(event.target.value)} placeholder="Navn eller firma" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none" /><input value={providerEmail} onChange={(event) => setProviderEmail(event.target.value)} placeholder="Email" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none" /><textarea value={providerSkills} onChange={(event) => setProviderSkills(event.target.value)} rows={4} placeholder="Kompetencer og opgavetyper" className="resize-none rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none" /><input value={providerLinks} onChange={(event) => setProviderLinks(event.target.value)} placeholder="Link til cases eller LinkedIn" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none" /></div>{providerError && <div className="mt-4 rounded-2xl bg-rose-400/15 p-4 text-sm font-black text-rose-100">{providerError}</div>}{providerSent && <div className="mt-4 rounded-2xl bg-emerald-300/15 p-4 text-sm font-black text-emerald-100">Tak. Din interesse er modtaget.</div>}<div className="mt-6"><Button secondary onClick={submitProvider} disabled={providerLoading}>{providerLoading ? "Sender" : "Ansøg som specialist"}</Button></div></Card></div></section>}

      {view === "submitted" && <section className="mx-auto max-w-5xl px-4 py-12 sm:px-5"><Card dark><div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-300/15 text-2xl">✓</div><Eyebrow light>Opgaven er sendt</Eyebrow><h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">Din opgave er modtaget.</h1><p className="mt-5 text-lg leading-8 text-white/70">Status: Modtaget. Briefen er gemt, og du får en kvittering på mail med foreløbig specialistretning og næste skridt.</p><p className="mt-5 rounded-2xl bg-white/10 p-4 text-sm text-white/70">ID: {taskId || "Modtaget"}</p></Card></section>}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-5"><Card className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end"><div><Eyebrow>Trust og ansvar</Eyebrow><h2 className="mt-3 text-2xl font-black tracking-tight text-[#071527]">Naetwork hjælper med at gøre opgaver klarere. Aftaler indgås direkte mellem kunde og specialist.</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">Naetwork er ikke automatisk part i aftaler om pris, levering, rettigheder, betaling, tidsplan eller kvalitet mellem kunde og specialist, medmindre dette er aftalt særskilt skriftligt.</p></div><div className="flex flex-wrap gap-3 text-sm font-black"><Link className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 hover:border-slate-400" href="/vilkaar">Vilkår</Link><Link className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 hover:border-slate-400" href="/privatliv">Privatliv</Link><Link className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 hover:border-slate-400" href="/cookies">Cookies</Link></div></Card></section>
      <footer className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-500 sm:px-5"><div className="grid gap-6 border-t border-slate-200 pt-7 md:grid-cols-[1fr_auto]"><div><p className="font-black text-[#071527]">Naetwork</p><p className="mt-2 max-w-md leading-6">Beskriv opgaven. Få den gjort klar. Kom videre med den rigtige specialist.</p></div><div className="grid gap-2 text-left font-black text-slate-700 sm:grid-cols-3 md:text-right"><button type="button" onClick={() => open("how")}>Sådan virker det</button><button type="button" onClick={() => open("provider")}>For specialister</button><button type="button" onClick={() => open("task")}>Opret opgave</button><Link href="/vilkaar">Vilkår</Link><Link href="/privatliv">Privatliv</Link><Link href="/cookies">Cookies</Link></div></div></footer>
      {cookieVisible && <div className="fixed inset-x-0 bottom-0 z-[80] px-4 pb-4"><div className="mx-auto max-w-4xl rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_24px_90px_rgba(15,23,42,.18)]"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><p className="font-black text-[#071527]">Cookies</p><p className="mt-1 text-sm leading-6 text-slate-600">Vi bruger nødvendige funktioner for at få siden til at fungere. Hvis vi senere bruger statistik eller marketingcookies, bør der indhentes samtykke først.</p></div><div className="flex shrink-0 gap-2"><Link className="rounded-full border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 hover:border-slate-400" href="/cookies">Læs mere</Link><button type="button" onClick={acceptCookies} className="rounded-full bg-[#071527] px-5 py-2 text-sm font-black text-white hover:bg-[#0b203a]">Forstået</button></div></div></div></div>}
    </main>
  );
}
