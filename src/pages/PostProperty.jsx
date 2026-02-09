import React, { useState } from 'react';
import { ArrowLeft, Upload, Check, ChevronRight, MapPin, Home, Building, Building2, Trees, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const PostProperty = () => {
    // Consolidated Steps: 1. Property Details (Everything), 2. Photos, 3. Success
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [showAdditional, setShowAdditional] = useState(false);

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
        facing: '',
        powerBackup: false,
        gatedSecurity: false,

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

    const validateStep1 = () => {
        const newErrors = {};

        // Essential Validations
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
        if (step === 1 && !validateStep1()) return;
        setStep(prev => Math.min(prev + 1, 3));
    };

    const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

    // --- RENDER FUNCTIONS ---

    const renderStep1 = () => (
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
            <TextInput id="city" label="SELECT CITY" placeholder="Enter City (e.g. Ahmedabad)" value={formData.city} onChange={(v) => updateForm('city', v)} error={errors.city} />

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
                    </div>
                )}
            </div>

        </div>
    );

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
                    {step === 1 && renderStep1()}

                    {step === 2 && (
                        <div className="animate-slide-up" style={{ textAlign: 'center', padding: '50px' }}>
                            <Upload size={40} color={THEME.gold} />
                            <h3 style={{ marginTop: '20px' }}>Upload Photos</h3>
                            <p style={{ color: THEME.muted }}>Upload at least 3 photos of your property.</p>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-slide-up" style={{ textAlign: 'center', padding: '50px' }}>
                            <Check size={50} color={THEME.green} />
                            <h3 style={{ marginTop: '20px' }}>Ready to Post!</h3>
                            <p style={{ color: THEME.muted }}>Review your details and click Post.</p>
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
                    onClick={step === 3 ? () => alert("Property Posted Successfully!") : handleNext}
                    style={{
                        padding: '12px 35px', borderRadius: '8px', border: 'none',
                        background: THEME.gold, color: THEME.bg,
                        fontWeight: 'bold', fontSize: '1rem',
                        display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
                        boxShadow: `0 4px 15px ${THEME.gold}40`
                    }}
                >
                    {step === 3 ? 'Post Property' : 'Next'} <ChevronRight size={18} />
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
