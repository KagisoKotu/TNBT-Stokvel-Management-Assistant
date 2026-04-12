import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSuccess = (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      const clientDetails = jwtDecode(credentialResponse.credential);
      const email = clientDetails.email;
      const name = clientDetails.given_name;       // correct JWT claim
      const surname = clientDetails.family_name;   // correct JWT claim
      const fullName = clientDetails.name;
      const picture = clientDetails.picture;

      // Store user info (use context/redux in a real app)
      sessionStorage.setItem('user', JSON.stringify({ email, name, surname, fullName, picture }));

      navigate('/home', { replace: true });
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleError = () => {
    setError('Google sign-in failed. Please try again.');
  };

  return (
    <main style={styles.page}>
      {/* Background geometric shapes — decorative only, hidden from screen readers */}
      <span aria-hidden="true" style={styles.bgCircle1} />
      <span aria-hidden="true" style={styles.bgCircle2} />
      <span aria-hidden="true" style={styles.bgStripe} />

      {/* Login card */}
      <article style={styles.card}>

        {/* Branding */}
        <header style={styles.logoRow}>
          <figure style={styles.logoMark}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <circle cx="16" cy="16" r="16" fill="#F5C842" />
              <path d="M10 20 L16 10 L22 20" stroke="#1A3A6B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="16" cy="22" r="2" fill="#1A3A6B"/>
            </svg>
          </figure>
          <span style={styles.logoText}>StokvelStokkie</span>
        </header>

        {/* Headline */}
        <h1 style={styles.headline}>Welcome back</h1>
        <p style={styles.sub}>Sign in to manage your stokvel contributions, payouts, and group savings.</p>

        {/* Thematic break */}
        <hr style={styles.divider} />

        {/* Sign-in section */}
        <section style={styles.googleWrapper} aria-label="Sign in options">
          {loading ? (
            <p style={styles.loadingPill} role="status" aria-live="polite">
              <span style={styles.spinner} aria-hidden="true" />
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

        {/* Error message */}
        {error && (
          <p style={styles.errorText} role="alert" aria-live="assertive">
            {error}
          </p>
        )}

        {/* Fine print */}
        <p style={styles.finePrint}>
          By signing in, you agree to StokvelStokkie's{' '}
          <a href="/terms" style={styles.link}>Terms of Service</a> and{' '}
          <a href="/privacy" style={styles.link}>Privacy Policy</a>.
        </p>

        {/* Trust badge — footer of the card */}
        <footer style={styles.badge}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginRight: 6 }} aria-hidden="true">
            <path d="M7 1L8.8 5H13L9.5 7.6L10.9 12L7 9.4L3.1 12L4.5 7.6L1 5H5.2L7 1Z" fill="#F5C842"/>
          </svg>
          Trusted by 200+ stokvel groups across South Africa
        </footer>

      </article>

      {/* Complementary branding panel */}
      <aside style={styles.illustrationPanel} aria-label="About StokvelStokkie">
        <section style={styles.illustrationContent}>
          <h2 style={styles.illusHeadline}>Pool funds.<br />Build futures.</h2>
          <p style={styles.illusSub}>
            StokvelStokkie digitises your rotating savings club — track contributions, schedule payouts, and grow together.
          </p>
          <ul style={styles.statsRow} aria-label="Platform statistics">
            {[
              { value: 'R0+', label: 'Managed monthly' },
              { value: '6+', label: 'Active members' },
              { value: '2%', label: 'Payout accuracy' },
            ].map((s) => (
              <li key={s.label} style={styles.statBox}>
                <strong style={styles.statValue}>{s.value}</strong>
                <span style={styles.statLabel}>{s.label}</span>
              </li>
            ))}
          </ul>
        </section>
      </aside>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        ul { list-style: none; }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
};



const BLUE      = '#1A3A6B';
const BLUE_MID  = '#2563C8';
const BLUE_LIGHT = '#EBF2FF';
const YELLOW    = '#F5C842';
const WHITE     = '#FFFFFF';

const styles = {
  page: {
    fontFamily: "'DM Sans', sans-serif",
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'stretch',
    background: BLUE_LIGHT,
    position: 'relative',
    overflow: 'hidden',
  },

  /* background decoration */
  bgCircle1: {
    position: 'absolute', top: -120, left: -120,
    width: 380, height: 380,
    borderRadius: '50%',
    background: 'rgba(37,99,200,0.08)',
    pointerEvents: 'none',
  },
  bgCircle2: {
    position: 'absolute', bottom: -80, right: '45%',
    width: 260, height: 260,
    borderRadius: '50%',
    background: 'rgba(245,200,66,0.12)',
    pointerEvents: 'none',
  },
  bgStripe: {
    position: 'absolute', top: 0, bottom: 0, right: 0,
    width: '48%',
    background: BLUE,
    clipPath: 'polygon(6% 0, 100% 0, 100% 100%, 0% 100%)',
    pointerEvents: 'none',
  },

  /* Login card */
  card: {
    position: 'relative',
    zIndex: 2,
    background: WHITE,
    width: '100%',
    maxWidth: 440,
    margin: 'auto',
    padding: '48px 44px 40px',
    borderRadius: 20,
    boxShadow: '0 24px 64px rgba(26,58,107,0.14)',
    animation: 'fadeUp 0.55s cubic-bezier(.22,1,.36,1) both',
    alignSelf: 'center',
    marginLeft: '6vw',
  },

  logoRow: {
    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32,
  },
  logoMark: { lineHeight: 0 },
  logoText: {
    fontFamily: "'Sora', sans-serif",
    fontWeight: 700,
    fontSize: 20,
    color: BLUE,
    letterSpacing: '-0.3px',
  },

  headline: {
    fontFamily: "'Sora', sans-serif",
    fontWeight: 700,
    fontSize: 30,
    color: BLUE,
    marginBottom: 10,
    lineHeight: 1.15,
  },
  sub: {
    fontSize: 14.5,
    color: '#4B6080',
    lineHeight: 1.6,
    marginBottom: 28,
  },

  divider: {
    height: 1,
    background: '#E2ECF8',
    marginBottom: 28,
  },

  googleWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 20,
  },

  loadingPill: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '12px 24px',
    borderRadius: 8,
    border: `1px solid #D0DEF5`,
    color: BLUE_MID,
    fontSize: 14,
    fontWeight: 500,
  },
  spinner: {
    display: 'inline-block',
    width: 16, height: 16,
    border: `2px solid ${BLUE_LIGHT}`,
    borderTop: `2px solid ${BLUE_MID}`,
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },

  errorText: {
    textAlign: 'center',
    color: '#C0392B',
    fontSize: 13,
    marginBottom: 12,
    background: '#FEF0EE',
    borderRadius: 6,
    padding: '8px 12px',
  },

  finePrint: {
    fontSize: 12,
    color: '#7A93B0',
    textAlign: 'center',
    lineHeight: 1.6,
    marginTop: 8,
    marginBottom: 24,
  },
  link: {
    color: BLUE_MID,
    textDecoration: 'none',
    fontWeight: 500,
  },

  badge: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12,
    color: '#4B6080',
    background: '#F7FAFF',
    border: '1px solid #D8E8FF',
    borderRadius: 30,
    padding: '8px 16px',
  },

  /* Illustration panel */
  illustrationPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 2,
    padding: '60px 60px 60px 80px',
  },
  illustrationContent: {
    maxWidth: 380,
  },
  illusHeadline: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 42,
    fontWeight: 700,
    color: WHITE,
    lineHeight: 1.15,
    marginBottom: 20,
  },
  illusSub: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.72)',
    lineHeight: 1.7,
    marginBottom: 48,
  },
  statsRow: {
    display: 'flex', gap: 20,
  },
  statBox: {
    display: 'flex', flexDirection: 'column', gap: 4,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: '16px 18px',
    flex: 1,
  },
  statValue: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 20,
    fontWeight: 700,
    color: YELLOW,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 1.4,
  },
};