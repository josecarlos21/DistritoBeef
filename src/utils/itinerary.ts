import { useAppStore } from '../store/useAppStore';
import { EventData } from '../types';



// --- Agenda Management (Legacy Bridge) ---
// Note: New code should use useAppStore().agendaIds directly.

export const getSavedAgenda = (): string[] => {
    // Bridge to allow non-reactive code to read current state
    return useAppStore.getState().agendaIds;
};

export const saveAgenda = (eventIds: string[]): void => {
    useAppStore.getState().setAgendaIds(eventIds);
};

export const toggleAgendaItem = (eventId: string): string[] => {
    useAppStore.getState().toggleAgendaItem(eventId);
    return useAppStore.getState().agendaIds;
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

/** Save the final itinerary to the store */
export const saveItinerary = (itinerary: EventData[]): void => {
    useAppStore.getState().setItinerary(itinerary);
};

/** Load saved itinerary from the store */
export const loadItinerary = (): EventData[] => {
    return useAppStore.getState().itinerary as EventData[];
};
