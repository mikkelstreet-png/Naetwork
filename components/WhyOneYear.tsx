import type { Dict } from '@/lib/content';
import { Reveal } from './Reveal';

export function WhyOneYear({ t }: { t: Dict['whyOneYear'] }) {
  return (
    <section className="section bg-[#050810] text-white relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full blur-[140px] opacity-[0.06]"
        style={{ background: 'rgba(59,130,246,1)' }}
      />

      <div className="wrap relative z-10">
        <Reveal>
          <p className="eyebrow text-center">{t.eyebrow}</p>
          <h2 className="h2 mt-4 text-white text-center max-w-2xl mx-auto">{t.title}</h2>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-8 max-w-2xl mx-auto text-center">
            {t.body.split('\n\n').map((para, i) => (
              <p key={i} className={`leading-relaxed text-white/55 text-[1.05rem] ${i > 0 ? 'mt-5' : ''}`}>
                {para}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {t.pillars.map((p, i) => (
              <div
                key={p.title}
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-7 backdrop-blur-sm text-center"
              >
                <div
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full font-mono text-xs font-bold text-blue-400 mb-4"
                  style={{ background: 'rgba(59,130,246,0.12)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="text-[16px] font-semibold text-white tracking-tight">{p.title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-white/50 italic">{p.line1}</p>
                {p.line2 && <p className="mt-1 text-[14px] leading-relaxed text-white/50 italic">{p.line2}</p>}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
