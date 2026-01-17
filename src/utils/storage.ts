
import { openDB } from 'idb';
import { StateStorage } from 'zustand/middleware';

const DB_NAME = 'distrito-beef-db';
const STORE_NAME = 'app-state';

const dbPromise = openDB(DB_NAME, 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
        }
    },
});

export const idbStorage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        try {
            const db = await dbPromise;
            const value = await db.get(STORE_NAME, name);
            return value || null;
        } catch (e) {
            console.error('Failed to get item from IDB:', e);
            return null;
        }
    },
    setItem: async (name: string, value: string): Promise<void> => {
        try {
            const db = await dbPromise;
            await db.put(STORE_NAME, value, name);
        } catch (e) {
            console.error('Failed to set item in IDB:', e);
        }
    },
    removeItem: async (name: string): Promise<void> => {
        try {
            const db = await dbPromise;
            await db.delete(STORE_NAME, name);
        } catch (e) {
            console.error('Failed to remove item from IDB:', e);
        }
    },
};
