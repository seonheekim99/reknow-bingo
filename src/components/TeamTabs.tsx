import { useState } from 'react'
import type { Strings } from '../i18n'
import type { Team } from '../types'

interface Props {
  teams: Team[]
  activeTeamId: string
  strings: Strings
  onSelect: (id: string) => void
  onAdd: () => void
  onRename: (id: string, name: string) => void
  onRemove: (id: string) => void
}

export function TeamTabs({ teams, activeTeamId, strings, onSelect, onAdd, onRename, onRemove }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')

  const commitRename = (id: string) => {
    const name = draft.trim()
    if (name) onRename(id, name)
    setEditingId(null)
  }

  return (
    <div className="team-tabs" role="tablist" aria-label="Teams">
      {teams.map((team) => {
        const active = team.id === activeTeamId
        return (
          <div key={team.id} className={`team-tab ${active ? 'active' : ''}`}>
            {editingId === team.id ? (
              <input
                className="team-rename"
                value={draft}
                autoFocus
                onChange={(e) => setDraft(e.target.value)}
                onBlur={() => commitRename(team.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitRename(team.id)
                  if (e.key === 'Escape') setEditingId(null)
                }}
                aria-label={`Rename ${team.name}`}
              />
            ) : (
              <button
                type="button"
                role="tab"
                aria-selected={active}
                className="team-tab-name"
                onClick={() => onSelect(team.id)}
                onDoubleClick={() => {
                  setEditingId(team.id)
                  setDraft(team.name)
                }}
                title={strings.renameHint}
              >
                {team.name}
              </button>
            )}
            {teams.length > 1 && (
              <button
                type="button"
                className="team-remove"
                aria-label={strings.removeTeam(team.name)}
                onClick={() => {
                  if (window.confirm(strings.removeConfirm(team.name))) {
                    onRemove(team.id)
                  }
                }}
              >
                ×
              </button>
            )}
          </div>
        )
      })}
      <button type="button" className="team-add" onClick={onAdd}>
        {strings.addTeam}
      </button>
    </div>
  )
}
