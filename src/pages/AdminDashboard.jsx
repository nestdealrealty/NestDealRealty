import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import { Navigate } from 'react-router-dom';
import { Check, X, MapPin, Home, Building } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [pendingProperties, setPendingProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    const ADMIN_EMAIL = 'minecraftxbox1389@gmail.com';

    useEffect(() => {
        if (user?.email === ADMIN_EMAIL) {
            fetchPendingProperties();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchPendingProperties = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('properties')
                .select('*')
                .eq('status', 'pending')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPendingProperties(data || []);
        } catch (err) {
            console.error('Error fetching properties:', err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            const { error } = await supabase
                .from('properties')
                .update({ status: 'approved' })
                .eq('id', id);

            if (error) throw error;
            // Remove from local list
            setPendingProperties(prev => prev.filter(p => p.id !== id));
            alert('Property Approved!');
        } catch (err) {
            console.error('Error approving:', err.message);
            alert('Failed to approve');
        }
    };

    const handleReject = async (id) => {
        if (!confirm('Are you sure you want to reject this property?')) return;
        try {
            const { error } = await supabase
                .from('properties')
                .update({ status: 'rejected' })
                .eq('id', id);

            if (error) throw error;
            setPendingProperties(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error('Error rejecting:', err.message);
        }
    };

    if (!user || user.email !== ADMIN_EMAIL) {
        if (loading) return <div style={{ padding: '50px', color: '#fff' }}>Loading...</div>;
        return <Navigate to="/" />;
    }

    return (
        <div style={{ padding: '40px 20px', background: '#0C1512', minHeight: '100vh', color: '#E6ECE9', fontFamily: 'Outfit, sans-serif' }}>
            <h1 style={{ color: '#E3BC5A', marginBottom: '30px' }}>Admin Dashboard</h1>

            <div style={{ marginBottom: '20px', color: '#8E9CA3' }}>
                Pending Reviews: {pendingProperties.length}
            </div>

            {loading ? (
                <div>Loading pending properties...</div>
            ) : pendingProperties.length === 0 ? (
                <div style={{ padding: '40px', background: '#1A1F1D', borderRadius: '12px', textAlign: 'center', color: '#8E9CA3' }}>
                    No pending properties to review.
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                    {pendingProperties.map(property => (
                        <div key={property.id} style={{ background: '#1A1F1D', borderRadius: '12px', overflow: 'hidden', border: '1px solid #2A2F2D' }}>
                            {/* Simple Image Text fallback for now if no images */}
                            <div style={{ height: '200px', background: '#252B29', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {property.images && property.images.length > 0 ? (
                                    <img src={property.images[0]} alt="Property" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ color: '#8E9CA3' }}>No Image</span>
                                )}
                            </div>

                            <div style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>
                                        {property.bhk} {property.property_type}
                                    </h3>
                                    <span style={{
                                        padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold',
                                        background: property.looking_to === 'rent' ? '#00C85320' : '#E3BC5A20',
                                        color: property.looking_to === 'rent' ? '#00C853' : '#E3BC5A'
                                    }}>
                                        {property.looking_to.toUpperCase()}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#8E9CA3', fontSize: '0.9rem', marginBottom: '15px' }}>
                                    <MapPin size={16} />
                                    {property.project_name}, {property.locality}, {property.city}
                                </div>

                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#E3BC5A', marginBottom: '20px' }}>
                                    ₹{Number(property.cost).toLocaleString('en-IN')}
                                    {property.looking_to === 'rent' && <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: '#8E9CA3' }}>/month</span>}
                                </div>

                                {/* Quick Details Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem', color: '#E6ECE9', marginBottom: '20px', background: '#252B29', padding: '10px', borderRadius: '8px' }}>
                                    <div>Area: <span style={{ color: '#E3BC5A' }}>{property.built_up_area} sq.ft</span></div>
                                    <div>Furnish: <span style={{ color: '#E3BC5A' }}>{property.furnishing}</span></div>
                                    <div>Status: <span style={{ color: '#E3BC5A' }}>{property.construction_status}</span></div>
                                    <div>Owner: <span style={{ color: '#E3BC5A' }}>{property.user_email || 'Unknown'}</span></div>
                                </div>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => handleApprove(property.id)}
                                        style={{ flex: 1, padding: '10px', background: '#00C853', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                                    >
                                        <Check size={18} /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(property.id)}
                                        style={{ flex: 1, padding: '10px', background: '#FF5252', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                                    >
                                        <X size={18} /> Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
