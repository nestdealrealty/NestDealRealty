import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { MapPin, Filter, Search, ChevronDown, X, Building, Home, Check, Building2, Bed, User, ArrowRight } from 'lucide-react';
import './Home.css';

const BUDGET_OPTIONS = [
    '₹20L', '₹30L', '₹40L', '₹50L', '₹60L', '₹70L', '₹80L', '₹90L', 
    '₹1Cr', '₹2Cr', '₹3Cr', '₹4Cr', '₹5Cr', '₹6Cr', '₹7Cr', '₹8Cr', '₹9Cr', '₹10Cr+'
];

const BHK_OPTIONS_FULL = [
    '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', '6 BHK', '7 BHK',
    '3 BHK Penthouse', '4 BHK Penthouse', '5 BHK Penthouse', '6 BHK Penthouse', '7 BHK Penthouse',
    '3 BHK Duplex Penthouse', '4 BHK Duplex Penthouse', '5 BHK Duplex Penthouse', '6 BHK Duplex Penthouse', '7 BHK Duplex Penthouse'
];

const LOCALITIES_AHMEDABAD = [
    "Bopal", "Satellite", "Prahlad Nagar", "Gota", "Thaltej", "Bodakdev", "SG Highway", "Ambawadi", "Vastrapur", "Navrangpura", 
    "Naranpura", "Memnagar", "South Bopal", "Shilaj", "Science City", "Chandkheda", "Motera", "Sabarmati", "Paldi", "Vasna", 
    "Maninagar", "Chandlodiya", "Ranip", "Vejalpur", "Jodhpur", "Gurukul", "Usmanpura", "Shahibaug", "Ellisbridge", "Ashram Road", 
    "C G Road", "Income Tax", "Nikol", "Naroda", "Odhav", "Isanpur", "Vatva", "Lambha", "Narol", "Sarkhej", 
    "Juhapura", "Makarba", "Shela", "Sanand", "Adalaj", "Zundal", "Tragad", "Khoraj", "Vaishno Devi", "Kathwada"
];

const POSSESSION_OPTIONS = ["Ready to Move", "1 Year", "2 Year", "2 Year+"];
const PROPERTY_TYPES = ["Flat", "Duplex", "Penthouse", "Villas", "Plots", "Bungalows", "Commercial"];
const CONSTRUCTION_STATUSES = ["Under Construction", "Ready to Move"];
const SORT_OPTIONS = ["Price: Low to High", "Price: High to Low"];

const ALL_AMENITY_NAMES = [
    "Garden Play Area", "Lush Green Garden", "Box Cricket", "Gazebo", "Terrace Garden",
    "Gym / Aerobic Studio", "Banquet Hall", "Security Cabin", "CCTV Camera", "Allotted Car Parking",
    "High-Speed Elevator", "Fire Safety", "Power Backup for Common Area", "Toddler Play Area",
    "Jogging Track", "Indoor Games", "OutDoor Games", "Multipurpose Court", "Yoga Space",
    "Entrance Foyer", "Swimming Pool", "Club House", "Children Play Area", "Senior Citizen Area",
    "Gated Community", "CCTV", "Security Guard", "Intercom Facility", "Private Pool",
    "Private Terrace", "Party Lawn", "Two-Wheeler Parking", "Kids Play Room", "Virtual Golf"
];

// Convert display price string (e.g. "₹1.5Cr") to a numeric value in lacs
function priceStringToLacs(str) {
    if (!str) return null;
    const clean = str.replace('₹', '').replace('+', '').trim();
    if (clean.includes('Cr')) return parseFloat(clean) * 100;
    if (clean.includes('L')) return parseFloat(clean);
    return null;
}

// Convert a raw price string from DB (e.g. "₹85,00,000" or "85 Lac" or "1.2 Cr") to lacs
function dbPriceToLacs(rawPrice) {
    if (!rawPrice) return null;
    const str = String(rawPrice).replace(/,/g, '').replace('₹', '').trim().toLowerCase();
    const crMatch = str.match(/([\d.]+)\s*cr/);
    if (crMatch) return parseFloat(crMatch[1]) * 100;
    const lacMatch = str.match(/([\d.]+)\s*l/);
    if (lacMatch) return parseFloat(lacMatch[1]);
    // bare number (assume rupees)
    const num = parseFloat(str);
    if (!isNaN(num) && num > 1000000) return num / 100000; // rupees to lacs
    if (!isNaN(num)) return num; // already in lacs
    return null;
}

const THEME = {
    bg: '#E9F0E8',
    card: '#FFFFFF',
    inputBg: '#FFFFFF',
    text: '#1A1A1A',
    muted: '#757575',
    gold: '#C4A96C',
    border: 'rgba(0,0,0,0.06)',
};

const ExplorePage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [allItems, setAllItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Local filter states (synced from URL)
    const [city, setCity] = useState(searchParams.get('city') || '');
    const [searchText, setSearchText] = useState(searchParams.get('search') || '');
    const [selectedBHK, setSelectedBHK] = useState(
        searchParams.get('bhk') ? searchParams.get('bhk').split(',') : []
    );
    const [minBudget, setMinBudget] = useState(searchParams.get('minBudget') || '');
    const [maxBudget, setMaxBudget] = useState(searchParams.get('maxBudget') || '');
    const [selectedAmenities, setSelectedAmenities] = useState(
        searchParams.get('amenities') ? searchParams.get('amenities').split('|') : []
    );
    const [selectedConstruction, setSelectedConstruction] = useState(
        searchParams.get('construction') ? searchParams.get('construction').split(',') : []
    );
    const [variant, setVariant] = useState(searchParams.get('variant') || '');

    const [showFilters, setShowFilters] = useState(false);
    const [amenitySearch, setAmenitySearch] = useState('');
    const [budgetOpen, setBudgetOpen] = useState(null);
    const [sortBy, setSortBy] = useState('');
    const [selectedLocality, setSelectedLocality] = useState('');

    // Fetch all approved data once
    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [{ data: properties }, { data: projects }] = await Promise.all([
                    supabase.from('properties').select('*').eq('status', 'approved'),
                    supabase.from('projects').select('*').eq('status', 'approved')
                ]);

                const propItems = (properties || []).map(p => {
                    let configLabel = p.bhk || p.property_type || 'Property';
                    if (p.bhk && !isNaN(p.bhk) && !p.bhk.includes('BHK')) {
                        configLabel = `${p.bhk} BHK`;
                    }
                    return {
                        id: p.id,
                        isProject: false,
                        title: p.project_name || `Property in ${p.locality}`,
                        listingTitle: p.project_name || `Property in ${p.locality}`,
                        price: p.cost ? `₹${Number(p.cost).toLocaleString('en-IN')}` : 'Call for Price',
                        priceLacs: dbPriceToLacs(p.cost),
                        image: (p.images && p.images.length > 0)
                            ? (typeof p.images[0] === 'string' ? p.images[0] : (p.images[0]?.url || p.images[0]))
                            : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80',
                        location: p.locality || '',
                        city: p.city || '',
                        developer: p.contact_name || 'Individual Seller',
                        badge: (p.looking_to || 'sell').toUpperCase(),
                        bhk: p.bhk ? String(p.bhk).replace(/[^0-9]/g, '') : '',
                        config: configLabel,
                        type: p.property_type || '',
                        amenities: p.amenities || [],
                        constructionStatus: p.construction_status || '',
                        meta: [p.built_up_area ? `${p.built_up_area} sq.ft` : null, p.furnishing].filter(Boolean),
                        displayPrice: p.cost ? `₹${Number(p.cost).toLocaleString('en-IN')}` : 'Call for Price'
                    };
                });

                const projItems = (projects || []).map(p => {
                    // Build config label from bedrooms field across all 3 config arrays
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

                    const firstConfig = p.configurations?.[0];
                    const rawPrice = firstConfig?.price || p.plot_config?.[0]?.price_per_sqft;

                    return {
                        id: p.id,
                        isProject: true,
                        title: p.name || '',
                        listingTitle: p.name || '',
                        price: rawPrice || 'Call for Price',
                        priceLacs: dbPriceToLacs(rawPrice),
                        image: (p.images && p.images.length > 0)
                            ? (typeof p.images[0] === 'string' ? p.images[0] : (p.images[0]?.url || p.images[0]))
                            : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
                        location: p.locality || '',
                        city: p.city || '',
                        developer: p.developer || 'NestDeal',
                        badge: 'NEW PROJECT',
                        bhk: firstConfig?.bedrooms ? String(firstConfig.bedrooms) : '',
                        config: configText,
                        type: p.property_type || '',
                        amenities: p.amenities || [],
                        constructionStatus: p.construction_status || '',
                        meta: [p.property_type || 'Project', p.developer].filter(Boolean),
                        displayPrice: rawPrice || 'Call for Price'
                    };
                });

                setAllItems([...propItems, ...projItems]);
            } catch (err) {
                console.error('Explore fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    // Apply filters whenever allItems or filter states change
    useEffect(() => {
        let results = [...allItems];

        // City filter
        if (city) {
            results = results.filter(item =>
                item.city?.toLowerCase().includes(city.toLowerCase())
            );
        }

        // Text search — matches title, location, developer
        if (searchText) {
            const q = searchText.toLowerCase();
            results = results.filter(item =>
                item.title?.toLowerCase().includes(q) ||
                item.location?.toLowerCase().includes(q) ||
                item.developer?.toLowerCase().includes(q)
            );
        }

        // BHK filter
        if (selectedBHK.length > 0) {
            results = results.filter(item => {
                const itemConfig = String(item.config || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                return selectedBHK.some(b => {
                    const sel = b.toLowerCase().replace(/[^a-z0-9]/g, '');
                    return itemConfig.includes(sel) || sel.includes(itemConfig);
                });
            });
        }

        // Budget Filter
        const minLacs = priceStringToLacs(minBudget);
        const maxLacs = priceStringToLacs(maxBudget);
        if (minLacs !== null || maxLacs !== null) {
            results = results.filter(item => {
                const pLacs = item.priceLacs;
                if (pLacs === null) return false; 
                if (minLacs !== null && pLacs < minLacs) return false;
                if (maxLacs !== null && maxBudget !== '₹10Cr+' && pLacs > maxLacs) return false;
                return true;
            });
        }

        // Possession & Construction Status
        if (selectedConstruction.length > 0) {
            results = results.filter(item => {
                const status = (item.constructionStatus || '').toUpperCase();
                return selectedConstruction.some(s => status.includes(s.toUpperCase()));
            });
        }

        // Property Type / Variant
        if (variant) {
            const v = variant.toLowerCase();
            results = results.filter(item => 
                (item.config || '').toLowerCase().includes(v) ||
                (item.type || '').toLowerCase().includes(v)
            );
        }

        // Locality
        if (selectedLocality) {
            results = results.filter(item => 
                (item.location || '').toLowerCase().includes(selectedLocality.toLowerCase())
            );
        }

        // Sorting
        if (sortBy === "Price: Low to High") {
            results.sort((a, b) => (a.priceLacs || 0) - (b.priceLacs || 0));
        } else if (sortBy === "Price: High to Low") {
            results.sort((a, b) => (b.priceLacs || 0) - (a.priceLacs || 0));
        }

        setFilteredItems(results);
    }, [allItems, city, searchText, selectedBHK, minBudget, maxBudget, selectedConstruction, variant, sortBy, selectedLocality]);

    const toggleBHK = (bhk) => {
        setSelectedBHK(prev => prev.includes(bhk) ? prev.filter(b => b !== bhk) : [...prev, bhk]);
    };

    const toggleAmenity = (name) => {
        setSelectedAmenities(prev => prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]);
    };

    const toggleConstruction = (status) => {
        setSelectedConstruction(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]);
    };

    const clearAll = () => {
        setCity('');
        setSearchText('');
        setSelectedBHK([]);
        setMinBudget('');
        setMaxBudget('');
        setSelectedAmenities([]);
        setSelectedConstruction([]);
        setVariant('');
    };

    const activeFilterCount = [
        city, searchText,
        ...selectedBHK,
        minBudget, maxBudget,
        ...selectedAmenities,
        ...selectedConstruction,
        variant
    ].filter(Boolean).length;

    return (
        <div style={{ background: THEME.bg, minHeight: '100vh', color: THEME.text, fontFamily: 'Outfit, sans-serif' }}>
            {/* Header Section */}
            <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '32px 24px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: THEME.muted, marginBottom: '16px' }}>
                    <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
                    <span>&gt;</span>
                    <span>Properties</span>
                    <span>&gt;</span>
                    <span style={{ color: THEME.text }}>{city || 'All Cities'}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div>
                        <h1 style={{ 
                            fontSize: '2.5rem', 
                            fontFamily: "'Playfair Display', serif", 
                            margin: 0, 
                            color: '#1A1A1A',
                            fontWeight: '700'
                        }}>
                            {city ? `Properties in ${city}` : 'Explore Properties'}
                        </h1>
                        <p style={{ color: THEME.muted, margin: '8px 0 0 0', fontSize: '1rem' }}>
                            {loading ? 'Searching...' : `${filteredItems.length} results found`}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        style={{
                            padding: '10px 24px', background: '#FFFFFF',
                            border: `1px solid ${THEME.border}`,
                            color: THEME.text, borderRadius: '12px',
                            display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
                            fontWeight: '600', fontSize: '0.9rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                        }}
                    >
                        <Filter size={18} /> Filters
                    </button>
                </div>

                {/* Active Chips */}
                {(activeFilterCount > 0) && (
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px', alignItems: 'center' }}>
                        <span style={{ color: THEME.muted, fontSize: '0.9rem' }}>Active filters:</span>
                        {city && <Chip label={city} onRemove={() => setCity('')} />}
                        {selectedBHK.map(b => <Chip key={b} label={b} onRemove={() => toggleBHK(b)} />)}
                        <button onClick={clearAll} style={{ background: 'none', border: 'none', color: THEME.gold, cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', marginLeft: '8px' }}>Clear All</button>
                    </div>
                )}

                {/* Quick Filters Row */}
                {/* Pill Filters Row */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    marginBottom: '32px',
                    overflowX: 'auto',
                    paddingBottom: '8px',
                    scrollbarWidth: 'none'
                }}>
                    {/* City Pill */}
                    <div className="filter-pill">
                        <select value={city} onChange={(e) => setCity(e.target.value)}>
                            <option value="">Ahmedabad</option>
                            <option value="Ahmedabad">Ahmedabad</option>
                            <option value="Gandhinagar">Gandhinagar</option>
                        </select>
                        <span style={{ fontSize: '0.85rem' }}>{city || 'Ahmedabad'}</span>
                        <ChevronDown size={14} className="pill-chevron" />
                    </div>

                    {/* Search Pill */}
                    <div className="filter-pill search-pill" style={{ flex: '1', minWidth: '220px' }}>
                        <Search size={14} style={{ color: THEME.muted }} />
                        <input 
                            type="text" 
                            placeholder="Location, Builder..." 
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', marginLeft: '8px', fontSize: '0.85rem' }}
                        />
                    </div>

                    {/* Localities Pill */}
                    <div className="filter-pill">
                        <select value={selectedLocality} onChange={(e) => setSelectedLocality(e.target.value)}>
                            <option value="">Localities</option>
                            {LOCALITIES_AHMEDABAD.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                        </select>
                        <span>{selectedLocality || 'Localities'}</span>
                        <ChevronDown size={14} className="pill-chevron" />
                    </div>

                    {/* BHK Pill */}
                    <div className="filter-pill">
                        <select value={selectedBHK[0] || ''} onChange={(e) => setSelectedBHK(e.target.value ? [e.target.value] : [])}>
                            <option value="">BHK</option>
                            {BHK_OPTIONS_FULL.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <span>{selectedBHK[0] || 'BHK'}</span>
                        <ChevronDown size={14} className="pill-chevron" />
                    </div>

                    {/* Budget Min Pill */}
                    <div className="filter-pill">
                        <select value={minBudget} onChange={(e) => setMinBudget(e.target.value)}>
                            <option value="">Min Budget</option>
                            {BUDGET_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <span>{minBudget || 'Min'}</span>
                        <ChevronDown size={14} className="pill-chevron" />
                    </div>

                    {/* Budget Max Pill */}
                    <div className="filter-pill">
                        <select value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)}>
                            <option value="">Max Budget</option>
                            {BUDGET_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <span>{maxBudget || 'Max'}</span>
                        <ChevronDown size={14} className="pill-chevron" />
                    </div>

                    {/* Possession Pill */}
                    <div className="filter-pill">
                        <select value={selectedConstruction[0] || ''} onChange={(e) => setSelectedConstruction(e.target.value ? [e.target.value] : [])}>
                            <option value="">Possession</option>
                            {POSSESSION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <span>{selectedConstruction[0] || 'Possession'}</span>
                        <ChevronDown size={14} className="pill-chevron" />
                    </div>

                    {/* Property Type Pill */}
                    <div className="filter-pill">
                        <select value={variant} onChange={(e) => setVariant(e.target.value)}>
                            <option value="">Property Type</option>
                            {PROPERTY_TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <span>{variant || 'Type'}</span>
                        <ChevronDown size={14} className="pill-chevron" />
                    </div>

                    {/* Sort By Pill */}
                    <div className="filter-pill">
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="">Sort By</option>
                            {SORT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <span>{sortBy.split(':')[1] || 'Sort'}</span>
                        <ChevronDown size={14} className="pill-chevron" />
                    </div>
                </div>
            </div>

            <style>{`
                .filter-pill {
                    background: #FFFFFF;
                    border: 1px solid ${THEME.border};
                    border-radius: 30px;
                    padding: 8px 18px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    white-space: nowrap;
                    position: relative;
                    min-height: 44px;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.03);
                    transition: all 0.2s;
                }
                .filter-pill:hover {
                    border-color: ${THEME.gold};
                    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
                }
                .filter-pill select {
                    position: absolute;
                    inset: 0;
                    opacity: 0;
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                    z-index: 2;
                }
                .filter-pill span {
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: ${THEME.text};
                }
                .pill-chevron {
                    color: ${THEME.muted};
                }
                .search-pill {
                    padding: 8px 20px;
                    cursor: text;
                }
            `}</style>

            {/* Filter Panel */}
            {showFilters && (
                <div style={{ background: THEME.card, borderBottom: `1px solid ${THEME.border}`, padding: '24px 32px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>

                        {/* City */}
                        <div>
                            <label style={{ fontSize: '0.75rem', color: THEME.muted, textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>City</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {['Ahmedabad', 'Gandhinagar'].map(c => (
                                    <button key={c} onClick={() => setCity(city === c ? '' : c)}
                                        style={{
                                            flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem',
                                            background: city === c ? THEME.gold : THEME.inputBg,
                                            color: city === c ? '#000' : THEME.text,
                                            border: `1px solid ${city === c ? THEME.gold : THEME.border}`,
                                            transition: 'all 0.2s'
                                        }}
                                    >{c}</button>
                                ))}
                            </div>
                        </div>

                        {/* Search Text */}
                        <div>
                            <label style={{ fontSize: '0.75rem', color: THEME.muted, textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>Search by Area / Project</label>
                            <div style={{ display: 'flex', alignItems: 'center', background: THEME.inputBg, borderRadius: '8px', border: `1px solid ${THEME.border}`, padding: '0 12px' }}>
                                <Search size={16} color={THEME.muted} />
                                <input
                                    type="text" value={searchText}
                                    onChange={e => setSearchText(e.target.value)}
                                    placeholder="Area / project / builder"
                                    style={{ background: 'none', border: 'none', outline: 'none', color: THEME.text, padding: '10px 8px', width: '100%', fontSize: '0.9rem' }}
                                />
                                {searchText && <X size={14} color={THEME.muted} style={{ cursor: 'pointer' }} onClick={() => setSearchText('')} />}
                            </div>
                        </div>

                        {/* BHK */}
                        <div>
                            <label style={{ fontSize: '0.75rem', color: THEME.muted, textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>BHK</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', '6 BHK', '7 BHK'].map(bhk => (
                                    <button key={bhk} onClick={() => toggleBHK(bhk)}
                                        style={{
                                            padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600',
                                            background: selectedBHK.includes(bhk) ? THEME.gold : THEME.inputBg,
                                            color: selectedBHK.includes(bhk) ? '#000' : THEME.text,
                                            border: `1px solid ${selectedBHK.includes(bhk) ? THEME.gold : THEME.border}`,
                                            transition: 'all 0.2s'
                                        }}
                                    >{bhk}</button>
                                ))}
                            </div>
                        </div>

                        {/* Budget */}
                        <div>
                            <label style={{ fontSize: '0.75rem', color: THEME.muted, textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>Budget Range</label>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <div style={{ position: 'relative', flex: 1 }}>
                                    <div onClick={() => setBudgetOpen(budgetOpen === 'min' ? null : 'min')}
                                        style={{ background: THEME.inputBg, border: `1px solid ${minBudget ? THEME.gold : THEME.border}`, borderRadius: '8px', padding: '10px 12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                                        <span style={{ color: minBudget ? THEME.gold : THEME.muted }}>{minBudget || 'Min'}</span>
                                        <ChevronDown size={14} color={THEME.muted} />
                                    </div>
                                    {budgetOpen === 'min' && (
                                        <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 50, background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: '10px', width: '140px', maxHeight: '200px', overflowY: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.4)', marginTop: '4px' }}>
                                            {PRICE_OPTIONS.map(p => (
                                                <div key={p} onClick={() => { setMinBudget(p); setBudgetOpen(null); }}
                                                    style={{ padding: '10px 14px', cursor: 'pointer', fontSize: '0.85rem', color: minBudget === p ? THEME.gold : THEME.text, background: minBudget === p ? `${THEME.gold}15` : 'transparent' }}
                                                    onMouseEnter={e => e.target.style.background = THEME.inputBg}
                                                    onMouseLeave={e => e.target.style.background = minBudget === p ? `${THEME.gold}15` : 'transparent'}
                                                >{p}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <span style={{ color: THEME.muted }}>–</span>
                                <div style={{ position: 'relative', flex: 1 }}>
                                    <div onClick={() => setBudgetOpen(budgetOpen === 'max' ? null : 'max')}
                                        style={{ background: THEME.inputBg, border: `1px solid ${maxBudget ? THEME.gold : THEME.border}`, borderRadius: '8px', padding: '10px 12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                                        <span style={{ color: maxBudget ? THEME.gold : THEME.muted }}>{maxBudget || 'Max'}</span>
                                        <ChevronDown size={14} color={THEME.muted} />
                                    </div>
                                    {budgetOpen === 'max' && (
                                        <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 50, background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: '10px', width: '140px', maxHeight: '200px', overflowY: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.4)', marginTop: '4px' }}>
                                            {PRICE_OPTIONS.map(p => (
                                                <div key={p} onClick={() => { setMaxBudget(p); setBudgetOpen(null); }}
                                                    style={{ padding: '10px 14px', cursor: 'pointer', fontSize: '0.85rem', color: maxBudget === p ? THEME.gold : THEME.text, background: maxBudget === p ? `${THEME.gold}15` : 'transparent' }}
                                                    onMouseEnter={e => e.target.style.background = THEME.inputBg}
                                                    onMouseLeave={e => e.target.style.background = maxBudget === p ? `${THEME.gold}15` : 'transparent'}
                                                >{p}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ fontSize: '0.75rem', color: THEME.muted, textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>
                                Amenities {selectedAmenities.length > 0 && <span style={{ color: THEME.gold }}>({selectedAmenities.length} selected)</span>}
                            </label>
                            <div style={{ background: THEME.inputBg, border: `1px solid ${THEME.border}`, borderRadius: '10px', padding: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', background: THEME.bg, borderRadius: '6px', padding: '0 10px', marginBottom: '10px', border: `1px solid ${THEME.border}` }}>
                                    <Search size={14} color={THEME.muted} />
                                    <input type="text" value={amenitySearch} onChange={e => setAmenitySearch(e.target.value)}
                                        placeholder="Search amenity..."
                                        style={{ background: 'none', border: 'none', outline: 'none', color: THEME.text, padding: '8px', fontSize: '0.85rem', width: '100%' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '120px', overflowY: 'auto' }}>
                                    {ALL_AMENITY_NAMES.filter(a => a.toLowerCase().includes(amenitySearch.toLowerCase())).map(name => (
                                        <button key={name} onClick={() => toggleAmenity(name)}
                                            style={{
                                                padding: '5px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500',
                                                background: selectedAmenities.includes(name) ? `${THEME.gold}20` : THEME.bg,
                                                color: selectedAmenities.includes(name) ? THEME.gold : THEME.muted,
                                                border: `1px solid ${selectedAmenities.includes(name) ? THEME.gold : THEME.border}`,
                                                display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.15s'
                                            }}
                                        >
                                            {selectedAmenities.includes(name) && <Check size={10} strokeWidth={3} />}
                                            {name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Construction Status */}
                        <div>
                            <label style={{ fontSize: '0.75rem', color: THEME.muted, textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>Construction Status</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {['READY TO MOVE', 'UNDER CONSTRUCTION'].map(status => (
                                    <button key={status} onClick={() => toggleConstruction(status)}
                                        style={{
                                            padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600',
                                            background: selectedConstruction.includes(status) ? THEME.gold : THEME.inputBg,
                                            color: selectedConstruction.includes(status) ? '#000' : THEME.text,
                                            border: `1px solid ${selectedConstruction.includes(status) ? THEME.gold : THEME.border}`,
                                            transition: 'all 0.2s'
                                        }}
                                    >{status}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Filter footer */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px', maxWidth: '1200px', margin: '20px auto 0' }}>
                        <button onClick={clearAll} style={{ padding: '10px 24px', background: 'none', border: `1px solid ${THEME.border}`, color: THEME.muted, borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                            Clear All
                        </button>
                        <button onClick={() => setShowFilters(false)} style={{ padding: '10px 28px', background: THEME.gold, border: 'none', color: '#000', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}


            {/* Results grid */}
            <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '24px 24px 60px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '80px', color: THEME.muted }}>
                        <div style={{ fontSize: '1.1rem', color: THEME.gold }}>Searching properties...</div>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 20px', background: THEME.card, borderRadius: '20px', border: `1px dashed ${THEME.border}` }}>
                        <Search size={48} color={THEME.gold} style={{ marginBottom: '20px', opacity: 0.7 }} />
                        <h3 style={{ color: THEME.text, fontSize: '1.3rem', margin: '0 0 10px' }}>No properties found</h3>
                        <p style={{ color: THEME.muted, margin: '0 0 24px' }}>Try adjusting or clearing your filters.</p>
                        <button onClick={clearAll} style={{ padding: '10px 28px', background: THEME.gold, border: 'none', color: '#000', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>
                            Clear All Filters
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                        {filteredItems.map(item => (
                            <Link
                                to={item.isProject ? `/project/${item.id}` : `/property/${item.id}`}
                                key={`${item.isProject ? 'proj' : 'prop'}-${item.id}`}
                                className="premium-prop-card"
                            >
                                <div className="premium-img-section">
                                    <img src={item.image} alt={item.listingTitle} loading="lazy" />
                                    <div className="premium-gradient-overlay"></div>
                                    <div className="premium-img-text">
                                        <h4 className="premium-title">{item.listingTitle}</h4>
                                        <div className="premium-developer">
                                            {item.isProject ? <Building2 size={14} /> : <User size={14} />}
                                            by {item.developer || 'NestDeal'}
                                        </div>
                                    </div>
                                </div>
                                <div className="premium-details-section">
                                    <div className="detail-line">
                                        <Bed size={14} /> <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '500', color: '#555' }}>{item.config}</span>
                                    </div>
                                    <div className="detail-line">
                                        <MapPin size={14} /> <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '500', color: '#555' }}>{item.location}, {item.city}</span>
                                    </div>
                                    <div className="price-row">
                                        <div className="premium-price-value" style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1A1A1A' }}>
                                            ₹ {item.displayPrice} <sup style={{ fontSize: '0.7rem', verticalAlign: 'super', color: '#FF0000' }}>*</sup>
                                        </div>
                                        <div className="view-details-btn" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                                            View Details <ArrowRight size={12} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Small reusable chip for active filters
const Chip = ({ label, onRemove }) => (
    <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        background: 'rgba(227, 188, 90, 0.12)', border: '1px solid rgba(227, 188, 90, 0.3)',
        color: '#E3BC5A', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '500'
    }}>
        {label}
        <X size={12} style={{ cursor: 'pointer', opacity: 0.7 }} onClick={onRemove} />
    </div>
);

export default ExplorePage;
