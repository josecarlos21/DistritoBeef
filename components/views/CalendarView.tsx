
import React, { useMemo, useRef, useState } from 'react';
import { SlidersHorizontal, Clock, MapPin, ChevronDown, List, Rows } from 'lucide-react';
import { EventData } from '@/types';
import { getEventBackgroundValue, triggerHaptic, cx } from '@/utils';
import { UnifiedHeader, HeaderTitle, HeaderAction } from '../organisms';
import { useLocale } from '@/context/LocaleContext';
import { useDataset } from '@/context/DatasetContext';

interface DayGroup {
   dateLabel: string;
   isoDate: string;
   isToday: boolean;
   events: EventData[];
}

// Sub-component for a single event card within a day
interface EventCardProps extends React.LiHTMLAttributes<HTMLLIElement> {
   event: EventData;
   showTime: boolean;
   isLastInDay: boolean;
   isCompact: boolean;
   isClosest?: boolean;
   onClick: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
   event,
   showTime,
   isLastInDay,
   isCompact,
   isClosest,
   onClick,
   className,
   ...props
}) => {
   const { formatTime } = useLocale();
   const time = formatTime(event.start);
   const bgVal = getEventBackgroundValue(event.image, event.track, event.id);

   if (isCompact) {
      // COMPACT MODE RENDER
      return (
         <li id={`event-${event.id}`} {...props} className={cx("flex gap-4 relative group animate-in fade-in duration-300", className)}>
            <div className="w-14 shrink-0 flex flex-col items-end pt-3">
               <span className={cx("text-[11px] font-bold tracking-wider", showTime ? "text-o opacity-100" : "opacity-0")}>{time}</span>
            </div>

            <div className="w-4 flex flex-col items-center relative pt-4">
               <div className={cx("w-2.5 h-2.5 rounded-full border-2 border-b z-10 transition-colors", showTime ? "bg-o" : "bg-[var(--f)] opacity-30")} />
               {!isLastInDay && <div className="absolute top-6 bottom-[-16px] w-px border-l border-dashed border-white/10" />}
            </div>

            <button
               onClick={() => { triggerHaptic('light'); onClick(); }}
               className={cx(
                  "flex-1 py-3 pr-4 border-b border-white/5 active:opacity-50 text-left transition-all",
                  isClosest && "relative"
               )}
            >
               {isClosest && (
                  <div className="absolute inset-y-1 inset-x-[-10px] border-2 border-[var(--o)] rounded-xl pointer-events-none z-20 shadow-[0_0_20px_rgba(255,159,69,0.4)]" />
               )}
               <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-s px-1.5 py-0.5 rounded bg-white/5">{event.track}</span>
                  {isClosest && <span className="text-[9px] font-black uppercase tracking-wider text-o bg-o/10 px-1.5 py-0.5 rounded animate-pulse">AHORA</span>}
               </div>
               <div
                  className={cx(
                     "text-sm text-white leading-tight truncate",
                     isClosest ? "underline decoration-[var(--o)] decoration-2 underline-offset-4 font-black" : "font-bold"
                  )}
               >
                  {event.title}
               </div>
               <div className="text-[10px] text-f mt-0.5 truncate">{event.venue}</div>
            </button>
         </li>
      );
   }

   // DETAILED MODE RENDER
   return (
      <li id={`event-${event.id}`} {...props} className={cx("flex gap-4 relative group animate-in slide-in-from-bottom-2 duration-500", className)}>
         {/* Left Column: Time & Connector */}
         <div className="w-14 shrink-0 flex flex-col items-center relative pt-1">
            {/* Time Label */}
            <div className={`text-[11px] font-black tracking-wider mb-1 transition-opacity duration-300 ${showTime ? 'text-o opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
               {time}
            </div>

            {/* Dot */}
            <div className={`w-3 h-3 rounded-full border-2 border-b z-10 shadow-sm transition-all duration-300 ${showTime ? 'bg-o mt-0.5 scale-100' : 'bg-[var(--f)] opacity-30 mt-1 scale-75'}`} />

            {/* Connecting Line - Only render if not last in day */}
            {!isLastInDay && (
               <div className="absolute top-7 bottom-[-16px] w-px border-l-2 border-dashed border-white/10 left-1/2 -translate-x-1/2 z-0" />
            )}
         </div>

         {/* Right Column: Card */}
         <button
            onClick={() => { triggerHaptic('medium'); onClick(); }}
            className={cx(
               "flex-1 relative mb-[var(--space-md)] rounded-[40px] overflow-hidden border shadow-soft active:scale-[0.98] transition-all duration-300 bg-[var(--bg2)] min-h-[220px] text-left group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.7)] hover:scale-[1.01] flex flex-col justify-start",
               isClosest ? "border-[var(--o)] ring-4 ring-[var(--o)] ring-opacity-20 border-2" : "border-white/10"
            )}
         >
            {/* Bg with better overlay */}
            <div
               ref={(el) => {
                  if (el) el.style.setProperty('--event-bg', bgVal);
               }}
               className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen transition-transform duration-1000 group-hover:scale-110 dynamic-event-bg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />

            {/* Content Slot - Top Aligned per user request */}
            <div className="relative z-10 p-8 flex flex-col h-full w-full">
               {/* Top Badge Row */}
               <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-xl shadow-sm">
                     {event.track}
                  </span>

                  {isClosest && (
                     <div className="flex items-center gap-2 bg-[var(--o)] px-3 py-1.5 rounded-full animate-pulse shadow-[0_0_20px_var(--o)] border border-white/20 ml-auto">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">AHORA</span>
                        <div className="w-2 h-2 rounded-full bg-white" />
                     </div>
                  )}
               </div>

               {/* Title & Time */}
               <div className="flex flex-col gap-4">
                  <h3
                     className={cx(
                        "text-3xl text-white font-display font-black leading-[1.1] pr-6 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]",
                        isClosest ? "underline decoration-[var(--o)] decoration-4 underline-offset-8" : ""
                     )}
                  >
                     {event.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3">
                     {!showTime && (
                        <div className="flex items-center gap-2 text-[11px] font-black text-o uppercase bg-black/40 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/5 shadow-sm">
                           <Clock size={14} strokeWidth={3} />
                           {time}
                        </div>
                     )}

                     <div className="flex items-center gap-2 text-f bg-white/5 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/5 shadow-sm">
                        <MapPin size={14} className="text-s" strokeWidth={3} />
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">{event.venue}</span>
                     </div>
                  </div>
               </div>
            </div>
         </button>
      </li>
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
   const [isCompact, setIsCompact] = useState(true);
   const { t, formatFullDate, formatTime } = useLocale();
   const { events } = useDataset();

   // Group events by Day
   const { groupedEvents, closestEventId } = useMemo(() => {
      const now = new Date();
      const startOfToday = new Date(now);
      startOfToday.setHours(0, 0, 0, 0);

      // Filtering: Show full 'today' and all future events to satisfy "viera todo"
      const filtered = [...events]
         .filter(e => new Date(e.start).getTime() >= startOfToday.getTime())
         .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

      // Identify the closest event logic
      const nowTime = now.getTime();
      const PRE_START_BUFFER = 15 * 60 * 1000; // 15 mins

      // 1. Check for Active Events (happening right now OR starting in 15 mins)
      const activeEvents = filtered.filter(e => {
         const start = new Date(e.start).getTime();
         const end = new Date(e.end).getTime();
         return nowTime >= (start - PRE_START_BUFFER) && nowTime <= end;
      });

      // Pick the one that started latest (more relevant/fresh)
      const activeEvent = activeEvents.length > 0 ? activeEvents[activeEvents.length - 1] : null;

      // 2. If no active event, look for the next upcoming valid event
      const nextEvent = filtered.find(e => new Date(e.start).getTime() > nowTime);

      const closestEventId = activeEvent ? activeEvent.id : (nextEvent ? nextEvent.id : null);

      const groups: DayGroup[] = [];
      let currentGroup: DayGroup | null = null;
      const nowStr = now.toDateString();

      filtered.forEach(event => {
         const dateObj = new Date(event.start);
         const isoDate = dateObj.toDateString();

         if (!currentGroup || currentGroup.isoDate !== isoDate) {
            currentGroup = {
               isoDate: isoDate,
               dateLabel: formatFullDate(event.start),
               isToday: isoDate === nowStr,
               events: []
            };
            groups.push(currentGroup);
         }
         currentGroup.events.push(event);
      });

      return { groupedEvents: groups, closestEventId };
   }, [events, formatFullDate]);

   const scrollToToday = () => {
      if (todayRef.current) {
         triggerHaptic('medium');
         // Scroll slightly above element for context
         todayRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
   };

   const hasToday = groupedEvents.some(g => g.isToday);

   // Auto-scroll to closest event
   React.useEffect(() => {
      if (closestEventId) {
         const element = document.getElementById(`event-${closestEventId}`);
         if (element) {
            setTimeout(() => {
               element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500); // Delay to ensure render
         }
      } else if (todayRef.current) {
         setTimeout(() => {
            todayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
         }, 500);
      }
   }, [closestEventId]);

   return (
      <div className="h-full relative font-sans animate-in fade-in duration-300 flex flex-col">

         {/* Unified Header */}
         <UnifiedHeader
            left={
               <HeaderAction ariaLabel={t('action.settings')} onClick={onOpenConfig}>
                  <SlidersHorizontal size={20} strokeWidth={2.5} />
               </HeaderAction>
            }
            center={
               <button onClick={scrollToToday} className="flex flex-col items-center active:scale-95 transition">
                  <HeaderTitle title={t('header.itinerary')} subtitle={t('header.agenda')} />
                  {hasToday && (
                     <div className="text-[9px] font-bold text-ok uppercase tracking-wider flex items-center gap-1 mt-0.5 opacity-80 animate-pulse">
                        {t('cta.goToday')} <ChevronDown size={10} />
                     </div>
                  )}
               </button>
            }
            right={
               <HeaderAction ariaLabel="Toggle compact view" onClick={() => { triggerHaptic('light'); setIsCompact(!isCompact); }}>
                  {isCompact ? <Rows size={20} strokeWidth={2.5} /> : <List size={20} strokeWidth={2.5} />}
               </HeaderAction>
            }
         />

         {/* Grouped List */}
         <div className="flex-1 overflow-y-auto no-scrollbar pt-44 pb-40 px-[var(--space-md)] sm:px-[var(--space-lg)] md:px-[var(--space-xl)] scroll-smooth z-0">
            <div className="max-w-7xl mx-auto space-y-[var(--space-xs)]" role="list">

               {groupedEvents.map((group, _) => (
                  <div
                     key={group.isoDate}
                     ref={group.isToday ? todayRef : null}
                     role="listitem"
                     className="relative pb-[var(--space-md)]"
                  >

                     {/* Sticky Date Header - Positioned higher to clear UnifiedHeader area */}
                     <div className="sticky top-[20px] z-20 py-4 mb-4">
                        {/* More transparent backdrop as per "barra vacía" request */}
                        <div className="absolute inset-x-[-24px] -top-20 bottom-0 bg-[var(--bg)]/40 backdrop-blur-md border-b border-white/5 mask-image-bento-top"></div>

                        <h2 className={cx("text-[9px] font-black uppercase tracking-[0.4em] pl-14 relative flex items-center z-10 transition-colors duration-300", group.isToday ? "text-o" : "text-white/40")}>
                           <span className={cx("absolute left-3 top-1/2 -translate-y-1/2 w-8 h-px transition-colors", group.isToday ? "bg-o shadow-[0_0_8px_var(--o)]" : "bg-white/20")} />
                           {group.isToday ? t('calendar.today') : ""}{group.dateLabel}
                        </h2>
                     </div>

                     {/* Events */}
                     <ul className="pl-0 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-[var(--space-lg)] list-none">
                        {group.events.map((event, i) => {
                           const prevEvent = group.events[i - 1];
                           const isSameTime = prevEvent && formatTime(prevEvent.start) === formatTime(event.start);

                           return (
                              <EventCard
                                 key={event.id}
                                 event={event}
                                 showTime={!isSameTime}
                                 isLastInDay={i === group.events.length - 1}
                                 isCompact={isCompact}
                                 isClosest={event.id === closestEventId}
                                 onClick={() => onEventClick(event)}
                              />
                           );
                        })}
                     </ul>

                  </div>
               ))}

               {/* End of List Spacer */}
               <div role="presentation" className="h-32 flex flex-col items-center justify-center opacity-30 gap-2 mt-8">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em]">{t('list.endOfSchedule')}</div>
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
