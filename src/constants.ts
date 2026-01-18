
import { UserData, RecommendationData, AmbienceState } from '@/types';

export const INITIAL_AMBIENCE: AmbienceState = { g: .52, h: 26, a: .7, t: .62 };

export const TRACK_LABELS: Record<string, string> = {
  community: 'Comunidad',
  beefdip: 'BeefDip',
  bearadise: 'Bearadise'
};

export const TRACK_OPTIONS = ['ALL', 'community', 'beefdip', 'bearadise'];


export const USERS: UserData[] = [
  { id: 1, name: "Beto", age: 34, dist: "AQUÍ", img: "https://images.unsplash.com/photo-1531384441138-2736e62e0f19?auto=format&fit=crop&w=240&q=80", online: true },
  { id: 2, name: "Carlos", age: 29, dist: "150m", img: "https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&w=240&q=80", online: true },
  { id: 3, name: "Sergio", age: 41, dist: "300m", img: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=240&q=80", online: false },
  { id: 4, name: "Marcus", age: 38, dist: "500m", img: "https://images.unsplash.com/photo-1520635360276-79f3dbd809f6?auto=format&fit=crop&w=240&q=80", online: true },
  { id: 5, name: "David", age: 35, dist: "1km", img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=240&q=80", online: false },
  { id: 6, name: "Iván", age: 31, dist: "1.2km", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80", online: true },
];

export const RECOMMENDATIONS: RecommendationData[] = [
  { id: "r1", type: "tip", title: "Mejor Margarita", content: "Prueba la de mango en \"La Margarita\". Tip del comité.", img: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=900&q=80" },
  { id: "r2", type: "moment", title: "Atardecer District", content: "Sunset en Los Muertos hace 10 min.", img: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=900&q=80" },
  { id: "r3", type: "info", title: "Transporte Seguro", content: "Usa los taxis oficiales afuera de Blue Chairs.", img: "https://images.unsplash.com/photo-1556122071-e404970c7ff8?auto=format&fit=crop&w=900&q=80" },
];
