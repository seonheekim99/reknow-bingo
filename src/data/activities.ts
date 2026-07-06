import type { Activity } from '../types'

/**
 * Fixed RE:KNOW BINGO layout from the program deck (row-major).
 * Light activities sit on the diamond (edge) squares, deep activities
 * on the X (corner + center) squares.
 */
export const ACTIVITIES: Activity[] = [
  { name: 'RE:VOICE', subtitle: 'Policy idea board', icon: '📝', kind: 'deep' },
  { name: 'RE:SIP', subtitle: 'Swap drinks, share tips', icon: '☕', kind: 'light' },
  { name: 'RE:VISION', subtitle: 'Co-create an AI image', icon: '🖥️', kind: 'deep' },
  { name: 'RE:SPACE', subtitle: 'Share workspace setups', icon: '💡', kind: 'light' },
  { name: 'RE:DRIVE', subtitle: 'Test drive & pop-up visit', icon: '🚗', kind: 'deep' },
  { name: 'RE:PLAY', subtitle: 'Trade playlists', icon: '🎧', kind: 'light' },
  { name: 'RE:SYNC', subtitle: 'Collaborate in Notion', icon: '🗂️', kind: 'deep' },
  { name: 'RE:TASTE', subtitle: "Mentor's restaurant pick", icon: '🍽️', kind: 'light' },
  { name: 'RE:PLY', subtitle: 'Anonymous Q&A', icon: '💬', kind: 'deep' },
]
