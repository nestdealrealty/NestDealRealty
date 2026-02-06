import React, { useState, useEffect } from 'react';
import { Trash2, User, Phone, Mail, Clock, Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [enquiries, setEnquiries] = useState([]);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('nestdeal_enquiries') || '[]');
        setEnquiries(data);
    }, []);

    const deleteEnquiry = (id) => {
        const updated = enquiries.filter(item => item.id !== id);
        setEnquiries(updated);
        localStorage.setItem('nestdeal_enquiries', JSON.stringify(updated));
    };

    return (
        <div className="admin-page">
            <div className="admin-container">
                <div className="admin-header">
                    <div className="header-left">
                        <Link to="/" className="back-link">
                            <ArrowLeft size={18} /> Back to Site
                        </Link>
                        <h1>Admin Dashboard</h1>
                        <p>Manage your property enquiries in one place.</p>
                    </div>
                    <div className="stats-header">
                        <div className="stat-pill">
                            <span className="count">{enquiries.length}</span>
                            <span className="label">Total Enquiries</span>
                        </div>
                    </div>
                </div>

                <div className="enquiries-list">
                    {enquiries.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📂</div>
                            <h3>No enquiries yet</h3>
                            <p>Customer details will appear here once they submit a form.</p>
                        </div>
                    ) : (
                        <div className="table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>NAME</th>
                                        <th>CONTACT DETAILS</th>
                                        <th>PROPERTY</th>
                                        <th>DATE/TIME</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {enquiries.map((item) => (
                                        <tr key={item.id} className="enquiry-row">
                                            <td className="name-cell">
                                                <div className="avatar-small">
                                                    {item.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span>{item.name}</span>
                                            </td>
                                            <td className="contact-cell">
                                                <div className="contact-info">
                                                    <div className="info-item"><Phone size={14} /> {item.phone}</div>
                                                    <div className="info-item"><Mail size={14} /> {item.email}</div>
                                                </div>
                                            </td>
                                            <td className="prop-cell">
                                                <div className="prop-label">
                                                    <Home size={14} /> {item.property}
                                                </div>
                                            </td>
                                            <td className="date-cell">
                                                <div className="date-info">
                                                    <Clock size={14} /> {item.date}
                                                </div>
                                            </td>
                                            <td className="action-cell">
                                                <button
                                                    className="delete-btn"
                                                    onClick={() => deleteEnquiry(item.id)}
                                                    title="Delete Enquiry"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
