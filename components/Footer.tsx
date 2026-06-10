import { Logo } from "./Logo";
import type { Dict } from "@/lib/content";
import { site } from "@/lib/content";

export function Footer({ t, tagline }: { t: Dict["footer"]; tagline: string }) {
  return (
    <footer className="bg-pine-deep text-paper">
      <div className="wrap py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo tone="paper" />
            <p className="mt-5 text-sm leading-relaxed text-sageText">{t.blurb}</p>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-amber-soft">{tagline}</p>
          </div>
          {t.columns.map((col) => (
            <div key={col.title}>
              <p className="eyebrow-sage">{col.title}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}><a href={l.href} className="text-sm text-sageText transition-colors hover:text-paper">{l.label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col gap-4 border-t border-pine-line pt-7 text-xs text-sageText/70 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl leading-relaxed">{t.legal}</p>
          <p className="shrink-0">© {new Date().getFullYear()} {site.name}</p>
        </div>
      </div>
    </footer>
  );
}
