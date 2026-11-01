import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageMask, useFault } from '../feedback/FaultNotice'
import { notice } from '../feedback/Notice'
import { BoxSkeleton } from '../feedback/Skeleton'
import { CrtFrame } from '../ui/CrtFrame'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useResource } from '../../hooks/useResource'
import { catalogService } from '../../services/catalog.service'
import { useCart } from '../../stores/cart.store'
import type { CartItem, Product } from '../../types/domain'
import { ProductShot } from '../art/ProductShot'
import { ProductDeck } from './ProductDeck'
import { ProductZoom } from './ProductZoom'
import { PriceTag } from './PriceTag'
import { galleryForColor, imageForColor } from '../../lib/variant'
import { formatBRL } from '../../lib/money'
import { asBoxTier, BOX_PRESET, boxTier, isBoxTier } from '../../lib/box'
import { NotFoundPage } from '../../pages/NotFoundPage'

function BoxPhoto({ motif, image, alt }: { motif: Product['motif']; image?: string; alt: string }) {
  if (!image) return <ProductShot motif={motif} image={image} alt={alt} />
  return <ProductZoom src={image} alt={alt} />
}

const SHELVES: { slug: string; name: string }[] = [
  { slug: 'camisas', name: 'Camisas' },
  { slug: 'bones', name: 'Bon\u00e9s' },
  { slug: 'joias', name: 'Joias' },
  { slug: 'pelucias', name: 'Pel\u00facias' },
  { slug: 'tabacaria', name: 'Tabacaria' },
  { slug: 'sex-shop', name: 'Sex shop' },
  { slug: 'eva', name: 'Eva' },
]

type Row = { slug: string; size: string; color: string }

function gone(product: Product): boolean {
  return !product.madeToOrder && product.stock <= 0
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path fill="currentColor" d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7V4z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path fill="currentColor" d="M8 3h8v2h5v2h-2l-1 14H6L5 7H3V5h5V3z" />
    </svg>
  )
}

export function BoxBuilder() {
  const { tier } = useParams()
  const picked = asBoxTier(tier)
  const catalog = useResource('box-catalog', () => catalogService.products())
  const add = useCart((state) => state.add)
  const setBoxSize = useCart((state) => state.setBoxSize)
  const openDirect = useCart((state) => state.openDirect)
  const navigate = useNavigate()
  const [chosen, setChosen] = useState<Row[]>([])
  const [mode, setMode] = useState<'montar' | 'pronta'>('montar')
  const [modeTier, setModeTier] = useState(picked)
  if (modeTier !== picked) {
    setModeTier(picked)
    setMode('montar')
  }
  const [query, setQuery] = useState('')
  const [shelf, setShelf] = useState('')
  usePageTitle(isBoxTier(tier) ? `Caixa ${tier}` : '404')

  const data = catalog.status === 'ready' ? catalog.data : null
  const products = data?.filter((product) => product.categorySlug !== 'box') ?? []
  const boxProduct = data?.find((product) => boxTier(product) === picked)
  const closed = Boolean(boxProduct && gone(boxProduct))
  const stocked = products.filter((product) => !gone(product))
  const shelves = SHELVES.filter((item) => stocked.some((product) => product.categorySlug === item.slug))
  const needle = query.trim().toLocaleLowerCase('pt-BR')
  const visible = stocked.filter((product) => {
    if (shelf && product.categorySlug !== shelf) return false
    if (!needle) return true
    return product.name.toLocaleLowerCase('pt-BR').includes(needle)
  })
  const chosenRows = chosen.flatMap((row) => {
    const product = products.find((item) => item.slug === row.slug)
    if (!product || gone(product)) return []
    return [{ row, product }]
  })
  const presetRows = (BOX_PRESET[picked] ?? []).flatMap((slug) => {
    const product = products.find((item) => item.slug === slug)
    if (!product || gone(product)) return []
    return [{
      row: {
        slug,
        size: product.sizes[0] ?? '\u00fanico',
        color: product.colors?.[0] ?? '',
      },
      product,
    }]
  })
  const presetOk = presetRows.length > 0 && presetRows.length === (BOX_PRESET[picked]?.length ?? 0)
  const pickedRows = mode === 'pronta' ? presetRows : chosenRows
  const chosenSlugs = new Set(chosenRows.map((item) => item.product.slug))
  const available = visible.filter((product) => !chosenSlugs.has(product.slug))
  const boxPrice = boxProduct?.priceCents ?? 0
  const priceMax = boxPrice + Math.floor(boxPrice / 10)
  const pickedSum = pickedRows.reduce((total, item) => total + item.product.priceCents, 0)
  const ready = (mode === 'montar' || presetOk) && boxPrice > 0 && pickedSum >= boxPrice && pickedSum <= priceMax
  const wasReady = useRef(false)
  useEffect(() => {
    if (ready && !wasReady.current) notice('Valor aceito. A caixa pode fechar.')
    wasReady.current = ready
  }, [ready])

  useFault('box-catalog', catalog.status === 'error' ? catalog.error : null)

  if (!isBoxTier(tier)) return <NotFoundPage />
  if (catalog.status === 'loading') return <BoxSkeleton title={`Caixa ${picked}`} />
  if (catalog.status === 'error') {
    return (
      <PageMask>
        <BoxSkeleton title={`Caixa ${picked}`} />
      </PageMask>
    )
  }

  function fits(product: Product): boolean {
    if (product.priceOnRequest) return false
    return pickedSum + product.priceCents <= priceMax
  }

  function addProduct(product: Product) {
    if (gone(product) || !fits(product)) return
    setChosen((current) => {
      if (current.some((row) => row.slug === product.slug)) return current
      return [
        ...current,
        {
          slug: product.slug,
          size: product.sizes[0] ?? '\u00fanico',
          color: product.colors?.[0] ?? '',
        },
      ]
    })
  }

  function removeProduct(slug: string) {
    setChosen((current) => current.filter((row) => row.slug !== slug))
  }

  function update(slug: string, patch: Partial<Row>) {
    setChosen((current) => current.map((row) => (row.slug === slug ? { ...row, ...patch } : row)))
  }

  function pieceNote(name: string, size: string, color: string): string {
    const parts = [size, color].filter((part) => part && part !== '\u00fanico')
    return parts.length ? `${name} (${parts.join(', ')})` : name
  }

  function boxLine(): CartItem | null {
    if (!boxProduct || !ready) return null
    return {
      productSlug: boxProduct.slug,
      name: boxProduct.name,
      size: boxProduct.sizes[0] ?? '\u00fanico',
      quantity: 1,
      unitPriceCents: boxProduct.priceCents,
      motif: boxProduct.motif,
      image: boxProduct.image,
      madeToOrder: false,
      priceOnRequest: false,
      note: [
        ...pickedRows.map(({ row, product }) => `${pieceNote(product.name, row.size, row.color)} \u2014 ${formatBRL(product.priceCents)}`),
        `Soma das pe\u00e7as: ${formatBRL(pickedSum)}.`,
        `Valor cobrado: ${formatBRL(boxPrice)}, o pre\u00e7o da caixa.`,
        `As pe\u00e7as ficam entre ${formatBRL(boxPrice)} e ${formatBRL(priceMax)} (10% a mais).`,
      ].join('\n'),
      contents: pickedRows.map(({ row, product }) => ({
        productSlug: product.slug,
        size: row.size,
        color: row.color || undefined,
      })),
    }
  }

  function addToCart() {
    const packed = boxLine()
    if (!packed) return
    setBoxSize(picked)
    add(packed)
    notice('A caixa entrou na sacola.')
    setChosen([])
  }

  function buyNow() {
    const packed = boxLine()
    if (!packed) return
    openDirect([packed], picked)
    void navigate('/fechar')
  }

  return (
    <CrtFrame>
      <section className="box-build">
        <h1>{`Caixa ${picked}`}</h1>
        {boxProduct && (
          <div className="box-hero">
            <ProductDeck images={galleryForColor(boxProduct)} alt={boxProduct.name} soldOut={closed} illustrative />
          </div>
        )}
        {closed ? (
          <Link className="text-link" to="/categoria/box">
            voltar pra prateleira
          </Link>
        ) : (
          <>
        <section className="box-zone is-pick">
          <p className="box-zone-label">escolha</p>
          <div className="box-choice" role="group" aria-label="como levar a caixa">
            <button type="button" className={mode === 'montar' ? 'is-on' : ''} onClick={() => setMode('montar')}>
              <span className="box-kicker">01</span>
              <span>selecionar itens</span>
            </button>
            <button type="button" className={mode === 'pronta' ? 'is-on' : ''} disabled={!presetOk} onClick={() => setMode('pronta')}>
              <span className="box-kicker">02</span>
              <span>caixa pronta</span>
            </button>
          </div>
        </section>
        <section className="box-zone is-read">
        {mode === 'montar' && <p className="stock">Monte dentro do valor.</p>}
        <div className="box-board">
          {mode === 'montar' && (
            <>
          <p className="box-bound is-min">
            <span>{'m\u00ednimo'}</span>
            <strong>{formatBRL(boxPrice)}</strong>
          </p>
          <p className="box-bound is-max">
            <span>{'m\u00e1ximo'}</span>
            <strong>{formatBRL(priceMax)}</strong>
          </p>
            </>
          )}
          <p className={ready ? 'box-meter is-ok' : 'box-meter is-no'} role="status">
            <span className="box-stamp" aria-hidden="true">{ready ? 'OK' : 'X'}</span>
            <span>
              {mode === 'pronta' && ready
                ? 'Adicione \u00e0 sacola ou compre agora.'
                : ready
                  ? `Soma ${formatBRL(pickedSum)}. Pode levar a caixa.`
                  : pickedSum <= 0
                    ? `Falta ${formatBRL(priceMax)} para fechar a caixa.`
                    : pickedSum < priceMax
                      ? `Soma ${formatBRL(pickedSum)}. Falta ${formatBRL(priceMax - pickedSum)}.`
                      : `Soma ${formatBRL(pickedSum)}. Passou do limite de ${formatBRL(priceMax)}.`}
            </span>
          </p>
        </div>
        </section>
        {pickedRows.length > 0 && (
          <ol className="comb-picks" aria-live="polite" aria-label="produtos selecionados">
            {pickedRows.map(({ row, product }, index) => (
              <li key={product.slug} className={mode === 'pronta' ? 'is-fixed' : undefined}>
                <span className="comb-num">{index + 1}</span>
                <div className="comb-photo">
                  <BoxPhoto motif={product.motif} image={imageForColor(product.image, row.color)} alt={product.name} />
                </div>
                <div className="comb-meta">
                  <strong>{product.name}</strong>
                  <PriceTag
                    priceCents={product.priceCents}
                    compareAtCents={product.compareAtCents}
                    priceOnRequest={product.priceOnRequest}
                  />
                  {mode === 'montar' && product.sizes.length > 1 && (
                    <select
                      value={row.size}
                      aria-label={`Tamanho de ${product.name}`}
                      onChange={(event) => update(product.slug, { size: event.target.value })}
                    >
                      {product.sizes.map((size) => (
                        <option key={size}>{size}</option>
                      ))}
                    </select>
                  )}
                  {mode === 'montar' && (product.colors?.length ?? 0) > 0 && (
                    <select
                      value={row.color}
                      aria-label={`Cor de ${product.name}`}
                      onChange={(event) => update(product.slug, { color: event.target.value })}
                    >
                      {product.colors?.map((tone) => (
                        <option key={tone}>{tone}</option>
                      ))}
                    </select>
                  )}
                  {mode === 'pronta' && (row.size !== '\u00fanico' || row.color) && (
                    <span>{[row.size, row.color].filter((part) => part && part !== '\u00fanico').join(' \u00b7 ')}</span>
                  )}
                </div>
                {mode === 'montar' && (
                  <button type="button" className="comb-trash" aria-label={`remover ${product.name}`} onClick={() => removeProduct(product.slug)}>
                    <TrashIcon />
                  </button>
                )}
              </li>
            ))}
          </ol>
        )}
        {mode === 'montar' && (
          <>
        <div className="comb-tools">
          <input
            type="search"
            value={query}
            placeholder="filtrar por nome"
            aria-label="filtrar por nome"
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="comb-filters" role="group" aria-label="filtrar por tipo">
            <button type="button" className={shelf === '' ? 'is-on' : ''} onClick={() => setShelf('')}>
              todas
            </button>
            {shelves.map((item) => (
              <button
                key={item.slug}
                type="button"
                className={shelf === item.slug ? 'is-on' : ''}
                onClick={() => setShelf(item.slug)}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
        {visible.length === 0 ? (
          <p className="stock">Nada com esse filtro.</p>
        ) : (
          <ul className="comb">
            {available.map((product) => (
              <li key={product.slug}>
                <div className="comb-photo">
                  <BoxPhoto motif={product.motif} image={product.image} alt={product.name} />
                </div>
                <div className="comb-meta">
                  <strong>{product.name}</strong>
                  <PriceTag
                    priceCents={product.priceCents}
                    compareAtCents={product.compareAtCents}
                    priceOnRequest={product.priceOnRequest}
                  />
                  <button type="button" className="comb-plus" aria-label={`incluir ${product.name}`} disabled={!fits(product)} onClick={() => addProduct(product)}>
                    <PlusIcon />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
          </>
        )}
        <div className="buy-actions">
          <button className="solid" type="button" disabled={!ready} onClick={addToCart}>
            {'adicionar \u00e0 sacola'}
          </button>
          <button className="ghost" type="button" disabled={!ready} onClick={buyNow}>
            comprar agora
          </button>
          <Link className="text-link" to="/categoria/box">
            voltar pra prateleira
          </Link>
        </div>
          </>
        )}
      </section>
    </CrtFrame>
  )
}
