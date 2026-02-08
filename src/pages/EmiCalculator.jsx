import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Calculator, TrendingUp, DollarSign, PieChart, CheckCircle, Activity, Wallet } from 'lucide-react';
import './AdminDashboard.css';

const EmiCalculator = () => {
    const [searchParams] = useSearchParams();
    const initialMode = searchParams.get('mode') || 'emi';
    const [activeTab, setActiveTab] = useState(initialMode);

    // --- EMI CALCULATOR STATE ---
    const [emiLoan, setEmiLoan] = useState(5000000);
    const [emiTenure, setEmiTenure] = useState(20);
    const [emiRate, setEmiRate] = useState(8.5);
    const [emiData, setEmiData] = useState({ monthly: 0, totalInt: 0, totalPay: 0 });

    // --- ELIGIBILITY CALCULATOR STATE ---
    const [eligIncome, setEligIncome] = useState(100000);
    const [eligRate, setEligRate] = useState(8.5);
    const [eligTenure, setEligTenure] = useState(20);
    const [existingEmi, setExistingEmi] = useState(0);
    const [eligAmount, setEligAmount] = useState(0);

    // --- AFFORDABILITY CALCULATOR STATE ---
    const [affordEmi, setAffordEmi] = useState(30000);
    const [affordRate, setAffordRate] = useState(8.5);
    const [affordTenure, setAffordTenure] = useState(20);
    const [affordLoan, setAffordLoan] = useState(0);


    // --- CALCULATIONS ---

    // 1. EMI Calculation
    useEffect(() => {
        const calculateEMI = () => {
            const P = emiLoan;
            const R = emiRate / 12 / 100;
            const N = emiTenure * 12;

            if (P === 0 || R === 0 || N === 0) return;

            const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
            const totalPay = emi * N;
            const totalInt = totalPay - P;

            setEmiData({
                monthly: Math.round(emi),
                totalInt: Math.round(totalInt),
                totalPay: Math.round(totalPay)
            });
        };
        calculateEMI();
    }, [emiLoan, emiTenure, emiRate]);

    // 2. Eligibility Calculation (simplified logic used by banks)
    useEffect(() => {
        const calculateEligibility = () => {
            // Assumed FOIR (Fixed Obligation to Income Ratio) is 60%
            const netAvailableIncome = (eligIncome * 0.60) - existingEmi;

            if (netAvailableIncome <= 0) {
                setEligAmount(0);
                return;
            }

            // Reverse EMI Formula to find P
            // E = P * r * (1+r)^n / ((1+r)^n - 1)
            // P = E * ((1+r)^n - 1) / (r * (1+r)^n)

            const R = eligRate / 12 / 100;
            const N = eligTenure * 12;

            const maxLoan = netAvailableIncome * (Math.pow(1 + R, N) - 1) / (R * Math.pow(1 + R, N));
            setEligAmount(Math.round(maxLoan));
        };
        calculateEligibility();
    }, [eligIncome, eligRate, eligTenure, existingEmi]);

    // 3. Affordability Calculation
    useEffect(() => {
        const calculateAffordability = () => {
            const R = affordRate / 12 / 100;
            const N = affordTenure * 12;

            // P = E * ((1+r)^n - 1) / (r * (1+r)^n)

            if (affordEmi <= 0) {
                setAffordLoan(0);
                return;
            }

            const maxLoan = affordEmi * (Math.pow(1 + R, N) - 1) / (R * Math.pow(1 + R, N));
            setAffordLoan(Math.round(maxLoan));
        };
        calculateAffordability();
    }, [affordEmi, affordRate, affordTenure]);


    const formatCurrency = (val) => {
        return val.toLocaleString('en-IN', {
            maximumFractionDigits: 0,
            style: 'currency',
            currency: 'INR'
        });
    };

    return (
        <div className="admin-page" style={{ padding: '40px 0', minHeight: '100vh' }}>
            <div className="admin-container">

                {/* Header */}
                <div className="admin-header" style={{ marginBottom: '30px' }}>
                    <div className="header-left">
                        <Link to="/" className="back-link">
                            <ArrowLeft size={18} /> Back to Site
                        </Link>
                        <h1>Financial Planning Tools</h1>
                        <p>Calculate EMI, check eligibility, and estimate affordability.</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="calc-tabs" style={{ display: 'flex', gap: '15px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                    <button
                        onClick={() => setActiveTab('emi')}
                        style={{
                            padding: '10px 20px',
                            background: activeTab === 'emi' ? 'var(--accent)' : 'transparent',
                            color: activeTab === 'emi' ? 'black' : 'var(--text-muted)',
                            border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer'
                        }}
                    >
                        EMI Calculator
                    </button>
                    <button
                        onClick={() => setActiveTab('eligibility')}
                        style={{
                            padding: '10px 20px',
                            background: activeTab === 'eligibility' ? 'var(--accent)' : 'transparent',
                            color: activeTab === 'eligibility' ? 'black' : 'var(--text-muted)',
                            border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer'
                        }}
                    >
                        Eligibility Calculator
                    </button>
                    <button
                        onClick={() => setActiveTab('affordability')}
                        style={{
                            padding: '10px 20px',
                            background: activeTab === 'affordability' ? 'var(--accent)' : 'transparent',
                            color: activeTab === 'affordability' ? 'black' : 'var(--text-muted)',
                            border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer'
                        }}
                    >
                        Affordability Calculator
                    </button>
                </div>


                <div className="layout-grid-premium" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '40px' }}>

                    {/* INPUT SECTION */}
                    <div className="sidebar-card" style={{ height: 'fit-content' }}>
                        <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Calculator size={20} color="var(--accent)" /> Input Details
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginTop: '20px' }}>

                            {/* EMI INPUTS */}
                            {activeTab === 'emi' && (
                                <>
                                    <InputGroup label="Loan Amount (₹)" val={emiLoan} setVal={setEmiLoan} min={100000} max={100000000} step={50000} />
                                    <InputGroup label="Tenure (Years)" val={emiTenure} setVal={setEmiTenure} min={1} max={30} step={1} suffix=" Years" />
                                    <InputGroup label="Interest Rate (% PA)" val={emiRate} setVal={setEmiRate} min={5} max={15} step={0.1} suffix="%" />
                                </>
                            )}

                            {/* ELIGIBILITY INPUTS */}
                            {activeTab === 'eligibility' && (
                                <>
                                    <InputGroup label="Gross Monthly Income (₹)" val={eligIncome} setVal={setEligIncome} min={20000} max={10000000} step={5000} />
                                    <InputGroup label="Interest Rate (%)" val={eligRate} setVal={setEligRate} min={5} max={15} step={0.1} suffix="%" />
                                    <InputGroup label="Loan Tenure (Years)" val={eligTenure} setVal={setEligTenure} min={1} max={30} step={1} suffix=" Years" />
                                    <InputGroup label="Existing Monthly EMIs (₹)" val={existingEmi} setVal={setExistingEmi} min={0} max={500000} step={1000} />
                                </>
                            )}

                            {/* AFFORDABILITY INPUTS */}
                            {activeTab === 'affordability' && (
                                <>
                                    <InputGroup label="EMI You Can Pay (₹)" val={affordEmi} setVal={setAffordEmi} min={5000} max={500000} step={1000} />
                                    <InputGroup label="Interest Rate (%)" val={affordRate} setVal={setAffordRate} min={5} max={15} step={0.1} suffix="%" />
                                    <InputGroup label="Tenure (Years)" val={affordTenure} setVal={setAffordTenure} min={1} max={30} step={1} suffix=" Years" />
                                </>
                            )}

                        </div>
                    </div>

                    {/* RESULT SECTION */}
                    <div className="sidebar-card" style={{ background: 'linear-gradient(135deg, #121A16, #070B09)', border: '1px solid var(--accent)' }}>
                        <h3 style={{ color: 'var(--white)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <Activity size={20} /> Result
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginTop: '30px' }}>

                            {/* EMI RESULT */}
                            {activeTab === 'emi' && (
                                <>
                                    <ResultBox title="Monthly EMI" value={formatCurrency(emiData.monthly)} huge />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <ResultBox title="Total Interest" value={formatCurrency(emiData.totalInt)} />
                                        <ResultBox title="Total Payment" value={formatCurrency(emiData.totalPay)} />
                                    </div>
                                </>
                            )}

                            {/* ELIGIBILITY RESULT */}
                            {activeTab === 'eligibility' && (
                                <>
                                    <ResultBox title="Maximum Eligible Loan" value={formatCurrency(eligAmount)} huge />
                                    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '0.9rem', color: '#ccc', lineHeight: '1.6' }}>
                                        <CheckCircle size={16} color="var(--accent)" style={{ display: 'inline', marginRight: '5px' }} />
                                        Based on a standard 60% FOIR (Fixed Obligation to Income Ratio). Your newly applicable EMI capacity is approx <strong>{formatCurrency((eligIncome * 0.60) - existingEmi)}</strong>.
                                    </div>
                                </>
                            )}

                            {/* AFFORDABILITY RESULT */}
                            {activeTab === 'affordability' && (
                                <>
                                    <ResultBox title="Affordable Loan Amount" value={formatCurrency(affordLoan)} huge />
                                    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                                        If you can pay <strong>{formatCurrency(affordEmi)}</strong> monthly, you can afford a home loan of approximately <strong>{formatCurrency(affordLoan)}</strong>.
                                    </div>
                                </>
                            )}

                            <button className="big-search-btn" style={{ width: '100%', marginTop: '10px' }}>
                                Contact Agent for Loan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-components for cleaner code
const InputGroup = ({ label, val, setVal, min, max, step, suffix }) => (
    <div className="input-group-home">
        <label style={{ color: 'var(--accent)', fontWeight: '700', fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>{label}</label>
        <input
            type="range" min={min} max={max} step={step}
            value={val} onChange={(e) => setVal(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent)' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            <span style={{ color: '#666', fontSize: '0.8rem' }}>{min}{suffix}</span>
            <input
                type="number" value={val}
                onChange={(e) => setVal(Number(e.target.value))}
                style={{ background: '#1a2420', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '6px', color: 'white', width: '100px', textAlign: 'right' }}
            />
        </div>
    </div>
);

const ResultBox = ({ title, value, huge }) => (
    <div style={{
        textAlign: 'center',
        padding: huge ? '30px' : '20px',
        background: huge ? 'rgba(212, 175, 55, 0.05)' : 'rgba(255,255,255,0.02)',
        borderRadius: '15px',
        border: huge ? 'none' : '1px solid rgba(255,255,255,0.05)'
    }}>
        <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>{title}</span>
        <span style={{ fontSize: huge ? '2.5rem' : '1.2rem', fontWeight: '800', color: huge ? 'var(--accent)' : 'white' }}>{value}</span>
    </div>
);

export default EmiCalculator;
