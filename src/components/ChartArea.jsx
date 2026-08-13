import { useEffect, useRef, useState } from 'react'
import {
  createChart,
  ColorType,
  CrosshairMode,
  LineStyle,
  CandlestickSeries,
  LineSeries,
} from 'lightweight-charts'
import { priceFeed, generateCandles, formatPrice } from '../trade/priceEngine.js'
import { useTrade } from '../trade/TradeContext.jsx'
import { getAsset } from '../data/assets.js'
import { Pencil, ChartCandlestick, Activity, Plus, Minus } from 'lucide-react'

const TIMEFRAMES = ['1m', '5m', '15m', '30m', '1h', '4h', '1d']
const CHART_TYPES = ['Candlestick', 'Line']
const INDICATORS = ['EMA 50', 'EMA 200', 'Bollinger Bands', 'MACD', 'RSI']

export default function ChartArea() {
  const { activeCode, openTrades } = useTrade()
  const containerRef = useRef(null)
  const startLineRef = useRef(null)
  const endLineRef = useRef(null)
  const chartRef = useRef(null)
  const seriesRef = useRef(null)
  const priceLineRef = useRef(null)
  const dataRef = useRef([])
  const currentRef = useRef(null)
  const typeRef = useRef('candle')
  const barSpacingRef = useRef(9)
  const pendingRef = useRef(null)
  const assetRef = useRef(getAsset(activeCode))

  const [tf, setTf] = useState('1m')
  const [chartType, setChartType] = useState('candle')
  const [tool, setTool] = useState('draw')
  const [indicator, setIndicator] = useState('EMA 50')
  const [menu, setMenu] = useState(null)
  const [ohlc, setOhlc] = useState({ open: 0, close: 0, high: 0, low: 0 })

  assetRef.current = getAsset(activeCode)
  typeRef.current = chartType
  pendingRef.current = openTrades[0] ?? null

  const positionTradeLines = () => {
    const chart = chartRef.current
    const t = pendingRef.current
    if (!chart || !startLineRef.current || !endLineRef.current) return
    if (!t) {
      startLineRef.current.style.display = 'none'
      endLineRef.current.style.display = 'none'
      return
    }
    const width = containerRef.current?.clientWidth ?? 0
    const xStart = chart.timeScale().timeToCoordinate(Math.floor(t.createdAt / 1000))
    const xEnd = chart.timeScale().timeToCoordinate(Math.floor(t.expiresAt / 1000))
    for (const [el, x] of [
      [startLineRef.current, xStart],
      [endLineRef.current, xEnd],
    ]) {
      if (x != null && x >= 0 && x <= width) {
        el.style.display = 'block'
        el.style.left = `${x}px`
      } else {
        el.style.display = 'none'
      }
    }
  }

  const ensureSeries = (chart, type) => {
    if (seriesRef.current) {
      try {
        chart.removeSeries(seriesRef.current)
      } catch {
        /* noop */
      }
    }
    if (type === 'line') {
      seriesRef.current = chart.addSeries(LineSeries, {
        color: '#00c974',
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      })
      seriesRef.current.setData(dataRef.current.map((c) => ({ time: c.time, value: c.close })))
    } else {
      seriesRef.current = chart.addSeries(CandlestickSeries, {
        upColor: '#00c974',
        downColor: '#f24949',
        borderVisible: false,
        wickUpColor: '#00c974',
        wickDownColor: '#f24949',
        priceLineVisible: false,
        lastValueVisible: false,
      })
      seriesRef.current.setData(dataRef.current)
    }
    const last = currentRef.current?.close ?? dataRef.current[dataRef.current.length - 1]?.close ?? 0
    priceLineRef.current = seriesRef.current.createPriceLine({
      price: last,
      color: '#0073e6',
      lineWidth: 2,
      lineStyle: LineStyle.SparseDotted,
      axisLabelVisible: true,
      title: '',
    })
  }

  const applyTick = (price) => {
    const chart = chartRef.current
    if (!chart) return
    const sec = Math.floor(Date.now() / 1000)
    let c = currentRef.current
    if (!c || c.time !== sec) {
      const prevClose = c?.close ?? price
      c = { time: sec, open: prevClose, high: Math.max(prevClose, price), low: Math.min(prevClose, price), close: price }
      currentRef.current = c
      dataRef.current.push(c)
      if (dataRef.current.length > 240) dataRef.current = dataRef.current.slice(-240)
    } else {
      c.close = price
      c.high = Math.max(c.high, price)
      c.low = Math.min(c.low, price)
    }
    if (typeRef.current === 'line') {
      seriesRef.current?.update({ time: c.time, value: price })
    } else {
      seriesRef.current?.update(c)
    }
    priceLineRef.current?.applyOptions({ price })
    setOhlc({ open: c.open, close: c.close, high: c.high, low: c.low })
    positionTradeLines()
  }

  useEffect(() => {
    const asset = assetRef.current
    const chart = createChart(containerRef.current, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: '#0b0e14' },
        textColor: '#7b8b9a',
        fontFamily: 'Roboto, sans-serif',
        fontSize: 11,
      },
      grid: {
        vertLines: { color: 'rgba(42,54,72,0.28)' },
        horzLines: { color: 'rgba(42,54,72,0.28)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: '#2a3648', labelBackgroundColor: '#161d2b' },
        horzLine: { color: '#2a3648', labelBackgroundColor: '#161d2b' },
      },
      rightPriceScale: { borderColor: '#1a2232', scaleMargins: { top: 0.08, bottom: 0.12 } },
      timeScale: {
        borderColor: '#1a2232',
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 10,
        barSpacing: barSpacingRef.current,
      },
      handleScroll: true,
      handleScale: true,
    })
    chartRef.current = chart

    const { candles, lastPrice } = generateCandles(asset, 120, Date.now())
    dataRef.current = candles
    currentRef.current = candles[candles.length - 1]
    setOhlc({ open: candles[candles.length - 1].open, close: lastPrice, high: candles[candles.length - 1].high, low: candles[candles.length - 1].low })
    ensureSeries(chart, typeRef.current)
    chart.timeScale().applyOptions({ barSpacing: barSpacingRef.current })
    chart.timeScale().scrollToRealTime()

    const unsub = priceFeed.subscribe((snap) => {
      const price = snap[asset.code]
      if (price) applyTick(price)
    })

    return () => {
      unsub()
      try {
        chart.remove()
      } catch {
        /* noop */
      }
      chartRef.current = null
      seriesRef.current = null
      priceLineRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCode])

  useEffect(() => {
    if (!chartRef.current) return
    ensureSeries(chartRef.current, chartType)
    chartRef.current.timeScale().scrollToRealTime()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartType])

  useEffect(() => {
    positionTradeLines()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openTrades])

  const zoom = (factor) => {
    barSpacingRef.current = Math.min(40, Math.max(3, barSpacingRef.current * factor))
    chartRef.current?.timeScale().applyOptions({ barSpacing: barSpacingRef.current })
  }

  const asset = assetRef.current
  const isUp = ohlc.close >= ohlc.open

  return (
    <div className="flex-1 h-full relative min-w-0 bg-base">
      <div ref={containerRef} className="absolute inset-0 chart-canvas" />

      <div className="absolute left-3 top-3 z-20 flex flex-col gap-0.5 bg-panel/95 border border-line rounded-lg p-1 shadow-lg shadow-black/40">
        <div className="relative">
          <button
            type="button"
            title="Drawing tool"
            onClick={() => setTool(tool === 'draw' ? null : 'draw')}
            className={`btn-icon ${tool === 'draw' ? 'btn-icon-active' : ''}`}
          >
            <Pencil size={16} />
          </button>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenu(menu === 'tf' ? null : 'tf')}
            className={`btn-icon text-[11px] font-bold ${menu === 'tf' ? 'btn-icon-active' : ''}`}
            title="Timeframe"
          >
            {tf}
          </button>
          {menu === 'tf' && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setMenu(null)} />
              <div className="menu-pop left-0">
                {TIMEFRAMES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setTf(t)
                      setMenu(null)
                      barSpacingRef.current = 9
                      chartRef.current?.timeScale().applyOptions({ barSpacing: 9 })
                    }}
                    className={`menu-pop-item ${t === tf ? 'text-white bg-panel' : ''}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="relative">
          <button
            type="button"
            title="Chart type"
            onClick={() => setMenu(menu === 'type' ? null : 'type')}
            className={`btn-icon ${menu === 'type' ? 'btn-icon-active' : ''}`}
          >
            <ChartCandlestick size={16} />
          </button>
          {menu === 'type' && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setMenu(null)} />
              <div className="menu-pop left-0">
                {CHART_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setChartType(t === 'Line' ? 'line' : 'candle')
                      setMenu(null)
                    }}
                    className={`menu-pop-item ${(t === 'Line' ? 'line' : 'candle') === chartType ? 'text-white bg-panel' : ''}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="relative">
          <button
            type="button"
            title="Indicators"
            onClick={() => setMenu(menu === 'ind' ? null : 'ind')}
            className={`btn-icon ${menu === 'ind' ? 'btn-icon-active' : ''}`}
          >
            <Activity size={16} />
          </button>
          {menu === 'ind' && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setMenu(null)} />
              <div className="menu-pop left-0">
                {INDICATORS.map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setIndicator(i)
                      setMenu(null)
                    }}
                    className={`menu-pop-item ${i === indicator ? 'text-up' : ''}`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        {indicator && (
          <div className="px-2 py-1 text-[9px] font-bold text-up bg-up/10 rounded mt-0.5 text-center">
            {indicator}
          </div>
        )}
      </div>

      <div className="absolute top-3 right-3 z-20 bg-panel/80 backdrop-blur border border-line rounded-lg px-2.5 py-1.5 tabular-nums live-price">
        <span className={`text-[13px] font-black ${isUp ? 'text-up' : 'text-down'}`}>
          {formatPrice(asset, ohlc.close)}
        </span>
        <span className={`ml-1.5 text-[10px] font-bold ${isUp ? 'text-up' : 'text-down'}`}>
          {isUp ? '▲' : '▼'}
        </span>
      </div>

      <div className="absolute bottom-12 left-3 z-10 bg-panel/85 backdrop-blur border border-line rounded-lg px-3 py-2 text-[11px] tabular-nums">
        <div className="grid grid-cols-2 gap-x-5 gap-y-0.5">
          <div className="flex gap-2"><span className="text-muted">Open:</span><span className="text-white">{formatPrice(asset, ohlc.open)}</span></div>
          <div className="flex gap-2"><span className="text-muted">Close:</span><span className="text-white">{formatPrice(asset, ohlc.close)}</span></div>
          <div className="flex gap-2"><span className="text-muted">High:</span><span className="text-up">{formatPrice(asset, ohlc.high)}</span></div>
          <div className="flex gap-2"><span className="text-muted">Low:</span><span className="text-down">{formatPrice(asset, ohlc.low)}</span></div>
        </div>
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-panel/95 border border-line rounded-lg p-1 shadow-lg shadow-black/40">
        <button type="button" title="Zoom out" onClick={() => zoom(0.8)} className="btn-icon">
          <Minus size={16} />
        </button>
        <button type="button" title="Zoom in" onClick={() => zoom(1.25)} className="btn-icon">
          <Plus size={16} />
        </button>
      </div>

      <div
        ref={startLineRef}
        className="absolute top-0 bottom-0 z-10 hidden border-l border-dashed border-[#0073e6] pointer-events-none"
      >
        <span className="absolute top-1 left-1 bg-[#0073e6] text-white text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap">
          Beginning of trade
        </span>
      </div>
      <div
        ref={endLineRef}
        className="absolute top-0 bottom-0 z-10 hidden border-l border-dashed border-[#f24949] pointer-events-none"
      >
        <span className="absolute top-1 left-1 bg-down text-white text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap">
          End of trade
        </span>
      </div>
    </div>
  )
}
