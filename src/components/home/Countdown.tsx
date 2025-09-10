import { useEffect, useMemo, useState } from 'react'

type Props = { endsAt: number; onEnd?: () => void }

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export default function Countdown({ endsAt, onEnd }: Props) {
  const [mounted, setMounted] = useState(false)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    setMounted(true)
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const { d, h, m, s, finished } = useMemo(() => {
    const diff = Math.max(0, endsAt - now)
    const total = Math.floor(diff / 1000)
    const d = Math.floor(total / 86400)
    const h = Math.floor((total % 86400) / 3600)
    const m = Math.floor((total % 3600) / 60)
    const s = total % 60
    return { d, h, m, s, finished: total <= 0 }
  }, [endsAt, now])

  useEffect(() => {
    if (finished && onEnd) onEnd()
  }, [finished, onEnd])

  // Before hydration, render a stable, static output to avoid text mismatches
  const HH = mounted ? pad(h) : '00'
  const MM = mounted ? pad(m) : '00'
  const SS = mounted ? pad(s) : '00'

  return (
    <div
      className="flex items-center gap-2 text-sm"
      aria-label="Contagem regressiva"
      suppressHydrationWarning
    >
      {mounted && d > 0 && <span>{pad(d)}d</span>}
      <span className="rounded bg-slate-800 px-2 py-1">{HH}</span>:
      <span className="rounded bg-slate-800 px-2 py-1">{MM}</span>:
      <span className="rounded bg-slate-800 px-2 py-1">{SS}</span>
    </div>
  )
}
