'use client'

import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
import { AdminEmptyState, AdminPageHeader, AdminTableFrame } from '@/components/AdminShell'
import { createClient } from '@/lib/supabase/client'

interface AuditEntry { id: string; action: string; target_table: string | null; notes: string | null; created_at: string }

export default function SystemPage() {
  const [database, setDatabase] = useState<'checking' | 'ok' | 'error'>('checking')
  const [environment, setEnvironment] = useState<Record<string, boolean>>({})
  const [integrations, setIntegrations] = useState<Record<string, string>>({})
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retentionConfirm, setRetentionConfirm] = useState(false)
  const [retentionRunning, setRetentionRunning] = useState(false)
  const [retentionResult, setRetentionResult] = useState('')

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      setError('')
      try {
        const response = await fetch('/api/admin/system', { cache: 'no-store' })
        const health = await response.json()
        if (!response.ok) throw new Error()
        if (!active) return
        setDatabase(health.database === 'ok' ? 'ok' : 'error')
        setEnvironment(health.environment ?? {})
        setIntegrations(health.integrations ?? {})
      } catch {
        if (active) {
          setDatabase('error')
          setError('Systemstatus kunne ikke hentes fra serveren.')
        }
      }
      const { data, error: auditError } = await createClient().from('admin_audit_log').select('id, action, target_table, notes, created_at').order('created_at', { ascending: false }).limit(10)
      if (!active) return
      if (auditError) setError((current) => current || 'Auditloggen kunne ikke indlæses.')
      setAuditLog((data as AuditEntry[] | null) ?? [])
      setLoading(false)
    }
    void load()
    return () => { active = false }
  }, [])

  const missing = Object.entries(environment).filter(([, configured]) => !configured)
  const coreReady = database === 'ok' && missing.length === 0

  async function runRetention() {
    if (!retentionConfirm) {
      setRetentionConfirm(true)
      return
    }
    setRetentionRunning(true)
    setRetentionResult('')
    const { data, error: retentionError } = await createClient().rpc('run_data_retention')
    if (retentionError) {
      setError('Datarensningen kunne ikke gennemføres. Ingen manuel gentagelse bør foretages, før fejlen er undersøgt.')
    } else {
      const result = data as { contactMessagesDeleted?: number; terminalBookingsDeleted?: number }
      setRetentionResult(`${result.contactMessagesDeleted ?? 0} kontaktbeskeder og ${result.terminalBookingsDeleted ?? 0} afsluttede bookinger blev slettet.`)
    }
    setRetentionConfirm(false)
    setRetentionRunning(false)
  }

  return (
    <>
      <AdminPageHeader title="Systemstatus" description="Kontrollér database, obligatorisk konfiguration og integrationer fra ét sted før hver release." />
      {error && <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <section className={`mb-6 grid gap-4 rounded-lg border p-5 sm:grid-cols-[1fr_auto] sm:items-center ${coreReady ? 'border-emerald-200 bg-emerald-50' : 'border-gray-950 bg-gray-950 text-white'}`}>
        <div><p className="text-sm font-black">{loading ? 'Kontrollerer release-status' : coreReady ? 'Kerneplatformen er konfigureret' : 'Release kræver handling'}</p><p className={`mt-1 text-xs leading-relaxed ${coreReady ? 'text-emerald-800' : 'text-white/55'}`}>{loading ? 'Status opdateres direkte fra produktionsmiljøet.' : coreReady ? 'Database og alle obligatoriske miljøvariable er tilgængelige.' : `${missing.length} obligatoriske værdier mangler, eller databasen svarer ikke.`}</p></div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${coreReady ? 'bg-emerald-700 text-white' : 'bg-white text-gray-950'}`}>{coreReady ? <Check size={18} aria-hidden="true" /> : <X size={18} aria-hidden="true" />}</span>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-[11px] font-black uppercase text-gray-400">Database</p><div className="mt-4 flex items-center gap-3"><span className={`h-2.5 w-2.5 rounded-full ${database === 'ok' ? 'bg-emerald-500' : database === 'error' ? 'bg-red-500' : 'animate-pulse bg-gray-300'}`} /><p className="text-sm font-black text-gray-950">{database === 'ok' ? 'Forbundet' : database === 'error' ? 'Fejl' : 'Kontrollerer'}</p></div></section>
        <section className="rounded-lg border border-gray-200 bg-white p-5 lg:col-span-2"><p className="text-[11px] font-black uppercase text-gray-400">Integrationer</p><div className="mt-3 divide-y divide-gray-100">{Object.entries(integrations).map(([name, status]) => <div key={name} className="flex items-center justify-between gap-4 py-2.5"><span className="font-mono text-xs text-gray-600">{name}</span><span className="text-xs font-black text-gray-700">{status === 'configured' ? 'Konfigureret' : status === 'disabled' ? 'Deaktiveret' : 'Afventer'}</span></div>)}</div></section>
      </div>

      <section className="mt-6"><div className="mb-3"><p className="text-[11px] font-black uppercase text-gray-400">Konfiguration</p><h2 className="mt-1 text-xl font-black text-gray-950">Obligatoriske miljøvariable</h2></div><AdminTableFrame><div className="grid sm:grid-cols-2 xl:grid-cols-3">{Object.entries(environment).map(([name, configured]) => <div key={name} className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-3 sm:border-r"><span className="truncate font-mono text-[11px] text-gray-600">{name}</span><span className={`shrink-0 text-xs font-black ${configured ? 'text-emerald-700' : 'text-red-700'}`}>{configured ? 'Sat' : 'Mangler'}</span></div>)}</div></AdminTableFrame></section>

      <section className="mt-8 rounded-lg border border-gray-200 bg-white p-5"><div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center"><div><p className="text-[11px] font-black uppercase text-gray-400">Databeskyttelse</p><h2 className="mt-1 text-xl font-black text-gray-950">Kør retentionsrutine</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">Sletter kontaktbeskeder ældre end 12 måneder og afsluttede bookinger ældre end 24 måneder i overensstemmelse med den publicerede baseline.</p>{retentionResult && <p role="status" className="mt-3 text-sm font-bold text-emerald-700">{retentionResult}</p>}</div><button type="button" onClick={() => void runRetention()} onBlur={() => retentionConfirm && setRetentionConfirm(false)} disabled={retentionRunning || database !== 'ok'} className={`rounded-lg px-4 py-3 text-sm font-black disabled:opacity-50 ${retentionConfirm ? 'bg-red-600 text-white' : 'border border-gray-200 text-gray-700'}`}>{retentionRunning ? 'Kører...' : retentionConfirm ? 'Bekræft permanent sletning' : 'Kør datarensning'}</button></div></section>

      <section className="mt-8"><div className="mb-3"><p className="text-[11px] font-black uppercase text-gray-400">Audit</p><h2 className="mt-1 text-xl font-black text-gray-950">Seneste 10 hændelser</h2></div><AdminTableFrame>{loading ? <AdminEmptyState title="Indlæser auditlog..." /> : auditLog.length === 0 ? <AdminEmptyState title="Ingen hændelser registreret" /> : <ul className="divide-y divide-gray-100">{auditLog.map((entry) => <li key={entry.id} className="grid gap-2 px-4 py-4 sm:grid-cols-[1fr_auto] sm:items-center"><div><p className="text-sm font-black text-gray-950">{entry.action}</p>{entry.notes && <p className="mt-1 text-xs leading-relaxed text-gray-500">{entry.notes}</p>}{entry.target_table && <p className="mt-1 font-mono text-[11px] text-gray-400">{entry.target_table}</p>}</div><time className="text-xs tabular-nums text-gray-400">{new Date(entry.created_at).toLocaleString('da-DK')}</time></li>)}</ul>}</AdminTableFrame></section>
    </>
  )
}
