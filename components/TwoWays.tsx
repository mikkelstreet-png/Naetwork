import { Check, GraduationCap, Briefcase } from "lucide-react";
import type { Dict } from "@/lib/content";
import { CTA } from "./CTA";
import { Reveal } from "./Reveal";

export function TwoWays({ t }: { t: Dict["twoWays"] }) {
  const { candidate: cnd, professional: pro } = t;
  return (
    <section className="section bg-[#050810] text-white relative overflow-hidden">
      {/* Section dividers */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }}
      />

      <div className="wrap">
        <Reveal>
          <p className="eyebrow text-center">{t.eyebrow}</p>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {/* Candidate card */}
          <Reveal>
            <div className="gradient-border h-full">
              <div className="flex h-full flex-col rounded-xl border border-white/[0.09] bg-white/[0.04] p-7 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.06] sm:p-9">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-500/20 text-blue-400">
                  <GraduationCap size={22} />
                </span>
                <span className="eyebrow mt-6">{cnd.kicker}</span>
                <h3 className="h3 mt-2 text-white">{cnd.title}</h3>
                <p className="mt-4 leading-relaxed text-white/50">{cnd.body}</p>
                <ul className="mt-7 space-y-3">
                  {cnd.points.map((p) => (
                    <li key={p} className="flex items-center gap-3 text-[15px] text-white/70">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-500/20">
                        <Check size={11} className="text-blue-400" />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-8">
                  <CTA intent="candidate" className="btn-pine" arrow>{cnd.cta}</CTA>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Professional card */}
          <Reveal delay={100}>
            <div className="gradient-border h-full">
              <div
                className="flex h-full flex-col rounded-xl p-7 text-white transition-all duration-300 sm:p-9 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(99,102,241,0.12) 100%)",
                  border: "1px solid rgba(59,130,246,0.2)",
                }}
              >
                {/* Glow */}
                <div
                  aria-hidden="true"
                  className="absolute top-0 right-0 h-48 w-48 rounded-full blur-3xl opacity-20"
                  style={{ background: "rgba(99,102,241,1)" }}
                />
                <span className="relative grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-white">
                  <Briefcase size={22} />
                </span>
                <span className="relative eyebrow mt-6">{pro.kicker}</span>
                <h3 className="relative h3 mt-2 text-white">{pro.title}</h3>
                <p className="relative mt-4 leading-relaxed text-white/50">{pro.body}</p>
                <ul className="relative mt-7 space-y-3">
                  {pro.points.map((p) => (
                    <li key={p} className="flex items-center gap-3 text-[15px] text-white/75">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/10">
                        <Check size={11} className="text-white" />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="relative mt-auto pt-8">
                  <CTA intent="professional" className="btn-paper" arrow>{pro.cta}</CTA>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
