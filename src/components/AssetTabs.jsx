import { useEffect, useMemo, useState } from 'react'
import { Info } from 'lucide-react'
import { useTrade } from '../trade/TradeContext.jsx'
import { useProducts } from '../trade/ProductsProvider.jsx'
import { getAsset, getFlags } from '../data/assets.js'
import { priceFeed, formatPrice } from '../trade/priceEngine.js'

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

export default function AssetTabs() {
  const { tabs, activeCode, setActiveCode, addTab, removeTab, payout } = useTrade()
  const { products } = useProducts()
  const now = useClock()
  const [prices, setPrices] = useState({})
  const [marketsOpen, setMarketsOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const unsub = priceFeed.subscribe((snap) => setPrices(snap))
    return unsub
  }, [])

  const enabledProducts = useMemo(
    () => products.filter((p) => p.enabled !== 0),
    [products]
  )
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return enabledProducts
    return enabledProducts.filter(
      (p) => p.code.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)
    )
  }, [enabledProducts, query])

  const hh = String(now.getUTCHours()).padStart(2, '0')
  const mm = String(now.getUTCMinutes()).padStart(2, '0')
  const ss = String(now.getUTCSeconds()).padStart(2, '0')
  const activeAsset = getAsset(activeCode)

  const openMarket = (code) => {
    addTab(code)
    setActiveCode(code)
    setMarketsOpen(false)
    setQuery('')
  }

  return (
    <div className="h-[44px] shrink-0 bg-panel px-3 flex items-center justify-between gap-3 border-b border-line">
      <div className="flex items-center gap-1.5 overflow-x-auto min-w-0 scrollbar-none">
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => {
              setMarketsOpen((o) => !o)
              setQuery('')
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors text-[11px] font-bold tracking-wide ${
              marketsOpen
                ? 'bg-[#0073e6] text-white border-[#0073e6]'
                : 'bg-card border-line text-muted hover:border-[#2a3648] hover:text-white'
            }`}
            title="Open markets"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M1 2h10M1 6h10M1 10h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            MARKETS
            <span className="text-up text-[10px] font-black">{enabledProducts.length}</span>
          </button>
          {marketsOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMarketsOpen(false)} />
              <div className="absolute z-50 left-0 top-full mt-1.5 w-[300px] bg-[#0e131d] border border-line rounded-xl shadow-2xl shadow-black/60 overflow-hidden">
                <div className="p-2.5 border-b border-line">
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search assets…"
                    className="w-full bg-[#0b0e14] border border-line rounded-lg px-3 py-2 text-[12px] text-white outline-none focus:border-[#0073e6] placeholder:text-[#55637a]"
                  />
                </div>
                <div className="max-h-[340px] overflow-y-auto py-1.5">
                  {filtered.length === 0 ? (
                    <div className="px-4 py-6 text-center text-[11px] text-muted">No matching assets.</div>
                  ) : (
                    filtered.map((p) => {
                      const isActive = p.code === activeCode
                      return (
                        <button
                          key={p.code}
                          type="button"
                          onClick={() => openMarket(p.code)}
                          className={`w-full flex items-center justify-between px-3.5 py-2 text-left transition-colors ${
                            isActive ? 'bg-[#0073e6]/15' : 'hover:bg-panel'
                          }`}
                        >
                          <span className="flex items-center gap-2.5 min-w-0">
                            <span className="text-sm leading-none shrink-0">{getFlags(p)}</span>
                            <span className="leading-tight min-w-0">
                              <span className="block text-[12px] font-bold text-white truncate">{p.code}</span>
                              <span className="block text-[10px] text-muted truncate">{p.name}</span>
                            </span>
                          </span>
                          <span className="text-[11px] font-black tabular-nums text-up shrink-0">
                            {formatPrice(p, prices[p.code] ?? p.basePrice)}
                          </span>
                        </button>
                      )
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        {tabs.map((code) => {
          const asset = getAsset(code)
          const isActive = code === activeCode
          return (
            <div
              key={code}
              onClick={() => setActiveCode(code)}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer border transition-colors ${
                isActive
                  ? 'bg-card border-[#2a3648]'
                  : 'border-transparent hover:bg-card/60'
              }`}
            >
              <span className="text-sm leading-none">{getFlags(asset)}</span>
              <span className={`text-[12px] font-semibold whitespace-nowrap ${isActive ? 'text-white' : 'text-muted'}`}>
                {asset.name}
              </span>
              <span className="text-[10px] font-bold text-up bg-up/10 px-1.5 py-0.5 rounded">{payout}%</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeTab(code)
                }}
                className="text-muted hover:text-white transition-colors"
                title="Close"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                  <path d="M8.5 1.5l-7 7m0-7l7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[11px] text-muted font-semibold tabular-nums">
          {hh}:{mm}:{ss} UTC-7
        </span>
        <button
          type="button"
          className="flex items-center gap-1.5 bg-card border border-line rounded-lg px-2.5 py-1.5 hover:border-[#2a3648] transition-colors"
        >
          <Info size={12} className="text-up" />
          <span className="text-[10px] font-bold text-muted tracking-wide">PAIR INFORMATION</span>
          <span className="text-[12px] font-bold text-white tabular-nums">
            {formatPrice(activeAsset, prices[activeCode] ?? activeAsset.basePrice)}
          </span>
        </button>
      </div>
    </div>
  )
}
