import { openDB } from 'idb';
import { mapDatasetToEvents } from '@/utils/dataMapper';
import { Dataset, DatasetSchema } from '@/schemas/dataset';
import { EventData } from '@/types';

const DB_NAME = 'distrito-beef-dataset';
const STORE_NAME = 'dataset-cache';
const TTL_MS = 1000 * 60 * 15; // 15 minutes

interface DatasetCacheEntry {
    dataset: Dataset;
    etag?: string;
    updatedAt: number;
    source: 'remote' | 'local' | 'cache';
}

const openDatasetDB = async () => openDB(DB_NAME, 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
        }
    },
});

const cacheKey = 'dataset-entry';

const readCache = async (): Promise<DatasetCacheEntry | null> => {
    try {
        const db = await openDatasetDB();
        const cached = await db.get(STORE_NAME, cacheKey);
        if (!cached) return null;
        const parsed = DatasetSchema.safeParse(cached.dataset);
        if (!parsed.success) return null;
        return { ...cached, dataset: parsed.data };
    } catch {
        return null;
    }
};

const writeCache = async (entry: DatasetCacheEntry) => {
    try {
        const db = await openDatasetDB();
        await db.put(STORE_NAME, entry, cacheKey);
    } catch {
        // cache failures are non-fatal
    }
};

const toHex = (buffer: ArrayBuffer) => Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');

const computeHash = async (payload: unknown) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(payload));
    const digest = await crypto.subtle.digest('SHA-256', data);
    return toHex(digest);
};

export const getLocalDataset = async (): Promise<Dataset> => {
    const baseModule = await import('@/context/base.json');
    const parsed = DatasetSchema.safeParse((baseModule as { default?: unknown }).default ?? baseModule);
    if (!parsed.success) throw new Error('Dataset local inválido');
    return parsed.data;
};

export interface DatasetLoadResult {
    dataset: Dataset;
    events: EventData[];
    etag?: string;
    updatedAt: number;
    status: 'fresh' | 'cache' | 'fallback' | 'rejected';
    message?: string;
}

export const loadDataset = async (forceRefresh = false): Promise<DatasetLoadResult> => {
    const now = Date.now();
    const cached = await readCache();

    if (!forceRefresh && cached && now - cached.updatedAt < TTL_MS) {
        return {
            dataset: cached.dataset,
            events: mapDatasetToEvents(cached.dataset),
            etag: cached.etag,
            updatedAt: cached.updatedAt,
            status: 'cache',
            message: 'TTL válido, usando cache',
        };
    }

    const localFallback = async (reason: string): Promise<DatasetLoadResult> => {
        if (cached) {
            return {
                dataset: cached.dataset,
                events: mapDatasetToEvents(cached.dataset),
                etag: cached.etag,
                updatedAt: cached.updatedAt,
                status: 'fallback',
                message: reason,
            };
        }

        const local = await getLocalDataset();
        await writeCache({ dataset: local, etag: undefined, updatedAt: now, source: 'local' });
        return {
            dataset: local,
            events: mapDatasetToEvents(local),
            updatedAt: now,
            status: 'fallback',
            message: reason,
        };
    };

    try {
        const headers: Record<string, string> = {};
        if (cached?.etag) headers['If-None-Match'] = cached.etag;

        const response = await fetch('/api/base', { headers });

        if (response.status === 304 && cached) {
            return {
                dataset: cached.dataset,
                events: mapDatasetToEvents(cached.dataset),
                etag: cached.etag,
                updatedAt: cached.updatedAt,
                status: 'cache',
                message: 'Etag sin cambios',
            };
        }

        if (!response.ok) {
            return localFallback(`Fetch falló (${response.status})`);
        }

        const json = await response.json();
        const parsed = DatasetSchema.safeParse(json);

        if (!parsed.success) {
            return localFallback('Dataset remoto inválido');
        }

        const etag = response.headers.get('ETag') || await computeHash(parsed.data.EVENTS_MASTER);
        const entry: DatasetCacheEntry = {
            dataset: parsed.data,
            etag,
            updatedAt: now,
            source: 'remote',
        };

        await writeCache(entry);

        return {
            dataset: parsed.data,
            events: mapDatasetToEvents(parsed.data),
            etag,
            updatedAt: now,
            status: 'fresh',
            message: 'Dataset remoto actualizado',
        };
    } catch (error) {
        return localFallback(error instanceof Error ? error.message : 'Error remoto desconocido');
    }
};

