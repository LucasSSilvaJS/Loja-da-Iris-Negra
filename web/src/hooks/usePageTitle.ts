import { useEffect } from 'react'

export function usePageTitle(title: string): void {
  useEffect(() => {
    document.title = title ? `${title} · Íris Negra` : 'Íris Negra · Loja'
  }, [title])
}
