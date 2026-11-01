import type { ReactNode } from 'react'
import { formatAsking, formatBRL } from '../../lib/money'
import { imageForColor, variantLabel } from '../../lib/variant'
import { cartTotal } from '../../stores/cart.store'
import type { CartItem } from '../../types/domain'

type OrderSummaryProps = {
  items: CartItem[]
  title?: string
  action?: ReactNode
}

export function SummaryShot({ src, alt }: { src?: string; alt: string }) {
  if (!src) return null
  return <img className="summary-shot" src={src} alt={alt} />
}

export function OrderSummary({ items, title = 'Resumo', action }: OrderSummaryProps) {
  const pieces = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <aside className="order-card" aria-label="Resumo do pedido">
      <h2>{title}</h2>
      <ul className="summary-lines">
        {items.map((item) => (
          <li key={`${item.productSlug}-${item.size}-${item.color ?? ''}-${item.note ?? ''}`}>
            <span className="summary-main">
              <SummaryShot src={imageForColor(item.image ?? '', item.color)} alt="" />
              <span>
                {item.quantity}× {item.name}
                <small className={item.note ? 'line-note' : undefined}>
                  {item.note ? item.note : variantLabel(item)}
                  {item.madeToOrder ? ' · sob encomenda' : ''}
                </small>
              </span>
            </span>
            <strong>{formatAsking(item.unitPriceCents * item.quantity, item.priceOnRequest)}</strong>
          </li>
        ))}
      </ul>
      <p className="summary-total">
        <span>
          {pieces} {pieces === 1 ? 'peça' : 'peças'}
        </span>
        <span>{formatBRL(cartTotal(items))}</span>
      </p>
      <p className="summary-note">Pagamento e entrega combinam no WhatsApp. Quem entrega é o pessoal da loja.</p>
      {action}
    </aside>
  )
}
