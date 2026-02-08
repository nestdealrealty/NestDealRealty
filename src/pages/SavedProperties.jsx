import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import { getPropertyById } from '../data/properties';
import './Auth.css'; // Reusing auth styles for container
import './SavedProperties.css'; // specific styles

const SavedProperties = () => {
    const { user } = useAuth();
    const [savedIds, setSavedIds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchSavedProperties();
        } else {
            setLoading(false);
        }
    }, [user]);

    async function fetchSavedProperties() {
        try {
            const { data, error } = await supabase
                .from('saved_properties')
                .select('property_id')
                .eq('user_id', user.id);

            if (error) throw error;
            setSavedIds(data.map(item => item.property_id));
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    }

    if (!user) {
        return (
            <div className="saved-page-container">
                <div className="empty-state">
                    <h2>Please Log In</h2>
                    <p>You need to be logged in to view your saved properties.</p>
                    <Link to="/login" className="btn-primary">Log In</Link>
                </div>
            </div>
        );
    }

    if (loading) return <div className="loading-spinner">Loading...</div>;

    const savedProperties = savedIds.map(id => getPropertyById(id)).filter(p => p !== null);

    return (
        <div className="saved-page-container">
            <div className="saved-header">
                <h1>My Saved Properties</h1>
                <p>{savedProperties.length} properties saved</p>
            </div>

            {savedProperties.length === 0 ? (
                <div className="empty-state">
                    <h3>No saved properties yet</h3>
                    <p>Browse our listings and click the heart icon to save your favorites.</p>
                    <Link to="/" className="btn-secondary">Browse Properties</Link>
                </div>
            ) : (
                <div className="properties-grid">
                    {savedProperties.map(property => (
                        <Link to={`/property/${property.id}`} key={property.id} className="saved-card">
                            <div className="saved-card-img">
                                <img src={property.images?.[0] || property.image || property.heroImage} alt={property.title} />
                            </div>
                            <div className="saved-card-content">
                                <h3>{property.title}</h3>
                                <p className="price">{property.price}</p>
                                <p className="location">{property.location}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedProperties;
