"use client";

import Link from "next/link";
import type { Lang } from "@/lib/content";

export function LangSwitch({ lang }: { lang: Lang }) {
  const base = "px-2.5 py-1 text-xs font-mono uppercase tracking-[0.12em] rounded-lg transition-all";
  return (
    <div className="flex items-center gap-0.5 rounded-xl border border-white/[0.08] bg-white/[0.04] p-0.5">
      <Link
        href="/"
        aria-current={lang === "en" ? "true" : undefined}
        className={`${base} ${lang === "en" ? "bg-white/10 text-white" : "text-white/35 hover:text-white/60"}`}
      >
        EN
      </Link>
      <Link
        href="/da"
        aria-current={lang === "da" ? "true" : undefined}
        className={`${base} ${lang === "da" ? "bg-white/10 text-white" : "text-white/35 hover:text-white/60"}`}
      >
        DA
      </Link>
    </div>
  );
}
