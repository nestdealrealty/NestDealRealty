import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, MapPin, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './PropertySlider.css';

const PropertyCard = ({ property, baseRoute = '/property' }) => {
    const navigate = useNavigate();

    const handleDoubleClick = () => {
        // Add fade-out animation before navigation
        document.body.style.opacity = '0.95';
        document.body.style.transition = 'opacity 0.3s ease';

        setTimeout(() => {
            navigate(`${baseRoute}/${property.id}`);
            document.body.style.opacity = '1';
        }, 300);
    };

    return (
        <div
            className="property-card"
            onDoubleClick={handleDoubleClick}
            style={{ cursor: 'pointer' }}
            title="Double-click to view details"
        >
            <div className="property-image">
                <img src={property.image} alt={property.name} />
                <div className="property-tag">{property.tag}</div>
                <button
                    className="favorite-btn"
                    onClick={(e) => { e.stopPropagation(); /* Logic for fav */ }}
                >
                    <Maximize2 size={18} />
                </button>
            </div>
            <div className="property-info" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div className="property-price" style={{ color: '#E3BC5A', fontSize: '1.25rem', fontWeight: 'bold' }}>
                    {property.price}
                </div>
                
                <h3 className="property-name" style={{ margin: '4px 0', fontSize: '1.1rem', color: '#1A1A1A' }}>
                    {property.name}
                </h3>
                
                <div className="property-type-row" style={{ color: '#666666', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {property.bhk} {property.type}
                </div>
                
                {property.area && property.area !== 'N/A' && (
                    <div className="property-area" style={{ color: '#444444', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#E3BC5A' }}>•</span> {property.area}
                    </div>
                )}

                <div className="property-location" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#666', fontSize: '0.85rem', marginTop: '8px', borderTop: '1px solid #EAEAEA', paddingTop: '12px' }}>
                    <MapPin size={14} /> {property.location}
                </div>

                <button
                    className="view-details-btn"
                    style={{ marginTop: '12px' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDoubleClick();
                    }}
                >
                    View Details <ArrowUpRight size={18} />
                </button>
            </div>
        </div>
    );
};

const PropertySlider = ({ title, properties, baseRoute = '/property' }) => {
    const sliderRef = useRef(null);

    const scroll = (direction) => {
        if (sliderRef.current) {
            const scrollAmount = 350;
            sliderRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="property-slider-section">
            <div className="container">
                <div className="slider-header">
                    <h2 className="section-title">
                        {title}
                        <span className="view-all">See all Properties <ChevronRight size={16} /></span>
                    </h2>
                    <div className="slider-controls">
                        <button className="control-btn" onClick={() => scroll('left')}>
                            <ChevronLeft size={24} />
                        </button>
                        <button className="control-btn" onClick={() => scroll('right')}>
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                <div className="slider-wrapper" ref={sliderRef}>
                    {properties.map((property) => (
                        <PropertyCard key={property.id} property={property} baseRoute={baseRoute} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PropertySlider;
export { PropertyCard };
