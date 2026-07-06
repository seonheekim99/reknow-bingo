export type Lang = 'en' | 'ko'

export interface Strings {
  tagline: string
  addTeam: string
  renameHint: string
  removeTeam: (name: string) => string
  removeConfirm: (name: string) => string
  leaderboard: string
  leaderboardHint: string
  rank: string
  team: string
  lines: string
  squares: string
  status: (lines: number, squares: number) => string
  legendLight: string
  legendDeep: string
  photoAdd: string
  photoReplace: string
  photoRemove: string
  memoAdd: string
  memoEdit: string
  memoTitle: (activity: string) => string
  memoPlaceholder: string
  save: string
  cancel: string
  delete: string
}

const en: Strings = {
  tagline: 'Reverse Mentoring Program · Score Calculator',
  addTeam: '+ Add team',
  renameHint: 'Double-click to rename',
  removeTeam: (name) => `Remove ${name}`,
  removeConfirm: (name) => `Remove ${name}? Its board will be lost.`,
  leaderboard: 'Leaderboard',
  leaderboardHint: 'Most bingo lines wins · ties broken by squares completed',
  rank: 'Rank',
  team: 'Team',
  lines: 'Lines',
  squares: 'Squares',
  status: (lines, squares) => `${lines} line${lines === 1 ? '' : 's'} · ${squares} / 9 squares`,
  legendLight: 'diamond squares — quick activities ·',
  legendDeep: 'X squares — deeper collaboration',
  photoAdd: 'Add verification photo',
  photoReplace: 'Replace verification photo',
  photoRemove: 'Remove photo',
  memoAdd: 'Add memo',
  memoEdit: 'Edit memo',
  memoTitle: (activity) => `${activity} — memo`,
  memoPlaceholder: 'What did the team do? When?',
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
}

const ko: Strings = {
  tagline: '리버스 멘토링 프로그램 · 점수 계산기',
  addTeam: '+ 팀 추가',
  renameHint: '더블클릭으로 이름 변경',
  removeTeam: (name) => `${name} 삭제`,
  removeConfirm: (name) => `${name} 팀을 삭제할까요? 보드 기록이 사라집니다.`,
  leaderboard: '리더보드',
  leaderboardHint: '빙고 줄이 가장 많은 팀이 우승 · 동점이면 완료한 칸 수로 순위 결정',
  rank: '순위',
  team: '팀',
  lines: '줄',
  squares: '칸',
  status: (lines, squares) => `${lines}줄 · 9칸 중 ${squares}칸 완료`,
  legendLight: '다이아몬드 칸 — 가벼운 활동 ·',
  legendDeep: 'X 칸 — 깊은 협업 활동',
  photoAdd: '인증 사진 추가',
  photoReplace: '인증 사진 교체',
  photoRemove: '사진 삭제',
  memoAdd: '메모 추가',
  memoEdit: '메모 수정',
  memoTitle: (activity) => `${activity} — 메모`,
  memoPlaceholder: '언제, 무엇을 했나요?',
  save: '저장',
  cancel: '취소',
  delete: '삭제',
}

export const STRINGS: Record<Lang, Strings> = { en, ko }
