import React, { useState, useEffect } from 'react';
import './MembersList.css';

const MembersList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/members', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch members');
      
      const data = await response.json();
      setMembers(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleViewMember = (member) => {
    setSelectedMember(member);
  };

  const closeModal = () => {
    setSelectedMember(null);
  };

  if (loading) return <main className="members-loading">Loading members...</main>;
  if (error) return <main className="members-error">Error: {error}</main>;

  return (
    <article className="members-container">
      <header className="members-header">
        <h1>Stokvel Members</h1>
        <p className="member-count">Total Members: {members.length}</p>
      </header>

      {members.length === 0 ? (
        <section className="no-members">
          <p>No members found in the stokvel.</p>
        </section>
      ) : (
        <section className="members-grid">
          {members.map((member) => (
            <article key={member._id} className="member-card">
              <header className="member-card-header">
                <h3>{member.name}</h3>
                <span className={`role-badge role-${member.role}`}>
                  {member.role}
                </span>
              </header>
              <section className="member-card-body">
                <dl>
                  <div className="member-detail">
                    <dt>Email:</dt>
                    <dd>{member.email}</dd>
                  </div>
                  <div className="member-detail">
                    <dt>Phone:</dt>
                    <dd>{member.phone || 'Not provided'}</dd>
                  </div>
                  <div className="member-detail">
                    <dt>Joined:</dt>
                    <dd>{new Date(member.createdAt).toLocaleDateString()}</dd>
                  </div>
                </dl>
              </section>
              <footer className="member-card-footer">
                <button 
                  onClick={() => handleViewMember(member)}
                  className="view-member-btn"
                >
                  View Details
                </button>
              </footer>
            </article>
          ))}
        </section>
      )}

      {selectedMember && (
        <dialog open className="member-modal" onClose={closeModal}>
          <article className="modal-content">
            <header className="modal-header">
              <h2>Member Details</h2>
              <button onClick={closeModal} className="close-modal">&times;</button>
            </header>
            <section className="modal-body">
              <dl className="member-info-detailed">
                <div className="info-row">
                  <dt>Full Name:</dt>
                  <dd>{selectedMember.name}</dd>
                </div>
                <div className="info-row">
                  <dt>Email Address:</dt>
                  <dd>{selectedMember.email}</dd>
                </div>
                <div className="info-row">
                  <dt>Phone Number:</dt>
                  <dd>{selectedMember.phone || 'Not provided'}</dd>
                </div>
                <div className="info-row">
                  <dt>Role:</dt>
                  <dd className={`role-badge role-${selectedMember.role}`}>
                    {selectedMember.role}
                  </dd>
                </div>
                <div className="info-row">
                  <dt>Member Since:</dt>
                  <dd>{new Date(selectedMember.createdAt).toLocaleDateString()}</dd>
                </div>
              </dl>
            </section>
            <footer className="modal-footer">
              <button onClick={closeModal} className="close-btn">Close</button>
            </footer>
          </article>
        </dialog>
      )}
    </article>
  );
};

export default MembersList;