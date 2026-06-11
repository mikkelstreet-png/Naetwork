'use client'

import { useState, useRef } from 'react'
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { PHASE } from '@/lib/phase'

function saveEmail(email: string) {
  try {
    const key = 'naetwork-waitlist'
    const existing: string[] = JSON.parse(localStorage.getItem(key) || '[]')
    if (!existing.includes(email)) {
      localStorage.setItem(key, JSON.stringify([...existing, email]))
    }
  } catch {}
}

export function EmailCapture() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const headline =
    PHASE === 'charity'
      ? 'Vær med fra starten — gratis adgang de første 6 måneder'
      : 'Hold dig opdateret'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Indtast en gyldig email-adresse.')
      inputRef.current?.focus()
      return
    }

    setState('loading')
    // Mock: save locally and simulate a short delay
    await new Promise((r) => setTimeout(r, 700))
    saveEmail(email)
    setState('success')
  }

  return (
    <section className="section bg-[#050810]">
      <div className="wrap">
        <div
          className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl border border-blue-500/25 p-10 text-center lg:p-14"
          style={{
            background:
              'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(99,102,241,0.05) 100%)',
          }}
        >
          {/* Glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-48 w-96 blur-3xl opacity-30"
            style={{
              background:
                'radial-gradient(ellipse, rgba(59,130,246,0.6) 0%, transparent 70%)',
            }}
          />

          <div className="relative z-10">
            {state === 'success' ? (
              <div className="py-4">
                <CheckCircle2
                  size={44}
                  className="mx-auto mb-4 text-green-400"
                />
                <h2 className="text-[1.5rem] font-bold text-white">
                  Du er på listen 🎉
                </h2>
                <p className="mt-2 text-[14px] text-white/50">
                  Vi vender tilbage snart.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-[1.6rem] font-bold leading-tight text-white lg:text-[2rem]">
                  {headline}
                </h2>
                <p className="mt-3 text-[14px] leading-relaxed text-white/45">
                  Indtast din email og vi holder dig opdateret.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mt-7 flex flex-col gap-3 sm:flex-row"
                  noValidate
                >
                  <input
                    ref={inputRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="din@email.dk"
                    autoComplete="email"
                    className="field flex-1"
                    disabled={state === 'loading'}
                  />
                  <button
                    type="submit"
                    disabled={state === 'loading'}
                    className="btn-pine flex shrink-0 items-center gap-2 disabled:opacity-60"
                  >
                    {state === 'loading' ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Sender…
                      </>
                    ) : (
                      <>
                        Lås min pris
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </form>

                {errorMsg && (
                  <p className="mt-2 text-[12px] text-red-400">{errorMsg}</p>
                )}

                <p className="mt-4 text-[11px] text-white/25">
                  Ingen spam · Opsig når som helst · 0 kr at starte
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
