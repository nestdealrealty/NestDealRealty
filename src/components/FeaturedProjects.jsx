import React, { useEffect, useState } from 'react';
import { Building2, Bed, IndianRupee, ChevronRight } from 'lucide-react';
import { supabase } from '../supabase';
import './FeaturedProjects.css';

const FeaturedProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const { data, error } = await supabase
                    .from('featured_projects')
                    .select('*')
                    .order('created_at', { ascending: true })
                    .limit(5);

                if (error) throw error;
                if (data && data.length > 0) {
                    setProjects(data);
                } else {
                    // Fallback sample data for design demonstration
                    setProjects([
                        {
                            id: 1,
                            name: "Skyline Residency",
                            developer: "Adani Realty",
                            bhk: "3 & 4 BHK",
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
                            bhk: "2 & 3 BHK",
                            price: "95 L*",
                            image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000"
                        },
                        {
                            id: 4,
                            name: "Riverfront Heights",
                            developer: "Pacifica Companies",
                            bhk: "3 BHK Premium",
                            price: "2.10 Cr*",
                            image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000"
                        },
                        {
                            id: 5,
                            name: "Aurum Villas",
                            developer: "True Value",
                            bhk: "5 BHK Luxury",
                            price: "6.50 Cr*",
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
