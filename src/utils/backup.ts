import { z } from 'zod';
import { AgendaSchema, UserSchema, AppState } from '@/store/useAppStore';

const EventSchema = z.object({
    id: z.string(),
    title: z.string(),
    venue: z.string(),
    track: z.enum(['beefdip', 'bearadise', 'community']),
    category: z.enum(['beef', 'community']),
    start: z.string(),
    end: z.string(),
    dress: z.string().optional(),
    color: z.string(),
    image: z.string().default(''),
    description: z.string().optional(),
    url: z.string().optional(),
});

const BackupStateSchema = z.object({
    agendaIds: AgendaSchema,
    itinerary: z.array(EventSchema),
    user: UserSchema,
    hasAccess: z.boolean(),
    isAuthenticated: z.boolean(),
    userRatings: z.record(z.string(), z.number()).default({}),
});

export const BackupSchema = z.object({
    version: z.literal(1),
    exportedAt: z.string(),
    state: BackupStateSchema,
}).or(
    z.object({
        version: z.undefined(),
        exportedAt: z.string(),
        state: BackupStateSchema,
    }).transform((data) => ({ ...data, version: 1 as const }))
);

export type BackupPayload = z.infer<typeof BackupSchema>;

export const exportBackup = (state: AppState): BackupPayload => ({
    version: 1,
    exportedAt: new Date().toISOString(),
    state: {
        agendaIds: state.agendaIds,
        itinerary: state.itinerary,
        user: state.user,
        hasAccess: state.hasAccess,
        isAuthenticated: state.isAuthenticated,
        userRatings: state.userRatings ?? {},
    },
});

export const parseBackup = (payload: string): BackupPayload => {
    const parsed = BackupSchema.safeParse(JSON.parse(payload));
    if (!parsed.success) {
        throw new Error('Backup inválido');
    }
    return parsed.data;
};
