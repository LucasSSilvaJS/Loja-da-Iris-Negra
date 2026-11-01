import { useEffect, useRef } from 'react'

type Point = { x: number; y: number; z: number; halo: boolean }

function buildPoints(): Point[] {
  const points: Point[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  const count = 2400
  for (let index = 0; index < count; index += 1) {
    const y = 1 - (index / (count - 1)) * 2
    const ring = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = golden * index
    points.push({
      x: Math.cos(theta) * ring,
      y,
      z: Math.sin(theta) * ring,
      halo: false,
    })
  }
  for (let index = 0; index < 320; index += 1) {
    const y = 1 - (index / 319) * 2
    const spread = 1.06 + (index % 6) * 0.045
    const ring = Math.sqrt(Math.max(0, 1 - y * y)) * spread
    const theta = golden * index * 1.6
    points.push({
      x: Math.cos(theta) * ring,
      y: y * 0.96,
      z: Math.sin(theta) * ring,
      halo: true,
    })
  }
  return points
}

const POINTS = buildPoints()

export function ParticleSphere() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let raf = 0
    let running = true
    let width = 0
    let height = 0

    const fit = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const nextWidth = Math.max(1, Math.floor(rect.width))
      const nextHeight = Math.max(1, Math.floor(rect.height))
      if (nextWidth === width && nextHeight === height) return
      width = nextWidth
      height = nextHeight
      canvas.width = Math.floor(nextWidth * dpr)
      canvas.height = Math.floor(nextHeight * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const paint = (angle: number) => {
      fit()
      context.clearRect(0, 0, width, height)
      const originX = width / 2
      const originY = height * 0.54
      const radius = Math.min(width, height) * 0.62
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      const drawn = POINTS.map((point) => {
        const x = point.x * cos + point.z * sin
        const z = -point.x * sin + point.z * cos
        const lit = Math.max(0, x * 0.62 - point.y * 0.18 + z * 0.78)
        return { x, y: point.y, z, lit, halo: point.halo }
      })
      drawn.sort((a, b) => a.z - b.z)
      for (const dot of drawn) {
        const depth = (dot.z + 1.35) / 2.7
        const alpha = dot.halo
          ? 0.04 + depth * 0.1 + dot.lit * 0.14
          : 0.1 + depth * 0.22 + dot.lit * 0.34
        const size = dot.halo ? 0.55 + dot.lit * 0.5 : 0.65 + depth * 0.7 + dot.lit * 0.9
        if (dot.lit > 0.8) context.fillStyle = `rgba(242, 242, 242, ${alpha})`
        else if (dot.lit > 0.45) context.fillStyle = `rgba(166, 120, 214, ${alpha})`
        else context.fillStyle = `rgba(115, 76, 158, ${Math.max(0.1, alpha * 0.8)})`
        context.beginPath()
        context.arc(originX + dot.x * radius, originY + dot.y * radius, size, 0, Math.PI * 2)
        context.fill()
      }
    }

    const loop = () => {
      if (!running) return
      paint(frame * 0.0032)
      frame += 1
      raf = requestAnimationFrame(loop)
    }

    if (reduce) paint(0.9)
    else loop()

    const observer = new ResizeObserver(() => {
      width = 0
      if (reduce) paint(0.9)
    })
    observer.observe(canvas)

    const onHide = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
        return
      }
      if (!reduce && !running) {
        running = true
        loop()
      }
    }
    document.addEventListener('visibilitychange', onHide)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      observer.disconnect()
      document.removeEventListener('visibilitychange', onHide)
    }
  }, [])

  return <canvas ref={ref} className="miss-field" aria-hidden="true" />
}
