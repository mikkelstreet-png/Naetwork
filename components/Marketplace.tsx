import type { Dict } from "@/lib/content";
import { CTA } from "./CTA";
import { Reveal } from "./Reveal";
import { ArrowRight } from "lucide-react";

const colorMap: Record<number, string> = {
  0: "from-blue-500/20 to-indigo-500/20",
  1: "from-indigo-500/20 to-purple-500/20",
  2: "from-purple-500/20 to-blue-500/20",
  3: "from-blue-600/20 to-indigo-400/20",
  4: "from-indigo-400/20 to-blue-600/20",
  5: "from-purple-500/20 to-indigo-500/20",
};

export function Marketplace({ t }: { t: Dict["marketplace"] }) {
  return (
    <section id="marketplace" className="section bg-[#050810] text-white relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }}
      />
      {/* Center glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full blur-[120px] opacity-10"
        style={{ background: "rgba(99,102,241,1)" }}
      />

      <div className="wrap relative z-10">
        <Reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="h2 mt-4 max-w-2xl text-white">{t.title}</h2>
          <p className="lead mt-5 max-w-prose">{t.body}</p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.profiles.map((p, i) => (
            <Reveal key={p.role} delay={(i % 3) * 80}>
              <div className="gradient-border group">
                <div className="flex h-full flex-col rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.14] hover:shadow-[0_0_30px_rgba(59,130,246,0.07)]">
                  {/* Avatar + badge */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${colorMap[i]} font-bold text-sm text-white`}
                    >
                      {p.initials}
                    </span>
                    <span className="rounded-full border border-white/[0.1] bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white/35">
                      {t.badge}
                    </span>
                  </div>

                  {/* Info */}
                  <h3 className="mt-5 text-[16px] font-semibold tracking-tight text-white">{p.role}</h3>
                  <p className="mt-0.5 text-sm text-white/40">{p.field}</p>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs text-blue-400/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-4">
                    <span className="font-mono text-xs text-white/30">{t.meta}</span>
                    <CTA intent="candidate" preset={p.tags[0]} className="group/arrow inline-flex items-center gap-1.5 text-[13px] font-medium text-blue-400 transition hover:text-blue-300">
                      {t.request}
                      <ArrowRight size={13} className="transition-transform group-hover/arrow:translate-x-0.5" />
                    </CTA>
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
