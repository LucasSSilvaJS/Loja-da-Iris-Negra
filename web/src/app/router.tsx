import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { ScrollToContent } from '../components/layout/ScrollToContent'
import { AlbumPage } from '../pages/AlbumPage'
import { AboutPage } from '../pages/AboutPage'
import { CartPage } from '../pages/CartPage'
import { CategoryPage } from '../pages/CategoryPage'
import { CheckoutPage } from '../pages/CheckoutPage'
import { ChatPage } from '../pages/ChatPage'
import { HomePage } from '../pages/HomePage'
import { OrderPage } from '../pages/OrderPage'
import { ProductPage } from '../pages/ProductPage'
import { BoxBuilder } from '../components/catalog/BoxBuilder'
import { NotFoundPage } from '../pages/NotFoundPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToContent />
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="categoria/:slug" element={<CategoryPage />} />
          <Route path="produto/:slug" element={<ProductPage />} />
          <Route path="caixa" element={<Navigate to="/caixa/P" replace />} />
          <Route path="caixa/:tier" element={<BoxBuilder />} />
          <Route path="sacola" element={<Navigate to="/pedido" replace />} />
          <Route path="fechar" element={<CheckoutPage />} />
          <Route path="pedido" element={<CartPage />} />
          <Route path="pedido/:publicId" element={<OrderPage />} />
          <Route path="sobre" element={<AboutPage key="sobre" />} />
          <Route path="album" element={<AlbumPage />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

