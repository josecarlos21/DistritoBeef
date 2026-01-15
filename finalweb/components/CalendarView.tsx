
import React, { useMemo, useRef, useState } from 'react';
import { SlidersHorizontal, Clock, MapPin, ChevronDown, List, Rows } from 'lucide-react';
import { EventData } from '../types';
import { EVENTS } from '../constants';
import { getHour, getEventBackgroundStyle, triggerHaptic, getFullDateLabel, cx } from '../utils';
import { UnifiedHeader, HeaderTitle, HeaderAction } from './UnifiedHeader';

interface DayGroup {
  dateLabel: string;
  isoDate: string;
  isToday: boolean;
  events: EventData[];
}

// Sub-component for a single event card within a day
const EventCard = ({ 
  event, 
  showTime, 
  isLastInDay, 
  isCompact, 
  onClick 
}: { 
  event: EventData, 
  showTime: boolean, 
  isLastInDay: boolean, 
  isCompact: boolean, 
  onClick: () => void 
}) => {
  const time = getHour(event.start);
  const bgStyle = getEventBackgroundStyle(event.image, event.track, event.id);

  if (isCompact) {
    // COMPACT MODE RENDER
    return (
        <div className="flex gap-4 relative group animate-in fade-in duration-300">
           <div className="w-14 shrink-0 flex flex-col items-end pt-3">
              <span className={cx("text-[11px] font-bold tracking-wider", showTime ? "text-[var(--o)] opacity-100" : "opacity-0")}>{time}</span>
           </div>
           
           <div className="w-4 flex flex-col items-center relative pt-4">
                <div className={cx("w-2.5 h-2.5 rounded-full border-2 border-[var(--bg)] z-10 transition-colors", showTime ? "bg-[var(--o)]" : "bg-[var(--f)] opacity-30")} />
                {!isLastInDay && <div className="absolute top-6 bottom-[-16px] w-px border-l border-dashed border-white/10" />}
           </div>

           <button 
              onClick={() => { triggerHaptic('light'); onClick(); }}
              className="flex-1 py-3 pr-4 border-b border-white/5 active:opacity-50 text-left"
           >
              <div className="flex items-center gap-2 mb-1">
                 <span className="text-[9px] font-black uppercase tracking-wider text-[var(--s)] px-1.5 py-0.5 rounded bg-white/5">{event.track}</span>
              </div>
              <div className="text-sm font-bold text-white leading-tight truncate">{event.title}</div>
              <div className="text-[10px] text-[var(--f)] mt-0.5 truncate">{event.venue}</div>
           </button>
        </div>
    );
  }

  // DETAILED MODE RENDER
  return (
    <div className="flex gap-4 relative group animate-in slide-in-from-bottom-2 duration-500">
       {/* Left Column: Time & Connector */}
       <div className="w-14 shrink-0 flex flex-col items-center relative pt-1">
          {/* Time Label */}
          <div className={`text-[11px] font-bold tracking-wider mb-1 transition-opacity duration-300 ${showTime ? 'text-[var(--o)] opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
            {time}
          </div>
          
          {/* Dot */}
          <div className={`w-3 h-3 rounded-full border-2 border-[var(--bg)] z-10 shadow-sm transition-all duration-300 ${showTime ? 'bg-[var(--o)] mt-0.5 scale-100' : 'bg-[var(--f)] opacity-30 mt-1 scale-75'}`} />
          
          {/* Connecting Line - Only render if not last in day */}
          {!isLastInDay && (
            <div className="absolute top-7 bottom-[-16px] w-px border-l-2 border-dashed border-white/10 left-1/2 -translate-x-1/2 z-0" />
          )}
       </div>

       {/* Right Column: Card */}
       <button 
          onClick={() => { triggerHaptic('medium'); onClick(); }}
          className="flex-1 relative mb-6 rounded-[24px] overflow-hidden border border-white/10 shadow-lg active:scale-[0.98] transition-all duration-300 bg-[#14110C] min-h-[110px] text-left group-hover:border-white/25 group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
       >
          {/* Bg */}
          <div className="absolute inset-0 bg-cover bg-center opacity-50 mix-blend-overlay transition-transform duration-700 group-hover:scale-105" style={bgStyle} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 p-4 flex flex-col justify-center">
             {/* Badge Row */}
             <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded bg-white/10 border border-white/5 text-[9px] font-black uppercase tracking-wider text-white backdrop-blur-md shadow-sm">
                   {event.track}
                </span>
                {!showTime && (
                   <span className="flex items-center gap-1 text-[9px] font-bold text-[var(--f)] uppercase opacity-70">
                      <Clock size={10} /> {time}
                   </span>
                )}
             </div>

             <h3 className="text-lg font-black text-white leading-tight mb-2 font-display line-clamp-2 pr-2 drop-shadow-md">
               {event.title}
             </h3>

             <div className="flex items-center gap-1.5 text-[var(--m)]">
                <MapPin size={13} className="text-[var(--s)] shrink-0" strokeWidth={2.5} />
                <span className="text-[10px] font-bold uppercase tracking-wide truncate">{event.venue}</span>
             </div>
          </div>
       </button>
    </div>
  );
};

export const CalendarView = ({ 
  onEventClick, 
  onOpenConfig 
}: { 
  onEventClick: (e: EventData) => void; 
  onOpenConfig: () => void 
}) => {
  const todayRef = useRef<HTMLDivElement>(null);
  const [isCompact, setIsCompact] = useState(false);
  
  // Group events by Day
  const groupedEvents = useMemo(() => {
    const sorted = [...EVENTS].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    const groups: DayGroup[] = [];
    let currentGroup: DayGroup | null = null;
    const nowStr = new Date().toDateString();

    sorted.forEach(event => {
       const dateObj = new Date(event.start);
       const isoDate = dateObj.toDateString(); 
       
       if (!currentGroup || currentGroup.isoDate !== isoDate) {
          currentGroup = {
             isoDate: isoDate,
             dateLabel: getFullDateLabel(event.start),
             isToday: isoDate === nowStr,
             events: []
          };
          groups.push(currentGroup);
       }
       currentGroup.events.push(event);
    });

    return groups;
  }, []);

  const scrollToToday = () => {
    if (todayRef.current) {
        triggerHaptic('medium');
        // Scroll slightly above element for context
        todayRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const hasToday = groupedEvents.some(g => g.isToday);

  return (
    <div className="h-full relative font-sans animate-in fade-in duration-300 flex flex-col">
      
      {/* Unified Header */}
      <UnifiedHeader 
        left={
           <HeaderAction onClick={onOpenConfig}>
              <SlidersHorizontal size={20} strokeWidth={2.5} />
           </HeaderAction>
        }
        center={
           <button onClick={scrollToToday} className="flex flex-col items-center active:scale-95 transition">
             <HeaderTitle title="Itinerario" subtitle="Agenda 2026" />
             {hasToday && (
                <div className="text-[9px] font-bold text-[var(--ok)] uppercase tracking-wider flex items-center gap-1 mt-0.5 opacity-80 animate-pulse">
                   Ir a Hoy <ChevronDown size={10} />
                </div>
             )}
           </button>
        }
        right={
           <HeaderAction onClick={() => { triggerHaptic('light'); setIsCompact(!isCompact); }}>
              {isCompact ? <Rows size={20} strokeWidth={2.5} /> : <List size={20} strokeWidth={2.5} />}
           </HeaderAction>
        }
      />

      {/* Grouped List */}
      <div className="flex-1 overflow-y-auto no-scrollbar pt-28 pb-32 px-4 sm:px-6 scroll-smooth z-0">
         <div className="max-w-md mx-auto space-y-2">
            
            {groupedEvents.map((group, gIndex) => (
               <div 
                  key={group.isoDate} 
                  ref={group.isToday ? todayRef : null}
                  className="relative pb-4" 
               >
                  
                  {/* Sticky Date Header - Positioned to sit right below the Unified Header */}
                  {/* Top-20 (~80px) ensures it clears the 64px header + spacing */}
                  <div className="sticky top-[-1px] z-30 pt-4 pb-2 mb-2 transition-all">
                     {/* Gradient Mask for scrolling content */}
                     <div className="absolute inset-x-[-20px] -top-10 bottom-0 bg-[var(--bg)]/95 backdrop-blur-xl border-b border-white/5 shadow-lg mask-image-gradient" style={{ maskImage: "linear-gradient(to bottom, black 85%, transparent)" }}></div>
                     
                     <h2 className={cx("text-xs font-black uppercase tracking-[0.2em] pl-14 relative flex items-center z-10 transition-colors duration-300", group.isToday ? "text-[var(--o)] scale-105 origin-left" : "text-white")}>
                        <span className={cx("absolute left-3 top-1/2 -translate-y-1/2 w-8 h-0.5 rounded-full shadow-[0_0_10px_currentColor] transition-colors", group.isToday ? "bg-[var(--o)]" : "bg-white/50")} />
                        {group.isToday ? "HOY, " : ""}{group.dateLabel}
                     </h2>
                  </div>

                  {/* Events */}
                  <div className="pl-0">
                     {group.events.map((event, i) => {
                        const prevEvent = group.events[i - 1];
                        const isSameTime = prevEvent && getHour(prevEvent.start) === getHour(event.start);
                        
                        return (
                           <EventCard 
                              key={event.id}
                              event={event}
                              showTime={!isSameTime} 
                              isLastInDay={i === group.events.length - 1}
                              isCompact={isCompact}
                              onClick={() => onEventClick(event)}
                           />
                        );
                     })}
                  </div>

               </div>
            ))}
            
            {/* End of List Spacer */}
            <div className="h-32 flex flex-col items-center justify-center opacity-30 gap-2 mt-8">
               <div className="text-[10px] font-black uppercase tracking-[0.2em]">Fin de Agenda</div>
               <div className="flex gap-2">
                   <div className="w-1 h-1 rounded-full bg-white" />
                   <div className="w-1 h-1 rounded-full bg-white" />
                   <div className="w-1 h-1 rounded-full bg-white" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
