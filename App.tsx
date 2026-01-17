import React, { useState, Suspense } from 'react';
import { cx, triggerHaptic } from './src/utils';
import { TabType, EventData, AmbienceState } from './src/types';
import { INITIAL_AMBIENCE } from './constants';
import { GlobalStyles } from './components/GlobalStyles';
import { GlobalErrorBoundary } from './components/molecules/GlobalErrorBoundary';
import { MetaHead } from './components/atoms/MetaHead';
import { CanvasBackground } from './components/atoms/CanvasBackground';
import { NavBar } from './components/organisms/Navigation';
import { AmbienceModal } from './components/molecules/AmbienceModal';
import { Onboarding } from './components/views/OnboardingView';
import { Toast } from './components/molecules/Toast';
import { NotificationDrawer } from './components/molecules/NotificationDrawer';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LocaleProvider, useLocale } from './src/context/LocaleContext';

import { UserProfileModal } from './components/molecules/UserProfileModal';
import { UserData } from './src/types';

// Lazy Load Main Views
const HomeView = React.lazy(() => import('./components/views/HomeView').then(module => ({ default: module.HomeView })));
const ExploreView = React.lazy(() => import('./components/views/ExploreView').then(module => ({ default: module.ExploreView })));
const CalendarView = React.lazy(() => import('./components/views/CalendarView').then(module => ({ default: module.CalendarView })));
const WalletView = React.lazy(() => import('./components/views/WalletView').then(module => ({ default: module.WalletView })));
const MapView = React.lazy(() => import('./components/views/MapView').then(module => ({ default: module.MapView })));
const AgendaView = React.lazy(() => import('./components/organisms/AgendaView').then(module => ({ default: module.AgendaView })));
import { EventDetail } from './components/molecules/EventDetail';

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-o animate-spin" />
        <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Loading District...</div>
      </div>
    </div>
  );
}

function AppContent() {
  const { t, locale, setLocale } = useLocale();
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const [ambience, setAmbience] = useState<AmbienceState>(INITIAL_AMBIENCE);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Auth State from Context
  const { isAuthenticated, hasAccess, isLoading, user, logout } = useAuth();
  const [notification, setNotification] = useState<{ msg: string, type: 'info' | 'alert' } | null>(null);

  const handleTabChange = (tab: TabType) => {
    setSelectedEvent(null);
    setSelectedUser(null);
    setActiveTab(tab);
  };



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
        return <HomeView onEventClick={setSelectedEvent} onNavigate={handleTabChange} onWeather={handleWeather} onNotifications={handleNotifications} />;
      case "social":
        return <ExploreView onEventClick={setSelectedEvent} onUserClick={setSelectedUser} />;
      case "calendar":
        return <CalendarView onEventClick={setSelectedEvent} onOpenConfig={handleConfig} />;
      case "wallet":
        return <WalletView userName={user?.name || "Invitado"} onOpenConfig={handleConfig} onLogout={logout} />;
      case "map":
        return <MapView onEventClick={setSelectedEvent} />;
      case "agenda":
        return <AgendaView onBack={() => handleTabChange('home')} onEventClick={setSelectedEvent} />;
      default:
        return null;
    }
  };

  const toggleLocale = () => {
    setLocale(locale === 'es' ? 'en' : 'es');
  };

  if (isLoading) return null;

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-black overflow-hidden font-sans">
      <GlobalStyles />
      <MetaHead />

      {/* Background Layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-aurora-nebula" />
        <div className="absolute inset-0 bg-aurora-depth" />
        <div className="absolute inset-0 bg-aurora-glow" />
        <CanvasBackground ambience={ambience} />
        <div className="absolute inset-0 bg-vignette" />
      </div>

      <div
        className={cx(
          "relative w-full h-full flex overflow-hidden bg-theme-main",
          "md:border-x md:border-zinc-900 transition-all duration-300 ease-in-out shadow-2xl",
          "lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-[1600px] mx-auto z-10"
        )}
      >
        {!hasAccess ? (
          <Onboarding />
        ) : (
          <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-24 lg:w-64 flex-col border-r border-white/5 bg-black/40 backdrop-blur-3xl shrink-0 z-20">
              <div className="p-8 pb-12 flex flex-col items-center lg:items-start">
                <div className="text-[10px] font-black uppercase tracking-[.3em] text-s leading-none mb-1">DISTRICT</div>
                <div className="text-2xl font-black tracking-tighter text-white leading-none">VALLARTA<span className="text-o">.</span></div>
              </div>

              <nav className="flex-1 px-4 space-y-2">
                {(['home', 'calendar', 'social', 'map', 'agenda', 'wallet'] as TabType[])
                  .filter(t => isAuthenticated || t !== 'wallet')
                  .map((tab) => {
                    const icons: Record<string, string> = {
                      home: 'home',
                      calendar: 'event_note',
                      social: 'group',
                      map: 'map',
                      wallet: 'account_balance_wallet',
                      agenda: 'bookmarks'
                    };
                    const isActive = activeTab === tab;
                    return (
                      <button
                        key={tab}
                        onClick={() => { triggerHaptic('light'); handleTabChange(tab); }}
                        className={cx(
                          "w-full h-14 rounded-2xl flex items-center px-4 gap-4 transition-all duration-300 group",
                          isActive ? "bg-[var(--o)] text-black shadow-[0_10px_30px_rgba(255,159,69,0.2)]" : "text-[var(--f)] hover:bg-white/5 hover:text-[var(--tx)]"
                        )}
                      >
                        <span className={cx("material-symbols-outlined text-2xl transition-transform", isActive ? "scale-110" : "group-hover:scale-110")}>{icons[tab]}</span>
                        <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest">{t(`nav.${tab}`)}</span>
                      </button>
                    );
                  })}
              </nav>

              <div className="p-6">
                <button
                  onClick={toggleLocale}
                  className="w-full h-12 mb-2 rounded-xl flex items-center justify-center lg:justify-start lg:px-4 gap-3 text-f hover:text-white hover:bg-white/5 transition border border-white/10"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">{locale === 'es' ? 'English' : 'Español'}</span>
                </button>
                <button
                  onClick={logout}
                  className="w-full h-12 rounded-xl flex items-center justify-center lg:justify-start lg:px-4 gap-3 text-f hover:text-white hover:bg-white/5 transition"
                >
                  <span className="material-symbols-outlined text-xl">logout</span>
                  <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest">{t('action.logout')}</span>
                </button>
              </div>
            </aside>

            {/* Main Content */}
            <main className="relative flex-1 h-full overflow-hidden flex flex-col">
              <div className="flex-1 relative overflow-hidden z-0">
                <Suspense fallback={<LoadingFallback />}>
                  {renderView()}
                </Suspense>
              </div>

              <div className="md:hidden">
                <NavBar activeTab={activeTab} setTab={handleTabChange} />
              </div>
            </main>
          </>
        )}
      </div>

      {/* Overlays & Modals */}
      {selectedEvent && (
        <EventDetail
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onAction={handleDirections}
        />
      )}

      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
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

      {notification && (
        <Toast
          message={notification.msg}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Language Toggle for Mobile Only */}
      {isAuthenticated && (
        <div className="absolute top-4 right-4 z-[120] md:hidden">
          <button
            onClick={toggleLocale}
            className="px-3 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-[.18em] text-white hover:bg-white/15 active:scale-95 transition"
          >
            {locale === 'es' ? 'EN' : 'ES'}
          </button>
        </div>
      )}
    </div>
  );
}

import { HelmetProvider } from 'react-helmet-async';

export default function App() {
  return (
    <HelmetProvider>
      <LocaleProvider>
        <AuthProvider>
          <GlobalErrorBoundary>
            <AppContent />
          </GlobalErrorBoundary>
        </AuthProvider>
      </LocaleProvider>
    </HelmetProvider>
  );
}
