import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { logIn, signInWithOAuth } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError('');
            setLoading(true);
            const { error: authError } = await logIn(emailRef.current.value, passwordRef.current.value);
            if (authError) throw authError;
            navigate('/');
        } catch (err) {
            setError('Failed to log in: ' + err.message);
        }
        setLoading(false);
    }

    async function handleSocialLogin(provider) {
        try {
            setError('');
            setLoading(true);
            const { error } = await signInWithOAuth(provider);
            if (error) throw error;
        } catch (err) {
            setError('Failed to log in with ' + provider + ': ' + err.message);
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Welcome Back</h2>
                    <p>Log in to access your saved properties</p>
                </div>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" ref={emailRef} required className="form-input" placeholder="Enter your email" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" ref={passwordRef} required className="form-input" placeholder="Enter your password" />
                    </div>
                    <button disabled={loading} className="auth-btn" type="submit">
                        {loading ? 'Logging In...' : 'Log In'}
                    </button>
                </form>

                <div className="auth-divider">
                    <span>Or Continue With</span>
                </div>

                <div className="social-login">
                    <button type="button" onClick={() => handleSocialLogin('google')} className="social-btn google-btn">
                        <img src="https://www.google.com/favicon.ico" alt="Google" width="20" />
                        Continue with Google
                    </button>
                    {/* Facebook login requires stricter setup, hiding until configured */}
                    <button type="button" onClick={() => handleSocialLogin('facebook')} className="social-btn facebook-btn">
                        Continue with Facebook
                    </button>
                </div>

                <div className="auth-footer">
                    Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
