import Link from "next/link";
import { type ReactNode } from "react";

export function LegalPage({ title, eyebrow, children }: { title: string; eyebrow: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e8f4ef_0,#f7f8fb_34%,#f7f8fb_100%)] px-5 py-8 text-slate-950">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm hover:border-slate-400">← Tilbage til Naetwork</Link>
        <section className="mt-8 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <p className="text-sm font-black uppercase tracking-[.22em] text-[#3f8f83]">{eyebrow}</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-[#071527] md:text-6xl">{title}</h1>
          <div className="mt-8 space-y-8 text-sm leading-7 text-slate-700">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-black text-[#071527]">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
