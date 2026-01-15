import { EventData } from '../../types';

const ITINERARY_KEY = 'distrito_beef_itinerary';

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
