import { useEffect, useState } from 'react'
import type { Lang } from '../i18n'
import { isSupabaseConfigured } from '../lib/supabase'
import { loadPrefs, savePrefs } from '../logic/prefs'
import {
  deleteTeam as remoteDeleteTeam,
  fetchTeams,
  insertTeam,
  subscribeTeams,
  updateTeam as remoteUpdateTeam,
  type SyncStatus,
} from '../logic/remoteTeams'
import { completedLines } from '../logic/scoring'
import { loadState, makeTeam, saveState } from '../logic/storage'
import type { Team } from '../types'

/**
 * Owns the team list and the active-team/language preferences, transparently
 * backed by Supabase (shared, realtime) when configured, or localStorage
 * (single-device only) otherwise. Consumers don't need to know which.
 */
export function useTeams() {
  const [teams, setTeams] = useState<Team[]>(() => (isSupabaseConfigured ? [] : loadState().teams))
  const [activeTeamId, setActiveTeamId] = useState<string>(() =>
    isSupabaseConfigured ? (loadPrefs().activeTeamId ?? '') : loadState().activeTeamId,
  )
  const [lang, setLang] = useState<Lang>(() => (isSupabaseConfigured ? loadPrefs().lang : loadState().lang))
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(isSupabaseConfigured ? 'connecting' : null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  // Local-only persistence (no Supabase configured).
  useEffect(() => {
    if (isSupabaseConfigured) return
    saveState({ teams, activeTeamId, lang })
  }, [teams, activeTeamId, lang])

  // Per-device preferences, kept local even when Supabase drives team data.
  useEffect(() => {
    if (!isSupabaseConfigured) return
    savePrefs({ lang, activeTeamId })
  }, [lang, activeTeamId])

  // Remote fetch + realtime subscription.
  useEffect(() => {
    if (!isSupabaseConfigured) return
    let cancelled = false

    const applyRemote = (remote: Team[]) => {
      if (cancelled) return
      setTeams(remote)
      setActiveTeamId((current) => (remote.some((t) => t.id === current) ? current : (remote[0]?.id ?? '')))
      setLoading(false)
    }

    async function bootstrap() {
      const remote = await fetchTeams()
      if (remote.length > 0) {
        applyRemote(remote)
        return
      }
      // First device ever to connect: migrate any pre-existing local boards
      // (or seed a fresh one) so the shared table isn't empty.
      const localTeams = loadState().teams
      const seed = localTeams.length > 0 ? localTeams : [makeTeam('Team 1')]
      await Promise.all(seed.map((t) => insertTeam(t)))
      applyRemote(await fetchTeams())
    }

    bootstrap().catch(() => {
      if (!cancelled) {
        setSyncStatus('offline')
        setLoading(false)
      }
    })

    const unsubscribe = subscribeTeams(
      () => {
        fetchTeams()
          .then(applyRemote)
          .catch(() => {})
      },
      (status) => {
        if (!cancelled) setSyncStatus(status)
      },
    )

    return () => {
      cancelled = true
      unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- bootstraps once
  }, [])

  const activeTeam = teams.find((t) => t.id === activeTeamId) ?? teams[0]

  const persist = (id: string, patch: Partial<Team>) => {
    if (!isSupabaseConfigured) return
    void remoteUpdateTeam(id, patch).catch(() => setSyncStatus('offline'))
  }

  /** Returns true if this toggle just completed a new bingo line. */
  const toggleSquare = (index: number): boolean => {
    if (!activeTeam) return false
    const before = completedLines(activeTeam.completed).length
    const completed = activeTeam.completed.map((v, i) => (i === index ? !v : v))
    const after = completedLines(completed).length
    setTeams((prev) => prev.map((t) => (t.id === activeTeam.id ? { ...t, completed } : t)))
    persist(activeTeam.id, { completed })
    return after > before
  }

  const setPhoto = (index: number, dataUrl: string | null) => {
    if (!activeTeam) return
    const photos = activeTeam.photos.map((p, i) => (i === index ? dataUrl : p))
    setTeams((prev) => prev.map((t) => (t.id === activeTeam.id ? { ...t, photos } : t)))
    persist(activeTeam.id, { photos })
  }

  const setMemo = (index: number, memo: string | null) => {
    if (!activeTeam) return
    const memos = activeTeam.memos.map((m, i) => (i === index ? memo : m))
    setTeams((prev) => prev.map((t) => (t.id === activeTeam.id ? { ...t, memos } : t)))
    persist(activeTeam.id, { memos })
  }

  const addTeam = () => {
    const names = new Set(teams.map((t) => t.name))
    let n = teams.length + 1
    while (names.has(`Team ${n}`)) n++
    const team = makeTeam(`Team ${n}`)
    setTeams((prev) => [...prev, team])
    setActiveTeamId(team.id)
    if (isSupabaseConfigured) void insertTeam(team).catch(() => setSyncStatus('offline'))
  }

  const renameTeam = (id: string, name: string) => {
    setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, name } : t)))
    persist(id, { name })
  }

  const removeTeam = (id: string) => {
    const next = teams.filter((t) => t.id !== id)
    setTeams(next)
    if (activeTeamId === id) setActiveTeamId(next[0]?.id ?? '')
    if (isSupabaseConfigured) void remoteDeleteTeam(id).catch(() => setSyncStatus('offline'))
  }

  return {
    teams,
    activeTeam,
    activeTeamId,
    lang,
    syncStatus,
    loading,
    setLang,
    setActiveTeamId,
    toggleSquare,
    setPhoto,
    setMemo,
    addTeam,
    renameTeam,
    removeTeam,
  }
}
