import type { Dict } from "@/lib/content";
import { CTA } from "./CTA";
import { Reveal } from "./Reveal";

export function FinalCTA({ t }: { t: Dict["finalCta"] }) {
  return (
    <section className="section bg-paper">
      <div className="wrap">
        <Reveal>
          <div className="relative overflow-hidden rounded-card bg-pine px-7 py-14 text-paper sm:px-14 sm:py-20">
            <div className="hatch pointer-events-none absolute inset-0 opacity-[0.08]" aria-hidden="true" />
            <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <p className="eyebrow-sage text-amber-soft">{t.eyebrow}</p>
                <h2 className="mt-4 max-w-2xl font-display text-3xl font-medium leading-[1.08] tracking-tightest text-paper sm:text-4xl lg:text-[2.9rem]">{t.title}</h2>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <CTA intent="candidate" className="btn-paper" arrow>{t.primary}</CTA>
                <CTA intent="professional" className="btn-ghost-sage">{t.secondary}</CTA>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
