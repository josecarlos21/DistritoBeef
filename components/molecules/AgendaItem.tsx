import React from 'react';
import { EventData } from '../../types';
import { MapPin, Plus } from 'lucide-react';
import { getTrackStyles, getTrackLabel } from '../../src/utils/branding';

interface AgendaItemProps {
    event: EventData;
    isSelected: boolean;
    onToggle: (id: string) => void;
    onEventClick?: (event: EventData) => void;
}

export const AgendaItem: React.FC<AgendaItemProps> = ({ event, isSelected, onToggle, onEventClick }) => {
    return (
        <div
            onClick={() => onEventClick?.(event)}
            className={`relative flex items-center p-4 rounded-xl mb-3 border transition-all cursor-pointer hover:bg-white/10 ${isSelected
                ? 'bg-orange-500/10 border-orange-500/50'
                : 'bg-white/5 border-white/10'
                }`}
        >
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getTrackStyles(event.track).badgeBg} ${getTrackStyles(event.track).badgeText}`}>
                        {getTrackLabel(event.track)}
                    </span>
                    <span className="text-xs text-white/50 font-mono tracking-tighter">
                        {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>

                <h3 className="font-bold text-lg leading-tight mb-1">{event.title}</h3>

                <div className="flex items-center gap-4 text-xs text-white/60">
                    <div className="flex items-center gap-1">
                        <MapPin size={12} className="text-orange-500" />
                        <span>{event.venue}</span>
                    </div>
                </div>
            </div>

            <div
                onClick={(e) => { e.stopPropagation(); onToggle(event.id); }}
                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${isSelected ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'bg-white/10 hover:bg-white/20'
                    }`}
            >
                {isSelected ? <span className="font-bold text-xl">✓</span> : <Plus size={20} className="text-white" />}
            </div>
        </div>
    );
};
