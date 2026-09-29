import type { Category, Product } from '../types/domain'
import { request } from './http'

export const catalogService = {
  categories(): Promise<Category[]> {
    return request<Category[]>('/categories')
  },
  category(slug: string): Promise<Category> {
    return request<Category>(`/categories/${slug}`)
  },
  products(filter?: { category?: string; featured?: boolean }): Promise<Product[]> {
    const query = new URLSearchParams()
    if (filter?.category) query.set('category', filter.category)
    if (filter?.featured) query.set('featured', 'true')
    const suffix = query.size > 0 ? `?${query.toString()}` : ''
    return request<Product[]>(`/products${suffix}`)
  },
  product(slug: string): Promise<Product> {
    return request<Product>(`/products/${slug}`)
  },
}
