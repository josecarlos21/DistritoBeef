
import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, Sparkles, Camera, X, Compass } from 'lucide-react';
import { EventData } from '../types';
import { EVENTS, RECOMMENDATIONS } from '../constants';
import { IconButton, GlassContainer, Badge, FilterTabs, PullToRefresh } from './UI';
import { triggerHaptic } from '../utils';

interface ExploreViewProps {
  onEventClick: (e: EventData) => void;
}

const FILTERS = [
  { id: 'all', label: 'Todo' },
  { id: 'beefdip', label: 'BeefDip' },
  { id: 'bearadise', label: 'Bearadise' },
  { id: 'community', label: 'Local' },
];

export const ExploreView: React.FC<ExploreViewProps> = ({ onEventClick }) => {
  const [filter, setFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus search input when opened
  useEffect(() => {
      if (isSearchOpen) {
          setTimeout(() => inputRef.current?.focus(), 100);
      }
  }, [isSearchOpen]);

  const handleCloseSearch = () => {
      triggerHaptic('light');
      setSearchQuery('');
      setIsSearchOpen(false);
  };

  const filteredEvents = EVENTS.filter(e => {
    const matchesFilter = filter === 'all' || e.track === filter;
    const matchesSearch = searchQuery === '' || 
                          e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="relative h-full">
         {/* Floating Header */}
         <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[80] w-[92%] animate-in slide-in-from-top-4 duration-500 pointer-events-auto">
            <GlassContainer strong className="flex items-center justify-between p-2 h-[58px]">
                {isSearchOpen ? (
                    <div className="flex-1 flex items-center gap-2 animate-in fade-in duration-200 w-full pl-2">
                        <Search size={18} className="text-[var(--o)] shrink-0" strokeWidth={2.5} />
                        <input 
                            ref={inputRef}
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="EXPLORAR..."
                            className="flex-1 bg-transparent border-none focus:outline-none text-white font-bold uppercase text-sm tracking-wider placeholder:text-white/30"
                        />
                        <IconButton Icon={X} onClick={handleCloseSearch} label="Cerrar" />
                    </div>
                ) : (
                    <>
                        <div className="pl-3 flex items-center gap-2 animate-in fade-in duration-300">
                            <Compass size={20} className="text-[var(--o)]" strokeWidth={2.5} />
                            <span className="text-lg font-black uppercase tracking-tighter text-white font-display">Explorar</span>
                        </div>

                        <div className="flex items-center gap-2 animate-in fade-in duration-300">
                            <IconButton 
                                Icon={Search} 
                                onClick={() => { triggerHaptic('light'); setIsSearchOpen(true); }} 
                                label="Buscar" 
                            />
                            <IconButton 
                                Icon={showFilters ? X : Filter} 
                                onClick={() => { triggerHaptic('light'); setShowFilters(!showFilters); }} 
                                label="Filtrar" 
                                color={showFilters ? "var(--o)" : undefined}
                            />
                        </div>
                    </>
                )}
            </GlassContainer>
        </div>

        <PullToRefresh onRefresh={async () => { await new Promise(r => setTimeout(r, 1000)); }}>
            <div className="pt-24 pb-32 space-y-8 animate-in fade-in duration-500 min-h-full">
            
            {showFilters && (
                <div className="px-4 animate-in slide-in-from-top-2 duration-300">
                    <FilterTabs 
                    options={FILTERS} 
                    selectedId={filter} 
                    onSelect={setFilter}
                    />
                </div>
            )}

            {/* Suggested Events Carousel */}
            <div className="space-y-4 px-1">
                <div className="flex items-center gap-2 px-1">
                <Sparkles size={16} color="var(--o)" strokeWidth={2.8} />
                <div className="text-[10px] font-black uppercase tracking-[.22em]" style={{ color: "var(--s)" }}>Eventos sugeridos</div>
                </div>
                
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-1">
                {filteredEvents.slice(0, 5).map(e => (
                    <button 
                        key={e.id} 
                        onClick={() => { triggerHaptic('medium'); onEventClick(e); }} 
                        className="flex-shrink-0 w-48 h-64 relative overflow-hidden border active:scale-[.99] transition-transform rounded-[28px] animate-in fade-in zoom-in-95 duration-500 bg-[#14110C]" 
                        style={{ borderColor: "var(--b)" }}
                    >
                        <img src={e.image} className="absolute inset-0 w-full h-full object-cover grayscale-[18%]" alt={e.title} loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                            <div className="text-white font-black text-xs uppercase leading-tight text-left font-display">{e.title}</div>
                            <div className="text-[9px] font-black uppercase tracking-[.16em] mt-1 text-left" style={{ color: "var(--o)" }}>{e.venue}</div>
                        </div>
                    </button>
                ))}
                {filteredEvents.length === 0 && (
                    <div className="w-full text-center py-8 text-[10px] font-black uppercase tracking-[.15em]" style={{ color: "var(--f)" }}>
                    Sin resultados
                    </div>
                )}
                </div>
            </div>

            {/* Recommendations List */}
            <div className="space-y-4 px-1">
                <div className="flex items-center gap-2 px-1">
                <Camera size={16} color="var(--s)" strokeWidth={2.8} />
                <div className="text-[10px] font-black uppercase tracking-[.22em]" style={{ color: "var(--s)" }}>Cosas del distrito</div>
                </div>
                <div className="space-y-4">
                {RECOMMENDATIONS.map(it => (
                    <GlassContainer key={it.id} className="overflow-hidden group active:scale-[0.99] transition-transform">
                    <div className="flex h-28">
                        <img src={it.img} className="w-28 h-full object-cover" alt={it.title} loading="lazy" />
                        <div className="flex-1 p-4 flex flex-col justify-center">
                        <Badge label={it.type} dot color={it.type === "tip" ? "var(--o)" : "var(--c)"} />
                        <div className="text-sm font-black uppercase mt-2 font-display" style={{ color: "var(--tx)" }}>{it.title}</div>
                        <div className="text-[10px] font-bold mt-1 leading-snug" style={{ color: "var(--f)" }}>{it.content}</div>
                        </div>
                    </div>
                    </GlassContainer>
                ))}
                </div>
            </div>
            </div>
        </PullToRefresh>
    </div>
  );
};
