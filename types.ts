
export type TrackType = "community" | "beefdip" | "bearadise";
export type TabType = "home" | "social" | "calendar" | "wallet" | "map";

export type ZoomLevel = 0 | 1 | 2 | 3;

export interface EventData {
  id: string;
  day?: string; // @deprecated: Calculated dynamically from 'start'
  title: string;
  venue: string;
  track: TrackType;
  start: string; // ISO string
  end: string; // ISO string
  dress: string;
  color: string;
  image: string;
  description?: string;
  isFeatured?: boolean;
}

export interface AmbienceState {
  g: number; // Nebula/Gradient intensity
  h: number; // Hue
  a: number; // Aurora intensity
  t: number; // Trails/Activity
}

export interface UserData {
  id: number;
  name: string;
  age: number;
  dist: string;
  img: string;
  online: boolean;
}

export interface RecommendationData {
  id: string;
  type: "tip" | "moment" | "info";
  title: string;
  content: string;
  img: string;
}
