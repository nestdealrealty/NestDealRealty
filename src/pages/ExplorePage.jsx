import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { MapPin, Filter, Search, ChevronRight, Home, Building } from 'lucide-react';

const ExplorePage = () => {
    const [searchParams] = useSearchParams();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters from URL
    const cityFilter = searchParams.get('city'); 
    const typeFilter = searchParams.get('type'); 
    const lookingToFilter = searchParams.get('looking_to'); 

    useEffect(() => {
        fetchData();
    }, [searchParams]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // First, query Properties
            let propQuery = supabase.from('properties').select('*').eq('status', 'approved');
            if (cityFilter) propQuery = propQuery.ilike('city', `%${cityFilter}%`);
            if (typeFilter) propQuery = propQuery.ilike('property_type', `%${typeFilter}%`);
            if (lookingToFilter) propQuery = propQuery.eq('looking_to', lookingToFilter);

            const { data: properties, error: propError } = await propQuery;
            if (propError) throw propError;

            let allItems = (properties || []).map(p => ({
                id: p.id,
                isProject: false,
                title: `${p.bhk || ''} ${p.property_type || ''} in ${p.project_name || p.locality || ''}`,
                price: `₹${Number(p.cost).toLocaleString('en-IN')}${p.looking_to === 'rent' ? '/mo' : ''}`,
                image: (p.images && p.images.length > 0) ? (typeof p.images[0] === 'string' ? p.images[0] : p.images[0].url) : null,
                location: p.locality,
                city: p.city,
                badge: (p.looking_to || 'sell').toUpperCase(),
                meta: [p.built_up_area ? `${p.built_up_area} sq.ft` : null, p.furnishing].filter(Boolean)
            }));

            // Only query Projects if not exclusively looking for rent/PG
            if (lookingToFilter !== 'rent' && lookingToFilter !== 'pg') {
                let projQuery = supabase.from('projects').select('*').eq('status', 'approved');
                if (cityFilter) projQuery = projQuery.ilike('city', `%${cityFilter}%`);
                if (typeFilter) projQuery = projQuery.ilike('property_type', `%${typeFilter}%`);
                
                const { data: projects, error: projError } = await projQuery;
                if (projError) throw projError;

                const projectItems = (projects || []).map(p => {
                    let priceStr = 'Call for Price';
                    if (p.configurations && p.configurations.length > 0) {
                        priceStr = p.configurations[0].price || priceStr;
                    }
                    if (p.property_type === 'Plots' && p.plot_config && p.plot_config.length > 0) {
                        priceStr = `₹${p.plot_config[0].price_per_sqft}/sqft`;
                    }

                    return {
                        id: p.id,
                        isProject: true,
                        title: p.name,
                        price: priceStr,
                        image: (p.images && p.images.length > 0) ? (typeof p.images[0] === 'string' ? p.images[0] : p.images[0].url) : null,
                        location: p.locality,
                        city: p.city,
                        badge: 'NEW PROJECT',
                        meta: [p.property_type || 'Project', p.developer].filter(Boolean)
                    };
                });
                
                allItems = [...allItems, ...projectItems];
            }

            setItems(allItems);
        } catch (err) {
            console.error('Error fetching data:', err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#0C1512', minHeight: '100vh', color: '#E6ECE9', fontFamily: 'Outfit, sans-serif' }}>
            <div style={{ padding: '20px 40px', borderBottom: '1px solid #2A2F2D', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#E3BC5A' }}>
                        {cityFilter ? `Properties in ${cityFilter}` : 'Explore Properties'}
                    </h1>
                    <p style={{ color: '#8E9CA3', margin: '5px 0 0 0' }}>
                        {items.length} results found
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button style={{ padding: '10px 20px', background: '#1A1F1D', border: '1px solid #2A2F2D', color: '#E6ECE9', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Filter size={18} /> Filters
                    </button>
                </div>
            </div>

            <div className="container" style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#8E9CA3' }}>Loading properties...</div>
                ) : items.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px', background: '#1A1F1D', borderRadius: '12px', border: '1px dashed #2A2F2D' }}>
                        <Search size={40} color="#E3BC5A" style={{ marginBottom: '20px' }} />
                        <h3>No properties found</h3>
                        <p style={{ color: '#8E9CA3' }}>Try adjusting your search criteria.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
                        {items.map(item => (
                            <Link to={item.isProject ? `/project/${item.id}` : `/property/${item.id}`} key={`${item.isProject ? 'proj' : 'prop'}-${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="property-card" style={{ background: '#1A1F1D', borderRadius: '16px', overflow: 'hidden', border: '1px solid #2A2F2D', transition: 'transform 0.2s', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ height: '220px', background: '#252B29', position: 'relative' }}>
                                        {item.image ? (
                                            <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8E9CA3' }}>No Image</div>
                                        )}
                                        <div style={{ position: 'absolute', top: '15px', right: '15px', background: '#0C151290', padding: '5px 10px', borderRadius: '20px', fontSize: '0.75rem', color: '#E3BC5A', border: '1px solid #E3BC5A40', backdropFilter: 'blur(4px)' }}>
                                            {item.badge}
                                        </div>
                                    </div>

                                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff', marginBottom: '5px' }}>
                                            {item.price}
                                        </div>

                                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#E6ECE9', margin: '0 0 10px 0', lineHeight: '1.4' }}>
                                            {item.title}
                                        </h3>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8E9CA3', fontSize: '0.85rem', marginBottom: '15px' }}>
                                            <MapPin size={14} color="#E3BC5A" />
                                            {item.location}, {item.city}
                                        </div>

                                        <div style={{ marginTop: 'auto', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                            {item.meta.map((m, i) => (
                                                <span key={i} style={{ background: '#252B29', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', color: '#E6ECE9' }}>
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

export default ExplorePage;
