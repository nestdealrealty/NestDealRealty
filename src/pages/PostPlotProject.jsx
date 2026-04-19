import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { 
    Plus, Trash2, Building2, IndianRupee, 
    Calendar, CheckCircle2, AlertCircle, Save, Loader2, 
    Image as ImageIcon, Video, ChevronRight,
    Map as MapIcon, Layers, Landmark, Sparkles, X, Upload, HardHat
} from 'lucide-react';
import { supabase } from '../supabase';
import { useNavigate, useSearchParams } from 'react-router-dom';

const THEME = {
    primary: '#1B4D3E',
    gold: '#D4AF37',
    text: '#FFFFFF',
    muted: '#A0AEC0',
    border: 'rgba(212, 175, 55, 0.2)',
    cardBg: '#121A16',
    inputBg: '#070B09',
    red: '#F56565'
};

const PostPlotProject = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);

    const { register, control, handleSubmit, formState: { errors }, watch, setValue } = useForm({
        defaultValues: {
            project_name: searchParams.get('name') || '',
            tagline: '',
            description: '',
            developer: searchParams.get('developer') || '',
            locality: '',
            city: 'Ahmedabad',
            state: 'Gujarat',
            property_type: 'Plots',
            construction_status: 'Upcoming',
            phases: [{ name: '', num_plots: '' }],
            property_types: [{ name: '', configuration: '', size: '', price: '', architect: '' }],
            landmarks: [{ name: '', distance: '' }],
            amenities: [],
            price_min: '',
            price_max: '',
            price_per_sq_yard: '',
            plot_size_min: '',
            plot_size_max: '',
            total_plots: '',
            sba_percent: '',
            construction_percent: '',
            possession_date: '',
            video_url: ''
        }
    });

    const { fields: phaseFields, append: appendPhase, remove: removePhase } = useFieldArray({ control, name: "phases" });
    const { fields: typeFields, append: appendType, remove: removeType } = useFieldArray({ control, name: "property_types" });
    const { fields: landmarkFields, append: appendLandmark, remove: removeLandmark } = useFieldArray({ control, name: "landmarks" });

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(prev => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        setPreviews(prev => prev.filter((_, i) => i !== index));
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const imageUrls = [];
            for (const file of images) {
                const fileName = `${Date.now()}-${file.name}`;
                const { error: uploadError } = await supabase.storage.from('project-media').upload(`${fileName}`, file);
                if (uploadError) throw uploadError;
                const { data: { publicUrl } } = supabase.storage.from('project-media').getPublicUrl(fileName);
                imageUrls.push({ url: publicUrl, category: 'General' });
            }

            const projectPayload = {
                name: data.project_name,
                developer: data.developer,
                locality: data.locality,
                city: data.city,
                property_type: 'Plots',
                construction_status: data.construction_status,
                description: data.description,
                tagline: data.tagline,
                price_range: `₹${data.price_min} - ₹${data.price_max}`,
                total_plot_area: `${data.plot_size_min} - ${data.plot_size_max} Sq.Yd`,
                possession_date: data.possession_date,
                video_url: data.video_url,
                amenities: data.amenities,
                images: imageUrls,
                status: 'pending'
            };

            const { data: project, error: projectError } = await supabase.from('projects').insert([projectPayload]).select().single();
            if (projectError) throw projectError;
            const projectId = project.id;

            if (data.phases.length > 0) await supabase.from('project_phases').insert(data.phases.filter(p => p.name).map(p => ({ ...p, project_id: projectId })));
            if (data.property_types.length > 0) await supabase.from('project_property_types').insert(data.property_types.filter(t => t.name).map(t => ({ ...t, project_id: projectId })));
            if (data.landmarks.length > 0) await supabase.from('project_landmarks').insert(data.landmarks.filter(l => l.name).map(l => ({ ...l, project_id: projectId })));

            alert("Project Uploaded Successfully! Pending Admin Approval.");
            navigate('/admin');
        } catch (error) {
            console.error(error);
            alert("Error: " + error.message);
        } finally { setIsSubmitting(false); }
    };

    const Section = ({ title, icon: Icon, children }) => (
        <div style={{ background: THEME.cardBg, padding: '40px', borderRadius: '16px', border: `1px solid ${THEME.border}`, marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <div style={{ padding: '12px', background: `${THEME.gold}20`, borderRadius: '12px', color: THEME.gold }}><Icon size={24} /></div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontFamily: 'Outfit, sans-serif' }}>{title}</h2>
            </div>
            {children}
        </div>
    );

    const renderInput = (label, name, placeholder, type = "text", error) => (
        <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: THEME.muted, fontSize: '0.85rem', marginBottom: '8px' }}>{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                {...register(name)}
                style={{
                    width: '100%', padding: '12px 15px', background: THEME.inputBg, border: `1px solid ${error ? THEME.red : THEME.border}`,
                    borderRadius: '8px', color: THEME.text, outline: 'none'
                }}
            />
            {error && <span style={{ color: THEME.red, fontSize: '0.75rem' }}>{error.message}</span>}
        </div>
    );

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', background: 'transparent' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <p style={{ color: THEME.gold, fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '5px' }}>CATEGORY: PLOTS</p>
                    <h1 style={{ fontSize: '2.5rem', margin: 0, fontFamily: 'Outfit, sans-serif' }}>Plot Project Details</h1>
                </div>
                <button onClick={() => navigate(-1)} style={{ padding: '10px 20px', background: 'transparent', color: THEME.text, border: `1px solid ${THEME.border}`, borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                
                <Section title="Basic Information" icon={Building2}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {renderInput("Project Name", "project_name", "e.g. Rameshwar Dream", "text", errors.project_name)}
                        {renderInput("Developer Name", "developer", "e.g. Rameshwar Group")}
                        <div style={{ gridColumn: '1 / -1' }}>
                            {renderInput("Tagline / Short Line", "tagline", "Your dream space awaits...")}
                        </div>
                        <div style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
                            <label style={{ display: 'block', color: THEME.muted, fontSize: '0.85rem', marginBottom: '8px' }}>Description</label>
                            <textarea {...register("description")} rows={4} style={{ width: '100%', padding: '15px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, borderRadius: '8px', color: THEME.text, outline: 'none', resize: 'none' }} />
                        </div>
                        {renderInput("Area / Locality", "locality", "e.g. Kasindra")}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', color: THEME.muted, fontSize: '0.85rem', marginBottom: '8px' }}>City</label>
                            <select {...register("city")} style={{ width: '100%', padding: '12px 15px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, borderRadius: '8px', color: THEME.text, outline: 'none' }}>
                                <option>Ahmedabad</option>
                                <option>Gandhinagar</option>
                            </select>
                        </div>
                    </div>
                </Section>

                <Section title="Pricing & Plot Details" icon={IndianRupee}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                        {renderInput("Min Price (₹)", "price_min", "1.2")}
                        {renderInput("Max Price (₹)", "price_max", "2.5")}
                        {renderInput("Price / Sq.Yard", "price_per_sq_yard", "25000")}
                        {renderInput("Min Size (Sq.Yd)", "plot_size_min", "150")}
                        {renderInput("Max Size (Sq.Yd)", "plot_size_max", "500")}
                        {renderInput("Total Plots", "total_plots", "150")}
                    </div>
                </Section>

                <Section title="Project Phases" icon={Layers}>
                    {phaseFields.map((field, index) => (
                        <div key={field.id} style={{ display: 'flex', gap: '15px', marginBottom: '15px', alignItems: 'center', background: '#00000030', padding: '15px', borderRadius: '12px' }}>
                            <div style={{ flex: 1 }}>{renderInput(`Phase ${index + 1} Name`, `phases.${index}.name`, "e.g. Phase 1")}</div>
                            <div style={{ width: '100px' }}>{renderInput("Plots", `phases.${index}.num_plots`, "100", "number")}</div>
                            <button type="button" onClick={() => removePhase(index)} style={{ padding: '12px', background: 'transparent', color: THEME.red, border: 'none', cursor: 'pointer', marginTop: '10px' }}><Trash2 size={20} /></button>
                        </div>
                    ))}
                    <button type="button" onClick={() => appendPhase({ name: '', num_plots: '' })} style={{ background: 'none', border: `1px dashed ${THEME.gold}`, color: THEME.gold, padding: '12px', borderRadius: '8px', width: '100%', cursor: 'pointer' }}>+ Add Project Phase</button>
                </Section>

                <Section title="Property Types & Architect" icon={MapIcon}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                            <thead>
                                <tr style={{ color: THEME.muted, fontSize: '0.8rem', textAlign: 'left' }}>
                                    <th style={{ padding: '10px' }}>NAME</th>
                                    <th style={{ padding: '10px' }}>CONFIG</th>
                                    <th style={{ padding: '10px' }}>SIZE</th>
                                    <th style={{ padding: '10px' }}>PRICE</th>
                                    <th style={{ padding: '10px' }}>ARCHITECT</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {typeFields.map((field, index) => (
                                    <tr key={field.id} style={{ borderBottom: `1px solid ${THEME.border}` }}>
                                        <td style={{ padding: '10px' }}><input {...register(`property_types.${index}.name`)} style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%' }} placeholder="Goldfinch" /></td>
                                        <td style={{ padding: '10px' }}><input {...register(`property_types.${index}.configuration`)} style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%' }} placeholder="2BHK" /></td>
                                        <td style={{ padding: '10px' }}><input {...register(`property_types.${index}.size`)} style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%' }} placeholder="200" /></td>
                                        <td style={{ padding: '10px' }}><input {...register(`property_types.${index}.price`)} style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%' }} placeholder="85L" /></td>
                                        <td style={{ padding: '10px' }}><input {...register(`property_types.${index}.architect`)} style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%' }} placeholder="D&A" /></td>
                                        <td style={{ padding: '10px' }}>
                                            <button type="button" onClick={() => removeType(index)} style={{ background: 'none', border: 'none', color: THEME.red, cursor: 'pointer' }}><X size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button type="button" onClick={() => appendType({ name: '', configuration: '', size: '', price: '', architect: '' })} style={{ background: 'none', border: `1px dashed ${THEME.gold}`, color: THEME.gold, padding: '10px', borderRadius: '8px', width: '100%', cursor: 'pointer' }}>+ Add Row</button>
                </Section>

                <Section title="Media & Assets" icon={ImageIcon}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                        <div style={{ border: `2px dashed ${THEME.border}`, borderRadius: '12px', padding: '40px', textAlign: 'center', cursor: 'pointer', position: 'relative' }}>
                            <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                            <Upload size={40} color={THEME.gold} style={{ marginBottom: '15px' }} />
                            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>Upload Project Images</p>
                            <p style={{ color: THEME.muted, fontSize: '0.8rem' }}>Drag & drop images here</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px' }}>
                            {previews.map((src, i) => (
                                <div key={i} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden', border: `1px solid ${THEME.border}` }}>
                                    <img src={src} style={{ width: '100%', height: '100%', objectCover: 'cover' }} />
                                    <button onClick={(e) => { e.preventDefault(); removeImage(i); }} style={{ position: 'absolute', top: '2px', right: '2px', background: THEME.red, border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', padding: '2px' }}><X size={12} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        {renderInput("Video Tour URL", "video_url", "https://youtube.com/watch?v=...")}
                    </div>
                </Section>

                <Section title="Possession & Status" icon={Calendar}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', color: THEME.muted, fontSize: '0.85rem', marginBottom: '8px' }}>Construction Status</label>
                            <select {...register("construction_status")} style={{ width: '100%', padding: '12px 15px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, borderRadius: '8px', color: THEME.text, outline: 'none' }}>
                                <option>Upcoming</option>
                                <option>Under Construction</option>
                                <option>Ready to Move</option>
                            </select>
                        </div>
                        {renderInput("Posession Date", "possession_date", "", "date")}
                    </div>
                </Section>

                <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'center' }}>
                    <button 
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        style={{ 
                            padding: '15px 60px', background: THEME.gold, color: '#000', border: 'none', 
                            borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '10px', opacity: isSubmitting ? 0.7 : 1
                        }}
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                        {isSubmitting ? 'SUBMITTING...' : 'FINISH & UPLOAD PROJECT'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default PostPlotProject;
