import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { MdChevronLeft, MdChevronRight, MdClose } from 'react-icons/md'
import { albumPhotos } from '../content/album-photos'
import { CrtFrame } from '../components/ui/CrtFrame'
import { usePageTitle } from '../hooks/usePageTitle'

const TILT = [-4.2, 3.1, -2.4, 4.6, -3.3, 2.2, -1.4, 5.1, -4.8, 1.6]
const TITLE = '\u00c1lbum'

function photoLabel(index: number) {
  return `Foto ${index + 1} do \u00e1lbum da \u00cdris Negra`
}

export function AlbumPage() {
  usePageTitle(TITLE)
  const [open, setOpen] = useState<number | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogOpen = useRef(false)
  const photo = open == null ? null : albumPhotos[open]

  const total = albumPhotos.length
  const atStart = open === 0
  const atEnd = open === total - 1

  function step(direction: -1 | 1) {
    setOpen((current) => {
      if (current == null) return current
      const next = current + direction
      if (next < 0 || next >= total) return current
      return next
    })
  }

  useEffect(() => {
    if (open == null) {
      dialogOpen.current = false
      return
    }
    if (!dialogOpen.current) {
      closeRef.current?.focus()
      dialogOpen.current = true
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(null)
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="stack album-page">
      <CrtFrame>
      <header className="crt-lead">
        <h1>{TITLE}</h1>
      </header>
      <div className="photo-board">
        {albumPhotos.map((src, index) => (
          <button
            key={src}
            type="button"
            className="polaroid"
            style={{ '--tilt': `${TILT[index % TILT.length]}deg` } as CSSProperties}
            onClick={() => setOpen(index)}
          >
            <img src={src} alt={photoLabel(index)} loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
      </CrtFrame>
      {photo && open != null && (
        <div className="album-view" role="dialog" aria-modal="true" aria-label={photoLabel(open)}>
          <div className="album-stage">
            <div className="album-frame">
              <img src={photo} alt="" />
              <button
                ref={closeRef}
                type="button"
                className="album-view-close"
                aria-label="fechar"
                onClick={() => setOpen(null)}
              >
                <MdClose aria-hidden="true" />
              </button>
            </div>
            <div className="album-controls">
              <button type="button" className="album-nav" aria-label="anterior" onClick={() => step(-1)} disabled={atStart}>
                <MdChevronLeft aria-hidden="true" />
              </button>
              <p className="album-count">
                {open + 1} / {total}
              </p>
              <button type="button" className="album-nav" aria-label={'pr\u00f3xima'} onClick={() => step(1)} disabled={atEnd}>
                <MdChevronRight aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
