
import { UserData, RecommendationData, AmbienceState, EventData } from '@/types';

export const INITIAL_AMBIENCE: AmbienceState = { g: .52, h: 26, a: .7, t: .62 };

export const TRACK_LABELS: Record<string, string> = {
  community: 'Comunidad',
  beefdip: 'BeefDip',
  bearadise: 'Bearadise'
};

export const TRACK_OPTIONS = ['ALL', 'community', 'beefdip', 'bearadise'];



import { getEventsFromBase } from '@/utils/dataMapper';

export const EVENTS: EventData[] = getEventsFromBase().sort((a: EventData, b: EventData) => new Date(a.start).getTime() - new Date(b.start).getTime());

export const USERS: UserData[] = [
  { id: 1, name: "Beto", age: 34, dist: "AQUÍ", img: "https://i.pravatar.cc/240?u=1", online: true },
  { id: 2, name: "Carlos", age: 29, dist: "150m", img: "https://i.pravatar.cc/240?u=2", online: true },
  { id: 3, name: "Sergio", age: 41, dist: "300m", img: "https://i.pravatar.cc/240?u=3", online: false },
  { id: 4, name: "Marcus", age: 38, dist: "500m", img: "https://i.pravatar.cc/240?u=4", online: true },
  { id: 5, name: "David", age: 35, dist: "1km", img: "https://i.pravatar.cc/240?u=5", online: false },
  { id: 6, name: "Iván", age: 31, dist: "1.2km", img: "https://i.pravatar.cc/240?u=6", online: true },
];

export const RECOMMENDATIONS: RecommendationData[] = [
  { id: "r1", type: "tip", title: "Mejor Margarita", content: "Prueba la de mango en \"La Margarita\". Tip del comité.", img: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=900&q=80" },
  { id: "r2", type: "moment", title: "Atardecer District", content: "Sunset en Los Muertos hace 10 min.", img: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=900&q=80" },
  { id: "r3", type: "info", title: "Transporte Seguro", content: "Usa los taxis oficiales afuera de Blue Chairs.", img: "https://images.unsplash.com/photo-1556122071-e404970c7ff8?auto=format&fit=crop&w=900&q=80" },
];
