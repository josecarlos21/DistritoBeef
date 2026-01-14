import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Locale = 'es' | 'en';

type Messages = Record<Locale, Record<string, string>>;

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, fallback?: string) => string;
  formatFullDate: (iso: string) => string;
  formatTime: (iso: string, options?: Intl.DateTimeFormatOptions) => string;
}

const messages: Messages = {
  es: {
    'lang.name': 'Español',
    'lang.toggle': 'Cambiar idioma',
    'nav.home': 'Inicio',
    'nav.calendar': 'Agenda',
    'nav.social': 'Social',
    'nav.wallet': 'Wallet',
    'nav.map': 'Mapa',
    'action.close': 'Cerrar',
    'action.viewRoute': 'Ver Ruta',
    'action.viewInfo': 'Ver Info',
    'action.schedule': 'Agendar',
    'action.howToArrive': 'Cómo llegar',
    'action.start': 'Comenzar',
    'action.next': 'Siguiente',
    'action.enter': 'Entrar al Distrito',
    'action.reset': 'Reset',
    'action.done': 'Listo',
    'action.refresh': 'Actualizar Código',
    'action.help': '¿Necesitas ayuda?',
    'action.markRead': 'Marcar todo como leído',
    'action.logout': 'Cerrar sesión',
    'action.search': 'Buscar',
    'action.filters': 'Filtros',
    'action.settings': 'Configuración',
    'action.weather': 'Clima',
    'action.notifications': 'Notificaciones',
    'home.happeningNow': 'Sucediendo Ahora',
    'home.density': 'Densidad',
    'home.vibe': 'Vibe Check',
    'home.high': 'Alta',
    'home.top': 'Top',
    'home.zone': 'Zona Romántica',
    'home.goodVibe': 'Muy buen ambiente',
    'home.featured': 'Destacado',
    'home.viewInfo': 'Ver Info',
    'home.suggested': 'Eventos sugeridos',
    'home.districtThings': 'Cosas del distrito',
    'home.noResults': 'Sin resultados',
    'header.explore': 'Explorar',
    'header.itinerary': 'Itinerario',
    'header.agenda': 'Agenda 2026',
    'header.wallet': 'Wallet',
    'header.map': 'Mapa',
    'cta.goToday': 'Ir a Hoy',
    'list.endOfSchedule': 'Fin de Agenda',
    'event.date': 'Fecha',
    'event.time': 'Horario',
    'event.venue': 'Ubicación',
    'event.about': 'Sobre el evento',
    'event.dresscode': 'Dresscode',
    'event.defaultDescription': 'Este es un evento de la comunidad. Asiste, conecta y disfruta del ambiente del distrito.',
    'onboarding.welcomeTo': 'Bienvenido a',
    'onboarding.description': 'Tu compañero inmersivo para el distrito. Eventos en tiempo real, mapa de calor social y acceso exclusivo.',
    'onboarding.accessCode': 'Código de Acceso',
    'onboarding.enterWalletPass': 'Ingresa tu pass del wallet',
    'onboarding.useDemo': 'Usa 2026 para demo',
    'onboarding.namePrompt': '¿Cómo te llamas?',
    'onboarding.nameHint': 'Para personalizar tu pase',
    'notif.title': 'Notificaciones',
    'notif.markRead': 'Marcar todo como leído',
    'toast.alert': 'Alerta',
    'toast.notification': 'Notificación',
    'toast.density': 'Blue Chairs: Alta densidad (85%) detectada.',
    'toast.weather': '28°C Soleado • Humedad 65% • UV Alto',
    'toast.route': 'Ruta calculada: 5 min caminando',
    'map.activity': 'Actividad',
    'map.live': 'En vivo',
    'map.explore': 'Explora el Distrito',
    'map.tapPoint': 'Toca un punto',
    'map.zoomIn': 'Acercar mapa',
    'map.zoomOut': 'Alejar mapa',
    'map.myLocation': 'Centrar en mi ubicación',
    'map.heatLayer': 'Capa de densidad',
    'map.venueLayer': 'Capa de establecimientos',
    'wallet.pass': 'Pase de distrito',
    'wallet.fullAccess': 'Acceso Total',
    'wallet.active': 'ACTIVO',
    'wallet.member': 'Socio Gold',
    'wallet.expires': 'Vence',
    'wallet.zone': 'Zona',
    'wallet.id': 'ID',
    'wallet.dynamicNote': 'Este código QR es dinámico. Las capturas de pantalla no funcionarán.',
    'filters.all': 'Todo',
    'filters.local': 'Local',
    'filters.beefdip': 'BeefDip',
    'filters.bearadise': 'Bearadise',
    'search.placeholder': 'BUSCAR...',
    'calendar.today': 'HOY, ',
    'map.subtitle': 'Zona Romántica',
    'drawer.density': 'Alta Densidad',
    'drawer.density.msg': 'Blue Chairs ha superado el 85% de capacidad.',
    'drawer.pass': 'District Pass',
    'drawer.pass.msg': 'Tu acceso QR expira en 4 horas. Renueva ahora.',
    'drawer.weather': 'Clima',
    'drawer.weather.msg': 'Posibilidad de lluvia ligera a las 18:00.',
    'pull.refresh': 'Soltar para refrescar',
  },
  en: {
    'lang.name': 'English',
    'lang.toggle': 'Switch language',
    'nav.home': 'Home',
    'nav.calendar': 'Schedule',
    'nav.social': 'Social',
    'nav.wallet': 'Wallet',
    'nav.map': 'Map',
    'action.close': 'Close',
    'action.viewRoute': 'View Route',
    'action.viewInfo': 'View Info',
    'action.schedule': 'Add to Calendar',
    'action.howToArrive': 'Directions',
    'action.start': 'Start',
    'action.next': 'Next',
    'action.enter': 'Enter the District',
    'action.reset': 'Reset',
    'action.done': 'Done',
    'action.refresh': 'Refresh Code',
    'action.help': 'Need help?',
    'action.markRead': 'Mark all as read',
    'action.logout': 'Sign out',
    'action.search': 'Search',
    'action.filters': 'Filters',
    'action.settings': 'Settings',
    'action.weather': 'Weather',
    'action.notifications': 'Notifications',
    'home.happeningNow': 'Happening Now',
    'home.density': 'Density',
    'home.vibe': 'Vibe Check',
    'home.high': 'High',
    'home.top': 'Top',
    'home.zone': 'Romantic Zone',
    'home.goodVibe': 'Great vibe',
    'home.featured': 'Featured',
    'home.viewInfo': 'View Info',
    'home.suggested': 'Suggested events',
    'home.districtThings': 'District moments',
    'home.noResults': 'No results',
    'header.explore': 'Explore',
    'header.itinerary': 'Itinerary',
    'header.agenda': '2026 Schedule',
    'header.wallet': 'Wallet',
    'header.map': 'Map',
    'cta.goToday': 'Go to Today',
    'list.endOfSchedule': 'End of Schedule',
    'event.date': 'Date',
    'event.time': 'Time',
    'event.venue': 'Venue',
    'event.about': 'About this event',
    'event.dresscode': 'Dress code',
    'event.defaultDescription': 'Community event. Join, connect, and enjoy the district vibe.',
    'onboarding.welcomeTo': 'Welcome to',
    'onboarding.description': 'Your immersive companion for the district. Live events, social heatmap, and exclusive access.',
    'onboarding.accessCode': 'Access Code',
    'onboarding.enterWalletPass': 'Enter your wallet pass',
    'onboarding.useDemo': 'Use 2026 for demo',
    'onboarding.namePrompt': 'What’s your name?',
    'onboarding.nameHint': 'To personalize your pass',
    'notif.title': 'Notifications',
    'notif.markRead': 'Mark all as read',
    'toast.alert': 'Alert',
    'toast.notification': 'Notification',
    'toast.density': 'Blue Chairs: High occupancy detected (85%).',
    'toast.weather': '82°F Sunny • Humidity 65% • High UV',
    'toast.route': 'Route calculated: 5 min walk',
    'map.activity': 'Activity',
    'map.live': 'Live',
    'map.explore': 'Explore the District',
    'map.tapPoint': 'Tap a point',
    'map.zoomIn': 'Zoom in',
    'map.zoomOut': 'Zoom out',
    'map.myLocation': 'Center on my location',
    'map.heatLayer': 'Heatmap layer',
    'map.venueLayer': 'Venues layer',
    'wallet.pass': 'District Pass',
    'wallet.fullAccess': 'Full Access',
    'wallet.active': 'ACTIVE',
    'wallet.member': 'Gold Member',
    'wallet.expires': 'Expires',
    'wallet.zone': 'Zone',
    'wallet.id': 'ID',
    'wallet.dynamicNote': 'This QR code is dynamic. Screenshots won’t work.',
    'filters.all': 'All',
    'filters.local': 'Local',
    'filters.beefdip': 'BeefDip',
    'filters.bearadise': 'Bearadise',
    'search.placeholder': 'SEARCH...',
    'calendar.today': 'TODAY, ',
    'map.subtitle': 'Romantic Zone',
    'drawer.density': 'High Density',
    'drawer.density.msg': 'Blue Chairs is over 85% capacity.',
    'drawer.pass': 'District Pass',
    'drawer.pass.msg': 'Your QR access expires in 4 hours. Renew now.',
    'drawer.weather': 'Weather',
    'drawer.weather.msg': 'Light rain expected at 6:00 PM.',
    'pull.refresh': 'Pull to refresh',
  },
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

const fallbackLabel = (locale: Locale) => (locale === 'es' ? 'Fecha inválida' : 'Invalid date');

const buildFormatter = (locale: Locale, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(locale === 'es' ? 'es-MX' : 'en-US', {
    timeZone: 'America/Mexico_City',
    ...options,
  });

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('es');

  useEffect(() => {
    document.documentElement.lang = locale === 'es' ? 'es-MX' : 'en';
  }, [locale]);

  const t = useCallback((key: string, fallback?: string) => {
    return messages[locale][key] ?? messages.es[key] ?? fallback ?? key;
  }, [locale]);

  const { formatFullDate, formatTime } = useMemo(() => {
    const dateFormatter = buildFormatter(locale, { weekday: 'long', day: 'numeric', month: 'long' });
    const timeFormatter = buildFormatter(locale, { hour: 'numeric', minute: '2-digit', hour12: locale === 'en' });

    return {
      formatFullDate: (iso: string) => {
        const date = new Date(iso);
        if (Number.isNaN(date.getTime())) return fallbackLabel(locale);
        return dateFormatter.format(date);
      },
      formatTime: (iso: string, opts?: Intl.DateTimeFormatOptions) => {
        const date = new Date(iso);
        if (Number.isNaN(date.getTime())) return '—';
        const formatter = opts ? buildFormatter(locale, opts) : timeFormatter;
        return formatter.format(date);
      },
    };
  }, [locale]);

  const value = useMemo(() => ({
    locale,
    setLocale,
    t,
    formatFullDate,
    formatTime,
  }), [locale, t, formatFullDate, formatTime]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLocale = () => {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
};
