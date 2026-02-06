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

    // Search States
    const [activeSearchDropdown, setActiveSearchDropdown] = useState(null); // 'city', 'bhk', 'budget', 'filter-modal'
    const [budgetOpen, setBudgetOpen] = useState(null); // 'min', 'max' inside the budget dropdown

    const [selectedBHK, setSelectedBHK] = useState([]);
    const [selectedBudget, setSelectedBudget] = useState({ min: '', max: '' });

    const toggleSearchDropdown = (name) => {
        if (name === activeSearchDropdown) {
            setActiveSearchDropdown(null);
        } else {
            setActiveSearchDropdown(name);
            setBudgetOpen(null); // Reset sub-dropdowns
        }
    };

    // Slideshow logic
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const priceOptions = ['₹ 20 Lac', '₹ 25 Lac', '₹ 30 Lac', '₹ 35 Lac', '₹ 40 Lac', '₹ 50 Lac', '₹ 75 Lac', '₹ 1 Cr', '₹ 1.5 Cr', '₹ 2 Cr+'];

    return (
        <div className="homepage-wrapper-fullscreen">
            {/* Split Hero */}
            <div className="split-hero-container">

                {/* Left Sidebar */}
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

                {/* Right Visuals */}
                <div className="hero-right-visual">
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

                </div>

                {/* Search Bar - Moved OUTSIDE hero-right-visual to sit on top of everything */}
                <div className="hero-bottom-filter">
                    <div className="advanced-search-container">
                        {/* City */}
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

                        {/* BHK */}
                        <div className="search-field-group" onClick={() => toggleSearchDropdown('bhk')}>
                            <label>Select BHK</label>
                            <div className="field-control">
                                <span>{selectedBHK.length > 0 ? `${selectedBHK.join(', ')} BHK` : 'BHK'}</span>
                                <ChevronDown size={14} className={activeSearchDropdown === 'bhk' ? 'rotate-180' : ''} />
                            </div>
                            {activeSearchDropdown === 'bhk' && (
                                <div className="dropdown-menu-search bhk-dropdown" onClick={(e) => e.stopPropagation()}>
                                    <div className="bhk-options-grid">
                                        {['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', '6 BHK', '7 BHK'].map(bhk => (
                                            <div
                                                key={bhk}
                                                className={`bhk-option-btn ${selectedBHK.includes(bhk) ? 'active' : ''}`}
                                                onClick={() => {
                                                    const newSel = selectedBHK.includes(bhk)
                                                        ? selectedBHK.filter(b => b !== bhk)
                                                        : [...selectedBHK, bhk];
                                                    setSelectedBHK(newSel);
                                                }}
                                            >
                                                {bhk}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bhk-footer" onClick={() => setSelectedBHK([])}>Clear All</div>
                                </div>
                            )}
                        </div>

                        <div className="search-divider-v"></div>

                        {/* Budget */}
                        <div className="search-field-group" onClick={() => toggleSearchDropdown('budget')}>
                            <label>Select Budget</label>
                            <div className="field-control">
                                <span>{selectedBudget.min || 'Min'} - {selectedBudget.max || 'Max'}</span>
                                <ChevronDown size={14} className={activeSearchDropdown === 'budget' ? 'rotate-180' : ''} />
                            </div>
                            {activeSearchDropdown === 'budget' && (
                                <div className="dropdown-menu-search budget-dropdown" onClick={(e) => e.stopPropagation()}>
                                    <div className="budget-range-wrapper">
                                        {/* Min Selector */}
                                        <div className="budget-select-box" onClick={() => setBudgetOpen(budgetOpen === 'min' ? null : 'min')}>
                                            <span>{selectedBudget.min || 'Min'}</span>
                                            <ChevronDown size={14} />
                                            {budgetOpen === 'min' && (
                                                <div className="price-dropdown-list">
                                                    {priceOptions.map(price => (
                                                        <div key={price} className="price-option" onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedBudget({ ...selectedBudget, min: price });
                                                            setBudgetOpen(null);
                                                        }}>{price}</div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <span>-</span>
                                        {/* Max Selector */}
                                        <div className="budget-select-box" onClick={() => setBudgetOpen(budgetOpen === 'max' ? null : 'max')}>
                                            <span>{selectedBudget.max || 'Max'}</span>
                                            <ChevronDown size={14} />
                                            {budgetOpen === 'max' && (
                                                <div className="price-dropdown-list">
                                                    {priceOptions.map(price => (
                                                        <div key={price} className="price-option" onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedBudget({ ...selectedBudget, max: price });
                                                            setBudgetOpen(null);
                                                        }}>{price}</div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="search-divider-v"></div>

                        {/* Actions */}
                        <div className="search-actions-group">
                            <button className="filter-text-btn" onClick={() => toggleSearchDropdown('filter-modal')}>
                                <Filter size={16} />
                                <span>Filter</span>
                            </button>
                            <button className="search-submit-btn">Search</button>
                        </div>
                    </div>
                    {/* Full Screen Filter Modal */}
                    {activeSearchDropdown === 'filter-modal' && (
                        <div className="filter-modal-overlay" onClick={() => toggleSearchDropdown(null)}>
                            <div className="filter-modal-container" onClick={(e) => e.stopPropagation()}>
                                <div className="filter-modal-header">
                                    <button onClick={() => toggleSearchDropdown(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><ChevronDown size={20} style={{ transform: 'rotate(90deg)' }} /></button>
                                    <h2>Filters</h2>
                                </div>
                                <div className="filter-modal-body">
                                    {/* City Tabs */}
                                    <div className="filter-section-modal">
                                        <h3>Search City</h3>
                                        <div className="modal-city-tabs">
                                            <button className={`modal-city-tab ${activeLocation === 'Ahmedabad' ? 'active' : ''}`} onClick={() => setActiveLocation('Ahmedabad')}>Ahmedabad</button>
                                            <button className={`modal-city-tab ${activeLocation === 'Gandhinagar' ? 'active' : ''}`} onClick={() => setActiveLocation('Gandhinagar')}>Gandhinagar</button>
                                        </div>
                                    </div>

                                    {/* Locality Search */}
                                    <div className="filter-section-modal">
                                        <h3>Search Locality / Project / Builder</h3>
                                        <div className="modal-search-input">
                                            <Search size={18} />
                                            <input type="text" placeholder="Search Locality / Project / Builder" />
                                        </div>
                                    </div>

                                    {/* Property Type */}
                                    <div className="filter-section-modal">
                                        <h3>Property Type <span className="clear-btn">Clear All</span></h3>
                                        <div className="chip-group">
                                            {['Flat', 'Duplex', 'Penthouse', 'Villa', 'Plot'].map(type => (
                                                <button key={type} className="chip-btn"><span>+</span> {type}</button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* BHK */}
                                    <div className="filter-section-modal">
                                        <h3>BHK <span className="clear-btn">Clear All</span></h3>
                                        <div className="chip-group">
                                            {['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', '6 BHK', '7 BHK'].map(bhk => (
                                                <button key={bhk} className="chip-btn"><span>+</span> {bhk}</button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Budget */}
                                    <div className="filter-section-modal">
                                        <h3>Budget <span className="clear-btn">Clear All</span></h3>
                                        <div className="budget-range-wrapper">
                                            <div className="budget-select-box"><span>Min</span> <ChevronDown size={14} /></div>
                                            <span>-</span>
                                            <div className="budget-select-box"><span>Max</span> <ChevronDown size={14} /></div>
                                        </div>
                                    </div>

                                    {/* Possession */}
                                    <div className="filter-section-modal">
                                        <h3>Possession <span className="clear-btn">Clear All</span></h3>
                                        <div className="chip-group">
                                            {['Ready to Move', 'Upto 1 Year', 'Upto 2 Years', '2+ Years'].map(p => (
                                                <button key={p} className="chip-btn"><span>+</span> {p}</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="filter-modal-footer">
                                    <button className="btn-clear">Clear All</button>
                                    <button className="btn-apply" onClick={() => toggleSearchDropdown(null)}>Apply</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            );
};

            export default Home;
