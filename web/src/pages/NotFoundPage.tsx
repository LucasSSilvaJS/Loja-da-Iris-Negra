import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { ParticleSphere } from '../components/art/ParticleSphere'
import { usePageTitle } from '../hooks/usePageTitle'

export function NotFoundPage() {
  usePageTitle('404')

  useEffect(() => {
    const root = document.getElementById('root')
    const previous = document.body.style.overflow
    root?.setAttribute('inert', '')
    document.body.style.overflow = 'hidden'
    return () => {
      root?.removeAttribute('inert')
      document.body.style.overflow = previous
    }
  }, [])

  return createPortal(
    <section className="miss" aria-labelledby="erro-404">
      <ParticleSphere />
      <span className="miss-veil" aria-hidden="true" />
      <h1 id="erro-404" className="miss-code">404</h1>
      <p className="miss-lead">{'Essa p\u00e1gina n\u00e3o existe.'}</p>
      <Link className="miss-back" to="/">
        {'Voltar ao in\u00edcio'}
      </Link>
    </section>,
    document.body,
  )
}
