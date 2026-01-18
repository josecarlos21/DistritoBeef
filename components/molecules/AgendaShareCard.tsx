import React, { forwardRef } from 'react';
import { EventData } from '@/types';
import { getFullDateLabel, formatTime } from '@/utils';
import { ShieldCheck } from 'lucide-react';

interface AgendaShareCardProps {
    events: EventData[];
    user: { name: string } | null;
}

export const AgendaShareCard = forwardRef<HTMLDivElement, AgendaShareCardProps>(({ events, user }, ref) => {
    // Sort events by date
    const sortedEvents = [...events].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    // Group by Day
    const grouped: Record<string, EventData[]> = {};
    sortedEvents.forEach(evt => {
        const dayLabel = getFullDateLabel(evt.start);
        if (!grouped[dayLabel]) grouped[dayLabel] = [];
        grouped[dayLabel].push(evt);
    });

    return (
        <div ref={ref} className="bg-[#0f0b09] w-[400px] min-h-[600px] p-0 overflow-hidden relative font-sans text-white border-8 border-[#1a120b]">

            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[var(--accent-brown)]/20 blur-[80px] rounded-full pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 p-6 flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#2a1e16] to-[#1a120b]">
                <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent-brown)] mb-1">OFFICIAL ITINERARY</div>
                    <div className="text-2xl font-black font-display leading-none tracking-tight">DISTRICT<br />VALLARTA</div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{new Date().getFullYear()}</div>
                    <div className="text-lg font-bold text-white uppercase">{user?.name || 'GUEST'}</div>
                </div>
            </div>

            {/* List */}
            <div className="p-6 space-y-6 relative z-10">
                {Object.keys(grouped).length === 0 ? (
                    <div className="text-center py-20 opacity-50 uppercase font-black text-sm">No Events Selected</div>
                ) : (
                    Object.entries(grouped).map(([day, dayEvents]) => (
                        <div key={day} className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-4 bg-[var(--accent-brown)] rounded-full" />
                                <h3 className="text-sm font-black uppercase tracking-wide text-[var(--accent-brown)] shadow-black drop-shadow-md">{day}</h3>
                            </div>
                            <div className="space-y-3 pl-3 border-l border-white/10 ml-0.5">
                                {dayEvents.map(evt => (
                                    <div key={evt.id} className="relative pl-4">
                                        <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-[#0f0b09] bg-white/20" />
                                        <div className="text-[10px] font-mono opacity-60 mb-0.5">{formatTime(evt.start)} - {formatTime(evt.end)}</div>
                                        <div className="text-sm font-bold leading-tight mb-0.5">{evt.title}</div>
                                        <div className="text-[10px] font-bold text-[var(--accent-brown)] uppercase">{evt.venue}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="mt-8 p-6 bg-black/20 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/40">
                    <ShieldCheck size={14} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Verified Agenda</span>
                </div>
                <div className="text-[8px] font-bold uppercase tracking-widest text-[var(--accent-brown)]">distrito.yosoy.mx</div>
            </div>
        </div>
    );
});

AgendaShareCard.displayName = 'AgendaShareCard';
