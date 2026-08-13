import { useEffect, useRef, useState } from 'react'
import { ChevronDownIcon, CheckIcon } from './Icons.jsx'

export default function Select({ value, options, onChange, searchable = false, searchPlaceholder = 'Search', placeholder }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const rootRef = useRef(null)

  const current = options.find((o) => o.value === value)

  useEffect(() => {
    const onDocClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const filtered = query
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options

  const toggle = () => {
    setOpen((v) => !v)
    setQuery('')
  }

  return (
    <div className="select-input-container" ref={rootRef}>
      <button type="button" className="select__trigger" onClick={toggle}>
        <span className="select__value">{current ? current.label : placeholder || 'Select'}</span>
        <ChevronDownIcon size={16} className="select__chevron" />
      </button>
      {open && (
        <div className="select__dropdown">
          {searchable && (
            <input
              className="select__search"
              autoFocus
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          )}
          {filtered.length === 0 && <div className="select__option">No matches.</div>}
          {filtered.map((o) => (
            <div
              key={o.value}
              className={`select__option${o.value === value ? ' selected' : ''}`}
              onClick={() => {
                onChange(o.value)
                setOpen(false)
              }}
            >
              <span>{o.label}</span>
              {o.value === value && <CheckIcon size={12} className="select__opt-check" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
