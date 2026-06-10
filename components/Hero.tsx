import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import type { Dict } from "@/lib/content";
import { CTA } from "./CTA";
import { Reveal } from "./Reveal";

const badgeIcons = [Sparkles, Shield, Zap];

export function Hero({ t, how }: { t: Dict["hero"]; how: Dict["how"] }) {
  return (
    <>
      <section id="top" className="relative min-h-screen overflow-hidden bg-[#050810] text-white flex flex-col justify-center">
        {/* Ambient glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[700px] w-[900px] opacity-100"
          style={{
            background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(59,130,246,0.18) 0%, transparent 70%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-1/3 h-[500px] w-[500px] rounded-full blur-[120px]"
          style={{ background: "rgba(99,102,241,0.12)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 bottom-1/4 h-[400px] w-[400px] rounded-full blur-[100px]"
          style={{ background: "rgba(59,130,246,0.1)" }}
        />

        {/* Dot grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="wrap relative z-10 pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32">
          {/* Eyebrow pill */}
          <Reveal>
            <div className="mb-8 flex justify-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-4 py-1.5 text-[12px] font-medium text-blue-400 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                {t.eyebrow}
              </span>
            </div>
          </Reveal>

          <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20">
            <div>
              <Reveal>
                <h1 className="h1 text-white">
                  <span className="block">{t.titleA}</span>
                  <span
                    className="block bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(135deg, #60a5fa 0%, #818cf8 50%, #a78bfa 100%)" }}
                  >
                    {t.titleB}
                  </span>
                  <span className="block text-white/90 italic font-normal">{t.titleEmph}</span>
                </h1>
              </Reveal>

              <Reveal delay={100}>
                <p className="lead mt-7 max-w-lg text-white/55 text-[1.15rem] leading-[1.7]">{t.body}</p>
              </Reveal>

              <Reveal delay={180}>
                <div className="mt-9 flex flex-wrap gap-3">
                  <CTA intent="candidate" className="btn-pine" arrow>{t.primary}</CTA>
                  <CTA href="#marketplace" className="btn-ghost">{t.browse}</CTA>
                </div>
              </Reveal>

              <Reveal delay={260}>
                <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3">
                  {t.badges.map((b, i) => {
                    const Icon = badgeIcons[i] ?? Sparkles;
                    return (
                      <li key={b} className="flex items-center gap-2.5 text-[13px] text-white/40">
                        <Icon size={14} className="text-blue-400/70 shrink-0" />
                        {b}
                      </li>
                    );
                  })}
                </ul>
              </Reveal>
            </div>

            {/* Hero card — how it works */}
            <Reveal delay={140}>
              <div className="relative">
                {/* Glow behind card */}
                <div
                  aria-hidden="true"
                  className="absolute -inset-4 rounded-2xl blur-2xl opacity-30"
                  style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.35), rgba(99,102,241,0.35))" }}
                />
                <div className="relative rounded-2xl border border-white/[0.09] bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.4)]">
                  {/* Card header */}
                  <div className="flex items-center justify-between mb-7">
                    <span className="eyebrow">{how.eyebrow}</span>
                    <span className="rounded-full bg-blue-500/15 px-3 py-1 font-mono text-[11px] text-blue-400">{t.howMeta}</span>
                  </div>

                  {/* Steps */}
                  <ol className="space-y-5">
                    {how.steps.map((s, i) => (
                      <li key={s.title} className="flex gap-4 items-start">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-blue-500/15 font-mono text-xs text-blue-400 font-bold mt-0.5">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-white text-[15px]">{s.title}</p>
                          <p className="mt-1 text-sm leading-relaxed text-white/45">{s.body}</p>
                        </div>
                      </li>
                    ))}
                  </ol>

                  {/* CTA link */}
                  <a
                    href="#marketplace"
                    className="mt-7 flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-sm text-white/70 transition-all hover:bg-white/[0.07] hover:text-white group"
                  >
                    <span>{t.seePros}</span>
                    <ArrowRight size={15} className="text-white/40 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <div className="relative z-10 bg-[#050810]">
        <div className="wrap">
          <div
            className="grid grid-cols-1 sm:grid-cols-3 overflow-hidden rounded-2xl border border-white/[0.08] backdrop-blur-sm"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            {t.equation.map((e, i) => (
              <div
                key={e.label}
                className={`px-8 py-7 ${i < t.equation.length - 1 ? "border-b border-white/[0.07] sm:border-b-0 sm:border-r sm:border-white/[0.07]" : ""}`}
              >
                <dt
                  className="font-sans text-[2.2rem] font-bold tracking-tight bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg, #60a5fa, #818cf8)" }}
                >
                  {e.value}
                </dt>
                <dd className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white/35">{e.label}</dd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
