
import React, { useState } from 'react';
import { Heart, Navigation, Plus, Minus, Layers, Map as MapIcon, Search } from 'lucide-react';
import { Badge, GlassContainer } from './UI';
import { UnifiedHeader, HeaderTitle, HeaderAction, HeaderSegmentedControl, SegmentButton } from './UnifiedHeader';
import { cx, triggerHaptic } from '../utils';

export const MapView: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<'heat' | 'venue'>('heat');

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      
      <UnifiedHeader 
        left={
           <HeaderAction onClick={() => triggerHaptic('light')}>
             <Search size={20} strokeWidth={2.5} />
           </HeaderAction>
        }
        center={<HeaderTitle title="Mapa" subtitle="Zona Romántica" />}
        right={
           <HeaderSegmentedControl>
              <SegmentButton 
                onClick={() => { triggerHaptic('light'); setActiveLayer('heat'); }}
                active={activeLayer === 'heat'}
              >
                 <Layers size={16} strokeWidth={2.5} />
              </SegmentButton>
              <SegmentButton 
                onClick={() => { triggerHaptic('light'); setActiveLayer('venue'); }}
                active={activeLayer === 'venue'}
              >
                 <MapIcon size={16} strokeWidth={2.5} />
              </SegmentButton>
           </HeaderSegmentedControl>
        }
      />

      {/* Map Container */}
      <div className="flex-1 relative overflow-hidden bg-[#1a1612] w-full h-full">
        
        {/* Mock Map Background */}
        <div className="absolute inset-0 bg-[#1a1612] scale-150">
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]" />
           
           {/* Heatmap Blobs */}
           {activeLayer === 'heat' && (
             <>
                <div className="absolute top-[40%] left-[30%] w-64 h-64 rounded-full bg-[var(--o)] blur-[80px] opacity-20 animate-pulse" />
                <div className="absolute top-[60%] right-[20%] w-48 h-48 rounded-full bg-[var(--c)] blur-[60px] opacity-30" />
             </>
           )}
        </div>

        {/* Map UI Overlays */}
        <div className="absolute top-24 left-4 z-10">
           <Badge label="En vivo" dot color="var(--ok)" />
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            <GlassContainer className="p-1.5 flex flex-col gap-2">
                <button onClick={() => triggerHaptic('light')} className="w-8 h-8 flex items-center justify-center text-[var(--tx)] hover:text-[var(--o)] active:scale-90 transition"><Plus size={16} /></button>
                <div className="h-px bg-[var(--b)] w-full" />
                <button onClick={() => triggerHaptic('light')} className="w-8 h-8 flex items-center justify-center text-[var(--tx)] hover:text-[var(--o)] active:scale-90 transition"><Minus size={16} /></button>
            </GlassContainer>
        </div>

        {/* Location Marker */}
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer" onClick={() => triggerHaptic('medium')}>
          <div className="w-12 h-12 rounded-full border-4 shadow-[0_0_30px_rgba(255,138,29,0.4)] flex items-center justify-center relative transition-transform group-hover:scale-110" style={{ background: "var(--c)", borderColor: "rgba(0,0,0,.65)" }}>
            <Heart size={16} color="var(--tx)" strokeWidth={2.8} className="relative z-10" />
            <div className="absolute inset-0 rounded-full bg-[var(--c)] animate-ping opacity-20" />
          </div>
          <div className="mt-3 px-4 py-2 rounded-xl border backdrop-blur-xl bg-black/60 border-[var(--b)] flex flex-col items-center shadow-lg">
            <span className="text-[10px] font-black uppercase tracking-[.16em] text-[var(--tx)]">Blue Chairs</span>
            <span className="text-[8px] font-bold text-[var(--o)]">Muy concurrido</span>
          </div>
        </div>

        {/* User Location */}
        <div className="absolute bottom-40 right-12 w-6 h-6 border-2 border-white rounded-full bg-[var(--o)] shadow-lg animate-pulse" />

        {/* Floating Controls */}
        <div className="absolute bottom-28 left-4 right-4 z-10">
           <GlassContainer strong className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--o)] flex items-center justify-center text-black">
                      <Navigation size={14} strokeWidth={3} className="rotate-45" />
                  </div>
                  <div>
                      <div className="text-[10px] font-black text-white uppercase">A 350m</div>
                      <div className="text-[8px] font-bold text-[var(--f)] uppercase">Caminando</div>
                  </div>
              </div>
              <button onClick={() => triggerHaptic('light')} className="px-4 py-2 bg-white/10 rounded-xl text-[9px] font-black uppercase text-white hover:bg-white/20 transition">
                  Cómo llegar
              </button>
           </GlassContainer>
        </div>

      </div>
    </div>
  );
};
