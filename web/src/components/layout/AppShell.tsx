import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { catalogService } from '../../services/catalog.service'
import { useCart } from '../../stores/cart.store'
import { BrandLockup, CategoryNav } from './CategoryNav'
import { CornerDock } from './CornerDock'
import { PlaylistBar } from './PlaylistBar'

export function AppShell() {
  const { pathname } = useLocation()
  const onChat = pathname === '/chat'
  const [chatOpen, setChatOpen] = useState(false)
  const noteStocks = useCart((store) => store.noteStocks)

  useEffect(() => {
    if (onChat) setChatOpen(false)
  }, [onChat])

  useEffect(() => {
    let active = true
    catalogService
      .products()
      .then((products) => {
        if (!active) return
        noteStocks(
          products.map((product) => ({
            slug: product.slug,
            stock: product.madeToOrder ? null : product.stock,
            madeToOrder: product.madeToOrder,
          })),
        )
      })
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [noteStocks])

  return (
    <div className={onChat ? 'page is-chat' : 'page'}>
      <a className="skip" href="#conteudo">
        pular para o conteúdo
      </a>
      <header className="topbar">
        <BrandLockup />
      </header>

      <div className="stage">
        <CategoryNav />
        <main id="conteudo" className="screen">
          <Outlet />
        </main>
      </div>

      <PlaylistBar />
      <div className="player-shelf">
        <CornerDock chatOpen={onChat ? false : chatOpen} showChat={!onChat} onChatOpenChange={setChatOpen} />
      </div>
    </div>
  )
}
