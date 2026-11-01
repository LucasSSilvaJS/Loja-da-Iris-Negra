import { ProductGrid } from '../components/catalog/ProductGrid'
import { PageMask, useFault } from '../components/feedback/FaultNotice'
import { CatalogSkeleton } from '../components/feedback/Skeleton'
import { usePageTitle } from '../hooks/usePageTitle'
import { useResource } from '../hooks/useResource'
import { catalogService } from '../services/catalog.service'

export function HomePage() {
  usePageTitle('')
  const featured = useResource('featured', () => catalogService.products({ featured: true }))
  useFault('featured', featured.status === 'error' ? featured.error : null)

  return (
    <div className="stack">
      <section className="home-intro" aria-labelledby="loja-titulo">
        <p className="pixel">loja oficial</p>
        <h1 id="loja-titulo">
          <span>Bem-vindo à loja</span>
          <span>da Íris Negra</span>
        </h1>
        <p>Aqui você encontra todos os produtos oficiais da banda, tá ligado?</p>
      </section>
      {(featured.status === 'loading' || featured.status === 'error') && (
        <>
          <header className="section-head" id="destaques">
            <h2>Destaques</h2>
          </header>
          {featured.status === 'loading' ? (
            <CatalogSkeleton count={4} label="Carregando os destaques." />
          ) : (
            <PageMask>
              <CatalogSkeleton count={4} label={null} />
            </PageMask>
          )}
        </>
      )}
      {featured.status === 'ready' && featured.data.length > 0 && (
        <>
          <header className="section-head" id="destaques">
            <h2>Destaques</h2>
          </header>
          <ProductGrid products={featured.data} />
        </>
      )}
    </div>
  )
}
