import React, { useState, useEffect, useRef } from 'react';
import { Search, Calculator, Info, ArrowRight, ChevronRight, ChevronDown, Filter, Tag, Key, Briefcase, Star, ShieldCheck, X, Check, MapPin, Bed, Building2, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ValuationModal from '../components/ValuationModal';
import ExploreAhmedabad from '../components/ExploreAhmedabad';
import ExploreGandhinagar from '../components/ExploreGandhinagar';
import LatestLaunches from '../components/LatestLaunches';
import PremiumHero from '../components/PremiumHero';
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
                    let configText = p.property_type || 'Residential';
                    const bhkNums = [];
                    const extras = [];

                    if (Array.isArray(p.configurations) && p.configurations.length > 0) {
                        p.configurations.forEach(c => {
                            if (c?.bhk_type) {
                                const n = parseInt(c.bhk_type);
                                if (!isNaN(n)) bhkNums.push(n);
                            } else if (c?.bedrooms) {
                                bhkNums.push(parseInt(c.bedrooms));
                            }
                        });
                    }

                    if (Array.isArray(p.penthouse_configurations) && p.penthouse_configurations.length > 0) {
                        extras.push('Penthouse');
                    }

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
                        price: p.price_range || p.configurations?.[0]?.price || 'Call for Price',
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
            setBudgetOpen(null);
        }
    };

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
            {/* Premium Hero Section */}
            <PremiumHero 
                slides={homeSlides} 
                currentSlide={currentSlide} 
                setCurrentSlide={setCurrentSlide} 
            />

            {/* Interactive Explore Ahmedabad Section */}
            <ExploreAhmedabad />

            {/* Trending Projects Section */}
            <LatestLaunches />

            {/* Explore Ahmedabad Section */}
            <div className="explore-ahmedabad-section">

                <div className="new-prop-listing-container">
                    {/* LEFT CONTAINER: Popular Projects (Ahmedabad) */}
                    <div className="prop-listing-column left-projects">
                        <h2 className="new-col-header">Popular Projects</h2>

                        <div className="glass-folder-content">
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
                    </div>

                    {/* RIGHT CONTAINER: Popular Owner Property (Ahmedabad) */}
                    <div className="prop-listing-column right-owners">
                        <h2 className="new-col-header">Popular Owner Property</h2>

                        <div className="glass-folder-content">
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
            </div>


            {/* Interactive Explore Gandhinagar Section */}
            <ExploreGandhinagar />

            {/* Trending Projects Section - Gandhinagar */}
            <LatestLaunches city="Gandhinagar" />

            {/* Explore Gandhinagar Section */}
            <div className="explore-gandhinagar-section">

                <div className="new-prop-listing-container">
                    {/* LEFT CONTAINER: Popular Projects (Gandhinagar) */}
                    <div className="prop-listing-column left-projects">
                        <h2 className="new-col-header">Popular Projects</h2>

                        <div className="glass-folder-content">
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
                    </div>

                    {/* RIGHT CONTAINER: Popular Owner Property (Gandhinagar) */}
                    <div className="prop-listing-column right-owners">
                        <h2 className="new-col-header">Popular Owner Property</h2>

                        <div className="glass-folder-content">
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
