import { useParams } from 'react-router-dom'
import { ProductGrid } from '../components/catalog/ProductGrid'
import { usePageTitle } from '../hooks/usePageTitle'
import { useResource } from '../hooks/useResource'
import { catalogService } from '../services/catalog.service'

export function CategoryPage() {
  const { slug = '' } = useParams()
  const category = useResource(slug, (key) => catalogService.category(key))
  const products = useResource(`products:${slug}`, () => catalogService.products({ category: slug }))
  usePageTitle(category.status === 'ready' ? category.data.name : 'Catálogo')

  return (
    <div className="stack">
      {category.status === 'ready' && (
        <header className="section-head">
          <div>
            <p className="pixel">{category.data.kind === 'eva' ? 'parceria' : 'banda'}</p>
            <h1>{category.data.name}</h1>
            <p>{category.data.description}</p>
          </div>
        </header>
      )}
      {(category.status === 'loading' || products.status === 'loading') && (
        <p className="status">abrindo o catálogo…</p>
      )}
      {category.status === 'error' && (
        <p className="status status-error" role="alert">
          {category.error}
        </p>
      )}
      {products.status === 'error' && (
        <p className="status status-error" role="alert">
          {products.error}
        </p>
      )}
      {products.status === 'ready' && category.status === 'ready' && (
        <ProductGrid products={products.data} />
      )}
    </div>
  )
}
