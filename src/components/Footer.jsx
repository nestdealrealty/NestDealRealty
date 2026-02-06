import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';
import './Footer.css';
import logo from '../assets/logo.jpg';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-grid">
                <div className="footer-brand">
                    <Link to="/" className="footer-logo">
                        <img src={logo} alt="Nest Deal Realty" />
                        <h3>Nest Deal Realty</h3>
                    </Link>
                    <p className="slogan">ON KEY UNLOCK YOUR FUTURE</p>
                    <p className="description">
                        Your trusted partner in finding the perfect home. We provide premium real estate services with a focus on luxury, comfort, and value.
                    </p>
                    <div className="social-links">
                        <a href="#"><Facebook size={20} /></a>
                        <a href="#"><Twitter size={20} /></a>
                        <a href="#"><Instagram size={20} /></a>
                        <a href="#"><Linkedin size={20} /></a>
                    </div>
                </div>

                <div className="footer-links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Properties</a></li>
                        <li><a href="#">Builders</a></li>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                    </ul>
                </div>

                <div className="footer-links">
                    <h4>Services</h4>
                    <ul>
                        <li><a href="#">Buy a Home</a></li>
                        <li><a href="#">Sell Your Home</a></li>
                        <li><a href="#">Rentals</a></li>
                        <li><a href="#">Property Valuation</a></li>
                        <li><a href="#">Legal Services</a></li>
                    </ul>
                </div>

                <div className="footer-contact">
                    <h4>Contact Us</h4>
                    <div className="contact-item">
                        <MapPin size={20} className="icon" />
                        <span>Shela, Ahmedabad, Gujarat</span>
                    </div>
                    <div className="contact-item">
                        <Phone size={20} className="icon" />
                        <span>+91 98765 43210</span>
                    </div>
                    <div className="contact-item">
                        <Mail size={20} className="icon" />
                        <span>info@nestdealrealty.com</span>
                    </div>
                    <div className="newsletter">
                        <p>Subscribe to our newsletter</p>
                        <div className="newsletter-input">
                            <input type="email" placeholder="Your Email" />
                            <button><ArrowRight size={20} /></button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container">
                    <p>&copy; 2026 Nest Deal Realty. Created by Antigravity. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
