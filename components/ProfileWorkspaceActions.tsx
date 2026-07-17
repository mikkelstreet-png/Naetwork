'use client'

import { Bell, Bookmark } from 'lucide-react'
import { useEffect, useState } from 'react'

interface WorkspaceState {
  savedProfessionalIds?: string[]
  availabilityAlertIds?: string[]
}

let workspaceStateRequest: Promise<WorkspaceState | null> | null = null

function loadWorkspaceState() {
  if (!workspaceStateRequest) {
    workspaceStateRequest = fetch('/api/workspace', { cache: 'no-store' })
      .then(async (response) => response.ok ? response.json() as Promise<WorkspaceState> : null)
      .catch(() => null)
  }
  return workspaceStateRequest
}

interface ProfileWorkspaceActionsProps {
  professionalId: string
  hasAvailability: boolean
  locale: 'da' | 'en'
  compact?: boolean
}

export function ProfileWorkspaceActions({ professionalId, hasAvailability, locale, compact = false }: ProfileWorkspaceActionsProps) {
  const isDa = locale === 'da'
  const [saved, setSaved] = useState(false)
  const [alerted, setAlerted] = useState(false)
  const [loadingAction, setLoadingAction] = useState<'save' | 'alert' | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    void loadWorkspaceState().then((state) => {
      if (!active || !state) return
      setSaved(Boolean(state.savedProfessionalIds?.includes(professionalId)))
      setAlerted(Boolean(state.availabilityAlertIds?.includes(professionalId)))
    })
    return () => { active = false }
  }, [professionalId])

  function goToLogin() {
    const next = `${window.location.pathname}${window.location.search}`
    window.location.assign(`/login?next=${encodeURIComponent(next)}`)
  }

  async function toggle(action: 'save_professional' | 'availability_alert', active: boolean) {
    setLoadingAction(action === 'save_professional' ? 'save' : 'alert')
    setError('')
    try {
      const response = await fetch(active
        ? `/api/workspace?action=${action}&professionalId=${encodeURIComponent(professionalId)}`
        : '/api/workspace', {
        method: active ? 'DELETE' : 'POST',
        headers: active ? undefined : { 'Content-Type': 'application/json' },
        body: active ? undefined : JSON.stringify({ action, professionalId }),
      })
      if (response.status === 401) {
        goToLogin()
        return
      }
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || (isDa ? 'Valget kunne ikke gemmes.' : 'The choice could not be saved.'))
      if (action === 'save_professional') setSaved(!active)
      else setAlerted(!active)
      workspaceStateRequest = null
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : (isDa ? 'Valget kunne ikke gemmes.' : 'The choice could not be saved.'))
    } finally {
      setLoadingAction(null)
    }
  }

  return (
    <div className={`profile-workspace-actions${compact ? ' profile-workspace-actions--compact' : ''}`}>
      <button
        type="button"
        className="profile-workspace-action"
        aria-pressed={saved}
        disabled={loadingAction !== null}
        onClick={() => void toggle('save_professional', saved)}
      >
        <Bookmark size={14} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
        {saved ? (isDa ? 'Gemt til min situation' : 'Saved to my situation') : (isDa ? 'Gem til min situation' : 'Save to my situation')}
      </button>
      {(!hasAvailability || alerted) && (
        <button
          type="button"
          className="profile-workspace-action"
          aria-pressed={alerted}
          disabled={loadingAction !== null}
          onClick={() => void toggle('availability_alert', alerted)}
        >
          <Bell size={14} fill={alerted ? 'currentColor' : 'none'} aria-hidden="true" />
          {alerted ? (isDa ? 'Besked slået til' : 'Alert enabled') : (isDa ? 'Få besked om nye tider' : 'Notify me about new times')}
        </button>
      )}
      {error && <p role="alert">{error}</p>}
    </div>
  )
}
