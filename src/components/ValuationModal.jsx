import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import './ValuationModal.css';

const ValuationModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        whatsapp: '',
        email: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'name') {
            // Allow only letters and spaces
            if (/^[a-zA-Z\s]*$/.test(value)) {
                setFormData({ ...formData, [name]: value });
            }
        } else if (name === 'mobile' || name === 'whatsapp') {
            // Allow only numbers and max 10 digits
            if (/^\d*$/.test(value) && value.length <= 10) {
                setFormData({ ...formData, [name]: value });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call delay to feel like processing
        await new Promise(resolve => setTimeout(resolve, 1500));

        setLoading(false);
        setIsSubmitted(true);
        // In future: Save to Supabase 'valuations' table
    };

    const handleClose = () => {
        // Reset state only after modal closes
        setIsSubmitted(false);
        setFormData({ name: '', mobile: '', whatsapp: '', email: '' });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={handleClose}>
                    <X size={24} />
                </button>

                {isSubmitted ? (
                    <div className="success-view">
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                            <CheckCircle size={50} color="var(--accent)" />
                        </div>
                        <h3 className="success-title">Thank You!</h3>
                        <p className="success-message">
                            Your valuation request has been received.
                            <br /><br />
                            Our team will review your details and reach out to you as soon as possible via WhatsApp or Email.
                        </p>
                        <button className="modal-submit-btn" onClick={handleClose}>
                            Close
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="modal-header">
                            <h2>Book a Valuation</h2>
                            <p>Get a free, accurate estimate for your property</p>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-input-group">
                                <label>Your Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your full name"
                                    required
                                    className="modal-input"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-input-group">
                                <label>Mobile Number</label>
                                <input
                                    type="tel"
                                    name="mobile"
                                    placeholder="+91 XXXXX XXXXX"
                                    required
                                    className="modal-input"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-input-group">
                                <label>WhatsApp Number</label>
                                <input
                                    type="tel"
                                    name="whatsapp"
                                    placeholder="Same as mobile?"
                                    className="modal-input"
                                    value={formData.whatsapp}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-input-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="name@example.com"
                                    required
                                    className="modal-input"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <button type="submit" disabled={loading} className="modal-submit-btn">
                                {loading ? 'Sending Request...' : 'Get Free Valuation'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ValuationModal;
