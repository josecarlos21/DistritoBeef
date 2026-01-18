
import React, { useMemo, useState } from 'react';
import { MapPin, Bell, CloudSun, Loader2 } from 'lucide-react';
import { EventData, TabType } from '@/types';
import { triggerHaptic } from '@/utils';
import { Badge, Skeleton, BentoSkeleton } from '../atoms';
import { PullToRefresh, AdCard, BentoPlaceholder } from '../molecules';
import { UnifiedHeader, HeaderAction } from '../organisms';
import { useLocale } from '@/context/LocaleContext';
import { useDataset } from '@/context/DatasetContext';

interface HomeViewProps {
  onEventClick: (e: EventData) => void;
  onNavigate: (tab: TabType) => void;
  onWeather: () => void;
  onNotifications: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onEventClick, onNavigate: _onNavigate, onWeather, onNotifications }) => {
  const { events, status } = useDataset();
  const { t } = useLocale();
  const [showPlaceholder, setShowPlaceholder] = useState<string | null>(null);

  const { heroEvent, gridEvents } = useMemo(() => {
    const now = new Date();
    // 1. Filter Active (Live) or imminent (next 2h)
    let activeEvents = events.filter((e) => {
      const start = new Date(e.start);
      const end = new Date(e.end);
      // It is live OR starts in next 2 hours
      return (now >= start && now <= end) || (start > now && start.getTime() - now.getTime() < 7200000);
    });

    // 2. If no active events, fallback to any future event to populate grid
    if (activeEvents.length === 0) {
      activeEvents = events.filter(e => new Date(e.end).getTime() > now.getTime()).slice(0, 4);
    }

    // 3. Sort by Duration (Longest first gets Hero spot)
    activeEvents.sort((a, b) => {
      const durA = new Date(a.end).getTime() - new Date(a.start).getTime();
      const durB = new Date(b.end).getTime() - new Date(b.start).getTime();
      return durB - durA;
    });

    return {
      heroEvent: activeEvents[0] || null,
      gridEvents: activeEvents.slice(1, 5) // Next 4 events for grid
    };
  }, [events]);

  if (status === 'loading') {
    return (
      <div className="h-full bg-theme-main flex flex-col items-center justify-center pt-24 sm:pt-32 animate-in fade-in duration-500">
        <Loader2 className="text-[var(--accent-brown)] animate-spin mb-4" size={48} />
        <div className="px-5 mb-8 space-y-2 opacity-50 w-full max-w-md">
          <Skeleton variant="text" className="h-4 w-24 mx-auto" />
        </div>
      </div>
    );
  }

  const refreshData = async () => {
    // Simulate data refresh
    await new Promise(r => setTimeout(r, 1500));
  };

  const handlePlaceholder = (feature: string) => {
    triggerHaptic('light');
    setShowPlaceholder(feature);
  };

  return (
    <>
      <div className="fixed top-[-10%] left-[-20%] w-[70%] h-[50%] bg-[var(--accent-brown)]/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse z-0" />
      <div className="fixed bottom-[-10%] right-[-20%] w-[60%] h-[60%] bg-[var(--accent-brown)]/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen z-0" />
      <UnifiedHeader
        left={
          <div className="flex flex-col justify-center animate-in fade-in duration-500">
            <div className="text-[10px] font-black uppercase tracking-[.22em] text-s leading-none mb-0.5">District</div>
            <div className="text-sm font-black tracking-tighter text-white leading-none drop-shadow-[0_0_10px_rgba(192,122,80,0.5)]">VALLARTA<span className="text-[var(--accent-brown)]">.</span></div>
          </div>
        }
        center={null}
        right={
          <>
            <HeaderAction onClick={onWeather} ariaLabel={t('action.weather')}>
              <CloudSun size={18} strokeWidth={2.5} />
            </HeaderAction>
            <HeaderAction onClick={() => handlePlaceholder('notifications')} ariaLabel={t('action.notifications')}>
              <Bell size={18} strokeWidth={2.5} />
            </HeaderAction>
          </>
        }
      />

      <PullToRefresh onRefresh={refreshData}>
        <div className="max-w-7xl mx-auto space-y-[var(--space-lg)] pb-40 pt-36 px-[var(--space-md)] md:px-[var(--space-lg)] xl:px-[var(--space-xl)] animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Bento Grid - Live Now */}
          <div className="space-y-[var(--space-sm)]">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-ok animate-pulse shadow-[0_0_8px_var(--ok)]" />
                <span className="text-[10px] font-black uppercase tracking-[.2em] text-m">{t('home.happeningNow')}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(200px,auto)]">
              {/* Hero Event (Longest Duration) */}
              {heroEvent && (
                <button
                  type="button"
                  onClick={() => { triggerHaptic('medium'); onEventClick(heroEvent); }}
                  className="col-span-1 sm:col-span-2 lg:col-span-2 row-span-2 relative w-full min-h-[400px] overflow-hidden border transition-all duration-300 rounded-[32px] group transform-gpu text-left border-white/10 active:scale-[.995] hover:scale-[1.01] hover:shadow-bento focus:scale-[1.01] outline-none shadow-bento"
                >
                  <img
                    src={heroEvent.image}
                    className="absolute inset-0 w-full h-full object-cover grayscale-[10%] scale-[1.03] group-hover:scale-[1.06] transition-transform duration-700 ease-out"
                    alt="Destacado"
                  />
                  <div className="absolute inset-0 hero-gradient" />

                  <div className="absolute top-6 left-6 flex gap-2">
                    <Badge label="EN VIVO" dot track="featured" />
                    <Badge label={heroEvent.track} />
                  </div>

                  <div className="absolute bottom-8 left-6 right-6">
                    <div className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[.9] font-display drop-shadow-2xl text-tx mb-4">{heroEvent.title}</div>
                    <div className="flex items-center gap-2 text-white/80">
                      <MapPin size={16} className="text-[var(--accent-brown)]" />
                      <span className="text-xs font-bold uppercase tracking-wider">{heroEvent.venue}</span>
                    </div>
                  </div>
                </button>
              )}

              {/* Secondary Grid Events */}
              {gridEvents.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => { triggerHaptic('light'); onEventClick(event); }}
                  className="col-span-1 row-span-1 relative h-64 sm:h-auto overflow-hidden border transition-all duration-300 rounded-[28px] group transform-gpu text-left border-white/10 active:scale-[.98] hover:scale-[1.02] shadow-lg bg-[#1a1614]"
                >
                  <img
                    src={event.image}
                    className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                    alt={event.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  <div className="absolute top-3 left-3">
                    <Badge label={event.track} />
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-lg font-black uppercase leading-none font-display text-white mb-1 line-clamp-2">{event.title}</div>
                    <div className="text-[9px] font-bold uppercase tracking-wider text-white/60 truncate">{event.venue}</div>
                  </div>
                </button>
              ))}

              {/* Ad Card - Always present in the grid */}
              <div className="col-span-1 row-span-1 h-48 sm:h-auto">
                <AdCard />
              </div>

            </div>
          </div>
        </div>
      </PullToRefresh >

      {showPlaceholder && (
        <BentoPlaceholder
          isOpen={!!showPlaceholder}
          onClose={() => setShowPlaceholder(null)}
          title={showPlaceholder === 'notifications' ? "Centro de Alertas" : "Próximamente"}
        />
      )}
    </>
  );
};
