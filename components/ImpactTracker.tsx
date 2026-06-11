import type { Dict } from '@/lib/content';
import { Reveal } from './Reveal';

export function ImpactTracker({ t }: { t: Dict['impactTracker'] }) {
  return (
    <section id="impact" className="section bg-[#050810] text-white relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}
      />

      <div className="wrap relative z-10">
        <Reveal>
          <p className="eyebrow text-center">{t.eyebrow}</p>
          <h2 className="h2 mt-4 text-white text-center">{t.title}</h2>
        </Reveal>

        <Reveal delay={100}>
          <div
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 overflow-hidden rounded-2xl border border-white/[0.08] backdrop-blur-sm"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            {t.stats.map((s, i) => (
              <div
                key={s.label}
                className={`px-8 py-9 text-center ${i < t.stats.length - 1 ? 'border-b border-white/[0.07] sm:border-b-0 sm:border-r sm:border-white/[0.07]' : ''}`}
              >
                <div
                  className="font-sans text-[3rem] font-bold tracking-tight bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(135deg, #60a5fa, #818cf8)' }}
                >
                  {s.prefix}{s.value}{s.suffix}
                </div>
                <div className="mt-2 text-[13px] leading-snug text-white/40 max-w-[160px] mx-auto">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-8 text-center text-[13px] text-white/30 max-w-lg mx-auto">{t.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
