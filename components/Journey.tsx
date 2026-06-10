import type { Dict } from "@/lib/content";
import { Reveal } from "./Reveal";

export function Journey({ t }: { t: Dict["journey"] }) {
  return (
    <section id="journey" className="section bg-sage">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="h2 mt-4 max-w-2xl">{t.title}</h2>
          <p className="lead mt-5 max-w-prose">{t.body}</p>
        </Reveal>
        <ol className="mt-14 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {t.phases.map((p, i) => (
            <Reveal as="li" key={p.month} delay={(i % 3) * 70} className="bg-paper p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-pine">{p.month}</span>
                <span className="font-mono text-xs text-line">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-5 font-display text-lg font-medium tracking-tight">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
