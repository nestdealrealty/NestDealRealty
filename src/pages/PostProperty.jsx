import React, { useState } from 'react';
import { ArrowLeft, Upload, Check, ChevronRight, X, MapPin, IndianRupee, Home, Building, Building2, Trees, Warehouse, Hotel, Calendar, Users, Dog, Car, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const PostProperty = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        purpose: 'rent', // Default to rent matching screenshots
        propertyType: 'apartment',
        bhk: '',
        floor: '',
        totalFloors: '',
        builtUpArea: '',
        areaType: 'super_builtup',
        ageOfProperty: '',
        bathrooms: '',
        balconies: '',
        furnishing: 'unfurnished',
        coveredParking: 0,
        openParking: 0,
        tenantPreference: [], // family, bachelor, company
        petFriendly: 'no',
        availableFrom: '',
        monthlyRent: '',
        expectedPrice: '',
        maintenanceOption: 'include', // include, separate
        maintenanceAmount: '',
        securityDeposit: 'none',
        lockInPeriod: 'none',
        brokerage: 'none',
        description: '',
        images: [],
        city: '',
        locality: '',
        project: ''
    });

    const totalSteps = 4;

    // THEME CONSTANTS 
    const BG_PRIMARY = '#0C1512';
    const BG_SECONDARY = '#1A1F1D';
    const TEXT_PRIMARY = '#E6ECE9';
    const TEXT_MUTED = '#8E9CA3';
    const GOLD_ACCENT = '#E3BC5A';
    const SUCCESS_GREEN = '#00C853';
    const BORDER = '#2A2F2D';

    const handleNext = () => setStep(prev => Math.min(prev + 1, totalSteps));
    const handleBack = () => setStep(prev => Math.max(prev - 1, 1));
    const updateForm = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
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

    // --- REUSABLE COMPONENTS ---
    const ChipGroup = ({ label, options, value, onChange, multi = false }) => (
        <div style={{ marginBottom: '25px' }}>
            <label style={{ color: TEXT_MUTED, display: 'block', marginBottom: '12px', fontSize: '0.9rem' }}>{label}</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {options.map(opt => {
                    const isSelected = multi ? value.includes(opt.value) : value === opt.value;
                    return (
                        <button
                            key={opt.value}
                            onClick={() => multi ? toggleSelection(onChange, opt.value) : updateForm(onChange, opt.value)}
                            style={{
                                padding: '10px 20px',
                                background: isSelected ? `${GOLD_ACCENT}20` : 'transparent',
                                border: `1px solid ${isSelected ? GOLD_ACCENT : '#333'}`,
                                borderRadius: '20px',
                                color: isSelected ? GOLD_ACCENT : TEXT_PRIMARY,
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            {opt.label}
                        </button>
                    )
                })}
            </div>
        </div>
    );

    const Counter = ({ label, value, onChange, max = 3 }) => (
        <div style={{ marginBottom: '25px' }}>
            <label style={{ color: TEXT_MUTED, display: 'block', marginBottom: '12px', fontSize: '0.9rem' }}>{label}</label>
            <div style={{ display: 'flex', gap: '10px' }}>
                {[0, 1, 2, 3, '3+'].map(num => (
                    <button
                        key={num}
                        onClick={() => updateForm(onChange, num)}
                        style={{
                            width: '45px', height: '45px', borderRadius: '50%',
                            background: value === num ? GOLD_ACCENT : 'transparent',
                            border: `1px solid ${value === num ? GOLD_ACCENT : '#333'}`,
                            color: value === num ? BG_PRIMARY : TEXT_PRIMARY,
                            cursor: 'pointer', fontWeight: 'bold'
                        }}
                    >
                        {num}
                    </button>
                ))}
            </div>
        </div>
    );

    // --- STEPS RENDER ---

    const renderStep1 = () => (
        <div className="animate-fade-in">
            <h2 style={{ color: TEXT_PRIMARY, marginBottom: '20px' }}>Property Details</h2>

            {/* 1. Purpose & Type */}
            <ChipGroup
                label="I want to..."
                options={[{ label: 'Sell', value: 'sell' }, { label: 'Rent / Lease', value: 'rent' }]}
                value={formData.purpose}
                onChange="purpose"
            />

            <label style={{ color: TEXT_MUTED, display: 'block', marginBottom: '12px', fontSize: '0.9rem' }}>Property Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
                {[
                    { label: 'Apartment', value: 'apartment', icon: Building2 },
                    { label: 'Indep. House', value: 'house', icon: Home },
                    { label: 'Villa', value: 'villa', icon: Home },
                    { label: 'Studio', value: 'studio', icon: Building },
                    { label: 'Farm House', value: 'farm', icon: Trees },
                    { label: 'Penthouse', value: 'penthouse', icon: Building },
                    { label: 'Office', value: 'office', icon: Building2 },
                    { label: 'Plot', value: 'plot', icon: MapPin },
                ].map(type => (
                    <button
                        key={type.value}
                        onClick={() => updateForm('propertyType', type.value)}
                        style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                            padding: '15px',
                            background: formData.propertyType === type.value ? `${GOLD_ACCENT}15` : BG_SECONDARY,
                            border: `1px solid ${formData.propertyType === type.value ? GOLD_ACCENT : BORDER}`,
                            borderRadius: '12px',
                            color: formData.propertyType === type.value ? GOLD_ACCENT : TEXT_MUTED,
                            cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        <type.icon size={24} />
                        <span style={{ fontSize: '0.8rem', textAlign: 'center' }}>{type.label}</span>
                    </button>
                ))}
            </div>

            {/* 2. BHK */}
            {formData.propertyType !== 'plot' && (
                <ChipGroup
                    label="BHK Type"
                    options={[
                        { label: '1 RK', value: '1rk' }, { label: '1 BHK', value: '1' }, { label: '1.5 BHK', value: '1.5' },
                        { label: '2 BHK', value: '2' }, { label: '2.5 BHK', value: '2.5' }, { label: '3 BHK', value: '3' },
                        { label: '3.5 BHK', value: '3.5' }, { label: '4 BHK', value: '4' }, { label: '5+ BHK', value: '5+' }
                    ]}
                    value={formData.bhk}
                    onChange="bhk"
                />
            )}

            <div style={{ borderTop: `1px solid ${BORDER}`, margin: '30px 0' }}></div>

            {/* 3. Features (Parking, Bath, Balcony, Furnishing) - MOVED HERE */}
            <h3 style={{ color: TEXT_PRIMARY, fontSize: '1rem', marginBottom: '20px' }}>Property Features</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <Counter label="Bathrooms" value={formData.bathrooms} onChange="bathrooms" />
                <Counter label="Balconies" value={formData.balconies} onChange="balconies" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <Counter label="Covered Parking" value={formData.coveredParking} onChange="coveredParking" />
                <Counter label="Open Parking" value={formData.openParking} onChange="openParking" />
            </div>

            <ChipGroup
                label="Furnishing Status"
                options={[
                    { label: 'Unfurnished', value: 'unfurnished' },
                    { label: 'Semi Furnished', value: 'semi' },
                    { label: 'Fully Furnished', value: 'full' }
                ]}
                value={formData.furnishing}
                onChange="furnishing"
            />

            {/* 4. Tenant & Availability - MOVED HERE */}
            {formData.purpose === 'rent' && (
                <>
                    <label style={{ color: TEXT_MUTED, display: 'block', marginBottom: '12px', fontSize: '0.9rem' }}>Preferred Tenants</label>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                        {[
                            { id: 'family', label: 'Family', icon: Users },
                            { id: 'bachelor', label: 'Bachelors', icon: Users },
                            { id: 'company', label: 'Company', icon: Building }
                        ].map(type => {
                            const selected = formData.tenantPreference.includes(type.id);
                            return (
                                <button
                                    key={type.id}
                                    onClick={() => toggleSelection('tenantPreference', type.id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                                        background: selected ? `${GOLD_ACCENT}20` : 'transparent',
                                        border: `1px solid ${selected ? GOLD_ACCENT : '#333'}`, borderRadius: '8px',
                                        color: selected ? GOLD_ACCENT : TEXT_MUTED, cursor: 'pointer'
                                    }}
                                >
                                    <type.icon size={16} /> {type.label}
                                </button>
                            )
                        })}
                    </div>
                </>
            )}

            <div style={{ marginBottom: '25px' }}>
                <label style={{ color: TEXT_MUTED, display: 'block', marginBottom: '12px', fontSize: '0.9rem' }}>Available From</label>
                <input
                    type="date"
                    value={formData.availableFrom}
                    onChange={(e) => updateForm('availableFrom', e.target.value)}
                    style={{ ...inputStyle, colorScheme: 'dark' }}
                />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <label style={{ color: TEXT_MUTED, fontSize: '0.9rem' }}>Pet Friendly?</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {['Yes', 'No'].map(opt => (
                        <button
                            key={opt}
                            onClick={() => updateForm('petFriendly', opt)}
                            style={{
                                padding: '5px 15px', borderRadius: '15px', border: `1px solid ${formData.petFriendly === opt ? GOLD_ACCENT : '#333'}`,
                                background: formData.petFriendly === opt ? GOLD_ACCENT : 'transparent',
                                color: formData.petFriendly === opt ? BG_PRIMARY : TEXT_MUTED, cursor: 'pointer', fontSize: '0.8rem'
                            }}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );

    const renderStep2 = () => (
        <div className="animate-fade-in">
            <h2 style={{ color: TEXT_PRIMARY, marginBottom: '20px' }}>Location & Area</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                <div>
                    <label style={{ color: TEXT_MUTED, display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>City</label>
                    <input type="text" placeholder="Enter City" value={formData.city} onChange={(e) => updateForm('city', e.target.value)}
                        style={inputStyle} />
                </div>
                <div>
                    <label style={{ color: TEXT_MUTED, display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Project / Society</label>
                    <input type="text" placeholder="Society Name" value={formData.project} onChange={(e) => updateForm('project', e.target.value)}
                        style={inputStyle} />
                </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
                <label style={{ color: TEXT_MUTED, display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Built Up Area (Sq. Ft.)</label>
                <input type="number" placeholder="e.g. 1200" value={formData.builtUpArea} onChange={(e) => updateForm('builtUpArea', e.target.value)}
                    style={inputStyle} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                <div>
                    <label style={{ color: TEXT_MUTED, display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Floor No.</label>
                    <input type="number" placeholder="Property Floor" value={formData.floor} onChange={(e) => updateForm('floor', e.target.value)}
                        style={inputStyle} />
                </div>
                <div>
                    <label style={{ color: TEXT_MUTED, display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Total Floors</label>
                    <input type="number" placeholder="Total Floors" value={formData.totalFloors} onChange={(e) => updateForm('totalFloors', e.target.value)}
                        style={inputStyle} />
                </div>
            </div>

            <div>
                <label style={{ color: TEXT_MUTED, display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Age of Property (Years)</label>
                <input type="range" min="0" max="50" value={formData.ageOfProperty || 0} onChange={(e) => updateForm('ageOfProperty', e.target.value)}
                    style={{ width: '100%', accentColor: GOLD_ACCENT, marginBottom: '10px' }} />
                <div style={{ color: GOLD_ACCENT, fontWeight: 'bold' }}>{formData.ageOfProperty ? `${formData.ageOfProperty} Years` : 'New Construction'}</div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="animate-fade-in">
            <h2 style={{ color: TEXT_PRIMARY, marginBottom: '20px' }}>Photos & Media</h2>
            <div style={{ marginTop: '30px', padding: '40px', background: `${BG_SECONDARY}`, borderRadius: '12px', textAlign: 'center', border: `2px dashed ${BORDER}` }}>
                <Upload size={40} color={GOLD_ACCENT} style={{ marginBottom: '15px' }} />
                <p style={{ color: TEXT_PRIMARY, fontWeight: 'bold', fontSize: '1.2rem' }}>Upload Property Photos</p>
                <p style={{ color: TEXT_MUTED, fontSize: '0.9rem', marginBottom: '20px' }}>Add at least 3 photos to get 5x more responses</p>
                <button style={{ padding: '10px 25px', borderRadius: '20px', background: GOLD_ACCENT, color: BG_PRIMARY, border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Browse Files</button>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="animate-fade-in">
            <h2 style={{ color: TEXT_PRIMARY, marginBottom: '20px' }}>Pricing & Financials</h2>

            {formData.purpose === 'rent' ? (
                <>
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ color: TEXT_MUTED, display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Monthly Rent (₹)</label>
                        <input type="number" placeholder="Enter Rent" value={formData.monthlyRent} onChange={(e) => updateForm('monthlyRent', e.target.value)}
                            style={{ ...inputStyle, fontSize: '1.2rem', color: SUCCESS_GREEN, fontWeight: 'bold' }} />
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ color: TEXT_MUTED, display: 'block', marginBottom: '12px', fontSize: '0.9rem' }}>Maintenance Charges</label>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            {['include', 'separate'].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => updateForm('maintenanceOption', opt)}
                                    style={{
                                        flex: 1, padding: '12px', borderRadius: '8px',
                                        background: formData.maintenanceOption === opt ? GOLD_ACCENT : BG_SECONDARY,
                                        color: formData.maintenanceOption === opt ? BG_PRIMARY : TEXT_PRIMARY,
                                        border: 'none', cursor: 'pointer'
                                    }}
                                >
                                    {opt === 'include' ? 'Included in Rent' : 'Extra / Separate'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <ChipGroup
                        label="Security Deposit"
                        options={[{ label: 'None', value: 'none' }, { label: '1 Month', value: '1' }, { label: '2 Months', value: '2' }, { label: '3 Months', value: '3' }]}
                        value={formData.securityDeposit}
                        onChange="securityDeposit"
                    />

                    <ChipGroup
                        label="Lock-in Period"
                        options={[{ label: 'None', value: 'none' }, { label: '6 Months', value: '6' }, { label: '1 Year', value: '12' }]}
                        value={formData.lockInPeriod}
                        onChange="lockInPeriod"
                    />
                </>
            ) : (
                <>
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ color: TEXT_MUTED, display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Expected Price (₹)</label>
                        <input type="number" placeholder="Enter Price" value={formData.expectedPrice} onChange={(e) => updateForm('expectedPrice', e.target.value)}
                            style={{ ...inputStyle, fontSize: '1.2rem', color: SUCCESS_GREEN, fontWeight: 'bold' }} />
                    </div>
                </>
            )}

            <ChipGroup
                label="Do you charge brokerage?"
                options={[{ label: 'No (Zero Brokerage)', value: 'no' }, { label: '15 Days', value: '15days' }, { label: '1 Month', value: '1month' }]}
                value={formData.brokerage}
                onChange="brokerage"
            />
        </div>
    );

    const inputStyle = {
        width: '100%', padding: '14px', background: BG_SECONDARY, border: `1px solid ${BORDER}`,
        borderRadius: '8px', color: TEXT_PRIMARY, fontSize: '1rem', outline: 'none'
    };

    return (
        <div style={{ background: BG_PRIMARY, minHeight: '100vh', paddingBottom: '50px', color: TEXT_PRIMARY, fontFamily: 'Outfit, sans-serif' }}>
            {/* Header */}
            <div style={{ padding: '20px 40px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Link to="/" style={{ color: TEXT_MUTED }}><ArrowLeft size={24} /></Link>
                <div>
                    <h2 style={{ fontSize: '1.2rem', color: TEXT_PRIMARY }}>Post your property</h2>
                    <div style={{ fontSize: '0.8rem', color: GOLD_ACCENT }}>Sell or rent your property</div>
                </div>
            </div>

            <div className="container" style={{ maxWidth: '700px', margin: '40px auto', padding: '0 20px' }}>

                {/* Stepper */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', position: 'relative' }}>
                    {['Property Details', 'Location & Area', 'Photos', 'Pricing'].map((label, idx) => {
                        const stepNum = idx + 1;
                        const isActive = step >= stepNum;
                        return (
                            <div key={idx} style={{ flex: 1, textAlign: 'center', position: 'relative', zIndex: 2 }}>
                                <div style={{
                                    width: '30px', height: '30px', borderRadius: '50%', margin: '0 auto 8px',
                                    background: isActive ? GOLD_ACCENT : BG_SECONDARY, color: isActive ? BG_PRIMARY : TEXT_MUTED,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
                                    border: `2px solid ${isActive ? GOLD_ACCENT : '#333'}`
                                }}>
                                    {isActive && step > stepNum ? <Check size={16} /> : stepNum}
                                </div>
                                <span style={{ fontSize: '0.75rem', color: isActive ? TEXT_PRIMARY : TEXT_MUTED, display: 'block' }}>{label}</span>
                            </div>
                        )
                    })}
                    {/* Progress Line */}
                    <div style={{
                        position: 'absolute', top: '15px', left: '10%', right: '10%', height: '2px', background: '#333', zIndex: 1
                    }}>
                        <div style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%`, height: '100%', background: GOLD_ACCENT, transition: 'all 0.3s' }}></div>
                    </div>
                </div>

                <div style={{ background: '#121816', border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '30px' }}>
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && renderStep4()}

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '20px', borderTop: `1px solid ${BORDER}` }}>
                        <button onClick={handleBack} disabled={step === 1} style={{ padding: '12px 25px', borderRadius: '8px', border: 'none', background: 'transparent', color: step === 1 ? '#333' : TEXT_MUTED, cursor: step === 1 ? 'not-allowed' : 'pointer' }}>Back</button>
                        <button onClick={step === totalSteps ? () => alert('Property Posted! (Demo)') : handleNext} style={{ padding: '12px 35px', borderRadius: '8px', border: 'none', background: GOLD_ACCENT, color: BG_PRIMARY, cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {step === totalSteps ? 'Post Property' : 'Next'} <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .animate-fade-in { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default PostProperty;
