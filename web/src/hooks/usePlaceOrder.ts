import { useNavigate } from 'react-router-dom'
import { noticeError } from '../components/feedback/Notice'
import { ordersService } from '../services/orders.service'
import { useCart } from '../stores/cart.store'

export function usePlaceOrder() {
  const navigate = useNavigate()
  const sending = useCart((state) => state.placing)

  async function place() {
    const { items, direct, beginPlace, endPlace, clear, clearDirect } = useCart.getState()
    const lines = direct ?? items
    if (lines.length === 0 || !beginPlace()) return
    try {
      const order = await ordersService.create({
        items: lines.map((item) => ({
          productSlug: item.productSlug,
          size: item.size,
          quantity: item.quantity,
        })),
      })
      if (direct) clearDirect()
      else clear()
      void navigate(`/pedido/${order.publicId}`)
    } catch (reason) {
      noticeError(reason instanceof Error ? reason.message : 'O pedido não saiu.')
    } finally {
      endPlace()
    }
  }

  return { sending, place }
}
