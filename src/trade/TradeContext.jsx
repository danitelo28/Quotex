import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { priceFeed } from './priceEngine.js'
import { getAsset } from '../data/assets.js'
import { useProducts } from './ProductsProvider.jsx'

const TradeContext = createContext(null)

const DEFAULT_TABS = ['EURCHF', 'GBPUSD']
const DEFAULT_ACTIVE = 'EURCHF'
const DEMO_BALANCE = 1000
const LIVE_BALANCE = 25000
const ACCOUNT_PROFILE = {
  badge: 'STANDARD',
  email: 'mohamedaniss940@gmail.com',
  id: '73491523',
}
const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', GBP: '£' }

export function payoutFor(seconds) {
  if (seconds <= 15) return 96
  if (seconds <= 30) return 94
  if (seconds <= 60) return 90
  if (seconds <= 120) return 88
  if (seconds <= 300) return 85
  if (seconds <= 1800) return 82
  if (seconds <= 3600) return 80
  return 78
}

export function formatDuration(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const pad = (n) => String(n).padStart(2, '0')
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
}

export function formatMoney(value, currency = '$') {
  return `${currency} ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function TradeProvider({ children }) {
  const { products } = useProducts()
  const [tabs, setTabs] = useState(DEFAULT_TABS)
  const [activeCode, setActiveCode] = useState(DEFAULT_ACTIVE)
  const [investment, setInvestment] = useState(1500)
  const [currency, setCurrency] = useState('$')
  const [durationSec, setDurationSec] = useState(60)
  const [timeMode, setTimeMode] = useState('min')
  const [pendingToggle, setPendingToggle] = useState(false)
  const [accountMode, setAccountMode] = useState('live')
  const [accountCurrency, setAccountCurrency] = useState('USD')
  const [balance, setBalance] = useState({ live: LIVE_BALANCE, demo: DEMO_BALANCE })
  const [trades, setTrades] = useState([])
  const [toast, setToast] = useState(null)
  const resolvedRef = useRef(new Set())

  const activeAsset = getAsset(activeCode)
  const payout = payoutFor(durationSec)
  const openTrades = trades.filter((t) => t.status === 'open')

  useEffect(() => {
    const codes = products.map((p) => p.code)
    if (!codes.length) return
    setTabs((prev) => {
      const next = prev.filter((c) => codes.includes(c))
      return next.length ? next : [codes[0]]
    })
    setActiveCode((cur) => (codes.includes(cur) ? cur : codes[0]))
  }, [products])

  const pushToast = useCallback((message) => {
    setToast({ id: Date.now(), message })
  }, [])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(id)
  }, [toast])

  const addTab = useCallback((code) => {
    setTabs((prev) => (prev.includes(code) ? prev : [...prev, code]))
  }, [])

  const removeTab = useCallback(
    (code) => {
      setTabs((prev) => {
        const next = prev.filter((c) => c !== code)
        return next.length ? next : [activeCode]
      })
      setActiveCode((cur) => {
        if (cur !== code) return cur
        const remaining = tabs.filter((c) => c !== code)
        return remaining[0] ?? DEFAULT_ACTIVE
      })
    },
    [tabs, activeCode]
  )

  const resolveExpired = useCallback(() => {
    const now = Date.now()
    const expired = trades.filter(
      (t) => t.status === 'open' && now >= t.expiresAt && !resolvedRef.current.has(t.id)
    )
    if (!expired.length) return

    let delta = 0
    for (const t of expired) {
      resolvedRef.current.add(t.id)
      const exitPrice = priceFeed.getPrice(t.assetCode)
      const won = t.direction === 'up' ? exitPrice > t.entryPrice : exitPrice < t.entryPrice
      const profit = won ? (t.investment * t.payout) / 100 : -t.investment
      delta += profit
    }

    setBalance((b) => ({ ...b, [accountMode]: Math.max(0, b[accountMode] + delta) }))
    setTrades((prev) =>
      prev.map((t) => {
        const ex = expired.find((e) => e.id === t.id)
        if (!ex) return t
        const exitPrice = priceFeed.getPrice(t.assetCode)
        const won = t.direction === 'up' ? exitPrice > t.entryPrice : exitPrice < t.entryPrice
        return {
          ...t,
          status: won ? 'won' : 'lost',
          exitPrice,
          profit: won ? (t.investment * t.payout) / 100 : -t.investment,
        }
      })
    )
  }, [trades, accountMode])

  useEffect(() => {
    const id = setInterval(resolveExpired, 200)
    return () => clearInterval(id)
  }, [resolveExpired])

  const openTrade = useCallback(
    (direction) => {
      if (!activeAsset) return
      if (investment <= 0) return pushToast('Investment must be greater than zero')
      if (balance[accountMode] < investment) return pushToast('Insufficient balance. Please deposit.')
      if (timeMode === 'sec' && durationSec > 60) return

      const entryPrice = priceFeed.getPrice(activeAsset.code)
      const expiresAt = Date.now() + durationSec * 1000

      setBalance((b) => ({ ...b, [accountMode]: b[accountMode] - investment }))
      setTrades((prev) => [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          assetCode: activeAsset.code,
          assetName: activeAsset.name,
          direction,
          investment,
          payout,
          currency,
          entryPrice,
          expiresAt,
          status: 'open',
          mode: accountMode,
          createdAt: Date.now(),
        },
        ...prev,
      ])
    },
    [activeAsset, investment, balance, accountMode, durationSec, timeMode, payout, currency, pushToast]
  )

  const deposit = useCallback((amount) => {
    setBalance((b) => ({ ...b, [accountMode]: b[accountMode] + amount }))
    setToast(null)
  }, [accountMode])

  const withdraw = useCallback((amount) => {
    setBalance((b) => {
      const next = Math.max(0, b[accountMode] - amount)
      return { ...b, [accountMode]: next }
    })
    setToast(null)
  }, [accountMode])

  const resetDemo = useCallback(() => {
    setBalance((b) => ({ ...b, demo: DEMO_BALANCE }))
    setToast({ id: Date.now(), message: 'Demo balance has been reset to 1,000.00' })
  }, [])

  const changeAccountCurrency = useCallback(() => {
    const next = accountCurrency === 'USD' ? 'EUR' : accountCurrency === 'EUR' ? 'GBP' : 'USD'
    setAccountCurrency(next)
    setCurrency(CURRENCY_SYMBOLS[next])
    setToast({ id: Date.now(), message: `Currency changed to ${next}` })
  }, [accountCurrency])

  const value = useMemo(
    () => ({
      tabs,
      addTab,
      removeTab,
      activeCode,
      setActiveCode,
      activeAsset,
      investment,
      setInvestment,
      currency,
      setCurrency,
      durationSec,
      setDurationSec,
      timeMode,
      setTimeMode,
      pendingToggle,
      setPendingToggle,
      payout,
      balance,
      accountMode,
      setAccountMode,
      accountCurrency,
      changeAccountCurrency,
      accountProfile: ACCOUNT_PROFILE,
      resetDemo,
      deposit,
      withdraw,
      openTrade,
      trades,
      openTrades,
      toast,
      pushToast,
      formatMoney,
      formatDuration,
    }),
    [
      tabs, addTab, removeTab, activeCode, activeAsset, investment, currency, durationSec,
      timeMode, pendingToggle, payout, balance, accountMode, accountCurrency, changeAccountCurrency,
      resetDemo, deposit, withdraw, openTrade, trades, openTrades, toast, pushToast,
    ]
  )

  return <TradeContext.Provider value={value}>{children}</TradeContext.Provider>
}

export function useTrade() {
  return useContext(TradeContext)
}
