import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';
import { MapPin, Building, Home, Edit } from 'lucide-react';

const UserProperties = () => {
    const { user } = useAuth();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchProperties();
        }
    }, [user]);

    const fetchProperties = async () => {
        try {
            const { data, error } = await supabase
                .from('properties')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProperties(data || []);
        } catch (err) {
            console.error('Error fetching user properties:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusParams = (status) => {
        switch (status) {
            case 'approved': return { color: '#2ecc71', label: 'Live' };
            case 'rejected': return { color: '#e74c3c', label: 'Rejected' };
            default: return { color: '#f39c12', label: 'Pending Review' };
        }
    };

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2>My Properties</h2>
            <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {properties.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', background: '#f8f8f8', borderRadius: '8px' }}>
                        <p>You haven't posted any properties yet.</p>
                        <Link to="/post-property" className="btn-primary" style={{ marginTop: '10px', display: 'inline-block' }}>Post Property</Link>
                    </div>
                ) : (
                    properties.map(property => {
                        const { color, label } = getStatusParams(property.status);
                        return (
                            <div key={property.id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
                                <div style={{ height: '200px', background: '#eee', position: 'relative' }}>
                                    {property.images?.[0] ? (
                                        <img src={property.images[0]} alt={property.project_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#aaa' }}>No Image</div>
                                    )}
                                    <div style={{
                                        position: 'absolute', top: '10px', right: '10px',
                                        background: color, color: '#fff', padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold'
                                    }}>
                                        {label}
                                    </div>
                                </div>
                                <div style={{ padding: '15px' }}>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '5px' }}>{property.project_name || property.property_type || 'Property'}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#666', fontSize: '0.9rem', marginBottom: '5px' }}>
                                        <MapPin size={14} /> {property.locality}, {property.city}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#666', fontSize: '0.9rem' }}>
                                        <span>₹ {property.cost || property.rent || 'N/A'}</span>
                                        <span>•</span>
                                        <span style={{ textTransform: 'capitalize' }}>{property.looking_to}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default UserProperties;
