import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import { 
    Home, Activity, MessageCircle, Building2, MapPin, X, ChevronRight, Check,
    Trees, Flower2, Target, Car, Palmtree, Mountain, Dumbbell, PartyPopper, ShieldCheck, Camera, ParkingCircle, 
    ArrowUpToLine, Flame, Zap, Baby, Footprints, Gamepad2, Trophy, BadgeCheck, DoorClosed, Waves, Wine, ChefHat, 
    Bike, Lamp, GraduationCap, Flag, Globe, Bath, Mic2, Lock, WashingMachine, Repeat, UserCheck, 
    Droplets, Volleyball, Scissors, Gift, Calendar, Leaf, Tent, Users, Music, Sofa, Tv, Droplet, 
    Joystick, Coffee, Library, Store, DoorOpen, Accessibility, PhoneForwarded, Trash2, CheckCircle2
} from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';

const THEME = {
    gold: '#E3BC5A',
    dark: '#0C1512',
    card: '#1A1F1D',
    border: '#2A2F2D',
    text: '#E6ECE9',
    muted: '#8E9CA3'
};

const ALL_AMENITIES = [
    { name: "Garden Play Area", icon: Trees },
    { name: "Society Office", icon: Building2 },
    { name: "Lush Green Garden", icon: Flower2 },
    { name: "Box Cricket", icon: Target },
    { name: "Pick-up & Drop-off Zone", icon: Car },
    { name: "Gazebo", icon: Palmtree },
    { name: "Terrace Garden", icon: Mountain },
    { name: "Gym / Aerobic Studio", icon: Dumbbell },
    { name: "Banquet Hall", icon: PartyPopper },
    { name: "Security Cabin", icon: ShieldCheck },
    { name: "CCTV Camera", icon: Camera },
    { name: "Allotted Car Parking", icon: ParkingCircle },
    { name: "High-Speed Elevator", icon: ArrowUpToLine },
    { name: "Fire Safety", icon: Flame },
    { name: "Power Backup for Common Area", icon: Zap },
    { name: "Toddler Play Area", icon: Baby },
    { name: "Jogging Track", icon: Footprints },
    { name: "Indoor Games", icon: Gamepad2 },
    { name: "OutDoor Games", icon: Trophy },
    { name: "Multipurpose Court", icon: BadgeCheck },
    { name: "Yoga Space", icon: Activity },
    { name: "Entrance Foyer", icon: Building2 },
    { name: "Entrance Gate with Automatic Boom Barrier", icon: DoorClosed },
    { name: "Splash Pool", icon: Waves },
    { name: "Party Lawn", icon: Wine },
    { name: "Open Kitchen", icon: ChefHat },
    { name: "Two-Wheeler Parking", icon: Bike },
    { name: "Seating Area", icon: Lamp },
    { name: "Interactive Learning Room", icon: GraduationCap },
    { name: "Kids Play Room", icon: Gamepad2 },
    { name: "Virtual Golf", icon: Flag },
    { name: "Swimming Pool", icon: Waves },
    { name: "Club House", icon: Building2 },
    { name: "Multipurpose Hall", icon: Globe },
    { name: "Changing Area", icon: Bath },
    { name: "Karaoke", icon: Mic2 },
    { name: "Locker Room", icon: Lock },
    { name: "Laundry", icon: WashingMachine },
    { name: "Separate Entry & Exit Ramp", icon: Repeat },
    { name: "Visitors Parking", icon: UserCheck },
    { name: "Drop-off Zone", icon: Car },
    { name: "Foyer", icon: Home },
    { name: "Cascading Waterfall", icon: Droplets },
    { name: "Volleyball Court", icon: Volleyball },
    { name: "Pickleball Court", icon: Activity },
    { name: "Salon", icon: Scissors },
    { name: "Celebration Court", icon: Gift },
    { name: "Event Garden", icon: Calendar },
    { name: "Tree Court with Seating Plaza", icon: Leaf },
    { name: "Mounds", icon: Mountain },
    { name: "Pavilion", icon: Tent },
    { name: "Mother’s Hangout Area", icon: Activity },
    { name: "Father's HAngout Area", icon: Users },
    { name: "Squash Court", icon: Target },
    { name: "Amphitheatre", icon: Music },
    { name: "Waiting Lounge", icon: Sofa },
    { name: "Mini Theatre", icon: Tv },
    { name: "Indoor Waterfall Wall", icon: Droplet },
    { name: "Tuition Class", icon: GraduationCap },
    { name: "Covered Seating Area", icon: Sofa },
    { name: "Gaming Zone", icon: Joystick },
    { name: "Café", icon: Coffee },
    { name: "Library", icon: Library },
    { name: "Kids Pool", icon: Droplet },
    { name: "Reception", icon: Building2 },
    { name: "Store", icon: Store },
    { name: "Emergency Exit Gate", icon: DoorOpen },
    { name: "Jula Court", icon: Accessibility },
    { name: "Senior Citizen Sit-out", icon: Accessibility },
    { name: "Skating Rink", icon: Activity },
    { name: "EV Charging Point", icon: Zap },
    { name: "Gas Line", icon: Droplet },
    { name: "Pool Table", icon: Target },
    { name: "Garden Bench", icon: Sofa },
    { name: "Vastu Compliant", icon: Home },
    { name: "Waste disposal", icon: Trash2 },
    { name: "Intercom Facility", icon: PhoneForwarded },
    { name: "Private Pool", icon: Waves },
    { name: "Private Terrace", icon: Mountain }
];

const ADMIN_EMAIL = 'minecraftxbox1389@gmail.com';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('properties'); // properties, projects, valuations, leads
    const [properties, setProperties] = useState([]);
    const [projects, setProjects] = useState([]);
    const [valuations, setValuations] = useState([]);
    const [leads, setLeads] = useState([]);
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Helper to open project and clear property (and vice versa)
    const openProject = (p) => { setSelectedProperty(null); setSelectedProject(p); };
    const openProperty = (p) => { setSelectedProject(null); setSelectedProperty(p); };
    const [editForm, setEditForm] = useState({});
    const [slideForm, setSlideForm] = useState({ image_file: null, title: '', price: '', tag: '' });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user?.email === ADMIN_EMAIL) {
            fetchAllData();
        }
    }, [user]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            // Fetch individually so one failure doesn't block the rest
            const fetchTable = async (table) => {
                const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false });
                if (error) {
                    console.warn(`Error fetching ${table}:`, error.message);
                    return [];
                }
                return data;
            };

            const [propsData, projectsData, valsData, slidesData] = await Promise.all([
                fetchTable('properties'),
                fetchTable('projects'),
                fetchTable('valuations'),
                fetchTable('home_slides')
            ]);

            // Leads needs a join for both properties and projects
            const { data: leadsData, error: leadsErr } = await supabase
                .from('leads')
                .select('*, properties(project_name), projects(name)')
                .order('created_at', { ascending: false });

            setProperties(propsData);
            setProjects(projectsData);
            setValuations(valsData);
            setSlides(slidesData);
            setLeads(leadsData || []);

            if (projectsData.length === 0) {
                console.info("Notice: No projects found or 'projects' table not yet created.");
            }

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
            if (table === 'projects') {
                setProjects(prev => prev.map(p => p.id === id ? { ...p, status } : p));
                if (selectedProject?.id === id) setSelectedProject(prev => ({ ...prev, status }));
            }
            alert(`Updated status to ${status}`);
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleSaveEdit = async (table) => {
        const item = table === 'properties' ? selectedProperty : selectedProject;
        if (!item) return;

        try {
            const { error } = await supabase.from(table).update(editForm).eq('id', item.id);
            if (error) throw error;

            if (table === 'properties') {
                setProperties(prev => prev.map(p => p.id === item.id ? { ...p, ...editForm } : p));
                setSelectedProperty({ ...selectedProperty, ...editForm });
            } else {
                setProjects(prev => prev.map(p => p.id === item.id ? { ...p, ...editForm } : p));
                setSelectedProject({ ...selectedProject, ...editForm });
            }

            setIsEditing(false);
            alert("Details updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to save changes.");
        }
    };

    const handleCloseModal = () => {
        setIsEditing(false);
        setEditForm({});
        setSelectedProperty(null);
        setSelectedProject(null);
    };

    const handleAddSlide = async (e) => {
        e.preventDefault();
        if (slides.length >= 5) {
            alert("Maximum 5 slides allowed.");
            return;
        }

        if (!slideForm.image_file) {
            alert("Please select an image file.");
            return;
        }

        setUploading(true);
        try {
            // 1. Upload Image to Supabase Storage
            const file = slideForm.image_file;
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `slides/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('property-images') // Reusing existing bucket
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('property-images')
                .getPublicUrl(filePath);

            // 3. Insert Slide Record
            const newSlide = {
                image_url: publicUrl,
                title: slideForm.title,
                price: slideForm.price,
                tag: slideForm.tag
            };

            const { data, error } = await supabase.from('home_slides').insert([newSlide]).select();
            if (error) throw error;

            setSlides([data[0], ...slides]);
            setSlideForm({ image_file: null, title: '', price: '', tag: '' });
            alert("Slide added successfully!");
        } catch (error) {
            console.error("Error adding slide:", error);
            alert("Failed to add slide. Ensure you have upload permissions.");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteSlide = async (id) => {
        if (slides.length <= 2) {
            alert("Minimum 2 slides required.");
            return;
        }
        if (!window.confirm("Delete this slide?")) return;

        try {
            const { error } = await supabase.from('home_slides').delete().eq('id', id);
            if (error) throw error;
            setSlides(slides.filter(s => s.id !== id));
            alert("Slide deleted.");
        } catch (error) {
            console.error("Error deleting slide:", error);
            alert("Failed to delete slide.");
        }
    };

    if (!user || user.email !== ADMIN_EMAIL) {
        if (loading) return <div style={{ padding: '50px', color: '#fff' }}>Loading...</div>;
        return <Navigate to="/" />;
    }



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
                <div onClick={() => setActiveTab('projects')} style={{ padding: '12px', borderRadius: '8px', cursor: 'pointer', background: activeTab === 'projects' ? '#E3BC5A20' : 'transparent', color: activeTab === 'projects' ? '#E3BC5A' : '#8E9CA3', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Building2 size={20} /> Projects
                </div>
                <div onClick={() => setActiveTab('slides')} style={{ padding: '12px', borderRadius: '8px', cursor: 'pointer', background: activeTab === 'slides' ? '#E3BC5A20' : 'transparent', color: activeTab === 'slides' ? '#E3BC5A' : '#8E9CA3', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MapPin size={20} /> Slideshow
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
                                    <button onClick={() => openProperty(p)} style={{ width: '100%', padding: '8px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Review Details</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'projects' && (
                    <div>
                        <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '20px', marginBottom: '20px' }}>Projects Management</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {projects.map(p => (
                                <div key={p.id} style={{ background: '#1A1F1D', borderRadius: '8px', padding: '15px', border: `1px solid ${p.status === 'pending' ? '#E3BC5A' : '#333'}` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h4 style={{ margin: '0 0 10px 0' }}>{p.name}</h4>
                                        <span style={{ fontSize: '0.8rem', color: p.status === 'pending' ? '#E3BC5A' : p.status === 'approved' ? '#00C853' : '#666' }}>{p.status.toUpperCase()}</span>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#8E9CA3' }}>{p.developer}</div>
                                    <div style={{ marginBottom: '15px', fontSize: '0.8rem', color: '#666' }}>{p.user_email}</div>
                                    <button onClick={() => openProject(p)} style={{ width: '100%', padding: '8px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Review Details</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {selectedProperty && (
                    <Modal 
                        property={selectedProperty} 
                        isEditing={isEditing} 
                        setIsEditing={setIsEditing} 
                        editForm={editForm} 
                        setEditForm={setEditForm} 
                        onSave={() => handleSaveEdit('properties')}
                        onUpdateStatus={handleUpdateStatus}
                        onClose={handleCloseModal} 
                    />
                )}
                {selectedProject && (
                    <ProjectModal 
                        project={selectedProject} 
                        isEditing={isEditing} 
                        setIsEditing={setIsEditing} 
                        editForm={editForm} 
                        setEditForm={setEditForm} 
                        onSave={() => handleSaveEdit('projects')}
                        onUpdateStatus={handleUpdateStatus}
                        onClose={handleCloseModal} 
                    />
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
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h4 style={{ margin: 0 }}>
                                            Lead for: <span style={{ color: '#E3BC5A' }}>{l.projects?.name || l.properties?.project_name || 'Unknown Item'}</span>
                                            <span style={{ marginLeft: '12px', fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', background: l.type === 'brochure' ? '#E3BC5A' : '#333', color: l.type === 'brochure' ? '#000' : '#E3BC5A', fontWeight: 'bold' }}>
                                                {l.type?.toUpperCase() || 'INQUIRY'}
                                            </span>
                                        </h4>
                                        <span style={{ color: '#888', fontSize: '0.85rem' }}>{new Date(l.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div style={{ marginTop: '12px', color: '#aaa', fontSize: '0.9rem', display: 'grid', gap: '5px' }}>
                                        <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>{l.name}</div>
                                        <div style={{ display: 'flex', gap: '20px' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={14} /> {l.phone}</span>
                                            {l.email && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={14} /> {l.email}</span>}
                                        </div>
                                        {l.whatsapp && <div style={{ color: '#25D366', display: 'flex', alignItems: 'center', gap: '6px' }}><MessageCircle size={14} /> WhatsApp: {l.whatsapp}</div>}
                                        <div style={{ marginTop: '8px', padding: '10px', background: '#00000040', borderRadius: '6px', fontStyle: 'italic', borderLeft: `3px solid ${THEME.gold}` }}>
                                            "{l.message}"
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'slides' && (
                    <div>
                        <h2>Homepage Slideshow Management</h2>
                        <p style={{ color: '#888', marginBottom: '20px' }}>Manage the rotating banner images on the homepage. (Min: 2, Max: 5)</p>

                        {/* Add Slide Form */}
                        <form onSubmit={handleAddSlide} style={{ background: '#1A1F1D', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                            <h3 style={{ marginTop: 0, color: '#E3BC5A' }}>Add New Slide</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div style={{ gridColumn: '1/-1' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#888' }}>Upload Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        required
                                        style={{ padding: '10px', background: '#333', border: '1px solid #444', color: '#fff', borderRadius: '4px', width: '100%' }}
                                        onChange={e => setSlideForm({ ...slideForm, image_file: e.target.files[0] })}
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Title (e.g., The Planet, Ahmedabad)"
                                    style={{ padding: '10px', background: '#333', border: '1px solid #444', color: '#fff', borderRadius: '4px' }}
                                    value={slideForm.title}
                                    onChange={e => setSlideForm({ ...slideForm, title: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Price (e.g., ₹75L - 1.2Cr)"
                                    style={{ padding: '10px', background: '#333', border: '1px solid #444', color: '#fff', borderRadius: '4px' }}
                                    value={slideForm.price}
                                    onChange={e => setSlideForm({ ...slideForm, price: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Tag (e.g., Premium Flat)"
                                    style={{ padding: '10px', background: '#333', border: '1px solid #444', color: '#fff', borderRadius: '4px' }}
                                    value={slideForm.tag}
                                    onChange={e => setSlideForm({ ...slideForm, tag: e.target.value })}
                                />
                                <button type="submit" disabled={slides.length >= 5 || uploading} style={{ gridColumn: '1/-1', padding: '12px', background: slides.length >= 5 || uploading ? '#555' : '#E3BC5A', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: slides.length >= 5 || uploading ? 'not-allowed' : 'pointer' }}>
                                    {uploading ? 'Uploading...' : slides.length >= 5 ? 'Maximum Limit Reached (5)' : 'Add Slide'}
                                </button>
                            </div>
                        </form>

                        {/* Slides List */}
                        <div style={{ display: 'grid', gap: '15px' }}>
                            {slides.map(slide => (
                                <div key={slide.id} style={{ background: '#1A1F1D', padding: '15px', borderRadius: '8px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <img src={slide.image_url} alt="Slide" style={{ width: '150px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: '0 0 5px 0' }}>{slide.title || 'Untitled'}</h4>
                                        <div style={{ fontSize: '0.9rem', color: '#888' }}>{slide.price} • <span style={{ color: '#E3BC5A' }}>{slide.tag}</span></div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteSlide(slide.id)}
                                        disabled={slides.length <= 2}
                                        style={{ padding: '8px 15px', background: slides.length <= 2 ? '#555' : '#FF5252', color: '#fff', border: 'none', borderRadius: '4px', cursor: slides.length <= 2 ? 'not-allowed' : 'pointer' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const Modal = ({ property, isEditing, setIsEditing, editForm, setEditForm, onSave, onUpdateStatus, onClose }) => {
    if (!property) return null;
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div style={{ background: '#1A1F1D', width: '100%', maxWidth: '900px', maxHeight: '92vh', overflowY: 'auto', borderRadius: '16px', padding: '35px', position: 'relative', color: '#E6ECE9', border: '1px solid #2A2F2D' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '25px', right: '25px', background: '#333', border: 'none', color: '#fff', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} /></button>

                <h2 style={{ color: '#E3BC5A', marginTop: 0, fontSize: '1.8rem' }}>{property.project_name || 'Property Details'}</h2>
                <div style={{ display: 'inline-block', padding: '6px 12px', borderRadius: '4px', marginBottom: '25px', background: property.status === 'approved' ? '#00C85320' : property.status === 'rejected' ? '#FF525220' : '#E3BC5A20', color: property.status === 'approved' ? '#00C853' : property.status === 'rejected' ? '#FF5252' : '#E3BC5A', fontWeight: 'bold' }}>Status: {property.status.toUpperCase()}</div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                    <div style={{ gridColumn: '1/-1', display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
                        {property.images?.map((img, i) => <img key={i} src={img} alt="" style={{ height: '200px', borderRadius: '12px', border: '1px solid #333' }} />)}
                    </div>

                    <div style={{ background: '#252B29', padding: '20px', borderRadius: '12px', gridColumn: '1/-1' }}>
                        <h4 style={{ margin: '0 0 15px 0', color: '#8E9CA3', letterSpacing: '1px' }}>RESELLER DETAILS</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                            <div><label style={{ display: 'block', fontSize: '0.75rem', color: '#666' }}>Post By</label>{property.contact_name || 'Owner'}</div>
                            <div><label style={{ display: 'block', fontSize: '0.75rem', color: '#666' }}>Email</label>{property.user_email}</div>
                            <div><label style={{ display: 'block', fontSize: '0.75rem', color: '#666' }}>Phone</label>{property.contact_phone || 'N/A'}</div>
                        </div>
                    </div>

                    {isEditing ? (
                        <>
                            <div><label style={{ display: 'block', color: '#666' }}>Project Name</label>
                                <input value={editForm.project_name || ''} onChange={e => setEditForm({...editForm, project_name: e.target.value})} style={{ background: '#000', color: '#fff', border: '1px solid #444', padding: '8px', borderRadius: '4px', width: '100%' }} />
                            </div>
                            <div><label style={{ display: 'block', color: '#666' }}>Property Type</label>
                                <input value={editForm.property_type || ''} onChange={e => setEditForm({...editForm, property_type: e.target.value})} style={{ background: '#000', color: '#fff', border: '1px solid #444', padding: '8px', borderRadius: '4px', width: '100%' }} />
                            </div>
                            <div><label style={{ display: 'block', color: '#666' }}>Price (₹)</label>
                                <input value={editForm.cost || ''} onChange={e => setEditForm({...editForm, cost: e.target.value})} style={{ background: '#000', color: '#fff', border: '1px solid #444', padding: '8px', borderRadius: '4px', width: '100%' }} />
                            </div>
                            <div><label style={{ display: 'block', color: '#666' }}>Locality</label>
                                <input value={editForm.locality || ''} onChange={e => setEditForm({...editForm, locality: e.target.value})} style={{ background: '#000', color: '#fff', border: '1px solid #444', padding: '8px', borderRadius: '4px', width: '100%' }} />
                            </div>
                            <div><label style={{ display: 'block', color: '#666' }}>City</label>
                                <input value={editForm.city || ''} onChange={e => setEditForm({...editForm, city: e.target.value})} style={{ background: '#000', color: '#fff', border: '1px solid #444', padding: '8px', borderRadius: '4px', width: '100%' }} />
                            </div>
                            <div><label style={{ display: 'block', color: '#666' }}>Built-up Area</label>
                                <input value={editForm.built_up_area || ''} onChange={e => setEditForm({...editForm, built_up_area: e.target.value})} style={{ background: '#000', color: '#fff', border: '1px solid #444', padding: '8px', borderRadius: '4px', width: '100%' }} />
                            </div>
                            <div style={{ gridColumn: '1/-1' }}><label style={{ display: 'block', color: '#666' }}>Description</label>
                                <textarea value={editForm.description || ''} onChange={e => setEditForm({...editForm, description: e.target.value})} style={{ background: '#000', color: '#fff', border: '1px solid #444', padding: '8px', borderRadius: '4px', width: '100%', height: '100px' }} />
                            </div>
                        </>
                    ) : (
                        <>
                            <div><label style={{ display: 'block', color: '#666' }}>Type</label><strong>{property.property_type}</strong></div>
                            <div><label style={{ display: 'block', color: '#666' }}>Price</label><strong>₹{property.cost}</strong></div>
                            <div><label style={{ display: 'block', color: '#666' }}>Location</label><strong>{property.locality}, {property.city}</strong></div>
                            <div><label style={{ display: 'block', color: '#666' }}>Area</label><strong>{property.built_up_area} sq.ft</strong></div>
                            <div style={{ gridColumn: '1/-1' }}><label style={{ display: 'block', color: '#666' }}>Description</label><p style={{ background: '#252B29', padding: '15px', borderRadius: '8px', marginTop: '5px' }}>{property.description}</p></div>
                        </>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '20px', borderTop: '1px solid #333', paddingTop: '30px', marginTop: '30px' }}>
                    {isEditing ? (
                        <>
                            <button onClick={onSave} style={{ flex: 2, padding: '15px', background: THEME.gold, color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>SAVE CHANGES</button>
                            <button onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '15px', background: '#444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>CANCEL</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => { setIsEditing(true); setEditForm({...property}); }} style={{ flex: 1, padding: '15px', background: '#333', color: THEME.gold, border: `1px solid ${THEME.gold}`, borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>EDIT DETAILS</button>
                            <button onClick={() => { onUpdateStatus('properties', property.id, 'approved'); onClose(); }} style={{ flex: 1, padding: '15px', background: '#00C853', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>APPROVE</button>
                            <button onClick={() => { onUpdateStatus('properties', property.id, 'rejected'); onClose(); }} style={{ flex: 1, padding: '15px', background: '#FF5252', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>REJECT</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const ProjectModal = ({ project, isEditing, setIsEditing, editForm, setEditForm, onSave, onUpdateStatus, onClose }) => {
    if (!project) return null;
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div style={{ background: '#1A1F1D', width: '100%', maxWidth: '1000px', maxHeight: '92vh', overflowY: 'auto', borderRadius: '16px', padding: '35px', position: 'relative', color: '#E6ECE9', border: '1px solid #2A2F2D' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '25px', right: '25px', background: '#333', border: 'none', color: '#fff', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} /></button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
                    <div>
                        {isEditing ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', width: '600px', background: '#252B29', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                                <div style={{ gridColumn: '1/-1' }}>
                                    <label style={{ display: 'block', color: '#666', fontSize: '0.8rem' }}>Project Name</label>
                                    <input value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} style={{ background: '#000', color: THEME.gold, border: '1px solid #444', padding: '10px', fontSize: '1.2rem', width: '100%' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#666', fontSize: '0.8rem' }}>Developer</label>
                                    <input value={editForm.developer || ''} onChange={e => setEditForm({...editForm, developer: e.target.value})} style={{ background: '#000', color: '#fff', border: '1px solid #444', padding: '8px', width: '100%' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#666', fontSize: '0.8rem' }}>Property Type</label>
                                    <input value={editForm.property_type || ''} onChange={e => setEditForm({...editForm, property_type: e.target.value})} style={{ background: '#000', color: '#fff', border: '1px solid #444', padding: '8px', width: '100%' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#666', fontSize: '0.8rem' }}>Locality</label>
                                    <input value={editForm.locality || ''} onChange={e => setEditForm({...editForm, locality: e.target.value})} style={{ background: '#000', color: '#fff', border: '1px solid #444', padding: '8px', width: '100%' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#666', fontSize: '0.8rem' }}>City</label>
                                    <input value={editForm.city || ''} onChange={e => setEditForm({...editForm, city: e.target.value})} style={{ background: '#000', color: '#fff', border: '1px solid #444', padding: '8px', width: '100%' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#666', fontSize: '0.8rem' }}>Status</label>
                                    <input value={editForm.construction_status || ''} onChange={e => setEditForm({...editForm, construction_status: e.target.value})} style={{ background: '#000', color: '#fff', border: '1px solid #444', padding: '8px', width: '100%' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#666', fontSize: '0.8rem' }}>Total Units</label>
                                    <input value={editForm.total_units || ''} onChange={e => setEditForm({...editForm, total_units: e.target.value})} style={{ background: '#000', color: '#fff', border: '1px solid #444', padding: '8px', width: '100%' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#666', fontSize: '0.8rem' }}>Total Towers</label>
                                    <input value={editForm.total_towers || ''} onChange={e => setEditForm({...editForm, total_towers: e.target.value})} style={{ background: '#000', color: '#fff', border: '1px solid #444', padding: '8px', width: '100%' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#666', fontSize: '0.8rem' }}>Plot Area</label>
                                    <input value={editForm.total_plot_area || ''} onChange={e => setEditForm({...editForm, total_plot_area: e.target.value})} style={{ background: '#000', color: '#fff', border: '1px solid #444', padding: '8px', width: '100%' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#666', fontSize: '0.8rem' }}>RERA ID</label>
                                    <input value={editForm.rera_id || ''} onChange={e => setEditForm({...editForm, rera_id: e.target.value})} style={{ background: '#000', color: '#fff', border: '1px solid #444', padding: '8px', width: '100%' }} />
                                </div>
                                <div style={{ gridColumn: '1/-1' }}>
                                    <label style={{ display: 'block', color: '#666', fontSize: '0.8rem' }}>RERA Link</label>
                                    <input value={editForm.rera_link || ''} onChange={e => setEditForm({...editForm, rera_link: e.target.value})} style={{ background: '#000', color: '#fff', border: '1px solid #444', padding: '8px', width: '100%' }} />
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 style={{ color: '#E3BC5A', margin: 0, fontSize: '2rem' }}>{project.name}</h2>
                                <p style={{ color: '#8E9CA3', fontSize: '1.2rem', margin: '5px 0' }}>By {project.developer}</p>
                            </>
                        )}
                    </div>
                    <div style={{ padding: '6px 12px', borderRadius: '4px', background: project.status === 'approved' ? '#00C85320' : project.status === 'rejected' ? '#FF525220' : '#E3BC5A20', color: project.status === 'approved' ? '#00C853' : project.status === 'rejected' ? '#FF5252' : '#E3BC5A', fontWeight: 'bold' }}>{project.status.toUpperCase()}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                    <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px', gridColumn: '1/-1' }}>
                        {(() => {
                            let imgs = project.images;
                            if (typeof imgs === 'string') {
                                try { imgs = JSON.parse(imgs); } catch(e) { imgs = []; }
                            }
                            if (!Array.isArray(imgs)) imgs = [];
                            return imgs.map((img, i) => (
                                <img key={i} src={typeof img === 'string' ? img : img.url} alt="" style={{ height: '250px', borderRadius: '12px', border: '1px solid #333' }} />
                            ));
                        })()}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ background: '#252B29', padding: '20px', borderRadius: '12px' }}>
                            <h4 style={{ margin: '0 0 15px 0', color: '#E3BC5A' }}>NEARBY LANDMARKS</h4>
                            <div style={{ display: 'grid', gap: '15px' }}>
                                {project.landmarks?.map((lm, i) => (
                                    <div key={i}>
                                        <div style={{ fontWeight: 'bold', color: '#E3BC5A', fontSize: '0.8rem' }}>{lm.title?.toUpperCase()}</div>
                                        <div style={{ marginLeft: '10px', fontSize: '0.85rem' }}>
                                            {lm.items?.map((item, idx) => (
                                                <div key={idx} style={{ color: '#8E9CA3', marginTop: '4px' }}>• {item}</div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ background: '#252B29', padding: '20px', borderRadius: '12px' }}>
                            <h4 style={{ margin: '0 0 15px 0', color: '#E3BC5A' }}>AMENITIES</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {project.amenities?.map(am => {
                                    const amenityData = ALL_AMENITIES.find(a => a.name === am);
                                    const IconComponent = amenityData ? amenityData.icon : CheckCircle2;
                                    return (
                                        <span key={am} style={{ fontSize: '0.75rem', background: '#333', padding: '6px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <IconComponent size={14} color={THEME.gold} /> {am}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ background: '#252B29', padding: '20px', borderRadius: '12px' }}>
                            <h4 style={{ margin: '0 0 15px 0', color: '#E3BC5A' }}>CONFIGURATIONS</h4>
                            <div style={{ display: 'grid', gap: '10px' }}>
                                {project.configurations?.map((c, i) => (
                                    <div key={i} style={{ borderBottom: '1px solid #333', pb: '5px' }}>
                                        <strong>{c.bedrooms} BHK - {c.area} Sq.ft</strong>
                                        <div style={{ fontSize: '0.75rem', color: '#888' }}>
                                            General Toilet: {c.general_toilet} | Personal: {c.personal_toilet} | Car: {c.car_parking} | Floor: {c.floor_number || 'N/A'}
                                        </div>
                                        {c.map_url && (
                                            <div style={{ marginTop: '10px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #444' }}>
                                                <img src={c.map_url} alt="Unit Layout" style={{ width: '100%', maxHeight: '150px', objectFit: 'contain', background: '#000' }} />
                                                <div style={{ padding: '4px', background: '#333', fontSize: '0.65rem', textAlign: 'center' }}>Unit Layout Map</div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {project.penthouse_configurations?.map((c, i) => (
                                    <div key={`p-${i}`} style={{ borderBottom: '1px solid #E3BC5A40', pb: '5px' }}>
                                        <strong style={{ color: '#E3BC5A' }}>Penthouse: {c.bedrooms} BHK</strong>
                                        {c.map_url && (
                                            <div style={{ marginTop: '10px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E3BC5A80' }}>
                                                <img src={c.map_url} alt="Penthouse Layout" style={{ width: '100%', maxHeight: '150px', objectFit: 'contain', background: '#000' }} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ background: '#252B29', padding: '20px', borderRadius: '12px' }}>
                            <h4 style={{ margin: '0 0 15px 0', color: '#E3BC5A' }}>TOWERS</h4>
                            {project.towers?.map((t, i) => (
                                <div key={i} style={{ fontSize: '0.9rem', marginBottom: '8px', borderBottom: '1px solid #333', paddingBottom: '5px' }}>
                                    <div style={{ color: '#E3BC5A', fontWeight: 'bold' }}>{t.type}</div>
                                    <div style={{ color: '#8E9CA3', fontSize: '0.8rem' }}>
                                        {t.bhk} BHK | G + {t.story} | Total Units: {t.total_units || 'N/A'}
                                    </div>
                                    <div style={{ color: '#8E9CA3', fontSize: '0.8rem' }}>
                                        FL: {t.units_per_floor} | Lifts: {t.lift_per_floor}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', borderTop: '1px solid #333', paddingTop: '30px', marginTop: '30px' }}>
                    {isEditing ? (
                        <>
                            <button onClick={onSave} style={{ flex: 2, padding: '15px', background: THEME.gold, color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>SAVE CHANGES</button>
                            <button onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '15px', background: '#444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>CANCEL</button>
                        </>
                    ) : (
                        <>
                            <Link to={`/post-project?editId=${project.id}`} style={{ flex: 1, padding: '15px', background: `${THEME.gold}20`, color: THEME.gold, border: `1px solid ${THEME.gold}`, borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center' }}>EDIT ALL (FULL FORM)</Link>
                            <button onClick={() => { setIsEditing(true); setEditForm({...project}); }} style={{ flex: 1, padding: '15px', background: '#333', color: THEME.gold, border: `1px solid ${THEME.gold}`, borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>QUICK EDIT</button>
                            <button onClick={() => { onUpdateStatus('projects', project.id, 'approved'); onClose(); }} style={{ flex: 1, padding: '15px', background: '#00C853', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>APPROVE</button>
                            <button onClick={() => { onUpdateStatus('projects', project.id, 'rejected'); onClose(); }} style={{ flex: 1, padding: '15px', background: '#FF5252', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>REJECT</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
