import type { Dict } from "@/lib/content";
import { Logo } from "./Logo";
import { Reveal } from "./Reveal";

export function FounderNote({ t }: { t: Dict["founder"] }) {
  return (
    <section className="section bg-[#050810] text-white relative overflow-hidden pt-0">
      <div className="wrap">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] p-8 sm:p-14"
            style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(99,102,241,0.06) 100%)" }}
          >
            {/* Glow */}
            <div
              aria-hidden="true"
              className="absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl opacity-20"
              style={{ background: "rgba(99,102,241,1)" }}
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full blur-3xl opacity-15"
              style={{ background: "rgba(59,130,246,1)" }}
            />

            <figcaption className="relative eyebrow">{t.eyebrow}</figcaption>
            <blockquote className="relative mt-6 max-w-3xl text-2xl font-normal leading-[1.4] text-white/80 sm:text-[2rem]">
              <span
                className="text-4xl font-bold bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #60a5fa, #818cf8)" }}
              >
                &ldquo;
              </span>
              {t.quote}
              <span
                className="text-4xl font-bold bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #60a5fa, #818cf8)" }}
              >
                &rdquo;
              </span>
            </blockquote>
            <div className="relative mt-8 flex items-center gap-3">
              <Logo tone="paper" />
              <span className="ml-1 text-sm text-white/30">· {t.meta}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
