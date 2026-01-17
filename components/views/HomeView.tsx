
import React, { useMemo } from 'react';
import { MapPin, Award, Info, ArrowRight, Bell, CloudSun } from 'lucide-react';
import { EventData, TabType } from '@/types';
import { EVENTS } from '@/constants';
import { cx, triggerHaptic } from '@/utils';
import { Badge, GlassContainer } from '../atoms';
import { PullToRefresh } from '../molecules';
import { UnifiedHeader, HeaderAction } from '../organisms';
import { useLocale } from '@/context/LocaleContext';

interface HomeViewProps {
  onEventClick: (e: EventData) => void;
  onNavigate: (tab: TabType) => void;
  onWeather: () => void;
  onNotifications: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onEventClick, onNavigate, onWeather, onNotifications }) => {
  const featuredEvent = useMemo(() => {
    const now = new Date();
    // Only show events that haven't ended yet
    const currentOrFuture = EVENTS.filter((e: EventData) => new Date(e.end).getTime() > now.getTime());
    return currentOrFuture.find((e: EventData) => e.isFeatured) || currentOrFuture[0] || EVENTS[0];
  }, []);
  const { t } = useLocale();

  const refreshData = async () => {
    // Simulate data refresh
    await new Promise(r => setTimeout(r, 1500));
  };

  return (
    <>
      <UnifiedHeader
        left={
          <div className="flex flex-col justify-center animate-in fade-in duration-500">
            <div className="text-[10px] font-black uppercase tracking-[.22em] text-s leading-none mb-0.5">District</div>
            <div className="text-sm font-black tracking-tighter text-white leading-none">VALLARTA<span className="text-o">.</span></div>
          </div>
        }
        center={null}
        right={
          <>
            <HeaderAction onClick={onWeather} ariaLabel={t('action.weather')}>
              <CloudSun size={18} strokeWidth={2.5} />
            </HeaderAction>
            <HeaderAction onClick={onNotifications} ariaLabel={t('action.notifications')}>
              <Bell size={18} strokeWidth={2.5} />
            </HeaderAction>
          </>
        }
      />

      <PullToRefresh onRefresh={refreshData}>
        <div className="max-w-7xl mx-auto space-y-[var(--space-lg)] pb-40 pt-36 px-[var(--space-md)] md:px-[var(--space-lg)] xl:px-[var(--space-xl)] animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Featured Card - Now the Hero element */}
          <div>
            <div className="mb-[var(--space-sm)] flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-ok animate-pulse shadow-[0_0_8px_var(--ok)]" />
                <span className="text-[10px] font-black uppercase tracking-[.2em] text-m">{t('home.happeningNow')}</span>
              </div>
            </div>

            {featuredEvent && (
              <button
                type="button"
                onClick={() => { triggerHaptic('medium'); onEventClick(featuredEvent); }}
                className={cx(
                  "relative w-full h-[500px] overflow-hidden border transition-all duration-300 rounded-[32px] group transform-gpu text-left border-white/10",
                  "active:scale-[.995] hover:scale-[1.01] hover:shadow-bento focus:scale-[1.01] outline-none",
                  "shadow-bento"
                )}
              >
                <img
                  src={featuredEvent.image}
                  className="absolute inset-0 w-full h-full object-cover grayscale-[10%] scale-[1.03] group-hover:scale-[1.06] transition-transform duration-700 ease-out will-change-transform"
                  alt="Destacado"
                  loading="eager"
                />
                <div className="absolute inset-0 hero-gradient" />

                <div className="absolute top-6 left-6 flex gap-2">
                  <Badge label={t('home.featured')} dot track="featured" />
                  <Badge label={featuredEvent.track} />
                </div>

                <div className="absolute bottom-10 left-8 right-8 cursor-pointer">
                  <div className="text-5xl font-black uppercase tracking-tighter leading-[.85] font-display drop-shadow-2xl text-tx group-hover:scale-[1.02] transition-transform duration-500 origin-left">{featuredEvent.title}</div>
                  <div className="flex items-center gap-3 mt-6 mb-10 text-s bg-black/30 backdrop-blur-md w-fit px-4 py-2 rounded-2xl border border-white/5">
                    <MapPin size={20} className="text-o" strokeWidth={3} />
                    <span className="text-sm font-black tracking-[.1em] uppercase text-white shadow-black drop-shadow-md">{featuredEvent.venue}</span>
                  </div>

                  <div className="flex gap-4">
                    <div
                      className="flex-1 h-14 rounded-2xl font-black uppercase tracking-[.22em] text-[11px] flex items-center justify-center gap-3 shadow-xl backdrop-blur-xl bg-[rgba(255,159,69,0.95)] text-black active:scale-95 transition-all"
                    >
                      <Info size={18} strokeWidth={3} />
                      {t('home.viewInfo')}
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/10 hover:bg-white/20 transition-colors">
                      <ArrowRight size={24} className="text-white" />
                    </div>
                  </div>
                </div>
              </button>
            )}
          </div>

          <hr className="border-t border-white/5 mx-2 my-8" />

          {/* Live Status Widgets */}
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-[var(--space-md)] list-none">
            <li>
              <button
                type="button"
                onClick={() => { triggerHaptic('light'); onNavigate('social'); }}
                className="w-full text-left group relative outline-none focus:scale-[1.02] transition-transform"
              >
                <div className="absolute inset-0 bg-[var(--s)] opacity-0 group-hover:opacity-5 rounded-[28px] transition-opacity duration-500" />
                <GlassContainer className="p-8 h-full transition-colors duration-300 border-white/5 group-hover:bg-white/5 flex flex-col justify-between min-h-[160px]">
                  <div className="text-[10px] font-black uppercase tracking-[.25em] text-s opacity-70 leading-none">{t('home.vibe')}</div>
                  <div>
                    <div className="flex items-center gap-3 mt-4">
                      <Award size={24} className="text-o" strokeWidth={3} />
                      <div className="text-3xl font-black font-display text-tx tracking-tighter uppercase">{t('home.top')}</div>
                    </div>
                    <div className="mt-3 text-[10px] font-black uppercase tracking-widest text-m opacity-60 leading-tight">{t('home.goodVibe')}</div>
                  </div>
                </GlassContainer>
              </button>
            </li>
          </ul>
        </div>
      </PullToRefresh >
    </>
  );
};
