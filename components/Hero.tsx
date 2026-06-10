import { Heart, Shuffle, ShieldCheck, ArrowRight } from "lucide-react";
import type { Dict } from "@/lib/content";
import { CTA } from "./CTA";
import { Reveal } from "./Reveal";

const badgeIcons = [Heart, Shuffle, ShieldCheck];

export function Hero({ t, how }: { t: Dict["hero"]; how: Dict["how"] }) {
  return (
    <>
      <section id="top" className="relative overflow-hidden bg-pine-deep text-paper">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.5]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="pointer-events-none absolute -left-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-white/[0.04] blur-3xl" aria-hidden="true" />

        <div className="wrap relative pb-32 pt-16 sm:pt-24">
          <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16">
            <div>
              <Reveal>
                <h1 className="h1 max-w-xl text-paper">
                  {t.titleA} <span className="text-sageText">{t.titleB}</span>{" "}
                  <span className="emph">{t.titleEmph}</span>
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <p className="lead mt-7 max-w-md text-sageText">{t.body}</p>
              </Reveal>
              <Reveal delay={200}>
                <div className="mt-9 flex flex-wrap gap-3">
                  <CTA intent="candidate" className="btn-paper" arrow>{t.primary}</CTA>
                  <CTA href="#marketplace" className="btn-ghost-sage">{t.browse}</CTA>
                </div>
              </Reveal>
              <Reveal delay={280}>
                <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3">
                  {t.badges.map((b, i) => {
                    const Icon = badgeIcons[i] ?? Heart;
                    return (
                      <li key={b} className="flex items-center gap-2 text-[13px] text-sageText">
                        <Icon size={15} className="text-amber-soft" /> {b}
                      </li>
                    );
                  })}
                </ul>
              </Reveal>
            </div>

            <Reveal delay={160}>
              <div id="how" className="rounded-card border border-pine-line bg-white/[0.03] p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="eyebrow-sage">{how.eyebrow}</span>
                  <span className="font-mono text-xs text-sageText">{t.howMeta}</span>
                </div>
                <ol className="mt-6 space-y-5">
                  {how.steps.map((s, i) => (
                    <li key={s.title} className="flex gap-4">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[2px] border border-pine-line font-mono text-xs text-paper">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-medium text-paper">{s.title}</p>
                        <p className="mt-0.5 text-sm leading-relaxed text-sageText">{s.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <a href="#marketplace" className="mt-6 flex items-center justify-between rounded-[2px] border border-pine-line px-4 py-3 text-sm text-paper transition-colors hover:bg-white/[0.04]">
                  {t.seePros} <ArrowRight size={15} className="text-sageText" />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* stat strip — white cards overlapping the dark hero */}
      <div className="wrap relative z-10 -mt-16">
        <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-card border border-line bg-line shadow-sm sm:grid-cols-3">
          {t.equation.map((e) => (
            <div key={e.label} className="bg-paper px-7 py-8">
              <dt className="font-display text-4xl font-medium tracking-tight text-ink">{e.value}</dt>
              <dd className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{e.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}
