import React, { useState, useEffect, useRef } from 'react';
import { Search, Calculator, Info, ArrowRight, ChevronRight, ChevronDown, Filter, Tag, Key, Briefcase, Star, ShieldCheck, X, Check, MapPin, Bed, Building2, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ValuationModal from '../components/ValuationModal';
import ExploreAhmedabad from '../components/ExploreAhmedabad';
import ExploreGandhinagar from '../components/ExploreGandhinagar';
import FooterFilters from '../components/FooterFilters';
import logo from '../assets/logo.jpg';
import './Home.css';

const ALL_AMENITY_NAMES = [
    "Garden Play Area", "Lush Green Garden", "Box Cricket", "Gazebo", "Terrace Garden",
    "Gym / Aerobic Studio", "Banquet Hall", "Security Cabin", "CCTV Camera", "Allotted Car Parking",
    "High-Speed Elevator", "Fire Safety", "Power Backup for Common Area", "Toddler Play Area",
    "Jogging Track", "Indoor Games", "OutDoor Games", "Multipurpose Court", "Yoga Space",
    "Entrance Foyer", "Swimming Pool", "Club House", "Children Play Area", "Senior Citizen Area",
    "Gated Community", "CCTV", "Security Guard", "Intercom Facility", "Private Pool",
    "Private Terrace", "Party Lawn", "Two-Wheeler Parking", "Kids Play Room", "Virtual Golf"
];

const PRICE_OPTIONS = [
    '₹25L', '₹50L', '₹75L', '₹1Cr', '₹1.5Cr', '₹2Cr', '₹3Cr', '₹5Cr', '₹7Cr', '₹10Cr+'
];

const BHK_OPTIONS = [
    '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', '6 BHK', '7 BHK',
    '3 BHK Penthouse', '4 BHK Penthouse', '5 BHK Penthouse', '6 BHK Penthouse', '7 BHK Penthouse',
    '3 BHK Duplex Penthouse', '4 BHK Duplex Penthouse', '5 BHK Duplex Penthouse', '6 BHK Duplex Penthouse', '7 BHK Duplex Penthouse', '8 BHK Duplex Penthouse', '9 BHK Duplex Penthouse'
];

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

const RENT_PRICE_OPTIONS = [
    '₹5,000', '₹10,000', '₹15,000', '₹20,000', '₹25,000', '₹30,000', '₹40,000', '₹50,000', '₹75,000', '₹1L', '₹2L', '₹5L', '₹10L'
];

const Home = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [activeLocation, setActiveLocation] = useState('Ahmedabad');
    const [isValuationOpen, setIsValuationOpen] = useState(false);
    const [realProperties, setRealProperties] = useState([]);
    const [realProjects, setRealProjects] = useState([]);
    const [homeSlides, setHomeSlides] = useState(defaultSlides);

    // Search States
    const [searchType, setSearchType] = useState('buy'); // buy or rent
    const [activeSearchDropdown, setActiveSearchDropdown] = useState(null);
    const [budgetOpen, setBudgetOpen] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [selectedBHK, setSelectedBHK] = useState([]);
    const [selectedBudget, setSelectedBudget] = useState({ min: '', max: '' });
    const [selectedConstruction, setSelectedConstruction] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [amenitySearch, setAmenitySearch] = useState('');
    const [showFinancialOptions, setShowFinancialOptions] = useState(false);

    // Rent Specific States
    const [rentPropertyType, setRentPropertyType] = useState('Apartment');
    const [furnishingStatus, setFurnishingStatus] = useState('Unfurnished');
    const [availability, setAvailability] = useState('Ready to move');
    const [availableDate, setAvailableDate] = useState('');
    const [preferredTenant, setPreferredTenant] = useState('Anyone');
    const [propertyAge, setPropertyAge] = useState('New');

    // New Layout State
    const [activeAhdProjectTab, setActiveAhdProjectTab] = useState('flats');
    const [activeAhdOwnerTab, setActiveAhdOwnerTab] = useState('flats');
    const [activeGnrProjectTab, setActiveGnrProjectTab] = useState('flats');
    const [activeGnrOwnerTab, setActiveGnrOwnerTab] = useState('flats');
    const slideshowRef = useRef(null);

    const handleSearch = () => {
        const params = new URLSearchParams();
        params.set('purpose', searchType);
        if (activeLocation) params.set('city', activeLocation);
        if (searchText) params.set('search', searchText);
        if (selectedBHK.length > 0) params.set('bhk', selectedBHK.join(','));
        if (selectedBudget.min) params.set('minBudget', selectedBudget.min);
        if (selectedBudget.max) params.set('maxBudget', selectedBudget.max);

        if (searchType === 'buy') {
            if (selectedAmenities.length > 0) params.set('amenities', selectedAmenities.join('|'));
            if (selectedConstruction.length > 0) params.set('construction', selectedConstruction.join(','));
        } else {
            params.set('type', rentPropertyType);
            params.set('furnishing', furnishingStatus);
            params.set('availability', availability);
            if (availableDate) params.set('availableFrom', availableDate);
            params.set('tenant', preferredTenant);
            params.set('age', propertyAge);
        }
        navigate(`/explore?${params.toString()}`);
    };

    const toggleAmenity = (name) => {
        setSelectedAmenities(prev =>
            prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
        );
    };

    // Fetch real properties and slides from Supabase
    useEffect(() => {
        const fetchData = async () => {
            // Fetch Properties
            const { data: propsData, error: propsError } = await supabase
                .from('properties')
                .select('*')
                .eq('status', 'approved')
                .order('homepage_slot', { ascending: true, nullsFirst: false })
                .order('created_at', { ascending: false })
                .limit(30);

            if (propsData && !propsError) {
                setRealProperties(propsData.map(p => ({
                    id: p.id,
                    image: (p.images && p.images.length > 0)
                        ? (typeof p.images[0] === 'string' ? p.images[0] : (p.images[0]?.url || p.images[0]))
                        : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80',
                    listingTitle: p.project_name || `Property in ${p.locality}`,
                    builder: p.contact_name || 'Individual Seller',
                    config: p.bhk || p.property_type || 'Property',
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
                .order('homepage_slot', { ascending: true, nullsFirst: false })
                .order('created_at', { ascending: false })
                .limit(30);

            if (projectsData && !projError) {
                setRealProjects(projectsData.map(p => {
                    // Build config label from bedrooms field across all 3 config arrays
                    let configText = p.property_type || 'Residential';

                    const bhkNums = [];
                    const extras = [];

                    // Regular configs: use 'bedrooms' count or 'bhk_type' for villas
                    if (Array.isArray(p.configurations) && p.configurations.length > 0) {
                        p.configurations.forEach(c => {
                            if (c?.bhk_type) {
                                // Villa style e.g. "4 BHK"
                                const n = parseInt(c.bhk_type);
                                if (!isNaN(n)) bhkNums.push(n);
                            } else if (c?.bedrooms) {
                                bhkNums.push(parseInt(c.bedrooms));
                            }
                        });
                    }

                    // Penthouse configs
                    if (Array.isArray(p.penthouse_configurations) && p.penthouse_configurations.length > 0) {
                        extras.push('Penthouse');
                    }

                    // Duplex Penthouse configs
                    if (Array.isArray(p.duplex_penthouse_configurations) && p.duplex_penthouse_configurations.length > 0) {
                        extras.push('Duplex Penthouse');
                    }

                    const sortedBhks = [...new Set(bhkNums)].sort((a, b) => a - b);
                    const parts = [];
                    if (sortedBhks.length > 0) parts.push(`${sortedBhks.join(', ')} BHK Flat`);
                    extras.forEach(e => parts.push(e));
                    if (parts.length > 0) configText = parts.join(', ');

                    return {
                        id: p.id,
                        image: (p.images && p.images.length > 0)
                            ? (typeof p.images[0] === 'string' ? p.images[0] : (p.images[0]?.url || p.images[0]))
                            : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
                        listingTitle: p.name,
                        developer: p.developer,
                        location: p.locality,
                        city: p.city,
                        type: p.property_type?.toLowerCase(),
                        config: configText,
                        price: p.configurations?.[0]?.price || 'Call for Price',
                        isProject: true
                    };
                }));
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
                    tag: s.tag,
                    developer: s.builder || s.developer
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
                                        <h2 style={{ marginBottom: '4px' }}>{slide.title}</h2>
                                        <p style={{ color: 'rgba(255,255,255,0.95)', fontSize: '1.2rem', margin: '0 0 16px 0', fontWeight: '500', letterSpacing: '0.5px' }}>{slide.developer || 'NestDeal'}</p>
                                        <div className="hero-tag" style={{ color: '#FFFFFF', opacity: 1, fontSize: '1rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '6px 16px', borderRadius: '8px', width: 'fit-content' }}>{slide.tag}</div>
                                        <p style={{ marginTop: '20px', fontSize: '1.8rem', fontWeight: '700' }}>{slide.price}</p>
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
                        <div className="search-type-toggle-wrapper">
                            <div className="search-type-toggle">
                                <button className={searchType === 'buy' ? 'active' : ''} onClick={() => { setSearchType('buy'); setSelectedBudget({ min: '', max: '' }); }}>BUY</button>
                                <button className={searchType === 'rent' ? 'active' : ''} onClick={() => { setSearchType('rent'); setSelectedBudget({ min: '', max: '' }); }}>RENT</button>
                            </div>
                        </div>
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
                                <label>Search By Area</label>
                                <input
                                    type="text"
                                    placeholder="Area / project / builder"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
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
                                        <div className="bhk-options-grid" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                            {BHK_OPTIONS.map(bhk => (
                                                <div
                                                    key={bhk}
                                                    className={`bhk-option-btn ${selectedBHK.includes(bhk) ? 'active' : ''}`}
                                                    onClick={() => {
                                                        const newSel = selectedBHK.includes(bhk)
                                                            ? selectedBHK.filter(b => b !== bhk)
                                                            : [...selectedBHK, bhk];
                                                        setSelectedBHK(newSel);
                                                    }}
                                                    style={{ fontSize: '0.75rem', padding: '8px 4px' }}
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
                                                        {(searchType === 'rent' ? RENT_PRICE_OPTIONS : PRICE_OPTIONS).map(price => (
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
                                                        {(searchType === 'rent' ? RENT_PRICE_OPTIONS : PRICE_OPTIONS).map(price => (
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

                            {searchType === 'buy' ? (
                                <>
                                    {/* Amenities */}
                                    <div className="search-field-group" onClick={() => toggleSearchDropdown('amenities')}>
                                        <label>Amenities</label>
                                        <div className="field-control">
                                            <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {selectedAmenities.length > 0 ? `${selectedAmenities.length} selected` : 'Any'}
                                            </span>
                                            <ChevronDown size={14} className={activeSearchDropdown === 'amenities' ? 'rotate-180' : ''} />
                                        </div>
                                        {activeSearchDropdown === 'amenities' && (
                                            <div className="dropdown-menu-search amenities-dropdown" onClick={(e) => e.stopPropagation()} style={{ width: '280px', maxHeight: '320px', overflowY: 'auto' }}>
                                                <div style={{ padding: '8px 12px', borderBottom: '1px solid #eee' }}>
                                                    <input
                                                        type="text"
                                                        placeholder="Search amenity..."
                                                        value={amenitySearch}
                                                        onChange={(e) => setAmenitySearch(e.target.value)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        style={{ width: '100%', border: '1px solid #ddd', borderRadius: '6px', padding: '6px 10px', fontSize: '0.85rem', outline: 'none' }}
                                                    />
                                                </div>
                                                <div style={{ padding: '8px' }}>
                                                    {ALL_AMENITY_NAMES.filter(a => a.toLowerCase().includes(amenitySearch.toLowerCase())).map(name => (
                                                        <div key={name} className={`amenity-item-check ${selectedAmenities.includes(name) ? 'active' : ''}`} onClick={() => toggleAmenity(name)}>
                                                            <div className="check-box">{selectedAmenities.includes(name) && <Check size={12} />}</div>
                                                            <span>{name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="search-divider-v"></div>

                                    {/* Construction */}
                                    <div className="search-field-group" onClick={() => toggleSearchDropdown('construction')}>
                                        <label>Construction</label>
                                        <div className="field-control">
                                            <span>{selectedConstruction.length > 0 ? `${selectedConstruction.length} selected` : 'Any Status'}</span>
                                            <ChevronDown size={14} className={activeSearchDropdown === 'construction' ? 'rotate-180' : ''} />
                                        </div>
                                        {activeSearchDropdown === 'construction' && (
                                            <div className="dropdown-menu-search simple-dropdown" onClick={(e) => e.stopPropagation()}>
                                                {['READY TO MOVE', 'UNDER CONSTRUCTION'].map(status => (
                                                    <div
                                                        key={status}
                                                        className={`dd-item ${selectedConstruction.includes(status) ? 'selected' : ''}`}
                                                        onClick={() => {
                                                            const newSel = selectedConstruction.includes(status)
                                                                ? selectedConstruction.filter(s => s !== status)
                                                                : [...selectedConstruction, status];
                                                            setSelectedConstruction(newSel);
                                                        }}
                                                    >
                                                        {status}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Property Type */}
                                    <div className="search-field-group" onClick={() => toggleSearchDropdown('propType')}>
                                        <label>Property Type</label>
                                        <div className="field-control">
                                            <span style={{ fontSize: '0.75rem' }}>{rentPropertyType}</span>
                                            <ChevronDown size={14} className={activeSearchDropdown === 'propType' ? 'rotate-180' : ''} />
                                        </div>
                                        {activeSearchDropdown === 'propType' && (
                                            <div className="dropdown-menu-search simple-dropdown" onClick={(e) => e.stopPropagation()}>
                                                {['Apartment', 'Villa', 'Studio', 'Builder Floor', 'PG / Co-living'].map(t => (
                                                    <div key={t} className={`dd-item ${rentPropertyType === t ? 'selected' : ''}`} onClick={() => { setRentPropertyType(t); toggleSearchDropdown(null); }}>{t}</div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="search-divider-v"></div>

                                    {/* Furnishing */}
                                    <div className="search-field-group" onClick={() => toggleSearchDropdown('furnishing')}>
                                        <label>Furnishing</label>
                                        <div className="field-control">
                                            <span style={{ fontSize: '0.75rem' }}>{furnishingStatus}</span>
                                            <ChevronDown size={14} className={activeSearchDropdown === 'furnishing' ? 'rotate-180' : ''} />
                                        </div>
                                        {activeSearchDropdown === 'furnishing' && (
                                            <div className="dropdown-menu-search simple-dropdown" onClick={(e) => e.stopPropagation()}>
                                                {['Unfurnished', 'Semi-furnished', 'Fully furnished'].map(t => (
                                                    <div key={t} className={`dd-item ${furnishingStatus === t ? 'selected' : ''}`} onClick={() => { setFurnishingStatus(t); toggleSearchDropdown(null); }}>{t}</div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="search-divider-v"></div>

                                    {/* Availability */}
                                    <div className="search-field-group" onClick={() => toggleSearchDropdown('avail')}>
                                        <label>Availability</label>
                                        <div className="field-control">
                                            <span style={{ fontSize: '0.75rem' }}>{availability === 'Ready to move' ? 'Ready' : (availableDate || 'Select Date')}</span>
                                            <ChevronDown size={14} className={activeSearchDropdown === 'avail' ? 'rotate-180' : ''} />
                                        </div>
                                        {activeSearchDropdown === 'avail' && (
                                            <div className="dropdown-menu-search simple-dropdown" onClick={(e) => e.stopPropagation()} style={{ width: '200px' }}>
                                                <div className={`dd-item ${availability === 'Ready to move' ? 'selected' : ''}`} onClick={() => { setAvailability('Ready to move'); setAvailableDate(''); toggleSearchDropdown(null); }}>Ready to move</div>
                                                <div className="dd-item" style={{ padding: '10px' }}>
                                                    <label style={{ fontSize: '0.7rem', color: '#666', marginBottom: '4px' }}>Available from:</label>
                                                    <input 
                                                        type="date" 
                                                        value={availableDate} 
                                                        onChange={(e) => { setAvailableDate(e.target.value); setAvailability('Date'); }}
                                                        style={{ width: '100%', border: '1px solid #ddd', borderRadius: '4px', padding: '4px' }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="search-divider-v"></div>

                                    {/* Tenant */}
                                    <div className="search-field-group" onClick={() => toggleSearchDropdown('tenant')}>
                                        <label>Tenant</label>
                                        <div className="field-control">
                                            <span style={{ fontSize: '0.75rem' }}>{preferredTenant}</span>
                                            <ChevronDown size={14} className={activeSearchDropdown === 'tenant' ? 'rotate-180' : ''} />
                                        </div>
                                        {activeSearchDropdown === 'tenant' && (
                                            <div className="dropdown-menu-search simple-dropdown" onClick={(e) => e.stopPropagation()}>
                                                {['Family', 'Bachelor', 'Anyone'].map(t => (
                                                    <div key={t} className={`dd-item ${preferredTenant === t ? 'selected' : ''}`} onClick={() => { setPreferredTenant(t); toggleSearchDropdown(null); }}>{t}</div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="search-divider-v"></div>

                                    {/* Age */}
                                    <div className="search-field-group" onClick={() => toggleSearchDropdown('age')}>
                                        <label>Age</label>
                                        <div className="field-control">
                                            <span style={{ fontSize: '0.75rem' }}>{propertyAge}</span>
                                            <ChevronDown size={14} className={activeSearchDropdown === 'age' ? 'rotate-180' : ''} />
                                        </div>
                                        {activeSearchDropdown === 'age' && (
                                            <div className="dropdown-menu-search simple-dropdown" onClick={(e) => e.stopPropagation()}>
                                                {['New', '0–5 yrs', '5–10 yrs', '10+ yrs'].map(t => (
                                                    <div key={t} className={`dd-item ${propertyAge === t ? 'selected' : ''}`} onClick={() => { setPropertyAge(t); toggleSearchDropdown(null); }}>{t}</div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            <button className="main-search-btn" onClick={handleSearch}>
                                <Search size={20} />
                                <span>Search</span>
                            </button>
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
                                        <h3>BHK <span className="clear-btn" onClick={() => setSelectedBHK([])}>Clear All</span></h3>
                                        <div className="chip-group" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                            {BHK_OPTIONS.map(bhk => (
                                                <button 
                                                    key={bhk} 
                                                    className={`chip-btn ${selectedBHK.includes(bhk) ? 'active' : ''}`}
                                                    onClick={() => {
                                                        const newSel = selectedBHK.includes(bhk)
                                                            ? selectedBHK.filter(b => b !== bhk)
                                                            : [...selectedBHK, bhk];
                                                        setSelectedBHK(newSel);
                                                    }}
                                                >
                                                    {selectedBHK.includes(bhk) ? <Check size={14} /> : <span>+</span>} {bhk}
                                                </button>
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

            {/* Interactive Explore Ahmedabad Section */}
            <ExploreAhmedabad />

            {/* Explore Ahmedabad Section */}
            <div className="explore-ahmedabad-section">

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
                                <Link to={`/project/${item.id}`} key={item.id} className="premium-prop-card">
                                    <div className="premium-img-section">
                                        <img src={item.image} alt={item.listingTitle} loading="lazy" />
                                        <div className="premium-gradient-overlay"></div>
                                        <div className="premium-img-text">
                                            <h4 className="premium-title">{item.listingTitle}</h4>
                                            <div className="premium-developer">
                                                <Building2 size={14} /> by {item.developer || 'NestDeal'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="premium-details-section">
                                        <div className="detail-line">
                                            <Bed size={16} /> <span>{item.config || item.type || 'Residential'}</span>
                                        </div>
                                        <div className="detail-line">
                                            <MapPin size={16} /> <span>{item.location}, {item.city}</span>
                                        </div>
                                        <div className="price-row">
                                            <div className="premium-price-value">₹ {item.price} <sup style={{ fontSize: '0.7rem', verticalAlign: 'super', color: '#FF0000' }}>*</sup></div>
                                            <div className="view-details-btn">
                                                Enquire Now <ArrowRight size={14} />
                                            </div>
                                        </div>
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
                                <Link to={`/property/${item.id}`} key={item.id} className="premium-prop-card">
                                    <div className="premium-img-section">
                                        <img src={item.image} alt={item.listingTitle} loading="lazy" />
                                        <div className="premium-gradient-overlay"></div>
                                        <div className="premium-img-text">
                                            <h4 className="premium-title">{item.listingTitle}</h4>
                                            <div className="premium-developer">
                                                <User size={14} /> by {item.developer || 'Individual'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="premium-details-section">
                                        <div className="detail-line">
                                            <Bed size={16} /> <span>{item.config || item.type || 'Property'}</span>
                                        </div>
                                        <div className="detail-line">
                                            <MapPin size={16} /> <span>{item.location}, {item.city}</span>
                                        </div>
                                        <div className="price-row">
                                            <div className="premium-price-value">₹ {item.price} <sup style={{ fontSize: '0.7rem', verticalAlign: 'super', color: '#FF0000' }}>*</sup></div>
                                            <div className="view-details-btn">
                                                Enquire Now <ArrowRight size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <Link to="/explore?city=Ahmedabad" className="new-see-all-btn">See All</Link>
                    </div>
                </div>
            </div>

            {/* Interactive Explore Gandhinagar Section */}
            <ExploreGandhinagar />

            {/* Explore Gandhinagar Section */}
            <div className="explore-gandhinagar-section">

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
                                <Link to={`/project/${item.id}`} key={item.id} className="premium-prop-card">
                                    <div className="premium-img-section">
                                        <img src={item.image} alt={item.listingTitle} loading="lazy" />
                                        <div className="premium-gradient-overlay"></div>
                                        <div className="premium-img-text">
                                            <h4 className="premium-title">{item.listingTitle}</h4>
                                            <div className="premium-developer">
                                                <Building2 size={14} /> by {item.builder || 'NestDeal'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="premium-details-section">
                                        <div className="detail-line">
                                            <Bed size={16} /> <span>{item.config || item.type || 'Residential'}</span>
                                        </div>
                                        <div className="detail-line">
                                            <MapPin size={16} /> <span>{item.location}, {item.city}</span>
                                        </div>
                                        <div className="price-row">
                                            <div className="premium-price-value">₹ {item.price} <sup style={{ fontSize: '0.7rem', verticalAlign: 'super', color: '#FF0000' }}>*</sup></div>
                                            <div className="view-details-btn">
                                                Enquire Now <ArrowRight size={14} />
                                            </div>
                                        </div>
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
                                <Link to={`/property/${item.id}`} key={item.id} className="premium-prop-card">
                                    <div className="premium-img-section">
                                        <img src={item.image} alt={item.listingTitle} loading="lazy" />
                                        <div className="premium-gradient-overlay"></div>
                                        <div className="premium-img-text">
                                            <h4 className="premium-title">{item.listingTitle}</h4>
                                            <div className="premium-developer">
                                                <User size={14} /> by {item.builder || 'Individual'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="premium-details-section">
                                        <div className="detail-line">
                                            <Bed size={16} /> <span>{item.config || item.type || 'Property'}</span>
                                        </div>
                                        <div className="detail-line">
                                            <MapPin size={16} /> <span>{item.location}, {item.city}</span>
                                        </div>
                                        <div className="price-row">
                                            <div className="premium-price-value">₹ {item.price} <sup style={{ fontSize: '0.7rem', verticalAlign: 'super', color: '#FF0000' }}>*</sup></div>
                                            <div className="view-details-btn">
                                                Enquire Now <ArrowRight size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <Link to="/explore?city=Gandhinagar" className="new-see-all-btn">See All</Link>
                    </div>
                </div>
            </div>

            {/* Footer Filters component */}
            <FooterFilters />

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

