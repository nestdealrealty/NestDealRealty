import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, MapPin, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './PropertySlider.css';

const PropertyCard = ({ property }) => {
    const navigate = useNavigate();

    const handleDoubleClick = () => {
        // Add fade-out animation before navigation
        document.body.style.opacity = '0.95';
        document.body.style.transition = 'opacity 0.3s ease';

        setTimeout(() => {
            navigate(`/property/${property.id}`);
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
            <div className="property-info">
                <div className="property-type-row">
                    <span className="bhk">{property.bhk} {property.type}</span>
                </div>
                <h3 className="property-name">{property.name}</h3>
                <div className="property-location">
                    <MapPin size={14} /> {property.location}
                </div>
                <div className="property-meta">
                    <div className="meta-item">
                        <span className="label">Price</span>
                        <span className="value">{property.price}</span>
                    </div>
                    <div className="meta-divider"></div>
                    <div className="meta-item">
                        <span className="label">Area</span>
                        <span className="value">{property.area}</span>
                    </div>
                </div>
                <button
                    className="view-details-btn"
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

const PropertySlider = ({ title, properties }) => {
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
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PropertySlider;
export { PropertyCard };
