import type { Dict } from "@/lib/content";
import { CTA } from "./CTA";
import { Reveal } from "./Reveal";

export function Companies({ t }: { t: Dict["companies"] }) {
  return (
    <section id="companies" className="section bg-[#050810] text-white relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full blur-[120px] opacity-10"
        style={{ background: "rgba(59,130,246,1)" }}
      />

      <div className="wrap relative z-10 grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="h2 mt-4 text-white">{t.title}</h2>
          <p className="lead mt-6 max-w-md">{t.body}</p>
          <div className="mt-9">
            <CTA intent="company" className="btn-pine" arrow>{t.cta}</CTA>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="flex flex-col gap-3">
            {t.points.map((p, i) => (
              <div
                key={p.title}
                className="flex gap-5 rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.13] sm:p-7"
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 font-mono text-xs font-bold text-blue-400 mt-0.5"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-[16px] font-semibold tracking-tight text-white">{p.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/45">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
