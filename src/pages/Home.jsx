import React, { useState, useEffect } from 'react';
import { Search, Calculator, Info, ArrowRight, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
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
    const [loanAmount, setLoanAmount] = useState(5000000);
    const [tenure, setTenure] = useState(20);
    const [interest, setInterest] = useState(8.5);
    const [monthlyEmi, setMonthlyEmi] = useState(0);

    // EMI Calculation logic
    useEffect(() => {
        const p = loanAmount;
        const r = interest / 12 / 100;
        const n = tenure * 12;
        const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        setMonthlyEmi(Math.round(emi));
    }, [loanAmount, tenure, interest]);

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
                <div className="layout-grid">
                    {/* Left Sidebar Sections */}
                    <div className="sidebar-section">
                        <div className="sidebar-card">
                            <h3><Info size={18} /> About Company</h3>
                            <p>
                                Nest Deal Realty is a premier real estate portal dedicated to providing luxury living solutions in Ahmedabad and Gandhinagar. With over 15 years of excellence, we specialize in high-end residential and commercial properties.
                            </p>
                            <a href="#" style={{ color: 'var(--accent)', fontSize: '0.85rem', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                Read More <ArrowRight size={14} />
                            </a>
                        </div>

                        <div className="sidebar-card">
                            <h3><Calculator size={18} /> EMI Calculator</h3>
                            <div className="emi-inputs">
                                <div className="input-group-home">
                                    <label>Amount (₹)</label>
                                    <input
                                        type="number"
                                        value={loanAmount}
                                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                                    />
                                </div>
                                <div className="input-group-home">
                                    <label>Tenure (Years)</label>
                                    <input
                                        type="number"
                                        value={tenure}
                                        onChange={(e) => setTenure(Number(e.target.value))}
                                    />
                                </div>
                                <div className="input-group-home">
                                    <label>Interest (%)</label>
                                    <input
                                        type="number"
                                        value={interest}
                                        step="0.1"
                                        onChange={(e) => setInterest(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                            <div className="emi-result">
                                <span className="emi-value">₹{monthlyEmi.toLocaleString()}</span>
                                <span className="emi-label">Estimated Monthly EMI</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="main-content-home">
                        <div className="top-prop-heading">
                            <h2>Top Properties in Ahmedabad / Gandhinagar</h2>
                        </div>

                        <div className="slideshow-container">
                            {slides.map((slide, idx) => (
                                <div key={idx} className={`slide-item ${idx === currentSlide ? 'active' : ''}`}>
                                    <img src={slide.image} alt={slide.title} />
                                    <div className="slide-overlay">
                                        <span className="developer-tag" style={{ background: 'var(--accent)', color: 'black', padding: '4px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>
                                            {slide.tag}
                                        </span>
                                        <h3>{slide.title}</h3>
                                        <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', color: 'var(--accent-orange)' }}>
                                            <MapPin size={18} /> Starting from {slide.price}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Filter Section */}
                <div className="filter-search-section">
                    <div className="filter-grid-home">
                        <div className="filter-item">
                            <label>Location</label>
                            <select>
                                <option>Ahmedabad</option>
                                <option>Gandhinagar</option>
                                <option>Shela</option>
                                <option>SG Highway</option>
                            </select>
                        </div>
                        <div className="filter-item">
                            <label>Property Type</label>
                            <select>
                                <option>Residential Flat</option>
                                <option>Luxury Villa</option>
                                <option>Commercial Office</option>
                                <option>Penthouse</option>
                            </select>
                        </div>
                        <div className="filter-item">
                            <label>Budget</label>
                            <select>
                                <option>₹50L - ₹80L</option>
                                <option>₹80L - ₹1.5Cr</option>
                                <option>₹1.5Cr - ₹3Cr</option>
                                <option>Above ₹3Cr</option>
                            </select>
                        </div>
                        <div className="filter-item">
                            <label>BHK</label>
                            <select>
                                <option>2 BHK</option>
                                <option>3 BHK</option>
                                <option>4 BHK</option>
                                <option>5+ BHK</option>
                            </select>
                        </div>
                        <button className="search-main-btn">
                            <Search size={20} />
                            Search Properties
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
