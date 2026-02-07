import React, { useState, useEffect } from 'react';
import { Search, Calculator, Info, ArrowRight, ChevronRight, ChevronDown, Filter, Tag, Key, Briefcase, Star } from 'lucide-react';
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

    const exploreCategories = [
        {
            id: 'flats',
            title: 'Flats',
            items: [
                { id: 1, image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80', listingTitle: 'Trident Experia', builder: 'A. Shridhar', config: '3 BHK Flat', location: 'Vaishnodevi, Ahmedabad', price: '₹ 76.00 L' },
                { id: 2, image: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=400&q=80', listingTitle: 'Sky City', builder: 'Goyal & Co', config: '4 BHK Flat', location: 'Shela, Ahmedabad', price: '₹ 1.25 Cr' },
                { id: 3, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80', listingTitle: 'The Metallis', builder: 'Daanish Info', config: '3 BHK Flat', location: 'S.G Highway', price: '₹ 95.00 L' },
                { id: 4, image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=400&q=80', listingTitle: 'Orchid Legacy', builder: 'Goyal & Co', config: '3 BHK Flat', location: 'Applewoods, SP Ring Rd', price: '₹ 88.50 L' },
                { id: 5, image: 'https://images.unsplash.com/photo-1502005229762-cf1afd38088d?auto=format&fit=crop&w=400&q=80', listingTitle: 'Shivalik Sharda', builder: 'Shivalik Group', config: '4 BHK Flat', location: 'Ambawadi', price: '₹ 2.40 Cr' },
            ]
        },
        {
            id: 'bungalows',
            title: 'Bungalows',
            items: [
                { id: 1, image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&w=400&q=80', listingTitle: 'Adani Shantigram', builder: 'Adani Realty', config: '4 BHK Villa', location: 'S.G Highway', price: '₹ 3.50 Cr' },
                { id: 2, image: 'https://images.unsplash.com/photo-1600596542815-22b845074a34?auto=format&fit=crop&w=400&q=80', listingTitle: 'Arvind Uplands', builder: 'Arvind SmartSpaces', config: '5 BHK Villa', location: 'Rancharda', price: '₹ 5.20 Cr' },
                { id: 3, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80', listingTitle: 'Gulmohar Greens', builder: 'Gulmohar', config: '3 BHK Villa', location: 'Sanand Road', price: '₹ 2.10 Cr' },
                { id: 4, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80', listingTitle: 'Bakeri Serenity', builder: 'Bakeri Group', config: '3 BHK Bungalow', location: 'Vejalpur', price: '₹ 2.75 Cr' },
            ]
        },
        {
            id: 'commercial',
            title: 'Commercial',
            items: [
                { id: 1, image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80', listingTitle: 'Mondeal Heights', builder: 'HN Safal', config: 'Office Space', location: 'S.G Highway', price: '₹ 65.00 L' },
                { id: 2, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80', listingTitle: 'Westgate', builder: 'True Value', config: 'Corporate Office', location: 'S.G Highway', price: '₹ 1.10 Cr' },
                { id: 3, image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=400&q=80', listingTitle: 'Titanium City', builder: 'Goyal & Co', config: 'Shop / Showroom', location: 'Prahladnagar', price: '₹ 2.50 Cr' },
                { id: 4, image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=400&q=80', listingTitle: 'Privilon', builder: 'Safal', config: 'Retail Space', location: 'Iscon Cross Rd', price: '₹ 1.80 Cr' },
            ]
        },
        {
            id: 'plots',
            title: 'Plots',
            items: [
                { id: 1, image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80', listingTitle: 'Glade One', builder: 'Arvind', config: 'Golf Plot', location: 'Sanand', price: '₹ 1.50 Cr' },
                { id: 2, image: 'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?auto=format&fit=crop&w=400&q=80', listingTitle: 'Kensville Golf', builder: 'Savvy', config: 'Residenital Plot', location: 'Bavla Rd', price: '₹ 85.00 L' },
                { id: 3, image: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=400&q=80', listingTitle: 'Forest Hills', builder: 'Ganesh Housing', config: 'Farm Plot', location: 'Thol', price: '₹ 2.25 Cr' },
                { id: 4, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80', listingTitle: 'Suramya Abode', builder: 'Synthite', config: 'Weekend Home Plot', location: 'Rancharda', price: '₹ 3.00 Cr' },
            ]
        },
    ];

    const exploreGandhinagarCategories = [
        {
            id: 'flats-gandhinagar',
            title: 'Flats',
            items: [
                { id: 1, image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80', listingTitle: 'Gift City Heights', builder: 'Gift Group', config: '3 BHK Flat', location: 'Gift City, Gandhinagar', price: '₹ 85.00 L' },
                { id: 2, image: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=400&q=80', listingTitle: 'Sargasan Elite', builder: 'Sargasan Builders', config: '2 BHK Flat', location: 'Sargasan, Gandhinagar', price: '₹ 55.00 L' },
                { id: 3, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80', listingTitle: 'Raysan Pride', builder: 'Raysan Developers', config: '4 BHK Flat', location: 'Raysan, Gandhinagar', price: '₹ 1.10 Cr' },
                { id: 4, image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=400&q=80', listingTitle: 'Kudasan Residency', builder: 'Kudasan Group', config: '3 BHK Flat', location: 'Kudasan, Gandhinagar', price: '₹ 72.00 L' },
            ]
        },
        {
            id: 'bungalows-gandhinagar',
            title: 'Bungalows',
            items: [
                { id: 1, image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&w=400&q=80', listingTitle: 'Infocity Villas', builder: 'Infocity Group', config: '4 BHK Villa', location: 'Infocity, Gandhinagar', price: '₹ 2.50 Cr' },
                { id: 2, image: 'https://images.unsplash.com/photo-1600596542815-22b845074a34?auto=format&fit=crop&w=400&q=80', listingTitle: 'Pethapur Bungalows', builder: 'Pethapur Estates', config: '3 BHK Bungalow', location: 'Pethapur, Gandhinagar', price: '₹ 1.80 Cr' },
                { id: 3, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80', listingTitle: 'Swagat Flamingo', builder: 'Swagat Group', config: '5 BHK Villa', location: 'Sargasan', price: '₹ 3.20 Cr' },
            ]
        },
        {
            id: 'commercial-gandhinagar',
            title: 'Commercial',
            items: [
                { id: 1, image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80', listingTitle: 'Gift One Tower', builder: 'Gift City', config: 'Office Space', location: 'Gift City', price: '₹ 95.00 L' },
                { id: 2, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80', listingTitle: 'Reliance Circle Hub', builder: 'Reliance', config: 'Showroom', location: 'Reliance Circle', price: '₹ 2.50 Cr' },
                { id: 3, image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=400&q=80', listingTitle: 'Sector 11 Complex', builder: 'Govt Approved', config: 'Shop', location: 'Sector 11', price: '₹ 45.00 L' },
            ]
        },
        {
            id: 'plots-gandhinagar',
            title: 'Plots',
            items: [
                { id: 1, image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80', listingTitle: 'Vavol Plots', builder: 'Vavol Land', config: 'Residential Plot', location: 'Vavol', price: '₹ 60.00 L' },
                { id: 2, image: 'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?auto=format&fit=crop&w=400&q=80', listingTitle: 'Chiloda Green', builder: 'Chiloda Developers', config: 'Farm Plot', location: 'Chiloda', price: '₹ 1.20 Cr' },
                { id: 3, image: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=400&q=80', listingTitle: 'Randesan Plots', builder: 'Randesan Group', config: 'Investment Plot', location: 'Randesan', price: '₹ 90.00 L' },
            ]
        },
    ];

    return (
        <div className="home-page-root">
            <div className="homepage-wrapper-fullscreen">
                {/* Split Hero */}
                <div className="split-hero-container">

                    {/* Left Sidebar */}
                    <div className="hero-left-sidebar">
                        <div className="sidebar-widgets-top">
                            <div className="widget-card valuation-widget">
                                <h3>Get the best price for your property</h3>
                                <p className="rating-text">Rated Excellent with over 44,000 reviews</p>
                                <div className="trust-badges">
                                    <div className="trust-item"><Star size={16} fill="#00b67a" stroke="none" /> <span>Trustpilot</span></div>
                                </div>
                                <button className="book-valuation-btn">Book a free valuation</button>
                                <p className="online-val-link">Or start with an <a href="#">online valuation</a></p>
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

            {/* Explore Ahmedabad Section */}
            <div className="explore-ahmedabad-section">
                <div className="explore-header-container">
                    <h2>Explore Ahmedabad</h2>
                    <div className="header-divider"></div>
                </div>

                <div className="explore-grid">
                    {exploreCategories.map((category) => (
                        <div key={category.id} className="explore-column">
                            <div className="column-header">
                                <h3>{category.title}</h3>
                            </div>
                            <div className="reel-container">
                                {category.items.map((item) => (
                                    <div key={item.id} className="property-card-reel">
                                        <div className="card-reel-image">
                                            <img src={item.image} alt={item.listingTitle} loading="lazy" />
                                        </div>
                                        <div className="card-reel-details">
                                            <h4 className="reel-prop-title">{item.listingTitle}</h4>
                                            <span className="reel-prop-builder">{item.builder}</span>
                                            <div className="reel-prop-specs">
                                                <span>{item.config}</span>
                                                <span className="dot">•</span>
                                                <span>{item.location}</span>
                                            </div>
                                            <div className="reel-prop-price">{item.price}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="column-footer">
                                <button className="see-all-btn">See All</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Explore Gandhinagar Section */}
            <div className="explore-ahmedabad-section">
                <div className="explore-header-container">
                    <h2>Explore Gandhinagar</h2>
                    <div className="header-divider"></div>
                </div>

                <div className="explore-grid">
                    {exploreGandhinagarCategories.map((category) => (
                        <div key={category.id} className="explore-column">
                            <div className="column-header">
                                <h3>{category.title}</h3>
                            </div>
                            <div className="reel-container">
                                {category.items.map((item) => (
                                    <div key={item.id} className="property-card-reel">
                                        <div className="card-reel-image">
                                            <img src={item.image} alt={item.listingTitle} loading="lazy" />
                                        </div>
                                        <div className="card-reel-details">
                                            <h4 className="reel-prop-title">{item.listingTitle}</h4>
                                            <span className="reel-prop-builder">{item.builder}</span>
                                            <div className="reel-prop-specs">
                                                <span>{item.config}</span>
                                                <span className="dot">•</span>
                                                <span>{item.location}</span>
                                            </div>
                                            <div className="reel-prop-price">{item.price}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="column-footer">
                                <button className="see-all-btn">See All</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Help Section */}
            <div className="help-section-container">
                <div className="help-header">
                    <h2>How Nest Deal Realty can help you</h2>
                    <p>We offer a comprehensive service with thousands of local property experts.</p>
                </div>

                <div className="help-grid">
                    {/* Buying */}
                    <div className="help-card">
                        <div className="help-icon"><Search size={32} /></div>
                        <h3>Buying</h3>
                        <p>Looking to buy? Nest Deal has thousands of properties for sale and will help find you your new home.</p>
                        <button className="help-btn">Property search</button>
                    </div>

                    {/* Selling */}
                    <div className="help-card">
                        <div className="help-icon"><Tag size={32} /></div>
                        <h3>Selling</h3>
                        <p>If you're thinking of selling soon or just curious about what your home might be worth.</p>
                        <button className="help-btn">Selling your home</button>
                    </div>

                    {/* Renting */}
                    <div className="help-card">
                        <div className="help-icon"><Key size={32} /></div>
                        <h3>Renting</h3>
                        <p>We have rental properties nationwide, with a wealth of experience in finding tenants their perfect home.</p>
                        <button className="help-btn">Rental properties</button>
                    </div>

                    {/* Landlords */}
                    <div className="help-card">
                        <div className="help-icon"><Briefcase size={32} /></div>
                        <h3>Landlords</h3>
                        <p>As a letting agent, we understand your rental needs and will work with you to get the best result.</p>
                        <button className="help-btn">Letting your property</button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Home;
