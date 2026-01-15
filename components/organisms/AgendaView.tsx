import React, { useState, useEffect } from 'react';
import { EVENTS } from '../../constants';
import { AgendaItem } from '../molecules/AgendaItem';
import { getSavedAgenda, toggleAgendaItem } from '../../src/utils/itinerary';
import { ArrowLeft, Calendar } from 'lucide-react';
import { ItineraryPlanner } from '../molecules/ItineraryPlanner';
import { useLocale } from '../../src/context/LocaleContext';

export const AgendaView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
    const [agendaIds, setAgendaIds] = useState<string[]>([]);
    const [showPlanner, setShowPlanner] = useState(false);
    const { t } = useLocale();

    useEffect(() => {
        setAgendaIds(getSavedAgenda());
    }, []);

    const handleToggle = (id: string) => {
        const updated = toggleAgendaItem(id);
        setAgendaIds(updated);
    };

    const savedEvents = EVENTS.filter(evt => agendaIds.includes(evt.id));

    return (
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
                    <button onClick={() => setShowPlanner(true)} className="ml-4 px-3 py-1 rounded bg-primary-500 hover:bg-primary-400 text-sm">Crear Itinerario</button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 pb-24">
                {savedEvents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[50vh] opacity-30 text-center">
                        <Calendar size={48} className="mb-4" />
                        <p className="font-bold uppercase tracking-wider">Tu agenda está vacía</p>
                        <p className="text-xs max-w-[200px] mt-2">Agrega eventos desde la sección de Explorar o Calendario</p>
                    </div>
                ) : (
                    savedEvents.map(evt => (
                        <AgendaItem
                            key={evt.id}
                            event={evt}
                            isSelected={true}
                            onToggle={handleToggle}
                        />
                    ))
                )}
            </div>
        </div>
{
        showPlanner && (
            <ItineraryPlanner eventIds={agendaIds} onClose={() => setShowPlanner(false)} />
        )
    }
    );
};
