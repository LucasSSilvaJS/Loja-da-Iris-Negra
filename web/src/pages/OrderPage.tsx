import { useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { OrderMark } from '../components/checkout/BuySteps'
import { noticeError } from '../components/feedback/Notice'
import { usePageTitle } from '../hooks/usePageTitle'
import { useResource } from '../hooks/useResource'
import { formatBRL } from '../lib/money'
import { catalogService } from '../services/catalog.service'
import { ordersService } from '../services/orders.service'
import { useCart } from '../stores/cart.store'

const statusLabel: Record<string, string> = {
  aguardando_whatsapp: 'aguardando conversa no WhatsApp',
  confirmado: 'confirmado',
  enviado: 'saiu para entrega',
  cancelado: 'cancelado',
}

export function OrderPage() {
  const { publicId = '' } = useParams()
  const navigate = useNavigate()
  const state = useResource(publicId, (key) => ordersService.find(key))
  const replace = useCart((store) => store.replace)
  const [editing, setEditing] = useState(false)
  usePageTitle(state.status === 'ready' ? state.data.code : 'Pedido')

  if (state.status === 'loading') return <p className="status">abrindo o pedido…</p>
  if (state.status === 'error') {
    return (
      <p className="status status-error" role="alert">
        {state.error}
      </p>
    )
  }

  const order = state.data

  async function editOrder() {
    if (editing) return
    setEditing(true)
    try {
      const lines = await Promise.all(
        order.items.map(async (item) => {
          const product = await catalogService.product(item.productSlug)
          return {
            productSlug: item.productSlug,
            name: item.name,
            size: item.size,
            quantity: item.quantity,
            unitPriceCents: item.unitPriceCents,
            motif: product.motif,
            image: product.image,
            madeToOrder: product.madeToOrder,
            stock: product.madeToOrder ? undefined : product.stock,
          }
        }),
      )
      replace(lines)
      void navigate('/pedido')
    } catch (reason) {
      noticeError(reason instanceof Error ? reason.message : 'Não deu para abrir o pedido de novo.')
      setEditing(false)
    }
  }

  return (
    <article className="stack">
      <header>
        <p className="pixel">pedido registrado</p>
        <h1>{order.code}</h1>
        <p>{statusLabel[order.status] ?? order.status}</p>
      </header>
      <OrderMark />
      <div className="order-card">
        <h2>Peças</h2>
        <ul className="summary-lines">
          {order.items.map((item) => (
            <li key={`${item.productSlug}-${item.size}`}>
              <span>
                {item.quantity}× {item.name}
                <small>{item.size}</small>
              </span>
              <strong>{formatBRL(item.unitPriceCents * item.quantity)}</strong>
            </li>
          ))}
        </ul>
        <p className="summary-total">
          <span>Total</span>
          <span>{formatBRL(order.totalCents)}</span>
        </p>
      </div>
      <div className="receipt-actions">
        {order.whatsappUrl ? (
          <a className="solid link-btn" href={order.whatsappUrl} target="_blank" rel="noreferrer">
            <FaWhatsapp aria-hidden="true" /> continuar no WhatsApp
          </a>
        ) : (
          <p className="status">O WhatsApp da loja ainda não foi configurado.</p>
        )}
        <button className="solid" type="button" disabled={editing} onClick={() => void editOrder()}>
          {editing ? 'abrindo…' : 'alterar pedido'}
        </button>
      </div>
    </article>
  )
}
