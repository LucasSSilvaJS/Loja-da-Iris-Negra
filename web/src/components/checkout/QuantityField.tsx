import { useEffect, useState } from 'react'
import { MdAdd, MdRemove } from 'react-icons/md'

type QuantityFieldProps = {
  value: number
  max?: number
  label: string
  disabled?: boolean
  onChange: (quantity: number) => void
}

export function QuantityField({ value, max = 10, label, disabled = false, onChange }: QuantityFieldProps) {
  const [draft, setDraft] = useState(String(value))

  useEffect(() => {
    setDraft(String(value))
  }, [value])

  function commit(raw: string) {
    const next = Number.parseInt(raw, 10)
    if (!Number.isFinite(next)) {
      setDraft(String(value))
      return
    }
    onChange(Math.min(max, Math.max(1, next)))
  }

  return (
    <div className={disabled ? 'qty is-off' : 'qty'} role="group" aria-label={label}>
      <button
        type="button"
        aria-label={`Diminuir ${label}`}
        disabled={disabled || value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <MdRemove aria-hidden="true" />
      </button>
      <input
        inputMode="numeric"
        aria-label={label}
        disabled={disabled}
        value={draft}
        onChange={(event) => setDraft(event.target.value.replace(/\D/g, '').slice(0, 2))}
        onBlur={() => commit(draft)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            commit(draft)
          }
        }}
      />
      <button
        type="button"
        aria-label={`Aumentar ${label}`}
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
      >
        <MdAdd aria-hidden="true" />
      </button>
    </div>
  )
}
