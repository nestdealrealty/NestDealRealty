import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Check, ChevronRight, X, MapPin, IndianRupee, Home, Building, Building2, Trees, Warehouse, Hotel, Calendar, Users, Dog, Car, Info, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PostProperty = () => {
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [showAdditional, setShowAdditional] = useState(false);

    const [formData, setFormData] = useState({
        // 1. Basic
        purpose: 'rent',
        propertyType: '',
        bhk: '',

        // 2. Area & Structure
        builtUpArea: '',
        carpetArea: '',
        floorNo: '',
        totalFloors: '',
        ageOfProperty: '',

        // 3. Rooms
        bathrooms: '',
        balconies: '',
        furnishing: '',

        // 4. Parking
        coveredParking: '',
        openParking: '',

        // 5. Financials
        monthlyRent: '',
        expectedPrice: '', // If sell
        maintenanceOption: 'include', // include, separate
        maintenanceAmount: '',
        securityDeposit: 'none', // none, 1, 2, custom
        depositAmount: '',
        lockInPeriod: 'none', // none, 1, 6, custom
        lockInMonths: '',
        brokerage: 'none', // none, 15, 30, custom
        brokerageAmount: '',

        // 6. Tenant & Avail
        tenantPreference: [],
        petFriendly: '',
        availableFrom: '',

        // 7. Additional
        facing: '',
        powerBackup: false,
        gatedSecurity: false,
        lift: false,

        // Location & Photos (Steps 2 & 3 - placeholders for now)
        city: '',
        locality: '',
        project: '',
        images: []
    });

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

    // --- HANDLERS ---
    const updateForm = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        // Clear error if exists
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
        if (!formData.propertyType) newErrors.propertyType = "Property Type is required";
        if (formData.propertyType !== 'plot' && !formData.bhk) newErrors.bhk = "BHK selection is required";

        if (!formData.builtUpArea) newErrors.builtUpArea = "Built-up Area is required";
        if (!formData.floorNo) newErrors.floorNo = "Floor No is required";
        if (!formData.totalFloors) newErrors.totalFloors = "Total Floors is required";
        if (Number(formData.floorNo) > Number(formData.totalFloors)) newErrors.floorNo = "Floor No cannot be greater than Total Floors";

        if (!formData.bathrooms) newErrors.bathrooms = "Select bathrooms";
        if (!formData.furnishing) newErrors.furnishing = "Select furnishing";

        if (formData.purpose === 'rent') {
            if (!formData.monthlyRent) newErrors.monthlyRent = "Rent is required";
            if (!formData.availableFrom) newErrors.availableFrom = "Availability date is required";
        } else {
            if (!formData.expectedPrice) newErrors.expectedPrice = "Price is required";
        }

        setErrors(newErrors);

        // Scroll to first error
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
        setStep(prev => Math.min(prev + 1, 4));
    };

    const handleBack = () => setStep(prev => Math.max(prev - 1, 1));


    // --- SUB-COMPONENTS ---

    const SectionHeader = ({ title, sub }) => (
        <div style={{ marginBottom: '20px', borderBottom: `1px solid ${THEME.border}`, paddingBottom: '10px' }}>
            <h3 style={{ color: THEME.text, fontSize: '1.1rem', marginBottom: '5px' }}>{title}</h3>
            {sub && <p style={{ color: THEME.muted, fontSize: '0.85rem' }}>{sub}</p>}
        </div>
    );

    const SelectButton = ({ label, selected, onClick, error, half }) => (
        <button
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

    const ChipGroup = ({ id, label, options, value, onChange, multi, error }) => (
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

    // --- STEP 1 RENDER (PROPERTY DETAILS) ---
    const renderPropertyDetails = () => (
        <div className="animate-slide-up">

            {/* 1. Property Type */}
            <div id="propertyType" style={{ marginBottom: '30px' }}>
                <label style={{ color: THEME.muted, display: 'block', marginBottom: '12px' }}>Property Type <span style={{ color: THEME.red }}>*</span></label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
                    {PROPERTY_TYPES.map(type => (
                        <button
                            key={type.value}
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

            {/* BHK Config */}
            {formData.propertyType !== 'plot' && (
                <ChipGroup
                    id="bhk"
                    label="BHK Configuration"
                    options={BHK_TYPES.map(b => ({ label: b, value: b }))}
                    value={formData.bhk}
                    onChange="bhk"
                    error={errors.bhk}
                />
            )}

            <div className="grid-2-col">
                <NumericInput id="builtUpArea" label="Built-up Area" value={formData.builtUpArea} onChange={(v) => updateForm('builtUpArea', v)} suffix="Sq. ft." error={errors.builtUpArea} />
                <NumericInput id="carpetArea" label="Carpet Area (Optional)" value={formData.carpetArea} onChange={(v) => updateForm('carpetArea', v)} suffix="Sq. ft." />
            </div>

            <div className="grid-2-col">
                <NumericInput id="floorNo" label="Floor No." value={formData.floorNo} onChange={(v) => updateForm('floorNo', v)} error={errors.floorNo} />
                <NumericInput id="totalFloors" label="Total Floors" value={formData.totalFloors} onChange={(v) => updateForm('totalFloors', v)} error={errors.totalFloors} />
            </div>

            <NumericInput id="ageOfProperty" label="Age of Property (Years)" value={formData.ageOfProperty} onChange={(v) => updateForm('ageOfProperty', v)} type="number" />

            <SectionHeader title="Rooms & Features" />

            <ChipGroup
                id="bathrooms" label="Bathrooms"
                options={['1', '2', '3', '4+'].map(n => ({ label: n, value: n }))}
                value={formData.bathrooms} onChange="bathrooms" error={errors.bathrooms}
            />
            <ChipGroup
                id="balconies" label="Balconies"
                options={['0', '1', '2', '3', '4+'].map(n => ({ label: n, value: n }))}
                value={formData.balconies} onChange="balconies"
            />
            <ChipGroup
                id="furnishing" label="Furnishing Type"
                options={[{ label: 'Fully Furnished', value: 'full' }, { label: 'Semi Furnished', value: 'semi' }, { label: 'Unfurnished', value: 'unfurnished' }]}
                value={formData.furnishing} onChange="furnishing" error={errors.furnishing}
            />

            <SectionHeader title="Parking Details" />
            <div className="grid-2-col">
                <ChipGroup
                    id="coveredParking" label="Covered Parking"
                    options={['0', '1', '2', '3+'].map(n => ({ label: n, value: n }))}
                    value={formData.coveredParking} onChange="coveredParking"
                />
                <ChipGroup
                    id="openParking" label="Open Parking"
                    options={['0', '1', '2', '3+'].map(n => ({ label: n, value: n }))}
                    value={formData.openParking} onChange="openParking"
                />
            </div>

            <SectionHeader title="Rental & Financial Details" />

            {formData.purpose === 'rent' ? (
                <>
                    <NumericInput
                        id="monthlyRent"
                        label="Monthly Rent"
                        value={formData.monthlyRent}
                        onChange={(v) => updateForm('monthlyRent', v)}
                        prefix="₹"
                        error={errors.monthlyRent}
                    />

                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ color: THEME.muted, display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Maintenance Charges</label>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            {['Included in Rent', 'Separate'].map(opt => (
                                <SelectButton
                                    key={opt} label={opt}
                                    selected={formData.maintenanceOption === (opt === 'Included in Rent' ? 'include' : 'separate')}
                                    onClick={() => updateForm('maintenanceOption', opt === 'Included in Rent' ? 'include' : 'separate')}
                                />
                            ))}
                        </div>
                        {formData.maintenanceOption === 'separate' && (
                            <NumericInput placeholder="Enter Amount" value={formData.maintenanceAmount} onChange={(v) => updateForm('maintenanceAmount', v)} prefix="₹" />
                        )}
                    </div>

                    <ChipGroup
                        id="securityDeposit" label="Security Deposit"
                        options={[{ label: 'None', value: 'none' }, { label: '1 Month', value: '1' }, { label: '2 Months', value: '2' }, { label: 'Custom', value: 'custom' }]}
                        value={formData.securityDeposit} onChange="securityDeposit"
                    />
                    {formData.securityDeposit === 'custom' && (
                        <NumericInput label="Deposit Amount" value={formData.depositAmount} onChange={(v) => updateForm('depositAmount', v)} prefix="₹" />
                    )}
                </>
            ) : (
                <NumericInput
                    id="expectedPrice"
                    label="Expected Price"
                    value={formData.expectedPrice}
                    onChange={(v) => updateForm('expectedPrice', v)}
                    prefix="₹"
                    error={errors.expectedPrice}
                />
            )}

            <ChipGroup
                id="brokerage" label="Do you charge brokerage?"
                options={[{ label: 'None', value: 'none' }, { label: '15 Days', value: '15' }, { label: '30 Days', value: '30' }, { label: 'Custom', value: 'custom' }]}
                value={formData.brokerage} onChange="brokerage"
            />

            {formData.purpose === 'rent' && (
                <>
                    <SectionHeader title="Tenant Preferences" />
                    <ChipGroup
                        id="tenantPreference" label="Preferred Tenant" multi
                        options={[{ label: 'Family', value: 'family' }, { label: 'Bachelors', value: 'bachelor' }, { label: 'Company', value: 'company' }]}
                        value={formData.tenantPreference} onChange="tenantPreference"
                    />

                    <div className="grid-2-col">
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ color: THEME.muted, display: 'block', marginBottom: '12px', fontSize: '0.9rem' }}>Pet Friendly</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <SelectButton label="Yes" selected={formData.petFriendly === 'yes'} onClick={() => updateForm('petFriendly', 'yes')} />
                                <SelectButton label="No" selected={formData.petFriendly === 'no'} onClick={() => updateForm('petFriendly', 'no')} />
                            </div>
                        </div>

                        <div id="availableFrom">
                            <label style={{ color: errors.availableFrom ? THEME.red : THEME.muted, display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
                                Available From {errors.availableFrom && '*'}
                            </label>
                            <input
                                type="date"
                                value={formData.availableFrom}
                                onChange={(e) => updateForm('availableFrom', e.target.value)}
                                style={{
                                    width: '100%', padding: '12px', background: THEME.inputBg, border: `1px solid ${errors.availableFrom ? THEME.red : THEME.border}`,
                                    borderRadius: '8px', color: THEME.text, outline: 'none', colorScheme: 'dark'
                                }}
                            />
                        </div>
                    </div>
                </>
            )}

            {/* Additional Details Collapsible */}
            <div style={{ marginTop: '30px', border: `1px solid ${THEME.border}`, borderRadius: '12px', overflow: 'hidden' }}>
                <button
                    onClick={() => setShowAdditional(!showAdditional)}
                    style={{
                        width: '100%', padding: '15px', background: `${THEME.gold}10`, border: 'none',
                        color: THEME.gold, fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'
                    }}
                >
                    <span>+ Add Additional Details (Score +5%)</span>
                    {showAdditional ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {showAdditional && (
                    <div style={{ padding: '20px', background: THEME.cardBg }}>
                        <ChipGroup
                            id="facing" label="Property Facing"
                            options={['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'].map(d => ({ label: d, value: d }))}
                            value={formData.facing} onChange="facing"
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            {/* Examples of toggles */}
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
                        <div style={{ fontSize: '0.75rem', color: THEME.gold }}>Step {step} of 4</div>
                    </div>
                </div>
                <button style={{ background: 'transparent', border: 'none', color: THEME.gold, fontWeight: 'bold' }}>Save Draft</button>
            </div>

            <div className="container" style={{ maxWidth: '800px', margin: '30px auto', padding: '0 20px' }}>

                {/* Stepper Visual */}
                <div style={{ display: 'flex', gap: '5px', marginBottom: '30px' }}>
                    {[1, 2, 3, 4].map(s => (
                        <div key={s} style={{
                            flex: 1, height: '4px', borderRadius: '2px',
                            background: step >= s ? THEME.green : THEME.border
                        }}></div>
                    ))}
                </div>

                {/* Form Content */}
                <form onSubmit={(e) => e.preventDefault()}>
                    {step === 1 && renderPropertyDetails()}

                    {step === 2 && <div style={{ textAlign: 'center', padding: '50px', color: THEME.muted }}>Location Details (Next Step)</div>}
                    {step === 3 && <div style={{ textAlign: 'center', padding: '50px', color: THEME.muted }}>Photo Upload (Next Step)</div>}
                    {step === 4 && <div style={{ textAlign: 'center', padding: '50px', color: THEME.muted }}>Summary & Post</div>}
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
                    <button onClick={handleBack} style={{ padding: '12px 25px', borderRadius: '8px', border: 'none', background: 'transparent', color: THEME.muted, fontWeight: 'bold', cursor: 'pointer' }}>
                        Back
                    </button>
                )}
                <button
                    onClick={handleNext}
                    style={{
                        padding: '12px 35px', borderRadius: '8px', border: 'none',
                        background: THEME.gold, color: THEME.bg,
                        fontWeight: 'bold', fontSize: '1rem',
                        display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
                        boxShadow: `0 4px 15px ${THEME.gold}40`
                    }}
                >
                    {step === 4 ? 'Post Now' : 'Next, Add Address'} <ChevronRight size={18} />
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
