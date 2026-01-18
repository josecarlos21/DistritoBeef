
import { EventData, TrackType } from '../types';
import { Dataset } from '@/schemas/dataset';

const CATEGORY_IMAGES: Record<string, string> = {
    pool: "https://images.unsplash.com/photo-1576402187878-974f70c890a5?auto=format&fit=crop&w=800&q=80", // Pool Party (Floaties/Water)
    night: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80", // Club/Night lights
    drag: "https://images.unsplash.com/photo-1596700813958-316496bac7d0?auto=format&fit=crop&w=800&q=80", // Drag performer (Vibrant)
    beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3c?auto=format&fit=crop&w=800&q=80", // Tropical Beach
    dining: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80", // Outdoor Dining/Cocktails
    leather: "https://images.unsplash.com/photo-1614713568397-b31b779d0498?auto=format&fit=crop&w=800&q=80", // Dark aesthetic (Leather/Night)
    foam: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80", // Splash/Foam
    activity: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=800&q=80", // Boat/Adventure
    bear: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80", // Nature/Forest (Bearadise vibe)
    default: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80" // Abstract Gradient
};

const mapTrack = (group: string): TrackType => {
    const g = group.toLowerCase();
    if (g.includes('beefdip')) return 'beefdip';
    if (g.includes('bearadise')) return 'bearadise';
    return 'community';
};

const mapImage = (type: string, venue: string): string => {
    const t = type.toLowerCase();
    const v = venue.toLowerCase();
    if (t.includes('pool')) return CATEGORY_IMAGES.pool;
    if (t.includes('drag') || t.includes('show')) return CATEGORY_IMAGES.drag;
    if (t.includes('beach') || v.includes('beach')) return CATEGORY_IMAGES.beach;
    if (t.includes('brunch') || t.includes('hour') || t.includes('dinner')) return CATEGORY_IMAGES.dining;
    if (t.includes('leather') || t.includes('underwear') || t.includes('jock')) return CATEGORY_IMAGES.leather;
    if (t.includes('foam')) return CATEGORY_IMAGES.foam;
    if (t.includes('tour') || t.includes('adventure')) return CATEGORY_IMAGES.activity;
    if (t.includes('club') || t.includes('party')) return CATEGORY_IMAGES.night;
    return CATEGORY_IMAGES.default;
};

const mapColor = (track: TrackType): string => {
    switch (track) {
        case 'beefdip': return 'var(--s)';
        case 'bearadise': return 'var(--ok)';
        default: return 'var(--o)';
    }
};

import { z } from 'zod';
import { logger } from './logger';

const RawEventSchema = z.object({
    Event_ID: z.string(),
    Evento: z.string(),
    Fecha: z.string(), // YYYY-MM-DD
    Inicio: z.string().nullable().optional(), // HH:MM
    Fin: z.string().nullable().optional(),
    Venue: z.string().nullable().optional(),
    Grupo: z.string().nullable().optional(),
    Tipo: z.string().nullable().optional(),
    'Dress code': z.string().nullable().optional(),
    Notas: z.string().nullable().optional(),
    'URL fuente': z.string().nullable().optional(),
});

export const mapDatasetToEvents = (data: Pick<Dataset, 'EVENTS_MASTER'>): EventData[] => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawList = data.EVENTS_MASTER as any[];
    const validEvents: EventData[] = [];

    rawList.forEach((evt, index) => {
        const result = RawEventSchema.safeParse(evt);

        if (!result.success) {
            logger.warn(`Skipping invalid event at index ${index}`, {
                id: evt?.Event_ID || 'unknown',
                errors: result.error
            });
            return;
        }

        const validEvt = result.data;

        // Runtime Logic Safety (Prevent Date Chrashes)
        if (!validEvt.Fecha) {
            logger.warn(`Skipping event ${validEvt.Event_ID}: Missing Date`);
            return;
        }

        const startHour = validEvt.Inicio || '12:00';
        const startIso = `${validEvt.Fecha}T${startHour}:00`;

        // Validate Date Validity
        if (isNaN(new Date(startIso).getTime())) {
            logger.warn(`Skipping event ${validEvt.Event_ID}: Invalid Date Format (${startIso})`);
            return;
        }

        let endIso = '';

        if (validEvt.Fin) {
            const startDate = new Date(startIso);
            const endDateString = `${validEvt.Fecha}T${validEvt.Fin}:00`;
            const endDate = new Date(endDateString);

            if (isNaN(endDate.getTime())) {
                // Fallback if end time is weird
                endIso = new Date(startDate.getTime() + 3 * 3600 * 1000).toISOString();
            } else {
                if (endDate < startDate) {
                    endDate.setDate(endDate.getDate() + 1);
                }
                endIso = endDate.toISOString().split('.')[0];
            }
        } else {
            const startDate = new Date(startIso);
            startDate.setHours(startDate.getHours() + 3);
            endIso = startDate.toISOString().split('.')[0];
        }

        const track = mapTrack(validEvt.Grupo || '');

        validEvents.push({
            id: validEvt.Event_ID,
            title: validEvt.Evento,
            venue: validEvt.Venue || 'TBA',
            track,
            category: track === 'beefdip' ? 'beef' : 'community',
            start: startIso,
            end: endIso,
            dress: validEvt['Dress code'] || 'Casual',
            color: mapColor(track),
            image: mapImage(validEvt.Tipo || '', validEvt.Venue || ''),
            description: validEvt.Notas || '',
            url: validEvt['URL fuente'] || undefined
        });
    });

    return validEvents;
};

export const getLocalEvents = async (): Promise<EventData[]> => {
    const baseModule = await import('@/context/base.json');
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const dataset = (baseModule as any).default ?? baseModule;
    return mapDatasetToEvents(dataset).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
};
