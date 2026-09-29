import { useEffect, useId, useRef, type ReactNode } from 'react'
import { MdChatBubble } from 'react-icons/md'
import { ChatPanel } from './ChatPanel'

type ChatDockProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function useChatDock({ open, onOpenChange }: ChatDockProps): {
  panel: ReactNode
  button: ReactNode
} {
  const panelId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false)
    }
    const onPointer = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (target instanceof Element && target.closest('.corner-dock')) return
      onOpenChange(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [open, onOpenChange])

  const opened = useRef(false)

  useEffect(() => {
    if (open) {
      opened.current = true
      panelRef.current?.querySelector<HTMLElement>('input, textarea')?.focus()
      return
    }
    if (opened.current) toggleRef.current?.focus()
  }, [open])

  return {
    panel: open ? (
      <div ref={panelRef} className="chat-pop" id={panelId} role="dialog" aria-label="Chat da loja">
        <ChatPanel onClose={() => onOpenChange(false)} />
      </div>
    ) : null,
    button: (
      <button
        ref={toggleRef}
        className="chat-toggle"
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onOpenChange(!open)}
      >
        <MdChatBubble aria-hidden="true" />
        Chat
      </button>
    ),
  }
}
