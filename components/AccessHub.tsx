import Link from "next/link";

const cards = [
  {
    title: "Se din opgave",
    label: "Kunde",
    text: "Få adgang til status, foreløbig brief, scope og næste skridt.",
    href: "/login",
    cta: "Send opgavelink"
  },
  {
    title: "Specialist-adgang",
    label: "Specialist",
    text: "Se relevante opgaveinvitationer, profil og svarmuligheder.",
    href: "/specialist/login",
    cta: "Send specialistlink"
  }
];

export function AccessHub() {
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
          <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">Adgang</p>
          <h1 className="mt-4 text-5xl font-black leading-[.95] tracking-[-0.05em] text-[#071527] md:text-7xl">Fortsæt der, hvor opgaven er.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">Naetwork-login er ikke en almindelig konto. Det er adgang til en konkret opgave, en specialistprofil eller et internt kontrolcenter.</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {cards.map((card) => (
            <Link key={card.title} href={card.href} className="group rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#3f8f83]/50 hover:shadow-md sm:p-7">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-800">{card.label}</span>
              <h2 className="mt-5 text-3xl font-black tracking-tight text-[#071527]">{card.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{card.text}</p>
              <div className="mt-6 inline-flex rounded-full bg-[#071527] px-5 py-3 text-sm font-black text-white transition group-hover:bg-[#0b203a]">{card.cta}</div>
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="font-black text-[#071527]">Intern adgang</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">Admin er kun for intern drift af opgaver, specialister og invitationer.</p>
          <Link href="/admin/login" className="mt-4 inline-flex rounded-full border border-slate-200 px-5 py-3 text-sm font-black text-slate-700">Admin-login</Link>
        </div>
      </section>
    </main>
  );
}
