import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { MapPin, Filter, Search, ChevronDown, X, Building, Home, Check } from 'lucide-react';

const PRICE_OPTIONS = [
    '₹25L', '₹50L', '₹75L', '₹1Cr', '₹1.5Cr', '₹2Cr', '₹3Cr', '₹5Cr', '₹7Cr', '₹10Cr+'
];

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
    bg: '#0C1512',
    card: '#1A1F1D',
    inputBg: '#252B29',
    text: '#E6ECE9',
    muted: '#8E9CA3',
    gold: '#E3BC5A',
    border: '#2A2F2D',
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

    // Fetch all approved data once
    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [{ data: properties }, { data: projects }] = await Promise.all([
                    supabase.from('properties').select('*').eq('status', 'approved'),
                    supabase.from('projects').select('*').eq('status', 'approved')
                ]);

                const propItems = (properties || []).map(p => ({
                    id: p.id,
                    isProject: false,
                    title: `${p.bhk || ''} ${p.property_type || ''} in ${p.project_name || p.locality || ''}`,
                    price: String(p.cost || ''),
                    priceLacs: dbPriceToLacs(p.cost),
                    image: (p.images && p.images.length > 0)
                        ? (typeof p.images[0] === 'string' ? p.images[0] : p.images[0]?.url)
                        : null,
                    location: p.locality || '',
                    city: p.city || '',
                    badge: (p.looking_to || 'sell').toUpperCase(),
                    bhk: p.bhk ? String(p.bhk).replace(/[^0-9]/g, '') : '',
                    amenities: p.amenities || [],
                    constructionStatus: p.construction_status || '',
                    meta: [p.built_up_area ? `${p.built_up_area} sq.ft` : null, p.furnishing].filter(Boolean),
                    displayPrice: p.cost ? `₹${Number(p.cost).toLocaleString('en-IN')}` : 'Call for Price'
                }));

                const projItems = (projects || []).map(p => {
                    const firstConfig = p.configurations?.[0];
                    const rawPrice = firstConfig?.price || p.plot_config?.[0]?.price_per_sqft;
                    return {
                        id: p.id,
                        isProject: true,
                        title: p.name || '',
                        price: String(rawPrice || ''),
                        priceLacs: dbPriceToLacs(rawPrice),
                        image: (p.images && p.images.length > 0)
                            ? (typeof p.images[0] === 'string' ? p.images[0] : p.images[0]?.url)
                            : null,
                        location: p.locality || '',
                        city: p.city || '',
                        developer: p.developer || '',
                        badge: 'NEW PROJECT',
                        bhk: firstConfig?.bedrooms ? String(firstConfig.bedrooms) : '',
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
            const bhkNums = selectedBHK.map(b => b.replace(/[^0-9]/g, ''));
            results = results.filter(item => item.bhk && bhkNums.includes(item.bhk));
        }

        // Budget filter
        const minLacs = priceStringToLacs(minBudget);
        const maxLacs = priceStringToLacs(maxBudget);
        if (minLacs !== null || maxLacs !== null) {
            results = results.filter(item => {
                const pLacs = item.priceLacs;
                if (pLacs === null) return true; // keep if unknown
                if (minLacs !== null && pLacs < minLacs) return false;
                if (maxLacs !== null && pLacs > maxLacs) return false;
                return true;
            });
        }

        // Amenities filter — item must have ALL selected amenities
        if (selectedAmenities.length > 0) {
            results = results.filter(item =>
                selectedAmenities.every(a =>
                    Array.isArray(item.amenities) && item.amenities.includes(a)
                )
            );
        }

        // Construction filter
        if (selectedConstruction.length > 0) {
            results = results.filter(item => 
                item.constructionStatus && selectedConstruction.includes(item.constructionStatus.toUpperCase())
            );
        }

        // Variant filter (Penthouse / Duplex)
        if (variant) {
            const v = variant.toLowerCase();
            results = results.filter(item => 
                item.title?.toLowerCase().includes(v) || 
                (item.meta && item.meta.some(m => m.toLowerCase().includes(v)))
            );
        }

        setFilteredItems(results);
    }, [allItems, city, searchText, selectedBHK, minBudget, maxBudget, selectedAmenities, selectedConstruction, variant]);

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
            {/* Top bar */}
            <div style={{ padding: '16px 32px', borderBottom: `1px solid ${THEME.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', background: THEME.card }}>
                <div>
                    <h1 style={{ fontSize: '1.4rem', margin: 0, color: THEME.gold, fontWeight: '700' }}>
                        {city ? `Properties in ${city}` : 'Explore Properties & Projects'}
                    </h1>
                    <p style={{ color: THEME.muted, margin: '4px 0 0 0', fontSize: '0.9rem' }}>
                        {loading ? 'Searching...' : `${filteredItems.length} result${filteredItems.length !== 1 ? 's' : ''} found`}
                    </p>
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    style={{
                        padding: '10px 20px', background: showFilters ? THEME.gold : THEME.inputBg,
                        border: `1px solid ${showFilters ? THEME.gold : THEME.border}`,
                        color: showFilters ? '#000' : THEME.text, borderRadius: '10px',
                        display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                        fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s'
                    }}
                >
                    <Filter size={16} /> Filters
                    {activeFilterCount > 0 && (
                        <span style={{ background: THEME.gold, color: '#000', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '800' }}>
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </div>

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

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
                <div style={{ padding: '12px 32px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ color: THEME.muted, fontSize: '0.8rem' }}>Active filters:</span>
                    {city && <Chip label={city} onRemove={() => setCity('')} />}
                    {searchText && <Chip label={`"${searchText}"`} onRemove={() => setSearchText('')} />}
                    {selectedBHK.map(b => <Chip key={b} label={b} onRemove={() => toggleBHK(b)} />)}
                    {minBudget && <Chip label={`Min: ${minBudget}`} onRemove={() => setMinBudget('')} />}
                    {maxBudget && <Chip label={`Max: ${maxBudget}`} onRemove={() => setMaxBudget('')} />}
                    {selectedAmenities.map(a => <Chip key={a} label={a} onRemove={() => toggleAmenity(a)} />)}
                    {selectedConstruction.map(c => <Chip key={c} label={c} onRemove={() => toggleConstruction(c)} />)}
                    {variant && <Chip label={variant} onRemove={() => setVariant('')} />}
                    <button onClick={clearAll} style={{ background: 'none', border: 'none', color: THEME.gold, cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600', padding: '0 4px' }}>Clear All</button>
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
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <div style={{
                                    background: THEME.card, borderRadius: '16px', overflow: 'hidden',
                                    border: `1px solid ${THEME.border}`, transition: 'transform 0.2s, box-shadow 0.2s',
                                    height: '100%', display: 'flex', flexDirection: 'column',
                                    cursor: 'pointer'
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 30px rgba(0,0,0,0.35)`; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                                >
                                    {/* Image */}
                                    <div style={{ height: '220px', background: THEME.inputBg, position: 'relative', overflow: 'hidden' }}>
                                        {item.image ? (
                                            <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: THEME.muted }}>
                                                {item.isProject ? <Building size={40} opacity={0.3} /> : <Home size={40} opacity={0.3} />}
                                            </div>
                                        )}
                                        <div style={{
                                            position: 'absolute', top: '12px', right: '12px',
                                            background: item.isProject ? `${THEME.gold}DD` : 'rgba(0,0,0,0.7)',
                                            color: item.isProject ? '#000' : THEME.text,
                                            padding: '4px 12px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '700',
                                            backdropFilter: 'blur(4px)', letterSpacing: '0.5px'
                                        }}>
                                            {item.badge}
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: THEME.gold, marginBottom: '4px' }}>
                                            {item.displayPrice}
                                        </div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: THEME.text, margin: '0 0 8px', lineHeight: '1.4' }}>
                                            {item.title}
                                        </h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: THEME.muted, fontSize: '0.85rem', marginBottom: '14px' }}>
                                            <MapPin size={13} color={THEME.gold} />
                                            {item.location}{item.city ? `, ${item.city}` : ''}
                                        </div>
                                        <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {item.meta.map((m, i) => (
                                                <span key={i} style={{ background: THEME.inputBg, padding: '5px 10px', borderRadius: '6px', fontSize: '0.78rem', color: THEME.muted }}>
                                                    {m}
                                                </span>
                                            ))}
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
