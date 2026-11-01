import { useEffect, useState } from 'react'
import { MdArrowUpward } from 'react-icons/md'
import { useLocation } from 'react-router-dom'
import { scrollToContent } from './ScrollToContent'

const SHOW_AFTER = 120
const HIDE_WITHIN = 2

function distanceFromContentStart(): number {
  const content = document.getElementById('conteudo')
  if (!content) return window.scrollY
  const start = window.scrollY + content.getBoundingClientRect().top
  return window.scrollY - start
}

export function ScrollTopButton() {
  const { pathname } = useLocation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = () => {
      const distance = distanceFromContentStart()
      setVisible((shown) => {
        if (distance <= HIDE_WITHIN) return false
        if (distance >= SHOW_AFTER) return true
        return shown
      })
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [pathname])

  return (
    <button
      type="button"
      className="to-top"
      hidden={!visible}
      aria-label={'voltar ao in\u00edcio'}
      onPointerDown={(event) => {
        if (event.pointerType !== 'mouse' && event.pointerType !== 'touch' && event.pointerType !== 'pen') return
        event.preventDefault()
      }}
      onClick={(event) => {
        event.currentTarget.blur()
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (reduce) {
          scrollToContent('auto')
          return
        }
        scrollToContent('smooth')
        let settled = false
        let timer = 0
        const stop = () => {
          if (settled) return
          settled = true
          window.removeEventListener('scrollend', finish)
          window.removeEventListener('wheel', stop)
          window.removeEventListener('touchmove', stop)
          window.removeEventListener('keydown', stop)
          window.clearTimeout(timer)
        }
        const finish = () => {
          stop()
          scrollToContent('auto')
        }
        window.addEventListener('scrollend', finish)
        window.addEventListener('wheel', stop, { passive: true })
        window.addEventListener('touchmove', stop, { passive: true })
        window.addEventListener('keydown', stop)
        timer = window.setTimeout(finish, 900)
      }}
    >
      <MdArrowUpward aria-hidden="true" />
    </button>
  )
}
