import type { Dict } from "@/lib/content";
import { Reveal } from "./Reveal";

export function Journey({ t }: { t: Dict["journey"] }) {
  return (
    <section className="section bg-[#050810] text-white relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-0 h-[400px] w-[800px] opacity-10"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,1), transparent)" }}
      />

      <div className="wrap relative z-10">
        <Reveal>
          <p className="eyebrow text-center">{t.eyebrow}</p>
          <h2 className="h2 mt-4 text-center text-white">{t.title}</h2>
          <p className="lead mt-5 text-center mx-auto max-w-lg">{t.body}</p>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.phases.map((phase, i) => (
            <Reveal key={phase.title} delay={(i % 3) * 70}>
              <div className="gradient-border h-full">
                <div className="flex h-full flex-col rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 transition-all duration-300 hover:bg-white/[0.06]">
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-blue-400/60">{phase.month}</span>
                  <h3 className="mt-3 text-[16px] font-semibold tracking-tight text-white">{phase.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-white/45">{phase.body}</p>
                  {/* Step indicator */}
                  <div className="mt-auto pt-5 flex items-center gap-1.5">
                    {Array.from({ length: t.phases.length }).map((_, j) => (
                      <span
                        key={j}
                        className={`h-1 flex-1 rounded-full transition-all ${j <= i ? "bg-blue-500/60" : "bg-white/10"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
