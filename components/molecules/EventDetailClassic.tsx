
import React, { useMemo } from 'react';
import { EventData } from '@/types';
import { triggerHaptic, cx } from '@/utils';
import { getTrackStyles, getTrackLabel } from '@/utils/branding';
import { Clock, Calendar, Navigation, MapPin } from 'lucide-react';
import { MetaHead } from '../atoms/MetaHead';
import { useLocale } from '@/context/LocaleContext';


import { useAppStore } from '@/store/useAppStore';
import { useGeofence } from '@/hooks/useGeofence';

interface EventDetailProps {
  event: EventData;
  onClose: () => void;
  onAction: () => void;
}

export const EventDetailClassic: React.FC<EventDetailProps> = ({ event, onClose, onAction: _onAction }) => {
  const { t, formatFullDate, formatTime } = useLocale();

  // const bgVal = getEventBackgroundValue(event.image, event.track, event.id); // Keeping for future use if needed, but commenting out for lint
  const fullDate = formatFullDate(event.start);

  const { agendaIds, toggleAgendaItem, isAuthenticated } = useAppStore();
  const isInAgenda = agendaIds.includes(event.id);

  // Real Geolocation Logic
  const { isNearby, loading: geoLoading } = useGeofence();

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const canRate = useMemo(() => {
    // Demo Logic: Hardcoded 'User is Nearby'
    return isNearby;
  }, [isNearby]);



  const handleOpenMap = () => {
    triggerHaptic('medium');
    const query = encodeURIComponent(`${event.venue} Puerto Vallarta`);
    // Try deep link first (geo protocol or universal link), fallback to web
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

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-8">
      <MetaHead
        title={event.title}
        description={`${event.venue} - ${t('agenda.addToItinerary')}`}
        image={event.image}
      />
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={() => { triggerHaptic('light'); onClose(); }}
      />

      {/* Card Container */}
      <div className="relative w-full md:max-w-5xl md:h-[85vh] bg-deep md:rounded-[48px] rounded-t-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row transform transition-all animate-in slide-in-from-bottom-full md:slide-in-from-bottom-10 md:zoom-in-95 duration-500">

        {/* Close Button (Mobile Only - For ease of reach) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 md:hidden w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 flex items-center justify-center active:scale-95"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* IMAGE SECTION (Top on Mobile, Left on Desktop) */}
        <div className="relative h-72 md:h-full md:w-[45%] shrink-0 group overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[var(--bg)]/50" />

          {/* Badge & Geofence (Overlaid on Image) */}
          <div className="absolute top-6 left-6 flex flex-col gap-2 items-start z-10">
            {/* Geofence Status */}
            {!geoLoading && (
              <div className={cx(
                "px-3 py-1.5 rounded-full backdrop-blur-md border flex items-center gap-1.5 shadow-lg",
                isNearby
                  ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                  : "bg-red-500/20 border-red-500/30 text-red-300"
              )}>
                <Navigation size={10} className={cx(isNearby ? "fill-current" : "")} />
                <span className="text-[9px] font-black uppercase tracking-widest">
                  {isNearby ? "Zona District" : "Fuera de Zona"}
                </span>
              </div>
            )}

            {/* Featured Badge */}
            {event.isFeatured && (
              <span className="px-3 py-1.5 rounded-full bg-white text-black text-[9px] font-black uppercase tracking-widest inline-block shadow-lg">
                {t('home.featured')}
              </span>
            )}
          </div>
        </div>

        {/* CONTENT SECTION (Bottom on Mobile, Right on Desktop) */}
        <div className="flex-1 flex flex-col bg-deep relative overflow-hidden">

          {/* Close Button (Desktop) */}
          <div className="hidden md:flex absolute top-6 right-6 z-20">
            <button
              onClick={() => { triggerHaptic('light'); onClose(); }}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="p-6 md:p-10 overflow-y-auto no-scrollbar flex-1">

            {/* Header Info */}
            <div className="mb-8">
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest inline-block shadow-lg mb-4 ${getTrackStyles(event.track).solidBg} ${getTrackStyles(event.track).solidText}`}>
                {getTrackLabel(event.track)}
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-[0.95] font-display uppercase tracking-tight mb-6">
                {event.title}
              </h2>

              {/* Bento Grid for Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Date */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-1 items-start">
                  <Calendar size={20} className="text-o mb-2" />
                  <span className="text-[9px] text-f uppercase font-bold tracking-widest">{t('event.date')}</span>
                  <span className="text-sm font-bold text-white capitalize">{fullDate}</span>
                </div>
                {/* Time */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-1 items-start">
                  <Clock size={20} className="text-o mb-2" />
                  <span className="text-[9px] text-f uppercase font-bold tracking-widest">{t('event.time')}</span>
                  <span className="text-sm font-bold text-white">{formatTime(event.start)} - {formatTime(event.end)}</span>
                </div>
                {/* Venue */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-1 items-start">
                  <MapPin size={20} className="text-o mb-2" />
                  <span className="text-[9px] text-f uppercase font-bold tracking-widest">{t('event.venue')}</span>
                  <span className="text-sm font-bold text-white leading-tight">{event.venue}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-[11px] text-f uppercase font-black tracking-widest mb-3 flex items-center gap-2">
                {t('event.about')}
                <div className="h-px bg-white/10 flex-1" />
              </h3>
              <p className="text-white/80 text-base leading-relaxed font-medium">
                {event.description || t('event.defaultDescription')}
              </p>

              {event.dress && (
                <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 bg-white/[0.03] rounded-full border border-white/5">
                  <span className="text-[10px] font-bold text-f uppercase tracking-wider">{t('event.dresscode')}</span>
                  <div className="h-3 w-px bg-white/10" />
                  <span className="text-[10px] font-black text-o uppercase tracking-wider">{event.dress}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {event.url && (
                <a href={event.url} target="_blank" rel="noopener noreferrer" className="h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-white transition-all">
                  <span className="material-symbols-outlined text-sm">public</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">{t('action.visitWebsite')}</span>
                </a>
              )}
              <button onClick={handleOpenMap} className="h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-white transition-all">
                <MapPin size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">{t('action.googleMaps')}</span>
              </button>
              <button onClick={handleShare} className="h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-white transition-all">
                <span className="material-symbols-outlined text-sm">share</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">{t('action.share')}</span>
              </button>
            </div>

            {/* Sticky/Bottom Agenda Action */}
            <div className="mt-auto">
              <button
                type="button"
                onClick={() => {
                  if (!isAuthenticated) return triggerHaptic('error');
                  triggerHaptic('success');
                  toggleAgendaItem(event.id);
                }}
                disabled={!isAuthenticated}
                className={cx(
                  "w-full h-16 rounded-2xl flex items-center justify-center gap-3 transition-all font-black uppercase tracking-[.2em] text-xs shadow-xl hover:scale-[1.01] active:scale-[0.98]",
                  isInAgenda
                    ? "bg-white text-black"
                    : "bg-gradient-to-r from-o to-o/80 text-white shadow-o/20",
                  !isAuthenticated && "opacity-50 cursor-not-allowed grayscale"
                )}
              >
                {isInAgenda ? (
                  <>
                    <span className="material-symbols-outlined icon-filled text-o">check_circle</span>
                    {t('action.addedToAgenda') || "EN MI AGENDA"}
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">bookmark_add</span>
                    {t('action.addToAgenda') || "AGREGAR A MI AGENDA"}
                  </>
                )}
              </button>
              {!isAuthenticated && (
                <p className="text-[10px] text-center text-white/40 mt-3 font-medium">
                  Inicia sesión para guardar este evento
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
