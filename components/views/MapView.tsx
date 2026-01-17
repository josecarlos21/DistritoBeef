
import React, { useState, useMemo, useCallback } from 'react';
import { Navigation, Plus, Minus, Map as MapIcon, LocateFixed, Calendar } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap, Tooltip } from 'react-leaflet';
import { EventData } from '@/types';
import L from 'leaflet';
import { GlassContainer } from '../atoms';
import { UnifiedHeader, HeaderTitle } from '../organisms';
import { triggerHaptic } from '@/utils';
import { EVENTS } from '@/constants';
import { useLocale } from '@/context/LocaleContext';
import { useLocation } from '@/hooks/useLocation';

// Real GPS Coordinates for Zona Romántica Venues
const VENUE_COORDS: Record<string, { lat: number; lng: number }> = {
  "Blue Chairs": { lat: 20.5985, lng: -105.2393 },
  "Mantamar": { lat: 20.5975, lng: -105.2393 },
  "Pool Club PV": { lat: 20.6011, lng: -105.2345 },
  "CC Slaughters": { lat: 20.6023, lng: -105.2341 },
  "Paco's Ranch": { lat: 20.6026, lng: -105.2344 },
  "STUDS Bear Bar": { lat: 20.6018, lng: -105.2341 },
  "Industry Nightclub": { lat: 20.6021, lng: -105.2340 },
  "Hotel Delfin": { lat: 20.5997, lng: -105.2386 },
  "La Margarita": { lat: 20.6028, lng: -105.2335 },
  "Banana Factory": { lat: 20.6035, lng: -105.2325 },
  "The Tryst": { lat: 20.6025, lng: -105.2339 },
  "Bar Frida": { lat: 20.6028, lng: -105.2332 },
  "Cheeky Pool Club": { lat: 20.6040, lng: -105.2310 },
  "Sanctuary PV": { lat: 20.6030, lng: -105.2335 },
  "Playroom": { lat: 20.6025, lng: -105.2345 },
  "Los Muertos Pier": { lat: 20.6000, lng: -105.2395 },
  "Canopy River Office": { lat: 20.6030, lng: -105.2320 },
};

// Map sub-locations to main pins
const VENUE_MAPPER: Record<string, string> = {
  "Blue Chairs Lobby": "Blue Chairs",
  "Blue Chairs Rooftop": "Blue Chairs",
  "Blue Chairs Beach": "Blue Chairs",
  "Blue Chairs Pool": "Blue Chairs",
  "Tryst Rooftop": "The Tryst",
  "Canopy River": "Canopy River Office"
};

const ZR_CENTER: [number, number] = [20.6015, -105.2371];
const ZR_BOUNDS: L.LatLngBoundsExpression = [
  [20.5950, -105.2420], // Southwest
  [20.6080, -105.2300]  // Northeast
];

const MapControls: React.FC<{
  onZoomIn: () => void,
  onZoomOut: () => void,
  onLocate: () => void,
  labels: { zoomIn: string; zoomOut: string; locate: string }
}> = ({ onZoomIn, onZoomOut, onLocate, labels }) => {
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-[1000]">
      <GlassContainer className="p-1.5 flex flex-col gap-2">
        <button
          type="button"
          onClick={onZoomIn}
          title={labels.zoomIn || "Zoom In"}
          aria-label={labels.zoomIn || "Zoom In"}
          className="w-8 h-8 flex items-center justify-center text-tx hover:text-o active:scale-90 transition shadow-none border-none bg-transparent"
        >
          <Plus size={16} />
        </button>
        <div className="h-px bg-b w-full" />
        <button
          type="button"
          onClick={onLocate}
          title={labels.locate || "My Location"}
          aria-label={labels.locate || "My Location"}
          className="w-8 h-8 flex items-center justify-center text-[var(--tx)] hover:text-[var(--o)] active:scale-90 transition shadow-none border-none bg-transparent"
        >
          <LocateFixed size={16} />
        </button>
        <div className="h-px bg-b w-full" />
        <button
          type="button"
          onClick={onZoomOut}
          title={labels.zoomOut || "Zoom Out"}
          aria-label={labels.zoomOut || "Zoom Out"}
          className="w-8 h-8 flex items-center justify-center text-[var(--tx)] hover:text-[var(--o)] active:scale-90 transition shadow-none border-none bg-transparent"
        >
          <Minus size={16} />
        </button>
      </GlassContainer>
    </div>
  );
};

const MapEvents: React.FC<{ setZoom: (z: number) => void }> = ({ setZoom }) => {
  const map = useMap();
  map.on('zoomend', () => setZoom(map.getZoom()));
  return null;
};

interface MapViewProps {
  onEventClick?: (e: EventData) => void;
}

export const MapView: React.FC<MapViewProps> = ({ onEventClick }) => {
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [zoom, setZoom] = useState(17);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const { t, formatTime } = useLocale();

  // Normalize venues for mapping pins
  const uniqueVenueNames = useMemo(() => {
    const names = new Set<string>();
    EVENTS.forEach((e: EventData) => {
      const normalized = VENUE_MAPPER[e.venue] || e.venue;
      if (VENUE_COORDS[normalized]) names.add(normalized);
    });
    return Array.from(names);
  }, []);

  const selectedVenueEvents = useMemo(() => {
    if (!selectedVenue) return [];
    return EVENTS.filter((e: EventData) => (VENUE_MAPPER[e.venue] || e.venue) === selectedVenue);
  }, [selectedVenue]);

  const nextEvent = useMemo(() => {
    if (selectedVenueEvents.length === 0) return null;
    // Find first event starting soonest (mock logic)
    return selectedVenueEvents[0];
  }, [selectedVenueEvents]);

  const createCustomIcon = useCallback((venue: string, isSelected: boolean) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="flex flex-col items-center group cursor-pointer transition-all duration-500" style="transform: translate(-50%, -100%);">
          <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center relative transition-transform shadow-[0_0_20px_rgba(0,0,0,0.5)] ${isSelected ? "scale-125 bg-[var(--o)] border-white" : "bg-[var(--bg)] border-[var(--o)]"}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${isSelected ? "black" : "var(--o)"}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="relative z-10"><path d="M20 10c0 6-10 13-10 13S0 16 0 10a10 10 0 1 1 20 0z"/><circle cx="10" cy="10" r="3"/></svg>
            ${isSelected ? '<div class="absolute inset-0 rounded-full bg-[var(--o)] animate-ping opacity-40"></div>' : ''}
          </div>
          <div class="mt-2 px-3 py-1.5 rounded-[12px] border backdrop-blur-md bg-black/80 border-[var(--b)] flex flex-col items-center shadow-bento transition-all duration-300 origin-top ${isSelected ? "opacity-100 scale-100" : "opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100"}">
            <span class="text-[9px] font-black uppercase tracking-[.05em] text-white whitespace-nowrap">${venue}</span>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
  }, []);

  // Real Location hook
  const { coords: userCoords, loading: locationLoading } = useLocation();

  const isNearby = useMemo(() => {
    if (!userCoords) return false;
    const distance = calculateDistance(userCoords.lat, userCoords.lng, ZR_CENTER[0], ZR_CENTER[1]);
    return distance <= 20; // 20km limit for map 'nearby'
  }, [userCoords]);

  const handleLocate = () => {
    triggerHaptic('medium');
    if (mapInstance) {
      if (userCoords) {
        mapInstance.flyTo([userCoords.lat, userCoords.lng], 18);
      } else {
        // Fallback to center if location not available yet
        mapInstance.flyTo(ZR_CENTER, 17);
      }
    }
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <UnifiedHeader
        left={<div className="w-10" />}
        center={
          <HeaderTitle
            title={t('header.map')}
            subtitle={
              locationLoading ? "Buscando GPS..." :
                (userCoords && !isNearby) ? "Fuera de Vallarta" : t('map.subtitle')
            }
          />
        }
        right={<div className="w-10" />}
      />

      <div className="flex-1 relative overflow-hidden bg-[var(--bg)] w-full h-full">
        <MapContainer
          center={ZR_CENTER}
          zoom={zoom}
          minZoom={15}
          maxZoom={19}
          maxBounds={ZR_BOUNDS}
          zoomControl={false}
          attributionControl={false}
          className="w-full h-full"
          style={{ background: 'var(--bg)' }}
          ref={setMapInstance}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
          />

          <MapEvents setZoom={setZoom} />

          {uniqueVenueNames.map((venue) => {
            const coords = VENUE_COORDS[venue];
            if (!coords) return null;

            const isSelected = selectedVenue === venue;

            return (
              <Marker
                key={venue}
                position={[coords.lat, coords.lng]}
                icon={createCustomIcon(venue, isSelected)}
                eventHandlers={{
                  click: () => {
                    triggerHaptic('medium');
                    setSelectedVenue(isSelected ? null : venue);
                    if (!isSelected && mapInstance) {
                      mapInstance.flyTo([coords.lat, coords.lng], 18);
                    }
                  },
                }}
              />
            );
          })}

          {userCoords && (
            <Marker
              position={[userCoords.lat, userCoords.lng]}
              icon={L.divIcon({
                className: 'user-location',
                html: '<div class="w-6 h-6 border-2 border-white rounded-full bg-[var(--o)] shadow-lg animate-pulse"></div>',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
              })}
              zIndexOffset={1000}
            >
              <Tooltip direction="top" offset={[0, -12]} opacity={0.9} permanent className="custom-tooltip">
                <span className="text-[10px] font-black uppercase tracking-wider">Tu Ubicación</span>
              </Tooltip>
            </Marker>
          )}
        </MapContainer>

        <MapControls
          onZoomIn={() => mapInstance?.zoomIn()}
          onZoomOut={() => mapInstance?.zoomOut()}
          onLocate={handleLocate}
          labels={{
            zoomIn: t('map.zoomIn'),
            zoomOut: t('map.zoomOut'),
            locate: t('map.myLocation')
          }}
        />

        {userCoords && !isNearby && (
          <div className="absolute top-32 left-4 right-4 z-[3000]">
            <GlassContainer strong className="p-4 bg-red-500/10 border-red-500/30 flex items-center justify-center gap-3 animate-in fade-in zoom-in duration-500">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                <Navigation size={14} className="rotate-45" />
              </div>
              <div className="text-[10px] font-black uppercase text-red-200 tracking-widest text-center">
                Detectado en CDMX / Remoto. <br />
                <span className="opacity-60">Mostrando mapa de Vallarta.</span>
              </div>
            </GlassContainer>
          </div>
        )}
        {selectedVenue ? (
          <GlassContainer strong className="p-4 flex items-center justify-between animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-[var(--o)] flex items-center justify-center text-black shrink-0">
                <MapIcon size={18} strokeWidth={2.5} />
              </div>
              <div className="overflow-hidden">
                <div className="text-[11px] font-black text-white uppercase truncate">{selectedVenue}</div>
                {nextEvent ? (
                  <div className="flex items-center gap-1 text-[8px] font-bold text-[var(--ok)] uppercase mt-0.5 animate-in fade-in slide-in-from-left-2 duration-500">
                    <Calendar size={10} strokeWidth={3} />
                    <span className="truncate">{nextEvent.title} • {formatTime(nextEvent.start)}</span>
                  </div>
                ) : (
                  <div className="text-[9px] font-bold text-[var(--f)] uppercase">{t('map.subtitle')}</div>
                )}
              </div>
            </div>
            <div className="flex gap-2 shrink-0 ml-4">
              {nextEvent && onEventClick && (
                <button
                  type="button"
                  onClick={() => { triggerHaptic('medium'); onEventClick(nextEvent); }}
                  className="px-4 py-2.5 bg-[var(--o)] text-black rounded-xl text-[9px] font-black uppercase hover:opacity-90 transition shadow-lg"
                >
                  {t('home.viewInfo')}
                </button>
              )}
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(selectedVenue + " Puerto Vallarta")}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => triggerHaptic('medium')}
                className="px-4 py-2.5 bg-[var(--tx)] text-black rounded-2xl text-[9px] font-black uppercase hover:bg-white transition shadow-bento shrink-0"
              >
                {t('action.viewRoute')}
              </a>
            </div>
          </GlassContainer>
        ) : (
          <GlassContainer strong className="p-3 flex items-center justify-between opacity-80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--f)]/20 flex items-center justify-center text-white">
                <Navigation size={14} strokeWidth={3} className="rotate-45" />
              </div>
              <div>
                <div className="text-[10px] font-black text-white uppercase">{t('map.explore')}</div>
                <div className="text-[8px] font-bold text-[var(--f)] uppercase">{t('map.tapPoint')}</div>
              </div>
            </div>
          </GlassContainer>
        )}
      </div>
    </div>
  );
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
  return R * c;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
