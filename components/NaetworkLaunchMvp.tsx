'use client';

import { type ChangeEvent, type FormEvent, type ReactNode, useMemo, useState } from "react";

type View = "home" | "intake" | "provider" | "admin";
type Intake = { need: string; audience: string; mustHave: string; inspiration: string; budget: string; deadline: string; name: string; email: string };

const examples: Intake[] = [
  { need: "Jeg er selvstændig konsulent og skal bruge en professionel hjemmeside med ydelser, priser, kontaktformular og bookinglink.", audience: "Potentielle B2B-kunder, der skal forstå ydelsen hurtigt og nemt kunne tage kontakt.", mustHave: "Forside, ydelser/priser, kontaktformular, bookinglink, mobilvisning, basal SEO og kort handover.", inspiration: "Nordisk, roligt og professionelt. Ikke for techy.", budget: "10.000-25.000 kr.", deadline: "3-4 uger", name: "", email: "" },
  { need: "Vi har salgstal i Excel og ønsker et simpelt dashboard med omsætning, pipeline og performance pr. måned.", audience: "Ledelsen og to team leads, der ikke er tekniske.", mustHave: "Oprydning af Excel-data, 5-6 KPI’er, enkel rapportvisning og dokumenteret opdateringsflow.", inspiration: "Rent dashboard med få grafer og tydelige nøgletal.", budget: "25.000-50.000 kr.", deadline: "2-3 uger", name: "", email: "" },
  { need: "Vi modtager leads på mail og vil gerne samle dem automatisk i Google Sheets med kategori og kort AI-resumé.", audience: "Founder og salgsteam, der skal følge op hurtigere.", mustHave: "Gmail-trigger, udtræk af navn/email/besked, AI-resumé, kategori, Sheets-log og simpel fejlmarkering.", inspiration: "Let at forstå og ikke et stort CRM-system.", budget: "10.000-25.000 kr.", deadline: "1-2 uger", name: "", email: "" }
];

const capabilities = ["Hjemmesider", "Landing pages", "Webapps", "Interne tools", "Dashboards", "Rapporter", "Excel/Sheets", "AI-workflows", "Make/Zapier", "Pitch decks", "Data cleanup", "Idéafklaring"];
const quality = ["Alle providers godkendes manuelt", "Scope godkendes før matching", "Få relevante forslag — ikke en profil-børs", "MVP’en kan drives semi-manuelt for høj kvalitet"];

function category(text: string) {
  const v = text.toLowerCase();
  if (/(dashboard|power bi|rapport|kpi|excel|data)/.test(v)) return "Dashboard / rapportering";
  if (/(automation|automatis|zapier|make|gmail|sheets|workflow|ai)/.test(v)) return "Automation / AI-workflow";
  if (/(webapp|app|portal|login|mvp|admin)/.test(v)) return "Webapp / MVP";
  if (/(pitch|deck|slides|præsentation)/.test(v)) return "Pitch deck";
  return "Hjemmeside / landing page";
}

function tags(text: string) {
  const v = text.toLowerCase();
  const out = new Set<string>();
  if (/(hjemmeside|website|landing|kontakt|booking|seo)/.test(v)) ["Hjemmeside", "Kontaktformular", "Booking", "SEO", "UX/UI"].forEach(t => out.add(t));
  if (/(dashboard|rapport|kpi|excel|data)/.test(v)) ["Dashboard", "Excel", "Rapportering", "Data cleanup"].forEach(t => out.add(t));
  if (/(automation|automatis|zapier|make|gmail|sheets|workflow)/.test(v)) ["Automation", "Make/Zapier", "Google Sheets"].forEach(t => out.add(t));
  if (/(ai|resumé|prompt|kategori)/.test(v)) ["AI-workflow", "Prompt setup"].forEach(t => out.add(t));
  if (!out.size) ["Idéafklaring", "UX/UI", "Handover"].forEach(t => out.add(t));
  return Array.from(out);
}

function makeBrief(i: Intake) {
  const text = `${i.need} ${i.audience} ${i.mustHave} ${i.inspiration}`;
  const cat = category(text);
  const ts = tags(text);
  const title = cat.includes("Dashboard") ? "Let dashboard med tydelige KPI’er" : cat.includes("Automation") ? "Automation der reducerer manuelt arbejde" : cat.includes("Webapp") ? "Afgrænset webapp/MVP med klart første scope" : cat.includes("Pitch") ? "Professionelt pitch deck med klar storyline" : "Simpel hjemmeside med tydeligt kontaktflow";
  const scope = i.mustHave.split(/,|\n/).map(x => x.trim()).filter(Boolean).slice(0, 7);
  return {
    title,
    cat,
    ts,
    scope: scope.length ? scope : ["Afklar kernebehov", "Udarbejd MVP-scope", "Lever første brugbare version", "Kort handover"],
    notIncluded: ["Avanceret specialudvikling uden for aftalt scope", "Løbende drift/support", "Betalingsintegration uden særskilt aftale", "Større brandstrategi"],
    acceptance: ["Kerneflowet virker på mobil og desktop", "Leverancen matcher godkendt brief", "Kunden får kort handover", "Eventuelle ændringer samles før afslutning"],
    questions: ["Hvad er vigtigste forretningsresultat?", "Hvilket materiale findes allerede?", "Hvem skal kunne redigere løsningen?", "Hvad må ikke være med i første version?"],
    budget: i.budget || "Afklares",
    deadline: i.deadline || "Afklares",
    match: `Matcher typisk med pro’s inden for ${ts.slice(0, 3).join(", ").toLowerCase()}. Første version bør kvalitetssikres manuelt af Naetwork før opgaven sendes videre.`
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid gap-2 text-sm font-bold text-slate-700">{label}{children}</label>;
}

function Textarea({ name, value, onChange, rows = 4 }: { name: keyof Intake; value: string; onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void; rows?: number }) {
  return <textarea name={name} value={value} onChange={onChange} rows={rows} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-[#3f8f83] focus:ring-4 focus:ring-[#3f8f83]/10" />;
}

function Input({ name, value, onChange, type = "text" }: { name: keyof Intake; value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; type?: string }) {
  return <input name={name} value={value} onChange={onChange} type={type} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-[#3f8f83] focus:ring-4 focus:ring-[#3f8f83]/10" />;
}

export function NaetworkLaunchMvp() {
  const [view, setView] = useState<View>("home");
  const [intake, setIntake] = useState<Intake>(examples[0]);
  const [ready, setReady] = useState(true);
  const [menu, setMenu] = useState(false);
  const [providerSent, setProviderSent] = useState(false);
  const brief = useMemo(() => makeBrief(intake), [intake]);

  const open = (v: View) => {
    setView(v);
    setMenu(false);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const updateText = (e: ChangeEvent<HTMLTextAreaElement>) => { setReady(false); setIntake({ ...intake, [e.target.name]: e.target.value }); };
  const updateInput = (e: ChangeEvent<HTMLInputElement>) => { setReady(false); setIntake({ ...intake, [e.target.name]: e.target.value }); };
  const useExample = (x: Intake) => { setIntake(x); setReady(true); open("intake"); };
  const nav = (v: View, label: string) => <button onClick={() => open(v)} className={`${view === v ? "bg-[#071527] text-white" : "text-slate-600 hover:bg-slate-100"} rounded-full px-4 py-2 text-sm font-bold`}>{label}</button>;

  return <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
        <button onClick={() => open("home")} className="flex items-center gap-3 text-left">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">N</span>
          <span><span className="block text-lg font-black tracking-tight">Naetwork</span><span className="block text-xs text-slate-500">Kvalitetssikret early access</span></span>
        </button>
        <nav className="hidden items-center gap-2 lg:flex">{nav("home", "Forside")}{nav("intake", "Beskriv behov")}{nav("provider", "Bliv provider")}{nav("admin", "Admin demo")}</nav>
        <div className="hidden gap-2 md:flex"><Button secondary onClick={() => open("provider")}>Ansøg som provider</Button><Button onClick={() => open("intake")}>Beskriv dit behov</Button></div>
        <button onClick={() => setMenu(!menu)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-black lg:hidden">Menu</button>
      </div>
      {menu && <div className="border-t border-slate-200 bg-white px-5 py-4 lg:hidden"><div className="grid gap-2">{nav("home", "Forside")}{nav("intake", "Beskriv behov")}{nav("provider", "Bliv provider")}{nav("admin", "Admin demo")}</div></div>}
    </header>

    {view === "home" && <>
      <section className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-10 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm">Early access · manuel kvalitetssikring · ingen falske claims</div>
          <h1 className="max-w-4xl text-4xl font-black leading-[.98] tracking-[-0.045em] text-[#071527] md:text-7xl">Beskriv dit behov. Få en skarp brief. Bliv matchet med den rette pro.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Naetwork hjælper private, founders og små virksomheder med at få bygget simple digitale løsninger — uden at skulle forstå teknik, scoping eller freelance-markedspladser.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button onClick={() => open("intake")}>Beskriv dit behov</Button><Button secondary onClick={() => open("provider")}>Ansøg som provider</Button></div>
          <p className="mt-5 max-w-xl text-sm leading-6 text-slate-500">Første version er ærligt bygget som semi-manuel early access: AI hjælper med briefen, og Naetwork kan kvalitetssikre matchingen bag kulissen.</p>
        </div>
        <Panel dark>
          <p className="text-sm font-black uppercase tracking-[.2em] text-emerald-200">Kvalitetssikret flow</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">Det demoen skal bevise</h2>
          <div className="mt-6 grid gap-3">{["Kunden kan skrive frit uden teknisk sprog", "Behovet omsættes til en konkret brief", "Scope og fravalg bliver tydeligt", "Matchingen føles kurateret — ikke tilfældig", "Admin kan styre kvaliteten manuelt i MVP’en"].map(item => <div key={item} className="rounded-2xl bg-white/10 p-4 text-sm font-semibold leading-6 text-white/85 ring-1 ring-white/10">{item}</div>)}</div>
        </Panel>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid gap-4 md:grid-cols-4">{quality.map(item => <Panel key={item}><p className="text-sm font-bold leading-6 text-slate-700">{item}</p></Panel>)}</div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div><p className="text-sm font-black uppercase tracking-[.2em] text-[#3f8f83]">Prøv et kvalitetssikret eksempel</p><h2 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Vælg en case og se briefen.</h2><p className="mt-4 text-slate-600">Disse cases er tydeligt demo-eksempler. Ingen falske kunder, cases eller testimonials.</p></div>
          <div className="grid gap-4 md:grid-cols-3">{examples.map((x, i) => <button key={x.need} onClick={() => useExample(x)} className="rounded-[24px] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"><p className="text-xs font-black uppercase tracking-[.18em] text-[#3f8f83]">Demo {i + 1}</p><h3 className="mt-3 font-black text-[#071527]">{category(x.need + x.mustHave)}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{x.need}</p><span className="mt-4 inline-flex rounded-full bg-[#071527] px-4 py-2 text-xs font-black text-white">Se brief</span></button>)}</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr]">
          <div><p className="text-sm font-black uppercase tracking-[.2em] text-[#3f8f83]">Hvad Naetwork kan bruges til</p><h2 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Små digitale løsninger med tydeligt scope.</h2><p className="mt-4 text-slate-600">Positioneringen er premium og kurateret — ikke en åben profil-børs.</p></div>
          <div className="flex flex-wrap items-start content-start gap-2 self-start">{capabilities.map(item => <Badge key={item}>{item}</Badge>)}</div>
        </div>
      </section>
    </>}

    {view === "intake" && <section className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[.9fr_1.1fr]">
      <Panel><p className="text-sm font-black uppercase tracking-[.2em] text-[#3f8f83]">AI-intake</p><h1 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Beskriv behovet</h1><p className="mt-3 text-sm leading-6 text-slate-600">Dette er det vigtigste flow. Det skal føles simpelt, roligt og professionelt.</p><form onSubmit={(e: FormEvent) => { e.preventDefault(); setReady(true); }} className="mt-6 grid gap-4"><Field label="Hvad har du brug for hjælp til?"><Textarea name="need" value={intake.need} onChange={updateText} rows={5} /></Field><Field label="Hvem skal bruge løsningen?"><Textarea name="audience" value={intake.audience} onChange={updateText} rows={3} /></Field><Field label="Hvad skal første version kunne?"><Textarea name="mustHave" value={intake.mustHave} onChange={updateText} rows={4} /></Field><Field label="Eksempler eller ønsket stil"><Textarea name="inspiration" value={intake.inspiration} onChange={updateText} rows={3} /></Field><div className="grid gap-4 md:grid-cols-2"><Field label="Budgetniveau"><Input name="budget" value={intake.budget} onChange={updateInput} /></Field><Field label="Ønsket deadline"><Input name="deadline" value={intake.deadline} onChange={updateInput} /></Field></div><div className="grid gap-4 md:grid-cols-2"><Field label="Navn"><Input name="name" value={intake.name} onChange={updateInput} /></Field><Field label="Email"><Input name="email" value={intake.email} onChange={updateInput} type="email" /></Field></div><Button type="submit">Generér / opdater brief</Button></form></Panel>
      <Panel><div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5"><div><p className="text-sm font-black uppercase tracking-[.2em] text-[#3f8f83]">Projektbrief</p><h2 className="mt-3 text-3xl font-black tracking-tight text-[#071527]">{brief.title}</h2></div><span className={`${ready ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"} rounded-full px-3 py-1 text-xs font-black`}>{ready ? "Opdateret" : "Klar til opdatering"}</span></div><div className="mt-6 grid gap-4 md:grid-cols-3">{[["Kategori", brief.cat], ["Budget", brief.budget], ["Deadline", brief.deadline]].map(([label, value]) => <div key={label} className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-[.18em] text-slate-400">{label}</p><p className="mt-2 text-sm font-black text-slate-900">{value}</p></div>)}</div><div className="mt-5 flex flex-wrap items-start content-start gap-2">{brief.ts.map(t => <Badge key={t}>{t}</Badge>)}</div><div className="mt-6 grid gap-6 md:grid-cols-2"><div><h3 className="font-black">Scope</h3><ul className="mt-3 grid gap-2">{brief.scope.map(item => <li key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</li>)}</ul><h3 className="mt-6 font-black">Ikke inkluderet</h3><ul className="mt-3 grid gap-2">{brief.notIncluded.map(item => <li key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</li>)}</ul></div><div><h3 className="font-black">Acceptkriterier</h3><ul className="mt-3 grid gap-2">{brief.acceptance.map(item => <li key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</li>)}</ul><h3 className="mt-6 font-black">Opklarende spørgsmål</h3><ul className="mt-3 grid gap-2">{brief.questions.map(item => <li key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item}</li>)}</ul></div></div><div className="mt-6 rounded-3xl bg-[#071527] p-5 text-white"><p className="text-sm font-black text-emerald-200">Matching-note</p><p className="mt-2 text-sm leading-6 text-white/75">{brief.match}</p></div><div className="mt-6 flex flex-col gap-3 sm:flex-row"><Button secondary>Gem som kladde</Button><Button onClick={() => open("admin")}>Send til kvalitetssikring</Button></div></Panel>
    </section>}

    {view === "provider" && <section className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[.9fr_1.1fr]"><Panel><p className="text-sm font-black uppercase tracking-[.2em] text-[#3f8f83]">Provider early access</p><h1 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Ansøg som provider</h1><p className="mt-3 text-sm leading-6 text-slate-600">Providers skal godkendes manuelt, så platformen føles kurateret fra første dag.</p><form onSubmit={(e) => { e.preventDefault(); setProviderSent(true); }} className="mt-6 grid gap-4"><input placeholder="Navn / firma" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#3f8f83]" /><input placeholder="Email" type="email" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#3f8f83]" /><textarea rows={4} placeholder="Kompetencer" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#3f8f83]" /><textarea rows={4} placeholder="2-3 relevante cases eller links" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#3f8f83]" /><Button type="submit">Send ansøgning</Button></form></Panel><Panel><h2 className="text-2xl font-black text-[#071527]">Kvalitetskrav før godkendelse</h2><div className="mt-5 grid gap-3">{["Tydelige kompetencer", "Relevante cases eller erfaring", "Kan arbejde med afgrænset scope", "Accepterer brief og acceptkriterier", "Kan levere kort handover"].map(item => <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">{item}</div>)}</div>{providerSent && <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm font-black text-emerald-800">Ansøgning registreret i demo-flowet.</div>}</Panel></section>}

    {view === "admin" && <section className="mx-auto max-w-7xl px-5 py-10"><p className="text-sm font-black uppercase tracking-[.2em] text-[#3f8f83]">Admin quality gate</p><h1 className="mt-3 text-4xl font-black tracking-tight text-[#071527]">Det der mangler før launch</h1><p className="mt-3 max-w-3xl text-slate-600">Admin-delen skal være enkel. Første version må gerne være semi-manuel, så ingen opgave eller provider går videre uden kvalitetssikring.</p><div className="mt-8 grid gap-4 md:grid-cols-3">{["Nye behov klar til review", "Provider-ansøgninger", "Opgaver uden match", "Manuel matching til 1-3 pro’s", "Tilbud og statusflow", "Potentiel platformskommission"].map(item => <Panel key={item}><p className="text-sm font-bold leading-6 text-slate-700">{item}</p></Panel>)}</div><Panel className="mt-6"><h2 className="text-2xl font-black text-[#071527]">Næste tekniske skridt</h2><div className="mt-5 grid gap-3 md:grid-cols-2">{["Gem consumer-intakes i database", "Gem provider-ansøgninger", "Send email til admin ved nye leads", "Skjul admin bag login", "Tilføj privatlivspolitik og vilkår", "Tilføj betalingsstatus uden fuld betaling først"].map(item => <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">{item}</div>)}</div></Panel></section>}
  </main>;
}
