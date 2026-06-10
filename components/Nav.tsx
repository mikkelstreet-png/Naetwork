"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { LangSwitch } from "./LangSwitch";
import type { Dict, Lang } from "@/lib/content";
import { openModal } from "@/lib/modalStore";

export function Nav({ t, lang }: { t: Dict["nav"]; lang: Lang }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const home = lang === "da" ? "/da" : "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/[0.07] bg-[#050810]/80 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.4)]"
          : "bg-transparent"
      }`}
    >
      <nav className="wrap flex h-16 items-center justify-between lg:h-[68px]">
        {/* Logo */}
        <a href={home} aria-label="Naetwork" className="shrink-0">
          <Logo tone="paper" />
        </a>

        {/* Center links */}
        <div className="hidden items-center gap-1 lg:flex">
          {t.links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="rounded-full px-4 py-2 text-[13px] font-medium text-white/50 transition-all duration-150 hover:bg-white/[0.06] hover:text-white/90"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <LangSwitch lang={lang} />
          <button
            onClick={() => openModal("professional")}
            className="rounded-full px-4 py-2 text-[13px] font-medium text-white/50 transition-all hover:bg-white/[0.06] hover:text-white/90"
          >
            {t.mentor}
          </button>
          <button
            onClick={() => openModal("candidate")}
            className="btn-pine !px-5 !py-2 !text-[13px]"
          >
            {t.book}
          </button>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <LangSwitch lang={lang} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-full text-white/70 transition hover:bg-white/[0.06] hover:text-white"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/[0.07] bg-[#050810]/95 backdrop-blur-xl lg:hidden">
          <div className="wrap flex flex-col gap-1 py-4">
            {t.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-[14px] font-medium text-white/60 transition hover:bg-white/[0.06] hover:text-white"
              >
                {l.label}
              </a>
            ))}
            <button
              onClick={() => { setOpen(false); openModal("candidate"); }}
              className="btn-pine mt-3 w-full"
            >
              {t.book}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
