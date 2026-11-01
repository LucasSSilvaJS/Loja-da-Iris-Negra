import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ProductShot } from '../components/art/ProductShot'
import { ProductDeck } from '../components/catalog/ProductDeck'
import { CmdWindow } from '../components/ui/CmdWindow'
import { CrtFrame } from '../components/ui/CrtFrame'
import { notice } from '../components/feedback/Notice'
import { PageMask, useFault } from '../components/feedback/FaultNotice'
import { ProductSkeleton } from '../components/feedback/Skeleton'
import { NotFoundPage } from './NotFoundPage'
import { QuantityField } from '../components/checkout/QuantityField'
import { usePageTitle } from '../hooks/usePageTitle'
import { useResource } from '../hooks/useResource'
import { PriceTag } from '../components/catalog/PriceTag'
import { HalfOffAlert } from '../components/catalog/HalfOffAlert'
import { promoPercent } from '../lib/money'
import { boxTier } from '../lib/box'
import { galleryForColor, imageForColor } from '../lib/variant'
import { catalogService } from '../services/catalog.service'
import { useCart } from '../stores/cart.store'
import type { CartItem } from '../types/domain'

export function ProductPage() {
  const { slug = '' } = useParams()
  const state = useResource(slug, (key) => catalogService.product(key))
  useFault(
    slug ? `product:${slug}` : 'product',
    state.status === 'error' && state.code !== 404 ? state.error : null,
  )
  const navigate = useNavigate()
  const add = useCart((store) => store.add)
  const startDirect = useCart((store) => store.startDirect)
  const noteStocks = useCart((store) => store.noteStocks)
  const items = useCart((store) => store.items)
  const [size, setSize] = useState<string | null>(null)
  const [color, setColor] = useState('')
  const [qty, setQty] = useState(1)
  const [useBasePhoto, setUseBasePhoto] = useState(false)
  usePageTitle(
    state.status === 'error' && state.code === 404
      ? '404'
      : state.status === 'ready'
        ? state.data.name
        : 'Peça',
  )
  const readyColor = state.status === 'ready' ? (state.data.colors?.[0] ?? '') : ''
  const pickedColor = state.status === 'ready' && (state.data.colors ?? []).includes(color)
    ? color
    : readyColor
  const productImage = state.status === 'ready' ? state.data.image : ''
  useEffect(() => {
    setSize(null)
    setColor(readyColor)
    setQty(1)
  }, [slug, readyColor])
  useEffect(() => {
    setUseBasePhoto(false)
  }, [pickedColor, productImage])

  useEffect(() => {
    if (state.status !== 'ready') return
    noteStocks([
      {
        slug: state.data.slug,
        stock: state.data.madeToOrder ? null : state.data.stock,
        madeToOrder: state.data.madeToOrder,
      },
    ])
  }, [state, noteStocks])

  if (state.status === 'loading') return <ProductSkeleton />
  if (state.status === 'error' && state.code === 404) return <NotFoundPage />
  if (state.status === 'error') {
    return (
      <PageMask>
        <ProductSkeleton />
      </PageMask>
    )
  }

  const product = state.data
  const tier = boxTier(product)
  if (tier) return <Navigate to={`/caixa/${tier}`} replace />
  const colors = product.colors ?? []
  const selected = size ?? product.sizes[0] ?? 'único'
  const selectedColor = colors.includes(color) ? color : (colors[0] ?? '')
  const shot = useBasePhoto ? product.image : imageForColor(product.image, selectedColor)
  const frames = galleryForColor(product, useBasePhoto ? undefined : selectedColor)
  const inCart = items
    .filter((item) => item.productSlug === product.slug)
    .reduce((total, item) => total + item.quantity, 0)
  const soldOut = !product.madeToOrder && product.stock <= 0
  const off = promoPercent(product.priceCents, product.compareAtCents)
  const room = product.madeToOrder ? 10 : Math.max(0, product.stock - inCart)
  const atStock = !product.madeToOrder && room <= 0 && product.stock > 0

  function line(quantity: number): CartItem {
    return {
      productSlug: product.slug,
      name: product.name,
      size: selected,
      color: selectedColor || undefined,
      quantity,
      unitPriceCents: product.priceCents,
      motif: product.motif,
      image: shot,
      madeToOrder: product.madeToOrder,
      priceOnRequest: product.priceOnRequest,
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
    <CrtFrame>
      <article className={soldOut ? 'detail is-sold' : 'detail'}>
      <div className="detail-shot">
        {frames.length > 0 ? (
          <ProductDeck
            images={frames}
            alt={selectedColor ? `${product.name}, ${selectedColor}` : product.name}
            percent={off}
            soldOut={soldOut}
            onEmpty={() => {
              if (shot !== product.image) setUseBasePhoto(true)
            }}
          />
        ) : (
          <ProductShot motif={product.motif} image={shot} alt={product.name} />
        )}
      </div>
      <div className="stack">
        <p className="crt-kicker">{product.maker === 'eva' ? 'eva · feita à mão' : 'íris negra'}</p>
        <h1>{product.name}</h1>
        <p className="price">
          <PriceTag
            priceCents={product.priceCents}
            compareAtCents={product.compareAtCents}
            priceOnRequest={product.priceOnRequest}
          />
        </p>
        <CmdWindow text={product.description} />
        {product.categorySlug === 'camisas' ? <HalfOffAlert /> : null}
        <fieldset className={soldOut ? 'sizes is-off' : 'sizes'} disabled={soldOut}>
          <legend>tamanho</legend>
          {product.sizes.map((option) => (
            <label key={option} className={option === selected ? 'is-on' : ''}>
              <input
                type="radio"
                name="tamanho"
                value={option}
                checked={option === selected}
                disabled={soldOut}
                onChange={() => {
                  if (!soldOut) setSize(option)
                }}
              />
              {option}
            </label>
          ))}
        </fieldset>
        {colors.length > 0 && (
          <fieldset className="sizes">
            <legend>cor</legend>
            {colors.map((option) => (
              <label key={option} className={option === selectedColor ? 'is-on' : ''}>
                <input
                  type="radio"
                  name="cor"
                  value={option}
                  checked={option === selectedColor}
                  onChange={() => setColor(option)}
                />
                {option}
              </label>
            ))}
          </fieldset>
        )}
        {!soldOut && (
          <>
            <p className="stock">
              {product.madeToOrder
                ? 'Sob encomenda. O prazo combina no WhatsApp.'
                : atStock
                  ? 'Essa quantidade já está na sacola.'
                  : `${product.stock} na leva atual.`}
            </p>
            <QuantityField
              value={Math.min(qty, Math.max(room, 1))}
              max={Math.max(room, 1)}
              label={`Quantidade de ${product.name}`}
              onChange={setQty}
            />
            <div className="buy-actions">
              <button className="solid" type="button" onClick={addToCart} disabled={atStock}>
                adicionar à sacola
              </button>
              <button className="ghost" type="button" onClick={buyNow} disabled={atStock}>
                comprar agora
              </button>
            </div>
          </>
        )}
        <Link className="text-link" to={`/categoria/${product.categorySlug}`}>
          voltar pra prateleira
        </Link>
      </div>
      </article>
    </CrtFrame>
  )
}
