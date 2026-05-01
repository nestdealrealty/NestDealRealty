import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Search, Heart, User, Menu, X, ArrowRight, Home, MoreVertical, LogOut, ChevronRight, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ValuationModal from './ValuationModal';
import './Header.css';
import logo from '../assets/logo.jpg';

const ALL_LOCALITIES = [
    'Thaltej', 'Bodakdev', 'Prahlad Nagar', 'Sindhu Bhavan Road', 'Ambli', 'Satellite', 'Science City Road', 'Vastrapur', 'Judges Bungalow Road',
    'Nikol', 'Vastral', 'Naroda', 'Maninagar', 'Makarba', 'Sanand', 'Bakrol', 'Ognaj', 'Vadsar', 'Ranip', 'Shahibaug', 'Sabarmati',
    'Chandlodiya', 'Narol', 'Vatva', 'Danilimda', 'Asarwa', 'Bapunagar', 'Odhav', 'Piplaj', 'Bopal', 'South Bopal', 'Gota', 'Chandkheda',
    'Motera', 'Shilaj', 'Shela', 'Ghuma', 'New Ranip', 'Jagatpur', 'Vaishnodevi Circle', 'Tragad', 'Zundal', 'Vasna', 'Paldi', 'Ambawadi',
    'Navrangpura', 'Memnagar', 'Sola'
].sort();

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

    const resetCascading = () => {
        setHoveredRentOption(null);
        setHoveredPropertyType(null);
        setHoveredCity(null);
        setHoveredArea(null);
        setHoveredBHK(null);
        setLocalitySearch('');
    };

    const location = useLocation();

    return (
        <header className="header">
            <div className="container header-container">
                <Link to="/" className="logo">
                    <img src={logo} alt="Nest Deal Realty" className="logo-img" />
                    <span>Nest Deal Realty</span>
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
                                                            {['AHMEDABAD', 'GANDHINAGAR'].map(city => (
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
                                                            {ALL_LOCALITIES.filter(loc => loc.toLowerCase().includes(localitySearch.toLowerCase())).map(loc => (
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
                                                                    {['AHMEDABAD', 'GANDHINAGAR'].map(city => (
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
                                                                    {ALL_LOCALITIES.filter(loc => loc.toLowerCase().includes(localitySearch.toLowerCase())).map(loc => (
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
                    <Link to="/post-project" className="post-property-btn project-btn">
                        <span>Post Project</span> <span className="free-tag">NEW</span>
                    </Link>
                    <Link to="/post-property" className="post-property-btn">
                        <span>Post Property</span> <span className="free-tag">FREE</span>
                    </Link>
                    <button className="action-btn"><Search size={20} /></button>

                    {user ? (
                        <button onClick={logOut} className="action-btn login-btn">
                            <LogOut size={20} /> <span>Sign Out</span>
                        </button>
                    ) : (
                        <Link to="/login" className="action-btn login-btn">
                            <User size={20} /> <span>Sign In</span>
                        </Link>
                    )}

                    <div style={{ position: 'relative' }}>
                        <button
                            className="action-btn"
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            style={{ display: 'flex', alignItems: 'center', padding: '8px' }}
                        >
                            <MoreVertical size={20} />
                        </button>

                        {isUserMenuOpen && (
                            <div className="dropdown-menu-user" style={{
                                position: 'absolute',
                                top: '120%',
                                right: 0,
                                background: '#0b1f17',
                                border: '1px solid #E3BC5A',
                                borderRadius: '8px',
                                padding: '10px',
                                width: '200px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '5px',
                                zIndex: 1000,
                                boxShadow: '0 5px 20px rgba(0,0,0,0.5)'
                            }}>
                                <Link to="/saved-properties" className="user-menu-item" onClick={() => setIsUserMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}>
                                    <Heart size={18} fill={user ? "var(--accent)" : "none"} color={user ? "var(--accent)" : "currentColor"} /> Saved Properties
                                </Link>

                                {user && (
                                    <Link to="/my-properties" className="user-menu-item" onClick={() => setIsUserMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}>
                                        <Home size={18} /> My Properties
                                    </Link>
                                )}

                                {user?.email === 'minecraftxbox1389@gmail.com' && (
                                    <Link to="/admin" className="user-menu-item" onClick={() => setIsUserMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', color: '#E3BC5A', fontWeight: 'bold', textDecoration: 'none', borderRadius: '4px' }}>
                                        <Building size={18} /> My Dashboard
                                    </Link>
                                )}
                            </div>
                        )}
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
    );
};

export default Header;
