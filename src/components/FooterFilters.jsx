import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../pages/Home.css'; // Assuming styles are in Home.css

const LOCALITIES_PROJECTS = {
    'Ambli': ['Ayaan', 'Binori Belmont', 'Indraprasth Shivanta', 'Manor Ananda', 'Maruti Aatman', 'Oeuvre 3', 'Oriental Viola', 'Palak Elina', 'Ratnaakar Artesia', 'Royce One', 'Sanctum', 'Sankalp Grace 2', 'Satyamev Luxor', 'Shaligram Luxuria', 'Sheetal Gharana', 'Skydeck Select', 'Splendora 1', 'Sun Sky Park', 'Swati Senor', 'The Bellagio', 'The Kimana Tower', 'The Waterfall', 'The Whitecraft', 'Tranquil', 'True The North', 'Westlands'],
    'Science City': ['Aarohi Elysium', 'Amogha', 'Arise Icon', 'Ashirvad Paras', 'Bhavya Residency', 'Capital Icon', 'Devam', 'Earth Arise', 'Eminence', 'Ganesh Genesis'],
    'Shela': ['Aarohi Crest', 'Aaryan Gloria', 'Aaryan Opus', 'Applewoods', 'Balaaji Wind', 'Club O7', 'Floris', 'Gala Aura', 'Gala Gold', 'Goyal Orchid'],
    'Vaishnodevi': ['Aarohi', 'Adani', 'Balaji', 'Ganesh', 'Godrej', 'Goyal', 'Malabar', 'Maruti', 'Pacific', 'Satyamev', 'Shaligram', 'Shanti', 'Shree', 'Silver'],
    'Zundal': ['Anand', 'Avadh', 'Balaji', 'Dev', 'Ganesh', 'Om', 'Radhe', 'Shanti', 'Shree', 'Silver']
};

const PROPERTY_OPTIONS = [
    {
        title: "Popular BHK Searches",
        links: [
            { text: "1 BHK Flats in Ahmedabad", url: "/explore?city=Ahmedabad&bhk=1" },
            { text: "2 BHK Flats in Ahmedabad", url: "/explore?city=Ahmedabad&bhk=2" },
            { text: "3 BHK Flats in Ahmedabad", url: "/explore?city=Ahmedabad&bhk=3" },
            { text: "4 BHK Flats in Ahmedabad", url: "/explore?city=Ahmedabad&bhk=4" },
            { text: "5 BHK Flats in Ahmedabad", url: "/explore?city=Ahmedabad&bhk=5" },
        ]
    },
    {
        title: "Popular Flat Searches",
        links: [
            { text: "Flats for Sale in Ahmedabad", url: "/explore?city=Ahmedabad&type=flat" },
            { text: "Ready to Move Flats in Ahmedabad", url: "/explore?city=Ahmedabad&type=flat&construction=READY TO MOVE" },
            { text: "Under Construction Flats in Ahmedabad", url: "/explore?city=Ahmedabad&type=flat&construction=UNDER CONSTRUCTION" },
            { text: "New Launch Flats in Ahmedabad", url: "/explore?city=Ahmedabad&type=flat" },
            { text: "Luxury Flats in Ahmedabad", url: "/explore?city=Ahmedabad&type=flat" },
        ]
    },
    {
        title: "Budget wise Searches",
        links: [
            { text: "Flats under 50 Lakhs in Ahmedabad", url: "/explore?city=Ahmedabad&type=flat&maxBudget=50 L" },
            { text: "Flats under 60 Lakhs in Ahmedabad", url: "/explore?city=Ahmedabad&type=flat&maxBudget=60 L" },
            { text: "Flats under 70 Lakhs in Ahmedabad", url: "/explore?city=Ahmedabad&type=flat&maxBudget=70 L" },
            { text: "Flats under 80 Lakhs in Ahmedabad", url: "/explore?city=Ahmedabad&type=flat&maxBudget=80 L" },
            { text: "Flats under 1 Crore in Ahmedabad", url: "/explore?city=Ahmedabad&type=flat&maxBudget=1 Cr" },
        ]
    },
    {
        title: "Popular 2 BHK Searches",
        links: [
            { text: "2 BHK Flats in Gota", url: "/explore?city=Ahmedabad&bhk=2&search=Gota" },
            { text: "2 BHK Flats in Bopal", url: "/explore?city=Ahmedabad&bhk=2&search=Bopal" },
            { text: "2 BHK Flats in Chandkheda", url: "/explore?city=Ahmedabad&bhk=2&search=Chandkheda" },
            { text: "2 BHK Flats in Vastrapur", url: "/explore?city=Ahmedabad&bhk=2&search=Vastrapur" },
            { text: "2 BHK Flats in Satellite", url: "/explore?city=Ahmedabad&bhk=2&search=Satellite" },
        ]
    },
    {
        title: "Popular 3 BHK Searches",
        links: [
            { text: "3 BHK Flats in Science City", url: "/explore?city=Ahmedabad&bhk=3&search=Science City" },
            { text: "3 BHK Flats in Thaltej", url: "/explore?city=Ahmedabad&bhk=3&search=Thaltej" },
            { text: "3 BHK Flats in Bodakdev", url: "/explore?city=Ahmedabad&bhk=3&search=Bodakdev" },
            { text: "3 BHK Flats in Prahlad Nagar", url: "/explore?city=Ahmedabad&bhk=3&search=Prahlad Nagar" },
            { text: "3 BHK Flats in Sindhu Bhavan Road", url: "/explore?city=Ahmedabad&bhk=3&search=Sindhu Bhavan Road" },
        ]
    }
];

const FooterFilters = () => {
    const [activeLocalityTab, setActiveLocalityTab] = useState('Ambli');

    return (
        <div style={{width: '100%'}}>
            {/* Explore New Project by Localities Section */}
            <div className="localities-projects-section">
                <div className="localities-header">
                    <h2>Explore New Project by Localities</h2>
                </div>
                <div className="localities-tabs">
                    {Object.keys(LOCALITIES_PROJECTS).map((locality) => (
                        <button
                            key={locality}
                            className={`locality-tab-btn ${activeLocalityTab === locality ? 'active' : ''}`}
                            onClick={() => setActiveLocalityTab(locality)}
                        >
                            {locality}
                        </button>
                    ))}
                </div>
                <div className="localities-grid">
                    {LOCALITIES_PROJECTS[activeLocalityTab].map((project, idx) => (
                        <Link 
                            key={idx} 
                            to={`/explore?city=Ahmedabad&search=${project}`}
                            className="locality-project-link"
                        >
                            {project}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Property Options in Ahmedabad Section */}
            <div className="property-options-section">
                <div className="property-options-header">
                    <h2>Property Options in Ahmedabad</h2>
                </div>
                <div className="property-options-columns">
                    {PROPERTY_OPTIONS.map((col, idx) => (
                        <div key={idx} className="property-option-col">
                            <h3 className="option-col-title">{col.title}</h3>
                            <ul className="option-col-list">
                                {col.links.map((link, linkIdx) => (
                                    <li key={linkIdx}>
                                        <Link to={link.url} className="option-link">{link.text}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FooterFilters;
