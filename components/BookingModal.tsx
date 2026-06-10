"use client";

import { useEffect, useRef, useState } from "react";
import { X, Check, ArrowRight } from "lucide-react";
import { useModal, closeModal, type Intent } from "@/lib/modalStore";
import { site, type Dict } from "@/lib/content";

export function BookingModal({ t }: { t: Dict["modal"] }) {
  const { open, intent: initial, preset } = useModal();
  const [intent, setIntent] = useState<Intent>(initial);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const firstRef = useRef<HTMLInputElement | null>(null);

  const intentList: { key: Intent; label: string }[] = [
    { key: "candidate", label: t.intents.candidate },
    { key: "professional", label: t.intents.professional },
    { key: "company", label: t.intents.company },
  ];

  useEffect(() => {
    if (open) { setIntent(initial); setDone(false); setError(null); }
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeModal();
    window.addEventListener("keydown", onKey);
    const tm = setTimeout(() => firstRef.current?.focus(), 60);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      clearTimeout(tm);
    };
  }, [open]);

  if (!open) return null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    if (!data.name || !String(data.name).trim()) return setError(t.errName);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(data.email || ""))) return setError(t.errEmail);
    setSubmitting(true);
    try {
      if (site.formEndpoint) {
        await fetch(site.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ intent, ...data }),
        });
      } else {
        await new Promise((r) => setTimeout(r, 500));
      }
      setDone(true);
    } catch {
      setError(t.errGeneric);
    } finally {
      setSubmitting(false);
    }
  }

  const c = t[intent];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={c.title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#020408]/80 backdrop-blur-md"
        onClick={closeModal}
      />

      {/* Modal */}
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-[#0a0e1a] border border-white/[0.09] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.6)] sm:rounded-2xl sm:p-8">
        {/* Close */}
        <button
          type="button"
          onClick={closeModal}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-white/40 transition hover:bg-white/[0.07] hover:text-white"
        >
          <X size={18} />
        </button>

        {done ? (
          <div className="py-6 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-500/20 text-blue-400">
              <Check size={26} />
            </span>
            <h3 className="h3 mt-6 text-white">{t.successTitle}</h3>
            <p className="mt-3 text-base text-white/50">{t.successBody}</p>
            <button onClick={closeModal} className="btn-pine mt-7">{t.done}</button>
          </div>
        ) : (
          <>
            {/* Intent switcher */}
            <div className="flex gap-1 rounded-xl bg-white/[0.05] p-1">
              {intentList.map((i) => (
                <button
                  key={i.key}
                  type="button"
                  onClick={() => setIntent(i.key)}
                  className={`flex-1 rounded-lg px-3 py-2 text-[12px] font-medium tracking-wide transition-all ${
                    intent === i.key
                      ? "bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {i.label}
                </button>
              ))}
            </div>

            <h3 className="h3 mt-6 text-white">{c.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-white/45">{c.sub}</p>

            <form onSubmit={onSubmit} className="mt-6 space-y-3">
              <input ref={firstRef} name="name" placeholder={t.fields.name} className="field" autoComplete="name" />
              <input name="email" type="email" placeholder={t.fields.email} className="field" autoComplete="email" />

              {intent === "candidate" && (
                <select name="focus" defaultValue={preset ?? t.focusOptions[0]} className="field appearance-none bg-[#050810]">
                  {(preset && !t.focusOptions.includes(preset) ? [preset, ...t.focusOptions] : t.focusOptions).map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              )}
              {intent === "professional" && (
                <input name="expertise" placeholder={t.fields.expertise} className="field" />
              )}
              {intent === "company" && (
                <input name="company" placeholder={t.fields.company} className="field" autoComplete="organization" />
              )}

              <textarea name="note" rows={3} placeholder={t.fields.note} className="field resize-none" />

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button type="submit" disabled={submitting} className="btn-pine w-full">
                {submitting ? t.submitting : t.submit}
                {!submitting && <ArrowRight size={16} />}
              </button>
              <p className="text-center text-xs text-white/25">{t.disclaimer}</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
