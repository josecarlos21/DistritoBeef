
import { useState, useEffect } from 'react';

export const useLocation = () => {
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (!navigator.geolocation) {
            setError('Geolocation not supported');
            setLoading(false);
            return;
        }

        const success = (position: GeolocationPosition) => {
            setCoords({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
            setLoading(false);
        };

        const fail = (err: GeolocationPositionError) => {
            setError(err.message);
            setLoading(false);
        };

        // Watch position for real-time updates
        const watchId = navigator.geolocation.watchPosition(success, fail, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    return { coords, loading, error };
};
