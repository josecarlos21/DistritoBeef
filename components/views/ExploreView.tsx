
import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, Sparkles, Camera, X } from 'lucide-react';
import { EventData, UserData } from '@/types';
import { RECOMMENDATIONS } from '@/constants';
import { GlassContainer, Badge, SmartImage } from '../atoms';
import { FilterTabs, PullToRefresh } from '../molecules';
import { UnifiedHeader, HeaderTitle, HeaderAction } from '../organisms';
import { triggerHaptic } from '@/utils';
import { useLocale } from '@/context/LocaleContext';
import { useDataset } from '@/context/DatasetContext';



interface ExploreViewProps {
  onEventClick: (e: EventData) => void;
  onUserClick: (u: UserData) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({ onEventClick, onUserClick: _onUserClick }) => {
  const [filter, setFilter] = useState('all');
  const { events } = useDataset();


  const [showFilters, setShowFilters] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLocale();

  // Auto-focus search input when opened
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSearchOpen) {
      timer = setTimeout(() => inputRef.current?.focus(), 100);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isSearchOpen]);

  const handleCloseSearch = () => {
    triggerHaptic('light');
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const filteredEvents = events.filter((e: EventData) => {
    const matchesFilter = filter === 'all' || e.track === filter;
    const matchesSearch = searchQuery === '' ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="relative h-full">

      <UnifiedHeader
        isSearchMode={isSearchOpen}
        left={
          <div className="w-10" /> /* Spacer */
        }
        center={
          isSearchOpen ? (
            <div className="flex items-center gap-2 w-full animate-in fade-in duration-200">
              <Search size={18} className="text-o shrink-0" strokeWidth={2.5} />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search.placeholder', 'SEARCH...')}
                className="flex-1 bg-transparent border-none focus:outline-none text-white font-bold uppercase text-sm tracking-wider placeholder:text-white/30"
              />
            </div>
          ) : (
            <HeaderTitle title={t('header.explore', 'Explorar')} />
          )
        }
        right={
          isSearchOpen ? (
            <HeaderAction onClick={handleCloseSearch} ariaLabel={t('action.close', 'Cerrar búsqueda')}>
              <X size={20} strokeWidth={2.5} />
            </HeaderAction>
          ) : (
            <>
              <HeaderAction ariaLabel={t('action.search')} onClick={() => { triggerHaptic('light'); setIsSearchOpen(true); }}>
                <Search size={20} strokeWidth={2.5} />
              </HeaderAction>
              <HeaderAction
                ariaLabel={t('action.filters')}
                onClick={() => { triggerHaptic('light'); setShowFilters(!showFilters); }}
                active={showFilters}
              >
                {showFilters ? <X size={20} strokeWidth={2.5} /> : <Filter size={20} strokeWidth={2.5} />}
              </HeaderAction>
            </>
          )
        }
      />

      <PullToRefresh onRefresh={async () => { await new Promise(r => setTimeout(r, 1000)); }}>
        <div className="pt-36 pb-40 space-y-[var(--space-lg)] animate-in fade-in duration-500 min-h-full">

          {showFilters && (
            <div className="px-[var(--space-md)] animate-in slide-in-from-top-2 duration-300">
              <FilterTabs
                options={[
                  { id: 'all', label: t('filters.all', 'Todo') },
                  { id: 'beefdip', label: t('filters.beefdip', 'BeefDip') },
                  { id: 'bearadise', label: t('filters.bearadise', 'Bearadise') },
                  { id: 'community', label: t('filters.local', 'Local') },
                ]}
                selectedId={filter}
                onSelect={setFilter}
              />
            </div>
          )}

          {/* Suggested Events Carousel */}
          <div className="space-y-[var(--space-sm)] px-1">
            <div className="flex items-center gap-2 px-[var(--space-lg)]">
              <Sparkles size={16} className="text-o" strokeWidth={2.8} />
              <div className="text-[10px] font-black uppercase tracking-[.22em] text-s">{t('home.suggested')}</div>
            </div>

            <ul className="flex gap-[var(--space-md)] overflow-x-auto no-scrollbar pb-6 px-[var(--space-md)] -mx-[var(--space-md)] pl-[var(--space-lg)] md:pl-[var(--space-xl)] list-none">
              {filteredEvents.slice(0, 5).map((e: EventData) => (
                <li key={e.id} className="flex-shrink-0 first:pl-0 last:pr-[var(--space-lg)]">
                  <button
                    type="button"
                    onClick={() => { triggerHaptic('medium'); onEventClick(e); }}
                    className="w-52 h-72 relative overflow-hidden border active:scale-[.99] transition-all hover:scale-[1.02] rounded-[32px] animate-in fade-in zoom-in-95 duration-500 bg-[#14110C] border-b shadow-lg"
                  >
                    <SmartImage src={e.image} className="absolute inset-0 w-full h-full object-cover grayscale-[10%] group-hover:scale-110 transition-transform duration-700" alt={e.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5">
                      <div className="text-white font-black text-sm uppercase leading-tight text-left font-display drop-shadow-md">{e.title}</div>
                      <div className="text-[10px] font-black uppercase tracking-[.16em] mt-1.5 text-left text-o drop-shadow-sm">{e.venue}</div>
                    </div>
                  </button>
                </li>
              ))}
              {filteredEvents.length === 0 && (
                <li className="w-full text-center py-20 flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-700">
                  <div className="relative">
                    <div className="absolute inset-0 bg-o/20 blur-2xl rounded-full" />
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-o relative z-10">
                      <Search size={28} className="opacity-50" strokeWidth={1.5} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-black uppercase tracking-[.2em] text-white">
                      {t('home.noResults', 'No se encontraron eventos')}
                    </div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-f">
                      Intenta con otra búsqueda o filtro
                    </div>
                  </div>
                </li>
              )}
            </ul>
          </div>

          <hr className="border-t border-white/5 mx-[var(--space-lg)] my-[var(--space-md)]" />

          {/* Recommendations List */}
          <div className="space-y-[var(--space-sm)] px-[var(--space-md)]">
            <div className="flex items-center gap-2 px-1">
              <Camera size={16} className="text-s" strokeWidth={2.8} />
              <div className="text-[10px] font-black uppercase tracking-[.22em] text-s">{t('home.districtThings')}</div>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--space-md)] list-none">
              {RECOMMENDATIONS.map(it => (
                <li key={it.id}>
                  <GlassContainer className="overflow-hidden group active:scale-[0.99] transition-all hover:scale-[1.01]">
                    <div className="flex h-28">
                      <SmartImage src={it.img} className="w-28 h-full object-cover" alt={it.title} />
                      <div className="flex-1 p-4 flex flex-col justify-center">
                        <Badge label={it.type} dot track={it.type === "tip" ? "beefdip" : "community"} />
                        <div className="text-sm font-black uppercase mt-2 font-display text-tx">{it.title}</div>
                        <div className="text-[10px] font-bold mt-1 leading-snug text-f">{it.content}</div>
                      </div>
                    </div>
                  </GlassContainer>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PullToRefresh >
    </div >
  );
};
