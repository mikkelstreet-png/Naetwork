import type { Dict, Lang } from "@/lib/content";
import { Reveal } from "./Reveal";
import { CountUp } from "./CountUp";

export function Ledger({ t, lang }: { t: Dict["ledger"]; lang: Lang }) {
  const suffix = lang === "da" ? " kr." : " DKK";
  return (
    <section id="impact" className="section bg-pine-deep text-paper">
      <div className="wrap">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
          <Reveal>
            <p className="eyebrow-amber">{t.eyebrow}</p>
            <h2 className="h2 mt-4 text-paper">{t.title}</h2>
            <p className="mt-6 max-w-md leading-relaxed text-sageText">{t.body}</p>
            <p className="mt-8 border-t border-pine-line pt-6 text-sm leading-relaxed text-sageText/80">{t.note}</p>
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-card border border-pine-line bg-pine/60 p-6 font-mono text-sm sm:p-8">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-sageText/70">
                <span>{t.sessionLabel}</span><span>{lang === "da" ? "KR." : "DKK"}</span>
              </div>
              <dl className="mt-5 space-y-4">
                {t.rows.map((r) => (
                  <div key={r.label} className="flex items-baseline justify-between gap-4">
                    <dt className="text-sageText">
                      {r.label}
                      {r.note && <span className="ml-2 text-[11px] text-sageText/60">({r.note})</span>}
                    </dt>
                    <dd className="tabular-nums text-paper">{r.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="my-5 border-t border-dashed border-pine-line" />
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-paper">{t.totalLabel}</span>
                <span className="font-display text-3xl font-medium tracking-tight text-paper sm:text-4xl">
                  <CountUp to={300} suffix={suffix} />
                </span>
              </div>
              <p className="mt-2 text-right text-[13px] text-sageText">{t.caption}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
