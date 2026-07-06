import type { Lang } from '../i18n'
import type { AppState, Team } from '../types'

const STORAGE_KEY = 'reknow-bingo:v1'

export function makeTeam(name: string): Team {
  return {
    id: crypto.randomUUID(),
    name,
    completed: Array(9).fill(false),
    photos: Array(9).fill(null),
    memos: Array(9).fill(null),
  }
}

function defaultState(): AppState {
  const team = makeTeam('Team 1')
  return { teams: [team], activeTeamId: team.id, lang: 'en' }
}

function isValidTeam(t: unknown): t is Team {
  if (typeof t !== 'object' || t === null) return false
  const team = t as Team
  return (
    typeof team.id === 'string' &&
    typeof team.name === 'string' &&
    Array.isArray(team.completed) &&
    team.completed.length === 9 &&
    team.completed.every((v) => typeof v === 'boolean')
  )
}

/** A 9-slot array of nullable strings, coerced from possibly-older saves. */
function normalizeSlots(value: unknown): (string | null)[] {
  return Array.isArray(value) && value.length === 9
    ? value.map((v) => (typeof v === 'string' ? v : null))
    : Array<string | null>(9).fill(null)
}

/** Fill in fields added after the first release (photos, memos) for older saves. */
function normalizeTeam(team: Team): Team {
  return { ...team, photos: normalizeSlots(team.photos), memos: normalizeSlots(team.memos) }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as AppState
    if (!Array.isArray(parsed.teams) || parsed.teams.length === 0) return defaultState()
    if (!parsed.teams.every(isValidTeam)) return defaultState()
    const activeTeamId = parsed.teams.some((t) => t.id === parsed.activeTeamId)
      ? parsed.activeTeamId
      : parsed.teams[0].id
    const lang: Lang = parsed.lang === 'ko' ? 'ko' : 'en'
    return { teams: parsed.teams.map(normalizeTeam), activeTeamId, lang }
  } catch {
    return defaultState()
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage full or unavailable — the app keeps working in memory.
  }
}
