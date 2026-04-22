import React, { useState, useEffect } from 'react';
import { 
    ArrowLeft, Upload, Check, ChevronRight, MapPin, Building2, HardHat, Info, Plus, Trash2, X, FileText, Video,
    Trees, Flower2, Target, Car, Palmtree, Mountain, Dumbbell, PartyPopper, ShieldCheck, Camera, ParkingCircle, 
    ArrowUpToLine, Flame, Zap, Baby, Footprints, Gamepad2, Trophy, BadgeCheck, Heart, DoorClosed, Waves, Wine, ChefHat, 
    Bike, Lamp, GraduationCap, Flag, Globe, Bath, Mic2, Lock, WashingMachine, Repeat, UserCheck, 
    Droplets, Volleyball, Activity, Scissors, Gift, Calendar, Leaf, Tent, Users, Music, Sofa, Tv, Droplet, 
    Joystick, Coffee, Library, Store, DoorOpen, Accessibility, Home, PhoneForwarded, Minus, Map
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';

const THEME = {
    bg: '#0C1512',
    cardBg: '#1A1F1D',
    inputBg: '#252B29',
    text: '#E6ECE9',
    muted: '#8E9CA3',
    gold: '#E3BC5A',
    green: '#1B4D3E',
    red: '#FF5252',
    border: '#2A2F2D'
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
    { name: "Yoga Space", icon: Heart },
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
    { name: "Garden", icon: Leaf },
    { name: "Children Play Area", icon: Gamepad2 },
    { name: "Senior Citizen Area", icon: Accessibility },
    { name: "RCC Roads", icon: Repeat },
    { name: "Plantation", icon: Leaf },
    { name: "Entry Gate", icon: DoorOpen },
    { name: "Security Cabin", icon: Lock },
    { name: "Common Plot", icon: Map },
    { name: "Gated Community", icon: ShieldCheck },
    { name: "CCTV", icon: Camera },
    { name: "Security Guard", icon: UserCheck },
    { name: "Intercom Facility", icon: PhoneForwarded },
    { name: "Private Pool", icon: Waves },
    { name: "Private Terrace", icon: Mountain },
    { name: "Party Lawn", icon: Wine },
    { name: "Kids Play Room", icon: Gamepad2 },
    { name: "Villa with Lift", icon: ArrowUpToLine },
    { name: "Solar System in each Villa", icon: Zap }
];

const PostProject = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('editId');
    const [step, setStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

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

    useEffect(() => {
        if (!user) {
            navigate('/login', { state: { from: '/post-project' } });
            return;
        }
        fetchUserProfile();
        if (editId) {
            fetchProjectForEdit();
        }
    }, [editId, user, navigate]);

    const fetchProjectForEdit = async () => {
        try {
            const { data, error } = await supabase.from('projects').select('*').eq('id', editId).single();
            if (error) throw error;
            if (data) {
                const sanitizeConfig = (list) => (Array.isArray(list) ? list : []).filter(item => item && typeof item === 'object').map(c => ({ 
                    bedrooms: 0, halls: 0, kitchens: 0, 
                    balcony: 0, foyer: 0, drawing_living_dining: 0,
                    store_room: 0, washyard: 0, servant_room: 0,
                    general_toilet: 0, personal_toilet: 0, pooja_room: 0, car_parking: 0,
                    dressing_room: 0, vestibule: 0, sky_patio_balcony: 0, floor_number: '',
                    area: '', price: '', map_url: '',
                    ...c, 
                    map_file: null 
                }));

                const sanitizeLandmarks = (list) => (Array.isArray(list) ? list : []).filter(item => item && typeof item === 'object').map(l => ({
                    title: l.title || '',
                    items: Array.isArray(l.items) ? l.items : ['']
                }));

                if (sanitizeLandmarks(data.landmarks).length === 0) {
                    data.landmarks = [{ title: '', items: [''] }];
                }

                const sanitizeTowers = (list) => (Array.isArray(list) ? list : []).filter(t => t && typeof t === 'object').map(t => ({
                    type: '', bhk: '3', lift_per_floor: '', units_per_floor: '', story: '1', total_units: '',
                    ...t
                }));

                setFormData({
                    ...data,
                    amenities: Array.isArray(data.amenities) ? data.amenities : [],
                    landmarks: sanitizeLandmarks(data.landmarks),
                    towers: sanitizeTowers(data.towers),
                    images: Array.isArray(data.images) ? data.images.map(url => (typeof url === 'string' ? { url, file: null, category: 'Main' } : url)) : [],
                    configurations: sanitizeConfig(data.configurations),
                    penthouse_configurations: sanitizeConfig(data.penthouse_configurations),
                    brochure_file: null,
                    brochure_url: data.brochure_url || '',
                    private_terrace_size: data.private_terrace_size || ''
                });
            }
        } catch (err) {
            console.error(err);
            alert("Failed to load project for editing.");
        }
    };

    const [formData, setFormData] = useState({
        name: '',
        developer: '',
        locality: '',
        city: 'Ahmedabad',
        property_type: 'Flat',
        construction_status: 'Under Construction',
        address: '',
        pincode: '',
        rera_id: '',
        rera_link: '',
        launch_date: '',
        possession_date: '',
        available_from: '',
        property_age: '',
        furnishing_status: 'Unfurnished',
        flooring_type: '',
        wall_finish: '',
        facing: 'East',
        corner_property: 'No',
        total_plot_area: '',
        total_units: '',
        total_towers: '',
        amenities: [],
        landmarks: [{ title: '', items: [''] }],
        configurations: [{ 
            bedrooms: 3, bhk_type: '3 BHK', bathrooms: 3, balconies: 1, living_rooms: 1, dining_areas: 1, kitchens: 1, kitchen_type: 'Modular',
            super_built_up_area: '', built_up_area: '', carpet_area: '', plot_area: '', total_floors: '2',
            store_room: 0, washyard: 1, servant_room: 0, garden_lawn: 0, porch: 0, private_terrace: 0,
            area: '', price: '', map_url: '', map_file: null 
        }],
        penthouse_configurations: [],
        towers: [{ type: '', bhk: '3', lift_per_floor: '', units_per_floor: '', story: '1', total_units: '' }],
        images: [], // { file, url, category }
        brochure_file: null,
        video_url: '',
        tour_360_url: '',
        google_map_link: '',

        // Source Details
        sourceName: '',
        sourceNumber: '',
        sourceEmail: '',
        sourceEnrollCode: ''
    });

    const updateForm = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
    };

    const addConfig = () => {
        setFormData(prev => ({
            ...prev,
            configurations: [...prev.configurations, { 
                bedrooms: 3, halls: 1, kitchens: 1, 
                balcony: 1, foyer: 1, drawing_living_dining: 1,
                patio: 0, store: 0, washyard: 1, servant_room: 0,
                toilet: 3, pooja_room: 0, car_parking: 1,
                area: '', price: '' 
            }]
        }));
    };

    const addTower = () => {
        setFormData(prev => ({
            ...prev,
            towers: [...prev.towers, { type: '', bhk: '3', lift_per_floor: '', units_per_floor: '', story: '1', total_units: '' }]
        }));
    };

    const removeTower = (index) => {
        setFormData(prev => ({
            ...prev,
            towers: prev.towers.filter((_, i) => i !== index)
        }));
    };

    const removeConfig = (index) => {
        setFormData(prev => ({
            ...prev,
            configurations: prev.configurations.filter((_, i) => i !== index)
        }));
    };

    const addPenthouseConfig = () => {
        setFormData(prev => ({
            ...prev,
            penthouse_configurations: [...prev.penthouse_configurations, { 
                bedrooms: 4, halls: 1, kitchens: 1, 
                balcony: 2, foyer: 1, drawing_living_dining: 1,
                store_room: 1, washyard: 1, servant_room: 1,
                general_toilet: 1, personal_toilet: 4, pooja_room: 1, car_parking: 2,
                dressing_room: 1, vestibule: 1, sky_patio_balcony: 1, floor_number: '',
                area: '', price: '', map_url: '', map_file: null 
            }]
        }));
    };

    const removePenthouseConfig = (index) => {
        setFormData(prev => ({
            ...prev,
            penthouse_configurations: prev.penthouse_configurations.filter((_, i) => i !== index)
        }));
    };

    const addLandmark = () => {
        setFormData(prev => ({
            ...prev,
            landmarks: [...prev.landmarks, { title: '', items: [''] }]
        }));
    };

    const addLandmarkItem = (landmarkIdx) => {
        const newLand = [...formData.landmarks];
        newLand[landmarkIdx].items.push('');
        updateForm('landmarks', newLand);
    };

    const removeLandmarkItem = (landmarkIdx, itemIdx) => {
        const newLand = [...formData.landmarks];
        newLand[landmarkIdx].items = newLand[landmarkIdx].items.filter((_, i) => i !== itemIdx);
        updateForm('landmarks', newLand);
    };

    const toggleAmenity = (name) => {
        setFormData(prev => {
            const exists = prev.amenities.includes(name);
            if (exists) {
                return { ...prev, amenities: prev.amenities.filter(a => a !== name) };
            } else {
                return { ...prev, amenities: [...prev.amenities, name] };
            }
        });
    };

    const handleImageUpload = (e, category) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const newImgs = files.map(file => ({
                file,
                url: URL.createObjectURL(file),
                category
            }));
            setFormData(prev => ({ ...prev, images: [...prev.images, ...newImgs] }));
        }
    };

    const validateStep1 = () => {
        const errs = {};
        if (!formData.name) errs.name = "Required";
        if (!formData.developer) errs.developer = "Required";
        if (!formData.locality) errs.locality = "Required";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async () => {
        if (!user) {
            alert("Please sign in first");
            return;
        }
        setSubmitting(true);
        try {
            // 1. Upload Project Main Images (only new ones)
            const imageUrls = [];
            for (const img of formData.images) {
                if (img.file) {
                    const fileName = `${Date.now()}_${img.file.name.replace(/[^a-zA-Z0-9ms.]/g, '')}`;
                    const { data, error } = await supabase.storage.from('property-images').upload(`projects/${user.id}/${fileName}`, img.file);
                    if (error) throw error;
                    const { data: { publicUrl } } = supabase.storage.from('property-images').getPublicUrl(data.path);
                    if (publicUrl) imageUrls.push(publicUrl);
                } else if (img.url) {
                    imageUrls.push(img.url);
                } else if (typeof img === 'string') {
                    imageUrls.push(img);
                }
            }

            // 2. Upload Unit Maps
            const finalConfigs = JSON.parse(JSON.stringify(formData.configurations));
            for (let i = 0; i < finalConfigs.length; i++) {
                if (formData.configurations[i].map_file) {
                    const fileName = `map_${Date.now()}_${i}.jpg`;
                    const { data, error } = await supabase.storage.from('property-images').upload(`maps/${user.id}/${fileName}`, formData.configurations[i].map_file);
                    if (!error) {
                        const { data: { publicUrl } } = supabase.storage.from('property-images').getPublicUrl(data.path);
                        finalConfigs[i].map_url = publicUrl;
                    }
                    delete finalConfigs[i].map_file;
                }
            }

            const finalPentConfigs = JSON.parse(JSON.stringify(formData.penthouse_configurations));
            for (let i = 0; i < finalPentConfigs.length; i++) {
                if (formData.penthouse_configurations[i].map_file) {
                    const fileName = `pent_map_${Date.now()}_${i}.jpg`;
                    const { data, error } = await supabase.storage.from('property-images').upload(`maps/${user.id}/${fileName}`, formData.penthouse_configurations[i].map_file);
                    if (!error) {
                        const { data: { publicUrl } } = supabase.storage.from('property-images').getPublicUrl(data.path);
                        finalPentConfigs[i].map_url = publicUrl;
                    }
                    delete finalPentConfigs[i].map_file;
                }
            }

            // 3. Upload Brochure if exists
            let brochureUrl = formData.brochure_url || '';
            if (formData.brochure_file) {
                const fileName = `brochure_${Date.now()}_${formData.brochure_file.name}`;
                const { data, error } = await supabase.storage.from('property-images').upload(`brochures/${user.id}/${fileName}`, formData.brochure_file);
                if (error) throw error;
                const { data: { publicUrl } } = supabase.storage.from('property-images').getPublicUrl(data.path);
                brochureUrl = publicUrl;
            }

            // 4. Insert or Update into DB
            const payload = {
                user_id: user.id,
                user_email: formData.user_email || user.email,
                name: formData.name,
                developer: formData.developer,
                locality: formData.locality,
                city: formData.city,
                property_type: formData.property_type,
                construction_status: formData.construction_status,
                rera_id: formData.rera_id,
                rera_link: formData.rera_link,
                launch_date: formData.launch_date || null,
                possession_date: formData.possession_date || null,
                total_plot_area: formData.total_plot_area,
                total_units: formData.total_units ? parseInt(formData.total_units) : null,
                total_towers: formData.total_towers ? parseInt(formData.total_towers) : null,
                amenities: formData.amenities,
                landmarks: formData.landmarks,
                configurations: finalConfigs,
                penthouse_configurations: finalPentConfigs,
                towers: formData.towers,
                images: imageUrls,
                brochure_url: brochureUrl,
                video_url: formData.video_url,
                tour_360_url: formData.tour_360_url,
                google_map_link: formData.google_map_link,
                address: formData.address,
                pincode: formData.pincode,
                available_from: formData.available_from,
                property_age: formData.property_age,
                furnishing_status: formData.furnishing_status,
                flooring_type: formData.flooring_type,
                wall_finish: formData.wall_finish,
                facing: formData.facing,
                corner_property: formData.corner_property,
                status: editId ? (formData.status || 'pending') : 'pending',
                
                // Source Details
                source_name: formData.sourceName,
                source_number: formData.sourceNumber,
                source_email: formData.sourceEmail,
                source_enroll_code: formData.sourceEnrollCode
            };

            if (editId) {
                const { error: updateError } = await supabase.from('projects').update(payload).eq('id', editId);
                if (updateError) throw updateError;
            } else {
                const { error: insertError } = await supabase.from('projects').insert([payload]);
                if (insertError) throw insertError;
            }

            setStep(4);
        } catch (err) {
            console.error('Submission error:', err);
            alert("Unexpected error during submission: " + (err.message || "Unknown error"));
        } finally {
            setSubmitting(false);
        }
    };

    const renderInput = (label, key, placeholder, type = "text", error) => (
        <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: THEME.muted, fontSize: '0.85rem', marginBottom: '8px' }}>{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                value={formData[key] || ''}
                onChange={(e) => updateForm(key, e.target.value)}
                style={{
                    width: '100%', padding: '12px 15px', background: THEME.inputBg, border: `1px solid ${error ? THEME.red : THEME.border}`,
                    borderRadius: '8px', color: THEME.text, outline: 'none'
                }}
            />
            {error && <span style={{ color: THEME.red, fontSize: '0.75rem' }}>{error}</span>}
        </div>
    );

    const renderConfigInput = (label, idx, key, placeholder, type = "text") => (
        <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', color: THEME.muted, fontSize: '0.75rem', marginBottom: '8px' }}>{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                value={formData.configurations[idx][key] || ''}
                onChange={(e) => {
                    const newConfig = [...formData.configurations];
                    newConfig[idx][key] = e.target.value;
                    updateForm('configurations', newConfig);
                }}
                style={{
                    width: '100%', padding: '10px', background: THEME.inputBg, border: `1px solid ${THEME.border}`,
                    borderRadius: '8px', color: THEME.text, outline: 'none', fontSize: '0.85rem'
                }}
            />
        </div>
    );

    const renderConfigCounter = (label, idx, key) => (
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <div style={{ color: THEME.muted, fontSize: '0.7rem', marginBottom: '8px' }}>{label.toUpperCase()}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: THEME.inputBg, padding: '5px', borderRadius: '8px', border: `1px solid ${THEME.border}` }}>
                <button 
                    onClick={() => {
                        const newConfig = [...formData.configurations];
                        newConfig[idx][key] = Math.max(0, (newConfig[idx][key] || 0) - 1);
                        updateForm('configurations', newConfig);
                    }}
                    style={{ background: 'none', border: 'none', color: THEME.gold, cursor: 'pointer' }}
                ><Minus size={14} /></button>
                <span style={{ minWidth: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>{formData.configurations[idx][key] || 0}</span>
                <button 
                    onClick={() => {
                        const newConfig = [...formData.configurations];
                        newConfig[idx][key] = (newConfig[idx][key] || 0) + 1;
                        updateForm('configurations', newConfig);
                    }}
                    style={{ background: 'none', border: 'none', color: THEME.gold, cursor: 'pointer' }}
                ><Plus size={14} /></button>
            </div>
        </div>
    );

    return (
        <div style={{ background: THEME.bg, minHeight: '100vh', color: THEME.text, padding: '40px 20px', fontFamily: 'Outfit, sans-serif' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                {/* Back Button */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: THEME.muted, textDecoration: 'none', marginBottom: '30px', width: 'fit-content' }}>
                    <ArrowLeft size={18} /> Back to Home
                </Link>

                {/* Progress Bar */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
                    {[0, 1, 2, 3].map(s => (
                        <div key={s} style={{ flex: 1, height: '4px', background: step >= s ? THEME.gold : THEME.border, borderRadius: '2px' }} />
                    ))}
                </div>

                {step === 0 && (
                    <div className="animate-slide-up" style={{ background: THEME.cardBg, padding: '40px', borderRadius: '16px', border: `1px solid ${THEME.border}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                            <div style={{ padding: '12px', background: `${THEME.gold}20`, borderRadius: '12px', color: THEME.gold }}><Users size={24} /></div>
                            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Source Details</h2>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                            {renderInput("User Name", "sourceName", "Enter Full Name", "text")}
                            {renderInput("User Number", "sourceNumber", "Enter Phone Number", "tel")}
                            {renderInput("User Email", "sourceEmail", "Enter Email Address", "email")}
                            <div style={{ background: '#E3BC5A10', padding: '20px', borderRadius: '12px', border: '1px dashed #E3BC5A40' }}>
                                {renderInput("Enroll Code", "sourceEnrollCode", "Assign Code (Optional)", "text")}
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
                                Continue To Project Details <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <div className="animate-slide-up" style={{ background: THEME.cardBg, padding: '40px', borderRadius: '16px', border: `1px solid ${THEME.border}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                            <div style={{ padding: '12px', background: `${THEME.gold}20`, borderRadius: '12px', color: THEME.gold }}><Building2 size={24} /></div>
                            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Basic Project Details</h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            {renderInput("Project Name", "name", "e.g., Param Nest", "text", errors.name)}
                            {renderInput("Developer Name", "developer", "e.g., Venus Group", "text", errors.developer)}
                            


                            {renderInput("Area / Locality", "locality", "e.g., Shela", "text", errors.locality)}
                            
                            {['Villa', 'Bunglows'].includes(formData.property_type) && renderInput("Landmark", "landmark", "e.g., Near Apollo Hospital")}

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', color: THEME.muted, fontSize: '0.85rem', marginBottom: '8px' }}>City</label>
                                <select value={formData.city} onChange={(e) => updateForm('city', e.target.value)} style={{ width: '100%', padding: '12px 15px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, borderRadius: '8px', color: THEME.text, outline: 'none' }}>
                                    <option>Ahmedabad</option>
                                    <option>Gandhinagar</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            {renderInput("RERA ID", "rera_id", "PR/GJ/...")}
                            {renderInput("RERA Link", "rera_link", "https://gujrera.gujarat.gov.in/...")}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ marginBottom: '20px', gridColumn: '1/-1' }}>
                                <label style={{ display: 'block', color: THEME.muted, fontSize: '0.85rem', marginBottom: '8px' }}>Property Type</label>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    {['Flat', 'Villa', 'Bunglows', 'Weekend Homes', 'Plots', 'Commercial'].map(t => (
                                        <button key={t} onClick={() => updateForm('property_type', t)} style={{ padding: '10px 15px', background: formData.property_type === t ? `${THEME.gold}20` : 'transparent', border: `1px solid ${formData.property_type === t ? THEME.gold : THEME.border}`, color: formData.property_type === t ? THEME.gold : THEME.text, borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>{t}</button>
                                    ))}
                                </div>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', color: THEME.muted, fontSize: '0.85rem', marginBottom: '8px' }}>Status</label>
                                <select value={formData.construction_status} onChange={(e) => updateForm('construction_status', e.target.value)} style={{ width: '100%', padding: '12px 15px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, borderRadius: '8px', color: THEME.text, outline: 'none' }}>
                                    <option>New Launch</option>
                                    <option>Under Construction</option>
                                    <option>Ready to Move</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                            <button onClick={() => setStep(0)} style={{ background: 'none', border: 'none', color: THEME.muted, cursor: 'pointer', textDecoration: 'underline' }}>Back To Source Details</button>
                            <button onClick={() => {
                                if (validateStep1()) {
                                    if (formData.property_type === 'Plots') {
                                        navigate(`/post-plot-project?name=${encodeURIComponent(formData.name)}&developer=${encodeURIComponent(formData.developer || '')}&locality=${encodeURIComponent(formData.locality || '')}${editId ? `&editId=${editId}` : ''}`);
                                    } else {
                                        setStep(2);
                                    }
                                }
                            }} style={{ padding: '12px 30px', background: THEME.gold, color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                Next Step <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-slide-up" style={{ background: THEME.cardBg, padding: '40px', borderRadius: '16px', border: `1px solid ${THEME.border}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                            <div style={{ padding: '12px', background: `${THEME.gold}20`, borderRadius: '12px', color: THEME.gold }}><HardHat size={24} /></div>
                            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Configurations & Specs</h2>
                        </div>

                        <h4 style={{ color: THEME.gold, marginBottom: '15px' }}>Unit Configurations</h4>
                        {formData.configurations.map((config, idx) => (
                            <div key={idx} style={{ background: '#00000030', padding: '20px', borderRadius: '12px', border: `1px solid ${THEME.border}`, marginBottom: '15px' }}>
                                {['Villa', 'Bunglows'].includes(formData.property_type) ? (
                                    <>
                                        {/* Villa Specific Fields */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
                                            <div style={{ gridColumn: '1/-1', color: THEME.gold, fontSize: '0.8rem', fontWeight: 'bold', borderBottom: `1px solid ${THEME.gold}30`, paddingBottom: '5px' }}>PROPERTY CONFIGURATION</div>
                                            {renderConfigInput("BHK Type", idx, "bhk_type", "e.g., 4 BHK")}

                                            {renderConfigInput("Built-up Area", idx, "built_up_area", "Sq.ft")}
                                            {renderConfigInput("Carpet Area", idx, "carpet_area", "Sq.ft")}
                                            {renderConfigInput("Plot Area", idx, "plot_area", "Sq.ft")}
                                            {renderConfigInput("Display Area", idx, "area", "Generic size for card")}
                                            {renderConfigInput("Display Price", idx, "price", "e.g. 2.5 Cr")}
                                            {renderConfigInput("Total Floors", idx, "total_floors", "e.g., G+2")}
                                            
                                            <div style={{ marginBottom: '10px' }}>
                                                <label style={{ display: 'block', color: THEME.muted, fontSize: '0.75rem', marginBottom: '8px' }}>Facing</label>
                                                <select value={config.facing} onChange={(e) => {
                                                    const newConfig = [...formData.configurations];
                                                    newConfig[idx].facing = e.target.value;
                                                    updateForm('configurations', newConfig);
                                                }} style={{ width: '100%', padding: '10px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, borderRadius: '8px', color: THEME.text }}>
                                                    {['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West'].map(f => <option key={f}>{f}</option>)}
                                                </select>
                                            </div>

                                            <div style={{ marginBottom: '10px' }}>
                                                <label style={{ display: 'block', color: THEME.muted, fontSize: '0.75rem', marginBottom: '8px' }}>Corner Property</label>
                                                <select value={config.corner_property} onChange={(e) => {
                                                    const newConfig = [...formData.configurations];
                                                    newConfig[idx].corner_property = e.target.value;
                                                    updateForm('configurations', newConfig);
                                                }} style={{ width: '100%', padding: '10px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, borderRadius: '8px', color: THEME.text }}>
                                                    <option>No</option>
                                                    <option>Yes</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
                                            <div style={{ gridColumn: '1/-1', color: THEME.gold, fontSize: '0.8rem', fontWeight: 'bold', borderBottom: `1px solid ${THEME.gold}30`, paddingBottom: '5px' }}>ROOMS & SPACES</div>
                                            {renderConfigCounter("Bedrooms", idx, "bedrooms")}
                                            {renderConfigCounter("Bathrooms", idx, "bathrooms")}
                                            {renderConfigCounter("Balconies", idx, "balconies")}
                                            {renderConfigCounter("Living Room", idx, "living_rooms")}
                                            {renderConfigCounter("Dining Area", idx, "dining_areas")}
                                            {renderConfigCounter("Servant Room", idx, "servant_room")}
                                            
                                            <div style={{ marginBottom: '10px' }}>
                                                <label style={{ display: 'block', color: THEME.muted, fontSize: '0.75rem', marginBottom: '8px' }}>Kitchen Type</label>
                                                <select value={config.kitchen_type} onChange={(e) => {
                                                    const newConfig = [...formData.configurations];
                                                    newConfig[idx].kitchen_type = e.target.value;
                                                    updateForm('configurations', newConfig);
                                                }} style={{ width: '100%', padding: '10px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, borderRadius: '8px', color: THEME.text }}>
                                                    <option>Normal</option>
                                                    <option>Modular</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '15px', marginBottom: '25px' }}>
                                            <div style={{ gridColumn: '1/-1', color: THEME.gold, fontSize: '0.8rem', fontWeight: 'bold', borderBottom: `1px solid ${THEME.gold}30`, paddingBottom: '5px' }}>OUTDOOR & PARKING</div>
                                            {renderConfigCounter("Garden/Lawn", idx, "garden_lawn")}
                                            {renderConfigCounter("Private Terrace", idx, "private_terrace")}
                                            {renderConfigCounter("Porch", idx, "porch")}
                                            {renderConfigCounter("Car Parking", idx, "car_parking")}
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
                                            <div style={{ gridColumn: '1/-1', color: THEME.gold, fontSize: '0.8rem', fontWeight: 'bold', borderBottom: `1px solid ${THEME.gold}30`, paddingBottom: '5px' }}>CONSTRUCTION & STATUS</div>
                                            {renderConfigInput("Property Age", idx, "property_age", "e.g. 0-1 years")}
                                            {renderConfigInput("Flooring Type", idx, "flooring_type", "e.g. Vitrified Tiles")}
                                            {renderConfigInput("Wall Finish", idx, "wall_finish", "e.g. Plastic Paint")}
                                            
                                            <div style={{ marginBottom: '10px' }}>
                                                <label style={{ display: 'block', color: THEME.muted, fontSize: '0.75rem', marginBottom: '8px' }}>Furnishing Status</label>
                                                <select value={config.furnishing_status} onChange={(e) => {
                                                    const newConfig = [...formData.configurations];
                                                    newConfig[idx].furnishing_status = e.target.value;
                                                    updateForm('configurations', newConfig);
                                                }} style={{ width: '100%', padding: '10px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, borderRadius: '8px', color: THEME.text }}>
                                                    <option>Unfurnished</option>
                                                    <option>Semi-Furnished</option>
                                                    <option>Furnished</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
                                            <div style={{ gridColumn: '1/-1', color: THEME.gold, fontSize: '0.8rem', fontWeight: 'bold', borderBottom: `1px solid ${THEME.gold}30`, paddingBottom: '5px' }}>AVAILABILITY</div>
                                            <div style={{ marginBottom: '10px' }}>
                                                <label style={{ display: 'block', color: THEME.muted, fontSize: '0.75rem', marginBottom: '8px' }}>Available From Date</label>
                                                <input type="date" value={config.available_from} onChange={(e) => {
                                                    const newConfig = [...formData.configurations];
                                                    newConfig[idx].available_from = e.target.value;
                                                    updateForm('configurations', newConfig);
                                                }} style={{ width: '100%', padding: '10px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, borderRadius: '8px', color: THEME.text }} />
                                            </div>
                                            <div style={{ marginBottom: '10px' }}>
                                                <label style={{ display: 'block', color: THEME.muted, fontSize: '0.75rem', marginBottom: '8px' }}>Ready to Move</label>
                                                <select value={config.ready_to_move} onChange={(e) => {
                                                    const newConfig = [...formData.configurations];
                                                    newConfig[idx].ready_to_move = e.target.value;
                                                    updateForm('configurations', newConfig);
                                                }} style={{ width: '100%', padding: '10px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, borderRadius: '8px', color: THEME.text }}>
                                                    <option>Yes</option>
                                                    <option>No</option>
                                                </select>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Standard Config rendering (existing logic) */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                                            {[
                                                { label: 'Bedrooms', key: 'bedrooms' },
                                                { label: 'Halls', key: 'halls' },
                                                { label: 'Kitchens', key: 'kitchens' }
                                            ].map(room => (
                                                <div key={room.key} style={{ textAlign: 'center' }}>
                                                    <div style={{ color: THEME.gold, fontSize: '0.75rem', marginBottom: '8px', fontWeight: 'bold' }}>{room.label.toUpperCase()}</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: THEME.inputBg, padding: '8px', borderRadius: '8px' }}>
                                                        <button 
                                                            onClick={() => {
                                                                const newConfig = [...formData.configurations];
                                                                newConfig[idx][room.key] = Math.max(0, newConfig[idx][room.key] - 1);
                                                                updateForm('configurations', newConfig);
                                                            }}
                                                            style={{ background: 'none', border: 'none', color: THEME.gold, cursor: 'pointer' }}
                                                        ><Minus size={16} /></button>
                                                        <span style={{ minWidth: '20px', fontWeight: 'bold' }}>{config[room.key]}</span>
                                                        <button 
                                                            onClick={() => {
                                                                const newConfig = [...formData.configurations];
                                                                newConfig[idx][room.key] = newConfig[idx][room.key] + 1;
                                                                updateForm('configurations', newConfig);
                                                            }}
                                                            style={{ background: 'none', border: 'none', color: THEME.gold, cursor: 'pointer' }}
                                                        ><Plus size={16} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div style={{ borderTop: `1px solid ${THEME.border}`, paddingTop: '20px', marginBottom: '20px' }}>
                                            <div style={{ color: THEME.muted, fontSize: '0.75rem', marginBottom: '15px', letterSpacing: '1px' }}>DETAILED LAYOUT</div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                                                {[
                                                    { label: 'Balcony', key: 'balcony' },
                                                    { label: 'Personal Foyer', key: 'foyer' },
                                                    { label: 'Drawing/Living', key: 'drawing_living_dining' },
                                                    { label: 'Store Room', key: 'store_room' },
                                                    { label: 'Washyard', key: 'washyard' },
                                                    { label: 'Servant Room', key: 'servant_room' },
                                                    { label: 'General Toilet', key: 'general_toilet' },
                                                    { label: 'Personal Toilet', key: 'personal_toilet' },
                                                    { label: 'Dressing Room', key: 'dressing_room' },
                                                    { label: 'Vestibule', key: 'vestibule' },
                                                    { label: 'Sky Patio/Balcony', key: 'sky_patio_balcony' },
                                                    { label: 'Pooja Room', key: 'pooja_room' },
                                                    { label: 'Car Parking', key: 'car_parking' }
                                                ].map(detail => (
                                                    <div key={detail.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#00000020', padding: '8px 12px', borderRadius: '8px' }}>
                                                        <span style={{ fontSize: '0.7rem', color: THEME.muted }}>{detail.label}</span>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <button 
                                                                onClick={() => {
                                                                    const newConfig = [...formData.configurations];
                                                                    newConfig[idx][detail.key] = Math.max(0, newConfig[idx][detail.key] - 1);
                                                                    updateForm('configurations', newConfig);
                                                                }}
                                                                style={{ background: 'none', border: 'none', color: THEME.muted, cursor: 'pointer' }}
                                                            ><Minus size={12} /></button>
                                                            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', minWidth: '15px', textAlign: 'center' }}>{config[detail.key]}</span>
                                                            <button 
                                                                onClick={() => {
                                                                    const newConfig = [...formData.configurations];
                                                                    newConfig[idx][detail.key] = newConfig[idx][detail.key] + 1;
                                                                    updateForm('configurations', newConfig);
                                                                }}
                                                                style={{ background: 'none', border: 'none', color: THEME.muted, cursor: 'pointer' }}
                                                            ><Plus size={12} /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div style={{ borderTop: `1px solid ${THEME.border}50`, marginTop: '15px', paddingTop: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <input 
                                            placeholder="Floor Number (Optional)" 
                                            value={config.floor_number}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                const newConfig = [...formData.configurations];
                                                newConfig[idx].floor_number = val;
                                                updateForm('configurations', newConfig);
                                            }}
                                            style={{ padding: '10px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, borderRadius: '8px', color: THEME.text, fontSize: '0.8rem' }}
                                        />
                                        <div style={{ position: 'relative' }}>
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                id={`map-upload-${idx}`}
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const newConfig = [...formData.configurations];
                                                        newConfig[idx].map_file = file;
                                                        newConfig[idx].map_url = URL.createObjectURL(file);
                                                        updateForm('configurations', newConfig);
                                                    }
                                                }}
                                                style={{ display: 'none' }}
                                            />
                                            <label 
                                                htmlFor={`map-upload-${idx}`}
                                                style={{ 
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                    padding: '10px', background: config.map_url ? `${THEME.gold}20` : THEME.inputBg,
                                                    border: `1px dashed ${config.map_url ? THEME.gold : THEME.border}`,
                                                    borderRadius: '8px', color: config.map_url ? THEME.gold : THEME.muted,
                                                    fontSize: '0.8rem', cursor: 'pointer', height: '100%'
                                                }}
                                            >
                                                {config.map_url ? 'Map Added ✓' : 'Upload Unit Map'}
                                            </label>
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 40px', gap: '15px', marginTop: '15px' }}>
                                        <input placeholder="Area (Sq.ft)" value={config.area} onChange={(e) => {
                                            const newConfig = [...formData.configurations];
                                            newConfig[idx].area = e.target.value;
                                            updateForm('configurations', newConfig);
                                        }} style={{ padding: '12px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, borderRadius: '8px', color: THEME.text }} />
                                        <input placeholder="Price (e.g. 75 Lacs)" value={config.price} onChange={(e) => {
                                            const newConfig = [...formData.configurations];
                                            newConfig[idx].price = e.target.value;
                                            updateForm('configurations', newConfig);
                                        }} style={{ padding: '12px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, borderRadius: '8px', color: THEME.text }} />
                                        <button onClick={() => removeConfig(idx)} style={{ background: 'none', border: 'none', color: THEME.red, cursor: 'pointer' }}><Trash2 size={24} /></button>
                                    </div>
                                </div>
                        ))}
                        <button onClick={addConfig} style={{ background: 'none', border: `1px dashed ${THEME.gold}`, color: THEME.gold, padding: '10px', borderRadius: '8px', width: '100%', cursor: 'pointer', marginBottom: '40px' }}>+ Add More Configuration</button>

                        {formData.property_type === 'Flat' && (
                            <div className="animate-slide-up" style={{ marginBottom: '40px' }}>
                                <label style={{ display: 'block', color: THEME.gold, fontSize: '1.1rem', marginBottom: '25px', fontWeight: 'bold' }}>PENTHOUSE CONFIGURATIONS</label>
                                {formData.penthouse_configurations.map((config, idx) => (
                                    <div key={idx} style={{ background: '#00000030', padding: '20px', borderRadius: '12px', border: `1px solid ${THEME.gold}40`, marginBottom: '15px' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                                            {[
                                                { label: 'Bedrooms', key: 'bedrooms' },
                                                { label: 'Halls', key: 'halls' },
                                                { label: 'Kitchens', key: 'kitchens' }
                                            ].map(room => (
                                                <div key={room.key} style={{ textAlign: 'center' }}>
                                                    <div style={{ color: THEME.gold, fontSize: '0.75rem', marginBottom: '8px', fontWeight: 'bold' }}>{room.label.toUpperCase()}</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: THEME.inputBg, padding: '8px', borderRadius: '8px' }}>
                                                        <button 
                                                            onClick={() => {
                                                                const newPent = [...formData.penthouse_configurations];
                                                                newPent[idx][room.key] = Math.max(0, newPent[idx][room.key] - 1);
                                                                updateForm('penthouse_configurations', newPent);
                                                            }}
                                                            style={{ background: 'none', border: 'none', color: THEME.gold, cursor: 'pointer' }}
                                                        ><Minus size={16} /></button>
                                                        <span style={{ minWidth: '20px', fontWeight: 'bold' }}>{config[room.key]}</span>
                                                        <button 
                                                            onClick={() => {
                                                                const newPent = [...formData.penthouse_configurations];
                                                                newPent[idx][room.key] = newPent[idx][room.key] + 1;
                                                                updateForm('penthouse_configurations', newPent);
                                                            }}
                                                            style={{ background: 'none', border: 'none', color: THEME.gold, cursor: 'pointer' }}
                                                        ><Plus size={16} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div style={{ borderTop: `1px solid ${THEME.border}`, paddingTop: '20px', marginBottom: '20px' }}>
                                            <div style={{ color: THEME.muted, fontSize: '0.75rem', marginBottom: '15px', letterSpacing: '1px' }}>DETAILED LAYOUT (PENTHOUSE)</div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                                                {[
                                                    { label: 'Balcony', key: 'balcony' },
                                                    { label: 'Personal Foyer', key: 'foyer' },
                                                    { label: 'Drawing/Living', key: 'drawing_living_dining' },
                                                    { label: 'Store Room', key: 'store_room' },
                                                    { label: 'Washyard', key: 'washyard' },
                                                    { label: 'Servant Room', key: 'servant_room' },
                                                    { label: 'General Toilet', key: 'general_toilet' },
                                                    { label: 'Personal Toilet', key: 'personal_toilet' },
                                                    { label: 'Dressing Room', key: 'dressing_room' },
                                                    { label: 'Vestibule', key: 'vestibule' },
                                                    { label: 'Sky Patio/Balcony', key: 'sky_patio_balcony' },
                                                    { label: 'Pooja Room', key: 'pooja_room' },
                                                    { label: 'Car Parking', key: 'car_parking' }
                                                ].map(detail => (
                                                    <div key={detail.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#00000020', padding: '8px 12px', borderRadius: '8px' }}>
                                                        <span style={{ fontSize: '0.7rem', color: THEME.muted }}>{detail.label}</span>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <button 
                                                                onClick={() => {
                                                                    const newPent = [...formData.penthouse_configurations];
                                                                    newPent[idx][detail.key] = Math.max(0, newPent[idx][detail.key] - 1);
                                                                    updateForm('penthouse_configurations', newPent);
                                                                }}
                                                                style={{ background: 'none', border: 'none', color: THEME.muted, cursor: 'pointer' }}
                                                            ><Minus size={12} /></button>
                                                            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', minWidth: '15px', textAlign: 'center' }}>{config[detail.key]}</span>
                                                            <button 
                                                                onClick={() => {
                                                                    const newPent = [...formData.penthouse_configurations];
                                                                    newPent[idx][detail.key] = newPent[idx][detail.key] + 1;
                                                                    updateForm('penthouse_configurations', newPent);
                                                                }}
                                                                style={{ background: 'none', border: 'none', color: THEME.muted, cursor: 'pointer' }}
                                                            ><Plus size={12} /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {/* Floor Number Input */}
                                            <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                                <input 
                                                    placeholder="Floor Number (e.g. 14)" 
                                                    value={config.floor_number}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/[^0-9]/g, '');
                                                        const newPent = [...formData.penthouse_configurations];
                                                        newPent[idx].floor_number = val;
                                                        updateForm('penthouse_configurations', newPent);
                                                    }}
                                                    style={{ padding: '10px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, borderRadius: '8px', color: THEME.text, fontSize: '0.8rem' }}
                                                />
                                                <div style={{ position: 'relative' }}>
                                                    <input 
                                                        type="file" 
                                                        accept="image/*"
                                                        id={`pent-map-upload-${idx}`}
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const newPent = [...formData.penthouse_configurations];
                                                                newPent[idx].map_file = file;
                                                                newPent[idx].map_url = URL.createObjectURL(file);
                                                                updateForm('penthouse_configurations', newPent);
                                                            }
                                                        }}
                                                        style={{ display: 'none' }}
                                                    />
                                                    <label 
                                                        htmlFor={`pent-map-upload-${idx}`}
                                                        style={{ 
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                            padding: '10px', background: config.map_url ? `${THEME.gold}20` : THEME.inputBg,
                                                            border: `1px dashed ${config.map_url ? THEME.gold : THEME.border}`,
                                                            borderRadius: '8px', color: config.map_url ? THEME.gold : THEME.muted,
                                                            fontSize: '0.8rem', cursor: 'pointer', height: '100%'
                                                        }}
                                                    >
                                                        {config.map_url ? 'Map Added ✓' : 'Upload Unit Map'}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 40px', gap: '15px' }}>
                                            <input placeholder="Area (Sq.ft)" value={config.area} onChange={(e) => {
                                                const newPent = [...formData.penthouse_configurations];
                                                newPent[idx].area = e.target.value;
                                                updateForm('penthouse_configurations', newPent);
                                            }} style={{ padding: '12px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, borderRadius: '8px', color: THEME.text }} />
                                            <input placeholder="Price (e.g. 1.5 Cr)" value={config.price} onChange={(e) => {
                                                const newPent = [...formData.penthouse_configurations];
                                                newPent[idx].price = e.target.value;
                                                updateForm('penthouse_configurations', newPent);
                                            }} style={{ padding: '12px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, borderRadius: '8px', color: THEME.text }} />
                                            <button onClick={() => removePenthouseConfig(idx)} style={{ background: 'none', border: 'none', color: THEME.red, cursor: 'pointer' }}><Trash2 size={24} /></button>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={addPenthouseConfig} style={{ background: 'none', border: `1px dashed ${THEME.gold}`, color: THEME.gold, padding: '10px', borderRadius: '8px', width: '100%', cursor: 'pointer' }}>+ Add Penthouse Details</button>
                            </div>
                        )}

                        {formData.property_type === 'Flat' && (
                            <div className="animate-slide-up" style={{ marginBottom: '40px' }}>
                                <label style={{ display: 'block', color: THEME.gold, fontSize: '1.1rem', marginBottom: '25px', fontWeight: 'bold' }}>TOWER DETAILS</label>
                                {formData.towers.map((tower, idx) => (
                                    <div key={idx} style={{ background: `${THEME.gold}05`, padding: '20px', borderRadius: '12px', border: `1px solid ${THEME.border}`, marginBottom: '15px' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                            <div>
                                                <label style={{ fontSize: '0.75rem', color: THEME.muted, display: 'block', marginBottom: '5px' }}>TOWER TYPE</label>
                                                <input placeholder="e.g. Type A" value={tower.type} onChange={(e) => {
                                                    const newTowers = [...formData.towers];
                                                    newTowers[idx].type = e.target.value;
                                                    updateForm('towers', newTowers);
                                                }} style={{ width: '100%', padding: '10px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, borderRadius: '8px', color: THEME.text }} />
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '0.75rem', color: THEME.muted, display: 'block', marginBottom: '5px' }}>BHK</label>
                                                <select value={tower.bhk} onChange={(e) => {
                                                    const newTowers = [...formData.towers];
                                                    newTowers[idx].bhk = e.target.value;
                                                    updateForm('towers', newTowers);
                                                }} style={{ width: '100%', padding: '10px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, borderRadius: '8px', color: THEME.text }}>
                                                    {[1,2,3,4,5].map(v => <option key={v} value={v}>{v} BHK</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '0.75rem', color: THEME.muted, display: 'block', marginBottom: '5px' }}>STORY</label>
                                                <select value={tower.story} onChange={(e) => {
                                                    const newTowers = [...formData.towers];
                                                    newTowers[idx].story = e.target.value;
                                                    updateForm('towers', newTowers);
                                                }} style={{ width: '100%', padding: '10px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, borderRadius: '8px', color: THEME.text }}>
                                                    {Array.from({ length: 50 }, (_, i) => i + 1).map(v => <option key={v}>{v}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 40px', gap: '15px' }}>
                                            <div>
                                                <label style={{ fontSize: '0.75rem', color: THEME.muted, display: 'block', marginBottom: '5px' }}>LIFTS / FLOOR</label>
                                                <input type="number" placeholder="2" value={tower.lift_per_floor} onChange={(e) => {
                                                    const newTowers = [...formData.towers];
                                                    newTowers[idx].lift_per_floor = e.target.value;
                                                    updateForm('towers', newTowers);
                                                }} style={{ width: '100%', padding: '10px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, borderRadius: '8px', color: THEME.text }} />
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '0.75rem', color: THEME.muted, display: 'block', marginBottom: '5px' }}>UNITS / FLOOR</label>
                                                <input type="number" placeholder="4" value={tower.units_per_floor} onChange={(e) => {
                                                    const newTowers = [...formData.towers];
                                                    newTowers[idx].units_per_floor = e.target.value;
                                                    updateForm('towers', newTowers);
                                                }} style={{ width: '100%', padding: '10px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, borderRadius: '8px', color: THEME.text }} />
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '0.75rem', color: THEME.muted, display: 'block', marginBottom: '5px' }}>TOTAL UNITS</label>
                                                <input type="number" placeholder="120" value={tower.total_units} onChange={(e) => {
                                                    const newTowers = [...formData.towers];
                                                    newTowers[idx].total_units = e.target.value;
                                                    updateForm('towers', newTowers);
                                                }} style={{ width: '100%', padding: '10px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, borderRadius: '8px', color: THEME.text }} />
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '10px' }}>
                                                <button onClick={() => removeTower(idx)} style={{ background: 'none', border: 'none', color: THEME.red, cursor: 'pointer' }}><Trash2 size={24} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={addTower} style={{ background: 'none', border: `1px dashed ${THEME.gold}`, color: THEME.gold, padding: '10px', borderRadius: '8px', width: '100%', cursor: 'pointer' }}>+ Add Tower Type</button>
                            </div>
                        )}

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', color: THEME.gold, fontSize: '1rem', marginBottom: '20px', fontWeight: 'bold' }}>PROJECT AMENITIES</label>
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
                                gap: '12px',
                                maxHeight: '400px',
                                overflowY: 'auto',
                                paddingRight: '10px',
                                paddingBottom: '10px'
                            }}>
                                {ALL_AMENITIES.map((am) => {
                                    const Icon = am.icon;
                                    const isSelected = formData.amenities.includes(am.name);
                                    return (
                                        <div 
                                            key={am.name}
                                            onClick={() => toggleAmenity(am.name)}
                                            style={{
                                                padding: '12px',
                                                background: isSelected ? `${THEME.gold}20` : THEME.inputBg,
                                                border: `1px solid ${isSelected ? THEME.gold : THEME.border}`,
                                                borderRadius: '10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <div style={{ color: isSelected ? THEME.gold : THEME.muted }}><Icon size={18} /></div>
                                            <span style={{ fontSize: '0.8rem', color: isSelected ? THEME.text : THEME.muted }}>{am.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {formData.amenities.includes("Private Terrace") && (
                            <div className="animate-slide-up" style={{ marginBottom: '30px', padding: '20px', background: `${THEME.gold}05`, border: `1px dashed ${THEME.gold}`, borderRadius: '12px' }}>
                                <label style={{ display: 'block', color: THEME.gold, fontSize: '0.9rem', marginBottom: '10px' }}>Private Terrace Size (Required)</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <input 
                                        type="text" 
                                        placeholder="Enter size (e.g. 500)" 
                                        value={formData.private_terrace_size}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                            updateForm('private_terrace_size', val);
                                        }}
                                        style={{ flex: 1, padding: '12px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, borderRadius: '8px', color: THEME.text }}
                                    />
                                    <span style={{ color: THEME.muted, fontWeight: 'bold' }}>SQ FT.</span>
                                </div>
                            </div>
                        )}

                        <div style={{ marginBottom: '40px' }}>
                            <label style={{ display: 'block', color: THEME.gold, fontSize: '1.1rem', marginBottom: '25px', fontWeight: 'bold' }}>NEARBY LANDMARKS</label>
                            {formData.landmarks.map((landmark, lIdx) => (
                                <div key={lIdx} style={{ background: `${THEME.gold}05`, padding: '20px', borderRadius: '12px', border: `1px solid ${THEME.border}`, marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', fontSize: '0.7rem', color: THEME.muted, marginBottom: '5px' }}>LANDMARK CATEGORY (HEADING)</label>
                                            <input 
                                                placeholder="e.g. Schools / Connectivity" 
                                                value={landmark.title} 
                                                onChange={(e) => {
                                                    const newLand = [...formData.landmarks];
                                                    newLand[lIdx].title = e.target.value;
                                                    updateForm('landmarks', newLand);
                                                }} 
                                                style={{ width: '100%', padding: '12px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, borderRadius: '8px', color: THEME.text }} 
                                            />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                            <button onClick={() => updateForm('landmarks', formData.landmarks.filter((_, i) => i !== lIdx))} style={{ background: 'none', border: 'none', color: THEME.red, cursor: 'pointer' }}><Trash2 size={24} /></button>
                                        </div>
                                    </div>

                                    <div style={{ marginLeft: '20px', display: 'grid', gap: '10px' }}>
                                        {landmark.items.map((item, iIdx) => (
                                            <div key={iIdx} style={{ display: 'flex', gap: '10px' }}>
                                                <input 
                                                    placeholder="Detail (e.g. 15 km / Heritage School)" 
                                                    value={item} 
                                                    onChange={(e) => {
                                                        const newLand = [...formData.landmarks];
                                                        newLand[lIdx].items[iIdx] = e.target.value;
                                                        updateForm('landmarks', newLand);
                                                    }} 
                                                    style={{ flex: 1, padding: '10px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, borderRadius: '8px', color: THEME.text, fontSize: '0.85rem' }} 
                                                />
                                                <button onClick={() => removeLandmarkItem(lIdx, iIdx)} style={{ background: 'none', border: 'none', color: THEME.red, cursor: 'pointer', opacity: 0.6 }}><X size={18} /></button>
                                            </div>
                                        ))}
                                        <button onClick={() => addLandmarkItem(lIdx)} style={{ background: 'none', border: `1px dashed ${THEME.muted}`, color: THEME.muted, padding: '8px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem' }}>+ Add Item to {landmark.title || 'Category'}</button>
                                    </div>
                                </div>
                            ))}
                            <button onClick={addLandmark} style={{ background: 'none', border: `2px dashed ${THEME.gold}`, color: THEME.gold, padding: '15px', borderRadius: '12px', width: '100%', cursor: 'pointer', fontWeight: 'bold' }}>+ Add Landmark Category</button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                            {renderInput("Launch Date", "launch_date", "", "date")}
                            {renderInput("Possession Date", "possession_date", "", "date")}
                            {renderInput("Total Land Area (Sq.ft)", "total_plot_area", "e.g. 35000")}
                        </div>

                        {formData.property_type === 'Flat' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                {renderInput("Total Towers", "total_towers", "e.g. 4")}
                                {renderInput("Total Units", "total_units", "e.g. 450")}
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                            <button onClick={() => setStep(1)} style={{ padding: '12px 30px', background: 'transparent', color: THEME.muted, border: `1px solid ${THEME.border}`, borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Back</button>
                            <button onClick={() => setStep(3)} style={{ padding: '12px 30px', background: THEME.gold, color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                Next Step <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-slide-up" style={{ background: THEME.cardBg, padding: '40px', borderRadius: '16px', border: `1px solid ${THEME.border}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                            <div style={{ padding: '12px', background: `${THEME.gold}20`, borderRadius: '12px', color: THEME.gold }}><Upload size={24} /></div>
                            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Media & Assets</h2>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', color: THEME.muted, fontSize: '0.85rem', marginBottom: '15px' }}>PROJECT IMAGES (Elevation, Plans, Status)</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
                                {formData.images.map((img, i) => (
                                    <div key={i} style={{ position: 'relative', height: '100px', borderRadius: '8px', border: `1px solid ${THEME.border}`, overflow: 'hidden' }}>
                                        <img 
                                            src={typeof img === 'string' ? img : (img?.url || '')} 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80'; }}
                                        />
                                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.8)', padding: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.6rem', color: THEME.gold }}>{img.category || 'Photo'}</span>
                                            <button onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))} style={{ background: 'none', border: 'none', color: THEME.red, padding: 0, cursor: 'pointer' }}><X size={12} /></button>
                                        </div>
                                    </div>
                                ))}
                                <label style={{ border: `2px dashed ${THEME.border}`, height: '100px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: THEME.muted }}>
                                    <Plus size={20} />
                                    <span style={{ fontSize: '0.7rem' }}>Add Photos</span>
                                    <input type="file" multiple hidden onChange={(e) => handleImageUpload(e, 'Photo')} />
                                </label>
                                <label style={{ border: `2px dashed ${THEME.gold}40`, height: '100px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: THEME.gold }}>
                                    <FileText size={20} />
                                    <span style={{ fontSize: '0.7rem' }}>Add Floor Plans</span>
                                    <input type="file" multiple hidden onChange={(e) => handleImageUpload(e, 'Floor Plan')} />
                                </label>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', color: THEME.muted, fontSize: '0.85rem', marginBottom: '10px' }}>PROJECT BROCHURE (PDF)</label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, borderRadius: '8px', cursor: 'pointer' }}>
                                    <FileText color={THEME.gold} />
                                    <span>{formData.brochure_file ? formData.brochure_file.name : "Select PDF File"}</span>
                                    <input type="file" accept=".pdf" hidden onChange={(e) => updateForm('brochure_file', e.target.files[0])} />
                                </label>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', color: THEME.muted, fontSize: '0.85rem', marginBottom: '10px' }}>VIDEO TOUR URL (Youtube/Vimeo)</label>
                                <input 
                                    placeholder="https://youtu.be/..." 
                                    value={formData.video_url} 
                                    onChange={(e) => updateForm('video_url', e.target.value)}
                                    style={{ width: '100%', padding: '15px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, borderRadius: '8px', color: THEME.text }} 
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', color: THEME.muted, fontSize: '0.85rem', marginBottom: '10px' }}>360° VIRTUAL TOUR URL</label>
                            <input 
                                placeholder="https://my.matterport.com/show/..." 
                                value={formData.tour_360_url} 
                                onChange={(e) => updateForm('tour_360_url', e.target.value)}
                                style={{ width: '100%', padding: '15px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, borderRadius: '8px', color: THEME.text }} 
                            />
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', color: THEME.muted, fontSize: '0.85rem', marginBottom: '10px' }}>GOOGLE MAPS LOCATION LINK</label>
                            <input 
                                placeholder="https://maps.app.goo.gl/..." 
                                value={formData.google_map_link} 
                                onChange={(e) => updateForm('google_map_link', e.target.value)}
                                style={{ width: '100%', padding: '15px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, borderRadius: '8px', color: THEME.text }} 
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                            <button onClick={() => setStep(2)} style={{ padding: '12px 30px', background: 'transparent', color: THEME.muted, border: `1px solid ${THEME.border}`, borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Back</button>
                            <button 
                                onClick={handleSubmit} 
                                disabled={submitting}
                                style={{ padding: '12px 50px', background: THEME.gold, color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                            >
                                {submitting ? "Submitting..." : "Submit Project"} <Check size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="animate-slide-up" style={{ textAlign: 'center', padding: '60px', background: THEME.cardBg, borderRadius: '24px', border: `1px solid ${THEME.gold}` }}>
                        <div style={{ width: '80px', height: '80px', background: `${THEME.gold}20`, borderRadius: '50%', color: THEME.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px' }}>
                            <Check size={40} />
                        </div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Project Submitted!</h1>
                        <p style={{ color: THEME.muted, marginBottom: '40px', maxWidth: '400px', margin: '0 auto 40px' }}>Your project is currently under review by our admin. It will be live on the portal once approved.</p>
                        <button onClick={() => navigate('/')} style={{ padding: '15px 40px', background: THEME.gold, color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Go to Homepage</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostProject;
