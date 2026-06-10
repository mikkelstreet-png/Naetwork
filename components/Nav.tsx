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
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-colors ${scrolled ? "border-b border-line bg-paper/85 backdrop-blur" : "bg-transparent"}`}>
      <nav className="wrap flex h-16 items-center justify-between">
        <a href={home} aria-label="Naetwork"><Logo /></a>

        <div className="hidden items-center gap-7 lg:flex">
          {t.links.map((l) => (
            <a key={l.label} href={l.href} className="text-[12px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink">{l.label}</a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <LangSwitch lang={lang} />
          <button onClick={() => openModal("professional")} className="text-[12px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink">{t.mentor}</button>
          <button onClick={() => openModal("candidate")} className="btn-pine !px-5 !py-2.5">{t.book}</button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LangSwitch lang={lang} />
          <button type="button" onClick={() => setOpen((v) => !v)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-lg text-ink">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-line bg-paper lg:hidden">
          <div className="wrap flex flex-col gap-1 py-4">
            {t.links.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="rounded-[2px] px-2 py-2.5 text-[13px] uppercase tracking-[0.12em] text-ink/80 hover:bg-sage">{l.label}</a>
            ))}
            <button onClick={() => { setOpen(false); openModal("candidate"); }} className="btn-pine mt-2 w-full">{t.book}</button>
          </div>
        </div>
      )}
    </header>
  );
}
