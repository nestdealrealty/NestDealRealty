import React, { useState, useEffect } from 'react';
import './Hero.css';
import { ArrowRight, MapPin, ChevronDown, SlidersHorizontal, ChevronLeft, Search } from 'lucide-react';

const Hero = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const backgroundImages = [
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null); // 'city', 'bhk', 'budget'
    const [selectedCity, setSelectedCity] = useState('Ahmedabad');
    const [selectedBHK, setSelectedBHK] = useState([]);
    const [minBudget, setMinBudget] = useState('Min');
    const [maxBudget, setMaxBudget] = useState('Max');

    const toggleDropdown = (name) => {
        setActiveDropdown(activeDropdown === name ? null : name);
    };

    const budgetOptions = [
        '₹ 20 Lac', '₹ 25 Lac', '₹ 30 Lac', '₹ 35 Lac', '₹ 40 Lac', '₹ 45 Lac',
        '₹ 50 Lac', '₹ 60 Lac', '₹ 70 Lac', '₹ 80 Lac', '₹ 90 Lac', '₹ 1 Cr'
    ];

    const maxBudgetOptions = [
        '₹ 4.5 Cr', '₹ 5 Cr', '₹ 5.6 Cr', '₹ 6 Cr', '₹ 6.7 Cr', '₹ 7 Cr', '₹ 7.8 Cr', '₹ 8 Cr', '₹ 9 Cr', '₹ 10 Cr'
    ];

    const [openMin, setOpenMin] = useState(false);
    const [openMax, setOpenMax] = useState(false);

    return (
        <div className="hero">
            {backgroundImages.map((img, index) => (
                <div
                    key={index}
                    className={`hero-bg-slide ${index === currentImage ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${img})` }}
                />
            ))}
            <div className="hero-overlay"></div>
            <div className="container hero-container">
                <div className="hero-content">
                    <span className="hero-badge">Premium Real Estate Services</span>
                    <h1 className="hero-title">
                        Find Your Perfect Home <br />
                        <span>at the Best Price</span>
                    </h1>
                    <p className="hero-subtitle">
                        Discover a wide range of properties from luxury villas to budget-friendly apartments.
                        Your dream home is just one click away.
                    </p>

                    <div className="hero-search-bar">
                        {/* City Section */}
                        <div className="search-section city-section" onClick={() => toggleDropdown('city')}>
                            <label>Select City</label>
                            <div className="dropdown-trigger">
                                {selectedCity} <ChevronDown size={14} className={activeDropdown === 'city' ? 'rotate' : ''} />
                            </div>

                            {activeDropdown === 'city' && (
                                <div className="dropdown-menu city-menu">
                                    <div className="dropdown-option" onClick={() => setSelectedCity('Ahmedabad')}>Ahmedabad</div>
                                    <div className="dropdown-option" onClick={() => setSelectedCity('Gandhinagar')}>Gandhinagar</div>
                                </div>
                            )}
                        </div>

                        <div className="divider"></div>

                        <div className="search-section input-section">
                            <label>Search By</label>
                            <input type="text" placeholder="Area/project/builder" />
                        </div>

                        <div className="divider"></div>

                        {/* BHK Section */}
                        <div className="search-section bhk-section" onClick={() => toggleDropdown('bhk')}>
                            <label>Select BHK</label>
                            <div className="dropdown-trigger">
                                {selectedBHK.length > 0 ? selectedBHK.join(', ') : 'BHK'} <ChevronDown size={14} className={activeDropdown === 'bhk' ? 'rotate' : ''} />
                            </div>

                            {activeDropdown === 'bhk' && (
                                <div className="dropdown-menu bhk-menu" onClick={(e) => e.stopPropagation()}>
                                    <div className="bhk-grid">
                                        {[1, 2, 3, 4, 5, 6, 7].map(num => (
                                            <div
                                                key={num}
                                                className={`bhk-option ${selectedBHK.includes(`${num} BHK`) ? 'active' : ''}`}
                                                onClick={() => {
                                                    const val = `${num} BHK`;
                                                    setSelectedBHK(prev =>
                                                        prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val]
                                                    );
                                                }}
                                            >
                                                {num} BHK
                                            </div>
                                        ))}
                                    </div>
                                    <div className="dropdown-footer">
                                        <button className="clear-btn" onClick={() => setSelectedBHK([])}>Clear All</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="divider"></div>

                        {/* Budget Section */}
                        <div className="search-section budget-section" onClick={() => toggleDropdown('budget')}>
                            <label>Select Budget</label>
                            <div className="dropdown-trigger">
                                {minBudget !== 'Min' || maxBudget !== 'Max' ? `${minBudget} - ${maxBudget}` : 'Budget'}
                                <ChevronDown size={14} className={activeDropdown === 'budget' ? 'rotate' : ''} />
                            </div>

                            {activeDropdown === 'budget' && (
                                <div className="dropdown-menu budget-menu" onClick={(e) => e.stopPropagation()}>
                                    <div className="budget-selection-top">
                                        <div className="budget-box">
                                            <div className="budget-value" onClick={() => { setOpenMin(!openMin); setOpenMax(false); }}>
                                                {minBudget} <ChevronDown size={14} />
                                            </div>
                                            {openMin && (
                                                <div className="budget-list">
                                                    <div className="opt" onClick={() => { setMinBudget('Min'); setOpenMin(false); }}>Min</div>
                                                    {budgetOptions.map(opt => (
                                                        <div key={opt} className="opt" onClick={() => { setMinBudget(opt); setOpenMin(false); }}>{opt}</div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <span className="dash">-</span>
                                        <div className="budget-box">
                                            <div className="budget-value" onClick={() => { setOpenMax(!openMax); setOpenMin(false); }}>
                                                {maxBudget} <ChevronDown size={14} />
                                            </div>
                                            {openMax && (
                                                <div className="budget-list">
                                                    <div className="opt" onClick={() => { setMaxBudget('Max'); setOpenMax(false); }}>Max</div>
                                                    {maxBudgetOptions.map(opt => (
                                                        <div key={opt} className="opt" onClick={() => { setMaxBudget(opt); setOpenMax(false); }}>{opt}</div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="dropdown-footer">
                                        <button className="clear-btn" onClick={() => { setMinBudget('Min'); setMaxBudget('Max'); setOpenMin(false); setOpenMax(false); }}>Clear All</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="divider"></div>

                        <div className="filter-trigger" onClick={() => setIsFilterOpen(true)}>
                            <SlidersHorizontal size={20} />
                            <span>Filter</span>
                        </div>

                        <button className="hero-search-btn">
                            Search
                        </button>
                    </div>

                    <div className="hero-stats">
                        <div className="stat-item">
                            <strong>12k+</strong>
                            <span>Properties</span>
                        </div>
                        <div className="stat-item">
                            <strong>500+</strong>
                            <span>Builders</span>
                        </div>
                        <div className="stat-item">
                            <strong>25k+</strong>
                            <span>Customers</span>
                        </div>
                    </div>
                </div>
            </div>

            {isFilterOpen && (
                <div className="filter-modal-overlay">
                    <div className="filter-modal">
                        <div className="modal-header">
                            <button className="back-btn" onClick={() => setIsFilterOpen(false)}>
                                <ChevronLeft size={24} />
                            </button>
                            <h2>Filters</h2>
                        </div>

                        <div className="modal-content">
                            <div className="filter-group">
                                <h3>Search City</h3>
                                <div className="pills">
                                    <span className="pill active">Ahmedabad</span>
                                    <span className="pill">Gandhinagar</span>
                                </div>
                            </div>

                            <div className="filter-group">
                                <h3>Search Locality / Project / Builder</h3>
                                <div className="modal-search-input">
                                    <Search size={20} />
                                    <input type="text" placeholder="Search Locality / Project / Builder" />
                                </div>
                            </div>

                            <div className="filter-group">
                                <div className="group-header">
                                    <h3>Property Type</h3>
                                    <span className="clear-link">Clear All</span>
                                </div>
                                <div className="pills plus-pills">
                                    <span className="pill"><span>+</span> Flat</span>
                                    <span className="pill"><span>+</span> Duplex</span>
                                    <span className="pill"><span>+</span> Penthouse</span>
                                </div>
                            </div>

                            <div className="filter-group">
                                <div className="group-header">
                                    <h3>BHK</h3>
                                    <span className="clear-link">Clear All</span>
                                </div>
                                <div className="pills plus-pills bhk-pills">
                                    {['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', '6 BHK', '7 BHK'].map(bhk => (
                                        <span key={bhk} className="pill"><span>+</span> {bhk}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="filter-group">
                                <div className="group-header">
                                    <h3>Budget</h3>
                                    <span className="clear-link">Clear All</span>
                                </div>
                                <div className="budget-selectors">
                                    <div className="budget-dropdown">
                                        <span>Min</span>
                                        <ChevronDown size={14} />
                                    </div>
                                    <span className="separator">-</span>
                                    <div className="budget-dropdown">
                                        <span>Max</span>
                                        <ChevronDown size={14} />
                                    </div>
                                </div>
                            </div>

                            <div className="filter-group">
                                <div className="group-header">
                                    <h3>Possession</h3>
                                    <span className="clear-link">Clear All</span>
                                </div>
                                <div className="pills plus-pills">
                                    <span className="pill"><span>+</span> Ready to Move</span>
                                    <span className="pill"><span>+</span> Upto 1 Year</span>
                                    <span className="pill"><span>+</span> Upto 2 Years</span>
                                    <span className="pill"><span>+</span> 2+ Years</span>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="clear-all-btn">Clear All</button>
                            <button className="apply-btn" onClick={() => setIsFilterOpen(false)}>Apply</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Hero;
