import Link from "next/link";

const rows = [
  ["Første afklaring", "Gratis", "Beskriv opgaven og få den gjort klarere. Ingen binding på dette trin."],
  ["Specialist-match", "Efter aftale", "Naetwork kan invitere relevante specialister, når opgaven er konkret nok."],
  ["Udførelse", "Aftales direkte", "Pris, tidsplan, levering og rettigheder aftales mellem kunde og specialist."],
];

export function PricingEarlyAccess() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e8f4ef_0,#f7f8fb_38%,#f7f8fb_100%)] px-4 py-6 text-slate-950 sm:px-5">
      <header className="mx-auto flex max-w-6xl items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">N</span>
          <span className="text-lg font-black tracking-tight text-[#071527]">Naetwork</span>
        </Link>
        <Link href="/" className="rounded-full bg-[#071527] px-4 py-2 text-sm font-black text-white shadow-sm">Start opgave</Link>
      </header>

      <section className="mx-auto max-w-6xl py-12 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Pris & early access</p>
          <h1 className="mt-4 text-5xl font-black leading-[.95] tracking-[-0.05em] text-[#071527] md:text-7xl">Start med klarhed. Ikke en stor aftale.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">Naetwork er i MVP-fasen. Første trin handler om at gøre opgaven konkret nok til, at den kan vurderes seriøst.</p>
        </div>

        <div className="mt-10 grid gap-4">
          {rows.map(([title, price, text]) => (
            <div key={title} className="grid gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[.8fr_.5fr_1.2fr] md:items-center">
              <p className="text-xl font-black text-[#071527]">{title}</p>
              <p className="rounded-full bg-emerald-50 px-4 py-2 text-center text-sm font-black text-emerald-800">{price}</p>
              <p className="text-sm leading-7 text-slate-600">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[32px] border border-slate-200 bg-[#071527] p-6 text-white shadow-sm sm:p-7">
          <h2 className="text-3xl font-black tracking-tight">Klar kommerciel model kommer efter validering.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/75">Fokus nu er at validere, at kunder får bedre opgaveklarhed, og at specialister får bedre briefs. Derfor holdes første trin enkelt og uden binding.</p>
        </div>
      </section>
    </main>
  );
}
