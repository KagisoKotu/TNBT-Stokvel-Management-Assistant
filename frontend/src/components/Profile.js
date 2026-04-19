import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch profile');
      
      const data = await response.json();
      setUser(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        role: data.role || 'member'
      });
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Failed to update profile');
      
      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <main className="profile-loading">Loading profile...</main>;
  if (error) return <main className="profile-error">Error: {error}</main>;

  return (
    <article className="profile-container">
      <header className="profile-header">
        <h1>My Profile</h1>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)} 
            className="edit-profile-btn"
            aria-label="Edit profile"
          >
            Edit Profile
          </button>
        )}
      </header>

      {!isEditing ? (
        <section className="profile-display">
          <section className="profile-info">
            <h2>Personal Information</h2>
            <dl className="info-list">
              <div className="info-group">
                <dt>Name:</dt>
                <dd>{user.name}</dd>
              </div>
              <div className="info-group">
                <dt>Email:</dt>
                <dd>{user.email}</dd>
              </div>
              <div className="info-group">
                <dt>Phone:</dt>
                <dd>{user.phone || 'Not provided'}</dd>
              </div>
              <div className="info-group">
                <dt>Role:</dt>
                <dd className={`role-badge role-${user.role}`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </dd>
              </div>
            </dl>
          </section>
        </section>
      ) : (
        <form onSubmit={handleSubmit} className="profile-form">
          <section className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </section>

          <section className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </section>

          <section className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </section>

          <section className="form-actions">
            <button type="submit" className="save-btn">Save Changes</button>
            <button 
              type="button" 
              onClick={() => setIsEditing(false)} 
              className="cancel-btn"
            >
              Cancel
            </button>
          </section>
        </form>
      )}
    </article>
  );
};

export default Profile;