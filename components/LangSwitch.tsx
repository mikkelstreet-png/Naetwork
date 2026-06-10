"use client";

import Link from "next/link";
import type { Lang } from "@/lib/content";

export function LangSwitch({ lang }: { lang: Lang }) {
  const base = "px-2 py-1 text-xs font-mono uppercase tracking-[0.12em] rounded-[2px] transition-colors";
  return (
    <div className="flex items-center gap-0.5 rounded-[2px] border border-line p-0.5">
      <Link href="/" aria-current={lang === "en" ? "true" : undefined}
        className={`${base} ${lang === "en" ? "bg-pine text-paper" : "text-muted hover:text-ink"}`}>EN</Link>
      <Link href="/da" aria-current={lang === "da" ? "true" : undefined}
        className={`${base} ${lang === "da" ? "bg-pine text-paper" : "text-muted hover:text-ink"}`}>DA</Link>
    </div>
  );
}
