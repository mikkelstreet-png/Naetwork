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
type Category = "Ikke sikker" | "Hjemmeside" | "Webapp / MVP" | "Dashboard" | "Automation" | "Pitch deck" | "AI i virksomheden";

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

const categories: Category[] = ["Ikke sikker", "Hjemmeside", "Webapp / MVP", "Dashboard", "Automation", "Pitch deck", "AI i virksomheden"];

const initialIntake: Intake = {
  category: "Ikke sikker",
  need: "Min hjemmeside får besøg, men for få henvendelser. Jeg vil gerne forstå, hvad der skal ændres, og hvilken type specialist der kan hjælpe.",
  situation: "Jeg har en løsning eller proces i dag, men den fungerer ikke godt nok.",
  outcome: "Jeg vil have en klarere løsning, bedre flow og et konkret næste skridt.",
  audience: "Kunder, brugere eller mit interne team.",
  budget: "Afklares",
  deadline: "Afklares"
};

const metaByCategory: Record<Category, Meta> = {
  "Ikke sikker": {
    title: "Digital opgave gjort klar før du vælger specialist",
    specialist: "Digital produkt specialist",
    tags: ["Afklaring", "Scope", "Specialistretning"],
    scope: ["Afklare hvad der faktisk skal laves", "Skelne mellem første version og senere ønsker", "Finde mest relevant specialistretning"],
    questions: ["Hvad skal opgaven hjælpe dig med at opnå?", "Hvad er vigtigst i første version?", "Hvad kan vente?"]
  },
  "Hjemmeside": {
    title: "Hjemmeside der skaber flere relevante henvendelser",
    specialist: "Hjemmeside-specialist med fokus på UX, tekst og konvertering",
    tags: ["Hjemmeside", "UX", "Kontaktflow"],
    scope: ["Forbedre forsidestruktur", "Gøre siden mere overskuelig", "Stramme teksthierarki og kontaktflow op"],
    questions: ["Hvilke henvendelser er mest værdifulde?", "Hvad skal besøgende gøre som næste handling?", "Hvilke sider er vigtigst i første version?"]
  },
  "Webapp / MVP": {
    title: "Første version af digital idé med klart kerneflow",
    specialist: "MVP-bygger",
    tags: ["MVP", "Webapp", "Launch"],
    scope: ["Definere kerneflow", "Prioritere første version", "Gøre løsningen klar til test"],
    questions: ["Hvad er vigtigste brugerflow?", "Hvad skal med i første version?", "Hvad kan vente?"]
  },
  "Dashboard": {
    title: "Dashboard med overblik over centrale nøgletal",
    specialist: "Data-specialist",
    tags: ["Dashboard", "Data", "Rapportering"],
    scope: ["Kortlægge datakilder", "Definere nøgletal", "Samle overblik i én visning"],
    questions: ["Hvor ligger data i dag?", "Hvilke tal styrer du efter?", "Hvem skal bruge dashboardet?"]
  },
  "Automation": {
    title: "Automation der fjerner manuelt dobbeltarbejde",
    specialist: "Automation-specialist",
    tags: ["Automation", "Workflow", "Proces"],
    scope: ["Kortlægge manuelt flow", "Opsætte simpelt workflow", "Teste og dokumentere brugen"],
    questions: ["Hvad starter flowet?", "Hvor skal data ende?", "Hvad sker der, hvis noget fejler?"]
  },
  "Pitch deck": {
    title: "Pitch eller salgsdeck med klar fortælling",
    specialist: "Præsentations-specialist",
    tags: ["Slides", "Storyline", "Design"],
    scope: ["Stramme storyline op", "Bygge slide-struktur", "Gøre materialet mødeklart"],
    questions: ["Hvem skal se materialet?", "Hvilken beslutning skal det drive?", "Har du tal og input klar?"]
  },
  "AI i virksomheden": {
    title: "Praktisk AI eller automation brugt rigtigt i virksomheden",
    specialist: "AI workflow-specialist",
    tags: ["AI", "Workflow", "Output"],
    scope: ["Finde relevante AI-brugsscenarier", "Afgrænse første praktiske workflow", "Gøre løsningen enkel at bruge"],
    questions: ["Hvor bruger du mest tid i dag?", "Hvilket output skal forbedres?", "Hvem skal bruge flowet?"]
  }
};

const useCases = [
  { pain: "Mere trafik end leads", title: "Jeg får trafik, men ikke nok henvendelser", text: "Få gjort problemet klart, før du bestiller design, tekst eller kontaktflow.", category: "Hjemmeside" as Category },
  { pain: "For meget gentagelse", title: "Jeg bruger for meget tid på mails og Excel", text: "Find ud af hvilke dele der kan automatiseres uden at bygge et stort system.", category: "Automation" as Category },
  { pain: "God idé, uklart scope", title: "Jeg har en idé, men ikke første version", text: "Få afgrænset første version, så idéen kan testes uden at blive for stor.", category: "Webapp / MVP" as Category },
  { pain: "Data ligger spredt", title: "Jeg har data, men intet samlet overblik", text: "Få defineret hvilke tal der betyder noget, og hvordan de skal samles.", category: "Dashboard" as Category },
  { pain: "Budskabet sidder ikke", title: "Mit salgs- eller pitchmateriale er uklart", text: "Få struktur og budskab gjort skarpere, før materialet designes færdigt.", category: "Pitch deck" as Category },
  { pain: "AI føles uklart", title: "Jeg vil bruge AI, men ved ikke hvor", text: "Find de steder, hvor AI faktisk sparer tid eller løfter output.", category: "AI i virksomheden" as Category }
];

const processSteps = [
  ["01", "Fortæl opgaven", "Skriv problemet med dine egne ord. Du behøver ikke kende løsningen."],
  ["02", "Naetwork analyserer", "Opgaven gøres klarere med diagnose, scope, spørgsmål og specialistretning."],
  ["03", "Find den rette specialist", "Find den rette specialist for dig eller din virksomhed. Du vælger selv, om du vil gå videre."],
  ["04", "Arbejdet udføres", "Når kunde og specialist er enige om pris, levering og rammer, udfører specialisten arbejdet direkte med kunden."]
];

const taskSteps = [
  { title: "Opgavetype", text: "Vælg hvad opgaven minder mest om.", helper: "Godt. Nu har vi en første retning." },
  { title: "Behov", text: "Skriv hvad du gerne vil have hjælp til.", helper: "Skriv uperfekt. Det er præcis det Naetwork skal gøre klarere." },
  { title: "Situation", text: "Fortæl hvad der ikke fungerer i dag.", helper: "Det gør briefen mere præcis." },
  { title: "Resultat", text: "Beskriv hvad der skal være anderledes.", helper: "Nu kan vi bedre forstå den ønskede effekt." },
  { title: "Detaljer", text: "Tilføj målgruppe, budget, deadline og email.", helper: "Du er næsten færdig." },
  { title: "Send", text: "Gennemgå briefen og send opgaven.", helper: "Du sender en foreløbig brief, ikke en bindende bestilling." }
];

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function validEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value.trim());
}

function Button({ children, secondary, full, disabled, onClick }: { children: ReactNode; secondary?: boolean; full?: boolean; disabled?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cx(
        "inline-flex min-h-[46px] items-center justify-center rounded-full px-5 py-3 text-sm font-black transition focus:outline-none focus:ring-4 focus:ring-emerald-900/10 sm:px-6",
        full && "w-full",
        disabled && "cursor-not-allowed opacity-50",
        secondary ? "border border-slate-300 bg-white text-slate-800 hover:border-slate-400" : "bg-[#071527] text-white hover:bg-[#0b203a]"
      )}
    >
      {children}
    </button>
  );
}

function Card({ children, dark, className = "" }: { children: ReactNode; dark?: boolean; className?: string }) {
  return (
    <div className={cx("rounded-[26px] border p-5 shadow-sm sm:rounded-[30px] sm:p-6", dark ? "border-slate-800 bg-[#071527] text-white" : "border-slate-200 bg-white text-slate-950", className)}>
      {children}
    </div>
  );
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

export function NaetworkPolished() {
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
    try {
      setCookieVisible(window.localStorage.getItem("naetwork_cookie_notice_accepted") !== "true");
    } catch {
      setCookieVisible(true);
    }
  }, []);

  const meta = metaByCategory[intake.category];
  const progress = `${Math.round(((taskStep + 1) / taskSteps.length) * 100)}%`;
  const brief = useMemo(() => ({ title: meta.title, specialist: meta.specialist, tags: meta.tags, scope: meta.scope, questions: meta.questions }), [meta]);

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
    try {
      window.localStorage.setItem("naetwork_cookie_notice_accepted", "true");
    } catch {
      // no-op
    }
    setCookieVisible(false);
  }

  const navItems: Array<[View, string]> = [["home", "Forside"], ["task", "Opret opgave"], ["how", "Sådan virker det"], ["provider", "For specialister"]];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e8f4ef_0,#f7f8fb_35%,#f7f8fb_100%)] text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-5">
          <button type="button" onClick={() => open("home")} className="flex min-w-0 items-center gap-3 text-left">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">N</span>
            <span className="min-w-0">
              <span className="block truncate text-lg font-black tracking-tight">Naetwork</span>
              <span className="block truncate text-xs text-slate-500">Få opgaven gjort klar</span>
            </span>
          </button>
          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map(([target, label]) => <button key={target} type="button" onClick={() => open(target)} className={cx("rounded-full px-4 py-2 text-sm font-bold transition", view === target ? "bg-[#071527] text-white" : "text-slate-600 hover:bg-slate-100")}>{label}</button>)}
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <Button onClick={() => { setTaskStep(0); open("task"); }}>Start kort</Button>
            <button type="button" onClick={() => setMobileOpen((value) => !value)} className="min-h-[46px] rounded-full border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 lg:hidden">Menu</button>
          </div>
        </div>
        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
            <div className="mx-auto grid max-w-7xl gap-2">
              {navItems.map(([target, label]) => <button key={target} type="button" onClick={() => open(target)} className="rounded-2xl bg-slate-50 px-4 py-3 text-left text-sm font-black text-slate-700">{label}</button>)}
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs font-black">
                <Link className="rounded-2xl border border-slate-200 px-3 py-2 text-center" href="/vilkaar">Vilkår</Link>
                <Link className="rounded-2xl border border-slate-200 px-3 py-2 text-center" href="/privatliv">Privatliv</Link>
                <Link className="rounded-2xl border border-slate-200 px-3 py-2 text-center" href="/cookies">Cookies</Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {view === "home" && (
        <>
          <section className="mx-auto grid max-w-7xl items-start gap-8 px-4 py-12 sm:px-5 lg:grid-cols-[1.02fr_.98fr] lg:py-20">
            <div>
              <div className="mb-5 inline-flex max-w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm">For små virksomheder, founders og selvstændige</div>
              <h1 className="max-w-5xl text-4xl font-black leading-[.96] tracking-[-0.05em] text-[#071527] md:text-7xl">Beskriv opgaven. Få den gjort klar. Kom videre med den rigtige specialist.</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Naetwork hjælper dig, når du ved at noget digitalt bør fungere bedre, men ikke ved præcis hvem eller hvad du skal bestille.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button onClick={() => { setTaskStep(0); open("task"); }}>Start med en kort beskrivelse</Button><Button secondary onClick={() => open("how")}>Se hvordan det virker</Button></div>
              <div className="mt-6 flex flex-wrap gap-2">{["Ingen betaling på første trin", "Ingen teknisk kravspecifikation", "Du vælger selv næste skridt"].map((item) => <span key={item} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700">{item}</span>)}</div>
            </div>
            <Card>
              <div className="mb-4 flex items-start justify-between gap-4"><div><p className="text-lg font-black text-[#071527]">Hvor starter de fleste?</p><p className="mt-1 text-sm leading-6 text-slate-500">Med en ufærdig tanke. Det er pointen.</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-800">Eksempel</span></div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">“Jeg skal bruge hjælp til min hjemmeside. Den føles ikke særlig flot, den er lidt uoverskuelig, og jeg får ikke nok henvendelser.”</div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[['Behov', 'Flere henvendelser'], ['Retning', 'UX og kontaktflow'], ['Næste skridt', 'Foreløbig brief']].map(([label, value]) => <div key={label} className="rounded-2xl bg-[#071527] p-4 text-white"><p className="text-xs font-black text-emerald-200">{label}</p><p className="mt-2 text-sm leading-6 text-white/75">{value}</p></div>)}
              </div>
            </Card>
          </section>

          <section className="mx-auto max-w-7xl px-4 py-6 sm:px-5"><div className="grid gap-4 md:grid-cols-3"><Card><p className="font-black text-[#071527]">Jeg er klar</p><p className="mt-2 text-sm leading-6 text-slate-600">Jeg vil beskrive opgaven og få den gjort klar.</p><div className="mt-4"><Button full onClick={() => open("task")}>Start kort</Button></div></Card><Card><p className="font-black text-[#071527]">Jeg vil forstå først</p><p className="mt-2 text-sm leading-6 text-slate-600">Jeg vil se processen, før jeg sender noget.</p><div className="mt-4"><Button secondary full onClick={() => open("how")}>Se processen</Button></div></Card><Card><p className="font-black text-[#071527]">Jeg er specialist</p><p className="mt-2 text-sm leading-6 text-slate-600">Jeg vil modtage bedre briefs og relevante opgaver.</p><div className="mt-4"><Button secondary full onClick={() => open("provider")}>For specialister</Button></div></Card></div></section>

          <section className="mx-auto max-w-7xl px-4 py-10 sm:px-5"><div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><Eyebrow>Find dig selv her</Eyebrow><h2 className="mt-3 text-3xl font-black tracking-tight text-[#071527] sm:text-4xl">De ting du ved, burde fungere bedre</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">Klik på det problem, der minder mest om dit. Du behøver ikke vælge perfekt.</p></div><Button secondary onClick={() => { setTaskStep(0); open("task"); }}>Start med egen opgave</Button></div><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{useCases.map((item) => <button key={item.title} type="button" onClick={() => chooseUseCase(item.category)} className="group rounded-[24px] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#3f8f83]/50 hover:shadow-md"><div className="mb-5 flex items-start justify-between gap-4"><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-800">{item.pain}</span><span className="text-lg font-black text-slate-300 transition group-hover:text-[#3f8f83]">→</span></div><p className="font-black text-[#071527]">{item.title}</p><p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p></button>)}</div></section>
        </>
      )}

      {view === "how" && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5 lg:py-16">
          <div className="mx-auto max-w-3xl text-center"><Eyebrow>Sådan virker det</Eyebrow><h1 className="mt-4 text-4xl font-black tracking-tight text-[#071527] md:text-6xl">Fire trin. Fra idé til udført arbejde.</h1><p className="mt-5 text-lg leading-8 text-slate-600">Du beskriver opgaven. Naetwork analyserer og gør den klarere. Du finder den rette specialist for dig eller din virksomhed. Specialisten udfører arbejdet direkte med dig.</p></div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{processSteps.map(([number, title, text]) => <Card key={number} className="min-h-[220px] text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">{number}</span><h2 className="mt-5 text-xl font-black leading-tight text-[#071527] sm:text-2xl">{title}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{text}</p></Card>)}</div>
          <div className="mt-8 grid gap-4 lg:grid-cols-[.86fr_1.14fr]"><Card><p className="text-xs font-black uppercase tracking-[.18em] text-slate-400">Før</p><p className="mt-3 text-2xl font-black text-[#071527]">“Jeg skal bruge hjælp til min hjemmeside. Den føles ikke særlig flot, den er lidt uoverskuelig, og jeg får ikke nok henvendelser.”</p><p className="mt-3 text-sm leading-6 text-slate-600">En helt normal start, men stadig for upræcis til at vælge den rigtige specialist eller scope opgaven korrekt.</p></Card><Card dark><Eyebrow light>Efter Naetwork-analysen</Eyebrow><p className="mt-3 text-2xl font-black">Udsnit af den foreløbige brief</p><div className="mt-5 grid gap-3 text-left"><div className="rounded-2xl bg-white/10 p-4"><p className="text-xs font-black uppercase tracking-[.14em] text-emerald-100">Kort diagnose</p><p className="mt-2 text-sm leading-6 text-white/75">Opgaven handler ikke kun om design. Den handler især om at gøre hjemmesiden mere overskuelig, mere troværdig og bedre til at få besøgende til at tage kontakt.</p></div><div className="rounded-2xl bg-white/10 p-4"><p className="text-xs font-black uppercase tracking-[.14em] text-emerald-100">Scope</p><p className="mt-2 text-sm leading-6 text-white/75">Forbedre forsidestruktur, visuel prioritering, teksthierarki og kontaktflow.</p></div><div className="grid gap-3 md:grid-cols-2"><div className="rounded-2xl bg-white/10 p-4"><p className="text-xs font-black uppercase tracking-[.14em] text-emerald-100">Specialistretning</p><p className="mt-2 text-sm leading-6 text-white/75">Hjemmeside-specialist med fokus på UX, tekst og konvertering.</p></div><div className="rounded-2xl bg-white/10 p-4"><p className="text-xs font-black uppercase tracking-[.14em] text-emerald-100">Næste spørgsmål</p><p className="mt-2 text-sm leading-6 text-white/75">Hvilke henvendelser er mest værdifulde, og hvad skal besøgende gøre som næste handling?</p></div></div></div></Card></div>
          <div className="mt-8 flex justify-center"><Button onClick={() => { setTaskStep(0); open("task"); }}>Start med kort beskrivelse</Button></div>
        </section>
      )}

      {view === "task" && (
        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-5 lg:grid-cols-[.9fr_1.1fr]">
          <Card>
            <div className="mb-6"><Eyebrow>Opret opgave</Eyebrow><h1 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Fortæl én ting ad gangen.</h1><p className="mt-3 text-sm leading-6 text-slate-600">Du skal ikke kende løsningen. Flowet hjælper dig med at gøre opgaven klar nok til næste skridt.</p></div>
            <div className="mb-6 sm:hidden"><div className="flex justify-between gap-4 text-xs font-black text-slate-500"><span>Trin {taskStep + 1} af {taskSteps.length}</span><span className="text-right">{taskSteps[taskStep].title}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#071527] transition-all" style={{ width: progress }} /></div></div>
            <div className="mb-6 hidden grid-cols-2 gap-2 sm:grid md:grid-cols-3 xl:grid-cols-6">{taskSteps.map((step, index) => <button key={step.title} type="button" onClick={() => { setTaskStep(index); setTaskError(""); }} className={cx("min-h-[72px] rounded-2xl border p-3 text-left transition", taskStep === index ? "border-[#071527] bg-[#071527] text-white" : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300")}><span className="block text-[11px] font-black leading-none opacity-70">{index + 1}</span><span className="mt-2 block whitespace-normal break-words text-[11px] font-black leading-tight sm:text-xs">{step.title}</span></button>)}</div>
            <div className="rounded-[24px] border border-slate-200 bg-white p-5"><p className="text-xs font-black uppercase tracking-[.18em] text-[#3f8f83]">{taskSteps[taskStep].title}</p><h2 className="mt-2 text-2xl font-black text-[#071527]">{taskSteps[taskStep].text}</h2><p className="mt-2 rounded-2xl bg-emerald-50 p-3 text-sm font-bold leading-6 text-emerald-900">{taskSteps[taskStep].helper}</p><div className="mt-5">{taskStep === 0 && <div className="grid gap-2">{categories.map((item) => <button key={item} type="button" onClick={() => setIntake({ ...intake, category: item })} className={cx("rounded-2xl border p-4 text-left text-sm font-black transition", intake.category === item ? "border-[#071527] bg-[#071527] text-white" : "border-slate-200 bg-slate-50 text-slate-700 hover:border-[#3f8f83]/50")}>{item}</button>)}</div>}{taskStep === 1 && <TextArea rows={6} value={intake.need} onChange={(event) => setIntake({ ...intake, need: event.target.value })} />}{taskStep === 2 && <TextArea rows={5} value={intake.situation} onChange={(event) => setIntake({ ...intake, situation: event.target.value })} />}{taskStep === 3 && <TextArea rows={5} value={intake.outcome} onChange={(event) => setIntake({ ...intake, outcome: event.target.value })} />}{taskStep === 4 && <div className="grid gap-4"><label className="grid gap-2 text-sm font-bold text-slate-700">Hvem skal bruge løsningen?<Input value={intake.audience} onChange={(event) => setIntake({ ...intake, audience: event.target.value })} /></label><div className="grid gap-4 md:grid-cols-2"><label className="grid gap-2 text-sm font-bold text-slate-700">Budget<Input value={intake.budget} onChange={(event) => setIntake({ ...intake, budget: event.target.value })} /></label><label className="grid gap-2 text-sm font-bold text-slate-700">Deadline<Input value={intake.deadline} onChange={(event) => setIntake({ ...intake, deadline: event.target.value })} /></label></div><label className="grid gap-2 text-sm font-bold text-slate-700">Email til svar<Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="din@email.dk" /></label></div>}{taskStep === 5 && <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm font-black text-[#071527]">{brief.title}</p><p className="mt-2 text-sm leading-6 text-slate-600">Specialistretning: {brief.specialist}</p></div>}</div></div>
            {taskError && <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-black text-rose-700">{taskError}</div>}
            <div className="mt-5 grid gap-3 sm:grid-cols-2"><Button secondary full disabled={taskStep === 0} onClick={() => setTaskStep((current) => Math.max(0, current - 1))}>Tilbage</Button>{taskStep < taskSteps.length - 1 ? <Button full onClick={nextTaskStep}>Næste</Button> : <Button full onClick={submitTask} disabled={taskLoading}>{taskLoading ? "Sender opgave" : "Send opgaven"}</Button>}</div>
          </Card>
          <Card><Eyebrow>Foreløbig brief</Eyebrow><h2 className="mt-3 text-3xl font-black tracking-tight text-[#071527]">{brief.title}</h2><p className="mt-3 text-sm leading-6 text-slate-600">Briefen opdateres baseret på dine svar. Den er ikke endelig, men gør opgaven lettere at forstå.</p><div className="mt-5 flex flex-wrap gap-2">{brief.tags.map((tag) => <span key={tag} className="rounded-full border border-slate-200 px-3 py-2 text-xs font-black text-slate-700">{tag}</span>)}</div><div className="mt-6 grid gap-5 md:grid-cols-2"><div><p className="font-black text-[#071527]">Scope</p><ul className="mt-3 grid gap-2">{brief.scope.map((item) => <li key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</li>)}</ul></div><div><p className="font-black text-[#071527]">Spørgsmål</p><ul className="mt-3 grid gap-2">{brief.questions.map((item) => <li key={item} className="rounded-2xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">{item}</li>)}</ul></div></div></Card>
        </section>
      )}

      {view === "provider" && <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5"><div className="grid gap-6 lg:grid-cols-[.85fr_1.15fr]"><Card><Eyebrow>For specialister</Eyebrow><h1 className="mt-3 text-4xl font-black tracking-tight text-[#071527] md:text-5xl">Få bedre briefs og mindre spildtid.</h1><p className="mt-4 leading-7 text-slate-600">Naetwork er ikke en åben freelanceliste. Vi arbejder med specialister, der kan udføre konkrete digitale opgaver baseret på bedre briefs.</p><div className="mt-6 grid gap-3">{["Hjemmeside og UX", "MVP og webapp", "Automation og workflows", "Dashboard og data", "Pitch decks", "Praktisk AI"].map((item) => <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm font-black text-slate-700">{item}</div>)}</div></Card><Card dark><h2 className="text-3xl font-black tracking-tight">Ansøg som specialist</h2><p className="mt-3 text-sm leading-6 text-white/65">Skriv kort hvad du er stærk til, og hvilke opgavetyper du helst vil modtage.</p><div className="mt-6 grid gap-3"><input value={providerName} onChange={(event) => setProviderName(event.target.value)} placeholder="Navn eller firma" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none" /><input value={providerEmail} onChange={(event) => setProviderEmail(event.target.value)} placeholder="Email" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none" /><textarea value={providerSkills} onChange={(event) => setProviderSkills(event.target.value)} rows={4} placeholder="Kompetencer og opgavetyper" className="resize-none rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none" /><input value={providerLinks} onChange={(event) => setProviderLinks(event.target.value)} placeholder="Link til cases eller LinkedIn" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none" /></div>{providerError && <div className="mt-4 rounded-2xl bg-rose-400/15 p-4 text-sm font-black text-rose-100">{providerError}</div>}{providerSent && <div className="mt-4 rounded-2xl bg-emerald-300/15 p-4 text-sm font-black text-emerald-100">Tak. Din interesse er modtaget.</div>}<div className="mt-6"><Button secondary onClick={submitProvider} disabled={providerLoading}>{providerLoading ? "Sender" : "Ansøg som specialist"}</Button></div></Card></div></section>}

      {view === "submitted" && <section className="mx-auto max-w-5xl px-4 py-12 sm:px-5"><Card dark><div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-300/15 text-2xl">✓</div><Eyebrow light>Opgaven er sendt</Eyebrow><h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">Din opgave er modtaget.</h1><p className="mt-5 text-lg leading-8 text-white/70">Status: Modtaget. Briefen er gemt, og du får en kvittering på mail med foreløbig specialistretning og næste skridt.</p><p className="mt-5 rounded-2xl bg-white/10 p-4 text-sm text-white/70">ID: {taskId || "Modtaget"}</p></Card></section>}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-5"><Card className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end"><div><Eyebrow>Trust og ansvar</Eyebrow><h2 className="mt-3 text-2xl font-black tracking-tight text-[#071527]">Naetwork hjælper med at gøre opgaver klarere. Aftaler indgås direkte mellem kunde og specialist.</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">Naetwork er ikke automatisk part i aftaler om pris, levering, rettigheder, betaling, tidsplan eller kvalitet mellem kunde og specialist, medmindre dette er aftalt særskilt skriftligt.</p></div><div className="flex flex-wrap gap-3 text-sm font-black"><Link className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 hover:border-slate-400" href="/vilkaar">Vilkår</Link><Link className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 hover:border-slate-400" href="/privatliv">Privatliv</Link><Link className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 hover:border-slate-400" href="/cookies">Cookies</Link></div></Card></section>
      <footer className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-500 sm:px-5"><div className="grid gap-6 border-t border-slate-200 pt-7 md:grid-cols-[1fr_auto]"><div><p className="font-black text-[#071527]">Naetwork</p><p className="mt-2 max-w-md leading-6">Beskriv opgaven. Få den gjort klar. Kom videre med den rigtige specialist.</p></div><div className="grid gap-2 text-left font-black text-slate-700 sm:grid-cols-3 md:text-right"><button type="button" onClick={() => open("how")}>Sådan virker det</button><button type="button" onClick={() => open("provider")}>For specialister</button><button type="button" onClick={() => open("task")}>Opret opgave</button><Link href="/vilkaar">Vilkår</Link><Link href="/privatliv">Privatliv</Link><Link href="/cookies">Cookies</Link></div></div></footer>
      {cookieVisible && <div className="fixed inset-x-0 bottom-0 z-[80] px-4 pb-4"><div className="mx-auto max-w-4xl rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_24px_90px_rgba(15,23,42,.18)]"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><p className="font-black text-[#071527]">Cookies</p><p className="mt-1 text-sm leading-6 text-slate-600">Vi bruger nødvendige funktioner for at få siden til at fungere. Hvis vi senere bruger statistik eller marketingcookies, bør der indhentes samtykke først.</p></div><div className="flex shrink-0 gap-2"><Link className="rounded-full border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 hover:border-slate-400" href="/cookies">Læs mere</Link><button type="button" onClick={acceptCookies} className="rounded-full bg-[#071527] px-5 py-2 text-sm font-black text-white hover:bg-[#0b203a]">Forstået</button></div></div></div></div>}
    </main>
  );
}
