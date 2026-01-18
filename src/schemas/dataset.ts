import { z } from 'zod';

export const DatasetRecordSchema = z.object({
    Event_ID: z.string(),
    Evento: z.string(),
    Venue: z.string(),
    Grupo: z.string().optional().nullable(),
    Tipo: z.string().optional().nullable(),
    Fecha: z.string(),
    Inicio: z.string().optional().nullable(),
    Fin: z.string().optional().nullable(),
    Notas: z.string().optional().nullable(),
    'URL fuente': z.string().optional().nullable(),
    'Dress code': z.string().optional().nullable(),
}).passthrough();

export const DatasetSchema = z.object({
    EVENTS_MASTER: z.array(DatasetRecordSchema).default([]),
}).passthrough();

export type Dataset = z.infer<typeof DatasetSchema>;
