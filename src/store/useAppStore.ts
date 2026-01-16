import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { z } from 'zod';
import { EventData } from '../types';

// --- Schemas ---
export const AgendaSchema = z.array(z.string());

export const UserSchema = z.object({
    name: z.string(),
    img: z.string().optional(),
    isDemoUser: z.boolean().default(true),
}).nullable();

// --- Types ---
export type User = z.infer<typeof UserSchema>;

export interface AppState {
    agendaIds: string[];
    itinerary: EventData[];
    user: User;
    hasAccess: boolean;
    isAuthenticated: boolean;

    // Actions
    toggleAgendaItem: (id: string) => void;
    setAgendaIds: (ids: string[]) => void;
    setItinerary: (itinerary: EventData[]) => void;
    login: (name: string, img?: string) => void;
    enterAsGuest: () => void;
    logout: () => void;
}

// --- Store ---
export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            agendaIds: [],
            itinerary: [],
            user: null,
            hasAccess: false,
            isAuthenticated: false,

            setItinerary: (itinerary) => set({ itinerary }),

            toggleAgendaItem: (id) => set((state) => {
                const exists = state.agendaIds.includes(id);
                const updated = exists
                    ? state.agendaIds.filter(i => i !== id)
                    : [...state.agendaIds, id];
                return { agendaIds: AgendaSchema.parse(updated) };
            }),

            setAgendaIds: (ids) => set({ agendaIds: AgendaSchema.parse(ids) }),

            login: (name, img) => set({
                user: UserSchema.parse({ name, img, isDemoUser: true }),
                isAuthenticated: true,
                hasAccess: true,
            }),

            enterAsGuest: () => set({
                user: null,
                isAuthenticated: false,
                hasAccess: true,
            }),

            logout: () => {
                set({
                    user: null,
                    isAuthenticated: false,
                    hasAccess: false,
                    agendaIds: [],
                    itinerary: [],
                });
            },
        }),
        {
            name: 'distrito-beef-storage',
            partialize: (state) => ({
                agendaIds: state.agendaIds,
                itinerary: state.itinerary,
                user: state.user,
                hasAccess: state.hasAccess,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
