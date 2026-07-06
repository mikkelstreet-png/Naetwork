'use client'

import { useCallback, useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Mail } from 'lucide-react'
import { AdminEmptyState, AdminPageHeader, AdminTableFrame } from '@/components/AdminShell'
import { createClient } from '@/lib/supabase/client'

type MessageStatus = 'new' | 'read'

interface ContactMessage {
  id: string
  name: string | null
  email: string | null
  subject: string | null
  message: string | null
  status: MessageStatus
  created_at: string
}

export default function ContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const loadMessages = useCallback(async () => {
    setLoading(true)
    setError('')
    const { data, error: loadError } = await createClient().from('contact_messages').select('id, name, email, subject, message, status, created_at').order('created_at', { ascending: false })
    if (loadError) setError('Kontaktbeskederne kunne ikke indlæses. Kontrollér systemstatus og prøv igen.')
    setMessages((data as ContactMessage[] | null) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { void loadMessages() }, [loadMessages])

  async function markAsRead(id: string) {
    setActionLoading(id)
    setError('')
    const { error: updateError } = await createClient().from('contact_messages').update({ status: 'read' }).eq('id', id)
    if (updateError) setError('Beskeden kunne ikke markeres som læst.')
    else setMessages((current) => current.map((message) => message.id === id ? { ...message, status: 'read' } : message))
    setActionLoading(null)
  }

  const unread = messages.filter((message) => message.status === 'new').length

  return (
    <>
      <AdminPageHeader title="Kontakt" description="Læs hele henvendelsen, svar via den angivne e-mail og hold styr på, hvad der er behandlet." />
      <div className="mb-4 flex items-center justify-between gap-4"><p className="text-xs font-bold text-gray-400">{loading ? 'Indlæser' : `${messages.length} beskeder`}</p><span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-black text-gray-700">{unread} ulæste</span></div>
      {error && <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <AdminTableFrame>
        {loading ? <AdminEmptyState title="Indlæser beskeder..." /> : messages.length === 0 ? <AdminEmptyState title="Indbakken er tom" body="Nye henvendelser fra kontaktformularen vises her." /> : (
          <div className="divide-y divide-gray-100">
            {messages.map((message) => {
              const expanded = expandedId === message.id
              return (
                <article key={message.id} className={message.status === 'new' ? 'bg-[#fbfbf8]' : 'bg-white'}>
                  <button type="button" onClick={() => setExpandedId(expanded ? null : message.id)} aria-expanded={expanded} className="grid w-full gap-3 px-4 py-4 text-left sm:grid-cols-[minmax(130px,0.7fr)_minmax(180px,1fr)_auto] sm:items-center sm:px-5">
                    <div><div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${message.status === 'new' ? 'bg-gray-950' : 'bg-gray-200'}`} /><p className="text-sm font-black text-gray-950">{message.name || 'Navn mangler'}</p></div><p className="mt-1 pl-4 text-xs text-gray-500">{message.email || 'E-mail mangler'}</p></div>
                    <div><p className="text-sm font-bold text-gray-800">{message.subject || 'Uden emne'}</p><p className="mt-1 truncate text-xs text-gray-500">{message.message || 'Tom besked'}</p></div>
                    <div className="flex items-center justify-between gap-4 sm:justify-end"><time className="text-xs tabular-nums text-gray-400">{new Date(message.created_at).toLocaleString('da-DK')}</time>{expanded ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}</div>
                  </button>
                  {expanded && <div className="border-t border-gray-100 px-4 py-5 sm:px-5"><p className="max-w-3xl whitespace-pre-wrap text-sm leading-7 text-gray-700">{message.message || 'Tom besked'}</p><div className="mt-5 flex flex-wrap gap-2">{message.email && <a href={`mailto:${message.email}`} className="inline-flex items-center gap-2 rounded-lg bg-gray-950 px-4 py-2.5 text-xs font-black text-white"><Mail size={14} aria-hidden="true" />Svar via e-mail</a>}{message.status === 'new' && <button type="button" onClick={() => void markAsRead(message.id)} disabled={actionLoading === message.id} className="rounded-lg border border-gray-200 px-4 py-2.5 text-xs font-black text-gray-700 disabled:opacity-50">{actionLoading === message.id ? 'Gemmer...' : 'Markér som læst'}</button>}</div></div>}
                </article>
              )
            })}
          </div>
        )}
      </AdminTableFrame>
    </>
  )
}
