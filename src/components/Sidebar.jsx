import { useState } from 'react'
import {
  Menu,
  Plus,
  HelpCircle,
  User,
  Trophy,
  MoreHorizontal,
  Maximize2,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { useTrade } from '../trade/TradeContext.jsx'
import { FacebookIcon, InstagramIcon } from './Icons.jsx'

export default function Sidebar() {
  const { activeCode, setActiveCode, addTab } = useTrade()
  const [muted, setMuted] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [expandedItem, setExpandedItem] = useState('trade')

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      document.documentElement.requestFullscreen?.()
    }
  }

  const quickTrade = () => {
    addTab(activeCode)
    setExpandedItem('trade')
  }

  const NavButton = ({ id, children, onClick, title, badge }) => (
    <button
      type="button"
      title={title}
      onClick={() => {
        setExpandedItem(id)
        onClick?.()
      }}
      className={`relative flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
        expandedItem === id
          ? 'bg-[#0073e6] text-white'
          : 'text-[#7b8b9a] hover:text-white hover:bg-[#161d2b]'
      }`}
    >
      {children}
      {badge != null && (
        <span className="absolute -top-1 -right-1 min-w-4 h-4 px-0.5 rounded-full bg-[#0073e6] text-[9px] font-bold text-white flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  )

  return (
    <aside
      className={`${collapsed ? 'w-0 border-r-0' : 'w-[65px] border-r border-line'} h-screen bg-panel flex flex-col justify-between items-center py-3 transition-all overflow-hidden shrink-0`}
    >
      <div className="flex flex-col items-center gap-1">
        <button
          type="button"
          title="Menu"
          onClick={() => setCollapsed((c) => !c)}
          className="btn-icon mb-2"
        >
          <Menu size={20} />
        </button>

        <div className="relative w-10">
          <NavButton id="trade" title="Trade" onClick={() => setExpandedItem('trade')}>
            <span className="text-[13px] font-bold tracking-tight">A</span>
          </NavButton>
          <span className="absolute left-[-13px] top-1/2 -translate-y-1/2 w-1 h-8 bg-up rounded-r" />
        </div>

        <button
          type="button"
          title="Quick trade (+50% bonus)"
          onClick={quickTrade}
          className={`flex flex-col items-center justify-center w-10 h-10 rounded-lg transition-colors ${
            expandedItem === 'plus'
              ? 'bg-[#0073e6] text-white'
              : 'text-[#7b8b9a] hover:text-white hover:bg-[#161d2b]'
          }`}
        >
          <Plus size={20} />
          <span className="text-[9px] font-bold text-up leading-none -mt-0.5">50%</span>
        </button>

        <NavButton id="support" title="Support">
          <HelpCircle size={20} />
        </NavButton>
        <NavButton id="account" title="Account">
          <User size={20} />
        </NavButton>
        <NavButton id="tournaments" title="Tournaments" badge="4">
          <Trophy size={20} />
        </NavButton>
        <NavButton id="more" title="More">
          <MoreHorizontal size={20} />
        </NavButton>
      </div>

      <div className="flex flex-col items-center gap-3">
        <button type="button" title="Fullscreen" onClick={toggleFullscreen} className="btn-icon">
          <Maximize2 size={19} />
        </button>
        <button
          type="button"
          title={muted ? 'Unmute' : 'Mute'}
          onClick={() => setMuted((m) => !m)}
          className="btn-icon"
        >
          {muted ? <VolumeX size={19} /> : <Volume2 size={19} />}
        </button>
        <button
          type="button"
          title="Join us"
          className="flex flex-col items-center justify-center gap-1.5 text-[#7b8b9a] hover:text-white transition-colors"
        >
          <FacebookIcon size={18} />
          <InstagramIcon size={18} />
          <span className="text-[8px] tracking-widest font-bold">JOIN US</span>
        </button>
        <button
          type="button"
          title="Help"
          className="w-10 h-10 rounded-full bg-up text-white font-bold text-sm hover:bg-uphover transition-colors"
        >
          ?
        </button>
      </div>
    </aside>
  )
}
