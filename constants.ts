
import { EventData, UserData, RecommendationData, AmbienceState } from './types';

export const THEME = {
  bg: "#0E0C09",
  bg2: "#14110C",
  vig: "rgba(0,0,0,.52)",
  c: "#5A3A25", // Primary accent (Brown/Bronze)
  o: "#FF9F45", // Secondary accent (Brightened Orange for visibility)
  s: "#E8D8C0", // Tertiary (Sand - Brightened)
  ok: "#2CD67C", // Success (High contrast green)
  tx: "#FFFFFF", // Text Pure White
  m: "rgba(255,255,255,.85)", // Muted text - Increased opacity for readability
  f: "rgba(255,255,255,.60)", // Faint text - Increased opacity for readability
  gl: "rgba(30,25,20,.65)", // Glass light
  gs: "rgba(30,25,20,.85)", // Glass strong
  b: "rgba(255,255,255,.15)", // Border
  bs: "rgba(255,255,255,.25)" // Border strong
} as const;

export const INITIAL_AMBIENCE: AmbienceState = { g: .52, h: 26, a: .7, t: .62 };

export const TRACK_LABELS: Record<string, string> = {
  community: 'Comunidad',
  beefdip: 'BeefDip',
  bearadise: 'Bearadise'
};

export const TRACK_OPTIONS = ['ALL', 'community', 'beefdip', 'bearadise'];

// Image Assets for Categories
const IMG = {
  pool: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=60",
  night: "https://images.unsplash.com/photo-1566737236500-c8ac40014582?auto=format&fit=crop&w=800&q=60",
  drag: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=60",
  beach: "https://images.unsplash.com/photo-1571216664264-83984715f271?auto=format&fit=crop&w=800&q=60",
  dining: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=60",
  leather: "https://images.unsplash.com/photo-1514525253361-bee8718a7439?auto=format&fit=crop&w=800&q=60",
  foam: "https://images.unsplash.com/photo-1530103043960-ef38714abb15?auto=format&fit=crop&w=800&q=60",
  activity: "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=800&q=60",
  bear: "https://images.unsplash.com/photo-1572511443159-462a7424d67e?auto=format&fit=crop&w=800&q=60"
};

// FULL 2026 SCHEDULE - SORTED
// Sorting enforced here to ensure Calendar View renders optimally without client-side heavy lifting
const RAW_EVENTS: EventData[] = [
  // --- VIERNES 16 (Warmup) ---
  { id: "INS_0001", day: "Vie 16", title: "Drag Show (Medianoche)", venue: "Paco's Ranch", track: "community", start: "2026-01-16T00:00:00", end: "2026-01-16T01:00:00", dress: "Casual", color: THEME.s, image: IMG.drag, description: "Drag show diario" },
  { id: "INS_0003", day: "Vie 16", title: "Happy Hour 2x1", venue: "Banana Factory", track: "community", start: "2026-01-16T11:00:00", end: "2026-01-16T21:00:00", dress: "Casual", color: THEME.o, image: IMG.dining, description: "Bebidas al 2x1 todo el día" },
  { id: "INS_0005", day: "Vie 16", title: "NKD Pool Party (1/2 Price)", venue: "Pool Club PV", track: "community", start: "2026-01-16T15:00:00", end: "2026-01-16T20:00:00", dress: "Clothing Optional", color: THEME.c, image: IMG.pool, description: "Viernes de descuento" },
  { id: "INS_0007", day: "Vie 16", title: "Hot Gogos", venue: "Blue Chairs", track: "community", start: "2026-01-16T18:00:00", end: "2026-01-16T23:00:00", dress: "Casual", color: THEME.o, image: IMG.beach, description: "Go-go boys en el área de piscina" },

  // --- SÁBADO 17 (Warmup) ---
  { id: "INS_0018", day: "Sáb 17", title: "NKD Pool Party", venue: "Pool Club PV", track: "community", start: "2026-01-17T15:00:00", end: "2026-01-17T20:00:00", dress: "Clothing Optional", color: THEME.c, image: IMG.pool, description: "Sábados sin inhibiciones" },
  { id: "INS_0022", day: "Sáb 17", title: "Live Shows @ CCs", venue: "CC Slaughters", track: "community", start: "2026-01-17T22:00:00", end: "2026-01-18T02:30:00", dress: "Casual", color: "#FF0055", image: IMG.night, description: "Shows en vivo y baile" },

  // --- DOMINGO 18 (Warmup) ---
  { id: "INS_0026", day: "Dom 18", title: "Big Gay Drag Brunch", venue: "Pool Club PV", track: "community", start: "2026-01-18T11:00:00", end: "2026-01-18T14:00:00", dress: "Casual", color: THEME.o, image: IMG.dining, description: "Brunch con show de Drag" },
  { id: "INS_0029", day: "Dom 18", title: "Tryst Drag Brunch", venue: "The Tryst", track: "community", start: "2026-01-18T11:00:00", end: "2026-01-18T13:00:00", dress: "Resort Casual", color: THEME.s, image: IMG.dining, description: "Experiencia culinaria y show" },
  { id: "INS_0032", day: "Dom 18", title: "Tea Dance Pool Party", venue: "Pool Club PV", track: "community", start: "2026-01-18T15:00:00", end: "2026-01-18T20:00:00", dress: "Swimwear", color: "#FF0099", image: IMG.pool, description: "Clásico Tea Dance de domingo" },

  // --- SEMANA PREVIA ---
  { id: "INS_0045", day: "Lun 19", title: "STUDS: Disco Night", venue: "STUDS Bear Bar", track: "community", start: "2026-01-19T22:00:00", end: "2026-01-20T03:00:00", dress: "Disco", color: "#000", image: IMG.night, description: "Noche temática Disco" },
  { id: "INS_0054", day: "Mar 20", title: "Bingo Extravaganza", venue: "STUDS Bear Bar", track: "community", start: "2026-01-20T20:00:00", end: "2026-01-20T23:00:00", dress: "Casual", color: THEME.o, image: IMG.night, description: "Bingo, Drags y Premios" },
  { id: "INS_0062", day: "Mié 21", title: "Underwear Party", venue: "STUDS Bear Bar", track: "community", start: "2026-01-21T22:00:00", end: "2026-01-22T03:00:00", dress: "Underwear", color: "#D80000", image: IMG.leather, description: "Ropa interior sugerida" },
  { id: "INS_0066", day: "Jue 22", title: "Thrifty Thursday", venue: "Pool Club PV", track: "community", start: "2026-01-22T15:00:00", end: "2026-01-22T20:00:00", dress: "Swimwear", color: THEME.ok, image: IMG.pool, description: "Día sin cover" },
  { id: "INS_0071", day: "Jue 22", title: "Fetish Night", venue: "STUDS Bear Bar", track: "community", start: "2026-01-22T22:00:00", end: "2026-01-23T03:00:00", dress: "Fetish / Gear", color: "#222", image: IMG.leather, description: "Cuero, goma y más" },

  // --- SÁBADO 24 ENERO ---
  { id: "INS_0086", day: "Sáb 24", title: "BeefDip Welcome Center", venue: "Blue Chairs Lobby", track: "beefdip", start: "2026-01-24T12:00:00", end: "2026-01-24T17:00:00", dress: "Casual", color: THEME.o, image: IMG.activity, description: "Recogida de Dog Tags y Pulseras" },
  { id: "INS_0087", day: "Sáb 24", title: "NKD Pool Party (Sat)", venue: "Pool Club PV", track: "community", start: "2026-01-24T15:00:00", end: "2026-01-24T20:00:00", dress: "Clothing Optional", color: THEME.c, image: IMG.pool, description: "Fiesta de piscina de fin de semana" },
  { id: "INS_0091", day: "Sáb 24", title: "Pre-Party: Arrivals", venue: "Tryst Rooftop", track: "beefdip", start: "2026-01-24T21:00:00", end: "2026-01-25T02:00:00", dress: "Casual", color: THEME.c, image: IMG.night, description: "Fiesta de bienvenida no oficial" },

  // --- DOMINGO 25 ENERO ---
  { id: "INS_0100", day: "Dom 25", title: "Welcome Center (Extendido)", venue: "Blue Chairs Lobby", track: "beefdip", start: "2026-01-25T12:00:00", end: "2026-01-25T21:00:00", dress: "Casual", color: THEME.o, image: IMG.activity, description: "Última oportunidad para recoger tags temprano" },
  { id: "INS_0103", day: "Dom 25", title: "Tea Dance Pool Party", venue: "Pool Club PV", track: "community", start: "2026-01-25T15:00:00", end: "2026-01-25T20:00:00", dress: "Swimwear", color: "#FF0099", image: IMG.pool, description: "Edición especial Bear Week" },
  { id: "INS_0104", day: "Dom 25", title: "Welcome Party", venue: "Blue Chairs Rooftop", track: "beefdip", start: "2026-01-25T15:00:00", end: "2026-01-25T23:59:00", dress: "Casual Beach", color: THEME.o, image: IMG.beach, description: "Gran apertura. DJ Giaco + Drags", isFeatured: true },
  { id: "INS_0109", day: "Dom 25", title: "STUDS: Daddy's Night", venue: "STUDS Bear Bar", track: "community", start: "2026-01-25T22:00:00", end: "2026-01-26T03:00:00", dress: "Daddy / Leather", color: "#000", image: IMG.leather, description: "Noche de Daddies y Admiradores" },

  // --- LUNES 26 ENERO ---
  { id: "INS_0114", day: "Lun 26", title: "Foam Pool Party", venue: "Blue Chairs Pool", track: "beefdip", start: "2026-01-26T12:00:00", end: "2026-01-26T18:00:00", dress: "Swimwear", color: "#00E5FF", image: IMG.foam, description: "Fiesta de espuma legendaria. DJ Division 4" },
  { id: "INS_0115", day: "Lun 26", title: "BIGGER: Mantamar", venue: "Mantamar", track: "community", start: "2026-01-26T13:00:00", end: "2026-01-26T20:00:00", dress: "Swimwear", color: "#FF0055", image: IMG.pool, description: "DJ Alex Acosta. Inicio semana Mantamar" },
  { id: "INS_0118", day: "Lun 26", title: "Dinner Under The Stars", venue: "Tryst Rooftop", track: "beefdip", start: "2026-01-26T19:00:00", end: "2026-01-26T21:00:00", dress: "Smart Casual", color: THEME.s, image: IMG.dining, description: "Cena social (con reservación)" },
  { id: "INS_0121", day: "Lun 26", title: "Disco InFURno", venue: "CC Slaughters", track: "beefdip", start: "2026-01-26T22:00:00", end: "2026-01-27T05:00:00", dress: "Glitter & Disco", color: "#A020F0", image: IMG.night, description: "Fiesta Disco. DJ Benjamin Koll" },
  { id: "INS_0122", day: "Lun 26", title: "STUDS: Disco Night", venue: "STUDS Bear Bar", track: "community", start: "2026-01-26T22:00:00", end: "2026-01-27T03:00:00", dress: "Disco", color: "#000", image: IMG.night, description: "After-party alternativo" },

  // --- MARTES 27 ENERO ---
  { id: "INS_0127", day: "Mar 27", title: "SPLASH! Pool Party", venue: "Hotel Delfin", track: "beefdip", start: "2026-01-27T11:00:00", end: "2026-01-27T19:00:00", dress: "Swimwear", color: "#00AEEF", image: IMG.pool, description: "Clásicos y ambiente relajado. DJ Giaco" },
  { id: "INS_0129", day: "Mar 27", title: "AWAKENING: Mantamar", venue: "Mantamar", track: "community", start: "2026-01-27T13:00:00", end: "2026-01-27T20:00:00", dress: "Swimwear", color: "#FF5722", image: IMG.pool, description: "DJs Zagau & MNNR" },
  { id: "INS_0134", day: "Mar 27", title: "Bearaoke", venue: "Blue Chairs Rooftop", track: "beefdip", start: "2026-01-27T21:30:00", end: "2026-01-28T01:00:00", dress: "Casual", color: THEME.o, image: IMG.night, description: "Karaoke y shots gratis para cantantes" },
  { id: "INS_0135", day: "Mar 27", title: "Hellfire Red Ball", venue: "CC Slaughters", track: "beefdip", start: "2026-01-27T22:00:00", end: "2026-01-28T05:00:00", dress: "Red / Orange", color: "#D80000", image: IMG.night, description: "Viste de rojo. DJ Division 4" },
  { id: "INS_0137", day: "Mar 27", title: "Industry BearFest", venue: "Industry Nightclub", track: "community", start: "2026-01-27T23:00:00", end: "2026-01-28T04:00:00", dress: "Club Gear", color: "#444", image: IMG.night, description: "Bear Party Oficial" },

  // --- MIÉRCOLES 28 ENERO ---
  { id: "INS_0140", day: "Mié 28", title: "Bears on Line (Zipline)", venue: "Canopy River", track: "beefdip", start: "2026-01-28T10:00:00", end: "2026-01-28T14:00:00", dress: "Sport", color: THEME.ok, image: IMG.activity, description: "Tour de aventura (Ticket extra)" },
  { id: "INS_0141", day: "Mié 28", title: "Aquabear Pool Party", venue: "Hotel Delfin", track: "beefdip", start: "2026-01-28T11:00:00", end: "2026-01-28T19:00:00", dress: "Swimwear", color: "#0099CC", image: IMG.pool, description: "DJ Giaco. Pool session." },
  { id: "INS_0144", day: "Mié 28", title: "BEEF: Mantamar", venue: "Mantamar", track: "community", start: "2026-01-28T13:00:00", end: "2026-01-28T20:00:00", dress: "Swimwear", color: "#C2185B", image: IMG.pool, description: "DJ Alan Pilo" },
  { id: "INS_0145", day: "Mié 28", title: "Hairy Welcome Pool Party", venue: "Pool Club PV", track: "community", start: "2026-01-28T14:00:00", end: "2026-01-28T18:00:00", dress: "Swimwear", color: THEME.c, image: IMG.pool, description: "Bienvenida peluda" },
  { id: "INS_0147", day: "Mié 28", title: "Bearadise Welcome (Tequila)", venue: "Bar Frida", track: "bearadise", start: "2026-01-28T17:00:00", end: "2026-01-28T20:00:00", dress: "Casual", color: "#FFD700", image: IMG.night, description: "Meet & Greet con Tequila gratis" },
  { id: "INS_0149", day: "Mié 28", title: "Ride Me Papi Bus", venue: "Sanctuary PV", track: "bearadise", start: "2026-01-28T19:30:00", end: "2026-01-28T23:00:00", dress: "Party", color: "#FFD700", image: IMG.activity, description: "Party Bus + After" },
  { id: "INS_0152", day: "Mié 28", title: "STUDS: Underwear", venue: "STUDS Bear Bar", track: "community", start: "2026-01-28T22:00:00", end: "2026-01-29T03:00:00", dress: "Underwear", color: "#B91C1C", image: IMG.leather, description: "Ropa interior sugerida" },
  { id: "INS_0153", day: "Mié 28", title: "White Party", venue: "CC Slaughters", track: "beefdip", start: "2026-01-28T22:00:00", end: "2026-01-29T05:00:00", dress: "White & Silver", color: "#E0E0E0", image: IMG.night, description: "Noche blanca. DJ Tracy Young" },

  // --- JUEVES 29 ENERO ---
  { id: "INS_0157", day: "Jue 29", title: "BeefDip on All 4's (ATV)", venue: "Wild Trek", track: "beefdip", start: "2026-01-29T10:00:00", end: "2026-01-29T14:00:00", dress: "Sport/Dirty", color: THEME.c, image: IMG.activity, description: "Tour de cuatrimotos" },
  { id: "INS_0160", day: "Jue 29", title: "Tidal Wave Fundraiser", venue: "Hotel Delfin", track: "beefdip", start: "2026-01-29T12:00:00", end: "2026-01-29T18:00:00", dress: "Swimwear", color: THEME.o, image: IMG.pool, description: "Pool party benéfica. Subasta de osos" },
  { id: "INS_0161", day: "Jue 29", title: "UNC*T Fetish Pool", venue: "Cheeky Pool Club", track: "bearadise", start: "2026-01-29T12:00:00", end: "2026-01-29T20:00:00", dress: "Fetish / Nude", color: "#FFD700", image: IMG.pool, description: "Clothing optional fetish party" },
  { id: "INS_0162", day: "Jue 29", title: "DEEP: Mantamar", venue: "Mantamar", track: "community", start: "2026-01-29T13:00:00", end: "2026-01-29T20:00:00", dress: "Swimwear", color: "#3F51B5", image: IMG.pool, description: "DJ Micky Friedmann" },
  { id: "INS_0167", day: "Jue 29", title: "Jungle Lust Neon Beach", venue: "Blue Chairs Beach", track: "beefdip", start: "2026-01-29T19:00:00", end: "2026-01-30T01:00:00", dress: "Neon / Glow", color: "#00FF00", image: IMG.beach, description: "Fiesta neón en la playa. Fire dancers" },
  { id: "INS_0169", day: "Jue 29", title: "Cigar Social", venue: "Blue Chairs Rooftop", track: "beefdip", start: "2026-01-29T20:00:00", end: "2026-01-29T22:00:00", dress: "Casual / Leather", color: THEME.c, image: IMG.night, description: "Clase de puros con Papa Dirk" },
  { id: "INS_0171", day: "Jue 29", title: "ANIMAL (K!nki Night)", venue: "Playroom", track: "bearadise", start: "2026-01-29T22:00:00", end: "2026-01-30T04:00:00", dress: "Fetish", color: "#FFD700", image: IMG.leather, description: "Noche Kinky oficial" },
  { id: "INS_0172", day: "Jue 29", title: "STUDS: Best Belly", venue: "STUDS Bear Bar", track: "community", start: "2026-01-29T22:30:00", end: "2026-01-30T03:00:00", dress: "Casual", color: "#000", image: IMG.night, description: "Concurso del mejor abdomen" },

  // --- VIERNES 30 ENERO ---
  { id: "INS_0176", day: "Vie 30", title: "Booze Cruise", venue: "Los Muertos Pier", track: "beefdip", start: "2026-01-30T09:00:00", end: "2026-01-30T14:00:00", dress: "Swimwear", color: "#0EA5E9", image: IMG.activity, description: "Crucero Open Bar. Salida 9:45 AM" },
  { id: "INS_0178", day: "Vie 30", title: "Mad.Bear Foam Party", venue: "Blue Chairs Pool", track: "beefdip", start: "2026-01-30T12:00:00", end: "2026-01-30T18:00:00", dress: "Swimwear", color: "#D8B4FE", image: IMG.foam, description: "Fiesta espuma con Mad.Bear Spain" },
  { id: "INS_0179", day: "Vie 30", title: "NASTY Fetish Pool", venue: "Cheeky Pool Club", track: "bearadise", start: "2026-01-30T12:00:00", end: "2026-01-30T20:00:00", dress: "Fetish / Nude", color: "#FFD700", image: IMG.pool, description: "Clothing optional fetish party" },
  { id: "INS_0180", day: "Vie 30", title: "SPARK: Mantamar", venue: "Mantamar", track: "community", start: "2026-01-30T13:00:00", end: "2026-01-30T20:00:00", dress: "Swimwear", color: "#FFC107", image: IMG.pool, description: "DJ Luis Vazquez" },
  { id: "INS_0185", day: "Vie 30", title: "Wonderbear Super Heroes", venue: "CC Slaughters", track: "beefdip", start: "2026-01-30T22:00:00", end: "2026-01-31T05:00:00", dress: "Superhero / Cosplay", color: "#FF0000", image: IMG.night, description: "Fiesta de disfraces. DJ Chris Cox" },
  { id: "INS_0186", day: "Vie 30", title: "STUDS: Best Beard", venue: "STUDS Bear Bar", track: "community", start: "2026-01-30T22:30:00", end: "2026-01-31T03:00:00", dress: "Casual", color: "#000", image: IMG.bear, description: "Concurso de la mejor barba" },

  // --- SÁBADO 31 ENERO ---
  { id: "INS_0190", day: "Sáb 31", title: "FURbidden Shore Beach", venue: "Playa Privada", track: "bearadise", start: "2026-01-31T11:00:00", end: "2026-01-31T19:00:00", dress: "Beach / Nude", color: "#FFD700", image: IMG.beach, description: "Día de playa todo incluido. Salida Muelle" },
  { id: "INS_0192", day: "Sáb 31", title: "WET & WILD Pool Party", venue: "Hotel Delfin", track: "beefdip", start: "2026-01-31T11:00:00", end: "2026-01-31T19:00:00", dress: "Swimwear", color: "#00BCD4", image: IMG.pool, description: "Fiesta principal de piscina" },
  { id: "INS_0193", day: "Sáb 31", title: "BLISS: Mantamar", venue: "Mantamar", track: "community", start: "2026-01-31T13:00:00", end: "2026-01-31T20:00:00", dress: "Swimwear", color: "#9C27B0", image: IMG.pool, description: "DJ Aron" },
  { id: "INS_0198", day: "Sáb 31", title: "The Black Ball", venue: "CC Slaughters", track: "beefdip", start: "2026-01-31T22:00:00", end: "2026-02-01T05:00:00", dress: "Leather / Black", color: "#000", image: IMG.leather, description: "Noche de cuero y fetiche" },
  { id: "INS_0199", day: "Sáb 31", title: "STUDS: Best Butt", venue: "STUDS Bear Bar", track: "community", start: "2026-01-31T22:30:00", end: "2026-02-01T03:00:00", dress: "Casual", color: "#000", image: IMG.night, description: "Concurso" },

  // --- DOMINGO 01 FEBRERO ---
  { id: "INS_0205", day: "Dom 01", title: "Hydrate Recovery", venue: "Hotel Delfin", track: "beefdip", start: "2026-02-01T11:00:00", end: "2026-02-01T19:00:00", dress: "Swimwear", color: "#81D4FA", image: IMG.pool, description: "Pool party de recuperación" },
  { id: "INS_0207", day: "Dom 01", title: "MORBO Fetish Pool", venue: "Cheeky Pool Club", track: "bearadise", start: "2026-02-01T12:00:00", end: "2026-02-01T20:00:00", dress: "Fetish", color: "#FFD700", image: IMG.pool, description: "Edición Oso" },
  { id: "INS_0208", day: "Dom 01", title: "BOUNCE: Mantamar", venue: "Mantamar", track: "community", start: "2026-02-01T13:00:00", end: "2026-02-01T20:00:00", dress: "Swimwear", color: "#FF9800", image: IMG.pool, description: "DJ Diego Alvarez" },
  { id: "INS_0214", day: "Dom 01", title: "STUDS: Daddy Night", venue: "STUDS Bear Bar", track: "community", start: "2026-02-01T22:00:00", end: "2026-02-02T03:00:00", dress: "Daddy", color: "#000", image: IMG.night, description: "Cierre de semana" },
  { id: "INS_0215", day: "Dom 01", title: "SWEAT: Closing Party", venue: "CC Slaughters", track: "beefdip", start: "2026-02-01T22:00:00", end: "2026-02-02T05:00:00", dress: "Underwear / Jock", color: "#555", image: IMG.night, description: "Fiesta de clausura en ropa interior" }
];

export const EVENTS = RAW_EVENTS.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

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
