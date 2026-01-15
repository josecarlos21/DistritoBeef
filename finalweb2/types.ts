
export type TrackType = "community" | "beefdip" | "bearadise";
export type TabType = "home" | "social" | "calendar" | "wallet" | "map";

export interface EventData {
  id: string;
  day?: string; 
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
  link?: string; // External URL for tickets
}

export interface AmbienceState {
  g: number; // Nebula/Gradient intensity
  h: number; // Hue
  a: number; // Aurora intensity
  t: number; // Trails/Activity
}

export interface RecommendationData {
  id: string;
  type: "tip" | "moment" | "info";
  title: string;
  content: string;
  img: string;
}

export interface UserData {
  name: string;
  age: number;
  img: string;
  dist: string;
  online: boolean;
}
