import React, { useState } from 'react';
import './Hero.css';
import { ArrowRight, MapPin, ChevronDown, SlidersHorizontal, ChevronLeft, Search } from 'lucide-react';

const Hero = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    return (
        <div className="hero">
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
                        <div className="search-section city-section">
                            <label>Select City</label>
                            <div className="dropdown-trigger">
                                Ahmedabad <ChevronDown size={14} />
                            </div>
                        </div>

                        <div className="divider"></div>

                        <div className="search-section input-section">
                            <label>Search By</label>
                            <input type="text" placeholder="Area/project/builder" />
                        </div>

                        <div className="divider"></div>

                        <div className="search-section bhk-section">
                            <label>Select BHK</label>
                            <div className="dropdown-trigger">
                                BHK <ChevronDown size={14} />
                            </div>
                        </div>

                        <div className="divider"></div>

                        <div className="search-section budget-section">
                            <label>Select Budget</label>
                            <div className="dropdown-trigger">
                                Budget <ChevronDown size={14} />
                            </div>
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
