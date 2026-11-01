import { useEffect, useRef, useState } from 'react'
import { MdClose, MdMenu } from 'react-icons/md'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { catalogService } from '../../services/catalog.service'
import { useResource } from '../../hooks/useResource'
import { useFault } from '../feedback/FaultNotice'
import { NavSkeleton } from '../feedback/Skeleton'

export function BrandLockup() {
  return (
    <div className="brand-lockup">
      <Link className="brand-mark" to="/" aria-label="Íris Negra, início">
        <img className="portrait" src="/brand/iris.png" alt="" />
      </Link>
      <Link className="brand" to="/" aria-label="Íris Negra">
        <img src="/brand/letreiro.png" alt="" />
      </Link>
    </div>
  )
}

export function CategoryNav() {
  const state = useResource('categories', () => catalogService.categories())
  useFault('categories', state.status === 'error' ? state.error : null)
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const narrow = window.matchMedia('(max-width: 959px)')
    const previous = document.body.style.overflow
    function lock() {
      document.body.style.overflow = narrow.matches ? 'hidden' : previous
      if (narrow.matches) closeRef.current?.focus()
    }
    lock()
    narrow.addEventListener('change', lock)
    return () => {
      narrow.removeEventListener('change', lock)
      document.body.style.overflow = previous
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <nav
      className={open ? 'rail is-open' : 'rail'}
      aria-label="Tipos de produto"
      aria-busy={state.status === 'loading'}
      data-stalled={state.status === 'error' ? '' : undefined}
    >
      <div className="rail-head">
        <BrandLockup />
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="menu-loja"
          onClick={() => setOpen(true)}
        >
          <MdMenu aria-hidden="true" />
          <span className="sr-only">abrir menu</span>
        </button>
      </div>
      {state.status === 'loading' && <p className="sr-only" role="status">Carregando o menu.</p>}
      <div className="menu-sheet" id="menu-loja" role={open ? 'dialog' : undefined} aria-modal={open || undefined} aria-label="Menu">
        <div className="menu-sheet-bar">
          <h2 className="menu-title">Menu</h2>
          <button ref={closeRef} type="button" className="menu-close" onClick={() => setOpen(false)}>
            <MdClose aria-hidden="true" />
            <span className="sr-only">fechar menu</span>
          </button>
        </div>
        <ul className="rail-list">
        <li>
          <NavLink className="magenta-btn" to="/" end>
            <span className="btn-title">Destaque</span>
          </NavLink>
        </li>
        {(state.status === 'loading' || state.status === 'error') && <NavSkeleton />}
        {state.status === 'ready' &&
          state.data.map((category) => (
            <li key={category.slug}>
              <NavLink className="magenta-btn" to={`/categoria/${category.slug}`}>
                <span className="btn-title">{category.name}</span>
              </NavLink>
            </li>
          ))}
        <li className="rail-side">
          <NavLink className="magenta-btn side-btn" to="/album">
            <span className="btn-title">Album</span>
          </NavLink>
        </li>
        <li className="rail-side">
          <NavLink className="magenta-btn side-btn" to="/sobre">
            <span className="btn-title">Sobre</span>
          </NavLink>
        </li>
        </ul>
      </div>
    </nav>
  )
}
