import React, { useState, useEffect } from 'react';
import { Search, Calculator, Info, ArrowRight, ChevronRight, ChevronDown, Filter } from 'lucide-react';
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
    const [openDropdown, setOpenDropdown] = useState(null); // For header nav if needed, but we used it for sidebar before.

    // New States for Search Bar Interactivity
    const [activeSearchDropdown, setActiveSearchDropdown] = useState(null); // 'city', 'bhk', 'budget', 'filter'
    const [selectedBHK, setSelectedBHK] = useState([]);
    const [selectedBudget, setSelectedBudget] = useState('');

    const toggleSearchDropdown = (name) => {
        setActiveSearchDropdown(activeSearchDropdown === name ? null : name);
    };

    // Close dropdowns when clicking outside (simple implementation: overlay or background click)
    // For now, we rely on the toggle. 

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
                    {/* Filter Bar - Matches User Screenshot */}
                    {/* Filter Bar - Matches User Screenshot */}
                    <div className="hero-bottom-filter">
                        <div className="advanced-search-container">

                            {/* City Selection */}
                            <div className="search-field-group" onClick={() => toggleSearchDropdown('city')}>
                                <label>Select City</label>
                                <div className="field-control">
                                    <span>{activeLocation}</span>
                                    <ChevronDown size={14} className={activeSearchDropdown === 'city' ? 'rotate-180' : ''} />
                                </div>
                                {activeSearchDropdown === 'city' && (
                                    <div className="dropdown-menu-search city-dropdown" onClick={(e) => e.stopPropagation()}>
                                        <div className={`dd-item ${activeLocation === 'Ahmedabad' ? 'selected' : ''}`} onClick={() => { setActiveLocation('Ahmedabad'); toggleSearchDropdown(null); }}>Ahmedabad</div>
                                        <div className={`dd-item ${activeLocation === 'Gandhinagar' ? 'selected' : ''}`} onClick={() => { setActiveLocation('Gandhinagar'); toggleSearchDropdown(null); }}>Gandhinagar</div>
                                    </div>
                                )}
                            </div>

                            <div className="search-divider-v"></div>

                            {/* Text Search */}
                            <div className="search-field-group wide">
                                <label>Search By</label>
                                <input type="text" placeholder="Area / project / builder" />
                            </div>

                            <div className="search-divider-v"></div>

                            {/* BHK Selection */}
                            <div className="search-field-group" onClick={() => toggleSearchDropdown('bhk')}>
                                <label>Select BHK</label>
                                <div className="field-control">
                                    <span>{selectedBHK.length > 0 ? `${selectedBHK.join(', ')} BHK` : 'BHK'}</span>
                                    <ChevronDown size={14} className={activeSearchDropdown === 'bhk' ? 'rotate-180' : ''} />
                                </div>
                                {activeSearchDropdown === 'bhk' && (
                                    <div className="dropdown-menu-search bhk-dropdown" onClick={(e) => e.stopPropagation()}>
                                        {['1', '2', '3', '4', '5+'].map(bhk => (
                                            <label key={bhk} className="checkbox-item" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedBHK.includes(bhk)}
                                                    onChange={() => {
                                                        const newSel = selectedBHK.includes(bhk)
                                                            ? selectedBHK.filter(b => b !== bhk)
                                                            : [...selectedBHK, bhk];
                                                        setSelectedBHK(newSel);
                                                    }}
                                                />
                                                {bhk} BHK
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="search-divider-v"></div>

                            {/* Budget Selection */}
                            <div className="search-field-group" onClick={() => toggleSearchDropdown('budget')}>
                                <label>Select Budget</label>
                                <div className="field-control">
                                    <span>{selectedBudget || 'Budget'}</span>
                                    <ChevronDown size={14} className={activeSearchDropdown === 'budget' ? 'rotate-180' : ''} />
                                </div>
                                {activeSearchDropdown === 'budget' && (
                                    <div className="dropdown-menu-search budget-dropdown" onClick={(e) => e.stopPropagation()}>
                                        <div className="range-inputs">
                                            <input type="text" placeholder="Min" onClick={(e) => e.stopPropagation()} />
                                            <span>-</span>
                                            <input type="text" placeholder="Max" onClick={(e) => e.stopPropagation()} />
                                        </div>
                                        <div className="budget-suggestions">
                                            <div className="dd-item" onClick={() => { setSelectedBudget('Under 50L'); toggleSearchDropdown(null); }}>Under ₹50L</div>
                                            <div className="dd-item" onClick={() => { setSelectedBudget('50L - 1Cr'); toggleSearchDropdown(null); }}>₹50L - ₹1Cr</div>
                                            <div className="dd-item" onClick={() => { setSelectedBudget('1Cr - 2Cr'); toggleSearchDropdown(null); }}>₹1Cr - ₹2Cr</div>
                                            <div className="dd-item" onClick={() => { setSelectedBudget('2Cr+'); toggleSearchDropdown(null); }}>₹2Cr+</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="search-divider-v"></div>

                            {/* Actions */}
                            <div className="search-actions-group">
                                <button className="filter-text-btn" onClick={() => toggleSearchDropdown('filter')}>
                                    <Filter size={16} />
                                    <span>Filter</span>
                                </button>
                                {activeSearchDropdown === 'filter' && (
                                    <div className="dropdown-menu-search filter-dropdown-panel" onClick={(e) => e.stopPropagation()}>
                                        <h4>More Filters</h4>
                                        <div className="filter-section">
                                            <label>Possession Status</label>
                                            <div className="radio-group">
                                                <label><input type="radio" name="possession" /> Ready to Move</label>
                                                <label><input type="radio" name="possession" /> Under Construction</label>
                                            </div>
                                        </div>
                                        <button className="apply-btn" onClick={() => toggleSearchDropdown(null)}>Apply Filters</button>
                                    </div>
                                )}
                                <button className="search-submit-btn">
                                    Search
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
