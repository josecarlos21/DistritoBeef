import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from '@/utils/storage';
import { z } from 'zod';
import { EventData } from '../types';

// --- Schemas ---
export const AgendaSchema = z.array(z.string());

export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    img: z.string().optional(),
    provider: z.enum(['apple', 'facebook', 'x', 'pin', 'guest']),
    lastLogin: z.string(),
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

    userRatings: Record<string, number>;

    // Actions
    toggleAgendaItem: (id: string) => void;
    setAgendaIds: (ids: string[]) => void;
    setItinerary: (itinerary: EventData[]) => void;
    login: (name: string, provider: 'apple' | 'facebook' | 'x' | 'pin' | 'guest', img?: string) => void;
    rateEvent: (eventId: string, rating: number) => void;
    enterAsGuest: () => void;
    logout: () => void;
}

// --- Store ---
export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            agendaIds: [],
            itinerary: [],
            userRatings: {},
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

            rateEvent: (eventId, rating) => set((state) => ({
                userRatings: { ...state.userRatings, [eventId]: rating }
            })),

            login: (name, provider, img) => {
                const newUser = {
                    id: `db-${Math.random().toString(36).substr(2, 9)}`,
                    name,
                    img,
                    provider,
                    lastLogin: new Date().toISOString(),
                    isDemoUser: true,
                };
                set({
                    user: UserSchema.parse(newUser),
                    isAuthenticated: true,
                    hasAccess: true,
                });
            },

            enterAsGuest: () => {
                const guestUser = {
                    id: 'guest',
                    name: 'Guest User',
                    provider: 'guest' as const,
                    lastLogin: new Date().toISOString(),
                    isDemoUser: true,
                };
                set({
                    user: UserSchema.parse(guestUser),
                    isAuthenticated: false,
                    hasAccess: true,
                });
            },

            logout: () => {
                set({
                    user: null,
                    isAuthenticated: false,
                    hasAccess: false,
                    agendaIds: [],
                    itinerary: [],
                    userRatings: {},
                });
            },
        }),
        {
            name: 'distrito-beef-storage',
            storage: createJSONStorage(() => idbStorage),
            partialize: (state) => ({
                agendaIds: state.agendaIds,
                itinerary: state.itinerary,
                user: state.user,
                userRatings: state.userRatings,
                hasAccess: state.hasAccess,
                isAuthenticated: state.isAuthenticated,
            } as AppState),
        }
    )
);
