
import { EventData, TrackType } from '../types';
import { Dataset } from '@/schemas/dataset';

const CATEGORY_IMAGES: Record<string, string> = {
    pool: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=60",
    night: "https://images.unsplash.com/photo-1566737236500-c8ac40014582?auto=format&fit=crop&w=800&q=60",
    drag: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=60",
    beach: "https://images.unsplash.com/photo-1571216664264-83984715f271?auto=format&fit=crop&w=800&q=60",
    dining: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=60",
    leather: "https://images.unsplash.com/photo-1514525253361-bee8718a7439?auto=format&fit=crop&w=800&q=60",
    foam: "https://images.unsplash.com/photo-1530103043960-ef38714abb15?auto=format&fit=crop&w=800&q=60",
    activity: "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=800&q=60",
    bear: "https://images.unsplash.com/photo-1572511443159-462a7424d67e?auto=format&fit=crop&w=800&q=60",
    default: "/bear_toon.png"
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
