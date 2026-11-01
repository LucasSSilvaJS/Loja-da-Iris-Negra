import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { MdClose } from 'react-icons/md'

type ProductZoomProps = {
  src: string
  alt: string
  onError?: () => void
}

export function ZoomDialog({
  src,
  alt,
  onClose,
  onError,
}: {
  src: string
  alt: string
  onClose: () => void
  onError?: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const y = window.scrollY
    closeRef.current?.focus({ preventScroll: true })
    if (window.scrollY !== y) window.scrollTo(0, y)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onCloseRef.current()
      if (event.key === 'Tab') {
        event.preventDefault()
        closeRef.current?.focus({ preventScroll: true })
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
      if (window.scrollY !== y) window.scrollTo(0, y)
    }
  }, [])

  return createPortal(
    <div className="zoom-view" role="dialog" aria-modal="true" aria-label={`Imagem ampliada de ${alt}`} onClick={onClose}>
      <div className="zoom-stage" onClick={(event) => event.stopPropagation()}>
        <img src={src} alt={alt} onError={onError} />
        <button ref={closeRef} type="button" className="zoom-close" aria-label="fechar" onClick={onClose}>
          <MdClose aria-hidden="true" />
        </button>
      </div>
    </div>,
    document.body,
  )
}

export function ProductZoom({ src, alt, onError }: ProductZoomProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="shot-zoom"
        aria-label={`Ampliar ${alt}`}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setOpen(true)}
      >
        <img className="art shot" src={src} alt="" onError={onError} />
      </button>
      {open ? (
        <ZoomDialog
          src={src}
          alt={alt}
          onError={onError}
          onClose={() => {
            setOpen(false)
            triggerRef.current?.focus({ preventScroll: true })
          }}
        />
      ) : null}
    </>
  )
}
