import { useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { CrtFrame } from '../components/ui/CrtFrame'
import { noticeError } from '../components/feedback/Notice'
import { PageMask, useFault } from '../components/feedback/FaultNotice'
import { OrderSkeleton } from '../components/feedback/Skeleton'
import { NotFoundPage } from './NotFoundPage'
import { usePageTitle } from '../hooks/usePageTitle'
import { useResource } from '../hooks/useResource'
import { SummaryShot } from '../components/checkout/OrderSummary'
import { formatAsking, formatBRL } from '../lib/money'
import { imageForColor, variantLabel } from '../lib/variant'
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
  useFault(
    publicId ? `order:${publicId}` : 'order',
    state.status === 'error' && state.code !== 404 ? state.error : null,
  )
  const photos = useResource('order-catalog', () => catalogService.products())
  const replace = useCart((store) => store.replace)
  const [editing, setEditing] = useState(false)
  usePageTitle(state.status === 'error' && state.code === 404 ? '404' : state.status === 'ready' ? state.data.code : 'Pedido')

  if (state.status === 'loading') return <OrderSkeleton />
  if (state.status === 'error' && state.code === 404) return <NotFoundPage />
  if (state.status === 'error') {
    return (
      <PageMask>
        <OrderSkeleton />
      </PageMask>
    )
  }

  const order = state.data
  const catalog = photos.status === 'ready' ? photos.data : []

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
            color: item.color,
            image: imageForColor(product.image, item.color),
            madeToOrder: product.madeToOrder,
            stock: item.contents?.length || product.madeToOrder ? undefined : product.stock,
            note: item.note,
            contents: item.contents,
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
      <CrtFrame>
        <header className="crt-lead">
          <p className="crt-kicker">pedido registrado</p>
          <h1>{order.code}</h1>
          <p className="crt-status">{statusLabel[order.status] ?? order.status}</p>
        </header>
        <div className="order-card">
          <h2>Peças</h2>
          <ul className="summary-lines">
            {order.items.map((item) => (
              <li key={`${item.productSlug}-${item.size}-${item.color ?? ''}-${item.note ?? ''}`}>
                <span className="summary-main">
                  <SummaryShot
                    src={imageForColor(
                      catalog.find((product) => product.slug === item.productSlug)?.image ?? '',
                      item.color,
                    )}
                    alt=""
                  />
                  <span>
                    {item.quantity}× {item.name}
                    <small className={item.note ? 'line-note' : undefined}>{item.note ? item.note : variantLabel(item)}</small>
                  </span>
                </span>
                <strong>{formatAsking(item.unitPriceCents * item.quantity, item.unitPriceCents === 0)}</strong>
              </li>
            ))}
          </ul>
          <p className="summary-total">
            <span>Total</span>
            <span>{formatBRL(order.totalCents)}</span>
          </p>
          {order.boxSize ? <p className="summary-note">Caixa {order.boxSize} montada no site.</p> : null}
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
      </CrtFrame>
    </article>
  )
}
