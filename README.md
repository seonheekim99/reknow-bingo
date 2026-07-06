# RE:KNOW Bingo — Score Calculator

A score calculator for the **RE:KNOW reverse-mentoring program** (Renault Korea proposal).
Each mentoring team fills a fixed 3×3 bingo board of program activities; the team with the
most completed bingo lines wins. This app tracks multiple teams' boards, counts lines
(3 rows + 3 columns + 2 diagonals, max 8), and ranks teams automatically.

## Rules

- Tap a square to mark it completed for the active team.
- **Score = number of completed bingo lines.**
- Ties are broken by total squares completed; still-tied teams share a rank (shown as `T-n`).
- **Light** activities sit on the diamond (edge) squares, **Deep** activities on the
  X (corner + center) squares, matching the program deck.
- Completed squares accept a **verification photo** (📷 button) — images are downscaled
  to small JPEG thumbnails and stored with the board.
- Completed squares also take a short **memo** (📝 button) recording what the team did
  and when; hover a square to see it.
- The header **EN / 한국어 toggle** switches all UI text (activity names stay RE:*).

## Run

```sh
npm install
npm run dev
```

Requires Node.js (installed locally at `~/.local/node-v22.17.0-darwin-arm64` on this machine —
add its `bin` directory to your `PATH` if `npm` isn't found).

All data is stored in the browser's localStorage (`reknow-bingo:v1`); no server needed.

## Structure

- `src/data/activities.ts` — the fixed 9-activity board layout (EN/KO subtitles)
- `src/i18n.ts` — UI strings for the EN/KO language toggle
- `src/logic/scoring.ts` — pure line-counting and ranking logic
- `src/logic/storage.ts` — localStorage persistence with validation fallback
- `src/components/` — board, team tabs, leaderboard, win celebration
