import { useEffect, useMemo, useState } from 'react'
import { BingoBoard } from './components/BingoBoard'
import { Leaderboard } from './components/Leaderboard'
import { TeamTabs } from './components/TeamTabs'
import { WinCelebration } from './components/WinCelebration'
import { completedLines, rankTeams } from './logic/scoring'
import { loadState, makeTeam, saveState } from './logic/storage'

export default function App() {
  const [state, setState] = useState(loadState)
  const [celebration, setCelebration] = useState(0)

  useEffect(() => {
    saveState(state)
  }, [state])

  const activeTeam = state.teams.find((t) => t.id === state.activeTeamId) ?? state.teams[0]
  const ranking = useMemo(() => rankTeams(state.teams), [state.teams])
  const activeLines = completedLines(activeTeam.completed).length

  const toggleSquare = (index: number) => {
    const before = completedLines(activeTeam.completed).length
    const completed = activeTeam.completed.map((v, i) => (i === index ? !v : v))
    const after = completedLines(completed).length
    setState((s) => ({
      ...s,
      teams: s.teams.map((t) => (t.id === activeTeam.id ? { ...t, completed } : t)),
    }))
    if (after > before) setCelebration((c) => c + 1)
  }

  const setPhoto = (index: number, dataUrl: string | null) => {
    setState((s) => ({
      ...s,
      teams: s.teams.map((t) =>
        t.id === activeTeam.id
          ? { ...t, photos: t.photos.map((p, i) => (i === index ? dataUrl : p)) }
          : t,
      ),
    }))
  }

  const addTeam = () => {
    const names = new Set(state.teams.map((t) => t.name))
    let n = state.teams.length + 1
    while (names.has(`Team ${n}`)) n++
    const team = makeTeam(`Team ${n}`)
    setState((s) => ({ teams: [...s.teams, team], activeTeamId: team.id }))
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden>
            ◆
          </span>
          RENAULT KOREA
        </div>
        <h1>
          <span className="accent">RE : KNOW</span> BINGO
        </h1>
        <p className="tagline">Reverse Mentoring Program · Score Calculator</p>
      </header>

      <main className="layout">
        <section className="board-panel card">
          <TeamTabs
            teams={state.teams}
            activeTeamId={activeTeam.id}
            onSelect={(id) => setState((s) => ({ ...s, activeTeamId: id }))}
            onAdd={addTeam}
            onRename={(id, name) =>
              setState((s) => ({
                ...s,
                teams: s.teams.map((t) => (t.id === id ? { ...t, name } : t)),
              }))
            }
            onRemove={(id) =>
              setState((s) => {
                const teams = s.teams.filter((t) => t.id !== id)
                return {
                  teams,
                  activeTeamId: s.activeTeamId === id ? teams[0].id : s.activeTeamId,
                }
              })
            }
          />
          <BingoBoard
            board={activeTeam.completed}
            photos={activeTeam.photos}
            onToggle={toggleSquare}
            onPhoto={(index, dataUrl) => setPhoto(index, dataUrl)}
            onPhotoRemove={(index) => setPhoto(index, null)}
          />
          <p className="board-status">
            <strong>{activeTeam.name}</strong>: {activeLines} line{activeLines === 1 ? '' : 's'} ·{' '}
            {activeTeam.completed.filter(Boolean).length} / 9 squares
          </p>
          <p className="legend">
            <span className="legend-chip light">Light</span> diamond squares — quick activities ·{' '}
            <span className="legend-chip deep">Deep</span> X squares — deeper collaboration
          </p>
        </section>

        <Leaderboard
          ranking={ranking}
          activeTeamId={activeTeam.id}
          onSelect={(id) => setState((s) => ({ ...s, activeTeamId: id }))}
        />
      </main>

      <WinCelebration trigger={celebration} />
    </div>
  )
}
