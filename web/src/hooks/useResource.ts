import { useEffect, useRef, useState } from 'react'
import { ApiError } from '../services/http'

type Resource<T> =
  | { status: 'loading'; data: null; error: null; code: null }
  | { status: 'error'; data: null; error: string; code: number | null }
  | { status: 'ready'; data: T; error: null; code: null }

export function useResource<T>(
  key: string,
  loader: (key: string) => Promise<T>,
): Resource<T> {
  const loaderRef = useRef(loader)
  const [state, setState] = useState<Resource<T>>({
    status: 'loading',
    data: null,
    error: null,
    code: null,
  })

  useEffect(() => {
    loaderRef.current = loader
  }, [loader])

  useEffect(() => {
    let active = true
    setState({ status: 'loading', data: null, error: null, code: null })
    loaderRef.current(key).then(
      (data) => {
        if (active) setState({ status: 'ready', data, error: null, code: null })
      },
      (error: unknown) => {
        if (!active) return
        const message = error instanceof Error ? error.message : 'Não rolou.'
        const code = error instanceof ApiError ? error.status : null
        setState({ status: 'error', data: null, error: message, code })
      },
    )
    return () => {
      active = false
    }
  }, [key])

  return state
}
