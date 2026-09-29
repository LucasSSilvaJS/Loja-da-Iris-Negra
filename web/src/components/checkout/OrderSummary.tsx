import type { ReactNode } from 'react'
import { formatBRL } from '../../lib/money'
import { cartTotal } from '../../stores/cart.store'
import type { CartItem } from '../../types/domain'

type OrderSummaryProps = {
  items: CartItem[]
  title?: string
  action?: ReactNode
}

export function OrderSummary({ items, title = 'Resumo', action }: OrderSummaryProps) {
  const pieces = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <aside className="order-card" aria-label="Resumo do pedido">
      <h2>{title}</h2>
      <ul className="summary-lines">
        {items.map((item) => (
          <li key={`${item.productSlug}-${item.size}`}>
            <span>
              {item.quantity}× {item.name}
              <small>
                {item.size}
                {item.madeToOrder ? ' · sob encomenda' : ''}
              </small>
            </span>
            <strong>{formatBRL(item.unitPriceCents * item.quantity)}</strong>
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
