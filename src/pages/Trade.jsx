import Sidebar from '../components/Sidebar.jsx'
import Navbar from '../components/Navbar.jsx'
import AssetTabs from '../components/AssetTabs.jsx'
import ChartArea from '../components/ChartArea.jsx'
import TradingPanel from '../components/TradingPanel.jsx'
import { useTrade } from '../trade/TradeContext.jsx'

export default function Trade() {
  const { toast } = useTrade()

  return (
    <div className="trade-root flex h-screen w-screen overflow-hidden bg-base text-white font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Navbar />
        <AssetTabs />
        <div className="flex flex-1 min-h-0">
          <ChartArea />
          <TradingPanel />
        </div>
      </div>

      {toast && (
        <div className="fixed top-16 right-1/2 translate-x-1/2 z-50 bg-card border border-line rounded-lg px-4 py-2.5 text-xs text-white shadow-lg shadow-black/50">
          {toast.message}
        </div>
      )}
    </div>
  )
}
