import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ProductShot } from '../components/art/ProductShot'
import { notice } from '../components/feedback/Notice'
import { QuantityField } from '../components/checkout/QuantityField'
import { usePageTitle } from '../hooks/usePageTitle'
import { useResource } from '../hooks/useResource'
import { formatBRL } from '../lib/money'
import { catalogService } from '../services/catalog.service'
import { useCart } from '../stores/cart.store'
import type { CartItem } from '../types/domain'

export function ProductPage() {
  const { slug = '' } = useParams()
  const state = useResource(slug, (key) => catalogService.product(key))
  const navigate = useNavigate()
  const add = useCart((store) => store.add)
  const startDirect = useCart((store) => store.startDirect)
  const items = useCart((store) => store.items)
  const [size, setSize] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  usePageTitle(state.status === 'ready' ? state.data.name : 'Peça')

  if (state.status === 'loading') return <p className="status">buscando a peça…</p>
  if (state.status === 'error') {
    return (
      <p className="status status-error" role="alert">
        {state.error}
      </p>
    )
  }

  const product = state.data
  const selected = size ?? product.sizes[0] ?? 'único'
  const inCart = items
    .filter((item) => item.productSlug === product.slug)
    .reduce((total, item) => total + item.quantity, 0)
  const soldOut = !product.madeToOrder && product.stock <= 0
  const room = product.madeToOrder ? 10 : Math.max(0, product.stock - inCart)
  const atStock = !product.madeToOrder && room <= 0 && product.stock > 0

  function line(quantity: number): CartItem {
    return {
      productSlug: product.slug,
      name: product.name,
      size: selected,
      quantity,
      unitPriceCents: product.priceCents,
      motif: product.motif,
      image: product.image,
      madeToOrder: product.madeToOrder,
      stock: product.madeToOrder ? undefined : product.stock,
    }
  }

  function addToCart() {
    if (soldOut || atStock) return
    add(line(qty))
    notice('Entrou na sacola.')
  }

  function buyNow() {
    if (soldOut || atStock) return
    startDirect(line(Math.min(qty, room || qty)))
    void navigate('/fechar')
  }

  return (
    <article className="detail">
      <ProductShot motif={product.motif} image={product.image} alt={product.name} />
      <div className="stack">
        <p className="pixel">{product.maker === 'eva' ? 'eva · feita à mão' : 'íris negra'}</p>
        <h1>{product.name}</h1>
        <p className="price">{formatBRL(product.priceCents)}</p>
        <p>{product.description}</p>
        <fieldset className="sizes">
          <legend>tamanho</legend>
          {product.sizes.map((option) => (
            <label key={option} className={option === selected ? 'is-on' : ''}>
              <input
                type="radio"
                name="tamanho"
                value={option}
                checked={option === selected}
                onChange={() => setSize(option)}
              />
              {option}
            </label>
          ))}
        </fieldset>
        <p className="stock">
          {product.madeToOrder
            ? 'Sob encomenda. O prazo combina no WhatsApp.'
            : soldOut
              ? 'Esgotada nesta leva.'
              : atStock
                ? 'Essa quantidade já está na sacola.'
                : `${product.stock} na leva atual.`}
        </p>
        {!soldOut && (
          <QuantityField
            value={Math.min(qty, Math.max(room, 1))}
            max={Math.max(room, 1)}
            label={`Quantidade de ${product.name}`}
            onChange={setQty}
          />
        )}
        <div className="buy-actions">
          <button className="solid" type="button" onClick={addToCart} disabled={soldOut || atStock}>
            adicionar à sacola
          </button>
          <button className="ghost" type="button" onClick={buyNow} disabled={soldOut || atStock}>
            comprar agora
          </button>
          <Link className="text-link" to={`/categoria/${product.categorySlug}`}>
            voltar pra prateleira
          </Link>
        </div>
      </div>
    </article>
  )
}
