import { useEffect, useState } from 'react'

const KONAMI = 'C:\\IRIS> Rodando c\u00f3digo secreto\n↑ ↑ ↓ ↓ ← → ← → B A'

export function CmdWindow({ text }: { text: string }) {
  const [typed, setTyped] = useState('')
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    const script = KONAMI
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setTyped(text)
      setSettled(true)
      return
    }

    let cancelled = false
    const timers: number[] = []
    setTyped('')
    setSettled(false)

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms))
      })

    const typeOut = async (value: string, ms: number) => {
      for (let i = 1; i <= value.length; i += 1) {
        if (cancelled) return
        setTyped(value.slice(0, i))
        await wait(ms)
      }
    }

    const erase = async (value: string, ms: number) => {
      for (let i = value.length - 1; i >= 0; i -= 1) {
        if (cancelled) return
        setTyped(value.slice(0, i))
        await wait(ms)
      }
    }

    void (async () => {
      await typeOut(script, 12)
      await wait(420)
      if (cancelled) return
      await erase(script, 12)
      if (cancelled) return
      await typeOut(text, 12)
      if (!cancelled) setSettled(true)
    })()

    return () => {
      cancelled = true
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [text])

  return (
    <div className="cmd-window">
      <div className="cmd-titlebar" aria-hidden="true">
        <span className="cmd-title">C:\IRIS\CMD.EXE</span>
        <span className="cmd-buttons">
          <span>_</span>
          <span>□</span>
          <span>×</span>
        </span>
      </div>
      <div className="cmd-body">
        <p className="sr-only">{text}</p>
        <pre className="cmd-script" aria-hidden="true">{settled ? text : typed}</pre>
        <span className="cmd-cursor" aria-hidden="true" />
      </div>
    </div>
  )
}
