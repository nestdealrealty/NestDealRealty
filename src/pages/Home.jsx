import React, { useState, useEffect } from 'react';
import { Search, Calculator, Info, ArrowRight, MapPin, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Home.css';

const slides = [
    {
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
        title: "The Planet, Ahmedabad",
        price: "₹75L - 1.2Cr",
        tag: "Premium Flat"
    },
    {
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
        title: "Empire Skye, Gandhinagar",
        price: "₹1.5Cr - 3.2Cr",
        tag: "Luxury Villa"
    },
    {
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
        title: "Venus Group, Shela",
        price: "₹82L - 1.5Cr",
        tag: "3/4 BHK Flat"
    }
];

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [activeLocation, setActiveLocation] = useState('Ahmedabad');

    // Slideshow logic
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="homepage-wrapper">
            <div className="container">
                <div className="layout-grid-premium">

                    {/* The Curved Divider Background */}
                    <div className="curved-divider">
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0,0 L100,0 L100,100 Q60,100 40,0 L0,0 Z" fill="rgba(212, 175, 55, 0.03)" />
                        </svg>
                    </div>

                    {/* Sidebar Area */}
                    <div className="sidebar-area">
                        <div className="sidebar-card premium-hover">
                            <h3><Info size={18} /> About Company</h3>
                            <p>
                                Nest Deal Realty is a premier real estate portal dedicated to providing luxury living solutions in Ahmedabad and Gandhinagar. Our legacy stands on trust, transparency, and elite property consulting.
                            </p>
                            <Link to="/about" className="read-more-link">
                                Read More <ArrowRight size={14} />
                            </Link>
                        </div>

                        <div className="sidebar-card premium-hover emi-card-simple">
                            <h3><Calculator size={18} /> Financial Tools</h3>
                            <p>Plan your dream home with our advanced financial planning tools.</p>
                            <Link to="/emi-calculator" className="emi-button-large">
                                <Calculator size={20} />
                                <span>Calculate EMI Now</span>
                            </Link>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="main-content-area">
                        <div className="top-prop-label">
                            <h2>Top Properties in Ahmedabad / Gandhinagar</h2>
                        </div>

                        <div className="hero-slideshow-box">
                            {slides.map((slide, idx) => (
                                <div key={idx} className={`slide-item ${idx === currentSlide ? 'active' : ''}`}>
                                    <img src={slide.image} alt={slide.title} />
                                    <div className="slide-content-glass">
                                        <span className="slide-tag">{slide.tag}</span>
                                        <h3>{slide.title}</h3>
                                        <div className="slide-price-row">
                                            <MapPin size={16} />
                                            <span>Starting from {slide.price}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Search Bar Exactly Under Slideshow */}
                        <div className="integrated-search-bar">
                            <div className="search-row-top">
                                <div className="location-pills">
                                    <button
                                        className={`loc-pill ${activeLocation === 'Ahmedabad' ? 'active' : ''}`}
                                        onClick={() => setActiveLocation('Ahmedabad')}
                                    >
                                        AHMEDABAD
                                    </button>
                                    <button
                                        className={`loc-pill ${activeLocation === 'Gandhinagar' ? 'active' : ''}`}
                                        onClick={() => setActiveLocation('Gandhinagar')}
                                    >
                                        GANDHINAGAR
                                    </button>
                                </div>
                                <div className="search-divider"></div>
                                <div className="filter-group-main">
                                    <div className="filter-control">
                                        <label>BHK</label>
                                        <select>
                                            <option>2 BHK</option>
                                            <option>3 BHK</option>
                                            <option>4 BHK</option>
                                        </select>
                                    </div>
                                    <div className="filter-control">
                                        <label>BUDGET</label>
                                        <select>
                                            <option>₹50L - ₹80L</option>
                                            <option>₹80L - ₹1.5Cr</option>
                                            <option>Above ₹1.5Cr</option>
                                        </select>
                                    </div>
                                    <div className="filter-control">
                                        <label>FILTER</label>
                                        <div className="icon-select">
                                            <Filter size={16} />
                                            <span>More</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="big-search-btn">
                                    <Search size={22} />
                                    <span>SEARCH</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
