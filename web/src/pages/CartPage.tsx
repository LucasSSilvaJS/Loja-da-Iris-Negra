import { MdDeleteOutline, MdHome } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'
import { ProductShot } from '../components/art/ProductShot'
import { QuantityField } from '../components/checkout/QuantityField'
import { CrtFrame } from '../components/ui/CrtFrame'
import { usePageTitle } from '../hooks/usePageTitle'
import { formatAsking, formatBRL } from '../lib/money'
import { variantLabel } from '../lib/variant'
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
      {items.length === 0 ? (
        <CrtFrame>
          <header className="crt-lead">
            <p className="crt-kicker">menu</p>
            <h1>Sacola</h1>
          </header>
          <p className="summary-note">Nenhuma peça na sacola.</p>
          <Link className="link-btn crt-home" to="/">
            <MdHome aria-hidden="true" />
            Voltar para a página inicial
          </Link>
        </CrtFrame>
      ) : (
        <CrtFrame>
        <header className="crt-lead">
          <h1>Sacola</h1>
        </header>
        <div className="checkout-layout">
          <ul className="bag">
            {items.map((item) => (
              <li key={`${item.productSlug}-${item.size}-${item.color ?? ''}-${item.note ?? ''}`}>
                <ProductShot motif={item.motif} image={item.image} alt="" />
                <div>
                  <h2>{item.name}</h2>
                  {item.note ? <p className="line-note">{item.note}</p> : null}
                  <p>
                    {item.note ? '' : `${variantLabel(item)}${item.madeToOrder ? ' · sob encomenda' : ''} · `}
                    {item.note && item.madeToOrder ? 'sob encomenda · ' : ''}
                    {formatAsking(item.unitPriceCents, item.priceOnRequest)}
                  </p>
                  <div className="bag-actions">
                    <QuantityField
                      value={item.quantity}
                      max={Math.max(lineMax(items, item), item.quantity)}
                      label={`Quantidade de ${item.name}, ${variantLabel(item)}`}
                      onChange={(quantity) => setQuantity(item.productSlug, item.size, quantity, item.color, item.note)}
                    />
                    <strong>{formatAsking(item.unitPriceCents * item.quantity, item.priceOnRequest)}</strong>
                    <button
                      type="button"
                      className="text-btn"
                      onClick={() => remove(item.productSlug, item.size, item.color, item.note)}
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
        </CrtFrame>
      )}
    </div>
  )
}
