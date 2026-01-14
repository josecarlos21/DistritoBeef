import React, { useState, useEffect } from 'react';
import { cx, triggerHaptic } from './utils';
import { TabType, EventData, AmbienceState } from './types';
import { INITIAL_AMBIENCE } from './constants';
import { GlobalStyles } from './components/GlobalStyles';
import { CanvasBackground } from './components/atoms/CanvasBackground';
import { NavBar } from './components/organisms/Navigation';
import { AmbienceModal } from './components/molecules/AmbienceModal';
import { Onboarding } from './components/Onboarding';
import { Toast } from './components/molecules/Toast';
import { HomeView } from './components/views/HomeView';
import { ExploreView } from './components/views/ExploreView';
import { CalendarView } from './components/views/CalendarView';
import { WalletView } from './components/views/WalletView';
import { MapView } from './components/views/MapView';
import { EventDetail } from './components/molecules/EventDetail';
import { NotificationDrawer } from './components/molecules/NotificationDrawer';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LocaleProvider, useLocale } from './src/context/LocaleContext';

function AppContent() {
  const { t, locale, setLocale } = useLocale();
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  const [ambience, setAmbience] = useState<AmbienceState>(INITIAL_AMBIENCE);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Auth State from Context
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const [notification, setNotification] = useState<{ msg: string, type: 'info' | 'alert' } | null>(null);

  const handleTabChange = (tab: TabType) => {
    // Clear modals when changing main tabs
    setSelectedEvent(null);
    setActiveTab(tab);
  };

  // Simulate Real-time Notification Event
  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        triggerHaptic('medium');
        setNotification({ msg: t('toast.density'), type: "alert" });
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, t]);

  // Global Action Handlers
  const handleWeather = () => {
    triggerHaptic('light');
    setNotification({ msg: t('toast.weather'), type: "info" });
  };

  const handleNotifications = () => {
    triggerHaptic('medium');
    setIsNotifOpen(true);
  };

  const handleDirections = () => {
    triggerHaptic('medium');
    setNotification({ msg: t('toast.route'), type: "info" });
    setSelectedEvent(null);
    setActiveTab('map');
  };

  const handleConfig = () => {
    triggerHaptic('light');
    setIsConfigOpen(true);
  };

  const renderView = () => {
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
        return <WalletView
          userName={user?.name || "Invitado"}
          onOpenConfig={handleConfig}
          onLogout={logout}
        />;
      case "map":
        return <MapView />;
      default:
        return null;
    }
  };

  const toggleLocale = () => {
    setLocale(locale === 'es' ? 'en' : 'es');
  };

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
        <div className="absolute top-4 right-4 z-[120]">
          <button
            type="button"
            onClick={toggleLocale}
            className="px-3 py-2 rounded-2xl bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[.18em] text-white hover:bg-white/15 active:scale-95 transition"
            aria-label={t('lang.toggle')}
          >
            {locale === 'es' ? 'EN' : 'ES'}
          </button>
        </div>

        {/* Background Layers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-aurora-nebula" />
          <div className="absolute inset-0 bg-aurora-depth" />
          <div className="absolute inset-0 bg-aurora-glow" />
          <CanvasBackground ambience={ambience} />
          <div className="absolute inset-0 bg-vignette" />
        </div>

        {/* Auth / Onboarding Layer */}
        {isLoading ? null : !isAuthenticated ? (
          <Onboarding />
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
              {renderView()}
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

export default function App() {
  return (
    <LocaleProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LocaleProvider>
  );
}
