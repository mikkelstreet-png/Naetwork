import Link from "next/link";

const principles = [
  {
    title: "Naetwork gør opgaven klarere",
    text: "Vi hjælper med at oversætte et uklart behov til en mere brugbar brief, specialistretning, scope og næste spørgsmål."
  },
  {
    title: "Ingen binding på første trin",
    text: "At sende en opgave betyder ikke, at du har bestilt arbejde eller accepteret en pris. Det er første afklaring."
  },
  {
    title: "Aftaler indgås direkte",
    text: "Pris, levering, rettigheder, betaling, tidsplan og kvalitet aftales direkte mellem kunde og specialist, medmindre andet er aftalt skriftligt."
  },
  {
    title: "Specialister kurateres",
    text: "Specialister får kun adgang til relevante opgaver, og admin kan godkende, pause eller afvise specialistprofiler."
  }
];

export function TrustCenter() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e8f4ef_0,#f7f8fb_38%,#f7f8fb_100%)] px-4 py-6 text-slate-950 sm:px-5">
      <header className="mx-auto flex max-w-6xl items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">N</span>
          <span className="text-lg font-black tracking-tight text-[#071527]">Naetwork</span>
        </Link>
        <Link href="/" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">Til forsiden</Link>
      </header>

      <section className="mx-auto max-w-6xl py-10 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Trust & rolle</p>
          <h1 className="mt-4 text-5xl font-black leading-[.95] tracking-[-0.05em] text-[#071527] md:text-7xl">Klarhed før aftaler.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">Naetwork er bygget til at gøre digitale opgaver mere konkrete, før kunden og specialisten eventuelt går videre sammen.</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {principles.map((item) => (
            <div key={item.title} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <h2 className="text-2xl font-black tracking-tight text-[#071527]">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[32px] border border-slate-200 bg-[#071527] p-6 text-white shadow-sm sm:p-7">
          <p className="text-sm font-black uppercase tracking-[.18em] text-emerald-200">Kort sagt</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">Naetwork er ikke en blank freelance-børs.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/75">Platformen skal føles kurateret: kunden får hjælp til at gøre opgaven klar, specialisten får bedre briefs, og admin styrer kvaliteten i midten.</p>
        </div>
      </section>
    </main>
  );
}
