import { useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { MdWarning } from 'react-icons/md'

let dismissed = false

export function HalfOffAlert() {
  const [gone, setGone] = useState(dismissed)
  const [spot, setSpot] = useState<{ x: number; y: number } | null>(null)
  const frame = useRef<HTMLElement>(null)
  const grip = useRef<{ x: number; y: number } | null>(null)

  if (gone) return null

  function down(event: PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest('button')) return
    const node = frame.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    grip.current = { x: event.clientX - rect.left, y: event.clientY - rect.top }
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      /* o arraste segue pelo movimento do ponteiro */
    }
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    if (!grip.current || !frame.current) return
    const width = frame.current.offsetWidth
    const height = frame.current.offsetHeight
    const maxX = Math.max(8, window.innerWidth - width - 8)
    const maxY = Math.max(8, window.innerHeight - height - 132)
    setSpot({
      x: Math.min(maxX, Math.max(8, event.clientX - grip.current.x)),
      y: Math.min(maxY, Math.max(8, event.clientY - grip.current.y)),
    })
  }

  function up() {
    grip.current = null
  }

  function dismiss() {
    dismissed = true
    setGone(true)
  }

  return createPortal(
    <aside
      ref={frame}
      className="half-alert"
      role="dialog"
      aria-label={'Alerta de promo\u00e7\u00e3o'}
      style={spot ? { left: spot.x, top: spot.y, right: 'auto' } : undefined}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
    >
      <div className="half-alert-bar">
        <MdWarning aria-hidden="true" />
        <span>alerta</span>
        <button type="button" aria-label="fechar" onClick={dismiss}>
          {'\u00d7'}
        </button>
      </div>
      <p>{'Promo\u00e7\u00e3o de inaugura\u00e7\u00e3o: camisas pela metade do pre\u00e7o.'}</p>
    </aside>,
    document.body,
  )
}
