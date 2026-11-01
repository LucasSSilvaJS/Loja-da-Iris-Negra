import type { ReactNode } from 'react'
import { CrtFrame } from '../ui/CrtFrame'

function Block({ className }: { className: string }) {
  return <span className={`skeleton ${className}`} />
}

function Pending({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="pending" aria-busy="true">
      <p className="sr-only" role="status">
        {label}
      </p>
      <div aria-hidden="true">{children}</div>
    </div>
  )
}

export function CatalogSkeleton({ count = 6, label = 'Carregando os produtos.' }: { count?: number; label?: string | null }) {
  const grid = (
    <ul className="catalog">
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <div className="card">
            <div className="win-title">
              <Block className="sk-win" />
              <span className="win-buttons">
                <span>_</span>
                <span>{'\u25a1'}</span>
                <span>{'\u00d7'}</span>
              </span>
            </div>
            <div className="card-shot">
              <Block className="sk-shot" />
            </div>
            <div className="card-body">
              <Block className="sk-title" />
              <Block className="sk-line" />
            </div>
            <div className="card-price">
              <Block className="sk-price" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
  if (!label) return grid
  return <Pending label={label}>{grid}</Pending>
}

export function ShelfSkeleton() {
  return (
    <Pending label="Carregando a prateleira.">
      <header className="section-head">
        <div className="stack">
          <Block className="sk-kicker" />
          <Block className="sk-h1" />
          <Block className="sk-copy" />
          <Block className="sk-copy is-short" />
        </div>
      </header>
      <CatalogSkeleton label={null} />
    </Pending>
  )
}

export function ProductSkeleton() {
  return (
    <CrtFrame>
      <article className="detail" aria-busy="true">
        <p className="sr-only" role="status">
          {'Carregando a pe\u00e7a.'}
        </p>
        <div className="detail-shot" aria-hidden="true">
          <Block className="sk-photo" />
        </div>
        <div className="stack" aria-hidden="true">
          <Block className="sk-kicker" />
          <Block className="sk-h1" />
          <Block className="sk-price" />
          <Block className="sk-copy" />
          <Block className="sk-copy is-short" />
          <div className="sizes">
            <Block className="sk-chip" />
            <Block className="sk-chip" />
            <Block className="sk-chip" />
            <Block className="sk-chip" />
          </div>
          <div className="buy-actions">
            <Block className="sk-btn" />
            <Block className="sk-btn" />
          </div>
        </div>
      </article>
    </CrtFrame>
  )
}

export function BoxSkeleton({ title }: { title: string }) {
  return (
    <CrtFrame>
      <section className="box-build" aria-busy="true">
        <p className="sr-only" role="status">
          {'Carregando a caixa.'}
        </p>
        <h1>{title}</h1>
        <div className="box-hero" aria-hidden="true">
          <Block className="sk-photo" />
        </div>
        <section className="box-zone is-pick" aria-hidden="true">
          <Block className="sk-kicker" />
          <div className="box-choice">
            <Block className="sk-choice" />
            <Block className="sk-choice" />
          </div>
        </section>
        <section className="box-zone is-read" aria-hidden="true">
          <div className="box-board">
            <Block className="sk-bound" />
            <Block className="sk-bound" />
            <Block className="sk-meter" />
          </div>
        </section>
        <div className="comb-tools" aria-hidden="true">
          <Block className="sk-field" />
          <div className="comb-filters">
            <Block className="sk-chip" />
            <Block className="sk-chip" />
            <Block className="sk-chip" />
            <Block className="sk-chip" />
          </div>
        </div>
        <ul className="comb" aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => (
            <li key={index}>
              <Block className="sk-hex" />
              <Block className="sk-line" />
            </li>
          ))}
        </ul>
      </section>
    </CrtFrame>
  )
}

export function OrderSkeleton() {
  return (
    <article className="stack" aria-busy="true">
      <p className="sr-only" role="status">
        {'Carregando o pedido.'}
      </p>
      <CrtFrame>
        <header className="crt-lead" aria-hidden="true">
          <Block className="sk-kicker" />
          <Block className="sk-h1" />
          <Block className="sk-line is-short" />
        </header>
        <div className="order-card" aria-hidden="true">
          {Array.from({ length: 3 }, (_, index) => (
            <div className="pending-row" key={index}>
              <Block className="sk-thumb" />
              <Block className="sk-line" />
              <Block className="sk-price" />
            </div>
          ))}
          <Block className="sk-meter" />
        </div>
        <div className="receipt-actions" aria-hidden="true">
          <Block className="sk-btn" />
          <Block className="sk-btn" />
        </div>
      </CrtFrame>
    </article>
  )
}

export function NavSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }, (_, index) => (
        <li key={index}>
          <Block className="sk-nav" />
        </li>
      ))}
    </>
  )
}
