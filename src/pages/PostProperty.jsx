import React, { useState } from 'react';
import { ArrowLeft, Upload, Check, ChevronRight, MapPin, Home, Building, Building2, Trees, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';

// --- THEME ---
const THEME = {
    bg: '#0C1512',
    cardBg: '#1A1F1D',
    inputBg: '#252B29',
    text: '#E6ECE9',
    muted: '#8E9CA3',
    gold: '#E3BC5A',
    green: '#00C853',
    red: '#FF5252',
    border: '#2A2F2D'
};

// --- CONSTANTS ---
const PROPERTY_TYPES = [
    { label: 'Apartment', value: 'apartment', icon: Building2 },
    { label: 'Indep. House', value: 'house', icon: Home },
    { label: 'Villa', value: 'villa', icon: Home },
    { label: 'Studio', value: 'studio', icon: Building },
    { label: 'Farm House', value: 'farm', icon: Trees },
    { label: 'Penthouse', value: 'penthouse', icon: Building },
    { label: 'Indep. Floor', value: 'floor', icon: Building },
];

const BHK_TYPES = ['1 RK', '1 BHK', '1.5 BHK', '2 BHK', '2.5 BHK', '3 BHK', '3.5 BHK', '4 BHK', '4.5 BHK', '5 BHK', '5+ BHK'];

// --- SUB-COMPONENTS ---

const SectionHeader = ({ title, sub }) => (
    <div style={{ marginBottom: '20px', borderBottom: `1px solid ${THEME.border}`, paddingBottom: '10px', marginTop: '30px' }}>
        <h3 style={{ color: THEME.text, fontSize: '1.1rem', marginBottom: '5px' }}>{title}</h3>
        {sub && <p style={{ color: THEME.muted, fontSize: '0.85rem' }}>{sub}</p>}
    </div>
);

const SelectButton = ({ label, selected, onClick, error, half }) => (
    <button
        type="button"
        onClick={onClick}
        style={{
            flex: half ? '1 1 45%' : '1',
            padding: '12px',
            borderRadius: '8px',
            border: `1px solid ${selected ? THEME.gold : (error ? THEME.red : THEME.border)}`,
            background: selected ? `${THEME.gold}20` : 'transparent',
            color: selected ? THEME.gold : THEME.text,
            cursor: 'pointer',
            fontWeight: selected ? '600' : 'normal',
            transition: 'all 0.2s',
            width: half ? 'auto' : '100%',
            whiteSpace: 'nowrap'
        }}
    >
        {label}
    </button>
);

const NumericInput = ({ id, label, value, onChange, placeholder, prefix, suffix, error, type = "number" }) => (
    <div id={id} style={{ marginBottom: '20px' }}>
        <label style={{ color: error ? THEME.red : THEME.muted, display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
            {label} {error && <span style={{ color: THEME.red, fontSize: '0.8rem' }}>* {error}</span>}
        </label>
        <div style={{ position: 'relative' }}>
            {prefix && <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: THEME.muted }}>{prefix}</span>}
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    padding: `12px ${suffix ? '40px' : '15px'} 12px ${prefix ? '30px' : '15px'}`,
                    background: THEME.inputBg,
                    border: `1px solid ${error ? THEME.red : THEME.border}`,
                    borderRadius: '8px',
                    color: THEME.text,
                    fontSize: '1rem',
                    outline: 'none'
                }}
            />
            {suffix && <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: THEME.muted, fontSize: '0.85rem' }}>{suffix}</span>}
        </div>
    </div>
);

const TextInput = ({ id, label, value, onChange, placeholder, error }) => (
    <div id={id} style={{ marginBottom: '20px' }}>
        <label style={{ color: error ? THEME.red : THEME.muted, display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
            {label} {error && <span style={{ color: THEME.red, fontSize: '0.8rem' }}>* {error}</span>}
        </label>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{
                width: '100%',
                padding: '12px 15px',
                background: THEME.inputBg,
                border: `1px solid ${error ? THEME.red : THEME.border}`,
                borderRadius: '8px',
                color: THEME.text,
                fontSize: '1rem',
                outline: 'none'
            }}
        />
    </div>
);

const ChipGroup = ({ id, label, options, value, onChange, multi, error, updateForm, toggleSelection }) => (
    <div id={id} style={{ marginBottom: '25px' }}>
        <label style={{ color: error ? THEME.red : THEME.muted, display: 'block', marginBottom: '12px', fontSize: '0.9rem' }}>
            {label} {error && <span style={{ color: THEME.red, fontSize: '0.8rem' }}>* {error}</span>}
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {options.map(opt => (
                <SelectButton
                    key={opt.value}
                    label={opt.label}
                    selected={multi ? value.includes(opt.value) : value === opt.value}
                    onClick={() => multi ? toggleSelection(onChange, opt.value) : updateForm(onChange, opt.value)}
                    error={error}
                />
            ))}
        </div>
    </div>
);

const ImageUploadSection = ({ images, onChange, THEME, error }) => {
    const handleFileChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            // In a real app, you'd probably upload these to a server/storage here
            // For now, we'll create local object URLs for preview
            const newImages = newFiles.map(file => ({
                file,
                url: URL.createObjectURL(file)
            }));
            onChange([...images, ...newImages]);
        }
    };

    const removeImage = (index) => {
        const newImages = [...images];
        // Revoke URL to avoid memory leaks
        URL.revokeObjectURL(newImages[index].url);
        newImages.splice(index, 1);
        onChange(newImages);
    };

    return (
        <div style={{ marginTop: '20px' }}>
            <label style={{ color: error ? THEME.red : THEME.muted, display: 'block', marginBottom: '12px', fontSize: '0.9rem' }}>
                Upload Photos (Min 3) {error && <span style={{ color: THEME.red, fontSize: '0.8rem' }}>* {error}</span>}
            </label>

            <div style={{
                border: `2px dashed ${error ? THEME.red : THEME.border}`,
                borderRadius: '12px',
                padding: '40px',
                textAlign: 'center',
                cursor: 'pointer',
                background: THEME.inputBg,
                marginBottom: '20px'
            }} onClick={() => document.getElementById('file-upload').click()}>
                <Upload size={40} color={THEME.gold} style={{ marginBottom: '15px' }} />
                <h4 style={{ color: THEME.text, margin: '0 0 10px 0' }}>Click to Upload Photos</h4>
                <p style={{ color: THEME.muted, fontSize: '0.9rem', margin: 0 }}>Supported: JPG, PNG, WEBP (Max 5MB)</p>
                <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '15px' }}>
                    {images.map((img, idx) => (
                        <div key={idx} style={{ position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: `1px solid ${THEME.border}` }}>
                            <img src={img.url} alt={`Preview ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                style={{
                                    position: 'absolute', top: '5px', right: '5px',
                                    background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%',
                                    width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', cursor: 'pointer'
                                }}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const PostProperty = () => {
    // Consolidated Steps: 1. Property Details (Everything), 2. Photos, 3. Success
    const [step, setStep] = useState(1);
    const [profiles, setProfiles] = useState(null);
    const [errors, setErrors] = useState({});
    const [showAdditional, setShowAdditional] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!user) {
            navigate('/login', { state: { from: '/post-property' } });
        } else {
            fetchUserProfile();
        }
    }, [user, navigate]);

    const fetchUserProfile = async () => {
        try {
            const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            if (error && error.code !== 'PGRST116') throw error;
            if (data) {
                setProfiles(data);
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

    const [formData, setFormData] = useState({
        // 1. LOOKING TO
        lookingTo: 'rent', // 'rent', 'sell', 'pg'

        // 2. PROPERTY TYPE
        propertyType: '',

        // 3. LOCATION
        city: '',
        project: '', // Building / Society Name

        // 4. SPECS
        bhk: '',
        builtUpArea: '',

        // 5. STATUS
        constructionStatus: 'ready', // 'ready', 'under_construction'
        transactionType: 'resale', // 'new_booking', 'resale'

        // 6. FEATURES
        bathrooms: '',
        balconies: '',
        furnishing: '',
        coveredParking: '',
        openParking: '',

        // 7. FINANCIALS
        cost: '', // Rent or Price
        maintenance: '',

        // 8. OTHER SPECS
        carpetArea: '',
        floorNo: '',
        totalFloors: '',

        // 9. ADDITIONAL
        ageOfProperty: '',
        availableFrom: '',
        lockInPeriod: 'none',
        petFriendly: 'no',
        facing: '',
        powerBackup: false,
        gatedSecurity: false,
        address: '',
        servantRoom: 'no',
        // PG SPECIFIC
        locality: '',
        pgName: '',
        totalBeds: '',
        pgFor: 'both', // girls, boys, both
        bestSuitedFor: 'students', // students, professionals, custom
        mealsAvailable: 'no',
        noticePeriod: '', // days
        commonAreas: [], // living, kitchen, dining, study, breakout, custom
        managedBy: 'landlord', // landlord, caretaker, professional
        managerStays: 'no',

        // PG RULES
        nonVegAllowed: 'yes',
        oppositeSexAllowed: 'yes',
        anyTimeAllowed: 'yes',
        visitorsAllowed: 'yes',
        guardianAllowed: 'yes',
        drinkingAllowed: 'no',
        smokingAllowed: 'no',

        // Source Details
        sourceName: '',
        sourceNumber: '',
        sourceEmail: '',
        sourceEnrollCode: '',

        // Photos
        images: []
    });

    // --- HANDLERS ---
    const updateForm = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
    };

    const toggleSelection = (key, value) => {
        setFormData(prev => {
            const list = prev[key] || [];
            return {
                ...prev,
                [key]: list.includes(value) ? list.filter(item => item !== value) : [...list, value]
            };
        });
    };

    const validateSource = () => {
        const newErrors = {};
        if (!formData.sourceName) newErrors.sourceName = "Name is required";
        if (!formData.sourceNumber) newErrors.sourceNumber = "Number is required";
        if (!formData.sourceEmail) newErrors.sourceEmail = "Email is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateDetails = () => {
        const newErrors = {};
        if (!formData.propertyType) newErrors.propertyType = "Required";
        if (!formData.city) newErrors.city = "Required";
        if (!formData.project) newErrors.project = "Required";
        if (formData.propertyType !== 'plot' && !formData.bhk) newErrors.bhk = "Required";
        if (!formData.builtUpArea) newErrors.builtUpArea = "Required";
        if (!formData.cost) newErrors.cost = "Required";

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            const firstErrorId = Object.keys(newErrors)[0];
            const element = document.getElementById(firstErrorId);
            if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (step === 1 && !validateSource()) return;
        if (step === 2 && !validateDetails()) return;
        setStep(prev => Math.min(prev + 1, 3));
    };

    const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        if (!user) {
            alert('Please sign in to post a property.');
            navigate('/login');
            return;
        }

        setSubmitting(true);
        try {
            // 1. Upload Images
            const imageUrls = [];
            for (const imgObj of formData.images) {
                const file = imgObj.file;
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${user.id}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('property-images')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage
                    .from('property-images')
                    .getPublicUrl(filePath);

                imageUrls.push(publicUrlData.publicUrl);
            }

            // 2. Prepare Data
            const payload = {
                user_id: user.id,
                user_email: user.email,
                contact_name: user.user_metadata?.full_name || '',
                contact_phone: user.user_metadata?.phone || '',
                looking_to: formData.lookingTo,
                property_type: formData.propertyType,
                city: formData.city,
                project_name: formData.project,
                locality: formData.locality,

                bhk: formData.bhk,
                built_up_area: formData.builtUpArea ? parseFloat(formData.builtUpArea) : null,
                cost: formData.cost ? parseFloat(formData.cost) : null,
                maintenance: formData.maintenance ? parseFloat(formData.maintenance) : null,
                construction_status: formData.constructionStatus,
                transaction_type: formData.transactionType,

                floor_no: formData.floorNo,
                total_floors: formData.totalFloors,
                bathrooms: formData.bathrooms,
                balconies: formData.balconies,
                furnishing: formData.furnishing,
                covered_parking: formData.coveredParking,
                open_parking: formData.openParking,

                age_of_property: formData.ageOfProperty ? parseFloat(formData.ageOfProperty) : null,
                available_from: formData.availableFrom || null,
                lock_in_period: formData.lockInPeriod,

                pet_friendly: formData.petFriendly,
                gated_security: formData.gatedSecurity,
                power_backup: formData.powerBackup,
                address: formData.address,
                servant_room: formData.servantRoom,
                description: formData.description,

                images: imageUrls,

                // PG Fields
                pg_name: formData.pgName,
                total_beds: formData.totalBeds ? parseFloat(formData.totalBeds) : null,
                pg_for: formData.pgFor,
                best_suited_for: formData.bestSuitedFor,
                meals_available: formData.mealsAvailable,
                notice_period: formData.noticePeriod ? parseFloat(formData.noticePeriod) : null,
                common_areas: formData.commonAreas,
                managed_by: formData.managedBy,
                manager_stays: formData.managerStays,
                pg_rules: {
                    nonVegAllowed: formData.nonVegAllowed,
                    oppositeSexAllowed: formData.oppositeSexAllowed,
                    anyTimeAllowed: formData.anyTimeAllowed,
                    visitorsAllowed: formData.visitorsAllowed,
                    guardianAllowed: formData.guardianAllowed,
                    drinkingAllowed: formData.drinkingAllowed,
                    smokingAllowed: formData.smokingAllowed,
                }
            };

            // 3. Insert Record
            const { error: insertError } = await supabase
                .from('properties')
                .insert([payload]);

            if (insertError) throw insertError;

            alert('Property Posted Successfully! Pending Approval.');
            navigate('/');
        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to post property: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    // --- RENDER FUNCTIONS ---

    const renderPGForm = () => (
        <div className="animate-slide-up">
            {/* 1. LOOKING TO */}
            <ChipGroup
                id="lookingTo" label="LOOKING TO"
                options={[{ label: 'RENT', value: 'rent' }, { label: 'SELL', value: 'sell' }, { label: 'PG/CO-LIVING', value: 'pg' }]}
                value={formData.lookingTo} onChange="lookingTo"
                updateForm={updateForm} toggleSelection={toggleSelection}
            />

            {/* 2. CITY */}
            <ChipGroup
                id="city" label="SELECT CITY"
                options={[{ label: 'AHMEDABAD', value: 'Ahmedabad' }, { label: 'GANDHINAGAR', value: 'Gandhinagar' }]}
                value={formData.city} onChange="city" error={errors.city}
                updateForm={updateForm} toggleSelection={toggleSelection}
            />

            {/* 3. SOCIETY / BUILDING */}
            <TextInput id="project" label="BUILDING / APARTMENT / SOCIETY NAME" placeholder="Enter Building Name" value={formData.project} onChange={(v) => updateForm('project', v)} error={errors.project} />

            {/* 4. LOCALITY */}
            <TextInput id="locality" label="LOCALITY" placeholder="Enter Locality" value={formData.locality} onChange={(v) => updateForm('locality', v)} />

            <SectionHeader title="PG Details" />

            <TextInput id="pgName" label="PG NAME" placeholder="Enter PG Name" value={formData.pgName} onChange={(v) => updateForm('pgName', v)} />
            <NumericInput id="totalBeds" label="TOTAL BEDS" value={formData.totalBeds} onChange={(v) => updateForm('totalBeds', v)} />

            <ChipGroup
                id="pgFor" label="PG IS FOR"
                options={[{ label: 'GIRLS', value: 'girls' }, { label: 'BOYS', value: 'boys' }, { label: 'BOTH', value: 'both' }]}
                value={formData.pgFor} onChange="pgFor"
                updateForm={updateForm} toggleSelection={toggleSelection}
            />

            <ChipGroup
                id="bestSuitedFor" label="BEST SUITED FOR"
                options={[{ label: 'STUDENTS', value: 'students' }, { label: 'PROFESSIONALS', value: 'professionals' }, { label: 'BOTH', value: 'both' }]}
                value={formData.bestSuitedFor} onChange="bestSuitedFor"
                updateForm={updateForm} toggleSelection={toggleSelection}
            />

            {/* MEALS */}
            <div style={{ marginBottom: '20px' }}>
                <label style={{ color: THEME.muted, display: 'block', marginBottom: '12px', fontSize: '0.9rem' }}>MEALS AVAILABLE</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <SelectButton label="Yes" selected={formData.mealsAvailable === 'yes'} onClick={() => updateForm('mealsAvailable', 'yes')} />
                    <SelectButton label="No" selected={formData.mealsAvailable === 'no'} onClick={() => updateForm('mealsAvailable', 'no')} />
                </div>
            </div>

            <div className="grid-2-col">
                <NumericInput id="noticePeriod" label="NOTICE PERIOD (DAYS)" value={formData.noticePeriod} onChange={(v) => updateForm('noticePeriod', v)} />
                <NumericInput id="lockInPeriod" label="LOCK IN PERIOD (DAYS)" value={formData.lockInPeriod} onChange={(v) => updateForm('lockInPeriod', v)} />
            </div>

            <ChipGroup
                id="commonAreas" label="COMMON AREAS" multi
                options={[
                    { label: 'Living Room', value: 'living' }, { label: 'Kitchen', value: 'kitchen' },
                    { label: 'Dining Hall', value: 'dining' }, { label: 'Study Room', value: 'study' },
                    { label: 'Breakout Room', value: 'breakout' }
                ]}
                value={formData.commonAreas} onChange="commonAreas"
                updateForm={updateForm} toggleSelection={toggleSelection}
            />

            <SectionHeader title="Owner / Caretaker Details" />

            <ChipGroup
                id="managedBy" label="PROPERTY MANAGED BY"
                options={[
                    { label: 'Landlord', value: 'landlord' }, { label: 'Caretaker', value: 'caretaker' },
                    { label: 'Dedicated Professional', value: 'professional' }
                ]}
                value={formData.managedBy} onChange="managedBy"
                updateForm={updateForm} toggleSelection={toggleSelection}
            />

            <div style={{ marginBottom: '20px' }}>
                <label style={{ color: THEME.muted, display: 'block', marginBottom: '12px', fontSize: '0.9rem' }}>PROPERTY MANAGER STAYS AT PROPERTY</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <SelectButton label="Yes" selected={formData.managerStays === 'yes'} onClick={() => updateForm('managerStays', 'yes')} />
                    <SelectButton label="No" selected={formData.managerStays === 'no'} onClick={() => updateForm('managerStays', 'no')} />
                </div>
            </div>

            <SectionHeader title="PG Rules" />

            {[
                { label: 'NON VEG ALLOWED', key: 'nonVegAllowed' },
                { label: 'OPPOSITE SEX ALLOWED', key: 'oppositeSexAllowed' },
                { label: 'ANY TIME ALLOWED', key: 'anyTimeAllowed' },
                { label: 'VISITORS ALLOWED', key: 'visitorsAllowed' },
                { label: 'GUARDIAN ALLOWED', key: 'guardianAllowed' },
                { label: 'DRINKING ALLOWED', key: 'drinkingAllowed' },
                { label: 'SMOKING ALLOWED', key: 'smokingAllowed' },
            ].map(rule => (
                <div key={rule.key} style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${THEME.border}`, paddingBottom: '10px' }}>
                    <label style={{ color: THEME.text, fontSize: '0.9rem' }}>{rule.label}</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <SelectButton label="Yes" selected={formData[rule.key] === 'yes'} onClick={() => updateForm(rule.key, 'yes')} half />
                        <SelectButton label="No" selected={formData[rule.key] === 'no'} onClick={() => updateForm(rule.key, 'no')} half />
                    </div>
                </div>
            ))}

        </div>
    );

    const renderSourceDetails = () => (
        <div className="animate-slide-up">
            <SectionHeader title="Source Details" sub="Please provide the details of the person posting this property." />
            
            <TextInput 
                id="sourceName" 
                label="USER NAME" 
                placeholder="Enter Full Name" 
                value={formData.sourceName} 
                onChange={(v) => updateForm('sourceName', v)} 
                error={errors.sourceName} 
            />
            
            <TextInput 
                id="sourceNumber" 
                label="USER NUMBER" 
                placeholder="Enter Phone Number" 
                value={formData.sourceNumber} 
                onChange={(v) => updateForm('sourceNumber', v)} 
                error={errors.sourceNumber} 
            />
            
            <TextInput 
                id="sourceEmail" 
                label="USER E-MAIL" 
                placeholder="Enter Email Address" 
                value={formData.sourceEmail} 
                onChange={(v) => updateForm('sourceEmail', v)} 
                error={errors.sourceEmail} 
            />

            <div style={{ background: '#E3BC5A10', padding: '20px', borderRadius: '12px', border: '1px dashed #E3BC5A40', marginTop: '10px' }}>
                <TextInput 
                    id="sourceEnrollCode" 
                    label="USER ENROLL-CODE" 
                    placeholder="Enter your unique Enroll Code (Optional)" 
                    value={formData.sourceEnrollCode} 
                    onChange={(v) => updateForm('sourceEnrollCode', v)} 
                />
                <p style={{ fontSize: '0.75rem', color: THEME.muted, margin: '10px 0 0 0' }}>
                    * Your Enroll Code is provided by the Admin. If you don't have one, you can leave it blank.
                </p>
            </div>

            <div style={{ marginTop: '30px' }}>
                <button
                    type="button"
                    onClick={() => {
                        const newErrors = {};
                        if (!formData.sourceName) newErrors.sourceName = "Name is required";
                        if (!formData.sourceNumber) newErrors.sourceNumber = "Number is required";
                        if (!formData.sourceEmail) newErrors.sourceEmail = "Email is required";
                        
                        if (Object.keys(newErrors).length > 0) {
                            setErrors(newErrors);
                            return;
                        }
                        setStep(2);
                    }}
                    style={{
                        width: '100%', padding: '15px', background: THEME.gold, color: '#000',
                        border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer'
                    }}
                >
                    CONTINUE TO PROPERTY DETAILS
                </button>
            </div>
        </div>
    );

    const renderPropertyDetails = () => {
        if (formData.lookingTo === 'pg') return renderPGForm();

        return (
            <div className="animate-slide-up">

                {/* 1. LOOKING TO */}
                <ChipGroup
                    id="lookingTo" label="LOOKING TO"
                    options={[{ label: 'RENT', value: 'rent' }, { label: 'SELL', value: 'sell' }, { label: 'PG/CO-LIVING', value: 'pg' }]}
                    value={formData.lookingTo} onChange="lookingTo"
                    updateForm={updateForm} toggleSelection={toggleSelection}
                />

                {/* 2. PROPERTY TYPE */}
                <div id="propertyType" style={{ marginBottom: '30px' }}>
                    <label style={{ color: THEME.muted, display: 'block', marginBottom: '12px' }}>PROPERTY TYPE <span style={{ color: THEME.red }}>*</span></label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
                        {PROPERTY_TYPES.map(type => (
                            <button
                                key={type.value}
                                type="button"
                                onClick={() => updateForm('propertyType', type.value)}
                                style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '15px',
                                    background: formData.propertyType === type.value ? `${THEME.gold}15` : THEME.inputBg,
                                    border: `1px solid ${formData.propertyType === type.value ? THEME.gold : (errors.propertyType ? THEME.red : THEME.border)}`,
                                    borderRadius: '12px',
                                    color: formData.propertyType === type.value ? THEME.gold : THEME.muted,
                                    cursor: 'pointer', transition: 'all 0.2s'
                                }}
                            >
                                <type.icon size={22} />
                                <span style={{ fontSize: '0.8rem', textAlign: 'center' }}>{type.label}</span>
                            </button>
                        ))}
                    </div>
                    {errors.propertyType && <p style={{ color: THEME.red, fontSize: '0.8rem', marginTop: '5px' }}>{errors.propertyType}</p>}
                </div>

                {/* 3. CITY */}
                <ChipGroup
                    id="city" label="SELECT CITY"
                    options={[{ label: 'AHMEDABAD', value: 'Ahmedabad' }, { label: 'GANDHINAGAR', value: 'Gandhinagar' }]}
                    value={formData.city} onChange="city" error={errors.city}
                    updateForm={updateForm} toggleSelection={toggleSelection}
                />

                {/* 4. BUILDING / SOCIETY */}
                <TextInput id="project" label="BUILDING / APARTMENT / SOCIETY NAME" placeholder="Enter Project Name" value={formData.project} onChange={(v) => updateForm('project', v)} error={errors.project} />

                {/* 5. BHK */}
                {formData.propertyType !== 'plot' && (
                    <ChipGroup
                        id="bhk" label="SELECT BHK"
                        options={BHK_TYPES.map(b => ({ label: b, value: b }))}
                        value={formData.bhk} onChange="bhk" error={errors.bhk}
                        updateForm={updateForm} toggleSelection={toggleSelection}
                    />
                )}

                {/* 6. BUILT UP AREA */}
                <NumericInput id="builtUpArea" label="BUILT UP AREA" value={formData.builtUpArea} onChange={(v) => updateForm('builtUpArea', v)} suffix="Sq. ft." error={errors.builtUpArea} />

                {/* 7. CONSTRUCTION STATUS */}
                <ChipGroup
                    id="constructionStatus" label="CONSTRUCTION STATUS"
                    options={[{ label: 'READY TO MOVE', value: 'ready' }, { label: 'UNDER CONSTRUCTION', value: 'under_construction' }]}
                    value={formData.constructionStatus} onChange="constructionStatus"
                    updateForm={updateForm} toggleSelection={toggleSelection}
                />

                {/* TRANSACTION TYPE (IF SELL) */}
                {formData.lookingTo === 'sell' && (
                    <ChipGroup
                        id="transactionType" label="TRANSACTION TYPE"
                        options={[{ label: 'NEW BOOKING', value: 'new_booking' }, { label: 'RESALE', value: 'resale' }]}
                        value={formData.transactionType} onChange="transactionType"
                        updateForm={updateForm} toggleSelection={toggleSelection}
                    />
                )}

                {/* 8. BATHROOM */}
                <ChipGroup
                    id="bathrooms" label="SELECT BATHROOM"
                    options={['1', '2', '3', '4+'].map(n => ({ label: n, value: n }))}
                    value={formData.bathrooms} onChange="bathrooms"
                    updateForm={updateForm} toggleSelection={toggleSelection}
                />

                {/* 9. BALCONY */}
                <ChipGroup
                    id="balconies" label="BALCONY"
                    options={['0', '1', '2', '3', '4+'].map(n => ({ label: n, value: n }))}
                    value={formData.balconies} onChange="balconies"
                    updateForm={updateForm} toggleSelection={toggleSelection}
                />

                {/* 10. FURNISH TYPE */}
                <ChipGroup
                    id="furnishing" label="FURNISH TYPE"
                    options={[{ label: 'FULLY FURNISHED', value: 'full' }, { label: 'SEMI FURNISHED', value: 'semi' }, { label: 'UNFURNISHED', value: 'unfurnished' }]}
                    value={formData.furnishing} onChange="furnishing"
                    updateForm={updateForm} toggleSelection={toggleSelection}
                />

                {/* 11 & 12. PARKING */}
                <div className="grid-2-col">
                    <ChipGroup
                        id="coveredParking" label="COVERED PARKING"
                        options={['0', '1', '2', '3+'].map(n => ({ label: n, value: n }))}
                        value={formData.coveredParking} onChange="coveredParking"
                        updateForm={updateForm} toggleSelection={toggleSelection}
                    />
                    <ChipGroup
                        id="openParking" label="OPEN PARKING"
                        options={['0', '1', '2', '3+'].map(n => ({ label: n, value: n }))}
                        value={formData.openParking} onChange="openParking"
                        updateForm={updateForm} toggleSelection={toggleSelection}
                    />
                </div>

                {/* 13. COST */}
                <NumericInput
                    id="cost"
                    label={formData.lookingTo === 'rent' ? "MONTHLY RENT" : "EXPECTED PRICE"}
                    value={formData.cost}
                    onChange={(v) => updateForm('cost', v)}
                    prefix="₹"
                    error={errors.cost}
                />

                {/* 14. MAINTENANCE */}
                <NumericInput
                    id="maintenance"
                    label="MAINTENANCE CHARGES PER MONTH"
                    value={formData.maintenance}
                    onChange={(v) => updateForm('maintenance', v)}
                    prefix="₹"
                />

                {/* 15. CARPET AREA */}
                <NumericInput id="carpetArea" label="CARPET AREA" value={formData.carpetArea} onChange={(v) => updateForm('carpetArea', v)} suffix="Sq. ft." />

                {/* 16 & 17. FLOORS */}
                <div className="grid-2-col">
                    <NumericInput id="floorNo" label="FLOOR NO" value={formData.floorNo} onChange={(v) => updateForm('floorNo', v)} />
                    <NumericInput id="totalFloors" label="TOTAL FLOORS" value={formData.totalFloors} onChange={(v) => updateForm('totalFloors', v)} />
                </div>

                {/* AGE OF PROPERTY */}
                <NumericInput id="ageOfProperty" label="AGE OF PROPERTY (IN YEARS)" value={formData.ageOfProperty} onChange={(v) => updateForm('ageOfProperty', v)} />

                {/* AVAILABLE DATE */}
                <div id="availableFrom" style={{ marginBottom: '20px' }}>
                    <label style={{ color: THEME.muted, display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>AVAILABLE DATE</label>
                    <input
                        type="date"
                        value={formData.availableFrom}
                        onChange={(e) => updateForm('availableFrom', e.target.value)}
                        style={{
                            width: '100%', padding: '12px', background: THEME.inputBg, border: `1px solid ${THEME.border}`,
                            borderRadius: '8px', color: THEME.text, outline: 'none', colorScheme: 'dark'
                        }}
                    />
                </div>

                {/* LOCK IN PERIOD */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ color: THEME.muted, display: 'block', marginBottom: '12px', fontSize: '0.9rem' }}>LOCK IN PERIOD</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {['None', '1 Month', '2 Months', '6 Months', 'Custom'].map(period => (
                            <SelectButton
                                key={period}
                                label={period}
                                selected={formData.lockInPeriod === period}
                                onClick={() => updateForm('lockInPeriod', period)}
                            />
                        ))}
                    </div>
                </div>

                {/* 18. ADDITIONAL DETAILS */}
                <div style={{ marginTop: '20px', border: `1px solid ${THEME.border}`, borderRadius: '12px', overflow: 'hidden' }}>
                    <button
                        type="button"
                        onClick={() => setShowAdditional(!showAdditional)}
                        style={{
                            width: '100%', padding: '15px', background: `${THEME.gold}10`, border: 'none',
                            color: THEME.gold, fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'
                        }}
                    >
                        <span>ADDITIONAL DETAILS (OPTIONAL)</span>
                        {showAdditional ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>

                    {showAdditional && (
                        <div style={{ padding: '20px', background: THEME.cardBg }}>
                            <ChipGroup
                                id="facing" label="PROPERTY FACING"
                                options={['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'].map(d => ({ label: d, value: d }))}
                                value={formData.facing} onChange="facing"
                                updateForm={updateForm} toggleSelection={toggleSelection}
                            />

                            {/* PET FRIENDLY */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ color: THEME.muted, display: 'block', marginBottom: '12px', fontSize: '0.9rem' }}>PET FRIENDLY</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <SelectButton label="Yes" selected={formData.petFriendly === 'yes'} onClick={() => updateForm('petFriendly', 'yes')} />
                                    <SelectButton label="No" selected={formData.petFriendly === 'no'} onClick={() => updateForm('petFriendly', 'no')} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: THEME.text, cursor: 'pointer' }}>
                                    <input type="checkbox" checked={formData.gatedSecurity} onChange={(e) => updateForm('gatedSecurity', e.target.checked)} style={{ accentColor: THEME.gold, width: '18px', height: '18px' }} />
                                    Gated Security
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: THEME.text, cursor: 'pointer' }}>
                                    <input type="checkbox" checked={formData.powerBackup} onChange={(e) => updateForm('powerBackup', e.target.checked)} style={{ accentColor: THEME.gold, width: '18px', height: '18px' }} />
                                    Power Backup
                                </label>
                            </div>

                            {/* ADDRESS */}
                            <div style={{ marginTop: '20px' }}>
                                <TextInput id="address" label="FULL ADDRESS" placeholder="Enter Full Address" value={formData.address} onChange={(v) => updateForm('address', v)} />
                            </div>

                            {/* SERVANT ROOM */}
                            <div style={{ marginTop: '20px' }}>
                                <label style={{ color: THEME.muted, display: 'block', marginBottom: '12px', fontSize: '0.9rem' }}>SERVANT ROOM</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <SelectButton label="Yes" selected={formData.servantRoom === 'yes'} onClick={() => updateForm('servantRoom', 'yes')} />
                                    <SelectButton label="No" selected={formData.servantRoom === 'no'} onClick={() => updateForm('servantRoom', 'no')} />
                                </div>
                            </div>

                            {/* DESCRIPTION */}
                            <div style={{ marginTop: '20px' }}>
                                <label style={{ color: THEME.muted, display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>PROPERTY DESCRIPTION</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => updateForm('description', e.target.value)}
                                    placeholder="Describe your property (amenities, location advantages, etc.)"
                                    style={{
                                        width: '100%', padding: '12px 15px', background: THEME.inputBg, border: `1px solid ${THEME.border}`,
                                        borderRadius: '8px', color: THEME.text, fontSize: '1rem', outline: 'none', minHeight: '100px', resize: 'vertical'
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>

            </div>
        );

    };

    // --- MAIN RENDER ---
    return (
        <div style={{ background: THEME.bg, minHeight: '100vh', paddingBottom: '80px', color: THEME.text, fontFamily: 'Outfit, sans-serif' }}>
            {/* Header */}
            <div style={{ padding: '15px 40px', borderBottom: `1px solid ${THEME.border}`, background: THEME.bg, position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <Link to="/" style={{ color: THEME.muted }}><ArrowLeft size={22} /></Link>
                    <div>
                        <h2 style={{ fontSize: '1.1rem', color: THEME.text, margin: 0 }}>Values & Property Details</h2>
                        <div style={{ fontSize: '0.75rem', color: THEME.gold }}>Step {step} of 3</div>
                    </div>
                </div>
                <button type="button" style={{ background: 'transparent', border: 'none', color: THEME.gold, fontWeight: 'bold' }}>Save Draft</button>
            </div>

            <div className="container" style={{ maxWidth: '800px', margin: '30px auto', padding: '0 20px' }}>

                {/* Stepper Visual */}
                <div style={{ display: 'flex', gap: '5px', marginBottom: '30px' }}>
                    {[1, 2, 3].map(s => (
                        <div key={s} style={{
                            flex: 1, height: '4px', borderRadius: '2px',
                            background: step >= s ? THEME.green : THEME.border
                        }}></div>
                    ))}
                </div>

                {/* Form Content */}
                <form onSubmit={(e) => e.preventDefault()}>
                    {step === 1 && renderSourceDetails()}
                    
                    {step === 2 && renderPropertyDetails()}

                    {step === 3 && (
                        <div className="animate-slide-up">
                            <SectionHeader title="Property Photos" sub="Upload photos of your property to get better responses." />
                            <ImageUploadSection
                                images={formData.images}
                                onChange={(imgs) => updateForm('images', imgs)}
                                THEME={THEME}
                                error={errors.images}
                            />
                        </div>
                    )}
                </form>

            </div>

            {/* Bottom Sticky Action Bar */}
            <div style={{
                position: 'fixed', bottom: 0, left: 0, width: '100%',
                background: THEME.cardBg, borderTop: `1px solid ${THEME.border}`,
                padding: '15px 40px', display: 'flex', justifyContent: 'flex-end', gap: '20px',
                zIndex: 100
            }}>
                {step > 1 && (
                    <button type="button" onClick={handleBack} style={{ padding: '12px 25px', borderRadius: '8px', border: 'none', background: 'transparent', color: THEME.muted, fontWeight: 'bold', cursor: 'pointer' }}>
                        Back
                    </button>
                )}
                <button
                    type="button"
                    onClick={step === 3 ? handleSubmit : handleNext}
                    disabled={submitting}
                    style={{
                        padding: '12px 35px', borderRadius: '8px', border: 'none',
                        background: submitting ? THEME.muted : THEME.gold, color: THEME.bg,
                        fontWeight: 'bold', fontSize: '1rem',
                        display: 'flex', alignItems: 'center', gap: '10px', cursor: submitting ? 'not-allowed' : 'pointer',
                        boxShadow: `0 4px 15px ${THEME.gold}40`
                    }}
                >
                    {submitting ? 'Posting...' : (step === 3 ? 'Post Property' : 'Next')} {step !== 3 && <ChevronRight size={18} />}
                </button>
            </div>

            <style>
                {`
                .grid-2-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                @media (max-width: 768px) {
                    .grid-2-col { grid-template-columns: 1fr; gap: 0; }
                }
                .animate-slide-up { animation: slideUp 0.4s ease-out; }
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                `}
            </style>
        </div>
    );
};

export default PostProperty;
