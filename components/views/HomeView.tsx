
import React from 'react';
import { MapPin, Award, Info, ArrowRight, Bell, CloudSun } from 'lucide-react';
import { EventData, TabType } from '../../types';
import { EVENTS } from '../../constants';
import { cx, triggerHaptic } from '../../src/utils';
import { Badge, GlassContainer } from '../atoms';
import { PullToRefresh } from '../molecules';
import { UnifiedHeader, HeaderAction } from '../organisms';
import { useLocale } from '../../src/context/LocaleContext';

interface HomeViewProps {
  onEventClick: (e: EventData) => void;
  onNavigate: (tab: TabType) => void;
  onWeather: () => void;
  onNotifications: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onEventClick, onNavigate, onWeather, onNotifications }) => {
  const featuredEvent = EVENTS.find(e => e.isFeatured) || EVENTS[0];
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
        <div className="max-w-7xl mx-auto space-y-6 pb-32 pt-28 px-4 md:px-8 xl:px-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Featured Card - Now the Hero element */}
          <div>
            <div className="mb-4 flex items-center justify-between px-2">
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
                  "relative w-full h-[500px] overflow-hidden border transition-all duration-300 rounded-[44px] group transform-gpu text-left border-b",
                  "active:scale-[.995] hover:scale-[1.01]",
                  "shadow-[0_30px_80px_rgba(0,0,0,.5)]"
                )}
              >
                <img
                  src={featuredEvent.image}
                  className="absolute inset-0 w-full h-full object-cover grayscale-[10%] scale-[1.03] group-hover:scale-[1.06] transition-transform duration-700 ease-out will-change-transform"
                  alt="Destacado"
                />
                <div className="absolute inset-0 hero-gradient" />

                <div className="absolute top-6 left-6 flex gap-2">
                  <Badge label={t('home.featured')} dot color="var(--o)" />
                  <Badge label={featuredEvent.track} />
                </div>

                <div className="absolute bottom-8 left-8 right-8">
                  <div className="text-5xl font-black uppercase tracking-tighter leading-[.9] font-display drop-shadow-xl text-tx">{featuredEvent.title}</div>
                  <div className="flex items-center gap-2 mt-5 mb-8 text-s">
                    <MapPin size={18} className="text-o" strokeWidth={2.8} />
                    <span className="text-sm font-bold tracking-wide text-white shadow-black drop-shadow-md">{featuredEvent.venue}</span>
                  </div>

                  <div className="flex gap-3">
                    <div
                      className="flex-1 h-14 rounded-2xl font-black uppercase tracking-[.18em] text-[11px] flex items-center justify-center gap-2 shadow-lg backdrop-blur-md bg-[rgba(255,159,69,0.9)] text-[#000]"
                    >
                      <Info size={16} strokeWidth={3} />
                      {t('home.viewInfo')}
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                      <ArrowRight size={20} color="white" />
                    </div>
                  </div>
                </div>
              </button>
            )}
          </div>

          {/* Live Status Widgets */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">


            <button type="button" onClick={() => { triggerHaptic('light'); onNavigate('social'); }} className="text-left group relative">
              <div className="absolute inset-0 bg-[var(--s)] opacity-0 group-hover:opacity-5 rounded-[28px] transition-opacity duration-500" />
              <GlassContainer className="p-6 h-full transition-colors duration-300 border-white/10">
                <div className="text-[10px] font-black uppercase tracking-[.22em] text-f">{t('home.vibe')}</div>
                <div className="flex items-center gap-2 mt-3">
                  <Award size={20} className="text-s" strokeWidth={2.8} />
                  <div className="text-2xl font-black font-display text-tx">{t('home.top')}</div>
                </div>
                <div className="mt-2 text-[10px] font-bold text-m opacity-80">{t('home.goodVibe')}</div>
              </GlassContainer>
            </button>
          </div>
        </div>
      </PullToRefresh>
    </>
  );
};
