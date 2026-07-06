export type ActivityKind = 'light' | 'deep'

export interface Activity {
  name: string
  subtitle: string
  icon: string
  kind: ActivityKind
}

/** Board is always 9 squares, row-major; true = completed. */
export type Board = boolean[]

export interface Team {
  id: string
  name: string
  completed: Board
  /** Verification photo per square as a data-URL thumbnail, or null. */
  photos: (string | null)[]
}

export interface AppState {
  teams: Team[]
  activeTeamId: string
}

export interface RankedTeam {
  team: Team
  rank: number
  lines: number
  squares: number
}
