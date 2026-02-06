import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, Menu, Heart } from 'lucide-react';
import './Header.css';
import logo from '../assets/logo.jpg';

const Header = () => {
    const location = useLocation();

    return (
        <header className="header">
            <div className="container header-container">
                <Link to="/" className="logo">
                    <img src={logo} alt="Nest Deal Realty" className="logo-img" />
                    <span>Nest Deal Realty</span>
                </Link>

                <nav className="nav">
                    <ul className="nav-list">
                        <li>
                            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/property" className={`nav-link ${location.pathname.includes('/property') ? 'active' : ''}`}>
                                Properties
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
                                Dashboard
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="header-actions">
                    <button className="action-btn" title="Search"><Search size={18} /></button>
                    <button className="action-btn" title="Favorites"><Heart size={18} /></button>
                    <button className="action-btn login-btn">
                        <User size={18} /> <span>Sign In</span>
                    </button>
                    <button className="action-btn mobile-menu">
                        <Menu size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
