import { ShieldCheck, Heart, Scale } from "lucide-react";
import type { Dict } from "@/lib/content";
import { Reveal } from "./Reveal";

const icons = { shield: ShieldCheck, heart: Heart, scale: Scale } as const;
const gradients = [
  "from-blue-500/20 to-indigo-500/20",
  "from-pink-500/20 to-rose-500/20",
  "from-indigo-500/20 to-purple-500/20",
];
const iconColors = ["text-blue-400", "text-pink-400", "text-indigo-400"];

export function Trust({ t }: { t: Dict["trust"] }) {
  return (
    <section className="section bg-[#050810] text-white relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }}
      />

      <div className="wrap">
        <Reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="h2 mt-4 max-w-2xl text-white">{t.title}</h2>
          <p className="lead mt-5 max-w-prose">{t.body}</p>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {t.cards.map((c, i) => {
            const Icon = icons[c.icon as keyof typeof icons] ?? ShieldCheck;
            return (
              <Reveal key={c.title} delay={i * 80}>
                <div className="gradient-border h-full">
                  <div className="flex h-full flex-col rounded-xl border border-white/[0.08] bg-white/[0.03] p-7 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.06]">
                    <span className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${gradients[i]}`}>
                      <Icon size={20} className={iconColors[i]} />
                    </span>
                    <h3 className="mt-6 text-[16px] font-semibold tracking-tight text-white">{c.title}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-white/45">{c.body}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
