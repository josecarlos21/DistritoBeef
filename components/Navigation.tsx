
import React, { useMemo } from 'react';
import { Home, Calendar, Map as MapIcon, Wallet, User, SlidersHorizontal, MapPin, Music, Sparkles, Lock, CloudSun, Bell } from 'lucide-react';
import { TabType, EventData } from '../types';
import { GlassContainer, IconButton } from './UI';
import { cx, triggerHaptic } from '../utils';

// StatusBar
interface StatusBarProps {
  activeTab: TabType;
  event: EventData | null;
  onOpenConfig: () => void;
  onWeather: () => void;
  onNotifications: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({ activeTab, event, onOpenConfig, onWeather, onNotifications }) => {
  const isMap = activeTab === 'map';
  
  // Logic: Hide this global StatusBar if we are in Calendar or Social view, 
  // because those views have their own headers.
  if (['calendar', 'social'].includes(activeTab)) return null;

  const status = useMemo(() => {
    if (event) return { title: event.title, Icon: Music, color: "var(--o)" };
    switch (activeTab) {
      case "map": return { title: "Rastreo", Icon: MapPin, color: "var(--o)" };
      case "wallet": return { title: "ID Verificado", Icon: Lock, color: "var(--ok)" };
      case "social": return { title: "Distrito Vivo", Icon: Sparkles, color: "var(--s)" };
      default: return { title: "Puerto Vallarta", Icon: MapIcon, color: "var(--s)" };
    }
  }, [activeTab, event]);

  return (
    <div className="absolute top-4 left-0 w-full z-[80] pointer-events-none px-3 sm:px-4">
      {/* Inner Container: Handles Width and Alignment Transition */}
      <div 
        className={cx(
          "pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex",
          isMap ? "justify-end" : "justify-center"
        )}
      >
        <GlassContainer 
          strong 
          className={cx(
            "flex items-center justify-between p-2 h-[58px] transition-all duration-500 overflow-hidden shadow-2xl",
            isMap ? "w-[180px]" : "w-full"
          )}
        >
          {/* Left Side: Context Title (Collapses in Map Mode) */}
          <div className={cx(
            "flex items-center gap-2 overflow-hidden transition-all duration-500",
            isMap ? "w-0 opacity-0 -ml-4" : "w-auto opacity-100"
          )}>
             <IconButton 
                Icon={status.Icon} 
                color={status.color} 
                onClick={() => {}} 
                label={status.title} 
             />
             {/* We can add text here if needed, but icon is cleaner */}
          </div>

          {/* Right Side: Tools (Always Visible) */}
          <div className={cx("flex items-center gap-2 transition-all duration-500", isMap ? "ml-auto" : "")}>
             {isMap && (
               <div className="animate-in fade-in zoom-in-95 duration-500 delay-100">
                  <IconButton Icon={MapPin} color="var(--o)" onClick={() => {}} label="Map Context" />
               </div>
             )}

             <IconButton Icon={CloudSun} color="var(--o)" onClick={onWeather} label="Clima" />
             <IconButton Icon={Bell} onClick={onNotifications} label="Notificaciones" />
             <IconButton Icon={SlidersHorizontal} onClick={onOpenConfig} label="Ambiente" />
          </div>
        </GlassContainer>
      </div>
    </div>
  );
};

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
