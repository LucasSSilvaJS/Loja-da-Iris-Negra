import { Link } from 'react-router-dom'
import { OrderSummary } from '../components/checkout/OrderSummary'
import { usePageTitle } from '../hooks/usePageTitle'
import { usePlaceOrder } from '../hooks/usePlaceOrder'
import { useCart } from '../stores/cart.store'

export function CheckoutPage() {
  usePageTitle('Fechar pedido')
  const cartItems = useCart((state) => state.items)
  const direct = useCart((state) => state.direct)
  const items = direct ?? cartItems
  const { sending, place } = usePlaceOrder()

  return (
    <div className="stack">
      <header className="section-head">
        <h1>Fechar pedido</h1>
      </header>
      {items.length === 0 ? (
        <p className="status">
          Nada para fechar. <Link to="/pedido">Abre a sacola</Link>.
        </p>
      ) : (
        <>
          {direct && (
            <p className="summary-note">Essa compra é só desta peça. A sacola continua como está.</p>
          )}
          <OrderSummary
            title="Revisão"
            items={items}
            action={
              <button className="solid" type="button" disabled={sending} onClick={() => void place()}>
                {sending ? 'fazendo o pedido…' : 'fazer pedido'}
              </button>
            }
            />
        </>
      )}
    </div>
  )
}
