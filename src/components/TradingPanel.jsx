import { useEffect, useState } from 'react'
import { Box, Clock, ChevronRight } from 'lucide-react'
import { useTrade, formatDuration, formatMoney } from '../trade/TradeContext.jsx'
import { getFlags } from '../data/assets.js'
import { ArrowUpIcon, ArrowDownIcon } from './Icons.jsx'

const CURRENCIES = ['$', '€', '£']

export default function TradingPanel() {
  const {
    activeAsset,
    payout,
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
    openTrade,
    trades,
    openTrades,
    formatMoney,
  } = useTrade()

  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id)
  }, [])

  const adjustTime = (dir) => {
    const step = timeMode === 'sec' ? 5 : timeMode === 'min' ? 60 : 3600
    const max = timeMode === 'sec' ? 60 : timeMode === 'min' ? 1800 : 14400
    const min = timeMode === 'sec' ? 5 : timeMode === 'min' ? 60 : 3600
    setDurationSec((v) => Math.min(max, Math.max(min, v + dir * step)))
  }

  const switchTimeMode = () => {
    const next = timeMode === 'sec' ? 'min' : timeMode === 'min' ? 'hour' : 'sec'
    setTimeMode(next)
    setDurationSec(next === 'sec' ? 30 : next === 'min' ? 60 : 3600)
  }

  const adjustInvestment = (dir) => {
    setInvestment((v) => Math.min(100000, Math.max(1, v + dir * 100)))
  }

  const switchCurrency = () => {
    setCurrency(CURRENCIES[(CURRENCIES.indexOf(currency) + 1) % CURRENCIES.length])
  }

  const pending = openTrades[0] ?? null
  const remainingSec = pending ? Math.max(0, Math.ceil((pending.expiresAt - now) / 1000)) : 0
  const profit = investment * (1 + payout / 100)

  return (
    <div className="w-[300px] shrink-0 h-full bg-panel border-l border-line flex flex-col trade-panel">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg leading-none">{getFlags(activeAsset)}</span>
            <div className="leading-tight">
              <div className="text-[14px] font-bold text-white">{activeAsset.name}</div>
              <div className="text-[11px] font-bold text-up">{payout}% Payout</div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <button
              type="button"
              onClick={() => setPendingToggle((p) => !p)}
              className={`relative w-10 h-5 rounded-full transition-colors ${pendingToggle ? 'bg-up' : 'bg-card border border-line'}`}
              title="Pending trade"
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${pendingToggle ? 'left-[22px]' : 'left-0.5'}`}
              />
            </button>
            <span className="text-[9px] text-muted font-semibold">Pending trade</span>
          </div>
        </div>

        {pendingToggle && pending && (
          <div
            className={`flex items-center justify-between px-3 py-2 rounded-lg border ${
              pending.direction === 'up' ? 'bg-up/10 border-up/30' : 'bg-down/10 border-down/30'
            }`}
          >
            <span className="flex items-center gap-2 text-xs font-bold text-white">
              {pending.direction === 'up' ? <ArrowUpIcon size={14} /> : <ArrowDownIcon size={14} />}
              {pending.assetName}
            </span>
            <span className={`text-xs font-black tabular-nums ${pending.direction === 'up' ? 'text-up' : 'text-down'}`}>
              {formatDuration(remainingSec)}
            </span>
          </div>
        )}

        <div>
          <div className="text-[10px] font-bold text-muted tracking-widest mb-1.5">TIME</div>
          <div className="flex items-center gap-2 bg-card border border-line rounded-lg p-1.5">
            <button
              type="button"
              onClick={() => adjustTime(-1)}
              className="w-9 h-9 flex items-center justify-center text-white bg-[#0e131d] rounded-md hover:bg-[#1a2232] transition-colors"
            >
              −
            </button>
            <div className="flex-1 text-center text-[15px] font-bold text-white tabular-nums">
              {formatDuration(durationSec)}
            </div>
            <button
              type="button"
              onClick={() => adjustTime(1)}
              className="w-9 h-9 flex items-center justify-center text-white bg-[#0e131d] rounded-md hover:bg-[#1a2232] transition-colors"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={switchTimeMode}
            className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-up hover:text-white transition-colors"
          >
            SWITCH TIME <ChevronRight size={11} />
          </button>
        </div>

        <div>
          <div className="text-[10px] font-bold text-muted tracking-widest mb-1.5">INVESTMENT</div>
          <div className="flex items-center gap-2 bg-card border border-line rounded-lg p-1.5">
            <button
              type="button"
              onClick={() => adjustInvestment(-1)}
              className="w-9 h-9 flex items-center justify-center text-white bg-[#0e131d] rounded-md hover:bg-[#1a2232] transition-colors"
            >
              −
            </button>
            <div className="flex-1 text-center text-[15px] font-bold text-white tabular-nums">
              {formatMoney(investment, currency)}
            </div>
            <button
              type="button"
              onClick={() => adjustInvestment(1)}
              className="w-9 h-9 flex items-center justify-center text-white bg-[#0e131d] rounded-md hover:bg-[#1a2232] transition-colors"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={switchCurrency}
            className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-up hover:text-white transition-colors"
          >
            SWITCH <ChevronRight size={11} />
          </button>
        </div>

        <div className="flex items-center justify-between px-1">
          <span className="text-[12px] text-muted font-semibold">Payout</span>
          <span className="text-[13px] font-black text-up tabular-nums">{formatMoney(profit, currency)}</span>
        </div>

        <div className="flex flex-col gap-2 mt-1">
          <button
            type="button"
            onClick={() => openTrade('up')}
            className="flex items-center justify-between px-6 py-3.5 rounded-lg bg-up hover:brightness-110 text-white font-extrabold text-lg transition-colors"
          >
            <span className="flex items-center gap-2">
              Up
              <ArrowUpIcon size={20} />
            </span>
            <span className="text-sm font-bold opacity-90 tabular-nums">{formatMoney(investment, currency)}</span>
          </button>
          <button
            type="button"
            onClick={() => openTrade('down')}
            className="flex items-center justify-between px-6 py-3.5 rounded-lg bg-down hover:brightness-110 text-white font-extrabold text-lg transition-colors"
          >
            <span className="flex items-center gap-2">
              Down
              <ArrowDownIcon size={20} />
            </span>
            <span className="text-sm font-bold opacity-90 tabular-nums">{formatMoney(investment, currency)}</span>
          </button>
        </div>
      </div>

      <div className="shrink-0 border-t border-line bg-[#0e131d]">
        <div className="flex items-center justify-between px-4 py-2.5">
          <span className="text-[13px] font-bold text-white">Trades {trades.length}</span>
          <span className="flex items-center gap-1.5 text-[11px] text-muted font-semibold">
            <Clock size={14} /> {openTrades.length}
          </span>
        </div>
        <div className="max-h-52 overflow-y-auto">
          {trades.length === 0 ? (
            <div className="px-6 py-8 flex flex-col items-center text-center gap-3">
              <Box size={40} className="text-[#2a3648]" />
              <p className="text-[11px] text-muted leading-relaxed max-w-[210px]">
                You don&apos;t have a trade history yet. You can open a trade using the form above.
              </p>
            </div>
          ) : (
            <ul className="pb-2">
              {trades.slice(0, 30).map((t) => {
                const isOpen = t.status === 'open'
                const remaining = isOpen ? Math.max(0, Math.ceil((t.expiresAt - now) / 1000)) : 0
                const isWon = t.status === 'won'
                return (
                  <li key={t.id} className="flex items-center justify-between px-4 py-2 border-t border-[#1a2232]/60">
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`w-6 h-6 rounded flex items-center justify-center ${t.direction === 'up' ? 'bg-up/15 text-up' : 'bg-down/15 text-down'}`}
                      >
                        {t.direction === 'up' ? <ArrowUpIcon size={12} /> : <ArrowDownIcon size={12} />}
                      </span>
                      <span className="leading-tight">
                        <span className="block text-[11px] font-bold text-white">{t.assetName}</span>
                        <span className={`block text-[10px] font-semibold ${isOpen ? 'text-muted' : isWon ? 'text-up' : 'text-down'}`}>
                          {isOpen
                            ? `${formatDuration(remaining)} left`
                            : isWon
                              ? `+${formatMoney((t.investment * t.payout) / 100, t.currency)}`
                              : `-${formatMoney(t.investment, t.currency)}`}
                        </span>
                      </span>
                    </span>
                    <span className={`text-[11px] font-bold tabular-nums ${isOpen ? 'text-muted' : isWon ? 'text-up' : 'text-down'}`}>
                      {isOpen ? 'OPEN' : isWon ? 'WIN' : 'LOSS'}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
