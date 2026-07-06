import type { Board, RankedTeam, Team } from '../types'

/** All 8 possible bingo lines on a 3×3 board: 3 rows, 3 columns, 2 diagonals. */
export const LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

/** Indices into LINES for every line fully completed on the board. */
export function completedLines(board: Board): number[] {
  return LINES.flatMap((line, i) => (line.every((sq) => board[sq]) ? [i] : []))
}

export function countSquares(board: Board): number {
  return board.filter(Boolean).length
}

/**
 * Rank teams by completed lines (desc), tie-broken by completed squares
 * (desc). Teams equal on both share a rank (competition ranking: 1, 2, 2, 4).
 */
export function rankTeams(teams: Team[]): RankedTeam[] {
  const scored = teams.map((team) => ({
    team,
    lines: completedLines(team.completed).length,
    squares: countSquares(team.completed),
  }))
  scored.sort((a, b) => b.lines - a.lines || b.squares - a.squares)
  const ranked: RankedTeam[] = []
  for (const [i, entry] of scored.entries()) {
    const prev = ranked[i - 1]
    const tied = prev && prev.lines === entry.lines && prev.squares === entry.squares
    ranked.push({ ...entry, rank: tied ? prev.rank : i + 1 })
  }
  return ranked
}
