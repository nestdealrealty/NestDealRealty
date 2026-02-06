import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calculator, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import './AdminDashboard.css'; // Reusing some base layout styles

const EmiCalculator = () => {
    const [loanAmount, setLoanAmount] = useState(5000000);
    const [tenure, setTenure] = useState(20);
    const [interest, setInterest] = useState(8.5);
    const [monthlyEmi, setMonthlyEmi] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);

    useEffect(() => {
        const p = loanAmount;
        const r = interest / 12 / 100;
        const n = tenure * 12;

        const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalPay = emi * n;
        const totalInt = totalPay - p;

        setMonthlyEmi(Math.round(emi));
        setTotalPayment(Math.round(totalPay));
        setTotalInterest(Math.round(totalInt));
    }, [loanAmount, tenure, interest]);

    return (
        <div className="admin-page" style={{ padding: '40px 0' }}>
            <div className="admin-container">
                <div className="admin-header">
                    <div className="header-left">
                        <Link to="/" className="back-link">
                            <ArrowLeft size={18} /> Back to Site
                        </Link>
                        <h1>Home Loan EMI Calculator</h1>
                        <p>Plan your finances with precision for your dream home.</p>
                    </div>
                </div>

                <div className="layout-grid-premium" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '30px' }}>
                    <div className="sidebar-card" style={{ height: 'fit-content' }}>
                        <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
                            <Calculator size={20} /> Input Details
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginTop: '20px' }}>
                            <div className="input-group-home">
                                <label style={{ color: 'var(--accent)', fontWeight: '700' }}>Loan Amount (₹)</label>
                                <input
                                    type="range" min="100000" max="100000000" step="100000"
                                    value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))}
                                    style={{ width: '100%', accentColor: 'var(--accent)' }}
                                />
                                <input
                                    type="number" value={loanAmount}
                                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                                    style={{ background: '#1a2420', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '8px', color: 'white', marginTop: '10px' }}
                                />
                            </div>

                            <div className="input-group-home">
                                <label style={{ color: 'var(--accent)', fontWeight: '700' }}>Tenure (Years)</label>
                                <input
                                    type="range" min="1" max="30" step="1"
                                    value={tenure} onChange={(e) => setTenure(Number(e.target.value))}
                                    style={{ width: '100%', accentColor: 'var(--accent)' }}
                                />
                                <div style={{ color: 'white', marginTop: '10px', textAlign: 'right', fontWeight: 'bold' }}>{tenure} Years</div>
                            </div>

                            <div className="input-group-home">
                                <label style={{ color: 'var(--accent)', fontWeight: '700' }}>Interest Rate (% PA)</label>
                                <input
                                    type="range" min="5" max="15" step="0.1"
                                    value={interest} onChange={(e) => setInterest(Number(e.target.value))}
                                    style={{ width: '100%', accentColor: 'var(--accent)' }}
                                />
                                <div style={{ color: 'white', marginTop: '10px', textAlign: 'right', fontWeight: 'bold' }}>{interest}%</div>
                            </div>
                        </div>
                    </div>

                    <div className="sidebar-card" style={{ background: 'linear-gradient(135deg, #121A16, #070B09)', border: '1px solid var(--accent)' }}>
                        <h3 style={{ color: 'var(--white)' }}>Payment Summary</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginTop: '30px' }}>
                            <div style={{ textAlign: 'center', padding: '30px', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '15px' }}>
                                <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Monthly EMI</span>
                                <span style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--accent)' }}>₹{monthlyEmi.toLocaleString()}</span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <TrendingUp size={20} color="var(--accent-orange)" />
                                    <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '10px' }}>TOTAL INTEREST</span>
                                    <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'white' }}>₹{totalInterest.toLocaleString()}</span>
                                </div>
                                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <DollarSign size={20} color="var(--accent)" />
                                    <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '10px' }}>TOTAL PAYMENT</span>
                                    <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'white' }}>₹{totalPayment.toLocaleString()}</span>
                                </div>
                            </div>

                            <button className="big-search-btn" style={{ width: '100%', marginTop: '10px' }}>
                                Request Loan Assistance
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmiCalculator;
