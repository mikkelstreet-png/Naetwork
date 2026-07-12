'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Activity,
  BriefcaseBusiness,
  CalendarDays,
  CreditCard,
  ExternalLink,
  Inbox,
  Mail,
  MessageSquareMore,
  LayoutDashboard,
  Scale,
  Users,
} from 'lucide-react'

const ADMIN_LINKS = [
  { href: '/admin', label: 'Oversigt', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Brugere', icon: Users },
  { href: '/admin/professionals', label: 'Professionelle', icon: BriefcaseBusiness },
  { href: '/admin/bookings', label: 'Bookinger', icon: CalendarDays },
  { href: '/admin/contact', label: 'Kontakt', icon: Inbox },
  { href: '/admin/emails', label: 'E-mails', icon: Mail },
  { href: '/admin/reviews', label: 'Anmeldelser', icon: MessageSquareMore },
  { href: '/admin/payments', label: 'Betaling', icon: CreditCard, status: 'Låst' },
  { href: '/admin/legal', label: 'Juridisk', icon: Scale },
  { href: '/admin/system', label: 'System', icon: Activity },
] as const

function isCurrent(pathname: string, href: string) {
  return href === '/admin' ? pathname === href : pathname.startsWith(href)
}

export function AdminShell({ children, userEmail }: { children: React.ReactNode; userEmail: string }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#f7f7f4] md:grid md:grid-cols-[248px_minmax(0,1fr)]">
      <aside className="hidden h-screen flex-col border-r border-white/10 bg-gray-950 text-white md:sticky md:top-0 md:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[11px] font-black text-gray-950">N</span>
            <span>
              <span className="block text-sm font-black">Naetwork</span>
              <span className="mt-0.5 block text-[11px] font-semibold text-white/40">Administration</span>
            </span>
          </Link>
        </div>

        <nav aria-label="Administration" className="flex-1 px-3 py-4">
          <div className="space-y-1">
            {ADMIN_LINKS.map(({ href, label, icon: Icon, ...item }) => {
              const active = isCurrent(pathname, href)
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-bold transition-colors ${active ? 'bg-white text-gray-950' : 'text-white/55 hover:bg-white/10 hover:text-white'}`}
                >
                  <Icon size={16} aria-hidden="true" />
                  <span className="flex-1">{label}</span>
                  {'status' in item && <span className={`text-[10px] font-black uppercase ${active ? 'text-gray-400' : 'text-white/30'}`}>{item.status}</span>}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="border-t border-white/10 p-4">
          <p className="truncate text-xs font-semibold text-white/40">{userEmail}</p>
          <Link href="/" className="mt-3 inline-flex items-center gap-2 text-xs font-black text-white/70 transition-colors hover:text-white">
            Åbn hjemmeside <ExternalLink size={13} aria-hidden="true" />
          </Link>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-xl md:hidden">
          <div className="flex h-14 items-center justify-between px-4">
            <Link href="/admin" className="flex items-center gap-2 text-sm font-black text-gray-950">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-950 text-[10px] text-white">N</span>
              Admin
            </Link>
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-black text-gray-500">Site <ExternalLink size={13} aria-hidden="true" /></Link>
          </div>
          <nav aria-label="Administration" className="no-scrollbar flex overflow-x-auto border-t border-gray-100 px-2">
            {ADMIN_LINKS.map(({ href, label, icon: Icon }) => {
              const active = isCurrent(pathname, href)
              return (
                <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={`relative inline-flex min-h-12 shrink-0 items-center gap-2 px-3 text-xs font-bold ${active ? 'text-gray-950' : 'text-gray-400'}`}>
                  <Icon size={14} aria-hidden="true" />{label}
                  {active && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-gray-950" aria-hidden="true" />}
                </Link>
              )
            })}
          </nav>
        </header>
        <main className="mx-auto w-full max-w-[90rem] px-4 py-6 sm:px-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  )
}

export function AdminPageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description: string; actions?: React.ReactNode }) {
  return (
    <header className="mb-7 grid gap-5 border-b border-gray-200 pb-6 md:grid-cols-[1fr_auto] md:items-end">
      <div>
        <p className="text-[11px] font-black uppercase text-gray-400">{eyebrow ?? 'Administration'}</p>
        <h1 className="mt-2 text-3xl font-black leading-none text-gray-950 sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600">{description}</p>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}

export function AdminTableFrame({ children }: { children: React.ReactNode }) {
  return <div className="overflow-hidden rounded-lg border border-gray-200 bg-white"><div className="overflow-x-auto">{children}</div></div>
}

export function AdminEmptyState({ title, body }: { title: string; body?: string }) {
  return (
    <div className="px-5 py-12 text-center">
      <p className="text-base font-black text-gray-950">{title}</p>
      {body && <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500">{body}</p>}
    </div>
  )
}
