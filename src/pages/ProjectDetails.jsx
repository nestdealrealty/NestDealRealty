import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { 
    ChevronLeft, ChevronRight, Maximize2, CheckCircle2, Navigation, MapPin, Share2, Download, TrendingUp, User, Phone, Mail, Heart, Eye,
    Trees, Flower2, Target, Car, Palmtree, Mountain, Dumbbell, PartyPopper, ShieldCheck, Camera, ParkingCircle, Award,
    ArrowUpToLine, Flame, Zap, Baby, Footprints, Gamepad2, Trophy, BadgeCheck, DoorClosed, Waves, Wine, ChefHat, 
    Bike, Lamp, GraduationCap, Flag, Bath, Mic2, Lock, WashingMachine, Repeat, UserCheck, 
    Droplets, Volleyball, Activity, Scissors, Gift, Calendar, Leaf, Tent, Users, Music, Sofa, Tv, Droplet, 
    Joystick, Coffee, Library, Store, DoorOpen, Accessibility, Home, PhoneForwarded, Trash2, Building2, Globe, BedDouble, Video, BookOpen, Toilet, Fence
} from 'lucide-react';
import './ProjectDetails.css';
import FooterFilters from '../components/FooterFilters';
import Logo from '../assets/logo.jpg';
import PropertySlider from '../components/PropertySlider';
import NearbyMap from '../components/NearbyMap';
import { useAuth } from '../context/AuthContext';

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

const getAmenityImage = (name) => {
    // Convert to lowercase for more robust matching
    const key = (name || '').trim().toLowerCase();

    // Map common amenity types to highly reliable Unsplash image IDs
    // These IDs have been verified to exist and represent luxury real estate well.
    const imageMap = {
        pool: '1576013551627-0cc20b96c2a7',
        swim: '1573849187310-74aa0c9d691e',
        gym: '1534438327276-14e5300c3a48',
        fitness: '1534438327276-14e5300c3a48',
        club: '1520699918507-3c3e01c766a1',
        garden: '1585320806297-9794b3e4eeae',
        park: '1585320806297-9794b3e4eeae',
        play: '1536431311719-398b6704d4cc',
        game: '1611095777215-80bc8bd69707',
        sport: '1588691516766-c2780650d32c',
        cricket: '1540747913346-19e32dc3e97e',
        court: '1588691516766-c2780650d32c',
        yoga: '1544367567-0f2fcb009e0b',
        library: '1568667256549-094345857637',
        cafe: '1554118811-1e0d58224f24',
        coffee: '1554118811-1e0d58224f24',
        theatre: '1489599849927-2ee91cede3ba',
        cinema: '1489599849927-2ee91cede3ba',
        banquet: '1519167758481-83f550bb49b3',
        hall: '1519167758481-83f550bb49b3',
        party: '1530103862676-de8892bc952f',
        security: '1557597774-9d273605dfa9',
        cctv: '1557597774-9d273605dfa9',
        gazebo: '1600607688969-a5bfcd64bd40', // Replaced with reliable outdoor architecture
        parking: '1506521781263-d8422e82f27a', // Parking lot
        car: '1506521781263-d8422e82f27a',
        gate: '1600585154340-be6161a56a0c', // Luxury gate/entrance
        community: '1600585154340-be6161a56a0c',
        salon: '1560066984-138dadb4c035', // Spa/salon
        spa: '1560066984-138dadb4c035',
        lounge: '1582582494705-f8ce0b0c24f0',
        sitting: '1582582494705-f8ce0b0c24f0'
    };

    // Very reliable fallback images (luxury homes/interiors/landscapes)
    const fallbacks = [
        '1600596542815-ffad4c1539a9',
        '1512917774080-9991f1c4c750',
        '1545324418-cc1a3fa10c00', // Our main hero image
        '1600585154340-be6161a56a0c',
        '1600607688969-a5bfcd64bd40'
    ];

    // Try to find a keyword match
    let matchedId = null;
    for (const [keyword, imgId] of Object.entries(imageMap)) {
        if (key.includes(keyword)) {
            matchedId = imgId;
            break;
        }
    }

    // If no match, deterministically pick a fallback based on the string length so it doesn't change on re-renders
    if (!matchedId) {
        matchedId = fallbacks[(key.length || 0) % fallbacks.length];
    }

    return `https://images.unsplash.com/photo-${matchedId}?auto=format&fit=crop&w=800&q=80`;
};

export default function ProjectDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [project, setProject] = useState(null);
    const [similarProjects, setSimilarProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeConfigIndex, setActiveConfigIndex] = useState(0);
    const [activeVariantIndex, setActiveVariantIndex] = useState(0);
    const [activePlotIndex, setActivePlotIndex] = useState(0);
    const [activeVillaIndex, setActiveVillaIndex] = useState(0);
    const [activeImage, setActiveImage] = useState(0);
    const [activeTowerIndex, setActiveTowerIndex] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    const [hasUnlockedMaps, setHasUnlockedMaps] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [activeLevelMap, setActiveLevelMap] = useState('L1');
    const [activePhaseIndex, setActivePhaseIndex] = useState(0);
    const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);
    const [brochureForm, setBrochureForm] = useState({ name: '', phone: '', otp: '' });
    const [inquiryForm, setInquiryForm] = useState({ name: '', phone: '', email: '', agreed: true });
    const [submitted, setSubmitted] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [brochureStep, setBrochureStep] = useState(1);
    const [showAllAmenities, setShowAllAmenities] = useState(false);
    const [activeAmenity, setActiveAmenity] = useState(null);
    const [pageBgColor, setPageBgColor] = useState(THEME.dark);
    const [leadSource, setLeadSource] = useState('brochure');
    const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
    const [isReraModalOpen, setIsReraModalOpen] = useState(false);
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
                
                // Check if project is saved if user is logged in
                if (user) {
                    const { data: savedData } = await supabase
                        .from('saved_projects')
                        .select('id')
                        .eq('user_id', user.id)
                        .eq('project_id', id)
                        .single();
                    setIsSaved(!!savedData);
                }

                // Check if user has already submitted a lead in this session (optional but helpful)
                const unlocked = localStorage.getItem(`unlocked_maps_${id}`);
                if (unlocked) setHasUnlockedMaps(true);
                
                // Fetch similar projects
                const { data: slotData } = await supabase
                    .from('projects')
                    .select('*')
                    .neq('id', id)
                    .ilike('homepage_slot', 'sim_proj_%')
                    .order('homepage_slot', { ascending: true })
                    .limit(5);

                const { data: cityData } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('city', data.city)
                    .neq('id', id)
                    .is('homepage_slot', null)
                    .limit(5);

                const similarData = [...(slotData || []), ...(cityData || [])].slice(0, 5);
                    
                if (similarData && similarData.length > 0) {
                    const formattedSimilar = similarData.map(p => {
                        let bhkStr = 'Premium';
                        if (p.configurations && p.configurations.length > 0) {
                            const beds = p.configurations.map(c => parseInt(c.bedrooms)).filter(v => !isNaN(v) && v > 0);
                            if (beds.length > 0) {
                                const minB = Math.min(...beds);
                                const maxB = Math.max(...beds);
                                bhkStr = minB === maxB ? `${minB} BHK` : `${minB} - ${maxB} BHK`;
                            }
                        }

                        let areaStr = 'N/A';
                        if (p.total_plot_area) {
                            areaStr = `${p.total_plot_area} Sq.ft`;
                        } else if (p.configurations && p.configurations.length > 0) {
                            const areas = p.configurations.map(c => parseInt(c.size)).filter(v => !isNaN(v) && v > 0);
                            if (areas.length > 0) {
                                const minA = Math.min(...areas);
                                const maxA = Math.max(...areas);
                                areaStr = minA === maxA ? `${minA} Sq.ft` : `${minA} - ${maxA} Sq.ft`;
                            }
                        }

                        return {
                            id: p.id,
                            name: p.name,
                            image: p.images?.[0]?.url || p.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
                            tag: p.construction_status || 'Under Construction',
                            bhk: bhkStr,
                            type: p.property_type?.toUpperCase(),
                            location: `${p.locality}, ${p.city}`,
                            price: p.price_range || ((p.min_price && p.max_price) ? `₹${p.min_price} - ₹${p.max_price}` : (p.configurations?.[0]?.price || 'Price on Request')),
                            area: areaStr
                        };
                    });
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
            console.error("Error submitting inquiry:", error);
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
            const { error } = await supabase
                .from('leads')
                .insert([{
                    project_id: project.id,
                    name: brochureForm.name,
                    phone: `+91 ${brochureForm.phone}`,
                    type: leadSource === 'map' ? 'map_layout' : 'brochure',
                    message: leadSource === 'map' 
                        ? `Applied for map layout of this ${project.name} project`
                        : `Requested Brochure for ${project.name}`
                }]);

            if (error) throw error;

            // Unlock maps for this session
            setHasUnlockedMaps(true);
            localStorage.setItem(`unlocked_maps_${id}`, 'true');

            // Trigger download if brochure exists
            if (project.brochure_url) {
                window.open(project.brochure_url, '_blank');
            }
            
            setIsBrochureModalOpen(false);
            setBrochureForm({ name: '', phone: '', email: '' });
            alert("Details unlocked successfully!");
        } catch (error) {
            console.error("Error in brochure/map unlock:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setVerifying(false);
        }
    };

    const handleToggleSave = async () => {
        if (!user) {
            alert("Please log in to save projects.");
            navigate('/login');
            return;
        }

        setIsSaving(true);
        try {
            if (isSaved) {
                await supabase
                    .from('saved_projects')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('project_id', id);
                setIsSaved(false);
            } else {
                await supabase
                    .from('saved_projects')
                    .insert([{ user_id: user.id, project_id: id }]);
                setIsSaved(true);
            }
        } catch (error) {
            console.error("Error toggling save:", error);
            // Table might not exist yet, let's inform the user if it's a 404
            if (error.code === 'PGRST116' || error.message?.includes('relation "saved_projects" does not exist')) {
                alert("Database table 'saved_projects' not found. Please run the SQL migration.");
            }
        } finally {
            setIsSaving(false);
        }
    };

    const extractImageUrl = (images, index = 0) => {
        if (!images) return null;
        let imgArray = images;
        if (typeof images === 'string') {
            try {
                imgArray = JSON.parse(images);
            } catch (e) {
                if (images.includes(',')) {
                    imgArray = images.split(',').map(s => s.trim());
                } else {
                    imgArray = [images.trim()];
                }
            }
        }
        
        if (Array.isArray(imgArray) && imgArray.length > 0) {
            const img = imgArray[index % imgArray.length];
            return typeof img === 'string' ? img : (img?.url || img);
        }
        return typeof imgArray === 'string' ? imgArray : null;
    };

    const slides = [
        ...(project?.video_url ? [{ type: 'video', url: project.video_url }] : []),
        ...(Array.isArray(project?.images) || typeof project?.images === 'string' 
            ? (typeof project.images === 'string' ? extractImageUrl(project.images, -1) : project.images)
            : []
        ).map(img => ({ type: 'image', url: typeof img === 'string' ? img : (img?.url || '') }))
    ];

    // If extractImageUrl returned a single string for slides, make it an array
    if (typeof slides[slides.length - 1]?.url === 'undefined' && typeof project?.images === 'string') {
        const url = extractImageUrl(project.images, 0);
        if (url) slides.push({ type: 'image', url });
    }

    const isYouTube = (url) => url && (url.includes('youtube.com') || url.includes('youtu.be'));
    const getYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Slideshow logic
    useEffect(() => {
        if (slides.length <= 1) return;
        
        // If current slide is a video and NOT a YouTube link, we wait for onEnded
        const currentSlide = slides[activeImage];
        const isActuallyVideo = currentSlide?.type === 'video' && !isYouTube(currentSlide.url);
        
        if (isActuallyVideo) return; 

        const timer = setTimeout(() => {
            setActiveImage((prev) => (prev + 1) % slides.length);
        }, 5000); 

        return () => clearTimeout(timer);
    }, [slides.length, activeImage]);

    if (loading) return <div style={{ padding: '100px', textAlign: 'center', color: THEME.gold, fontFamily: 'Outfit, sans-serif' }}>Loading Premium Project...</div>;
    if (!project) return <div style={{ padding: '100px', textAlign: 'center', color: THEME.text, fontFamily: 'Outfit, sans-serif' }}>Project not found.</div>;

    const allConfigs = [
        ...(project.configurations || []).map(c => ({ ...c, isPenthouse: false, isDuplex: false })),
        ...(project.penthouse_configurations || []).map(p => ({ ...p, isPenthouse: true, isDuplex: false })),
        ...(project.duplex_penthouse_configurations || []).map(d => ({ ...d, isPenthouse: true, isDuplex: true }))
    ];

    const groupedConfigs = [];
    allConfigs.forEach(config => {
        const typeStr = config.isDuplex ? 'Duplex Penthouse' : (config.isPenthouse ? 'Penthouse' : 'Flat');
        const title = `${config.bedrooms} BHK ${typeStr}`;
        let group = groupedConfigs.find(g => g.title === title);
        if (!group) {
            group = { title, isDuplex: config.isDuplex, isPenthouse: config.isPenthouse, bedrooms: config.bedrooms, configs: [] };
            groupedConfigs.push(group);
        }
        group.configs.push(config);
    });

    const activeGroup = groupedConfigs[activeConfigIndex] || groupedConfigs[0];
    const activeConfig = activeGroup ? (activeGroup.configs[activeVariantIndex] || activeGroup.configs[0]) : null;

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

    let regularBhks = [];
    if (project.configurations && project.configurations.length > 0) {
        regularBhks = [...new Set(project.configurations.map(c => c.bedrooms))].sort((a, b) => a - b);
    }
    
    let bhkParts = [];
    if (regularBhks.length > 0) {
        bhkParts.push(`${regularBhks.join(', ')} BHK Flat`);
    }
    if (project.penthouse_configurations && project.penthouse_configurations.length > 0) {
        bhkParts.push("Penthouse");
    }
    if (project.duplex_penthouse_configurations && project.duplex_penthouse_configurations.length > 0) {
        bhkParts.push("Duplex Penthouse");
    }
    
    let fullBhkString = bhkParts.join(" & ");

    const MapGatedImage = ({ src, alt, style }) => {
        if (!src) return <div style={{ color: THEME.cardMuted }}>No Map Uploaded</div>;
        
        return (
            <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: '12px' }}>
                <img 
                    src={src} 
                    alt={alt} 
                    style={{ 
                        ...style, 
                        filter: hasUnlockedMaps ? 'none' : 'blur(15px)',
                        transition: 'filter 0.5s ease'
                    }} 
                />
                {!hasUnlockedMaps && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.1)' }}>
                        <button 
                            onClick={() => {
                                setLeadSource('map');
                                setIsBrochureModalOpen(true);
                            }}
                            style={{ 
                                background: 'rgba(0,0,0,0.7)', 
                                color: '#FFF', 
                                border: 'none', 
                                padding: '12px 30px', 
                                borderRadius: '8px', 
                                fontWeight: 'bold', 
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                fontSize: '1rem',
                                transition: 'transform 0.2s',
                                backdropFilter: 'blur(5px)'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <Eye size={20} /> View Map
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const mainImage = extractImageUrl(project.images, 0) || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1920&q=80';

    return (
        <div style={{ background: pageBgColor, transition: 'background 0.8s ease-in-out', color: THEME.text, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
            {/* Fullscreen Preview Overlay */}
            {isFullscreenPreview && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
                    background: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', 
                    alignItems: 'center', justifyContent: 'center'
                }}>
                    <button 
                        onClick={() => setIsFullscreenPreview(false)}
                        style={{ position: 'absolute', top: '20px', right: '30px', background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}
                    >
                        <Lock size={32} /> {/* Placeholder for X icon, let's use a clear 'Close' or simple text if X isn't imported. I see 'X' is not imported in lucide. Wait, I can use a generic close button style */}
                        <span style={{ fontSize: '2rem' }}>&times;</span>
                    </button>
                    
                    {slides.length > 1 && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); setActiveImage((prev) => (prev - 1 + slides.length) % slides.length); }}
                            style={{ position: 'absolute', left: '30px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#FFF', padding: '15px', borderRadius: '50%', cursor: 'pointer', backdropFilter: 'blur(5px)' }}
                        >
                            <ChevronLeft size={32} />
                        </button>
                    )}

                    <div style={{ maxWidth: '90%', maxHeight: '90vh' }}>
                        {slides[activeImage]?.type === 'video' ? (
                            isYouTube(slides[activeImage].url) ? (
                                <iframe 
                                    src={`https://www.youtube.com/embed/${getYouTubeId(slides[activeImage].url)}?autoplay=1`} 
                                    style={{ width: '80vw', height: '80vh', border: 'none' }}
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                />
                            ) : (
                                <video 
                                    src={slides[activeImage].url} 
                                    controls autoPlay 
                                    style={{ maxWidth: '100%', maxHeight: '90vh' }} 
                                />
                            )
                        ) : (
                            <img 
                                src={slides[activeImage]?.url || mainImage} 
                                alt="preview" 
                                style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain' }} 
                            />
                        )}
                    </div>

                    {slides.length > 1 && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); setActiveImage((prev) => (prev + 1) % slides.length); }}
                            style={{ position: 'absolute', right: '30px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#FFF', padding: '15px', borderRadius: '50%', cursor: 'pointer', backdropFilter: 'blur(5px)' }}
                        >
                            <ChevronRight size={32} />
                        </button>
                    )}
                </div>
            )}

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
                @keyframes developer-pulse {
                    0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
                }
                .developer-pill-premium {
                    animation: developer-pulse 3s infinite;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }
                .developer-pill-premium::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 50%;
                    height: 100%;
                    background: linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent);
                    animation: brochure-shine 6s infinite;
                }
                .developer-pill-premium:hover {
                    transform: translateY(-2px);
                    background: rgba(255,255,255,0.15) !important;
                    border-color: rgba(227, 188, 90, 0.5) !important;
                }
                .dynamic-amenity-wrapper {
                    position: relative;
                    height: 56px;
                }

                .dynamic-amenity-card {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 56px;
                    background: #FFFFFF;
                    border: 1px solid #EAEAEA;
                    border-radius: 28px;
                    overflow: hidden;
                    transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
                    display: flex;
                    flex-direction: column;
                    z-index: 1;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.02);
                    cursor: default;
                }

                .dynamic-amenity-card:hover {
                    height: 100px;
                    border-radius: 16px;
                    border-color: #5E7D5A;
                    box-shadow: 0 15px 35px rgba(94, 125, 90, 0.15);
                    z-index: 10;
                }

                .dynamic-island-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 8px;
                    height: 56px;
                    box-sizing: border-box;
                }

                .dynamic-island-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #FAFAFA;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    transition: all 0.3s ease;
                }

                .dynamic-amenity-card:hover .dynamic-island-icon {
                    background: #5E7D5A;
                }

                .dynamic-amenity-card:hover .dynamic-island-icon svg {
                    color: #FFFFFF !important;
                }

                .dynamic-island-title {
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: #1A1A1A;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    flex: 1;
                    padding-right: 15px;
                }

                .dynamic-island-content {
                    opacity: 0;
                    transform: translateY(10px);
                    transition: all 0.3s ease;
                    padding: 0 20px 20px 20px;
                    font-size: 0.9rem;
                    color: #FFFFFF;
                    line-height: 1.5;
                    text-align: left;
                    position: relative;
                    z-index: 2;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }

                .dynamic-amenity-card:hover .dynamic-island-content {
                    opacity: 1;
                    transform: translateY(0);
                    transition-delay: 0.1s;
                }

                .dynamic-island-bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    opacity: 0;
                    transition: all 0.5s ease;
                    z-index: 0;
                    filter: brightness(0.6);
                }

                .dynamic-amenity-card:hover .dynamic-island-bg {
                    opacity: 1;
                }

                .dynamic-island-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7));
                    opacity: 0;
                    transition: opacity 0.5s ease;
                    z-index: 1;
                }

                .dynamic-amenity-card:hover .dynamic-island-overlay {
                    opacity: 1;
                }

                .dynamic-island-header, .dynamic-island-title {
                    position: relative;
                    z-index: 2;
                    transition: all 0.3s ease;
                }

                .dynamic-amenity-card:hover .dynamic-island-title {
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
                @keyframes rera-glow {
                    0% { box-shadow: 0 0 5px rgba(74, 222, 128, 0.2); border-color: rgba(255,255,255,0.2); }
                    50% { box-shadow: 0 0 20px rgba(74, 222, 128, 0.6); border-color: rgba(74, 222, 128, 0.8); }
                    100% { box-shadow: 0 0 5px rgba(74, 222, 128, 0.2); border-color: rgba(255,255,255,0.2); }
                }
                .rera-btn-glow {
                    animation: rera-glow 3s infinite ease-in-out;
                }
            `}</style>
            
            {/* HERO SECTION INJECTED HERE */}
            <header className="lux-hero" style={{ marginBottom: '50px' }}>
                {slides.length > 0 ? slides.map((slide, i) => (
                    slide.type === 'video' ? (
                        <div 
                            key={i}
                            style={{ 
                                opacity: i === activeImage ? 1 : 0, 
                                transition: 'opacity 1.5s ease-in-out', 
                                zIndex: i === activeImage ? 1 : 0,
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: '#000',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Blurred Background */}
                            {isYouTube(slide.url) ? (
                                <iframe 
                                    src={`https://www.youtube.com/embed/${getYouTubeId(slide.url)}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeId(slide.url)}&controls=0&showinfo=0&modestbranding=1&rel=0`} 
                                    style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, border: 'none', transform: 'scale(1.5)', filter: 'blur(30px) brightness(0.6)' }}
                                    allow="autoplay; encrypted-media"
                                />
                            ) : (
                                <video 
                                    src={slide.url} 
                                    autoPlay muted playsInline loop
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.2)', filter: 'blur(30px) brightness(0.6)' }} 
                                />
                            )}

                            {/* Main Video/Frame */}
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                                {isYouTube(slide.url) ? (
                                    <iframe 
                                        src={`https://www.youtube.com/embed/${getYouTubeId(slide.url)}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeId(slide.url)}&controls=0&showinfo=0&modestbranding=1&rel=0`} 
                                        style={{ width: '100%', height: '100%', border: 'none' }}
                                        allow="autoplay; encrypted-media"
                                    />
                                ) : (
                                    <video 
                                        key={`video-${i}-${i === activeImage}`}
                                        src={slide.url} 
                                        autoPlay muted playsInline 
                                        onEnded={() => setActiveImage((prev) => (prev + 1) % slides.length)}
                                        style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'pointer' }}
                                        onClick={() => setIsFullscreenPreview(true)}
                                    />
                                )}
                            </div>
                        </div>
                    ) : (
                        <div 
                            key={i}
                            style={{ 
                                opacity: i === activeImage ? 1 : 0, 
                                transition: 'opacity 1.5s ease-in-out', 
                                zIndex: i === activeImage ? 1 : 0,
                                position: 'absolute',
                                top: 0, left: 0, width: '100%', height: '100%',
                                background: '#000', overflow: 'hidden'
                            }}
                        >
                            {/* Blurred Image Background */}
                            <img 
                                src={slide.url} 
                                alt="blur-bg"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.2)', filter: 'blur(30px) brightness(0.7)' }}
                            />
                            {/* Main Image */}
                            <div style={{ position: 'absolute', inset: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                                <img 
                                    src={slide.url} 
                                    alt={project.name} 
                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', cursor: 'pointer' }}
                                    onClick={() => setIsFullscreenPreview(true)}
                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1920&q=80'; }}
                                />
                            </div>
                        </div>
                    )
                )) : (
                    <img src={mainImage} className="lux-hero-bg" alt={project.name} style={{ zIndex: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
                <div className="lux-hero-overlay" style={{ zIndex: 1, pointerEvents: 'none' }}></div>
                <div className="lux-hero-content" style={{ zIndex: 2, bottom: '8%', left: '5%', width: '90%' }}>
                    {/* Top Row: Status and Price */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '12px' }}>
                        <div className="lux-hero-tagline" style={{ margin: 0, padding: '6px 16px', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>
                            {project.construction_status || 'Under Construction'}
                        </div>
                        {project.price_range && (
                            <div style={{ fontSize: '2.1rem', color: '#FFF', fontWeight: '400', fontFamily: 'Playfair Display, serif', letterSpacing: '1px' }}>
                                ₹{project.price_range}
                            </div>
                        )}
                    </div>

                    {/* Main Title */}
                    <h1 className="lux-heading-primary" style={{ marginBottom: '10px' }}>{project.name}</h1>

                    {/* Developer Name Line - Glass Pill Style */}
                    <div className="developer-pill-premium" style={{ 
                        display: 'inline-block',
                        background: 'rgba(255,255,255,0.1)', 
                        backdropFilter: 'blur(12px)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        padding: '8px 18px', 
                        borderRadius: '10px',
                        marginBottom: '15px',
                        cursor: 'default'
                    }}>
                        <div style={{ 
                            fontSize: '0.85rem', 
                            color: '#FFFFFF', 
                            fontWeight: '700', 
                            letterSpacing: '1.5px', 
                            textTransform: 'uppercase',
                            textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
                        }}>
                            DEVELOPED BY: {project.developer || 'NestDeal'}
                        </div>
                    </div>

                    {/* BHK Line - Plain Text Style with Icon */}
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        fontSize: '0.9rem', 
                        color: 'rgba(255,255,255,0.95)', 
                        fontWeight: '600', 
                        letterSpacing: '1.5px',
                        marginBottom: '12px',
                        textTransform: 'uppercase'
                    }}>
                        <Home size={20} color={THEME.gold} />
                        <span>{fullBhkString}</span>
                    </div>

                    {/* Area Line */}
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px', 
                        color: 'rgba(255,255,255,0.95)', 
                        fontSize: '0.9rem', 
                        fontWeight: '600',
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        marginBottom: '20px' 
                    }}>
                        <MapPin size={20} color={THEME.gold} />
                        <span>{project.locality} {project.city}</span>
                    </div>

                    {/* Buttons Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                        {project.brochure_url && (
                            <button 
                                onClick={() => {
                                    setLeadSource('brochure');
                                    setIsBrochureModalOpen(true);
                                }}
                                className="brochure-btn-premium"
                                style={{ 
                                    background: THEME.gold, color: '#FFF', border: 'none', 
                                    padding: '10px 28px', borderRadius: '50px', fontWeight: '700', 
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', 
                                    fontSize: '0.8rem', letterSpacing: '1px'
                                }}
                            >
                                <Download size={18} /> GET BROCHURE
                            </button>
                        )}
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button 
                                onClick={handleShare}
                                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFF', padding: '12px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                            >
                                <Share2 size={22} />
                            </button>
                            <button 
                                onClick={handleToggleSave}
                                disabled={isSaving}
                                style={{ 
                                    background: isSaved ? THEME.gold : 'rgba(255,255,255,0.15)', 
                                    backdropFilter: 'blur(12px)', 
                                    border: `1px solid ${isSaved ? THEME.gold : 'rgba(255,255,255,0.2)'}`, 
                                    color: isSaved ? '#000' : '#FFF', 
                                    padding: '12px', 
                                    borderRadius: '50%', 
                                    cursor: 'pointer', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    transition: 'all 0.3s' 
                                }}
                                onMouseOver={(e) => !isSaved && (e.currentTarget.style.background = 'rgba(255,255,255,0.3)')}
                                onMouseOut={(e) => !isSaved && (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
                            >
                                <Heart size={22} fill={isSaved ? "currentColor" : "none"} />
                            </button>
                        </div>
                    </div>

                    {/* RERA Line at Bottom */}
                    {project.rera_id && (
                        <button 
                            onClick={() => setIsReraModalOpen(true)}
                            className="rera-btn-glow"
                            style={{ 
                                display: 'inline-flex', alignItems: 'center', gap: '8px', 
                                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                                padding: '8px 18px', borderRadius: '8px', color: '#FFF',
                                fontSize: '0.8rem', fontWeight: '600', marginTop: '15px', letterSpacing: '1px',
                                cursor: 'pointer', backdropFilter: 'blur(10px)', transition: 'all 0.3s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        >
                            <BadgeCheck size={16} color="#4ADE80" />
                            RERA REGISTERED
                        </button>
                    )}
                </div>
                
                {/* Dots Navigation */}
                {slides.length > 1 && (
                    <div style={{ position: 'absolute', bottom: '70px', left: 0, right: 0, zIndex: 3, display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveImage(i)}
                                aria-label={`Go to slide ${i + 1}`}
                                style={{
                                    width: activeImage === i ? '24px' : '8px',
                                    height: '8px',
                                    borderRadius: '4px',
                                    background: activeImage === i ? THEME.gold : 'rgba(255, 255, 255, 0.5)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    padding: 0
                                }}
                            />
                        ))}
                    </div>
                )}

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
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '60px', minWidth: 0 }}>
                        {project.property_type === 'Plots' ? (
                            <>
                                <section id="floor-plan">
                                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', color: THEME.text, marginBottom: '30px', fontWeight: '600' }}>TYPES OF PLOTS</h2>
                                    
                                    <div className="plot-tabs-slider-container" style={{ position: 'relative', marginBottom: '30px', maxWidth: '100%' }}>
                                        <div 
                                            className="plot-tabs-slider" 
                                            style={{ 
                                                display: 'flex', 
                                                gap: '12px', 
                                                overflowX: 'auto', 
                                                paddingBottom: '12px', 
                                                scrollbarWidth: 'none', 
                                                msOverflowStyle: 'none',
                                                WebkitOverflowScrolling: 'touch',
                                                width: '100%',
                                                paddingRight: '60px'
                                            }}
                                        >
                                            {project.plot_config?.map((plot, idx) => (
                                                <button 
                                                    key={idx}
                                                    onClick={() => setActivePlotIndex(idx)}
                                                    style={{
                                                        padding: '10px 25px', 
                                                        background: activePlotIndex === idx ? THEME.gold : '#F1F1F1',
                                                        color: activePlotIndex === idx ? '#FFFFFF' : '#666',
                                                        border: 'none',
                                                        borderRadius: '30px', 
                                                        fontWeight: '600', 
                                                        cursor: 'pointer', 
                                                        whiteSpace: 'nowrap', 
                                                        transition: 'all 0.3s ease',
                                                        flexShrink: 0,
                                                        fontSize: '0.95rem'
                                                    }}
                                                >
                                                    {plot.size_sqft} Sq.ft
                                                </button>
                                            ))}
                                        </div>
                                        <div style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '40px', background: 'linear-gradient(to left, #FFFFFF, transparent)', pointerEvents: 'none', opacity: 0.8 }}></div>
                                    </div>

                                    {project.plot_config?.[activePlotIndex] && (
                                        <div style={{ background: THEME.card, padding: '40px', borderRadius: '24px', border: `1px solid ${THEME.border}`, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', alignItems: 'center' }}>
                                            <div style={{ background: '#F8F8F8', borderRadius: '16px', overflow: 'hidden', height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${THEME.border}`, position: 'relative' }}>
                                                <MapGatedImage 
                                                    src={project.plot_config[activePlotIndex].map_url} 
                                                    alt="Plot Plan" 
                                                    style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} 
                                                />
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
                                        <div className="villa-tabs-slider-container" style={{ position: 'relative', marginBottom: '30px', maxWidth: '100%' }}>
                                            <div 
                                                className="villa-tabs-slider" 
                                                style={{ 
                                                    display: 'flex', 
                                                    gap: '12px', 
                                                    overflowX: 'auto', 
                                                    paddingBottom: '12px', 
                                                    scrollbarWidth: 'none', 
                                                    msOverflowStyle: 'none',
                                                    WebkitOverflowScrolling: 'touch',
                                                    width: '100%',
                                                    paddingRight: '60px'
                                                }}
                                            >
                                                {project.villa_config.map((villa, idx) => (
                                                    <button 
                                                        key={idx}
                                                        onClick={() => setActiveVillaIndex(idx)}
                                                        style={{
                                                            padding: '10px 25px', 
                                                            background: activeVillaIndex === idx ? THEME.gold : '#F1F1F1',
                                                            color: activeVillaIndex === idx ? '#FFFFFF' : '#666',
                                                            border: 'none',
                                                            borderRadius: '30px', 
                                                            fontWeight: '600', 
                                                            cursor: 'pointer', 
                                                            whiteSpace: 'nowrap', 
                                                            transition: 'all 0.3s ease',
                                                            flexShrink: 0,
                                                            fontSize: '0.95rem'
                                                        }}
                                                    >
                                                        {villa.bhk_type}
                                                    </button>
                                                ))}
                                            </div>
                                            <div style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '40px', background: 'linear-gradient(to left, #FFFFFF, transparent)', pointerEvents: 'none', opacity: 0.8 }}></div>
                                        </div>
                                        {project.villa_config[activeVillaIndex] && (
                                            <div style={{ background: THEME.card, padding: '40px', borderRadius: '24px', border: `1px solid ${THEME.border}`, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', alignItems: 'center' }}>
                                                <div style={{ background: '#F8F8F8', borderRadius: '16px', overflow: 'hidden', height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${THEME.border}`, position: 'relative' }}>
                                                    <MapGatedImage 
                                                        src={project.villa_config[activeVillaIndex].map_url} 
                                                        alt="Villa Plan" 
                                                        style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} 
                                                    />
                                                </div>
                                                <div>
                                                    <h3 style={{ fontSize: '2rem', margin: '0 0 10px 0', color: THEME.text }}>Premium {project.villa_config[activeVillaIndex].bhk_type} Villa</h3>
                                                    <div style={{ color: THEME.gold, fontSize: '2.2rem', fontWeight: '800', marginBottom: '10px' }}>₹ {project.villa_config[activeVillaIndex].price}</div>
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
                                <div className="bhk-tabs-slider-container" style={{ position: 'relative', marginBottom: '30px', maxWidth: '100%' }}>
                                    <div 
                                        className="bhk-tabs-slider" 
                                        style={{ 
                                            display: 'flex', 
                                            gap: '12px', 
                                            overflowX: 'auto', 
                                            paddingBottom: '12px', 
                                            scrollbarWidth: 'none', 
                                            msOverflowStyle: 'none',
                                            WebkitOverflowScrolling: 'touch',
                                            width: '100%',
                                            paddingRight: '40px'
                                        }}
                                    >
                                        {groupedConfigs.map((group, idx) => (
                                            <button 
                                                key={idx} 
                                                onClick={() => {
                                                    setActiveConfigIndex(idx);
                                                    setActiveVariantIndex(0); // Reset variant when switching groups
                                                }} 
                                                style={{ 
                                                    padding: '10px 24px', 
                                                    background: activeConfigIndex === idx ? (group.isPenthouse ? `linear-gradient(135deg, ${THEME.gold}, #B8860B)` : THEME.gold) : '#F1F1F1', 
                                                    color: activeConfigIndex === idx ? '#FFFFFF' : '#666', 
                                                    border: 'none',
                                                    borderRadius: '30px', 
                                                    fontSize: '0.95rem', 
                                                    fontWeight: '600', 
                                                    cursor: 'pointer', 
                                                    whiteSpace: 'nowrap', 
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    boxShadow: activeConfigIndex === idx ? '0 8px 20px rgba(184, 134, 11, 0.2)' : 'none',
                                                    flexShrink: 0,
                                                    scrollSnapAlign: 'start'
                                                }}
                                            >
                                                {group.title}
                                            </button>
                                        ))}
                                    </div>
                                    <div style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '40px', background: 'linear-gradient(to left, #FFFFFF, transparent)', pointerEvents: 'none', opacity: 0.8 }}></div>
                                </div>

                                {activeGroup && activeGroup.configs.length > 1 && (
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                                        <span style={{ color: THEME.muted, fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', marginRight: '10px' }}>SELECT VARIANT:</span>
                                        {activeGroup.configs.map((_, variantIdx) => {
                                            const variantLabel = String.fromCharCode(65 + variantIdx); // A, B, C, etc.
                                            return (
                                                <button
                                                    key={variantIdx}
                                                    onClick={() => setActiveVariantIndex(variantIdx)}
                                                    style={{
                                                        padding: '6px 16px',
                                                        background: activeVariantIndex === variantIdx ? THEME.gold : '#FFF',
                                                        color: activeVariantIndex === variantIdx ? '#FFF' : THEME.text,
                                                        border: `1px solid ${activeVariantIndex === variantIdx ? THEME.gold : THEME.border}`,
                                                        borderRadius: '8px',
                                                        fontSize: '0.9rem',
                                                        fontWeight: 'bold',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        boxShadow: activeVariantIndex === variantIdx ? '0 4px 10px rgba(184, 134, 11, 0.15)' : 'none'
                                                    }}
                                                >
                                                    Type {variantLabel}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {activeConfig && (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px', background: THEME.card, padding: '30px', borderRadius: '24px', border: `1px solid ${THEME.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                                        <div>
                                            <div style={{ marginBottom: '30px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                                    <h3 style={{ fontSize: '1.8rem', margin: 0, color: activeConfig.isPenthouse ? THEME.gold : THEME.cardText }}>
                                                        {activeConfig.bedrooms} BHK {activeConfig.isDuplex ? 'Duplex Penthouse' : (activeConfig.isPenthouse ? 'Penthouse' : 'Flat')}
                                                    </h3>
                                                    {activeGroup.configs.length > 1 && (
                                                        <span style={{ background: `${THEME.gold}20`, color: THEME.gold, padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                            Type {String.fromCharCode(65 + activeVariantIndex)}
                                                        </span>
                                                    )}
                                                </div>
                                                <p style={{ color: THEME.cardMuted, fontSize: '1.1rem', margin: 0 }}>{activeConfig.area} Sq.ft • {activeConfig.isPenthouse ? `Floor ${activeConfig.floor_number}` : 'Carpet Area'}</p>
                                                <div style={{ color: activeConfig.isPenthouse ? THEME.cardText : THEME.gold, fontSize: '1.6rem', fontWeight: 'bold', marginTop: '10px' }}>₹ {activeConfig.price}</div>
                                                {activeConfig.price_range && (
                                                    <div style={{ color: THEME.muted, fontSize: '1rem', fontWeight: '500', marginTop: '4px' }}>Range: ₹ {activeConfig.price_range}</div>
                                                )}
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                                {[
                                                        { label: 'Common Washroom', key: 'general_toilet', icon: Toilet },
                                                        { label: 'Attach Washroom', key: 'personal_toilet', icon: Toilet },
                                                        { label: 'Kitchen', key: 'kitchens', icon: ChefHat },
                                                        { label: 'Master Bedroom', key: 'master_bedroom', icon: BedDouble },
                                                        { label: 'Children\'s Room', key: 'children_room', icon: BedDouble },
                                                        { label: 'Study Room', key: 'study_room', icon: BookOpen },
                                                        { label: 'Store Room', key: 'store_room', icon: Store },
                                                        { label: 'Washyard', key: 'washyard', icon: WashingMachine },
                                                        { label: 'Servant Room', key: 'servant_room', icon: User },
                                                        { label: 'Dressing Room', key: 'dressing_room', icon: Scissors },
                                                        { label: 'Vestibule', key: 'vestibule', icon: DoorOpen },
                                                        { label: 'Balcony', key: 'balcony', icon: Fence },
                                                        { label: 'Balcony', key: 'sky_patio_balcony', icon: Fence },
                                                        { label: 'Pooja Room', key: 'pooja_room', icon: Flame },
                                                        { label: 'Personal Foyer', key: 'foyer', icon: Home },
                                                        { label: 'Drawing/Living', key: 'drawing_living_dining', icon: Sofa },
                                                         { label: 'Car Parking', key: 'car_parking', icon: Car },
                                                         { label: 'Basement Floors', key: 'basement_floors', icon: ArrowUpToLine },
                                                         { label: 'Floor', key: 'floor_number', icon: ArrowUpToLine },
                                                         { label: 'Private Terrace', key: 'private_terrace', icon: Mountain },
                                                         { label: 'Terrace Size', key: 'terrace_size', icon: Mountain }
                                                    ].filter(item => {
                                                        const val = activeConfig[item.key];
                                                        if (item.key === 'private_terrace') return val === true || val === 'true';
                                                        return val && val !== '0' && val !== 0;
                                                    }).map((item, i) => {
                                                        const IconComponent = item.icon;
                                                        const val = activeConfig[item.key];
                                                        return (
                                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', background: '#FFFFFF', padding: '12px 15px', borderRadius: '12px', border: `1px solid ${THEME.border}`, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                                                            <div style={{ background: '#F5F5EF', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <IconComponent size={20} color={THEME.gold} strokeWidth={1.5} />
                                                            </div>
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <div style={{ color: THEME.cardText, fontSize: '0.8rem', fontWeight: '500', lineHeight: '1.2' }}>{item.label}</div>
                                                                <div style={{ fontWeight: '600', fontSize: '1.1rem', color: THEME.text, marginTop: '2px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                                                    {item.key === 'private_terrace' ? 'Yes' : (item.key === 'terrace_size' ? `${val} Sq.ft` : val)}
                                                                    {item.key !== 'private_terrace' && item.key !== 'terrace_size' && item.key !== 'floor_number' && item.key !== 'basement_floors' && <span style={{ fontSize: '0.65rem', color: THEME.muted, fontWeight: '400' }}>Nos.</span>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )})}
                                                </div>
                                            </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                            {activeConfig.isDuplex && (
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    {['L1', 'L2'].map(lvl => (
                                                        <button
                                                            key={lvl}
                                                            onClick={() => setActiveLevelMap(lvl)}
                                                            style={{
                                                                padding: '8px 20px',
                                                                background: activeLevelMap === lvl ? THEME.gold : THEME.dark,
                                                                color: activeLevelMap === lvl ? '#FFF' : THEME.muted,
                                                                border: `1px solid ${activeLevelMap === lvl ? THEME.gold : THEME.border}`,
                                                                borderRadius: '8px',
                                                                fontSize: '0.85rem',
                                                                fontWeight: 'bold',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                        >
                                                            Level {lvl === 'L1' ? '1' : '2'}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            <div style={{ background: THEME.card, borderRadius: '12px', border: `1px solid ${THEME.border}`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                                <div style={{ padding: '12px 20px', background: THEME.dark, borderBottom: `1px solid ${THEME.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.9rem', color: THEME.gold, fontWeight: 'bold' }}>
                                                        {activeConfig.isDuplex ? (activeLevelMap === 'L1' ? 'LEVEL-1' : 'LEVEL-2') : 'LAYOUT MAP'}
                                                    </span>
                                                    {((activeConfig.isDuplex ? (activeLevelMap === 'L1' ? activeConfig.map_url_l1 : activeConfig.map_url_l2) : activeConfig.map_url)) && (
                                                        <button 
                                                            onClick={() => {
                                                                if (!hasUnlockedMaps) {
                                                                    setLeadSource('map');
                                                                    setIsBrochureModalOpen(true);
                                                                    return;
                                                                }
                                                                window.open(
                                                                    activeConfig.isDuplex ? (activeLevelMap === 'L1' ? activeConfig.map_url_l1 : activeConfig.map_url_l2) : activeConfig.map_url, 
                                                                    '_blank'
                                                                );
                                                            }} 
                                                            style={{ background: 'none', border: 'none', color: THEME.gold, cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '500' }}
                                                        >
                                                            <Maximize2 size={14} /> Fullscreen
                                                        </button>
                                                    )}
                                                </div>
                                                <div style={{ flex: 1, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', position: 'relative' }}>
                                                    <MapGatedImage 
                                                        src={activeConfig.isDuplex ? (activeLevelMap === 'L1' ? activeConfig.map_url_l1 : activeConfig.map_url_l2) : activeConfig.map_url} 
                                                        alt="Layout Map" 
                                                        style={{ maxWidth: '100%', maxHeight: '450px', objectFit: 'contain' }} 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}


                        <section id="amenities" ref={amenitiesRef}>
                            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: THEME.text, marginBottom: '25px', fontWeight: '500', letterSpacing: '1px' }}>AMENITIES</h2>
                            <div style={{ background: THEME.card, padding: '35px', borderRadius: '16px', border: `1px solid ${THEME.border}`, color: THEME.text, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '25px 20px' }}>
                                    {(showAllAmenities ? project.amenities : project.amenities?.slice(0, 8))?.map((am, i) => {
                                        const amenityData = ALL_AMENITIES.find(a => a.name === am);
                                        const IconComponent = amenityData ? amenityData.icon : CheckCircle2;
                                        const bgImg = getAmenityImage(am);
                                        
                                        return (
                                            <div key={i} className="dynamic-amenity-wrapper">
                                                <div className="dynamic-amenity-card">
                                                    <img src={bgImg} className="dynamic-island-bg" alt="" />
                                                    <div className="dynamic-island-overlay" />
                                                    <div className="dynamic-island-header">
                                                        <div className="dynamic-island-icon">
                                                            <IconComponent size={20} color={THEME.gold} strokeWidth={1.5} />
                                                        </div>
                                                        <div className="dynamic-island-title">{am}</div>
                                                    </div>
                                                </div>
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
                                    Location & Connectivity
                                    {project.google_map_link && (
                                        <a href={project.google_map_link} target="_blank" rel="noreferrer" style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: `${THEME.gold}15`, color: THEME.gold, borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
                                            <Navigation size={16} /> Open in Google Maps
                                        </a>
                                    )}
                                </h2>
                                
                                {project.latitude && project.longitude ? (
                                    <NearbyMap 
                                        latitude={project.latitude} 
                                        longitude={project.longitude} 
                                        projectName={project.name}
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: '450px', borderRadius: '16px', overflow: 'hidden', border: `1px solid ${THEME.border}`, background: THEME.card, position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                                        <iframe 
                                            src={`https://maps.google.com/maps?q=${encodeURIComponent(`${project.name} ${project.locality} ${project.city}`)}&output=embed`} 
                                            style={{ width: '100%', height: '100%', border: 0 }} 
                                            allowFullScreen="" 
                                            loading="lazy" 
                                            referrerPolicy="no-referrer-when-downgrade" 
                                            title="Project Location"
                                        ></iframe>
                                        <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(255,255,255,0.9)', padding: '10px 15px', borderRadius: '8px', fontSize: '0.8rem', color: THEME.muted, fontWeight: '500', border: `1px solid ${THEME.border}` }}>
                                            Coordinates not set. Showing approximate location.
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}
                    </div>

                    <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '25px', minWidth: 0 }}>
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
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: THEME.muted }}>Price Range</span><span style={{ fontWeight: 'bold', color: THEME.gold }}>{project.price_range ? `₹ ${project.price_range}` : `₹${project.min_price || 0} - ₹${project.max_price || 0}`}</span></div>
                            </div>
                        </div>

                        {project.towers && project.towers.length > 0 && (
                            <div id="towers" style={{ background: THEME.card, padding: '30px', borderRadius: '24px', border: `1px solid ${THEME.border}`, color: THEME.text, boxShadow: '0 10px 30px rgba(0,0,0,0.04)', overflow: 'hidden', maxWidth: '100%', boxSizing: 'border-box' }}>
                                <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.2rem', color: THEME.gold, borderBottom: `1px solid ${THEME.border}`, paddingBottom: '15px' }}>TOWER DETAILS</h3>
                                
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '10px', maxWidth: '100%', scrollbarWidth: 'thin' }}>
                                    {project.towers.map((tower, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => setActiveTowerIndex(idx)}
                                            style={{
                                                flexShrink: 0,
                                                padding: '8px 16px', background: activeTowerIndex === idx ? `${THEME.gold}15` : 'transparent',
                                                color: activeTowerIndex === idx ? THEME.gold : THEME.muted,
                                                border: `1px solid ${activeTowerIndex === idx ? THEME.gold : THEME.border}`,
                                                borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s', fontSize: '0.9rem'
                                            }}
                                        >
                                            {(tower.type ? tower.type.replace(/tower/i, '').trim() : (idx + 1))}
                                        </button>
                                    ))}
                                </div>
                                
                                {project.towers[activeTowerIndex] && (() => {
                                    const activeTower = project.towers[activeTowerIndex];
                                    return (
                                        <div style={{ background: '#FAFAFA', padding: '20px', borderRadius: '16px', border: `1px solid ${THEME.border}` }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                                <h4 style={{ margin: 0, color: THEME.cardText, fontSize: '1.1rem', fontWeight: 'bold' }}>Tower {(activeTower.type ? activeTower.type.replace(/tower/i, '').trim() : (activeTowerIndex + 1))}</h4>
                                                {activeTower.bhk && <span style={{ background: `${THEME.gold}15`, color: THEME.gold, padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>{activeTower.bhk} BHK</span>}
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                                <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '8px', border: `1px solid ${THEME.border}` }}>
                                                    <div style={{ color: THEME.muted, fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '4px' }}>FLOORS</div>
                                                    <div style={{ fontWeight: 'bold', fontSize: '1rem', color: THEME.text }}>{activeTower.story || 'N/A'}</div>
                                                </div>
                                                <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '8px', border: `1px solid ${THEME.border}` }}>
                                                    <div style={{ color: THEME.muted, fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '4px' }}>UNITS/FLOOR</div>
                                                    <div style={{ fontWeight: 'bold', fontSize: '1rem', color: THEME.text }}>{activeTower.units_per_floor || 'N/A'}</div>
                                                </div>
                                                <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '8px', border: `1px solid ${THEME.border}` }}>
                                                    <div style={{ color: THEME.muted, fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '4px' }}>LIFTS/FLOOR</div>
                                                    <div style={{ fontWeight: 'bold', fontSize: '1rem', color: THEME.text }}>{activeTower.lift_per_floor || 'N/A'}</div>
                                                </div>
                                                <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '8px', border: `1px solid ${THEME.border}` }}>
                                                    <div style={{ color: THEME.muted, fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '4px' }}>TOTAL UNITS</div>
                                                    <div style={{ fontWeight: 'bold', fontSize: '1rem', color: THEME.text }}>{activeTower.total_units || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

                        {project.property_type === 'Plots' && project.phases?.length > 0 && (
                            <div id="phases" style={{ background: THEME.card, padding: '30px', borderRadius: '24px', border: `1px solid ${THEME.border}`, color: THEME.text, boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
                                <h3 style={{ marginTop: 0, marginBottom: '25px', fontSize: '1.2rem', color: THEME.gold, borderBottom: `1px solid ${THEME.border}`, paddingBottom: '15px' }}>TOTAL PHASES</h3>
                                
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'thin' }}>
                                    {project.phases.map((phase, pIdx) => (
                                        <button 
                                            key={pIdx}
                                            onClick={() => setActivePhaseIndex(pIdx)}
                                            style={{
                                                flexShrink: 0,
                                                padding: '8px 20px', 
                                                background: activePhaseIndex === pIdx ? `${THEME.gold}15` : 'transparent',
                                                color: activePhaseIndex === pIdx ? THEME.gold : THEME.muted,
                                                border: `1px solid ${activePhaseIndex === pIdx ? THEME.gold : THEME.border}`,
                                                borderRadius: '8px', 
                                                fontWeight: 'bold', 
                                                cursor: 'pointer', 
                                                whiteSpace: 'nowrap', 
                                                transition: 'all 0.2s', 
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            {phase.name}
                                        </button>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                    {project.phases[activePhaseIndex] && (
                                        <div className="animate-fade-in" style={{ paddingBottom: '10px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                                                <span style={{ fontWeight: '800', color: THEME.text, textTransform: 'uppercase', fontSize: '1.1rem' }}>{project.phases[activePhaseIndex].name}</span>
                                                <span style={{ background: `${THEME.gold}15`, color: THEME.gold, padding: '4px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>{project.phases[activePhaseIndex].total_units} UNITS</span>
                                            </div>
                                            <div style={{ display: 'grid', gap: '12px' }}>
                                                {project.phases[activePhaseIndex].plot_distributions?.map((dist, dIdx) => (
                                                    <div key={dIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FAFAFA', padding: '12px 15px', borderRadius: '10px', border: `1px solid ${THEME.border}` }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: THEME.gold }} />
                                                            <span style={{ color: THEME.text, fontWeight: '500' }}>{dist.count} Plots</span>
                                                        </div>
                                                        <span style={{ fontWeight: '700', color: THEME.gold }}>{dist.size} Sq.ft</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
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
                
                <FooterFilters />
                <div style={{ height: '100px' }}></div>
            </div>

            {/* RERA Modal */}
            {isReraModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(10px)' }}>
                    <div style={{ background: '#FFF', width: '100%', maxWidth: '400px', borderRadius: '24px', padding: '40px', position: 'relative', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                        <button onClick={() => setIsReraModalOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#F5F5F5', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontWeight: 'bold' }}>✕</button>
                        <div style={{ width: '60px', height: '60px', background: '#E8F5E9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <BadgeCheck size={32} color="#4CAF50" />
                        </div>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginBottom: '10px', color: '#1A1A1A' }}>RERA Registered</h3>
                        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '25px', lineHeight: '1.5' }}>This project is officially registered with the Real Estate Regulatory Authority.</p>
                        <div style={{ 
                            background: '#F9F9F9', 
                            padding: '15px', 
                            borderRadius: '12px', 
                            border: '1px dashed #DDD', 
                            fontSize: '1rem', 
                            fontWeight: 'bold', 
                            color: THEME.gold, 
                            letterSpacing: '1px',
                            wordBreak: 'break-word',
                            overflowWrap: 'anywhere',
                            lineHeight: '1.4'
                        }}>
                            {project.rera_id}
                        </div>
                        <button onClick={() => setIsReraModalOpen(false)} style={{ marginTop: '30px', width: '100%', padding: '14px', background: '#1A1A1A', color: '#FFF', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>CLOSE</button>
                    </div>
                </div>
            )}

            {isBrochureModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(5px)' }}>
                    <div style={{ background: THEME.card, width: '100%', maxWidth: '450px', borderRadius: '16px', border: `1px solid ${THEME.border}`, padding: '40px', position: 'relative', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', color: THEME.text }}>
                        <button onClick={() => setIsBrochureModalOpen(false)} style={{ position: 'absolute', top: '25px', right: '25px', background: 'none', border: 'none', color: THEME.muted, cursor: 'pointer' }}>✕</button>
                        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                            <div style={{ width: '70px', height: '70px', background: `${THEME.gold}15`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: `1px solid ${THEME.gold}30` }}>
                                {hasUnlockedMaps ? <Download color={THEME.gold} size={30} /> : <Eye color={THEME.gold} size={30} />}
                            </div>
                            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', margin: '0 0 10px 0', color: THEME.text, fontWeight: '500' }}>
                                {hasUnlockedMaps ? 'Project Brochure' : 'Unlock Project Details'}
                            </h2>
                            <p style={{ color: THEME.muted, fontSize: '0.95rem', margin: 0 }}>
                                {hasUnlockedMaps 
                                    ? 'Enter your details to instantly download the premium project brochure.' 
                                    : 'Please share your details to unlock layout maps and floor plans for this project.'}
                            </p>
                        </div>
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
