import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    
    try {
      // 1. Extract details for the Frontend (UI)
      const clientDetails = jwtDecode(credentialResponse.credential);
      
      // --- NEW SMART URL LOGIC ---
      // This automatically swaps between your live Render URL on Vercel and localhost on your laptop.
      const apiUrl = process.env.REACT_APP_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      // 2. The Handshake: Send to Backend
      const response = await fetch(`${apiUrl}/auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token: credentialResponse.credential 
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // 3. Store the Backend Session (JWT)
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        
        // 4. Store user info for the UI (Name, Picture, etc.)
        sessionStorage.setItem('user', JSON.stringify({
          email: clientDetails.email,
          name: clientDetails.given_name,
          fullName: clientDetails.name,
          picture: clientDetails.picture
        }));

        navigate('/home', { replace: true });
      } else {
        throw new Error(data.message || 'Server rejected login');
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError('Connection to server failed. Please try again.');
      setLoading(false);
    }
  };

  const handleError = () => {
    setError('Google sign-in failed. Please try again.');
  };

  return (
    <main className="login-page">
      {/* background geometric shapes (just for decoration, hidden from screen readers)- thanks to Lucky we know about abstraction lol */}
      <span aria-hidden="true" className="login-bg-circle1" />
      <span aria-hidden="true" className="login-bg-circle2" />
      <span aria-hidden="true" className="login-bg-stripe" />

      {/* Login card */}
      <article className="login-card">

        {/* Branding */}
        <header className="login-logo-row">
          <figure className="login-logo-mark">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <circle cx="16" cy="16" r="16" fill="#F5C842" />
              <path d="M10 20 L16 10 L22 20" stroke="#1A3A6B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="16" cy="22" r="2" fill="#1A3A6B"/>
            </svg>
          </figure>
          <span className="login-logo-text">StokvèlHub</span>
        </header>

        {/* Headline */}
        <h1 className="login-headline">Welcome back</h1>
        <p className="login-sub">Sign in to manage your stokvel contributions, payouts, and group savings.</p>

        {/* Thematic break */}
        <hr className="login-divider" />

        {/* Sign-in section */}
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

        {/* error message- something went wrong chief :( */}
        {error && (
          <p className="login-error" role="alert" aria-live="assertive">
            {error}
          </p>
        )}

        {/* fine print - T's & C's for our Stokkie user :) */}
        <p className="login-fine-print">
          By signing in, you agree to StokvèlHub's{' '}
          <a href="/terms">Terms of Service</a> and{' '}
          <a href="/privacy">Privacy Policy</a>.
        </p>

        {/* footer of the card - c'mon bro you know us and trust us :) */}
        <footer className="login-badge">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1L8.8 5H13L9.5 7.6L10.9 12L7 9.4L3.1 12L4.5 7.6L1 5H5.2L7 1Z" fill="#F5C842"/>
          </svg>
          Trusted by 200+ stokvel groups across South Africa
        </footer>

      </article>

      {/* Complementary branding panel */}
      <aside className="login-aside" aria-label="About StokvèlHub">
        <section className="login-aside-content">
          <h2 className="login-aside-headline">Pool funds.<br />Build futures.</h2>
          <p className="login-aside-sub">
            StokvèlHub digitises your rotating savings club — track contributions, schedule payouts, and grow together.
          </p>
          <ul className="login-stats-list" aria-label="Platform statistics">
            {[
              { value: 'R0+', label: 'Managed monthly' },
              { value: '6+', label: 'Active members' },
              { value: '0.1 %', label: 'Payout accuracy' },
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