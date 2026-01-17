
import { useState, useEffect } from 'react';

// Puerto Vallarta "District" Coordinates (Approx. Zona Romántica/Centro)
// Center point: Basilio Badillo / Olas Altas area
const PV_CENTER_LAT = 20.60;
const PV_CENTER_LNG = -105.23;

// Radius in kilometers (covering Centro, ZR, Amapas, Conchas Chinas)
const GEOFENCE_RADIUS_KM = 10;

export const useGeofence = () => {
    const [isNearby, setIsNearby] = useState(false);
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
            const { latitude, longitude } = position.coords;
            const distance = calculateDistance(latitude, longitude, PV_CENTER_LAT, PV_CENTER_LNG);
            setIsNearby(distance <= GEOFENCE_RADIUS_KM);
            setLoading(false);
        };

        const fail = (err: GeolocationPositionError) => {
            // If denied or error, we default to "false" (not nearby) or handle strictly
            // For this app, maybe we default to false is safer.
            console.warn('Geolocation failed', err);
            setError(err.message);
            setIsNearby(false);
            setLoading(false);
        };

        // Check once on mount
        navigator.geolocation.getCurrentPosition(success, fail, {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 60000 // Accept positions up to 1 minute old
        });

    }, []);

    return { isNearby, loading, error };
};

// Haversine formula for distance
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}
