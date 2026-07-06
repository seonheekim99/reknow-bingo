import type { Activity } from '../types'

/**
 * Fixed RE:KNOW BINGO layout from the program deck (row-major).
 * Light activities sit on the diamond (edge) squares, deep activities
 * on the X (corner + center) squares.
 */
export const ACTIVITIES: Activity[] = [
  {
    name: 'RE:VOICE',
    subtitle: { en: 'Policy idea board', ko: '정책 아이디어 보드' },
    icon: '📝',
    kind: 'deep',
  },
  {
    name: 'RE:SIP',
    subtitle: { en: 'Swap drinks, share tips', ko: '음료 스왑 & 꿀팁 공유' },
    icon: '☕',
    kind: 'light',
  },
  {
    name: 'RE:VISION',
    subtitle: { en: 'Co-create an AI image', ko: 'AI 이미지 공동 제작' },
    icon: '🖥️',
    kind: 'deep',
  },
  {
    name: 'RE:SPACE',
    subtitle: { en: 'Share workspace setups', ko: '작업 공간 셋업 공유' },
    icon: '💡',
    kind: 'light',
  },
  {
    name: 'RE:DRIVE',
    subtitle: { en: 'Test drive & pop-up visit', ko: '시승 & 팝업스토어 방문' },
    icon: '🚗',
    kind: 'deep',
  },
  {
    name: 'RE:PLAY',
    subtitle: { en: 'Trade playlists', ko: '플레이리스트 교환' },
    icon: '🎧',
    kind: 'light',
  },
  {
    name: 'RE:SYNC',
    subtitle: { en: 'Collaborate in Notion', ko: '노션 협업' },
    icon: '🗂️',
    kind: 'deep',
  },
  {
    name: 'RE:TASTE',
    subtitle: { en: "Mentor's restaurant pick", ko: '멘토 추천 맛집 방문' },
    icon: '🍽️',
    kind: 'light',
  },
  {
    name: 'RE:PLY',
    subtitle: { en: 'Anonymous Q&A', ko: '익명 Q&A' },
    icon: '💬',
    kind: 'deep',
  },
]
