'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ITEMS = [
  ['Oversigt', '/admin'],
  ['Brugere', '/admin/users'],
  ['Professionelle', '/admin/professionals'],
  ['Bookinger', '/admin/bookings'],
  ['Kontakt', '/admin/contact'],
  ['Betaling', '/admin/payments'],
  ['Juridisk', '/admin/legal'],
  ['System', '/admin/system'],
] as const

export function AdminMobileNav() {
  const pathname = usePathname()

  return (
    <div className="border-b border-gray-800 bg-gray-950 text-white md:hidden">
      <div className="flex h-12 items-center justify-between px-4">
        <Link href="/admin" className="text-sm font-black">Naetwork Admin</Link>
        <Link href="/" className="text-xs font-bold text-white/55">Se site</Link>
      </div>
      <nav aria-label="Admin navigation" className="no-scrollbar flex overflow-x-auto border-t border-white/10 px-2">
        {ITEMS.map(([label, href]) => {
          const active = pathname === href
          return (
            <Link key={href} href={href} className={`relative shrink-0 px-3 py-3 text-xs font-bold ${active ? 'text-white' : 'text-white/45'}`}>
              {label}
              {active && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-white" aria-hidden="true" />}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
