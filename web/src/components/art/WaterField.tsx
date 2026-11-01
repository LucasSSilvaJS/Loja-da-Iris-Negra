import { Hazeglow, type GradientConfig } from 'hazeglow'

const IRIS_FIELD: GradientConfig = {
  version: 1,
  seed: 11,
  shape: 'mesh',
  center: [0.5, 0.46],
  size: [1.35, 1.2],
  roundness: 1,
  softness: 0.72,
  rotation: 24,
  rampDirection: 0.15,
  angle: 128,
  warp: 0.95,
  warpScale: 1.4,
  palette: ['#734c9e', '#5a2280', '#120814', '#9a246e', '#4a1458', '#2a1848'],
  background: '#07060a',
  mesh: [
    [0.02, 0.08, '#0c0612'],
    [0.78, 0.02, '#5a2d92'],
    [0.98, 0.38, '#9a246e'],
    [0.66, 0.96, '#4a1458'],
    [0.08, 0.9, '#6a2080'],
    [0.46, 0.42, '#734c9e'],
    [0.62, 0.14, '#241044'],
    [0.22, 0.5, '#2a1848'],
    [0.88, 0.72, '#4a1458'],
  ],
  grain: 0.28,
  motion: 'flow',
  speed: 0.55,
  loop: 0,
  hover: 0,
  hoverMode: 'pull',
  effect: 'none',
  effectSize: 8,
  effectAmount: 0,
}

export function WaterField() {
  return (
    <>
      <Hazeglow className="water-field" config={IRIS_FIELD} />
      <div className="water-veil" aria-hidden="true" />
    </>
  )
}
