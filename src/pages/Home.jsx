import React, { useState, useEffect, useRef } from 'react';
import { Search, Calculator, Info, ArrowRight, ChevronRight, ChevronDown, Filter, Tag, Key, Briefcase, Star, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import ValuationModal from '../components/ValuationModal';
import logo from '../assets/logo.jpg';
import './Home.css';

const defaultSlides = [
    {
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1920",
        title: "The Planet, Ahmedabad",
        price: "₹75L - 1.2Cr",
        tag: "Premium Flat"
    },
    {
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1920",
        title: "Empire Skye, Gandhinagar",
        price: "₹1.5Cr - 3.2Cr",
        tag: "Luxury Villa"
    },
    {
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1920",
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

import { supabase } from '../supabase';

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [activeLocation, setActiveLocation] = useState('Ahmedabad');
    const [isValuationOpen, setIsValuationOpen] = useState(false);
    const [realProperties, setRealProperties] = useState([]);
    const [realProjects, setRealProjects] = useState([]);
    const [homeSlides, setHomeSlides] = useState(defaultSlides);

    // Search States
    const [activeSearchDropdown, setActiveSearchDropdown] = useState(null); // 'city', 'bhk', 'budget', 'filter-modal'
    const [budgetOpen, setBudgetOpen] = useState(null); // 'min', 'max' inside the budget dropdown

    const [selectedBHK, setSelectedBHK] = useState([]);
    const [showFinancialOptions, setShowFinancialOptions] = useState(false);

    // New Layout State
    const [activeAhdProjectTab, setActiveAhdProjectTab] = useState('flats');
    const [activeAhdOwnerTab, setActiveAhdOwnerTab] = useState('flats');
    const [activeGnrProjectTab, setActiveGnrProjectTab] = useState('flats');
    const [activeGnrOwnerTab, setActiveGnrOwnerTab] = useState('flats');
    const slideshowRef = useRef(null);
    const [selectedBudget, setSelectedBudget] = useState({ min: '', max: '' });

    // Fetch real properties and slides from Supabase
    useEffect(() => {
        const fetchData = async () => {
            // Fetch Properties
            const { data: propsData, error: propsError } = await supabase
                .from('properties')
                .select('*')
                .eq('status', 'approved')
                .order('created_at', { ascending: false })
                .limit(10);

            if (propsData && !propsError) {
                setRealProperties(propsData.map(p => ({
                    id: p.id,
                    image: (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80',
                    listingTitle: p.project_name || `Property in ${p.locality}`,
                    builder: p.contact_name || 'Individual Seller',
                    config: p.bhk || p.property_type,
                    location: p.locality,
                    city: p.city,
                    type: p.property_type?.toLowerCase(),
                    price: `₹ ${p.cost?.toLocaleString('en-IN')}`,
                    isReal: true
                })));
            }

            // Fetch Projects
            const { data: projectsData, error: projError } = await supabase
                .from('projects')
                .select('*')
                .eq('status', 'approved')
                .order('created_at', { ascending: false });

            if (projectsData && !projError) {
                setRealProjects(projectsData.map(p => ({
                    id: p.id,
                    image: p.images?.[0]?.url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
                    listingTitle: p.name,
                    builder: p.developer,
                    location: p.locality,
                    city: p.city,
                    type: p.property_type?.toLowerCase(),
                    price: p.configurations?.[0]?.price || 'Call for Price',
                    isProject: true
                })));
            }

            // Fetch Slides
            const { data: slidesData, error: slidesError } = await supabase
                .from('home_slides')
                .select('*')
                .order('created_at', { ascending: false });

            if (slidesData && slidesData.length >= 2 && !slidesError) {
                setHomeSlides(slidesData.map(s => ({
                    image: s.image_url,
                    title: s.title,
                    price: s.price,
                    tag: s.tag
                })));
            }
        };
        fetchData();
    }, []);

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
        if (homeSlides.length === 0) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => {
                const next = (prev + 1) % homeSlides.length;
                console.log('Slide transition:', prev, '->', next);
                return next;
            });
        }, 4000);
        return () => {
            console.log('Slideshow cleanup');
            clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        if (realProjects.length > 0) {
            console.log("🏠 Approved Projects found:", realProjects.length);
        }
    }, [realProjects]);

    const getProjectsForTab = (tab, city) => {
        return realProjects.filter(p => {
            const matchesCity = city ? p.city?.toLowerCase().includes(city.toLowerCase()) : true;
            if (tab === 'flats') return matchesCity && (p.type?.includes('flat') || !p.type);
            if (tab === 'bungalows') return matchesCity && (p.type?.includes('bung') || p.type?.includes('vil'));
            if (tab === 'commercial') return matchesCity && p.type?.includes('comm');
            if (tab === 'plots') return matchesCity && p.type?.includes('plot');
            return matchesCity;
        });
    };

    const getPropertiesForTab = (tab, city) => {
        return realProperties.filter(p => {
            const matchesCity = city ? p.city?.toLowerCase().includes(city.toLowerCase()) : true;
            if (tab === 'flats') return matchesCity && p.type?.includes('flat');
            if (tab === 'bungalows') return matchesCity && (p.type?.includes('bung') || p.type?.includes('vil'));
            if (tab === 'commercial') return matchesCity && p.type?.includes('comm');
            if (tab === 'plots') return matchesCity && p.type?.includes('plot');
            return matchesCity;
        });
    };

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
                                <button className="book-valuation-btn" onClick={() => setIsValuationOpen(true)}>Book a free valuation</button>
                                <p className="online-val-link">Or start with an <a href="#">online valuation</a></p>
                            </div>

                            <div className="widget-card emi-widget shadow-glow">
                                <div
                                    className="emi-side-btn"
                                    onClick={() => setShowFinancialOptions(!showFinancialOptions)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="icon-box"><Calculator size={20} /></div>
                                    <div className="btn-text">
                                        <strong>FINANCIAL PLANNING CALCULATOR</strong>
                                    </div>
                                    <ChevronRight size={16} className={`transition-transform ${showFinancialOptions ? 'rotate-90' : ''}`} />
                                </div>

                                {showFinancialOptions && (
                                    <div className="financial-options-list">
                                        <Link to="/emi-calculator" className="fin-option">EMI Calculator</Link>
                                        <Link to="/emi-calculator?mode=eligibility" className="fin-option">Eligibility Calculator</Link>
                                        <Link to="/emi-calculator?mode=affordability" className="fin-option">Affordability Calculator</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Visuals */}
                    <div className="hero-right-visual">
                        <div className="diagonal-overlay"></div>

                        {/* Slideshow */}
                        <div className="fullscreen-slideshow">
                            {homeSlides.map((slide, idx) => (
                                <div
                                    key={idx}
                                    className={`hero-slide ${idx === currentSlide ? 'active' : ''}`}
                                    data-slide-index={idx}
                                    data-is-active={idx === currentSlide}
                                >
                                    <img src={slide.image} alt={slide.title} loading={idx === 0 ? "eager" : "lazy"} />
                                    <div className="slide-hero-text">
                                        <span className="hero-tag">{slide.tag}</span>
                                        <h2>{slide.title}</h2>
                                        <p>{slide.price}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Navigation Dots */}
                            <div className="slide-indicators">
                                {homeSlides.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`indicator ${index === currentSlide ? 'active' : ''}`}
                                        onClick={() => setCurrentSlide(index)}
                                    ></button>
                                ))}
                            </div>
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

            {/* NEW PROPERTY LISTING SECTION */}

            {/* Explore Ahmedabad Section */}
            <div className="explore-ahmedabad-section">
                <div className="explore-header-container" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Link to="/explore?city=Ahmedabad" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h2 style={{ margin: 0, color: '#E3BC5A' }}>Explore Ahmedabad</h2>
                        <ChevronRight size={28} color="#E3BC5A" />
                    </Link>
                </div>

                <div className="new-prop-listing-container">
                    {/* LEFT CONTAINER: Popular Projects (Ahmedabad) */}
                    <div className="prop-listing-column left-projects">
                        <h2 className="new-col-header">Popular Projects</h2>

                        <div className="prop-tabs">
                            {['Flats', 'Bungalows', 'Commercial', 'Plots'].map((tab) => (
                                <button
                                    key={tab}
                                    className={`prop-tab-btn ${activeAhdProjectTab === tab.toLowerCase() ? 'active' : ''}`}
                                    onClick={() => setActiveAhdProjectTab(tab.toLowerCase())}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="prop-grid-2x2">
                            {getProjectsForTab(activeAhdProjectTab, 'Ahmedabad').slice(0, 4).map((item) => (
                                <Link to={`/project/${item.id}`} key={item.id} className="new-prop-card">
                                    <div className="new-prop-img-box">
                                        <img src={item.image} alt={item.listingTitle} loading="lazy" />
                                    </div>
                                    <div className="new-prop-details">
                                        <h4 className="new-prop-title">{item.listingTitle}</h4>
                                        <p className="new-prop-loc">{item.location}</p>
                                        <p className="new-prop-price">{item.price}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <Link to="/explore?city=Ahmedabad" className="new-see-all-btn">See All</Link>
                    </div>

                    {/* RIGHT CONTAINER: Popular Owner Property (Ahmedabad) */}
                    <div className="prop-listing-column right-owners">
                        <h2 className="new-col-header">Popular Owner Property</h2>

                        <div className="prop-tabs">
                            {['Flats', 'Bungalows', 'Commercial', 'Plots'].map((tab) => (
                                <button
                                    key={tab}
                                    className={`prop-tab-btn ${activeAhdOwnerTab === tab.toLowerCase() ? 'active' : ''}`}
                                    onClick={() => setActiveAhdOwnerTab(tab.toLowerCase())}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="prop-grid-2x2">
                            {getPropertiesForTab(activeAhdOwnerTab, 'Ahmedabad').slice(0, 4).map((item) => (
                                <Link to={`/property/${item.id}`} key={item.id} className="new-prop-card">
                                    <div className="new-prop-img-box">
                                        <img src={item.image} alt={item.listingTitle} loading="lazy" />
                                    </div>
                                    <div className="new-prop-details">
                                        <h4 className="new-prop-title">{item.listingTitle}</h4>
                                        <p className="new-prop-loc">{item.location}</p>
                                        <p className="new-prop-price">{item.price}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <Link to="/explore?city=Ahmedabad" className="new-see-all-btn">See All</Link>
                    </div>
                </div>
            </div>

            {/* Explore Gandhinagar Section */}
            <div className="explore-gandhinagar-section" style={{ marginTop: '60px' }}>
                <div className="explore-header-container" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Link to="/explore?city=Gandhinagar" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h2 style={{ margin: 0, color: '#E3BC5A' }}>Explore Gandhinagar</h2>
                        <ChevronRight size={28} color="#E3BC5A" />
                    </Link>
                </div>

                <div className="new-prop-listing-container">
                    {/* LEFT CONTAINER: Popular Projects (Gandhinagar) */}
                    <div className="prop-listing-column left-projects">
                        <h2 className="new-col-header">Popular Projects</h2>

                        <div className="prop-tabs">
                            {['Flats', 'Bungalows', 'Commercial', 'Plots'].map((tab) => (
                                <button
                                    key={tab}
                                    className={`prop-tab-btn ${activeGnrProjectTab === tab.toLowerCase() ? 'active' : ''}`}
                                    onClick={() => setActiveGnrProjectTab(tab.toLowerCase())}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="prop-grid-2x2">
                            {getProjectsForTab(activeGnrProjectTab, 'Gandhinagar').slice(0, 4).map((item) => (
                                <Link to={`/project/${item.id}`} key={item.id} className="new-prop-card">
                                    <div className="new-prop-img-box">
                                        <img src={item.image} alt={item.listingTitle} loading="lazy" />
                                    </div>
                                    <div className="new-prop-details">
                                        <h4 className="new-prop-title">{item.listingTitle}</h4>
                                        <p className="new-prop-loc">{item.location}</p>
                                        <p className="new-prop-price">{item.price}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <Link to="/explore?city=Gandhinagar" className="new-see-all-btn">See All</Link>
                    </div>

                    {/* RIGHT CONTAINER: Popular Owner Property (Gandhinagar) */}
                    <div className="prop-listing-column right-owners">
                        <h2 className="new-col-header">Popular Owner Property</h2>

                        <div className="prop-tabs">
                            {['Flats', 'Bungalows', 'Commercial', 'Plots'].map((tab) => (
                                <button
                                    key={tab}
                                    className={`prop-tab-btn ${activeGnrOwnerTab === tab.toLowerCase() ? 'active' : ''}`}
                                    onClick={() => setActiveGnrOwnerTab(tab.toLowerCase())}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="prop-grid-2x2">
                            {getPropertiesForTab(activeGnrOwnerTab, 'Gandhinagar').slice(0, 4).map((item) => (
                                <Link to={`/property/${item.id}`} key={item.id} className="new-prop-card">
                                    <div className="new-prop-img-box">
                                        <img src={item.image} alt={item.listingTitle} loading="lazy" />
                                    </div>
                                    <div className="new-prop-details">
                                        <h4 className="new-prop-title">{item.listingTitle}</h4>
                                        <p className="new-prop-loc">{item.location}</p>
                                        <p className="new-prop-price">{item.price}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <Link to="/explore?city=Gandhinagar" className="new-see-all-btn">See All</Link>
                    </div>
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

            {/* Valuation Modal */}
            <ValuationModal isOpen={isValuationOpen} onClose={() => setIsValuationOpen(false)} />
        </div>
    );
};

export default Home;

