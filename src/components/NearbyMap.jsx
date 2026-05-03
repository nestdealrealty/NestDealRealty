import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
    School, Hospital, TrainFront, ShoppingBag, Store, Navigation, 
    MapPin, ChevronDown, ChevronUp, Star, Clock, Car, Footprints,
    GraduationCap, Building2, Bus, Landmark
} from 'lucide-react';

const CATEGORIES = [
    { 
        id: 'schools', 
        name: 'Schools', 
        types: ['school'], 
        icon: GraduationCap, 
        color: '#4285F4',
        markerIcon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    },
    { 
        id: 'colleges', 
        name: 'Colleges', 
        types: ['university'], 
        icon: Building2, 
        color: '#673AB7',
        markerIcon: 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png'
    },
    { 
        id: 'hospitals', 
        name: 'Hospitals', 
        types: ['hospital', 'medical_care'], 
        icon: Hospital, 
        color: '#EA4335',
        markerIcon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
    },
    { 
        id: 'transport', 
        name: 'Transport', 
        types: ['bus_station', 'subway_station', 'train_station', 'transit_station'], 
        icon: TrainFront, 
        color: '#34A853',
        markerIcon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
    },
    { 
        id: 'malls', 
        name: 'Malls', 
        types: ['shopping_mall'], 
        icon: ShoppingBag, 
        color: '#FBBC05',
        markerIcon: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
    },
    { 
        id: 'supermarkets', 
        name: 'Supermarkets', 
        types: ['supermarket', 'grocery_or_supermarket'], 
        icon: Store, 
        color: '#FF6D00',
        markerIcon: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png'
    }
];

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export default function NearbyMap({ latitude, longitude, projectName }) {
    const [map, setMap] = useState(null);
    const [places, setPlaces] = useState({});
    const [activeFilter, setActiveFilter] = useState('all');
    const [expandedCategories, setExpandedCategories] = useState(['schools']);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const markersRef = useRef([]);
    const mapRef = useRef(null);
    const propertyMarkerRef = useRef(null);

    // Load Google Maps Script
    useEffect(() => {
        if (window.google) {
            initMap();
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry`;
        script.async = true;
        script.defer = true;
        script.onload = () => initMap();
        script.onerror = () => setError("Failed to load Google Maps");
        document.head.appendChild(script);

        return () => {
            // Clean up markers
            markersRef.current.forEach(m => m.setMap(null));
        };
    }, [latitude, longitude]);

    const initMap = () => {
        if (!latitude || !longitude || !mapRef.current) return;

        const center = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
        const mapInstance = new window.google.maps.Map(mapRef.current, {
            center,
            zoom: 14,
            styles: [
                {
                    "featureType": "poi",
                    "elementType": "labels",
                    "stylers": [{ "visibility": "off" }]
                },
                {
                    "featureType": "all",
                    "elementType": "geometry.fill",
                    "stylers": [{ "weight": "2.00" }]
                },
                {
                    "featureType": "all",
                    "elementType": "geometry.stroke",
                    "stylers": [{ "color": "#9c9c9c" }]
                },
                {
                    "featureType": "all",
                    "elementType": "labels.text",
                    "stylers": [{ "visibility": "on" }]
                },
                {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [{ "color": "#f2f2f2" }]
                },
                {
                    "featureType": "landscape",
                    "elementType": "geometry.fill",
                    "stylers": [{ "color": "#ffffff" }]
                }
            ],
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true
        });

        // Property Marker
        const propertyMarker = new window.google.maps.Marker({
            position: center,
            map: mapInstance,
            title: projectName,
            icon: {
                path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                scale: 10,
                fillColor: "#000",
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "#FFF"
            },
            animation: window.google.maps.Animation.DROP,
            zIndex: 1000
        });

        propertyMarkerRef.current = propertyMarker;
        setMap(mapInstance);
        fetchNearbyPlaces(mapInstance, center);
    };

    const fetchNearbyPlaces = (mapInstance, center) => {
        const service = new window.google.maps.places.PlacesService(mapInstance);
        const results = {};
        let completed = 0;

        CATEGORIES.forEach(cat => {
            const request = {
                location: center,
                radius: '3000',
                type: cat.types
            };

            service.nearbySearch(request, (resultsList, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    // Calculate distance for each place
                    const processed = resultsList.slice(0, 5).map(place => {
                        const dist = window.google.maps.geometry.spherical.computeDistanceBetween(
                            new window.google.maps.LatLng(center.lat, center.lng),
                            place.geometry.location
                        );
                        return {
                            ...place,
                            distance: (dist / 1000).toFixed(1),
                            category: cat.id
                        };
                    });
                    results[cat.id] = processed;
                }

                completed++;
                if (completed === CATEGORIES.length) {
                    setPlaces(results);
                    setLoading(false);
                    renderMarkers(mapInstance, results, 'all');
                }
            });
        });
    };

    const renderMarkers = (mapInstance, allPlaces, filter) => {
        // Clear existing markers
        markersRef.current.forEach(m => m.setMap(null));
        markersRef.current = [];

        Object.keys(allPlaces).forEach(catId => {
            if (filter !== 'all' && filter !== catId) return;

            const cat = CATEGORIES.find(c => c.id === catId);
            allPlaces[catId].forEach(place => {
                const marker = new window.google.maps.Marker({
                    position: place.geometry.location,
                    map: mapInstance,
                    title: place.name,
                    icon: {
                        url: cat.markerIcon,
                        scaledSize: new window.google.maps.Size(32, 32)
                    },
                    animation: window.google.maps.Animation.DROP
                });

                const infoWindow = new window.google.maps.InfoWindow({
                    content: `
                        <div style="padding: 10px; font-family: Inter, sans-serif;">
                            <strong style="display: block; margin-bottom: 5px;">${place.name}</strong>
                            <div style="font-size: 0.85rem; color: #666;">
                                <span style="color: ${cat.color}; font-weight: bold;">${place.distance} km away</span>
                                ${place.rating ? `<br/>★ ${place.rating}` : ''}
                            </div>
                        </div>
                    `
                });

                marker.addListener('click', () => {
                    setSelectedPlace(place);
                    infoWindow.open(mapInstance, marker);
                    mapInstance.panTo(place.geometry.location);
                    mapInstance.setZoom(15);
                });

                markersRef.current.push(marker);
            });
        });
    };

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        if (map && places) {
            renderMarkers(map, places, filter);
            if (filter === 'all') {
                map.setZoom(14);
                map.panTo({ lat: parseFloat(latitude), lng: parseFloat(longitude) });
            }
        }
    };

    const toggleCategory = (catId) => {
        setExpandedCategories(prev => 
            prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
        );
    };

    const handlePlaceClick = (place) => {
        setSelectedPlace(place);
        if (map) {
            map.panTo(place.geometry.location);
            map.setZoom(16);
            // Trigger marker click logic
            const marker = markersRef.current.find(m => m.getTitle() === place.name);
            if (marker) {
                window.google.maps.event.trigger(marker, 'click');
            }
        }
    };

    if (error) return <div className="map-error">{error}</div>;

    return (
        <div className="nearby-container">
            <div className="map-wrapper" ref={mapRef}>
                {loading && (
                    <div className="map-loader">
                        <div className="loader-spinner"></div>
                        <span>Scanning surroundings...</span>
                    </div>
                )}
            </div>

            {/* Side Panel */}
            <div className="nearby-panel">
                <div className="panel-header">
                    <h3>Nearby Essentials</h3>
                    <div className="filter-scroll">
                        <button 
                            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('all')}
                        >
                            All
                        </button>
                        {CATEGORIES.map(cat => (
                            <button 
                                key={cat.id}
                                className={`filter-btn ${activeFilter === cat.id ? 'active' : ''}`}
                                onClick={() => handleFilterChange(cat.id)}
                            >
                                <cat.icon size={14} /> {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="panel-content">
                    {CATEGORIES.filter(cat => activeFilter === 'all' || activeFilter === cat.id).map(cat => {
                        const items = places[cat.id] || [];
                        const isExpanded = expandedCategories.includes(cat.id);

                        return (
                            <div key={cat.id} className="category-section">
                                <button className="category-header" onClick={() => toggleCategory(cat.id)}>
                                    <div className="category-title">
                                        <div className="category-icon-box" style={{ background: `${cat.color}15`, color: cat.color }}>
                                            <cat.icon size={18} />
                                        </div>
                                        <span>{cat.name}</span>
                                        <span className="count-badge">{items.length}</span>
                                    </div>
                                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </button>

                                {isExpanded && (
                                    <div className="place-list">
                                        {items.length > 0 ? items.map((place, idx) => (
                                            <div 
                                                key={idx} 
                                                className={`place-card ${selectedPlace?.place_id === place.place_id ? 'selected' : ''}`}
                                                onClick={() => handlePlaceClick(place)}
                                            >
                                                <div className="place-info">
                                                    <div className="place-name">{place.name}</div>
                                                    <div className="place-meta">
                                                        <span className="dist-badge"><Navigation size={12} /> {place.distance} km</span>
                                                        {place.rating && <span className="rating-badge"><Star size={12} /> {place.rating}</span>}
                                                    </div>
                                                </div>
                                                <div className="travel-options">
                                                    <div className="travel-item">
                                                        <Car size={14} />
                                                        <span>{Math.round(place.distance * 3 + 2)}m</span>
                                                    </div>
                                                    <div className="travel-item">
                                                        <Footprints size={14} />
                                                        <span>{Math.round(place.distance * 12)}m</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="no-places">No {cat.name.toLowerCase()} found nearby.</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <style>{`
                .nearby-container {
                    display: grid;
                    grid-template-columns: 1fr 380px;
                    height: 600px;
                    background: #FFF;
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow: 0 15px 40px rgba(0,0,0,0.1);
                    border: 1px solid rgba(0,0,0,0.05);
                    position: relative;
                }

                @media (max-width: 968px) {
                    .nearby-container {
                        grid-template-columns: 1fr;
                        grid-template-rows: 400px 1fr;
                        height: auto;
                        max-height: 1000px;
                    }
                }

                .map-wrapper {
                    width: 100%;
                    height: 100%;
                    position: relative;
                }

                .map-loader {
                    position: absolute;
                    inset: 0;
                    background: rgba(255,255,255,0.8);
                    backdrop-filter: blur(5px);
                    z-index: 10;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 15px;
                    color: #5E7D5A;
                    font-weight: 600;
                }

                .loader-spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #F3F3F3;
                    border-top: 4px solid #5E7D5A;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .nearby-panel {
                    display: flex;
                    flex-direction: column;
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(20px);
                    border-left: 1px solid rgba(0,0,0,0.05);
                }

                .panel-header {
                    padding: 25px;
                    border-bottom: 1px solid rgba(0,0,0,0.05);
                }

                .panel-header h3 {
                    margin: 0 0 15px 0;
                    font-family: 'Playfair Display', serif;
                    font-size: 1.4rem;
                }

                .filter-scroll {
                    display: flex;
                    gap: 10px;
                    overflow-x: auto;
                    padding-bottom: 5px;
                    scrollbar-width: none;
                }

                .filter-scroll::-webkit-scrollbar { display: none; }

                .filter-btn {
                    padding: 8px 16px;
                    border-radius: 20px;
                    border: 1px solid #EAEAEA;
                    background: #FFF;
                    font-size: 0.85rem;
                    font-weight: 600;
                    white-space: nowrap;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: #666;
                }

                .filter-btn.active {
                    background: #5E7D5A;
                    color: #FFF;
                    border-color: #5E7D5A;
                    box-shadow: 0 4px 10px rgba(94, 125, 90, 0.2);
                }

                .panel-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 10px 0;
                }

                .category-section {
                    border-bottom: 1px solid rgba(0,0,0,0.03);
                }

                .category-header {
                    width: 100%;
                    padding: 15px 25px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: none;
                    border: none;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .category-header:hover { background: rgba(0,0,0,0.02); }

                .category-title {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-weight: 600;
                    color: #1A1A1A;
                }

                .category-icon-box {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .count-badge {
                    font-size: 0.75rem;
                    background: #F0F0F0;
                    color: #888;
                    padding: 2px 8px;
                    border-radius: 10px;
                }

                .place-list {
                    padding: 10px 15px 20px 15px;
                    background: rgba(0,0,0,0.01);
                }

                .place-card {
                    padding: 15px;
                    border-radius: 12px;
                    background: #FFF;
                    margin-bottom: 10px;
                    cursor: pointer;
                    transition: all 0.3s;
                    border: 1px solid transparent;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }

                .place-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
                    border-color: #EAEAEA;
                }

                .place-card.selected {
                    border-color: #5E7D5A;
                    background: #F4F8F4;
                }

                .place-name {
                    font-weight: 600;
                    font-size: 0.95rem;
                    margin-bottom: 6px;
                    color: #1A1A1A;
                }

                .place-meta {
                    display: flex;
                    gap: 12px;
                }

                .dist-badge, .rating-badge {
                    font-size: 0.75rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .dist-badge { color: #5E7D5A; }
                .rating-badge { color: #FFA000; }

                .travel-options {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    text-align: right;
                    border-left: 1px solid #EEE;
                    padding-left: 12px;
                }

                .travel-item {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 0.7rem;
                    color: #999;
                    font-weight: 500;
                }

                .no-places {
                    padding: 20px;
                    text-align: center;
                    color: #999;
                    font-size: 0.85rem;
                    font-style: italic;
                }

                .map-error {
                    height: 400px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #FEE;
                    color: #C33;
                    border-radius: 16px;
                    font-weight: 600;
                }
            `}</style>
        </div>
    );
}
