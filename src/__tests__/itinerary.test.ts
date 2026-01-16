import { describe, it, expect } from 'vitest';
import { generateItinerary } from '../utils/itinerary';
import { EventData } from '../types';

describe('generateItinerary', () => {
    const events: EventData[] = [
        { id: '1', title: 'Event 1', venue: 'V1', track: 'community', category: 'community', start: '2026-02-01T10:00:00Z', end: '2026-02-01T12:00:00Z', dress: '', color: '', image: '' },
        { id: '2', title: 'Event 2', venue: 'V2', track: 'beefdip', category: 'beef', start: '2026-01-15T09:00:00Z', end: '2026-01-15T11:00:00Z', dress: '', color: '', image: '' },
        { id: '3', title: 'Event 3', venue: 'V3', track: 'bearadise', category: 'community', start: '2026-01-20T14:00:00Z', end: '2026-01-20T16:00:00Z', dress: '', color: '', image: '' },
    ];

    it('orders events by start time ascending', () => {
        const result = generateItinerary(['1', '2', '3'], events);
        expect(result.map(e => e.id)).toEqual(['2', '3', '1']);
    });
});
