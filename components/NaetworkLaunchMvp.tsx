'use client';

import { type ChangeEvent, type FormEvent, type ReactNode, useMemo, useState } from "react";

type View = "home" | "intake" | "provider" | "quality";
type Intake = {
  need: string;
  audience: string;
  mustHave: string;
  inspiration: string;
  budget: string;
  deadline: string;
  name: string;
  email: string;
};

type Brief = ReturnType<typeof makeBrief>;

const examples: Intake[] = [
  {
    need: "Jeg er selvstændig konsulent og skal bruge en professionel hjemmeside med ydelser, priser, kontaktformular og bookinglink.",
    audience: "Potentielle B2B-kunder, der skal forstå ydelsen hurtigt og nemt kunne tage kontakt.",
    mustHave: "Forside, ydelser/priser, kontaktformular, bookinglink, mobilvisning, basal SEO og kort handover.",
    inspiration: "Nordisk, roligt og professionelt. Ikke for techy.",
    budget: "10.000-25.000 kr.",
    deadline: "3-4 uger",
    name: "",
    email: ""
  },
  {
    need: "Vi har salgstal i Excel og ønsker et simpelt dashboard med omsætning, pipeline og performance pr. måned.",
    audience: "Ledelsen og to team leads, der ikke er tekniske.",
    mustHave: "Oprydning af Excel-data, 5-6 KPI’er, enkel rapportvisning og dokumenteret opdateringsflow.",
    inspiration: "Rent dashboard med få grafer og tydelige nøgletal.",
    budget: "25.000-50.000 kr.",
    deadline: "2-3 uger",
    name: "",
    email: ""
  },
  {
    need: "Vi modtager leads på mail og vil gerne samle dem automatisk i Google Sheets med kategori og kort AI-resumé.",
    audience: "Founder og salgsteam, der skal følge op hurtigere.",
    mustHave: "Gmail-trigger, udtræk af navn/email/besked, AI-resumé, kategori, Sheets-log og simpel fejlmarkering.",
    inspiration: "Let at forstå og ikke et stort CRM-system.",
    budget: "10.000-25.000 kr.",
    deadline: "1-2 uger",
    name: "",
    email: ""
  }
];

const capabilities = [
  "Hjemmesider",
  "Landing pages",
  "Webapps",
  "Interne tools",
  "Dashboards",
  "Rapporter",
  "Excel/Sheets",
  "AI-workflows",
  "Make/Zapier",
  "Pitch decks",
  "Data cleanup",
  "Idéafklaring"
];

const qualityPrinciples = [
  "Alle providers skal godkendes manuelt",
  "Scope skal være klart før matching",
  "Kunden får få relevante forslag — ikke en profil-børs",
  "Første version må gerne være semi-manuel for højere kvalitet"
];

const process = [
  ["01", "Beskriv behovet", "Kunden skriver frit uden teknisk kravspecifikation."],
  ["02", "Få en skarp brief", "Naetwork omsætter behovet til scope, fravalg og acceptkriterier."],
  ["03", "Kvalitetssikret match", "Opgaven matches manuelt eller semi-automatisk med relevante pro’s."],
  ["04", "Leverance og handover", "Projektet afsluttes med klar leverance, dokumentation og mulighed for ændringer."]
];

const launchChecklist = [
  "Gem consumer-intakes i database",
  "Gem provider-ansøgninger i database",
  "Send email til admin ved nye leads",
  "Skjul intern quality gate bag login",
  "Tilføj privatlivspolitik og vilkår",
  "Tilføj simpel betalingsstatus",
  "Lav mail-flow til kunde og provider",
  "Fjern demo-labels når første rigtige leads modtages"
];

function category(text: string) {
  const value = text.toLowerCase();
  if (/(dashboard|power bi|rapport|kpi|excel|data)/.test(value)) return "Dashboard / rapportering";
  if (/(automation|automatis|zapier|make|gmail|sheets|workflow|ai)/.test(value)) return "Automation / AI-workflow";
  if (/(webapp|app|portal|login|mvp|admin)/.test(value)) return "Webapp / MVP";
  if (/(pitch|deck|slides|præsentation)/.test(value)) return "Pitch deck";
  return "Hjemmeside / landing page";
}

function tags(text: string) {
  const value = text.toLowerCase();
  const output = new Set<string>();
  if (/(hjemmeside|website|landing|kontakt|booking|seo)/.test(value)) ["Hjemmeside", "Kontaktformular", "Booking", "SEO", "UX/UI"].forEach((tag) => output.add(tag));
  if (/(dashboard|rapport|kpi|excel|data)/.test(value)) ["Dashboard", "Excel", "Rapportering", "Data cleanup"].forEach((tag) => output.add(tag));
  if (/(automation|automatis|zapier|make|gmail|sheets|workflow)/.test(value)) ["Automation", "Make/Zapier", "Google Sheets"].forEach((tag) => output.add(tag));
  if (/(ai|resumé|prompt|kategori)/.test(value)) ["AI-workflow", "Prompt setup"].forEach((tag) => output.add(tag));
  if (!output.size) ["Idéafklaring", "UX/UI", "Handover"].forEach((tag) => output.add(tag));
  return Array.from(output);
}

function makeBrief(intake: Intake) {
  const text = `${intake.need} ${intake.audience} ${intake.mustHave} ${intake.inspiration}`;
  const briefCategory = category(text);
  const briefTags = tags(text);
  const title = briefCategory.includes("Dashboard")
    ? "Let dashboard med tydelige KPI’er"
    : briefCategory.includes("Automation")
      ? "Automation der reducerer manuelt arbejde"
      : briefCategory.includes("Webapp")
        ? "Afgrænset webapp/MVP med klart første scope"
        : briefCategory.includes("Pitch")
          ? "Professionelt pitch deck med klar storyline"
          : "Simpel hjemmeside med tydeligt kontaktflow";
  const scope = intake.mustHave.split(/,|\n/).map((item) => item.trim()).filter(Boolean).slice(0, 7);

  return {
    title,
    category: briefCategory,
    tags: briefTags,
    scope: scope.length ? scope : ["Afklar kernebehov", "Udarbejd MVP-scope", "Lever første brugbare version", "Kort handover"],
    notIncluded: ["Avanceret specialudvikling uden for aftalt scope", "Løbende drift/support", "Betalingsintegration uden særskilt aftale", "Større brandstrategi"],
    acceptance: ["Kerneflowet virker på mobil og desktop", "Leverancen matcher godkendt brief", "Kunden får kort handover", "Eventuelle ændringer samles før afslutning"],
    questions: ["Hvad er vigtigste forretningsresultat?", "Hvilket materiale findes allerede?", "Hvem skal kunne redigere løsningen?", "Hvad må ikke være med i første version?"],
    budget: intake.budget || "Afklares",
    deadline: intake.deadline || "Afklares",
    match: `Matcher typisk med pro’s inden for ${briefTags.slice(0, 3).join(", ").toLowerCase()}. Første version bør kvalitetssikres manuelt af Naetwork før opgaven sendes videre.`
  };
}

function Panel({ children, dark = false, className = "" }: { children: ReactNode; dark?: boolean; className?: string }) {
  return <div className={`${dark ? "border-slate-800 bg-[#071527] text-white" : "border-slate-200 bg-white text-slate-950"} rounded-[28px] border p-6 shadow-sm ${className}`}>{children}</div>;
}

function Button({ children, onClick, type = "button", secondary = false }: { children: ReactNode; onClick?: () => void; type?: "button" | "submit"; secondary?: boolean }) {
  return <button type={type} onClick={onClick} className={`${secondary ? "border border-slate-300 bg-white text-slate-800" : "bg-[#071527] text-white shadow-lg shadow-slate-900/10"} rounded-full px-6 py-3 text-sm font-black transition hover:-translate-y-0.5`}>{children}</button>;
}

function Badge({ children }: { children: ReactNode }) {
  return <span className="inline-flex h-9 w-fit shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 text-xs font-bold leading-none text-slate-700">{children}</span>;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">{children}</p>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid gap-2 text-sm font-bold text-slate-700">{label}{children}</label>;
}

function Textarea({ name, value, onChange, rows = 4 }: { name: keyof Intake; value: string; onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void; rows?: number }) {
  return <textarea name={name} value={value} onChange={onChange} rows={rows} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[#3f8f83] focus:ring-4 focus:ring-[#3f8f83]/10" />;
}

function Input({ name, value, onChange, type = "text" }: { name: keyof Intake; value: string; onChange: (event: ChangeEvent<HTMLInputElement>) => void; type?: string }) {
  return <input name={name} value={value} onChange={onChange} type={type} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[#3f8f83] focus:ring-4 focus:ring-[#3f8f83]/10" />;
}

function BriefPreview({ brief, ready, onSend }: { brief: Brief; ready: boolean; onSend: () => void }) {
  return <Panel>
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
      <div>
        <Eyebrow>Projektbrief</Eyebrow>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-[#071527]">{brief.title}</h2>
      </div>
      <span className={`${ready ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"} rounded-full px-3 py-1 text-xs font-black`}>{ready ? "Opdateret" : "Klar til opdatering"}</span>
    </div>

    <div className="mt-6 grid gap-4 md:grid-cols-3">
      {[["Kategori", brief.category], ["Budget", brief.budget], ["Deadline", brief.deadline]].map(([label, value]) => <div key={label} className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-[.18em] text-slate-400">{label}</p><p className="mt-2 text-sm font-black text-slate-900">{value}</p></div>)}
    </div>

    <div className="mt-5 flex flex-wrap items-start content-start gap-2">{brief.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>

    <div className="mt-6 grid gap-6 md:grid-cols-2">
      <div><h3 className="font-black">Scope</h3><ul className="mt-3 grid gap-2">{brief.scope.map((item) => <li key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</li>)}</ul><h3 className="mt-6 font-black">Ikke inkluderet</h3><ul className="mt-3 grid gap-2">{brief.notIncluded.map((item) => <li key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</li>)}</ul></div>
      <div><h3 className="font-black">Acceptkriterier</h3><ul className="mt-3 grid gap-2">{brief.acceptance.map((item) => <li key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</li>)}</ul><h3 className="mt-6 font-black">Opklarende spørgsmål</h3><ul className="mt-3 grid gap-2">{brief.questions.map((item) => <li key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</li>)}</ul></div>
    </div>

    <div className="mt-6 rounded-3xl bg-[#071527] p-5 text-white"><p className="text-sm font-black text-emerald-200">Matching-note</p><p className="mt-2 text-sm leading-6 text-white/75">{brief.match}</p></div>
    <div className="mt-6 flex flex-col gap-3 sm:flex-row"><Button secondary>Gem som kladde</Button><Button onClick={onSend}>Send til kvalitetssikring</Button></div>
  </Panel>;
}

export function NaetworkLaunchMvp() {
  const [view, setView] = useState<View>("home");
  const [intake, setIntake] = useState<Intake>(examples[0]);
  const [ready, setReady] = useState(true);
  const [menu, setMenu] = useState(false);
  const [providerSent, setProviderSent] = useState(false);
  const brief = useMemo(() => makeBrief(intake), [intake]);

  const open = (target: View) => {
    setView(target);
    setMenu(false);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateText = (event: ChangeEvent<HTMLTextAreaElement>) => { setReady(false); setIntake({ ...intake, [event.target.name]: event.target.value }); };
  const updateInput = (event: ChangeEvent<HTMLInputElement>) => { setReady(false); setIntake({ ...intake, [event.target.name]: event.target.value }); };
  const useExample = (example: Intake) => { setIntake(example); setReady(true); open("intake"); };
  const nav = (target: View, label: string) => <button onClick={() => open(target)} className={`${view === target ? "bg-[#071527] text-white" : "text-slate-600 hover:bg-slate-100"} rounded-full px-4 py-2 text-sm font-bold transition`}>{label}</button>;

  return <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
        <button onClick={() => open("home")} className="flex items-center gap-3 text-left">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">N</span>
          <span><span className="block text-lg font-black tracking-tight">Naetwork</span><span className="block text-xs text-slate-500">Kurateret digital eksekvering</span></span>
        </button>
        <nav className="hidden items-center gap-2 lg:flex">{nav("home", "Forside")}{nav("intake", "Beskriv behov")}{nav("provider", "Bliv provider")}{nav("quality", "Kvalitet")}</nav>
        <div className="hidden gap-2 md:flex"><Button secondary onClick={() => open("provider")}>Ansøg som provider</Button><Button onClick={() => open("intake")}>Beskriv dit behov</Button></div>
        <button onClick={() => setMenu(!menu)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-black lg:hidden">Menu</button>
      </div>
      {menu && <div className="border-t border-slate-200 bg-white px-5 py-4 lg:hidden"><div className="grid gap-2">{nav("home", "Forside")}{nav("intake", "Beskriv behov")}{nav("provider", "Bliv provider")}{nav("quality", "Kvalitet")}</div></div>}
    </header>

    {view === "home" && <>
      <section className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 lg:grid-cols-[1.04fr_.96fr] lg:py-24">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm">Early access · manuel kvalitetssikring · ingen falske claims</div>
          <h1 className="max-w-4xl text-4xl font-black leading-[.98] tracking-[-0.045em] text-[#071527] md:text-7xl">Fra uklart behov til konkret digital løsning.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Naetwork hjælper private, founders og små virksomheder med at få bygget simple digitale løsninger — uden at skulle forstå teknik, scoping eller freelance-markedspladser.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button onClick={() => open("intake")}>Beskriv dit behov</Button><Button secondary onClick={() => open("provider")}>Ansøg som provider</Button></div>
          <p className="mt-5 max-w-xl text-sm leading-6 text-slate-500">Første version er ærligt bygget som semi-manuel early access: AI hjælper med briefen, og Naetwork kan kvalitetssikre matchingen bag kulissen.</p>
        </div>
        <Panel dark className="lg:p-8">
          <Eyebrow>Sådan fungerer det</Eyebrow>
          <h2 className="mt-3 text-3xl font-black tracking-tight">Behov → brief → match → leverance</h2>
          <div className="mt-6 grid gap-3">{process.map(([number, title, text]) => <div key={number} className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10"><div className="flex gap-3"><span className="font-mono text-xs font-black text-emerald-200">{number}</span><div><p className="text-sm font-black text-white">{title}</p><p className="mt-1 text-sm leading-6 text-white/65">{text}</p></div></div></div>)}</div>
        </Panel>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid gap-4 md:grid-cols-4">{qualityPrinciples.map((item) => <Panel key={item} className="min-h-[104px]"><p className="text-sm font-bold leading-6 text-slate-700">{item}</p></Panel>)}</div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="grid gap-8 lg:grid-cols-[.76fr_1.24fr]">
          <div><Eyebrow>Prøv et eksempel</Eyebrow><h2 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Se hvordan behov bliver til brief.</h2><p className="mt-4 text-slate-600">Eksemplerne er tydeligt markeret som demo. Ingen falske kunder, cases eller testimonials.</p></div>
          <div className="grid gap-4 md:grid-cols-3">{examples.map((example, index) => <button key={example.need} onClick={() => useExample(example)} className="flex min-h-[280px] flex-col justify-between rounded-[24px] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"><div><p className="text-xs font-black uppercase tracking-[.18em] text-[#3f8f83]">Demo {index + 1}</p><h3 className="mt-3 font-black text-[#071527]">{category(example.need + example.mustHave)}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{example.need}</p></div><span className="mt-5 inline-flex w-fit rounded-full bg-[#071527] px-4 py-2 text-xs font-black text-white">Se brief</span></button>)}</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr]">
          <div><Eyebrow>Hvad Naetwork kan bruges til</Eyebrow><h2 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Små digitale løsninger med tydeligt scope.</h2><p className="mt-4 text-slate-600">Positioneringen er premium og kurateret — ikke en åben profil-børs.</p></div>
          <div className="flex flex-wrap items-start content-start gap-2 self-start">{capabilities.map((item) => <Badge key={item}>{item}</Badge>)}</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14">
        <Panel dark className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center lg:p-8">
          <div><p className="text-sm font-black uppercase tracking-[.2em] text-emerald-200">Early access</p><h2 className="mt-3 text-3xl font-black tracking-tight">Start med et behov — ikke en kravspecifikation.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">Naetwork er bedst til små, konkrete digitale opgaver, hvor scope skal gøres skarpt før der vælges specialist.</p></div>
          <Button onClick={() => open("intake")}>Beskriv dit behov</Button>
        </Panel>
      </section>
    </>}

    {view === "intake" && <section className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[.9fr_1.1fr]">
      <Panel>
        <Eyebrow>AI-intake</Eyebrow>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Beskriv behovet</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Flowet skal føles simpelt, roligt og professionelt — ikke som en teknisk kravspecifikation.</p>
        <form onSubmit={(event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setReady(true); }} className="mt-6 grid gap-4">
          <Field label="Hvad har du brug for hjælp til?"><Textarea name="need" value={intake.need} onChange={updateText} rows={5} /></Field>
          <Field label="Hvem skal bruge løsningen?"><Textarea name="audience" value={intake.audience} onChange={updateText} rows={3} /></Field>
          <Field label="Hvad skal første version kunne?"><Textarea name="mustHave" value={intake.mustHave} onChange={updateText} rows={4} /></Field>
          <Field label="Eksempler eller ønsket stil"><Textarea name="inspiration" value={intake.inspiration} onChange={updateText} rows={3} /></Field>
          <div className="grid gap-4 md:grid-cols-2"><Field label="Budgetniveau"><Input name="budget" value={intake.budget} onChange={updateInput} /></Field><Field label="Ønsket deadline"><Input name="deadline" value={intake.deadline} onChange={updateInput} /></Field></div>
          <div className="grid gap-4 md:grid-cols-2"><Field label="Navn"><Input name="name" value={intake.name} onChange={updateInput} /></Field><Field label="Email"><Input name="email" value={intake.email} onChange={updateInput} type="email" /></Field></div>
          <Button type="submit">Generér / opdater brief</Button>
        </form>
      </Panel>
      <BriefPreview brief={brief} ready={ready} onSend={() => open("quality")} />
    </section>}

    {view === "provider" && <section className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[.9fr_1.1fr]">
      <Panel><Eyebrow>Provider early access</Eyebrow><h1 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Ansøg som provider</h1><p className="mt-3 text-sm leading-6 text-slate-600">Providers skal godkendes manuelt, så platformen føles kurateret fra første dag.</p><form onSubmit={(event) => { event.preventDefault(); setProviderSent(true); }} className="mt-6 grid gap-4"><input placeholder="Navn / firma" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#3f8f83]" /><input placeholder="Email" type="email" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#3f8f83]" /><textarea rows={4} placeholder="Kompetencer" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#3f8f83]" /><textarea rows={4} placeholder="2-3 relevante cases eller links" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#3f8f83]" /><Button type="submit">Send ansøgning</Button></form></Panel>
      <Panel><h2 className="text-2xl font-black text-[#071527]">Kvalitetskrav før godkendelse</h2><div className="mt-5 grid gap-3">{["Tydelige kompetencer", "Relevante cases eller erfaring", "Kan arbejde med afgrænset scope", "Accepterer brief og acceptkriterier", "Kan levere kort handover"].map((item) => <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">{item}</div>)}</div>{providerSent && <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm font-black text-emerald-800">Ansøgning registreret i demo-flowet.</div>}</Panel>
    </section>}

    {view === "quality" && <section className="mx-auto max-w-7xl px-5 py-10">
      <Eyebrow>Kvalitet og launch checklist</Eyebrow>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Hvad skal være sandt før launch?</h1>
      <p className="mt-3 max-w-3xl text-slate-600">Første version må gerne være semi-manuel. Det vigtigste er, at ingen opgave eller provider går videre uden kvalitetssikring.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-4">{qualityPrinciples.map((item) => <Panel key={item}><p className="text-sm font-bold leading-6 text-slate-700">{item}</p></Panel>)}</div>
      <Panel className="mt-6"><h2 className="text-2xl font-black text-[#071527]">Næste tekniske skridt</h2><div className="mt-5 grid gap-3 md:grid-cols-2">{launchChecklist.map((item) => <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">{item}</div>)}</div></Panel>
    </section>}

    <footer className="mx-auto max-w-7xl px-5 py-10 text-sm text-slate-500"><div className="border-t border-slate-200 pt-6">Naetwork · Early access · Kurateret digital eksekvering uden falske claims.</div></footer>
  </main>;
}
