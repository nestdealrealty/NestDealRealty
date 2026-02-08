import React, { useState } from 'react';
import { ArrowLeft, Upload, Check, ChevronRight, X, Image as ImageIcon, MapPin, Home, IndianRupee, BedDouble, Bath, Car, Shield, Wifi, Zap, Trees, Dumbbell } from 'lucide-react';
import { Link } from 'react-router-dom';

const PostProperty = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        purpose: 'sell', // sell, rent, pg
        propertyType: 'flat', // flat, villa, plot, commercial
        city: '',
        locality: '',
        project: '',
        bhk: '', // 1, 2, 3, 4, 5+
        bathrooms: '',
        balconies: '',
        furnishing: 'unfurnished', // unfurnished, semi, full
        area: '', // sqft
        areaType: 'super_builtup', // super_builtup, carpet
        price: '',
        maintenance: '',
        description: '',
        amenities: [],
        images: []
    });

    const totalSteps = 4;

    // THEME CONSTANTS (Platinum-Gold & Dark Slate)
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

    const toggleAmenity = (amenity) => {
        setFormData(prev => {
            const amenities = prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity];
            return { ...prev, amenities };
        });
    };

    // --- RENDER STEPS ---

    const renderStep1 = () => (
        <div className="step-content animate-fade-in">
            <h2 style={{ color: TEXT_PRIMARY, marginBottom: '20px' }}>What kind of property do you have?</h2>

            {/* Purpose */}
            <div style={{ marginBottom: '30px' }}>
                <label style={{ color: TEXT_MUTED, display: 'block', marginBottom: '10px' }}>I want to...</label>
                <div style={{ display: 'flex', gap: '15px' }}>
                    {['sell', 'rent', 'pg'].map(option => (
                        <button
                            key={option}
                            onClick={() => updateForm('purpose', option)}
                            style={{
                                flex: 1,
                                padding: '15px',
                                background: formData.purpose === option ? GOLD_ACCENT : BG_SECONDARY,
                                color: formData.purpose === option ? BG_PRIMARY : TEXT_PRIMARY,
                                border: `1px solid ${formData.purpose === option ? GOLD_ACCENT : BORDER}`,
                                borderRadius: '8px',
                                textTransform: 'capitalize',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {option === 'pg' ? 'List as PG' : option}
                        </button>
                    ))}
                </div>
            </div>

            {/* Property Type */}
            <div style={{ marginBottom: '30px' }}>
                <label style={{ color: TEXT_MUTED, display: 'block', marginBottom: '10px' }}>Property Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    {[
                        { id: 'flat', label: 'Flat / Apartment', icon: Home },
                        { id: 'villa', label: 'House / Villa', icon: Home },
                        { id: 'plot', label: 'Plot / Land', icon: MapPin },
                        { id: 'commercial', label: 'Commercial Office', icon: createBriefcaseIcon() } // Placeholder icon helper
                    ].map(type => (
                        <button
                            key={type.id}
                            onClick={() => updateForm('propertyType', type.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '15px',
                                background: formData.propertyType === type.id ? `${GOLD_ACCENT}20` : BG_SECONDARY,
                                border: `1px solid ${formData.propertyType === type.id ? GOLD_ACCENT : BORDER}`,
                                borderRadius: '8px',
                                color: formData.propertyType === type.id ? GOLD_ACCENT : TEXT_PRIMARY,
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s'
                            }}
                        >
                            <type.icon size={20} />
                            <span style={{ fontWeight: '600' }}>{type.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Location */}
            <div>
                <label style={{ color: TEXT_MUTED, display: 'block', marginBottom: '10px' }}>City</label>
                <input
                    type="text"
                    placeholder="Enter City (e.g. Ahmedabad)"
                    value={formData.city}
                    onChange={(e) => updateForm('city', e.target.value)}
                    style={{
                        width: '100%', padding: '15px', background: BG_SECONDARY, border: `1px solid ${BORDER}`,
                        borderRadius: '8px', color: TEXT_PRIMARY, fontSize: '1rem', outline: 'none'
                    }}
                />
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="step-content animate-fade-in">
            <h2 style={{ color: TEXT_PRIMARY, marginBottom: '20px' }}>Where is it located?</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label style={{ color: TEXT_MUTED, display: 'block', marginBottom: '10px' }}>Project / Society Name</label>
                    <input
                        type="text"
                        placeholder="Name of the society or project"
                        value={formData.project}
                        onChange={(e) => updateForm('project', e.target.value)}
                        style={{
                            width: '100%', padding: '15px', background: BG_SECONDARY, border: `1px solid ${BORDER}`,
                            borderRadius: '8px', color: TEXT_PRIMARY, fontSize: '1rem', outline: 'none'
                        }}
                    />
                </div>

                <div>
                    <label style={{ color: TEXT_MUTED, display: 'block', marginBottom: '10px' }}>Locality / Area</label>
                    <input
                        type="text"
                        placeholder="e.g. Bopal, Satellite, SG Highway"
                        value={formData.locality}
                        onChange={(e) => updateForm('locality', e.target.value)}
                        style={{
                            width: '100%', padding: '15px', background: BG_SECONDARY, border: `1px solid ${BORDER}`,
                            borderRadius: '8px', color: TEXT_PRIMARY, fontSize: '1rem', outline: 'none'
                        }}
                    />
                </div>

                <div style={{ marginTop: '10px', padding: '15px', background: `${GOLD_ACCENT}10`, borderRadius: '8px', border: `1px dashed ${GOLD_ACCENT}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MapPin color={GOLD_ACCENT} size={20} />
                    <span style={{ color: GOLD_ACCENT, fontSize: '0.9rem' }}>We'll show this location on the map to buyers.</span>
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="step-content animate-fade-in">
            <h2 style={{ color: TEXT_PRIMARY, marginBottom: '20px' }}>Tell us about the property</h2>

            {/* BHK & Area */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                    <label style={{ color: TEXT_MUTED, display: 'block', marginBottom: '10px' }}>Bedrooms (BHK)</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {[1, 2, 3, 4, '5+'].map(num => (
                            <button
                                key={num}
                                onClick={() => updateForm('bhk', num)}
                                style={{
                                    flex: 1, padding: '10px',
                                    background: formData.bhk === num ? GOLD_ACCENT : BG_SECONDARY,
                                    color: formData.bhk === num ? BG_PRIMARY : TEXT_PRIMARY,
                                    border: `1px solid ${formData.bhk === num ? GOLD_ACCENT : BORDER}`,
                                    borderRadius: '6px', cursor: 'pointer'
                                }}
                            >{num}</button>
                        ))}
                    </div>
                </div>
                <div>
                    <label style={{ color: TEXT_MUTED, display: 'block', marginBottom: '10px' }}>Bathrooms</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {[1, 2, 3, '4+'].map(num => (
                            <button
                                key={num}
                                onClick={() => updateForm('bathrooms', num)}
                                style={{
                                    flex: 1, padding: '10px',
                                    background: formData.bathrooms === num ? GOLD_ACCENT : BG_SECONDARY,
                                    color: formData.bathrooms === num ? BG_PRIMARY : TEXT_PRIMARY,
                                    border: `1px solid ${formData.bathrooms === num ? GOLD_ACCENT : BORDER}`,
                                    borderRadius: '6px', cursor: 'pointer'
                                }}
                            >{num}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Area */}
            <div style={{ marginBottom: '20px' }}>
                <label style={{ color: TEXT_MUTED, display: 'block', marginBottom: '10px' }}>Area (Sq. Ft.)</label>
                <div style={{ display: 'flex', gap: '0' }}>
                    <input
                        type="number"
                        placeholder="Enter Area"
                        value={formData.area}
                        onChange={(e) => updateForm('area', e.target.value)}
                        style={{
                            flex: 2, padding: '15px', background: BG_SECONDARY, border: `1px solid ${BORDER}`,
                            borderRadius: '8px 0 0 8px', color: TEXT_PRIMARY, fontSize: '1rem', outline: 'none'
                        }}
                    />
                    <select
                        value={formData.areaType}
                        onChange={(e) => updateForm('areaType', e.target.value)}
                        style={{
                            flex: 1, padding: '15px', background: '#252b29', border: `1px solid ${BORDER}`,
                            borderRadius: '0 8px 8px 0', color: TEXT_PRIMARY, fontSize: '0.9rem', outline: 'none',
                            borderLeft: 'none'
                        }}
                    >
                        <option value="super_builtup">Super Built-up</option>
                        <option value="carpet">Carpet Area</option>
                    </select>
                </div>
            </div>

            {/* Furnishing */}
            <div style={{ marginBottom: '30px' }}>
                <label style={{ color: TEXT_MUTED, display: 'block', marginBottom: '10px' }}>Furnishing Status</label>
                <div style={{ display: 'flex', gap: '15px' }}>
                    {[
                        { id: 'unfurnished', label: 'Unfurnished' },
                        { id: 'semi', label: 'Semi-Furnished' },
                        { id: 'full', label: 'Fully Furnished' }
                    ].map(type => (
                        <button
                            key={type.id}
                            onClick={() => updateForm('furnishing', type.id)}
                            style={{
                                flex: 1, padding: '12px',
                                background: formData.furnishing === type.id ? `${GOLD_ACCENT}20` : BG_SECONDARY,
                                border: `1px solid ${formData.furnishing === type.id ? GOLD_ACCENT : BORDER}`,
                                borderRadius: '8px',
                                color: formData.furnishing === type.id ? GOLD_ACCENT : TEXT_PRIMARY,
                                cursor: 'pointer', fontSize: '0.9rem'
                            }}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Amenities */}
            <div>
                <label style={{ color: TEXT_MUTED, display: 'block', marginBottom: '10px' }}>Amenities</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {[
                        { id: 'lift', label: 'Lift', icon: Zap },
                        { id: 'security', label: 'Security', icon: Shield },
                        { id: 'park', label: 'Parking', icon: Car },
                        { id: 'garden', label: 'Garden', icon: Trees },
                        { id: 'gym', label: 'Gym', icon: Dumbbell },
                        { id: 'wifi', label: 'Wifi', icon: Wifi },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => toggleAmenity(item.id)}
                            style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                                padding: '15px',
                                background: formData.amenities.includes(item.id) ? SUCCESS_GREEN : BG_SECONDARY,
                                border: `1px solid ${formData.amenities.includes(item.id) ? SUCCESS_GREEN : BORDER}`,
                                borderRadius: '8px',
                                color: formData.amenities.includes(item.id) ? 'black' : TEXT_MUTED,
                                cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            <item.icon size={20} />
                            <span style={{ fontSize: '0.8rem' }}>{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="step-content animate-fade-in">
            <h2 style={{ color: TEXT_PRIMARY, marginBottom: '20px' }}>Pricing & Photos</h2>

            {/* Price */}
            <div style={{ marginBottom: '20px' }}>
                <label style={{ color: TEXT_MUTED, display: 'block', marginBottom: '10px' }}>Expected Price (₹)</label>
                <div style={{ position: 'relative' }}>
                    <IndianRupee size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: GOLD_ACCENT }} />
                    <input
                        type="number"
                        placeholder="e.g. 5000000"
                        value={formData.price}
                        onChange={(e) => updateForm('price', e.target.value)}
                        style={{
                            width: '100%', padding: '15px 15px 15px 45px', background: BG_SECONDARY, border: `1px solid ${BORDER}`,
                            borderRadius: '8px', color: SUCCESS_GREEN, fontSize: '1.2rem', fontWeight: 'bold', outline: 'none'
                        }}
                    />
                </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '20px' }}>
                <label style={{ color: TEXT_MUTED, display: 'block', marginBottom: '10px' }}>Description</label>
                <textarea
                    rows={4}
                    placeholder="Tell us more about the property..."
                    value={formData.description}
                    onChange={(e) => updateForm('description', e.target.value)}
                    style={{
                        width: '100%', padding: '15px', background: BG_SECONDARY, border: `1px solid ${BORDER}`,
                        borderRadius: '8px', color: TEXT_PRIMARY, fontSize: '1rem', outline: 'none', resize: 'none'
                    }}
                />
            </div>

            {/* Photo Upload Placeholder */}
            <div>
                <label style={{ color: TEXT_MUTED, display: 'block', marginBottom: '10px' }}>Upload Photos</label>
                <div style={{
                    border: `2px dashed ${BORDER}`, borderRadius: '12px', padding: '40px',
                    textAlign: 'center', background: `${BG_SECONDARY}80`, cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px'
                }}>
                    <div style={{ background: '#252b29', padding: '15px', borderRadius: '50%' }}>
                        <Upload size={24} color={GOLD_ACCENT} />
                    </div>
                    <div>
                        <h4 style={{ color: TEXT_PRIMARY, marginBottom: '5px' }}>Click to upload photos</h4>
                        <p style={{ color: TEXT_MUTED, fontSize: '0.9rem' }}>SVG, PNG, JPG (Max 5MB)</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const createBriefcaseIcon = () => {
        // quick helper, or import Briefcase
        return Home;
    }

    return (
        <div style={{ background: BG_PRIMARY, minHeight: '100vh', color: TEXT_PRIMARY, fontFamily: 'Outfit, sans-serif' }}>
            {/* Nav Header */}
            <div style={{ padding: '20px 40px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: TEXT_MUTED, textDecoration: 'none' }}>
                    <ArrowLeft size={20} /> Back to Home
                </Link>
                <h3 style={{ color: GOLD_ACCENT, letterSpacing: '1px' }}>POST YOUR PROPERTY</h3>
                <div style={{ width: '100px' }}></div> {/* Spacer */}
            </div>

            <div className="container" style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>

                {/* Progress Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', position: 'relative' }}>
                    {[1, 2, 3, 4].map(s => (
                        <div key={s} style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '50%',
                                background: step >= s ? (step > s ? SUCCESS_GREEN : GOLD_ACCENT) : BG_SECONDARY,
                                border: `2px solid ${step >= s ? (step > s ? SUCCESS_GREEN : GOLD_ACCENT) : BORDER}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: step >= s ? BG_PRIMARY : TEXT_MUTED, fontWeight: 'bold',
                                transition: 'all 0.3s'
                            }}>
                                {step > s ? <Check size={20} /> : s}
                            </div>
                            <span style={{ fontSize: '0.8rem', color: step >= s ? GOLD_ACCENT : TEXT_MUTED }}>
                                {['Basic', 'Location', 'Details', 'Pricing'][s - 1]}
                            </span>
                        </div>
                    ))}
                    {/* Line */}
                    <div style={{ position: 'absolute', top: '20px', left: '0', width: '100%', height: '2px', background: BORDER, zIndex: 1 }}>
                        <div style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%`, height: '100%', background: GOLD_ACCENT, transition: 'all 0.3s' }}></div>
                    </div>
                </div>

                {/* Form Card */}
                <div style={{ background: '#121816', border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '40px' }}>

                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && renderStep4()}

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '20px', borderTop: `1px solid ${BORDER}` }}>
                        <button
                            onClick={handleBack}
                            disabled={step === 1}
                            style={{
                                padding: '12px 25px', borderRadius: '8px', border: 'none',
                                background: 'transparent', color: step === 1 ? '#333' : TEXT_MUTED,
                                cursor: step === 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold'
                            }}
                        >
                            Back
                        </button>

                        <button
                            onClick={step === totalSteps ? () => alert('Property Posted Successfully! (Demo)') : handleNext}
                            style={{
                                padding: '12px 35px', borderRadius: '8px', border: 'none',
                                background: GOLD_ACCENT, color: BG_PRIMARY,
                                cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem',
                                display: 'flex', alignItems: 'center', gap: '10px',
                                boxShadow: `0 4px 15px ${GOLD_ACCENT}40`
                            }}
                        >
                            {step === totalSteps ? 'Submit Property' : 'Next Step'} <ChevronRight size={18} />
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default PostProperty;
