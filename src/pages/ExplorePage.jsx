import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { MapPin, Filter, Search, ChevronRight, Home, Building } from 'lucide-react';

const ExplorePage = () => {
    const [searchParams] = useSearchParams();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters from URL
    const cityFilter = searchParams.get('city'); // 'Ahmedabad' or 'Gandhinagar'
    const typeFilter = searchParams.get('type'); // 'plot', 'apartment', etc.
    const lookingToFilter = searchParams.get('looking_to'); // 'rent', 'sell', 'pg'

    useEffect(() => {
        fetchProperties();
    }, [searchParams]);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('properties')
                .select('*')
                .eq('status', 'approved');

            if (cityFilter) {
                query = query.ilike('city', `%${cityFilter}%`);
            }
            if (typeFilter) {
                query = query.ilike('property_type', `%${typeFilter}%`);
            }
            if (lookingToFilter) {
                query = query.eq('looking_to', lookingToFilter);
            }

            const { data, error } = await query;
            if (error) throw error;
            setProperties(data || []);
        } catch (err) {
            console.error('Error fetching properties:', err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#0C1512', minHeight: '100vh', color: '#E6ECE9', fontFamily: 'Outfit, sans-serif' }}>
            {/* Header / Filter Bar */}
            <div style={{ padding: '20px 40px', borderBottom: '1px solid #2A2F2D', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#E3BC5A' }}>
                        {cityFilter ? `Properties in ${cityFilter}` : 'Explore Properties'}
                    </h1>
                    <p style={{ color: '#8E9CA3', margin: '5px 0 0 0' }}>
                        {properties.length} results found
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
                ) : properties.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px', background: '#1A1F1D', borderRadius: '12px', border: '1px dashed #2A2F2D' }}>
                        <Search size={40} color="#E3BC5A" style={{ marginBottom: '20px' }} />
                        <h3>No properties found</h3>
                        <p style={{ color: '#8E9CA3' }}>Try adjusting your search criteria.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
                        {properties.map(property => (
                            <Link to={`/property/${property.id}`} key={property.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="property-card" style={{ background: '#1A1F1D', borderRadius: '16px', overflow: 'hidden', border: '1px solid #2A2F2D', transition: 'transform 0.2s', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    {/* Image */}
                                    <div style={{ height: '220px', background: '#252B29', position: 'relative' }}>
                                        {property.images && property.images.length > 0 ? (
                                            <img src={property.images[0]} alt={property.project_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8E9CA3' }}>No Image</div>
                                        )}
                                        <div style={{ position: 'absolute', top: '15px', right: '15px', background: '#0C151290', padding: '5px 10px', borderRadius: '20px', fontSize: '0.75rem', color: '#E3BC5A', border: '1px solid #E3BC5A40', backdropFilter: 'blur(4px)' }}>
                                            {property.looking_to.toUpperCase()}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff', marginBottom: '5px' }}>
                                            ₹{Number(property.cost).toLocaleString('en-IN')}
                                            {property.looking_to === 'rent' && <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: '#8E9CA3' }}>/mo</span>}
                                        </div>

                                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#E6ECE9', margin: '0 0 10px 0', lineHeight: '1.4' }}>
                                            {property.bhk} {property.property_type} in {property.project_name}
                                        </h3>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8E9CA3', fontSize: '0.85rem', marginBottom: '15px' }}>
                                            <MapPin size={14} color="#E3BC5A" />
                                            {property.locality}, {property.city}
                                        </div>

                                        <div style={{ marginTop: 'auto', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                            <span style={{ background: '#252B29', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', color: '#E6ECE9' }}>
                                                {property.built_up_area} sq.ft
                                            </span>
                                            <span style={{ background: '#252B29', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', color: '#E6ECE9' }}>
                                                {property.furnishing}
                                            </span>
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
