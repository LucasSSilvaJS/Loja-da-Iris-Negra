import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ProductShot } from '../art/ProductShot'
import { SoldStamp } from '../art/SoldStamp'
import { PriceTag } from './PriceTag'
import { SaleBadge } from './SaleBadge'
import { boxTier } from '../../lib/box'
import { promoPercent } from '../../lib/money'
import { useCart } from '../../stores/cart.store'
import type { Product } from '../../types/domain'

export function ProductCard({ product }: { product: Product }) {
  const gone = !product.madeToOrder && product.stock <= 0
  const off = promoPercent(product.priceCents, product.compareAtCents)
  const tier = boxTier(product)

  return (
    <Link className="card" to={tier ? `/caixa/${tier}` : `/produto/${product.slug}`}>
      <div className="win-title">
        <span>{gone ? 'esgotado' : 'disponível'}</span>
        <span className="win-buttons" aria-hidden="true">
          <span>_</span>
          <span>□</span>
          <span>×</span>
        </span>
      </div>
      <div className="card-shot">
        <ProductShot motif={product.motif} image={product.image} alt="" />
        {off ? <SaleBadge percent={off} /> : null}
        {gone && <SoldStamp />}
        {tier ? <span className="shot-label">Imagem ilustrativa</span> : null}
      </div>
      <div className="card-body">
        <h3>{product.name}</h3>
        <p>{product.summary}</p>
      </div>
      <strong className="card-price">
        <PriceTag
          priceCents={product.priceCents}
          compareAtCents={product.compareAtCents}
          priceOnRequest={product.priceOnRequest}
        />
      </strong>
    </Link>
  )
}

export function ProductGrid({ products }: { products: Product[] }) {
  const noteStocks = useCart((store) => store.noteStocks)

  useEffect(() => {
    noteStocks(
      products.map((product) => ({
        slug: product.slug,
        stock: product.madeToOrder ? null : product.stock,
        madeToOrder: product.madeToOrder,
      })),
    )
  }, [products, noteStocks])

  if (products.length === 0) {
    return <p className="status">Essa prateleira ainda está vazia.</p>
  }

  return (
    <ul className="catalog">
      {products.map((product) => (
        <li key={product.slug}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  )
}
