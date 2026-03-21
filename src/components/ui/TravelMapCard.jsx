import React from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const BASEMAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

const DEFAULT_STOPS = [
    {
        id: 'home',
        label: 'Milan (Home)',
        note: 'Based near Milan.',
        longitude: 9.19,
        latitude: 45.4642,
        type: 'home',
    }// ,
    // {
    //     id: 'barcelona',
    //     label: 'Barcelona',
    //     note: 'Travel and inspiration stop.',
    //     longitude: 2.1734,
    //     latitude: 41.3851,
    //     type: 'travel',
    // },
    // {
    //     id: 'berlin',
    //     label: 'Berlin',
    //     note: 'Great creative and tech scene.',
    //     longitude: 13.405,
    //     latitude: 52.52,
    //     type: 'travel',
    // }
];

const TravelMapCard = ({
    title = 'Map',
    subtitle = 'Current base and travel highlights.',
    stops = DEFAULT_STOPS,
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
                el.className = `travel-map-pin ${stop.type === 'home' ? 'is-home' : 'is-travel'}`;
                el.setAttribute('aria-label', stop.label);

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
                Pins show my base city and some places I have traveled to.
            </p>
        </article>
    );
};

export default TravelMapCard;
