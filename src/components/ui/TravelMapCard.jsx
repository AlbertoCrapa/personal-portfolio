import React from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const BASEMAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

// Star-shaped glyph used for every place I have actually visited,
// so those pins read differently from the pulsing "home" dot.
const VISITED_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2.6l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.41l-5.8 3.05 1.1-6.46-4.69-4.58 6.49-.94L12 2.6z"/></svg>`;

const DEFAULT_STOPS = [
    {
        id: 'home',
        label: 'Milan (Home)',
        note: 'Based near Milan.',
        longitude: 9.19,
        latitude: 45.4642,
        type: 'home',
    },
    { id: 'dublin', label: 'Dublin', note: 'Visited.', longitude: -6.2603, latitude: 53.3498, type: 'visited' },
    { id: 'belfast', label: 'Belfast', note: 'Visited.', longitude: -5.9301, latitude: 54.5973, type: 'visited' },
    { id: 'vienna', label: 'Vienna', note: 'Visited.', longitude: 16.3738, latitude: 48.2082, type: 'visited' },
    { id: 'barcelona', label: 'Barcelona', note: 'Visited.', longitude: 2.1734, latitude: 41.3851, type: 'visited' },
    { id: 'madrid', label: 'Madrid', note: 'Visited.', longitude: -3.7038, latitude: 40.4168, type: 'visited' },
    { id: 'palma', label: 'Palma de Mallorca', note: 'Visited.', longitude: 2.6502, latitude: 39.5696, type: 'visited' },
    { id: 'paris', label: 'Paris', note: 'Visited.', longitude: 2.3522, latitude: 48.8566, type: 'visited' },
    { id: 'san-teodoro', label: 'San Teodoro', note: 'Visited.', longitude: 9.6716, latitude: 40.7772, type: 'visited' },
    { id: 'cagliari', label: 'Cagliari', note: 'Visited.', longitude: 9.1217, latitude: 39.2238, type: 'visited' },
    { id: 'rome', label: 'Rome', note: 'Visited.', longitude: 12.4964, latitude: 41.9028, type: 'visited' },
    { id: 'lucca', label: 'Lucca', note: 'Visited.', longitude: 10.5051, latitude: 43.8430, type: 'visited' },
    { id: 'san-benedetto', label: 'San Benedetto del Tronto', note: 'Visited.', longitude: 13.8807, latitude: 42.9440, type: 'visited' },
];

const TravelMapCard = ({
    title = 'Map',
    subtitle = 'Current base and travel highlights.',
    stops = DEFAULT_STOPS,
    bare = false,
}) => {
    const containerRef = React.useRef(null);
    const mapRef = React.useRef(null);
    const markersRef = React.useRef([]);

    React.useEffect(() => {
        if (!containerRef.current || mapRef.current || !Array.isArray(stops) || stops.length === 0) {
            return undefined;
        }

        const map = new maplibregl.Map({
            container: containerRef.current,
            style: BASEMAP_STYLE,
            center: [stops[0].longitude, stops[0].latitude],
            zoom: 3.4,
            renderWorldCopies: false,
            attributionControl: false,
            
        });

       //map.addControl(new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }), 'top-right');

        map.on('load', () => {
            const bounds = new maplibregl.LngLatBounds();

            stops.forEach((stop) => {
                bounds.extend([stop.longitude, stop.latitude]);

                const el = document.createElement('button');
                el.type = 'button';
                const pinVariant = stop.type === 'home'
                    ? 'is-home'
                    : stop.type === 'visited' ? 'is-visited' : 'is-travel';
                el.className = `travel-map-pin ${pinVariant}`;
                el.setAttribute('aria-label', stop.label);
                if (stop.type === 'visited') {
                    el.innerHTML = VISITED_ICON;
                }

                const popup = new maplibregl.Popup({
                    offset: 18,
                    closeButton: false,
                    className: 'travel-map-popup',
                }).setHTML(`<p class="travel-map-popup-title">${stop.label}</p><p class="travel-map-popup-note">${stop.note}</p>`);

                el.addEventListener('click', () => {
                    map.flyTo({
                        center: [stop.longitude, stop.latitude],
                        zoom: Math.max(map.getZoom(), 4.9),
                        duration: 700,
                    });
                });

                const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
                    .setLngLat([stop.longitude, stop.latitude])
                    .setPopup(popup)
                    .addTo(map);

                markersRef.current.push(marker);
            });

            if (stops.length > 1) {
                map.fitBounds(bounds, { padding: 48, maxZoom: 4.5, duration: 0 });
            }
        });

        mapRef.current = map;

        return () => {
            markersRef.current.forEach((marker) => marker.remove());
            markersRef.current = [];
            map.remove();
            mapRef.current = null;
        };
    }, [stops]);

    // Frameless variant — used inside the homepage curiosities panel,
    // where the tab module already provides the framing.
    if (bare) {
        return (
            <div className="space-y-3">
                <div className="travel-map-shell travel-map-shell--panel">
                    <div ref={containerRef} className="travel-map-canvas" />
                </div>
                <p className="text-xs text-text-secondary">
                    Blue pin is my base city; stars are places I have visited.
                </p>
            </div>
        );
    }

    return (
        <article className="extras-card map-extras-card space-y-3">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-sm uppercase tracking-wider text-text-muted flex items-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                            <path d="M12 21s7-4.35 7-10a7 7 0 10-14 0c0 5.65 7 10 7 10z" />
                            <circle cx="12" cy="11" r="2.5" />
                        </svg>
                        {title}
                    </h3>
                    
                </div>
                <span className="text-[10px] uppercase tracking-[0.16em] text-text-muted bg-bg border border-border rounded px-2 py-1">
                    live
                </span>
            </div>

            <div className="travel-map-shell">
                <div ref={containerRef} className="travel-map-canvas" />
            </div>

            <p className="text-xs text-text-secondary">
                Blue pin is my base city; stars are places I have visited.
            </p>
        </article>
    );
};

export default TravelMapCard;
