
import React, { useMemo } from 'react';
import { EventData } from '@/types';
import { triggerHaptic, cx } from '@/utils';
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

  // Check if event is "Live" (1hr before start to 1hr after end)
  const isLive = useMemo(() => {
    // For demo purposes, we can uncomment next line to force LIVE state
    // return true; 
    const now = new Date();
    const startWindow = new Date(new Date(event.start).getTime() - 60 * 60 * 1000); // -1 hr
    const endWindow = new Date(new Date(event.end).getTime() + 60 * 60 * 1000);   // +1 hr
    return now >= startWindow && now <= endWindow;
  }, [event.start, event.end]);

  // Deterministic "random" stats based on event.id (stable across re-renders)
  const stats = useMemo(() => {
    const seed = event.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return {
      interested: (seed % 130) + 20,
      saved: (seed % 45) + 5,
      // If user rated, we show that. If not, we show "--" to indicate unranked.
      rating: userRating ? userRating.toFixed(1) : "--"
    };
  }, [event.id, userRating]);

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
      console.log('Share failed', err);
    }
  };

  const handleToggleAgenda = () => {
    if (!isAuthenticated) return triggerHaptic('error');
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
      <div className="relative w-full md:max-w-md bg-deep rounded-t-[32px] md:rounded-[32px] overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom-full md:zoom-in-95 duration-400 max-h-[90vh]">

        {/* Hero Image - Like Profile Cover */}
        <div className="relative h-40 md:h-44 shrink-0 group overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={() => { triggerHaptic('light'); onClose(); }}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/10 flex items-center justify-center active:scale-95 z-10"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>

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
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
              <span className="px-3 py-1 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse shadow-lg shadow-red-500/50">
                🔴 En Vivo
              </span>
            </div>
          )}

          {/* Title - Like Profile Name */}
          <div className="absolute bottom-4 left-5 right-5">
            <h2 className="text-2xl font-black text-white leading-[0.95] font-display uppercase tracking-tight drop-shadow-lg">
              {event.title}
            </h2>
          </div>
        </div>

        {/* Stats Row - Like Followers/Following */}
        <div className="flex justify-around py-4 border-b border-white/5 shrink-0">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-white font-bold text-lg">
              <Users size={14} className="text-o" />
              {stats.interested}
            </div>
            <span className="text-[9px] text-f uppercase tracking-widest">Interesados</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-white font-bold text-lg">
              <Bookmark size={14} className="text-o" />
              {stats.saved}
            </div>
            <span className="text-[9px] text-f uppercase tracking-widest">En Agenda</span>
          </div>
          <div className="h-8 w-px bg-white/10" />

          {/* Rating Section */}
          <div className="text-center cursor-pointer" onClick={() => isLive && !userRating && setShowRating(true)}>
            <div className={cx(
              "flex items-center justify-center gap-1 font-bold text-lg transition-colors",
              userRating ? "text-yellow-400" : "text-white/50"
            )}>
              <Star size={14} className={userRating ? "text-yellow-400 fill-current" : "text-white/30"} />
              {stats.rating}
            </div>
            <span className={cx(
              "text-[9px] uppercase tracking-widest",
              isLive && !userRating ? "text-o font-bold animate-pulse" : "text-f"
            )}>
              {userRating ? "Tu Rating" : (isLive ? "Calificar" : "Rating")}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto no-scrollbar flex-1">

          {/* Quick Info */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <MapPin size={14} className="text-o" />
              <span className="font-medium">{event.venue}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Clock size={14} className="text-o" />
              <span className="font-medium">{formatTime(event.start)} - {formatTime(event.end)}</span>
            </div>
          </div>

          {/* Date Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5 text-sm text-white/70 mb-4">
            <span className="material-symbols-outlined text-o text-sm">calendar_today</span>
            <span className="capitalize font-medium">{fullDate}</span>
          </div>

          {/* Description - Like Bio */}
          <p className="text-white/70 text-sm leading-relaxed mb-4">
            {event.description || t('event.defaultDescription')}
          </p>

          {event.dress && (
            <div className="flex items-center gap-2 text-[10px] mb-4">
              <span className="text-f uppercase font-bold tracking-wider">Dresscode:</span>
              <span className="text-o uppercase font-black tracking-wider">{event.dress}</span>
            </div>
          )}
        </div>

        {/* Actions - Sticky Bottom */}
        <div className="p-4 border-t border-white/5 shrink-0 space-y-3 bg-deep">
          {/* Primary CTA */}
          <button
            onClick={handleToggleAgenda}
            disabled={!isAuthenticated}
            className={cx(
              "w-full h-12 rounded-xl flex items-center justify-center gap-2 transition-all font-black uppercase tracking-widest text-[11px] active:scale-[0.98]",
              isInAgenda
                ? "bg-white text-black"
                : "bg-gradient-to-r from-o to-amber-500 text-white shadow-lg shadow-o/30",
              !isAuthenticated && "opacity-50 cursor-not-allowed"
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
              className="flex-1 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center gap-2 text-white transition-all text-sm font-medium"
            >
              <MapPin size={14} />
              Mapa
            </button>
            <button
              onClick={handleShare}
              className="flex-1 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center gap-2 text-white transition-all text-sm font-medium"
            >
              <Share2 size={14} />
              Compartir
            </button>
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
