import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const SignUp = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signUp, signInWithOAuth } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSocialLogin(provider) {
        try {
            setError('');
            setLoading(true);
            const { error } = await signInWithOAuth(provider);
            if (error) throw error;
        } catch (err) {
            setError('Failed to sign up with ' + provider + ': ' + err.message);
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match');
        }

        try {
            setError('');
            setLoading(true);
            const { data, error: authError } = await signUp(emailRef.current.value, passwordRef.current.value);
            if (authError) throw authError;

            // Check if session was created immediately (no email confirm) or pending
            if (data?.session) {
                navigate('/');
            } else {
                // Email confirmation required
                setError('Success! Please check your email to confirm your account before logging in to save properties.');
                // Clear form?
            }
        } catch (err) {
            setError('Failed to create account: ' + err.message);
        }
        setLoading(false);
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Create Account</h2>
                    <p>Sign up to save favorite properties and track history</p>
                </div>
                {error && <div className={`error-message ${error.startsWith('Success') ? 'success-message' : ''}`}>{error}</div>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" ref={emailRef} required className="form-input" placeholder="Enter your email" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" ref={passwordRef} required className="form-input" placeholder="Create a password" />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input type="password" ref={passwordConfirmRef} required className="form-input" placeholder="Confirm your password" />
                    </div>
                    <button disabled={loading} className="auth-btn" type="submit">
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="auth-divider">
                    <span>Or Sign Up With</span>
                </div>

                <div className="social-login">
                    <button type="button" onClick={() => handleSocialLogin('google')} className="social-btn google-btn">
                        <img src="https://www.google.com/favicon.ico" alt="Google" width="20" />
                        Sign up with Google
                    </button>
                    <button type="button" onClick={() => handleSocialLogin('facebook')} className="social-btn facebook-btn">
                        Sign up with Facebook
                    </button>
                </div>

                <div className="auth-footer">
                    Already have an account? <Link to="/login" className="auth-link">Log In</Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
