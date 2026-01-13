
import React from 'react';
import { Home, Calendar, Map as MapIcon, Wallet, User } from 'lucide-react';
import { TabType } from '../types';
import { GlassContainer } from './UI';
import { cx, triggerHaptic } from '../utils';

// NavBar
interface NavBarProps {
  activeTab: TabType;
  setTab: (t: TabType) => void;
}

export const NavBar: React.FC<NavBarProps> = ({ activeTab, setTab }) => {
  const handleTabClick = (id: TabType) => {
    if (activeTab !== id) {
        triggerHaptic('light');
        setTab(id);
    }
  };

  const NavItem = ({ id, Icon }: { id: TabType; Icon: React.ElementType }) => {
    const active = activeTab === id;
    return (
      <button 
        onClick={() => handleTabClick(id)} 
        className={cx(
            "w-12 h-12 rounded-2xl flex items-center justify-center active:scale-95 transition-all duration-300", 
            active ? "bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]" : "hover:bg-white/5"
        )}
      >
        <Icon size={22} color={active ? "var(--o)" : "rgba(255,255,255,.45)"} strokeWidth={active ? 2.8 : 2.2} />
      </button>
    );
  };

  return (
    <div className="absolute bottom-6 sm:bottom-8 left-4 right-4 sm:left-6 sm:right-6 z-[90]">
      <GlassContainer strong className="h-20 px-4 flex items-center justify-between shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative z-10">
        <NavItem id="home" Icon={Home} />
        <NavItem id="calendar" Icon={Calendar} />
        
        {/* Floating Map Button - Needs to sit visually above */}
        <div className="relative -top-8 w-14 h-14">
            <button 
            onClick={() => handleTabClick("map")} 
            aria-label="Mapa" 
            className={cx(
                "absolute inset-0 w-14 h-14 rounded-[22px] border-4 flex items-center justify-center active:scale-95 transition-transform duration-300 shadow-[0_10px_30px_rgba(255,138,29,.35)]",
                activeTab === 'map' ? "scale-110" : ""
            )}
            style={{ background: "var(--o)", borderColor: "rgba(14, 12, 9, 1)" }}
            >
            <MapIcon size={24} color="#0E0C09" strokeWidth={2.8} />
            </button>
        </div>

        <NavItem id="social" Icon={User} />
        <NavItem id="wallet" Icon={Wallet} />
      </GlassContainer>
    </div>
  );
};
