import { useEffect, useId, useRef, type ReactNode } from 'react'
import { MdClose, MdDeleteOutline, MdShoppingBag } from 'react-icons/md'
import { Link, useLocation } from 'react-router-dom'
import { formatAsking, formatBRL } from '../../lib/money'
import { variantLabel } from '../../lib/variant'
import { cartCount, cartTotal, lineMax, useCart } from '../../stores/cart.store'
import { ProductShot } from '../art/ProductShot'
import { QuantityField } from './QuantityField'

export function toggleBag(
  onOrder: boolean,
  open: boolean,
  openDrawer: () => void,
  closeDrawer: () => void,
) {
  if (onOrder) {
    closeDrawer()
    document.getElementById('conteudo')?.scrollIntoView({ block: 'start' })
    return
  }
  if (open) closeDrawer()
  else openDrawer()
}

export function useBagDock(): { panel: ReactNode; button: ReactNode } {
  const panelId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const open = useCart((state) => state.drawerOpen)
  const openDrawer = useCart((state) => state.openDrawer)
  const closeDrawer = useCart((state) => state.closeDrawer)
  const items = useCart((state) => state.items)
  const setQuantity = useCart((state) => state.setQuantity)
  const remove = useCart((state) => state.remove)
  const count = cartCount(items)
  const clearDirect = useCart((state) => state.clearDirect)
  const onOrder = location.pathname === '/pedido'

  const skipFirstPath = useRef(true)
  useEffect(() => {
    if (skipFirstPath.current) {
      skipFirstPath.current = false
      return
    }
    closeDrawer()
  }, [location.pathname, closeDrawer])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDrawer()
    }
    const onPointer = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (target instanceof Element && target.closest('.corner-dock')) return
      closeDrawer()
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [open, closeDrawer])

  const opened = useRef(false)
  useEffect(() => {
    if (open) {
      opened.current = true
      panelRef.current?.focus()
      return
    }
    if (opened.current) toggleRef.current?.focus()
  }, [open])

  const panel = open && !onOrder ? (
        <div
          ref={panelRef}
          className="bag-pop"
          id={panelId}
          role="dialog"
          aria-label="Sacola"
          tabIndex={-1}
        >
          <header className="cart-sheet-head">
            <h2 id="sacola-titulo">Sacola</h2>
            <button type="button" className="icon-btn" aria-label="Fechar sacola" onClick={closeDrawer}>
              <MdClose aria-hidden="true" />
            </button>
          </header>

          {items.length === 0 ? (
            <p className="status">
              Sua sacola está vazia. <Link to="/">Escolhe uma peça</Link>.
            </p>
          ) : (
            <>
              <ul className="bag bag-drawer">
                {items.map((item) => (
                  <li key={`${item.productSlug}-${item.size}-${item.color ?? ''}-${item.note ?? ''}`}>
                    <ProductShot motif={item.motif} image={item.image} alt="" />
                    <div className="bag-line">
                      <div>
                        <h3>{item.name}</h3>
                        {item.note ? <p className="line-note">{item.note}</p> : null}
                        <p>
                          {item.note ? '' : `${variantLabel(item)} · `}
                          {formatAsking(item.unitPriceCents, item.priceOnRequest)}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label={`Tirar ${item.name}, ${variantLabel(item)}`}
                        onClick={() => remove(item.productSlug, item.size, item.color, item.note)}
                      >
                        <MdDeleteOutline aria-hidden="true" />
                      </button>
                      <QuantityField
                        value={item.quantity}
                        max={Math.max(lineMax(items, item), item.quantity)}
                        label={`Quantidade de ${item.name}, ${variantLabel(item)}`}
                        onChange={(quantity) => setQuantity(item.productSlug, item.size, quantity, item.color, item.note)}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <footer className="cart-sheet-foot">
                <p className="summary-total">
                  <span>Subtotal</span>
                  <span>{formatBRL(cartTotal(items))}</span>
                </p>
                <Link className="solid link-btn" to="/fechar" onClick={() => clearDirect()}>
                  fechar pedido
                </Link>
              </footer>
            </>
          )}
        </div>
  ) : null

  return {
    panel,
    button: (
      <button
        ref={toggleRef}
        className="bag-toggle"
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => toggleBag(onOrder, open, openDrawer, closeDrawer)}
      >
        <MdShoppingBag aria-hidden="true" />
        Sacola
        {count > 0 && <span className="bag-count">{count}</span>}
      </button>
    ),
  }
}
