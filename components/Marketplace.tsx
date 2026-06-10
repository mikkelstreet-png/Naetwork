import type { Dict } from "@/lib/content";
import { CTA } from "./CTA";
import { Reveal } from "./Reveal";

export function Marketplace({ t }: { t: Dict["marketplace"] }) {
  return (
    <section id="marketplace" className="section bg-sage">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="h2 mt-4 max-w-2xl">{t.title}</h2>
          <p className="lead mt-5 max-w-prose">{t.body}</p>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.profiles.map((p, i) => (
            <Reveal key={p.role} delay={(i % 3) * 80}>
              <div className="flex h-full flex-col rounded-card border border-line bg-paper p-6">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-[2px] bg-ink font-mono text-sm text-paper">{p.initials}</span>
                  <span className="rounded-[2px] bg-sage px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{t.badge}</span>
                </div>
                <h3 className="mt-5 font-display text-lg font-medium tracking-tight">{p.role}</h3>
                <p className="mt-1 text-sm text-muted">{p.field}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((tag) => (
                    <span key={tag} className="rounded-[2px] border border-line px-2.5 py-1 text-xs text-ink/70">{tag}</span>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
                  <span className="font-mono text-xs text-muted">{t.meta}</span>
                  <CTA intent="candidate" preset={p.tags[0]} className="link-arrow text-pine">{t.request}</CTA>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
