import React, { useEffect, useState } from 'react';
import { EVENTS } from '../../constants';
import { EventData } from '../../types';
import { AgendaItem } from '../molecules/AgendaItem';
import { getSavedAgenda, toggleAgendaItem } from '../../src/utils/itinerary';
import { ArrowLeft, Calendar } from 'lucide-react';
import { ItineraryPlanner } from '../molecules/ItineraryPlanner';
import { useLocale } from '../../src/context/LocaleContext';
import { useAuth } from '../../src/context/AuthContext';

export const AgendaView: React.FC<{ onBack?: () => void, onEventClick?: (e: EventData) => void }> = ({ onBack, onEventClick }) => {
    const [agendaIds, setAgendaIds] = useState<string[]>(() => getSavedAgenda());
    const [showPlanner, setShowPlanner] = useState(false);
    const { t } = useLocale();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            setAgendaIds([]);
            return;
        }
        setAgendaIds(getSavedAgenda());
    }, [isAuthenticated]);

    const handleToggle = (id: string) => {
        if (!isAuthenticated) return;
        const updated = toggleAgendaItem(id);
        setAgendaIds(updated);
    };

    const savedEvents = isAuthenticated ? EVENTS.filter(evt => agendaIds.includes(evt.id)) : [];

    return (
        <>
            <div className="flex flex-col h-full bg-deep text-white">
                <div className="p-6 pb-2 flex items-center gap-4">
                    {onBack && (
                        <button onClick={onBack} className="p-2 rounded-full bg-white/10 active:scale-95" aria-label={t('action.back', 'Volver')}>
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-[.2em] text-o">MY PLAN</div>
                        <h2 className="text-2xl font-black italic tracking-tighter font-display uppercase">Agenda</h2>
                        <p className="text-[10px] text-f uppercase tracking-widest mt-1">
                            Demo informativa: inicia sesión para guardar; nada se envía a servidores.
                        </p>
                        <div className="flex items-center gap-3 mt-1 opacity-70">
                            <div className="text-[10px] font-bold uppercase tracking-wider">{savedEvents.length} {t('checkout.quantity', 'EVENTOS')}</div>
                            <div className="w-1 h-1 bg-white/30 rounded-full" />
                            <div className="text-[10px] font-bold uppercase tracking-wider">{new Set(savedEvents.map(e => e.venue)).size} {t('event.venue', 'LOCATIONS')}</div>
                        </div>
                        <button
                            onClick={() => isAuthenticated && setShowPlanner(true)}
                            disabled={!isAuthenticated}
                            className="mt-3 px-3 py-1 rounded bg-primary-500 hover:bg-primary-400 text-sm font-bold uppercase tracking-wider shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Crear Itinerario
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 pb-24">
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
                        savedEvents.map(evt => (
                            <AgendaItem
                                key={evt.id}
                                event={evt}
                                isSelected={true}
                                onToggle={handleToggle}
                                onEventClick={onEventClick}
                            />
                        ))
                    )}
                </div>
            </div>
            {
                showPlanner && isAuthenticated && (
                    <ItineraryPlanner eventIds={agendaIds} onClose={() => setShowPlanner(false)} />
                )
            }
        </>
    );
};
