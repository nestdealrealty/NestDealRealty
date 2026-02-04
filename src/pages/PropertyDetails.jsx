import React, { useState } from 'react';
import {
    ChevronRight, Download, Share2, Heart, Check,
    MapPin, BedDouble, Bath, Car, Maximize, Home,
    ArrowRight
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
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        ]
    };

    return (
        <div className="property-page">
            {/* Sub Header / Breadcrumb */}
            <div className="sub-header">
                <div className="container">
                    <div className="breadcrumbs">
                        <span>Home</span> <ChevronRight size={14} />
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
                        <div className="gallery-main">
                            <img src={property.gallery[0]} alt="Main View" />
                        </div>
                        <div className="gallery-side">
                            <img src={property.gallery[1]} alt="Side View 1" />
                            <img src={property.gallery[2]} alt="Side View 2" />
                        </div>
                    </div>

                    {/* Title Section */}
                    <div className="title-section">
                        <div className="title-left">
                            <h1 className="prop-title">{property.title} <span className="verified-badge">✓</span></h1>
                            <p className="prop-location">{property.bhk} for sale in {property.location}</p>
                            <div className="developer-tag">Developed By: <strong>{property.developer}</strong></div>
                        </div>
                        <div className="title-right">
                            <div className="price-tag">
                                {property.price} <span className="info-icon">i</span>
                            </div>
                            <button className="outline-btn"><Download size={16} /> Brochure</button>
                        </div>
                    </div>

                    {/* Floor Plan Section */}
                    <div className="section-block floor-plan-container">
                        <h3>{property.title} Floor Plan</h3>
                        <div className="floor-plan-tabs">
                            <button className="active">3 BHK Flat</button>
                        </div>

                        <div className="floor-plan-card">
                            <div className="fp-image-box">
                                {/* Placeholder for floor plan drawing */}
                                <div className="fp-placeholder">
                                    <img src="https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&w=400&q=80" alt="Floor Plan" />
                                    <button className="view-fp-btn">View</button>
                                </div>
                            </div>
                            <div className="fp-details">
                                <div className="fp-price-row">
                                    <span className="fp-price">{property.price}</span>
                                    <span className="fp-rate">{property.price_sub}</span>
                                </div>
                                <div className="fp-specs">
                                    <span><BedDouble size={18} /> 3</span>
                                    <span><Bath size={18} /> 3</span>
                                    <span><Maximize size={18} /> 1</span>
                                    <span><Car size={18} /> 1</span>
                                </div>
                                <div className="fp-area">
                                    <Maximize size={16} /> {property.area} <span className="text-muted">Super Builtup Area</span>
                                </div>
                                <button className="enquire-now-btn">Enquire Now</button>
                            </div>
                        </div>
                    </div>

                    {/* Overview Section */}
                    <div className="section-block">
                        <h3>Overview</h3>
                        <div className="overview-stats">
                            <div className="stat-box">
                                <label>Tower</label>
                                <strong>(10) Tower A To J</strong>
                            </div>
                            <div className="stat-box">
                                <label>Bedroom</label>
                                <strong>3 BHK Flat</strong>
                            </div>
                            <div className="stat-box">
                                <label>Units on Floor</label>
                                <strong>4</strong>
                            </div>
                            <div className="stat-box">
                                <label>Lift</label>
                                <strong>2</strong>
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
                        <div className="location-map">
                            {/* Placeholder for Map */}
                            <div className="map-placeholder">
                                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Map Location" />
                                <div className="map-overlay">
                                    <MapPin className="pin-icon" size={32} />
                                    <span>{property.location}</span>
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

                        {/* RERA Section */}
                        <div className="section-block rera-block">
                            <h3>{property.title} RERA Details</h3>
                            <div className="rera-content">
                                <div className="qr-box">
                                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=RERA-DETAILS" alt="QR Code" />
                                    <span>Scan for Details</span>
                                </div>
                                <div className="rera-text">
                                    <p><strong>RERA-Id:</strong> PR/GJ/AHMEDABAD/DASKROI/Ahmedabad Municipal Corporation/MAA14625/311224/311230</p>
                                    <a href="#" className="rera-link">www.gujrera.gujarat.gov.in</a>
                                </div>
                            </div>
                        </div>

                        {/* Comparison Table Section */}
                        <div className="section-block">
                            <h3>Choose Similar</h3>
                            <div className="comparison-table">
                                {/* Header Row */}
                                <div className="comp-row header-row">
                                    <div className="comp-col label-col">Property Info</div>
                                    <div className="comp-col current-col">
                                        <div className="badge current">Current</div>
                                        <img src={property.gallery[0]} alt="Current" />
                                        <strong>{property.title}</strong>
                                        <span>{property.location}</span>
                                    </div>
                                    <div className="comp-col">
                                        <div className="badge rec">Recommended</div>
                                        <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Rec 1" />
                                        <strong>Sarathya West</strong>
                                        <span>Shela, Ahmedabad</span>
                                    </div>
                                    <div className="comp-col">
                                        <div className="badge rec">Recommended</div>
                                        <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Rec 2" />
                                        <strong>Shrimay Opulence</strong>
                                        <span>Shela, Ahmedabad</span>
                                    </div>
                                </div>
                                {/* Data Rows */}
                                <div className="comp-row">
                                    <div className="comp-col label-col">Price</div>
                                    <div className="comp-col"><strong>{property.price}</strong></div>
                                    <div className="comp-col">Price On Request</div>
                                    <div className="comp-col">Price On Request</div>
                                </div>
                                <div className="comp-row">
                                    <div className="comp-col label-col">Configuration</div>
                                    <div className="comp-col">3 BHK</div>
                                    <div className="comp-col">3 BHK</div>
                                    <div className="comp-col">3 BHK</div>
                                </div>
                                <div className="comp-row">
                                    <div className="comp-col label-col">Area</div>
                                    <div className="comp-col">{property.area}</div>
                                    <div className="comp-col">1760 Sq-ft</div>
                                    <div className="comp-col">1730 Sq-ft</div>
                                </div>
                                <div className="comp-row">
                                    <div className="comp-col label-col">Possession</div>
                                    <div className="comp-col">{property.possession}</div>
                                    <div className="comp-col">December 2026</div>
                                    <div className="comp-col">December 2024</div>
                                </div>
                            </div>
                        </div>

                        {/* Other Projects Section */}
                        <div className="section-block">
                            <h3>Other Projects By {property.developer}</h3>
                            <div className="other-projects-grid">
                                {[
                                    { name: "Venus Pashmina", loc: "Bodakdev, Ahmedabad", price: "Price on request", img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
                                    { name: "Venus Deshna", loc: "Naranpura, Ahmedabad", price: "starts from ₹1.30 Cr", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" }
                                ].map((proj, idx) => (
                                    <div className="project-card-small" key={idx}>
                                        <div className="pc-img">
                                            <img src={proj.img} alt={proj.name} />
                                            <div className="pc-actions">
                                                <button><Heart size={16} /></button>
                                            </div>
                                        </div>
                                        <div className="pc-info">
                                            <h4>{proj.name}</h4>
                                            <span className="pc-loc"><MapPin size={12} /> {proj.loc}</span>
                                            <div className="pc-price">{proj.price}</div>
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
                            <h2>SHELA ?</h2>
                        </div>
                        <form className="enquiry-form">
                            <input type="text" placeholder="Name" />
                            <input type="tel" placeholder="Mobile number" />
                            <input type="email" placeholder="Email Address" />

                            <div className="checkbox-group">
                                <input type="checkbox" id="consent" defaultChecked />
                                <label htmlFor="consent">I agree to be contacted by VitalSpace via WhatsApp, SMS, Phone, Email, etc.</label>
                            </div>

                            <button type="submit" className="submit-btn">Submit</button>

                            <div className="agent-info">
                                <div className="agent-avatar">👨‍💼</div>
                                <p>Rest assured, you'll receive a call from our sales expert within the next 5 minutes.</p>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PropertyDetails;
