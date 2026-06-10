import { Logo } from "./Logo";
import type { Dict } from "@/lib/content";
import { site } from "@/lib/content";

export function Footer({ t, tagline }: { t: Dict["footer"]; tagline: string }) {
  return (
    <footer className="bg-[#020408] text-white relative overflow-hidden">
      {/* Top border glow */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.4), rgba(99,102,241,0.4), transparent)" }}
      />

      <div className="wrap py-16 relative z-10">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo tone="paper" />
            <p className="mt-5 text-sm leading-relaxed text-white/40">{t.blurb}</p>
            <p
              className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #60a5fa, #818cf8)" }}
            >
              {tagline}
            </p>
          </div>

          {t.columns.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/30">{col.title}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-white/40 transition-colors hover:text-white/80"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-14 flex flex-col gap-4 border-t pt-7 text-xs text-white/25 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <p className="max-w-2xl leading-relaxed">{t.legal}</p>
          <p className="shrink-0">© {new Date().getFullYear()} {site.name}</p>
        </div>
      </div>
    </footer>
  );
}
