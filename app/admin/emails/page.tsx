import { AdminPageHeader, AdminTableFrame } from '@/components/AdminShell'
import { EMAIL_CATALOG } from '@/lib/server/emailTemplates'

export default function EmailCatalogPage() {
  const entries = Object.entries(EMAIL_CATALOG)
  return (
    <>
      <AdminPageHeader title="Transaktionelle e-mails" description="Den komplette, versionsstyrede katalogoversigt over triggers, modtagere, timing og brugerens næste handling." />
      <section className="mb-6 grid gap-3 sm:grid-cols-3">
        {[['Templates', entries.length], ['Afsendelse', process.env.RESEND_API_KEY && process.env.EMAIL_FROM ? 'Konfigureret' : 'Afventer'], ['Styring', 'Kode + review']].map(([label, value]) => <div key={label} className="border border-gray-200 bg-white p-5"><p className="editorial-label">{label}</p><p className="mt-3 text-2xl font-black text-gray-950">{value}</p></div>)}
      </section>
      <p className="mb-5 max-w-3xl text-sm leading-relaxed text-gray-600">Emne, preview, trigger og CTA er samlet i én typekontrolleret katalogfil. Ændringer kræver kode-review, så sikkerheds- og betalingsmails ikke kan omskrives uden versionshistorik.</p>
      <AdminTableFrame>
        <table className="w-full min-w-[920px] text-left">
          <thead className="border-b border-gray-200 bg-[#f7f7f4] text-[10px] font-black uppercase text-gray-500"><tr><th className="px-4 py-3">Template</th><th className="px-4 py-3">Modtager</th><th className="px-4 py-3">Trigger</th><th className="px-4 py-3">Timing</th><th className="px-4 py-3">Emne / preview</th><th className="px-4 py-3">CTA</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {entries.map(([key, email]) => <tr key={key} className="align-top"><td className="px-4 py-4 font-mono text-xs text-gray-700">{key}</td><td className="px-4 py-4 text-xs font-bold text-gray-700">{email.recipient}</td><td className="px-4 py-4 font-mono text-xs text-gray-500">{email.trigger}</td><td className="px-4 py-4 text-xs text-gray-600">{email.timing}</td><td className="px-4 py-4"><p className="text-sm font-bold text-gray-950">{email.subjectDa}</p><p className="mt-1 text-xs text-gray-500">{email.previewDa}</p></td><td className="px-4 py-4 text-xs font-bold text-gray-700">{email.ctaDa ?? 'Ingen'}</td></tr>)}
          </tbody>
        </table>
      </AdminTableFrame>
    </>
  )
}
