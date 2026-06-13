import Link from "next/link";

const points = [
  {
    title: "Bedre briefs",
    text: "Du får ikke bare en løs besked. Naetwork hjælper kunden med at gøre behovet mere konkret, før opgaven sendes videre."
  },
  {
    title: "Mere relevante muligheder",
    text: "Admin inviterer specialister til opgaver, der matcher profil, kompetencer og opgavetype."
  },
  {
    title: "Mindre spildtid",
    text: "Du kan hurtigt svare: interesseret, ikke relevant eller behov for mere information."
  }
];

const expectations = [
  "Du beskriver dine kernekompetencer ærligt.",
  "Du svarer kun på opgaver, du reelt kan hjælpe med.",
  "Du aftaler pris, levering og rammer direkte med kunden.",
  "Du hjælper kunden med klarhed — ikke med at sælge unødvendigt stort scope."
];

export function SpecialistCommercialPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e8f4ef_0,#f7f8fb_38%,#f7f8fb_100%)] px-4 py-6 text-slate-950 sm:px-5">
      <header className="mx-auto flex max-w-6xl items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">N</span>
          <span className="text-lg font-black tracking-tight text-[#071527]">Naetwork</span>
        </Link>
        <div className="flex gap-2">
          <Link href="/access" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">Adgang</Link>
          <Link href="/specialist/login" className="rounded-full bg-[#071527] px-4 py-2 text-sm font-black text-white shadow-sm">Specialist-login</Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 py-12 lg:grid-cols-[.95fr_1.05fr] lg:items-center lg:py-20">
        <div>
          <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">For specialister</p>
          <h1 className="mt-4 text-5xl font-black leading-[.95] tracking-[-0.05em] text-[#071527] md:text-7xl">Få opgaver, der er klarere fra start.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Naetwork er for specialister, der hellere vil bruge tid på relevante, kvalificerede opgaver end løse henvendelser uden retning.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/specialist/login" className="rounded-full bg-[#071527] px-6 py-4 text-center text-sm font-black text-white">Send specialist-link</Link>
            <Link href="/trust" className="rounded-full border border-slate-200 bg-white px-6 py-4 text-center text-sm font-black text-slate-700">Se trust-principper</Link>
          </div>
        </div>

        <div className="rounded-[36px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <p className="text-sm font-black uppercase tracking-[.16em] text-[#3f8f83]">Specialistoplevelsen</p>
          <div className="mt-5 grid gap-3">
            {points.map((item) => (
              <div key={item.title} className="rounded-2xl bg-[#f7f8fb] p-4">
                <p className="font-black text-[#071527]">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl pb-16 lg:pb-24">
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <h2 className="text-3xl font-black tracking-tight text-[#071527]">Hvad du får</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">En enkel specialistprofil, adgang via magic link og invitationer til relevante opgaver, hvor kunden allerede har beskrevet behov, situation og ønsket resultat.</p>
          </div>
          <div className="rounded-[32px] border border-slate-200 bg-[#071527] p-6 text-white shadow-sm sm:p-7">
            <h2 className="text-3xl font-black tracking-tight">Hvad vi forventer</h2>
            <div className="mt-4 grid gap-2">
              {expectations.map((item) => <p key={item} className="rounded-2xl bg-white/5 p-3 text-sm leading-6 text-white/80">{item}</p>)}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
