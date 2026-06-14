import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-[#e5e5e5] bg-white mt-auto">
      <div className="wrap py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <span className="font-semibold text-[15px] text-[#0a0a0a]">Naetwork</span>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[#6b7280]">
          <Link href="/projekt/opret" className="hover:text-[#0a0a0a] transition-colors">Opret projekt</Link>
          <Link href="/specialist" className="hover:text-[#0a0a0a] transition-colors">Bliv specialist</Link>
          <Link href="/ansvarsfraskrivelse" className="hover:text-[#0a0a0a] transition-colors">Ansvarsfraskrivelse</Link>
        </nav>
        <p className="text-[13px] text-[#6b7280]">© 2025 Naetwork</p>
      </div>
    </footer>
  );
}
