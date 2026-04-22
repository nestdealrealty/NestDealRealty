import React, { useState, useEffect } from 'react';
import { 
    Plus, Trash2, Building2, IndianRupee, 
    Calendar, CheckCircle2, AlertCircle, Save, Loader2, 
    Image as ImageIcon, Video, ChevronRight,
    Map as MapIcon, Layers, Landmark, Sparkles, X, Upload, HardHat,
    MapPin, Ruler, BedDouble, Bath, Car, ArrowLeft, Home, 
    Trees, Flower2, Dumbbell, PartyPopper, ShieldCheck, Camera, Waves,
    Leaf, Accessibility, Repeat, DoorOpen, Lock, Map, UserCheck, PhoneForwarded, Footprints, Heart,
    Check, Lamp, Users
} from 'lucide-react';
import { supabase } from '../supabase';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const THEME = {
    primary: '#1B4D3E',
    gold: '#D4AF37',
    text: '#FFFFFF',
    muted: '#A0AEC0',
    border: 'rgba(212, 175, 55, 0.2)',
    cardBg: '#121A16',
    inputBg: '#070B09',
    red: '#F56565'
};

const Section = ({ title, icon: Icon, children }) => (
    <div style={{ background: THEME.cardBg, padding: '30px', borderRadius: '16px', border: `1px solid ${THEME.border}`, marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
            <div style={{ padding: '10px', background: `${THEME.gold}20`, borderRadius: '10px', color: THEME.gold }}><Icon size={20} /></div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'Outfit, sans-serif' }}>{title}</h2>
        </div>
        {children}
    </div>
);

const renderInput = (label, value, onChange, placeholder, type = "text") => (
    <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', color: THEME.muted, fontSize: '0.8rem', marginBottom: '6px' }}>{label}</label>
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
                width: '100%', padding: '10px 12px', background: THEME.inputBg, border: `1px solid ${THEME.border}`,
                borderRadius: '8px', color: THEME.text, outline: 'none', fontSize: '0.9rem'
            }}
        />
    </div>
);

const AMENITIES_OPTIONS = [
    { name: "Club House", icon: Building2 },
    { name: "Swimming Pool", icon: Waves },
    { name: "Gym / Fitness Center", icon: Dumbbell },
    { name: "Lush Green Garden", icon: Leaf },
    { name: "Jogging Track", icon: Footprints },
    { name: "Children Play Area", icon: Accessibility },
    { name: "Gated Community", icon: ShieldCheck },
    { name: "24/7 Security", icon: UserCheck },
    { name: "CCTV Surveillance", icon: Camera },
    { name: "RCC Internal Roads", icon: Repeat },
    { name: "Street Lights", icon: Lamp }, // Using Landlord as fallback or change to Lamp if available
    { name: "Entrance Gate", icon: DoorOpen },
    { name: "Security Cabin", icon: Lock },
    { name: "Gazebo / Seating Area", icon: Home },
    { name: "Yoga Deck", icon: Heart },
    { name: "Party Lawn", icon: PartyPopper },
    { name: "Common Plot", icon: Map }
];

const renderSelect = (label, value, onChange, options) => (
    <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', color: THEME.muted, fontSize: '0.8rem', marginBottom: '6px' }}>{label}</label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
                width: '100%', padding: '10px 12px', background: THEME.inputBg, border: `1px solid ${THEME.border}`,
                borderRadius: '8px', color: THEME.text, outline: 'none', fontSize: '0.9rem', cursor: 'pointer'
            }}
        >
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

const renderImageUpload = (label, file, onFileChange, onRemove, existingUrl) => (
    <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', color: THEME.muted, fontSize: '0.8rem', marginBottom: '8px' }}>{label}</label>
        {!file && !existingUrl ? (
            <div style={{ border: `1px dashed ${THEME.border}`, borderRadius: '8px', padding: '15px', textAlign: 'center', cursor: 'pointer', position: 'relative', background: THEME.inputBg }}>
                <input type="file" accept="image/*" onChange={(e) => onFileChange(e.target.files[0])} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                <Upload size={20} color={THEME.gold} style={{ marginBottom: '5px' }} />
                <div style={{ fontSize: '0.8rem', color: THEME.muted }}>Upload Map</div>
            </div>
        ) : (
            <div style={{ position: 'relative', height: '60px', width: '100px', borderRadius: '4px', overflow: 'hidden', border: `1px solid ${THEME.border}` }}>
                <img src={file ? URL.createObjectURL(file) : existingUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button onClick={onRemove} style={{ position: 'absolute', top: '2px', right: '2px', background: THEME.red, border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', padding: '2px' }}><X size={10} /></button>
            </div>
        )}
    </div>
);

const PostPlotProject = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('editId');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    useEffect(() => {
        if (!user) {
            navigate('/login', { state: { from: '/post-plot-project' } });
            return;
        }
        fetchUserProfile();
        if (editId) {
            fetchProjectForEdit();
        }
    }, [editId, user, navigate]);

    const fetchUserProfile = async () => {
        try {
            const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            if (error && error.code !== 'PGRST116') throw error;
            if (data) {
                setFormData(prev => ({
                    ...prev,
                    sourceName: data.full_name || '',
                    sourceNumber: data.phone || '',
                    sourceEmail: data.email || user.email || '',
                    sourceEnrollCode: data.enroll_code || ''
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    sourceEmail: user.email || ''
                }));
            }
        } catch (err) {
            console.error("Error fetching profile:", err);
        }
    };

    const fetchProjectForEdit = async () => {
        try {
            const { data, error } = await supabase.from('projects').select('*').eq('id', editId).single();
            if (error) throw error;
            if (data) {
                setFormData({
                    project_name: data.name,
                    developer: data.developer,
                    locality: data.locality,
                    city: data.city || 'Ahmedabad',
                    property_type: 'Plots',
                    construction_status: data.construction_status || 'Upcoming',
                    plot_config: Array.isArray(data.plot_config) ? data.plot_config.map(p => ({ ...p, map_file: null })) : [],
                    villa_config: Array.isArray(data.villa_config) ? data.villa_config.map(v => ({ ...v, map_file: null })) : [],
                    phases: Array.isArray(data.phases) ? data.phases : [],
                    launch_date: data.launch_date || '',
                    possession_date: data.possession_date || '',
                    total_plot_area: data.total_plot_area || '',
                    total_phases: data.total_phases || '',
                    total_plots: data.total_plots || '',
                    min_price: data.min_price || '',
                    max_price: data.max_price || '',
                    images: Array.isArray(data.images) ? data.images.map(img => ({ url: typeof img === 'string' ? img : img.url })) : [],
                    tagline: data.tagline || 'Signature Homes',
                    google_map_link: data.google_map_link || '',
                    video_url: data.video_url || '',
                    amenities: Array.isArray(data.amenities) ? data.amenities : []
                });
                if (Array.isArray(data.images)) {
                    setPreviews(data.images.map(img => typeof img === 'string' ? img : img.url));
                }
            }
        } catch (err) {
            console.error("Error fetching project:", err);
            alert("Error loading project details");
        }
    };
    
    // Form State
    const [formData, setFormData] = useState({
        project_name: searchParams.get('name') || '',
        tagline: searchParams.get('tagline') || 'Signature Homes',
        developer: searchParams.get('developer') || '',
        locality: searchParams.get('locality') || '',
        city: 'Ahmedabad',
        property_type: 'Plots',
        construction_status: 'Upcoming',
        
        // 1. PLOTS Configurations
        plot_config: [{ size_sqft: '', price_per_sqft: '', sba_percent: '', construction_percent: '', map_file: null }],
        
        // 2. VILLA CONFIGURATION
        villa_config: [], // { bhk_type: '', built_up: '', plot_area: '', map_file: null, bedrooms: 3... }
        
        // 3. PHASE Logic
        phases: [{ name: '', total_units: '', plot_distributions: [{ count: '', size: '' }] }],
        
        // 4. Overall Details
        launch_date: '',
        possession_date: '',
        total_plot_area: '', // Total area in sq.ft
        total_phases: '',
        total_plots: '',
        min_price: '',
        max_price: '',
        
        // 5. Media & Links
        images: [], // { url, file }
        google_map_link: '',
        video_url: '',
        amenities: [],

        // Source Details
        sourceName: '',
        sourceNumber: '',
        sourceEmail: '',
        sourceEnrollCode: ''
    });

    const [previews, setPreviews] = useState([]);

    const updateForm = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    // Handlers for Plots
    const addPlotConfig = () => {
        updateForm('plot_config', [...formData.plot_config, { size_sqft: '', price_per_sqft: '', sba_percent: '', construction_percent: '', map_file: null }]);
    };
    const removePlotConfig = (idx) => {
        updateForm('plot_config', formData.plot_config.filter((_, i) => i !== idx));
    };

    // Handlers for Villas
    const addVillaConfig = () => {
        updateForm('villa_config', [...formData.villa_config, { 
            bhk_type: '3 BHK', built_up: '', map_file: null,
            bedrooms: 3, bathrooms: 3, balconies: 1, floors: 'G+1' 
        }]);
    };
    const removeVillaConfig = (idx) => {
        updateForm('villa_config', formData.villa_config.filter((_, i) => i !== idx));
    };

    // Handlers for Phases
    const addPhase = () => {
        updateForm('phases', [...formData.phases, { name: '', total_units: '', plot_distributions: [{ count: '', size: '' }] }]);
    };
    const removePhase = (idx) => {
        updateForm('phases', formData.phases.filter((_, i) => i !== idx));
    };
    const addPlotToPhase = (phaseIdx) => {
        const newPhases = [...formData.phases];
        newPhases[phaseIdx].plot_distributions.push({ count: '', size: '' });
        updateForm('phases', newPhases);
    };
    const removePlotFromPhase = (phaseIdx, plotIdx) => {
        const newPhases = [...formData.phases];
        newPhases[phaseIdx].plot_distributions = newPhases[phaseIdx].plot_distributions.filter((_, i) => i !== plotIdx);
        updateForm('phases', newPhases);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => ({ file, url: URL.createObjectURL(file) }));
        setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
        setPreviews(prev => [...prev, ...newImages.map(img => img.url)]);
    };

    const removeImage = (index) => {
        setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const uploadFile = async (file) => {
        if (!file) return null;
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9ms.]/g, '')}`;
        const { data, error: uploadError } = await supabase.storage.from('property-images').upload(`plots/${user.id}/${fileName}`, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('property-images').getPublicUrl(data.path);
        return publicUrl;
    };

    const onSubmit = async () => {
        if (!user) return alert("Please login first");
        setIsSubmitting(true);
        try {
            // Upload main images
            const imageUrls = [];
            for (const img of formData.images) {
                const url = await uploadFile(img.file);
                if (url) imageUrls.push({ url, category: 'General' });
            }

            // Upload Plot Maps
            const processedPlotConfig = await Promise.all(formData.plot_config.map(async (p) => {
                const map_url = p.map_file ? await uploadFile(p.map_file) : p.map_url;
                const { map_file, ...rest } = p;
                return { ...rest, map_url };
            }));

            // Upload Villa Maps
            const processedVillaConfig = await Promise.all(formData.villa_config.map(async (v) => {
                const map_url = v.map_file ? await uploadFile(v.map_file) : v.map_url;
                const { map_file, ...rest } = v;
                return { ...rest, map_url };
            }));

            const payload = {
                user_id: user.id,
                name: formData.project_name,
                tagline: formData.tagline || 'Signature Homes',
                developer: formData.developer,
                locality: formData.locality,
                city: formData.city,
                property_type: 'Plots',
                construction_status: formData.construction_status,
                
                plot_config: processedPlotConfig,
                villa_config: processedVillaConfig,
                phases: formData.phases,
                
                launch_date: formData.launch_date || null,
                possession_date: formData.possession_date || null,
                total_plot_area: formData.total_plot_area,
                total_phases: formData.total_phases,
                total_plots: formData.total_plots,
                min_price: formData.min_price,
                max_price: formData.max_price,
                
                images: imageUrls,
                google_map_link: formData.google_map_link,
                video_url: formData.video_url,
                amenities: formData.amenities,
                status: editId ? (formData.status || 'pending') : 'pending',

                // Source Details
                source_name: formData.sourceName,
                source_number: formData.sourceNumber,
                source_email: formData.sourceEmail,
                source_enroll_code: formData.sourceEnrollCode
            };

            const { error } = editId 
                ? await supabase.from('projects').update(payload).eq('id', editId)
                : await supabase.from('projects').insert([payload]);
            
            if (error) throw error;

            alert("Project Uploaded Successfully! Pending Admin Approval.");
            navigate('/admin');
        } catch (error) {
            console.error(error);
            alert("Error: " + error.message);
        } finally { setIsSubmitting(false); }
    };



    return (
        <div style={{ background: '#070B09', minHeight: '100vh', padding: '40px 20px', color: '#FFF' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <Link to="/post-project" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: THEME.muted, textDecoration: 'none', marginBottom: '30px' }}>
                    <ArrowLeft size={18} /> Back to Step 1
                </Link>

                {/* Progress Bar */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
                    {[0, 1].map(s => (
                        <div key={s} style={{ flex: 1, height: '4px', background: step >= s ? THEME.gold : THEME.border, borderRadius: '2px' }} />
                    ))}
                </div>

                {step === 0 && (
                    <div className="animate-slide-up" style={{ background: THEME.cardBg, padding: '40px', borderRadius: '16px', border: `1px solid ${THEME.border}`, maxWidth: '600px', margin: '30px auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                            <div style={{ padding: '12px', background: `${THEME.gold}20`, borderRadius: '12px', color: THEME.gold }}><Users size={24} /></div>
                            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Source Details</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                            {renderInput("User Name", formData.sourceName, (v) => updateForm('sourceName', v), "Enter Full Name")}
                            {renderInput("User Number", formData.sourceNumber, (v) => updateForm('sourceNumber', v), "Enter Phone Number")}
                            {renderInput("User Email", formData.sourceEmail, (v) => updateForm('sourceEmail', v), "Enter Email Address", "email")}
                            <div style={{ background: '#E3BC5A10', padding: '20px', borderRadius: '12px', border: '1px dashed #E3BC5A40' }}>
                                {renderInput("Enroll Code", formData.sourceEnrollCode, (v) => updateForm('sourceEnrollCode', v), "Assign Code (Optional)")}
                                <p style={{ fontSize: '0.75rem', color: THEME.muted, margin: '10px 0 0 0' }}>
                                    * Provided by Admin for trackings.
                                </p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
                            <button 
                                onClick={() => {
                                    if (!formData.sourceName || !formData.sourceNumber || !formData.sourceEmail) {
                                        alert("Please fill all required source details");
                                        return;
                                    }
                                    setStep(1);
                                }} 
                                style={{ padding: '12px 30px', background: THEME.gold, color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                Continue <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <>
                        <div style={{ marginBottom: '40px' }}>
                            <h1 style={{ fontSize: '2.2rem', margin: 0, fontFamily: 'Outfit, sans-serif' }}>Configure Plot Project</h1>
                            <p style={{ color: THEME.gold, margin: '5px 0' }}>Step 2: Detailed Configurations & Phases</p>
                        </div>

                        <Section title="PROJECT STATUS" icon={Building2}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {renderSelect("Construction Status", formData.construction_status, (v) => updateForm('construction_status', v), ['Upcoming', 'Under Construction', 'Ready to Move'])}
                        {renderInput("Custom Tagline", formData.tagline, (v) => updateForm('tagline', v), "e.g. Signature Homes")}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={{ color: THEME.muted, fontSize: '0.8rem', marginBottom: '6px' }}>Project City</label>
                            <div style={{ padding: '10px 12px', background: `${THEME.gold}10`, border: `1px solid ${THEME.border}`, borderRadius: '8px', color: THEME.gold, fontSize: '0.9rem', fontWeight: 'bold' }}>
                                {formData.city} (Pre-filled from Step 1)
                            </div>
                        </div>
                    </div>
                </Section>

                {/* 1. PLOTS Configurations */}
                <Section title="PLOTS CONFIGURATIONS" icon={Ruler}>
                    {formData.plot_config.map((item, idx) => (
                        <div key={idx} style={{ background: '#00000030', padding: '20px', borderRadius: '12px', border: `1px solid ${THEME.border}`, marginBottom: '15px', position: 'relative' }}>
                            {idx > 0 && <button onClick={() => removePlotConfig(idx)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: THEME.red, cursor: 'pointer' }}><X size={16} /></button>}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
                                {renderInput("Plot Size (Sq.ft)", item.size_sqft, (v) => {
                                    const newConfig = [...formData.plot_config];
                                    newConfig[idx].size_sqft = v;
                                    updateForm('plot_config', newConfig);
                                }, "e.g. 1500")}
                                {renderInput("Price per Sq.ft (INR)", item.price_per_sqft, (v) => {
                                    const newConfig = [...formData.plot_config];
                                    newConfig[idx].price_per_sqft = v;
                                    updateForm('plot_config', newConfig);
                                }, "e.g. 4500")}
                                {renderInput("Super Build Up Area (%)", item.sba_percent, (v) => {
                                    const newConfig = [...formData.plot_config];
                                    newConfig[idx].sba_percent = v;
                                    updateForm('plot_config', newConfig);
                                }, "e.g. 40")}
                                {renderInput("Construction Area (%)", item.construction_percent, (v) => {
                                    const newConfig = [...formData.plot_config];
                                    newConfig[idx].construction_percent = v;
                                    updateForm('plot_config', newConfig);
                                }, "e.g. 60")}
                                {renderImageUpload("Layout Map", item.map_file, (file) => {
                                    const newConfig = [...formData.plot_config];
                                    newConfig[idx].map_file = file;
                                    updateForm('plot_config', newConfig);
                                }, () => {
                                    const newConfig = [...formData.plot_config];
                                    newConfig[idx].map_file = null;
                                    newConfig[idx].map_url = null;
                                    updateForm('plot_config', newConfig);
                                }, item.map_url)}
                            </div>
                        </div>
                    ))}
                    <button onClick={addPlotConfig} style={{ background: 'none', border: `1px dashed ${THEME.gold}`, color: THEME.gold, padding: '10px', borderRadius: '8px', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Plus size={18} /> Add More Plot Configuration
                    </button>
                </Section>

                {/* 2. VILLA CONFIGURATION */}
                <Section title="VILLA CONFIGURATION" icon={Home}>
                    {formData.villa_config.map((item, idx) => (
                        <div key={idx} style={{ background: '#00000030', padding: '25px', borderRadius: '12px', border: `1px solid ${THEME.border}`, marginBottom: '20px', position: 'relative' }}>
                            <button onClick={() => removeVillaConfig(idx)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: THEME.red, cursor: 'pointer' }}><X size={20} /></button>
                            <h4 style={{ color: THEME.gold, marginTop: 0, marginBottom: '20px', fontSize: '1.1rem', fontWeight: 'bold' }}>Villa Type {idx + 1} Details</h4>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '25px' }}>
                                {renderSelect("Villa BHK Type", item.bhk_type, (v) => {
                                    const newConfig = [...formData.villa_config];
                                    newConfig[idx].bhk_type = v;
                                    updateForm('villa_config', newConfig);
                                }, ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', '6 BHK', '7 BHK', '8 BHK'])}
                                {renderInput("Display Price", item.price, (v) => {
                                    const newConfig = [...formData.villa_config];
                                    newConfig[idx].price = v;
                                    updateForm('villa_config', newConfig);
                                }, "e.g. 3.25 Cr")}
                                {renderInput("Built-up Area (Sq.ft)", item.built_up, (v) => {
                                    const newConfig = [...formData.villa_config];
                                    newConfig[idx].built_up = v;
                                    updateForm('villa_config', newConfig);
                                })}

                                {renderImageUpload("Villa Map/Layout", item.map_file, (file) => {
                                    const newConfig = [...formData.villa_config];
                                    newConfig[idx].map_file = file;
                                    updateForm('villa_config', newConfig);
                                }, () => {
                                    const newConfig = [...formData.villa_config];
                                    newConfig[idx].map_file = null;
                                    newConfig[idx].map_url = null;
                                    updateForm('villa_config', newConfig);
                                }, item.map_url)}
                            </div>

                            <div style={{ borderTop: `1px solid ${THEME.border}30`, paddingTop: '20px' }}>
                                <label style={{ display: 'block', color: THEME.gold, fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '15px', letterSpacing: '1px' }}>ROOMS & AMENITIES</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px' }}>
                                    {[
                                        { label: 'Bedrooms', key: 'bedrooms' },
                                        { label: 'Toilets', key: 'toilets' },
                                        { label: 'Halls', key: 'halls' },
                                        { label: 'Kitchens', key: 'kitchens' },
                                        { label: 'Balconies', key: 'balconies' },
                                        { label: 'Pooja Room', key: 'pooja' },
                                        { label: 'Servant Room', key: 'servant' },
                                        { label: 'Store Room', key: 'store' },
                                        { label: 'Car Parking', key: 'parking' }
                                    ].map(detail => (
                                        <div key={detail.key} style={{ background: '#FFF0', border: `1px solid ${THEME.border}`, padding: '10px 15px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: '0.8rem', color: THEME.muted }}>{detail.label}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <button onClick={() => {
                                                    const newConfig = [...formData.villa_config];
                                                    newConfig[idx][detail.key] = Math.max(0, (newConfig[idx][detail.key] || 0) - 1);
                                                    updateForm('villa_config', newConfig);
                                                }} style={{ background: 'none', border: 'none', color: THEME.muted, cursor: 'pointer' }}>-</button>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 'bold', minWidth: '15px', textAlign: 'center' }}>{item[detail.key] || 0}</span>
                                                <button onClick={() => {
                                                    const newConfig = [...formData.villa_config];
                                                    newConfig[idx][detail.key] = (newConfig[idx][detail.key] || 0) + 1;
                                                    updateForm('villa_config', newConfig);
                                                }} style={{ background: 'none', border: 'none', color: THEME.muted, cursor: 'pointer' }}>+</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                    <button onClick={addVillaConfig} style={{ background: 'none', border: `1px dashed ${THEME.gold}`, color: THEME.gold, padding: '12px', borderRadius: '10px', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold' }}>
                        <Plus size={20} /> ADD MORE VILLA CONFIGURATION
                    </button>
                </Section>

                <Section title="PROJECT PHASES" icon={Layers}>
                    {formData.phases.map((phase, pIdx) => (
                        <div key={pIdx} style={{ background: '#00000030', padding: '25px', borderRadius: '12px', border: `1px solid ${THEME.border}`, marginBottom: '20px', position: 'relative' }}>
                            {pIdx > 0 && <button onClick={() => removePhase(pIdx)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: THEME.red, cursor: 'pointer' }}><Trash2 size={18} /></button>}
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', marginBottom: '20px' }}>
                                {renderInput("Phase Name", phase.name, (v) => {
                                    const newPhases = [...formData.phases];
                                    newPhases[pIdx].name = v;
                                    updateForm('phases', newPhases);
                                }, "e.g. Green Meadows Phase 1")}
                                {renderInput("Total Units", phase.total_units, (v) => {
                                    const newPhases = [...formData.phases];
                                    newPhases[pIdx].total_units = v;
                                    updateForm('phases', newPhases);
                                }, "100", "number")}
                            </div>

                            <div style={{ borderTop: `1px solid ${THEME.border}50`, paddingTop: '15px' }}>
                                <label style={{ display: 'block', color: THEME.gold, fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '15px', letterSpacing: '1px' }}>PLOT DISTRIBUTIONS</label>
                                {phase.plot_distributions.map((dist, dIdx) => (
                                    <div key={dIdx} style={{ display: 'flex', gap: '15px', marginBottom: '10px', alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1 }}>
                                            {renderInput("Number of Plots", dist.count, (v) => {
                                                const newPhases = [...formData.phases];
                                                newPhases[pIdx].plot_distributions[dIdx].count = v;
                                                updateForm('phases', newPhases);
                                            }, "e.g. 20", "number")}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            {renderInput("Size of Plot (Sq.ft)", dist.size, (v) => {
                                                const newPhases = [...formData.phases];
                                                newPhases[pIdx].plot_distributions[dIdx].size = v;
                                                updateForm('phases', newPhases);
                                            }, "e.g. 1500")}
                                        </div>
                                        {dIdx > 0 && (
                                            <button onClick={() => removePlotFromPhase(pIdx, dIdx)} style={{ marginTop: '32px', background: 'none', border: 'none', color: THEME.red, cursor: 'pointer' }}>
                                                <X size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button onClick={() => addPlotToPhase(pIdx)} style={{ background: 'rgba(212, 175, 55, 0.1)', border: `1px dashed ${THEME.gold}`, color: THEME.gold, padding: '8px', borderRadius: '6px', width: '100%', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                    + ADD MORE PLOTS
                                </button>
                            </div>
                        </div>
                    ))}
                    <button onClick={addPhase} style={{ background: 'none', border: `1px dashed ${THEME.gold}`, color: THEME.gold, padding: '10px', borderRadius: '8px', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold' }}>
                        <Plus size={18} /> ADD MORE PHASE
                    </button>
                </Section>
                
                {/* 6. Amenities */}
                <Section title="PROJECT AMENITIES" icon={Sparkles}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
                        {AMENITIES_OPTIONS.map((amt) => {
                            const isSelected = formData.amenities.includes(amt.name);
                            return (
                                <div 
                                    key={amt.name}
                                    onClick={() => {
                                        const newAmt = isSelected 
                                            ? formData.amenities.filter(a => a !== amt.name)
                                            : [...formData.amenities, amt.name];
                                        updateForm('amenities', newAmt);
                                    }}
                                    style={{
                                        padding: '15px 12px', background: isSelected ? `${THEME.gold}20` : THEME.inputBg,
                                        border: `1px solid ${isSelected ? THEME.gold : THEME.border}`,
                                        borderRadius: '12px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', position: 'relative'
                                    }}
                                >
                                    {isSelected && <Check size={14} style={{ position: 'absolute', top: '8px', right: '8px', color: THEME.gold }} />}
                                    <amt.icon size={24} color={isSelected ? THEME.gold : THEME.muted} />
                                    <span style={{ fontSize: '0.75rem', color: isSelected ? '#FFF' : THEME.muted, fontWeight: isSelected ? 'bold' : 'normal' }}>{amt.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </Section>
                
                {/* 7. Overall Details */}
                <Section title="OVERALL PROJECT DETAILS" icon={Sparkles}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {renderInput("Launch Date", formData.launch_date, (v) => updateForm('launch_date', v), "", "date")}
                        {renderInput("Possession Date", formData.possession_date, (v) => updateForm('possession_date', v), "", "date")}
                        {renderInput("Total Project Area (Sq.ft)", formData.total_plot_area, (v) => updateForm('total_plot_area', v))}
                        {renderInput("Total Phases", formData.total_phases, (v) => updateForm('total_phases', v), "e.g. 3")}
                        {renderInput("Total Plots", formData.total_plots, (v) => updateForm('total_plots', v), "e.g. 250")}
                        {renderInput("Min Price Index (₹)", formData.min_price, (v) => updateForm('min_price', v), "e.g. 45 Lac")}
                        {renderInput("Max Price Index (₹)", formData.max_price, (v) => updateForm('max_price', v), "e.g. 1.2 Cr")}
                    </div>
                </Section>

                {/* 5. Media & Links */}
                <Section title="MEDIA & ASSETS" icon={ImageIcon}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                        <div style={{ border: `2px dashed ${THEME.border}`, borderRadius: '12px', padding: '30px', textAlign: 'center', cursor: 'pointer', position: 'relative' }}>
                            <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                            <Upload size={32} color={THEME.gold} style={{ marginBottom: '10px' }} />
                            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold' }}>Upload Project Images</p>
                            <p style={{ color: THEME.muted, fontSize: '0.75rem' }}>Max 10 images recommended</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))', gap: '8px' }}>
                            {previews.map((src, i) => (
                                <div key={i} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '6px', overflow: 'hidden', border: `1px solid ${THEME.border}` }}>
                                    <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <button onClick={(e) => { e.preventDefault(); removeImage(i); }} style={{ position: 'absolute', top: '2px', right: '2px', background: THEME.red, border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', padding: '1px' }}><X size={10} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        {renderInput("Google Maps Location Link", formData.google_map_link, (v) => updateForm('google_map_link', v), "https://maps.google.com/...")}
                        {renderInput("YouTube Video Link", formData.video_url, (v) => updateForm('video_url', v), "https://youtube.com/watch?v=...")}
                    </div>
                </Section>

                <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'center' }}>
                    <button 
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        style={{ 
                            padding: '16px 80px', background: THEME.gold, color: '#000', border: 'none', 
                            borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '10px', opacity: isSubmitting ? 0.7 : 1
                        }}
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                        {isSubmitting ? 'UPLOADING...' : 'FINISH & SUBMIT PROJECT'}
                    </button>
                    <button onClick={() => setStep(0)} style={{ marginTop: '20px', padding: '10px', background: 'none', border: 'none', color: THEME.muted, cursor: 'pointer', textDecoration: 'underline' }}>Back to Source Details</button>
                </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PostPlotProject;
