import Link from 'next/link';

export default function PaymentsPage() {
  return (
    <div className="flex h-[calc(100svh-6rem)] overflow-hidden bg-gray-50 md:h-screen">
      <aside className="hidden w-60 flex-shrink-0 flex-col bg-gray-900 md:flex">
        <div className="px-6 py-5 border-b border-gray-800">
          <Link href="/admin" className="text-white font-bold text-lg tracking-tight">Admin</Link>
          <Link href="/" className="block text-gray-400 text-xs mt-0.5 hover:text-white transition-colors">Naetwork</Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {[
            { label: 'Oversigt', href: '/admin' },
            { label: 'Brugere', href: '/admin/users' },
            { label: 'Professionelle', href: '/admin/professionals' },
            { label: 'Bookinger', href: '/admin/bookings' },
            { label: 'Kontaktbeskeder', href: '/admin/contact' },
            { label: 'Betalinger', href: '/admin/payments', badge: 'Gated' },
            { label: 'Donation / juridisk', href: '/admin/legal' },
            { label: 'System', href: '/admin/system' },
          ].map((item) => (
            <Link key={item.href} href={item.href} className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${item.href === '/admin/payments' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              <span>{item.label}</span>
              {item.badge && <span className="text-xs bg-yellow-500 text-black px-1.5 py-0.5 rounded font-medium">{item.badge}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-gray-900 font-semibold text-base">Betalinger</h1>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm px-3 py-1.5 rounded-full mb-6">
              Under juridisk afklaring
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Betalinger</h2>
            <p className="text-gray-500 mb-6">
              Betalingsmodulet er ikke aktiveret endnu. Aktivering afventer juridisk,
              regnskabsm\u00e6ssig og skattem\u00e6ssig afklaring samt godkendelse fra betalingsudbyder.
              Se status under Donation / juridisk.
            </p>
            <Link href="/admin/legal" className="text-indigo-600 hover:underline text-sm">
              Se juridiske blokkere
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
