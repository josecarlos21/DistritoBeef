import React, { useState } from 'react';
import { EventData } from '../../types';
import { generateItinerary, saveItinerary } from '../../src/utils/itinerary';
import { EVENTS } from '../../constants';
import { X } from 'lucide-react';

interface ItineraryPlannerProps {
    eventIds: string[];
    onClose: () => void;
}

export const ItineraryPlanner: React.FC<ItineraryPlannerProps> = ({ eventIds, onClose }) => {
    const allEvents = EVENTS;
    const initialItinerary = generateItinerary(eventIds, allEvents);
    const [selectedIds, setSelectedIds] = useState<string[]>(initialItinerary.map((e: EventData) => e.id));

    const toggle = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const confirm = () => {
        const finalItinerary = generateItinerary(selectedIds, allEvents);
        saveItinerary(finalItinerary);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-deep text-white p-6 rounded-lg w-11/12 max-w-2xl max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Crear Itinerario</h2>
                    <button onClick={onClose} className="p-1 rounded hover:bg-white/10" aria-label="Close">
                        <X size={20} />
                    </button>
                </div>
                <ul className="space-y-2">
                    {allEvents
                        .filter(evt => eventIds.includes(evt.id))
                        .map(evt => (
                            <li key={evt.id} className="flex items-center justify-between">
                                <span>{evt.title} ({new Date(evt.start).toLocaleString()})</span>
                                <input
                                    type="checkbox"
                                    title={`Select ${evt.title}`}
                                    checked={selectedIds.includes(evt.id)}
                                    onChange={() => toggle(evt.id)}
                                />
                            </li>
                        ))}
                </ul>
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500">
                        Cancelar
                    </button>
                    <button onClick={confirm} className="px-4 py-2 rounded bg-primary-500 hover:bg-primary-400">
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};
