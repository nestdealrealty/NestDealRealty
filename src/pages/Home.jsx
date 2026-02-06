import React, { useState, useEffect } from 'react';
import { Search, Calculator, Info, ArrowRight, ChevronRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import './Home.css';

const slides = [
    {
        image: "https://images.unsplash.com/photo-1600596542815-22b845074a34?auto=format&fit=crop&w=1600&q=80",
        title: "The Planet, Ahmedabad",
        price: "₹75L - 1.2Cr",
        tag: "Premium Flat"
    },
    {
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
        title: "Empire Skye, Gandhinagar",
        price: "₹1.5Cr - 3.2Cr",
        tag: "Luxury Villa"
    },
    {
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
        title: "Venus Group, Shela",
        price: "₹82L - 1.5Cr",
        tag: "3/4 BHK Flat"
    }
];

const navStructure = [
    { title: 'Sell', items: ['Book a free valuation', 'Selling Guide', 'Sold prices'] },
    { title: 'Buy', items: ['New projects', 'Ready to move', 'Budget homes'] },
    { title: 'Rent', items: ['Flats', 'Villas', 'Commercial'] },
    { title: 'Help', items: ['Contact Support', 'FAQs', 'Legal'] }
];

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [activeLocation, setActiveLocation] = useState('Ahmedabad');
    const [openDropdown, setOpenDropdown] = useState(null);

    // Slideshow logic
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const toggleDropdown = (title) => {
        setOpenDropdown(openDropdown === title ? null : title);
    };

    return (
        <div className="homepage-wrapper-fullscreen">
            {/* Split Layout Container */}
            <div className="split-hero-container">

                {/* Left Side: Navigation & Tools (The "Green" Area) */}
                <div className="hero-left-sidebar">
                    <div className="sidebar-widgets-top">
                        <div className="widget-card about-widget">
                            <h3>About Us</h3>
                            <p>Premium real estate partners for Ahmedabad's elite.</p>
                            <Link to="/about" className="link-arrow">Read More <ArrowRight size={12} /></Link>
                        </div>

                        <div className="widget-card emi-widget shadow-glow">
                            <Link to="/emi-calculator" className="emi-side-btn">
                                <div className="icon-box"><Calculator size={20} /></div>
                                <div className="btn-text">
                                    <span>Financial Planning</span>
                                    <strong>Calculate EMI</strong>
                                </div>
                                <ChevronRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Side: Visuals (The Image Area) */}
                <div className="hero-right-visual">

                    {/* The Diagonal/Slanted Decoration */}
                    <div className="diagonal-overlay"></div>

                    {/* Slideshow */}
                    <div className="fullscreen-slideshow">
                        {slides.map((slide, idx) => (
                            <div key={idx} className={`hero-slide ${idx === currentSlide ? 'active' : ''}`}>
                                <img src={slide.image} alt={slide.title} />
                                <div className="slide-hero-text">
                                    <span className="hero-tag">{slide.tag}</span>
                                    <h2>{slide.title}</h2>
                                    <p>{slide.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Filter Bar - Located at Bottom of Right Side */}
                    <div className="hero-bottom-filter">
                        <div className="filter-glass-panel">
                            <div className="filter-locations">
                                <button
                                    className={activeLocation === 'Ahmedabad' ? 'active' : ''}
                                    onClick={() => setActiveLocation('Ahmedabad')}
                                >Ahmedabad</button>
                                <button
                                    className={activeLocation === 'Gandhinagar' ? 'active' : ''}
                                    onClick={() => setActiveLocation('Gandhinagar')}
                                >Gandhinagar</button>
                            </div>

                            <div className="filter-inputs-row">
                                <div className="input-wrap">
                                    <label>Type</label>
                                    <select><option>Buy</option><option>Rent</option></select>
                                </div>
                                <div className="input-wrap">
                                    <label>BHK</label>
                                    <select><option>3 BHK</option><option>4 BHK</option></select>
                                </div>
                                <div className="input-wrap">
                                    <label>Budget</label>
                                    <select><option>₹75L - ₹1.5Cr</option><option>₹1.5Cr+</option></select>
                                </div>
                                <button className="hero-search-btn">
                                    <Search size={20} />
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
