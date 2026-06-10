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
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={c.title}>
      <div className="absolute inset-0 bg-pine-deep/55 backdrop-blur-sm" onClick={closeModal} />
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-card bg-paper p-6 shadow-2xl sm:rounded-card sm:p-8">
        <button type="button" onClick={closeModal} aria-label="Close"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-[2px] text-muted transition-colors hover:bg-sage hover:text-ink">
          <X size={18} />
        </button>

        {done ? (
          <div className="py-6 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-[2px] bg-pine text-paper"><Check size={26} /></span>
            <h3 className="h3 mt-6">{t.successTitle}</h3>
            <p className="lead mt-3 text-base">{t.successBody}</p>
            <button onClick={closeModal} className="btn-pine mt-7">{t.done}</button>
          </div>
        ) : (
          <>
            <div className="flex gap-1 rounded-[2px] bg-sage p-1">
              {intentList.map((i) => (
                <button key={i.key} type="button" onClick={() => setIntent(i.key)}
                  className={`flex-1 rounded-[2px] px-3 py-2 text-[12px] uppercase tracking-[0.08em] font-medium transition-colors ${intent === i.key ? "bg-pine text-paper" : "text-muted hover:text-ink"}`}>
                  {i.label}
                </button>
              ))}
            </div>

            <h3 className="h3 mt-6">{c.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{c.sub}</p>

            <form onSubmit={onSubmit} className="mt-6 space-y-3">
              <input ref={firstRef} name="name" placeholder={t.fields.name} className="field" autoComplete="name" />
              <input name="email" type="email" placeholder={t.fields.email} className="field" autoComplete="email" />

              {intent === "candidate" && (
                <select name="focus" defaultValue={preset ?? t.focusOptions[0]} className="field appearance-none">
                  {(preset && !t.focusOptions.includes(preset) ? [preset, ...t.focusOptions] : t.focusOptions).map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              )}
              {intent === "professional" && <input name="expertise" placeholder={t.fields.expertise} className="field" />}
              {intent === "company" && <input name="company" placeholder={t.fields.company} className="field" autoComplete="organization" />}

              <textarea name="note" rows={3} placeholder={t.fields.note} className="field resize-none" />

              {error && <p className="text-sm text-red-700">{error}</p>}

              <button type="submit" disabled={submitting} className="btn-pine w-full">
                {submitting ? t.submitting : t.submit}
                {!submitting && <ArrowRight size={16} />}
              </button>
              <p className="text-center text-xs text-muted">{t.disclaimer}</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
