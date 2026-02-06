import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ChevronRight, ChevronLeft, Download, Share2, Heart, Check,
    MapPin, BedDouble, Bath, Car, Maximize, Home,
    ArrowRight, Phone, User, Mail, X, Clock
} from 'lucide-react';
import './PropertyDetails.css';

const PropertyDetails = () => {
    // Dummy data matching the screenshot style
    const property = {
        title: "The Planet",
        location: "Shela, Ahmedabad",
        developer: "Venus Group",
        price: "₹73.06 L",
        price_sub: "₹3,999/ sq ft",
        bhk: "3 BHK Flat",
        area: "1827 Sq-ft",
        possession: "December 2030",
        description: "The Planet by Venus Group Premium apartment residential project in Shela, Ahmedabad is offering spacious 3 BHK Flat with sizes ranging from 1827 Sq-ft. Designed for modern elite living, these premium residences combine world-class design, privacy, and comfort.",
        features: [
            "Spacious And Luxury Rooms",
            "Modern Arrangements",
            "Spaciously Structured Towers",
            "Plush Ambience",
            "Panoramic View",
            "Irresistible Meditation Area",
            "Premium connectivity to S.P. Ring Road"
        ],
        amenities: [
            { icon: "run", name: "Jogging Track" },
            { icon: "tree", name: "Garden" },
            { icon: "water", name: "Rain Water Harvesting" },
            { icon: "home", name: "Vaastu Compliant" },
            { icon: "drop", name: "Water Storage" },
            { icon: "pool", name: "Swimming Pool" }
        ],
        gallery: [
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ]
    };

    const [currentImgIndex, setCurrentImgIndex] = useState(0);
    const [fullScreenIdx, setFullScreenIdx] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [sidebarSubmitted, setSidebarSubmitted] = useState(false);
    const [popupSubmitted, setPopupSubmitted] = useState(false);

    const handleSubmission = (e, type = 'sidebar') => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newEnquiry = {
            id: Date.now(),
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            property: property.title,
            date: new Date().toLocaleString()
        };

        // Save to localStorage
        const existingEnquiries = JSON.parse(localStorage.getItem('nestdeal_enquiries') || '[]');
        localStorage.setItem('nestdeal_enquiries', JSON.stringify([newEnquiry, ...existingEnquiries]));

        if (type === 'popup') {
            setPopupSubmitted(true);
        } else {
            setSidebarSubmitted(true);
        }

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const nextImage = (e) => {
        e.stopPropagation();
        setFullScreenIdx((prev) => (prev + 1) % property.gallery.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setFullScreenIdx((prev) => (prev - 1 + property.gallery.length) % property.gallery.length);
    };

    useEffect(() => {
        if (property.gallery.length > 1) {
            const timer = setInterval(() => {
                setCurrentImgIndex((prev) => (prev + 1) % property.gallery.length);
            }, 2500);
            return () => clearInterval(timer);
        }
    }, [property.gallery.length]);

    return (
        <div className="property-page">
            {/* Sub Header / Breadcrumb */}
            <div className="sub-header">
                <div className="container">
                    <div className="breadcrumbs">
                        <Link to="/" className="breadcrumb-home">Home</Link> <ChevronRight size={14} />
                        <span>Flat for Sale in Ahmedabad</span> <ChevronRight size={14} />
                        <span>Shela</span> <ChevronRight size={14} />
                        <span className="current">{property.title}</span>
                    </div>
                </div>
            </div>

            <div className="container main-content-wrapper">
                <div className="content-side">
                    {/* Gallery Section */}
                    <div className="gallery-grid">
                        <div className="gallery-main" onDoubleClick={() => setFullScreenIdx(currentImgIndex)}>
                            <img src={property.gallery[currentImgIndex]} alt="Main View" className="slideshow-img" />
                            <div className="slideshow-dots">
                                {property.gallery.map((_, idx) => (
                                    <span key={idx} className={`dot ${idx === currentImgIndex ? 'active' : ''}`} onClick={() => setCurrentImgIndex(idx)}></span>
                                ))}
                            </div>
                        </div>
                        <div className="gallery-side">
                            <img src={property.gallery[(currentImgIndex + 1) % property.gallery.length]} alt="Next View" onDoubleClick={() => setFullScreenIdx((currentImgIndex + 1) % property.gallery.length)} />
                            <img src={property.gallery[(currentImgIndex + 2) % property.gallery.length]} alt="Next View" onDoubleClick={() => setFullScreenIdx((currentImgIndex + 2) % property.gallery.length)} />
                        </div>
                    </div>

                    {/* Title Section */}
                    <div className="title-section">
                        <div className="title-left">
                            <h1 className="prop-title">
                                {property.title}
                                <span className="verified-badge"><Check size={12} /></span>
                            </h1>
                            <p className="prop-location"><MapPin size={16} /> {property.location}</p>
                            <span className="developer-tag">By {property.developer}</span>
                        </div>
                        <div className="title-right">
                            <div className="price-tag">{property.price}</div>
                            <div className="action-buttons">
                                <button className="outline-btn"><Share2 size={18} /> Share</button>
                                <button className="outline-btn"><Heart size={18} /> Favourite</button>
                                <button className="outline-btn"><Download size={18} /> Brochure</button>
                            </div>
                        </div>
                    </div>

                    {/* Floor Plan Section (Mockup) */}
                    <div className="floor-plan-container">
                        <div className="floor-plan-tabs">
                            <button className="active">3 BHK Flat</button>
                            <button>Price & Floor Plan</button>
                        </div>
                        <div className="floor-plan-card">
                            <div className="fp-image-box">
                                <img src="https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=400&q=80" alt="Floor Plan" />
                                <button className="view-fp-btn">View Floor Plan</button>
                            </div>
                            <div className="fp-details">
                                <div className="fp-price-row">
                                    <span className="fp-price">{property.price}</span>
                                    <span className="fp-rate">₹5,200/sq ft</span>
                                </div>
                                <div className="fp-specs">
                                    <span><BedDouble size={18} /> 3 Bed</span>
                                    <span><Bath size={18} /> 3 Bath</span>
                                    <span><Maximize size={18} /> 1827 Sq-ft</span>
                                </div>
                                <button className="enquire-now-btn" onClick={() => setIsPopupOpen(true)}>
                                    Enquire Now
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="section-block">
                        <div className="overview-stats">
                            <div className="stat-box">
                                <label>CONFIGURATIONS</label>
                                <strong>{property.bhk}</strong>
                            </div>
                            <div className="stat-box">
                                <label>POSSESSION START</label>
                                <strong>{property.possession}</strong>
                            </div>
                            <div className="stat-box">
                                <label>AREA (SQ FT)</label>
                                <strong>{property.area}</strong>
                            </div>
                            <div className="stat-box">
                                <label>PRICE PER SQ-FT</label>
                                <strong>{property.price_sub}</strong>
                            </div>
                        </div>

                        <h4 className="sub-heading">About {property.title}</h4>
                        <p className="description-text">
                            {property.description}
                        </p>

                        <h4 className="sub-heading">Key Features</h4>
                        <ul className="feature-list">
                            {property.features.map(feat => (
                                <li key={feat}><Check size={16} className="check-icon" /> {feat}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Amenities Section */}
                    <div className="section-block">
                        <h3>Amenities</h3>
                        <div className="amenities-grid">
                            {property.amenities.map(item => (
                                <div className="amenity-item" key={item.name}>
                                    <div className="amenity-icon"><Home size={24} /></div>
                                    <span>{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="section-block">
                        <h3>Project Location</h3>
                        <div className="map-container-trusted">
                            <div className="google-map-wrapper">
                                <iframe
                                    title="Property Location"
                                    width="100%"
                                    height="450"
                                    frameBorder="0"
                                    style={{ border: 0, borderRadius: '12px' }}
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(property.title + ' ' + property.location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                    allowFullScreen
                                ></iframe>

                                <div className="map-info-card">
                                    <div className="card-top">
                                        <div className="coords">
                                            <strong>23°00'50.5"N 72°27'09.9"E</strong>
                                            <span>{property.location}</span>
                                        </div>
                                        <a
                                            href={`https://www.google.com/maps/dir//${encodeURIComponent(property.title + ' ' + property.location)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="directions-link"
                                        >
                                            <div className="dir-icon">
                                                <ArrowRight size={20} />
                                            </div>
                                            <span>Directions</span>
                                        </a>
                                    </div>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.title + ' ' + property.location)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="view-larger"
                                    >
                                        View larger map
                                    </a>
                                </div>
                            </div>

                            <h4 className="sub-heading">What's Nearby?</h4>
                            <div className="nearby-grid">
                                {[
                                    { name: "Saanidhya Hospital", dist: "2.1 km", type: "Hospital" },
                                    { name: "Public Transportation", dist: "2.5 km", type: "Transport" },
                                    { name: "Apollo International School", dist: "2.9 km", type: "School" },
                                    { name: "Saraswati Multispeciality", dist: "2.1 km", type: "Hospital" },
                                    { name: "LDR International School", dist: "2.6 km", type: "School" },
                                    { name: "Shanti Asiatic School", dist: "2.9 km", type: "School" }
                                ].map((place, idx) => (
                                    <div className="nearby-card" key={idx}>
                                        <div className="nearby-icon">🏢</div>
                                        <div className="nearby-info">
                                            <strong>{place.name}</strong>
                                            <span>{place.dist}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

                {/* SidebarForm */}
                <div className="sidebar-wrapper">
                    <div className="enquiry-card sticky-card">
                        <div className="enquiry-header">
                            <h3>Interested to buy Property in</h3>
                        </div>
                        {sidebarSubmitted ? (
                            <div className="success-sidebar-view">
                                <div className="success-icon-large">✅</div>
                                <h3>Thank You!</h3>
                                <p>We've received your details. Our expert will call you <strong>within 1 hour</strong> to discuss further.</p>
                                <button className="reset-btn" onClick={() => setSidebarSubmitted(false)}>Send another enquiry</button>
                            </div>
                        ) : (
                            <form className="enquiry-form" onSubmit={(e) => handleSubmission(e, 'sidebar')}>
                                <input type="text" name="name" placeholder="Name" required />
                                <input type="tel" name="phone" placeholder="Mobile number" required maxLength="10" onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} />
                                <input type="email" name="email" placeholder="Email Address" required />

                                <div className="checkbox-group">
                                    <input type="checkbox" id="consent" defaultChecked required />
                                    <label htmlFor="consent">I agree to be contacted by Nest Deal Realty via WhatsApp, SMS, Phone, Email, etc.</label>
                                </div>

                                <button type="submit" className="submit-btn" style={{ background: 'var(--primary)', color: 'white' }}>Submit</button>

                                <div className="agent-info">
                                    <div className="agent-avatar">👨‍💼</div>
                                    <p>Rest assured, you'll receive a call from our sales expert within the next 5 minutes.</p>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

            </div>
            {/* Full Screen Modal */}
            {fullScreenIdx !== null && (
                <div className="fullscreen-overlay" onClick={() => setFullScreenIdx(null)}>
                    <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-fullscreen" onClick={() => setFullScreenIdx(null)}>&times;</button>

                        <button className="fs-nav-btn prev-btn" onClick={prevImage}>
                            <ChevronLeft size={48} />
                        </button>

                        <img src={property.gallery[fullScreenIdx]} alt="Full Screen" />

                        <button className="fs-nav-btn next-btn" onClick={nextImage}>
                            <ChevronRight size={48} />
                        </button>

                        <div className="fs-counter">
                            {fullScreenIdx + 1} / {property.gallery.length}
                        </div>
                    </div>
                </div>
            )}

            {/* Enquiry Popup Modal */}
            {isPopupOpen && (
                <div className="popup-modal-overlay" onClick={() => setIsPopupOpen(false)}>
                    <div className="trusted-enquiry-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-callback">
                            <h3>Get a callback</h3>
                            <button className="close-popup-btn" onClick={() => setIsPopupOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body-content">
                            {popupSubmitted ? (
                                <div className="success-popup-view">
                                    <div className="success-lottie-placeholder">✅</div>
                                    <h2>Request Successful!</h2>
                                    <p>Thank you for choosing <strong>Nest Deal Realty</strong>. We have received your query for <strong>{property.title}</strong>.</p>
                                    <div className="time-commitment">
                                        <Clock size={20} />
                                        <span>Expected callback: <strong>Under 1 hour</strong></span>
                                    </div>
                                    <button className="done-btn" onClick={() => { setIsPopupOpen(false); setPopupSubmitted(false); }}>Close</button>
                                </div>
                            ) : (
                                <form className="trusted-form-ui" onSubmit={(e) => handleSubmission(e, 'popup')}>
                                    <div className="input-field-trusted">
                                        <label>NAME</label>
                                        <div className="input-icon-wrapper">
                                            <User size={18} className="icon-field" />
                                            <input type="text" name="name" placeholder="Enter your name" required />
                                        </div>
                                    </div>

                                    <div className="input-field-trusted">
                                        <label>PHONE NUMBER</label>
                                        <div className="input-icon-wrapper">
                                            <Phone size={18} className="icon-field" />
                                            <input type="tel" name="phone" placeholder="Enter phone number" required maxLength="10" onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} />
                                        </div>
                                    </div>

                                    <div className="input-field-trusted">
                                        <label>EMAIL</label>
                                        <div className="input-icon-wrapper">
                                            <Mail size={18} className="icon-field" />
                                            <input type="email" name="email" placeholder="Enter your email" required />
                                        </div>
                                    </div>

                                    <div className="trust-agreement">
                                        <input type="checkbox" id="modal-agree" required defaultChecked />
                                        <label htmlFor="modal-agree">
                                            I agree to be contacted by Nest Deal Realty via WhatsApp, SMS, Phone, and other communication channels.
                                        </label>
                                    </div>

                                    <button type="submit" className="submit-trusted-btn">
                                        SUBMIT
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Success Toast / Notification */}
            {showSuccess && (
                <div className="success-toast">
                    <div className="toast-content">
                        <Check size={20} className="toast-icon" />
                        <span>Enquiry Submitted! We'll call you shortly.</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyDetails;
