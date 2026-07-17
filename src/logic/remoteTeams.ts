import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Team } from '../types'

export type SyncStatus = 'connecting' | 'synced' | 'offline'

interface TeamRow {
  id: string
  name: string
  completed: boolean[]
  photos: (string | null)[]
  memos: (string | null)[]
  created_at: string
}

function rowToTeam(row: TeamRow): Team {
  return { id: row.id, name: row.name, completed: row.completed, photos: row.photos, memos: row.memos }
}

/** Guaranteed non-null inside every exported function — callers only run these when configured. */
function client() {
  if (!supabase) throw new Error('Supabase is not configured')
  return supabase
}

export async function fetchTeams(): Promise<Team[]> {
  const { data, error } = await client().from('teams').select('*').order('created_at', { ascending: true })
  if (error) throw error
  return (data as TeamRow[]).map(rowToTeam)
}

export async function insertTeam(team: Team): Promise<void> {
  const { error } = await client().from('teams').insert({
    id: team.id,
    name: team.name,
    completed: team.completed,
    photos: team.photos,
    memos: team.memos,
  })
  if (error) throw error
}

export async function updateTeam(id: string, patch: Partial<Team>): Promise<void> {
  const { error } = await client().from('teams').update(patch).eq('id', id)
  if (error) throw error
}

export async function deleteTeam(id: string): Promise<void> {
  const { error } = await client().from('teams').delete().eq('id', id)
  if (error) throw error
}

/**
 * Subscribes to every insert/update/delete on the teams table and reports
 * connection health via `onStatus`. Returns an unsubscribe function.
 */
export function subscribeTeams(onChange: () => void, onStatus: (status: SyncStatus) => void): () => void {
  let channel: RealtimeChannel | null = client()
    .channel('teams-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, onChange)
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') onStatus('synced')
      else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') onStatus('offline')
    })

  return () => {
    if (channel) {
      void client().removeChannel(channel)
      channel = null
    }
  }
}
