export const DEFAULT_ASSETS = [
  { code: 'EURCHF', name: 'EUR/CHF (OTC)', basePrice: 0.9735, decimals: 5, volatility: 0.012, seed: 11 },
  { code: 'GBPUSD', name: 'GBP/USD (OTC)', basePrice: 1.2712, decimals: 5, volatility: 0.02, seed: 12 },
  { code: 'USDJPY', name: 'USD/JPY (OTC)', basePrice: 147.82, decimals: 3, volatility: 0.02, seed: 13 },
  { code: 'EURUSD', name: 'EUR/USD (OTC)', basePrice: 1.0843, decimals: 5, volatility: 0.018, seed: 14 },
  { code: 'AUDUSD', name: 'AUD/USD (OTC)', basePrice: 0.6581, decimals: 5, volatility: 0.02, seed: 15 },
  { code: 'USDCAD', name: 'USD/CAD (OTC)', basePrice: 1.3549, decimals: 5, volatility: 0.016, seed: 16 },
  { code: 'USDCHF', name: 'USD/CHF (OTC)', basePrice: 0.8812, decimals: 5, volatility: 0.016, seed: 17 },
  { code: 'USDINR', name: 'USD/INR (OTC)', basePrice: 83.12, decimals: 3, volatility: 0.012, seed: 18 },
  { code: 'XAUUSD', name: 'Gold', basePrice: 2324.6, decimals: 2, volatility: 0.025, seed: 19 },
  { code: 'XAGUSD', name: 'Silver', basePrice: 27.42, decimals: 3, volatility: 0.035, seed: 20 },
  { code: 'BTCUSD', name: 'Bitcoin', basePrice: 64820, decimals: 2, volatility: 0.15, seed: 21 },
  { code: 'ETHUSD', name: 'Ethereum', basePrice: 3420.5, decimals: 2, volatility: 0.16, seed: 22 },
]

let ASSETS = [...DEFAULT_ASSETS]

export { ASSETS }

export function setAssets(list) {
  ASSETS = Array.isArray(list) ? list : []
}

export function getAllAssets() {
  return ASSETS
}

export function getEnabledAssets() {
  return ASSETS.filter((a) => a.enabled !== 0)
}

export const FLAGS = {
  EUR: '🇪🇺',
  CHF: '🇨🇭',
  USD: '🇺🇸',
  GBP: '🇬🇧',
  JPY: '🇯🇵',
  AUD: '🇦🇺',
  CAD: '🇨🇦',
  INR: '🇮🇳',
  XAU: '🥇',
  XAG: '🥈',
  BTC: '₿',
  ETH: '⟠',
}

export const getFlags = (asset) => {
  const base = asset.code.slice(0, 3)
  const quote = asset.code.slice(3, 6)
  return `${FLAGS[base] ?? '🌐'}${FLAGS[quote] ?? ''}`
}

export const getAsset = (code) => ASSETS.find((a) => a.code === code) || DEFAULT_ASSETS[0]
