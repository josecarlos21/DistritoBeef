
import React from 'react';
import { MapPin, Flame, Award, Info, ArrowRight, Bell, CloudSun } from 'lucide-react';
import { EventData, TabType } from '../types';
import { EVENTS } from '../constants';
import { cx, triggerHaptic, useImageLoading } from '../utils';
import { Badge, GlassContainer, PullToRefresh } from './UI';
import { UnifiedHeader, HeaderAction } from './UnifiedHeader';

interface HomeViewProps {
  onEventClick: (e: EventData) => void;
  onNavigate: (tab: TabType) => void;
  onWeather: () => void;
  onNotifications: () => void;
}

const FeaturedCard = ({ event, onClick }: { event: EventData, onClick: () => void }) => {
    const { src, isLoaded } = useImageLoading(event.image, event.id);

    return (
        <button 
            onClick={() => { triggerHaptic('medium'); onClick(); }} 
            className={cx(
            "relative w-full h-[500px] overflow-hidden border transition-all duration-300 rounded-[44px] group transform-gpu text-left",
            "active:scale-[.995] hover:scale-[1.01]",
            "shadow-[0_30px_80px_rgba(0,0,0,.5)]"
            )} 
            style={{ borderColor: "var(--b)" }}
        >
            <img 
            src={src} 
            className={cx(
                "absolute inset-0 w-full h-full object-cover grayscale-[10%] scale-[1.03] group-hover:scale-[1.06] transition-all duration-700 ease-out will-change-transform",
                isLoaded ? "opacity-100" : "opacity-50 blur-sm"
            )}
            alt="Destacado" 
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0E0C09 5%, rgba(14,12,9,0.5) 40%, rgba(14,12,9,0) 80%)" }} />
            
            <div className="absolute top-6 left-6 flex gap-2">
                <Badge label="Destacado" dot color="var(--o)" />
                <Badge label={event.track} />
            </div>

            <div className="absolute bottom-8 left-8 right-8">
                <div className="text-5xl font-black uppercase tracking-tighter leading-[.9] font-display drop-shadow-xl" style={{ color: "var(--tx)" }}>{event.title}</div>
                <div className="flex items-center gap-2 mt-5 mb-8" style={{ color: "var(--s)" }}>
                    <MapPin size={18} color="var(--o)" strokeWidth={2.8} />
                    <span className="text-sm font-bold tracking-wide text-white shadow-black drop-shadow-md">{event.venue}</span>
                </div>
                
                <div className="flex gap-3">
                    <div 
                    className="flex-1 h-14 rounded-2xl font-black uppercase tracking-[.18em] text-[11px] flex items-center justify-center gap-2 shadow-lg backdrop-blur-md" 
                    style={{ background: "rgba(255,159,69,0.9)", color: "#000" }}
                    >
                    <Info size={16} strokeWidth={3} />
                    Ver Info
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <ArrowRight size={20} color="white" />
                    </div>
                </div>
            </div>
        </button>
    );
}

export const HomeView: React.FC<HomeViewProps> = ({ onEventClick, onNavigate, onWeather, onNotifications }) => {
  const featuredEvent = EVENTS.find(e => e.isFeatured) || EVENTS[0];

  const refreshData = async () => {
    // Simulate data refresh
    await new Promise(r => setTimeout(r, 1500)); 
  };

  return (
    <>
      <UnifiedHeader 
        left={
           <div className="flex flex-col justify-center animate-in fade-in duration-500 pl-2">
             <div className="text-[10px] font-black uppercase tracking-[.22em] text-[var(--s)] leading-none mb-0.5">District</div>
             <div className="text-sm font-black tracking-tighter text-white leading-none">VALLARTA<span className="text-[var(--o)]">.</span></div>
           </div>
        }
        center={null}
        right={
          <>
            <HeaderAction onClick={onWeather}>
              <CloudSun size={18} strokeWidth={2.5} />
            </HeaderAction>
            <HeaderAction onClick={onNotifications}>
               <Bell size={18} strokeWidth={2.5} />
            </HeaderAction>
          </>
        }
      />

      <PullToRefresh onRefresh={refreshData}>
          <div className="space-y-6 pb-32 pt-28 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Featured Card */}
              <div className="px-4">
                <div className="mb-4 flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[var(--ok)] animate-pulse shadow-[0_0_8px_var(--ok)]" />
                        <span className="text-[10px] font-black uppercase tracking-[.2em] text-[var(--m)]">Sucediendo Ahora</span>
                    </div>
                </div>

                {featuredEvent && <FeaturedCard event={featuredEvent} onClick={() => onEventClick(featuredEvent)} />}
              </div>

              {/* Live Status Widgets */}
              <div className="grid grid-cols-2 gap-4 px-4">
                  <button onClick={() => { triggerHaptic('light'); onNavigate('map'); }} className="text-left group relative">
                    <div className="absolute inset-0 bg-[var(--o)] opacity-0 group-hover:opacity-5 rounded-[28px] transition-opacity duration-500" />
                    <GlassContainer className="p-6 h-full transition-colors duration-300 border-white/10">
                        <div className="flex justify-between items-start">
                        <div className="text-[10px] font-black uppercase tracking-[.22em]" style={{ color: "var(--f)" }}>Densidad</div>
                        <div className="flex h-2.5 w-2.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--o)] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--o)]"></span>
                        </div>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                        <Flame size={20} color="var(--o)" strokeWidth={2.8} />
                        <div className="text-2xl font-black font-display" style={{ color: "var(--tx)" }}>Alta</div>
                        </div>
                        <div className="mt-2 text-[10px] font-bold text-[var(--m)] opacity-80">Zona Romántica</div>
                    </GlassContainer>
                  </button>

                  <button onClick={() => { triggerHaptic('light'); onNavigate('social'); }} className="text-left group relative">
                    <div className="absolute inset-0 bg-[var(--s)] opacity-0 group-hover:opacity-5 rounded-[28px] transition-opacity duration-500" />
                    <GlassContainer className="p-6 h-full transition-colors duration-300 border-white/10">
                        <div className="text-[10px] font-black uppercase tracking-[.22em]" style={{ color: "var(--f)" }}>Vibe Check</div>
                        <div className="flex items-center gap-2 mt-3">
                        <Award size={20} color="var(--s)" strokeWidth={2.8} />
                        <div className="text-2xl font-black font-display" style={{ color: "var(--tx)" }}>Top</div>
                        </div>
                        <div className="mt-2 text-[10px] font-bold text-[var(--m)] opacity-80">Muy buen ambiente</div>
                    </GlassContainer>
                  </button>
              </div>
          </div>
      </PullToRefresh>
    </>
  );
};
