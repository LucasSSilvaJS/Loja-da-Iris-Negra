const INK = '#734c9e'
const PAPER = '#f2f2f2'
const BLACK = '#07060a'

function point(cx: number, cy: number, radius: number, angle: number): [number, number] {
  return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius]
}

function scallopPath(cx: number, cy: number, radius: number, bumps: number, amp: number): string {
  const parts: string[] = []
  for (let i = 0; i < bumps; i += 1) {
    const a0 = (i / bumps) * Math.PI * 2 - Math.PI / 2
    const a1 = ((i + 0.5) / bumps) * Math.PI * 2 - Math.PI / 2
    const a2 = ((i + 1) / bumps) * Math.PI * 2 - Math.PI / 2
    const [x0, y0] = point(cx, cy, radius, a0)
    const [x1, y1] = point(cx, cy, radius + amp, a1)
    const [x2, y2] = point(cx, cy, radius, a2)
    if (i === 0) parts.push(`M ${x0.toFixed(2)} ${y0.toFixed(2)}`)
    parts.push(`Q ${x1.toFixed(2)} ${y1.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)}`)
  }
  return `${parts.join(' ')} Z`
}

function starPath(cx: number, cy: number, radius: number): string {
  const parts: string[] = []
  for (let i = 0; i < 10; i += 1) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5
    const dist = i % 2 === 0 ? radius : radius * 0.42
    const [x, y] = point(cx, cy, dist, angle)
    parts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`)
  }
  return `${parts.join(' ')} Z`
}

const RIM = scallopPath(120, 100, 80, 34, 6)
const STARS = [
  starPath(82, 62, 9),
  starPath(120, 54, 9),
  starPath(158, 62, 9),
  starPath(82, 138, 9),
  starPath(120, 146, 9),
  starPath(158, 138, 9),
]

export function SoldStamp() {
  return (
    <svg className="sold-stamp" viewBox="0 0 240 200" role="img" aria-label="esgotado">
      <path d={RIM} fill={INK} />
      <circle cx="120" cy="100" r="74" fill={PAPER} />
      <circle cx="120" cy="100" r="68" fill="none" stroke={INK} strokeWidth="2.4" />
      {STARS.map((d) => (
        <path key={d} d={d} fill={INK} />
      ))}
      <g transform="rotate(-7 120 100)">
        <rect x="22" y="84" width="196" height="32" rx="3" fill={BLACK} />
        <rect x="26" y="88" width="188" height="24" rx="1.5" fill={INK} />
        <text
          x="120"
          y="100"
          textAnchor="middle"
          dominantBaseline="central"
          fill={PAPER}
          fontFamily="Arial Black, Impact, sans-serif"
          fontSize="20"
          fontWeight="900"
          letterSpacing="1.4"
        >
          ESGOTADO
        </text>
      </g>
    </svg>
  )
}
