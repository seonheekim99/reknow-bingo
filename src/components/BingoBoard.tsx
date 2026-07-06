import { ACTIVITIES } from '../data/activities'
import { LINES, completedLines } from '../logic/scoring'
import type { Board } from '../types'

interface Props {
  board: Board
  onToggle: (index: number) => void
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

export function BingoBoard({ board, onToggle }: Props) {
  const lines = completedLines(board)
  const litSquares = new Set(lines.flatMap((i) => LINES[i]))

  return (
    <div className="board-wrap">
      <div className="board-grid">
        {ACTIVITIES.map((activity, i) => (
          <button
            key={activity.name}
            type="button"
            className={[
              'square',
              activity.kind,
              board[i] ? 'done' : '',
              litSquares.has(i) ? 'in-line' : '',
            ].join(' ')}
            onClick={() => onToggle(i)}
            aria-pressed={board[i]}
          >
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
    </div>
  )
}
