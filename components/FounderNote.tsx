import type { Dict } from "@/lib/content";
import { Logo } from "./Logo";
import { Reveal } from "./Reveal";

export function FounderNote({ t }: { t: Dict["founder"] }) {
  return (
    <section className="section bg-paper pt-0">
      <div className="wrap">
        <Reveal>
          <figure className="rounded-card border border-line bg-sage p-8 sm:p-14">
            <figcaption className="eyebrow">{t.eyebrow}</figcaption>
            <blockquote className="mt-6 max-w-3xl font-display text-2xl font-normal italic leading-[1.3] sm:text-[2rem]">
              <span className="emph text-pine">&ldquo;</span>{t.quote}<span className="emph text-pine">&rdquo;</span>
            </blockquote>
            <div className="mt-8 flex items-center gap-3">
              <Logo /><span className="ml-1 text-sm text-muted">· {t.meta}</span>
            </div>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
