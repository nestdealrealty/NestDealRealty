import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Search, Heart, User, Menu, X, ArrowRight, Home, MoreVertical, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ValuationModal from './ValuationModal';
import './Header.css';
import logo from '../assets/logo.jpg';

const navItems = [
    {
        title: 'Sell',
        sections: [
            {
                title: 'Our Services',
                links: ['Book a free valuation', 'Online valuation', 'Sold house prices', 'Sell by Auction', 'Read our customer reviews']
            },
            {
                title: 'Guides to selling',
                links: ['First time seller', 'Selling in England & Wales', 'Top tips for selling', 'Prepare for home photos', 'Selling glossary']
            }
        ],
        cta: { text: 'Book a valuation', sub: 'Ready to sell?' }
    },
    {
        title: 'Buy',
        sections: [
            {
                title: 'Search Property',
                links: ['New projects', 'Ready to move', 'Budget homes', 'Luxury homes']
            },
            {
                title: 'Resources',
                links: ['Buying guide', 'Home loans', 'Legal help', 'Property tax']
            }
        ],
        cta: { text: 'Search properties', sub: 'Looking for a home?' }
    },
    {
        title: 'Rent',
        sections: [
            {
                title: 'RENT YOUR PROPERTY',
                links: ['Flat', 'Bungalows', 'Commercial', 'Plot']
            },
            {
                title: 'FIND RENTAL PROPERTY',
                links: ['Flat', 'Bungalows', 'Commercial', 'Plot']
            }
        ],
        cta: { text: 'Explore rentals', sub: 'Finding a place?' }
    },
    {
        title: 'Help',
        sections: [
            {
                title: 'Support',
                links: ['FAQs', 'Contact support', 'Guides', 'Legal help']
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
                                onMouseLeave={() => setActiveMenu(null)}
                            >
                                <a href="#" className="nav-link">
                                    {item.title} <ChevronDown size={14} />
                                </a>

                                <div className={`mega-menu ${activeMenu === item.title ? 'active' : ''}`}>
                                    <div className="container mega-menu-content">
                                        <div className="mega-menu-grid">
                                            {item.sections.map((section) => (
                                                <div key={section.title} className="mega-menu-section">
                                                    <h4>{section.title}</h4>
                                                    <ul>
                                                        {section.links.map((link) => (
                                                            <li key={link}>
                                                                <a
                                                                    href="#"
                                                                    onClick={(e) => {
                                                                        if (link === 'Book a free valuation') {
                                                                            e.preventDefault();
                                                                            setIsValuationOpen(true);
                                                                            setActiveMenu(null);
                                                                        }
                                                                    }}
                                                                >
                                                                    {link}
                                                                </a>
                                                            </li>
                                                        ))}
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
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="header-actions">
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
                                        <User size={18} /> Admin Dashboard
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
