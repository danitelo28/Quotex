import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  ChevronDown,
  Plus,
  RefreshCcw,
  Rocket,
  Send,
  Wallet,
  CreditCard,
  ListChecks,
  UserCog,
  LogOut,
  HelpCircle,
} from 'lucide-react'
import { useTrade } from '../trade/TradeContext.jsx'

function QuotexMark({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="qx-nav-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00c974" />
          <stop offset="100%" stopColor="#00b368" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="9" fill="#0b0e14" />
      <text x="20" y="28" textAnchor="middle" fontFamily="Roboto, sans-serif" fontWeight="900" fontSize="22" fill="url(#qx-nav-grad)">
        Q
      </text>
    </svg>
  )
}

function AccountRow({ selected, onClick, label, balance, formatted, onReset }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg border border-line bg-card/60 hover:bg-card transition-colors text-left"
    >
      <span
        className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
          selected ? 'border-[#00c974]' : 'border-[#2a3648]'
        }`}
      >
        {selected && <span className="w-2 h-2 rounded-full bg-[#00c974]" />}
      </span>
      <span className="flex-1 leading-tight">
        <span className={`block text-[11px] font-bold ${selected ? 'text-white' : 'text-muted'}`}>{label}</span>
        <span className="block text-[13px] font-black tabular-nums text-white">{formatted}</span>
      </span>
      {onReset && (
        <span
          role="button"
          tabIndex={0}
          title="Reset demo balance"
          onClick={(e) => {
            e.stopPropagation()
            onReset()
          }}
          className="p-1 rounded text-muted hover:text-white hover:bg-[#0e131d] transition-colors"
        >
          <RefreshCcw size={13} />
        </span>
      )}
    </button>
  )
}

export default function Navbar() {
  const {
    balance,
    formatMoney,
    accountMode,
    setAccountMode,
    accountCurrency,
    changeAccountCurrency,
    accountProfile,
    resetDemo,
  } = useTrade()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const close = () => setMenuOpen(false)
  const doDeposit = () => close()
  const doWithdraw = () => close()
  const doLogout = () => {
    close()
    navigate('/')
  }

  const quickLinks = [
    { label: 'Deposit', icon: <Send size={14} />, onClick: doDeposit },
    { label: 'Withdrawal', icon: <Wallet size={14} />, onClick: doWithdraw },
    { label: 'Payments', icon: <CreditCard size={14} />, onClick: close },
    { label: 'Trades', icon: <ListChecks size={14} />, onClick: close },
    { label: 'My account', icon: <UserCog size={14} />, onClick: close },
  ]

  const isDemo = accountMode === 'demo'

  return (
    <header className="h-[55px] shrink-0 bg-panel border-b border-line px-4 flex items-center justify-between">
      <div className="flex items-center gap-2.5 min-w-0">
        <QuotexMark />
        <div className="leading-none">
          <div className="text-[15px] font-black tracking-wide text-white">QUOTEX</div>
          <div className="text-[9px] text-muted font-semibold tracking-[0.2em]">WEB TRADING PLATFORM</div>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-2 bg-pill border border-up/30 rounded-full px-3.5 py-1.5">
        <Rocket size={13} className="text-up" />
        <span className="text-up text-xs font-medium">Get a 50% bonus on your deposit!</span>
        <span className="bg-up text-[#0b0e14] text-[10px] font-black px-1.5 py-0.5 rounded">50%</span>
      </div>

      <div className="flex items-center gap-2">
        <button type="button" title="Notifications" className="relative btn-icon">
          <Bell size={19} />
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-down" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2.5 bg-[#062d1b] hover:bg-[#0a3d25] border border-[#00c853] rounded-[10px] px-3.5 py-2 transition-colors"
          >
            <Send size={15} className="text-[#00e676]" />
            <span className="leading-tight text-left">
              <span className="block text-[10px] text-[#00e676] font-black tracking-wide">
                {isDemo ? 'DEMO ACCOUNT' : 'LIVE ACCOUNT'}
              </span>
              <span className="block text-[13px] font-black text-white tabular-nums leading-tight">
                {formatMoney(balance[accountMode])}
              </span>
            </span>
            <ChevronDown size={14} className={`text-[#00e676] transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={close} />
              <div className="absolute z-50 right-0 top-full mt-2 rounded-xl overflow-hidden shadow-2xl shadow-black/60 border border-line flex">
                <div className="w-[292px] bg-[#0e131d] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 bg-up/15 text-up text-[10px] font-black tracking-widest px-2 py-1 rounded">
                      {accountProfile.badge}
                    </span>
                    <HelpCircle size={14} className="text-muted" />
                  </div>

                  <div className="text-[12px] font-semibold text-white truncate">{accountProfile.email}</div>
                  <div className="text-[11px] text-muted font-medium">ID: {accountProfile.id}</div>

                  <div className="flex items-center gap-1.5 text-[12px]">
                    <span className="text-muted font-medium">Currency:</span>
                    <span className="text-white font-bold">{accountCurrency}</span>
                    <button
                      type="button"
                      onClick={changeAccountCurrency}
                      className="text-up font-bold hover:text-white transition-colors"
                    >
                      [CHANGE]
                    </button>
                  </div>

                  <div className="space-y-2 pt-1">
                    <AccountRow
                      selected={!isDemo}
                      onClick={() => setAccountMode('live')}
                      label="Live Account"
                      formatted={formatMoney(balance.live)}
                    />
                    <AccountRow
                      selected={isDemo}
                      onClick={() => setAccountMode('demo')}
                      label="Demo Account"
                      formatted={formatMoney(balance.demo)}
                      onReset={resetDemo}
                    />
                  </div>
                </div>

                <div className="w-[168px] bg-[#161d2b] py-2 flex flex-col border-l border-line">
                  {quickLinks.map((l) => (
                    <button
                      key={l.label}
                      type="button"
                      onClick={l.onClick}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-left text-[12px] font-semibold text-muted hover:text-white hover:bg-panel transition-colors"
                    >
                      <span className="text-up">{l.icon}</span>
                      {l.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={doLogout}
                    className="flex items-center gap-2.5 px-4 py-2.5 mt-1 text-left text-[12px] font-bold text-down bg-down/10 hover:bg-down/20 border-t border-line transition-colors"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 bg-up hover:bg-uphover text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <Plus size={15} />
          Deposit
        </button>
        <button
          type="button"
          className="bg-withdraw hover:bg-card text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Withdrawal
        </button>
      </div>
    </header>
  )
}
