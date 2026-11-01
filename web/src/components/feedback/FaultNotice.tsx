import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

const faults = new Map<string, string>()
const listeners = new Set<(message: string | null) => void>()

function currentFault() {
  return faults.values().next().value ?? null
}

function emit() {
  const message = currentFault()
  listeners.forEach((listener) => listener(message))
}

export function reportFault(id: string, message: string | null) {
  if (message) faults.set(id, message)
  else faults.delete(id)
  emit()
}

export function useFault(id: string, message: string | null) {
  useEffect(() => {
    reportFault(id, message)
    return () => reportFault(id, null)
  }, [id, message])
}

export function PageMask({ children }: { children: ReactNode }) {
  return (
    <div className="load-mask" aria-hidden="true">
      {children}
    </div>
  )
}

export function FaultHost() {
  const [message, setMessage] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    function onChange(next: string | null) {
      setMessage(next)
      setOpen(Boolean(next))
    }
    listeners.add(onChange)
    onChange(currentFault())
    return () => {
      listeners.delete(onChange)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    panelRef.current?.focus()
    const root = document.getElementById('root')
    const previous = document.body.style.overflow
    root?.setAttribute('inert', '')
    document.body.style.overflow = 'hidden'
    return () => {
      root?.removeAttribute('inert')
      document.body.style.overflow = previous
    }
  }, [open])

  if (!open || !message) return null

  return createPortal(
    <div className="fault-mask" onClick={() => setOpen(false)}>
      <section
        ref={panelRef}
        className="fault-pop"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="falha-loja"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="fault-x" onClick={() => setOpen(false)}>
          <span aria-hidden="true">{'\u00d7'}</span>
          <span className="sr-only">Fechar aviso</span>
        </button>
        <p id="falha-loja">{message}</p>
        <button type="button" className="fault-retry" onClick={() => window.location.reload()}>
          Tentar reconectar
        </button>
      </section>
    </div>,
    document.body,
  )
}
