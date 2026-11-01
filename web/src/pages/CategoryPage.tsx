import { useParams } from 'react-router-dom'
import { HalfOffAlert } from '../components/catalog/HalfOffAlert'
import { ProductGrid } from '../components/catalog/ProductGrid'
import { PageMask, useFault } from '../components/feedback/FaultNotice'
import { CatalogSkeleton, ShelfSkeleton } from '../components/feedback/Skeleton'
import { NotFoundPage } from './NotFoundPage'
import { CmdWindow } from '../components/ui/CmdWindow'
import { usePageTitle } from '../hooks/usePageTitle'
import { useResource } from '../hooks/useResource'
import { catalogService } from '../services/catalog.service'

export function CategoryPage() {
  const { slug = '' } = useParams()
  const category = useResource(slug, (key) => catalogService.category(key))
  const products = useResource(`products:${slug}`, () => catalogService.products({ category: slug }))
  const categoryMissing = category.status === 'error' && category.code === 404
  const categoryDown = category.status === 'error' && !categoryMissing
  const productsDown = products.status === 'error' && !categoryMissing
  useFault(slug ? `category:${slug}` : 'category', categoryDown ? category.error : null)
  useFault(slug ? `shelf:${slug}` : 'shelf', productsDown ? products.error : null)
  usePageTitle(
    category.status === 'error' && category.code === 404
      ? '404'
      : category.status === 'ready'
        ? category.data.name
        : 'Catálogo',
  )

  if (category.status === 'error' && category.code === 404) return <NotFoundPage />

  return (
    <div className="stack">
      {category.status === 'loading' && <ShelfSkeleton />}
      {categoryDown && (
        <PageMask>
          <ShelfSkeleton />
        </PageMask>
      )}
      {category.status === 'ready' && (
        <header className="section-head">
          <div>
            <p className="pixel">{category.data.kind === 'eva' ? 'parceria' : 'banda'}</p>
            <h1>{category.data.name}</h1>
            <CmdWindow text={category.data.description} />
          </div>
        </header>
      )}
      {category.status !== 'loading' && !categoryDown && products.status === 'loading' && <CatalogSkeleton />}
      {category.status === 'ready' && productsDown && (
        <PageMask>
          <CatalogSkeleton label={null} />
        </PageMask>
      )}
      {products.status === 'ready' && category.status === 'ready' && (
        <ProductGrid products={products.data} />
      )}
      {slug === 'camisas' && category.status === 'ready' && <HalfOffAlert />}
    </div>
  )
}
