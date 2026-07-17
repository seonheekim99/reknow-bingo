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

By default, all data lives in the browser's localStorage (`reknow-bingo:v1`) — no server
needed, but each device sees its own separate boards.

## Cross-device sync (optional)

To have every phone/browser see and edit the *same* team boards live, connect a free
[Supabase](https://supabase.com) project:

1. Create a Supabase account and project.
2. In the project's **SQL Editor**, run [`supabase/schema.sql`](supabase/schema.sql) once.
3. Copy **Project Settings → API → Project URL** and the **anon public** key (not
   `service_role`).
4. Copy `.env.example` to `.env.local` and fill in both values, then restart `npm run dev`.
5. For deployed builds, set the same two values as environment variables/secrets on the
   host (GitHub Actions secrets for Pages, Vercel project settings for Vercel).

Without those two values set, the app runs exactly as before (local-only). With them set,
a header badge shows **Synced** / **Offline — reconnecting**, and team boards, photos, and
memos sync in real time across every connected device. Access is intentionally open (no
login) — anyone with the URL can edit boards, matching this repo's public visibility.

## Structure

- `src/data/activities.ts` — the fixed 9-activity board layout (EN/KO subtitles)
- `src/i18n.ts` — UI strings for the EN/KO language toggle
- `src/logic/scoring.ts` — pure line-counting and ranking logic
- `src/logic/storage.ts` — local-only persistence (used when Supabase isn't configured)
- `src/logic/prefs.ts` — per-device language/active-tab prefs (used *with* Supabase)
- `src/logic/remoteTeams.ts` — Supabase CRUD + realtime subscription
- `src/hooks/useTeams.ts` — single source of truth for team state; switches between
  local-only and Supabase-backed automatically
- `src/components/` — board, team tabs, leaderboard, win celebration
