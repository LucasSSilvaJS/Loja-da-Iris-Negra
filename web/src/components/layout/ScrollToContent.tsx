import { useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

const HOLD_MS = 500

export function scrollToContent(behavior: ScrollBehavior = 'auto') {
  const content = document.getElementById('conteudo')
  const top = content ? window.scrollY + content.getBoundingClientRect().top : 0
  const next = Math.max(0, top)
  if (Math.abs(window.scrollY - next) < 2) return
  window.scrollTo({ top: next, left: 0, behavior })
}

export function holdContentScroll() {
  scrollToContent()
  const started = performance.now()
  let stop = false

  const pin = () => {
    if (stop || performance.now() - started > HOLD_MS) return
    scrollToContent()
  }

  const onUser = () => {
    stop = true
  }

  window.addEventListener('wheel', onUser, { passive: true })
  window.addEventListener('touchmove', onUser, { passive: true })
  window.addEventListener('keydown', onUser)
  window.addEventListener('scroll', pin)

  const timers = [0, 50, 120, 250, 400].map((ms) => window.setTimeout(pin, ms))

  let released = false
  const release = () => {
    if (released) return
    released = true
    stop = true
    window.removeEventListener('wheel', onUser)
    window.removeEventListener('touchmove', onUser)
    window.removeEventListener('keydown', onUser)
    window.removeEventListener('scroll', pin)
    timers.forEach((timer) => window.clearTimeout(timer))
  }

  timers.push(window.setTimeout(release, HOLD_MS + 30))

  return release
}

export function ScrollToContent() {
  const { pathname } = useLocation()

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])

  useLayoutEffect(() => {
    scrollToContent()
  }, [pathname])

  useEffect(() => holdContentScroll(), [pathname])

  return null
}
