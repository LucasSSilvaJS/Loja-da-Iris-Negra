import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { AboutPage } from '../pages/AboutPage'
import { CartPage } from '../pages/CartPage'
import { CategoryPage } from '../pages/CategoryPage'
import { CheckoutPage } from '../pages/CheckoutPage'
import { ChatPage } from '../pages/ChatPage'
import { HomePage } from '../pages/HomePage'
import { OrderPage } from '../pages/OrderPage'
import { ProductPage } from '../pages/ProductPage'
import { usePageTitle } from '../hooks/usePageTitle'
import { Link } from 'react-router-dom'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="categoria/:slug" element={<CategoryPage />} />
          <Route path="produto/:slug" element={<ProductPage />} />
          <Route path="sacola" element={<Navigate to="/pedido" replace />} />
          <Route path="fechar" element={<CheckoutPage />} />
          <Route path="pedido" element={<CartPage />} />
          <Route path="pedido/:publicId" element={<OrderPage />} />
          <Route path="sobre" element={<AboutPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="*" element={<MissingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function MissingPage() {
  usePageTitle('Sumiu')
  return (
    <p className="status">
      Essa página não existe. <Link to="/">Volta pro cartaz.</Link>
    </p>
  )
}
