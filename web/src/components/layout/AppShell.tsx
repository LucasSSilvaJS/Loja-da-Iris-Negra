import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { CategoryNav } from './CategoryNav'
import { CornerDock } from './CornerDock'
import { PlaylistBar } from './PlaylistBar'

export function AppShell() {
  const { pathname } = useLocation()
  const onChat = pathname === '/chat'
  const [chatOpen, setChatOpen] = useState(false)

  useEffect(() => {
    if (onChat) setChatOpen(false)
  }, [onChat])

  return (
    <div className={onChat ? 'page is-chat' : 'page'}>
      <a className="skip" href="#conteudo">
        pular para o conteúdo
      </a>
      <header className="topbar">
        <Link className="brand-mark" to="/" aria-label="Íris Negra, início">
          <img className="portrait" src="/base/logo-iris.png" alt="" />
        </Link>
        <Link className="brand" to="/">
          Íris Negra
        </Link>
      </header>

      <div className="stage">
        <CategoryNav />
        <main id="conteudo" className="screen">
          <Outlet />
        </main>
      </div>

      <PlaylistBar />
      <div className="player-shelf">
        <p className="player-credit">Copyright © Íris Negra. Loja em parceria com a Eva. Recife.</p>
        <CornerDock chatOpen={onChat ? false : chatOpen} showChat={!onChat} onChatOpenChange={setChatOpen} />
      </div>
    </div>
  )
}
