import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    Share2, Heart, MapPin, Download, ChevronRight, ChevronLeft, Check,
    Star, Phone, User, Mail, School, Bus, ShoppingBag, Coffee, X,
    Maximize2, Calendar, Ruler, Car, Home, Layers, ExternalLink,
    ThumbsUp, ThumbsDown, Play, Building2, TrendingUp, FileText,
    Hospital, Trees, Navigation, Calculator, ShieldCheck, Info, MessageSquare
} from 'lucide-react';
import { getPropertyById } from '../data/properties';
import './PropertyDetails.css';
import logo from '../assets/logo.jpg';

const PropertyDetails = () => {
    const { id } = useParams();

    // Fetch property data dynamically or use fallback demo data
    const fetchedProperty = getPropertyById(parseInt(id));

    // Fallback demo data (The Planet)
    const demoProperty = {
        title: "The Planet",
        tagline: "Luxury 3BHK Elite Facing Apartments",
        developer: "Venus Group",
        location: "Shela, Ahmedabad",
        address: "Sy No.70/3, Opp To Club O7, Shela Road, Ahmedabad, Gujarat",
        price: "₹75L - 1.2Cr",
        pricePerSqFt: "₹4,520/sq.ft",
        emi: "EMI starts at ₹36,140",
        type: "Residential Apartment",
        status: "Under Construction",
        possession: "Dec, 2025",
        furnishing: "Unfurnished",
        description: "The Planet by Venus Group is a premium residential project offering spacious 3 BHK apartments. Designed for modern elite living, these residences combine world-class design, privacy, and comfort with panoramic views of the city. Every detail has been meticulously planned to offer a lifestyle of luxury and convenience.",
        specs: [
            { icon: <Home size={20} />, label: "Bedrooms", value: "3 BHK" },
            { icon: <Layers size={20} />, label: "Bathrooms", value: "3" },
            { icon: <Ruler size={20} />, label: "Area", value: "1827 sq.ft" },
            { icon: <Car size={20} />, label: "Parking", value: "2 Covered" },
            { icon: <Maximize2 size={20} />, label: "Facing", value: "East/West" },
            { icon: <Calendar size={20} />, label: "Possession", value: "Dec 2025" }
        ],
        highlights: [
            "Strategic Sit-out Areas for Relaxation",
            "Corner Units for Privacy & Light",
            "Multiple Facing Options for Sunlight",
            "Teak Wood Main Door",
            "3 Track UPVC Windows with Mosquito Net"
        ],
        amenities: [
            { icon: <div className="amenity-icon-box"><School size={20} /></div>, name: "Schools Nearby" },
            { icon: <div className="amenity-icon-box"><Bus size={20} /></div>, name: "Public Transport" },
            { icon: <div className="amenity-icon-box"><ShoppingBag size={20} /></div>, name: "Shopping Mall" },
            { icon: <div className="amenity-icon-box"><Coffee size={20} /></div>, name: "Cafes & Dining" },
            { icon: <div className="amenity-icon-box"><Check size={20} /></div>, name: "Swimming Pool" },
            { icon: <div className="amenity-icon-box"><Check size={20} /></div>, name: "Gymnasium" },
            { icon: <div className="amenity-icon-box"><Check size={20} /></div>, name: "Club House" },
            { icon: <div className="amenity-icon-box"><Check size={20} /></div>, name: "Garden Area" }
        ],
        gallery: [
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80"
        ]
    };

    const property = fetchedProperty || demoProperty;
    // Normalize gallery images source (Fix for missing gallery array in new IDs)
    const galleryImages = property.mediaGallery?.photos?.map(p => p.url) || property.gallery || [];

    const [heroIndex, setHeroIndex] = useState(0);
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // NEW: States for new sections
    const [selectedUnitType, setSelectedUnitType] = useState(0);
    const [selectedSize, setSelectedSize] = useState(0);
    const [floorPlanModal, setFloorPlanModal] = useState(null);
    const [mediaGalleryModal, setMediaGalleryModal] = useState(null);
    const [helpfulFeedback, setHelpfulFeedback] = useState(null);
    const nearbyPlacesRef = useRef(null);
    const [activeSection, setActiveSection] = useState('overview');

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['property-location', 'around-this-project', 'overview', 'floor-plan', 'photos-videos', 'amenities', 'brochure', 'helpful-tools'];
            const scrollPosition = window.scrollY + 200; // Offset for sticky header

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element && element.offsetTop <= scrollPosition) {
                    setActiveSection(section);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Auto-slide for Hero Section
    useEffect(() => {
        let interval;
        if (isAutoPlaying && lightboxIndex === null) {
            interval = setInterval(() => {
                setHeroIndex((prev) => (prev + 1) % galleryImages.length);
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [isAutoPlaying, lightboxIndex, galleryImages.length]);

    // Keyboard navigation for lightbox
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (lightboxIndex === null) return;

            switch (e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
                    break;
                case 'ArrowRight':
                    setLightboxIndex((prev) => (prev + 1) % galleryImages.length);
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxIndex, galleryImages.length]);

    // Touch swipe support for hero slider
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextHero();
        } else if (isRightSwipe) {
            prevHero();
        }
    };

    const nextHero = () => {
        setHeroIndex((prev) => (prev + 1) % galleryImages.length);
        setIsAutoPlaying(false);
    };

    const prevHero = () => {
        setHeroIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
        setIsAutoPlaying(false);
    };

    const openLightbox = (index) => {
        setLightboxIndex(index);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxIndex(null);
        document.body.style.overflow = 'auto';
    };

    const nextLightbox = (e) => {
        e.stopPropagation();
        setLightboxIndex((prev) => (prev + 1) % galleryImages.length);
    };

    const prevLightbox = (e) => {
        e.stopPropagation();
        setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    };

    return (
        <div className="property-details-v2">

            {/* 1. HERO IMAGE SECTION */}
            <section className="hero-gallery">
                <div
                    className="hero-slider"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <div
                        className="hero-track"
                        style={{ transform: `translateX(-${heroIndex * 100}%)` }}
                    >
                        {galleryImages.map((img, idx) => (
                            <div
                                key={idx}
                                className="hero-slide"
                                onDoubleClick={() => openLightbox(idx)}
                            >
                                <img
                                    src={img}
                                    alt={`Slide ${idx}`}
                                    loading={idx === 0 ? "eager" : "lazy"}
                                />
                                <div className="image-overlay-gradient"></div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <button className="hero-arrow prev" onClick={prevHero}>
                        <ChevronLeft size={24} />
                    </button>
                    <button className="hero-arrow next" onClick={nextHero}>
                        <ChevronRight size={24} />
                    </button>

                    {/* Dot Indicators */}
                    <div className="hero-dots">
                        {galleryImages.map((_, idx) => (
                            <button
                                key={idx}
                                className={`hero-dot ${heroIndex === idx ? 'active' : ''}`}
                                onClick={() => { setHeroIndex(idx); setIsAutoPlaying(false); }}
                            />
                        ))}
                    </div>

                    {/* Info Overlay */}
                    <div className="hero-info-badge">
                        <Maximize2 size={14} /> Double-click to expand
                    </div>
                </div>
            </section>

            {/* STICKY NAV BAR */}
            <div className="sticky-section-nav">
                <div className="nav-wrapper">
                    {[
                        { id: 'property-location', label: 'Overview/Home' },
                        { id: 'around-this-project', label: 'Around This Project' },
                        { id: 'overview', label: 'More About Project' },
                        { id: 'floor-plan', label: 'Floor Plan' },
                        { id: 'photos-videos', label: 'Tour This Project' },
                        { id: 'amenities', label: 'Amenities' },
                        { id: 'brochure', label: 'Brochure' },
                        { id: 'helpful-tools', label: 'Helpful Tools' }
                    ].map(item => (
                        <a
                            key={item.id}
                            href={`#${item.id}`}
                            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                const el = document.getElementById(item.id);
                                if (el) {
                                    const offset = 180; // Header + Nav height
                                    const bodyRect = document.body.getBoundingClientRect().top;
                                    const elementRect = el.getBoundingClientRect().top;
                                    const elementPosition = elementRect - bodyRect;
                                    const offsetPosition = elementPosition - offset;
                                    window.scrollTo({
                                        top: offsetPosition,
                                        behavior: 'smooth'
                                    });
                                    setActiveSection(item.id);
                                }
                            }}
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            </div>

            <div className="pd-content-container">
                <div className="pd-layout-grid">

                    {/* LEFT COLUMN */}
                    <div className="pd-main-col">

                        {/* 3. PROPERTY DETAILS SECTION */}
                        <div className="pd-header-block" id="property-location">
                            <div className="pd-location-title-row">
                                <div className="location-pin-gold">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <span className="location-label">Property Location</span>
                                    <h2 className="location-value">{property.location}</h2>
                                    <p className="property-full-address">{property.address}</p>
                                </div>
                            </div>
                        </div>

                        {/* NEW SECTION 1: NEARBY PLACES */}
                        {property.nearbyPlaces && (
                            <div className="pd-nearby-section" id="around-this-project">
                                <h3 className="section-heading">Around This Project</h3>

                                <div className="nearby-scroll-container">
                                    <div className="nearby-places-scroll" ref={nearbyPlacesRef}>
                                        {property.nearbyPlaces.map((place, idx) => {
                                            const IconComponent = {
                                                School, Hospital, ShoppingBag, Bus, Coffee, Trees
                                            }[place.icon] || MapPin;

                                            return (
                                                <div key={idx} className="nearby-card">
                                                    <div className="nearby-icon">
                                                        <IconComponent size={22} />
                                                    </div>
                                                    <div className="nearby-info">
                                                        <span className="nearby-category">{place.category}</span>
                                                        <span className="nearby-name">{place.name}</span>
                                                        <span className="nearby-distance">{place.distance}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <button
                                        className="nearby-scroll-btn"
                                        onClick={() => nearbyPlacesRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>

                                <div className="maps-cta">
                                    <a
                                        href={`https://www.google.com/maps/search/${encodeURIComponent(property.address)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="maps-link"
                                    >
                                        View more on Maps <ExternalLink size={16} />
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* NEW SECTION 2: PROJECT OVERVIEW */}
                        {property.projectOverview && (
                            <div className="pd-overview-section" id="overview">
                                <div className="overview-header">
                                    <h2 className="section-title">{property.title} Overview</h2>
                                    <a
                                        href={property.brochureUrl || '#'}
                                        className="download-brochure-btn"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Download size={18} /> Download Brochure
                                    </a>
                                </div>

                                <div className="project-info-grid">
                                    {[
                                        { icon: Building2, label: "Project Units", value: property.projectOverview.projectUnits },
                                        { icon: Ruler, label: "Area Unit", value: property.projectOverview.areaUnit },
                                        { icon: TrendingUp, label: "Project Area", value: property.projectOverview.projectArea },
                                        { icon: Maximize2, label: "Sizes", value: property.projectOverview.sizes },
                                        { icon: Home, label: "Project Size", value: property.projectOverview.projectSize },
                                        { icon: Calendar, label: "Launch Date", value: property.projectOverview.launchDate },
                                        { icon: Star, label: "Avg. Price", value: property.projectOverview.avgPrice },
                                        { icon: Calendar, label: "Possession Starts", value: property.projectOverview.possessionStarts },
                                        { icon: Layers, label: "Configuration", value: property.projectOverview.configuration },
                                    ].map((item, idx) => (
                                        <div key={idx} className="info-grid-item">
                                            <item.icon size={20} className="info-icon" />
                                            <div className="info-content">
                                                <span className="info-label">{item.label}</span>
                                                <span className="info-value">{item.value}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="rera-section">
                                    <div className="rera-info">
                                        <FileText size={20} />
                                        <span>RERA ID: <strong>{property.projectOverview.reraId}</strong></span>
                                    </div>
                                    <a
                                        href={property.projectOverview.reraUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rera-link"
                                    >
                                        Check RERA Status <ExternalLink size={14} />
                                    </a>
                                </div>

                                <div className="overview-actions">
                                    <button className="action-btn share-btn">
                                        <Share2 size={18} /> Share
                                    </button>
                                    <button className="action-btn save-btn">
                                        <Heart size={18} /> Save
                                    </button>
                                    <button className="action-btn primary-btn">
                                        <Phone size={18} /> Ask For Details
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* NEW SECTION 3: PRICE & FLOOR PLAN */}
                        {property.unitTypes && property.unitTypes.length > 0 && (
                            <div className="pd-floorplan-section" id="floor-plan">
                                <h2 className="section-title">Price & Floor Plan</h2>
                                {/* ... content same as before but ensured ID is present ... */}
                                {/* Unit Type Selector */}
                                <div className="unit-type-selector">
                                    {property.unitTypes.map((unitType, idx) => (
                                        <button
                                            key={idx}
                                            className={`unit-type-tab ${selectedUnitType === idx ? 'active' : ''}`}
                                            onClick={() => { setSelectedUnitType(idx); setSelectedSize(0); }}
                                        >
                                            <span className="unit-type-name">{unitType.type}</span>
                                            <span className="unit-type-range">{unitType.priceRange}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Size Selector */}
                                <div className="size-selector-container">
                                    <h3 className="subsection-title">Select Size</h3>
                                    <div className="size-selector-scroll">
                                        {property.unitTypes[selectedUnitType].variants.map((variant, idx) => (
                                            <button
                                                key={idx}
                                                className={`size-option ${selectedSize === idx ? 'active' : ''}`}
                                                onClick={() => setSelectedSize(idx)}
                                            >
                                                {variant.size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Selected Variant Details */}
                                {property.unitTypes[selectedUnitType].variants[selectedSize] && (
                                    <>
                                        <div className="selected-price-display">
                                            <div className="price-main-large">
                                                {property.unitTypes[selectedUnitType].variants[selectedSize].price}
                                            </div>
                                            <div className="price-per-sqft">
                                                {property.unitTypes[selectedUnitType].variants[selectedSize].pricePerSqFt}/sq.ft
                                            </div>
                                        </div>

                                        {/* Floor Plan Preview */}
                                        <div className="floor-plan-preview">
                                            <div
                                                className="floor-plan-image-container"
                                                onClick={() => setFloorPlanModal(property.unitTypes[selectedUnitType].variants[selectedSize].floorPlan)}
                                            >
                                                <img
                                                    src={property.unitTypes[selectedUnitType].variants[selectedSize].floorPlan}
                                                    alt="Floor Plan"
                                                    className="floor-plan-img"
                                                    loading="lazy"
                                                />
                                                <div className="floor-plan-overlay">
                                                    <Maximize2 size={32} />
                                                    <span>Click to enlarge</span>
                                                </div>
                                            </div>

                                            <div className="floor-plan-meta">
                                                <div className="meta-row">
                                                    <span className="meta-label">Plot Area:</span>
                                                    <span className="meta-value">{property.unitTypes[selectedUnitType].variants[selectedSize].size}</span>
                                                </div>
                                                <div className="meta-row">
                                                    <span className="meta-label">RERA ID:</span>
                                                    <span className="meta-value">{property.unitTypes[selectedUnitType].variants[selectedSize].reraId}</span>
                                                </div>
                                                <div className="meta-row">
                                                    <span className="meta-label">Possession:</span>
                                                    <span className="meta-value">{property.possession}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Helpful Feedback */}
                                        <div className="helpful-feedback">
                                            <span>Is the pricing & floor plan helpful?</span>
                                            <div className="feedback-buttons">
                                                <button
                                                    className={`feedback-btn ${helpfulFeedback === 'yes' ? 'active' : ''}`}
                                                    onClick={() => setHelpfulFeedback('yes')}
                                                >
                                                    <ThumbsUp size={18} />
                                                </button>
                                                <button
                                                    className={`feedback-btn ${helpfulFeedback === 'no' ? 'active' : ''}`}
                                                    onClick={() => setHelpfulFeedback('no')}
                                                >
                                                    <ThumbsDown size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* NEW SECTION 4: PHOTOS & VIDEOS */}
                        {property.mediaGallery && (
                            <div className="pd-media-gallery-section" id="photos-videos">
                                <div className="media-header">
                                    <div>
                                        <h2 className="section-title">Photos & Videos</h2>
                                        <p className="media-subtitle">Tour this project virtually</p>
                                    </div>
                                </div>
                                {/* Thumbnail Grid logic kept same */}
                                <div className="media-thumbnail-grid">
                                    {property.mediaGallery.photos.slice(0, 7).map((photo, idx) => (
                                        <div
                                            key={idx}
                                            className="media-thumbnail"
                                            onClick={() => setMediaGalleryModal(idx)}
                                        >
                                            <img src={photo.url} alt={photo.caption} loading="lazy" />
                                            <div className="media-caption">{photo.caption}</div>
                                        </div>
                                    ))}
                                    {/* Video thumbnails would go here */}
                                    {property.mediaGallery.totalMedia > 8 && (
                                        <div className="media-thumbnail more-media" onClick={() => setMediaGalleryModal(0)}>
                                            <div className="more-media-content">
                                                <span className="more-count">+{property.mediaGallery.totalMedia - 8}</span>
                                                <span>more</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 5. AMENITIES SECTION (Moved here for order) */}
                        <div className="pd-amenities-section" id="amenities">
                            <h2 className="section-title">Amenities</h2>
                            <div className="amenities-grid-v2">
                                {property.amenities.map((item, idx) => (
                                    <div key={idx} className="amenity-card-v2">
                                        {item.icon}
                                        <span>{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* NEW SECTION: BROCHURE */}
                        <div className="pd-brochure-section" id="brochure">
                            <h2 className="section-title">Project Brochure</h2>
                            <div className="brochure-preview-container">
                                {property.brochureImages && property.brochureImages.map((img, idx) => (
                                    <div key={idx} className="brochure-card">
                                        <img src={img} alt="Brochure Page" loading="lazy" />
                                        <div className="brochure-overlay">
                                            <FileText size={24} />
                                            <span>View Page</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="download-brochure-large-btn">
                                <Download size={20} /> Download Official Brochure
                            </button>
                        </div>

                        {/* NEW SECTION: HELPFUL TOOLS */}
                        <div className="pd-tools-section" id="helpful-tools">
                            <h2 className="section-title">Helpful Tools</h2>
                            <div className="tools-grid">
                                <div className="tool-card">
                                    <div className="tool-icon-bg"><Calculator size={24} /></div>
                                    <h3>EMI Calculator</h3>
                                    <p>Calculate your monthly EMI based on loan amount & tenure.</p>
                                </div>
                                <div className="tool-card">
                                    <div className="tool-icon-bg"><ShieldCheck size={24} /></div>
                                    <h3>Eligibility Check</h3>
                                    <p>Check your home loan eligibility instantly.</p>
                                </div>
                                <div className="tool-card">
                                    <div className="tool-icon-bg"><Info size={24} /></div>
                                    <h3>Affordability</h3>
                                    <p>Find the best budget for your home search.</p>
                                </div>
                            </div>
                        </div>

                        {/* 6. LOCATION / MAP SECTION */}
                        <div className="pd-map-section" id="location">
                            <h2 className="section-title">Map View</h2>
                            <div className="map-placeholder-v2">
                                <div className="map-inner">
                                    <MapPin size={40} className="map-pin-anim" />
                                    <p>Map View for {property.address}</p>
                                    <button className="view-on-google">View on Google Maps</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - STICKY CTA */}
                    <div className="pd-sidebar-col">
                        <div className="sidebar-cta-card sticky-card">
                            <div className="cta-highlight-banner">
                                <TrendingUp size={16} /> Awesome! Most viewed project in this area
                            </div>

                            <div className="contact-seller-header">
                                <div className="seller-profile-row">
                                    <div className="seller-logo">
                                        <img src={logo} alt="Nest Deal Realty" className="seller-logo-img" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </div>
                                    <div className="seller-info">
                                        <h3 className="cs-title">Contact Seller</h3>
                                        <div className="seller-name">NEST DEAL REALTY</div>
                                        <div className="seller-phone">+91 84696 30555</div>
                                    </div>
                                </div>
                            </div>

                            <form className="lead-form" onSubmit={(e) => e.preventDefault()}>
                                <div className="lf-input-group">
                                    <User size={16} className="lf-icon" />
                                    <input type="text" placeholder="Name" className="lf-input" />
                                </div>
                                <div className="lf-input-group">
                                    <Phone size={16} className="lf-icon" />
                                    <input type="tel" placeholder="Phone" className="lf-input" />
                                </div>
                                <div className="lf-input-group">
                                    <Mail size={16} className="lf-icon" />
                                    <input type="email" placeholder="Email" className="lf-input" />
                                </div>

                                <div className="lf-checkbox-group">
                                    <label className="lf-checkbox-label">
                                        <input type="checkbox" defaultChecked />
                                        <span>I agree to be contacted by Housing and agents via WhatsApp, SMS, phone, email etc</span>
                                    </label>
                                    <label className="lf-checkbox-label">
                                        <input type="checkbox" />
                                        <span>I am interested in Home Loans</span>
                                    </label>
                                </div>

                                <button type="submit" className="lf-submit-btn">
                                    Get Contact Details
                                </button>
                            </form>
                        </div>

                        <div className="still-deciding-card">
                            <div className="sd-text">
                                <h4>Still deciding?</h4>
                                <p>Shortlist this property for now & easily come back to it later.</p>
                            </div>
                            <button className="sd-heart-btn">
                                <Heart size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. FULL-SCREEN IMAGE VIEW */}
            {
                lightboxIndex !== null && (
                    <div className="lightbox-v2" onClick={closeLightbox}>
                        <button className="lb-close" onClick={closeLightbox}><X size={32} /></button>

                        <div className="lb-content" onClick={e => e.stopPropagation()}>
                            <button className="lb-nav prev" onClick={prevLightbox}>
                                <ChevronLeft size={48} />
                            </button>

                            <div className="lb-image-wrapper">
                                <img
                                    src={galleryImages[lightboxIndex]}
                                    alt="Zoomed View"
                                    className="lb-main-img"
                                />
                            </div>

                            <button className="lb-nav next" onClick={nextLightbox}>
                                <ChevronRight size={48} />
                            </button>
                        </div>

                        <div className="lb-footer">
                            <div className="lb-counter">{lightboxIndex + 1} / {galleryImages.length}</div>
                        </div>
                    </div>
                )
            }

            {/* FLOOR PLAN MODAL */}
            {
                floorPlanModal && (
                    <div className="lightbox-v2" onClick={() => setFloorPlanModal(null)}>
                        <button className="lb-close" onClick={() => setFloorPlanModal(null)}>
                            <X size={32} />
                        </button>

                        <div className="lb-content" onClick={e => e.stopPropagation()}>
                            <div className="lb-image-wrapper">
                                <img
                                    src={floorPlanModal}
                                    alt="Floor Plan"
                                    className="lb-main-img"
                                />
                            </div>
                        </div>

                        <div className="lb-footer">
                            <div className="lb-counter">Floor Plan</div>
                        </div>
                    </div>
                )
            }

            {/* MEDIA GALLERY MODAL */}
            {
                mediaGalleryModal !== null && property.mediaGallery && (
                    <div className="lightbox-v2" onClick={() => setMediaGalleryModal(null)}>
                        <button className="lb-close" onClick={() => setMediaGalleryModal(null)}>
                            <X size={32} />
                        </button>

                        <div className="lb-content" onClick={e => e.stopPropagation()}>
                            <button className="lb-nav prev" onClick={(e) => {
                                e.stopPropagation();
                                const currentIdx = typeof mediaGalleryModal === 'number' ? mediaGalleryModal : 0;
                                const newIdx = (currentIdx - 1 + property.mediaGallery.photos.length) % property.mediaGallery.photos.length;
                                setMediaGalleryModal(newIdx);
                            }}>
                                <ChevronLeft size={48} />
                            </button>

                            <div className="lb-image-wrapper">
                                <img
                                    src={property.mediaGallery.photos[typeof mediaGalleryModal === 'number' ? mediaGalleryModal : 0]?.url}
                                    alt="Gallery Image"
                                    className="lb-main-img"
                                />
                            </div>

                            <button className="lb-nav next" onClick={(e) => {
                                e.stopPropagation();
                                const currentIdx = typeof mediaGalleryModal === 'number' ? mediaGalleryModal : 0;
                                const newIdx = (currentIdx + 1) % property.mediaGallery.photos.length;
                                setMediaGalleryModal(newIdx);
                            }}>
                                <ChevronRight size={48} />
                            </button>
                        </div>

                        <div className="lb-footer">
                            <div className="lb-counter">
                                {(typeof mediaGalleryModal === 'number' ? mediaGalleryModal : 0) + 1} / {property.mediaGallery.photos.length}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Sticky Mobile CTA */}
            <div className="mobile-cta-bar">
                <button className="m-cta-btn phone"><Phone size={20} /></button>
                <button className="m-cta-btn primary">Book a Visit</button>
            </div>

        </div >
    );
};

export default PropertyDetails;
