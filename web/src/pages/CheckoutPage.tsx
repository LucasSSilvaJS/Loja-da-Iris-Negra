import { Link } from 'react-router-dom'
import { OrderSummary } from '../components/checkout/OrderSummary'
import { CrtFrame } from '../components/ui/CrtFrame'
import { usePageTitle } from '../hooks/usePageTitle'
import { usePlaceOrder } from '../hooks/usePlaceOrder'
import { useCart } from '../stores/cart.store'

export function CheckoutPage() {
  usePageTitle('Fechar pedido')
  const cartItems = useCart((state) => state.items)
  const direct = useCart((state) => state.direct)
  const directBoxSize = useCart((state) => state.directBoxSize)
  const items = direct ?? cartItems
  const { sending, place } = usePlaceOrder()

  return (
    <div className="stack">
      {items.length === 0 ? (
        <>
          <h1 className="crt-empty-title">Fechar pedido</h1>
          <p className="status">
            Nada para fechar. <Link to="/pedido">Abre a sacola</Link>.
          </p>
        </>
      ) : (
        <>
          <CrtFrame>
            <header className="crt-lead">
              <h1>Fechar pedido</h1>
            </header>
            {direct && (
              <p className="summary-note">
                {directBoxSize
                  ? 'Essa compra \u00e9 s\u00f3 desta caixa. A sacola continua como est\u00e1.'
                  : 'Essa compra \u00e9 s\u00f3 desta pe\u00e7a. A sacola continua como est\u00e1.'}
              </p>
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
          </CrtFrame>
        </>
      )}
    </div>
  )
}
