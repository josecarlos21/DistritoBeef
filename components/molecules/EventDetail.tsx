
import React, { useMemo } from 'react';
import { EventData } from '@/types';
import { triggerHaptic, cx, logger } from '@/utils';
import { getTrackStyles, getTrackLabel } from '@/utils/branding';
import { Clock, MapPin, Bookmark, Share2, Navigation, Users, Star } from 'lucide-react';
import { MetaHead } from '../atoms/MetaHead';
import { useLocale } from '@/context/LocaleContext';
import { useAppStore } from '@/store/useAppStore';
import { useGeofence } from '@/hooks/useGeofence';

import { RatingDialogue } from './RatingDialogue';

interface EventDetailProps {
  event: EventData;
  onClose: () => void;
  onAction: () => void;
}

/**
 * EventDetail - "Event Profile" Style
 * Treats the event like a social media profile for better UX engagement.
 * Design A - Primary design
 */
export const EventDetail: React.FC<EventDetailProps> = ({ event, onClose, onAction: _onAction }) => {
  const { t, formatFullDate, formatTime } = useLocale();
  const fullDate = formatFullDate(event.start);

  const { agendaIds, toggleAgendaItem, isAuthenticated, userRatings, rateEvent } = useAppStore();
  const isInAgenda = agendaIds.includes(event.id);
  const userRating = userRatings[event.id]; // 0 or undefined if not rated

  const { isNearby, loading: geoLoading } = useGeofence();
  const [showRating, setShowRating] = React.useState(false);

  // Check if event is "Live" (Strict: Start Time -> End Time + 1hr)
  const isLive = useMemo(() => {
    // return true; 
    const now = new Date();
    // Strict start (no pre-buffer), generous end (+1h post-event)
    const startWindow = new Date(event.start);
    const endWindow = new Date(new Date(event.end).getTime() + 60 * 60 * 1000);   // +1 hr

    return now >= startWindow && now <= endWindow;
  }, [event.start, event.end]);


  const handleOpenMap = () => {
    triggerHaptic('medium');
    const query = encodeURIComponent(`${event.venue} Puerto Vallarta`);
    window.location.href = `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const handleShare = async () => {
    triggerHaptic('medium');
    const shareData = {
      title: event.title,
      text: event.description || `Meet me at ${event.venue} for ${event.title}!`,
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.url}`);
        alert(t('action.linkCopied', '¡Enlace copiado!'));
      }
    } catch (err) {
      logger.error('Share failed', {}, err instanceof Error ? err : new Error(String(err)));
    }
  };

  const handleToggleAgenda = () => {
    triggerHaptic('success');
    toggleAgendaItem(event.id);
  };

  const handleRate = (rating: number) => {
    rateEvent(event.id, rating);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center">
      <MetaHead
        title={event.title}
        description={`${event.venue} - ${t('agenda.addToItinerary')}`}
        image={event.image}
      />

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-lg animate-in fade-in duration-300"
        onClick={() => { triggerHaptic('light'); onClose(); }}
      />

      {/* Profile Card */}
      <div className="relative w-full md:max-w-4xl bg-deep rounded-t-[32px] md:rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in slide-in-from-bottom-full md:zoom-in-95 duration-400 max-h-[90vh] md:h-[600px]">

        {/* Close Button - Global Position */}
        <button
          onClick={() => { triggerHaptic('light'); onClose(); }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/10 flex items-center justify-center active:scale-95 z-50 md:bg-black/20 md:hover:bg-black/40 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        {/* Left Column: Hero Image */}
        <div className="relative h-64 md:h-full md:w-[55%] shrink-0 group overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/20 to-transparent md:bg-gradient-to-t md:from-black/80 md:via-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getTrackStyles(event.track).solidBg} ${getTrackStyles(event.track).solidText}`}>
              {getTrackLabel(event.track)}
            </span>
            {!geoLoading && (
              <span className={cx(
                "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1",
                isNearby ? "bg-emerald-500/30 text-emerald-300" : "bg-red-500/30 text-red-300"
              )}>
                <Navigation size={8} className={isNearby ? "fill-current" : ""} />
                {isNearby ? "En Zona" : "Fuera"}
              </span>
            )}
          </div>

          {/* Live Badge if applicable */}
          {isLive && !userRating && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 md:left-auto md:right-16 md:translate-x-0 z-10">
              <span className="px-3 py-1 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse shadow-lg shadow-red-500/50">
                🔴 En Vivo
              </span>
            </div>
          )}

          {/* Title - Desktop Overlay Position */}
          <div className="absolute bottom-4 left-5 right-5 md:bottom-8 md:left-8 md:right-8">
            <h2 className="text-3xl md:text-4xl font-black text-white leading-[0.9] font-display uppercase tracking-tight drop-shadow-xl">
              {event.title}
            </h2>
          </div>
        </div>

        {/* Right Column: Content & Actions */}
        <div className="flex flex-col flex-1 md:w-[45%] md:h-full bg-deep relative">

          {/* Scrollable Content */}
          <div className="p-5 md:p-8 overflow-y-auto no-scrollbar flex-1">

            {/* Quick Info */}
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex items-center gap-3 text-white/90 text-sm p-3 rounded-xl bg-white/5 border border-white/5">
                <MapPin size={18} className="text-o shrink-0" />
                <span className="font-bold tracking-wide uppercase">{event.venue}</span>
              </div>
              <div className="flex items-center gap-3 text-white/90 text-sm p-3 rounded-xl bg-white/5 border border-white/5">
                <Clock size={18} className="text-o shrink-0" />
                <span className="font-bold tracking-wide">{formatTime(event.start)} - {formatTime(event.end)}</span>
              </div>
            </div>

            {/* Date Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5 text-sm text-white/70 mb-6">
              <span className="material-symbols-outlined text-o text-sm">calendar_today</span>
              <span className="capitalize font-medium">{fullDate}</span>
            </div>

            {/* Description */}
            <h3 className="text-[10px] font-black uppercase tracking-widest text-f mb-2">Sobre el evento</h3>
            <p className="text-white/80 text-sm leading-relaxed mb-6 font-medium">
              {event.description || t('event.defaultDescription')}
            </p>

            {event.dress && (
              <div className="flex items-center gap-2 text-xs mb-4 p-3 bg-white/5 rounded-xl">
                <span className="text-f uppercase font-black tracking-wider">Dresscode:</span>
                <span className="text-o uppercase font-black tracking-wider">{event.dress}</span>
              </div>
            )}
          </div>

          {/* Actions - Sticky Bottom */}
          <div className="p-4 md:p-6 border-t border-white/5 shrink-0 space-y-3 bg-deep z-20">
            {/* Primary CTA */}
            <button
              onClick={handleToggleAgenda}
              className={cx(
                "w-full h-12 rounded-xl flex items-center justify-center gap-2 transition-all font-black uppercase tracking-widest text-[11px] active:scale-[0.98]",
                isInAgenda
                  ? "bg-white text-black"
                  : "bg-gradient-to-r from-o to-amber-500 text-white shadow-lg shadow-o/30"
              )}
            >
              {isInAgenda ? (
                <>
                  <span className="material-symbols-outlined icon-filled text-o text-base">check_circle</span>
                  En Mi Agenda
                </>
              ) : (
                <>
                  <Bookmark size={16} />
                  Agregar a Agenda
                </>
              )}
            </button>

            {/* Secondary Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleOpenMap}
                className="flex-1 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center gap-2 text-white transition-all text-xs font-bold uppercase tracking-wide"
              >
                <MapPin size={14} />
                Mapa
              </button>
              <button
                onClick={handleShare}
                className="flex-1 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center gap-2 text-white transition-all text-xs font-bold uppercase tracking-wide"
              >
                <Share2 size={14} />
                Compartir
              </button>
            </div>
          </div>
        </div>
      </div>

      <RatingDialogue
        isOpen={showRating}
        onClose={() => setShowRating(false)}
        onRate={handleRate}
        title={event.title}
      />
    </div>
  );
};
