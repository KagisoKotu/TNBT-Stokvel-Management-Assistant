import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router';
import axios from 'axios';
import './Login.css';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State to hold the manual email/password typing
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ==========================================
  // DOOR 1: THE MANUAL LOGIN DOOR
  // ==========================================
  const handleManualLogin = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.REACT_APP_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const userData = { email, password };

      // Send to the Standard Login Endpoint
      const response = await axios.post(`${apiUrl}/auth/login`, userData);

      if (response.status === 200) {
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/home', { replace: true });
      }
    } catch (err) {
      console.error("Manual Login Error:", err);
      const serverMessage = err.response?.data?.error || err.message;
      setError(`Login failed: ${serverMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DOOR 2: THE GOOGLE LOGIN DOOR
  // ==========================================
  const handleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');

    try {
      // 1. Decode the token on the frontend (Your teammate's correct logic!)
      const clientDetails = jwtDecode(credentialResponse.credential);
      
      // 2. Package it exactly how AuthRoutes.js asked for it
      const userData = {
        email: clientDetails.email,
        name: clientDetails.given_name,
        surname: clientDetails.family_name || ""
      };
      
      const apiUrl = process.env.REACT_APP_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      // 3. Send to the /auth/google endpoint
      const googleResponse = await axios.post(`${apiUrl}/auth/google`, userData);

      if (googleResponse.status === 200) {
        sessionStorage.setItem('user', JSON.stringify(googleResponse.data.user));
        navigate('/home', { replace: true });
      }
    } catch (err) {
      console.error("Login Error:", err);
      const serverMessage = err.response?.data?.error || err.message;
      setError(`Login failed: ${serverMessage}. Ensure your backend and MongoDB are running.`);
    } finally {
      setLoading(false); 
    }
  };

  const handleError = () => {
    setError('Google sign-in failed. Please try again.');
  };

  return (
    <main className="login-page">
      <span aria-hidden="true" className="login-bg-circle1" />
      <span aria-hidden="true" className="login-bg-circle2" />
      <span aria-hidden="true" className="login-bg-stripe" />

      <article className="login-card">
        <header className="login-logo-row">
          <figure className="login-logo-mark">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <circle cx="16" cy="16" r="16" fill="#F5C842" />
              <path d="M10 20 L16 10 L22 20" stroke="#1A3A6B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="16" cy="22" r="2" fill="#1A3A6B"/>
            </svg>
          </figure>
          <span className="login-logo-text">StokvelStokkie</span>
        </header>

        <h1 className="login-headline">Welcome back</h1>
        <p className="login-sub">Sign in to manage your stokvel contributions, payouts, and group savings.</p>

        <hr className="login-divider" />

        <form onSubmit={handleManualLogin}>
          <input 
            type="email" 
            placeholder="Email Address" 
            id="email_capture" 
            name="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            id="password_capture" 
            name="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button type="submit" id="sign_in_button" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="create-account-prompt">
          Don't have an account? <a href="/signup">Create one</a>.
        </p>

        <hr className="smaller-login-divider" />

        <section className="login-google-wrapper" aria-label="Sign in options">
          {loading ? (
            <p className="login-loading-pill" role="status" aria-live="polite">
              <span className="login-spinner" aria-hidden="true" />
              Signing you in…
            </p>
          ) : (
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              useOneTap
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
              logo_alignment="left"
              width="320"
            />
          )}
        </section>

        {error && (
          <p className="login-error" role="alert" aria-live="assertive">
            {error}
          </p>
        )}

        <p className="login-fine-print">
          By signing in, you agree to StokvelStokkie's{' '}
          <a href="/terms">Terms of Service</a> and{' '}
          <a href="/privacy">Privacy Policy</a>.
        </p>

        <footer className="login-badge">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1L8.8 5H13L9.5 7.6L10.9 12L7 9.4L3.1 12L4.5 7.6L1 5H5.2L7 1Z" fill="#F5C842"/>
          </svg>
          Trusted by 200+ stokvel groups across South Africa
        </footer>
      </article>

      <aside className="login-aside" aria-label="About StokvelStokkie">
        <section className="login-aside-content">
          <h2 className="login-aside-headline">Pool funds.<br />Build futures.</h2>
          <p className="login-aside-sub">
            StokvelStokkie digitises your rotating savings club — track contributions, schedule payouts, and grow together.
          </p>
          <ul className="login-stats-list" aria-label="Platform statistics">
            {[
              { value: 'R0+', label: 'Managed monthly' },
              { value: '6+', label: 'Active members' },
              { value: '2%', label: 'Payout accuracy' },
            ].map((s) => (
              <li key={s.label} className="login-stat-item">
                <strong className="login-stat-value">{s.value}</strong>
                <span className="login-stat-label">{s.label}</span>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </main>
  );
};
