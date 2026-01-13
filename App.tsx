import React, { useState, useMemo, useEffect } from 'react';
import { cx, triggerHaptic } from './utils';
import { TabType, EventData, AmbienceState } from './types';
import { INITIAL_AMBIENCE } from './constants';
import { GlobalStyles } from './components/GlobalStyles';
import { CanvasBackground } from './components/CanvasBackground';
import { NavBar } from './components/Navigation';
import { AmbienceModal } from './components/AmbienceModal';
import { Onboarding } from './components/Onboarding';
import { Toast } from './components/UI';
import { HomeView } from './components/HomeView';
import { ExploreView } from './components/ExploreView';
import { CalendarView } from './components/CalendarView';
import { WalletView } from './components/WalletView';
import { MapView } from './components/MapView';
import { EventDetail } from './components/EventDetail';
import { NotificationDrawer } from './components/NotificationDrawer';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  
  const [ambience, setAmbience] = useState<AmbienceState>(INITIAL_AMBIENCE);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  // Auth & System State
  const [authenticated, setAuthenticated] = useState(false);
  const [notification, setNotification] = useState<{msg: string, type: 'info'|'alert'} | null>(null);

  const handleTabChange = (tab: TabType) => {
    // Clear modals when changing main tabs
    setSelectedEvent(null);
    setActiveTab(tab);
  };

  // Simulate Real-time Notification Event
  useEffect(() => {
    if (authenticated) {
      const timer = setTimeout(() => {
        triggerHaptic('medium');
        setNotification({ msg: "Blue Chairs: Alta densidad (85%) detectada.", type: "alert" });
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [authenticated]);

  // Global Action Handlers
  const handleWeather = () => {
    triggerHaptic('light');
    setNotification({ msg: "28°C Soleado • Humedad 65% • UV Alto", type: "info" });
  };

  const handleNotifications = () => {
    triggerHaptic('medium');
    setIsNotifOpen(true);
  };

  const handleDirections = () => {
    triggerHaptic('medium');
    setNotification({ msg: "Ruta calculada: 5 min caminando", type: "info" });
    setSelectedEvent(null);
    setActiveTab('map');
  };

  const handleConfig = () => {
    triggerHaptic('light');
    setIsConfigOpen(true);
  };

  const renderView = useMemo(() => {
    switch (activeTab) {
        case "home": 
            return <HomeView 
                onEventClick={setSelectedEvent} 
                onNavigate={setActiveTab} 
                onWeather={handleWeather}
                onNotifications={handleNotifications} 
            />;
        case "social": 
            return <ExploreView onEventClick={setSelectedEvent} />;
        case "calendar": 
            return <CalendarView 
                onEventClick={setSelectedEvent} 
                onOpenConfig={handleConfig} 
            />;
        case "wallet": 
            return <WalletView onOpenConfig={handleConfig} />;
        case "map": 
            return <MapView />;
        default: 
            return null;
    }
  }, [activeTab]);

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-black overflow-hidden font-sans">
      <GlobalStyles />
      <div 
        className={cx(
          "relative w-full h-full flex flex-col overflow-hidden",
          "sm:max-w-md sm:h-[844px] sm:rounded-[60px] sm:border-[12px] sm:border-zinc-900",
          "shadow-[0_0_140px_rgba(255,138,29,.10)]"
        )} 
        style={{ background: "var(--bg)" }}
      >
        {/* Background Layers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 18%, rgba(255,138,29,.12), rgba(0,0,0,0) 58%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 26% 72%, rgba(90,58,37,.20), rgba(0,0,0,0) 58%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 70% 68%, rgba(216,194,162,.06), rgba(0,0,0,0) 62%)" }} />
          <CanvasBackground ambience={ambience} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 68%, var(--vig), rgba(0,0,0,0) 62%)" }} />
        </div>

        {/* Auth / Onboarding Layer */}
        {!authenticated ? (
          <Onboarding onComplete={() => setAuthenticated(true)} />
        ) : (
          <>
            {/* System Notifications Toast */}
            {notification && (
              <Toast 
                message={notification.msg} 
                type={notification.type} 
                onClose={() => setNotification(null)} 
              />
            )}

            {/* Main Content Area - Header is now inside View */}
            <div className="relative flex-1 overflow-hidden z-0">
              {renderView}
            </div>

            {/* Navigation */}
            <NavBar activeTab={activeTab} setTab={handleTabChange} />

            {/* --- LAYERS & MODALS --- */}
            {selectedEvent && (
              <EventDetail 
                event={selectedEvent} 
                onClose={() => setSelectedEvent(null)} 
                onAction={handleDirections} 
              />
            )}

            <NotificationDrawer 
              open={isNotifOpen} 
              onClose={() => setIsNotifOpen(false)} 
            />

            <AmbienceModal 
              open={isConfigOpen} 
              onClose={() => setIsConfigOpen(false)} 
              ambience={ambience} 
              setAmbience={setAmbience} 
            />
          </>
        )}
      </div>
    </div>
  );
}