import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import './SellerPortal.css';
import { CheckCircle } from 'lucide-react';

const SellerPortal = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [sellerType, setSellerType] = useState('Owner');
    
    const [form, setForm] = useState({
        name: '',
        mobile: '',
        email: '',
        property_type: 'Flat',
        area: '',
        project_name: '',
        address: '',
        developer_name: '',
        rera_id: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const type = queryParams.get('type');
        if (type === 'Developer' || type === 'Broker' || type === 'Owner') {
            setSellerType(type);
        }
    }, [location]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // We will save this into the valuations table with the type as 'seller_lead'
            // and we'll add the sellerType into the message or a dedicated field if possible.
            // Since we don't have a schema change right now, let's format it in the message.
            const messageStr = `[LEAD_TYPE: seller_${sellerType.toLowerCase()}]
Type: ${sellerType}
Property Type: ${form.property_type}
Area: ${form.area}
Project Name: ${form.project_name}
Address: ${form.address}
${sellerType === 'Developer' ? `Developer Name: ${form.developer_name}\nRERA ID: ${form.rera_id}` : ''}`.trim();

            const { error } = await supabase.from('valuations').insert([{
                name: form.name,
                email: form.email,
                phone: form.mobile,
                address: form.address,
                city: 'N/A',
                message: messageStr
            }]);

            if (error) throw error;
            setIsSubmitted(true);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="seller-portal-container">
                <div className="seller-card">
                    <div className="seller-card-header center">
                        <h3>THANK YOU</h3>
                    </div>
                    <div className="seller-card-body success-body">
                        <CheckCircle size={64} color="#65B741" style={{ marginBottom: '20px' }} />
                        <h2>We Will Contact You Soon</h2>
                        <p>Your details have been successfully submitted to our team.</p>
                        <button className="seller-btn primary" onClick={() => navigate('/')}>Return Home</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="seller-portal-container">
            <div className="seller-card">
                <div className="seller-card-header center">
                    <h3>{sellerType.toUpperCase()} DETAILS</h3>
                </div>
                
                <div className="seller-card-body">
                    <div className="seller-header-texts">
                        <h2>Join Nest Deal Realty</h2>
                        <p>Fill out the form below and our team will get in touch.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="seller-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="John Doe" />
                            </div>
                            <div className="form-group">
                                <label>Mobile Number</label>
                                <input type="tel" name="mobile" value={form.mobile} onChange={handleChange} required placeholder="+91 XXXXX XXXXX" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="john@example.com" />
                        </div>

                        {sellerType === 'Developer' && (
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Developer Name</label>
                                    <input type="text" name="developer_name" value={form.developer_name} onChange={handleChange} required placeholder="Developer Pvt Ltd" />
                                </div>
                                <div className="form-group">
                                    <label>RERA ID</label>
                                    <input type="text" name="rera_id" value={form.rera_id} onChange={handleChange} required placeholder="PR/GJ/..." />
                                </div>
                            </div>
                        )}

                        <div className="form-row">
                            <div className="form-group">
                                <label>Property Type</label>
                                <select name="property_type" value={form.property_type} onChange={handleChange}>
                                    <option value="Flat">Flat</option>
                                    <option value="Plot">Plot</option>
                                    <option value="Villa">Villa</option>
                                    <option value="Bungalow">Bungalow</option>
                                    <option value="Commercial">Commercial</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Area / Size</label>
                                <input type="text" name="area" value={form.area} onChange={handleChange} required placeholder="e.g. 1500 sq.ft" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Project Name</label>
                            <input type="text" name="project_name" value={form.project_name} onChange={handleChange} required placeholder="Name of the project or building" />
                        </div>

                        <div className="form-group">
                            <label>Address</label>
                            <input type="text" name="address" value={form.address} onChange={handleChange} required placeholder="Full property address" />
                        </div>

                        <div className="seller-form-actions">
                            <button type="button" className="seller-btn secondary" onClick={() => navigate('/')}>Cancel</button>
                            <button type="submit" className="seller-btn primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            {/* Background elements for Mac OS feel */}
            <div className="bg-blur-circle circle-1"></div>
            <div className="bg-blur-circle circle-2"></div>
        </div>
    );
};

export default SellerPortal;
