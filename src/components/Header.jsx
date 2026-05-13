import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Search, Heart, User, Menu, X, ArrowRight, Home, MoreVertical, LogOut, ChevronRight, Building, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ValuationModal from './ValuationModal';
import './Header.css';
import logo from '../assets/logo.jpg';
import { supabase } from '../supabase';


const navItems = [
    {
        title: 'Sell',
        sections: [
            {
                title: 'OUR SERVICES',
                links: ['Know Your Property Value', 'Developer', 'Broker', 'Owner']
            }
        ]
    },
    {
        title: 'Buy',
        sections: [],
        isCascadingBuy: true
    },
    {
        title: 'Rent',
        sections: [],
        isCascadingRent: true,
        cta: { text: 'Explore rentals', sub: 'Finding a place?' }
    },
    {
        title: 'Help',
        sections: [
            {
                title: 'Support',
                links: ['FAQs', 'Contact support', 'Guides', 'Legal help', 'FINANCIAL CALCULATOR']
            }
        ],
        cta: { text: 'Visit help center', sub: 'Need assistance?' }
    }
];

const Header = () => {
    const { user, logOut } = useAuth();
    const [activeMenu, setActiveMenu] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isValuationOpen, setIsValuationOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    // Cascading menu state
    const [hoveredRentOption, setHoveredRentOption] = useState(null);
    const [hoveredPropertyType, setHoveredPropertyType] = useState(null);
    const [hoveredCity, setHoveredCity] = useState(null);
    const [hoveredArea, setHoveredArea] = useState(null);
    const [hoveredBHK, setHoveredBHK] = useState(null);
    const [localitySearch, setLocalitySearch] = useState('');
    const [allLocalities, setAllLocalities] = useState([]);
    const [allCities, setAllCities] = useState(['AHMEDABAD', 'GANDHINAGAR']);

    React.useEffect(() => {
        const fetchDictionary = async () => {
            const { data } = await supabase.from('locations_dictionary').select('city, area');
            if (data) {
                const uniqueAreas = [...new Set(data.map(d => d.area).filter(Boolean))].sort();
                const uniqueCities = [...new Set(data.map(d => d.city).filter(Boolean))].map(c => c.toUpperCase()).sort();
                setAllLocalities(uniqueAreas);
                if (uniqueCities.length > 0) {
                    setAllCities(uniqueCities);
                }
            }
        };
        fetchDictionary();
    }, []);

    const resetCascading = () => {
        setHoveredRentOption(null);
        setHoveredPropertyType(null);
        setHoveredCity(null);
        setHoveredArea(null);
        setHoveredBHK(null);
        setLocalitySearch('');
    };

    const location = useLocation();

    const isHomePage = location.pathname === '/';

    return (
        <div className={`header-wrapper ${isHomePage ? 'homepage-wrapper' : ''}`}>
            <header className="header">
                <div className="container header-container">
                    <Link to="/" className="logo">
                        <img src={logo} alt="Nest Deal Realty" className="logo-img" />
                        <div className="logo-text-wrapper">
                            <span className="brand-name">Nest Deal Realty</span>
                            <div className="slogan-container">
                                <div className="slogan-line"></div>
                                <span className="brand-slogan">ON KEY UNLOCK YOUR FUTURE</span>
                                <div className="slogan-line"></div>
                            </div>
                        </div>
                    </Link>

                    <nav className={`nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                        <ul className="nav-list">
                            {navItems.map((item) => (
                                <li
                                    key={item.title}
                                    className="nav-item"
                                    onMouseEnter={() => setActiveMenu(item.title)}
                                    onMouseLeave={() => {
                                        setActiveMenu(null);
                                        resetCascading();
                                    }}
                                >
                                    <a href="#" className="nav-link" onClick={(e) => e.preventDefault()}>
                                        {item.title} <ChevronDown size={14} />
                                    </a>

                                    <div className={`mega-menu ${activeMenu === item.title ? 'active' : ''} ${item.isCascadingBuy || item.isCascadingRent ? 'cascading-mega-menu' : ''} ${item.title === 'Rent' ? 'rent-mega-menu' : ''}`}>
                                        <div className="container mega-menu-content" style={(item.isCascadingBuy || item.isCascadingRent) ? { display: 'block', padding: 0 } : {}}>
                                            {item.isCascadingBuy ? (
                                                <div className="cascading-menu-container">
                                                    <div className="cascading-column">
                                                        <h4>Property type</h4>
                                                        <ul>
                                                            {['Flats', 'Houses', 'Plots', 'Villas', 'Commercial properties'].map(type => (
                                                                <li key={type} onMouseEnter={() => { setHoveredPropertyType(type); setHoveredCity(null); setHoveredArea(null); setHoveredBHK(null); }} className={hoveredPropertyType === type ? 'active' : ''}>
                                                                    {type} <ChevronRight size={14} />
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    {hoveredPropertyType && (
                                                        <div className="cascading-column">
                                                            <h4>City</h4>
                                                            <ul>
                                                                {allCities.map(city => (
                                                                    <li key={city} onMouseEnter={() => { setHoveredCity(city); setHoveredArea(null); setHoveredBHK(null); }} className={hoveredCity === city ? 'active' : ''}>
                                                                        {city} <ChevronRight size={14} />
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {hoveredCity && (
                                                        <div className="cascading-column">
                                                            <h4>Locality</h4>
                                                            <div className="locality-search-box">
                                                                <input 
                                                                    type="text" 
                                                                    placeholder="Search area..." 
                                                                    value={localitySearch}
                                                                    onChange={(e) => setLocalitySearch(e.target.value)}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                />
                                                            </div>
                                                            <ul className="scrollable-list">
                                                                {allLocalities.filter(loc => loc.toLowerCase().includes(localitySearch.toLowerCase())).map(loc => (
                                                                    <li key={loc} onMouseEnter={() => { setHoveredArea(loc); setHoveredBHK(null); }} className={hoveredArea === loc ? 'active' : ''}>
                                                                        {loc} <ChevronRight size={14} />
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {hoveredArea && (
                                                        <div className="cascading-column">
                                                            <h4>Configuration</h4>
                                                            <ul>
                                                                {['1BHK', '2BHK', '3BHK', '4BHK', '5BHK', '6BHK', '7BHK'].map(bhk => (
                                                                    <li key={bhk} onMouseEnter={() => setHoveredBHK(bhk)} className={hoveredBHK === bhk ? 'active' : ''}>
                                                                        {bhk} <ChevronRight size={14} />
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {hoveredBHK && (
                                                        <div className="cascading-column">
                                                            <h4>Variants</h4>
                                                            <ul>
                                                                <li><Link to={`/explore?purpose=buy&type=${hoveredPropertyType}&city=${hoveredCity}&loc=${hoveredArea}&bhk=${hoveredBHK}`}>{hoveredBHK}</Link></li>
                                                                <li><Link to={`/explore?purpose=buy&type=${hoveredPropertyType}&city=${hoveredCity}&loc=${hoveredArea}&bhk=${hoveredBHK}&variant=Penthouse`}>{hoveredBHK} Penthouse</Link></li>
                                                                <li><Link to={`/explore?purpose=buy&type=${hoveredPropertyType}&city=${hoveredCity}&loc=${hoveredArea}&bhk=${hoveredBHK}&variant=Duplex`}>{hoveredBHK} Duplex Penthouse</Link></li>
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : item.isCascadingRent ? (
                                                <div className="cascading-menu-container">
                                                    <div className="cascading-column">
                                                        <h4>Rent Option</h4>
                                                        <ul>
                                                            {['Rent Your Property', 'Get Property on Rent'].map(opt => (
                                                                <li key={opt} onMouseEnter={() => { setHoveredRentOption(opt); setHoveredPropertyType(null); setHoveredCity(null); setHoveredArea(null); setHoveredBHK(null); }} className={hoveredRentOption === opt ? 'active' : ''}>
                                                                    {opt} <ChevronRight size={14} />
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    {hoveredRentOption === 'Rent Your Property' && (
                                                        <div className="cascading-column">
                                                            <h4>Who are you?</h4>
                                                            <ul>
                                                                <li><Link to="/seller-portal?type=Developer">Developer</Link></li>
                                                                <li><Link to="/seller-portal?type=Owner">Owner</Link></li>
                                                                <li><Link to="/seller-portal?type=Broker">Broker</Link></li>
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {hoveredRentOption === 'Get Property on Rent' && (
                                                        <>
                                                            <div className="cascading-column">
                                                                <h4>Property type</h4>
                                                                <ul>
                                                                    {['Flats', 'Houses', 'Commercial properties'].map(type => (
                                                                        <li key={type} onMouseEnter={() => { setHoveredPropertyType(type); setHoveredCity(null); setHoveredArea(null); setHoveredBHK(null); }} className={hoveredPropertyType === type ? 'active' : ''}>
                                                                            {type} <ChevronRight size={14} />
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                            {hoveredPropertyType && (
                                                                <div className="cascading-column">
                                                                    <h4>City</h4>
                                                                    <ul>
                                                                        {allCities.map(city => (
                                                                            <li key={city} onMouseEnter={() => { setHoveredCity(city); setHoveredArea(null); setHoveredBHK(null); }} className={hoveredCity === city ? 'active' : ''}>
                                                                                {city} <ChevronRight size={14} />
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                            {hoveredCity && (
                                                                <div className="cascading-column">
                                                                    <h4>Locality</h4>
                                                                    <div className="locality-search-box">
                                                                        <input 
                                                                            type="text" 
                                                                            placeholder="Search area..." 
                                                                            value={localitySearch}
                                                                            onChange={(e) => setLocalitySearch(e.target.value)}
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        />
                                                                    </div>
                                                                    <ul className="scrollable-list">
                                                                        {allLocalities.filter(loc => loc.toLowerCase().includes(localitySearch.toLowerCase())).map(loc => (
                                                                            <li key={loc} onMouseEnter={() => { setHoveredArea(loc); setHoveredBHK(null); }} className={hoveredArea === loc ? 'active' : ''}>
                                                                                {loc} <ChevronRight size={14} />
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                            {hoveredArea && (
                                                                <div className="cascading-column">
                                                                    <h4>Configuration</h4>
                                                                    <ul>
                                                                        {['1BHK', '2BHK', '3BHK', '4BHK', '5BHK', '6BHK', '7BHK'].map(bhk => (
                                                                            <li key={bhk} onMouseEnter={() => setHoveredBHK(bhk)} className={hoveredBHK === bhk ? 'active' : ''}>
                                                                                {bhk} <ChevronRight size={14} />
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                            {hoveredBHK && (
                                                                <div className="cascading-column">
                                                                    <h4>Variants</h4>
                                                                    <ul>
                                                                        <li><Link to={`/explore?purpose=rent&type=${hoveredPropertyType}&city=${hoveredCity}&loc=${hoveredArea}&bhk=${hoveredBHK}`} onClick={() => setActiveMenu(null)}>{hoveredBHK}</Link></li>
                                                                        <li><Link to={`/explore?purpose=rent&type=${hoveredPropertyType}&city=${hoveredCity}&loc=${hoveredArea}&bhk=${hoveredBHK}&variant=Penthouse`} onClick={() => setActiveMenu(null)}>{hoveredBHK} Penthouse</Link></li>
                                                                        <li><Link to={`/explore?purpose=rent&type=${hoveredPropertyType}&city=${hoveredCity}&loc=${hoveredArea}&bhk=${hoveredBHK}&variant=Duplex`} onClick={() => setActiveMenu(null)}>{hoveredBHK} Duplex Penthouse</Link></li>
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="mega-menu-grid">
                                                        {item.sections.map((section) => (
                                                            <div key={section.title} className="mega-menu-section">
                                                                <h4>{section.title}</h4>
                                                                <ul>
                                                                    {section.links.map((link) => {
                                                                        let toPath = "#";
                                                                        if (link === 'Developer' || link === 'Broker' || link === 'Owner') {
                                                                            toPath = `/seller-portal?type=${link}`;
                                                                        } else if (link === 'My Dashboard') {
                                                                            toPath = "/admin";
                                                                        } else if (link === 'FINANCIAL CALCULATOR') {
                                                                            toPath = "/emi-calculator";
                                                                        }
                                                                        
                                                                        return (
                                                                            <li key={link}>
                                                                                {link === 'Know Your Property Value' ? (
                                                                                    <a
                                                                                        href="#"
                                                                                        onClick={(e) => {
                                                                                            e.preventDefault();
                                                                                            setIsValuationOpen(true);
                                                                                            setActiveMenu(null);
                                                                                        }}
                                                                                    >
                                                                                        {link}
                                                                                    </a>
                                                                                ) : (
                                                                                    <Link to={toPath} onClick={() => setActiveMenu(null)}>
                                                                                        {link}
                                                                                    </Link>
                                                                                )}
                                                                            </li>
                                                                        );
                                                                    })}
                                                                </ul>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {item.cta && (
                                                        <div className="mega-menu-cta">
                                                            <p>{item.cta.sub}</p>
                                                            <button
                                                                className="btn btn-primary"
                                                                onClick={() => {
                                                                    if (item.cta.text === 'Book a valuation') {
                                                                        setIsValuationOpen(true);
                                                                        setActiveMenu(null);
                                                                    }
                                                                }}
                                                            >
                                                                {item.cta.text} <ArrowRight size={16} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="header-actions">
                        <Link to="/post-project" className="header-btn-pill project-pill">
                            Post Project <span className="pill-badge-new">NEW</span>
                        </Link>
                        <Link to="/post-property" className="header-btn-pill property-pill">
                            Post Property <span className="pill-badge-free">FREE</span>
                        </Link>

                        {user ? (
                            <div className="account-dropdown-wrapper">
                                <button 
                                    className="account-trigger-btn"
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                >
                                    <div className="user-icon-circle">
                                        <User size={18} />
                                    </div>
                                    <span className="user-label">Sign Out</span>
                                    <ChevronDown size={14} className={`chevron-anim ${isUserMenuOpen ? 'open' : ''}`} />
                                </button>

                                {isUserMenuOpen && (
                                    <div className="custom-dropdown-menu">
                                        <Link to="/profile" className="dropdown-item">
                                            <User size={16} /> My Profile
                                        </Link>
                                        <Link to="/saved-properties" className="dropdown-item">
                                            <Heart size={16} /> Saved Properties
                                        </Link>
                                        <Link to="/my-properties" className="dropdown-item">
                                            <Home size={16} /> My Projects
                                        </Link>
                                        <Link to="/settings" className="dropdown-item">
                                            <Building size={16} /> Settings
                                        </Link>
                                        {user?.email === 'minecraftxbox1389@gmail.com' && (
                                            <Link to="/admin" className="dropdown-item admin-dash" onClick={() => setIsUserMenuOpen(false)}>
                                                <Building size={16} /> My Dashboard
                                            </Link>
                                        )}
                                        <div className="dropdown-divider"></div>
                                        <button onClick={logOut} className="dropdown-item sign-out">
                                            <LogOut size={16} /> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="account-trigger-btn">
                                <div className="user-icon-circle">
                                    <User size={18} />
                                </div>
                                <span className="user-label">Sign In</span>
                            </Link>
                        )}

                        <div className="options-dropdown-wrapper">
                            <button 
                                className="dots-trigger-btn"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} // Reusing mobile menu state or creating a new one? Let's use a new one if possible, but for now let's use a simple state.
                            >
                                <MoreVertical size={20} />
                            </button>
                            
                            {/* More Options Dropdown */}
                            <div className="custom-dropdown-menu options-menu">
                                <Link to="/notifications" className="dropdown-item">
                                    <Search size={16} /> Notifications
                                </Link>
                                <Link to="/messages" className="dropdown-item">
                                    <Mail size={16} /> Messages
                                </Link>
                                <Link to="/help" className="dropdown-item">
                                    <Search size={16} /> Help Center
                                </Link>
                                <div className="dropdown-divider"></div>
                                <Link to="/privacy" className="dropdown-item">
                                    <Lock size={16} /> Privacy Policy
                                </Link>
                                <Link to="/terms" className="dropdown-item">
                                    <Search size={16} /> Terms & Conditions
                                </Link>
                            </div>
                        </div>

                        <button
                            className="mobile-toggle"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                <ValuationModal isOpen={isValuationOpen} onClose={() => setIsValuationOpen(false)} />
            </header>
        </div>
    );
};

export default Header;
