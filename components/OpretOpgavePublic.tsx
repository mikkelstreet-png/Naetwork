'use client';

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

const DEMO = {
  ownWords:
    "Vi har for mange manuelle processer. Vores salgsteam bruger timer på at opdatere CRM, sende opfølgningsmails og lave rapporter. Jeg tror det kan automatiseres, men ved ikke hvad vi har brug for.",
  understanding:
    "Du har et internt workflow-problem. Det handler ikke om én teknologi — det handler om at kortlægge og automatisere et salgsteams daglige repetitive arbejde.",
  needs: [
    "Frigjort tid til salg frem for administration",
    "Konsistente processer på tværs af teamet",
    "Overblik og rapportering uden manuel indsats",
  ],
  task: "Automation af salgsteamets workflow: CRM-opdatering, opfølgningsmails og rapportering",
  scope: [
    "Kortlægning af nuværende manuel workflow (2–4 timer)",
    "Opsætning af automationer i eksisterende værktøjer (Make, Zapier eller n8n)",
    "Integration mod CRM (HubSpot/Salesforce/Pipedrive — afklares)",
    "Auto-rapportering til ledelsen (ugentlig digest)",
  ],
  questions: [
    "Hvilke konkrete tools bruges i dag (CRM, mail, kalender)?",
    "Hvad er det største tidsspild — opfølgning eller rapportering?",
    "Er der budget til nye tools, eller skal det løses i eksisterende?",
  ],
  specialist: "Automationsspecialist med erfaring i CRM-integration og workflow-design",
};

function AnalysisCard() {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[.22em] text-[#3f8f83]">Naetwork analysebrief · Eksempel</p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-[#071527]">Automation af salgsteamets workflow</h3>
        </div>
        <span className="w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-800">
          Klar til review
        </span>
      </div>

      <div className="mt-6 grid gap-6">
        <div>
          <p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Brugerens egne ord</p>
          <p className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">"{DEMO.ownWords}"</p>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Naetwork forstår</p>
          <p className="mt-3 text-sm leading-7 text-slate-700">{DEMO.understanding}</p>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Behovet bag ordene</p>
          <ul className="mt-3 grid gap-2">
            {DEMO.needs.map((n) => (
              <li key={n} className="flex items-start gap-2 text-sm leading-6 text-slate-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#3f8f83]" />
                {n}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Anbefalet opgave</p>
          <p className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-black leading-6 text-[#071527]">
            {DEMO.task}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Scope</p>
            <ul className="mt-3 space-y-2">
              {DEMO.scope.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm leading-6 text-slate-700">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3f8f83]" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Åbne spørgsmål til specialist</p>
            <ol className="mt-3 space-y-2">
              {DEMO.questions.map((q, i) => (
                <li key={q} className="flex items-start gap-2 text-sm leading-6 text-slate-700">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-black text-slate-600">
                    {i + 1}
                  </span>
                  {q}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="rounded-2xl bg-[#071527] p-5 text-white">
          <p className="text-xs font-black uppercase tracking-[.16em] text-emerald-300">Anbefalet specialistretning</p>
          <p className="mt-2 text-base font-black">{DEMO.specialist}</p>
        </div>
      </div>
    </article>
  );
}

type Phase = "idle" | "loading" | "done";

export function OpretOpgavePublic() {
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");

  function analyse() {
    if (text.trim().length < 10) return;
    setPhase("loading");
    setTimeout(() => setPhase("done"), 1800);
  }

  return (
    <main className="min-h-screen bg-[#f7f8fb] px-4 py-6 text-slate-950 sm:px-5">
      {/* Simple header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">N</span>
          <span className="text-lg font-black tracking-tight text-[#071527]">Naetwork</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm sm:block">
            Log ind
          </Link>
          <Link href="/opret" className="rounded-full bg-[#071527] px-4 py-2 text-sm font-black text-white shadow-sm">
            Opret konto
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl py-12 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          {/* Left: explanation */}
          <div>
            <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Opret opgave</p>
            <h1 className="mt-4 text-5xl font-black leading-[.95] tracking-[-0.05em] text-[#071527] md:text-6xl">
              Beskriv dit behov. Vi analyserer det.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Du behøver ikke kende løsningen, specialisttypen eller det tekniske. Skriv bare hvad der er galt eller hvad du drømmer om.
            </p>

            <div className="mt-7 grid gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-black uppercase tracking-[.14em] text-slate-400">Hvad sker der?</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Naetwork omsætter dit input til en analysebrief med scope, leverancer, åbne spørgsmål og specialistretning.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-black uppercase tracking-[.14em] text-slate-400">Herunder</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Se et eksempel på en rigtig analyse — og opret konto for at gemme din egen og gå videre.
                </p>
              </div>
            </div>
          </div>

          {/* Right: form + result */}
          <div className="grid gap-5">
            {/* Input always visible */}
            <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <label className="block">
                <p className="text-sm font-black text-[#071527]">Beskriv dit behov med dine egne ord</p>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={5}
                  className="mt-3 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-7 text-slate-700 outline-none transition focus:border-[#3f8f83] focus:ring-2 focus:ring-[#3f8f83]/10"
                  placeholder="Fx: Vi sender for mange manuelle emails. Vi mister overblik over projekter. Vi har data der ikke snakker sammen..."
                />
                <p className="mt-2 text-xs text-slate-500">
                  Naetwork analyserer dit behov og viser dig en opgavebeskrivelse du kan godkende.
                </p>
              </label>
              <button
                onClick={analyse}
                disabled={text.trim().length < 10 || phase === "loading"}
                className="mt-4 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-[#071527] px-5 py-2 text-sm font-black text-white shadow-sm disabled:opacity-40"
              >
                {phase === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Naetwork analyserer…
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-4 w-4" />
                    Analysér mit behov
                  </>
                )}
              </button>
            </div>

            {/* Analysis result */}
            {phase === "done" && (
              <>
                <AnalysisCard />
                <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm font-black text-[#071527]">Klar til at gemme din analyse?</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Opret en gratis konto for at gemme din opgave og gå videre til Naetwork review og specialistmatch.
                  </p>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <Link
                      href="/opret"
                      className="flex items-center justify-center gap-2 rounded-full bg-[#071527] px-5 py-3 text-sm font-black text-white"
                    >
                      Opret konto og gem opgaven
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/login"
                      className="flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700"
                    >
                      Log ind
                    </Link>
                  </div>
                </div>
              </>
            )}

            {/* Teaser when idle */}
            {phase === "idle" && (
              <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6">
                <p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Eksempel på hvad du modtager</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Skriv dit behov ovenfor og tryk "Analysér" — så viser Naetwork en analyse svarende til dette:
                </p>
                <div className="mt-4 grid gap-2 text-sm">
                  {[
                    "→ Hvad Naetwork forstår bag dine ord",
                    "→ Scope og konkrete leverancer",
                    "→ Åbne spørgsmål til specialisten",
                    "→ Anbefalet specialistretning",
                  ].map((item) => (
                    <p key={item} className="font-black text-[#071527]">{item}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
