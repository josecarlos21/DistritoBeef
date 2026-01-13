
import React from 'react';
import { MapPin, Flame, Award, Info, Ticket, CalendarDays, Map as MapIcon, ArrowRight } from 'lucide-react';
import { EventData, TabType } from '../types';
import { EVENTS } from '../constants';
import { cx, triggerHaptic } from '../utils';
import { Badge, GlassContainer, PullToRefresh } from './UI';

interface HomeViewProps {
  onEventClick: (e: EventData) => void;
  onNavigate: (tab: TabType) => void;
}

const QuickAction = ({ icon: Icon, label, onClick, color }: { icon: any, label: string, onClick: () => void, color: string }) => (
  <button 
      onClick={() => { triggerHaptic('medium'); onClick(); }}
      className="flex-1 flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 active:scale-95 transition hover:bg-white/10 group"
  >
      <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110" style={{ background: color }}>
          <Icon size={20} className="text-black" strokeWidth={2.5} />
      </div>
      <span className="text-[11px] font-bold text-white uppercase tracking-wider">{label}</span>
  </button>
);

export const HomeView: React.FC<HomeViewProps> = ({ onEventClick, onNavigate }) => {
  const featuredEvent = EVENTS.find(e => e.isFeatured) || EVENTS[0];

  const refreshData = async () => {
    // Simulate data refresh
    await new Promise(r => setTimeout(r, 1500)); 
  };

  return (
    <PullToRefresh onRefresh={refreshData}>
        <div className="space-y-8 pb-32 animate-in fade-in duration-500">
            {/* Header */}
            <div className="pt-24 px-1">
                <div className="flex items-end justify-between">
                    <div>
                        <div className="text-[11px] font-black uppercase tracking-[.22em] font-body mb-1" style={{ color: "var(--s)" }}>Puerto Vallarta</div>
                        <div className="text-5xl font-black tracking-tighter font-display" style={{ color: "var(--tx)" }}>
                        DISTRICT<span style={{ color: "var(--o)" }}>.</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-black font-display" style={{ color: "var(--tx)" }}>28°C</div>
                        <div className="text-[11px] font-black uppercase tracking-[.18em]" style={{ color: "var(--o)" }}>Soleado</div>
                    </div>
                </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="flex gap-3 px-1">
                <QuickAction icon={Ticket} label="Mi Pase" onClick={() => onNavigate('wallet')} color="var(--ok)" />
                <QuickAction icon={CalendarDays} label="Agenda" onClick={() => onNavigate('calendar')} color="var(--o)" />
                <QuickAction icon={MapIcon} label="Mapa" onClick={() => onNavigate('map')} color="var(--s)" />
            </div>

            {/* Featured Card */}
            {featuredEvent && (
            <button 
                onClick={() => { triggerHaptic('medium'); onEventClick(featuredEvent); }} 
                className={cx(
                "relative w-full h-[460px] overflow-hidden border transition-all duration-300 rounded-[44px] group transform-gpu text-left",
                "active:scale-[.995] hover:scale-[1.01]",
                "shadow-[0_45px_100px_rgba(0,0,0,.60)]"
                )} 
                style={{ borderColor: "var(--b)" }}
            >
                <img 
                src={featuredEvent.image} 
                className="absolute inset-0 w-full h-full object-cover grayscale-[10%] scale-[1.03] group-hover:scale-[1.06] transition-transform duration-700 ease-out will-change-transform" 
                alt="Destacado" 
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0E0C09 5%, rgba(14,12,9,0.4) 40%, rgba(14,12,9,0) 80%)" }} />
                
                <div className="absolute top-6 left-6 flex gap-2">
                    <Badge label="Destacado" dot color="var(--o)" />
                    <Badge label={featuredEvent.track} />
                </div>

                <div className="absolute bottom-8 left-8 right-8">
                    <div className="text-4xl font-black uppercase tracking-tighter leading-[.92] font-display drop-shadow-lg" style={{ color: "var(--tx)" }}>{featuredEvent.title}</div>
                    <div className="flex items-center gap-2 mt-4 mb-6" style={{ color: "var(--s)" }}>
                        <MapPin size={18} color="var(--o)" strokeWidth={2.8} />
                        <span className="text-sm font-bold tracking-wide text-white">{featuredEvent.venue}</span>
                    </div>
                    
                    <div className="flex gap-3">
                        <div 
                        className="flex-1 h-14 rounded-2xl font-black uppercase tracking-[.18em] text-[11px] flex items-center justify-center gap-2 shadow-lg" 
                        style={{ background: "var(--c)", color: "var(--tx)" }}
                        >
                        <Info size={16} strokeWidth={3} />
                        Ver Info
                        </div>
                        <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                            <ArrowRight size={20} color="white" />
                        </div>
                    </div>
                </div>
            </button>
            )}

            {/* Widgets (DRY applied via props if expanded, but keeping inline for now as unique) */}
            <div className="grid grid-cols-2 gap-4">
                <button onClick={() => { triggerHaptic('light'); onNavigate('map'); }} className="text-left group">
                <GlassContainer className="p-6 h-full group-hover:bg-white/5 transition-colors duration-300">
                    <div className="flex justify-between items-start">
                    <div className="text-[10px] font-black uppercase tracking-[.22em]" style={{ color: "var(--f)" }}>Densidad</div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--o)] animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                    <Flame size={20} color="var(--o)" strokeWidth={2.8} />
                    <div className="text-2xl font-black font-display" style={{ color: "var(--tx)" }}>Alta</div>
                    </div>
                    <div className="mt-2 text-[10px] font-bold text-[var(--m)] opacity-80">Zona Romántica</div>
                </GlassContainer>
                </button>

                <button onClick={() => { triggerHaptic('light'); onNavigate('social'); }} className="text-left group">
                <GlassContainer className="p-6 h-full group-hover:bg-white/5 transition-colors duration-300">
                    <div className="text-[10px] font-black uppercase tracking-[.22em]" style={{ color: "var(--f)" }}>Clima social</div>
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
  );
};
