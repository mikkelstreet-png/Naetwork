import Link from "next/link";

const options = [
  {
    title: "Opret som kunde",
    label: "Jeg har en opgave",
    text: "Start med at beskrive behovet. Når opgaven er sendt, får du adgang til Min opgave via email-link.",
    href: "/",
    cta: "Opret opgave"
  },
  {
    title: "Opret som specialist",
    label: "Jeg vil hjælpe med opgaver",
    text: "Se hvordan specialistdelen fungerer, og få adgang til relevante opgaveinvitationer, når din profil er godkendt.",
    href: "/specialister",
    cta: "Se specialistdelen"
  }
];

export function CreateUserChoice() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e8f4ef_0,#f7f8fb_38%,#f7f8fb_100%)] px-4 py-6 text-slate-950 sm:px-5">
      <header className="mx-auto flex max-w-6xl items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#071527] text-sm font-black text-white">N</span>
          <span className="text-lg font-black tracking-tight text-[#071527]">Naetwork</span>
        </Link>
        <Link href="/access" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">Log ind</Link>
      </header>

      <section className="mx-auto max-w-6xl py-12 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Opret bruger</p>
          <h1 className="mt-4 text-5xl font-black leading-[.95] tracking-[-0.05em] text-[#071527] md:text-7xl">Hvad vil du bruge Naetwork til?</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">Naetwork bruger email-link i stedet for password. Det gør adgangen enklere: du opretter dig ved at starte den rigtige vej.</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {options.map((option) => (
            <Link key={option.title} href={option.href} className="group rounded-[34px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#3f8f83]/50 hover:shadow-md sm:p-8">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-800">{option.label}</span>
              <h2 className="mt-5 text-3xl font-black tracking-tight text-[#071527]">{option.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{option.text}</p>
              <div className="mt-7 inline-flex rounded-full bg-[#071527] px-5 py-3 text-sm font-black text-white transition group-hover:bg-[#0b203a]">{option.cta}</div>
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="font-black text-[#071527]">Hvorfor ikke klassisk password?</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">For MVP’en er magic-link mere simpelt og sikkert for brugeren. Kunden får adgang til sin konkrete opgave, og specialisten får adgang til relevante invitationer.</p>
        </div>
      </section>
    </main>
  );
}
