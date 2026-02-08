import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Calculator, Activity, CheckCircle, Smartphone, Mail, User as UserIcon } from 'lucide-react';
import LoanModal from '../components/LoanModal';
import './AdminDashboard.css';

const EmiCalculator = () => {
    const [searchParams] = useSearchParams();
    const initialMode = searchParams.get('mode') || 'emi';
    const [activeTab, setActiveTab] = useState(initialMode);
    const [showLoanModal, setShowLoanModal] = useState(false);

    // --- EMI CALCULATOR STATE ---
    const [emiLoan, setEmiLoan] = useState(5000000);
    const [emiTenure, setEmiTenure] = useState(20);
    const [emiRate, setEmiRate] = useState(8.5);
    const [emiData, setEmiData] = useState({ monthly: 0, totalInt: 0, totalPay: 0 });

    // --- ELIGIBILITY CALCULATOR STATE ---
    const [eligSource, setEligSource] = useState('salaried'); // 'salaried' | 'business'
    const [eligIncome, setEligIncome] = useState(50000); // Monthly if Salaried, Annual if Business
    const [eligRate] = useState(7.1); // Fixed
    const [eligTenureMonths, setEligTenureMonths] = useState(240); // Months (1-360)
    const [existingEmi, setExistingEmi] = useState(0);
    const [eligAmount, setEligAmount] = useState(0);

    // Eligibility Document Checks
    const [bizItrFiled, setBizItrFiled] = useState(true); // Business: Annual ITR
    const [salItrFiled, setSalItrFiled] = useState(true); // Salaried: ITR
    const [salForm16, setSalForm16] = useState(false);    // Salaried: Form 16

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

    // 2. Eligibility Calculation
    useEffect(() => {
        const calculateEligibility = () => {
            // Document Check
            let isEligible = false;
            // Salaried: Either ITR OR Form 16 required
            if (eligSource === 'salaried') {
                isEligible = salItrFiled || salForm16;
            }
            // Business: ITR is required
            else {
                isEligible = bizItrFiled;
            }

            if (!isEligible) {
                setEligAmount(0);
                return;
            }

            let monthlyIncome = eligIncome;
            if (eligSource === 'business') {
                monthlyIncome = eligIncome / 12; // Convert Annual to Monthly
            }

            // Assumed FOIR 60%
            const netAvailableIncome = (monthlyIncome * 0.60) - existingEmi;

            if (netAvailableIncome <= 0) {
                setEligAmount(0);
                return;
            }

            const R = eligRate / 12 / 100;
            const N = eligTenureMonths;

            const maxLoan = netAvailableIncome * (Math.pow(1 + R, N) - 1) / (R * Math.pow(1 + R, N));
            setEligAmount(Math.round(maxLoan));
        };
        calculateEligibility();
    }, [eligSource, eligIncome, eligRate, eligTenureMonths, existingEmi, bizItrFiled, salItrFiled, salForm16]);

    // 3. Affordability Calculation
    useEffect(() => {
        const calculateAffordability = () => {
            const R = affordRate / 12 / 100;
            const N = affordTenure * 12;

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

    // UI Colors
    const RICH_GREEN = '#00e676';
    const GOLD = 'var(--accent)';

    return (
        <div className="admin-page" style={{ padding: '40px 0', minHeight: '100vh', background: '#050505' }}>
            <LoanModal isOpen={showLoanModal} onClose={() => setShowLoanModal(false)} />

            <div className="admin-container">

                {/* Header */}
                <div className="admin-header" style={{ marginBottom: '30px' }}>
                    <div className="header-left">
                        <Link to="/" className="back-link">
                            <ArrowLeft size={18} /> Back to Site
                        </Link>
                        <h1 style={{ color: 'white' }}>Financial Planning Tools</h1>
                        <p style={{ color: '#aaa' }}>Calculate EMI, check eligibility, and estimate affordability.</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="calc-tabs">
                    {['emi', 'eligibility', 'affordability'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            style={{
                                padding: '10px 20px',
                                background: activeTab === tab ? 'var(--accent)' : 'transparent',
                                color: activeTab === tab ? 'black' : 'var(--text-muted)',
                                border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer',
                                textTransform: 'capitalize'
                            }}
                        >
                            {tab} Calculator
                        </button>
                    ))}
                </div>


                <div className="layout-grid-premium" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '40px', marginTop: '30px' }}>

                    {/* INPUT SECTION - Fixed Background to Dark */}
                    <div className="sidebar-card" style={{ height: 'fit-content', background: '#0a0a0a', border: '1px solid #333', borderRadius: '12px', padding: '25px' }}>
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
                                    {/* Income Source Toggle */}
                                    <div className="input-group-home">
                                        <label style={{ color: 'var(--accent)', fontWeight: '700', fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>INCOME SOURCE</label>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                onClick={() => setEligSource('salaried')}
                                                style={{
                                                    flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid var(--accent)',
                                                    background: eligSource === 'salaried' ? 'var(--accent)' : 'transparent',
                                                    color: eligSource === 'salaried' ? 'black' : 'var(--accent)',
                                                    cursor: 'pointer', fontWeight: 'bold',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                Salaried
                                            </button>
                                            <button
                                                onClick={() => setEligSource('business')}
                                                style={{
                                                    flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid var(--accent)',
                                                    background: eligSource === 'business' ? 'var(--accent)' : 'transparent',
                                                    color: eligSource === 'business' ? 'black' : 'var(--accent)',
                                                    cursor: 'pointer', fontWeight: 'bold',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                Business
                                            </button>
                                        </div>
                                    </div>

                                    <InputGroup
                                        label={eligSource === 'business' ? "Select Your Annual Income (₹)" : "Select Your Monthly Salary (₹)"}
                                        val={eligIncome} setVal={setEligIncome}
                                        min={20000} max={20000000} step={5000}
                                    />

                                    <div className="input-group-home">
                                        <label style={{ color: 'var(--accent)', fontWeight: '700', fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Interest Rate (%)</label>
                                        <div style={{ background: '#1a2420', padding: '12px', borderRadius: '6px', color: '#fff', border: '1px solid #333' }}>
                                            7.1% (Fixed Standard)
                                        </div>
                                    </div>

                                    <InputGroup label="Loan Tenure (Months)" val={eligTenureMonths} setVal={setEligTenureMonths} min={1} max={360} step={1} suffix=" Months" />

                                    <InputGroup label="On-going EMIs (₹)" val={existingEmi} setVal={setExistingEmi} min={0} max={500000} step={1000} />

                                    {/* Document Checklist */}
                                    <div className="input-group-home" style={{ marginTop: '10px', paddingTop: '15px', borderTop: '1px solid #333' }}>
                                        {eligSource === 'business' ? (
                                            <>
                                                <label style={{ color: 'white', fontWeight: '600', fontSize: '0.9rem', marginBottom: '10px', display: 'block' }}>
                                                    HAVE YOU FILED YOUR LAST THREE ITRs?
                                                </label>
                                                <div style={{ display: 'flex', gap: '20px' }}>
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', cursor: 'pointer' }}>
                                                        <input
                                                            type="radio"
                                                            checked={bizItrFiled === true}
                                                            onChange={() => setBizItrFiled(true)}
                                                            name="bizItr"
                                                            style={{ accentColor: 'var(--accent)', width: '18px', height: '18px' }}
                                                        /> Yes
                                                    </label>
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', cursor: 'pointer' }}>
                                                        <input
                                                            type="radio"
                                                            checked={bizItrFiled === false}
                                                            onChange={() => setBizItrFiled(false)}
                                                            name="bizItr"
                                                            style={{ accentColor: 'var(--accent)', width: '18px', height: '18px' }}
                                                        /> No
                                                    </label>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <label style={{ color: 'white', fontWeight: '600', fontSize: '0.9rem', marginBottom: '10px', display: 'block' }}>
                                                    HAVE YOU FILED (Select Available):
                                                </label>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', cursor: 'pointer' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={salItrFiled}
                                                            onChange={(e) => setSalItrFiled(e.target.checked)}
                                                            style={{ accentColor: 'var(--accent)', width: '18px', height: '18px' }}
                                                        />
                                                        Last 3 Years ITRs
                                                    </label>
                                                    <div style={{ color: '#888', fontSize: '0.8rem', marginLeft: '28px' }}>- OR -</div>
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', cursor: 'pointer' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={salForm16}
                                                            onChange={(e) => setSalForm16(e.target.checked)}
                                                            style={{ accentColor: 'var(--accent)', width: '18px', height: '18px' }}
                                                        />
                                                        Form-16 Available
                                                    </label>
                                                </div>
                                            </>
                                        )}
                                    </div>
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
                    <div className="sidebar-cardResult" style={{ background: 'linear-gradient(135deg, #121A16, #070B09)', border: '1px solid var(--accent)', borderRadius: '12px', padding: '25px', display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ color: 'var(--white)', display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
                            <Activity size={20} /> Result
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', flex: 1 }}>

                            {/* EMI RESULT */}
                            {activeTab === 'emi' && (
                                <>
                                    <ResultBox title="Monthly EMI" value={formatCurrency(emiData.monthly)} huge color={RICH_GREEN} />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <ResultBox title="Total Interest" value={formatCurrency(emiData.totalInt)} />
                                        <ResultBox title="Total Payment" value={formatCurrency(emiData.totalPay)} />
                                    </div>
                                </>
                            )}

                            {/* ELIGIBILITY RESULT */}
                            {activeTab === 'eligibility' && (
                                <>
                                    <ResultBox title="Maximum Eligible Loan" value={formatCurrency(eligAmount)} huge color={RICH_GREEN} />

                                    {/* NEW: Approx Property Value (Loan / 0.90) */}
                                    {eligAmount > 0 && (
                                        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center' }}>
                                            <div style={{ color: '#888', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Approx. Eligible Property Cost</div>
                                            <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>{formatCurrency(Math.round(eligAmount / 0.90))}</div>
                                            <div style={{ color: RICH_GREEN, fontSize: '0.8rem', marginTop: '5px' }}>Assuming 90% Loan Coverage</div>
                                        </div>
                                    )}

                                    {(eligAmount === 0 && ((eligSource === 'business' && !bizItrFiled) || (eligSource === 'salaried' && !salItrFiled && !salForm16))) && (
                                        <div style={{ padding: '20px', background: 'rgba(255,0,0,0.1)', borderRadius: '12px', fontSize: '0.9rem', color: '#ff6666', border: '1px solid #ff4444' }}>
                                            <strong>Not Eligible:</strong> Valid documentation (ITR or Form-16) is required.
                                        </div>
                                    )}
                                </>
                            )}

                            {/* AFFORDABILITY RESULT */}
                            {activeTab === 'affordability' && (
                                <>
                                    <ResultBox title="Affordable Loan Amount" value={formatCurrency(affordLoan)} huge color={RICH_GREEN} />

                                    {/* Property Value for Affordability too */}
                                    {affordLoan > 0 && (
                                        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center' }}>
                                            <div style={{ color: '#888', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>You Can Purchase Property Worth</div>
                                            <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>{formatCurrency(Math.round(affordLoan / 0.90))}</div>
                                        </div>
                                    )}

                                    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', color: '#ccc' }}>
                                        If possible monthly EMI is <strong>{formatCurrency(affordEmi)}</strong>.
                                    </div>
                                </>
                            )}

                            <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                                <button
                                    className="big-search-btn"
                                    onClick={() => setShowLoanModal(true)}
                                    style={{
                                        width: '100%',
                                        padding: '15px',
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                        background: 'var(--accent)',
                                        color: 'black',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Contact Agent for Loan
                                </button>
                                <p style={{ textAlign: 'center', color: '#666', fontSize: '0.8rem', marginTop: '10px' }}>
                                    Get personalized rates and quick approval
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-components
const InputGroup = ({ label, val, setVal, min, max, step, suffix }) => {
    const isCurrency = !suffix;

    const handleChange = (e) => {
        const raw = e.target.value.replace(/,/g, '');
        if (raw === '') {
            setVal(0);
            return;
        }
        if (!isNaN(raw)) {
            setVal(Number(raw));
        }
    };

    const displayValue = isCurrency ? val.toLocaleString('en-IN') : val;
    const displayMin = isCurrency ? min.toLocaleString('en-IN') : min;

    return (
        <div className="input-group-home">
            <label style={{ color: 'var(--accent)', fontWeight: '700', fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>{label}</label>
            <input
                type="range" min={min} max={max} step={step}
                value={val} onChange={(e) => setVal(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <span style={{ color: '#666', fontSize: '0.8rem' }}>{displayMin}{suffix}</span>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#1a2420',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    minWidth: '140px'
                }}>
                    {isCurrency && <span style={{ color: '#888', marginRight: '5px' }}>₹</span>}
                    <input
                        type="text"
                        value={displayValue}
                        onChange={handleChange}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            width: '100%',
                            textAlign: 'right',
                            outline: 'none',
                            fontSize: '0.95rem'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

// UPDATED RESULT BOX with Color Support
const ResultBox = ({ title, value, huge, color }) => (
    <div style={{
        textAlign: 'center',
        padding: huge ? '30px' : '20px',
        background: huge ? (color ? `${color}10` : 'rgba(212, 175, 55, 0.05)') : 'rgba(255,255,255,0.02)',
        borderRadius: '16px',
        border: huge ? `1px solid ${color || 'var(--accent)'}` : '1px solid rgba(255,255,255,0.05)',
        boxShadow: huge ? `0 0 20px ${color ? color + '20' : 'rgba(212, 175, 55, 0.1)'}` : 'none',
        transition: 'all 0.3s ease'
    }}>
        <span style={{ display: 'block', color: '#888', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px' }}>{title}</span>
        <span style={{ fontSize: huge ? '2.8rem' : '1.4rem', fontWeight: '800', color: color || 'white', textShadow: huge && color ? `0 0 15px ${color}40` : 'none' }}>{value}</span>
    </div>
);

export default EmiCalculator;
