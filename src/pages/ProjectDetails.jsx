import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { 
    ChevronLeft, Maximize2, CheckCircle2, Navigation, MapPin, Share2, Download, TrendingUp, User, Phone, Mail, Heart,
    Trees, Flower2, Target, Car, Palmtree, Mountain, Dumbbell, PartyPopper, ShieldCheck, Camera, ParkingCircle, Award,
    ArrowUpToLine, Flame, Zap, Baby, Footprints, Gamepad2, Trophy, BadgeCheck, DoorClosed, Waves, Wine, ChefHat, 
    Bike, Lamp, GraduationCap, Flag, Bath, Mic2, Lock, WashingMachine, Repeat, UserCheck, 
    Droplets, Volleyball, Activity, Scissors, Gift, Calendar, Leaf, Tent, Users, Music, Sofa, Tv, Droplet, 
    Joystick, Coffee, Library, Store, DoorOpen, Accessibility, Home, PhoneForwarded, Trash2, Building2, Globe, BedDouble
} from 'lucide-react';
import './ProjectDetails.css';
import Logo from '../assets/logo.jpg';
import PropertySlider from '../components/PropertySlider';

const THEME = {
    dark: '#F5F5EF',
    card: '#FFFFFF',
    border: '#E5E5E5',
    text: '#2E2E2E',
    muted: '#6B6B6B',
    gold: '#5E7D5A', // Secondary green mapped to gold variable for ease
    cardText: '#2E2E2E',
    cardMuted: '#6B6B6B'
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
    { name: "Yoga Space", icon: Flower2 },
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
    { name: "Mother’s Hangout Area", icon: Users },
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

export default function ProjectDetails() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [similarProjects, setSimilarProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeConfigIndex, setActiveConfigIndex] = useState(0);
    const [activePlotIndex, setActivePlotIndex] = useState(0);
    const [activeVillaIndex, setActiveVillaIndex] = useState(0);
    const [activeImage, setActiveImage] = useState(0);
    const [activeTowerIndex, setActiveTowerIndex] = useState(0);
    const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);
    const [brochureForm, setBrochureForm] = useState({ name: '', phone: '', otp: '' });
    const [inquiryForm, setInquiryForm] = useState({ name: '', phone: '', email: '', agreed: true });
    const [submitted, setSubmitted] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [brochureStep, setBrochureStep] = useState(1);
    const [showAllAmenities, setShowAllAmenities] = useState(false);
    const [pageBgColor, setPageBgColor] = useState(THEME.dark);
    const amenitiesRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setPageBgColor('#E9F0E8'); // Very soft natural green highlight
                    } else {
                        setPageBgColor(THEME.dark);
                    }
                });
            },
            { threshold: 0.25 }
        );
        if (amenitiesRef.current) {
            observer.observe(amenitiesRef.current);
        }
        return () => observer.disconnect();
    }, [loading, project, showAllAmenities]);

    useEffect(() => {
        const fetchProject = async () => {
            window.scrollTo(0, 0); // Scroll to top when loading a new project
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', id)
                .single();

            if (data && !error) {
                setProject(data);
                
                // Fetch similar projects
                const { data: similarData, error: similarError } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('city', data.city)
                    .neq('id', id)
                    .limit(5);
                    
                if (similarData && !similarError) {
                    const formattedSimilar = similarData.map(p => ({
                        id: p.id,
                        name: p.name,
                        image: p.images?.[0]?.url || p.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
                        tag: p.construction_status || 'Under Construction',
                        bhk: p.configurations && p.configurations.length > 0 
                            ? `${Math.min(...p.configurations.map(c => c.bedrooms))} & ${Math.max(...p.configurations.map(c => c.bedrooms))} BHK`
                            : 'Premium',
                        type: p.property_type?.toUpperCase(),
                        location: `${p.locality}, ${p.city}`,
                        price: p.configurations?.[0]?.price || 'Price on Request',
                        area: p.total_plot_area ? `${p.total_plot_area} Sq.ft` : 'N/A'
                    }));
                    setSimilarProjects(formattedSimilar);
                }
            }
            setLoading(false);
        };
        fetchProject();
    }, [id]);

    const handleInquiry = async (e) => {
        e.preventDefault();
        if (!inquiryForm.name || !inquiryForm.phone) return;
        
        try {
            await supabase.from('leads').insert([{
                project_id: project.id,
                name: inquiryForm.name,
                phone: `+91 ${inquiryForm.phone}`,
                email: inquiryForm.email,
                type: 'inquiry',
                message: `Interested in ${project.name}`
            }]);
            setSubmitted(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleBrochureDownload = async (e) => {
        e.preventDefault();
        if (!brochureForm.name || !brochureForm.phone) {
            alert("Please fill all fields");
            return;
        }
        if (brochureForm.phone.length !== 10) {
            alert("Please enter a valid 10-digit mobile number");
            return;
        }

        setVerifying(true);
        
        try {
            if (!project?.id) throw new Error("Project ID is missing");

            // Save as lead
            const { data, error } = await supabase
                .from('leads')
                .insert([{
                    project_id: project.id,
                    name: brochureForm.name,
                    phone: `+91 ${brochureForm.phone}`,
                    type: 'brochure',
                    message: `Downloaded brochure for ${project.name}`
                }]);

            if (error) {
                console.error("Supabase Insert Error:", error.message, error.details);
                throw error;
            }

            // Trigger download
            setVerifying(false);
            setIsBrochureModalOpen(false);
            if (project.brochure_url) {
                window.open(project.brochure_url, '_blank');
            } else {
                alert("Brochure URL not found for this project.");
            }
            // Reset
            setBrochureForm({ name: '', phone: '', otp: '' });
        } catch (error) {
            console.error("Full Error Context:", error);
            alert(`Something went wrong: ${error.message || 'Unknown Error'}`);
            setVerifying(false);
        }
    };

    // Slideshow logic
    useEffect(() => {
        if (!project?.images || project.images.length <= 1) return;
        
        const interval = setInterval(() => {
            setActiveImage((prev) => (prev + 1) % project.images.length);
        }, 4000); // 4 seconds per slide

        return () => clearInterval(interval);
    }, [project?.images]);

    if (loading) return <div style={{ padding: '100px', textAlign: 'center', color: THEME.gold, fontFamily: 'Outfit, sans-serif' }}>Loading Premium Project...</div>;
    if (!project) return <div style={{ padding: '100px', textAlign: 'center', color: THEME.text, fontFamily: 'Outfit, sans-serif' }}>Project not found.</div>;

    const allConfigs = [
        ...(project.configurations || []).map(c => ({ ...c, isPenthouse: false })),
        ...(project.penthouse_configurations || []).map(p => ({ ...p, isPenthouse: true }))
    ];
    const activeConfig = allConfigs[activeConfigIndex];

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: project.name,
                url: window.location.href
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    let fullBhkString = "";
    if (project.configurations && project.configurations.length > 0) {
        const uniqueBhk = [...new Set(project.configurations.map(c => c.bedrooms))].sort();
        fullBhkString = uniqueBhk.length > 1 
            ? `${uniqueBhk[0]} & ${uniqueBhk[uniqueBhk.length-1]} BHK`
            : `${uniqueBhk[0]} BHK`;
    }

    const mainImage = project.images?.[0]?.url || project.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1920&q=80';

    return (
        <div style={{ background: pageBgColor, transition: 'background 0.8s ease-in-out', color: THEME.text, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
            <style>{`
                @keyframes brochure-pulse {
                    0% { box-shadow: 0 0 0 0 rgba(94, 125, 90, 0.6); }
                    70% { box-shadow: 0 0 0 10px rgba(94, 125, 90, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(94, 125, 90, 0); }
                }
                @keyframes brochure-shine {
                    0% { transform: translateX(-200%) skewX(-30deg); }
                    20% { transform: translateX(200%) skewX(-30deg); }
                    100% { transform: translateX(200%) skewX(-30deg); }
                }
                .brochure-btn-premium {
                    animation: brochure-pulse 2s infinite;
                    position: relative;
                    overflow: hidden;
                }
                .brochure-btn-premium::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 50%;
                    height: 100%;
                    background: linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent);
                    animation: brochure-shine 4s infinite;
                }
                .amenity-card {
                    transition: all 0.3s ease;
                    padding: 8px;
                    margin: -8px;
                    border-radius: 12px;
                    cursor: default;
                }
                .amenity-card:hover {
                    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
                    background: #FFFFFF;
                }
                .amenity-icon-box {
                    transition: all 0.3s ease;
                }
                .amenity-card:hover .amenity-icon-box {
                    border-color: #5E7D5A !important;
                    background: #5E7D5A !important;
                    transform: scale(1.05);
                }
                .amenity-card:hover .amenity-icon-box svg {
                    stroke: #FFFFFF !important;
                    color: #FFFFFF !important;
                }
                .shortlist-btn {
                    transition: all 0.3s ease;
                }
                .shortlist-btn:hover {
                    background: #5E7D5A !important;
                    color: #FFFFFF !important;
                    transform: scale(1.1);
                }
            `}</style>
            
            {/* HERO SECTION INJECTED HERE */}
            <header className="lux-hero" style={{ marginBottom: '50px' }}>
                {project.images?.length > 0 ? project.images.map((img, i) => (
                    <img 
                        key={i} 
                        src={typeof img === 'string' ? img : (img?.url || '')} 
                        className="lux-hero-bg" 
                        alt={project.name} 
                        style={{ 
                            opacity: i === activeImage ? 1 : 0, 
                            transition: 'opacity 1.5s ease-in-out', 
                            zIndex: 0,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1920&q=80'; }}
                    />
                )) : (
                    <img src={mainImage} className="lux-hero-bg" alt={project.name} style={{ zIndex: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
                <div className="lux-hero-overlay" style={{ zIndex: 1 }}></div>
                <div className="lux-hero-content" style={{ zIndex: 2 }}>
                    <div className="lux-hero-tagline">{project.construction_status || 'Ready To Move In'}</div>
                    <h1 className="lux-heading-primary">{project.name}</h1>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-start', marginTop: '15px' }}>
                        <div className="lux-hero-details" style={{ margin: 0 }}>
                            <span className="detail-item">
                                <BedDouble size={18} /> 
                                {project.configurations?.[0]?.bedrooms ? `${project.configurations[0].bedrooms} BHK ${project.tagline || 'Signature Homes'}` : (project.tagline || 'Premium Residences')}
                            </span>
                            <span className="detail-item">
                                <MapPin size={18} /> 
                                {project.locality} {project.city}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                            {project.brochure_url && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <button 
                                        onClick={() => setIsBrochureModalOpen(true)}
                                        className="brochure-btn-premium"
                                        style={{ 
                                            background: THEME.gold, 
                                            color: '#FFF', 
                                            border: 'none', 
                                            padding: '12px 30px', 
                                            borderRadius: '50px', 
                                            fontWeight: '600', 
                                            cursor: 'pointer', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '8px', 
                                            transition: 'all 0.3s ease',
                                            fontSize: '0.95rem',
                                            letterSpacing: '1px'
                                        }}
                                    >
                                        <Download size={18} /> GET BROCHURE
                                    </button>
                                    {project.rera_id && (
                                        <div style={{ 
                                            display: 'inline-flex', 
                                            alignItems: 'center', 
                                            gap: '6px', 
                                            background: 'rgba(255,255,255,0.1)', 
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            padding: '6px 14px',
                                            borderRadius: '6px',
                                            color: '#FFF',
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            letterSpacing: '0.5px',
                                            marginTop: '5px'
                                        }}>
                                            <BadgeCheck size={16} style={{ color: '#4ADE80' }} />
                                            RERA - {project.rera_id}
                                        </div>
                                    )}
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button 
                                    onClick={handleShare}
                                    style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', color: '#FFF', padding: '12px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}
                                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                                >
                                    <Share2 size={20} />
                                </button>
                                <button 
                                    style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', color: '#FFF', padding: '12px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}
                                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                                >
                                    <Heart size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(245, 245, 239, 0.95)', backdropFilter: 'blur(10px)', borderTop: `1px solid ${THEME.border}`, zIndex: 10, display: 'flex', justifyContent: 'center', gap: '40px', padding: '15px 0' }}>
                    {(project.property_type === 'Plots' ? ['Overview', 'Floor Plan', 'Phases', 'Amenities', 'Location'] : ['Overview', 'Floor Plan', 'Towers', 'Amenities', 'Location']).map(sec => (
                        <button 
                            key={sec}
                            onClick={() => {
                                const id = sec.toLowerCase().replace(' ', '-');
                                const el = document.getElementById(id);
                                if (el) window.scrollTo({ top: el.offsetTop - 120, behavior: 'smooth' });
                            }}
                            style={{ background: 'none', border: 'none', color: THEME.text, fontWeight: '500', fontSize: '0.9rem', cursor: 'pointer', letterSpacing: '1px', textTransform: 'uppercase', transition: 'all 0.3s' }}
                            onMouseOver={(e) => e.currentTarget.style.color = THEME.gold}
                            onMouseOut={(e) => e.currentTarget.style.color = THEME.text}
                        >
                            {sec}
                        </button>
                    ))}
                </div>
            </header>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: THEME.muted, textDecoration: 'none', marginBottom: '20px', fontSize: '0.9rem' }}>
                    <ChevronLeft size={16} /> Back to Search
                </Link>

                <div style={{ display: 'grid', gridTemplateColumns: project.property_type === 'Plots' ? '1.8fr 1fr' : '1.5fr 1fr', gap: '50px', alignItems: 'start', marginBottom: '80px' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
                        {project.property_type === 'Plots' ? (
                            <>
                                <section id="floor-plan">
                                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', color: THEME.text, marginBottom: '30px', fontWeight: '600' }}>TYPES OF PLOTS</h2>
                                    
                                    <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '10px' }}>
                                        {project.plot_config?.map((plot, idx) => (
                                            <button 
                                                key={idx}
                                                onClick={() => setActivePlotIndex(idx)}
                                                style={{
                                                    padding: '10px 25px', background: activePlotIndex === idx ? `${THEME.gold}15` : 'transparent',
                                                    color: activePlotIndex === idx ? THEME.gold : THEME.muted,
                                                    border: `1px solid ${activePlotIndex === idx ? THEME.gold : THEME.border}`,
                                                    borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s'
                                                }}
                                            >
                                                {plot.size_sqft} Sq.ft
                                            </button>
                                        ))}
                                    </div>

                                    {project.plot_config?.[activePlotIndex] && (
                                        <div style={{ background: THEME.card, padding: '40px', borderRadius: '24px', border: `1px solid ${THEME.border}`, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', alignItems: 'center' }}>
                                            <div style={{ background: '#F8F8F8', borderRadius: '16px', overflow: 'hidden', height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${THEME.border}` }}>
                                                {project.plot_config[activePlotIndex].map_url ? (
                                                    <img src={project.plot_config[activePlotIndex].map_url} alt="Plot Plan" style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
                                                ) : (
                                                    <div style={{ color: THEME.muted }}>No Map Uploaded</div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '2rem', margin: '0 0 10px 0', color: THEME.text }}>{project.plot_config[activePlotIndex].size_sqft} sq.ft Premium Plot</h3>
                                                <div style={{ color: THEME.gold, fontSize: '1.8rem', fontWeight: '800', marginBottom: '25px' }}>₹{project.plot_config[activePlotIndex].price_per_sqft} <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>per sq.ft</span></div>
                                                <div style={{ display: 'grid', gap: '15px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${THEME.border}`, paddingBottom: '10px' }}>
                                                        <span style={{ color: THEME.muted }}>SUPER BUILT UP AREA</span>
                                                        <span style={{ fontWeight: 'bold' }}>{project.plot_config[activePlotIndex].sba_percent}%</span>
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <span style={{ color: THEME.muted }}>CONSTRUCTION AREA</span>
                                                        <span style={{ fontWeight: 'bold' }}>{project.plot_config[activePlotIndex].construction_percent}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </section>

                                {project.villa_config && project.villa_config.length > 0 && (
                                    <section id="villas">
                                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', color: THEME.text, marginBottom: '30px', fontWeight: '600' }}>TYPES OF VILLA</h2>
                                        <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '10px' }}>
                                            {project.villa_config.map((villa, idx) => (
                                                <button 
                                                    key={idx}
                                                    onClick={() => setActiveVillaIndex(idx)}
                                                    style={{
                                                        padding: '10px 25px', background: activeVillaIndex === idx ? `${THEME.gold}15` : 'transparent',
                                                        color: activeVillaIndex === idx ? THEME.gold : THEME.muted,
                                                        border: `1px solid ${activeVillaIndex === idx ? THEME.gold : THEME.border}`,
                                                        borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {villa.bhk_type}
                                                </button>
                                            ))}
                                        </div>
                                        {project.villa_config[activeVillaIndex] && (
                                            <div style={{ background: THEME.card, padding: '40px', borderRadius: '24px', border: `1px solid ${THEME.border}`, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', alignItems: 'center' }}>
                                                <div style={{ background: '#F8F8F8', borderRadius: '16px', overflow: 'hidden', height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${THEME.border}` }}>
                                                    {project.villa_config[activeVillaIndex].map_url ? (
                                                        <img src={project.villa_config[activeVillaIndex].map_url} alt="Villa Plan" style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
                                                    ) : (
                                                        <div style={{ color: THEME.muted }}>No Map Uploaded</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 style={{ fontSize: '2rem', margin: '0 0 10px 0', color: THEME.text }}>Premium {project.villa_config[activeVillaIndex].bhk_type} Villa</h3>
                                                    <div style={{ color: THEME.gold, fontSize: '2.2rem', fontWeight: '800', marginBottom: '10px' }}>{project.villa_config[activeVillaIndex].price}</div>
                                                    <p style={{ color: THEME.muted, fontSize: '1.1rem', marginBottom: '25px' }}>Built-up Area: {project.villa_config[activeVillaIndex].built_up} Sq.ft</p>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                        <div style={{ background: THEME.dark, padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                                                            <div style={{ color: THEME.muted, fontSize: '0.7rem' }}>BEDROOMS</div>
                                                            <div style={{ fontWeight: 'bold' }}>{project.villa_config[activeVillaIndex].bedrooms}</div>
                                                        </div>
                                                        <div style={{ background: THEME.dark, padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                                                            <div style={{ color: THEME.muted, fontSize: '0.7rem' }}>BATHROOMS</div>
                                                            <div style={{ fontWeight: 'bold' }}>{project.villa_config[activeVillaIndex].bathrooms || 3}</div>
                                                        </div>
                                                        <div style={{ background: THEME.dark, padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                                                            <div style={{ color: THEME.muted, fontSize: '0.7rem' }}>BALCONIES</div>
                                                            <div style={{ fontWeight: 'bold' }}>{project.villa_config[activeVillaIndex].balconies || 1}</div>
                                                        </div>
                                                        <div style={{ background: THEME.dark, padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                                                            <div style={{ color: THEME.muted, fontSize: '0.7rem' }}>FLOORS</div>
                                                            <div style={{ fontWeight: 'bold' }}>{project.villa_config[activeVillaIndex].floors || 'G+1'}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </section>
                                )}
                            </>
                        ) : (
                            <section id="floor-plan">
                                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: THEME.text, marginBottom: '25px', fontWeight: '500', letterSpacing: '1px' }}>Floor Plan</h2>
                                <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '10px', borderBottom: `1px solid ${THEME.border}` }}>
                                    {allConfigs.map((config, idx) => (
                                        <button key={idx} onClick={() => setActiveConfigIndex(idx)} style={{ padding: '12px 30px', background: activeConfigIndex === idx ? (config.isPenthouse ? `linear-gradient(90deg, ${THEME.gold}30, transparent)` : `${THEME.gold}15`) : 'transparent', color: activeConfigIndex === idx ? THEME.gold : THEME.muted, border: `1px solid ${activeConfigIndex === idx ? THEME.gold : 'transparent'}`, borderBottom: activeConfigIndex === idx ? `2px solid ${THEME.gold}` : 'none', borderRadius: '8px 8px 0 0', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
                                            {config.bedrooms} BHK {config.isPenthouse && 'Penthouse'}
                                        </button>
                                    ))}
                                </div>
                                {activeConfig && (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px', background: THEME.card, padding: '30px', borderRadius: '24px', border: `1px solid ${THEME.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                                        <div>
                                            <div style={{ marginBottom: '30px' }}>
                                                <h3 style={{ fontSize: '1.8rem', margin: '0 0 5px 0', color: activeConfig.isPenthouse ? THEME.gold : THEME.cardText }}>{activeConfig.bedrooms} BHK {activeConfig.isPenthouse ? 'Luxury Penthouse' : 'Premium Flat'}</h3>
                                                <p style={{ color: THEME.cardMuted, fontSize: '1.1rem', margin: 0 }}>{activeConfig.area} Sq.ft • {activeConfig.isPenthouse ? `Floor ${activeConfig.floor_number}` : 'Carpet Area'}</p>
                                                <div style={{ color: activeConfig.isPenthouse ? THEME.cardText : THEME.gold, fontSize: '1.6rem', fontWeight: 'bold', marginTop: '10px' }}>{activeConfig.price}</div>
                                            </div>
                                            {!activeConfig.isPenthouse && (
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                                    {[
                                                        { label: 'General Toilet', key: 'general_toilet' },
                                                        { label: 'Personal Toilet', key: 'personal_toilet' },
                                                        { label: 'Master Bedroom', key: 'master_bedroom' },
                                                        { label: 'Children\'s Room', key: 'children_room' },
                                                        { label: 'Study Room', key: 'study_room' },
                                                        { label: 'Store Room', key: 'store_room' },
                                                        { label: 'Washyard', key: 'washyard' },
                                                        { label: 'Servant Room', key: 'servant_room' },
                                                        { label: 'Dressing Room', key: 'dressing_room' },
                                                        { label: 'Vestibule', key: 'vestibule' },
                                                        { label: 'Balcony', key: 'balcony' },
                                                        { label: 'Balcony', key: 'sky_patio_balcony' },
                                                        { label: 'Pooja Room', key: 'pooja_room' },
                                                        { label: 'Personal Foyer', key: 'foyer' },
                                                        { label: 'Drawing/Living', key: 'drawing_living_dining' },
                                                        { label: 'Car Parking', key: 'car_parking' },
                                                        { label: 'Floor', key: 'floor_number' }
                                                    ].filter(item => {
                                                        const val = activeConfig[item.key];
                                                        return val && val !== '0' && val !== 0;
                                                    }).map((item, i) => (
                                                        <div key={i} style={{ background: '#FFFFFF', padding: '15px', borderRadius: '12px', border: `1px solid ${THEME.border}`, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                                                            <div style={{ color: THEME.muted, fontSize: '0.75rem', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
                                                            <div style={{ fontWeight: '600', fontSize: '1rem', color: THEME.text }}>{activeConfig[item.key]}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ background: THEME.card, borderRadius: '12px', border: `1px solid ${THEME.border}`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ padding: '12px 20px', background: THEME.dark, borderBottom: `1px solid ${THEME.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.9rem', color: THEME.gold, fontWeight: 'bold' }}>{activeConfig.isPenthouse ? 'PENTHOUSE' : `${activeConfig.bedrooms} BHK`} LAYOUT MAP</span>
                                                {activeConfig.map_url && <button onClick={() => window.open(activeConfig.map_url, '_blank')} style={{ background: 'none', border: 'none', color: THEME.gold, cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '500' }}><Maximize2 size={14} /> Fullscreen</button>}
                                            </div>
                                            <div style={{ flex: 1, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{activeConfig.map_url ? <img src={activeConfig.map_url} alt="Layout" style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} /> : <div style={{ color: THEME.cardMuted }}>No Layout Map Uploaded</div>}</div>
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}
                        {project.towers && project.towers.length > 0 && (
                            <section id="towers" style={{ marginTop: '40px' }}>
                                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', color: THEME.text, marginBottom: '30px', fontWeight: '600' }}>TOWER DETAILS</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
                                    {project.towers.map((tower, idx) => (
                                        <div key={idx} style={{ background: THEME.card, padding: '30px', borderRadius: '20px', border: `1px solid ${THEME.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: `1px solid ${THEME.border}50`, paddingBottom: '12px' }}>
                                                <h4 style={{ margin: 0, color: THEME.gold, fontSize: '1.2rem', fontWeight: '800' }}>Tower {tower.type || (idx + 1)}</h4>
                                                <span style={{ background: `${THEME.gold}15`, color: THEME.gold, padding: '6px 15px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>{tower.bhk} BHK</span>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                                <div style={{ background: '#FAFAFA', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                                                    <div style={{ color: THEME.muted, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' }}>FLOORS</div>
                                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: THEME.text }}>{tower.story}</div>
                                                </div>
                                                <div style={{ background: '#FAFAFA', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                                                    <div style={{ color: THEME.muted, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' }}>UNITS/FLOOR</div>
                                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: THEME.text }}>{tower.units_per_floor}</div>
                                                </div>
                                                <div style={{ background: '#FAFAFA', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                                                    <div style={{ color: THEME.muted, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' }}>LIFTS/FLOOR</div>
                                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: THEME.text }}>{tower.lift_per_floor}</div>
                                                </div>
                                                <div style={{ background: '#FAFAFA', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                                                    <div style={{ color: THEME.muted, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' }}>TOTAL UNITS</div>
                                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: THEME.text }}>{tower.total_units}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        <section id="amenities" ref={amenitiesRef}>
                            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: THEME.text, marginBottom: '25px', fontWeight: '500', letterSpacing: '1px' }}>AMENITIES</h2>
                            <div style={{ background: THEME.card, padding: '35px', borderRadius: '16px', border: `1px solid ${THEME.border}`, color: THEME.text, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '25px 20px' }}>
                                    {(showAllAmenities ? project.amenities : project.amenities?.slice(0, 8))?.map((am, i) => {
                                        const amenityData = ALL_AMENITIES.find(a => a.name === am);
                                        const IconComponent = amenityData ? amenityData.icon : CheckCircle2;
                                        return (
                                            <div key={i} className="amenity-card" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <div className="amenity-icon-box" style={{ minWidth: '50px', width: '50px', height: '50px', borderRadius: '14px', border: `1px solid ${THEME.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA' }}>
                                                    <IconComponent size={24} color={THEME.gold} strokeWidth={1.5} />
                                                </div>
                                                <div style={{ fontSize: '1rem', fontWeight: '600', lineHeight: '1.2', color: THEME.text }}>{am}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {project.amenities?.length > 8 && (
                                    <div style={{ marginTop: '25px', paddingTop: '20px' }}>
                                        <button onClick={() => setShowAllAmenities(!showAllAmenities)} style={{ background: 'none', border: 'none', color: '#1A1A1A', fontWeight: '700', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontSize: '0.95rem' }}>{showAllAmenities ? 'Show less' : 'Show more'}</button>
                                    </div>
                                )}
                            </div>
                        </section>

                        {project.google_map_link && (
                            <section id="location">
                                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: THEME.text, marginBottom: '25px', fontWeight: '500', letterSpacing: '1px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    Project Location
                                    <a href={project.google_map_link} target="_blank" rel="noreferrer" style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: `${THEME.gold}15`, color: THEME.gold, borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
                                        <Navigation size={16} /> Open in Google Maps
                                    </a>
                                </h2>
                                <div style={{ width: '100%', height: '450px', borderRadius: '16px', overflow: 'hidden', border: `1px solid ${THEME.border}`, background: THEME.card, position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                                    <iframe src={`https://maps.google.com/maps?q=${encodeURIComponent(`${project.name} ${project.locality} ${project.city}`)}&output=embed`} style={{ width: '100%', height: '100%', border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Project Location"></iframe>
                                </div>
                            </section>
                        )}
                    </div>

                    <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        <div id="overview" style={{ background: THEME.card, padding: '30px', borderRadius: '24px', border: `1px solid ${THEME.border}`, color: THEME.text, boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
                            <h3 style={{ marginTop: 0, marginBottom: '25px', fontSize: '1.2rem', color: THEME.gold, borderBottom: `1px solid ${THEME.border}`, paddingBottom: '15px' }}>OVERVIEW</h3>
                            <div style={{ display: 'grid', gap: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: THEME.muted }}>Property Type</span><span style={{ fontWeight: 'bold' }}>{project.property_type}</span></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: THEME.muted }}>Status</span><span style={{ fontWeight: 'bold' }}>{project.construction_status}</span></div>
                                {project.property_type === 'Plots' && (
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: THEME.muted }}>Total Plot Area</span><span style={{ fontWeight: 'bold' }}>{project.total_plot_area} Sq.ft</span></div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: THEME.muted }}>Total Plots</span><span style={{ fontWeight: 'bold' }}>{project.total_plots}</span></div>
                                    </>
                                )}
                                {project.property_type !== 'Plots' && project.total_units && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: THEME.muted }}>Total Units</span><span style={{ fontWeight: 'bold' }}>{project.total_units}</span></div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: THEME.muted }}>Price Range</span><span style={{ fontWeight: 'bold', color: THEME.gold }}>₹{project.min_price} - ₹{project.max_price}</span></div>
                            </div>
                        </div>

                        {project.property_type === 'Plots' && project.phases?.length > 0 && (
                            <div id="phases" style={{ background: THEME.card, padding: '30px', borderRadius: '24px', border: `1px solid ${THEME.border}`, color: THEME.text, boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
                                <h3 style={{ marginTop: 0, marginBottom: '25px', fontSize: '1.2rem', color: THEME.gold, borderBottom: `1px solid ${THEME.border}`, paddingBottom: '15px' }}>TOTAL PHASES</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                    {project.phases.map((phase, pIdx) => (
                                        <div key={pIdx} style={{ borderBottom: pIdx < project.phases.length - 1 ? `1px dashed ${THEME.border}` : 'none', paddingBottom: '20px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                                <span style={{ fontWeight: '800', color: THEME.text, textTransform: 'uppercase' }}>{phase.name}</span>
                                                <span style={{ color: THEME.gold, fontWeight: 'bold' }}>{phase.total_units} UNITS</span>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '10px' }}>
                                                {phase.plot_distributions?.map((dist, dIdx) => (
                                                    <div key={dIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                                        <span style={{ color: THEME.muted }}>• {dist.count} Plots</span>
                                                        <span style={{ fontWeight: '600' }}>{dist.size} Sq.ft</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div style={{ background: THEME.card, borderRadius: '16px', border: `1px solid ${THEME.border}`, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                            <div style={{ background: `${THEME.gold}15`, color: THEME.gold, padding: '10px', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><TrendingUp size={16} /> Most viewed project in this area</div>
                            <div style={{ padding: '30px' }}>
                                <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                                    <div style={{ width: '60px', height: '60px', background: THEME.dark, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: `1px solid ${THEME.border}` }}><img src={Logo} alt="Nest Deal Logo" style={{ width: '80%', height: '80%', objectFit: 'contain' }} /></div>
                                    <div><div style={{ color: THEME.cardMuted, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Contact Seller</div><div style={{ color: THEME.cardText, fontSize: '1.2rem', fontWeight: 'bold', margin: '2px 0' }}>NEST DEAL REALTY</div><div style={{ color: THEME.gold, fontSize: '0.9rem', fontWeight: '600' }}>+91 84696 30555</div></div>
                                </div>
                                {submitted ? <div style={{ textAlign: 'center', padding: '20px 0' }}><div style={{ width: '60px', height: '60px', background: `${THEME.gold}20`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}><CheckCircle2 color={THEME.gold} size={30} /></div><h3 style={{ margin: '0 0 5px 0', color: THEME.gold }}>Request Sent!</h3><p style={{ margin: 0, fontSize: '0.9rem', color: THEME.cardMuted }}>Our team will contact you shortly.</p><button onClick={() => setSubmitted(false)} style={{ background: 'none', border: 'none', color: THEME.gold, fontSize: '0.8rem', marginTop: '15px', cursor: 'pointer', textDecoration: 'underline' }}>Send another request</button></div> : 
                                <form onSubmit={handleInquiry} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}><div style={{ position: 'relative' }}><User size={18} style={{ position: 'absolute', left: '15px', top: '15.5px', color: THEME.muted }} /><input required placeholder="Name" value={inquiryForm.name} onChange={(e) => setInquiryForm({...inquiryForm, name: e.target.value})} style={{ width: '100%', padding: '15px 15px 15px 45px', background: THEME.dark, border: `1px solid ${THEME.border}`, borderRadius: '12px', color: THEME.text, outline: 'none', fontSize: '0.95rem' }} /></div><div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}><Phone size={18} style={{ position: 'absolute', left: '15px', color: THEME.muted }} /><span style={{ position: 'absolute', left: '45px', color: THEME.muted, fontWeight: 'bold' }}>+91</span><input required type="tel" maxLength={10} placeholder="Mobile Number" value={inquiryForm.phone} onChange={(e) => setInquiryForm({...inquiryForm, phone: e.target.value.replace(/\D/g,'')})} style={{ width: '100%', padding: '15px 15px 15px 85px', background: THEME.dark, border: `1px solid ${THEME.border}`, borderRadius: '12px', color: THEME.text, outline: 'none', fontSize: '0.95rem' }} /></div><div style={{ position: 'relative' }}><Mail size={18} style={{ position: 'absolute', left: '15px', top: '15.5px', color: THEME.muted }} /><input type="email" placeholder="Email Address" value={inquiryForm.email} onChange={(e) => setInquiryForm({...inquiryForm, email: e.target.value})} style={{ width: '100%', padding: '15px 15px 15px 45px', background: THEME.dark, border: `1px solid ${THEME.border}`, borderRadius: '12px', color: THEME.text, outline: 'none', fontSize: '0.95rem' }} /></div><div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}><input type="checkbox" checked={inquiryForm.agreed} onChange={(e) => setInquiryForm({...inquiryForm, agreed: e.target.checked})} style={{ marginTop: '3px', cursor: 'pointer', accentColor: THEME.gold }} /><label style={{ fontSize: '0.75rem', color: THEME.cardMuted, lineHeight: '1.4' }}>I agree to be contacted by Nest Deal agents via phone or email regarding this property.</label></div><button type="submit" style={{ width: '100%', padding: '16px', background: THEME.gold, border: 'none', borderRadius: '12px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '5px', transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(94, 125, 90, 0.2)' }} onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.1)'} onMouseOut={(e) => e.currentTarget.style.filter = 'brightness(1)'}>Get Contact Details</button></form>}
                            </div>
                        </div>

                        {project.landmarks?.length > 0 && (
                            <div style={{ background: THEME.card, padding: '25px', borderRadius: '16px', border: `1px solid ${THEME.border}`, color: THEME.text, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                                <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin color={THEME.gold} size={18} /> Nearby Landmarks</h3>
                                <div style={{ display: 'grid', gap: '20px', maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' }}>
                                    {project.landmarks.map((lm, i) => (
                                        <div key={i}><div style={{ color: THEME.gold, fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={14} /> {lm.title}</div><div style={{ display: 'grid', gap: '6px', paddingLeft: '10px', borderLeft: `2px solid ${THEME.gold}30` }}>{lm.items?.map((item, idx) => (<div key={idx} style={{ color: THEME.cardMuted, fontSize: '0.85rem', display: 'flex', gap: '8px' }}><span style={{ color: THEME.gold }}>•</span> {item}</div>))}</div></div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {similarProjects.length > 0 && <div style={{ marginTop: '20px', marginBottom: '80px' }}><PropertySlider title="Similar Projects in Area" properties={similarProjects} baseRoute="/project" /></div>}
                <div style={{ height: '100px' }}></div>
            </div>

            {isBrochureModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(5px)' }}>
                    <div style={{ background: THEME.card, width: '100%', maxWidth: '450px', borderRadius: '16px', border: `1px solid ${THEME.border}`, padding: '40px', position: 'relative', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', color: THEME.text }}>
                        <button onClick={() => setIsBrochureModalOpen(false)} style={{ position: 'absolute', top: '25px', right: '25px', background: 'none', border: 'none', color: THEME.muted, cursor: 'pointer' }}>✕</button>
                        <div style={{ textAlign: 'center', marginBottom: '35px' }}><div style={{ width: '70px', height: '70px', background: `${THEME.gold}15`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: `1px solid ${THEME.gold}30` }}><Download color={THEME.gold} size={30} /></div><h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', margin: '0 0 10px 0', color: THEME.text, fontWeight: '500' }}>Project Brochure</h2><p style={{ color: THEME.muted, fontSize: '0.95rem', margin: 0 }}>Enter your details to instantly download the premium project brochure.</p></div>
                        <form onSubmit={handleBrochureDownload} style={{ display: 'grid', gap: '20px' }}>
                            <div style={{ position: 'relative' }}><User size={18} style={{ position: 'absolute', left: '15px', top: '15.5px', color: THEME.muted }} /><input required placeholder="Full Name" value={brochureForm.name} onChange={(e) => setBrochureForm({...brochureForm, name: e.target.value})} style={{ width: '100%', padding: '15px 15px 15px 45px', background: THEME.dark, border: `1px solid ${THEME.border}`, borderRadius: '12px', color: THEME.text, outline: 'none' }} /></div>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}><Phone size={18} style={{ position: 'absolute', left: '15px', color: THEME.muted }} /><span style={{ position: 'absolute', left: '45px', color: THEME.gold, fontWeight: 'bold' }}>+91</span><input required type="tel" maxLength={10} placeholder="Enter 10-digit Mobile" value={brochureForm.phone} onChange={(e) => setBrochureForm({...brochureForm, phone: e.target.value.replace(/\D/g,'')})} style={{ width: '100%', padding: '15px 15px 15px 85px', background: THEME.dark, border: `1px solid ${THEME.border}`, borderRadius: '12px', color: THEME.text, outline: 'none', fontSize: '1.1rem' }} /></div>
                            <button type="submit" disabled={verifying} style={{ width: '100%', padding: '16px', background: THEME.gold, color: '#FFFFFF', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '10px', transition: 'all 0.2s', opacity: verifying ? 0.7 : 1, boxShadow: '0 4px 15px rgba(94, 125, 90, 0.2)' }} onMouseOver={(e) => !verifying && (e.currentTarget.style.filter = 'brightness(1.1)')} onMouseOut={(e) => !verifying && (e.currentTarget.style.filter = 'brightness(1)')}>{verifying ? "Processing..." : "DOWNLOAD NOW"}</button>
                        </form>
                        
                        <p style={{ textAlign: 'center', color: THEME.muted, fontSize: '0.75rem', marginTop: '25px', lineHeight: '1.5' }}>
                            Securely verified by Nest Deal Auth. Your privacy is our priority.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
