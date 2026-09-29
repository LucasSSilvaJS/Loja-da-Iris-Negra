import { useEffect, useRef } from 'react'

type Ring = {
  x: number
  y: number
  born: number
  delay: number
  speed: number
  life: number
  crest: number
}

const POOL = '#171318'
const SHADE = 'rgba(0, 0, 0, 0.82)'
const LIGHT = 'rgba(196, 132, 168, 0.55)'

function drop(rings: Ring[], x: number, y: number, now: number) {
  for (let index = 0; index < 4; index += 1) {
    rings.push({
      x,
      y,
      born: now,
      delay: index * 260,
      speed: 78 + index * 10,
      life: 3200 + index * 180,
      crest: 0.5 - index * 0.1,
    })
  }
}

export function WaterField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    const rings: Ring[] = []
    let frame = 0
    let nextDrop = 0
    let alive = true
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      const width = window.innerWidth
      const height = window.innerHeight
      canvas.width = Math.max(1, Math.floor(width * ratio))
      canvas.height = Math.max(1, Math.floor(height * ratio))
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const paintStill = () => {
      resize()
      context.fillStyle = POOL
      context.fillRect(0, 0, window.innerWidth, window.innerHeight)
    }

    const spawn = (now: number) => {
      const marginX = window.innerWidth * 0.08
      const marginY = window.innerHeight * 0.08
      const x = marginX + Math.random() * Math.max(1, window.innerWidth - marginX * 2)
      const y = marginY + Math.random() * Math.max(1, window.innerHeight - marginY * 2)
      drop(rings, x, y, now)
    }

    const draw = (now: number) => {
      if (!alive) return
      if (media.matches || document.hidden) {
        frame = window.requestAnimationFrame(draw)
        return
      }

      const width = window.innerWidth
      const height = window.innerHeight
      context.fillStyle = POOL
      context.fillRect(0, 0, width, height)

      if (now >= nextDrop) {
        spawn(now)
        nextDrop = now + 900 + Math.random() * 1400
      }

      context.lineCap = 'round'
      for (let index = rings.length - 1; index >= 0; index -= 1) {
        const ring = rings[index]
        const age = now - ring.born - ring.delay
        if (age < 0) continue
        if (age > ring.life) {
          rings.splice(index, 1)
          continue
        }
        const seconds = age / 1000
        const fade = 1 - age / ring.life
        const radius = 8 + seconds * ring.speed
        const alpha = ring.crest * fade * fade

        context.save()
        context.globalAlpha = alpha
        context.lineWidth = 22
        context.strokeStyle = POOL
        context.shadowBlur = 18
        context.shadowOffsetX = 8
        context.shadowOffsetY = 8
        context.shadowColor = SHADE
        context.beginPath()
        context.arc(ring.x, ring.y, radius, 0, Math.PI * 2)
        context.stroke()
        context.shadowOffsetX = -7
        context.shadowOffsetY = -7
        context.shadowColor = LIGHT
        context.beginPath()
        context.arc(ring.x, ring.y, radius, 0, Math.PI * 2)
        context.stroke()
        context.restore()

        if (age < 700 && ring.delay === 0) {
          const dent = 1 - age / 700
          context.save()
          context.globalAlpha = dent
          context.fillStyle = POOL
          context.shadowBlur = 16
          context.shadowOffsetX = 5
          context.shadowOffsetY = 5
          context.shadowColor = SHADE
          context.beginPath()
          context.arc(ring.x, ring.y, 18, 0, Math.PI * 2)
          context.fill()
          context.shadowOffsetX = -5
          context.shadowOffsetY = -5
          context.shadowColor = LIGHT
          context.beginPath()
          context.arc(ring.x, ring.y, 18, 0, Math.PI * 2)
          context.fill()
          context.restore()
        }
      }

      frame = window.requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)

    if (media.matches) {
      paintStill()
      const onChange = () => {
        if (!media.matches) {
          nextDrop = performance.now()
          frame = window.requestAnimationFrame(draw)
        }
      }
      media.addEventListener('change', onChange)
      return () => {
        alive = false
        media.removeEventListener('change', onChange)
        window.removeEventListener('resize', resize)
        window.cancelAnimationFrame(frame)
      }
    }

    const start = performance.now()
    drop(rings, window.innerWidth * 0.32, window.innerHeight * 0.38, start - 700)
    drop(rings, window.innerWidth * 0.7, window.innerHeight * 0.62, start - 200)
    nextDrop = start + 600
    frame = window.requestAnimationFrame(draw)

    return () => {
      alive = false
      window.removeEventListener('resize', resize)
      window.cancelAnimationFrame(frame)
    }
  }, [])

  return <canvas ref={canvasRef} className="water-field" aria-hidden="true" />
}
