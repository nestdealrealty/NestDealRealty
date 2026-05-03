import React, { useEffect, useState } from 'react';
import { Building2, Bed, IndianRupee, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import './FeaturedProjects.css';

const FeaturedProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                // Fetch projects assigned to the featured strip slots (featured_strip_1 to featured_strip_5)
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .ilike('homepage_slot', 'featured_strip_%')
                    .eq('status', 'approved');

                if (error) throw error;
                
                if (data && data.length > 0) {
                    // Sort by slot index to ensure correct order
                    const sorted = data.sort((a, b) => {
                        const indexA = parseInt(a.homepage_slot.split('_').pop()) || 0;
                        const indexB = parseInt(b.homepage_slot.split('_').pop()) || 0;
                        return indexA - indexB;
                    });

                    // Map to the format expected by the UI
                    const mapped = sorted.map(p => {
                        // BHK Formatting
                        const bhkNums = [];
                        if (p.configurations) {
                            p.configurations.forEach(c => {
                                if (c.bedrooms) bhkNums.push(parseInt(c.bedrooms));
                            });
                        }
                        const sortedBhks = [...new Set(bhkNums)].sort((a, b) => a - b);
                        let bhkText = sortedBhks.length > 0 ? `${sortedBhks.join(', ')} BHK Flat` : '';
                        
                        if (p.penthouse_configurations?.length > 0 || p.duplex_penthouse_configurations?.length > 0) {
                            bhkText += (bhkText ? " & " : "") + "Penthouse";
                        }

                        // Image Selection
                        const imageUrl = (p.images?.[0]?.url || p.images?.[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000");

                        // Price Selection
                        let priceText = "Price on Request";
                        if (p.configurations?.[0]?.price) priceText = p.configurations[0].price;
                        else if (p.plot_config?.[0]?.price_per_sqft) priceText = `₹${p.plot_config[0].price_per_sqft}/sqft`;

                        return {
                            id: p.id,
                            name: p.name,
                            developer: p.developer,
                            bhk: bhkText || "Residential",
                            price: priceText,
                            image_url: imageUrl
                        };
                    });

                    setProjects(mapped);
                } else {
                    // Fallback sample data if nothing is assigned yet
                    setProjects([
                        {
                            id: 1,
                            name: "Skyline Residency",
                            developer: "Adani Realty",
                            bhk: "3 & 4 BHK Flat",
                            price: "1.85 Cr*",
                            image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000"
                        },
                        {
                            id: 2,
                            name: "Greenwood Estates",
                            developer: "Saanvi Developers",
                            bhk: "4 & 5 BHK Villas",
                            price: "4.20 Cr*",
                            image_url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1000"
                        },
                        {
                            id: 3,
                            name: "The Urban Haven",
                            developer: "Bakeri Group",
                            bhk: "2 & 3 BHK Flat",
                            price: "95 L*",
                            image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000"
                        },
                        {
                            id: 4,
                            name: "Riverfront Heights",
                            developer: "Pacifica Companies",
                            bhk: "3 BHK Flat & Penthouse",
                            price: "2.10 Cr*",
                            image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000"
                        },
                        {
                            id: 5,
                            name: "Aurum Villas",
                            developer: "True Value",
                            bhk: "5 BHK Luxury Villa",
                            price: "6.50 Cr*",
                            image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000"
                        },
                        {
                            id: 6,
                            name: "Skye 27",
                            developer: "Empire Group",
                            bhk: "4 BHK Flat",
                            price: "2.40 Cr*",
                            image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000"
                        },
                        {
                            id: 7,
                            name: "The Address",
                            developer: "Shivalik",
                            bhk: "3 BHK Flat",
                            price: "1.15 Cr*",
                            image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000"
                        },
                        {
                            id: 8,
                            name: "Zydus Heights",
                            developer: "Zydus Realty",
                            bhk: "4 & 5 BHK Flat",
                            price: "3.80 Cr*",
                            image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000"
                        },
                        {
                            id: 9,
                            name: "The Banyan",
                            developer: "Sheetal Infra",
                            bhk: "5 BHK Villa",
                            price: "7.25 Cr*",
                            image_url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1000"
                        },
                        {
                            id: 10,
                            name: "Magnolia",
                            developer: "Sun Builders",
                            bhk: "4 BHK Flat",
                            price: "2.10 Cr*",
                            image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000"
                        }
                    ]);
                }
            } catch (err) {
                console.error("Error fetching featured projects:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatured();
    }, []);

    if (loading) return <div className="featured-projects-section" style={{ height: '450px', background: '#0C1512' }}></div>;

    return (
        <section className="featured-projects-section">
            <div className="featured-container">
                {projects.map((project, index) => (
                    <div 
                        key={project.id} 
                        className={`featured-card ${index === 2 ? 'center-focus' : ''}`}
                        onClick={() => navigate(`/project/${project.id}`)}
                    >
                        <div className="featured-card-inner">
                            <img src={project.image_url} alt={project.name} className="featured-image" />
                            <div className="featured-overlay"></div>
                            
                            <div className="featured-content">
                                <h3 className="featured-project-name">{project.name}</h3>
                                <div className="featured-accent"></div>
                                
                                <div className="featured-details">
                                    <div className="detail-item">
                                        <Bed size={16} />
                                        <span>{project.bhk}</span>
                                    </div>
                                    <div className="detail-item">
                                        <Building2 size={16} />
                                        <span>{project.developer}</span>
                                    </div>
                                    <div className="detail-item">
                                        <IndianRupee size={16} />
                                        <span>{project.price} Onwards</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedProjects;
