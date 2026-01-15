
import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, Sparkles, Camera, X } from 'lucide-react';
import { EventData } from '../../types';
import { EVENTS, RECOMMENDATIONS } from '../../constants';
import { GlassContainer, Badge } from '../atoms';
import { FilterTabs, PullToRefresh } from '../molecules';
import { UnifiedHeader, HeaderTitle, HeaderAction } from '../organisms';
import { triggerHaptic } from '../../utils';
import { useLocale } from '../../src/context/LocaleContext';

interface ExploreViewProps {
  onEventClick: (e: EventData) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({ onEventClick }) => {
  const [filter, setFilter] = useState('all');
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

  const filteredEvents = EVENTS.filter(e => {
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
            <HeaderAction onClick={handleCloseSearch}>
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
        <div className="pt-28 pb-32 space-y-8 animate-in fade-in duration-500 min-h-full">

          {showFilters && (
            <div className="px-4 animate-in slide-in-from-top-2 duration-300">
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
          <div className="space-y-4 px-1">
            <div className="flex items-center gap-2 px-5">
              <Sparkles size={16} className="text-o" strokeWidth={2.8} />
              <div className="text-[10px] font-black uppercase tracking-[.22em] text-s">{t('home.suggested')}</div>
            </div>

            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-4">
              {filteredEvents.slice(0, 5).map(e => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => { triggerHaptic('medium'); onEventClick(e); }}
                  className="flex-shrink-0 w-48 h-64 relative overflow-hidden border active:scale-[.99] transition-transform rounded-[28px] animate-in fade-in zoom-in-95 duration-500 bg-[#14110C] border-b"
                >
                  <img src={e.image} className="absolute inset-0 w-full h-full object-cover grayscale-[18%]" alt={e.title} loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-white font-black text-xs uppercase leading-tight text-left font-display">{e.title}</div>
                    <div className="text-[9px] font-black uppercase tracking-[.16em] mt-1 text-left text-o">{e.venue}</div>
                  </div>
                </button>
              ))}
              {filteredEvents.length === 0 && (
                <div className="w-full text-center py-12 flex flex-col items-center gap-3 animate-in fade-in zoom-in-95 duration-500">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-f">
                    <Sparkles size={20} className="opacity-50" />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-[.15em] text-f">
                    {t('home.noResults')}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recommendations List */}
          <div className="space-y-4 px-4">
            <div className="flex items-center gap-2 px-1">
              <Camera size={16} className="text-s" strokeWidth={2.8} />
              <div className="text-[10px] font-black uppercase tracking-[.22em] text-s">{t('home.districtThings')}</div>
            </div>
            <div className="space-y-4">
              {RECOMMENDATIONS.map(it => (
                <GlassContainer key={it.id} className="overflow-hidden group active:scale-[0.99] transition-transform">
                  <div className="flex h-28">
                    <img src={it.img} className="w-28 h-full object-cover" alt={it.title} loading="lazy" />
                    <div className="flex-1 p-4 flex flex-col justify-center">
                      <Badge label={it.type} dot color={it.type === "tip" ? "var(--o)" : "var(--c)"} />
                      <div className="text-sm font-black uppercase mt-2 font-display text-tx">{it.title}</div>
                      <div className="text-[10px] font-bold mt-1 leading-snug text-f">{it.content}</div>
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
