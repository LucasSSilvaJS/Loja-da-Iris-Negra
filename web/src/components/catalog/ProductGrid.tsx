import { Link } from 'react-router-dom'
import { ProductShot } from '../art/ProductShot'
import { formatBRL } from '../../lib/money'
import type { Product } from '../../types/domain'

export function ProductCard({ product }: { product: Product }) {
  const gone = !product.madeToOrder && product.stock <= 0

  return (
    <Link className="card" to={`/produto/${product.slug}`}>
      <ProductShot motif={product.motif} image={product.image} alt="" />
      <div className="card-body">
        <span className="pill">{gone ? 'esgotada' : product.maker === 'eva' ? 'eva · à mão' : 'banda'}</span>
        <h3>{product.name}</h3>
        <p>{product.summary}</p>
        <strong>{formatBRL(product.priceCents)}</strong>
      </div>
    </Link>
  )
}

export function ProductGrid({ products }: { products: Product[] }) {
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
