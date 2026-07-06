import type { AppState, Team } from '../types'

const STORAGE_KEY = 'reknow-bingo:v1'

export function makeTeam(name: string): Team {
  return {
    id: crypto.randomUUID(),
    name,
    completed: Array(9).fill(false),
    photos: Array(9).fill(null),
  }
}

function defaultState(): AppState {
  const team = makeTeam('Team 1')
  return { teams: [team], activeTeamId: team.id }
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

/** Fill in fields added after the first release (photos) for older saves. */
function normalizeTeam(team: Team): Team {
  const photos =
    Array.isArray(team.photos) && team.photos.length === 9
      ? team.photos.map((p) => (typeof p === 'string' ? p : null))
      : Array<string | null>(9).fill(null)
  return { ...team, photos }
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
    return { teams: parsed.teams.map(normalizeTeam), activeTeamId }
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
