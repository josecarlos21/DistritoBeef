
import React from 'react';
import { EventData } from '../../types';
import { triggerHaptic, cx } from '../../src/utils';
import { getTrackStyles, getTrackLabel } from '../../src/utils/branding';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { useLocale } from '../../src/context/LocaleContext';
import { useAuth } from '../../src/context/AuthContext';
import { getSavedAgenda, toggleAgendaItem } from '../../src/utils/itinerary';

interface EventDetailProps {
  event: EventData;
  onClose: () => void;
  onAction: () => void;
}

export const EventDetail: React.FC<EventDetailProps> = ({ event, onClose, onAction: _onAction }) => {
  const { t, formatFullDate, formatTime } = useLocale();

  // const bgVal = getEventBackgroundValue(event.image, event.track, event.id); // Keeping for future use if needed, but commenting out for lint
  const fullDate = formatFullDate(event.start);
  const [isInAgenda, setIsInAgenda] = React.useState(false);
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    setIsInAgenda(getSavedAgenda().includes(event.id));
  }, [event.id]);

  // Demo Logic: Hardcoded 'User is Nearby'
  const isNearby = true;

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const canRate = React.useMemo(() => {
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
    <div className="absolute inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-md transition-opacity animate-in fade-in duration-300 bg-black-85"
        onClick={() => { triggerHaptic('light'); onClose(); }}
      ></div>

      {/* Card */}
      <div className="relative w-full sm:max-w-md sm:rounded-[40px] rounded-t-[40px] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] border-t border-white-20 sm:border border-white-10 flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-full duration-500 bg-deep">

        {/* Image Header */}
        <div className="h-80 relative shrink-0 group">

          <div className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: `url(${event.image})` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a120b] via-[#1a120b]/30 to-transparent"></div>

          <button
            type="button"
            onClick={() => { triggerHaptic('light'); onClose(); }}
            className="absolute top-4 right-4 w-10 h-10 rounded-full backdrop-blur-md text-white flex items-center justify-center border z-10 hover:bg-white/20 transition-all active:scale-95 shadow-lg bg-black-40 border-white-15"
          >
            <span className="material-symbols-outlined text-lg">✕</span>
          </button>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest inline-block shadow-lg ${getTrackStyles(event.track).solidBg} ${getTrackStyles(event.track).solidText}`}>
                  {getTrackLabel(event.track)}
                </span>
                {event.isFeatured && (
                  <span className="px-2.5 py-1 rounded-md bg-white text-black text-[9px] font-black uppercase tracking-widest inline-block shadow-lg">
                    {t('home.featured')}
                  </span>
                )}
              </div>
              <h2 className="text-3xl font-black text-white leading-[0.95] font-display uppercase tracking-tight drop-shadow-xl">{event.title}</h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-2 overflow-y-auto no-scrollbar bg-deep">

          {/* Key Info Grid */}
          <div className="grid grid-cols-1 gap-4 mb-8 bg-white/5 p-5 rounded-3xl border border-white/5 shadow-inner">
            {/* Date */}
            <div className="flex items-start gap-3">
              <Calendar size={18} className="text-o shrink-0 mt-0.5" strokeWidth={2.5} />
              <div>
                <p className="text-[10px] text-[var(--f)] uppercase font-black tracking-widest mb-0.5">{t('event.date')}</p>
                <p className="text-white font-bold text-sm capitalize">{fullDate}</p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-start gap-3">
              <Clock size={18} className="text-o shrink-0 mt-0.5" strokeWidth={2.5} />
              <div>
                <p className="text-[10px] text-[var(--f)] uppercase font-black tracking-widest mb-0.5">{t('event.time')}</p>
                <p className="text-white font-bold text-sm">{formatTime(event.start)} - {formatTime(event.end)}</p>
              </div>
            </div>

            {/* Venue */}
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-o shrink-0 mt-0.5" strokeWidth={2.5} />
              <div>
                <p className="text-[10px] text-[var(--f)] uppercase font-black tracking-widest mb-0.5">{t('event.venue')}</p>
                <p className="text-white font-bold text-sm">{event.venue}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-[10px] text-f uppercase font-black tracking-widest mb-3">{t('event.about')}</p>
            <p className="text-white/90 text-sm leading-relaxed font-medium">
              {event.description || t('event.defaultDescription')}
            </p>
            {event.dress && (
              <div className="mt-5 flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/5">
                <span className="text-[10px] font-bold text-f uppercase tracking-wider">{t('event.dresscode')}</span>
                <div className="h-4 w-px bg-white/10" />
                <span className="text-[10px] font-black text-o uppercase tracking-wider">{event.dress}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 sticky bottom-0 pb-2">
            <div className="grid grid-cols-3 gap-3">
              {/* Website Button */}
              {event.url && (
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => triggerHaptic('light')}
                  className="h-12 bg-white/5 border border-white/10 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-sm">public</span>
                  <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">{t('action.visitWebsite')}</span>
                </a>
              )}

              {/* Google Maps Button */}
              <button
                type="button"
                onClick={handleOpenMap}
                className={cx(
                  "h-12 bg-white/5 border border-white/10 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition active:scale-[0.98]",
                  event.url ? "col-span-1" : "col-span-2"
                )}
              >
                <MapPin size={14} strokeWidth={2.5} />
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">{t('action.googleMaps')}</span>
              </button>

              {/* Share Button */}
              <button
                type="button"
                onClick={handleShare}
                className="h-12 bg-white/5 border border-white/10 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-sm">share</span>
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">{t('action.share')}</span>
              </button>
            </div>

            {/* Add to Agenda Button */}
            <button
              type="button"
              onClick={() => {
                if (!isAuthenticated) {
                  triggerHaptic('error');
                  return;
                }
                triggerHaptic('success');
                setIsInAgenda(!isInAgenda);
                toggleAgendaItem(event.id);
              }}
              disabled={!isAuthenticated}
              className={cx(
                "col-span-2 h-14 rounded-2xl flex items-center justify-center gap-3 transition-all font-black uppercase tracking-[.2em] text-[11px] shadow-lg mb-4",
                isInAgenda
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-white/10 text-white hover:bg-white/20 border border-white/10",
                !isAuthenticated && "opacity-50 cursor-not-allowed"
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
            <p className="col-span-2 text-[9px] text-center text-white/40 uppercase tracking-widest pb-4">
              {!isAuthenticated
                ? "App informativa: inicia sesión para guardar eventos (solo en este dispositivo)."
                : isInAgenda
                  ? "Evento guardado en tu itinerario"
                  : "Guarda este evento para armar tu plan"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
