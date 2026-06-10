import { ArrowRight } from 'lucide-react'

const stats = [
  { value: '0 kr', label: 'investering' },
  { value: '5 min', label: 'setup' },
  { value: 'Opsig', label: 'når som helst' },
]

export function WhyFree() {
  return (
    <section className="section bg-[#050810]">
      <div className="wrap">
        <div className="mx-auto max-w-[68rem] rounded-2xl border border-white/[0.07] bg-white/[0.025] p-10 lg:p-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20">
            {/* Left */}
            <div>
              <span className="eyebrow mb-4 block">Hvorfor gratis nu?</span>
              <h2 className="h2 text-white leading-[1.1]">
                Vi bygger noget{' '}
                <span className="gradient-text">markedet har manglet.</span>
              </h2>
              <p className="mt-5 text-[15px] leading-[1.75] text-white/50">
                I stedet for at sælge et halvfærdigt produkt inviterer vi
                branchen ind som medskabere. Founding members former
                platformen — og låser deres pris.
              </p>
              <a
                href="/pricing"
                className="link-arrow mt-7 inline-flex items-center gap-2 text-[14px]"
              >
                Lås din founding member-pris
                <ArrowRight size={14} />
              </a>
            </div>

            {/* Right — stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] p-6 text-center"
                >
                  <span
                    className="block text-[1.8rem] font-bold leading-none bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        'linear-gradient(135deg, #60a5fa, #818cf8)',
                    }}
                  >
                    {s.value}
                  </span>
                  <span className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-white/35">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
