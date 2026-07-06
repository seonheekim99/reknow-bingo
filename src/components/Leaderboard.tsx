import type { RankedTeam } from '../types'

interface Props {
  ranking: RankedTeam[]
  activeTeamId: string
  onSelect: (id: string) => void
}

export function Leaderboard({ ranking, activeTeamId, onSelect }: Props) {
  const jointRanks = new Set(
    ranking.filter((r, _, all) => all.filter((o) => o.rank === r.rank).length > 1).map((r) => r.rank),
  )

  return (
    <section className="leaderboard card">
      <h2>Leaderboard</h2>
      <p className="leaderboard-hint">Most bingo lines wins · ties broken by squares completed</p>
      <table>
        <thead>
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">Team</th>
            <th scope="col">Lines</th>
            <th scope="col">Squares</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map(({ team, rank, lines, squares }) => (
            <tr
              key={team.id}
              className={team.id === activeTeamId ? 'active-row' : ''}
              onClick={() => onSelect(team.id)}
            >
              <td className="rank-cell">
                {rank === 1 && lines > 0 ? '🏆 ' : ''}
                {jointRanks.has(rank) ? `T-${rank}` : rank}
              </td>
              <td>{team.name}</td>
              <td>{lines}</td>
              <td>{squares} / 9</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
