import { NaetworkEndToEndV5 } from "@/components/NaetworkEndToEndV5";
import { NaetworkHeaderClarityFix } from "@/components/NaetworkHeaderClarityFix";

const audiences = [
  {
    title: "Små virksomheder",
    text: "Når hjemmesiden, bookingflowet, dataoverblikket eller salgsprocessen skal fungere bedre, men opgaven endnu ikke er tydeligt defineret."
  },
  {
    title: "Founders og idéfolk",
    text: "Når du har en digital idé, men mangler første brugbare scope, rigtig specialistretning og en klar vej til MVP."
  },
  {
    title: "Teams med manuelle processer",
    text: "Når Excel, mails, gentagelser eller uklare workflows tager for meget tid, og en enkel automation kan skabe værdi."
  }
];

const examples = [
  "Min hjemmeside ser fin ud, men den skaber ikke nok henvendelser.",
  "Jeg vil bruge AI i min virksomhed, men ved ikke hvor det faktisk giver mening.",
  "Jeg har en idé til en platform, men mangler et simpelt MVP-scope.",
  "Vi bruger for meget tid på manuelle mails, Excel og opfølgninger.",
  "Mit booking- eller kontaktflow føles tungt for kunderne.",
  "Mit pitch eller tilbudsmateriale skal være mere beslutningsklart."
];

const promises = [
  "Du behøver ikke kende løsningen først.",
  "Du får opgaven gjort klarere, før du går videre.",
  "Du kan følge status og tilføje mere information.",
  "Specialister får bedre briefs og mere relevante opgaver."
];

export function NaetworkCommercialV9() {
  return (
    <>
      <NaetworkHeaderClarityFix />
      <NaetworkEndToEndV5 />

      <section id="hvem" className="bg-[#f7f8fb] px-4 py-16 text-slate-950 sm:px-5 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Commercial MVP</p>
            <h2 className="mt-4 text-4xl font-black leading-[.95] tracking-[-0.045em] text-[#071527] md:text-6xl">For dig der ved, hvad du vil opnå, men ikke hvad opgaven hedder.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">Naetwork skal gøre det lettere at komme fra rodet behov til en konkret digital opgave, der kan vurderes og løses af den rette specialist.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {audiences.map((item) => (
              <div key={item.title} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-2xl font-black tracking-tight text-[#071527]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="eksempler" className="bg-white px-4 py-16 text-slate-950 sm:px-5 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Use cases</p>
              <h2 className="mt-4 text-4xl font-black leading-[.95] tracking-[-0.045em] text-[#071527] md:text-6xl">Start med problemet. Ikke løsningen.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">De fleste gode opgaver starter uklart. Det er derfor Naetwork starter med afklaring, ikke med en liste af freelancere.</p>
            </div>
            <div className="grid gap-3">
              {examples.map((example) => (
                <div key={example} className="rounded-2xl border border-slate-200 bg-[#f7f8fb] p-4 text-sm font-bold leading-7 text-slate-700">“{example}”</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#071527] px-4 py-16 text-white sm:px-5 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[.22em] text-emerald-200">Hvorfor Naetwork</p>
            <h2 className="mt-4 text-4xl font-black leading-[.95] tracking-[-0.045em] md:text-6xl">Klarhed før du bruger penge på udførelse.</h2>
            <p className="mt-5 text-lg leading-8 text-white/70">Målet er ikke at gøre valget større. Målet er at gøre opgaven tydeligere, så næste beslutning bliver lettere.</p>
          </div>
          <div className="grid gap-3">
            {promises.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-black leading-7 text-white/85">{item}</div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
