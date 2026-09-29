import { MdDeleteOutline } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'
import { ProductShot } from '../components/art/ProductShot'
import { QuantityField } from '../components/checkout/QuantityField'
import { usePageTitle } from '../hooks/usePageTitle'
import { formatBRL } from '../lib/money'
import { cartCount, cartTotal, lineMax, useCart } from '../stores/cart.store'

export function CartPage() {
  usePageTitle('Sacola')
  const navigate = useNavigate()
  const items = useCart((state) => state.items)
  const setQuantity = useCart((state) => state.setQuantity)
  const remove = useCart((state) => state.remove)
  const clearDirect = useCart((state) => state.clearDirect)
  const pieces = cartCount(items)

  return (
    <div className="stack">
      <header className="section-head">
        <h1>Sacola</h1>
      </header>
      {items.length === 0 ? (
        <p className="status">
          Sua sacola está vazia. <Link to="/">Volta pro cartaz</Link> e escolhe uma peça.
        </p>
      ) : (
        <div className="checkout-layout">
          <ul className="bag">
            {items.map((item) => (
              <li key={`${item.productSlug}-${item.size}`}>
                <ProductShot motif={item.motif} image={item.image} alt="" />
                <div>
                  <h2>{item.name}</h2>
                  <p>
                    {item.size}
                    {item.madeToOrder ? ' · sob encomenda' : ''} · {formatBRL(item.unitPriceCents)}
                  </p>
                  <div className="bag-actions">
                    <QuantityField
                      value={item.quantity}
                      max={lineMax(items, item)}
                      label={`Quantidade de ${item.name}, tamanho ${item.size}`}
                      onChange={(quantity) => setQuantity(item.productSlug, item.size, quantity)}
                    />
                    <strong>{formatBRL(item.unitPriceCents * item.quantity)}</strong>
                    <button
                      type="button"
                      className="text-btn"
                      onClick={() => remove(item.productSlug, item.size)}
                    >
                      <MdDeleteOutline aria-hidden="true" /> tirar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <aside className="order-card cart-summary" aria-label="Subtotal da sacola">
            <p className="pixel">
              subtotal · {pieces} {pieces === 1 ? 'peça' : 'peças'}
            </p>
            <p className="summary-amount">{formatBRL(cartTotal(items))}</p>
            <button
              className="solid"
              type="button"
              onClick={() => {
                clearDirect()
                void navigate('/fechar')
              }}
            >
              fechar pedido
            </button>
            <p className="summary-note">Pagamento e entrega combinam no WhatsApp.</p>
          </aside>
        </div>
      )}
    </div>
  )
}
