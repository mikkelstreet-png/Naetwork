import type { Dict } from "@/lib/content";
import { CTA } from "./CTA";
import { Reveal } from "./Reveal";

export function FinalCTA({ t }: { t: Dict["finalCta"] }) {
  return (
    <section className="section bg-[#050810] text-white relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }}
      />
      {/* Center glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full blur-[150px] opacity-15"
        style={{ background: "rgba(59,130,246,1)" }}
      />

      <div className="wrap relative z-10">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-2xl border border-white/[0.08] px-8 py-16 text-center sm:px-16 sm:py-20"
            style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(99,102,241,0.08) 100%)" }}
          >
            {/* Corner glows */}
            <div
              aria-hidden="true"
              className="absolute -top-16 -left-16 h-48 w-48 rounded-full blur-3xl opacity-25"
              style={{ background: "rgba(59,130,246,1)" }}
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full blur-3xl opacity-20"
              style={{ background: "rgba(99,102,241,1)" }}
            />

            <p className="relative eyebrow justify-center">{t.eyebrow}</p>
            <h2
              className="relative h2 mt-4 text-white mx-auto max-w-2xl bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.75) 100%)" }}
            >
              {t.title}
            </h2>
            
            <div className="relative mt-9 flex flex-wrap justify-center gap-3">
              <CTA intent="candidate" className="btn-pine" arrow>{t.primary}</CTA>
              <CTA intent="professional" className="btn-ghost">{t.secondary}</CTA>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
