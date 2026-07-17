import type { Lang } from '../i18n'

/**
 * Per-device viewing preferences (which team tab is open, UI language).
 * Used only when Supabase is configured — team data itself lives remotely,
 * so it's kept separate from the local-only AppState in storage.ts.
 */
export interface Prefs {
  lang: Lang
  activeTeamId: string | null
}

const PREFS_KEY = 'reknow-bingo:prefs:v1'

export function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    if (!raw) return { lang: 'en', activeTeamId: null }
    const parsed = JSON.parse(raw) as Partial<Prefs>
    return {
      lang: parsed.lang === 'ko' ? 'ko' : 'en',
      activeTeamId: typeof parsed.activeTeamId === 'string' ? parsed.activeTeamId : null,
    }
  } catch {
    return { lang: 'en', activeTeamId: null }
  }
}

export function savePrefs(prefs: Prefs): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
  } catch {
    // Storage full or unavailable — the app keeps working in memory.
  }
}
