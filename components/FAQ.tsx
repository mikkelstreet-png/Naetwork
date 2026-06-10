"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import type { Dict } from "@/lib/content";

export function FAQ({ t }: { t: Dict["faq"] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="section bg-sage">
      <div className="wrap grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="h2 mt-4">{t.title}</h2>
        </div>
        <div className="border-y border-line">
          {t.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="border-b border-line last:border-0">
                <button type="button" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left">
                  <span className="font-display text-[17px] font-medium tracking-tight">{item.q}</span>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[2px] border border-line text-muted">
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </span>
                </button>
                <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden"><p className="max-w-2xl text-[15px] leading-relaxed text-muted">{item.a}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
