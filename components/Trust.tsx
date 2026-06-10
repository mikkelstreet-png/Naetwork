import { ShieldCheck, Heart, Scale } from "lucide-react";
import type { Dict } from "@/lib/content";
import { Reveal } from "./Reveal";

const icons = { shield: ShieldCheck, heart: Heart, scale: Scale } as const;

export function Trust({ t }: { t: Dict["trust"] }) {
  return (
    <section className="section bg-paper">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="h2 mt-4 max-w-2xl">{t.title}</h2>
          <p className="lead mt-5 max-w-prose">{t.body}</p>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {t.cards.map((c, i) => {
            const Icon = icons[c.icon as keyof typeof icons] ?? ShieldCheck;
            return (
              <Reveal key={c.title} delay={i * 80}>
                <div className="h-full rounded-card border border-line bg-white p-7">
                  <span className="grid h-11 w-11 place-items-center rounded-[2px] bg-sage text-pine"><Icon size={20} /></span>
                  <h3 className="mt-6 font-display text-lg font-medium tracking-tight">{c.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{c.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
