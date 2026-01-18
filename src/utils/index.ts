

// Classname utility (DRY)
export const cx = (...x: (string | 0 | null | undefined | false)[]) => x.filter(Boolean).join(" ");
export * from './logger';

export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export const formatTime = (iso: string, locale: string = 'es-MX', hour12?: boolean) => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '—';
    const formatter = new Intl.DateTimeFormat(locale, {
        timeZone: 'America/Mexico_City',
        hour: 'numeric',
        minute: '2-digit',
        hour12: hour12 ?? locale.startsWith('en')
    });
    return formatter.format(date);
};

export const getHour = (iso: string) => formatTime(iso);

// Helper to get full header like "Sábado, 24 de Enero"
export const getFullDateLabel = (isoString: string, locale: string = 'es-MX') => {
    // ISO strings without Z are treated as local time, which is desired for fixed event times.
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return locale.startsWith('en') ? 'Invalid date' : 'Fecha inválida';

    const formatter = new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        timeZone: 'America/Mexico_City'
    });

    return formatter.format(date);
};

export const isEventLive = (start: string, end?: string): boolean => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Default 2h duration
    return now >= startDate && now <= endDate;
};

// Optimized Background Style Generator
export const getEventBackgroundValue = (image: string | undefined, track: string, id: string): string => {
    if (image && image.length > 5) {
        return `url("${image}")`;
    }

    const gradients = [
        "linear-gradient(135deg, #4a192c 0%, #a85718 100%)", // Sunset - BeefDip default
        "linear-gradient(135deg, #0f3d3e 0%, #105b63 100%)", // Ocean - Community default
        "linear-gradient(135deg, #1a0b0b 0%, #4a0e0e 100%)", // Night - Bearadise default
        "linear-gradient(135deg, #2b1d12 0%, #5a3a25 100%)"  // Earth - Fallback
    ];

    let index = 3;
    if (track === 'beefdip') index = 0;
    else if (track === 'bearadise') index = 2;
    else if (track === 'community') index = 1;
    else {
        const charCode = id.charCodeAt(id.length - 1);
        index = charCode % 4;
    }

    return gradients[index];
};

// Haptic Feedback Utility (Safe Check)
export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
            switch (type) {
                case 'light': navigator.vibrate(10); break;
                case 'medium': navigator.vibrate(20); break;
                case 'heavy': navigator.vibrate(40); break;
                case 'success': navigator.vibrate([10, 30, 10]); break;
                case 'error': navigator.vibrate([50, 30, 50, 30, 50]); break;
            }
        } catch {
            // Ignore haptic errors on unsupported devices
        }
    }
};
