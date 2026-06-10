"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Dict } from "@/lib/content";
import { Reveal } from "./Reveal";

export function FAQ({ t }: { t: Dict["faq"] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="section bg-[#050810] text-white relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }}
      />

      <div className="wrap">
        <Reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="h2 mt-4 max-w-xl text-white">{t.title}</h2>
        </Reveal>

        <div className="mt-12 max-w-3xl space-y-3">
          {t.items.map((item, i) => (
            <Reveal key={item.q} delay={i * 50}>
              <div
                className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                  open === i
                    ? "border-blue-500/25 bg-blue-500/[0.06]"
                    : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05]"
                }`}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <span className="text-[15px] font-semibold text-white pr-4">{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-white/40 transition-transform duration-300 ${open === i ? "rotate-180 text-blue-400" : ""}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${open === i ? "max-h-96 pb-5" : "max-h-0"}`}
                >
                  <p className="px-6 text-[15px] leading-relaxed text-white/50">{item.a}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
