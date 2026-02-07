import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Share2, Heart, MapPin, Download, ChevronRight, ChevronLeft, Check,
    Star, Phone, User, Mail, School, Bus, ShoppingBag, Coffee, X
} from 'lucide-react';
import './PropertyDetails.css';

const PropertyDetails = () => {
    // Enhanced Dummy Data
    const property = {
        title: "The Planet",
        developer: "Venus Group",
        location: "Shela, Ahmedabad",
        address: "Sy No.70/3, Opp To Club O7, Shela Road, Ahmedabad, Gujarat",
        priceRange: "₹75L - 1.2Cr",
        pricePerSqFt: "₹4.52 K/sq.ft",
        emi: "EMI starts at ₹36.14 K",
        configurations: "2, 3 BHK Apartments",
        possession: "Dec, 2025",
        sizes: "1250 - 1827 sq.ft",
        reraId: "PR/GJ/AHMEDABAD/AHMEDABAD CITY/AUDA/RAA00000/000000",
        description: "The Planet by Venus Group is a premium residential project offering spacious 3 BHK apartments. Designed for modern elite living, these residences combine world-class design, privacy, and comfort with panoramic views of the city.",
        highlights: [
            "Strategic Sit-out Areas for Relaxation",
            "Corner Units for Privacy & Light",
            "Multiple Facing Options for Sunlight",
            "Teak Wood Main Door",
            "3 Track UPVC Windows with Mosquito Net"
        ],
        amenities: [
            { icon: "swimming", name: "Swimming Pool" },
            { icon: "gym", name: "Gymnasium" },
            { icon: "club", name: "Club House" },
            { icon: "garden", name: "Landscaping & Tree Planting" },
            { icon: "lift", name: "Lift(s)" },
            { icon: "kids", name: "Children's Play Area" }
        ],
        gallery: [
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=60",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=60",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=60",
            "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=800&q=60"
        ]
    };

    const [activeTab, setActiveTab] = useState('overview');
    const [lightboxIndex, setLightboxIndex] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const openLightbox = (index) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);

    const nextImage = (e) => {
        e.stopPropagation();
        setLightboxIndex((prev) => (prev + 1) % property.gallery.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setLightboxIndex((prev) => (prev - 1 + property.gallery.length) % property.gallery.length);
    };

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 120; // Height of sticky header + tabs
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setActiveTab(id);
        }
    };

    return (
        <div className="property-details-page">
            <div className="pd-container">

                {/* --- HEADER --- */}
                <div className="pd-header">
                    <div className="pd-header-left">
                        <div className="pd-breadcrumbs">
                            <Link to="/">Home</Link> / <span>Ahmedabad</span> / <span>Shela</span> / <span>The Planet</span>
                        </div>
                        <h1 className="pd-title">{property.title}</h1>
                        <div className="pd-developer">By <span className="dev-link">{property.developer}</span></div>
                        <div className="pd-address">{property.address}</div>
                    </div>
                    <div className="pd-header-right">
                        <div className="pd-price-block">
                            <h2 className="pd-price">{property.priceRange} <span className="pd-rate">| {property.pricePerSqFt}</span></h2>
                            <span className="pd-emi">{property.emi}</span>
                        </div>
                        <button className="contact-dev-btn"><Phone size={16} /> Contact Developer</button>
                    </div>
                </div>

                {/* --- GALLERY & ACTIONS --- */}
                <div className="pd-gallery-section">
                    <div className="pd-actions-bar">
                        <button className="pd-action-btn"><Share2 size={16} /> Share</button>
                        <button className="pd-action-btn"><Heart size={16} /> Save</button>
                    </div>
                    <div className="pd-gallery-grid">
                        <div className="pd-gallery-main" onClick={() => openLightbox(0)} style={{ cursor: 'pointer' }}>
                            <img src={property.gallery[0]} alt="Main" />
                            <div className="pd-tag-overlay">Cover Image</div>
                        </div>
                        <div className="pd-gallery-side">
                            <div className="pd-gallery-item" onClick={() => openLightbox(1)} style={{ cursor: 'pointer' }}>
                                <img src={property.gallery[1]} alt="Side 1" />
                            </div>
                            <div className="pd-gallery-item more-overlay-container" onClick={() => openLightbox(2)}>
                                <img src={property.gallery[2]} alt="Side 2" />
                                <div className="more-overlay">+4 more</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- QUICK INFO BAR --- */}
                <div className="pd-quick-info">
                    <div className="info-item">
                        <span className="info-label">{property.configurations}</span>
                        <span className="info-value">Configurations</span>
                    </div>
                    <div className="info-divider"></div>
                    <div className="info-item">
                        <span className="info-label">{property.possession}</span>
                        <span className="info-value">Possession Starts</span>
                    </div>
                    <div className="info-divider"></div>
                    <div className="info-item">
                        <span className="info-label">{property.pricePerSqFt}</span>
                        <span className="info-value">Avg. Price</span>
                    </div>
                    <div className="info-divider"></div>
                    <div className="info-item">
                        <span className="info-label">{property.sizes}</span>
                        <span className="info-value">(Builtup Area) Sizes <span className="info-icon">i</span></span>
                    </div>
                </div>

                {/* --- NAVIGATION TABS --- */}
                <div className="pd-tabs-nav-sticky">
                    <div className="pd-tabs-nav">
                        {['Overview', 'Highlights', 'Floor Plan', 'Amenities', 'Location'].map(tab => (
                            <button
                                key={tab}
                                className={`pd-tab-btn ${activeTab === tab.toLowerCase().replace(' ', '') ? 'active' : ''}`}
                                onClick={() => scrollToSection(tab.toLowerCase().replace(' ', ''))}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- MAIN LAYOUT (Split) --- */}
                <div className="pd-main-layout">

                    {/* LEFT CONTENT */}
                    <div className="pd-content-col">

                        {/* Overview / Highlights */}
                        <div id="overview" className="pd-section">
                            <h3 className="section-title">Why {property.title}?</h3>
                            <ul className="pd-highlights-list">
                                {property.highlights.map((item, idx) => (
                                    <li key={idx}><Check size={16} className="check-icon" /> {item}</li>
                                ))}
                            </ul>
                            <div className="pd-read-more">View More Highlights <ChevronRight size={16} /></div>
                        </div>

                        {/* Description */}
                        <div className="pd-section">
                            <h3 className="section-title">About {property.title}</h3>
                            <p className="pd-description">{property.description}</p>
                        </div>

                        {/* Amenities */}
                        <div id="amenities" className="pd-section">
                            <h3 className="section-title">Project Amenities</h3>
                            <div className="amenities-grid">
                                {property.amenities.map((amenity, idx) => (
                                    <div key={idx} className="amenity-card">
                                        <div className="amenity-icon-circle">
                                            <Star size={20} />
                                        </div>
                                        <span>{amenity.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Location / Around */}
                        <div id="location" className="pd-section">
                            <h3 className="section-title">Around This Project</h3>
                            <div className="location-map-placeholder">
                                <div className="map-overlay-btn"><MapPin size={16} /> View on Map</div>
                            </div>
                            <div className="nearby-places-grid">
                                <div className="place-card">
                                    <div className="place-icon"><School size={20} /></div>
                                    <div className="place-info">
                                        <span className="place-name">Shanti Asiatic School</span>
                                        <span className="place-dist">3 mins</span>
                                    </div>
                                </div>
                                <div className="place-card">
                                    <div className="place-icon"><Bus size={20} /></div>
                                    <div className="place-info">
                                        <span className="place-name">Shela Bus Stop</span>
                                        <span className="place-dist">5 mins</span>
                                    </div>
                                </div>
                                <div className="place-card">
                                    <div className="place-icon"><ShoppingBag size={20} /></div>
                                    <div className="place-info">
                                        <span className="place-name">Applewoods Mall</span>
                                        <span className="place-dist">8 mins</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT SIDEBAR (Sticky) */}
                    <div className="pd-sidebar-col">
                        <div className="pd-sidebar-content">
                            <div className="sidebar-banner">
                                <span className="lightning-icon">⚡</span> Great choice! Most liked project
                            </div>

                            <div className="contact-seller-card">
                                <h3>Contact Seller</h3>
                                <div className="seller-profile">
                                    <div className="seller-avatar">VG</div>
                                    <div className="seller-info">
                                        <h4>{property.developer}</h4>
                                        <span>Developer</span>
                                        <div className="seller-phone">+91 98765....</div>
                                    </div>
                                </div>

                                <p className="form-label">Please share your contact</p>
                                <form className="sidebar-form" onSubmit={(e) => e.preventDefault()}>
                                    <input type="text" placeholder="Name" className="form-input" />

                                    <div className="phone-input-group">
                                        <select className="code-select"><option>+91</option></select>
                                        <input type="tel" placeholder="Phone" className="form-input" />
                                    </div>

                                    <input type="email" placeholder="Email" className="form-input" />

                                    <div className="form-checkbox-group">
                                        <input type="checkbox" id="consent" defaultChecked />
                                        <label htmlFor="consent">I agree to be contacted by Nest Deal and agents via WhatsApp, SMS, phone, email etc</label>
                                    </div>

                                    <div className="form-checkbox-group">
                                        <input type="checkbox" id="loans" />
                                        <label htmlFor="loans">I am interested in Home Loans</label>
                                    </div>

                                    <button type="submit" className="get-details-btn">Get Contact Details</button>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            {/* Lightbox Overlay */}
            {lightboxIndex !== null && (
                <div className="lightbox-overlay" onClick={closeLightbox}>
                    <button className="lightbox-close" onClick={closeLightbox}><X size={32} /></button>

                    <div className="lightbox-content" onClick={e => e.stopPropagation()}>
                        <button className="lightbox-nav prev" onClick={prevImage}><ChevronLeft size={48} /></button>

                        <div className="lightbox-slide-container">
                            <div className="lightbox-track" style={{ transform: `translateX(-${lightboxIndex * 100}%)` }}>
                                {property.gallery.map((img, idx) => (
                                    <div key={idx} className="lightbox-slide">
                                        <img src={img} alt={`Slide ${idx}`} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button className="lightbox-nav next" onClick={nextImage}><ChevronRight size={48} /></button>
                    </div>

                    <div className="lightbox-counter">
                        {lightboxIndex + 1} / {property.gallery.length}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyDetails;
