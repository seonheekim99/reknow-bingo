import { useState } from 'react'
import { BingoBoard } from './components/BingoBoard'
import { Leaderboard } from './components/Leaderboard'
import { TeamTabs } from './components/TeamTabs'
import { WinCelebration } from './components/WinCelebration'
import { useTeams } from './hooks/useTeams'
import { STRINGS } from './i18n'
import { completedLines, rankTeams } from './logic/scoring'

export default function App() {
  const {
    teams,
    activeTeam,
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
  } = useTeams()
  const [celebration, setCelebration] = useState(0)

  const strings = STRINGS[lang]

  if (loading || !activeTeam) {
    return (
      <div className="app">
        <p className="loading-state">Loading…</p>
      </div>
    )
  }

  const ranking = rankTeams(teams)
  const activeLines = completedLines(activeTeam.completed).length

  const handleToggle = (index: number) => {
    if (toggleSquare(index)) setCelebration((c) => c + 1)
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
          <div className="header-controls">
            {syncStatus && (
              <span className={`sync-badge ${syncStatus}`}>
                <span className="sync-dot" aria-hidden />
                {syncStatus === 'synced' && strings.syncSynced}
                {syncStatus === 'connecting' && strings.syncConnecting}
                {syncStatus === 'offline' && strings.syncOffline}
              </span>
            )}
            <div className="lang-toggle" role="group" aria-label="Language">
              {(['en', 'ko'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  className={lang === l ? 'active' : ''}
                  aria-pressed={lang === l}
                  onClick={() => setLang(l)}
                >
                  {l === 'en' ? 'EN' : '한국어'}
                </button>
              ))}
            </div>
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
            teams={teams}
            activeTeamId={activeTeam.id}
            strings={strings}
            onSelect={setActiveTeamId}
            onAdd={addTeam}
            onRename={renameTeam}
            onRemove={removeTeam}
          />
          <BingoBoard
            board={activeTeam.completed}
            photos={activeTeam.photos}
            memos={activeTeam.memos}
            lang={lang}
            strings={strings}
            onToggle={handleToggle}
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

        <Leaderboard ranking={ranking} activeTeamId={activeTeam.id} strings={strings} onSelect={setActiveTeamId} />
      </main>

      <WinCelebration trigger={celebration} />
    </div>
  )
}
