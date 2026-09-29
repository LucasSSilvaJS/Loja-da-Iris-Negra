import { ProductGrid } from '../components/catalog/ProductGrid'
import { usePageTitle } from '../hooks/usePageTitle'
import { useResource } from '../hooks/useResource'
import { catalogService } from '../services/catalog.service'

export function HomePage() {
  usePageTitle('')
  const featured = useResource('featured', () => catalogService.products({ featured: true }))

  return (
    <div className="stack">
      <section className="home-intro" aria-labelledby="loja-titulo">
        <p className="pixel">loja oficial</p>
        <h1 id="loja-titulo">Bem-vindo à loja da Íris Negra</h1>
        <p>Aqui você encontra todos os produtos oficiais da banda, tá ligado?</p>
      </section>
      {featured.status === 'loading' && <p className="status">abrindo os destaques…</p>}
      {featured.status === 'error' && (
        <p className="status status-error" role="alert">
          {featured.error}
        </p>
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
