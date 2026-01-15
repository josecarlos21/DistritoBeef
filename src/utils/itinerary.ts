import { EventData } from '../../types';

const AGENDA_KEY = 'distrito_beef_agenda';
const ITINERARY_KEY = 'distrito_beef_itinerary';

// --- Agenda Management (List of Saved Event IDs) ---

export const getSavedAgenda = (): string[] => {
    try {
        const saved = localStorage.getItem(AGENDA_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error('Error loading agenda', e);
        return [];
    }
};

export const saveAgenda = (eventIds: string[]): void => {
    try {
        localStorage.setItem(AGENDA_KEY, JSON.stringify(eventIds));
    } catch (e) {
        console.error('Error saving agenda', e);
    }
};

export const toggleAgendaItem = (eventId: string): string[] => {
    const current = getSavedAgenda();
    let updated: string[];
    if (current.includes(eventId)) {
        updated = current.filter(id => id !== eventId);
    } else {
        updated = [...current, eventId];
    }
    saveAgenda(updated);
    return updated;
};

export const isEventInAgenda = (eventId: string, agendaIds: string[]): boolean => {
    return agendaIds.includes(eventId);
};

// --- Itinerary Planning (Ordered Schedule) ---

/**
 * Generate an ordered itinerary from a list of event IDs.
 * Simple heuristic: sort events by their start time.
 */
export const generateItinerary = (eventIds: string[], allEvents: EventData[]): EventData[] => {
    const selected = allEvents.filter(evt => eventIds.includes(evt.id));
    // Assuming start is ISO string; sort ascending
    return selected.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
};

/** Save the final itinerary to localStorage */
export const saveItinerary = (itinerary: EventData[]): void => {
    try {
        localStorage.setItem(ITINERARY_KEY, JSON.stringify(itinerary));
    } catch (e) {
        console.error('Error saving itinerary', e);
    }
};

/** Load saved itinerary */
export const loadItinerary = (): EventData[] => {
    try {
        const saved = localStorage.getItem(ITINERARY_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error('Error loading itinerary', e);
        return [];
    }
};
