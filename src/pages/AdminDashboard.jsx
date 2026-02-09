import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import { Navigate } from 'react-router-dom';
import { Check, X, MapPin, Search, Phone, User, MessageCircle, FileText, Activity } from 'lucide-react';

const ADMIN_EMAIL = 'minecraftxbox1389@gmail.com';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('properties'); // properties, valuations, leads
    const [properties, setProperties] = useState([]);
    const [valuations, setValuations] = useState([]);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProperty, setSelectedProperty] = useState(null);

    useEffect(() => {
        if (user?.email === ADMIN_EMAIL) {
            fetchAllData();
        }
    }, [user]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [propsRes, valsRes, leadsRes] = await Promise.all([
                supabase.from('properties').select('*').order('created_at', { ascending: false }),
                supabase.from('valuations').select('*').order('created_at', { ascending: false }),
                supabase.from('leads').select('*, properties(project_name)').order('created_at', { ascending: false })
            ]);

            if (propsRes.error) throw propsRes.error;
            if (valsRes.error) throw valsRes.error;
            if (leadsRes.error) throw leadsRes.error;

            setProperties(propsRes.data || []);
            setValuations(valsRes.data || []);
            setLeads(leadsRes.data || []);
        } catch (err) {
            console.error('Error fetching admin data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (table, id, status) => {
        if (status === 'rejected' && !window.confirm('Are you sure?')) return;

        try {
            const { error } = await supabase.from(table).update({ status }).eq('id', id);
            if (error) throw error;

            // Optimistic update
            if (table === 'properties') {
                setProperties(prev => prev.map(p => p.id === id ? { ...p, status } : p));
                if (selectedProperty?.id === id) setSelectedProperty(prev => ({ ...prev, status }));
            }
            // Add other tables if needed
            alert(`Updated status to ${status}`);
        } catch (err) {
            alert('Failed to update status');
        }
    };

    if (!user || user.email !== ADMIN_EMAIL) {
        if (loading) return <div style={{ padding: '50px', color: '#fff' }}>Loading...</div>;
        return <Navigate to="/" />;
    }

    const Modal = ({ property, onClose }) => {
        if (!property) return null;
        return (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                <div style={{ background: '#1A1F1D', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '12px', padding: '30px', position: 'relative', color: '#E6ECE9' }}>
                    <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#aaa', cursor: 'pointer' }}><X size={24} /></button>

                    <h2 style={{ color: '#E3BC5A', marginTop: 0 }}>{property.project_name || 'Property Details'}</h2>

                    {/* Status Badge in Modal */}
                    <div style={{
                        display: 'inline-block', padding: '5px 10px', borderRadius: '4px', marginBottom: '20px',
                        background: property.status === 'approved' ? '#00C85330' : property.status === 'rejected' ? '#FF525230' : '#E3BC5A30',
                        color: property.status === 'approved' ? '#00C853' : property.status === 'rejected' ? '#FF5252' : '#E3BC5A'
                    }}>
                        Status: {property.status.toUpperCase()}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                        {/* Img Gallery Preview */}
                        <div style={{ gridColumn: '1/-1', display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                            {property.images?.map((img, i) => (
                                <img key={i} src={img} alt="" style={{ height: '150px', borderRadius: '8px' }} />
                            ))}
                        </div>

                        {/* Owner Details */}
                        <div style={{ background: '#252B29', padding: '15px', borderRadius: '8px', gridColumn: '1/-1' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#E3BC5A' }}>Owner / Poster Details</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                                <div><span style={{ color: '#888' }}>Name:</span> {property.contact_name || property.user_email}</div>
                                <div><span style={{ color: '#888' }}>Email:</span> {property.user_email}</div>
                                <div><span style={{ color: '#888' }}>Phone:</span> {property.contact_phone || 'N/A'}</div>
                            </div>
                        </div>

                        {/* Prop Details */}
                        <div><span style={{ color: '#888' }}>Type:</span> {property.property_type} ({property.looking_to})</div>
                        <div><span style={{ color: '#888' }}>Price:</span> ₹{property.cost}</div>
                        <div><span style={{ color: '#888' }}>Location:</span> {property.locality}, {property.city}</div>
                        <div><span style={{ color: '#888' }}>Area:</span> {property.built_up_area} sq.ft</div>
                        <div><span style={{ color: '#888' }}>Furnishing:</span> {property.furnishing}</div>
                        <div><span style={{ color: '#888' }}>BHK:</span> {property.bhk}</div>

                        <div style={{ gridColumn: '1/-1' }}>
                            <span style={{ color: '#888' }}>Description:</span>
                            <p style={{ background: '#252B29', padding: '10px', borderRadius: '6px' }}>{property.description}</p>
                        </div>

                        <div style={{ gridColumn: '1/-1' }}>
                            <span style={{ color: '#888' }}>Amenities:</span>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '5px' }}>
                                {property.gated_security && <span style={{ fontSize: '0.8rem', background: '#333', padding: '2px 8px', borderRadius: '4px' }}>Security</span>}
                                {property.power_backup && <span style={{ fontSize: '0.8rem', background: '#333', padding: '2px 8px', borderRadius: '4px' }}>Power Backup</span>}
                                {/* Add more mapped amenities here */}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', borderTop: '1px solid #333', paddingTop: '20px' }}>
                        <button onClick={() => { handleUpdateStatus('properties', property.id, 'approved'); onClose(); }}
                            style={{ flex: 1, padding: '12px', background: '#00C853', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                            Approve
                        </button>
                        <button onClick={() => { handleUpdateStatus('properties', property.id, 'rejected'); onClose(); }}
                            style={{ flex: 1, padding: '12px', background: '#FF5252', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                            Reject
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0C1512', color: '#E6ECE9', fontFamily: 'Outfit, sans-serif' }}>
            {/* Sidebar */}
            <div style={{ width: '250px', background: '#1A1F1D', borderRight: '1px solid #2A2F2D', padding: '20px' }}>
                <h2 style={{ color: '#E3BC5A', marginBottom: '40px' }}>Admin Panel</h2>

                <div onClick={() => setActiveTab('properties')} style={{ padding: '12px', borderRadius: '8px', cursor: 'pointer', background: activeTab === 'properties' ? '#E3BC5A20' : 'transparent', color: activeTab === 'properties' ? '#E3BC5A' : '#8E9CA3', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Home size={20} /> Properties
                </div>
                <div onClick={() => setActiveTab('valuations')} style={{ padding: '12px', borderRadius: '8px', cursor: 'pointer', background: activeTab === 'valuations' ? '#E3BC5A20' : 'transparent', color: activeTab === 'valuations' ? '#E3BC5A' : '#8E9CA3', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Activity size={20} /> Valuations
                </div>
                <div onClick={() => setActiveTab('leads')} style={{ padding: '12px', borderRadius: '8px', cursor: 'pointer', background: activeTab === 'leads' ? '#E3BC5A20' : 'transparent', color: activeTab === 'leads' ? '#E3BC5A' : '#8E9CA3', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MessageCircle size={20} /> Leads / Contacts
                </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, padding: '40px' }}>
                {activeTab === 'properties' && (
                    <div>
                        <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '20px', marginBottom: '20px' }}>Properties Management</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {properties.map(p => (
                                <div key={p.id} style={{ background: '#1A1F1D', borderRadius: '8px', padding: '15px', border: `1px solid ${p.status === 'pending' ? '#E3BC5A' : '#333'}` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h4 style={{ margin: '0 0 10px 0' }}>{p.project_name || p.property_type}</h4>
                                        <span style={{ fontSize: '0.8rem', color: p.status === 'pending' ? '#E3BC5A' : p.status === 'approved' ? '#00C853' : '#666' }}>{p.status.toUpperCase()}</span>
                                    </div>
                                    <div style={{ marginBottom: '15px', fontSize: '0.9rem', color: '#888' }}>{p.user_email}</div>
                                    <button onClick={() => setSelectedProperty(p)} style={{ width: '100%', padding: '8px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Review Details</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'valuations' && (
                    <div>
                        <h2>Valuation Requests</h2>
                        <div style={{ display: 'grid', gap: '15px' }}>
                            {valuations.map(v => (
                                <div key={v.id} style={{ background: '#1A1F1D', padding: '20px', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h4 style={{ margin: 0 }}>{v.name} <span style={{ fontWeight: 'normal', color: '#888' }}>({v.city})</span></h4>
                                        <span style={{ color: '#888' }}>{new Date(v.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div style={{ marginTop: '10px', color: '#aaa', fontSize: '0.9rem' }}>
                                        <div>Email: {v.email}</div>
                                        <div>Phone: {v.phone}</div>
                                        <div>Address: {v.address}</div>
                                        <div>Message: {v.message}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'leads' && (
                    <div>
                        <h2>Property Leads</h2>
                        <div style={{ display: 'grid', gap: '15px' }}>
                            {leads.map(l => (
                                <div key={l.id} style={{ background: '#1A1F1D', padding: '20px', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h4 style={{ margin: 0 }}>Lead for: <span style={{ color: '#E3BC5A' }}>{l.properties?.project_name || 'Unknown Property'}</span></h4>
                                        <span style={{ color: '#888' }}>{new Date(l.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div style={{ marginTop: '10px', color: '#aaa', fontSize: '0.9rem' }}>
                                        <div><strong>{l.name}</strong></div>
                                        <div>Email: {l.email}</div>
                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            <span>Phone: {l.phone}</span>
                                            {l.whatsapp && <span style={{ color: '#25D366' }}>WA: {l.whatsapp}</span>}
                                        </div>
                                        <div>Note: {l.message}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {selectedProperty && <Modal property={selectedProperty} onClose={() => setSelectedProperty(null)} />}
        </div>
    );
};

export default AdminDashboard;
