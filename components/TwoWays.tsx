import { Check, GraduationCap, Briefcase } from "lucide-react";
import type { Dict } from "@/lib/content";
import { CTA } from "./CTA";
import { Reveal } from "./Reveal";

export function TwoWays({ t }: { t: Dict["twoWays"] }) {
  const { candidate: cnd, professional: pro } = t;
  return (
    <section className="section bg-paper">
      <div className="wrap">
        <Reveal><p className="eyebrow text-center">{t.eyebrow}</p></Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-card border border-line bg-white p-7 sm:p-9">
              <span className="grid h-12 w-12 place-items-center rounded-[2px] bg-ink text-paper"><GraduationCap size={22} /></span>
              <span className="eyebrow-amber mt-6">{cnd.kicker}</span>
              <h3 className="h3 mt-2">{cnd.title}</h3>
              <p className="mt-4 leading-relaxed text-muted">{cnd.body}</p>
              <ul className="mt-7 space-y-3">
                {cnd.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-[15px]"><Check size={16} className="text-ink" /> {p}</li>
                ))}
              </ul>
              <div className="mt-8 pt-2"><CTA intent="candidate" className="btn-pine" arrow>{cnd.cta}</CTA></div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex h-full flex-col rounded-card bg-pine p-7 text-paper sm:p-9">
              <span className="grid h-12 w-12 place-items-center rounded-[2px] bg-white/10 text-paper"><Briefcase size={22} /></span>
              <span className="eyebrow-sage mt-6">{pro.kicker}</span>
              <h3 className="h3 mt-2 text-paper">{pro.title}</h3>
              <p className="mt-4 leading-relaxed text-sageText">{pro.body}</p>
              <ul className="mt-7 space-y-3">
                {pro.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-[15px] text-paper"><Check size={16} className="text-paper" /> {p}</li>
                ))}
              </ul>
              <div className="mt-8 pt-2"><CTA intent="professional" className="btn-paper" arrow>{pro.cta}</CTA></div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
