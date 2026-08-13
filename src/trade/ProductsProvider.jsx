import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { API_BASE } from '../config.js'
import { setAssets, DEFAULT_ASSETS } from '../data/assets.js'
import { priceFeed } from './priceEngine.js'

const ProductsContext = createContext(null)

function toAsset(row) {
  return {
    code: row.code,
    name: row.name,
    basePrice: Number(row.basePrice),
    decimals: Number(row.decimals),
    volatility: Number(row.volatility),
    seed: Number(row.seed),
    enabled: row.enabled === undefined ? 1 : Number(row.enabled),
  }
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(DEFAULT_ASSETS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const mounted = useRef(true)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/products.php`, { cache: 'no-store' })
      if (!res.ok) throw new Error(`Products API returned ${res.status}`)
      const data = await res.json()
      const list = (Array.isArray(data.products) ? data.products : []).map(toAsset)
      if (!mounted.current) return
      setProducts(list)
      setAssets(list)
      priceFeed.syncEngines()
      setError(null)
    } catch (err) {
      if (mounted.current) setError(err.message)
    } finally {
      if (mounted.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    mounted.current = true
    load()
    return () => {
      mounted.current = false
    }
  }, [load])

  return (
    <ProductsContext.Provider value={{ products, loading, error, refresh: load }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  return useContext(ProductsContext)
}
