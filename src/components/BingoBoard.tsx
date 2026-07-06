import { useRef, useState } from 'react'
import { ACTIVITIES } from '../data/activities'
import type { Lang, Strings } from '../i18n'
import { fileToThumbnail } from '../logic/photo'
import { LINES, completedLines } from '../logic/scoring'
import type { Board } from '../types'

interface Props {
  board: Board
  photos: (string | null)[]
  memos: (string | null)[]
  lang: Lang
  strings: Strings
  onToggle: (index: number) => void
  onPhoto: (index: number, dataUrl: string) => void
  onPhotoRemove: (index: number) => void
  onMemo: (index: number, memo: string | null) => void
}

/**
 * Stroke endpoints for each of the 8 lines, in a 300×300 viewBox
 * (squares are 100×100, centers at 50/150/250).
 */
const STROKES: { x1: number; y1: number; x2: number; y2: number }[] = [
  { x1: 14, y1: 50, x2: 286, y2: 50 },
  { x1: 14, y1: 150, x2: 286, y2: 150 },
  { x1: 14, y1: 250, x2: 286, y2: 250 },
  { x1: 50, y1: 14, x2: 50, y2: 286 },
  { x1: 150, y1: 14, x2: 150, y2: 286 },
  { x1: 250, y1: 14, x2: 250, y2: 286 },
  { x1: 22, y1: 22, x2: 278, y2: 278 },
  { x1: 278, y1: 22, x2: 22, y2: 278 },
]

export function BingoBoard({
  board,
  photos,
  memos,
  lang,
  strings,
  onToggle,
  onPhoto,
  onPhotoRemove,
  onMemo,
}: Props) {
  const lines = completedLines(board)
  const litSquares = new Set(lines.flatMap((i) => LINES[i]))
  const fileInput = useRef<HTMLInputElement>(null)
  const pendingSquare = useRef<number>(-1)
  const [memoIndex, setMemoIndex] = useState<number | null>(null)
  const [memoDraft, setMemoDraft] = useState('')

  const pickPhoto = (index: number) => {
    pendingSquare.current = index
    fileInput.current?.click()
  }

  const handleFile = async (file: File | undefined) => {
    const index = pendingSquare.current
    pendingSquare.current = -1
    if (!file || index < 0) return
    try {
      onPhoto(index, await fileToThumbnail(file))
    } catch {
      window.alert('Could not read that image — please try a JPEG or PNG file.')
    }
  }

  const openMemo = (index: number) => {
    setMemoDraft(memos[index] ?? '')
    setMemoIndex(index)
  }

  const saveMemo = () => {
    if (memoIndex === null) return
    const text = memoDraft.trim()
    onMemo(memoIndex, text === '' ? null : text)
    setMemoIndex(null)
  }

  return (
    <div className="board-wrap">
      <div className="board-grid">
        {ACTIVITIES.map((activity, i) => (
          <div key={activity.name} className="cell">
            <button
              type="button"
              className={[
                'square',
                activity.kind,
                board[i] ? 'done' : '',
                litSquares.has(i) ? 'in-line' : '',
                photos[i] ? 'has-photo' : '',
              ].join(' ')}
              onClick={() => onToggle(i)}
              aria-pressed={board[i]}
              title={memos[i] ?? undefined}
            >
              {photos[i] && <img className="square-photo" src={photos[i]} alt="" />}
              <span className="square-kind">{activity.kind === 'light' ? 'Light' : 'Deep'}</span>
              <span className="square-icon" aria-hidden>
                {activity.icon}
              </span>
              <span className="square-name">{activity.name}</span>
              <span className="square-subtitle">{activity.subtitle[lang]}</span>
              {board[i] && (
                <span className="square-check" aria-hidden>
                  ✓
                </span>
              )}
            </button>
            {board[i] && (
              <div className="photo-controls">
                <button
                  type="button"
                  className={`photo-btn ${memos[i] ? 'has-memo' : ''}`}
                  title={memos[i] ? strings.memoEdit : strings.memoAdd}
                  aria-label={`${memos[i] ? strings.memoEdit : strings.memoAdd} — ${activity.name}`}
                  onClick={() => openMemo(i)}
                >
                  📝
                </button>
                <button
                  type="button"
                  className="photo-btn"
                  title={photos[i] ? strings.photoReplace : strings.photoAdd}
                  aria-label={`${photos[i] ? strings.photoReplace : strings.photoAdd} — ${activity.name}`}
                  onClick={() => pickPhoto(i)}
                >
                  📷
                </button>
                {photos[i] && (
                  <button
                    type="button"
                    className="photo-btn photo-remove"
                    title={strings.photoRemove}
                    aria-label={`${strings.photoRemove} — ${activity.name}`}
                    onClick={() => onPhotoRemove(i)}
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <svg className="board-strokes" viewBox="0 0 300 300" aria-hidden>
        {lines.map((lineIndex) => {
          const s = STROKES[lineIndex]
          return (
            <line
              key={lineIndex}
              className="stroke"
              x1={s.x1}
              y1={s.y1}
              x2={s.x2}
              y2={s.y2}
            />
          )
        })}
      </svg>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        className="photo-input"
        aria-hidden
        tabIndex={-1}
        onChange={(e) => {
          void handleFile(e.target.files?.[0])
          e.target.value = ''
        }}
      />
      {memoIndex !== null && (
        <div className="memo-overlay" onClick={() => setMemoIndex(null)}>
          <div
            className="memo-modal card"
            role="dialog"
            aria-label={strings.memoTitle(ACTIVITIES[memoIndex].name)}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{strings.memoTitle(ACTIVITIES[memoIndex].name)}</h3>
            <textarea
              className="memo-text"
              value={memoDraft}
              placeholder={strings.memoPlaceholder}
              autoFocus
              rows={4}
              maxLength={500}
              onChange={(e) => setMemoDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setMemoIndex(null)
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) saveMemo()
              }}
            />
            <div className="memo-actions">
              {memos[memoIndex] && (
                <button
                  type="button"
                  className="memo-btn memo-delete"
                  onClick={() => {
                    onMemo(memoIndex, null)
                    setMemoIndex(null)
                  }}
                >
                  {strings.delete}
                </button>
              )}
              <button type="button" className="memo-btn" onClick={() => setMemoIndex(null)}>
                {strings.cancel}
              </button>
              <button type="button" className="memo-btn memo-save" onClick={saveMemo}>
                {strings.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
