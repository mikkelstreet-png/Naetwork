import { ArrowRight, CheckCircle2, Lock, Unlock } from 'lucide-react'

const alwaysFree = [
  'Personlig profil og søgning',
  'Book session med professionelle',
  'Notifikationer på nye matches',
]

const premiumFeatures = [
  'AI-matching og prioritering',
  'Ubegrænset sessions pr. måned',
  'Team-seats og API-adgang',
]

export function CommercialReadiness() {
  return (
    <section className="section bg-[#050810]">
      <div className="wrap">
        {/* Dot separator */}
        <div className="mx-auto mb-14 h-px max-w-[480px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow mb-4 block">Bygget til at vare</span>
          <h2 className="h2 text-white">
            Et bidrag til branchen —{' '}
            <span className="gradient-text">med en plan</span>
          </h2>
          <p className="lead mt-5 text-white/50">
            Naetwork starter som et bidrag til branchen. Efter founding-perioden
            tilbyder vi fleksible planer der passer alle — fra den individuelle
            kandidat til den store virksomhed.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Always free */}
          <div className="rounded-2xl border border-green-500/20 bg-green-500/[0.04] p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-green-500/15">
                <Unlock size={16} className="text-green-400" />
              </div>
              <p className="font-semibold text-white">Altid gratis</p>
            </div>
            <ul className="space-y-3">
              {alwaysFree.map((f) => (
                <li key={f} className="flex items-start gap-3 text-[14px] text-white/60">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-green-400" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Premium */}
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.04] p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-500/15">
                <Lock size={16} className="text-blue-400" />
              </div>
              <p className="font-semibold text-white">Premium — efter founding-perioden</p>
            </div>
            <ul className="space-y-3">
              {premiumFeatures.map((f) => (
                <li key={f} className="flex items-start gap-3 text-[14px] text-white/60">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-blue-400" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/pricing"
            className="link-arrow inline-flex items-center gap-2 text-[14px]"
          >
            Se alle planer og priser
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  )
}
