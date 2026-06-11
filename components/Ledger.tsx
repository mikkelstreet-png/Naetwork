import type { Dict, Lang } from "@/lib/content";
import { Reveal } from "./Reveal";
import { CountUp } from "./CountUp";

export function Ledger({ t, lang }: { t: Dict["ledger"]; lang: Lang }) {
  return (
    <section id="impact" className="section bg-[#050810] text-white relative overflow-hidden">
      {/* Subtle top gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent)" }}
      />

      <div className="wrap">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
          <Reveal>
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 className="h2 mt-4 text-white">{t.title}</h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/50">{t.body}</p>
            <p className="mt-8 border-t border-white/[0.08] pt-6 text-sm leading-relaxed text-white/30">{t.note}</p>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative">
              {/* Glow */}
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-2xl blur-2xl opacity-20"
                style={{ background: "radial-gradient(circle, rgba(59,130,246,0.4), transparent)" }}
              />
              <div className="relative rounded-2xl border border-white/[0.09] bg-white/[0.04] p-7 font-mono text-sm shadow-[0_20px_60px_rgba(0,0,0,0.3)] sm:p-9 backdrop-blur-sm">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-white/30">
                  <span>{t.sessionLabel}</span>
                  <span>{lang === "da" ? "KR." : "DKK"}</span>
                </div>
                <dl className="mt-6 space-y-4">
                  {t.rows.map((r) => (
                    <div key={r.label} className="flex items-baseline justify-between gap-4">
                      <dt className="text-white/50">
                        {r.label}
                        {r.note && <span className="ml-2 text-[11px] text-white/25">({r.note})</span>}
                      </dt>
                      <dd className="tabular-nums text-white">{r.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="my-6 border-t border-dashed border-white/[0.08]" />
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-white/70">{t.totalLabel}</span>
                  <span
                    className="font-sans text-3xl font-bold tracking-tight bg-clip-text text-transparent sm:text-4xl"
                    style={{ backgroundImage: "linear-gradient(135deg, #60a5fa, #818cf8)" }}
                  >
                    <CountUp to={t.countTo} suffix={t.countSuffix} />
                  </span>
                </div>
                <p className="mt-2 text-right text-[13px] text-white/30">{t.caption}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
