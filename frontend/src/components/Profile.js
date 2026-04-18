import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = ({ user, onLogout, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'Member'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.user) {
        setProfileData(prev => ({ ...prev, ...data.user }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleInputChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: profileData.name })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
        if (onUpdate) onUpdate(profileData);
      } else {
        setMessage({ type: 'error', text: data.message || 'Update failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const getRoleAriaLabel = () => {
    switch(profileData.role) {
      case 'Admin': return 'Administrator role';
      case 'Treasurer': return 'Treasurer role';
      default: return 'Member role';
    }
  };

  return (
    <main className="profile-container">
      <article className="profile-card">
        <header className="profile-cover">
          <figure className="profile-avatar">
            <figcaption>Profile avatar showing first letter of name</figcaption>
            <output className="avatar-large" htmlFor="profile-name" aria-label="Profile initial">
              {profileData.name?.charAt(0) || 'U'}
            </output>
          </figure>
        </header>

        <section className="profile-info">
          <header className="profile-header-actions">
            <hgroup>
              <h1 id="profile-name">{profileData.name}</h1>
              <p aria-label={getRoleAriaLabel()}>
                <output className={`profile-role role-${profileData.role?.toLowerCase() || 'member'}`}>
                  {profileData.role}
                </output>
              </p>
            </hgroup>
            <nav aria-label="Profile actions">
              <menu className="profile-actions">
                {!isEditing ? (
                  <>
                    <li><button className="btn-edit" onClick={() => setIsEditing(true)}>Edit Profile</button></li>
                    <li><button className="btn-logout" onClick={onLogout}>Logout</button></li>
                  </>
                ) : (
                  <>
                    <li><button className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button></li>
                  </>
                )}
              </menu>
            </nav>
          </header>

          {message.text && (
            <aside className={`message ${message.type}`} role="alert" aria-live="polite">
              {message.text}
            </aside>
          )}

          {!isEditing ? (
            <section className="profile-details">
              <section className="detail-section" aria-labelledby="account-info-heading">
                <h2 id="account-info-heading">Account Information</h2>
                <dl>
                  <dt>Full Name</dt>
                  <dd>{profileData.name}</dd>
                  
                  <dt>Email Address</dt>
                  <dd>{profileData.email}</dd>
                  
                  <dt>Role</dt>
                  <dd>{profileData.role}</dd>
                </dl>
              </section>

              <section className="detail-section" aria-labelledby="stokvel-info-heading">
                <h2 id="stokvel-info-heading">Stokvel Information</h2>
                <dl>
                  <dt>Member Since</dt>
                  <dd><time dateTime={new Date().toISOString()}>{new Date().toLocaleDateString()}</time></dd>
                  
                  <dt>Account Status</dt>
                  <dd>Active</dd>
                </dl>
              </section>
            </section>
          ) : (
            <form onSubmit={handleSubmit} className="profile-edit-form" aria-label="Edit profile form">
              <fieldset>
                <legend>Edit Profile Information</legend>
                
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                />
                
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={profileData.email}
                  disabled
                  aria-disabled="true"
                  className="disabled-input"
                />
                <small id="email-help">Email address cannot be changed</small>
                
                <button type="submit" className="btn-save" disabled={loading} aria-busy={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </fieldset>
            </form>
          )}
        </section>
      </article>
    </main>
  );
};

export default Profile;