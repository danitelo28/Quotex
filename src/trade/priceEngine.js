import { getEnabledAssets, getAsset } from '../data/assets.js'

export function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

class PriceFeed {
  constructor() {
    this.engines = new Map()
    this.prices = new Map()
    this.prevPrices = new Map()
    this.listeners = new Set()
    this.timer = null
    this.tickMs = 250

    for (const asset of getEnabledAssets()) {
      const rnd = mulberry32(asset.seed)
      this.engines.set(asset.code, { rnd, price: asset.basePrice })
      this.prices.set(asset.code, asset.basePrice)
      this.prevPrices.set(asset.code, asset.basePrice)
    }
  }

  syncEngines() {
    const active = new Set(getEnabledAssets().map((a) => a.code))
    for (const code of [...this.engines.keys()]) {
      if (!active.has(code)) {
        this.engines.delete(code)
        this.prices.delete(code)
        this.prevPrices.delete(code)
      }
    }
    for (const asset of getEnabledAssets()) {
      if (this.engines.has(asset.code)) continue
      const rnd = mulberry32(asset.seed)
      this.engines.set(asset.code, { rnd, price: asset.basePrice })
      this.prices.set(asset.code, asset.basePrice)
      this.prevPrices.set(asset.code, asset.basePrice)
    }
  }

  start() {
    if (this.timer) return
    this.timer = setInterval(() => this.tick(), this.tickMs)
  }

  stop() {
    if (this.timer) clearInterval(this.timer)
    this.timer = null
  }

  tick() {
    for (const asset of getEnabledAssets()) {
      let eng = this.engines.get(asset.code)
      if (!eng) {
        eng = { rnd: mulberry32(asset.seed), price: asset.basePrice }
        this.engines.set(asset.code, eng)
        this.prices.set(asset.code, asset.basePrice)
        this.prevPrices.set(asset.code, asset.basePrice)
      }
      const vol = asset.volatility / 100
      const drift = (eng.rnd() - 0.495) * 2 * vol
      const wave = Math.sin(eng.rnd() * Math.PI * 2 + performance.now() / 20000) * vol * 0.35
      eng.price = Math.max(eng.price * (1 + drift + wave), asset.basePrice * 0.05)
      this.prevPrices.set(asset.code, this.prices.get(asset.code))
      this.prices.set(asset.code, eng.price)
    }
    this.listeners.forEach((fn) => fn(this.getSnapshot()))
  }

  getPrice(code) {
    return this.prices.get(code) ?? getAsset(code).basePrice
  }

  getChange(code) {
    const asset = getAsset(code)
    const prev = this.prevPrices.get(code) ?? asset.basePrice
    const price = this.prices.get(code) ?? asset.basePrice
    return ((price - prev) / prev) * 100
  }

  getSnapshot() {
    const snap = {}
    for (const asset of getEnabledAssets()) {
      snap[asset.code] = this.prices.get(asset.code)
    }
    return snap
  }

  subscribe(fn) {
    this.listeners.add(fn)
    fn(this.getSnapshot())
    return () => this.listeners.delete(fn)
  }
}

export const priceFeed = new PriceFeed()
priceFeed.start()

export function generateCandles(asset, count, now) {
  const rnd = mulberry32(asset.seed ^ 0x9e3779b9)
  const vol = asset.volatility / 100
  let price = asset.basePrice * (1 - vol * 3)
  const candles = []
  const stepMs = 1000
  const baseTime = Math.floor((now ?? Date.now()) / 1000)
  let open = price

  for (let i = 0; i < count; i++) {
    const t = baseTime - (count - i) * stepMs
    const moves = 4
    let hi = open
    let lo = open
    let close = open
    for (let m = 0; m < moves; m++) {
      const drift = (rnd() - 0.5) * 2 * vol * 0.12
      close = Math.max(open * (1 - vol), close * (1 + drift))
      hi = Math.max(hi, close)
      lo = Math.min(lo, close)
    }
    candles.push({ time: t, open: round(open), high: round(hi), low: round(lo), close: round(close) })
    open = close
  }

  return { candles, lastPrice: open }
}

function round(v) {
  return Math.round(v * 100000) / 100000
}

export function formatPrice(asset, price) {
  return price.toLocaleString('en-US', {
    minimumFractionDigits: asset.decimals,
    maximumFractionDigits: asset.decimals,
  })
}

export function formatChange(change) {
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(2)}%`
}
