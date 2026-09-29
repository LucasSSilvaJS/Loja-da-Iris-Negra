import { useEffect, useRef, useState } from 'react'

type Resource<T> =
  | { status: 'loading'; data: null; error: null }
  | { status: 'error'; data: null; error: string }
  | { status: 'ready'; data: T; error: null }

export function useResource<T>(
  key: string,
  loader: (key: string) => Promise<T>,
): Resource<T> {
  const loaderRef = useRef(loader)
  const [state, setState] = useState<Resource<T>>({
    status: 'loading',
    data: null,
    error: null,
  })

  useEffect(() => {
    loaderRef.current = loader
  }, [loader])

  useEffect(() => {
    let active = true
    setState({ status: 'loading', data: null, error: null })
    loaderRef.current(key).then(
      (data) => {
        if (active) setState({ status: 'ready', data, error: null })
      },
      (error: unknown) => {
        if (!active) return
        const message = error instanceof Error ? error.message : 'Não rolou.'
        setState({ status: 'error', data: null, error: message })
      },
    )
    return () => {
      active = false
    }
  }, [key])

  return state
}
