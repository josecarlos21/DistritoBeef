
import React from 'react';
import { Home, Calendar, Map as MapIcon, Wallet, User, Compass } from 'lucide-react';
import { TabType } from '@/types';
import { GlassContainer } from '../atoms';
import { cx, triggerHaptic } from '@/utils';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';

// NavBar
interface NavBarProps {
  activeTab: TabType;
  setTab: (t: TabType) => void;
}

// Helper Component for NavItem
interface NavItemProps {
  id: TabType;
  Icon: React.ElementType;
  isActive: boolean;
  onClick: (id: TabType) => void;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ id, Icon, isActive, onClick, label }) => {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
      onClick={() => onClick(id)}
      className={cx(
        "w-12 h-12 rounded-2xl flex items-center justify-center active:scale-95 transition-all duration-300",
        isActive ? "bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]" : "hover:bg-white/5"
      )}
    >
      <Icon size={22} className={cx(isActive ? "text-o" : "text-white/45")} strokeWidth={isActive ? 2.8 : 2.2} />
    </button>
  );
};

export const NavBar: React.FC<NavBarProps> = ({ activeTab, setTab }) => {
  const { t } = useLocale();

  const handleTabClick = (id: TabType) => {
    if (activeTab !== id) {
      triggerHaptic('light');
      setTab(id);
    }
  };

  return (
    <div className="absolute bottom-6 sm:bottom-8 left-4 right-4 sm:left-6 sm:right-6 z-[90]">
      <GlassContainer strong className="h-20 px-4 flex items-center justify-between shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative z-10">
        <NavItem id="home" Icon={Home} label={t('nav.home', 'Home')} isActive={activeTab === 'home'} onClick={handleTabClick} />
        <NavItem id="calendar" Icon={Calendar} label={t('nav.calendar', 'Agenda')} isActive={activeTab === 'calendar'} onClick={handleTabClick} />

        {/* Floating Map Button - Needs to sit visually above */}
        <div className="relative -top-8 w-14 h-14">
          <button
            type="button"
            onClick={() => handleTabClick("map")}
            aria-label={t('nav.map', 'Mapa')}
            title={t('nav.map', 'Mapa')}
            className={cx(
              "absolute inset-0 w-14 h-14 rounded-[22px] border-4 flex items-center justify-center active:scale-95 transition-transform duration-300 shadow-[0_10px_30px_rgba(255,138,29,.35)] nav-map-btn",
              activeTab === 'map' ? "scale-110" : ""
            )}
          >
            <MapIcon size={24} className="text-[#0E0C09]" strokeWidth={2.8} />
          </button>
        </div>

        <NavItem id="explore" Icon={Compass} label={t('nav.explore', 'Explorar')} isActive={activeTab === 'explore'} onClick={handleTabClick} />
        {useAuth().isAuthenticated && (
          <NavItem id="wallet" Icon={Wallet} label={t('nav.wallet', 'Wallet')} isActive={activeTab === 'wallet'} onClick={handleTabClick} />
        )}
      </GlassContainer>
    </div>
  );
};
