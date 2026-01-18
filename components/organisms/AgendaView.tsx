import React, { useState, useCallback, useMemo, useRef } from 'react';
import { EventData } from '@/types';
import { AgendaItem } from '../molecules/AgendaItem';
import { ArrowLeft, Calendar, Download } from 'lucide-react';
import { ItineraryPlanner } from '../molecules/ItineraryPlanner';
import { useLocale } from '@/context/LocaleContext';
import { useAppStore } from '@/store/useAppStore';
import { useDataset } from '@/context/DatasetContext';
import { AgendaShareCard } from '../molecules/AgendaShareCard';
import { toPng } from 'html-to-image';
import { triggerHaptic } from '@/utils';
import { useAuth } from '@/context/AuthContext';

export const AgendaView: React.FC<{ onBack?: () => void, onEventClick?: (e: EventData) => void }> = ({ onBack, onEventClick }) => {
    const { agendaIds, toggleAgendaItem, isAuthenticated } = useAppStore();
    const { user } = useAuth();
    const { events } = useDataset();
    const [showPlanner, setShowPlanner] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const shareRef = useRef<HTMLDivElement>(null);
    const { t } = useLocale();

    const handleToggle = useCallback((id: string) => {
        if (!isAuthenticated) return;
        toggleAgendaItem(id);
    }, [isAuthenticated, toggleAgendaItem]);

    const savedEvents = useMemo(() => {
        if (!isAuthenticated) return [];
        return events.filter((evt: EventData) => agendaIds.includes(evt.id));
    }, [agendaIds, events, isAuthenticated]);

    const handleShare = async () => {
        if (!shareRef.current || savedEvents.length === 0) return;
        triggerHaptic('medium');
        setIsSharing(true);

        try {
            // Small delay to ensure render
            await new Promise(resolve => setTimeout(resolve, 100));

            const dataUrl = await toPng(shareRef.current, { cacheBust: true, pixelRatio: 2 });
            const link = document.createElement('a');
            link.download = `DistritoAgenda-${new Date().toISOString().split('T')[0]}.png`;
            link.href = dataUrl;
            link.click();
            triggerHaptic('success');
        } catch (err) {
            console.error('Failed to generate image', err);
            triggerHaptic('error');
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <>
            <div className="flex flex-col h-full bg-deep text-white relative">
                <div className="p-6 pb-2 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {onBack && (
                            <button onClick={onBack} className="p-2 rounded-full bg-white/10 active:scale-95" aria-label={t('action.back', 'Volver')}>
                                <ArrowLeft size={20} />
                            </button>
                        )}
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[.2em] text-o">MY PLAN</div>
                            <h2 className="text-2xl font-black italic tracking-tighter font-display uppercase">Agenda</h2>
                        </div>
                    </div>
                </div>

                <div className="px-6">
                    <p className="text-[10px] text-f uppercase tracking-widest mt-1">
                        Demo informativa: inicia sesión para guardar; nada se envía a servidores.
                    </p>
                    <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3 opacity-70">
                            <div className="text-[10px] font-bold uppercase tracking-wider">{savedEvents.length} {t('checkout.quantity', 'EVENTOS')}</div>
                            <div className="w-1 h-1 bg-white/30 rounded-full" />
                            <div className="text-[10px] font-bold uppercase tracking-wider">{new Set(savedEvents.map((e: EventData) => e.venue)).size} {t('event.venue', 'LOCATIONS')}</div>
                        </div>

                        <div className="flex gap-2">
                            {isAuthenticated && savedEvents.length > 0 && (
                                <button
                                    onClick={handleShare}
                                    disabled={isSharing}
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all"
                                    aria-label="Descargar imagen"
                                >
                                    {isSharing ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <Download size={18} />}
                                </button>
                            )}
                            <button
                                onClick={() => isAuthenticated && setShowPlanner(true)}
                                disabled={!isAuthenticated}
                                className="px-3 py-2 h-10 rounded-full bg-primary-500 hover:bg-primary-400 text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Calendar size={14} />
                                <span>Crear Itinerario</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 pb-24 mt-2">
                    {savedEvents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[50vh] opacity-30 text-center">
                            <Calendar size={48} className="mb-4" />
                            <p className="font-bold uppercase tracking-wider">
                                {isAuthenticated ? 'Tu agenda está vacía' : 'Inicia sesión para crear tu agenda'}
                            </p>
                            <p className="text-xs max-w-[240px] mt-2">
                                {isAuthenticated
                                    ? 'Agrega eventos desde la sección de Explorar o Calendario'
                                    : 'Usa tu PIN demo para acceder; la agenda solo vive en tu dispositivo.'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {savedEvents.map((evt: EventData) => (
                                <AgendaItem
                                    key={evt.id}
                                    event={evt}
                                    isSelected={true}
                                    onToggle={handleToggle}
                                    onEventClick={onEventClick}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Hidden export layer - positioned off-screen but rendered */}
            <div className="fixed top-0 left-[-9999px] pointer-events-none">
                <AgendaShareCard ref={shareRef} events={savedEvents} user={user} />
            </div>

            {
                showPlanner && isAuthenticated && (
                    <ItineraryPlanner eventIds={agendaIds} onClose={() => setShowPlanner(false)} />
                )
            }
        </>
    );
};
