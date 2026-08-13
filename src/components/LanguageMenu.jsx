import { useEffect, useRef, useState } from 'react'
import { GlobeIcon } from './Icons.jsx'

const LANGUAGES = [
  { code: 'ar', label: 'العربية' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fa', label: 'فارسی' },
  { code: 'fl', label: 'Filipino' },
  { code: 'fr', label: 'Français' },
  { code: 'ha', label: 'Hausa' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'id', label: 'Indonesian' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'ms', label: 'Malay' },
  { code: 'my', label: 'မြန်မာဘာသာ' },
  { code: 'pt', label: 'Português' },
  { code: 'sw', label: 'Kiswahili' },
  { code: 'th', label: 'ไทย' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'ua', label: 'Українська' },
  { code: 'ur', label: 'اردو' },
  { code: 'uz', label: 'Oʻzbekcha' },
  { code: 'vt', label: 'Tiếng Việt' },
  { code: 'zh', label: '中文' },
]

export default function LanguageMenu() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('en')
  const ref = useRef(null)

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <a
        className={`header__language${open ? ' is-active' : ''}`}
        onClick={(e) => {
          e.preventDefault()
          setOpen((v) => !v)
        }}
      >
        <GlobeIcon size={18} />
        <div className="header__language-text">{active}</div>
      </a>
      <div className={`countries__menu${open ? ' open' : ''}`} onClick={() => setOpen(false)}>
        {LANGUAGES.map((l) => (
          <a
            key={l.code}
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setActive(l.code)
            }}
            style={l.code === active ? { color: '#2b99ff' } : undefined}
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  )
}
