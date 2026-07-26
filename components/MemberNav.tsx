'use client';

import Link from 'next/link';
import { BriefcaseBusiness, CalendarDays, LayoutDashboard, UserRound } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface MemberNavProps {
  isProfessional?: boolean;
}

export function MemberNav({ isProfessional = false }: MemberNavProps) {
  const pathname = usePathname();
  const links = [
    { href: '/dashboard', label: 'Overblik', icon: LayoutDashboard },
    { href: '/profil/bookings', label: 'Bookinger', icon: CalendarDays },
    { href: '/profil', label: 'Konto', icon: UserRound },
    ...(isProfessional ? [{ href: '/profil/professionel', label: 'Min profil', icon: BriefcaseBusiness }] : []),
  ];

  return (
    <nav aria-label="Konto" className="border-y border-gray-200 bg-white">
      <div className="no-scrollbar mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5 sm:px-8">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href === '/profil/bookings' && pathname.startsWith('/profil/bookings/'));
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`relative inline-flex min-h-14 shrink-0 items-center gap-2 px-3 text-sm font-bold transition-colors ${active ? 'text-gray-950' : 'text-gray-400 hover:text-gray-950'}`}
            >
              <Icon size={16} aria-hidden="true" />
              {label}
              {active && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-gray-950" aria-hidden="true" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
