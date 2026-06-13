'use client';

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Zap, Users, TrendingUp, ArrowRight } from "lucide-react";

const specialistTypes = [
  "Automationsspecialister (Make, Zapier, n8n)",
  "AI-implementeringsspecialister",
  "Full-stack udviklere og product builders",
  "Frontend-specialister og webdesignere",
  "Data- og dashboardspecialister",
  "UX- og produktdesignere",
  "CRM- og systemintegrationsspecialister",
  "No-code og low-code buildere",
];

const benefits = [
  {
    icon: TrendingUp,
    title: "Relevante leads — ikke spam",
    desc: "Naetwork sender dig kun opgaver der matcher din profil og specialisering. Ingen urelevante henvendelser. Kun opgaver du rent faktisk kan og vil løse.",
  },
  {
    icon: Users,
    title: "Kunder der er klar",
    desc: "Alle opgaver er gennemgået og scopet af Naetwork inden matching. Kunden ved hvad de vil have. Du slipper for eklare briefer og lange afklaringsprocesser.",
  },
  {
    icon: Zap,
    title: "Ingen cold outreach",
    desc: "Du behøver ikke jagte kunder. Naetwork bringer de rigtige opgaver til dig — baseret på din specialisering og din profil, ikke dit netværk.",
  },
];

const specialistDropdown = [
  "Automationsspecialist",
  "AI-implementeringsspecialist",
  "Full-stack udvikler",
  "Frontend-specialist / webdesigner",
  "Data- og dashboardspecialist",
  "UX- og produktdesigner",
  "CRM- og systemintegrationsspecialist",
  "No-code / low-code builder",
  "Andet",
];

type Phase = "form" | "done";

export function SpecialistLanding() {
  const [phase, setPhase] = useState<Phase>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [type, setType] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);

  function submit() {
    if (!name || !email || !type || !experience) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPhase("done");
    }, 1200);
  }

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">N</span>
            <span className="text-lg font-black tracking-tight text-[#071527]">Naetwork</span>
          </Link>
          <Link href="/opret-opgave" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">
            Opret opgave
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-[#071527] px-4 py-20 sm:px-5">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-black uppercase tracking-[.22em] text-emerald-300">For specialister</p>
          <h1 className="mt-4 text-5xl font-black leading-[.93] tracking-[-0.05em] text-white md:text-7xl">
            Bliv en del af Naetwork.{" "}
            <span className="text-[#3f8f83]">Bliv fundet af de rigtige kunder.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/60">
            Vi matcher specialister med opgaver der passer præcist til din profil. Du sparer tid på cold outreach og får relevante leads direkte.
          </p>
          <a
            href="#ansoeg"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-black text-[#071527] shadow-sm"
          >
            Send ansøgning
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* Who fits */}
      <section className="border-b border-slate-200 bg-white px-4 py-16 sm:px-5">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Hvem passer Naetwork til?</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-black leading-[.95] tracking-[-0.05em] text-[#071527] md:text-5xl">
            Specialister med en klar profil.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Naetwork arbejder med specialister der er gode til det de laver og ønsker at bruge mere tid på selve arbejdet — ikke på at finde kunder.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {specialistTypes.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#f7f8fb] px-4 py-3">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#3f8f83]" />
                <span className="text-sm font-black text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-4 py-16 sm:px-5">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Hvad du kan forvente</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-black leading-[.95] tracking-[-0.05em] text-[#071527] md:text-5xl">
            Bedre leads. Mindre spild.
          </h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-[28px] border border-slate-200 bg-white p-7">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#f7f8fb] ring-1 ring-slate-200">
                  <Icon className="h-5 w-5 text-[#071527]" />
                </div>
                <h3 className="mt-5 text-xl font-black text-[#071527]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section id="ansoeg" className="border-t border-slate-200 bg-white px-4 py-16 sm:px-5">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Ansøg som specialist</p>
            <h2 className="mt-4 text-4xl font-black leading-[.95] tracking-[-0.05em] text-[#071527] md:text-5xl">
              Kom med i Naetwork.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Vi gennemgår alle ansøgninger manuelt og vender tilbage inden for 48 timer. Vi optager kun specialister der matcher de opgaver vi ser i platformen.
            </p>
            <div className="mt-7 rounded-2xl border border-slate-200 bg-[#f7f8fb] p-5">
              <p className="text-sm font-black text-[#071527]">Hvad sker der efter din ansøgning?</p>
              <ol className="mt-3 space-y-2">
                {[
                  "Vi gennemgår din profil og erfaring",
                  "Vi vurderer match mod aktuelle opgavetyper",
                  "Inden for 48 timer hører du fra os",
                ].map((step, i) => (
                  <li key={step} className="flex items-start gap-2 text-sm leading-6 text-slate-700">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white text-xs font-black text-[#071527] ring-1 ring-slate-200">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {phase === "form" ? (
            <div className="rounded-[30px] border border-slate-200 bg-[#f7f8fb] p-5 shadow-sm sm:p-7">
              <div className="grid gap-4">
                <label className="grid gap-2 text-sm font-bold text-slate-700">
                  Navn
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#3f8f83] focus:ring-2 focus:ring-[#3f8f83]/10"
                    placeholder="Dit fulde navn"
                  />
                </label>

                <label className="grid gap-2 text-sm font-bold text-slate-700">
                  Email
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#3f8f83] focus:ring-2 focus:ring-[#3f8f83]/10"
                    placeholder="din@email.dk"
                  />
                </label>

                <label className="grid gap-2 text-sm font-bold text-slate-700">
                  LinkedIn URL <span className="font-medium text-slate-400">(valgfrit)</span>
                  <input
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#3f8f83] focus:ring-2 focus:ring-[#3f8f83]/10"
                    placeholder="https://linkedin.com/in/..."
                  />
                </label>

                <label className="grid gap-2 text-sm font-bold text-slate-700">
                  Specialisttype
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#3f8f83]"
                  >
                    <option value="">Vælg specialisttype…</option>
                    {specialistDropdown.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2 text-sm font-bold text-slate-700">
                  Kort beskrivelse af din erfaring
                  <textarea
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    rows={4}
                    className="resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-[#3f8f83] focus:ring-2 focus:ring-[#3f8f83]/10"
                    placeholder="Hvad har du bygget? Hvilke tools bruger du? Hvad er din primære specialisering?"
                  />
                </label>
              </div>

              <button
                onClick={submit}
                disabled={loading || !name || !email || !type || !experience}
                className="mt-5 min-h-[50px] w-full rounded-full bg-[#071527] px-6 py-3 text-sm font-black text-white disabled:opacity-40"
              >
                {loading ? "Sender ansøgning…" : "Send ansøgning"}
              </button>
            </div>
          ) : (
            <div className="rounded-[30px] border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm">
              <CheckCircle2 className="mx-auto h-12 w-12 text-[#3f8f83]" />
              <h3 className="mt-5 text-3xl font-black text-[#071527]">Tak for din ansøgning</h3>
              <p className="mx-auto mt-4 max-w-sm text-base leading-7 text-slate-600">
                Vi vender tilbage inden for 48 timer med en vurdering af din profil og hvad der sker som næste skridt.
              </p>
              <Link href="/" className="mt-7 inline-flex rounded-full bg-[#071527] px-6 py-3 text-sm font-black text-white">
                Tilbage til forsiden
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
