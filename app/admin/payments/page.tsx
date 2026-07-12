import Link from 'next/link'
import { ArrowRight, LockKeyhole } from 'lucide-react'
import { AdminPageHeader } from '@/components/AdminShell'
import { STRIPE_REQUIRED_WEBHOOKS, paymentConfiguration } from '@/lib/server/payments'

const REQUIREMENTS = [
  'Handelsoplysninger, operatør og CVR er publiceret',
  'Checkout viser pris, afbestilling og fortrydelsesvilkår før køb',
  'Stripe, kvitteringer, refunds og webhooks er testet end to end',
  'Regnskabs- og skattemodel for professionelle og bidrag er godkendt',
  'Bidrag kan dokumenteres, afstemmes og korrigeres ved refundering',
]

export default function PaymentsPage() {
  const configuration = paymentConfiguration()
  return (
    <>
      <AdminPageHeader title="Betaling" description="Betaling er bevidst deaktiveret. Denne side beskriver den release-gate, der skal være opfyldt, før der kan trækkes penge." />
      <section className="max-w-4xl overflow-hidden rounded-lg border border-gray-950 bg-gray-950 text-white">
        <div className="grid gap-5 p-6 sm:grid-cols-[auto_1fr] sm:p-8">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-gray-950"><LockKeyhole size={19} aria-hidden="true" /></span>
          <div><p className="text-xs font-black uppercase text-white/40">Status</p><h2 className="mt-2 text-2xl font-black">Ingen betalinger kan gennemføres</h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">Bookinganmodninger opretter ingen betaling, reserverer ingen beløb og dokumenterer ikke et bidrag. Aktivering kræver både teknisk og manuel godkendelse.</p></div>
        </div>
        <div className="border-t border-white/10 bg-white p-6 text-gray-950 sm:p-8">
          <p className="text-[11px] font-black uppercase text-gray-400">Release-gate</p>
          <ol className="mt-4 divide-y divide-gray-200 border-t border-gray-200">{REQUIREMENTS.map((requirement, index) => <li key={requirement} className="grid grid-cols-[32px_1fr] gap-3 py-4"><span className="text-xs font-black text-gray-300">0{index + 1}</span><p className="text-sm font-bold leading-relaxed text-gray-700">{requirement}</p></li>)}</ol>
          <div className="mt-6 flex flex-wrap gap-3"><Link href="/admin/legal" className="inline-flex items-center gap-2 rounded-lg bg-gray-950 px-4 py-2.5 text-sm font-black text-white">Juridiske blokkere <ArrowRight size={15} aria-hidden="true" /></Link><Link href="/admin/system" className="inline-flex items-center rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-black text-gray-700">Systemstatus</Link></div>
        </div>
      </section>
      <section className="mt-7 grid gap-6 lg:grid-cols-2">
        <div className="border border-gray-200 bg-white p-6"><p className="editorial-label">Valgt arkitektur</p><h2 className="mt-3 text-xl font-black text-gray-950">Stripe Connect · destination charge</h2><p className="mt-3 text-sm leading-relaxed text-gray-600">Én kandidat betaler for én professionel pr. session. Platformen er ansvarlig for Stripe-gebyrer, refunds og chargebacks; rådgiveren onboardes som connected account. Bidraget bogføres separat og må først tælle efter gennemført, betalt session.</p><dl className="mt-5 border-t border-gray-200">{[['Stripe-nøgler', configuration.configured ? 'Sat' : 'Mangler'], ['Aktivering', configuration.enabled ? 'Aktiv' : 'Låst'], ['Valuta', 'DKK'], ['Checkout', 'Hosted Checkout']].map(([label, value]) => <div key={label} className="flex justify-between gap-4 border-b border-gray-200 py-3 text-sm"><dt className="text-gray-500">{label}</dt><dd className="font-bold text-gray-950">{value}</dd></div>)}</dl></div>
        <div className="border border-gray-200 bg-white p-6"><p className="editorial-label">Webhook-kontrakt</p><h2 className="mt-3 text-xl font-black text-gray-950">{STRIPE_REQUIRED_WEBHOOKS.length} hændelser</h2><div className="mt-5 border-t border-gray-200">{STRIPE_REQUIRED_WEBHOOKS.map((event) => <div key={event} className="border-b border-gray-200 py-2.5 font-mono text-xs text-gray-600">{event}</div>)}</div></div>
      </section>
    </>
  )
}
