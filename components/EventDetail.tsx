
import React from 'react';
import { EventData } from '../types';
import { getHour, getEventBackgroundStyle, triggerHaptic, getFullDateLabel } from '../utils';
import { MapPin, CalendarPlus, Navigation, Clock, Calendar } from 'lucide-react';

interface EventDetailProps {
  event: EventData;
  onClose: () => void;
  onAction: () => void;
}

export const EventDetail: React.FC<EventDetailProps> = ({ event, onClose, onAction }) => {
  const bgStyle = getEventBackgroundStyle(event.image, event.track, event.id);
  const fullDate = getFullDateLabel(event.start);

  return (
    <div className="absolute inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-md transition-opacity animate-in fade-in duration-300" 
        style={{ background: "rgba(0,0,0,0.85)" }}
        onClick={() => { triggerHaptic('light'); onClose(); }}
      ></div>
      
      {/* Card */}
      <div className="relative w-full sm:max-w-md sm:rounded-[32px] rounded-t-[32px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-full duration-500" style={{ background: "#1a120b", borderColor: "var(--b)" }}>
        
        {/* Image Header */}
        <div className="h-72 relative shrink-0 group">
          <div className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={bgStyle} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a120b] via-[#1a120b]/40 to-transparent"></div>
          
          <button 
            onClick={() => { triggerHaptic('light'); onClose(); }}
            className="absolute top-4 right-4 w-10 h-10 rounded-full backdrop-blur-md text-white flex items-center justify-center border z-10 hover:bg-white/20 transition-all active:scale-95"
            style={{ background: "rgba(0,0,0,0.4)", borderColor: "rgba(255,255,255,0.15)" }}
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>

          <div className="absolute bottom-6 left-6 right-6">
             <div className="flex items-center gap-2 mb-3">
                 <span className="px-2.5 py-1 rounded-md text-black text-[9px] font-black uppercase tracking-widest inline-block shadow-lg" style={{ background: "var(--o)" }}>
                  {event.track}
                 </span>
                 {event.isFeatured && (
                    <span className="px-2.5 py-1 rounded-md bg-white text-black text-[9px] font-black uppercase tracking-widest inline-block shadow-lg">
                        Destacado
                    </span>
                 )}
             </div>
             <h2 className="text-3xl font-black text-white leading-[0.95] font-display uppercase tracking-tight drop-shadow-xl">{event.title}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-2 overflow-y-auto no-scrollbar" style={{ background: "#1a120b" }}>
          
          {/* Key Info Grid */}
          <div className="grid grid-cols-1 gap-4 mb-8 bg-white/5 p-4 rounded-2xl border border-white/5">
             {/* Date */}
             <div className="flex items-start gap-3">
                <Calendar size={18} className="text-[var(--o)] shrink-0 mt-0.5" strokeWidth={2.5} />
                <div>
                  <p className="text-[10px] text-[var(--f)] uppercase font-black tracking-widest mb-0.5">Fecha</p>
                  <p className="text-white font-bold text-sm capitalize">{fullDate}</p>
                </div>
             </div>
             
             {/* Time */}
             <div className="flex items-start gap-3">
                <Clock size={18} className="text-[var(--o)] shrink-0 mt-0.5" strokeWidth={2.5} />
                <div>
                  <p className="text-[10px] text-[var(--f)] uppercase font-black tracking-widest mb-0.5">Horario</p>
                  <p className="text-white font-bold text-sm">{getHour(event.start)} - {getHour(event.end)}</p>
                </div>
             </div>

             {/* Venue */}
             <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[var(--o)] shrink-0 mt-0.5" strokeWidth={2.5} />
                <div>
                  <p className="text-[10px] text-[var(--f)] uppercase font-black tracking-widest mb-0.5">Ubicación</p>
                  <p className="text-white font-bold text-sm">{event.venue}</p>
                </div>
             </div>
          </div>

          <div className="mb-8">
            <p className="text-[10px] text-[var(--f)] uppercase font-black tracking-widest mb-3">Sobre el evento</p>
            <p className="text-white/90 text-sm leading-relaxed font-medium">
              {event.description || "Este es un evento de la comunidad. Asiste, conecta y disfruta del ambiente del distrito."}
            </p>
            {event.dress && (
                <div className="mt-5 flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/5">
                    <span className="text-[10px] font-bold text-[var(--f)] uppercase tracking-wider">Dresscode</span>
                    <div className="h-4 w-px bg-white/10" />
                    <span className="text-[10px] font-black text-[var(--o)] uppercase tracking-wider">{event.dress}</span>
                </div>
            )}
          </div>

          <div className="flex gap-3 mb-4 sticky bottom-0 pb-2">
              <button 
                onClick={() => { triggerHaptic('light'); onClose(); }}
                className="flex-1 h-14 text-white font-bold rounded-2xl uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all active:scale-95 flex items-center justify-center gap-2 bg-[#1a120b]"
              >
                <CalendarPlus size={16} strokeWidth={2.5} />
                <span className="text-[10px]">Agendar</span>
              </button>
              
              <button 
                onClick={() => { triggerHaptic('medium'); onAction(); }}
                className="flex-[2] h-14 text-black font-black rounded-2xl uppercase tracking-widest shadow-[0_4px_30px_rgba(255,159,69,0.3)] hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-2" 
                style={{ background: "var(--o)" }}
              >
                <Navigation size={16} fill="currentColor" strokeWidth={2.5} />
                <span className="text-[10px]">Cómo llegar</span>
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};
