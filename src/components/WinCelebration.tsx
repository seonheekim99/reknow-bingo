import { useEffect, useState } from 'react'

interface Props {
  /** Increment this to fire a celebration. 0 = never fired. */
  trigger: number
}

const COLORS = ['#f7c325', '#7cb8e8', '#ffffff', '#efdf00']

export function WinCelebration({ trigger }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (trigger === 0) return
    setVisible(true)
    const timer = setTimeout(() => setVisible(false), 1600)
    return () => clearTimeout(timer)
  }, [trigger])

  if (!visible) return null

  return (
    <div className="celebration" aria-hidden>
      <div className="celebration-text">BINGO!</div>
      {Array.from({ length: 24 }, (_, i) => (
        <span
          key={`${trigger}-${i}`}
          className="confetti"
          style={{
            left: `${(i * 41) % 100}%`,
            background: COLORS[i % COLORS.length],
            animationDelay: `${(i % 8) * 0.07}s`,
            transform: `rotate(${(i * 47) % 360}deg)`,
          }}
        />
      ))}
    </div>
  )
}
