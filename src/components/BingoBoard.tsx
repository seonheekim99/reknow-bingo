import { useRef } from 'react'
import { ACTIVITIES } from '../data/activities'
import { fileToThumbnail } from '../logic/photo'
import { LINES, completedLines } from '../logic/scoring'
import type { Board } from '../types'

interface Props {
  board: Board
  photos: (string | null)[]
  onToggle: (index: number) => void
  onPhoto: (index: number, dataUrl: string) => void
  onPhotoRemove: (index: number) => void
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

export function BingoBoard({ board, photos, onToggle, onPhoto, onPhotoRemove }: Props) {
  const lines = completedLines(board)
  const litSquares = new Set(lines.flatMap((i) => LINES[i]))
  const fileInput = useRef<HTMLInputElement>(null)
  const pendingSquare = useRef<number>(-1)

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
            >
              {photos[i] && <img className="square-photo" src={photos[i]} alt="" />}
              <span className="square-kind">{activity.kind === 'light' ? 'Light' : 'Deep'}</span>
              <span className="square-icon" aria-hidden>
                {activity.icon}
              </span>
              <span className="square-name">{activity.name}</span>
              <span className="square-subtitle">{activity.subtitle}</span>
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
                  className="photo-btn"
                  title={photos[i] ? 'Replace verification photo' : 'Add verification photo'}
                  aria-label={`${photos[i] ? 'Replace' : 'Add'} verification photo for ${activity.name}`}
                  onClick={() => pickPhoto(i)}
                >
                  📷
                </button>
                {photos[i] && (
                  <button
                    type="button"
                    className="photo-btn photo-remove"
                    title="Remove photo"
                    aria-label={`Remove photo for ${activity.name}`}
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
    </div>
  )
}
