'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

export function LegalLayer() {
  const [showCookieNotice, setShowCookieNotice] = useState(false);

  useEffect(() => {
    try {
      const accepted = window.localStorage.getItem("naetwork_cookie_notice_accepted");
      setShowCookieNotice(accepted !== "true");
    } catch {
      setShowCookieNotice(true);
    }
  }, []);

  const acceptCookies = () => {
    try {
      window.localStorage.setItem("naetwork_cookie_notice_accepted", "true");
    } catch {
      // Ignore storage errors. The banner can still be hidden for this session.
    }
    setShowCookieNotice(false);
  };

  return (
    <>
      <section className="bg-[#f7f8fb] px-5 pb-10 text-slate-600">
        <div className="mx-auto max-w-7xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[.22em] text-[#3f8f83]">Trust og ansvar</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-[#071527]">Naetwork hjælper med at gøre opgaver klarere. Aftaler indgås direkte mellem kunde og specialist.</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                Naetwork er ikke automatisk part i aftaler om pris, levering, rettigheder, betaling, tidsplan eller kvalitet mellem kunde og specialist, medmindre dette er aftalt særskilt skriftligt.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm font-black">
              <Link className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 hover:border-slate-400" href="/vilkaar">Vilkår</Link>
              <Link className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 hover:border-slate-400" href="/privatliv">Privatliv</Link>
              <Link className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 hover:border-slate-400" href="/cookies">Cookies</Link>
            </div>
          </div>
        </div>
      </section>

      {showCookieNotice && (
        <div className="fixed inset-x-0 bottom-0 z-[80] px-4 pb-4">
          <div className="mx-auto max-w-4xl rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_24px_90px_rgba(15,23,42,.18)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-black text-[#071527]">Cookies og lokal lagring</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Vi bruger nødvendige funktioner for at få siden til at fungere. Hvis vi senere bruger statistik eller marketingcookies, bør der indhentes samtykke først.
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link className="rounded-full border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 hover:border-slate-400" href="/cookies">Læs mere</Link>
                <button type="button" onClick={acceptCookies} className="rounded-full bg-[#071527] px-5 py-2 text-sm font-black text-white hover:bg-[#0b203a]">Forstået</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
