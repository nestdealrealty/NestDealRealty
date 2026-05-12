import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, MapPin, LayoutGrid, Wallet, Star, Building2, Sparkles, Home } from 'lucide-react';
import ValuationModal from './ValuationModal';
import { supabase } from '../supabase';
import './PremiumHero.css';


const BHK_OPTIONS_FULL = [
    '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', '6 BHK', '7 BHK',
    '3 BHK Penthouse', '4 BHK Penthouse', '5 BHK Penthouse', '6 BHK Penthouse', '7 BHK Penthouse',
    '3 BHK Duplex Penthouse', '4 BHK Duplex Penthouse', '5 BHK Duplex Penthouse', '6 BHK Duplex Penthouse', '7 BHK Duplex Penthouse'
];

const BUDGET_OPTIONS = [
    '₹20L', '₹30L', '₹40L', '₹50L', '₹60L', '₹70L', '₹80L', '₹90L', 
    '₹1Cr', '₹2Cr', '₹3Cr', '₹4Cr', '₹5Cr', '₹6Cr', '₹7Cr', '₹8Cr', '₹9Cr', '₹10Cr+'
];

const POSSESSION_OPTIONS = ["Ready to Move", "1 Year", "2 Year", "2 Year+"];
const PROPERTY_TYPES = ["Flat", "Duplex", "Penthouse", "Villas", "Plots", "Bungalows", "Commercial"];
const SORT_OPTIONS = ["Price: Low to High", "Price: High to Low"];

const HERO_IMG = '/hero-bg.jpeg';

const TRUST = [
  { icon: '🏙️', title: 'Prime Locations', sub: 'Best Neighborhoods' },
  { icon: '🛡️', title: 'Verified Properties', sub: '100% Legal & Secure' },
  { icon: '💎', title: 'Premium Quality', sub: 'World Class Construction' },
  { icon: '🎧', title: 'Expert Support', sub: 'Dedicated Advisors' },
];

export default function PremiumHero({ slides = [], currentSlide = 0, setCurrentSlide }) {
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState('Buy');
  const [isValuationOpen, setIsValuationOpen] = useState(false);
  
  // Filter States
  const [city, setCity] = useState('Ahmedabad');
  const [searchText, setSearchText] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('');
  const [selectedBHK, setSelectedBHK] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [possession, setPossession] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [locationsDict, setLocationsDict] = useState([]);

  // Slideshow Auto-advance logic
  React.useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length, setCurrentSlide]);

  React.useEffect(() => {
      const fetchDictionary = async () => {
          const { data } = await supabase.from('locations_dictionary').select('city, area');
          if (data) {
              setLocationsDict(data);
          }
      };
      fetchDictionary();
  }, []);

  const uniqueAreas = [...new Set(locationsDict.filter(d => (!city || d.city === city) && d.area).map(d => d.area))].sort();

  const doSearch = () => {
    const p = new URLSearchParams();
    p.set('purpose', activeType.toLowerCase());
    p.set('city', city || 'Ahmedabad');
    if (searchText) p.set('search', searchText);
    if (selectedLocality) p.set('search', selectedLocality);
    if (selectedBHK) p.set('bhk', selectedBHK);
    if (minBudget) p.set('minBudget', minBudget);
    if (maxBudget) p.set('maxBudget', maxBudget);
    if (possession) p.set('construction', possession);
    if (propertyType) p.set('variant', propertyType);
    if (sortBy) p.set('sortBy', sortBy);
    
    navigate(`/explore?${p.toString()}`);
  };

  const activeSlide = slides[currentSlide] || slides[0] || {};

  return (
    <section className="ph-root">
      {/* Background Slideshow */}
      <div className="ph-bg-image-container">
        {slides.length > 0 ? (
          slides.map((slide, idx) => (
            <img 
              key={idx}
              className={`ph-bg-image ${idx === currentSlide ? 'active' : ''}`} 
              src={slide.image || slide.image_url} 
              alt={slide.title || "Luxury Home"} 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: idx === currentSlide ? 1 : 0,
                transition: 'opacity 1.5s ease-in-out',
                zIndex: idx === currentSlide ? 1 : 0
              }}
            />
          ))
        ) : (
          <img className="ph-bg-image active" src={HERO_IMG} alt="Luxury Home" />
        )}
        <div className="ph-bg-overlay" />
      </div>

      {/* Main Content Wrapper */}
      <div className="ph-content">
        {/* Left Text Block - Dynamic Based on Slide */}
        <div className="ph-text-block">
          {activeSlide.tag && (
            <div className="ph-slide-tag" style={{
              background: 'rgba(227, 188, 90, 0.9)',
              color: '#000',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '700',
              display: 'inline-block',
              marginBottom: '15px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {activeSlide.tag}
            </div>
          )}
          <h1 className="ph-headline" style={{ textShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
            {activeSlide.title || "Find Your Perfect Home"}
          </h1>
          {activeSlide.price && (
            <div className="ph-slide-price" style={{
              fontSize: '2rem',
              color: '#E3BC5A',
              fontWeight: '700',
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Sparkles size={24} /> {activeSlide.price}
            </div>
          )}
        </div>

        {/* Bottom Modules Container */}
        <div className="ph-bottom-modules">
          {/* Search Bar Component */}
          <div className="ph-search-wrapper">
            {/* Tabs */}
            <div className="ph-search-tabs">
              <button className={`ph-tab ${activeType === 'Buy' ? 'active' : ''}`} onClick={() => setActiveType('Buy')}>
                <MapPin size={16} /> Buy
              </button>
              <button className={`ph-tab ${activeType === 'Rent' ? 'active' : ''}`} onClick={() => setActiveType('Rent')}>
                <Sparkles size={16} /> Rent
              </button>
            </div>

            <div className="ph-search-container">
              {/* Inputs Row */}
              <div className="ph-search-row">
                
                {/* City Section */}
                <div className="filter-section">
                  <div className="filter-icon-box">
                    <MapPin size={14} />
                  </div>
                  <div className="filter-info">
                    <label>Select City</label>
                    <div className="filter-select-wrapper">
                      <select value={city} onChange={(e) => {
                          setCity(e.target.value);
                          setSearchText('');
                      }}>
                          <option value="Ahmedabad">Ahmedabad</option>
                          <option value="Gandhinagar">Gandhinagar</option>
                      </select>
                      <span className="filter-value">{city || 'Ahmedabad'}</span>
                      <ChevronDown size={14} className="chevron" />
                    </div>
                  </div>
                </div>

                <div className="ph-divider-v" />

                <div className="filter-section" style={{ flex: '1.5' }}>
                  <div className="filter-icon-box">
                    <Search size={14} />
                  </div>
                  <div className="filter-info">
                    <label>Search by Area</label>
                    <div className="filter-select-wrapper">
                      <select value={searchText} onChange={(e) => setSearchText(e.target.value)}>
                          <option value="">All Areas</option>
                          {uniqueAreas.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <span className="filter-value">{searchText || 'All Areas'}</span>
                      <ChevronDown size={14} className="chevron" />
                    </div>
                  </div>
                </div>

                <div className="ph-divider-v" />

                {/* BHK Section */}
                <div className="filter-section">
                  <div className="filter-icon-box">
                    <LayoutGrid size={14} />
                  </div>
                  <div className="filter-info">
                    <label>Select BHK</label>
                    <div className="filter-select-wrapper">
                      <select value={selectedBHK} onChange={(e) => setSelectedBHK(e.target.value)}>
                          <option value="">BHK</option>
                          {BHK_OPTIONS_FULL.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <span className="filter-value">{selectedBHK || 'BHK'}</span>
                      <ChevronDown size={14} className="chevron" />
                    </div>
                  </div>
                </div>

                <div className="ph-divider-v" />

                {/* Budget Section */}
                <div className="filter-section">
                  <div className="filter-icon-box">
                    <Wallet size={14} />
                  </div>
                  <div className="filter-info">
                    <label>Budget Range</label>
                    <div className="filter-select-wrapper">
                      <select value={minBudget} onChange={(e) => setMinBudget(e.target.value)}>
                          <option value="">Min - Max</option>
                          {BUDGET_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <span className="filter-value">{minBudget || 'Min - Max'}</span>
                      <ChevronDown size={14} className="chevron" />
                    </div>
                  </div>
                </div>

                <div className="ph-divider-v" />

                {/* Property Type Section */}
                <div className="filter-section">
                  <div className="filter-icon-box">
                    <Home size={14} />
                  </div>
                  <div className="filter-info">
                    <label>Property Type</label>
                    <div className="filter-select-wrapper">
                      <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                          <option value="">Type</option>
                          {PROPERTY_TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <span className="filter-value">{propertyType || 'Type'}</span>
                      <ChevronDown size={14} className="chevron" />
                    </div>
                  </div>
                </div>

                <div className="ph-divider-v" />

                {/* Construction Section */}
                <div className="filter-section">
                  <div className="filter-icon-box">
                    <Building2 size={14} />
                  </div>
                  <div className="filter-info">
                    <label>Construction Status</label>
                    <div className="filter-select-wrapper">
                      <select value={possession} onChange={(e) => setPossession(e.target.value)}>
                          <option value="">Any Status</option>
                          {POSSESSION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <span className="filter-value">{possession || 'Any Status'}</span>
                      <ChevronDown size={14} className="chevron" />
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <button className="ph-search-btn-new" onClick={doSearch}>
                  <Search size={15} strokeWidth={2.5} />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>

          <div style={{ height: '30px' }} />

          {/* Localities Row */}
          <div className="ph-localities-container">
            <div className="ph-loc-header">
              <div className="ph-loc-icon-bg">
                <MapPin size={18} />
              </div>
              <span className="ph-loc-text">Popular Localities</span>
            </div>
            
            <div className="ph-loc-chips">
              {uniqueAreas.slice(0, 7).map(loc => (
                <button key={loc} className="ph-loc-chip-v2" onClick={()=>{setSearchText(loc);doSearch();}}>{loc}</button>
              ))}
              <button className="ph-loc-chip-v2 more" onClick={()=>{
                const p = new URLSearchParams();
                if (city) p.set('city', city);
                navigate(`/explore?${p.toString()}`);
              }}>More <ChevronDown size={14} /></button>
            </div>
          </div>
          
          <div className="ph-owner-cta-v2" onClick={() => navigate('/list-property')}>
             <Sparkles size={16} className="sparkle-icon" />
             <span className="cta-text">Are you a Property Owner?</span>
             <span className="cta-link">Sell / Rent for FREE</span>
             <ChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} />
          </div>

        </div>
      </div>

      <ValuationModal isOpen={isValuationOpen} onClose={() => setIsValuationOpen(false)} />
    </section>
  );
}
