import { useEffect, useMemo, useState } from 'react'
import { BingoBoard } from './components/BingoBoard'
import { Leaderboard } from './components/Leaderboard'
import { TeamTabs } from './components/TeamTabs'
import { WinCelebration } from './components/WinCelebration'
import { STRINGS, type Lang } from './i18n'
import { completedLines, rankTeams } from './logic/scoring'
import { loadState, makeTeam, saveState } from './logic/storage'

export default function App() {
  const [state, setState] = useState(loadState)
  const [celebration, setCelebration] = useState(0)

  useEffect(() => {
    saveState(state)
  }, [state])

  const strings = STRINGS[state.lang]
  const activeTeam = state.teams.find((t) => t.id === state.activeTeamId) ?? state.teams[0]
  const ranking = useMemo(() => rankTeams(state.teams), [state.teams])
  const activeLines = completedLines(activeTeam.completed).length

  const setLang = (lang: Lang) => setState((s) => ({ ...s, lang }))

  const updateActiveTeam = (patch: (team: typeof activeTeam) => typeof activeTeam) => {
    setState((s) => ({
      ...s,
      teams: s.teams.map((t) => (t.id === activeTeam.id ? patch(t) : t)),
    }))
  }

  const toggleSquare = (index: number) => {
    const before = completedLines(activeTeam.completed).length
    const completed = activeTeam.completed.map((v, i) => (i === index ? !v : v))
    const after = completedLines(completed).length
    updateActiveTeam((t) => ({ ...t, completed }))
    if (after > before) setCelebration((c) => c + 1)
  }

  const setPhoto = (index: number, dataUrl: string | null) => {
    updateActiveTeam((t) => ({
      ...t,
      photos: t.photos.map((p, i) => (i === index ? dataUrl : p)),
    }))
  }

  const setMemo = (index: number, memo: string | null) => {
    updateActiveTeam((t) => ({
      ...t,
      memos: t.memos.map((m, i) => (i === index ? memo : m)),
    }))
  }

  const addTeam = () => {
    const names = new Set(state.teams.map((t) => t.name))
    let n = state.teams.length + 1
    while (names.has(`Team ${n}`)) n++
    const team = makeTeam(`Team ${n}`)
    setState((s) => ({ ...s, teams: [...s.teams, team], activeTeamId: team.id }))
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <div className="brand">
            <span className="brand-mark" aria-hidden>
              ◆
            </span>
            RENAULT KOREA
          </div>
          <div className="lang-toggle" role="group" aria-label="Language">
            {(['en', 'ko'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                className={state.lang === lang ? 'active' : ''}
                aria-pressed={state.lang === lang}
                onClick={() => setLang(lang)}
              >
                {lang === 'en' ? 'EN' : '한국어'}
              </button>
            ))}
          </div>
        </div>
        <h1>
          <span className="accent">RE : KNOW</span> BINGO
        </h1>
        <p className="tagline">{strings.tagline}</p>
      </header>

      <main className="layout">
        <section className="board-panel card">
          <TeamTabs
            teams={state.teams}
            activeTeamId={activeTeam.id}
            strings={strings}
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
                  ...s,
                  teams,
                  activeTeamId: s.activeTeamId === id ? teams[0].id : s.activeTeamId,
                }
              })
            }
          />
          <BingoBoard
            board={activeTeam.completed}
            photos={activeTeam.photos}
            memos={activeTeam.memos}
            lang={state.lang}
            strings={strings}
            onToggle={toggleSquare}
            onPhoto={(index, dataUrl) => setPhoto(index, dataUrl)}
            onPhotoRemove={(index) => setPhoto(index, null)}
            onMemo={setMemo}
          />
          <p className="board-status">
            <strong>{activeTeam.name}</strong>:{' '}
            {strings.status(activeLines, activeTeam.completed.filter(Boolean).length)}
          </p>
          <p className="legend">
            <span className="legend-chip light">Light</span> {strings.legendLight}{' '}
            <span className="legend-chip deep">Deep</span> {strings.legendDeep}
          </p>
        </section>

        <Leaderboard
          ranking={ranking}
          activeTeamId={activeTeam.id}
          strings={strings}
          onSelect={(id) => setState((s) => ({ ...s, activeTeamId: id }))}
        />
      </main>

      <WinCelebration trigger={celebration} />
    </div>
  )
}
