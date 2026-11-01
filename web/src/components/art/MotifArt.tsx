import type { Motif } from '../../types/domain'

type MotifArtProps = {
  motif: Motif | 'stage'
  className?: string
}

export function MotifArt({ motif, className = '' }: MotifArtProps) {
  return (
    <div className={`art art-${motif} ${className}`.trim()} aria-hidden="true">
      {motif === 'stage' ? <StageArt /> : <Glyph motif={motif} />}
    </div>
  )
}

function Glyph({ motif }: { motif: Motif }) {
  return (
    <svg viewBox="0 0 160 160" role="img">
      <rect width="160" height="160" fill="#100814" />
      <circle cx="118" cy="36" r="18" fill="#f7f2ff" opacity="0.85" />
      <circle cx="80" cy="86" r="22" fill="none" stroke="#734c9e" strokeWidth="3" />
      {motif === 'raven' && <Raven />}
      {motif === 'iris' && <Iris x={80} y={92} scale={1} />}
      {motif === 'moon' && <MoonWord />}
      {motif === 'sticker' && <Iris x={80} y={90} scale={0.72} />}
      {motif === 'cap' && <Cap />}
      {motif === 'corset' && <Corset />}
      {motif === 'jacket' && <Jacket />}
      {motif === 'top' && <Top />}
    </svg>
  )
}

function StageArt() {
  return (
    <svg viewBox="0 0 640 720" preserveAspectRatio="xMidYMid slice" role="img">
      <defs>
        <radialGradient id="glow" cx="50%" cy="42%" r="45%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="28%" stopColor="#f3e9ff" />
          <stop offset="70%" stopColor="#2a1030" />
          <stop offset="100%" stopColor="#07060a" />
        </radialGradient>
      </defs>
      <rect width="640" height="720" fill="#07060a" />
      <circle cx="320" cy="300" r="210" fill="url(#glow)" />
      <circle cx="320" cy="292" r="168" fill="none" stroke="#734c9e" strokeWidth="2" opacity="0.7" />
      <circle cx="320" cy="292" r="128" fill="none" stroke="#fff" strokeWidth="1" opacity="0.35" />
      {Array.from({ length: 12 }).map((_, index) => (
        <line
          key={index}
          x1="320"
          y1="292"
          x2={320 + Math.cos((index / 12) * Math.PI * 2) * 168}
          y2={292 + Math.sin((index / 12) * Math.PI * 2) * 168}
          stroke="#fff"
          strokeWidth="1"
          opacity="0.28"
        />
      ))}
      <g transform="translate(250 430)">
        <Iris x={70} y={70} scale={1.35} />
      </g>
      <g transform="translate(390 250) scale(0.9)">
        <Raven />
      </g>
    </svg>
  )
}

function Iris({ x, y, scale }: { x: number; y: number; scale: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M0 -34c8 10 8 16 0 22-8-6-8-12 0-22z" fill="#f4f0ff" />
      <path d="M0 34c8-10 8-16 0-22-8 6-8 12 0 22z" fill="#734c9e" />
      <path d="M-34 0c10-8 16-8 22 0-6 8-12 8-22 0z" fill="#f4f0ff" />
      <path d="M34 0c-10-8-16-8-22 0 6 8 12 8 22 0z" fill="#734c9e" />
      <path d="M-24 -24c12 2 16 8 14 16-8-2-12-8-14-16z" fill="#fff" />
      <path d="M24 -24c-12 2-16 8-14 16 8-2 12-8 14-16z" fill="#ff7adf" />
      <circle r="7" fill="#07060a" />
      <circle r="3" fill="#734c9e" />
    </g>
  )
}

function Raven() {
  return (
    <path
      d="M18 78c18-8 28-28 24-46 10 6 22 8 34 2-8 10-8 18-2 28 12 2 22-2 30-10-10 16-6 28 8 36-16 2-28 8-36 20-6-14-16-22-30-24-8 16-14 22-28 24 8-16 8-28 0-40-10 6-16 6-22 2 12-8 20-6 22 8z"
      fill="#f7f4ff"
    />
  )
}

function MoonWord() {
  return (
    <text
      x="80"
      y="96"
      textAnchor="middle"
      fill="#fff"
      fontFamily="Bebas Neue, sans-serif"
      fontSize="28"
    >
      EP
    </text>
  )
}

function Cap() {
  return (
    <path
      d="M28 78c18-28 86-28 104 0H28zm-8 8h120l-16 16H36L20 86z"
      fill="#f7f4ff"
    />
  )
}

function Corset() {
  return (
    <path
      d="M58 36h44l10 88H48L58 36zm10 16h24M62 68h36M60 84h40"
      fill="none"
      stroke="#734c9e"
      strokeWidth="4"
    />
  )
}

function Jacket() {
  return (
    <path d="M48 40l32 14 32-14 10 80H38L48 40zm32 14v62" fill="none" stroke="#fff" strokeWidth="4" />
  )
}

function Top() {
  return (
    <path d="M50 48h60l8 18-16 8v42H58V74l-16-8 8-18z" fill="none" stroke="#734c9e" strokeWidth="4" />
  )
}
