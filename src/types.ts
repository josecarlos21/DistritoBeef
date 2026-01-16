export type TrackType = 'beefdip' | 'bearadise' | 'community';

export interface EventData {
    id: string;
    title: string;
    venue: string;
    track: TrackType;
    category: 'beef' | 'community';
    start: string;
    end: string;
    dress?: string;
    color: string;
    image: string;
    description?: string;
    url?: string;
    isFeatured?: boolean;
}
