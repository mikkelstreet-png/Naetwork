import type { Dict } from "@/lib/content";
import { CTA } from "./CTA";
import { Reveal } from "./Reveal";

export function Companies({ t }: { t: Dict["companies"] }) {
  return (
    <section id="companies" className="section bg-paper">
      <div className="wrap grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="h2 mt-4">{t.title}</h2>
          <p className="lead mt-6 max-w-md">{t.body}</p>
          <div className="mt-8"><CTA intent="company" className="btn-pine" arrow>{t.cta}</CTA></div>
        </Reveal>
        <Reveal delay={120}>
          <div className="grid gap-px overflow-hidden rounded-card border border-line bg-line">
            {t.points.map((p, i) => (
              <div key={p.title} className="flex gap-5 bg-paper p-6 sm:p-7">
                <span className="font-mono text-sm text-amber">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-display text-lg font-medium tracking-tight">{p.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
